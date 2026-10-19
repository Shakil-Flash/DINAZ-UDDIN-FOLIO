"use client";

import * as React from "react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { prefersReducedMotion } from "@/components/animations/gsap-init";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight, Terminal, Zap, ShieldAlert, FileCode2, Layers } from "lucide-react";

interface HeroProps {
  onOpenChat?: () => void;
}

export function Hero({ onOpenChat }: HeroProps) {
  const containerRef = React.useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Respect prefers-reduced-motion preference immediately
      if (prefersReducedMotion()) {
        gsap.set(
          [
            ".hero-badge",
            ".hero-title",
            ".hero-description",
            ".hero-actions",
            ".hero-spec-card",
          ],
          { opacity: 1, y: 0 }
        );
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.65 },
      });

      tl.fromTo(
        ".hero-badge",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, delay: 0.1 }
      )
        .fromTo(
          ".hero-title",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0 },
          "-=0.4"
        )
        .fromTo(
          ".hero-description",
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0 },
          "-=0.4"
        )
        .fromTo(
          ".hero-actions",
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0 },
          "-=0.4"
        )
        .fromTo(
          ".hero-spec-card",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.08 },
          "-=0.3"
        );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="overview"
      className="relative flex min-h-[calc(100vh-4rem)] flex-col justify-center overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
      aria-labelledby="hero-heading"
    >
      {/* Background Architectural Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_35%,#000_70%,transparent_100%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-7xl">
        <div className="flex flex-col items-start gap-8 lg:max-w-4xl">
          {/* Eyebrow & Status Badge */}
          <div className="hero-badge flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#b4ff39]/30 bg-[#b4ff39]/10 px-3.5 py-1 text-xs font-mono font-medium text-[#b4ff39]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#b4ff39]" />
              {siteConfig.role.toUpperCase()}
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-[#64748b]">
              Phase 02 // Engineering Identity
            </span>
          </div>

          {/* Main Editorial Headline */}
          <div className="hero-title flex flex-col gap-2">
            <h1 id="hero-heading" className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="block text-[#f8fafc]">Electrical Engineering Rigor.</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#b4ff39] via-[#d7ff7d] to-[#f8fafc]">
                Disciplined Systems Architecture.
              </span>
            </h1>
          </div>

          {/* Positioning Statement */}
          <div className="hero-description max-w-2xl">
            <p className="text-lg leading-relaxed text-[#94a3b8] sm:text-xl">
              I am <strong className="font-semibold text-[#f8fafc]">{siteConfig.name}</strong>, an{" "}
              <span className="text-[#b4ff39] font-medium">{siteConfig.role}</span> dedicated to
              fundamental circuit principles, protective switchgear coordination, safe industrial installations,
              and disciplined technical execution.
            </p>
          </div>

          {/* Primary and Secondary Calls to Action */}
          <div className="hero-actions flex flex-wrap items-center gap-4 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                const target = document.getElementById("philosophy");
                target?.scrollIntoView({ behavior: "smooth" });
              }}
              className="gap-2"
            >
              <span>Explore Principles</span>
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={onOpenChat}
              className="gap-2"
            >
              <Terminal className="h-4 w-4 text-[#b4ff39]" />
              <span>Ask Assistant</span>
            </Button>
          </div>
        </div>

        {/* Engineering Specification Grid */}
        <div
          className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-8 border-t border-white/10"
        >
          <div className="hero-spec-card rounded-xl border border-white/10 bg-[#111420]/90 p-5 backdrop-blur-sm transition-all hover:border-[#b4ff39]/40 hover:bg-[#181c2b]">
            <div className="flex items-center gap-3 text-[#b4ff39]">
              <Zap className="h-5 w-5" />
              <span className="font-mono text-xs uppercase tracking-wider text-[#94a3b8]">
                Discipline
              </span>
            </div>
            <h3 className="mt-3 text-base font-semibold text-[#f8fafc]">
              Circuit Analysis
            </h3>
            <p className="mt-1 text-xs text-[#94a3b8] leading-relaxed">
              AC/DC network theory, star-delta configurations, transformer losses, and three-phase power calculations.
            </p>
          </div>

          <div className="hero-spec-card rounded-xl border border-white/10 bg-[#111420]/90 p-5 backdrop-blur-sm transition-all hover:border-[#b4ff39]/40 hover:bg-[#181c2b]">
            <div className="flex items-center gap-3 text-[#b4ff39]">
              <ShieldAlert className="h-5 w-5" />
              <span className="font-mono text-xs uppercase tracking-wider text-[#94a3b8]">
                Protection
              </span>
            </div>
            <h3 className="mt-3 text-base font-semibold text-[#f8fafc]">
              Safety & Earthing
            </h3>
            <p className="mt-1 text-xs text-[#94a3b8] leading-relaxed">
              Low-resistance grounding pits, equipotential bonding, breaker trip curve matching, and LOTO compliance.
            </p>
          </div>

          <div className="hero-spec-card rounded-xl border border-white/10 bg-[#111420]/90 p-5 backdrop-blur-sm transition-all hover:border-[#b4ff39]/40 hover:bg-[#181c2b]">
            <div className="flex items-center gap-3 text-[#b4ff39]">
              <FileCode2 className="h-5 w-5" />
              <span className="font-mono text-xs uppercase tracking-wider text-[#94a3b8]">
                Documentation
              </span>
            </div>
            <h3 className="mt-3 text-base font-semibold text-[#f8fafc]">
              SLDs & Schematics
            </h3>
            <p className="mt-1 text-xs text-[#94a3b8] leading-relaxed">
              Drafting single-line power flows, motor starter control loops, ferrule terminal maps, and bill of quantities.
            </p>
          </div>

          <div className="hero-spec-card rounded-xl border border-white/10 bg-[#111420]/90 p-5 backdrop-blur-sm transition-all hover:border-[#b4ff39]/40 hover:bg-[#181c2b]">
            <div className="flex items-center gap-3 text-[#b4ff39]">
              <Layers className="h-5 w-5" />
              <span className="font-mono text-xs uppercase tracking-wider text-[#94a3b8]">
                Architecture
              </span>
            </div>
            <h3 className="mt-3 text-base font-semibold text-[#f8fafc]">
              Digital Engineering
            </h3>
            <p className="mt-1 text-xs text-[#94a3b8] leading-relaxed">
              Next.js 16 with strict TypeScript, isolated GSAP motion, and streaming AI assistant capabilities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
