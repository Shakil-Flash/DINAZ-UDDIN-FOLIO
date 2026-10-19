/**
 * Contact Message Delivery Provider Abstraction
 *
 * NOTE:
 * - Provider credentials remain strictly server-side.
 * - If no provider API key (e.g. RESEND_API_KEY) is configured, the provider
 *   returns a transparent unconfigured status rather than faking delivery.
 * - Handles timeouts, duplicate submissions, and safe error masking.
 */

export interface ContactMessagePayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  clientIp: string;
}

export interface DeliveryResult {
  success: boolean;
  configured: boolean;
  providerAccepted?: boolean;
  messageId?: string;
  error?: string;
}

// In-memory cache to detect and prevent duplicate submissions within 30 seconds
interface SentMessageRecord {
  timestamp: number;
  messageId: string;
}
const recentSubmissions = new Map<string, SentMessageRecord>();

// Cleanup stale deduplication records periodically
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of recentSubmissions.entries()) {
      if (now - record.timestamp > 30_000) {
        recentSubmissions.delete(key);
      }
    }
  }, 30_000).unref?.();
}

function computeFingerprint(payload: ContactMessagePayload): string {
  return `${payload.email.toLowerCase()}|${payload.subject.toLowerCase()}|${payload.message.slice(0, 80)}`;
}

export async function deliverContactMessage(
  payload: ContactMessagePayload
): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY || process.env.EMAIL_PROVIDER_KEY;
  const recipientEmail =
    process.env.CONTACT_EMAIL_TO || "contact@dinazuddin.dev";
  const senderEmail =
    process.env.CONTACT_EMAIL_FROM || "Dinaz Portfolio <onboarding@resend.dev>";

  // 1. Transparent unconfigured status check
  if (!apiKey || apiKey.trim() === "" || apiKey === "your_resend_api_key_here") {
    return {
      success: false,
      configured: false,
      providerAccepted: false,
      error:
        "Contact messaging service is currently in demonstration mode. Set RESEND_API_KEY in server environment variables (.env.local) to enable inbox delivery.",
    };
  }

  // 2. Duplicate submission suppression (prevents rapid double-clicks)
  const fingerprint = computeFingerprint(payload);
  const existing = recentSubmissions.get(fingerprint);
  if (existing && Date.now() - existing.timestamp < 30_000) {
    return {
      success: true,
      configured: true,
      providerAccepted: true,
      messageId: existing.messageId,
    };
  }

  try {
    // 3. Timeout-bounded delivery fetch to Resend API (10s max)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: senderEmail,
        to: [recipientEmail],
        reply_to: payload.email,
        subject: `[Portfolio Inquiry] ${payload.subject} — from ${payload.name}`,
        text: `Name: ${payload.name}\nEmail: ${payload.email}\nSubject: ${payload.subject}\n\nMessage:\n${payload.message}\n\nClient IP: ${payload.clientIp}`,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const status = response.status;
      if (status === 401 || status === 403) {
        return {
          success: false,
          configured: true,
          providerAccepted: false,
          error: "Delivery service authentication failed. Please contact directly via email.",
        };
      }
      if (status === 429) {
        return {
          success: false,
          configured: true,
          providerAccepted: false,
          error: "Message delivery rate limit reached. Please retry in a few minutes.",
        };
      }

      return {
        success: false,
        configured: true,
        providerAccepted: false,
        error: "External delivery provider returned a transient error. Please retry later.",
      };
    }

    const data = (await response.json()) as { id?: string };
    const messageId = data?.id || `resend_${Date.now()}`;

    // Record fingerprint in deduplication cache
    recentSubmissions.set(fingerprint, {
      timestamp: Date.now(),
      messageId,
    });

    return {
      success: true,
      configured: true,
      providerAccepted: true,
      messageId,
    };
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      return {
        success: false,
        configured: true,
        providerAccepted: false,
        error: "Message delivery timed out. Please check your network or email directly.",
      };
    }

    // Never log raw payload, personal info, or credentials
    return {
      success: false,
      configured: true,
      providerAccepted: false,
      error: "An unexpected error occurred during message transmission.",
    };
  }
}
