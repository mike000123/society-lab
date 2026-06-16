import Link from "next/link";
import { ArrowLeft, ArrowRight, Compass, Download } from "lucide-react";

import { AtlasPage } from "@/components/atlas/AtlasPage";
import { LessonCaseStudies } from "@/components/learn/LessonCaseStudies";
import { LessonCounterarguments } from "@/components/learn/LessonCounterarguments";
import { LessonEvidence } from "@/components/learn/LessonEvidence";
import { LessonHero } from "@/components/learn/LessonHero";
import { LessonInteractive } from "@/components/learn/LessonInteractive";
import { LessonMechanism } from "@/components/learn/LessonMechanism";
import { LessonNextActions } from "@/components/learn/LessonNextActions";
import { LessonProposals } from "@/components/learn/LessonProposals";
import { LessonSynthesis } from "@/components/learn/LessonSynthesis";
import { TimelineLessonCanvas } from "@/components/learn/TimelineLessonCanvas";
import { LessonWhyItMatters } from "@/components/learn/LessonWhyItMatters";
import { lessonAccentClasses } from "@/components/learn/lesson-theme";
import { getLessonVariant } from "@/lib/learn/lesson-variants";
import type { LearningArticleDocument } from "@/lib/learn/content";
import type { AccentTone, LearningModule , ResolvedLearningModule } from "@/lib/learn/modules";
import type { LearningPathCard } from "@/lib/learn/discovery";
import type { LearningTrack } from "@/lib/tracks/config";
import { cn } from "@/lib/utils";

type LessonSectionLink = {
  id: string;
  label: string;
};

function SidebarNav({
  currentIndex,
  currentPath,
  currentTrack,
  module,
  sectionLinks,
  trackModules,
}: {
  currentIndex: number;
  currentPath?: LearningPathCard | null;
  currentTrack?: LearningTrack | null;
  module: ResolvedLearningModule;
  sectionLinks: LessonSectionLink[];
  trackModules: LearningModule[];
}) {
  return (
    <aside className="hidden xl:block">
      <div className="sticky top-24 space-y-6">
        <Link
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800"
          href="/learn"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Learn
        </Link>

        {(currentTrack ?? currentPath) ? (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{currentPath?.title ?? currentTrack?.title}</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{module.eyebrow}</p>
              <p className="mt-3 text-sm font-medium text-slate-500">
                Lesson {currentIndex + 1} of {trackModules.length}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {trackModules.map((trackModule, index) => (
                <span
                  className={cn(
                    "h-2.5 flex-1 rounded-full",
                    index < currentIndex
                      ? "bg-[rgba(59,130,246,0.45)]"
                      : index === currentIndex
                        ? "bg-[rgb(var(--atlas-primary))]"
                        : "bg-[rgba(28,36,48,0.12)]",
                  )}
                  key={trackModule.slug}
                />
              ))}
            </div>

            <div className="space-y-3">
              {trackModules.map((trackModule, index) => {
                const isCurrent = trackModule.slug === module.slug;
                return (
                  <Link
                    className={cn(
                      "flex items-start gap-3 rounded-[1.15rem] px-3 py-3 transition",
                      isCurrent
                        ? "bg-[rgba(59,130,246,0.08)] text-slate-900"
                        : "text-slate-600 hover:bg-[rgba(246,244,238,0.72)]",
                    )}
                    href={`/learn/${trackModule.slug}`}
                    key={trackModule.slug}
                  >
                    <span
                      className={cn(
                        "mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full text-[11px] font-semibold",
                        isCurrent
                          ? "bg-[rgb(var(--atlas-primary))] text-white"
                          : "bg-[rgba(246,244,238,0.95)] text-slate-500",
                      )}
                    >
                      {index + 1}
                    </span>
                    <span className="text-sm leading-6">{trackModule.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="rounded-[1.45rem] bg-[rgba(246,244,238,0.72)] px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(28,36,48,0.08)] bg-white/90 text-slate-700">
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">In this lesson</p>
              <p className="text-sm font-semibold text-slate-900">Section guide</p>
            </div>
          </div>

          <nav className="mt-4 space-y-2">
            {sectionLinks.map((section) => (
              <a
                className="flex items-center justify-between rounded-[1rem] px-3 py-2 text-sm text-slate-600 transition hover:bg-white/88 hover:text-slate-900"
                href={`#${section.id}`}
                key={section.id}
              >
                <span>{section.label}</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </a>
            ))}
          </nav>
        </div>

        <div className="rounded-[1.45rem] border border-[rgba(28,36,48,0.08)] bg-white/82 px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.9)] text-slate-700">
              <Download className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Lesson resources</p>
              <p className="text-sm font-semibold text-slate-900">Go deeper</p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Link
              className="flex items-center justify-between rounded-[1rem] px-3 py-2 text-sm text-slate-600 transition hover:bg-[rgba(246,244,238,0.72)] hover:text-slate-900"
              href="/study"
            >
              <span>Open study library</span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            </Link>
            <Link
              className="flex items-center justify-between rounded-[1rem] px-3 py-2 text-sm text-slate-600 transition hover:bg-[rgba(246,244,238,0.72)] hover:text-slate-900"
              href="/learn#browse-by-topic"
            >
              <span>Open track explorer</span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

function LessonSequenceNav({
  accent,
  nextModule,
  pathId,
  previousModule,
}: {
  accent: AccentTone;
  nextModule?: LearningModule | null;
  pathId?: string;
  previousModule?: LearningModule | null;
}) {
  if (!previousModule && !nextModule) {
    return null;
  }

  const accentStyles = lessonAccentClasses[accent];

  return (
    <div className="flex flex-wrap gap-3 rounded-[1.5rem] border border-[rgba(28,36,48,0.08)] bg-white/82 px-5 py-4">
      {previousModule ? (
        <Link
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900",
            accentStyles.line,
          )}
          href={`/learn/${previousModule.slug}${pathId ? `?path=${pathId}` : ""}`}
        >
          <ArrowLeft className="h-4 w-4" />
          Previous lesson
        </Link>
      ) : null}
      {nextModule ? (
        <Link
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900",
            accentStyles.line,
          )}
          href={`/learn/${nextModule.slug}${pathId ? `?path=${pathId}` : ""}`}
        >
          Next lesson
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}

export function AtlasLessonPage({
  article,
  currentIndex,
  currentPath,
  currentTrack,
  heroImageSrc,
  module,
  nextModule,
  pathId,
  previousModule,
  quizQuestionCount,
  supportImageSrc,
  trackModules,
}: {
  article?: LearningArticleDocument | null;
  currentIndex: number;
  currentPath?: LearningPathCard | null;
  currentTrack?: LearningTrack | null;
  heroImageSrc: string;
  module: ResolvedLearningModule;
  nextModule?: LearningModule | null;
  pathId?: string;
  previousModule?: LearningModule | null;
  quizQuestionCount?: number;
  supportImageSrc: string;
  trackModules: LearningModule[];
}) {
  const variant = getLessonVariant(module.slug);
  const isTimelineLesson = variant === "timeline" && !module.synthesisOf;
  const sectionLinks: LessonSectionLink[] = module.synthesisOf
    ? [
        { id: "reform-proposals", label: "Reform proposals" },
        { id: "next-actions", label: "Next actions" },
      ]
    : isTimelineLesson
      ? [
          { id: "why-this-matters", label: "Why this matters" },
          { id: "timeline", label: "Timeline" },
          { id: "core-mechanism", label: "Core mechanism" },
          { id: "evidence", label: "Evidence" },
          { id: "real-world-examples", label: "Real world examples" },
          { id: "interactive-exploration", label: "Interactive exploration" },
          { id: "counterarguments", label: "Counterarguments" },
          { id: "next-actions", label: "Next actions" },
        ]
    : [
        { id: "why-this-matters", label: "Why this matters" },
        { id: "core-mechanism", label: "Core mechanism" },
        { id: "evidence", label: "Evidence" },
        { id: "real-world-examples", label: "Real world examples" },
        { id: "interactive-exploration", label: "Interactive exploration" },
        { id: "counterarguments", label: "Counterarguments" },
        { id: "what-could-change", label: "What could change this?" },
        { id: "next-actions", label: "Next actions" },
      ];

  const standardFlow = module.synthesisOf ? (
    <LessonSynthesis module={module} />
  ) : (
    <>
      <LessonWhyItMatters module={module} />
      <LessonMechanism module={module} />
      <LessonEvidence article={article} module={module} />
      <LessonCaseStudies module={module} />
      <LessonInteractive module={module} />
      <LessonCounterarguments module={module} />
      <LessonProposals module={module} />
    </>
  );

  const timelineFlow = (
    <TimelineLessonCanvas
      article={article}
      currentTrack={currentTrack}
      heroImageSrc={heroImageSrc}
      module={module}
      nextModule={nextModule}
      quizQuestionCount={quizQuestionCount}
      supportImageSrc={supportImageSrc}
    />
  );

  return (
    <AtlasPage className={cn("pb-20", isTimelineLesson ? "!max-w-[132rem]" : "!max-w-[118rem]")}>
      <div className={cn("mx-auto grid gap-8 xl:gap-10", isTimelineLesson ? "xl:grid-cols-[16.5rem_minmax(0,1fr)]" : "xl:grid-cols-[16rem_minmax(0,1fr)] xl:gap-12")}>
        <SidebarNav
          currentIndex={currentIndex}
          currentPath={currentPath}
          currentTrack={currentTrack}
          module={module}
          sectionLinks={sectionLinks}
          trackModules={trackModules}
        />

        <main className={cn("min-w-0", isTimelineLesson ? "space-y-6 xl:space-y-7" : "space-y-10 xl:space-y-12")}>
          <LessonHero
            heroImageSrc={heroImageSrc}
            module={module}
            quizQuestionCount={quizQuestionCount}
            timelineMode={isTimelineLesson}
          />
          {!isTimelineLesson ? (
            <LessonSequenceNav accent={module.accent} nextModule={nextModule} pathId={pathId} previousModule={previousModule} />
          ) : null}
          {isTimelineLesson ? timelineFlow : standardFlow}
          {!isTimelineLesson ? (
            <LessonNextActions
              currentTrack={currentTrack}
              module={module}
              nextModule={nextModule}
              quizQuestionCount={quizQuestionCount}
            />
          ) : null}
          {isTimelineLesson ? (
            <LessonSequenceNav accent={module.accent} nextModule={nextModule} pathId={pathId} previousModule={previousModule} />
          ) : null}
        </main>
      </div>
    </AtlasPage>
  );
}
