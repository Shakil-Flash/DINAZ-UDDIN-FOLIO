/**
 * Contact Message Delivery Provider Abstraction
 *
 * NOTE:
 * - Provider credentials remain strictly server-side.
 * - If no provider API key (e.g. RESEND_API_KEY) is configured, the provider
 *   returns a transparent unconfigured status rather than faking delivery.
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
  messageId?: string;
  error?: string;
}

export async function deliverContactMessage(
  payload: ContactMessagePayload
): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY || process.env.EMAIL_PROVIDER_KEY;
  const recipientEmail =
    process.env.CONTACT_EMAIL_TO || "contact@dinazuddin.dev";

  // Check if provider is configured
  if (!apiKey || apiKey.trim() === "" || apiKey === "your_resend_api_key_here") {
    // Return transparent unconfigured status without throwing or faking
    return {
      success: false,
      configured: false,
      error:
        "Contact messaging service is currently in demonstration mode. Set RESEND_API_KEY in server environment variables (.env.local) to enable inbox delivery.",
    };
  }

  try {
    // Production delivery integration using standard fetch to email API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Dinaz Portfolio <onboarding@resend.dev>",
        to: [recipientEmail],
        reply_to: payload.email,
        subject: `[Portfolio Inquiry] ${payload.subject} - from ${payload.name}`,
        text: `Name: ${payload.name}\nEmail: ${payload.email}\nSubject: ${payload.subject}\n\nMessage:\n${payload.message}\n\nClient IP: ${payload.clientIp}`,
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        configured: true,
        error: "External delivery provider returned a transient error.",
      };
    }

    const data = (await response.json()) as { id?: string };
    return {
      success: true,
      configured: true,
      messageId: data.id,
    };
  } catch {
    // Avoid logging sensitive personal data or secrets
    return {
      success: false,
      configured: true,
      error: "An unexpected error occurred during message transmission.",
    };
  }
}
