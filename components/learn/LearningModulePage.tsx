import { AtlasLessonPage } from "@/components/learn/AtlasLessonPage";
import type { LearningArticleDocument } from "@/lib/learn/content";
import { getLessonHeroImage } from "@/lib/learn/hero-art";
import { getLearningModuleBySlug, type LearningModule } from "@/lib/learn/modules";
import { getQuizBySlug } from "@/lib/quiz/questions";
import { LEARNING_TRACKS } from "@/lib/tracks/config";

export function LearningModulePage({
  article,
  module,
}: {
  article?: LearningArticleDocument | null;
  module: LearningModule;
}) {
  const quiz = getQuizBySlug(module.slug);
  const currentTrack = LEARNING_TRACKS.find((track) => track.moduleSlugs.includes(module.slug)) ?? null;
  const trackModuleSlugs = currentTrack?.moduleSlugs ?? [];
  const currentIndex = trackModuleSlugs.indexOf(module.slug);
  const previousSlug = currentIndex > 0 ? trackModuleSlugs[currentIndex - 1] : null;
  const nextSlug = currentIndex >= 0 && currentIndex < trackModuleSlugs.length - 1 ? trackModuleSlugs[currentIndex + 1] : null;
  const previousModule = previousSlug ? getLearningModuleBySlug(previousSlug) : null;
  const nextModule = nextSlug ? getLearningModuleBySlug(nextSlug) : null;
  const trackModules = trackModuleSlugs
    .map((slug) => getLearningModuleBySlug(slug))
    .filter((trackModule): trackModule is LearningModule => Boolean(trackModule));

  return (
    <AtlasLessonPage
      article={article}
      currentIndex={currentIndex}
      currentTrack={currentTrack}
      heroImageSrc={getLessonHeroImage(module.slug, currentTrack?.id)}
      module={module}
      nextModule={nextModule}
      previousModule={previousModule}
      quizQuestionCount={quiz?.questions.length}
      trackModules={trackModules}
    />
  );
}
