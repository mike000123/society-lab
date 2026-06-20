import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpenText, ClipboardCheck, Clock3, Home, Layers3, Leaf, Play, Scale, ShieldCheck, Sparkles, TimerReset } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { LearningModule , ResolvedLearningModule} from "@/lib/learn/modules";
import { cn } from "@/lib/utils";

import { extractFirstSentence, getLessonPromise, getLessonTakeaway, lessonAccentClasses } from "@/components/learn/lesson-theme";
import { ShareLesson } from "@/components/learn/ShareLesson";
import { StartDiscussionModal } from "@/components/learn/StartDiscussionModal";
import { getLessonSimulationHref, hasLessonSimulator } from "@/lib/learn/simulator-routing";

export function LessonHero({
  comparisonMode = false,
  heroImageSrc,
  module,
  processMode = false,
  quizQuestionCount,
  timelineMode = false,
}: {
  comparisonMode?: boolean;
  heroImageSrc: string;
  module: ResolvedLearningModule;
  processMode?: boolean;
  quizQuestionCount?: number;
  timelineMode?: boolean;
}) {
  const accent = lessonAccentClasses[module.accent];
  const promise = getLessonPromise(module);
  const takeaway = getLessonTakeaway(module);
  const wideMode = timelineMode || comparisonMode || processMode;
  const timelineLead = extractFirstSentence(module.simpleExplanation[1]) || module.summary;
  const timelineTakeaway = extractFirstSentence(module.systemBug.summary) || takeaway;
  const timelineImagePosition =
    module.slug === "how-the-us-rewrites-the-rules-of-money" ? "object-[49%_center]" : "object-[58%_center]";
  const comparisonFooterIcons = [Scale, Home, ShieldCheck, Leaf, TimerReset, Sparkles];
  const comparisonFooterLabels = module.betterMetrics.slice(0, 6);
  const hasSimulator = hasLessonSimulator(module);
  const simulatorHref = getLessonSimulationHref(module);
  const heroActionClass = cn(
    "inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white/88 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900",
    wideMode ? "px-4 py-2.5 text-[0.92rem]" : "px-5 py-3",
  );

  return (
    <section className="relative overflow-hidden rounded-[2.6rem] border border-[rgba(28,36,48,0.08)] bg-white shadow-[0_30px_70px_rgba(28,36,48,0.06)] xl:mr-[calc(50%-50vw)] xl:rounded-r-none xl:border-r-0">
      <div
        className={cn(
          "relative px-6 py-5 sm:px-8 sm:py-6",
          timelineMode
            ? "min-h-[18.25rem] lg:min-h-[18.25rem] lg:px-8 lg:py-6 xl:min-h-[19.6rem] xl:px-9 xl:py-6"
            : comparisonMode
              ? "min-h-[18.25rem] lg:min-h-[18.25rem] lg:px-8 lg:py-6 xl:min-h-[19.8rem] xl:px-9 xl:py-6"
              : processMode
                ? "min-h-[18.25rem] lg:min-h-[18.25rem] lg:px-8 lg:py-6 xl:min-h-[19.8rem] xl:px-9 xl:py-6"
            : "min-h-[17.75rem] lg:min-h-[17.75rem] lg:px-8 lg:py-6 xl:min-h-[19.2rem] xl:px-9 xl:py-6",
        )}
      >
        <div
          className={cn(
            "relative z-10 flex min-h-full flex-col justify-center",
          )}
        >
          <div className="max-w-[36rem] space-y-4 lg:max-w-[50%]">
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

            <div className="space-y-3">
              <h1
                className={cn(
                  "atlas-display max-w-[31rem] leading-[0.86] text-slate-900 lg:max-w-full",
                  timelineMode
                    ? "text-[2.35rem] sm:text-[2.8rem] lg:text-[3.05rem] xl:text-[3.25rem]"
                    : comparisonMode
                      ? "text-[2.42rem] sm:text-[2.95rem] lg:text-[3.3rem] xl:text-[3.55rem]"
                      : processMode
                        ? "text-[2.42rem] sm:text-[2.95rem] lg:text-[3.3rem] xl:text-[3.55rem]"
                    : "text-[2.32rem] sm:text-[2.95rem] lg:text-[3.35rem] xl:text-[3.55rem]",
                )}
              >
                {module.title}
              </h1>
              {timelineMode ? (
                <p className="atlas-lede max-w-[30rem] text-[1rem] leading-7 text-slate-700 lg:max-w-full">{timelineLead}</p>
              ) : comparisonMode ? (
                <>
                  <p className="atlas-lede max-w-[30rem] text-[0.98rem] leading-7 text-slate-700 lg:max-w-full">{module.summary}</p>
                  <p className="max-w-[30rem] text-[0.96rem] leading-7 text-slate-600 lg:max-w-full">{promise}</p>
                </>
              ) : (
                <>
                  <p className="atlas-lede max-w-[30rem] text-[1rem] leading-7 text-slate-700 lg:max-w-full">{module.summary}</p>
                  <p className="max-w-[30rem] text-[0.98rem] leading-7 text-slate-700 lg:max-w-full">{promise}</p>
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

            <div className="flex flex-wrap gap-2.5">
                {quizQuestionCount ? (
                  <Button asChild className={cn("h-auto rounded-full", wideMode ? "px-4 py-2.5 text-[0.92rem]" : "px-5 py-3")}>
                    <Link href={`/quiz/${module.slug}`}>
                      Take the quiz
                      <ClipboardCheck className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : null}
                {hasSimulator ? (
                  <Link
                    className={heroActionClass}
                    href={simulatorHref}
                  >
                    Open simulator
                    <Play className="h-4 w-4" />
                  </Link>
                ) : null}
                <Link
                  className={heroActionClass}
                  href="/study"
                >
                  Open study resources
                  <BookOpenText className="h-4 w-4" />
                </Link>
                <StartDiscussionModal className={wideMode ? "px-4 py-2.5 text-[0.92rem]" : undefined} module={module} />
                <ShareLesson className={wideMode ? "px-4 py-2.5 text-[0.92rem]" : undefined} slug={module.slug} summary={module.summary} title={module.title} />
              </div>
          </div>
        </div>

        <div
          className={cn(
            "relative mt-5 min-h-[17rem] overflow-hidden rounded-[2rem] sm:min-h-[18.5rem]",
            timelineMode || comparisonMode
              ? "lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:min-h-0 lg:w-[67%] lg:rounded-l-[2.2rem] lg:rounded-r-[2.6rem] xl:rounded-r-none"
              : processMode
                ? "lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:min-h-0 lg:w-[67%] lg:rounded-l-[2.2rem] lg:rounded-r-[2.6rem] xl:rounded-r-none"
              : "lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:min-h-0 lg:w-[66%] lg:rounded-l-[2.2rem] lg:rounded-r-[2.6rem] xl:rounded-r-none",
          )}
        >
          <Image
            alt={module.title}
            className={cn(
              "object-cover",
              timelineMode ? timelineImagePosition : comparisonMode ? "object-[66%_center]" : processMode ? "object-[66%_center]" : "object-[72%_center]",
            )}
            fill
            priority={false}
            sizes="(min-width: 1024px) 67vw, 100vw"
            src={heroImageSrc}
          />
          <div
            className={cn(
              "absolute inset-y-0 left-0 hidden bg-gradient-to-r to-transparent lg:block",
              timelineMode
                ? "w-[42%] from-white via-white/84"
                : comparisonMode
                  ? "w-[44%] from-white via-white/88"
                  : processMode
                    ? "w-[44%] from-white via-white/88"
                : "w-[42%] from-white/88 via-white/20",
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
