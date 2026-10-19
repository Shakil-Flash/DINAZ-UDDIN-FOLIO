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
    assert.strictEqual(res.store, "memory");
    assert.strictEqual(res.remaining, limit - (i + 1));
  }

  const blocked = checkMemoryRateLimit(testIp, limit, windowMs);
  assert.strictEqual(blocked.success, false);
  assert.strictEqual(blocked.remaining, 0);
  assert.strictEqual(blocked.store, "memory");
});

test("Rate Limiter - Asynchronous checkRateLimit Graceful Fallback", async () => {
  const testIp = `async_test_${Date.now()}_${Math.random()}`;
  const res = await checkRateLimit(testIp, 5, 10000);

  assert.strictEqual(res.success, true);
  assert.ok(res.remaining <= 5);
  assert.ok(res.reset > 0);
  assert.ok(res.store === "memory" || res.store === "upstash_redis");
});
