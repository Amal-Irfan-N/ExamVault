import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default:
          "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30",
        secondary:
          "bg-[#1c2233] text-slate-300 border border-[#232a3e]",
        destructive:
          "bg-red-500/15 text-red-400 border border-red-500/30",
        success:
          "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
        warning:
          "bg-amber-500/15 text-amber-300 border border-amber-500/30",
        info:
          "bg-sky-500/15 text-sky-300 border border-sky-500/30",
        purple:
          "bg-purple-500/15 text-purple-300 border border-purple-500/30",
        outline:
          "border border-[#28324a] text-slate-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
