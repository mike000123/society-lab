import { LessonSectionHeader } from "@/components/learn/LessonSectionHeader";
import { lessonAccentClasses } from "@/components/learn/lesson-theme";
import type { LearningModule, RealWorldExample } from "@/lib/learn/modules";
import { cn } from "@/lib/utils";

function CaseStudyItem({
  accent,
  example,
  index,
}: {
  accent: LearningModule["accent"];
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

      <div className="space-y-3 rounded-[1.3rem] bg-[rgba(246,244,238,0.72)] px-4 py-4">
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

export function LessonCaseStudies({ module }: { module: LearningModule }) {
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
