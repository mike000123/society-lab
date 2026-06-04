import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type InsightTone = "blue" | "gold" | "green" | "neutral";

const toneClasses: Record<InsightTone, string> = {
  blue: "border-[rgba(59,130,246,0.25)] bg-[rgba(59,130,246,0.08)]",
  gold: "border-[rgba(212,168,79,0.28)] bg-[rgba(212,168,79,0.1)]",
  green: "border-[rgba(76,175,80,0.26)] bg-[rgba(76,175,80,0.1)]",
  neutral: "border-[rgba(28,36,48,0.1)] bg-white/60 dark:border-slate-700 dark:bg-slate-900/60",
};

export function InsightBlock({
  className,
  description,
  icon,
  title,
  tone = "neutral",
}: {
  className?: string;
  description: ReactNode;
  icon?: ReactNode;
  title: string;
  tone?: InsightTone;
}) {
  return (
    <div className={cn("rounded-[1.6rem] border p-5", toneClasses[tone], className)}>
      <div className="flex items-start gap-3">
        {icon ? (
          <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-[rgba(28,36,48,0.12)] bg-white/80 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
            {icon}
          </div>
        ) : null}
        <div className="space-y-2">
          <h3 className="atlas-display text-2xl text-slate-900">{title}</h3>
          <div className="atlas-copy text-sm">{description}</div>
        </div>
      </div>
    </div>
  );
}
