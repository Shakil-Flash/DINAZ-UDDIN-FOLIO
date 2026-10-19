"use client";

import * as React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { PhilosophySection } from "@/components/sections/PhilosophySection";
import { CompetenciesSection } from "@/components/sections/CompetenciesSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { siteConfig } from "@/config/site";
import { ArrowUpRight, Terminal, Mail } from "lucide-react";

export function PageShell() {
  const [chatOpen, setChatOpen] = React.useState(false);

  return (
    <div className="relative flex min-h-screen flex-col bg-[#090a0f] text-[#f8fafc]">
      {/* Persistent Technical Navigation */}
      <Header />

      <main className="flex-1">
        {/* Scoped GSAP Hero Section */}
        <Hero onOpenChat={() => setChatOpen(true)} />

        {/* Phase 02: Engineering Philosophy & Principles */}
        <PhilosophySection />

        {/* Phase 02: Technical Competencies Framework */}
        <CompetenciesSection />

        {/* Phase 02: Project Case-Study System */}
        <ProjectsSection />

        {/* Technical Communication & Inquiries Section */}
        <section
          id="contact"
          className="relative border-t border-white/[0.08] bg-[#090a0f] py-24 px-4 sm:px-6 lg:px-8"
          aria-labelledby="contact-heading"
        >
          <div className="mx-auto max-w-7xl">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#131724] to-[#0e111a] p-8 sm:p-12 lg:p-16">
              <div className="max-w-2xl">
                <span className="font-mono text-xs uppercase tracking-widest text-[#b4ff39]">
                  [ 05 // COMMUNICATION & INQUIRIES ]
                </span>
                <h2
                  id="contact-heading"
                  className="mt-3 text-3xl font-bold tracking-tight text-[#f8fafc] sm:text-4xl"
                >
                  Technical Consultations & Systems Inquiries
                </h2>
                <p className="mt-4 text-sm text-[#94a3b8] leading-relaxed">
                  Available for electrical engineering consultations, industrial circuit troubleshooting, panel layout reviews, and technical project collaborations.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href={`mailto:${siteConfig.links.email}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#b4ff39] px-6 py-3.5 text-xs font-semibold text-[#090a0f] transition-all hover:bg-[#c4ff4d] shadow-[0_0_20px_rgba(180,255,57,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b4ff39]"
                  >
                    <Mail className="h-4 w-4" />
                    <span>{siteConfig.links.email}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>

                  <button
                    type="button"
                    onClick={() => setChatOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[#181c2b] px-6 py-3.5 text-xs font-medium text-[#f8fafc] transition-all hover:bg-[#202538] hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b4ff39]"
                  >
                    <Terminal className="h-4 w-4 text-[#b4ff39]" />
                    <span>Launch Portfolio Assistant</span>
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
