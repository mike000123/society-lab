import Link from "next/link";
import { ArrowRight, Clock3, Layers3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { AccentTone, LearningModule } from "@/lib/learn/modules";
import { cn } from "@/lib/utils";

const accentClasses: Record<AccentTone, { badge: string; glow: string; ring: string }> = {
  amber: {
    badge: "border-amber-300/25 bg-amber-400/10 text-amber-100",
    glow: "from-amber-400/18 via-amber-400/5 to-transparent",
    ring: "hover:border-amber-400/45",
  },
  cyan: {
    badge: "border-cyan-300/25 bg-cyan-400/10 text-cyan-100",
    glow: "from-cyan-400/18 via-cyan-400/5 to-transparent",
    ring: "hover:border-cyan-400/45",
  },
  emerald: {
    badge: "border-emerald-300/25 bg-emerald-400/10 text-emerald-100",
    glow: "from-emerald-400/18 via-emerald-400/5 to-transparent",
    ring: "hover:border-emerald-400/45",
  },
  rose: {
    badge: "border-rose-300/25 bg-rose-400/10 text-rose-100",
    glow: "from-rose-400/18 via-rose-400/5 to-transparent",
    ring: "hover:border-rose-400/45",
  },
};

export function LearnCard({ module }: { module: LearningModule }) {
  const accent = accentClasses[module.accent];

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[1.75rem] border border-slate-800 bg-panel/85 p-5 shadow-[0_18px_50px_rgba(2,8,23,0.28)] transition sm:p-6",
        accent.ring,
      )}
    >
      <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b", accent.glow)} />
      <div className="relative space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-medium", accent.badge)}>
            {module.eyebrow}
          </span>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" />
              {module.readingTime}
            </span>
            <span className="inline-flex items-center gap-1">
              <Layers3 className="h-3.5 w-3.5" />
              {module.difficulty}
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-50 sm:text-2xl">{module.title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">{module.summary}</p>
        </div>

        <div className="grid gap-2">
          {module.heroHighlights.slice(0, 2).map((highlight) => (
            <div
              className="rounded-2xl border border-slate-800 bg-slate-950/55 px-4 py-3 text-sm text-slate-300"
              key={highlight}
            >
              {highlight}
            </div>
          ))}
        </div>

        <Button asChild className="w-full justify-between rounded-2xl sm:w-auto">
          <Link href={`/learn/${module.slug}`}>
            Open module
            <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </div>
    </article>
  );
}

