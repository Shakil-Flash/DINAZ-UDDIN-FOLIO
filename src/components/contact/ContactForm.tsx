"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Send, AlertCircle, CheckCircle2, Info, Loader2 } from "lucide-react";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
  hp_company: string; // Honeypot field
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export function ContactForm() {
  const [formData, setFormData] = React.useState<FormState>({
    name: "",
    email: "",
    subject: "Electrical Systems Architecture",
    message: "",
    hp_company: "",
  });

  const [errors, setErrors] = React.useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [statusMessage, setStatusMessage] = React.useState<{
    type: "success" | "unconfigured" | "error";
    text: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);
    setErrors({});

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = (await res.json()) as {
        success?: boolean;
        configured?: boolean;
        error?: string;
        errors?: FormErrors;
        message?: string;
      };

      if (res.status === 422 && data.errors) {
        setErrors(data.errors);
        setStatusMessage({
          type: "error",
          text: data.error || "Please correct the highlighted errors.",
        });
        return;
      }

      if (res.status === 503 || data.configured === false) {
        setStatusMessage({
          type: "unconfigured",
          text:
            data.error ||
            "Contact service is in demonstration mode. Set RESEND_API_KEY in server environment to enable inbox delivery.",
        });
        return;
      }

      if (!res.ok || !data.success) {
        setStatusMessage({
          type: "error",
          text: data.error || "Submission failed. Please try again.",
        });
        return;
      }

      // Success
      setStatusMessage({
        type: "success",
        text: data.message || "Your message has been securely transmitted.",
      });

      // Reset message field, keep name and email for user convenience
      setFormData((prev) => ({
        ...prev,
        message: "",
      }));
    } catch {
      setStatusMessage({
        type: "error",
        text: "Network or communication error. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-[#111420] p-6 sm:p-8"
      aria-label="Direct Technical Contact Form"
    >
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-lg font-bold text-[#f8fafc]">
          Direct Technical Transmission
        </h3>
        <p className="text-xs text-[#94a3b8] mt-1">
          Send a structured inquiry regarding electrical systems, panel architecture, or technical collaboration.
        </p>
      </div>

      {/* Honeypot field (hidden from real users via CSS & aria-hidden) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="hp_company">Company Website (Leave Blank)</label>
        <input
          id="hp_company"
          type="text"
          name="hp_company"
          value={formData.hp_company}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Status Notifications */}
      {statusMessage && (
        <div
          role={statusMessage.type === "error" ? "alert" : "status"}
          className={`rounded-xl border p-4 text-xs leading-relaxed ${
            statusMessage.type === "success"
              ? "border-[#b4ff39]/30 bg-[#b4ff39]/10 text-[#b4ff39]"
              : statusMessage.type === "unconfigured"
              ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
              : "border-red-500/30 bg-red-500/10 text-red-200"
          }`}
        >
          <div className="flex items-start gap-2.5">
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#b4ff39] mt-0.5" />
            ) : statusMessage.type === "unconfigured" ? (
              <Info className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
            )}
            <div>
              <span className="font-semibold block mb-0.5">
                {statusMessage.type === "success"
                  ? "Transmission Succeeded"
                  : statusMessage.type === "unconfigured"
                  ? "Provider Notice (Demonstration Mode)"
                  : "Transmission Error"}
              </span>
              <span>{statusMessage.text}</span>
            </div>
          </div>
        </div>
      )}

      {/* Name & Email Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name Input */}
        <div>
          <label
            htmlFor="contact-name"
            className="block text-xs font-mono font-medium text-[#f8fafc] mb-1.5"
          >
            Full Name <span className="text-[#b4ff39]">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            required
            maxLength={100}
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Alex Morgan"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            disabled={isSubmitting}
            className={`w-full rounded-xl border bg-[#181c2b] px-3.5 py-2.5 text-xs text-[#f8fafc] placeholder-[#64748b] transition-all focus:outline-none focus:ring-1 ${
              errors.name
                ? "border-red-500/50 focus:border-red-500 focus:ring-red-500"
                : "border-white/10 focus:border-[#b4ff39]/50 focus:ring-[#b4ff39]"
            }`}
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-[11px] text-red-400">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <label
            htmlFor="contact-email"
            className="block text-xs font-mono font-medium text-[#f8fafc] mb-1.5"
          >
            Email Address <span className="text-[#b4ff39]">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            required
            maxLength={150}
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. alex@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            disabled={isSubmitting}
            className={`w-full rounded-xl border bg-[#181c2b] px-3.5 py-2.5 text-xs text-[#f8fafc] placeholder-[#64748b] transition-all focus:outline-none focus:ring-1 ${
              errors.email
                ? "border-red-500/50 focus:border-red-500 focus:ring-red-500"
                : "border-white/10 focus:border-[#b4ff39]/50 focus:ring-[#b4ff39]"
            }`}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-[11px] text-red-400">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Subject Dropdown */}
      <div>
        <label
          htmlFor="contact-subject"
          className="block text-xs font-mono font-medium text-[#f8fafc] mb-1.5"
        >
          Inquiry Discipline / Category <span className="text-[#b4ff39]">*</span>
        </label>
        <select
          id="contact-subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? "subject-error" : undefined}
          disabled={isSubmitting}
          className={`w-full rounded-xl border bg-[#181c2b] px-3.5 py-2.5 text-xs text-[#f8fafc] transition-all focus:outline-none focus:ring-1 ${
            errors.subject
              ? "border-red-500/50 focus:border-red-500 focus:ring-red-500"
              : "border-white/10 focus:border-[#b4ff39]/50 focus:ring-[#b4ff39]"
          }`}
        >
          <option value="Electrical Systems Architecture">
            Electrical Systems Architecture & Topology
          </option>
          <option value="Power Distribution Review">
            Power Distribution & Switchboard Review
          </option>
          <option value="Industrial Circuit Consultation">
            Motor Starter & Control Circuit Consultation
          </option>
          <option value="Technical Project Inquiry">
            Digital Engineering & Technical Project Inquiry
          </option>
          <option value="General Professional Dialogue">
            General Professional Dialogue
          </option>
        </select>
        {errors.subject && (
          <p id="subject-error" className="mt-1 text-[11px] text-red-400">
            {errors.subject}
          </p>
        )}
      </div>

      {/* Message Textarea */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="contact-message"
            className="block text-xs font-mono font-medium text-[#f8fafc]"
          >
            Technical Inquiry Message <span className="text-[#b4ff39]">*</span>
          </label>
          <span className="text-[10px] font-mono text-[#64748b]">
            {formData.message.length} / 3000 chars
          </span>
        </div>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          maxLength={3000}
          value={formData.message}
          onChange={handleChange}
          placeholder="Detail your technical requirements, load specifications, or inquiry details..."
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          disabled={isSubmitting}
          className={`w-full rounded-xl border bg-[#181c2b] p-3.5 text-xs text-[#f8fafc] placeholder-[#64748b] leading-relaxed transition-all focus:outline-none focus:ring-1 ${
            errors.message
              ? "border-red-500/50 focus:border-red-500 focus:ring-red-500"
              : "border-white/10 focus:border-[#b4ff39]/50 focus:ring-[#b4ff39]"
          }`}
        />
        {errors.message && (
          <p id="message-error" className="mt-1 text-[11px] text-red-400">
            {errors.message}
          </p>
        )}
      </div>

      {/* Submit Button & Security Note */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="text-[11px] font-mono text-[#64748b]">
          <span>Protected with server-side rate limits & defensive honeypots</span>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isSubmitting}
          className="gap-2 shrink-0 self-end sm:self-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Transmitting...</span>
            </>
          ) : (
            <>
              <span>Transmit Inquiry</span>
              <Send className="h-3.5 w-3.5" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
