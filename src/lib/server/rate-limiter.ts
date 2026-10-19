/**
 * In-memory sliding window rate limiter for development and single-instance deployments.
 * 
 * For distributed production environments, replace this store with an edge/Redis
 * solution such as @upstash/ratelimit.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale records periodically to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      const valid = record.timestamps.filter((ts) => now - ts < 60_000);
      if (valid.length === 0) {
        rateLimitStore.delete(key);
      } else {
        record.timestamps = valid;
      }
    }
  }, 60_000).unref?.();
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Checks if a client identifier is within rate limits.
 *
 * @param identifier Client IP or unique identifier
 * @param limit Maximum allowed requests in the time window
 * @param windowMs Time window in milliseconds (default: 60,000ms = 1 minute)
 */
export function checkRateLimit(
  identifier: string,
  limit = 20,
  windowMs = 60_000
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
    };
  }

  recentTimestamps.push(now);
  rateLimitStore.set(identifier, { timestamps: recentTimestamps });

  return {
    success: true,
    limit,
    remaining: limit - recentTimestamps.length,
    reset: Math.ceil(windowMs / 1000),
  };
}
