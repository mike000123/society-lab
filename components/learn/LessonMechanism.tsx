import { AlertCircle, ArrowRight } from "lucide-react";

import { CausalLoopDiagram } from "@/components/learn/CausalLoopDiagram";
import { LessonSectionHeader } from "@/components/learn/LessonSectionHeader";
import { LearningTimeline } from "@/components/learn/LearningTimeline";
import { buildMechanismSteps, lessonAccentClasses } from "@/components/learn/lesson-theme";
import type { LearningModule } from "@/lib/learn/modules";
import { cn } from "@/lib/utils";

export function LessonMechanism({ module }: { module: LearningModule }) {
  const accent = lessonAccentClasses[module.accent];
  const steps = buildMechanismSteps(module.causalLoop.nodes);

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
          <div className="flex flex-wrap items-center gap-2 rounded-[1.6rem] bg-[rgba(246,244,238,0.72)] px-4 py-4">
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
