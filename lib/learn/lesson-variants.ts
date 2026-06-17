import type { ModuleSlug, ResolvedLearningModule } from "@/lib/learn/modules";

export type LessonVariant = "systems" | "comparison" | "timeline" | "historical" | "process" | "solution";

export const LESSON_VARIANT_META: Record<
  LessonVariant,
  {
    label: string;
    shortLabel: string;
    summary: string;
    visualFocus: string;
  }
> = {
  systems: {
    label: "Systems Lesson",
    shortLabel: "Systems",
    summary: "Best for hidden mechanisms, feedback loops, and structure-first explanations.",
    visualFocus: "Mechanism diagrams, consequence framing, and interactive cause-and-effect exploration.",
  },
  comparison: {
    label: "Comparison Lesson",
    shortLabel: "Comparison",
    summary: "Best when the lesson works by contrasting two frames, metrics, or models.",
    visualFocus: "Side-by-side evidence, tradeoff framing, and clearer “this is not the same as that” logic.",
  },
  timeline: {
    label: "Timeline Lesson",
    shortLabel: "Timeline",
    summary: "Best when chronology itself explains why the system works the way it does now.",
    visualFocus: "Stepwise sequence, turning points, and institutional or crisis progression.",
  },
  historical: {
    label: "Historical Lesson",
    shortLabel: "Historical",
    summary: "Best when a movement, regime, or long arc of change needs narrative momentum.",
    visualFocus: "Phases, actors, context shifts, and magazine-style case progression.",
  },
  process: {
    label: "Process Lesson",
    shortLabel: "Process",
    summary: "Best when understanding the sequence of institutional steps matters more than chronology alone.",
    visualFocus: "Decision pathways, veto points, actor roles, and the practical flow from proposal to outcome.",
  },
  solution: {
    label: "Solution Lesson",
    shortLabel: "Solution",
    summary: "Best when the lesson culminates in proposals, synthesis, and civic action.",
    visualFocus: "Reform cards, action pathways, linked proposals, and next-step decisions.",
  },
};

export const LESSON_VARIANTS_BY_SLUG = {
  "why-gdp-is-not-the-same-as-wellbeing": "comparison",
  "how-doughnut-economics-puts-the-economy-inside-limits": "comparison",
  "how-pollution-builds-up-until-systems-tip": "systems",
  "how-lobbying-shapes-policy": "systems",
  "why-cities-create-stress-or-freedom": "systems",
  "how-media-incentives-produce-outrage": "systems",
  "how-companies-engineer-public-opinion-through-marketing": "systems",
  "why-housing-becomes-financialized": "systems",
  "how-corruption-behaves-like-a-hidden-tax": "systems",
  "how-banks-create-money": "systems",
  "how-tax-havens-drain-public-revenue": "systems",
  "how-wealth-compounds-faster-than-wages": "systems",
  "how-electoral-rules-shape-political-power": "systems",
  "how-surveillance-capitalism-shapes-attention": "systems",
  "how-banking-crises-repeat": "timeline",
  "how-the-2008-financial-crisis-happened": "timeline",
  "the-savings-and-loan-crisis-of-the-1980s": "timeline",
  "how-capitalism-evolved-through-stages": "timeline",
  "how-capitalism-socialism-and-communism-differ": "comparison",
  "how-the-eu-makes-decisions": "process",
  "how-the-us-government-makes-decisions": "process",
  "how-print-era-movements-turned-ideas-into-power": "historical",
  "how-industrial-mass-movements-won-rights": "historical",
  "how-anti-colonial-movements-dismantled-empires": "historical",
  "how-rights-based-movements-expand-citizenship": "historical",
  "how-networked-digital-movements-scale": "historical",
  "how-social-movements-reshape-history": "timeline",
  "how-the-us-rewrites-the-rules-of-money": "timeline",
  "why-capable-people-dont-enter-politics": "timeline",
  "why-decoupling-growth-from-emissions-is-so-hard": "comparison",
  "why-democracies-struggle-with-long-term-problems": "systems",
  "pathways-to-change": "solution",
  "housing-solutions": "solution",
  "money-solutions": "solution",
  "wellbeing-solutions": "solution",
  "democracy-solutions": "solution",
  "climate-solutions": "solution",
  "media-solutions": "solution",
  "financial-crisis-solutions": "solution",
  "movements-solutions": "solution",
  "inequality-solutions": "solution",
  "war-and-financial-innovation": "historical",
} as const satisfies Record<ModuleSlug, LessonVariant>;

const lessonVariantsIndex: Record<string, LessonVariant> = LESSON_VARIANTS_BY_SLUG;

export function getLessonVariant(slug: string): LessonVariant {
  if (slug in lessonVariantsIndex) {
    return lessonVariantsIndex[slug];
  }

  return "systems";
}

export function groupModulesByVariant(modules: ResolvedLearningModule[]) {
  return Object.entries(LESSON_VARIANT_META).map(([variant, meta]) => ({
    meta,
    modules: modules.filter((module) => getLessonVariant(module.slug) === variant),
    variant: variant as LessonVariant,
  }));
}
