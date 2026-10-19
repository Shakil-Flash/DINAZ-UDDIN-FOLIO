"use client";

import * as React from "react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { ElectricalSchematic } from "@/components/visuals/ElectricalSchematic";
import { prefersReducedMotion } from "@/components/animations/gsap-init";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight, Terminal, Zap, ShieldCheck, Compass, CheckCircle2 } from "lucide-react";

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
            ".hero-eyebrow",
            ".hero-name",
            ".hero-role",
            ".hero-description",
            ".hero-actions",
            ".hero-telemetry",
            ".hero-schematic-wrapper",
          ],
          { opacity: 1, y: 0 }
        );
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.7 },
      });

      tl.fromTo(
        ".hero-eyebrow",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, delay: 0.1 }
      )
        .fromTo(
          ".hero-name",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0 },
          "-=0.4"
        )
        .fromTo(
          ".hero-role",
          { opacity: 0, y: 15 },
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
          ".hero-telemetry",
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0 },
          "-=0.3"
        )
        .fromTo(
          ".hero-schematic-wrapper",
          { opacity: 0, scale: 0.98, y: 25 },
          { opacity: 1, scale: 1, y: 0, duration: 0.8 },
          "-=0.6"
        );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="overview"
      className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
      aria-labelledby="hero-title"
    >
      {/* Background Technical Grid Overlay */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-7xl">
        {/* Asymmetrical Editorial Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typographic Power & Identity */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6">
            {/* Eyebrow & Status */}
            <div className="hero-eyebrow flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#b4ff39]/30 bg-[#b4ff39]/10 px-3.5 py-1 text-xs font-mono font-medium text-[#b4ff39]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#b4ff39]" />
                <span>PHASE 03 // ELECTRICAL IDENTITY</span>
              </span>
              <span className="text-xs font-mono uppercase tracking-widest text-[#64748b]">
                VERIFIED DESIGNATION
              </span>
            </div>

            {/* Dominant Editorial Name */}
            <div className="hero-name flex flex-col gap-1">
              <h1 id="hero-title" className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-[-0.03em] uppercase leading-[0.95]">
                <span className="block text-[#f8fafc]">DINAZ</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#b4ff39] via-[#d7ff7d] to-[#f8fafc]">
                  UDDIN
                </span>
              </h1>
            </div>

            {/* Exact Professional Designation */}
            <div className="hero-role flex items-center gap-3 border-y border-white/10 py-2.5 w-full max-w-xl">
              <Zap className="h-4 w-4 text-[#b4ff39] shrink-0" />
              <span className="font-mono text-sm sm:text-base font-semibold tracking-wider text-[#f8fafc] uppercase">
                {siteConfig.role}
              </span>
              <span className="text-white/20 ml-auto font-mono text-xs hidden sm:inline">
                415V 3Ø // 50Hz
              </span>
            </div>

            {/* Concise, Credible Positioning Statement */}
            <div className="hero-description max-w-xl">
              <p className="text-base sm:text-lg text-[#94a3b8] leading-relaxed">
                Dedicated to fundamental electrical circuit analysis, motor control switchgear,
                defensive safety standards, single-line documentation, and disciplined digital platforms.
              </p>
            </div>

            {/* Primary & Secondary Calls to Action */}
            <div className="hero-actions flex flex-wrap items-center gap-4 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  const target = document.getElementById("projects");
                  target?.scrollIntoView({ behavior: "smooth" });
                }}
                className="gap-2"
              >
                <span>View Engineering Projects</span>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={onOpenChat}
                className="gap-2"
              >
                <Terminal className="h-4 w-4 text-[#b4ff39]" />
                <span>Consult Portfolio Assistant</span>
              </Button>
            </div>

            {/* Engineering Discipline Telemetry Strip */}
            <div className="hero-telemetry mt-4 flex flex-wrap items-center gap-6 text-xs font-mono text-[#64748b] border-t border-white/5 pt-6 w-full">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#b4ff39]" />
                <span className="text-[#94a3b8]">Ohmic & Kirchhoff Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-[#b4ff39]" />
                <span className="text-[#94a3b8]">Low-Z Protective Earthing</span>
              </div>
              <div className="flex items-center gap-2">
                <Compass className="h-3.5 w-3.5 text-[#b4ff39]" />
                <span className="text-[#94a3b8]">IEC / ANSI Schematics</span>
              </div>
            </div>
          </div>

          {/* Right Column: Original Electrical Visualization */}
          <div className="lg:col-span-5 hero-schematic-wrapper w-full">
            <ElectricalSchematic />
          </div>
        </div>
      </div>
    </section>
  );
}
