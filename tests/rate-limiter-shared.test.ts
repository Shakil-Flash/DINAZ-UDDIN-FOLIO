import test from "node:test";
import assert from "node:assert/strict";
import { getClientIp, checkRateLimit, checkMemoryRateLimit } from "../src/lib/server/rate-limiter";

test("Rate Limiter - Client IP Extraction from Headers", () => {
  // Test Vercel trusted IP
  const vercelHeaders = new Headers();
  vercelHeaders.set("x-vercel-ip", "203.0.113.195");
  vercelHeaders.set("x-forwarded-for", "198.51.100.1, 192.0.2.1");
  assert.strictEqual(getClientIp(vercelHeaders), "203.0.113.195");

  // Test Real-IP header
  const realIpHeaders = new Headers();
  realIpHeaders.set("x-real-ip", "198.51.100.42");
  assert.strictEqual(getClientIp(realIpHeaders), "198.51.100.42");

  // Test X-Forwarded-For first client
  const fwdHeaders = new Headers();
  fwdHeaders.set("x-forwarded-for", "198.51.100.88, 10.0.0.1");
  assert.strictEqual(getClientIp(fwdHeaders), "198.51.100.88");

  // Test invalid/spoofed IP fallback
  const spoofedHeaders = new Headers();
  spoofedHeaders.set("x-forwarded-for", "malicious_script_injection<script>");
  assert.strictEqual(getClientIp(spoofedHeaders), "127.0.0.1");

  // Test empty headers fallback
  const emptyHeaders = new Headers();
  assert.strictEqual(getClientIp(emptyHeaders), "127.0.0.1");
});

test("Rate Limiter - Synchronous Memory Window Limiter", () => {
  const testIp = `mem_test_${Date.now()}_${Math.random()}`;
  const limit = 4;
  const windowMs = 5000;

  for (let i = 0; i < limit; i++) {
    const res = checkMemoryRateLimit(testIp, limit, windowMs);
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.store, "memory_development");
    assert.strictEqual(res.remaining, limit - (i + 1));
  }

  const blocked = checkMemoryRateLimit(testIp, limit, windowMs);
  assert.strictEqual(blocked.success, false);
  assert.strictEqual(blocked.remaining, 0);
  assert.strictEqual(blocked.store, "memory_development");
});

test("Rate Limiter - Development Environment Default Behavior", async () => {
  const env = process.env as Record<string, string | undefined>;
  const originalEnv = env.NODE_ENV;
  env.NODE_ENV = "development";

  try {
    const testIp = `dev_test_${Date.now()}_${Math.random()}`;
    const res = await checkRateLimit(testIp, 5, 10000);

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.store, "memory_development");
  } finally {
    env.NODE_ENV = originalEnv;
  }
});

test("Rate Limiter - Production Fail-Closed Policy on Missing Redis", async () => {
  const env = process.env as Record<string, string | undefined>;
  const originalEnv = env.NODE_ENV;
  const originalUrl = process.env.UPSTASH_REDIS_REST_URL;
  const originalToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  env.NODE_ENV = "production";
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;

  try {
    const testIp = `prod_fail_closed_${Date.now()}`;
    const res = await checkRateLimit(testIp, {
      limit: 5,
      windowMs: 60000,
      fallbackPolicy: "fail_closed",
    });

    assert.strictEqual(res.success, false);
    assert.strictEqual(res.store, "unconfigured");
    assert.ok(res.error?.includes("required in production"));
  } finally {
    env.NODE_ENV = originalEnv;
    if (originalUrl) process.env.UPSTASH_REDIS_REST_URL = originalUrl;
    if (originalToken) process.env.UPSTASH_REDIS_REST_TOKEN = originalToken;
  }
});

test("Rate Limiter - Production Emergency-Bounded Policy on Missing Redis", async () => {
  const env = process.env as Record<string, string | undefined>;
  const originalEnv = env.NODE_ENV;
  const originalUrl = process.env.UPSTASH_REDIS_REST_URL;
  const originalToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  env.NODE_ENV = "production";
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;

  try {
    const testIp = `prod_bounded_${Date.now()}`;
    const res = await checkRateLimit(testIp, {
      limit: 20,
      windowMs: 60000,
      fallbackPolicy: "emergency_bounded",
      emergencyLimit: 2, // Curtailed emergency quota
    });

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.store, "emergency_bounded");
    assert.strictEqual(res.degraded, true);
    assert.strictEqual(res.limit, 2);
    assert.strictEqual(res.remaining, 1);

    // Second hit
    const res2 = await checkRateLimit(testIp, {
      limit: 20,
      windowMs: 60000,
      fallbackPolicy: "emergency_bounded",
      emergencyLimit: 2,
    });
    assert.strictEqual(res2.success, true);
    assert.strictEqual(res2.remaining, 0);

    // Third hit must be blocked
    const res3 = await checkRateLimit(testIp, {
      limit: 20,
      windowMs: 60000,
      fallbackPolicy: "emergency_bounded",
      emergencyLimit: 2,
    });
    assert.strictEqual(res3.success, false);
    assert.strictEqual(res3.remaining, 0);
  } finally {
    env.NODE_ENV = originalEnv;
    if (originalUrl) process.env.UPSTASH_REDIS_REST_URL = originalUrl;
    if (originalToken) process.env.UPSTASH_REDIS_REST_TOKEN = originalToken;
  }
});
