import Link from "next/link";
import { ArrowRight, MessageSquare, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { AccentTone } from "@/lib/learn/modules";
import { cn, withQuery } from "@/lib/utils";

const accentGlow: Record<AccentTone, string> = {
  amber: "from-[rgba(212,168,79,0.14)] via-[rgba(212,168,79,0.05)] to-transparent",
  cyan: "from-[rgba(59,130,246,0.14)] via-[rgba(59,130,246,0.05)] to-transparent",
  emerald: "from-[rgba(76,175,80,0.14)] via-[rgba(76,175,80,0.05)] to-transparent",
  rose: "from-[rgba(244,114,182,0.14)] via-[rgba(244,114,182,0.05)] to-transparent",
};

const accentIcon: Record<AccentTone, string> = {
  amber: "border-amber-200 bg-amber-50 text-amber-600",
  cyan: "border-cyan-200 bg-cyan-50 text-cyan-600",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-600",
  rose: "border-rose-200 bg-rose-50 text-rose-600",
};

export function RelatedActions({
  accent,
  discussionPrompt,
  moduleSlug,
  simulationPrompt,
  simulatorSlug,
}: {
  accent: AccentTone;
  discussionPrompt: string;
  moduleSlug: string;
  simulationPrompt: string;
  simulatorSlug?: string;
}) {
  const simulatorBase = simulatorSlug ? `/simulator/${simulatorSlug}` : "/simulator";
  const simulationHref = withQuery(simulatorBase, {
    focus: simulationPrompt,
    module: moduleSlug,
  });
  const discussionHref = withQuery("/discussions", {
    module: moduleSlug,
    prompt: discussionPrompt,
  });

  return (
    <section className="rounded-[1.9rem] border border-[rgba(28,36,48,0.08)] bg-white/76 p-5 shadow-[0_18px_40px_rgba(28,36,48,0.05)] sm:p-6">
      <div className="space-y-3">
        <p className="atlas-kicker">Next actions</p>
        <h2 className="atlas-display text-3xl leading-tight text-slate-900">Turn the lesson into action</h2>
        <p className="atlas-copy max-w-4xl text-sm">
          The goal is not only to understand a system, but to test ideas inside it and talk about alternatives in a
          more structured way.
        </p>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <article className="relative overflow-hidden rounded-[1.6rem] border border-[rgba(28,36,48,0.08)] bg-white/88 p-5">
          <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b", accentGlow[accent])} />
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-full border", accentIcon[accent])}>
                <Play className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Simulation path</p>
                <p className="text-lg font-semibold text-slate-900">Test the idea in a model</p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-600">{simulationPrompt}</p>

            <Button asChild className="mt-5 rounded-full">
              <Link href={simulationHref}>
                Open simulator
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </article>

        <article className="relative overflow-hidden rounded-[1.6rem] border border-[rgba(28,36,48,0.08)] bg-white/88 p-5">
          <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b", accentGlow[accent])} />
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-full border", accentIcon[accent])}>
                <MessageSquare className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Discussion path</p>
                <p className="text-lg font-semibold text-slate-900">Bring the question into dialogue</p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-600">{discussionPrompt}</p>

            <Button asChild className="mt-5 rounded-full" variant="outline">
              <Link href={discussionHref}>
                Open discussion space
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </article>
      </div>
    </section>
  );
}
