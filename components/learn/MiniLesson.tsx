"use client";

import { useMemo, useState } from "react";

import type {
  AccentTone,
  MiniLessonConfig,
  MiniLessonMetric,
  StaticMiniLesson,
} from "@/lib/learn/modules";
import { cn } from "@/lib/utils";

// ─── Type guard ───────────────────────────────────────────────────────────────
function isStaticMiniLesson(
  lesson: MiniLessonConfig | StaticMiniLesson,
): lesson is StaticMiniLesson {
  return "conclusion" in lesson;
}

// ─── Shared accent map ────────────────────────────────────────────────────────
const toneClasses: Record<AccentTone, { bar: string; glow: string; text: string }> = {
  amber:   { bar: "from-amber-400 to-amber-300",   glow: "bg-amber-400/10",  text: "text-amber-100"  },
  cyan:    { bar: "from-cyan-400 to-blue-400",      glow: "bg-cyan-400/10",   text: "text-cyan-100"   },
  emerald: { bar: "from-emerald-400 to-teal-300",   glow: "bg-emerald-400/10",text: "text-emerald-100"},
  rose:    { bar: "from-rose-400 to-orange-300",    glow: "bg-rose-400/10",   text: "text-rose-100"   },
};

// ─── Interactive (slider) variant ─────────────────────────────────────────────
type ComputedMetric = MiniLessonMetric & { fill: number; value: number };

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function formatMetricValue(metric: ComputedMetric) {
  return `${Math.round(metric.value * 10) / 10}${metric.suffix ?? ""}`;
}

function computeMetric(metric: MiniLessonMetric, sliderValue: number): ComputedMetric {
  const value = clamp(metric.base + metric.slope * sliderValue, metric.min, metric.max);
  const fill  = ((value - metric.min) / (metric.max - metric.min || 1)) * 100;
  return { ...metric, fill, value };
}

function InteractiveMiniLesson({
  accent,
  lesson,
}: {
  accent: AccentTone;
  lesson: MiniLessonConfig;
}) {
  const [sliderValue, setSliderValue] = useState(lesson.defaultValue);

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
    <section className="rounded-[1.75rem] border border-slate-800 bg-panel/90 p-5 sm:p-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Interactive mini lesson</p>
        <h2 className="text-2xl font-semibold text-slate-50">{lesson.title}</h2>
        <p className="max-w-3xl text-sm leading-6 text-slate-300">{lesson.description}</p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/65 p-5">
          <p className="text-sm text-slate-300">{lesson.prompt}</p>
          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{lesson.sliderLabel}</p>
              <p className="mt-2 text-4xl font-black text-slate-50">
                {sliderValue}{lesson.unit ?? ""}
              </p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <div>{lesson.lowLabel}</div>
              <div className="mt-1">{lesson.highLabel}</div>
            </div>
          </div>
          <input
            className="mt-5 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-cyan-400"
            max={lesson.valueMax}
            min={lesson.valueMin}
            onChange={(e) => setSliderValue(Number(e.target.value))}
            step={lesson.step}
            type="range"
            value={sliderValue}
          />
          <div className="mt-2 flex justify-between text-xs text-slate-500">
            <span>{lesson.valueMin}{lesson.unit ?? ""}</span>
            <span>{lesson.valueMax}{lesson.unit ?? ""}</span>
          </div>
          <div className={cn("mt-5 rounded-2xl border border-slate-800 p-4 text-sm leading-6 text-slate-200", toneClasses[accent].glow)}>
            {activeInsight}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {metrics.map((metric) => {
            const tone = toneClasses[metric.tone];
            return (
              <article
                className="rounded-[1.5rem] border border-slate-800 bg-slate-950/65 p-5"
                key={metric.key}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-50">{metric.label}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">{metric.description}</p>
                  </div>
                  <span className={cn("text-sm font-semibold", tone.text)}>{formatMetricValue(metric)}</span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={cn("h-full rounded-full bg-gradient-to-r", tone.bar)}
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

// ─── Static (comparison table) variant ────────────────────────────────────────
const SIGNAL_COLOR: Record<string, string> = {
  rising:  "text-rose-300",
  falling: "text-emerald-300",
  stable:  "text-slate-300",
};

function signalColor(signal: string): string {
  const lower = signal.toLowerCase();
  if (lower.includes("rising") || lower.includes("bubble") || lower.includes("warning")) return "text-rose-300";
  if (lower.includes("falling") || lower.includes("collaps") || lower.includes("crisis")) return "text-amber-300";
  if (lower.includes("stable") || lower.includes("recover")) return "text-emerald-300";
  return "text-slate-300";
}

function StaticMiniLessonCard({
  accent,
  lesson,
}: {
  accent: AccentTone;
  lesson: StaticMiniLesson;
}) {
  const tone = toneClasses[accent];

  return (
    <section className="rounded-[1.75rem] border border-slate-800 bg-panel/90 p-5 sm:p-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Mini lesson</p>
        <h2 className="text-2xl font-semibold text-slate-50">{lesson.title}</h2>
        <p className="max-w-3xl text-sm leading-6 text-slate-300">{lesson.subtitle}</p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {lesson.metrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-[1.5rem] border border-slate-800 bg-slate-950/65 p-4"
          >
            <p className="text-sm font-semibold text-slate-50">{metric.label}</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">{metric.description}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-2.5 py-2">
                <p className="text-[10px] uppercase tracking-[0.14em] text-slate-600">Low</p>
                <p className="mt-1 font-semibold text-slate-200">{metric.low}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-2.5 py-2">
                <p className="text-[10px] uppercase tracking-[0.14em] text-slate-600">High</p>
                <p className="mt-1 font-semibold text-slate-200">{metric.high}</p>
              </div>
            </div>
            <p className={cn("mt-2 text-xs font-medium", signalColor(metric.signal))}>
              {metric.signal}
            </p>
          </article>
        ))}
      </div>

      <div className={cn("mt-5 rounded-2xl border border-slate-800 p-4 text-sm leading-6 text-slate-200", tone.glow)}>
        <span className="mr-2 text-xs uppercase tracking-[0.18em] text-slate-500">Takeaway</span>
        {lesson.conclusion}
      </div>
    </section>
  );
}

// ─── Public export — auto-detects variant ─────────────────────────────────────
export function MiniLesson({
  accent,
  lesson,
}: {
  accent: AccentTone;
  lesson: MiniLessonConfig | StaticMiniLesson;
}) {
  if (isStaticMiniLesson(lesson)) {
    return <StaticMiniLessonCard accent={accent} lesson={lesson} />;
  }
  return <InteractiveMiniLesson accent={accent} lesson={lesson} />;
}
