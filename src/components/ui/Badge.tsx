import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "lime" | "amber" | "neutral" | "outline";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "neutral",
  size = "sm",
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center font-mono font-medium rounded-full border transition-colors select-none";

  const variantStyles = {
    lime: "border-[#b4ff39]/30 bg-[#b4ff39]/10 text-[#b4ff39]",
    amber: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    neutral: "border-white/10 bg-[#161a29] text-[#94a3b8]",
    outline: "border-white/15 bg-transparent text-[#94a3b8]",
  };

  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-[10px] gap-1",
    md: "px-3 py-1 text-xs gap-1.5",
  };

  return (
    <span
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {children}
    </span>
  );
}
