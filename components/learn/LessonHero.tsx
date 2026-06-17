import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpenText, ClipboardCheck, Clock3, Home, Layers3, Leaf, Play, Scale, ShieldCheck, Sparkles, TimerReset } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { LearningModule , ResolvedLearningModule} from "@/lib/learn/modules";
import { cn } from "@/lib/utils";

import { extractFirstSentence, getLessonPromise, getLessonTakeaway, lessonAccentClasses } from "@/components/learn/lesson-theme";
import { ShareLesson } from "@/components/learn/ShareLesson";
import { StartDiscussionModal } from "@/components/learn/StartDiscussionModal";

export function LessonHero({
  comparisonMode = false,
  heroImageSrc,
  module,
  quizQuestionCount,
  timelineMode = false,
}: {
  comparisonMode?: boolean;
  heroImageSrc: string;
  module: ResolvedLearningModule;
  quizQuestionCount?: number;
  timelineMode?: boolean;
}) {
  const accent = lessonAccentClasses[module.accent];
  const promise = getLessonPromise(module);
  const takeaway = getLessonTakeaway(module);
  const timelineLead = extractFirstSentence(module.simpleExplanation[1]) || module.summary;
  const timelineTakeaway = extractFirstSentence(module.systemBug.summary) || takeaway;
  const timelineImagePosition =
    module.slug === "how-the-us-rewrites-the-rules-of-money" ? "object-[49%_center]" : "object-[58%_center]";
  const comparisonFooterIcons = [Scale, Home, ShieldCheck, Leaf, TimerReset, Sparkles];
  const comparisonFooterLabels = module.betterMetrics.slice(0, 6);

  return (
    <section className="relative overflow-hidden rounded-[2.6rem] border border-[rgba(28,36,48,0.08)] bg-white shadow-[0_30px_70px_rgba(28,36,48,0.06)]">
      <div
        className={cn(
          "grid gap-0",
          timelineMode
            ? "min-h-[27rem] lg:grid-cols-[minmax(0,0.49fr)_minmax(0,0.51fr)] xl:min-h-[29rem]"
            : comparisonMode
              ? "min-h-[27rem] lg:grid-cols-[minmax(0,0.47fr)_minmax(0,0.53fr)] xl:min-h-[30rem]"
            : "min-h-[26rem] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]",
        )}
      >
        <div
          className={cn(
            "relative z-10 flex flex-col justify-center px-6 py-7 sm:px-8 sm:py-8",
            timelineMode || comparisonMode ? "lg:px-9 lg:py-9 xl:px-10 xl:py-10" : "lg:px-10 lg:py-10",
          )}
        >
          <div className="max-w-[52rem] space-y-5">
            <Link
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800 xl:hidden"
              href="/learn"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Learn
            </Link>

            {timelineMode || comparisonMode ? (
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                <span>{module.eyebrow}</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>{module.readingTime}</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>{module.difficulty}</span>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
                    accent.badge,
                  )}
                >
                  {module.eyebrow}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(28,36,48,0.08)] bg-white/82 px-3 py-1 text-xs font-medium text-slate-500">
                  <Clock3 className="h-3.5 w-3.5" />
                  {module.readingTime}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(28,36,48,0.08)] bg-white/82 px-3 py-1 text-xs font-medium text-slate-500">
                  <Layers3 className="h-3.5 w-3.5" />
                  {module.difficulty}
                </span>
              </div>
            )}

            <div className="space-y-4">
              <h1
                className={cn(
                  "atlas-display max-w-[40rem] leading-[0.94] text-slate-900",
                  timelineMode
                    ? "text-[2.62rem] sm:text-[3.05rem] lg:text-[3.4rem] xl:text-[3.6rem]"
                    : comparisonMode
                      ? "text-[2.7rem] sm:text-[3.15rem] lg:text-[3.75rem] xl:text-[4.05rem]"
                    : "text-[2.55rem] sm:text-[3.35rem] lg:text-[3.95rem]",
                )}
              >
                {module.title}
              </h1>
              {timelineMode ? (
                <p className="atlas-lede max-w-[38rem] text-[1.05rem] leading-8 text-slate-700">{timelineLead}</p>
              ) : comparisonMode ? (
                <>
                  <p className="atlas-lede max-w-[38rem] text-[1.02rem] leading-8 text-slate-700">{module.summary}</p>
                  <p className="max-w-[38rem] text-[1rem] leading-8 text-slate-600">{promise}</p>
                </>
              ) : (
                <>
                  <p className="atlas-lede max-w-[38rem] text-[1.05rem] leading-8 text-slate-700">{module.summary}</p>
                  <p className="max-w-[38rem] text-[1.02rem] leading-8 text-slate-700">{promise}</p>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {module.relatedFrameworks.map((framework) => (
                <span
                  className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-medium", accent.chip)}
                  key={framework}
                >
                  {framework}
                </span>
              ))}
            </div>

            <div
              className={cn(
                "rounded-[1.5rem] border px-5 py-4 ring-1",
                accent.panel,
                accent.line,
                accent.ring,
              )}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Key takeaway</p>
              <p className="mt-2 text-base leading-7 text-slate-800">{timelineMode ? timelineTakeaway : takeaway}</p>
            </div>

            {!timelineMode && !comparisonMode ? (
              <div className="flex flex-wrap gap-3">
                {quizQuestionCount ? (
                  <Button asChild className="h-auto rounded-full px-5 py-3">
                    <Link href={`/quiz/${module.slug}`}>
                      Take the quiz
                      <ClipboardCheck className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : null}
                {module.simulatorSlug ? (
                  <Link
                    className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white/88 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
                    href={`/simulator/${module.simulatorSlug}`}
                  >
                    Open simulator
                    <Play className="h-4 w-4" />
                  </Link>
                ) : null}
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white/88 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
                  href="/study"
                >
                  Open study resources
                  <BookOpenText className="h-4 w-4" />
                </Link>
                <StartDiscussionModal module={module} />
                <ShareLesson slug={module.slug} summary={module.summary} title={module.title} />
              </div>
            ) : null}
          </div>
        </div>

        <div
          className={cn(
            "relative min-h-[20rem] overflow-hidden rounded-t-[2rem] lg:rounded-l-none lg:rounded-r-[2.6rem]",
            timelineMode || comparisonMode ? "lg:min-h-[28rem] xl:min-h-[30rem]" : "",
          )}
        >
          <Image
            alt={module.title}
            className={cn(
              "object-cover",
              timelineMode ? timelineImagePosition : comparisonMode ? "object-[68%_center]" : "object-right",
            )}
            fill
            priority={false}
            sizes="(min-width: 1280px) 960px, 100vw"
            src={heroImageSrc}
          />
          <div
            className={cn(
              "absolute inset-y-0 left-0 bg-gradient-to-r to-transparent",
              timelineMode
                ? "w-[22%] from-white via-white/82"
                : comparisonMode
                  ? "w-[24%] from-white via-white/88"
                : "w-24 from-white/80 via-white/20 lg:w-40",
            )}
          />
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-t via-transparent",
              timelineMode
                ? "from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.08)]"
                : comparisonMode
                  ? "from-[rgba(255,255,255,0.04)] to-[rgba(255,255,255,0.08)]"
                : "from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.1)]",
            )}
          />
          {comparisonMode ? (
            <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-center gap-2 rounded-[1.1rem] border border-[rgba(255,255,255,0.38)] bg-[rgba(15,23,42,0.44)] px-3 py-2 text-white/92 backdrop-blur-sm sm:left-auto sm:max-w-[34rem]">
              {comparisonFooterLabels.map((metric, index) => {
                const Icon = comparisonFooterIcons[index % comparisonFooterIcons.length];
                return (
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/16 bg-white/8 px-2.5 py-1 text-[10px] font-medium tracking-[0.08em]"
                    key={metric.label}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {metric.label}
                  </span>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
