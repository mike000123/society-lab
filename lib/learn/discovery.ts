import type { LearningTrack } from "@/lib/tracks/config";

export type LearningTopicId = LearningTrack["id"];

export interface PopularQuestionCard {
  description: string;
  icon: "banking" | "city" | "ecology" | "media" | "metrics" | "politics";
  id: string;
  learnerCount: number;
  moduleCount: number;
  pathId: string;
  title: string;
}

export interface LearningPathCard {
  description: string;
  duration: string;
  featured: boolean;
  id: string;
  imageSrc: string;
  moduleSlugs: string[];
  question: string;
  summary: string;
  tags: string[];
  title: string;
  relatedSimulatorSlugs: string[];
  topicIds: LearningTopicId[];
}

export const LEARNING_PATHS: LearningPathCard[] = [
  {
    description:
      "Follow money creation, credit, and recurring monetary myths so the economy stops feeling like a black box.",
    duration: "4-6 hrs",
    featured: true,
    id: "understanding-modern-money",
    imageSrc: "/atlas/learn-track-money-wealth.png",
    moduleSlugs: [
      "why-gdp-is-not-the-same-as-wellbeing",
      "how-banks-create-money",
      "how-wealth-compounds-faster-than-wages",
      "how-tax-havens-drain-public-revenue",
      "how-the-us-rewrites-the-rules-of-money",
      "money-solutions",
    ],
    question: "Who creates money, and who gets first access to it?",
    summary:
      "Follow money creation, credit, banking, macro instability, and the rules that decide who gets first access.",
    tags: ["Money", "Banking", "Macroeconomics"],
    title: "Understanding Modern Money",
    relatedSimulatorSlugs: ["bank-run", "macro-economy", "debt"],
    topicIds: ["economy"],
  },
  {
    description:
      "Connect inequality, lobbying, corruption, and institutional design so power looks less like a mystery and more like a system.",
    duration: "4-6 hrs",
    featured: true,
    id: "inequality-and-power",
    imageSrc: "/atlas/learn-track-power-politics.png",
    moduleSlugs: [
      "how-wealth-compounds-faster-than-wages",
      "how-tax-havens-drain-public-revenue",
      "how-lobbying-shapes-policy",
      "how-corruption-behaves-like-a-hidden-tax",
      "why-capable-people-dont-enter-politics",
      "how-electoral-rules-shape-political-power",
      "inequality-solutions",
    ],
    question: "Why do wealth and power so often reinforce each other?",
    summary:
      "Connect wealth concentration, political influence, lobbying, corruption, and the institutions that protect privilege.",
    tags: ["Inequality", "Power", "Justice"],
    title: "Inequality & Power",
    relatedSimulatorSlugs: ["wealth-gap", "purchasing-power", "political-talent"],
    topicIds: ["economy", "politics-and-democracy"],
  },
  {
    description:
      "Start by questioning what growth is actually measuring, then follow ecological limits, delayed feedback loops, and the urban systems where most ecological footprint is generated.",
    duration: "4-6 hrs",
    featured: true,
    id: "climate-and-ecological-limits",
    imageSrc: "/atlas/learn-track-ecology-limits.png",
    moduleSlugs: [
      "why-gdp-is-not-the-same-as-wellbeing",
      "how-doughnut-economics-puts-the-economy-inside-limits",
      "why-decoupling-growth-from-emissions-is-so-hard",
      "how-pollution-builds-up-until-systems-tip",
      "why-cities-create-stress-or-freedom",
      "climate-solutions",
    ],
    question: "Can economic growth continue forever on a finite planet?",
    summary:
      "Question what growth measures, map the planetary and social boundaries it must stay within, and understand why pollution and urban systems are where the ecological pressure lands.",
    tags: ["Ecology", "Climate", "Sustainability"],
    title: "Climate & Ecological Limits",
    relatedSimulatorSlugs: ["world3", "macro-economy"],
    topicIds: ["cities-and-ecology", "economy"],
  },
  {
    description:
      "Move from participation design to accountability systems and public institutions that actually work under pressure.",
    duration: "4-6 hrs",
    featured: true,
    id: "democracy-and-better-governance",
    imageSrc: "/atlas/home-domain-politics-democracy.png",
    moduleSlugs: [
      "how-capitalism-socialism-and-communism-differ",
      "why-capable-people-dont-enter-politics",
      "how-lobbying-shapes-policy",
      "how-electoral-rules-shape-political-power",
      "how-corruption-behaves-like-a-hidden-tax",
      "why-democracies-struggle-with-long-term-problems",
      "how-the-eu-makes-decisions",
      "how-the-us-government-makes-decisions",
      "democracy-solutions",
    ],
    question: "Why do democracies struggle to solve long-term problems?",
    summary:
      "Explore participation, incentives, lobbying, and the institutional bottlenecks that weaken public problem-solving.",
    tags: ["Governance", "Participation", "Accountability"],
    title: "Democracy & Better Governance",
    relatedSimulatorSlugs: ["eu-decision-making", "us-decision-making"],
    topicIds: ["politics-and-democracy"],
  },
  {
    description:
      "Trace housing through banks, asset inflation, city design, and inequality so rising rents stop looking like bad luck.",
    duration: "3-5 hrs",
    featured: false,
    id: "housing-and-affordability",
    imageSrc: "/atlas/home-domain-cities-everyday-life.png",
    moduleSlugs: [
      "how-banks-create-money",
      "why-housing-becomes-financialized",
      "why-cities-create-stress-or-freedom",
      "how-wealth-compounds-faster-than-wages",
      "housing-solutions",
    ],
    question: "Why is housing becoming unaffordable?",
    summary:
      "Follow money, land, speculation, and urban systems to see why homes increasingly behave like assets.",
    tags: ["Housing", "Cities", "Affordability"],
    title: "Housing & Affordability",
    relatedSimulatorSlugs: ["debt", "wealth-gap"],
    topicIds: ["cities-and-ecology", "economy"],
  },
  {
    description:
      "Start with GDP, then connect health, stress, care, and inequality to the bigger question of what actually counts as progress.",
    duration: "3-5 hrs",
    featured: false,
    id: "wellbeing-beyond-gdp",
    imageSrc: "/atlas/home-world-map.png",
    moduleSlugs: [
      "why-gdp-is-not-the-same-as-wellbeing",
      "how-doughnut-economics-puts-the-economy-inside-limits",
      "why-cities-create-stress-or-freedom",
      "how-wealth-compounds-faster-than-wages",
      "wellbeing-solutions",
    ],
    question: "Why can growth rise while wellbeing stagnates?",
    summary:
      "Look at GDP, productivity, inequality, health, and time to understand why more output does not guarantee a better life.",
    tags: ["Wellbeing", "GDP", "Metrics"],
    title: "Wellbeing Beyond GDP",
    relatedSimulatorSlugs: ["macro-economy", "world3"],
    topicIds: ["economy", "cities-and-ecology"],
  },
  {
    description:
      "Follow public relations, outrage incentives, and surveillance systems to understand how opinions are steered.",
    duration: "2-4 hrs",
    featured: false,
    id: "media-attention-and-digital-power",
    imageSrc: "/atlas/learn-track-information-attention.png",
    moduleSlugs: [
      "how-companies-engineer-public-opinion-through-marketing",
      "how-media-incentives-produce-outrage",
      "how-surveillance-capitalism-shapes-attention",
      "how-networked-digital-movements-scale",
      "media-solutions",
    ],
    question: "How do media and technology shape our opinions?",
    summary:
      "Follow attention, algorithms, narratives, and digital power in modern societies.",
    tags: ["Media", "Technology", "Power"],
    title: "Media, Attention & Digital Power",
    relatedSimulatorSlugs: ["political-talent"],
    topicIds: ["media-and-information", "politics-and-democracy"],
  },
  {
    description:
      "Trace the anatomy of three major financial crises to understand why the same structural faults — leverage, deposit insurance without oversight, regulatory capture — keep producing the same outcomes.",
    duration: "4-6 hrs",
    featured: false,
    id: "why-financial-crises-repeat",
    imageSrc: "/atlas/banking-crisis.png",
    moduleSlugs: [
      "war-and-financial-innovation",
      "how-banking-crises-repeat",
      "the-savings-and-loan-crisis-of-the-1980s",
      "how-the-2008-financial-crisis-happened",
      "financial-crisis-solutions",
    ],
    question: "Why do financial crises keep happening?",
    summary:
      "Follow the institutions born from war and crisis — central banks, deposit insurance, fiat money — through three modern crises to understand why the pattern keeps repeating.",
    tags: ["Banking", "Crises", "Regulation", "Financial History"],
    title: "Why Financial Crises Repeat",
    relatedSimulatorSlugs: ["war-finance", "bank-run", "svb-crisis", "financial-crisis"],
    topicIds: ["economy"],
  },
  {
    description:
      "Trace how ordinary people — without state power, wealth, or armies — have changed the terms of political life through print, industrial organisation, anti-colonial resistance, and digital networks.",
    duration: "5-7 hrs",
    featured: false,
    id: "how-movements-change-systems",
    imageSrc: "/atlas/learn-track-power-politics.png",
    moduleSlugs: [
      "how-print-era-movements-turned-ideas-into-power",
      "how-industrial-mass-movements-won-rights",
      "how-anti-colonial-movements-dismantled-empires",
      "how-rights-based-movements-expand-citizenship",
      "how-networked-digital-movements-scale",
      "how-social-movements-reshape-history",
      "movements-solutions",
    ],
    question: "How do ordinary people actually change systems?",
    summary:
      "From the printing press to the smartphone, follow how mass movements built power, extracted rights, and transformed political possibilities.",
    tags: ["Movements", "Change", "History"],
    title: "How Movements Change Systems",
    relatedSimulatorSlugs: ["social-movements", "political-talent"],
    topicIds: ["politics-and-democracy"],
  },
];

export const POPULAR_QUESTIONS: PopularQuestionCard[] = [
  {
    description: "Explore money, banks, land, speculation, and housing markets.",
    icon: "city",
    id: "why-is-housing-becoming-unaffordable",
    learnerCount: 92,
    moduleCount: 5,
    pathId: "housing-and-affordability",
    title: "Why is housing becoming unaffordable?",
  },
  {
    description: "Understand how commercial banks and central banks create money and what that means for society.",
    icon: "banking",
    id: "who-creates-money",
    learnerCount: 87,
    moduleCount: 6,
    pathId: "understanding-modern-money",
    title: "Who creates money?",
  },
  {
    description: "Look at GDP, productivity, inequality, and what really improves lives.",
    icon: "metrics",
    id: "why-can-growth-rise-while-wellbeing-stagnates",
    learnerCount: 76,
    moduleCount: 5,
    pathId: "wellbeing-beyond-gdp",
    title: "Why can growth rise while wellbeing stagnates?",
  },
  {
    description: "Explore incentives, lobbying, elections, and the limits of political systems.",
    icon: "politics",
    id: "why-do-democracies-struggle-to-solve-long-term-problems",
    learnerCount: 76,
    moduleCount: 9,
    pathId: "democracy-and-better-governance",
    title: "Why do democracies struggle to solve long-term problems?",
  },
  {
    description: "Dive into ecological limits, resources, pollution, and the World3 model.",
    icon: "ecology",
    id: "can-economic-growth-continue-forever",
    learnerCount: 53,
    moduleCount: 6,
    pathId: "climate-and-ecological-limits",
    title: "Can economic growth continue forever?",
  },
  {
    description: "Follow attention, algorithms, narratives, and digital power in modern societies.",
    icon: "media",
    id: "how-do-media-and-technology-shape-our-opinions",
    learnerCount: 41,
    moduleCount: 5,
    pathId: "media-attention-and-digital-power",
    title: "How do media and technology shape our opinions?",
  },
  {
    description: "Follow leverage, moral hazard, and regulatory capture across three crises that cost trillions.",
    icon: "banking",
    id: "why-do-financial-crises-keep-happening",
    learnerCount: 38,
    moduleCount: 5,
    pathId: "why-financial-crises-repeat",
    title: "Why do financial crises keep happening?",
  },
  {
    description: "Trace how print, industrial action, anti-colonial resistance, and digital networks built mass power.",
    icon: "politics",
    id: "how-do-ordinary-people-change-systems",
    learnerCount: 34,
    moduleCount: 7,
    pathId: "how-movements-change-systems",
    title: "How do ordinary people change systems?",
  },
];

export const FEATURED_PATH_IDS = LEARNING_PATHS.filter((path) => path.featured).map((path) => path.id);
