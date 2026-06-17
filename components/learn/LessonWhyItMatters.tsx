import { Check, Globe2, House, PiggyBank, ShieldAlert, TrendingUp, Wallet } from "lucide-react";

import { LessonSectionHeader } from "@/components/learn/LessonSectionHeader";
import { extractFirstSentence, lessonAccentClasses } from "@/components/learn/lesson-theme";
import type { LearningModule , ResolvedLearningModule} from "@/lib/learn/modules";
import { cn } from "@/lib/utils";

const everydayIcons = [House, Wallet, ShieldAlert];
const compactIcons = [PiggyBank, TrendingUp, Globe2];

export function LessonWhyItMatters({
  compact = false,
  module,
}: {
  compact?: boolean;
  module: ResolvedLearningModule;
}) {
  const accent = lessonAccentClasses[module.accent];
  const ordinaryImpacts = module.realWorldExamples.slice(0, 3);
  const consequenceCards = module.betterMetrics.slice(0, 3);

  if (compact) {
    return (
      <section className="space-y-4" id="why-this-matters">
        <LessonSectionHeader
          accent={module.accent}
          compact
          id="why-this-matters-heading"
          index={2}
          subtitle="The ordinary stakes before we get into the history and structure."
          title="Why this matters"
        />

        <div className="rounded-[1.7rem] border border-[rgba(28,36,48,0.08)] bg-white/84 px-4 py-4">
          <div className="grid gap-3 md:grid-cols-3">
            {consequenceCards.map((metric, index) => {
              const Icon = compactIcons[index % compactIcons.length];
              return (
                <article
                  className="rounded-[1.25rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(244,248,252,0.96)] px-4 py-4"
                  key={metric.label}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 flex-none items-center justify-center rounded-full border",
                        accent.icon,
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-slate-900">{metric.label}</h3>
                      <p className="text-sm leading-6 text-slate-600">{extractFirstSentence(metric.description)}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

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

        <div className="space-y-4 rounded-[1.8rem] bg-[rgba(241,245,249,0.78)] px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">How people feel it</p>
          <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-1">
            {ordinaryImpacts.map((example, index) => {
              const Icon = everydayIcons[index % everydayIcons.length];
              return (
                <article
                  className="rounded-[1.35rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(247,250,252,0.94)] px-4 py-4"
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
