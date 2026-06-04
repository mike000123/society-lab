"use client";

import Link from "next/link";
import { useState, type ElementType } from "react";
import type { Route } from "next";
import {
  ArrowRight,
  BookOpenText,
  Compass,
  FlaskConical,
  Globe2,
  Landmark,
  Map,
  MessageSquare,
  Play,
  Scale,
  ScrollText,
  Sparkles,
  Users,
  Vote,
} from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { AtlasPage } from "@/components/atlas/AtlasPage";
import { CivilizationIllustration } from "@/components/atlas/CivilizationIllustration";
import { FeatureStrip } from "@/components/atlas/FeatureStrip";
import { InsightBlock } from "@/components/atlas/InsightBlock";
import { SectionNarrative } from "@/components/atlas/SectionNarrative";
import { SoftPanel } from "@/components/atlas/SoftPanel";
import { AuthControls } from "@/components/layout/auth-controls";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ScenarioId = "business" | "green" | "equality" | "resilience";

const navigation: { href: Route; label: string }[] = [
  { href: "/learn", label: "Learn" },
  { href: "/simulator", label: "Simulate" },
  { href: "/discussions", label: "Discuss" },
  { href: "/governance", label: "Governance" },
  { href: "/map", label: "Map" },
  { href: "/study", label: "Study" },
];

const pathways: {
  description: string;
  href: Route;
  icon: ElementType;
  label: string;
  title: string;
}[] = [
  {
    description: "Build a grounded mental model before you try to change anything.",
    href: "/learn",
    icon: BookOpenText,
    label: "01",
    title: "Learn the system",
  },
  {
    description: "Run alternative futures and see feedback loops unfold over time.",
    href: "/simulator",
    icon: FlaskConical,
    label: "02",
    title: "Simulate the future",
  },
  {
    description: "Compare perspectives, surface tradeoffs, and sharpen proposals together.",
    href: "/discussions",
    icon: MessageSquare,
    label: "03",
    title: "Discuss in public",
  },
  {
    description: "Turn shared understanding into structured civic action and experiments.",
    href: "/governance",
    icon: Landmark,
    label: "04",
    title: "Govern with others",
  },
];

const howItWorks = [
  {
    body: "Every topic begins with a condensed, visual learning journey. The point is not to overwhelm people with research, but to help them understand the system clearly enough to reason about it.",
    title: "Start with the model",
  },
  {
    body: "Instead of stopping at explanation, Society Lab lets people test long-run consequences. Simulators reveal how feedback loops, delays, and tradeoffs change the picture.",
    title: "Test possible futures",
  },
  {
    body: "Discussion is treated as collective sensemaking rather than content performance. The goal is to compare frames, expose blind spots, and improve ideas before they become decisions.",
    title: "Deliberate in the open",
  },
  {
    body: "Governance closes the loop. When an idea survives learning, simulation, and debate, it can move into proposals, refinement, and collaborative decision-making.",
    title: "Move toward action",
  },
];

const journeyStops = [
  {
    duration: "45 min",
    summary: "Why money is not just coins and notes, and how banks expand credit.",
    title: "Understand modern money",
  },
  {
    duration: "30 min",
    summary: "See why growth statistics miss health, security, time, and ecological strain.",
    title: "GDP is not wellbeing",
  },
  {
    duration: "35 min",
    summary: "Place the economy inside social foundations and planetary boundaries.",
    title: "Doughnut economics",
  },
  {
    duration: "35 min",
    summary: "Follow pollution, overshoot, and tipping points across entire systems.",
    title: "Pollution and tipping points",
  },
];

const governanceProposals = [
  {
    summary: "A proposal to fund transport, heating, and food security first, then test the fiscal and emissions effects in public.",
    title: "Public money for public purpose",
    votes: "1.2K",
  },
  {
    summary: "A plan to guarantee baseline healthcare, housing support, and energy access while measuring wellbeing instead of output alone.",
    title: "Universal basic services",
    votes: "980",
  },
  {
    summary: "A city-scale experiment combining slower traffic, mixed-use blocks, and public space recovery before a national rollout.",
    title: "Fifteen-minute districts",
    votes: "714",
  },
];

const world3Scenarios: Record<
  ScenarioId,
  {
    description: string;
    label: string;
    metrics: { label: string; value: string }[];
    points: {
      food: number;
      output: number;
      pollution: number;
      population: number;
      resources: number;
      year: number;
    }[];
  }
> = {
  business: {
    description:
      "Business as usual keeps industrial output high for a while, but pressure on pollution and resources pushes the system into overshoot.",
    label: "Business as usual",
    metrics: [
      { label: "Peak wellbeing", value: "63/100" },
      { label: "Ecological load", value: "1.8 Earths" },
      { label: "Stability", value: "Fragile" },
    ],
    points: [
      { food: 18, output: 20, pollution: 14, population: 14, resources: 100, year: 2025 },
      { food: 48, output: 56, pollution: 23, population: 36, resources: 93, year: 2050 },
      { food: 72, output: 86, pollution: 39, population: 62, resources: 83, year: 2075 },
      { food: 84, output: 100, pollution: 58, population: 82, resources: 68, year: 2100 },
      { food: 71, output: 88, pollution: 76, population: 90, resources: 50, year: 2125 },
      { food: 49, output: 63, pollution: 82, population: 74, resources: 34, year: 2150 },
      { food: 35, output: 42, pollution: 74, population: 51, resources: 23, year: 2175 },
      { food: 26, output: 28, pollution: 58, population: 36, resources: 16, year: 2200 },
    ],
  },
  equality: {
    description:
      "High equality redistributes security and slows destabilising competition. Growth is more moderate, but wellbeing and resilience remain stronger for longer.",
    label: "High equality",
    metrics: [
      { label: "Peak wellbeing", value: "79/100" },
      { label: "Ecological load", value: "1.3 Earths" },
      { label: "Stability", value: "Moderate" },
    ],
    points: [
      { food: 18, output: 18, pollution: 13, population: 14, resources: 100, year: 2025 },
      { food: 46, output: 48, pollution: 20, population: 34, resources: 95, year: 2050 },
      { food: 70, output: 72, pollution: 28, population: 57, resources: 88, year: 2075 },
      { food: 84, output: 82, pollution: 37, population: 73, resources: 79, year: 2100 },
      { food: 89, output: 83, pollution: 44, population: 81, resources: 70, year: 2125 },
      { food: 84, output: 76, pollution: 46, population: 79, resources: 60, year: 2150 },
      { food: 75, output: 66, pollution: 43, population: 72, resources: 52, year: 2175 },
      { food: 68, output: 60, pollution: 39, population: 68, resources: 46, year: 2200 },
    ],
  },
  green: {
    description:
      "Green technology improves efficiency and lowers emissions intensity, but it still works best when paired with broader social and institutional change.",
    label: "Green technology",
    metrics: [
      { label: "Peak wellbeing", value: "74/100" },
      { label: "Ecological load", value: "1.2 Earths" },
      { label: "Stability", value: "Moderate" },
    ],
    points: [
      { food: 18, output: 20, pollution: 14, population: 14, resources: 100, year: 2025 },
      { food: 47, output: 55, pollution: 19, population: 35, resources: 95, year: 2050 },
      { food: 74, output: 88, pollution: 28, population: 59, resources: 88, year: 2075 },
      { food: 88, output: 100, pollution: 35, population: 77, resources: 77, year: 2100 },
      { food: 87, output: 95, pollution: 41, population: 85, resources: 64, year: 2125 },
      { food: 80, output: 84, pollution: 43, population: 83, resources: 55, year: 2150 },
      { food: 72, output: 76, pollution: 40, population: 76, resources: 47, year: 2175 },
      { food: 67, output: 68, pollution: 36, population: 70, resources: 42, year: 2200 },
    ],
  },
  resilience: {
    description:
      "Collapse prevention combines efficiency, pollution controls, public health, and long-run planning. It does not remove tradeoffs, but it bends the trajectory away from overshoot.",
    label: "Collapse prevention",
    metrics: [
      { label: "Peak wellbeing", value: "86/100" },
      { label: "Ecological load", value: "1.0 Earth" },
      { label: "Stability", value: "Strong" },
    ],
    points: [
      { food: 18, output: 19, pollution: 14, population: 14, resources: 100, year: 2025 },
      { food: 48, output: 50, pollution: 18, population: 34, resources: 96, year: 2050 },
      { food: 76, output: 74, pollution: 22, population: 57, resources: 91, year: 2075 },
      { food: 91, output: 83, pollution: 25, population: 72, resources: 86, year: 2100 },
      { food: 96, output: 85, pollution: 26, population: 78, resources: 82, year: 2125 },
      { food: 94, output: 82, pollution: 24, population: 77, resources: 80, year: 2150 },
      { food: 89, output: 78, pollution: 22, population: 75, resources: 78, year: 2175 },
      { food: 86, output: 74, pollution: 20, population: 73, resources: 76, year: 2200 },
    ],
  },
};

function HomeHeader() {
  return (
    <header className="space-y-4 pt-4">
      <div className="flex items-center justify-between gap-4">
        <Link className="flex min-w-0 items-center gap-3" href="/">
          <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-[rgba(59,130,246,0.18)] bg-white/78 text-primary shadow-sm">
            <Globe2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <span className="atlas-display block truncate text-2xl leading-none text-slate-900">Society Lab</span>
            <span className="block truncate text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Interactive Civilization Atlas
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-[rgba(28,36,48,0.08)] bg-white/70 p-1 lg:flex">
          {navigation.map((item) => (
            <Link
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white hover:text-slate-900"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden sm:block">
            <AuthControls />
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
        {navigation.map((item) => (
          <Link
            className="shrink-0 rounded-full border border-[rgba(28,36,48,0.1)] bg-white/70 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-[rgba(28,36,48,0.18)] hover:text-slate-900"
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="sm:hidden">
        <AuthControls />
      </div>
    </header>
  );
}

function PathwaysSection() {
  return (
    <SectionNarrative
      description="Enter through the route that matches how you think best. Each path feeds the next, so learning becomes experimentation, experimentation becomes dialogue, and dialogue can become collective action."
      eyebrow="Four primary pathways"
      side={
        <p>
          You do not need to move in a straight line. The platform is designed as a civic loop, not a funnel.
        </p>
      }
      title="Learn. Simulate. Discuss. Govern."
    >
      <div className="relative">
        <div className="pointer-events-none absolute left-[7%] right-[7%] top-10 hidden h-px atlas-mapline lg:block" />
        <div className="grid gap-5 lg:grid-cols-4">
          {pathways.map((item) => {
            const Icon = item.icon;

            return (
              <div
                className="relative space-y-4 rounded-[2rem] border border-[rgba(28,36,48,0.08)] bg-white/62 p-5 backdrop-blur-sm sm:p-6"
                key={item.title}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{item.label}</span>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(28,36,48,0.1)] bg-white/80 text-slate-700">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="atlas-display text-[1.9rem] leading-tight text-slate-900">{item.title}</h3>
                  <p className="atlas-copy text-sm">{item.description}</p>
                </div>
                <Link className="inline-flex items-center gap-2 text-sm font-semibold text-primary" href={item.href}>
                  Enter pathway
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </SectionNarrative>
  );
}

function HowItWorksSection() {
  return (
    <SectionNarrative
      description="Society Lab is built to help people move from fragmented facts to shared understanding and then toward better decisions."
      eyebrow="How Society Lab works"
      side={
        <p>
          The platform is meant to condense complexity for ordinary citizens, not force them to become full-time researchers.
        </p>
      }
      title="A civic atlas, not another content feed"
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
        <div className="space-y-6">
          <p className="atlas-display max-w-2xl text-3xl leading-tight text-slate-900 sm:text-4xl">
            Understand the model. Test the consequences. Improve the proposal.
          </p>
          <div className="space-y-4 text-base leading-8 text-slate-600">
            <p>
              Most platforms stop at either information or opinion. Society Lab is designed as a connected civic journey
              where people can learn how systems behave, stress-test ideas, and then work on better public choices
              together.
            </p>
            <p>
              The aim is not just to make users consume content. It is to help them see patterns across money, cities,
              ecology, governance, and information, and then give them a practical route into experimentation and
              decision-making.
            </p>
          </div>

          <InsightBlock
            description="When a user asks a hard civic question, the platform should help them map the system, see tradeoffs, test scenarios, and carry the insight forward."
            icon={<Compass className="h-5 w-5" />}
            title="The core promise"
            tone="gold"
          />
        </div>

        <div className="relative pl-5 sm:pl-7">
          <div className="absolute left-2 top-2 bottom-2 w-px atlas-mapline sm:left-3" />
          <div className="space-y-8">
            {howItWorks.map((step, index) => (
              <div className="relative space-y-2" key={step.title}>
                <div className="absolute -left-[1.1rem] top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-[rgba(28,36,48,0.14)] bg-white text-[11px] font-semibold text-slate-700 shadow-sm sm:-left-[1.45rem] sm:h-7 sm:w-7">
                  {index + 1}
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Stage {index + 1}</p>
                <h3 className="atlas-display text-2xl text-slate-900">{step.title}</h3>
                <p className="atlas-copy max-w-2xl text-sm">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionNarrative>
  );
}

function FeaturedWorld3() {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioId>("business");
  const currentScenario = world3Scenarios[selectedScenario];

  return (
    <SectionNarrative
      description="The World3 simulator is where systems thinking becomes tangible. Adjust a path, then watch how resources, output, pollution, food, and population react across two centuries."
      eyebrow="Featured experience"
      side={<p>Use it as a shared civic sandbox: people can argue about assumptions while looking at the same system.</p>}
      title="World3 Civilization Simulator"
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] xl:items-start">
        <SoftPanel className="space-y-6" tone="blue">
          <div className="space-y-3">
            <p className="atlas-display text-3xl leading-tight text-slate-900">Explore 200 years in one view.</p>
            <p className="atlas-copy text-sm">
              Test four broad futures, compare their trajectories, then open the full simulator to shape your own
              assumptions in detail.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(Object.keys(world3Scenarios) as ScenarioId[]).map((scenario) => (
              <button
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  selectedScenario === scenario
                    ? "border-primary bg-primary text-white"
                    : "border-[rgba(28,36,48,0.1)] bg-white/80 text-slate-600 hover:border-[rgba(28,36,48,0.18)] hover:text-slate-900",
                )}
                key={scenario}
                onClick={() => setSelectedScenario(scenario)}
                type="button"
              >
                {world3Scenarios[scenario].label}
              </button>
            ))}
          </div>

          <p className="atlas-copy text-sm">{currentScenario.description}</p>

          <div className="grid gap-4 sm:grid-cols-3">
            {currentScenario.metrics.map((metric) => (
              <div className="space-y-2 border-t border-[rgba(28,36,48,0.08)] pt-4" key={metric.label}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{metric.label}</p>
                <p className="atlas-display text-2xl text-slate-900">{metric.value}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/simulator/world3">
                Launch World3
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/simulator">Browse simulators</Link>
            </Button>
          </div>
        </SoftPanel>

        <SoftPanel className="space-y-5 overflow-hidden" tone="gold">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Global outcomes over time</p>
              <p className="atlas-copy mt-2 text-sm">All curves are normalised for comparison, so the shape of the system is easier to read at a glance.</p>
            </div>
            <Link className="hidden text-sm font-semibold text-primary lg:inline-flex" href="/simulator/world3">
              Open full controls
            </Link>
          </div>

          <div className="h-[22rem] sm:h-[26rem]">
            <ResponsiveContainer height="100%" width="100%">
              <LineChart data={currentScenario.points} margin={{ bottom: 12, left: -18, right: 6, top: 8 }}>
                <CartesianGrid stroke="rgba(28,36,48,0.08)" strokeDasharray="3 4" vertical={false} />
                <XAxis dataKey="year" fontSize={12} stroke="#6B7280" tickLine={false} />
                <YAxis domain={[0, 100]} fontSize={12} stroke="#6B7280" tickLine={false} width={34} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(255,253,248,0.96)",
                    border: "1px solid rgba(28,36,48,0.08)",
                    borderRadius: "18px",
                    boxShadow: "0 18px 36px rgba(28,36,48,0.12)",
                  }}
                />
                <Line dataKey="population" dot={false} name="Population" stroke="#3B82F6" strokeWidth={3} type="monotone" />
                <Line dataKey="food" dot={false} name="Food per capita" stroke="#4CAF50" strokeWidth={3} type="monotone" />
                <Line dataKey="output" dot={false} name="Industrial output" stroke="#1C2430" strokeWidth={3} type="monotone" />
                <Line dataKey="pollution" dot={false} name="Pollution" stroke="#D9655A" strokeWidth={3} type="monotone" />
                <Line dataKey="resources" dot={false} name="Resources" stroke="#D4A84F" strokeWidth={3} type="monotone" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SoftPanel>
      </div>
    </SectionNarrative>
  );
}

function FeaturedLearningJourney() {
  return (
    <SectionNarrative
      description="The most important learning journeys should feel like guided pathways rather than giant walls of modules. Here is the kind of path a new user can follow today."
      eyebrow="Featured learning journey"
      side={<p>Start with money, move to wellbeing, then widen the frame until ecology and political power become visible together.</p>}
      title="From modern money to wellbeing and limits"
    >
      <SoftPanel className="grid gap-8 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] xl:items-start" tone="gold">
        <div className="space-y-5">
          <p className="atlas-display text-3xl leading-tight text-slate-900 sm:text-4xl">
            A connected path for people who want the big picture without drowning in theory.
          </p>
          <p className="atlas-copy text-base">
            This journey begins with how money is created, then asks what economies should actually optimise for,
            before introducing ecological limits and tipping points. It is designed to make the later political and
            governance material far easier to understand.
          </p>

          <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-white/70 px-3 py-2">Systems thinking</span>
            <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-white/70 px-3 py-2">Economy</span>
            <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-white/70 px-3 py-2">Ecology</span>
            <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-white/70 px-3 py-2">Wellbeing</span>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/learn">
                Start learning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/study">Open study library</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="relative pl-6">
            <div className="absolute left-2 top-3 bottom-3 w-px atlas-mapline" />
            <div className="space-y-6">
              {journeyStops.map((stop, index) => (
                <div className="relative space-y-2 border-b border-[rgba(28,36,48,0.08)] pb-5 last:border-b-0 last:pb-0" key={stop.title}>
                  <div className="absolute -left-6 top-1.5 h-4 w-4 rounded-full border border-[rgba(28,36,48,0.14)] bg-white shadow-sm" />
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="atlas-display text-2xl text-slate-900">{stop.title}</h3>
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{stop.duration}</span>
                  </div>
                  <p className="atlas-copy text-sm">{stop.summary}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Stop {index + 1}</p>
                </div>
              ))}
            </div>
          </div>

          <InsightBlock
            className="self-start"
            description="By the end of this journey, users can connect bank money creation, wellbeing metrics, ecological boundaries, and the reasons politics struggles to respond."
            icon={<Sparkles className="h-5 w-5" />}
            title="What this unlocks"
            tone="blue"
          />
        </div>
      </SoftPanel>
    </SectionNarrative>
  );
}

function FeaturedGovernanceLab() {
  return (
    <SectionNarrative
      description="Governance should feel like the place where informed citizens refine ideas together, not a dead-end comment feed."
      eyebrow="Featured governance lab"
      side={<p>Learning and simulation matter more when they feed into visible proposals, tradeoffs, and collective choice.</p>}
      title="Turn shared understanding into proposals"
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <SoftPanel className="space-y-6" tone="green">
          <FeatureStrip
            items={[
              { label: "Proposals", value: "128" },
              { label: "Votes", value: "42.6K" },
              { label: "Contributors", value: "3.2K" },
              { label: "Active themes", value: "28" },
            ]}
          />

          <div className="space-y-4">
            {governanceProposals.map((proposal) => (
              <div
                className="grid gap-4 border-b border-[rgba(28,36,48,0.08)] pb-4 last:border-b-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_auto]"
                key={proposal.title}
              >
                <div className="space-y-2">
                  <p className="atlas-display text-2xl text-slate-900">{proposal.title}</p>
                  <p className="atlas-copy text-sm">{proposal.summary}</p>
                </div>
                <div className="flex items-start justify-between gap-4 sm:flex-col sm:items-end">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Support</p>
                    <p className="atlas-display text-2xl text-slate-900">{proposal.votes}</p>
                  </div>
                  <Button asChild variant="outline">
                    <Link href="/governance">View</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SoftPanel>

        <SoftPanel className="space-y-5" tone="gold">
          <div className="space-y-2">
            <p className="atlas-display text-3xl leading-tight text-slate-900">How the lab should feel</p>
            <p className="atlas-copy text-sm">
              A proposal should move through a clear civic sequence instead of disappearing into a pile of reactions.
            </p>
          </div>

          <div className="space-y-5">
            {[
              { icon: ScrollText, label: "Propose", text: "Frame the public problem and state the intended outcome clearly." },
              { icon: Scale, label: "Evaluate", text: "Bring in evidence, simulations, tradeoffs, and counterarguments." },
              { icon: Users, label: "Refine", text: "Improve the proposal through structured discussion and critique." },
              { icon: Vote, label: "Decide", text: "Move strong proposals toward collective choice and experimentation." },
            ].map((step, index) => {
              const Icon = step.icon;

              return (
                <div className="flex gap-4" key={step.label}>
                  <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-[rgba(28,36,48,0.1)] bg-white/80 text-slate-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Step {index + 1}
                    </p>
                    <p className="atlas-display text-2xl text-slate-900">{step.label}</p>
                    <p className="atlas-copy text-sm">{step.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <Button asChild size="lg">
            <Link href="/governance">
              Go to governance lab
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </SoftPanel>
      </div>
    </SectionNarrative>
  );
}

export function SocietyLabLanding() {
  return (
    <AtlasPage className="space-y-16 pb-24 md:space-y-20">
      <HomeHeader />

      <section className="grid gap-8 rounded-[2.75rem] border border-[rgba(28,36,48,0.08)] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(245,240,229,0.82)_42%,rgba(231,239,244,0.72))] p-6 shadow-[0_32px_90px_rgba(28,36,48,0.08)] sm:p-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:p-10">
        <div className="flex flex-col justify-between gap-8">
          <div className="space-y-6">
            <p className="atlas-kicker">Civic learning for complex societies</p>
            <div className="space-y-4">
              <h1 className="atlas-display max-w-3xl text-5xl leading-[0.92] text-slate-900 sm:text-6xl xl:text-7xl">
                Understand the systems. Design better futures together.
              </h1>
              <p className="atlas-lede max-w-2xl">
                Society Lab turns civic education into a connected atlas. Learn how systems work, run futures in
                simulation, discuss tradeoffs in public, and move strong ideas toward governance.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/learn">
                  Start learning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/simulator/world3">
                  Explore World3
                  <Play className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link href="/map">
                  Open the systems map
                  <Map className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <FeatureStrip
            className="bg-white/72"
            items={[
              {
                description: "Condensed pathways instead of scattered reading lists.",
                icon: <BookOpenText className="h-4 w-4" />,
                label: "Learning modules",
                value: "29",
              },
              {
                description: "From personal finance to World3 civilisation dynamics.",
                icon: <FlaskConical className="h-4 w-4" />,
                label: "Simulators",
                value: "12",
              },
              {
                description: "A simple journey from understanding into civic action.",
                icon: <Compass className="h-4 w-4" />,
                label: "Primary pathways",
                value: "4",
              },
              {
                description: "Shared visual context for inequality, wellbeing, and power.",
                icon: <Map className="h-4 w-4" />,
                label: "Atlas map",
                value: "1",
              },
            ]}
          />
        </div>

        <CivilizationIllustration className="min-h-[25rem] lg:min-h-[38rem]" />
      </section>

      <PathwaysSection />

      <HowItWorksSection />

      <FeaturedWorld3 />

      <SectionNarrative
        description="The homepage should make it obvious where to go next without forcing every experience into the same card grid."
        eyebrow="Featured routes"
        side={<p>These are the three flagship areas that make the platform feel coherent: deep learning, systems simulation, and collaborative governance.</p>}
        title="Start with the part that matches your question"
      >
        <div className="grid gap-6 xl:grid-cols-3">
          <InsightBlock
            description="Move through curated learning journeys that connect money, inequality, ecology, power, and media into one readable picture."
            icon={<BookOpenText className="h-5 w-5" />}
            title="Learning journeys"
            tone="blue"
          />
          <InsightBlock
            description="Use simulators to test how delay, feedback, scarcity, policy, and behaviour change long-run outcomes."
            icon={<FlaskConical className="h-5 w-5" />}
            title="Systems simulations"
            tone="gold"
          />
          <InsightBlock
            description="Bring strong ideas into proposals, public reasoning, and shared refinement rather than leaving them as private opinions."
            icon={<Landmark className="h-5 w-5" />}
            title="Governance lab"
            tone="green"
          />
        </div>
      </SectionNarrative>

      <FeaturedLearningJourney />

      <FeaturedGovernanceLab />

      <SoftPanel className="grid gap-6 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(245,240,229,0.9)_55%,rgba(232,240,228,0.92))] xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center" tone="green">
        <div className="space-y-3">
          <p className="atlas-kicker">Begin anywhere, stay connected</p>
          <p className="atlas-display max-w-3xl text-4xl leading-tight text-slate-900 sm:text-5xl">
            A better society starts with people who can see the system they are inside.
          </p>
          <p className="atlas-copy max-w-2xl text-base">
            Learn the model, test the future, discuss the tradeoffs, and help design better public choices.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/learn">Enter the atlas</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/study">Browse resources</Link>
          </Button>
        </div>
      </SoftPanel>
    </AtlasPage>
  );
}
