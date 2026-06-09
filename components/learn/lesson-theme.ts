import type { LearningModule } from "@/lib/learn/modules";
import type { AccentTone, CausalLoopNode } from "@/lib/learn/modules";

export const lessonAccentClasses: Record<
  AccentTone,
  {
    badge: string;
    chip: string;
    icon: string;
    line: string;
    soft: string;
    step: string;
    panel: string;
    ring: string;
  }
> = {
  amber: {
    badge: "border-amber-300 bg-amber-50 text-amber-700",
    chip: "border-amber-200 bg-amber-50/80 text-amber-700",
    icon: "border-amber-200 bg-amber-50 text-amber-600",
    line: "border-amber-200/80",
    panel: "bg-amber-50/60",
    ring: "ring-amber-200/70",
    soft: "bg-amber-100/85",
    step: "bg-amber-100 text-amber-700",
  },
  cyan: {
    badge: "border-cyan-300 bg-cyan-50 text-cyan-700",
    chip: "border-cyan-200 bg-cyan-50/80 text-cyan-700",
    icon: "border-cyan-200 bg-cyan-50 text-cyan-600",
    line: "border-cyan-200/80",
    panel: "bg-cyan-50/60",
    ring: "ring-cyan-200/70",
    soft: "bg-cyan-100/85",
    step: "bg-cyan-100 text-cyan-700",
  },
  emerald: {
    badge: "border-emerald-300 bg-emerald-50 text-emerald-700",
    chip: "border-emerald-200 bg-emerald-50/80 text-emerald-700",
    icon: "border-emerald-200 bg-emerald-50 text-emerald-600",
    line: "border-emerald-200/80",
    panel: "bg-emerald-50/60",
    ring: "ring-emerald-200/70",
    soft: "bg-emerald-100/85",
    step: "bg-emerald-100 text-emerald-700",
  },
  rose: {
    badge: "border-rose-300 bg-rose-50 text-rose-700",
    chip: "border-rose-200 bg-rose-50/80 text-rose-700",
    icon: "border-rose-200 bg-rose-50 text-rose-600",
    line: "border-rose-200/80",
    panel: "bg-rose-50/60",
    ring: "ring-rose-200/70",
    soft: "bg-rose-100/85",
    step: "bg-rose-100 text-rose-700",
  },
};

export function extractFirstSentence(text: string | undefined) {
  if (!text) return "";
  const normalized = text.trim();
  const match = normalized.match(/.*?[.!?](?:\s|$)/);
  return (match?.[0] ?? normalized).trim();
}

export function getLessonPromise(module: LearningModule) {
  return extractFirstSentence(module.simpleExplanation[0]) || module.summary;
}

export function getLessonTakeaway(module: LearningModule) {
  return module.heroHighlights[0] ?? (extractFirstSentence(module.systemBug.summary) || module.summary);
}

export function getExpectedObservations(module: LearningModule) {
  return module.systemBug.signals.slice(0, 3);
}

export function buildMechanismSteps(nodes: CausalLoopNode[], limit = 5) {
  return [...nodes]
    .sort((left, right) => {
      if (left.x === right.x) {
        return left.y - right.y;
      }

      return left.x - right.x;
    })
    .slice(0, limit);
}
