import Link from "next/link";
import { MessageSquare, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { AccentTone } from "@/lib/learn/modules";
import { cn, withQuery } from "@/lib/utils";

const accentGlow: Record<AccentTone, string> = {
  amber: "from-amber-400/15 via-amber-400/5 to-transparent",
  cyan: "from-cyan-400/15 via-cyan-400/5 to-transparent",
  emerald: "from-emerald-400/15 via-emerald-400/5 to-transparent",
  rose: "from-rose-400/15 via-rose-400/5 to-transparent",
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
    <section className="rounded-[1.75rem] border border-slate-800 bg-panel/90 p-5 sm:p-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Next actions</p>
        <h2 className="text-2xl font-semibold text-slate-50">Turn the lesson into practice</h2>
        <p className="max-w-3xl text-sm leading-6 text-slate-300">
          Society Lab should move from explanation to experimentation and then into structured public dialogue.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <article className="relative overflow-hidden rounded-[1.5rem] border border-slate-800 bg-slate-950/65 p-5">
          <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b", accentGlow[accent])} />
          <div className="relative">
            <div className="flex items-center gap-2">
              <Play className="h-4 w-4 text-cyan-300" />
              <p className="font-semibold text-slate-50">Test this in simulation</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{simulationPrompt}</p>
            <Button asChild className="mt-5 rounded-2xl">
              <Link href={simulationHref}>Open simulator</Link>
            </Button>
          </div>
        </article>

        <article className="relative overflow-hidden rounded-[1.5rem] border border-slate-800 bg-slate-950/65 p-5">
          <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b", accentGlow[accent])} />
          <div className="relative">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-cyan-300" />
              <p className="font-semibold text-slate-50">Start structured discussion</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{discussionPrompt}</p>
            <Button asChild className="mt-5 rounded-2xl" variant="outline">
              <Link href={discussionHref}>Open discussion space</Link>
            </Button>
          </div>
        </article>
      </div>
    </section>
  );
}
