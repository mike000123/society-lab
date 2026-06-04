import type { AccentTone, LearningTimeline as LearningTimelineData } from "@/lib/learn/modules";
import { cn } from "@/lib/utils";

const accentClasses: Record<
  AccentTone,
  {
    badge: string;
    family: string;
    dot: string;
    event: string;
    glow: string;
  }
> = {
  amber: {
    badge: "border-amber-300 bg-amber-50 text-amber-700",
    family: "border-amber-200 bg-amber-50/70 text-amber-700",
    dot: "bg-amber-400 shadow-[0_0_0_6px_rgba(212,168,79,0.12)]",
    event: "border-amber-200/80 bg-amber-50/40",
    glow: "from-[rgba(212,168,79,0.12)] via-[rgba(212,168,79,0.04)] to-transparent",
  },
  cyan: {
    badge: "border-cyan-300 bg-cyan-50 text-cyan-700",
    family: "border-cyan-200 bg-cyan-50/70 text-cyan-700",
    dot: "bg-cyan-500 shadow-[0_0_0_6px_rgba(59,130,246,0.12)]",
    event: "border-cyan-200/80 bg-cyan-50/40",
    glow: "from-[rgba(59,130,246,0.12)] via-[rgba(59,130,246,0.04)] to-transparent",
  },
  emerald: {
    badge: "border-emerald-300 bg-emerald-50 text-emerald-700",
    family: "border-emerald-200 bg-emerald-50/70 text-emerald-700",
    dot: "bg-emerald-500 shadow-[0_0_0_6px_rgba(76,175,80,0.12)]",
    event: "border-emerald-200/80 bg-emerald-50/40",
    glow: "from-[rgba(76,175,80,0.12)] via-[rgba(76,175,80,0.04)] to-transparent",
  },
  rose: {
    badge: "border-rose-300 bg-rose-50 text-rose-700",
    family: "border-rose-200 bg-rose-50/70 text-rose-700",
    dot: "bg-rose-400 shadow-[0_0_0_6px_rgba(244,114,182,0.12)]",
    event: "border-rose-200/80 bg-rose-50/40",
    glow: "from-[rgba(244,114,182,0.12)] via-[rgba(244,114,182,0.04)] to-transparent",
  },
};

export function LearningTimeline({
  accent,
  timeline,
}: {
  accent: AccentTone;
  timeline: LearningTimelineData;
}) {
  const styles = accentClasses[accent];

  return (
    <section className="relative overflow-hidden rounded-[1.9rem] border border-[rgba(28,36,48,0.08)] bg-white/76 p-5 shadow-[0_18px_40px_rgba(28,36,48,0.05)] sm:p-6">
      <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b", styles.glow)} />

      <div className="relative">
        <div className="space-y-3">
          <span
            className={cn(
              "inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
              styles.badge,
            )}
          >
            Visual timeline
          </span>
          <h2 className="atlas-display text-3xl leading-tight text-slate-900">{timeline.title}</h2>
          <p className="atlas-copy max-w-4xl text-sm">{timeline.intro}</p>
        </div>

        <div className="relative mt-8 space-y-5">
          <div className="absolute bottom-0 left-[1.05rem] top-2 w-px bg-[rgba(28,36,48,0.12)] sm:left-[9.15rem]" />

          {timeline.events.map((event) => (
            <article className="relative grid gap-4 sm:grid-cols-[8rem_1fr]" key={`${event.timeLabel}-${event.title}`}>
              <div className="pl-10 sm:pl-0">
                <span
                  className={cn(
                    "inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]",
                    styles.badge,
                  )}
                >
                  {event.timeLabel}
                </span>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">{event.family}</p>
              </div>

              <div className="relative pl-10 sm:pl-0">
                <div
                  className={cn(
                    "absolute left-[0.68rem] top-3 h-4 w-4 rounded-full border-4 border-[rgba(246,244,238,1)] sm:left-[-2.35rem]",
                    styles.dot,
                  )}
                />

                <div className={cn("rounded-[1.6rem] border p-5", styles.event)}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="atlas-display text-2xl leading-tight text-slate-900">{event.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{event.whyItStarted}</p>
                    </div>
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
                        styles.family,
                      )}
                    >
                      {event.family}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {event.characteristics.map((characteristic) => (
                      <span
                        className="inline-flex rounded-full border border-[rgba(28,36,48,0.08)] bg-white/86 px-3 py-1 text-xs font-medium text-slate-600"
                        key={characteristic}
                      >
                        {characteristic}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-3 lg:grid-cols-2">
                    <div className="rounded-[1.25rem] border border-[rgba(28,36,48,0.08)] bg-white/86 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Turning point</p>
                      <p className="mt-2 text-sm leading-7 text-slate-700">{event.turningPoint}</p>
                    </div>
                    <div className="rounded-[1.25rem] border border-[rgba(28,36,48,0.08)] bg-white/86 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Outcome</p>
                      <p className="mt-2 text-sm leading-7 text-slate-700">{event.outcome}</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
