"use client";

import { useMemo, useState } from "react";

import type {
  AccentTone,
  MiniLessonConfig,
  MiniLessonMetric,
  StaticMiniLesson,
} from "@/lib/learn/modules";
import { cn } from "@/lib/utils";

function isStaticMiniLesson(
  lesson: MiniLessonConfig | StaticMiniLesson,
): lesson is StaticMiniLesson {
  return "conclusion" in lesson;
}

const toneClasses: Record<
  AccentTone,
  {
    badge: string;
    fill: string;
    insight: string;
    metric: string;
    value: string;
    accentColor: string;
  }
> = {
  amber: {
    badge: "border-amber-300 bg-amber-50 text-amber-700",
    fill: "from-amber-400 to-amber-300",
    insight: "border-amber-200 bg-amber-50/75",
    metric: "border-amber-200/70 bg-amber-50/35",
    value: "text-amber-700",
    accentColor: "#D4A84F",
  },
  cyan: {
    badge: "border-cyan-300 bg-cyan-50 text-cyan-700",
    fill: "from-cyan-500 to-blue-500",
    insight: "border-cyan-200 bg-cyan-50/75",
    metric: "border-cyan-200/70 bg-cyan-50/35",
    value: "text-cyan-700",
    accentColor: "#3B82F6",
  },
  emerald: {
    badge: "border-emerald-300 bg-emerald-50 text-emerald-700",
    fill: "from-emerald-500 to-green-500",
    insight: "border-emerald-200 bg-emerald-50/75",
    metric: "border-emerald-200/70 bg-emerald-50/35",
    value: "text-emerald-700",
    accentColor: "#4CAF50",
  },
  rose: {
    badge: "border-rose-300 bg-rose-50 text-rose-700",
    fill: "from-rose-400 to-orange-400",
    insight: "border-rose-200 bg-rose-50/75",
    metric: "border-rose-200/70 bg-rose-50/35",
    value: "text-rose-700",
    accentColor: "#C46A6A",
  },
};

type ComputedMetric = MiniLessonMetric & { fill: number; value: number };

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function formatMetricValue(metric: ComputedMetric) {
  return `${Math.round(metric.value * 10) / 10}${metric.suffix ?? ""}`;
}

function computeMetric(metric: MiniLessonMetric, sliderValue: number): ComputedMetric {
  const value = clamp(metric.base + metric.slope * sliderValue, metric.min, metric.max);
  const fill = ((value - metric.min) / (metric.max - metric.min || 1)) * 100;
  return { ...metric, fill, value };
}

function InteractiveMiniLesson({
  accent,
  compact = false,
  lesson,
}: {
  accent: AccentTone;
  compact?: boolean;
  lesson: MiniLessonConfig;
}) {
  const [sliderValue, setSliderValue] = useState(lesson.defaultValue);
  const styles = toneClasses[accent];

  const metrics = useMemo(
    () => lesson.metrics.map((metric) => computeMetric(metric, sliderValue)),
    [lesson.metrics, sliderValue],
  );

  const activeInsight =
    [...lesson.bands]
      .sort((l, r) => l.threshold - r.threshold)
      .filter((band) => sliderValue >= band.threshold)
      .at(-1)?.insight ?? lesson.bands[0]?.insight;

  return (
    <section
      className={cn(
        "rounded-[1.9rem] border border-[rgba(28,36,48,0.08)] bg-white/76 p-5 shadow-[0_18px_40px_rgba(28,36,48,0.05)] sm:p-6",
        compact ? "shadow-none" : "",
      )}
    >
      {!compact ? (
        <div className="space-y-3">
          <span
            className={cn(
              "inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
              styles.badge,
            )}
          >
            Interactive mini lesson
          </span>
          <h2 className="atlas-display text-3xl leading-tight text-slate-900">{lesson.title}</h2>
          <p className="atlas-copy max-w-4xl text-sm">{lesson.description}</p>
        </div>
      ) : (
        <div className="space-y-2">
          <h3 className="text-[1.2rem] font-semibold text-slate-900">{lesson.title}</h3>
          <p className="text-[1.02rem] leading-8 text-slate-600">{lesson.description}</p>
        </div>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="rounded-[1.7rem] border border-[rgba(28,36,48,0.08)] bg-[linear-gradient(180deg,rgba(251,253,255,0.96),rgba(241,245,249,0.9))] p-5">
          <p className="text-[1.02rem] leading-8 text-slate-600">{lesson.prompt}</p>

          <div className="mt-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-[0.98rem] font-semibold tracking-[0.02em] text-slate-700">{lesson.sliderLabel}</p>
              <p className="mt-2 atlas-display text-5xl leading-none text-slate-900">
                {sliderValue}
                <span className="text-3xl">{lesson.unit ?? ""}</span>
              </p>
            </div>
            <div className="text-right text-[0.94rem] text-slate-500">
              <div>{lesson.lowLabel}</div>
              <div className="mt-1">{lesson.highLabel}</div>
            </div>
          </div>

          <input
            className="mt-6 h-2 w-full cursor-pointer appearance-none rounded-full bg-[rgba(28,36,48,0.12)]"
            max={lesson.valueMax}
            min={lesson.valueMin}
            onChange={(e) => setSliderValue(Number(e.target.value))}
            step={lesson.step}
            style={{ accentColor: styles.accentColor }}
            type="range"
            value={sliderValue}
          />

          <div className="mt-2 flex justify-between text-[0.94rem] text-slate-500">
            <span>
              {lesson.valueMin}
              {lesson.unit ?? ""}
            </span>
            <span>
              {lesson.valueMax}
              {lesson.unit ?? ""}
            </span>
          </div>

          <div className={cn("mt-6 rounded-[1.35rem] border px-4 py-4", styles.insight)}>
            <p className="text-[0.98rem] font-semibold tracking-[0.02em] text-slate-700">What changes here</p>
            <p className="mt-2 text-[1.02rem] leading-8 text-slate-700">{activeInsight}</p>
          </div>
        </div>

        <div className="space-y-3">
          {metrics.map((metric) => {
            const tone = toneClasses[metric.tone];
            return (
              <article className={cn("rounded-[1.45rem] border p-4", tone.metric)} key={metric.key}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[1.02rem] font-semibold text-slate-900">{metric.label}</p>
                    <p className="mt-1 text-[0.98rem] leading-7 text-slate-600">{metric.description}</p>
                  </div>
                  <span className={cn("text-[1.35rem] font-semibold", tone.value)}>{formatMetricValue(metric)}</span>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[rgba(28,36,48,0.12)]">
                  <div
                    className={cn("h-full rounded-full bg-gradient-to-r", tone.fill)}
                    style={{ width: `${metric.fill}%` }}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function signalColor(signal: string): string {
  const lower = signal.toLowerCase();
  if (lower.includes("rising") || lower.includes("bubble") || lower.includes("warning")) return "text-rose-700";
  if (lower.includes("falling") || lower.includes("collaps") || lower.includes("crisis")) return "text-amber-700";
  if (lower.includes("stable") || lower.includes("recover")) return "text-emerald-700";
  return "text-slate-700";
}

function StaticMiniLessonCard({
  accent,
  compact = false,
  lesson,
}: {
  accent: AccentTone;
  compact?: boolean;
  lesson: StaticMiniLesson;
}) {
  const styles = toneClasses[accent];

  return (
    <section
      className={cn(
        "rounded-[1.9rem] border border-[rgba(28,36,48,0.08)] bg-white/76 p-5 shadow-[0_18px_40px_rgba(28,36,48,0.05)] sm:p-6",
        compact ? "shadow-none" : "",
      )}
    >
      {!compact ? (
        <div className="space-y-3">
          <span
            className={cn(
              "inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
              styles.badge,
            )}
          >
            Mini lesson
          </span>
          <h2 className="atlas-display text-3xl leading-tight text-slate-900">{lesson.title}</h2>
          <p className="atlas-copy max-w-4xl text-sm">{lesson.subtitle}</p>
        </div>
      ) : (
        <div className="space-y-2">
          <h3 className="text-[1.2rem] font-semibold text-slate-900">{lesson.title}</h3>
          <p className="text-[1.02rem] leading-8 text-slate-600">{lesson.subtitle}</p>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {lesson.metrics.map((metric) => (
          <article className="rounded-[1.45rem] border border-[rgba(28,36,48,0.08)] bg-white/88 p-4" key={metric.label}>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem_14rem] lg:items-start">
              <div>
                <p className="text-[1.02rem] font-semibold text-slate-900">{metric.label}</p>
                <p className="mt-2 text-[0.98rem] leading-8 text-slate-600">{metric.description}</p>
              </div>
              <div className="rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(241,245,249,0.84)] px-4 py-3">
                <p className="text-[0.94rem] font-semibold tracking-[0.02em] text-slate-700">Low</p>
                <p className="mt-2 text-[1rem] font-semibold text-slate-800">{metric.low}</p>
              </div>
              <div className="rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(241,245,249,0.84)] px-4 py-3">
                <p className="text-[0.94rem] font-semibold tracking-[0.02em] text-slate-700">High</p>
                <p className="mt-2 text-[1rem] font-semibold text-slate-800">{metric.high}</p>
                <p className={cn("mt-3 text-[0.9rem] font-semibold uppercase tracking-[0.12em]", signalColor(metric.signal))}>
                  {metric.signal}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className={cn("mt-5 rounded-[1.4rem] border px-4 py-4", styles.insight)}>
        <p className="text-[0.98rem] font-semibold tracking-[0.02em] text-slate-700">Takeaway</p>
        <p className="mt-2 text-[1.02rem] leading-8 text-slate-700">{lesson.conclusion}</p>
      </div>
    </section>
  );
}

export function MiniLesson({
  accent,
  compact = false,
  lesson,
}: {
  accent: AccentTone;
  compact?: boolean;
  lesson: MiniLessonConfig | StaticMiniLesson;
}) {
  if (isStaticMiniLesson(lesson)) {
    return <StaticMiniLessonCard accent={accent} compact={compact} lesson={lesson} />;
  }
  return <InteractiveMiniLesson accent={accent} compact={compact} lesson={lesson} />;
}
