import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-system transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-accent-safe/15 text-accent-safe",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-accent-threat/15 text-accent-threat",
        outline: "text-foreground border-border-subtle",
        warning: "border-transparent bg-accent-warning/15 text-accent-warning",
        info: "border-transparent bg-accent-info/15 text-accent-info",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
