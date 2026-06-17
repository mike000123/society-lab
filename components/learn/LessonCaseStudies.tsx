import { LessonSectionHeader } from "@/components/learn/LessonSectionHeader";
import { extractFirstSentence, lessonAccentClasses } from "@/components/learn/lesson-theme";
import type { AccentTone, LearningModule, RealWorldExample , ResolvedLearningModule } from "@/lib/learn/modules";
import { cn } from "@/lib/utils";

function CaseStudyItem({
  accent,
  example,
  index,
}: {
  accent: AccentTone;
  example: RealWorldExample;
  index: number;
}) {
  const accentStyles = lessonAccentClasses[accent];

  return (
    <article
      className={cn(
        "grid gap-4 border-t border-[rgba(28,36,48,0.08)] pt-5 md:grid-cols-[2.4rem_minmax(0,1fr)_18rem]",
        index === 0 ? "border-t-0 pt-0" : "",
      )}
    >
      <div
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold",
          accentStyles.step,
        )}
      >
        {index + 1}
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Case</p>
          <h3 className="mt-1 atlas-display text-[1.65rem] leading-tight text-slate-900">{example.title}</h3>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">What happened</p>
          <p className="mt-2 text-base leading-8 text-slate-700">{example.outcome}</p>
        </div>
      </div>

      <div className="space-y-3 rounded-[1.3rem] bg-[rgba(241,245,249,0.78)] px-4 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Why it matters</p>
          <p className="mt-2 text-sm leading-7 text-slate-700">{example.insight}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">What it teaches</p>
          <p className="mt-2 text-sm leading-7 text-slate-700">{example.insight}</p>
        </div>
      </div>
    </article>
  );
}

export function LessonCaseStudies({
  compact = false,
  module,
}: {
  compact?: boolean;
  module: ResolvedLearningModule;
}) {
  if (compact) {
    return (
      <section className="space-y-4" id="real-world-examples">
        <LessonSectionHeader
          accent={module.accent}
          compact
          id="real-world-examples-heading"
          index={5}
          subtitle="Case studies that show the same mechanism in the world."
          title="Real world examples"
        />

        <div className="grid gap-3 lg:grid-cols-3">
          {module.realWorldExamples.map((example, index) => (
            <article
              className="overflow-hidden rounded-[1.45rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(247,250,252,0.94)] shadow-[0_14px_26px_rgba(28,36,48,0.04)]"
              key={example.title}
            >
              <div className={cn("h-24 px-4 py-4", lessonAccentClasses[module.accent].panel)}>
                <span
                  className={cn(
                    "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
                    lessonAccentClasses[module.accent].chip,
                  )}
                >
                  Case {index + 1}
                </span>
                <h3 className="mt-3 text-lg font-semibold leading-tight text-slate-900">{example.title}</h3>
              </div>
              <div className="space-y-3 px-4 py-4">
                <p className="text-sm leading-6 text-slate-600">{extractFirstSentence(example.outcome) || example.outcome}</p>
                <div className="rounded-[1rem] bg-[rgba(241,245,249,0.82)] px-3 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">What it teaches</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{extractFirstSentence(example.insight) || example.insight}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6" id="real-world-examples">
      <LessonSectionHeader
        accent={module.accent}
        id="real-world-examples-heading"
        index={4}
        subtitle="These are not random anecdotes. They are places where the same structure appears in the world and reveals what the theory is really saying."
        title="Real world examples"
      />

      <div className="mx-auto max-w-[68rem] space-y-5">
        {module.realWorldExamples.map((example, index) => (
          <CaseStudyItem accent={module.accent} example={example} index={index} key={example.title} />
        ))}
      </div>
    </section>
  );
}
