"use client";

import * as React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Menu, X, ArrowUpRight } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#090a0f]/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Identity / Monogram */}
        <Link
          href="/#overview"
          className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b4ff39] rounded-md p-1"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-[#11141e] font-mono text-xs font-bold text-[#b4ff39] transition-all group-hover:border-[#b4ff39]/50 group-hover:shadow-[0_0_12px_rgba(180,255,57,0.2)]">
            DU
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-[#f8fafc] group-hover:text-white transition-colors">
              {siteConfig.name}
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#94a3b8]">
              {siteConfig.role}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-8">
          {siteConfig.navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs uppercase tracking-wider font-mono text-[#94a3b8] transition-colors hover:text-[#b4ff39] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b4ff39] rounded-sm py-1 px-1.5"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA & Status Badge */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#11141e] px-3 py-1 text-xs text-[#94a3b8]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#b4ff39] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#b4ff39]" />
            </span>
            <span className="font-mono text-[11px]">System Ready</span>
          </div>

          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#11141e] px-3.5 py-1.5 text-xs font-medium text-[#f8fafc] transition-all hover:border-white/20 hover:bg-[#181c2b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b4ff39]"
          >
            GitHub
            <ArrowUpRight className="h-3.5 w-3.5 text-[#94a3b8]" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-[#11141e] text-[#f8fafc] md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b4ff39]"
        >
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-white/10 bg-[#090a0f] px-4 py-6 md:hidden">
          <nav className="flex flex-col gap-4">
            {siteConfig.navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-mono uppercase tracking-wider text-[#94a3b8] hover:text-[#b4ff39] py-1"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg border border-white/10 bg-[#11141e] px-4 py-2.5 text-xs font-medium text-[#f8fafc]"
              >
                <span>GitHub Profile</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-[#94a3b8]" />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
