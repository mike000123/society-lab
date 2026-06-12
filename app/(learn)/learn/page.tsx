import { FEATURED_PATH_IDS, LEARNING_PATHS, POPULAR_QUESTIONS } from "@/lib/learn/discovery";
import { getLearningModuleBySlug, learningModules } from "@/lib/learn/modules";
import { LEARNING_TRACKS } from "@/lib/tracks/config";
import { LearnPageClient } from "@/components/learn/LearnPageClient";

export default function LearnPage() {
  // ── Module summaries: slim objects only — full LearningModule stays server-side ──
  const moduleBySlug = Object.fromEntries(
    learningModules.map((m) => [
      m.slug,
      { accent: m.accent ?? "slate", readingTime: m.readingTime ?? "15 min", slug: m.slug, title: m.title ?? "", summary: m.summary ?? "" },
    ]),
  );

  // ── Pre-compute topic summaries so the client doesn't need getLearningModuleBySlug ──
  const topicSummaries = LEARNING_TRACKS.map((track) => {
    const matchingPaths = LEARNING_PATHS.filter((p) => p.topicIds.includes(track.id));
    const firstModule = track.moduleSlugs
      .map((slug) => getLearningModuleBySlug(slug))
      .find(Boolean);
    const fallbackSlug = matchingPaths[0]?.moduleSlugs[0];
    return {
      href: firstModule?.slug
        ? `/learn/${firstModule.slug}`
        : fallbackSlug
          ? `/learn/${fallbackSlug}`
          : "/learn#browse-by-topic",
      id: track.id,
      modules: track.moduleSlugs.length,
      paths: matchingPaths.length,
      title: track.title,
    };
  });

  // ── Pre-compute module titles per path for client-side search matching ──────────
  const pathModuleTitles = Object.fromEntries(
    LEARNING_PATHS.map((path) => [
      path.id,
      path.moduleSlugs.map((slug) => getLearningModuleBySlug(slug)?.title ?? ""),
    ]),
  );

  return (
    <LearnPageClient
      featuredPathIds={FEATURED_PATH_IDS}
      learningPaths={LEARNING_PATHS}
      learningTracks={LEARNING_TRACKS.map((t) => ({
        id: t.id,
        moduleSlugs: t.moduleSlugs,
        title: t.title,
      }))}
      moduleBySlug={moduleBySlug}
      pathModuleTitles={pathModuleTitles}
      popularQuestions={POPULAR_QUESTIONS}
      topicSummaries={topicSummaries}
      totalModules={learningModules.length}
    />
  );
}
