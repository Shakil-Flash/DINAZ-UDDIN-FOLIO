import test from "node:test";
import assert from "node:assert/strict";
import { POST } from "../src/app/api/contact/route";
import { NextRequest } from "next/server";

test("Contact Route - Empty Body Returns 422 with Field Errors", async () => {
  const req = new NextRequest("http://localhost:3000/api/contact", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({}),
  });

  const res = await POST(req);
  const data = (await res.json()) as { success: boolean; errors: Record<string, string> };

  assert.strictEqual(res.status, 422);
  assert.strictEqual(data.success, false);
  assert.ok(data.errors.name, "Name must be flagged as required");
  assert.ok(data.errors.email, "Email must be flagged as required");
  assert.ok(data.errors.subject, "Subject must be flagged as required");
  assert.ok(data.errors.message, "Message must be flagged as required");
});

test("Contact Route - Honeypot Trap Returns 400 Rejection", async () => {
  const req = new NextRequest("http://localhost:3000/api/contact", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      name: "Spam Bot",
      email: "bot@spammer.biz",
      subject: "SEO Services Promotion",
      message: "We can guarantee top search ranking for your engineering site.",
      hp_company: "Spam Corp Ltd", // Hidden honeypot field
    }),
  });

  const res = await POST(req);
  const data = (await res.json()) as { success: boolean; error: string };

  assert.strictEqual(res.status, 400);
  assert.strictEqual(data.success, false);
  assert.strictEqual(data.error, "Submission rejected.");
});

test("Contact Route - Invalid Content-Type Returns 415", async () => {
  const req = new NextRequest("http://localhost:3000/api/contact", {
    method: "POST",
    headers: {
      "content-type": "text/plain",
    },
    body: "Plain text submission",
  });

  const res = await POST(req);
  assert.strictEqual(res.status, 415);
});

test("Contact Route - Unconfigured Provider Returns Safe 503 Notice", async () => {
  const originalKey = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;
  delete process.env.EMAIL_PROVIDER_KEY;

  try {
    const req = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: "Verified Engineer",
        email: "engineer@substation-design.org",
        subject: "SLD Busbar Feeder Consultation",
        message: "Inquiring about 11kV busbar sizing and breaker coordination methodology.",
      }),
    });

    const res = await POST(req);
    const data = (await res.json()) as { success: boolean; configured: boolean; error: string };

    assert.strictEqual(res.status, 503);
    assert.strictEqual(data.success, false);
    assert.strictEqual(data.configured, false);
    assert.ok(data.error.includes("demonstration mode"));
  } finally {
    if (originalKey) {
      process.env.RESEND_API_KEY = originalKey;
    }
  }
});
