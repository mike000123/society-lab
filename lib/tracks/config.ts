import type { AccentTone } from "@/lib/learn/modules";

export interface LearningTrack {
  id: string;
  title: string;
  tagline: string;
  description: string;
  featuredSummary?: string;
  accent: AccentTone;
  icon: string;          // lucide icon name
  moduleSlugs: string[]; // ordered — first is always unlocked, rest unlock sequentially
}

export const LEARNING_TRACKS: LearningTrack[] = [
  {
    id: "economy",
    title: "Economy",
    tagline: "Money, inequality, and crises that keep returning",
    description:
      "Understand where money comes from, how it flows toward assets rather than wages, how economies can be judged against social and ecological limits, how profits disappear offshore, why wealth compounds faster than work, and how recurring financial crises emerge from the same structural faults.",
    featuredSummary: "From money creation to inequality, understand how economic systems really work.",
    accent: "emerald",
    icon: "Banknote",
    moduleSlugs: [
      "why-gdp-is-not-the-same-as-wellbeing",
      "how-doughnut-economics-puts-the-economy-inside-limits",
      "how-banks-create-money",
      "how-wealth-compounds-faster-than-wages",
      "how-tax-havens-drain-public-revenue",
      "how-the-us-rewrites-the-rules-of-money",
      "how-banking-crises-repeat",
      "the-savings-and-loan-crisis-of-the-1980s",
      "how-the-2008-financial-crisis-happened",
    ],
  },
  {
    id: "politics-and-democracy",
    title: "Politics & Democracy",
    tagline: "How power, institutions, and movements shape public life",
    description:
      "Trace how ideology, governing systems, electoral rules, lobbying, corruption, and social movements shape who gets heard, who gets organized, and whose interests become policy.",
    featuredSummary: "Explore how power is built, maintained, and challenged in modern societies.",
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
    id: "cities-and-ecology",
    title: "Cities & Ecology",
    tagline: "Ecological limits and the systems of everyday life",
    description:
      "Follow how pollution accumulates, why delayed feedbacks hide damage until it is expensive, and how cities, housing, transport, and urban design shape stress, trust, health, and ecological pressure.",
    featuredSummary: "The ecological limits and feedback loops that shape our future.",
    accent: "cyan",
    icon: "Building2",
    moduleSlugs: [
      "how-pollution-builds-up-until-systems-tip",
      "why-cities-create-stress-or-freedom",
      "why-housing-becomes-financialized",
    ],
  },
  {
    id: "media-and-information",
    title: "Media & Information",
    tagline: "How attention, narratives, and opinion are shaped",
    description:
      "Explore how public relations and marketing borrow identity and movement language, how media incentives produce outrage, and how surveillance capitalism turns human experience into prediction products.",
    featuredSummary: "How technology transforms society and how society chooses technology.",
    accent: "rose",
    icon: "Brain",
    moduleSlugs: [
      "how-companies-engineer-public-opinion-through-marketing",
      "how-media-incentives-produce-outrage",
      "how-surveillance-capitalism-shapes-attention",
    ],
  },
];
