import test from "node:test";
import assert from "node:assert/strict";
import { checkRateLimit } from "../src/lib/server/rate-limiter";
import { deliverContactMessage } from "../src/lib/server/contact-provider";

test("Contact Validation - Email Regex Logic", () => {
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const validEmails = [
    "engineer@example.com",
    "dinaz.contact@substation.org",
    "user+test@domain.co.uk",
  ];

  for (const email of validEmails) {
    assert.ok(EMAIL_REGEX.test(email), `Email ${email} should be valid`);
  }

  const invalidEmails = [
    "not-an-email",
    "missing@domain",
    "@nodomain.com",
    "spaces in@email.com",
    "user@.com",
  ];

  for (const email of invalidEmails) {
    assert.strictEqual(EMAIL_REGEX.test(email), false, `Email ${email} should be rejected`);
  }
});

test("Contact Security - Honeypot Trap Rejection", () => {
  const isHoneypotTriggered = (hpValue: unknown): boolean => {
    return typeof hpValue === "string" && hpValue.trim().length > 0;
  };

  assert.strictEqual(isHoneypotTriggered(""), false, "Empty honeypot should pass (legitimate user)");
  assert.strictEqual(isHoneypotTriggered("   "), false, "Whitespace honeypot should pass");
  assert.strictEqual(isHoneypotTriggered("spam-bot.biz"), true, "Populated honeypot must trigger bot detection");
  assert.strictEqual(isHoneypotTriggered("https://malicious-link.com"), true, "Link honeypot must trigger bot detection");
});

test("Contact Security - Sliding Window Rate Limiter", () => {
  const testIp = `test_ip_${Date.now()}`;
  const limit = 3;
  const windowMs = 5000;

  // First 3 requests must succeed
  for (let i = 0; i < limit; i++) {
    const res = checkRateLimit(testIp, limit, windowMs);
    assert.strictEqual(res.success, true, `Request ${i + 1} should be within limit`);
  }

  // 4th request must be rejected
  const blockedRes = checkRateLimit(testIp, limit, windowMs);
  assert.strictEqual(blockedRes.success, false, "4th request should exceed rate limit");
  assert.strictEqual(blockedRes.remaining, 0);
  assert.ok(blockedRes.reset > 0, "Reset delay should be greater than zero");
});

test("Contact Delivery - Safe Unconfigured Provider Fallback", async () => {
  // Clear any API key temporarily to test fallback
  const originalKey = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;
  delete process.env.EMAIL_PROVIDER_KEY;

  try {
    const result = await deliverContactMessage({
      name: "Test User",
      email: "test@example.com",
      subject: "Test Subject",
      message: "Testing message delivery abstraction.",
      clientIp: "127.0.0.1",
    });

    assert.strictEqual(result.configured, false, "Provider must report unconfigured status");
    assert.strictEqual(result.success, false, "Provider must not claim success when unconfigured");
    assert.ok(result.error?.includes("demonstration mode"), "Error message must state demonstration mode clearly");
  } finally {
    if (originalKey) {
      process.env.RESEND_API_KEY = originalKey;
    }
  }
});
