import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold tracking-[0.02em]",
  {
    variants: {
      variant: {
        default: "bg-[var(--accent-subtle)] text-[var(--accent)]",
        secondary: "bg-white/70 text-[var(--text-secondary)]",
        warning: "bg-amber-100 text-amber-700",
        success: "bg-emerald-100 text-emerald-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
