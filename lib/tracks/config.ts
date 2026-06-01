import type { AccentTone } from "@/lib/learn/modules";

export interface LearningTrack {
  id: string;
  title: string;
  tagline: string;
  description: string;
  accent: AccentTone;
  icon: string;          // lucide icon name
  moduleSlugs: string[]; // ordered — first is always unlocked, rest unlock sequentially
}

export const LEARNING_TRACKS: LearningTrack[] = [
  {
    id: "money-and-wealth",
    title: "Money & Wealth",
    tagline: "How the financial system is wired",
    description:
      "Understand where money comes from, how it flows toward assets rather than wages, how profits disappear offshore, and why wealth compounds faster than work.",
    accent: "emerald",
    icon: "Banknote",
    moduleSlugs: [
      "why-gdp-is-not-the-same-as-wellbeing",
      "how-banks-create-money",
      "how-wealth-compounds-faster-than-wages",
      "how-tax-havens-drain-public-revenue",
      "how-the-us-rewrites-the-rules-of-money",
    ],
  },
  {
    id: "financial-history",
    title: "Financial History: Mistakes of the Past",
    tagline: "Crises that keep repeating — and why",
    description:
      "Every major banking crisis shares the same structural fingerprints: stability breeding complacency, unregulated institutions taking bank-like risks, and regulators who arrived too late. These modules trace the pattern from 1907 to 2023.",
    accent: "amber",
    icon: "ScrollText",
    moduleSlugs: [
      "how-banking-crises-repeat",
      "the-savings-and-loan-crisis-of-the-1980s",
      "how-the-2008-financial-crisis-happened",
    ],
  },
  {
    id: "ecology-and-limits",
    title: "Ecology & Limits",
    tagline: "Why pollution becomes systems risk",
    description:
      "Follow how pollution accumulates, why delayed feedbacks hide damage until it is expensive, and how tipping points turn gradual pressure into abrupt instability. A starting module for thinking in stocks, sinks, and overshoot.",
    accent: "cyan",
    icon: "Leaf",
    moduleSlugs: [
      "how-doughnut-economics-puts-the-economy-inside-limits",
      "how-pollution-builds-up-until-systems-tip",
    ],
  },
  {
    id: "power-and-politics",
    title: "Power & Politics",
    tagline: "How decisions are really made",
    description:
      "Trace how ideological models, governing systems, electoral rules, lobbying, corruption, and social movements systematically shape who gets heard, who gets organized, and whose interests become policy. A growing track on institutional design, political capture, and collective power.",
    accent: "amber",
    icon: "Landmark",
    moduleSlugs: [
      "why-capable-people-dont-enter-politics",
      "how-lobbying-shapes-policy",
      "how-electoral-rules-shape-political-power",
      "how-corruption-behaves-like-a-hidden-tax",
      "how-capitalism-socialism-and-communism-differ",
      "how-the-eu-makes-decisions",
      "how-the-us-government-makes-decisions",
      "how-print-era-movements-turned-ideas-into-power",
      "how-industrial-mass-movements-won-rights",
      "how-anti-colonial-movements-dismantled-empires",
      "how-rights-based-movements-expand-citizenship",
      "how-networked-digital-movements-scale",
      "how-social-movements-reshape-history",
    ],
  },
  {
    id: "information-and-attention",
    title: "Information & Attention",
    tagline: "How minds are shaped at scale",
    description:
      "Explore how media incentives produce outrage, how surveillance capitalism turns human experience into prediction products, and why the information environment degrades as a structural consequence of the business model — not despite it.",
    accent: "rose",
    icon: "Brain",
    moduleSlugs: [
      "how-media-incentives-produce-outrage",
      "how-surveillance-capitalism-shapes-attention",
    ],
  },
  {
    id: "cities-and-everyday-life",
    title: "Cities & Everyday Life",
    tagline: "How space, housing, and design shape daily life",
    description:
      "Explore how urban design, housing financialization, and neighbourhood structure shape trust, autonomy, stress, and economic opportunity. Two modules on the built environment as a political and economic system.",
    accent: "rose",
    icon: "Building2",
    moduleSlugs: [
      "why-cities-create-stress-or-freedom",
      "why-housing-becomes-financialized",
    ],
  },
];
