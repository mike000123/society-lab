"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, FlaskConical, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgress } from "@/lib/progress/store";
import { getLevelProgress, LEVELS } from "@/lib/progress/levels";
import { LEARNING_TRACKS } from "@/lib/tracks/config";

const ALL_SLUGS = LEARNING_TRACKS.flatMap((t) => t.moduleSlugs);

export function ProgressBanner({ editorial = false }: { editorial?: boolean }) {
  const { getTotalCompleted, getNextUnlocked, devMode } = useProgress();
  const totalCompleted = getTotalCompleted();
  const nextSlug = getNextUnlocked(ALL_SLUGS);

  const { level, pct, remaining } = getLevelProgress(totalCompleted);
  const nextLevel = LEVELS.find((l) => l.minPassed === level.nextAt);

  const isMaxLevel = !level.nextAt;
  const totalModules = ALL_SLUGS.length;

  // ── Editorial (light) variant ───────────────────────────────────────────────
  if (editorial) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          {/* Level badge + info */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-2xl">
              {level.emoji}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-slate-300 bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                  {level.label}
                </span>
                {devMode && (
                  <span className="flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] text-amber-700">
                    <FlaskConical className="h-2.5 w-2.5" /> Dev mode
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm font-semibold text-slate-800">{level.tagline}</p>
              <p className="text-xs text-slate-400">
                {totalCompleted} of {totalModules} modules completed
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex-1 max-w-xs">
            {isMaxLevel ? (
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500 flex-shrink-0" />
                <span className="text-sm font-semibold text-amber-700">Max level reached</span>
              </div>
            ) : (
              <div>
                <div className="mb-1.5 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{level.label}</span>
                  <span>{nextLevel?.label}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-slate-700 transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-1.5 text-[10px] text-slate-400">
                  {remaining === 1
                    ? "1 more quiz to level up"
                    : `${remaining} more quizzes to reach ${nextLevel?.label}`}
                </p>
              </div>
            )}
          </div>

          {/* CTA */}
          {nextSlug ? (
            <Link
              href={`/learn/${nextSlug}`}
              className="flex-shrink-0 inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-100 transition-colors hover:bg-slate-700"
            >
              Continue learning
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : totalCompleted > 0 ? (
            <div className="flex-shrink-0 flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              All tracks complete
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  // ── Dark variant (default) ──────────────────────────────────────────────────
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2rem] border p-5 sm:p-6",
        level.color.ring,
        "bg-slate-950/80",
      )}
    >
      <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b", level.color.glow)} />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border text-2xl",
              level.color.ring,
              "bg-slate-900/60",
            )}
          >
            {level.emoji}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-semibold", level.color.badge)}>
                {level.label}
              </span>
              {devMode && (
                <span className="flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-900/20 px-2 py-0.5 text-[10px] text-amber-300">
                  <FlaskConical className="h-2.5 w-2.5" /> Dev mode
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm font-semibold text-slate-100">{level.tagline}</p>
            <p className="text-xs text-slate-500">
              {totalCompleted} of {totalModules} modules completed
            </p>
          </div>
        </div>

        <div className="flex-1 max-w-xs">
          {isMaxLevel ? (
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-400 flex-shrink-0" />
              <span className="text-sm font-semibold text-amber-300">Max level reached</span>
            </div>
          ) : (
            <div>
              <div className="mb-1.5 flex items-center justify-between text-[10px] text-slate-500">
                <span>{level.label}</span>
                <span>{nextLevel?.label}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className={cn("h-full rounded-full transition-all duration-700", level.color.bar)}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-1.5 text-[10px] text-slate-500">
                {remaining === 1
                  ? "1 more quiz to level up"
                  : `${remaining} more quizzes to reach ${nextLevel?.label}`}
              </p>
            </div>
          )}
        </div>

        {nextSlug ? (
          <Link
            href={`/learn/${nextSlug}`}
            className="flex-shrink-0 inline-flex items-center gap-2 rounded-2xl border border-slate-600 bg-slate-900/80 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-slate-400 hover:text-slate-50"
          >
            Continue learning
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ) : totalCompleted > 0 ? (
          <div className="flex-shrink-0 flex items-center gap-2 rounded-2xl border border-emerald-700/50 bg-emerald-900/20 px-4 py-2.5 text-sm font-medium text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            All tracks complete
          </div>
        ) : null}
      </div>
    </div>
  );
}
