import type { AccentTone, LearningTimeline as LearningTimelineData } from "@/lib/learn/modules";
import { cn } from "@/lib/utils";
import { extractFirstSentence } from "@/components/learn/lesson-theme";

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

const eventCycle = [
  {
    chip: "border-blue-200 bg-blue-50 text-blue-700",
    date: "text-blue-600",
    dot: "bg-blue-500 shadow-[0_0_0_7px_rgba(59,130,246,0.12)]",
    frame: "border-blue-100 bg-blue-50/30",
  },
  {
    chip: "border-emerald-200 bg-emerald-50 text-emerald-700",
    date: "text-emerald-600",
    dot: "bg-emerald-500 shadow-[0_0_0_7px_rgba(76,175,80,0.12)]",
    frame: "border-emerald-100 bg-emerald-50/30",
  },
  {
    chip: "border-amber-200 bg-amber-50 text-amber-700",
    date: "text-amber-600",
    dot: "bg-amber-500 shadow-[0_0_0_7px_rgba(212,168,79,0.12)]",
    frame: "border-amber-100 bg-amber-50/30",
  },
  {
    chip: "border-violet-200 bg-violet-50 text-violet-700",
    date: "text-violet-600",
    dot: "bg-violet-500 shadow-[0_0_0_7px_rgba(139,92,246,0.12)]",
    frame: "border-violet-100 bg-violet-50/30",
  },
  {
    chip: "border-cyan-200 bg-cyan-50 text-cyan-700",
    date: "text-cyan-600",
    dot: "bg-cyan-500 shadow-[0_0_0_7px_rgba(6,182,212,0.12)]",
    frame: "border-cyan-100 bg-cyan-50/30",
  },
  {
    chip: "border-orange-200 bg-orange-50 text-orange-700",
    date: "text-orange-600",
    dot: "bg-orange-500 shadow-[0_0_0_7px_rgba(249,115,22,0.12)]",
    frame: "border-orange-100 bg-orange-50/30",
  },
] as const;

export function LearningTimeline({
  accent,
  compact = false,
  dense = false,
  timeline,
}: {
  accent: AccentTone;
  compact?: boolean;
  dense?: boolean;
  timeline: LearningTimelineData;
}) {
  const styles = accentClasses[accent];

  if (dense) {
    return (
      <div className="relative overflow-x-auto pb-2">
        <div className="relative min-w-[78rem] pt-6">
          <div className="absolute left-5 right-5 top-5 h-px bg-[rgba(28,36,48,0.14)]" />
          <div
            className="grid items-stretch gap-3"
            style={{ gridTemplateColumns: `repeat(${timeline.events.length}, minmax(12.25rem, 1fr))` }}
          >
            {timeline.events.map((event, index) => {
              const palette = eventCycle[index % eventCycle.length];
              return (
                <article className="relative flex h-full pt-1" id={index === 0 ? "timeline" : undefined} key={`${event.timeLabel}-${event.title}`}>
                  <div className="flex h-full w-full flex-col items-start">
                    <div className="flex items-center gap-2.5">
                      <div className={cn("h-3 w-3 rounded-full border-4 border-white", palette.dot)} />
                      <p className={cn("text-[1.02rem] font-semibold leading-none", palette.date)}>
                        {event.timeLabel}
                      </p>
                    </div>
                    <div className={cn("mt-3 flex min-h-[14.2rem] h-full w-full flex-col rounded-[1.35rem] border px-3.5 py-3.5 shadow-[0_12px_24px_rgba(28,36,48,0.04)]", palette.frame)}>
                      <h3 className="text-[1rem] font-semibold leading-tight text-slate-900">{event.title}</h3>
                      <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                        {event.family}
                      </p>
                      <p className="mt-2 text-[12.5px] leading-5 text-slate-600">{extractFirstSentence(event.whyItStarted)}</p>
                      <div className="mt-auto rounded-[0.95rem] border border-white/70 bg-white/72 px-3 py-2.5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Result</p>
                        <p className="mt-1 text-[11.5px] leading-5 text-slate-600">
                          {extractFirstSentence(event.outcome)}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-[1.9rem] border border-[rgba(28,36,48,0.08)] bg-white/76 p-5 shadow-[0_18px_40px_rgba(28,36,48,0.05)] sm:p-6">
      <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b", styles.glow)} />

      <div className="relative">
        {!compact ? (
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
        ) : (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900">{timeline.title}</h3>
            <p className="text-sm leading-7 text-slate-600">{timeline.intro}</p>
          </div>
        )}

        <div className="mt-8 hidden lg:block">
          <div className="relative overflow-x-auto pb-3">
            <div className="absolute left-6 right-6 top-[2.45rem] h-px bg-[rgba(28,36,48,0.14)]" />
            <div
              className="grid min-w-[70rem] gap-4"
              style={{ gridTemplateColumns: `repeat(${timeline.events.length}, minmax(0, 1fr))` }}
            >
              {timeline.events.map((event, index) => {
                const palette = eventCycle[index % eventCycle.length];
                return (
                  <article className="relative pt-2" key={`${event.timeLabel}-${event.title}`}>
                    <div className="flex flex-col items-center">
                      <span
                        className={cn(
                          "relative z-10 inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]",
                          palette.chip,
                        )}
                      >
                        {event.timeLabel}
                      </span>
                      <div className={cn("mt-4 h-4 w-4 rounded-full border-4 border-white", palette.dot)} />
                    </div>

                    <div className={cn("mt-4 rounded-[1.5rem] border px-4 py-4 shadow-[0_14px_30px_rgba(28,36,48,0.04)]", palette.frame)}>
                      <div className="space-y-3">
                        <div>
                          <h3 className="atlas-display text-[1.45rem] leading-tight text-slate-900">{event.title}</h3>
                          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{event.family}</p>
                        </div>

                        <div className="space-y-3 text-sm leading-7 text-slate-700">
                          <p>{event.whyItStarted}</p>
                          <div className="rounded-[1rem] bg-white/88 px-3 py-3">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Turning point</p>
                            <p className="mt-2 leading-6 text-slate-700">{event.turningPoint}</p>
                          </div>
                          <div className="rounded-[1rem] bg-white/88 px-3 py-3">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Outcome</p>
                            <p className="mt-2 leading-6 text-slate-700">{event.outcome}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-1">
                          {event.characteristics.map((characteristic) => (
                            <span
                              className="inline-flex rounded-full border border-[rgba(28,36,48,0.08)] bg-white/86 px-2.5 py-1 text-[11px] font-medium text-slate-600"
                              key={characteristic}
                            >
                              {characteristic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        <div className="relative mt-8 space-y-5 lg:hidden">
          <div className="absolute bottom-0 left-[1.05rem] top-2 w-px bg-[rgba(28,36,48,0.12)] sm:left-[9.15rem]" />

          {timeline.events.map((event, index) => {
            const palette = eventCycle[index % eventCycle.length];
            return (
              <article className="relative grid gap-4 sm:grid-cols-[8rem_1fr]" key={`${event.timeLabel}-${event.title}`}>
                <div className="pl-10 sm:pl-0">
                  <span
                    className={cn(
                      "inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]",
                      palette.chip,
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
                      palette.dot,
                    )}
                  />

                  <div className={cn("rounded-[1.6rem] border p-5", palette.frame)}>
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
