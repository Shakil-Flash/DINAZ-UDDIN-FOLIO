import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 select-none disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b4ff39] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090a0f]";

    const variantStyles = {
      primary:
        "bg-[#b4ff39] text-[#090a0f] font-semibold hover:bg-[#c4ff4d] shadow-[0_0_20px_rgba(180,255,57,0.2)] hover:shadow-[0_0_25px_rgba(180,255,57,0.35)] active:scale-[0.98]",
      secondary:
        "bg-[#11141e] text-[#f8fafc] border border-white/10 hover:border-white/20 hover:bg-[#181c2b] active:scale-[0.98]",
      outline:
        "border border-[#b4ff39]/40 text-[#b4ff39] hover:bg-[#b4ff39]/10 active:scale-[0.98]",
      ghost:
        "text-[#94a3b8] hover:text-[#f8fafc] hover:bg-white/5 active:scale-[0.98]",
    };

    const sizeStyles = {
      sm: "h-8 px-3.5 text-xs rounded-md gap-1.5",
      md: "h-10 px-5 text-sm rounded-lg gap-2",
      lg: "h-12 px-7 text-base rounded-xl gap-2.5",
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
