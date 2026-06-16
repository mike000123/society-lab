import { AtlasLessonPage } from "@/components/learn/AtlasLessonPage";
import { LessonVisitTracker } from "@/components/learn/LessonVisitTracker";
import type { LearningArticleDocument } from "@/lib/learn/content";
import { getLessonHeroImage, getLessonSupportImage } from "@/lib/learn/hero-art";
import { getLearningModuleBySlug, type LearningModule, type ResolvedLearningModule } from "@/lib/learn/modules";
import { LEARNING_PATHS } from "@/lib/learn/discovery";
import { getQuizBySlug } from "@/lib/quiz/questions";
import { LEARNING_TRACKS } from "@/lib/tracks/config";

export function LearningModulePage({
  article,
  module,
  pathId,
}: {
  article?: LearningArticleDocument | null;
  module: ResolvedLearningModule;
  pathId?: string;
}) {
  const quiz = getQuizBySlug(module.slug);

  // ── Path context (preferred when ?path= is present) ───────────────────────
  const currentPath = pathId
    ? (LEARNING_PATHS.find((p) => p.id === pathId) ?? null)
    : null;

  // ── Track context (fallback) ───────────────────────────────────────────────
  const currentTrack = currentPath
    ? null
    : (LEARNING_TRACKS.find((track) => track.moduleSlugs.includes(module.slug)) ?? null);

  // Use path slugs when available, otherwise track slugs
  const contextSlugs: string[] = currentPath?.moduleSlugs ?? currentTrack?.moduleSlugs ?? [];
  const currentIndex = contextSlugs.indexOf(module.slug);
  const previousSlug = currentIndex > 0 ? contextSlugs[currentIndex - 1] : null;
  const nextSlug =
    currentIndex >= 0 && currentIndex < contextSlugs.length - 1
      ? contextSlugs[currentIndex + 1]
      : null;

  const previousModule = previousSlug ? getLearningModuleBySlug(previousSlug) : null;
  const nextModule = nextSlug ? getLearningModuleBySlug(nextSlug) : null;
  const heroImageSrc = getLessonHeroImage(module.slug, currentTrack?.id ?? currentPath?.topicIds[0]);
  const supportImageSrc = getLessonSupportImage(module.slug, heroImageSrc);

  const contextModules = contextSlugs
    .map((slug) => getLearningModuleBySlug(slug))
    .filter((m): m is ResolvedLearningModule => Boolean(m));

  return (
    <>
      <LessonVisitTracker slug={module.slug} />
      <AtlasLessonPage
        article={article}
        currentIndex={currentIndex}
        currentPath={currentPath}
        currentTrack={currentTrack}
        heroImageSrc={heroImageSrc}
        module={module}
        nextModule={nextModule}
        pathId={pathId}
        previousModule={previousModule}
        quizQuestionCount={quiz?.questions.length}
        supportImageSrc={supportImageSrc}
        trackModules={contextModules}
      />
    </>
  );
}
