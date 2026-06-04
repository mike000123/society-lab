import { ExternalLink } from "lucide-react";

import type { AccentTone, LearningEvidenceLink } from "@/lib/learn/modules";
import { cn } from "@/lib/utils";

const accentStyles: Record<
  AccentTone,
  {
    badge: string;
    chip: string;
    frame: string;
    icon: string;
  }
> = {
  amber: {
    badge: "border-amber-300 bg-amber-50 text-amber-700",
    chip: "border-amber-200 bg-amber-50/75 text-amber-700",
    frame: "border-amber-200/80 bg-amber-50/45",
    icon: "border-amber-200 bg-amber-50 text-amber-600",
  },
  cyan: {
    badge: "border-cyan-300 bg-cyan-50 text-cyan-700",
    chip: "border-cyan-200 bg-cyan-50/75 text-cyan-700",
    frame: "border-cyan-200/80 bg-cyan-50/45",
    icon: "border-cyan-200 bg-cyan-50 text-cyan-600",
  },
  emerald: {
    badge: "border-emerald-300 bg-emerald-50 text-emerald-700",
    chip: "border-emerald-200 bg-emerald-50/75 text-emerald-700",
    frame: "border-emerald-200/80 bg-emerald-50/45",
    icon: "border-emerald-200 bg-emerald-50 text-emerald-600",
  },
  rose: {
    badge: "border-rose-300 bg-rose-50 text-rose-700",
    chip: "border-rose-200 bg-rose-50/75 text-rose-700",
    frame: "border-rose-200/80 bg-rose-50/45",
    icon: "border-rose-200 bg-rose-50 text-rose-600",
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
    <section className="rounded-[1.9rem] border border-[rgba(28,36,48,0.08)] bg-white/76 p-5 shadow-[0_18px_40px_rgba(28,36,48,0.05)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl space-y-3">
          <span
            className={cn(
              "inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
              styles.badge,
            )}
          >
            Evidence and further exploration
          </span>
          <h2 className="atlas-display text-3xl leading-tight text-slate-900">Follow the strongest evidence trail</h2>
          <p className="atlas-copy text-sm">
            These references are included where the lesson benefits from real-world trend data, historical context, or
            a clearer empirical picture. They deepen the module without forcing the learner to start from scratch
            somewhere else.
          </p>
        </div>

        <div className={cn("rounded-[1.3rem] border px-4 py-3 text-sm leading-6 text-slate-700", styles.frame)}>
          Best used after the guided reading, when the learner already understands the argument and wants to see the
          evidence underneath it.
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {evidenceLinks.map((link) => (
          <article
            className="rounded-[1.6rem] border border-[rgba(28,36,48,0.08)] bg-white/88 p-5"
            key={link.url}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <span className={cn("inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]", styles.chip)}>
                  {link.source}
                </span>
                <div>
                  <h3 className="atlas-display text-2xl leading-tight text-slate-900">{link.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{link.note}</p>
                </div>
              </div>

              <a
                aria-label={`Open ${link.title}`}
                className={cn(
                  "inline-flex h-11 w-11 flex-none items-center justify-center rounded-full border transition hover:scale-[1.02]",
                  styles.icon,
                )}
                href={link.url}
                rel="noreferrer"
                target="_blank"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
