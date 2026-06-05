"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import type { ElementType } from "react";
import {
  ArrowRight,
  Bell,
  Bookmark,
  BookOpenText,
  Building2,
  FlaskConical,
  Landmark,
  MessageSquare,
  Play,
  Search,
  Users,
  Vote,
} from "lucide-react";

import { AtlasPage } from "@/components/atlas/AtlasPage";
import { AuthControls } from "@/components/layout/auth-controls";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation: { href: Route; label: string }[] = [
  { href: "/learn", label: "Learn" },
  { href: "/simulator", label: "Simulate" },
  { href: "/discussions", label: "Discuss" },
  { href: "/governance", label: "Governance" },
  { href: "/map", label: "Map" },
  { href: "/study", label: "Study" },
];

const heroStats = [
  { label: "Learning tracks", value: "4" },
  { label: "Modules", value: "29" },
  { label: "Simulators", value: "12" },
  { label: "Countries", value: "180+" },
  { label: "Community", value: "10K+" },
];

const domainCards: {
  accent: string;
  artSrc: string;
  description: string;
  href: Route;
  icon: ElementType;
  title: string;
}[] = [
  {
    accent: "bg-[rgba(59,130,246,0.12)] text-[rgb(var(--atlas-primary))]",
    artSrc: "/atlas/home-domain-economy.png",
    description: "Money, markets, work, and how value is created and captured.",
    href: "/learn?view=tracks&track=economy" as Route,
    icon: Landmark,
    title: "Economy",
  },
  {
    accent: "bg-[rgba(76,175,80,0.14)] text-[rgb(var(--atlas-green))]",
    artSrc: "/atlas/home-domain-politics-democracy.png",
    description: "Power, institutions, participation, and the rules we live by.",
    href: "/learn?view=tracks&track=politics-and-democracy" as Route,
    icon: Users,
    title: "Politics & Democracy",
  },
  {
    accent: "bg-[rgba(212,168,79,0.16)] text-[rgb(var(--atlas-gold))]",
    artSrc: "/atlas/home-domain-cities-everyday-life.png",
    description: "Ecological limits, pollution, housing, transport, and how urban systems shape daily life.",
    href: "/learn?view=tracks&track=cities-and-ecology" as Route,
    icon: Building2,
    title: "Cities & Ecology",
  },
  {
    accent: "bg-[rgba(99,102,241,0.14)] text-[rgb(99,102,241)]",
    artSrc: "/atlas/home-domain-media-information.png",
    description: "Attention, narratives, truth, and the systems that shape opinion.",
    href: "/learn?view=tracks&track=media-and-information" as Route,
    icon: MessageSquare,
    title: "Media & Information",
  },
];

const worldMetrics = [
  {
    delta: "+2.1",
    label: "Global Wellbeing",
    note: "(median)",
    value: "65 /100",
  },
  {
    delta: "+1.8",
    label: "Inequality (Gini)",
    note: "(higher = worse)",
    value: "63 /100",
  },
  {
    delta: "+0.7",
    label: "Corruption (CPI)",
    note: "(higher = better)",
    value: "43 /100",
  },
  {
    delta: "-0.3",
    label: "Press Freedom",
    note: "(higher = better)",
    value: "38 /100",
  },
  {
    delta: "+0.04",
    label: "Temp. Increase",
    note: "vs pre-industrial",
    value: "1.24 °C",
  },
];

const civicSteps: {
  description: string;
  href: Route;
  icon: ElementType;
  title: string;
}[] = [
  {
    description: "Understand core systems",
    href: "/learn",
    icon: BookOpenText,
    title: "Learn",
  },
  {
    description: "Test scenarios and models",
    href: "/simulator",
    icon: FlaskConical,
    title: "Simulate",
  },
  {
    description: "Debate ideas with others",
    href: "/discussions",
    icon: MessageSquare,
    title: "Discuss",
  },
  {
    description: "Design and vote on solutions",
    href: "/governance",
    icon: Vote,
    title: "Govern",
  },
];

const featuredSimulations: {
  artSrc: string;
  badge?: string;
  description: string;
  href: Route;
  tone: "dark" | "light" | "medium";
  title: string;
}[] = [
  {
    artSrc: "/atlas/home-world3-card.png",
    badge: "Most complex",
    description: "Explore 200 years of civilization. Resources, population, pollution, technology, and wellbeing.",
    href: "/simulator/world3",
    tone: "light",
    title: "World3 Civilization Simulator",
  },
  {
    artSrc: "/atlas/simulator-financial-crisis-card.png",
    description: "Bubbles, leverage, contagion, and systemic risk in action.",
    href: "/simulator/financial-crisis",
    tone: "medium",
    title: "Financial Crisis Simulator",
  },
  {
    artSrc: "/atlas/simulator-macro-economy-card.png",
    description: "Fiscal policy, monetary inflation, debt, and growth in one model.",
    href: "/simulator/macro-economy",
    tone: "light",
    title: "Macro Economy Lab",
  },
];

const communityThreads = [
  {
    kind: "Claim",
    meta: "18 comments",
    title: "Basic income reduces poverty without destroying incentives.",
  },
  {
    kind: "Proposal",
    meta: "1.2K votes",
    title: "Public banks for green and housing investment.",
  },
  {
    kind: "Counterpoint",
    meta: "23 comments",
    title: "Growth is not the enemy — distribution is.",
  },
  {
    kind: "Question",
    meta: "17 comments",
    title: "What metrics should replace GDP as the main score?",
  },
];

const communityPulse = [22, 28, 24, 35, 30, 42, 31, 44, 39];

function HomeHeader() {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-[rgba(28,36,48,0.08)] pb-2 pt-1">
      <Link className="flex min-w-0 items-center gap-3" href="/">
        <Image
          alt="Society Lab logo"
          className="h-11 w-11 flex-none"
          height={44}
          src="/atlas/society-lab-logo.png"
          width={44}
        />
        <div className="min-w-0">
          <span className="atlas-display block truncate text-[1.85rem] leading-none text-slate-900">Society Lab</span>
          <span className="block truncate text-[11px] text-slate-500">Civic intelligence for a better future</span>
        </div>
      </Link>

      <nav className="hidden items-center gap-8 lg:flex">
        {navigation.map((item) => (
          <Link
            className="text-sm font-medium text-slate-700 transition hover:text-slate-900"
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="hidden items-center gap-2 lg:flex">
        {[Search, Bell, Bookmark].map((Icon, index) => (
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(28,36,48,0.08)] bg-white/84 text-slate-600 transition hover:border-[rgba(28,36,48,0.16)] hover:text-slate-900"
            key={index}
            type="button"
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
        <ThemeToggle />
        <AuthControls />
      </div>

      <div className="lg:hidden">
        <ThemeToggle />
      </div>
    </header>
  );
}

function ImageWash({
  className,
  imageClassName,
  overlayClassName,
  src,
}: {
  className?: string;
  imageClassName?: string;
  overlayClassName?: string;
  src: string;
}) {
  return (
    <div className={cn("absolute inset-0", className)}>
      <div
        className={cn("absolute inset-0 bg-cover bg-center bg-no-repeat", imageClassName)}
        style={{ backgroundImage: `url('${src}')` }}
      />
      <div className={cn("absolute inset-0", overlayClassName)} />
    </div>
  );
}

function MiniSparkline({ values }: { values: number[] }) {
  const width = 120;
  const height = 46;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg aria-hidden="true" className="h-12 w-[7.5rem]" viewBox={`0 0 ${width} ${height}`}>
      <polyline
        fill="none"
        points={points}
        stroke="rgb(76,175,80)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
    </svg>
  );
}

function CommunityAvatars() {
  const hues = ["bg-blue-100 text-blue-700", "bg-green-100 text-green-700", "bg-amber-100 text-amber-700", "bg-rose-100 text-rose-700"];
  return (
    <div className="flex -space-x-2">
      {["AL", "MK", "EN", "SO"].map((label, index) => (
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-semibold",
            hues[index % hues.length],
          )}
          key={label}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

function DomainCard({
  accent,
  artSrc,
  description,
  href,
  icon: Icon,
  title,
}: (typeof domainCards)[number]) {
  return (
    <Link
      className="group relative min-h-[17.5rem] overflow-hidden rounded-[1.9rem] border border-[rgba(28,36,48,0.08)] bg-white px-5 py-5 shadow-[0_16px_36px_rgba(28,36,48,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_50px_rgba(28,36,48,0.08)]"
      href={href}
    >
      <ImageWash
        imageClassName="bg-right-bottom opacity-96"
        overlayClassName="bg-[radial-gradient(circle_at_17%_18%,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.9)_18%,rgba(255,255,255,0.48)_38%,rgba(255,255,255,0.1)_58%,rgba(255,255,255,0)_76%)]"
        src={artSrc}
      />

      <div className="relative z-10 flex h-full max-w-[16rem] flex-col justify-between space-y-3">
        <div className="flex items-start gap-3">
          <div className={cn("flex h-12 w-12 flex-none items-center justify-center rounded-full", accent)}>
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="atlas-display max-w-[11.6rem] pt-1 text-[1.58rem] leading-[0.98] text-slate-900">{title}</h3>
        </div>
        <div className="space-y-3 pl-[3.75rem]">
          <p className="max-w-[11.9rem] text-sm leading-6 text-slate-700">{description}</p>
        </div>
        <span className="inline-flex items-center gap-2 pl-[3.75rem] text-sm font-semibold text-primary">
          Explore
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

function SimulationCard({
  artSrc,
  badge,
  description,
  href,
  tone,
  title,
}: (typeof featuredSimulations)[number]) {
  const isDark = tone === "dark";
  const isMedium = tone === "medium";

  return (
    <Link
      className={cn(
        "group relative flex min-h-[13.75rem] flex-col justify-between overflow-hidden rounded-[1.85rem] border border-[rgba(28,36,48,0.08)] px-5 py-5 shadow-[0_16px_40px_rgba(28,36,48,0.12)]",
        isDark ? "bg-slate-900 text-white" : "bg-white text-slate-900",
      )}
      href={href}
    >
      <ImageWash
        imageClassName="bg-[position:center_48%] opacity-[0.97]"
        overlayClassName={
          isDark
            ? "bg-[linear-gradient(180deg,rgba(11,19,34,0.14),rgba(11,19,34,0.48)_44%,rgba(11,19,34,0.84)_100%)]"
            : isMedium
              ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(18,31,53,0.12)_38%,rgba(18,31,53,0.42)_100%)]"
              : "bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.06)_32%,rgba(255,255,255,0.34)_100%)]"
        }
        src={artSrc}
      />
      <div className="relative z-10 space-y-4">
        {badge ? (
          <span className={cn(
            "inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]",
            isDark || isMedium
              ? "bg-[rgba(37,99,235,0.92)] text-white"
              : "bg-[rgba(37,99,235,0.1)] text-primary",
          )}>
            {badge}
          </span>
        ) : null}
        <div className="space-y-2">
          <h3 className={cn(
            "atlas-display max-w-[16rem] text-[2.1rem] leading-[0.96]",
            isDark || isMedium ? "text-white" : "text-slate-900",
          )}>
            {title}
          </h3>
          <p className={cn(
            "max-w-[18rem] text-sm leading-6",
            isDark ? "text-white/86" : isMedium ? "text-white/86" : "text-slate-700",
          )}>
            {description}
          </p>
        </div>
      </div>
      <div className="relative z-10 pt-4">
        <span className={cn(
          "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold backdrop-blur",
          isDark
            ? "border border-white/22 bg-white/12 text-white"
            : isMedium
              ? "border border-white/22 bg-white/12 text-white"
              : "border border-[rgba(59,130,246,0.16)] bg-white/85 text-primary",
        )}>
          Launch
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

function CommunityCard({
  kind,
  meta,
  title,
}: (typeof communityThreads)[number]) {
  const tone =
    kind === "Claim"
      ? "bg-blue-50 text-blue-700"
      : kind === "Proposal"
        ? "bg-green-50 text-green-700"
        : kind === "Counterpoint"
          ? "bg-violet-50 text-violet-700"
          : "bg-amber-50 text-amber-700";

  return (
    <div className="rounded-[1.5rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4 shadow-[0_14px_28px_rgba(28,36,48,0.04)]">
      <div className="space-y-4">
        <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]", tone)}>
          {kind}
        </span>
        <p className="text-[1.08rem] font-semibold leading-7 text-slate-900">{title}</p>
      </div>
      <div className="mt-4 flex items-center justify-between gap-4">
        <span className="text-sm text-slate-500">{meta}</span>
        <CommunityAvatars />
      </div>
    </div>
  );
}

function ActiveNowCard() {
  return (
    <div className="rounded-[1.5rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4 shadow-[0_14px_28px_rgba(28,36,48,0.04)]">
      <div className="space-y-3">
        <p className="atlas-display text-[1.9rem] text-slate-900">Active now</p>
        <div className="space-y-1">
          <p className="text-[2rem] font-semibold text-slate-900">342 people</p>
          <p className="text-sm text-slate-500">online</p>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <MiniSparkline values={communityPulse} />
      </div>
    </div>
  );
}

export function SocietyLabLanding() {
  const communitySummary = communityThreads.length;

  return (
    <AtlasPage className="space-y-4 pb-20 md:space-y-6">
      <HomeHeader />

      <section className="relative ml-[calc(50%-50vw)] w-screen overflow-hidden border-y border-[rgba(28,36,48,0.08)] bg-white shadow-[0_30px_80px_rgba(28,36,48,0.05)]">
        <ImageWash
          imageClassName="bg-[position:74%_36%] opacity-98"
          overlayClassName="bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.9)_16%,rgba(255,255,255,0.58)_32%,rgba(255,255,255,0.12)_48%,rgba(255,255,255,0)_62%)]"
          src="/atlas/home-hero.png"
        />

        <div className="relative z-10 mx-auto min-h-[28rem] max-w-[88rem] px-8 py-5 sm:min-h-[30rem] sm:px-12 sm:py-6 lg:min-h-[32rem] lg:px-16 lg:py-7">
          <div className="max-w-[35.5rem] space-y-5">
            <span className="inline-flex rounded-full bg-[rgba(59,130,246,0.1)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              A Civilization Atlas
            </span>

            <div className="space-y-4">
              <h1 className="atlas-display text-[2.28rem] leading-[0.93] tracking-[-0.03em] text-slate-900 sm:text-[2.95rem] lg:text-[3.45rem]">
                <span className="block">Understand systems.</span>
                <span className="block">
                  Design <span className="italic text-primary">better futures.</span>
                </span>
              </h1>
              <p className="max-w-[26rem] text-[0.95rem] leading-7 text-slate-700">
                Explore how the world works. Test your ideas. Shape policies, economies, and societies that work for everyone.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild className="rounded-full px-6" size="lg">
                <Link href="/learn">Start learning</Link>
              </Button>
              <Button asChild className="rounded-full px-6" size="lg" variant="outline">
                <Link href="/simulator">
                  <Play className="mr-2 h-4 w-4" />
                  Explore simulations
                </Link>
              </Button>
            </div>

            <div className="grid max-w-[32rem] grid-cols-3 gap-4 pt-1 sm:grid-cols-5">
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <p className="atlas-display text-[1.5rem] text-slate-900">{stat.value}</p>
                  <p className="mt-1 text-[0.85rem] text-slate-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 lg:bottom-10 lg:right-10">
            <div className="rounded-[1.45rem] border border-[rgba(28,36,48,0.08)] bg-white/92 px-4 py-4 shadow-[0_18px_40px_rgba(28,36,48,0.12)] backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                Live now
              </div>
              <p className="mt-2 text-sm text-slate-600">128 people exploring</p>
              <div className="mt-3 flex items-center gap-3">
                <CommunityAvatars />
                <span className="text-sm text-slate-500">+124</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          <span className="h-3 w-1 rounded-full bg-[rgb(var(--atlas-gold))]" />
          Four domains. One world.
        </div>
        <div className="grid gap-4 xl:grid-cols-4">
          {domainCards.map((card) => (
            <DomainCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-[rgba(28,36,48,0.08)] bg-white px-6 py-5 shadow-[0_18px_40px_rgba(28,36,48,0.05)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="atlas-display text-[1.95rem] leading-[0.98] tracking-[-0.02em] text-slate-900 sm:text-[2.15rem]">
              The world right now
            </h2>
            <p className="mt-1 text-[0.95rem] text-slate-500">Key indicators at a glance</p>
          </div>
          <Link className="text-sm font-semibold text-primary transition hover:text-blue-700" href="/map">
            View full map
          </Link>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_240px] xl:items-center">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {worldMetrics.map((metric, index) => (
              <div
                className="rounded-[1.3rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(249,248,243,0.75)] px-4 py-4"
                key={metric.label}
              >
                <p className="text-[0.8rem] font-semibold text-slate-500">{metric.label}</p>
                <p className="atlas-display mt-3 text-[1.95rem] leading-none tracking-[-0.02em] text-slate-900">{metric.value}</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">{metric.note}</span>
                  <span className={cn("text-xs font-semibold", index === 3 || index === 4 ? "text-rose-600" : "text-green-600")}>
                    {metric.delta}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="relative h-[11rem] overflow-hidden rounded-[1.5rem] border border-[rgba(28,36,48,0.08)] bg-[linear-gradient(180deg,rgba(247,249,246,0.94),rgba(255,255,255,0.92))]">
            <ImageWash
              imageClassName="bg-center opacity-95"
              overlayClassName="bg-[linear-gradient(180deg,rgba(255,255,255,0.15),rgba(255,255,255,0.05))]"
              src="/atlas/home-world-map.png"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-start">
        <div className="rounded-[2rem] border border-[rgba(28,36,48,0.08)] bg-white px-6 py-5 shadow-[0_18px_40px_rgba(28,36,48,0.05)]">
          <h2 className="atlas-display text-[1.95rem] leading-[0.98] tracking-[-0.02em] text-slate-900 sm:text-[2.15rem]">
            How Society Lab works
          </h2>
          <div className="mt-5 grid gap-5 lg:grid-cols-4">
            {civicSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div className="relative flex gap-4" key={step.title}>
                  <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.74)] text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="atlas-display text-[1.38rem] leading-[0.98] text-slate-900">{step.title}</p>
                    <p className="max-w-[10rem] text-sm leading-6 text-slate-600">{step.description}</p>
                    <Link className="text-sm font-semibold text-primary" href={step.href}>
                      Open
                    </Link>
                  </div>
                  {index < civicSteps.length - 1 ? (
                    <span className="absolute -right-2 top-4 hidden text-slate-300 xl:block">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[1.85rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.94)] px-5 py-5 shadow-[0_16px_36px_rgba(28,36,48,0.05)]">
          <ImageWash
            imageClassName="bg-right-bottom opacity-92"
            overlayClassName="bg-[linear-gradient(90deg,rgba(246,244,238,0.96)_0%,rgba(246,244,238,0.82)_52%,rgba(246,244,238,0.14)_100%)]"
            src="/atlas/home-new-here.png"
          />
          <div className="relative z-10 max-w-[13rem] space-y-3">
            <h3 className="atlas-display text-[2rem] text-slate-900">New here?</h3>
            <p className="text-sm leading-6 text-slate-600">Take a 2-minute quiz and we&apos;ll build your learning path.</p>
            <Button asChild className="rounded-full px-5">
              <Link href="/learn">Find my path</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="atlas-display text-[2.2rem] text-slate-900">Featured simulations</h2>
          <Link className="text-sm font-semibold text-primary transition hover:text-blue-700" href="/simulator">
            Browse all simulators
          </Link>
        </div>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,1fr)]">
          {featuredSimulations.map((simulation) => (
            <SimulationCard key={simulation.title} {...simulation} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="atlas-display text-[2.2rem] text-slate-900">What the community is working on</h2>
          <Link className="text-sm font-semibold text-primary transition hover:text-blue-700" href="/discussions">
            View discussions
          </Link>
        </div>
        <div className="grid gap-4 xl:grid-cols-[repeat(4,minmax(0,1fr))_220px]">
          {communityThreads.map((thread) => (
            <CommunityCard key={thread.title} {...thread} />
          ))}
          <ActiveNowCard />
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[2.2rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.92)] px-6 py-8 shadow-[0_24px_50px_rgba(28,36,48,0.06)] sm:px-8 sm:py-10">
        <ImageWash
          imageClassName="bg-[position:72%_58%] opacity-96"
          overlayClassName="bg-[linear-gradient(90deg,rgba(246,244,238,0.94)_0%,rgba(246,244,238,0.86)_30%,rgba(246,244,238,0.46)_56%,rgba(246,244,238,0.04)_100%)]"
          src="/atlas/home-footer-cta.png"
        />
        <div className="relative z-10 max-w-[31rem] space-y-5">
          <p className="atlas-display text-[3rem] leading-[0.95] text-slate-900 sm:text-[3.7rem]">
            The best way to predict the future is to design it together.
          </p>
          <Button asChild className="rounded-full px-7" size="lg">
            <Link href="/learn">
              Join the experiment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <div className="sr-only">{communitySummary} community threads featured on the homepage.</div>
    </AtlasPage>
  );
}
