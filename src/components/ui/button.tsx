import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-indigo-600 text-white shadow hover:bg-indigo-500 active:bg-indigo-700",
        destructive:
          "bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30",
        outline:
          "border border-[#232a3e] bg-[#121620] text-slate-200 hover:bg-[#1a2030] hover:text-white",
        secondary:
          "bg-[#1c2233] text-slate-200 hover:bg-[#252e44] border border-[#232a3e]",
        ghost:
          "text-slate-400 hover:text-slate-100 hover:bg-[#181d2c]",
        link:
          "text-indigo-400 underline-offset-4 hover:underline",
        accent:
          "bg-blue-600 text-white shadow hover:bg-blue-500 active:bg-blue-700",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-lg px-6 text-base",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
