import { ExternalLink } from "lucide-react";

import type { AccentTone, LearningEvidenceLink } from "@/lib/learn/modules";
import { cn } from "@/lib/utils";

const accentStyles: Record<
  AccentTone,
  {
    badge: string;
    button: string;
  }
> = {
  amber: {
    badge: "border-amber-300/25 bg-amber-400/10 text-amber-100",
    button: "text-amber-200 hover:text-amber-100",
  },
  cyan: {
    badge: "border-cyan-300/25 bg-cyan-400/10 text-cyan-100",
    button: "text-cyan-200 hover:text-cyan-100",
  },
  emerald: {
    badge: "border-emerald-300/25 bg-emerald-400/10 text-emerald-100",
    button: "text-emerald-200 hover:text-emerald-100",
  },
  rose: {
    badge: "border-rose-300/25 bg-rose-400/10 text-rose-100",
    button: "text-rose-200 hover:text-rose-100",
  },
};

export function ModuleEvidencePanel({
  accent,
  evidenceLinks,
}: {
  accent: AccentTone;
  evidenceLinks: LearningEvidenceLink[];
}) {
  const styles = accentStyles[accent];

  return (
    <section className="rounded-[1.75rem] border border-slate-800 bg-panel/90 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-3xl">
          <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-medium", styles.badge)}>
            Evidence and further exploration
          </span>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            These links are attached where Our World in Data adds real evidence value to the lesson. They work best as the
            empirical layer under the explanation, not as a replacement for it.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {evidenceLinks.map((link) => (
          <article
            className="flex h-full flex-col rounded-[1.5rem] border border-slate-800 bg-slate-950/60 p-5"
            key={link.url}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{link.source}</p>
                <h2 className="mt-2 text-lg font-semibold text-slate-50">{link.title}</h2>
              </div>
              <a
                aria-label={`Open ${link.title}`}
                className={cn("inline-flex h-10 w-10 flex-none items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/70 transition", styles.button)}
                href={link.url}
                rel="noreferrer"
                target="_blank"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">{link.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
