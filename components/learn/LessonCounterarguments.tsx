import { LessonSectionHeader } from "@/components/learn/LessonSectionHeader";
import { lessonAccentClasses } from "@/components/learn/lesson-theme";
import type { LearningModule , ResolvedLearningModule} from "@/lib/learn/modules";
import { cn } from "@/lib/utils";

export function LessonCounterarguments({ module }: { module: ResolvedLearningModule }) {
  const accent = lessonAccentClasses[module.accent];

  return (
    <section className="space-y-6" id="counterarguments">
      <LessonSectionHeader
        accent={module.accent}
        id="counterarguments-heading"
        index={6}
        subtitle="A useful lesson should face its strongest objections directly, answer them clearly, and stay anchored in the evidence you just saw."
        title="Counterarguments"
      />

      <div className="divide-y divide-[rgba(28,36,48,0.08)] overflow-hidden rounded-[1.6rem] border border-[rgba(28,36,48,0.08)] bg-white/82">
        {module.counterArguments.map((argument, index) => (
          <details className="group" key={argument.title} open={index === 0}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 inline-flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-semibold",
                    accent.step,
                  )}
                >
                  {index + 1}
                </span>
                <div>
                  <p className="text-base font-semibold text-slate-900">{argument.title}</p>
                  <p className="mt-1 text-sm leading-7 text-slate-600">{argument.point}</p>
                </div>
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 transition group-open:rotate-180">
                ˅
              </span>
            </summary>
            <div className="grid gap-3 px-5 pb-5 pl-[4.4rem]">
              <div className="rounded-[1.15rem] bg-[rgba(246,244,238,0.72)] px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Claim</p>
                <p className="mt-2 text-sm leading-7 text-slate-700">{argument.point}</p>
              </div>
              <div className="rounded-[1.15rem] bg-[rgba(246,244,238,0.72)] px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Response</p>
                <p className="mt-2 text-sm leading-7 text-slate-700">{argument.response}</p>
              </div>
              <div className="rounded-[1.15rem] border border-[rgba(28,36,48,0.08)] bg-white/84 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Evidence</p>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  Revisit the evidence, system signals, and case studies above to test whether this objection weakens the mechanism or simply describes one tradeoff inside it.
                </p>
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
