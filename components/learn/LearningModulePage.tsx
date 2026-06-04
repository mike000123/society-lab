import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  ClipboardCheck,
  Clock3,
  Compass,
  Layers3,
  Play,
  Radar,
  Sparkles,
} from "lucide-react";

import { AtlasPage } from "@/components/atlas/AtlasPage";
import { SoftPanel } from "@/components/atlas/SoftPanel";
import { CausalLoopDiagram } from "@/components/learn/CausalLoopDiagram";
import { CounterArgumentPanel } from "@/components/learn/CounterArgumentPanel";
import { LearningTimeline } from "@/components/learn/LearningTimeline";
import { MiniLesson } from "@/components/learn/MiniLesson";
import { ModuleArticlePanel } from "@/components/learn/ModuleArticlePanel";
import { ModuleEvidencePanel } from "@/components/learn/ModuleEvidencePanel";
import { RelatedActions } from "@/components/learn/RelatedActions";
import { Button } from "@/components/ui/button";
import type { LearningArticleDocument } from "@/lib/learn/content";
import { getLearningModuleBySlug, type AccentTone, type LearningModule } from "@/lib/learn/modules";
import { getQuizBySlug } from "@/lib/quiz/questions";
import { LEARNING_TRACKS } from "@/lib/tracks/config";
import { cn } from "@/lib/utils";

const accentClasses: Record<
  AccentTone,
  {
    badge: string;
    chip: string;
    glow: string;
    icon: string;
    route: string;
    soft: string;
  }
> = {
  amber: {
    badge: "border-amber-300 bg-amber-50 text-amber-700",
    chip: "border-amber-200 bg-amber-50/70 text-slate-700",
    glow: "from-[rgba(212,168,79,0.14)] via-[rgba(212,168,79,0.08)] to-transparent",
    icon: "border-amber-200 bg-amber-50 text-amber-600",
    route: "border-amber-300 bg-amber-50 text-amber-700",
    soft: "border-amber-200/80 bg-amber-50/55",
  },
  cyan: {
    badge: "border-cyan-300 bg-cyan-50 text-cyan-700",
    chip: "border-cyan-200 bg-cyan-50/70 text-slate-700",
    glow: "from-[rgba(59,130,246,0.12)] via-[rgba(103,232,249,0.08)] to-transparent",
    icon: "border-cyan-200 bg-cyan-50 text-cyan-600",
    route: "border-cyan-300 bg-cyan-50 text-cyan-700",
    soft: "border-cyan-200/80 bg-cyan-50/55",
  },
  emerald: {
    badge: "border-emerald-300 bg-emerald-50 text-emerald-700",
    chip: "border-emerald-200 bg-emerald-50/70 text-slate-700",
    glow: "from-[rgba(76,175,80,0.14)] via-[rgba(76,175,80,0.08)] to-transparent",
    icon: "border-emerald-200 bg-emerald-50 text-emerald-600",
    route: "border-emerald-300 bg-emerald-50 text-emerald-700",
    soft: "border-emerald-200/80 bg-emerald-50/55",
  },
  rose: {
    badge: "border-rose-300 bg-rose-50 text-rose-700",
    chip: "border-rose-200 bg-rose-50/70 text-slate-700",
    glow: "from-[rgba(244,114,182,0.14)] via-[rgba(251,146,60,0.08)] to-transparent",
    icon: "border-rose-200 bg-rose-50 text-rose-600",
    route: "border-rose-300 bg-rose-50 text-rose-700",
    soft: "border-rose-200/80 bg-rose-50/55",
  },
};

const softToneByAccent: Record<AccentTone, "neutral" | "blue" | "gold" | "green"> = {
  amber: "gold",
  cyan: "blue",
  emerald: "green",
  rose: "neutral",
};

export function LearningModulePage({
  article,
  module,
}: {
  article?: LearningArticleDocument | null;
  module: LearningModule;
}) {
  const quiz = getQuizBySlug(module.slug);
  const accent = accentClasses[module.accent];
  const panelTone = softToneByAccent[module.accent];

  const currentTrack = LEARNING_TRACKS.find((track) => track.moduleSlugs.includes(module.slug));
  const trackModuleSlugs = currentTrack?.moduleSlugs ?? [];
  const currentIndex = trackModuleSlugs.indexOf(module.slug);
  const previousSlug = currentIndex > 0 ? trackModuleSlugs[currentIndex - 1] : null;
  const nextSlug = currentIndex >= 0 && currentIndex < trackModuleSlugs.length - 1 ? trackModuleSlugs[currentIndex + 1] : null;
  const previousModule = previousSlug ? moduleLookup(previousSlug) : null;
  const nextModule = nextSlug ? moduleLookup(nextSlug) : null;

  const sectionLinks = [
    { id: "overview", label: "Overview" },
    ...(article ? [{ id: "guided-reading", label: "Guided reading" }] : []),
    { id: "system-map", label: "System map" },
    ...(module.timeline ? [{ id: "history", label: "Timeline" }] : []),
    { id: "examples", label: "Examples" },
    ...(module.evidenceLinks && module.evidenceLinks.length > 0 ? [{ id: "evidence", label: "Evidence" }] : []),
    { id: "practice", label: "Mini lesson" },
    { id: "counterarguments", label: "Counterarguments" },
    { id: "next-actions", label: "Next actions" },
    ...(quiz ? [{ id: "quiz", label: "Quiz" }] : []),
  ];

  return (
    <AtlasPage className="space-y-8 pb-14">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-[rgba(28,36,48,0.08)] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(245,240,229,0.86)_48%,rgba(229,238,243,0.78))] p-6 shadow-[0_28px_80px_rgba(28,36,48,0.08)] sm:p-8 lg:p-10">
        <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b", accent.glow)} />

        <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1.08fr)_21rem]">
          <div className="space-y-6">
            <Link
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800"
              href="/learn"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Learn
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]", accent.badge)}>
                {module.eyebrow}
              </span>
              {currentTrack ? (
                <Link
                  className="inline-flex rounded-full border border-[rgba(28,36,48,0.08)] bg-white/78 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 transition hover:text-slate-800"
                  href="/learn?view=tracks"
                >
                  {currentTrack.title}
                </Link>
              ) : null}
              <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(28,36,48,0.08)] bg-white/78 px-3 py-1 text-xs font-medium text-slate-500">
                <Clock3 className="h-3.5 w-3.5" />
                {module.readingTime}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(28,36,48,0.08)] bg-white/78 px-3 py-1 text-xs font-medium text-slate-500">
                <Layers3 className="h-3.5 w-3.5" />
                {module.difficulty}
              </span>
            </div>

            <div className="max-w-4xl space-y-4">
              <h1 className="atlas-display text-4xl leading-[0.96] text-slate-900 sm:text-5xl lg:text-6xl">{module.title}</h1>
              <p className="atlas-lede max-w-3xl">{module.summary}</p>
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

            <div className="grid gap-3 md:grid-cols-3">
              {module.heroHighlights.map((highlight) => (
                <div
                  className={cn("rounded-[1.5rem] border px-4 py-4 text-sm leading-6 shadow-sm", accent.soft)}
                  key={highlight}
                >
                  {highlight}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {quiz ? (
                <Button asChild className="h-auto gap-2 px-5 py-3">
                  <Link href={`/quiz/${module.slug}`}>
                    Take the quiz
                    <ClipboardCheck className="h-4 w-4" />
                  </Link>
                </Button>
              ) : null}
              {module.simulatorSlug ? (
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white/84 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
                  href={`/simulator/${module.simulatorSlug}`}
                >
                  Open simulator
                  <Play className="h-4 w-4" />
                </Link>
              ) : null}
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white/84 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
                href="/study"
              >
                Open study resources
                <BookOpenText className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <SoftPanel tone={panelTone}>
              <div className="space-y-3">
                <p className="atlas-kicker">Lesson route</p>
                <h2 className="atlas-display text-3xl leading-tight text-slate-900">
                  {currentTrack ? currentTrack.title : "Independent lesson"}
                </h2>
                <p className="atlas-copy text-sm">
                  {currentTrack
                    ? `Stop ${currentIndex + 1} of ${trackModuleSlugs.length} in this track.`
                    : "This lesson stands on its own, but still connects to the wider atlas."}
                </p>
              </div>

              {currentTrack ? (
                <div className="mt-4 space-y-3">
                  {previousModule ? (
                    <Link
                      className="flex items-start justify-between gap-3 rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-white/78 px-4 py-3 transition hover:border-[rgba(28,36,48,0.18)]"
                      href={`/learn/${previousModule.slug}`}
                    >
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Previous</p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">{previousModule.title}</p>
                      </div>
                      <ArrowLeft className="mt-1 h-4 w-4 flex-none text-slate-400" />
                    </Link>
                  ) : null}

                  {nextModule ? (
                    <Link
                      className="flex items-start justify-between gap-3 rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-white/78 px-4 py-3 transition hover:border-[rgba(28,36,48,0.18)]"
                      href={`/learn/${nextModule.slug}`}
                    >
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Next</p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">{nextModule.title}</p>
                      </div>
                      <ArrowRight className="mt-1 h-4 w-4 flex-none text-slate-400" />
                    </Link>
                  ) : null}
                </div>
              ) : null}
            </SoftPanel>

            <SoftPanel>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className={cn("flex h-9 w-9 items-center justify-center rounded-full border", accent.icon)}>
                    <Compass className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="atlas-kicker">In this lesson</p>
                    <h2 className="atlas-display text-2xl text-slate-900">Section guide</h2>
                  </div>
                </div>

                <nav className="grid gap-2">
                  {sectionLinks.map((section) => (
                    <a
                      className="flex items-center justify-between rounded-[1.1rem] border border-[rgba(28,36,48,0.08)] bg-white/78 px-4 py-3 text-sm font-medium text-slate-600 transition hover:border-[rgba(28,36,48,0.18)] hover:text-slate-900"
                      href={`#${section.id}`}
                      key={section.id}
                    >
                      <span>{section.label}</span>
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                    </a>
                  ))}
                </nav>
              </div>
            </SoftPanel>
          </div>
        </div>
      </section>

      {currentTrack ? (
        <section className="overflow-hidden rounded-[2rem] border border-[rgba(28,36,48,0.08)] bg-white/72 px-5 py-5 shadow-[0_18px_40px_rgba(28,36,48,0.05)]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="atlas-kicker">Track path</p>
              <p className="atlas-copy text-sm">
                This lesson sits inside a sequence. Follow the route in order, or jump sideways through the atlas when the question broadens.
              </p>
            </div>
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white/84 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
              href="/learn?view=tracks"
            >
              Open track explorer
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-1">
            {trackModuleSlugs.map((slug, index) => {
              const trackLesson = moduleLookup(slug);
              const isCurrent = slug === module.slug;
              const isPast = currentIndex >= 0 && index < currentIndex;
              const isFuture = currentIndex >= 0 && index > currentIndex;

              return (
                <Link
                  className={cn(
                    "min-w-[14rem] shrink-0 rounded-[1.5rem] border px-4 py-4 transition-colors",
                    isCurrent
                      ? cn("shadow-sm", accent.route)
                      : isPast
                        ? "border-[rgba(28,36,48,0.08)] bg-white/88 text-slate-700 hover:border-[rgba(28,36,48,0.18)]"
                        : "border-[rgba(28,36,48,0.08)] bg-slate-50/90 text-slate-500 hover:border-[rgba(28,36,48,0.16)]",
                  )}
                  href={`/learn/${slug}`}
                  key={slug}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                      Stop {index + 1}
                    </span>
                    {isCurrent ? <Sparkles className="h-4 w-4" /> : null}
                  </div>
                  <p className={cn("mt-3 text-base font-semibold leading-6", isFuture ? "text-slate-500" : "text-slate-900")}>
                    {trackLesson?.title}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)]" id="overview">
        <SoftPanel tone={panelTone}>
          <div className="space-y-4">
            <p className="atlas-kicker">Overview</p>
            <h2 className="atlas-display text-3xl leading-tight text-slate-900">The big picture in plain language</h2>
            <div className="space-y-4">
              {module.simpleExplanation.map((paragraph) => (
                <p className="atlas-copy text-base leading-8" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </SoftPanel>

        <div className="space-y-6">
          <SoftPanel>
            <div className="flex items-center gap-3">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-full border", accent.icon)}>
                <Radar className="h-4 w-4" />
              </div>
              <div>
                <p className="atlas-kicker">System bug</p>
                <h2 className="atlas-display text-2xl text-slate-900">{module.systemBug.title}</h2>
              </div>
            </div>
            <p className="atlas-copy mt-4 text-sm leading-7">{module.systemBug.summary}</p>
            <div className="mt-4 grid gap-3">
              {module.systemBug.signals.map((signal) => (
                <div
                  className="rounded-[1.25rem] border border-[rgba(28,36,48,0.08)] bg-white/82 px-4 py-3 text-sm leading-6 text-slate-600"
                  key={signal}
                >
                  {signal}
                </div>
              ))}
            </div>
          </SoftPanel>

          <SoftPanel tone={panelTone}>
            <p className="atlas-kicker">{module.betterMetricsTitle}</p>
            <div className="mt-4 grid gap-3">
              {module.betterMetrics.map((item) => (
                <div
                  className="rounded-[1.25rem] border border-[rgba(28,36,48,0.08)] bg-white/82 px-4 py-3"
                  key={item.label}
                >
                  <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </SoftPanel>
        </div>
      </section>

      {article ? (
        <div id="guided-reading">
          <ModuleArticlePanel accent={module.accent} article={article} />
        </div>
      ) : null}

      <div id="system-map">
        <CausalLoopDiagram
          accent={module.accent}
          description={module.causalLoop.description}
          edges={module.causalLoop.edges}
          loops={module.causalLoop.loops}
          nodes={module.causalLoop.nodes}
          title={module.causalLoop.title}
        />
      </div>

      {module.timeline ? (
        <div id="history">
          <LearningTimeline accent={module.accent} timeline={module.timeline} />
        </div>
      ) : null}

      <section className="rounded-[1.9rem] border border-[rgba(28,36,48,0.08)] bg-white/74 p-5 shadow-[0_18px_40px_rgba(28,36,48,0.05)] sm:p-6" id="examples">
        <div className="space-y-2">
          <p className="atlas-kicker">Real-world examples</p>
          <h2 className="atlas-display text-3xl text-slate-900">Where the pattern shows up in the world</h2>
          <p className="atlas-copy max-w-3xl text-sm">
            Examples make the system visible. The point is not only to name cases, but to show the repeated logic that links them.
          </p>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {module.realWorldExamples.map((example) => (
            <article
              className="rounded-[1.5rem] border border-[rgba(28,36,48,0.08)] bg-white/84 p-5"
              key={example.title}
            >
              <h3 className="atlas-display text-2xl leading-tight text-slate-900">{example.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{example.outcome}</p>
              <div className={cn("mt-4 rounded-[1.2rem] border px-4 py-4", accent.soft)}>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Why it matters</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{example.insight}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {module.evidenceLinks && module.evidenceLinks.length > 0 ? (
        <div id="evidence">
          <ModuleEvidencePanel accent={module.accent} evidenceLinks={module.evidenceLinks} />
        </div>
      ) : null}

      <div id="practice">
        <MiniLesson accent={module.accent} lesson={module.miniLesson} />
      </div>

      <div id="counterarguments">
        <CounterArgumentPanel counterArguments={module.counterArguments} />
      </div>

      <div id="next-actions">
        <RelatedActions
          accent={module.accent}
          discussionPrompt={module.discussionPrompt}
          moduleSlug={module.slug}
          simulationPrompt={module.simulationPrompt}
          simulatorSlug={module.simulatorSlug}
        />
      </div>

      {quiz ? (
        <section
          className="rounded-[1.9rem] border border-[rgba(28,36,48,0.08)] bg-white/76 p-5 shadow-[0_18px_40px_rgba(28,36,48,0.05)] sm:p-6"
          id="quiz"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-3">
              <div className={cn("flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border", accent.icon)}>
                <ClipboardCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Test your understanding</p>
                <p className="text-sm text-slate-500">
                  {quiz.questions.length} questions with immediate explanations so the lesson closes as a real checkpoint.
                </p>
              </div>
            </div>
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[rgb(var(--atlas-primary))] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(59,130,246,0.18)] transition hover:bg-blue-500"
              href={`/quiz/${module.slug}`}
            >
              Take the quiz
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      ) : null}
    </AtlasPage>
  );
}

function moduleLookup(slug: string) {
  return getLearningModuleBySlug(slug);
}
