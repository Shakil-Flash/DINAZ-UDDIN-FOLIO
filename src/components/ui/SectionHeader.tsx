import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center" | "split";
  badge?: React.ReactNode;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
  align = "split",
  badge,
}: SectionHeaderProps) {
  if (align === "split") {
    return (
      <div
        className={cn(
          "flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/[0.08] pb-8",
          className
        )}
      >
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-[#b4ff39] font-mono text-xs tracking-wider uppercase mb-2.5">
            <span>{eyebrow}</span>
            {badge}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#f8fafc]">
            {title}
          </h2>
        </div>

        {description && (
          <p className="text-xs sm:text-sm text-[#94a3b8] max-w-md leading-relaxed">
            {description}
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mb-12",
        align === "center" ? "text-center max-w-2xl mx-auto" : "max-w-2xl",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 text-[#b4ff39] font-mono text-xs tracking-wider uppercase mb-2.5",
          align === "center" ? "justify-center" : "justify-start"
        )}
      >
        <span>{eyebrow}</span>
        {badge}
      </div>
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#f8fafc]">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
