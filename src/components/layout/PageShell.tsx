"use client";

import * as React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { siteConfig } from "@/config/site";
import { ArrowUpRight, Code, Shield, Cpu } from "lucide-react";

export function PageShell() {
  const [chatOpen, setChatOpen] = React.useState(false);

  return (
    <div className="relative flex min-h-screen flex-col bg-[#090a0f] text-[#f8fafc]">
      {/* Persistent Technical Navigation */}
      <Header />

      <main className="flex-1">
        {/* Scoped GSAP Hero Section */}
        <Hero onOpenChat={() => setChatOpen(true)} />

        {/* Foundations Overview Section */}
        <section
          id="projects"
          className="relative border-t border-white/[0.08] bg-[#0c0e17] py-20 px-4 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <div className="flex items-center gap-2 text-[#b4ff39] font-mono text-xs tracking-wider uppercase mb-2">
                  <span>[ 02 // DISCIPLINES ]</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f8fafc]">
                  Engineering Tenets & Standards
                </h2>
              </div>
              <p className="text-sm text-[#94a3b8] max-w-md">
                Disciplined foundations established in Phase 01 to support future case studies and systems work.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-white/10 bg-[#111420] p-6 hover:border-white/20 transition-all">
                <div className="h-10 w-10 rounded-xl bg-[#b4ff39]/10 border border-[#b4ff39]/30 flex items-center justify-center text-[#b4ff39] mb-4">
                  <Code className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-[#f8fafc] mb-2">
                  Architectural Rigor
                </h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Clean server-first separation with React Server Components, minimizing client runtime overhead and guaranteeing predictable data flow.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#111420] p-6 hover:border-white/20 transition-all">
                <div className="h-10 w-10 rounded-xl bg-[#b4ff39]/10 border border-[#b4ff39]/30 flex items-center justify-center text-[#b4ff39] mb-4">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-[#f8fafc] mb-2">
                  Security-First API Layer
                </h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Strict request payload bounds, origin-independent rate limiting, sanitized message parsing, and isolated server-only environment secrets.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#111420] p-6 hover:border-white/20 transition-all">
                <div className="h-10 w-10 rounded-xl bg-[#b4ff39]/10 border border-[#b4ff39]/30 flex items-center justify-center text-[#b4ff39] mb-4">
                  <Cpu className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-[#f8fafc] mb-2">
                  Controlled Motion & A11y
                </h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Scoped GSAP timelines respecting user motion preferences, avoiding layout shifts, hydration mismatches, and animation flashes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Planned Milestones / Contact Section */}
        <section
          id="contact"
          className="relative border-t border-white/[0.08] bg-[#090a0f] py-20 px-4 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#131724] to-[#0e111a] p-8 sm:p-12">
              <div className="max-w-2xl">
                <span className="font-mono text-xs uppercase tracking-widest text-[#b4ff39]">
                  Communication & Inquiries
                </span>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#f8fafc] sm:text-4xl">
                  Technical Dialogues & Collaboration
                </h2>
                <p className="mt-4 text-sm text-[#94a3b8] leading-relaxed">
                  Available for technical engineering discussions, systems consultation, and full-stack architecture reviews.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href={`mailto:${siteConfig.links.email}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#b4ff39] px-6 py-3 text-xs font-semibold text-[#090a0f] transition-all hover:bg-[#c4ff4d] shadow-[0_0_20px_rgba(180,255,57,0.25)]"
                  >
                    <span>{siteConfig.links.email}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>

                  <button
                    type="button"
                    onClick={() => setChatOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[#181c2b] px-6 py-3 text-xs font-medium text-[#f8fafc] transition-all hover:bg-[#202538] hover:border-white/25"
                  >
                    <span>Launch AI Assistant</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Semantic Footer */}
      <Footer />

      {/* Accessible Floating Assistant */}
      <ChatWidget
        isOpen={chatOpen}
        onToggle={() => setChatOpen((prev) => !prev)}
      />
    </div>
  );
}
