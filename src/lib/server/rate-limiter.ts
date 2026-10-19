/**
 * Production Rate Limiter Abstraction
 *
 * Architecture & Policy:
 * 1. Primary: Distributed Upstash Redis REST API (shared across serverless/edge instances).
 * 2. In Development/Test (NODE_ENV !== "production"): Safe, fast in-memory sliding window limiter.
 * 3. In Production (NODE_ENV === "production"):
 *    - If Redis is configured: Global rate limiting with atomic sorted-set pipeline.
 *    - If Redis is unconfigured or times out:
 *      * "fail_closed" policy: Rejects request with HTTP 503 to prevent unmetered floods.
 *      * "emergency_bounded" policy (default): Bounded per-instance limiter with curtailed quotas
 *        (emergencyLimit: 2 for contact, 5 for chat) and X-RateLimit-Degraded headers.
 *
 * All external requests are timeout-bounded (2000ms max) to prevent blocking execution.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Periodic cleanup of stale memory records to prevent memory growth
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      const valid = record.timestamps.filter((ts) => now - ts < 120_000);
      if (valid.length === 0) {
        rateLimitStore.delete(key);
      } else {
        record.timestamps = valid;
      }
    }
  }, 60_000).unref?.();
}

export type RateLimitFallbackPolicy = "fail_closed" | "emergency_bounded";

export interface RateLimitOptions {
  limit?: number;
  windowMs?: number;
  fallbackPolicy?: RateLimitFallbackPolicy;
  emergencyLimit?: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  store: "upstash_redis" | "memory_development" | "emergency_bounded" | "unconfigured";
  degraded?: boolean;
  error?: string;
}

/**
 * Sanitizes and safely resolves client IP address from proxy headers.
 */
export function getClientIp(headers: Headers): string {
  // 1. Vercel trusted header
  const vercelIp = headers.get("x-vercel-ip");
  if (vercelIp && isValidIp(vercelIp.trim())) {
    return vercelIp.trim();
  }

  // 2. Real-IP header from trusted reverse proxy
  const realIp = headers.get("x-real-ip");
  if (realIp && isValidIp(realIp.trim())) {
    return realIp.trim();
  }

  // 3. Forwarded-for list: take the first (client) address
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const clientCandidate = forwardedFor.split(",")[0]?.trim();
    if (clientCandidate && isValidIp(clientCandidate)) {
      return clientCandidate;
    }
  }

  return "127.0.0.1";
}

function isValidIp(ip: string): boolean {
  // IPv4 simple regex
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  // IPv6 basic hex/colon regex
  const ipv6Regex = /^[a-fA-F0-9:]+$/;

  return (ipv4Regex.test(ip) || ipv6Regex.test(ip)) && ip.length <= 45;
}

/**
 * Synchronous in-memory sliding window rate limiter
 */
export function checkMemoryRateLimit(
  identifier: string,
  limit = 20,
  windowMs = 60_000,
  storeType: "memory_development" | "emergency_bounded" = "memory_development"
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;

  const record = rateLimitStore.get(identifier) ?? { timestamps: [] };
  const recentTimestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (recentTimestamps.length >= limit) {
    const oldest = recentTimestamps[0];
    const reset = Math.ceil((oldest + windowMs - now) / 1000);
    return {
      success: false,
      limit,
      remaining: 0,
      reset: Math.max(reset, 1),
      store: storeType,
      degraded: storeType === "emergency_bounded",
    };
  }

  recentTimestamps.push(now);
  rateLimitStore.set(identifier, { timestamps: recentTimestamps });

  return {
    success: true,
    limit,
    remaining: limit - recentTimestamps.length,
    reset: Math.ceil(windowMs / 1000),
    store: storeType,
    degraded: storeType === "emergency_bounded",
  };
}

let hasLoggedProductionNotice = false;

/**
 * Primary rate limiting function.
 * Automatically queries Upstash Redis in production; applies deliberate fallback policy if absent.
 */
export async function checkRateLimit(
  identifier: string,
  limitOrOptions?: number | RateLimitOptions,
  optionalWindowMs?: number
): Promise<RateLimitResult> {
  const options: RateLimitOptions =
    typeof limitOrOptions === "object" && limitOrOptions !== null
      ? limitOrOptions
      : {
          limit: typeof limitOrOptions === "number" ? limitOrOptions : 20,
          windowMs: typeof optionalWindowMs === "number" ? optionalWindowMs : 60_000,
        };

  const limit = options.limit ?? 20;
  const windowMs = options.windowMs ?? 60_000;
  const fallbackPolicy: RateLimitFallbackPolicy =
    options.fallbackPolicy ??
    (process.env.RATE_LIMIT_STRICT === "true" ? "fail_closed" : "emergency_bounded");
  const emergencyLimit = options.emergencyLimit ?? Math.max(1, Math.floor(limit / 3));

  const isProduction = process.env.NODE_ENV === "production";
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  // 1. Production Mode with Redis configured
  if (redisUrl && redisToken && !redisUrl.includes("placeholder")) {
    try {
      const now = Date.now();
      const windowStart = now - windowMs;
      const windowSec = Math.ceil(windowMs / 1000);
      const uniqueMember = `${now}-${Math.random().toString(36).slice(2, 8)}`;
      const key = `ratelimit:${identifier}`;

      // Redis pipeline via REST:
      // 1. ZREMRANGEBYSCORE key 0 windowStart (prune old hits)
      // 2. ZADD key now member (add current hit)
      // 3. ZCARD key (count hits in current window)
      // 4. EXPIRE key windowSec (ensure key automatically expires)
      const pipelineCommands = [
        ["ZREMRANGEBYSCORE", key, 0, windowStart],
        ["ZADD", key, now, uniqueMember],
        ["ZCARD", key],
        ["EXPIRE", key, windowSec],
      ];

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s max timeout

      const response = await fetch(`${redisUrl}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${redisToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pipelineCommands),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const results = (await response.json()) as Array<{ result?: unknown; error?: string }>;
        const currentCount = typeof results[2]?.result === "number" ? results[2].result : 1;

        if (currentCount > limit) {
          return {
            success: false,
            limit,
            remaining: 0,
            reset: windowSec,
            store: "upstash_redis",
          };
        }

        return {
          success: true,
          limit,
          remaining: Math.max(0, limit - currentCount),
          reset: windowSec,
          store: "upstash_redis",
        };
      }
    } catch {
      // Redis network error / timeout fallthrough to policy check below
    }
  }

  // 2. Production fallback handling when Redis is unavailable or unconfigured
  if (isProduction) {
    if (!hasLoggedProductionNotice) {
      hasLoggedProductionNotice = true;
      console.warn(
        `[RateLimiter Policy] Production Redis unavailable. Executing policy: '${fallbackPolicy}'.`
      );
    }

    if (fallbackPolicy === "fail_closed") {
      return {
        success: false,
        limit: 0,
        remaining: 0,
        reset: Math.ceil(windowMs / 1000),
        store: "unconfigured",
        error: "Shared rate-limiting infrastructure is required in production.",
      };
    }

    // Emergency bounded fallback: strictly tightened quota prevents flood abuse
    return checkMemoryRateLimit(identifier, emergencyLimit, windowMs, "emergency_bounded");
  }

  // 3. Non-production / Local Development / Testing environment
  return checkMemoryRateLimit(identifier, limit, windowMs, "memory_development");
}
