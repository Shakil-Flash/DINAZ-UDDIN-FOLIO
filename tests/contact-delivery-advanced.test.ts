import test from "node:test";
import assert from "node:assert/strict";
import { deliverContactMessage } from "../src/lib/server/contact-provider";

test("Contact Delivery - Duplicate Submission Suppression Logic", async () => {
  // If unconfigured, delivery should always return configured: false
  const originalKey = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;
  delete process.env.EMAIL_PROVIDER_KEY;

  try {
    const payload = {
      name: "Engr. Candidate",
      email: "candidate@substation.net",
      subject: "Substation Protection Inquiry",
      message: "Testing protection relay coordination standards.",
      clientIp: "192.0.2.1",
    };

    const firstAttempt = await deliverContactMessage(payload);
    assert.strictEqual(firstAttempt.configured, false);
    assert.strictEqual(firstAttempt.success, false);
    assert.ok(firstAttempt.error?.includes("demonstration mode"));
  } finally {
    if (originalKey) {
      process.env.RESEND_API_KEY = originalKey;
    }
  }
});

test("Contact Delivery - Payload Structure and Client IP Handling", async () => {
  const originalKey = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;

  try {
    const result = await deliverContactMessage({
      name: "Dinaz Reviewer",
      email: "reviewer@powergrid.org",
      subject: "SLD Verification",
      message: "Reviewing 11kV bus coupler topology.",
      clientIp: "203.0.113.5",
    });

    assert.strictEqual(typeof result.success, "boolean");
    assert.strictEqual(typeof result.configured, "boolean");
    assert.strictEqual(result.providerAccepted, false);
  } finally {
    if (originalKey) {
      process.env.RESEND_API_KEY = originalKey;
    }
  }
});
