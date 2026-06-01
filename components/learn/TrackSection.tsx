"use client";

import Link from "next/link";
import {
  ArrowRight, Banknote, BookOpen, Brain, Building2, CheckCircle2,
  ClipboardCheck, Clock3, FlaskConical, Landmark, Leaf, Lock,
  MessageSquare, ScrollText, Sparkles, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AccentTone, LearningModule } from "@/lib/learn/modules";
import type { LearningTrack } from "@/lib/tracks/config";
import { useProgress } from "@/lib/progress/store";
import { getQuizBySlug } from "@/lib/quiz/questions";

const TRACK_ICONS: Record<string, React.ElementType> = {
  Banknote, Brain, Building2, Landmark, Leaf, ScrollText,
};

// ── Dark theme accents ────────────────────────────────────────────────────────
const ACCENT_GLOW: Record<AccentTone, string> = {
  amber:   "from-amber-400/12 via-amber-400/4 to-transparent",
  cyan:    "from-cyan-400/12 via-cyan-400/4 to-transparent",
  emerald: "from-emerald-400/12 via-emerald-400/4 to-transparent",
  rose:    "from-rose-400/12 via-rose-400/4 to-transparent",
};
const ACCENT_BADGE_DARK: Record<AccentTone, string> = {
  amber:   "border-amber-300/25 bg-amber-400/10 text-amber-200",
  cyan:    "border-cyan-300/25 bg-cyan-400/10 text-cyan-200",
  emerald: "border-emerald-300/25 bg-emerald-400/10 text-emerald-200",
  rose:    "border-rose-300/25 bg-rose-400/10 text-rose-200",
};
const ACCENT_ICON_DARK: Record<AccentTone, string> = {
  amber:   "text-amber-300 border-amber-300/20 bg-amber-400/10",
  cyan:    "text-cyan-300 border-cyan-300/20 bg-cyan-400/10",
  emerald: "text-emerald-300 border-emerald-300/20 bg-emerald-400/10",
  rose:    "text-rose-300 border-rose-300/20 bg-rose-400/10",
};
const ACCENT_PROGRESS: Record<AccentTone, string> = {
  amber:   "bg-amber-400",
  cyan:    "bg-cyan-500",
  emerald: "bg-emerald-400",
  rose:    "bg-rose-400",
};
const ACCENT_CARD_HOVER_DARK: Record<AccentTone, string> = {
  amber:   "hover:border-amber-700/60",
  cyan:    "hover:border-cyan-700/60",
  emerald: "hover:border-emerald-700/60",
  rose:    "hover:border-rose-700/60",
};
const ACCENT_NUMBER_DARK: Record<AccentTone, string> = {
  amber:   "bg-amber-400/15 text-amber-300",
  cyan:    "bg-cyan-400/15 text-cyan-300",
  emerald: "bg-emerald-400/15 text-emerald-300",
  rose:    "bg-rose-400/15 text-rose-300",
};

// ── Editorial (light) theme accents ──────────────────────────────────────────
const ACCENT_BADGE_LIGHT: Record<AccentTone, string> = {
  amber:   "border-amber-300 bg-amber-50 text-amber-700",
  cyan:    "border-cyan-300 bg-cyan-50 text-cyan-700",
  emerald: "border-emerald-300 bg-emerald-50 text-emerald-700",
  rose:    "border-rose-300 bg-rose-50 text-rose-700",
};
const ACCENT_ICON_LIGHT: Record<AccentTone, string> = {
  amber:   "text-amber-600 border-amber-200 bg-amber-50",
  cyan:    "text-cyan-600 border-cyan-200 bg-cyan-50",
  emerald: "text-emerald-600 border-emerald-200 bg-emerald-50",
  rose:    "text-rose-600 border-rose-200 bg-rose-50",
};
const ACCENT_NUMBER_LIGHT: Record<AccentTone, string> = {
  amber:   "bg-amber-100 text-amber-700",
  cyan:    "bg-cyan-100 text-cyan-700",
  emerald: "bg-emerald-100 text-emerald-700",
  rose:    "bg-rose-100 text-rose-700",
};
const ACCENT_LEFT_BORDER: Record<AccentTone, string> = {
  amber:   "border-l-amber-400",
  cyan:    "border-l-cyan-400",
  emerald: "border-l-emerald-400",
  rose:    "border-l-rose-400",
};
const ACCENT_ICON_COLOR: Record<AccentTone, string> = {
  amber:   "text-amber-600",
  cyan:    "text-cyan-600",
  emerald: "text-emerald-600",
  rose:    "text-rose-600",
};

// ── Module card ───────────────────────────────────────────────────────────────
function ModuleCard({
  module,
  index,
  unlocked,
  quizPassed,
  quizScore,
  accent,
  editorial = false,
}: {
  module: LearningModule;
  index: number;
  unlocked: boolean;
  quizPassed: boolean;
  quizScore: number | null;
  accent: AccentTone;
  editorial?: boolean;
}) {
  const hasQuiz = Boolean(getQuizBySlug(module.slug));
  const hasSimulator = Boolean(module.simulatorSlug);

  // ── Editorial card ──────────────────────────────────────────────────────────
  if (editorial) {
    const cardBase = cn(
      "group relative flex flex-col rounded-2xl border p-5 transition-all duration-200",
      quizPassed
        ? "border-emerald-200 bg-emerald-50/60"
        : unlocked
        ? "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md cursor-pointer"
        : "border-slate-150 bg-slate-50 opacity-50 cursor-not-allowed select-none",
    );

    const inner = (
      <div className={cardBase}>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className={cn("flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg text-[11px] font-bold", ACCENT_NUMBER_LIGHT[accent])}>
              {index + 1}
            </span>
            <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", ACCENT_BADGE_LIGHT[accent])}>
              {module.eyebrow}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {quizPassed ? (
              <span className="flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                <CheckCircle2 className="h-2.5 w-2.5" />
                {quizScore}%
              </span>
            ) : !unlocked ? (
              <Lock className="h-3.5 w-3.5 text-slate-400" />
            ) : null}
          </div>
        </div>

        <h3 className={cn("text-sm font-semibold leading-5", unlocked ? "text-slate-800" : "text-slate-400")}>
          {module.title}
        </h3>

        {unlocked && (
          <p className="mt-1.5 text-xs leading-5 text-slate-500 line-clamp-2 flex-1">
            {module.summary}
          </p>
        )}

        {!unlocked && (
          <p className="mt-1.5 text-xs text-slate-400">Complete previous module to unlock</p>
        )}

        {unlocked && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] text-slate-400">
              <Clock3 className="h-3 w-3" />
              {module.readingTime}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-slate-400">
              <BookOpen className="h-3 w-3" />
              {module.difficulty}
            </span>
            {hasSimulator && (
              <span className="flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] text-amber-700">
                <Zap className="h-2.5 w-2.5" />
                Simulator
              </span>
            )}
            {hasQuiz && !quizPassed && (
              <span className="flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[10px] text-violet-700">
                <ClipboardCheck className="h-2.5 w-2.5" />
                Quiz
              </span>
            )}
            <ArrowRight className={cn("h-3.5 w-3.5 ml-auto transition-transform duration-150 group-hover:translate-x-0.5", ACCENT_ICON_COLOR[accent])} />
          </div>
        )}
      </div>
    );

    if (!unlocked) return inner;
    return <Link href={`/learn/${module.slug}`}>{inner}</Link>;
  }

  // ── Dark card ───────────────────────────────────────────────────────────────
  const cardBase = cn(
    "group relative flex flex-col rounded-2xl border p-4 transition-all duration-150",
    quizPassed
      ? "border-emerald-700/40 bg-emerald-950/20"
      : unlocked
      ? cn("border-slate-700 bg-slate-900/60 cursor-pointer", ACCENT_CARD_HOVER_DARK[accent])
      : "border-slate-800 bg-slate-950/40 opacity-55 cursor-not-allowed select-none",
  );

  const inner = (
    <div className={cardBase}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className={cn("flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg text-[11px] font-bold", ACCENT_NUMBER_DARK[accent])}>
            {index + 1}
          </span>
          <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", ACCENT_BADGE_DARK[accent])}>
            {module.eyebrow}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {quizPassed ? (
            <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-900/30 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
              <CheckCircle2 className="h-2.5 w-2.5" />
              {quizScore}%
            </span>
          ) : !unlocked ? (
            <Lock className="h-3.5 w-3.5 text-slate-600" />
          ) : null}
        </div>
      </div>

      <h3 className={cn("text-sm font-semibold leading-5", unlocked ? "text-slate-50" : "text-slate-600")}>
        {module.title}
      </h3>

      {unlocked && (
        <p className="mt-1.5 text-xs leading-5 text-slate-400 line-clamp-2 flex-1">
          {module.summary}
        </p>
      )}

      {!unlocked && (
        <p className="mt-1.5 text-xs text-slate-700">Complete previous module to unlock</p>
      )}

      {unlocked && (
        <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-[10px] text-slate-600">
            <Clock3 className="h-3 w-3" />
            {module.readingTime}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-slate-600">
            <BookOpen className="h-3 w-3" />
            {module.difficulty}
          </span>
          {hasSimulator && (
            <span className="flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/60 px-2 py-0.5 text-[10px] text-slate-400">
              <Zap className="h-2.5 w-2.5 text-amber-400" />
              Simulator
            </span>
          )}
          {hasQuiz && !quizPassed && (
            <span className="flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/60 px-2 py-0.5 text-[10px] text-slate-400">
              <ClipboardCheck className="h-2.5 w-2.5 text-violet-400" />
              Quiz
            </span>
          )}
          <ArrowRight className={cn("h-3.5 w-3.5 ml-auto transition-transform duration-150 group-hover:translate-x-0.5", ACCENT_ICON_DARK[accent].split(" ")[0])} />
        </div>
      )}
    </div>
  );

  if (!unlocked) return inner;
  return <Link href={`/learn/${module.slug}`}>{inner}</Link>;
}

// ── Track section ─────────────────────────────────────────────────────────────
export function TrackSection({
  track,
  modules,
  editorial = false,
}: {
  track: LearningTrack;
  modules: LearningModule[];
  editorial?: boolean;
}) {
  const { isUnlocked, getModule, trackProgress, devMode } = useProgress();
  const Icon = TRACK_ICONS[track.icon] ?? Sparkles;
  const { completed, total } = trackProgress(track.moduleSlugs);
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  if (total === 0) return null;

  // ── Editorial layout ────────────────────────────────────────────────────────
  if (editorial) {
    return (
      <section className={cn(
        "rounded-2xl border-l-4 border border-slate-200 bg-white p-6 sm:p-8",
        ACCENT_LEFT_BORDER[track.accent]
      )}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={cn("flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border", ACCENT_ICON_LIGHT[track.accent])}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-medium", ACCENT_BADGE_LIGHT[track.accent])}>
                  {track.moduleSlugs.length} modules
                </span>
                {pct === 100 && (
                  <span className="flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-medium text-emerald-700">
                    <CheckCircle2 className="h-2.5 w-2.5" /> Complete
                  </span>
                )}
              </div>
              <h2 className="mt-1 text-xl font-bold text-slate-900">{track.title}</h2>
              <p className="mt-0.5 text-sm text-slate-500 leading-6">{track.tagline}</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 min-w-[110px]">
            <span className="text-xs text-slate-400">{completed}/{total} completed</span>
            <div className="h-1.5 w-28 overflow-hidden rounded-full bg-slate-200">
              <div
                className={cn("h-full rounded-full transition-all duration-700", ACCENT_PROGRESS[track.accent])}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-500">{track.description}</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {track.moduleSlugs.map((slug, idx) => {
            const mod = modules.find((m) => m.slug === slug);
            if (!mod) return null;
            const unlocked = isUnlocked(slug, track.moduleSlugs);
            const progress = getModule(slug);
            return (
              <ModuleCard
                key={slug}
                module={mod}
                index={idx}
                unlocked={unlocked}
                quizPassed={progress.quizPassed}
                quizScore={progress.quizScore}
                accent={track.accent}
                editorial
              />
            );
          })}
        </div>

        {devMode && pct < 100 && (
          <p className="mt-4 flex items-center gap-1.5 text-[10px] text-amber-600">
            <FlaskConical className="h-3 w-3" /> Dev mode: all modules unlocked
          </p>
        )}
        {!devMode && pct > 0 && pct < 100 && (
          <p className="mt-4 flex items-center gap-1.5 text-[10px] text-slate-400">
            <ClipboardCheck className="h-3 w-3" />
            Pass the quiz in each module to unlock the next one
          </p>
        )}
      </section>
    );
  }

  // ── Dark layout ─────────────────────────────────────────────────────────────
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/70">
      <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b", ACCENT_GLOW[track.accent])} />

      <div className="relative p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={cn("flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border", ACCENT_ICON_DARK[track.accent])}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-medium", ACCENT_BADGE_DARK[track.accent])}>
                  {track.moduleSlugs.length} modules
                </span>
                {pct === 100 && (
                  <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-900/20 px-2.5 py-0.5 text-[10px] font-medium text-emerald-300">
                    <CheckCircle2 className="h-2.5 w-2.5" /> Complete
                  </span>
                )}
              </div>
              <h2 className="mt-1 text-lg font-black text-slate-50 sm:text-xl">{track.title}</h2>
              <p className="mt-0.5 text-xs text-slate-400">{track.tagline}</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 min-w-[110px]">
            <span className="text-xs text-slate-500">{completed}/{total}</span>
            <div className="h-1.5 w-28 overflow-hidden rounded-full bg-slate-800">
              <div
                className={cn("h-full rounded-full transition-all duration-700", ACCENT_PROGRESS[track.accent])}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        <p className="mt-3 max-w-3xl text-xs leading-5 text-slate-500">{track.description}</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {track.moduleSlugs.map((slug, idx) => {
            const mod = modules.find((m) => m.slug === slug);
            if (!mod) return null;
            const unlocked = isUnlocked(slug, track.moduleSlugs);
            const progress = getModule(slug);
            return (
              <ModuleCard
                key={slug}
                module={mod}
                index={idx}
                unlocked={unlocked}
                quizPassed={progress.quizPassed}
                quizScore={progress.quizScore}
                accent={track.accent}
              />
            );
          })}
        </div>

        {devMode && pct < 100 && (
          <p className="mt-3 flex items-center gap-1.5 text-[10px] text-amber-500/70">
            <FlaskConical className="h-3 w-3" /> Dev mode: all modules unlocked
          </p>
        )}
        {!devMode && pct > 0 && pct < 100 && (
          <p className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-600">
            <ClipboardCheck className="h-3 w-3" />
            Pass the quiz in each module to unlock the next one
          </p>
        )}
      </div>
    </section>
  );
}
