import { Check, House, ShieldAlert, Wallet } from "lucide-react";

import { LessonSectionHeader } from "@/components/learn/LessonSectionHeader";
import { lessonAccentClasses } from "@/components/learn/lesson-theme";
import type { LearningModule } from "@/lib/learn/modules";
import { cn } from "@/lib/utils";

const everydayIcons = [House, Wallet, ShieldAlert];

export function LessonWhyItMatters({ module }: { module: LearningModule }) {
  const accent = lessonAccentClasses[module.accent];
  const ordinaryImpacts = module.realWorldExamples.slice(0, 3);

  return (
    <section className="space-y-6" id="why-this-matters">
      <LessonSectionHeader
        accent={module.accent}
        id="why-this-matters-heading"
        index={1}
        subtitle="Before the theory, look at the consequences this system creates and where ordinary people feel them."
        title="Why this matters"
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="space-y-4 rounded-[1.8rem] border border-[rgba(28,36,48,0.08)] bg-white/82 px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">System consequences</p>
          <div className="space-y-3">
            {module.heroHighlights.slice(0, 3).map((highlight) => (
              <div className="flex items-start gap-3" key={highlight}>
                <div
                  className={cn(
                    "mt-1 flex h-8 w-8 flex-none items-center justify-center rounded-full border",
                    accent.icon,
                  )}
                >
                  <Check className="h-4 w-4" />
                </div>
                <p className="text-sm leading-7 text-slate-700">{highlight}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-[1.8rem] bg-[rgba(246,244,238,0.72)] px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">How people feel it</p>
          <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-1">
            {ordinaryImpacts.map((example, index) => {
              const Icon = everydayIcons[index % everydayIcons.length];
              return (
                <article
                  className="rounded-[1.35rem] border border-[rgba(28,36,48,0.08)] bg-white/86 px-4 py-4"
                  key={example.title}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex h-9 w-9 flex-none items-center justify-center rounded-full border",
                        accent.icon,
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{example.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-700">{example.outcome}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
