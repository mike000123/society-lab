"use client";

import { ArrowRight, Check, Route, ShieldAlert } from "lucide-react";

import { CausalLoopDiagram } from "@/components/learn/CausalLoopDiagram";
import { LessonCaseStudies } from "@/components/learn/LessonCaseStudies";
import { LessonCounterarguments } from "@/components/learn/LessonCounterarguments";
import { LessonEvidence } from "@/components/learn/LessonEvidence";
import { LessonInteractive } from "@/components/learn/LessonInteractive";
import { LessonNextActions } from "@/components/learn/LessonNextActions";
import { LessonProposals } from "@/components/learn/LessonProposals";
import { LessonSectionHeader } from "@/components/learn/LessonSectionHeader";
import { LessonWhyItMatters } from "@/components/learn/LessonWhyItMatters";
import { buildMechanismSteps, extractFirstSentence, lessonAccentClasses } from "@/components/learn/lesson-theme";
import type { LearningArticleDocument } from "@/lib/learn/content";
import type { LearningModule, ResolvedLearningModule } from "@/lib/learn/modules";
import type { LearningTrack } from "@/lib/tracks/config";
import { cn } from "@/lib/utils";

export function ProcessLessonCanvas({
  article,
  currentTrack,
  module,
  nextModule,
  quizQuestionCount,
}: {
  article?: LearningArticleDocument | null;
  currentTrack?: LearningTrack | null;
  module: ResolvedLearningModule;
  nextModule?: LearningModule | null;
  quizQuestionCount?: number;
}) {
  const accent = lessonAccentClasses[module.accent];
  const steps = buildMechanismSteps(module.causalLoop.nodes, 6);
  const roleCards = [
    {
      body: module.heroHighlights[0] ?? (extractFirstSentence(module.simpleExplanation[0]) || module.summary),
      title: "Who is in the room?",
    },
    {
      body: module.heroHighlights[1] ?? (extractFirstSentence(module.simpleExplanation[1]) || module.summary),
      title: "Where does the decision move?",
    },
    {
      body: module.heroHighlights[2] ?? (extractFirstSentence(module.simpleExplanation[2]) || module.systemBug.summary),
      title: "Where does power hide?",
    },
  ];

  return (
    <div className="space-y-6 xl:space-y-7">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.46fr)_minmax(0,0.54fr)]">
        <LessonWhyItMatters compact module={module} />

        <section className="space-y-4" id="core-mechanism">
          <LessonSectionHeader
            accent={module.accent}
            compact
            id="core-mechanism-heading"
            index={3}
            subtitle="Follow the actual institutional path from proposal to outcome, and notice where bargaining, vetoes, and implementation change the result."
            title="Core mechanism"
          />

          <div className="rounded-[1.8rem] border border-[rgba(28,36,48,0.08)] bg-white/84 px-4 py-4 shadow-[0_16px_30px_rgba(28,36,48,0.04)] sm:px-5 sm:py-5">
            <div className="grid gap-5 2xl:grid-cols-[minmax(0,0.76fr)_minmax(0,1.24fr)]">
              <div className="space-y-4">
                <p className="atlas-copy text-sm leading-7 text-slate-700">
                  {module.causalLoop.description}
                </p>

                {module.simpleExplanation.slice(0, 2).map((paragraph) => (
                  <p className="text-sm leading-7 text-slate-600" key={paragraph}>
                    {paragraph}
                  </p>
                ))}

                <div
                  className={cn(
                    "rounded-[1.3rem] border px-4 py-4 ring-1",
                    accent.panel,
                    accent.line,
                    accent.ring,
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn("flex h-9 w-9 flex-none items-center justify-center rounded-full border", accent.icon)}>
                      <ShieldAlert className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">System tension</p>
                      <h3 className="mt-1 text-base font-semibold text-slate-900">{module.systemBug.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-700">{module.systemBug.summary}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[1.35rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(247,250,252,0.96)] px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className={cn("flex h-8 w-8 items-center justify-center rounded-full border", accent.icon)}>
                      <Route className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900">Decision pathway</p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {steps.map((step, index) => (
                      <div className="flex items-center gap-2" key={step.id}>
                        <span
                          className={cn(
                            "inline-flex rounded-[1rem] border px-3 py-2 text-xs font-semibold",
                            accent.chip,
                          )}
                        >
                          {step.label}
                        </span>
                        {index < steps.length - 1 ? <ArrowRight className="h-4 w-4 text-slate-400" /> : null}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {roleCards.map((card) => (
                    <article
                      className="rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-white/92 px-4 py-4"
                      key={card.title}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn("mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full border", accent.icon)}>
                          <Check className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900">{card.title}</h3>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{card.body}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <CausalLoopDiagram
                  accent={module.accent}
                  compact
                  description={module.causalLoop.description}
                  edges={module.causalLoop.edges}
                  loops={module.causalLoop.loops}
                  nodes={module.causalLoop.nodes}
                  title={module.causalLoop.title}
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
        <LessonEvidence article={article} module={module} />
        <div className="space-y-6">
          <LessonInteractive compact module={module} />
          <LessonCounterarguments compact module={module} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <LessonCaseStudies compact module={module} />
        <LessonNextActions
          compact
          currentTrack={currentTrack}
          module={module}
          nextModule={nextModule}
          quizQuestionCount={quizQuestionCount}
        />
      </div>

      <LessonProposals module={module} />
    </div>
  );
}
