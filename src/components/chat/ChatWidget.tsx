"use client";

import * as React from "react";
import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import {
  MessageSquare,
  X,
  Send,
  Terminal,
  AlertCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";

interface ChatWidgetProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

function getMessageText(message: UIMessage): string {
  if ("content" in message && typeof (message as { content: unknown }).content === "string") {
    return (message as { content: string }).content;
  }
  if ("parts" in message && Array.isArray((message as { parts: unknown[] }).parts)) {
    return (message as { parts: Array<{ type?: string; text?: string }> }).parts
      .filter((p) => p.type === "text" && typeof p.text === "string")
      .map((p) => p.text)
      .join("\n");
  }
  return "";
}

export function ChatWidget({
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: ChatWidgetProps = {}) {
  const [internalIsOpen, setInternalIsOpen] = React.useState(false);
  const [inputMessage, setInputMessage] = React.useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    if (controlledOnToggle) {
      controlledOnToggle();
    } else {
      setInternalIsOpen((prev) => !prev);
    }
  };

  const {
    messages,
    sendMessage,
    status,
    error,
    setMessages,
  } = useChat();

  const isGenerating = status === "submitted" || status === "streaming";

  // Auto-scroll to bottom of conversation
  React.useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isGenerating]);

  // Focus input when opened and add Escape key listener
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          if (controlledOnToggle) {
            controlledOnToggle();
          } else {
            setInternalIsOpen(false);
          }
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, controlledOnToggle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputMessage.trim();
    if (!trimmed || isGenerating) return;

    setInputMessage("");
    try {
      await sendMessage({ text: trimmed });
    } catch {
      // Handled via error state
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <aside
      aria-label="Dinaz Uddin Technical Portfolio Assistant"
      className="fixed bottom-4 right-4 z-50 flex flex-col items-end"
    >
      {/* Floating Panel */}
      {isOpen && (
        <section
          id="chat-panel"
          role="region"
          aria-label="Portfolio AI Chat Interface"
          className="mb-3 flex h-[520px] max-h-[80vh] w-[calc(100vw-2rem)] max-w-[390px] flex-col rounded-2xl border border-white/15 bg-[#0e111a]/95 shadow-2xl backdrop-blur-xl transition-all duration-200 animate-in fade-in-0 zoom-in-95"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 bg-[#131724]">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#b4ff39]/30 bg-[#b4ff39]/10 text-[#b4ff39]">
                <Terminal className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-xs font-semibold tracking-wide text-[#f8fafc]">
                    Portfolio Assistant
                  </h2>
                  <span className="flex h-1.5 w-1.5 rounded-full bg-[#b4ff39]" />
                </div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8]">
                  Dinaz Uddin // Electrical Diploma Engineer
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClear}
                title="Reset conversation"
                aria-label="Reset conversation"
                className="flex h-7 w-7 items-center justify-center rounded-md text-[#94a3b8] hover:bg-white/10 hover:text-[#f8fafc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b4ff39]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={handleToggle}
                aria-label="Close chat panel"
                className="flex h-7 w-7 items-center justify-center rounded-md text-[#94a3b8] hover:bg-white/10 hover:text-[#f8fafc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b4ff39]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Conversation Area */}
          <div
            tabIndex={0}
            role="log"
            aria-live="polite"
            className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs focus:outline-none"
          >
            {/* System Introduction */}
            <div className="rounded-xl border border-white/10 bg-[#161a29]/60 p-3.5 text-[#94a3b8] leading-relaxed">
              <div className="flex items-center gap-1.5 text-[#b4ff39] font-mono text-[11px] mb-1.5 font-medium">
                <Sparkles className="h-3.5 w-3.5" />
                <span>TECHNICAL CONTEXT ENGINE</span>
              </div>
              <p>
                Inquire about Dinaz Uddin&apos;s electrical engineering fundamentals, technical principles,
                or portfolio capabilities.
              </p>
            </div>

            {/* Error / Unconfigured State Banner */}
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-amber-200"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-xs text-amber-300">
                      AI Backend Notice
                    </span>
                    <p className="text-[11px] text-amber-200/90 leading-normal">
                      The streaming chat engine is in place. To enable live AI inference, configure{" "}
                      <code className="bg-black/30 px-1 py-0.5 rounded font-mono text-[10px]">
                        AI_API_KEY
                      </code>{" "}
                      in your server environment (<code className="font-mono text-[10px]">.env.local</code>).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((m) => {
              const isUser = m.role === "user";
              const text = getMessageText(m);

              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div className="mb-1 flex items-center gap-1.5 px-1 font-mono text-[10px] text-[#64748b]">
                    <span>{isUser ? "YOU" : "ASSISTANT"}</span>
                  </div>
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 leading-relaxed break-words ${
                      isUser
                        ? "bg-[#b4ff39] text-[#090a0f] font-medium"
                        : "border border-white/10 bg-[#161a29] text-[#f8fafc]"
                    }`}
                  >
                    {text}
                  </div>
                </div>
              );
            })}

            {/* Generation Indicator */}
            {isGenerating && (
              <div className="flex items-center gap-2 text-[#94a3b8] font-mono text-[11px] px-1">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#b4ff39] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#b4ff39]" />
                </span>
                <span>Generating stream...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-white/10 p-3 bg-[#111420]"
          >
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about technical architecture..."
                maxLength={1500}
                disabled={isGenerating}
                className="w-full rounded-xl border border-white/10 bg-[#181c2b] py-2.5 pl-3.5 pr-10 text-xs text-[#f8fafc] placeholder-[#64748b] transition-all focus:border-[#b4ff39]/50 focus:bg-[#1b2031] focus:outline-none focus:ring-1 focus:ring-[#b4ff39]"
                aria-label="Message prompt"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isGenerating}
                aria-label="Send message"
                className="absolute right-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-[#b4ff39] text-[#090a0f] transition-all hover:bg-[#c4ff4d] disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b4ff39]"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="mt-1.5 flex items-center justify-between px-1 text-[10px] font-mono text-[#64748b]">
              <span>Press Enter to send</span>
              <span>{inputMessage.length}/1500</span>
            </div>
          </form>
        </section>
      )}

      {/* Launcher Button */}
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls="chat-panel"
        aria-label={isOpen ? "Close portfolio assistant chat" : "Open portfolio assistant chat"}
        className="group relative flex h-13 w-13 items-center justify-center rounded-full border border-white/15 bg-[#11141e] text-[#b4ff39] shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-all duration-200 hover:border-[#b4ff39]/50 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b4ff39] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090a0f]"
      >
        <span
          className="pointer-events-none absolute -top-1 -right-1 flex h-3 w-3"
          aria-hidden="true"
        >
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#b4ff39] opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-[#b4ff39]" />
        </span>

        {isOpen ? (
          <X className="h-5 w-5 text-[#f8fafc] transition-transform duration-200" />
        ) : (
          <MessageSquare className="h-5 w-5 text-[#b4ff39] transition-transform duration-200 group-hover:scale-110" />
        )}
      </button>
    </aside>
  );
}
