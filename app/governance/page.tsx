"use client";

import { useMemo, useState, type ElementType } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ChevronDown,
  ChevronUp,
  Cpu,
  Leaf,
  PiggyBank,
  PlusCircle,
  Scale,
  Vote,
} from "lucide-react";

import { AtlasPage } from "@/components/atlas/AtlasPage";
import { SoftPanel } from "@/components/atlas/SoftPanel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  SEEDED_PROPOSALS,
  getAllProposals,
  type Proposal,
  type ProposalCategory,
} from "@/lib/governance/proposals";
import { useSubmissions, useVotes } from "@/lib/governance/votes";

type SortKey = "newest" | "votes";
type GovernanceThemeKey =
  | "all"
  | "democracy-participation"
  | "money-banking"
  | "cities-housing"
  | "ecology-planet"
  | "information-tech"
  | "justice-rights";

type VisibleGovernanceThemeKey = Exclude<GovernanceThemeKey, "all">;

type GovernanceTheme = {
  colorClass: string;
  description: string;
  icon: ElementType;
  key: VisibleGovernanceThemeKey;
  label: string;
  matches: (proposal: Proposal) => boolean;
};

const HOW_IT_WORKS = [
  {
    body: "Submit a policy idea or institutional reform.",
    title: "Propose",
  },
  {
    body: "Community reviews, comments and scores it.",
    title: "Evaluate",
  },
  {
    body: "Improve the proposal with feedback.",
    title: "Refine",
  },
  {
    body: "Top proposals move to community vote.",
    title: "Decide",
  },
];

const BLUEPRINT_PILLARS = [
  {
    icon: Vote,
    summary: "Decisions should be shaped by broader participation, transparent voting paths, and clearer public oversight.",
    title: "Democracy with participation",
  },
  {
    icon: PiggyBank,
    summary: "Money and banking rules should be judged by whether they strengthen public capacity and material security.",
    title: "Public-purpose finance",
  },
  {
    icon: Building2,
    summary: "Cities, housing, and infrastructure should be treated as civic foundations, not just investment outlets.",
    title: "Everyday systems that serve life",
  },
  {
    icon: Leaf,
    summary: "Governance should internalize ecological limits instead of treating them as optional external costs.",
    title: "Ecological responsibility",
  },
  {
    icon: Cpu,
    summary: "Digital systems and public information infrastructure must stay open, legible, and democratically accountable.",
    title: "Civic technology that stays public",
  },
];

function includesAny(text: string, terms: string[]) {
  const normalized = text.toLowerCase();
  return terms.some((term) => normalized.includes(term));
}

const GOVERNANCE_THEMES: GovernanceTheme[] = [
  {
    colorClass: "border-blue-200 bg-blue-50 text-blue-700",
    description: "Electoral rules, assemblies, and participation.",
    icon: Vote,
    key: "democracy-participation",
    label: "Democracy & Participation",
    matches: (proposal) =>
      proposal.category === "democracy" ||
      includesAny(`${proposal.title} ${proposal.description}`, [
        "vote",
        "voting",
        "election",
        "assembly",
        "participation",
        "parliament",
      ]),
  },
  {
    colorClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
    description: "Money creation, banking, and public finance.",
    icon: PiggyBank,
    key: "money-banking",
    label: "Money & Banking",
    matches: (proposal) =>
      proposal.category === "banking" ||
      proposal.category === "economic" ||
      includesAny(`${proposal.title} ${proposal.description}`, [
        "bank",
        "banking",
        "money",
        "wealth",
        "tax",
        "credit",
        "public investment",
      ]),
  },
  {
    colorClass: "border-cyan-200 bg-cyan-50 text-cyan-700",
    description: "Housing, urban design, and everyday public life.",
    icon: Building2,
    key: "cities-housing",
    label: "Cities & Housing",
    matches: (proposal) =>
      includesAny(`${proposal.title} ${proposal.description} ${proposal.moduleTitle ?? ""}`, [
        "housing",
        "city",
        "cities",
        "urban",
        "rent",
        "neighbourhood",
        "public transport",
        "infrastructure",
      ]),
  },
  {
    colorClass: "border-green-200 bg-green-50 text-green-700",
    description: "Climate, ecological ceilings, and regenerative systems.",
    icon: Leaf,
    key: "ecology-planet",
    label: "Ecology & Planet",
    matches: (proposal) =>
      includesAny(`${proposal.title} ${proposal.description} ${proposal.moduleTitle ?? ""}`, [
        "climate",
        "ecology",
        "ecological",
        "planet",
        "green",
        "fossil",
        "pollution",
        "paris",
        "biodiversity",
      ]),
  },
  {
    colorClass: "border-sky-200 bg-sky-50 text-sky-700",
    description: "Platforms, transparency, digital rights, and data.",
    icon: Cpu,
    key: "information-tech",
    label: "Information & Tech",
    matches: (proposal) =>
      proposal.category === "information" ||
      proposal.category === "technology" ||
      includesAny(`${proposal.title} ${proposal.description}`, [
        "algorithm",
        "media",
        "platform",
        "digital",
        "data",
        "identity",
        "software",
        "internet",
      ]),
  },
  {
    colorClass: "border-rose-200 bg-rose-50 text-rose-700",
    description: "Rights, services, anti-corruption, and accountability.",
    icon: Scale,
    key: "justice-rights",
    label: "Justice & Rights",
    matches: (proposal) =>
      proposal.category === "political" ||
      proposal.category === "social" ||
      includesAny(`${proposal.title} ${proposal.description}`, [
        "rights",
        "justice",
        "corruption",
        "services",
        "healthcare",
        "education",
        "court",
        "ownership",
      ]),
  },
];

function formatCompactCount(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K`;
  }

  return String(value);
}

function getInitials(name: string) {
  const parts = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) return "SL";

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

function getThemeForProposal(proposal: Proposal) {
  return GOVERNANCE_THEMES.find((theme) => theme.matches(proposal)) ?? GOVERNANCE_THEMES[0];
}

export default function GovernancePage() {
  const { getLocalDelta } = useVotes();
  const { submissions } = useSubmissions();

  const [activeTheme, setActiveTheme] = useState<GovernanceThemeKey>("all");
  const [sort, setSort] = useState<SortKey>("votes");
  const [blueprintOpen, setBlueprintOpen] = useState(false);

  const allProposals = useMemo(() => getAllProposals(submissions), [submissions]);

  const proposalsWithScores = useMemo(
    () =>
      allProposals.map((proposal) => ({
        ...proposal,
        netScore: proposal.seedUpvotes - proposal.seedDownvotes + getLocalDelta(proposal.id),
        totalVotes: Math.max(0, proposal.seedUpvotes + proposal.seedDownvotes + Math.abs(getLocalDelta(proposal.id))),
      })),
    [allProposals, getLocalDelta],
  );

  const filtered = useMemo(() => {
    return proposalsWithScores
      .filter((proposal) => {
        if (activeTheme === "all") return true;
        return GOVERNANCE_THEMES.find((theme) => theme.key === activeTheme)?.matches(proposal) ?? true;
      })
      .sort((a, b) =>
        sort === "votes"
          ? b.totalVotes - a.totalVotes || b.netScore - a.netScore
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [activeTheme, proposalsWithScores, sort]);

  const themeCounts = useMemo(
    () =>
      Object.fromEntries(
        GOVERNANCE_THEMES.map((theme) => [
          theme.key,
          proposalsWithScores.filter((proposal) => theme.matches(proposal)).length,
        ]),
      ) as Record<Exclude<GovernanceThemeKey, "all">, number>,
    [proposalsWithScores],
  );

  const totalVotes = SEEDED_PROPOSALS.reduce((sum, proposal) => sum + proposal.seedUpvotes + proposal.seedDownvotes, 0);
  const contributorCount = 3200 + submissions.length;
  const activeDiscussions = filtered.length;

  return (
    <AtlasPage className="space-y-8 pb-14">
      <section className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="atlas-display text-4xl text-slate-900 sm:text-5xl">Governance Lab</h1>
            <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-[15px]">
              Propose. Evaluate. Improve. Build better systems together.
            </p>
          </div>

          <Button asChild className="rounded-full px-5">
            <Link href="/governance/submit">
              <PlusCircle className="h-4 w-4" />
              Create Proposal
            </Link>
          </Button>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-stretch">
          <div className="grid overflow-hidden rounded-[1.8rem] border border-[rgba(28,36,48,0.1)] bg-white shadow-[0_18px_40px_rgba(28,36,48,0.04)] sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Proposals", value: formatCompactCount(allProposals.length) },
              { label: "Total votes", value: `${(totalVotes / 1000).toFixed(1)}K` },
              { label: "Contributors", value: `${(contributorCount / 1000).toFixed(1)}K` },
              { label: "Active discussions", value: formatCompactCount(activeDiscussions) },
            ].map((stat, index) => (
              <div
                className={cn(
                  "px-5 py-5",
                  index < 3 ? "border-b border-[rgba(28,36,48,0.08)] xl:border-b-0 xl:border-r" : "",
                  index === 1 ? "sm:border-l xl:border-l-0" : "",
                  index === 2 ? "sm:border-b-0 xl:border-l" : "",
                )}
                key={stat.label}
              >
                <p className="text-[2rem] font-semibold leading-none text-slate-900 md:text-[2.15rem]">{stat.value}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18.5rem] xl:items-start">
        <div className="space-y-6">
          <SoftPanel className="bg-white/92">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="atlas-kicker">Explore by theme</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Explore by Theme</h2>
              </div>
              <button
                className="text-sm font-semibold text-primary transition hover:text-slate-900"
                onClick={() => setActiveTheme("all")}
                type="button"
              >
                View all <span aria-hidden>→</span>
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {GOVERNANCE_THEMES.map((theme) => {
                const Icon = theme.icon;
                const isActive = activeTheme === theme.key;

                return (
                  <button
                    className={cn(
                      "rounded-[1.35rem] border px-4 py-4 text-left transition",
                      isActive
                        ? "border-[rgba(59,130,246,0.22)] bg-[rgba(59,130,246,0.08)]"
                        : "border-[rgba(28,36,48,0.08)] bg-white hover:border-[rgba(28,36,48,0.18)]",
                    )}
                    key={theme.key}
                    onClick={() => setActiveTheme(theme.key)}
                    type="button"
                  >
                    <div className={cn("inline-flex rounded-full border p-2", theme.colorClass)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-900">{theme.label}</p>
                    <p className="mt-1 text-xs text-slate-500">{themeCounts[theme.key] ?? 0} proposals</p>
                  </button>
                );
              })}
            </div>
          </SoftPanel>

          <SoftPanel className="bg-white/92" id="trending-proposals">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="atlas-kicker">Trending proposals</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Trending Proposals</h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {(["votes", "newest"] as SortKey[]).map((option) => (
                  <button
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition",
                      sort === option
                        ? "border-[rgba(28,36,48,0.18)] bg-[rgba(246,244,238,0.92)] text-slate-900"
                        : "border-[rgba(28,36,48,0.1)] bg-white text-slate-400 hover:text-slate-700",
                    )}
                    key={option}
                    onClick={() => setSort(option)}
                    type="button"
                  >
                    {option === "votes" ? "Most voted" : "Newest"}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {filtered.slice(0, 6).map((proposal) => {
                const theme = getThemeForProposal(proposal);

                return (
                  <article
                    className="grid gap-4 rounded-[1.5rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4 shadow-[0_14px_30px_rgba(28,36,48,0.03)] sm:grid-cols-[minmax(0,1fr)_5.5rem_5rem] sm:items-center"
                    key={proposal.id}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(28,36,48,0.12)] bg-[linear-gradient(135deg,rgba(248,250,252,1),rgba(232,243,255,1))] text-sm font-semibold text-slate-700">
                        {getInitials(proposal.authorName)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold text-slate-900">{proposal.title}</h3>
                        <p className="mt-1 text-xs text-slate-500">
                          By {proposal.authorName} · {theme.label}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{proposal.description}</p>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-lg font-semibold text-slate-900">{formatCompactCount(proposal.totalVotes)}</p>
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">votes</p>
                    </div>

                    <div className="sm:text-right">
                      <Button asChild className="rounded-full px-4" size="sm" variant="outline">
                        <Link href={`/governance/${proposal.id}`}>View</Link>
                      </Button>
                    </div>
                  </article>
                );
              })}

              {filtered.length === 0 ? (
                <div className="rounded-[1.4rem] border border-dashed border-[rgba(28,36,48,0.12)] px-4 py-8 text-sm text-slate-500">
                  No proposals match that theme yet.
                </div>
              ) : null}
            </div>
          </SoftPanel>

          <SoftPanel className="bg-white/88" id="governance-blueprint">
            <button
              className="flex w-full items-center justify-between gap-3 text-left"
              onClick={() => setBlueprintOpen((value) => !value)}
              type="button"
            >
              <div>
                <p className="atlas-kicker">Blueprint</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Five design pillars</h2>
              </div>
              {blueprintOpen ? <ChevronUp className="h-5 w-5 text-slate-500" /> : <ChevronDown className="h-5 w-5 text-slate-500" />}
            </button>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              Governance Lab is not only a feed of proposals. It also points toward a broader public-interest redesign: more accountable institutions, more legible rules, and stronger civic capacity.
            </p>

            {blueprintOpen ? (
              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {BLUEPRINT_PILLARS.map(({ icon: Icon, summary, title }) => (
                  <div
                    className="rounded-[1.25rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4"
                    key={title}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(59,130,246,0.16)] bg-[rgba(59,130,246,0.08)] text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-900">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{summary}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </SoftPanel>
        </div>

        <SoftPanel className="bg-white/92" tone="gold">
          <p className="atlas-kicker">How it works</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">How it Works</h2>
          <div className="mt-5 space-y-3">
            {HOW_IT_WORKS.map((step, index) => (
              <div
                className="flex gap-3 rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4"
                key={step.title}
              >
                <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.9)] text-sm font-semibold text-slate-700">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{step.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{step.body}</p>
                </div>
              </div>
            ))}
          </div>

          <Link className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-slate-900" href="/learn?view=journeys">
            Learn more
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </SoftPanel>
      </div>
    </AtlasPage>
  );
}
