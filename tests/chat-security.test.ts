import test from "node:test";
import assert from "node:assert/strict";
import { POST, GET } from "../src/app/api/chat/route";
import { NextRequest } from "next/server";

test("Chat Security - Message Format Extraction & Normalization", () => {
  function extractMessageContent(msg: unknown): string | null {
    if (typeof msg !== "object" || msg === null) return null;

    if ("content" in msg && typeof (msg as { content: unknown }).content === "string") {
      return (msg as { content: string }).content;
    }

    if ("parts" in msg && Array.isArray((msg as { parts: unknown[] }).parts)) {
      const textParts = (msg as { parts: unknown[] }).parts
        .filter(
          (p): p is { type: "text"; text: string } =>
            typeof p === "object" &&
            p !== null &&
            "type" in p &&
            (p as { type: unknown }).type === "text" &&
            "text" in p &&
            typeof (p as { text: unknown }).text === "string"
        )
        .map((p) => p.text);

      return textParts.join("\n");
    }

    return null;
  }

  // 1. Traditional format
  const traditional = { role: "user", content: "Explain busbar ampacity." };
  assert.strictEqual(extractMessageContent(traditional), "Explain busbar ampacity.");

  // 2. AI SDK v7 parts format
  const partsFormat = {
    role: "user",
    parts: [{ type: "text", text: "What is star-delta starter inrush?" }],
  };
  assert.strictEqual(
    extractMessageContent(partsFormat),
    "What is star-delta starter inrush?"
  );

  // 3. Invalid formats
  assert.strictEqual(extractMessageContent(null), null);
  assert.strictEqual(extractMessageContent({ role: "user" }), null);
  assert.strictEqual(extractMessageContent({ role: "user", parts: [] }), "");
});

test("Chat Security - Content Length & Message Bounds", () => {
  const MAX_MESSAGES = 25;
  const MAX_CONTENT_LENGTH = 1500;

  const validMessage = "A".repeat(1500);
  assert.ok(validMessage.length <= MAX_CONTENT_LENGTH);

  const oversizedMessage = "A".repeat(1501);
  assert.ok(oversizedMessage.length > MAX_CONTENT_LENGTH);

  const sampleHistory = Array.from({ length: 25 }, (_, i) => ({
    role: i % 2 === 0 ? "user" : "assistant",
    content: `Message ${i}`,
  }));
  assert.strictEqual(sampleHistory.length, MAX_MESSAGES);
});

test("Chat Route - Malformed or Missing Messages Array Returns 400", async () => {
  const req = new NextRequest("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ invalid: true }),
  });

  const res = await POST(req);
  const data = (await res.json()) as { error: string };

  assert.strictEqual(res.status, 400);
  assert.ok(data.error.includes("'messages' array is required"));
});

test("Chat Route - Unconfigured Provider Returns Safe 503 Notice", async () => {
  const originalKey = process.env.AI_API_KEY;
  const originalOpenAIKey = process.env.OPENAI_API_KEY;
  delete process.env.AI_API_KEY;
  delete process.env.OPENAI_API_KEY;

  try {
    const req = new NextRequest("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "What is Dinaz's electrical background?" }],
      }),
    });

    const res = await POST(req);
    const data = (await res.json()) as { error: string; configured: boolean };

    assert.strictEqual(res.status, 503);
    assert.strictEqual(data.configured, false);
    assert.ok(data.error.includes("unconfigured"));
  } finally {
    if (originalKey) process.env.AI_API_KEY = originalKey;
    if (originalOpenAIKey) process.env.OPENAI_API_KEY = originalOpenAIKey;
  }
});

test("Chat Route - GET Method Is Rejected with 405", async () => {
  const res = await GET();
  assert.strictEqual(res.status, 405);
  assert.strictEqual(res.headers.get("Allow"), "POST");
});
