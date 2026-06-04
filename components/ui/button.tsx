import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
  variants: {
    variant: {
      default:
        "bg-primary text-white shadow-[0_12px_30px_rgba(59,130,246,0.18)] hover:bg-blue-500 dark:text-slate-950 dark:hover:bg-blue-300",
      outline:
        "border border-[rgba(28,36,48,0.14)] bg-white/85 text-slate-800 hover:border-[rgba(28,36,48,0.24)] hover:bg-white dark:border-slate-700 dark:bg-panel dark:text-slate-100 dark:hover:bg-slate-800",
      ghost:
        "text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
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
