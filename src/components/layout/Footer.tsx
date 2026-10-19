import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="mt-auto border-t border-white/[0.08] bg-[#090a0f] py-12 text-[#94a3b8]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-semibold tracking-wider text-[#f8fafc]">
                {siteConfig.name.toUpperCase()}
              </span>
              <span className="text-white/20">/</span>
              <span className="font-mono text-xs uppercase tracking-wider text-[#b4ff39]">
                {siteConfig.role}
              </span>
            </div>
            <p className="text-xs text-[#64748b] max-w-md">
              Disciplined electrical engineering execution, rigorous circuit safety standards, and resilient technical systems.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
            {siteConfig.navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-[#b4ff39] transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={`mailto:${siteConfig.links.email}`}
              className="text-[#b4ff39] hover:underline"
            >
              {siteConfig.links.email}
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5 pt-8 text-[11px] font-mono text-[#64748b]">
          <p>© {currentYear} {siteConfig.name}. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Next.js App Router</span>
            <span>•</span>
            <span>TypeScript Strict</span>
            <span>•</span>
            <span>Tailwind CSS</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
