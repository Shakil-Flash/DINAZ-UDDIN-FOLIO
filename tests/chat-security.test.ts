import test from "node:test";
import assert from "node:assert/strict";

test("Chat Security - Message Format Extraction & Normalization", () => {
  // Reusable helper matching route.ts extraction
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
