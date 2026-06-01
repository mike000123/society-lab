import type { AccentTone, LearningTimeline as LearningTimelineData } from "@/lib/learn/modules";
import { cn } from "@/lib/utils";

const accentClasses: Record<
  AccentTone,
  {
    badge: string;
    border: string;
    dot: string;
    glow: string;
  }
> = {
  amber: {
    badge: "border-amber-300/25 bg-amber-400/10 text-amber-100",
    border: "border-amber-300/20",
    dot: "bg-amber-300 shadow-[0_0_18px_rgba(252,211,77,0.35)]",
    glow: "from-amber-400/12 via-amber-400/5 to-transparent",
  },
  cyan: {
    badge: "border-cyan-300/25 bg-cyan-400/10 text-cyan-100",
    border: "border-cyan-300/20",
    dot: "bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.35)]",
    glow: "from-cyan-400/12 via-cyan-400/5 to-transparent",
  },
  emerald: {
    badge: "border-emerald-300/25 bg-emerald-400/10 text-emerald-100",
    border: "border-emerald-300/20",
    dot: "bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.35)]",
    glow: "from-emerald-400/12 via-emerald-400/5 to-transparent",
  },
  rose: {
    badge: "border-rose-300/25 bg-rose-400/10 text-rose-100",
    border: "border-rose-300/20",
    dot: "bg-rose-300 shadow-[0_0_18px_rgba(253,164,175,0.35)]",
    glow: "from-rose-400/12 via-rose-400/5 to-transparent",
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
    <section className="relative overflow-hidden rounded-[1.75rem] border border-slate-800 bg-panel/90 p-5 sm:p-6">
      <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b", styles.glow)} />
      <div className="relative">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Visual timeline</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-50">{timeline.title}</h2>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">{timeline.intro}</p>

        <div className="relative mt-8 space-y-5">
          <div className="absolute bottom-0 left-[1.1rem] top-2 w-px bg-slate-800 sm:left-[9.25rem]" />
          {timeline.events.map((event) => (
            <article className="relative grid gap-4 sm:grid-cols-[8rem_1fr]" key={`${event.timeLabel}-${event.title}`}>
              <div className="pl-10 sm:pl-0">
                <span
                  className={cn(
                    "inline-flex rounded-full border px-3 py-1 text-xs font-medium",
                    styles.badge,
                  )}
                >
                  {event.timeLabel}
                </span>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">{event.family}</p>
              </div>

              <div className="relative pl-10 sm:pl-0">
                <div
                  className={cn(
                    "absolute left-[1.03rem] top-3 h-3.5 w-3.5 rounded-full border-2 border-slate-950 sm:left-[-2.18rem]",
                    styles.dot,
                  )}
                />
                <div className={cn("rounded-[1.5rem] border bg-slate-950/60 p-5", styles.border)}>
                  <h3 className="text-lg font-semibold text-slate-50">{event.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{event.whyItStarted}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {event.characteristics.map((characteristic) => (
                      <span
                        className="inline-flex rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs font-medium text-slate-200"
                        key={characteristic}
                      >
                        {characteristic}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 grid gap-3 lg:grid-cols-2">
                    <div className="rounded-2xl border border-slate-800 bg-panel/80 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Turning point</p>
                      <p className="mt-2 text-sm leading-6 text-slate-200">{event.turningPoint}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-panel/80 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Outcome</p>
                      <p className="mt-2 text-sm leading-6 text-slate-200">{event.outcome}</p>
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
