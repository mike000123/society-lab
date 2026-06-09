import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpenText, ClipboardCheck, Clock3, Layers3, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { LearningModule } from "@/lib/learn/modules";
import { cn } from "@/lib/utils";

import { getLessonPromise, getLessonTakeaway, lessonAccentClasses } from "@/components/learn/lesson-theme";

export function LessonHero({
  heroImageSrc,
  module,
  quizQuestionCount,
}: {
  heroImageSrc: string;
  module: LearningModule;
  quizQuestionCount?: number;
}) {
  const accent = lessonAccentClasses[module.accent];
  const promise = getLessonPromise(module);
  const takeaway = getLessonTakeaway(module);

  return (
    <section className="relative overflow-hidden rounded-[2.6rem] border border-[rgba(28,36,48,0.08)] bg-white shadow-[0_30px_70px_rgba(28,36,48,0.06)]">
      <div className="grid min-h-[26rem] gap-0 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="relative z-10 flex flex-col justify-center px-6 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          <div className="max-w-[52rem] space-y-5">
            <Link
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800 xl:hidden"
              href="/learn"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Learn
            </Link>

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

            <div className="space-y-4">
              <h1 className="atlas-display max-w-[40rem] text-[2.55rem] leading-[0.94] text-slate-900 sm:text-[3.35rem] lg:text-[3.95rem]">
                {module.title}
              </h1>
              <p className="atlas-lede max-w-[38rem] text-[1.05rem] leading-8 text-slate-700">{module.summary}</p>
              <p className="max-w-[36rem] text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
                Lesson promise
              </p>
              <p className="max-w-[38rem] text-[1.02rem] leading-8 text-slate-700">{promise}</p>
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
              <p className="mt-2 text-base leading-7 text-slate-800">{takeaway}</p>
            </div>

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
            </div>
          </div>
        </div>

        <div className="relative min-h-[20rem] overflow-hidden rounded-t-[2rem] lg:rounded-l-none lg:rounded-r-[2.6rem]">
          <Image
            alt={module.title}
            className="object-cover object-right"
            fill
            priority={false}
            sizes="(min-width: 1280px) 960px, 100vw"
            src={heroImageSrc}
          />
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white/80 via-white/20 to-transparent lg:w-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(255,255,255,0.08)] via-transparent to-[rgba(255,255,255,0.1)]" />
        </div>
      </div>
    </section>
  );
}
