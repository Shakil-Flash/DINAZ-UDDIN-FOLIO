"use client";

import * as React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { PhilosophySection } from "@/components/sections/PhilosophySection";
import { CompetenciesSection } from "@/components/sections/CompetenciesSection";
import { SingleLineDiagramExplorer } from "@/components/visuals/SingleLineDiagramExplorer";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ContactForm } from "@/components/contact/ContactForm";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { siteConfig } from "@/config/site";
import { ArrowUpRight, Terminal, Mail, ShieldAlert, Cpu } from "lucide-react";

export function PageShell() {
  const [chatOpen, setChatOpen] = React.useState(false);

  return (
    <div className="relative flex min-h-screen flex-col bg-[#090a0f] text-[#f8fafc]">
      {/* Persistent Technical Navigation */}
      <Header />

      <main className="flex-1">
        {/* Scoped GSAP Signature Hero Section */}
        <Hero onOpenChat={() => setChatOpen(true)} />

        {/* Phase 02: Engineering Philosophy & Principles */}
        <PhilosophySection />

        {/* Phase 02: Technical Competencies Framework */}
        <CompetenciesSection />

        {/* Phase 04: Interactive Single-Line Diagram Explorer */}
        <section
          id="distribution-sld"
          className="relative border-t border-white/[0.08] bg-[#0c0e17] py-24 px-4 sm:px-6 lg:px-8"
          aria-label="Power Distribution SLD Explorer Section"
        >
          <div className="mx-auto max-w-7xl">
            <SingleLineDiagramExplorer />
          </div>
        </section>

        {/* Phase 02: Project Case-Study System */}
        <ProjectsSection />

        {/* Phase 04: Technical Communication & Direct Inquiries Section */}
        <section
          id="contact"
          className="relative border-t border-white/[0.08] bg-[#090a0f] py-24 px-4 sm:px-6 lg:px-8"
          aria-labelledby="contact-heading"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Context & Direct Contact Details */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-[#b4ff39]">
                    [ 05 // COMMUNICATION & TRANSMISSION ]
                  </span>
                  <h2
                    id="contact-heading"
                    className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#f8fafc]"
                  >
                    Technical Consultations & Systems Inquiries
                  </h2>
                  <p className="mt-4 text-sm text-[#94a3b8] leading-relaxed">
                    Available for technical discussions regarding industrial power distribution, motor control schematics, panel reviews, and high-performance digital architectures.
                  </p>
                </div>

                {/* Direct Mail Channel */}
                <div className="rounded-2xl border border-white/10 bg-[#111420] p-5 space-y-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748b] block">
                    Direct Electronic Mail:
                  </span>
                  <a
                    href={`mailto:${siteConfig.links.email}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#b4ff39] px-5 py-3 text-xs font-semibold text-[#090a0f] transition-all hover:bg-[#c4ff4d] shadow-[0_0_15px_rgba(180,255,57,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b4ff39]"
                  >
                    <Mail className="h-4 w-4" />
                    <span>{siteConfig.links.email}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>

                {/* AI Assistant Alternative Channel */}
                <div className="rounded-2xl border border-white/10 bg-[#111420] p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-[#b4ff39]" />
                    <span className="text-xs font-semibold text-[#f8fafc]">
                      Interactive Portfolio Assistant
                    </span>
                  </div>
                  <p className="text-xs text-[#94a3b8] leading-relaxed">
                    Instant inquiries regarding Dinaz&apos;s verified electrical competencies, curriculum scope, and architectural tenets.
                  </p>
                  <button
                    type="button"
                    onClick={() => setChatOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[#181c2b] px-4 py-2.5 text-xs font-medium text-[#f8fafc] transition-all hover:bg-[#202538] hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b4ff39]"
                  >
                    <Terminal className="h-4 w-4 text-[#b4ff39]" />
                    <span>Launch Assistant</span>
                  </button>
                </div>

                {/* Integrity Assurance Notice */}
                <div className="rounded-2xl border border-white/5 bg-[#111420]/40 p-4 text-[11px] font-mono text-[#64748b] leading-relaxed">
                  <ShieldAlert className="h-3.5 w-3.5 text-[#94a3b8] inline mr-1.5" />
                  All inquiries are transmitted via server-isolated endpoints with zero public logging of client emails or payloads.
                </div>
              </div>

              {/* Right Column: Secure Structured Contact Form */}
              <div className="lg:col-span-7">
                <ContactForm />
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
