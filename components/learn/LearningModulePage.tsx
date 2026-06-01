import Link from "next/link";
import { ArrowLeft, Clock3, Layers3, Radar, ClipboardCheck } from "lucide-react";

import { CausalLoopDiagram } from "@/components/learn/CausalLoopDiagram";
import { CounterArgumentPanel } from "@/components/learn/CounterArgumentPanel";
import { LearningTimeline } from "@/components/learn/LearningTimeline";
import { MiniLesson } from "@/components/learn/MiniLesson";
import { ModuleArticlePanel } from "@/components/learn/ModuleArticlePanel";
import { ModuleEvidencePanel } from "@/components/learn/ModuleEvidencePanel";
import { RelatedActions } from "@/components/learn/RelatedActions";
import type { LearningArticleDocument } from "@/lib/learn/content";
import { getQuizBySlug } from "@/lib/quiz/questions";
import type { AccentTone, LearningModule } from "@/lib/learn/modules";
import { cn } from "@/lib/utils";

const accentClasses: Record<
  AccentTone,
  {
    badge: string;
    chip: string;
    glow: string;
    icon: string;
  }
> = {
  amber: {
    badge: "border-amber-300/25 bg-amber-400/10 text-amber-100",
    chip: "border-amber-300/15 bg-amber-400/5 text-amber-50",
    glow: "from-amber-400/18 via-amber-400/6 to-transparent",
    icon: "text-amber-200",
  },
  cyan: {
    badge: "border-cyan-300/25 bg-cyan-400/10 text-cyan-100",
    chip: "border-cyan-300/15 bg-cyan-400/5 text-cyan-50",
    glow: "from-cyan-400/18 via-cyan-400/6 to-transparent",
    icon: "text-cyan-200",
  },
  emerald: {
    badge: "border-emerald-300/25 bg-emerald-400/10 text-emerald-100",
    chip: "border-emerald-300/15 bg-emerald-400/5 text-emerald-50",
    glow: "from-emerald-400/18 via-emerald-400/6 to-transparent",
    icon: "text-emerald-200",
  },
  rose: {
    badge: "border-rose-300/25 bg-rose-400/10 text-rose-100",
    chip: "border-rose-300/15 bg-rose-400/5 text-rose-50",
    glow: "from-rose-400/18 via-rose-400/6 to-transparent",
    icon: "text-rose-200",
  },
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

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-10">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/85 p-6 sm:p-8">
        <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b", accent.glow)} />
        <div className="relative space-y-5">
          <Link
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-slate-200"
            href="/learn"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to learning modules
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-medium", accent.badge)}>
              {module.eyebrow}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
              <Clock3 className="h-3.5 w-3.5" />
              {module.readingTime}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
              <Layers3 className="h-3.5 w-3.5" />
              {module.difficulty}
            </span>
          </div>

          <div className="max-w-4xl">
            <h1 className="text-3xl font-black tracking-tight text-slate-50 sm:text-5xl">{module.title}</h1>
            <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">{module.summary}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {module.relatedFrameworks.map((framework) => (
              <span
                className="inline-flex rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-xs font-medium text-slate-200"
                key={framework}
              >
                {framework}
              </span>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {module.heroHighlights.map((highlight) => (
              <div
                className={cn("rounded-[1.5rem] border px-4 py-4 text-sm leading-6", accent.chip)}
                key={highlight}
              >
                {highlight}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[1.75rem] border border-slate-800 bg-panel/90 p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Simple explanation</p>
          <div className="mt-4 space-y-4">
            {module.simpleExplanation.map((paragraph) => (
              <p className="text-sm leading-7 text-slate-300 sm:text-base" key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </article>

        <aside className="space-y-5">
          <article className="rounded-[1.75rem] border border-slate-800 bg-panel/90 p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Radar className={cn("h-5 w-5", accent.icon)} />
              <h2 className="text-xl font-semibold text-slate-50">{module.systemBug.title}</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{module.systemBug.summary}</p>
            <div className="mt-5 grid gap-3">
              {module.systemBug.signals.map((signal) => (
                <div
                  className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm leading-6 text-slate-300"
                  key={signal}
                >
                  {signal}
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-slate-800 bg-panel/90 p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{module.betterMetricsTitle}</p>
            <div className="mt-4 grid gap-3">
              {module.betterMetrics.map((item) => (
                <div
                  className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3"
                  key={item.label}
                >
                  <p className="text-sm font-semibold text-slate-50">{item.label}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">{item.description}</p>
                </div>
              ))}
            </div>
          </article>
        </aside>
      </section>

      {article ? <ModuleArticlePanel accent={module.accent} article={article} /> : null}

      <CausalLoopDiagram
        accent={module.accent}
        description={module.causalLoop.description}
        edges={module.causalLoop.edges}
        loops={module.causalLoop.loops}
        nodes={module.causalLoop.nodes}
        title={module.causalLoop.title}
      />

      {module.timeline && <LearningTimeline accent={module.accent} timeline={module.timeline} />}

      <section className="rounded-[1.75rem] border border-slate-800 bg-panel/90 p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Real-world examples</p>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {module.realWorldExamples.map((example) => (
            <article
              className="rounded-[1.5rem] border border-slate-800 bg-slate-950/60 p-5"
              key={example.title}
            >
              <h2 className="text-lg font-semibold text-slate-50">{example.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{example.outcome}</p>
              <div className="mt-4 rounded-2xl border border-slate-800 bg-panel/80 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Why it matters</p>
                <p className="mt-2 text-sm leading-6 text-slate-200">{example.insight}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {module.evidenceLinks && module.evidenceLinks.length > 0 && (
        <ModuleEvidencePanel accent={module.accent} evidenceLinks={module.evidenceLinks} />
      )}

      <MiniLesson accent={module.accent} lesson={module.miniLesson} />

      <CounterArgumentPanel counterArguments={module.counterArguments} />

      <RelatedActions
        accent={module.accent}
        discussionPrompt={module.discussionPrompt}
        moduleSlug={module.slug}
        simulationPrompt={module.simulationPrompt}
        simulatorSlug={module.simulatorSlug}
      />

      {quiz && (
        <section className="rounded-[1.75rem] border border-slate-800 bg-panel/90 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10">
              <ClipboardCheck className="h-5 w-5 text-cyan-300" />
            </div>
            <div>
              <p className="font-semibold text-slate-50">Test your understanding</p>
              <p className="text-sm text-slate-400">{quiz.questions.length} questions · immediately graded with explanations</p>
            </div>
          </div>
          <Link
            href={`/quiz/${module.slug}`}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-cyan-400 flex-shrink-0"
          >
            Take the quiz
          </Link>
          </section>
        )}
    </div>
  );
}
