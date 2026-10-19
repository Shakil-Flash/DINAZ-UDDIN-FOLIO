import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { checkRateLimit, getClientIp } from "@/lib/server/rate-limiter";

// Server-enforced system prompt. The client CANNOT override this.
const SYSTEM_PROMPT = `You are the technical portfolio assistant for Dinaz Uddin.
Identity & Credentials:
- Name: Dinaz Uddin
- Title: Electrical Diploma Engineer
- Core Focus: Electrical fundamentals, circuit theory, electrical safety and protection standards, power distribution systems, technical schematics, and modern computational engineering tools.
- Tone: Professional, precise, grounded, and engineering-focused.

Guidelines:
- Accurately state Dinaz's role as an Electrical Diploma Engineer.
- Do NOT fabricate academic institutions, colleges, graduation years, job titles, client histories, electrical licenses, or unconfirmed projects.
- Clearly note that specific course transcripts, certifications, and case-study outcomes are pending direct confirmation from Dinaz.
- If asked about contact or collaboration, direct the user to the contact section or the email listed in the portfolio.`;

interface SanitizedMessage {
  role: "user" | "assistant";
  content: string;
}

const MAX_PAYLOAD_BYTES = 50_000; // 50 KB limit
const MAX_MESSAGES = 25;
const MAX_CONTENT_LENGTH = 1_500; // 1,500 characters per message
const RATE_LIMIT_REQUESTS = 20; // 20 requests
const RATE_LIMIT_WINDOW_MS = 60_000; // per 1 minute

function extractMessageContent(msg: unknown): string | null {
  if (typeof msg !== "object" || msg === null) return null;

  // Traditional content string
  if ("content" in msg && typeof (msg as { content: unknown }).content === "string") {
    return (msg as { content: string }).content;
  }

  // Modern Vercel AI SDK parts array
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

export async function POST(req: NextRequest) {
  try {
    // 1. Abuse protection / Rate limiting by client IP
    const clientIp = getClientIp(req.headers);

    const rateLimit = await checkRateLimit(
      `chat_${clientIp}`,
      RATE_LIMIT_REQUESTS,
      RATE_LIMIT_WINDOW_MS
    );

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: "Too many requests. Please wait before sending another message.",
          retryAfter: rateLimit.reset,
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimit.reset.toString(),
            "X-RateLimit-Limit": rateLimit.limit.toString(),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    // 2. Request size check
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
      return NextResponse.json(
        { error: "Request payload exceeds allowed limit." },
        { status: 413 }
      );
    }

    // 3. Body parse and validation
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      !("messages" in body) ||
      !Array.isArray((body as { messages: unknown }).messages)
    ) {
      return NextResponse.json(
        { error: "Malformed request: 'messages' array is required." },
        { status: 400 }
      );
    }

    const rawMessages = (body as { messages: unknown[] }).messages;

    if (rawMessages.length === 0) {
      return NextResponse.json(
        { error: "Messages array cannot be empty." },
        { status: 400 }
      );
    }

    if (rawMessages.length > MAX_MESSAGES) {
      return NextResponse.json(
        { error: `Conversation exceeds the maximum limit of ${MAX_MESSAGES} messages.` },
        { status: 400 }
      );
    }

    // Validate and sanitize each message
    const sanitizedMessages: SanitizedMessage[] = [];
    for (const msg of rawMessages) {
      if (typeof msg !== "object" || msg === null || !("role" in msg)) {
        return NextResponse.json(
          { error: "Invalid message item format." },
          { status: 400 }
        );
      }

      const role = (msg as { role: unknown }).role;
      if (role !== "user" && role !== "assistant") {
        return NextResponse.json(
          { error: "Invalid message role. Only 'user' or 'assistant' are permitted." },
          { status: 400 }
        );
      }

      const rawContent = extractMessageContent(msg);
      if (rawContent === null || rawContent.trim().length === 0) {
        return NextResponse.json(
          { error: "Message content must be a non-empty string." },
          { status: 400 }
        );
      }

      if (rawContent.length > MAX_CONTENT_LENGTH) {
        return NextResponse.json(
          { error: `Message content exceeds maximum allowed length of ${MAX_CONTENT_LENGTH} characters.` },
          { status: 400 }
        );
      }

      sanitizedMessages.push({
        role,
        content: rawContent.trim(),
      });
    }

    // 4. Server-side environment key validation
    const apiKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey.trim() === "" || apiKey === "your_ai_api_key_here") {
      return NextResponse.json(
        {
          error:
            "AI assistant service is unconfigured. Set AI_API_KEY in server environment variables to enable live responses.",
          configured: false,
        },
        {
          status: 503,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // 5. Server-controlled model & provider initialization
    const modelName = process.env.AI_MODEL || "gpt-4o-mini";
    const baseURL = process.env.AI_BASE_URL || undefined;

    const provider = createOpenAI({
      apiKey,
      baseURL,
    });

    const result = streamText({
      model: provider(modelName),
      system: SYSTEM_PROMPT,
      messages: sanitizedMessages,
      maxOutputTokens: 500,
    });

    return result.toUIMessageStreamResponse({
      headers: {
        "X-RateLimit-Limit": rateLimit.limit.toString(),
        "X-RateLimit-Remaining": rateLimit.remaining.toString(),
      },
    });
  } catch {
    // Avoid logging private conversation content or credentials.
    return NextResponse.json(
      { error: "An unexpected error occurred while processing the AI request." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to interact with the assistant." },
    { status: 405, headers: { Allow: "POST" } }
  );
}
