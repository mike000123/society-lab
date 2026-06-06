import Link from "next/link";
import Image from "next/image";
import type { ElementType } from "react";
import {
  ArrowRight,
  BarChart3,
  FlaskConical,
  Globe,
  Landmark,
  PlayCircle,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

import { AtlasPage } from "@/components/atlas/AtlasPage";
import { IllustratedTabHero } from "@/components/atlas/IllustratedTabHero";
import { SoftPanel } from "@/components/atlas/SoftPanel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SimulatorEntry {
  accent: "amber" | "cyan" | "emerald" | "orange" | "rose" | "teal" | "violet";
  complexity: "Advanced" | "Intermediate" | "Introductory";
  description: string;
  featured?: boolean;
  featuredImageAlt?: string;
  featuredImageSrc?: string;
  icon: ElementType;
  slug: string;
  tagline: string;
  tags: string[];
  title: string;
}

const SIMULATORS: SimulatorEntry[] = [
  {
    slug: "/simulator/world3",
    title: "World3 Civilization Simulator",
    tagline: "World3 system dynamics model",
    description:
      "Explore 200 years of civilization by adjusting resources, pollution, population, technology, and welfare.",
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
    title: "Bank Run Simulator",
    tagline: "Bank run dynamics",
    description:
      "Test how reserve ratios, deposit insurance, and panic response change whether a rumor becomes a collapse.",
    accent: "rose",
    icon: TrendingDown,
    tags: ["Banking", "Contagion", "Deposit insurance"],
    complexity: "Intermediate",
  },
  {
    slug: "/simulator/svb-crisis",
    title: "SVB Collapse 2023",
    tagline: "Silicon Valley Bank crisis",
    description:
      "Replay the fastest large bank failure in modern US history by changing duration risk, uninsured deposits, and social media amplification.",
    accent: "amber",
    icon: Zap,
    tags: ["Banking", "Duration risk", "Social media"],
    complexity: "Intermediate",
  },
  {
    slug: "/simulator/financial-crisis",
    title: "Financial Crisis Simulator",
    tagline: "Leverage and contagion model",
    description:
      "Model bubbles, leverage, shadow banking, and policy responses to see why crises spread so fast.",
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
    title: "Macro Economy Lab",
    tagline: "Fiscal and monetary policy lab",
    description:
      "Run projections across recession, inflation, fiscal expansion, exchange rates, and debt dynamics.",
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
    title: "The Wealth Gap",
    tagline: "Piketty r > g in motion",
    description:
      "See how capital returns, tax systems, and wage growth shape concentration over decades.",
    accent: "violet",
    icon: TrendingUp,
    tags: ["Inequality", "Capital", "Taxation"],
    complexity: "Intermediate",
  },
  {
    slug: "/simulator/debt",
    title: "Debt vs Savings",
    tagline: "Compound interest mechanics",
    description:
      "Compare how debt and savings grow over time as rates and payment sizes change.",
    accent: "rose",
    icon: Wallet,
    tags: ["Debt", "Compound interest", "Personal finance"],
    complexity: "Introductory",
  },
  {
    slug: "/simulator/purchasing-power",
    title: "Your Purchasing Power",
    tagline: "Inflation and income erosion",
    description:
      "Track how inflation, housing, energy shocks, and interest rates change real income over time.",
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
    title: "Political Talent Barriers",
    tagline: "Why capable people stay out of politics",
    description:
      "Test how dynasties, party monopolies, and salary gaps filter public talent before voters choose.",
    accent: "amber",
    icon: ShieldAlert,
    tags: ["Governance", "Institutions", "Entry barriers"],
    complexity: "Intermediate",
  },
  {
    slug: "/simulator/social-movements",
    title: "Social Movement Lab",
    tagline: "Why movements succeed or stall",
    description:
      "Compare communication, repression, elite splits, and coalition depth to see when change breaks through.",
    accent: "cyan",
    icon: Users,
    tags: ["Politics", "Coalitions", "Collective action"],
    complexity: "Intermediate",
  },
  {
    slug: "/simulator/eu-decision-making",
    title: "EU Legislative Process",
    tagline: "Ordinary procedure simulator",
    description:
      "Route a proposal through the Commission, Parliament, Council, trilogue, and transposition.",
    accent: "violet",
    icon: Landmark,
    tags: ["EU governance", "QMV", "Trilogue"],
    complexity: "Intermediate",
  },
  {
    slug: "/simulator/us-decision-making",
    title: "US Legislative Process",
    tagline: "Congress and the White House",
    description:
      "Move a bill through committees, Senate cloture, conference, and veto politics.",
    accent: "amber",
    icon: Landmark,
    tags: ["US Congress", "Filibuster", "Veto"],
    complexity: "Intermediate",
  },
];

const FEATURED_SLUGS = [
  "/simulator/world3",
  "/simulator/financial-crisis",
  "/simulator/macro-economy",
  "/simulator/purchasing-power",
];

const GROUPS = [
  {
    label: "Banking and crises",
    description: "How bubbles inflate, why banks fail, and how panic spreads.",
    iconAlt: "Banking and crises category icon",
    iconSrc: "/atlas/banking-crisis.png",
    slugs: ["/simulator/bank-run", "/simulator/svb-crisis", "/simulator/financial-crisis"],
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

const FEATURE_STYLES: Record<SimulatorEntry["accent"], { badge: string; glow: string; tile: string }> = {
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

function FeaturedSimulationCard({ simulator }: { simulator: SimulatorEntry }) {
  const Icon = simulator.icon;
  const styles = FEATURE_STYLES[simulator.accent];
  const usesFeaturedImage = Boolean(simulator.featuredImageSrc);

  return (
    <article className="overflow-hidden rounded-[1.6rem] border border-[rgba(28,36,48,0.08)] bg-white/90 shadow-[0_14px_32px_rgba(28,36,48,0.04)]">
      <div className="relative h-36 overflow-hidden border-b border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.9)]">
        {usesFeaturedImage ? (
          <Image
            alt={simulator.featuredImageAlt ?? simulator.title}
            className="object-cover"
            fill
            sizes="(max-width: 1024px) 100vw, 25vw"
            src={simulator.featuredImageSrc!}
          />
        ) : (
          <>
            <div className={cn("absolute inset-x-0 top-0 h-full bg-gradient-to-br", styles.glow)} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={cn("flex h-14 w-14 items-center justify-center rounded-full border", styles.badge)}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <span className={cn("inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]", styles.badge)}>
            {simulator.complexity}
          </span>
          <span className="text-xs text-slate-500">{simulator.tagline}</span>
        </div>
        <h2 className="mt-3 text-xl font-semibold leading-7 text-slate-900">{simulator.title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">{simulator.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {simulator.tags.slice(0, 3).map((tag) => (
            <span className={cn("rounded-full border px-3 py-1 text-xs font-medium", styles.tile)} key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-5">
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold text-[rgb(var(--atlas-primary))] transition hover:text-slate-900"
            href={simulator.slug}
          >
            Launch
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function SimulatorHubPage() {
  const featuredSimulators = FEATURED_SLUGS.map((slug) => SIMULATORS.find((simulator) => simulator.slug === slug)).filter(Boolean) as SimulatorEntry[];

  return (
    <AtlasPage className="space-y-8 pb-14">
      <IllustratedTabHero
        actions={
          <>
            <Button asChild className="rounded-full px-5">
              <a href="#featured-simulations">Browse simulators</a>
            </Button>
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
              href="/simulator/world3"
            >
              <PlayCircle className="h-4 w-4" />
              Open World3
            </Link>
          </>
        }
        description="Run real models, test alternate decisions, and explore the long-term consequences before they happen. The point is not only explanation but experimentation."
        eyebrow="Simulation Lab"
        imageAlt="A mountain valley containing a future city and people overlooking a systems dashboard."
        imageSrc="/atlas/simulator-hero.png"
        title="Run the systems. Explore the futures."
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              description: "Built from systems thinking and real data patterns.",
              icon: Globe,
              title: "Real models",
            },
            {
              description: "Change variables directly and watch the dynamics respond.",
              icon: Zap,
              title: "Interactive",
            },
            {
              description: "Many simulators show years or decades, not just a moment.",
              icon: TrendingUp,
              title: "Long-term view",
            },
            {
              description: "Compare scenarios and see which futures become more stable.",
              icon: FlaskConical,
              title: "Compare futures",
            },
          ].map(({ description, icon: Icon, title }) => (
            <div
              className="rounded-[1.4rem] border border-[rgba(28,36,48,0.08)] bg-white/88 px-4 py-4 shadow-[0_14px_32px_rgba(28,36,48,0.04)]"
              key={title}
            >
              <div className="inline-flex rounded-full border border-[rgba(59,130,246,0.16)] bg-[rgba(59,130,246,0.08)] p-2 text-[rgb(var(--atlas-primary))]">
                <Icon className="h-4 w-4" />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-900">{title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </IllustratedTabHero>

      <section className="space-y-4" id="featured-simulations">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="atlas-kicker">Featured simulations</p>
            <h2 className="atlas-display mt-2 text-3xl text-slate-900">Start with the clearest entry points</h2>
          </div>
          <span className="text-sm text-slate-500">{SIMULATORS.length} simulators across 4 regions</span>
        </div>

        <div className="grid gap-4 xl:grid-cols-4">
          {featuredSimulators.map((simulator) => (
            <FeaturedSimulationCard key={simulator.slug} simulator={simulator} />
          ))}
        </div>
      </section>

      <SoftPanel>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="atlas-kicker">Browse by category</p>
            <h2 className="atlas-display mt-2 text-3xl text-slate-900">Choose a simulation region</h2>
          </div>
          <Link className="text-sm font-semibold text-slate-500 transition hover:text-slate-900" href="/learn">
            Learn the theory first
          </Link>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {GROUPS.map((group) => (
            <div
              className="flex flex-col justify-center rounded-[1.35rem] border border-[rgba(28,36,48,0.08)] bg-white/88 px-4 py-4 text-center sm:min-h-[14rem] xl:aspect-[4/3] xl:min-h-0"
              key={group.label}
            >
              <div className="mb-3 flex items-center justify-center">
                <Image
                  alt={group.iconAlt}
                  className="h-[4.25rem] w-[4.25rem] object-contain"
                  height={68}
                  src={group.iconSrc}
                  width={68}
                />
              </div>
              <p className="text-sm font-semibold text-slate-900">{group.label}</p>
              <p className="mx-auto mt-1.5 max-w-[15rem] text-sm leading-6 text-slate-600">{group.description}</p>
              <p className="mt-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                {group.slugs.length} simulator{group.slugs.length > 1 ? "s" : ""}
              </p>
            </div>
          ))}
        </div>
      </SoftPanel>

      <SoftPanel>
        <p className="atlas-kicker">All simulators</p>
        <h2 className="atlas-display mt-2 text-3xl text-slate-900">Explore the full lab without the clutter</h2>

        <div className="mt-6 space-y-6">
          {GROUPS.map((group) => (
            <div className="space-y-3" key={group.label}>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{group.label}</h3>
                <p className="mt-1 text-sm text-slate-500">{group.description}</p>
              </div>
              <div className="divide-y divide-[rgba(28,36,48,0.08)] rounded-[1.4rem] border border-[rgba(28,36,48,0.08)] bg-white/90">
                {group.slugs.map((slug) => {
                  const simulator = SIMULATORS.find((item) => item.slug === slug);
                  if (!simulator) {
                    return null;
                  }
                  const Icon = simulator.icon;
                  const styles = FEATURE_STYLES[simulator.accent];

                  return (
                    <div className="grid gap-3 px-4 py-4 md:grid-cols-[2.2rem_minmax(0,1fr)_8rem]" key={slug}>
                      <div className={cn("flex h-9 w-9 items-center justify-center rounded-full border", styles.badge)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-slate-900">{simulator.title}</p>
                          <span className={cn("rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em]", styles.badge)}>
                            {simulator.complexity}
                          </span>
                        </div>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{simulator.description}</p>
                      </div>
                      <div className="md:text-right">
                        <Link
                          className="inline-flex items-center gap-2 text-sm font-semibold text-[rgb(var(--atlas-primary))] transition hover:text-slate-900"
                          href={simulator.slug}
                        >
                          Open
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </SoftPanel>
    </AtlasPage>
  );
}
