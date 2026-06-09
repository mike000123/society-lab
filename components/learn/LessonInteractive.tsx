import { MiniLesson } from "@/components/learn/MiniLesson";
import { LessonSectionHeader } from "@/components/learn/LessonSectionHeader";
import { lessonAccentClasses } from "@/components/learn/lesson-theme";
import type { LearningModule } from "@/lib/learn/modules";

export function LessonInteractive({ module }: { module: LearningModule }) {
  const accent = lessonAccentClasses[module.accent];
  const keyLesson = module.heroHighlights[1] ?? module.systemBug.summary;

  return (
    <section className="space-y-6" id="interactive-exploration">
      <LessonSectionHeader
        accent={module.accent}
        id="interactive-exploration-heading"
        index={5}
        subtitle="Try it yourself: adjust the variables, observe the outcomes, and test whether the mechanism still holds when conditions change."
        title="Interactive exploration"
      />

      <div className="space-y-4">
        <MiniLesson accent={module.accent} compact lesson={module.miniLesson} />
        <div className={`rounded-[1.45rem] border border-[rgba(28,36,48,0.08)] ${accent.panel} px-4 py-4`}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Key lesson</p>
          <p className="mt-2 text-sm leading-7 text-slate-700">{keyLesson}</p>
        </div>
      </div>
    </section>
  );
}
