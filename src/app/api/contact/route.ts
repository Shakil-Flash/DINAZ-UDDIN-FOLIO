import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/server/rate-limiter";
import { deliverContactMessage } from "@/lib/server/contact-provider";

const MAX_PAYLOAD_BYTES = 50_000; // 50 KB
const RATE_LIMIT_REQUESTS = 5; // 5 submissions
const RATE_LIMIT_WINDOW_MS = 60_000; // per 1 minute

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function POST(req: NextRequest) {
  try {
    // 1. IP extraction and rate limiting
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const rateLimit = checkRateLimit(
      `contact_${clientIp}`,
      RATE_LIMIT_REQUESTS,
      RATE_LIMIT_WINDOW_MS
    );

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many contact requests from this address. Please wait before submitting again.",
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
        { success: false, error: "Payload exceeds maximum allowed size (50KB)." },
        { status: 413 }
      );
    }

    // 3. Content-Type check
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        { success: false, error: "Invalid Content-Type. Expected application/json." },
        { status: 415 }
      );
    }

    // 4. JSON parse
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Malformed JSON payload." },
        { status: 400 }
      );
    }

    if (typeof body !== "object" || body === null) {
      return NextResponse.json(
        { success: false, error: "Request body must be a valid JSON object." },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      subject,
      message,
      hp_company, // Honeypot trap
    } = body as Record<string, unknown>;

    // 5. Bot honeypot check
    // Real users do not see or fill this field
    if (typeof hp_company === "string" && hp_company.trim().length > 0) {
      return NextResponse.json(
        { success: false, error: "Submission rejected." },
        { status: 400 }
      );
    }

    // 6. Server-side validation
    const errors: Record<string, string> = {};

    // Validate Name
    if (typeof name !== "string" || name.trim().length === 0) {
      errors.name = "Full name is required.";
    } else if (name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters.";
    } else if (name.trim().length > 100) {
      errors.name = "Name cannot exceed 100 characters.";
    }

    // Validate Email
    if (typeof email !== "string" || email.trim().length === 0) {
      errors.email = "Email address is required.";
    } else if (email.trim().length < 5 || email.trim().length > 150) {
      errors.email = "Email must be between 5 and 150 characters.";
    } else if (!EMAIL_REGEX.test(email.trim())) {
      errors.email = "Please enter a valid email address (e.g., name@domain.com).";
    }

    // Validate Subject
    if (typeof subject !== "string" || subject.trim().length === 0) {
      errors.subject = "Subject or inquiry category is required.";
    } else if (subject.trim().length < 3) {
      errors.subject = "Subject must be at least 3 characters.";
    } else if (subject.trim().length > 150) {
      errors.subject = "Subject cannot exceed 150 characters.";
    }

    // Validate Message
    if (typeof message !== "string" || message.trim().length === 0) {
      errors.message = "Message content is required.";
    } else if (message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters.";
    } else if (message.trim().length > 3000) {
      errors.message = "Message cannot exceed 3,000 characters.";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Please correct the highlighted form errors.",
          errors,
        },
        { status: 422 }
      );
    }

    // 7. Deliver message via provider abstraction
    const delivery = await deliverContactMessage({
      name: (name as string).trim(),
      email: (email as string).trim(),
      subject: (subject as string).trim(),
      message: (message as string).trim(),
      clientIp,
    });

    if (!delivery.configured) {
      return NextResponse.json(
        {
          success: false,
          configured: false,
          error: delivery.error,
        },
        { status: 503 }
      );
    }

    if (!delivery.success) {
      return NextResponse.json(
        {
          success: false,
          configured: true,
          error: delivery.error || "Failed to deliver message.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        configured: true,
        message: "Your message has been securely transmitted. Thank you for reaching out.",
      },
      { status: 200 }
    );
  } catch {
    // Avoid logging sensitive personal data or secrets
    return NextResponse.json(
      { success: false, error: "An unexpected internal server error occurred." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to submit messages." },
    { status: 405, headers: { Allow: "POST" } }
  );
}
