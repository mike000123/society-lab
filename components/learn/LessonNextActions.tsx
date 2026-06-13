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
import type { LearningTrack } from "@/lib/tracks/config";
import { withQuery } from "@/lib/utils";

const TRACK_RELATED_LABS: Record<string, { href: string; label: string }> = {
  economy: { href: "/simulator/macro-economy", label: "Run a simulation" },
  "politics-and-democracy": { href: "/simulator/political-talent", label: "Open governance lab" },
  "cities-and-ecology": { href: "/simulator/world3", label: "Open World3" },
  "media-and-information": { href: "/simulator/social-movements", label: "Open movement lab" },
};

export function LessonNextActions({
  currentTrack,
  module,
  nextModule,
  quizQuestionCount,
}: {
  currentTrack?: LearningTrack | null;
  module: ResolvedLearningModule;
  nextModule?: LearningModule | null;
  quizQuestionCount?: number;
}) {
  const simulatorBase =
    module.simulatorSlug
      ? `/simulator/${module.simulatorSlug}`
      : TRACK_RELATED_LABS[currentTrack?.id ?? ""]?.href ?? "/simulator";
  const simulationHref = withQuery(simulatorBase, {
    focus: module.simulationPrompt,
    module: module.slug,
  });
  const discussionHref = withQuery("/discussions", {
    module: module.slug,
    prompt: module.discussionPrompt,
  });
  const quizHref = `/quiz/${module.slug}`;
  const continueHref = nextModule ? `/learn/${nextModule.slug}` : "/learn?view=tracks";

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
      label: module.simulatorSlug ? "Run a simulation" : "Explore a related lab",
    },
    {
      description: nextModule
        ? `Continue with ${nextModule.title}.`
        : "Open the broader track path and explore where this lesson sits.",
      href: continueHref,
      icon: ArrowRight,
      label: nextModule ? "Continue the track" : "Open track explorer",
    },
    {
      description: "Read books, papers, tools, and curated references connected to this lesson.",
      href: "/study",
      icon: BookOpenText,
      label: "Study more",
    },
  ];

  return (
    <section className="space-y-6" id="next-actions">
      <LessonSectionHeader
        accent={module.accent}
        id="next-actions-heading"
        index={7}
        subtitle="Choose your next step: test the idea, discuss it, run the model, or go deeper into the supporting material."
        title="Next actions"
      />

      <div className="space-y-6">
        {quizQuestionCount ? (
          <div className="flex flex-col gap-4 rounded-[1.5rem] bg-[rgba(246,244,238,0.74)] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
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

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                className="group rounded-[1.5rem] border border-[rgba(28,36,48,0.08)] bg-white/84 px-5 py-5 transition hover:border-[rgba(28,36,48,0.16)] hover:shadow-[0_16px_34px_rgba(28,36,48,0.05)]"
                href={action.href}
                key={action.label}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.78)] text-slate-700">
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

        <SharedLearnersPanel contextSlug={module.slug} contextTitle={module.title} contextType="module" />
      </div>
    </section>
  );
}
