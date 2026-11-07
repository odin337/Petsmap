"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 focus-visible:ring-4 focus-visible:ring-[color:var(--color-ring)]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--accent)] px-5 py-3 text-white shadow-[var(--shadow-sm)] hover:-translate-y-0.5 hover:bg-[var(--accent-hover)] hover:shadow-[var(--shadow-md)]",
        secondary:
          "bg-white/70 px-5 py-3 text-[var(--text-primary)] shadow-[var(--shadow-sm)] hover:bg-white",
        outline:
          "border border-[var(--border)] bg-white/40 px-5 py-3 text-[var(--text-primary)] hover:bg-white/70",
        ghost:
          "px-3 py-2 text-[var(--accent)] hover:bg-[var(--accent-subtle)]",
        destructive:
          "bg-[var(--error)] px-5 py-3 text-white shadow-[var(--shadow-sm)] hover:opacity-90",
      },
      size: {
        default: "h-11",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "size-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { Button, buttonVariants };
