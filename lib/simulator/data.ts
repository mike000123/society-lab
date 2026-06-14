import type { ElementType } from "react";
import {
  BarChart3,
  Globe,
  Landmark,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

export type SimulatorAccent = "amber" | "cyan" | "emerald" | "orange" | "rose" | "teal" | "violet";

export interface SimulatorEntry {
  accent: SimulatorAccent;
  complexity: "Advanced" | "Intermediate" | "Introductory";
  description: string;
  featured?: boolean;
  cardImageSrc?: string;
  featuredImageAlt?: string;
  featuredImageSrc?: string;
  icon: ElementType;
  slug: string;
  tagline: string;
  tags: string[];
  title: string;
}

export interface SimulatorGroup {
  description: string;
  iconAlt: string;
  iconSrc: string;
  label: string;
  slugs: string[];
}

export const SIMULATORS: SimulatorEntry[] = [
  {
    slug: "/simulator/world3",
    cardImageSrc: "/atlas/simulators/world3.png",
    title: "World3 Civilization Simulator",
    tagline: "World3 system dynamics model",
    description: "Explore 200 years of civilization by adjusting resources, pollution, population, technology, and welfare.",
    accent: "emerald",
    icon: Globe,
    tags: ["Systems thinking", "Resources", "Population", "Welfare"],
    complexity: "Advanced",
    featured: true,
    featuredImageAlt: "A future city inside a green valley used to represent the World3 simulation.",
    featuredImageSrc: "/atlas/simulator-hero.png",
  },
  {
    slug: "/simulator/bank-run",
    cardImageSrc: "/atlas/simulators/bank-run.png",
    title: "Bank Run Simulator",
    tagline: "Bank run dynamics",
    description: "Test how reserve ratios, deposit insurance, and panic response change whether a rumour becomes a collapse.",
    accent: "rose",
    icon: TrendingDown,
    tags: ["Banking", "Contagion", "Deposit insurance"],
    complexity: "Intermediate",
  },
  {
    slug: "/simulator/svb-crisis",
    cardImageSrc: "/atlas/simulators/svb-crisis.png",
    title: "SVB Collapse 2023",
    tagline: "Silicon Valley Bank crisis",
    description: "Replay the fastest large bank failure in modern US history.",
    accent: "amber",
    icon: Zap,
    tags: ["Banking", "Duration risk", "Social media"],
    complexity: "Intermediate",
  },
  {
    slug: "/simulator/financial-crisis",
    cardImageSrc: "/atlas/simulators/financial-crisis.png",
    title: "Financial Crisis Simulator",
    tagline: "Leverage and contagion model",
    description: "Model bubbles, leverage, shadow banking, and policy responses to see why crises spread so fast.",
    accent: "orange",
    icon: TrendingDown,
    tags: ["Leverage", "Bubble", "Shadow banking"],
    complexity: "Advanced",
    featured: true,
    featuredImageAlt: "A financial market illustration representing contagion and crisis dynamics.",
    featuredImageSrc: "/atlas/simulator-financial-crisis-card.png",
  },
  {
    slug: "/simulator/macro-economy",
    cardImageSrc: "/atlas/simulators/macro-economy.png",
    title: "Macro Economy Lab",
    tagline: "Fiscal and monetary policy lab",
    description: "Run projections across recession, inflation, fiscal expansion, exchange rates, and debt dynamics.",
    accent: "emerald",
    icon: BarChart3,
    tags: ["Macro", "Fiscal policy", "Monetary policy"],
    complexity: "Advanced",
    featured: true,
    featuredImageAlt: "A city and chart illustration representing macroeconomic policy and projections.",
    featuredImageSrc: "/atlas/simulator-macro-economy-card.png",
  },
  {
    slug: "/simulator/wealth-gap",
    cardImageSrc: "/atlas/simulators/wealth-gap.png",
    title: "The Wealth Gap",
    tagline: "Piketty r > g in motion",
    description: "See how capital returns, tax systems, and wage growth shape concentration over decades.",
    accent: "violet",
    icon: TrendingUp,
    tags: ["Inequality", "Capital", "Taxation"],
    complexity: "Intermediate",
  },
  {
    slug: "/simulator/debt",
    cardImageSrc: "/atlas/simulators/debt.png",
    title: "Debt vs Savings",
    tagline: "Compound interest mechanics",
    description: "Compare how debt and savings grow over time as rates and payment sizes change.",
    accent: "rose",
    icon: Wallet,
    tags: ["Debt", "Compound interest", "Personal finance"],
    complexity: "Introductory",
  },
  {
    slug: "/simulator/purchasing-power",
    cardImageSrc: "/atlas/simulators/purchasing-power.png",
    title: "Your Purchasing Power",
    tagline: "Inflation and income erosion",
    description: "Track how inflation, housing, energy shocks, and interest rates change real income over time.",
    accent: "amber",
    icon: Wallet,
    tags: ["Inflation", "Housing", "Energy"],
    complexity: "Introductory",
    featured: true,
    featuredImageAlt: "An everyday city scene representing inflation, housing, and purchasing power.",
    featuredImageSrc: "/atlas/simulator-purchasing-power-card.png",
  },
  {
    slug: "/simulator/political-talent",
    cardImageSrc: "/atlas/simulators/political-talent.png",
    title: "Political Talent Barriers",
    tagline: "Why capable people stay out of politics",
    description: "Test how dynasties, party monopolies, and salary gaps filter public talent before voters choose.",
    accent: "amber",
    icon: ShieldAlert,
    tags: ["Governance", "Institutions", "Entry barriers"],
    complexity: "Intermediate",
  },
  {
    slug: "/simulator/social-movements",
    cardImageSrc: "/atlas/simulators/social-movements.png",
    title: "Social Movement Lab",
    tagline: "Why movements succeed or stall",
    description: "Compare communication, repression, elite splits, and coalition depth to see when change breaks through.",
    accent: "cyan",
    icon: Users,
    tags: ["Politics", "Coalitions", "Collective action"],
    complexity: "Intermediate",
  },
  {
    slug: "/simulator/eu-decision-making",
    cardImageSrc: "/atlas/simulators/eu-decision-making.png",
    title: "EU Legislative Process",
    tagline: "Ordinary procedure simulator",
    description: "Route a proposal through the Commission, Parliament, Council, trilogue, and transposition.",
    accent: "violet",
    icon: Landmark,
    tags: ["EU governance", "QMV", "Trilogue"],
    complexity: "Intermediate",
  },
  {
    slug: "/simulator/us-decision-making",
    cardImageSrc: "/atlas/simulators/us-decision-making.png",
    title: "US Legislative Process",
    tagline: "Congress and the White House",
    description: "Move a bill through committees, Senate cloture, conference, and veto politics.",
    accent: "amber",
    icon: Landmark,
    tags: ["US Congress", "Filibuster", "Veto"],
    complexity: "Intermediate",
  },
  {
    slug: "/simulator/war-finance",
    cardImageSrc: "/atlas/simulators/war-finance.png",
    title: "War & Financial Innovation",
    tagline: "Six centuries of crisis-driven invention",
    description: "Trace how wars and panics produced the institutions that govern money today — from the first government bond in 1171 Venice to the Bretton Woods dollar system of 1944.",
    accent: "amber",
    icon: Landmark,
    tags: ["Financial history", "Institutions", "Debt", "Central banks"],
    complexity: "Intermediate",
  },
];

export const FEATURED_SLUGS = [
  "/simulator/world3",
  "/simulator/financial-crisis",
  "/simulator/macro-economy",
  "/simulator/purchasing-power",
];

export const SIMULATOR_GROUPS: SimulatorGroup[] = [
  {
    label: "Banking and crises",
    description: "How bubbles inflate, why banks fail, and how panic spreads.",
    iconAlt: "Banking and crises category icon",
    iconSrc: "/atlas/banking-crisis.png",
    slugs: ["/simulator/bank-run", "/simulator/svb-crisis", "/simulator/financial-crisis", "/simulator/war-finance"],
  },
  {
    label: "Economics",
    description: "Macro policy, wealth concentration, debt, inflation, and real income.",
    iconAlt: "Economics category icon",
    iconSrc: "/atlas/economics.png",
    slugs: ["/simulator/macro-economy", "/simulator/wealth-gap", "/simulator/debt", "/simulator/purchasing-power"],
  },
  {
    label: "Society and politics",
    description: "Collective action, governance, and institutional decision-making.",
    iconAlt: "Society and politics category icon",
    iconSrc: "/atlas/society and politics.png",
    slugs: ["/simulator/political-talent", "/simulator/social-movements", "/simulator/eu-decision-making", "/simulator/us-decision-making"],
  },
  {
    label: "Ecology and systems",
    description: "Long-run civilization dynamics under planetary limits.",
    iconAlt: "Ecology and systems category icon",
    iconSrc: "/atlas/ecology and planet.png",
    slugs: ["/simulator/world3"],
  },
];

export const FEATURE_STYLES: Record<SimulatorAccent, { badge: string; glow: string; tile: string }> = {
  amber: {
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    glow: "from-[rgba(212,168,79,0.18)] via-[rgba(212,168,79,0.06)] to-transparent",
    tile: "border-amber-200/80 bg-amber-50/45",
  },
  cyan: {
    badge: "border-cyan-200 bg-cyan-50 text-cyan-700",
    glow: "from-[rgba(59,130,246,0.18)] via-[rgba(59,130,246,0.06)] to-transparent",
    tile: "border-cyan-200/80 bg-cyan-50/45",
  },
  emerald: {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    glow: "from-[rgba(76,175,80,0.18)] via-[rgba(76,175,80,0.06)] to-transparent",
    tile: "border-emerald-200/80 bg-emerald-50/45",
  },
  orange: {
    badge: "border-orange-200 bg-orange-50 text-orange-700",
    glow: "from-[rgba(244,114,68,0.18)] via-[rgba(244,114,68,0.06)] to-transparent",
    tile: "border-orange-200/80 bg-orange-50/45",
  },
  rose: {
    badge: "border-rose-200 bg-rose-50 text-rose-700",
    glow: "from-[rgba(244,114,182,0.18)] via-[rgba(244,114,182,0.06)] to-transparent",
    tile: "border-rose-200/80 bg-rose-50/45",
  },
  teal: {
    badge: "border-teal-200 bg-teal-50 text-teal-700",
    glow: "from-[rgba(20,184,166,0.18)] via-[rgba(20,184,166,0.06)] to-transparent",
    tile: "border-teal-200/80 bg-teal-50/45",
  },
  violet: {
    badge: "border-violet-200 bg-violet-50 text-violet-700",
    glow: "from-[rgba(139,92,246,0.18)] via-[rgba(139,92,246,0.06)] to-transparent",
    tile: "border-violet-200/80 bg-violet-50/45",
  },
};
