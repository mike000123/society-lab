export interface LearningJourney {
  id: string;
  title: string;
  tagline: string;
  summary: string;
  duration: string;
  outcome: string;
  moduleSlugs: string[];
  relatedTrackIds: string[];
  simulatorHref?: string;
  simulatorLabel?: string;
}

export const LEARNING_JOURNEYS: LearningJourney[] = [
  {
    id: "understand-modern-money",
    title: "Understand Modern Money",
    tagline: "From GDP myths to bank-created money",
    summary:
      "Start with what the economy measures, then follow credit creation, compounding wealth, and the way tax havens drain public capacity.",
    duration: "4 modules · 2-3 hrs",
    outcome:
      "Understand why public debates about scarcity often begin from a broken story about what money is and who gets access to it.",
    moduleSlugs: [
      "why-gdp-is-not-the-same-as-wellbeing",
      "how-banks-create-money",
      "how-wealth-compounds-faster-than-wages",
      "how-tax-havens-drain-public-revenue",
    ],
    relatedTrackIds: ["economy"],
    simulatorHref: "/simulator/macro-economy",
    simulatorLabel: "Test it in Macro Economy Lab",
  },
  {
    id: "build-a-wellbeing-economy",
    title: "Build a Wellbeing Economy",
    tagline: "Place the economy inside human and planetary needs",
    summary:
      "Move from GDP toward wellbeing, social foundations, ecological ceilings, and the everyday systems that make housing and city life either secure or stressful.",
    duration: "4 modules · 2-3 hrs",
    outcome:
      "See how an economy can be judged by security, health, care, and ecological stability instead of output alone.",
    moduleSlugs: [
      "why-gdp-is-not-the-same-as-wellbeing",
      "how-doughnut-economics-puts-the-economy-inside-limits",
      "why-housing-becomes-financialized",
      "why-cities-create-stress-or-freedom",
    ],
    relatedTrackIds: ["economy", "cities-and-ecology"],
    simulatorHref: "/simulator/wealth-gap",
    simulatorLabel: "Explore inequality dynamics",
  },
  {
    id: "fixing-democracy-and-governance",
    title: "Fixing Democracy and Governance",
    tagline: "Follow capture, incentives, and institutional design",
    summary:
      "Trace why capable people avoid politics, how lobbying and electoral rules shape outcomes, and why corruption behaves like a hidden tax on society.",
    duration: "4 modules · 2-3 hrs",
    outcome:
      "Understand why weak democratic outcomes usually come from structural incentives and gatekeeping, not only from individual bad actors.",
    moduleSlugs: [
      "why-capable-people-dont-enter-politics",
      "how-lobbying-shapes-policy",
      "how-electoral-rules-shape-political-power",
      "how-corruption-behaves-like-a-hidden-tax",
    ],
    relatedTrackIds: ["politics-and-democracy"],
    simulatorHref: "/simulator/political-talent",
    simulatorLabel: "Open political talent simulator",
  },
  {
    id: "planetary-boundaries-and-world3",
    title: "Planetary Boundaries and World3",
    tagline: "See overshoot, delay, and tipping points in one path",
    summary:
      "Learn why ecological stress is delayed, why pollution becomes system risk, and why long-run simulation is necessary for thinking about civilisation-scale futures.",
    duration: "3 modules · 2 hrs",
    outcome:
      "Build the mental model that makes World3 legible: stocks, sinks, overshoot, delay, and the difference between short-run comfort and long-run stability.",
    moduleSlugs: [
      "how-doughnut-economics-puts-the-economy-inside-limits",
      "how-pollution-builds-up-until-systems-tip",
      "why-cities-create-stress-or-freedom",
    ],
    relatedTrackIds: ["economy", "cities-and-ecology"],
    simulatorHref: "/simulator/world3",
    simulatorLabel: "Go straight to World3",
  },
  {
    id: "why-financial-crises-keep-returning",
    title: "Why Financial Crises Keep Returning",
    tagline: "Trace bubbles, regulation gaps, and rescue politics",
    summary:
      "Start with the monetary rules, then follow recurring banking patterns from earlier crises into 2008 and the institutional choices that made them possible.",
    duration: "4 modules · 2-3 hrs",
    outcome:
      "Understand why crises that look different on the surface often share the same structure: leverage, fragile funding, delayed regulation, and public institutions forced to stabilize private risk.",
    moduleSlugs: [
      "how-the-us-rewrites-the-rules-of-money",
      "how-banking-crises-repeat",
      "the-savings-and-loan-crisis-of-the-1980s",
      "how-the-2008-financial-crisis-happened",
    ],
    relatedTrackIds: ["economy"],
    simulatorHref: "/simulator/financial-crisis",
    simulatorLabel: "Open the crisis simulator",
  },
  {
    id: "institutions-ideologies-and-governing-systems",
    title: "Institutions, Ideologies, and Governing Systems",
    tagline: "Compare big ideas with the actual machinery of rule-making",
    summary:
      "Move from capitalism, socialism, and communism into the practical architecture of EU and US governance to see how ideology meets institutions.",
    duration: "4 modules · 2-3 hrs",
    outcome:
      "See that political outcomes depend not only on ideas, but on veto points, agenda control, coalition rules, and the formal paths decisions must travel.",
    moduleSlugs: [
      "how-capitalism-socialism-and-communism-differ",
      "how-the-eu-makes-decisions",
      "how-the-us-government-makes-decisions",
      "how-electoral-rules-shape-political-power",
    ],
    relatedTrackIds: ["politics-and-democracy"],
    simulatorHref: "/simulator",
    simulatorLabel: "Browse governance labs",
  },
  {
    id: "media-attention-and-digital-power",
    title: "Media, Attention, and Digital Power",
    tagline: "Follow outrage, surveillance, and networked coordination",
    summary:
      "Understand how public relations, business models, and digital platforms shape attention, borrow movement language, and turn culture itself into an arena of influence.",
    duration: "4 modules · 2-3 hrs",
    outcome:
      "See how communication systems do more than carry information: they shape norms, reward escalation, and reorganize how products, identities, and movements gain reach.",
    moduleSlugs: [
      "how-companies-engineer-public-opinion-through-marketing",
      "how-media-incentives-produce-outrage",
      "how-surveillance-capitalism-shapes-attention",
      "how-networked-digital-movements-scale",
    ],
    relatedTrackIds: ["media-and-information", "politics-and-democracy"],
    simulatorHref: "/simulator/social-movements",
    simulatorLabel: "Open the movement simulator",
  },
  {
    id: "how-movements-change-history",
    title: "How Movements Change History",
    tagline: "From print-era upheavals to rights struggles and anti-colonial change",
    summary:
      "Travel through movement families across history to see how technology, organization, repression, coalition-building, and symbolic capture shape when collective action transforms institutions.",
    duration: "6 modules · 4 hrs",
    outcome:
      "Recognize the recurring ingredients of successful movements, and also how powerful actors sometimes co-opt the language of liberation for commercial or political ends.",
    moduleSlugs: [
      "how-print-era-movements-turned-ideas-into-power",
      "how-industrial-mass-movements-won-rights",
      "how-anti-colonial-movements-dismantled-empires",
      "how-rights-based-movements-expand-citizenship",
      "how-companies-engineer-public-opinion-through-marketing",
      "how-social-movements-reshape-history",
    ],
    relatedTrackIds: ["politics-and-democracy", "media-and-information"],
    simulatorHref: "/simulator/social-movements",
    simulatorLabel: "Compare movement conditions",
  },
];
