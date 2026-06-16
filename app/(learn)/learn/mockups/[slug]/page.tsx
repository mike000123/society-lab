import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Eye } from "lucide-react";
import { notFound } from "next/navigation";

import { AtlasLessonPage } from "@/components/learn/AtlasLessonPage";
import { getLearningArticleBySlug } from "@/lib/learn/content";
import { getLessonHeroImage, getLessonSupportImage } from "@/lib/learn/hero-art";
import { getLessonVariant, LESSON_VARIANT_META } from "@/lib/learn/lesson-variants";
import { getLearningModuleBySlug, learningModules, type ResolvedLearningModule } from "@/lib/learn/modules";
import { getQuizBySlug } from "@/lib/quiz/questions";
import { LEARNING_TRACKS } from "@/lib/tracks/config";

export const dynamicParams = false;

export function generateStaticParams() {
  return learningModules.map((module) => ({ slug: module.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLearningModuleBySlug(slug);

  if (!lesson) return {};

  return {
    description: `Mockup preview for ${lesson.title}.`,
    title: `${lesson.title} Mockup | Society Lab Learn`,
  };
}

export default async function LearnMockupDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getLearningModuleBySlug(slug);
  const article = getLearningArticleBySlug(slug);

  if (!lesson) {
    notFound();
  }

  const variant = getLessonVariant(lesson.slug);
  const variantMeta = LESSON_VARIANT_META[variant];
  const currentTrack = LEARNING_TRACKS.find((track) => track.moduleSlugs.includes(lesson.slug)) ?? null;
  const contextSlugs = currentTrack?.moduleSlugs ?? [];
  const currentIndex = contextSlugs.indexOf(lesson.slug);
  const previousSlug = currentIndex > 0 ? contextSlugs[currentIndex - 1] : null;
  const nextSlug = currentIndex >= 0 && currentIndex < contextSlugs.length - 1 ? contextSlugs[currentIndex + 1] : null;
  const previousModule = previousSlug ? getLearningModuleBySlug(previousSlug) : null;
  const nextModule = nextSlug ? getLearningModuleBySlug(nextSlug) : null;
  const trackModules = contextSlugs
    .map((candidateSlug) => getLearningModuleBySlug(candidateSlug))
    .filter((candidate): candidate is ResolvedLearningModule => Boolean(candidate));
  const quiz = getQuizBySlug(lesson.slug);
  const heroImageSrc = getLessonHeroImage(lesson.slug, currentTrack?.id);
  const supportImageSrc = getLessonSupportImage(lesson.slug, heroImageSrc);

  return (
    <div className="mx-auto max-w-[124rem] space-y-8 pb-20">
      <div className="space-y-8">
        <section className="rounded-[2rem] border border-[rgba(28,36,48,0.08)] bg-white/92 px-6 py-6 shadow-[0_20px_48px_rgba(28,36,48,0.05)] sm:px-8 sm:py-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-3">
              <Link
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800"
                href="/learn/mockups"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to mockup gallery
              </Link>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.84)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {variantMeta.label}
                </span>
                <span className="inline-flex rounded-full border border-[rgba(28,36,48,0.08)] bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  {lesson.eyebrow}
                </span>
                {currentTrack ? <span className="text-sm text-slate-400">{currentTrack.title}</span> : null}
              </div>
              <div className="space-y-2">
                <h1 className="atlas-display text-[2.4rem] leading-tight text-slate-900 sm:text-[2.9rem]">{lesson.title}</h1>
                <p className="max-w-[44rem] text-base leading-8 text-slate-700">{variantMeta.summary}</p>
                <p className="max-w-[48rem] text-sm leading-7 text-slate-600">{variantMeta.visualFocus}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white/88 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
                href={`/learn/${lesson.slug}`}
              >
                <Eye className="h-4 w-4" />
                Open live lesson
              </Link>
              <Link
                className="inline-flex items-center gap-2 rounded-full bg-[rgb(var(--atlas-primary))] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                href={nextModule ? `/learn/mockups/${nextModule.slug}` : "/learn/mockups"}
              >
                {nextModule ? "Next mockup" : "Back to gallery"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <AtlasLessonPage
          article={article}
          currentIndex={currentIndex}
          currentTrack={currentTrack}
          heroImageSrc={heroImageSrc}
          module={lesson}
          nextModule={nextModule}
          previousModule={previousModule}
          quizQuestionCount={quiz?.questions.length}
          supportImageSrc={supportImageSrc}
          trackModules={trackModules}
        />
      </div>
    </div>
  );
}
