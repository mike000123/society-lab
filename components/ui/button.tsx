import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50", {
  variants: {
    variant: {
      default: "bg-primary text-slate-900 hover:bg-cyan-300",
      outline: "border border-slate-700 bg-panel text-slate-100 hover:bg-slate-800",
      ghost: "hover:bg-slate-800 text-slate-200"
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-8 px-3",
      lg: "h-11 px-8"
    }
  },
  defaultVariants: { variant: "default", size: "default" }
});

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
