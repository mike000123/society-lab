import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  ClipboardCheck,
  MessageSquare,
  Play,
} from "lucide-react";

import { SharedLearnersPanel } from "@/components/social/SharedLearnersPanel";
import { Button } from "@/components/ui/button";
import { LessonSectionHeader } from "@/components/learn/LessonSectionHeader";
import type { LearningModule , ResolvedLearningModule} from "@/lib/learn/modules";
import { getLessonSimulationHref, hasLessonSimulator } from "@/lib/learn/simulator-routing";
import type { LearningTrack } from "@/lib/tracks/config";
import { cn, withQuery } from "@/lib/utils";

export function LessonNextActions({
  compact = false,
  currentTrack,
  indexOverride,
  module,
  nextModule,
  quizQuestionCount,
}: {
  compact?: boolean;
  currentTrack?: LearningTrack | null;
  indexOverride?: number;
  module: ResolvedLearningModule;
  nextModule?: LearningModule | null;
  quizQuestionCount?: number;
}) {
  const simulationHref = getLessonSimulationHref(module, currentTrack);
  const hasSimulator = hasLessonSimulator(module);
  const discussionHref = withQuery("/discussions", {
    module: module.slug,
    prompt: module.discussionPrompt,
  });
  const quizHref = `/quiz/${module.slug}`;
  const continueHref = nextModule ? `/learn/${nextModule.slug}` : "/learn?view=tracks";
  const reformsHref = module.proposals?.length ? "#what-could-change" : "/governance";

  const actions = [
    {
      description: module.discussionPrompt,
      href: discussionHref,
      icon: MessageSquare,
      label: "Discuss this idea",
    },
    {
      description: module.simulationPrompt,
      href: simulationHref,
      icon: Play,
      label: hasSimulator ? "Run a simulation" : "Explore a related lab",
    },
    {
      description: module.proposals?.length
        ? "See proposals and reforms that respond to the mechanism you just explored."
        : "Open the governance lab and connect this lesson to live proposals.",
      href: reformsHref,
      icon: ArrowRight,
      label: "Explore reforms",
    },
    {
      description: "Read books, papers, tools, and curated references connected to this lesson.",
      href: "/study",
      icon: BookOpenText,
      label: "Study more",
    },
  ];

  return (
    <section className={compact ? "space-y-4" : "space-y-6"} id="next-actions">
      <LessonSectionHeader
        accent={module.accent}
        compact={compact}
        id="next-actions-heading"
        index={indexOverride ?? (compact ? 8 : 7)}
        subtitle="Choose your next step: test the idea, discuss it, run the model, or go deeper into the supporting material."
        title={compact ? "Choose your next step" : "Next actions"}
      />

      <div className="space-y-6">
        {quizQuestionCount && !compact ? (
          <div className="flex flex-col gap-4 rounded-[1.5rem] bg-[rgba(241,245,249,0.8)] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Close the loop with a checkpoint</p>
              <p className="mt-1 text-sm leading-7 text-slate-600">
                {quizQuestionCount} questions with immediate feedback so the lesson ends as a real learning step.
              </p>
            </div>
            <Button asChild className="h-auto rounded-full px-5 py-3">
              <Link href={quizHref}>
                Take the quiz
                <ClipboardCheck className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : null}

        {quizQuestionCount && compact ? (
          <div className="flex items-center justify-between rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(241,245,249,0.76)] px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Checkpoint quiz</p>
              <p className="text-xs leading-6 text-slate-500">{quizQuestionCount} quick questions to lock in the lesson.</p>
            </div>
            <Button asChild className="h-auto rounded-full px-4 py-2.5">
              <Link href={quizHref}>
                Take quiz
                <ClipboardCheck className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : null}

        <div className={cn("grid gap-4 sm:grid-cols-2", compact ? "xl:grid-cols-2" : "xl:grid-cols-4")}>
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                className="group rounded-[1.5rem] border border-[rgba(28,36,48,0.08)] bg-white/84 px-5 py-5 transition hover:border-[rgba(28,36,48,0.16)] hover:shadow-[0_16px_34px_rgba(28,36,48,0.05)]"
                href={action.href}
                key={action.label}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(244,248,252,0.92)] text-slate-700">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{action.label}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{action.description}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary transition group-hover:text-blue-700">
                      Open
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {compact ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.1rem] border border-[rgba(28,36,48,0.08)] bg-white/82 px-4 py-3">
            <p className="text-sm text-slate-600">
              {nextModule ? `Continue with ${nextModule.title}.` : "Open the broader track and keep exploring from here."}
            </p>
            <Link className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-blue-700" href={continueHref}>
              {nextModule ? "Continue the track" : "Open track explorer"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <SharedLearnersPanel contextSlug={module.slug} contextTitle={module.title} contextType="module" />
        )}
      </div>
    </section>
  );
}
