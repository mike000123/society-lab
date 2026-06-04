import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type SoftTone = "neutral" | "blue" | "gold" | "green";

const toneStyles: Record<SoftTone, string> = {
  blue: "border-[rgba(59,130,246,0.16)]",
  gold: "border-[rgba(212,168,79,0.26)]",
  green: "border-[rgba(76,175,80,0.22)]",
  neutral: "",
};

export function SoftPanel({
  children,
  className,
  tone = "neutral",
  ...props
}: HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  tone?: SoftTone;
}) {
  return (
    <section className={cn("atlas-panel rounded-[2rem] p-5 sm:p-7", toneStyles[tone], className)} {...props}>
      {children}
    </section>
  );
}
