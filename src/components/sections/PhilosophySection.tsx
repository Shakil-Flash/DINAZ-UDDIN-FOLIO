"use client";

import * as React from "react";
import { engineeringPrinciples } from "@/config/philosophy";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { prefersReducedMotion } from "@/components/animations/gsap-init";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Shield, GitBranch, Cpu, Compass, CheckCircle2 } from "lucide-react";

export function PhilosophySection() {
  const containerRef = React.useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const items = gsap.utils.toArray<HTMLElement>(".philosophy-card");
      if (items.length === 0) return;

      gsap.fromTo(
        items,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    },
    { scope: containerRef }
  );

  const getPrincipleIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Shield className="h-4 w-4 text-[#b4ff39]" />;
      case 1:
        return <GitBranch className="h-4 w-4 text-[#b4ff39]" />;
      case 2:
        return <Compass className="h-4 w-4 text-[#b4ff39]" />;
      case 3:
      default:
        return <Cpu className="h-4 w-4 text-[#b4ff39]" />;
    }
  };

  return (
    <section
      ref={containerRef}
      id="philosophy"
      className="relative border-t border-white/[0.08] bg-[#0c0e17] py-24 px-4 sm:px-6 lg:px-8"
      aria-labelledby="philosophy-title"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="[ 02 // ENGINEERING PRINCIPLES ]"
          title="Engineering Philosophy & Operating Tenets"
          description="Disciplined practices guiding electrical systems analysis, protective coordination, and technical execution."
        />

        {/* Asymmetric Editorial Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Context & Schematic Anchor */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#111420]/90 p-6 backdrop-blur-sm">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#b4ff39] block mb-2">
                Operational Framework
              </span>
              <h3 className="text-lg font-semibold text-[#f8fafc] mb-3">
                First-Principles Rigor
              </h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed mb-6">
                In electrical engineering, theoretical formulas translate directly into physical safety and operational longevity. Every system must be designed defensively and verified methodically.
              </p>

              {/* Minimal Schematic Graphic Accent */}
              <div
                className="relative h-28 w-full rounded-xl border border-white/10 bg-[#090a0f] p-4 flex flex-col justify-between font-mono text-[10px] text-[#64748b] select-none"
                aria-hidden="true"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[#b4ff39]">BUS_A // 415V 3Ø</span>
                  <span className="h-2 w-2 rounded-full bg-[#b4ff39] shadow-[0_0_8px_rgba(180,255,57,0.8)]" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-[#b4ff39] to-white/20" />
                  <span className="px-1.5 py-0.5 rounded border border-white/10 text-white/60">
                    MCCB_01
                  </span>
                  <div className="h-[1px] flex-1 bg-white/20" />
                </div>
                <div className="flex items-center justify-between text-[9px]">
                  <span>ISOLATION: VERIFIED</span>
                  <span className="text-[#94a3b8]">EARTH: &lt; 1.0Ω</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#111420]/40 p-5 text-xs text-[#64748b]">
              <p className="leading-relaxed">
                <strong className="text-[#94a3b8]">Presentation Note:</strong> These tenets represent foundational engineering principles applicable to electrical systems infrastructure and technical problem-solving.
              </p>
            </div>
          </div>

          {/* Right Column: Staggered Principles Stack */}
          <div className="lg:col-span-8 space-y-6">
            {engineeringPrinciples.map((principle, index) => (
              <article
                key={principle.id}
                className="philosophy-card rounded-2xl border border-white/10 bg-[#111420] p-6 sm:p-8 transition-all hover:border-[#b4ff39]/30 hover:bg-[#151928]"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#b4ff39]/30 bg-[#b4ff39]/10">
                      {getPrincipleIcon(index)}
                    </div>
                    <span className="font-mono text-xs font-semibold text-[#b4ff39]">
                      PHASE // {principle.number}
                    </span>
                  </div>
                  <span className="font-mono text-2xl font-light text-white/20">
                    {principle.number}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#f8fafc] mb-1">
                  {principle.title}
                </h3>
                <p className="text-xs font-mono text-[#b4ff39] mb-4">
                  {principle.tagline}
                </p>

                <p className="text-sm text-[#94a3b8] leading-relaxed mb-6">
                  {principle.description}
                </p>

                {/* Practical Application Callout */}
                <div className="rounded-xl border border-white/10 bg-[#090a0f]/80 p-4 mb-5">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#f8fafc] mb-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#b4ff39]" />
                    <span>Practical Engineering Implementation:</span>
                  </div>
                  <p className="text-xs text-[#94a3b8] leading-relaxed pl-5.5">
                    {principle.practicalApplication}
                  </p>
                </div>

                {/* Key Aspects Tags */}
                <div className="flex flex-wrap items-center gap-2">
                  {principle.keyAspects.map((aspect) => (
                    <span
                      key={aspect}
                      className="rounded-md border border-white/10 bg-[#181c2b] px-2.5 py-1 text-[11px] font-mono text-[#94a3b8]"
                    >
                      {aspect}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
