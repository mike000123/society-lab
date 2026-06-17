"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AlertCircle, ArrowLeft, ArrowRight, ChevronRight, X } from "lucide-react";

import { CausalLoopDiagram } from "@/components/learn/CausalLoopDiagram";
import { LessonSectionHeader } from "@/components/learn/LessonSectionHeader";
import { LearningTimeline } from "@/components/learn/LearningTimeline";
import { buildMechanismSteps, extractFirstSentence, lessonAccentClasses } from "@/components/learn/lesson-theme";
import type { LearningModule , ResolvedLearningModule} from "@/lib/learn/modules";
import { cn } from "@/lib/utils";

export function LessonMechanism({
  compact = false,
  heroImageSrc,
  module,
  supportImageSrc,
}: {
  compact?: boolean;
  heroImageSrc?: string;
  module: ResolvedLearningModule;
  supportImageSrc?: string;
}) {
  const accent = lessonAccentClasses[module.accent];
  const steps = buildMechanismSteps(module.causalLoop.nodes);
  const mechanismPanels = useMemo(
    () => [
      {
        bullets: module.systemBug.signals.slice(0, 3),
        body:
          extractFirstSentence(module.causalLoop.description) ||
          extractFirstSentence(module.simpleExplanation[1]) ||
          module.systemBug.summary,
        title: "Why does pressure build?",
      },
      {
        bullets: module.realWorldExamples.slice(0, 3).map((example) => extractFirstSentence(example.outcome) || example.title),
        body:
          module.heroHighlights[2] ||
          extractFirstSentence(module.simpleExplanation[2]) ||
          module.systemBug.summary,
        title: "Who gains from a rewrite?",
      },
      {
        bullets: [
          module.systemBug.signals[3] ?? "Long stable periods make the rules feel permanent.",
          module.systemBug.signals[0] ?? "Strain appears before the official rewrite is announced.",
          extractFirstSentence(module.simpleExplanation[0]) || module.systemBug.summary,
        ],
        body: module.systemBug.summary,
        title: "Why don't people see it coming?",
      },
    ],
    [module],
  );
  const [activePanelIndex, setActivePanelIndex] = useState(0);
  const activePanel = mechanismPanels[activePanelIndex];

  if (compact) {
    return (
      <section className="space-y-4" id="core-mechanism">
        <div className="relative overflow-visible rounded-[1.8rem] border border-[rgba(28,36,48,0.08)] bg-white/84 px-4 py-4 shadow-[0_16px_30px_rgba(28,36,48,0.04)] sm:px-5 sm:py-5">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] xl:pr-[16.5rem]">
            <div className="space-y-4">
              <LessonSectionHeader
                accent={module.accent}
                compact
                id="core-mechanism-heading"
                index={3}
                subtitle="Monetary systems follow a pattern: rules are created to solve a crisis, then the stability they produce creates the pressure that eventually rewrites them."
                title="Core mechanism"
              />

              <p className="atlas-copy text-sm leading-7 text-slate-700">
                {extractFirstSentence(module.simpleExplanation[1]) || module.causalLoop.description}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 rounded-[1.4rem] bg-[rgba(241,245,249,0.84)] px-3 py-3">
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
                    {index < steps.length - 1 ? <ChevronRight className="h-4 w-4 text-slate-400" /> : null}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {mechanismPanels.map((panel, index) => (
                  <button
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium transition",
                      index === activePanelIndex
                        ? cn("text-slate-900 shadow-[0_10px_20px_rgba(28,36,48,0.05)]", accent.chip, accent.line)
                        : "border-[rgba(28,36,48,0.08)] bg-white/88 text-slate-500 hover:border-[rgba(28,36,48,0.18)] hover:text-slate-800",
                    )}
                    key={panel.title}
                    onClick={() => setActivePanelIndex(index)}
                    type="button"
                  >
                    {panel.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5">
            {module.timeline ? <LearningTimeline accent={module.accent} dense timeline={module.timeline} /> : null}
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {module.realWorldExamples.map((example, index) => (
              <article
                className="overflow-hidden rounded-[1.3rem] border border-[rgba(28,36,48,0.08)] bg-white shadow-[0_12px_24px_rgba(28,36,48,0.04)]"
                key={example.title}
              >
                <div className="relative h-28 overflow-hidden">
                  <Image
                    alt={example.title}
                    className="object-cover"
                    fill
                    sizes="(min-width: 1280px) 240px, 100vw"
                    src={
                      index === 1
                        ? supportImageSrc ?? heroImageSrc ?? "/atlas/learn-hero.png"
                        : heroImageSrc ?? supportImageSrc ?? "/atlas/learn-hero.png"
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,23,42,0.18)] via-transparent to-transparent" />
                </div>
                <div className="space-y-2 px-3 py-3">
                  <p
                    className={cn(
                      "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em]",
                      accent.chip,
                    )}
                  >
                    {index === 0 ? "Wealth transfer" : index === 1 ? "System reset" : "Emerging shift"}
                  </p>
                  <h3 className="text-sm font-semibold leading-5 text-slate-900">{example.title}</h3>
                  <p className="text-xs leading-5 text-slate-600">{extractFirstSentence(example.outcome) || example.outcome}</p>
                </div>
              </article>
            ))}
          </div>

          <aside className="mt-5 rounded-[1.45rem] border border-[rgba(28,36,48,0.1)] bg-white px-4 py-4 shadow-[0_18px_32px_rgba(28,36,48,0.07)] xl:absolute xl:right-[-2.8rem] xl:top-[7rem] xl:mt-0 xl:w-[17rem]">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold text-slate-900">{activePanel.title}</h3>
              <button
                className="inline-flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition hover:bg-[rgba(241,245,249,0.92)] hover:text-slate-700"
                onClick={() => setActivePanelIndex(0)}
                type="button"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{activePanel.body}</p>
            <ul className="mt-4 space-y-2">
              {activePanel.bullets.map((bullet) => (
                <li className="flex items-start gap-2 text-sm leading-6 text-slate-600" key={bullet}>
                  <span
                    className={cn(
                      "mt-1.5 inline-flex h-4 w-4 flex-none items-center justify-center rounded-full border",
                      accent.icon,
                    )}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              When stress crosses a threshold, leaders rewrite the rules to restore stability and redistribute power.
            </p>

            <div className="mt-4 flex items-center justify-between border-t border-[rgba(28,36,48,0.08)] pt-3 text-sm text-slate-500">
              <span>
                {activePanelIndex + 1} of {mechanismPanels.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(28,36,48,0.08)] bg-white transition hover:border-[rgba(28,36,48,0.16)] hover:text-slate-800"
                  onClick={() => setActivePanelIndex((activePanelIndex - 1 + mechanismPanels.length) % mechanismPanels.length)}
                  type="button"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(28,36,48,0.08)] bg-white transition hover:border-[rgba(28,36,48,0.16)] hover:text-slate-800"
                  onClick={() => setActivePanelIndex((activePanelIndex + 1) % mechanismPanels.length)}
                  type="button"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6" id="core-mechanism">
      <LessonSectionHeader
        accent={module.accent}
        id="core-mechanism-heading"
        index={2}
        subtitle="This is the moving structure behind the lesson: the assumptions, the feedback loops, and the sequence that keeps the system reproducing itself."
        title="Core mechanism"
      />

      <div className="grid gap-8 xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2 rounded-[1.6rem] bg-[rgba(241,245,249,0.78)] px-4 py-4">
            {steps.map((step, index) => (
              <div className="flex items-center gap-2" key={step.id}>
                <span
                  className={cn(
                    "inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]",
                    accent.chip,
                  )}
                >
                  {step.label}
                </span>
                {index < steps.length - 1 ? <ArrowRight className="h-4 w-4 text-slate-400" /> : null}
              </div>
            ))}
          </div>

          <div className="max-w-[52rem] space-y-5">
            {module.simpleExplanation.map((paragraph) => (
              <p className="atlas-copy text-[1.04rem] leading-8 text-slate-700" key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>

          <div className="rounded-[1.75rem] border border-[rgba(28,36,48,0.08)] bg-white/82 px-5 py-5">
            <div className="flex items-center gap-3">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-full border", accent.icon)}>
                <AlertCircle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">System tension</p>
                <h3 className="text-lg font-semibold text-slate-900">{module.systemBug.title}</h3>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-700">{module.systemBug.summary}</p>
            <ul className="mt-4 space-y-2">
              {module.systemBug.signals.map((signal) => (
                <li className="text-sm leading-7 text-slate-700" key={signal}>
                  • {signal}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <CausalLoopDiagram
            accent={module.accent}
            compact
            description={module.causalLoop.description}
            edges={module.causalLoop.edges}
            loops={module.causalLoop.loops}
            nodes={module.causalLoop.nodes}
            title={module.causalLoop.title}
          />
          {module.timeline ? <LearningTimeline accent={module.accent} compact timeline={module.timeline} /> : null}
        </div>
      </div>
    </section>
  );
}
