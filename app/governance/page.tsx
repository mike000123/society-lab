"use client";

import { useMemo, useState, type ElementType } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  ChevronDown,
  ChevronUp,
  Cpu,
  Eye,
  Landmark,
  PlusCircle,
  ShieldCheck,
  ThumbsUp,
  Vote,
} from "lucide-react";

import { AtlasPage } from "@/components/atlas/AtlasPage";
import { IllustratedTabHero } from "@/components/atlas/IllustratedTabHero";
import { SoftPanel } from "@/components/atlas/SoftPanel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  SEEDED_PROPOSALS,
  getAllProposals,
  type ProposalCategory,
} from "@/lib/governance/proposals";
import { useSubmissions, useVotes } from "@/lib/governance/votes";

type SortKey = "newest" | "votes";

const CATEGORIES: { key: ProposalCategory | "all"; label: string }[] = [
  { key: "all", label: "All themes" },
  { key: "banking", label: "Banking" },
  { key: "democracy", label: "Democracy" },
  { key: "technology", label: "Technology" },
  { key: "economic", label: "Economy" },
  { key: "political", label: "Politics" },
  { key: "social", label: "Society" },
  { key: "information", label: "Information" },
];

const THEME_META: Record<
  ProposalCategory,
  {
    description: string;
    icon: ElementType;
    pill: string;
  }
> = {
  banking: {
    description: "Money creation, public banking, and financial reform.",
    icon: Banknote,
    pill: "border-teal-200 bg-teal-50 text-teal-700",
  },
  democracy: {
    description: "Participation, assemblies, electoral rules, and representation.",
    icon: Vote,
    pill: "border-violet-200 bg-violet-50 text-violet-700",
  },
  economic: {
    description: "Tax, wealth, redistribution, and real-economy priorities.",
    icon: Landmark,
    pill: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  information: {
    description: "Media, transparency, data rights, and public information.",
    icon: Eye,
    pill: "border-cyan-200 bg-cyan-50 text-cyan-700",
  },
  political: {
    description: "State design, institutions, and public accountability.",
    icon: ShieldCheck,
    pill: "border-amber-200 bg-amber-50 text-amber-700",
  },
  social: {
    description: "Public services, care systems, and social guarantees.",
    icon: ShieldCheck,
    pill: "border-rose-200 bg-rose-50 text-rose-700",
  },
  technology: {
    description: "Digital identity, open infrastructure, and civic tools.",
    icon: Cpu,
    pill: "border-sky-200 bg-sky-50 text-sky-700",
  },
};

const PILLARS = [
  {
    icon: Vote,
    title: "Direct and liquid democracy",
    summary: "Citizens vote on more than personalities, and delegation stays flexible by topic.",
  },
  {
    icon: ShieldCheck,
    title: "Structural anti-corruption",
    summary: "Transparency is built into the system architecture rather than left to good intentions.",
  },
  {
    icon: Cpu,
    title: "Technology-enabled governance",
    summary: "Civic infrastructure should be open, auditable, and designed as public capacity.",
  },
  {
    icon: Eye,
    title: "Radical transparency",
    summary: "Opacity is the precondition for capture, so disclosure must become normal and timely.",
  },
  {
    icon: Banknote,
    title: "Banking for public purpose",
    summary: "The monetary system should support housing, care, resilience, and productive investment.",
  },
];

export default function GovernancePage() {
  const { getLocalDelta } = useVotes();
  const { submissions } = useSubmissions();

  const [activeCategory, setActiveCategory] = useState<ProposalCategory | "all">("all");
  const [sort, setSort] = useState<SortKey>("votes");
  const [blueprintOpen, setBlueprintOpen] = useState(false);

  const allProposals = useMemo(() => getAllProposals(submissions), [submissions]);

  const filtered = useMemo(() => {
    return allProposals
      .filter((proposal) => activeCategory === "all" || proposal.category === activeCategory)
      .map((proposal) => ({
        ...proposal,
        netScore: proposal.seedUpvotes - proposal.seedDownvotes + getLocalDelta(proposal.id),
      }))
      .sort((a, b) =>
        sort === "votes"
          ? b.netScore - a.netScore
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [activeCategory, allProposals, getLocalDelta, sort]);

  const totalVotes = SEEDED_PROPOSALS.reduce((sum, proposal) => sum + proposal.seedUpvotes + proposal.seedDownvotes, 0);
  const contributorCount = 3200 + submissions.length;
  const activeDebates = filtered.length;

  return (
    <AtlasPage className="space-y-8 pb-14">
      <IllustratedTabHero
        actions={
          <>
            <Button asChild className="rounded-full px-5">
              <Link href="/governance/submit">
                <PlusCircle className="h-4 w-4" />
                Submit a proposal
              </Link>
            </Button>
            <a
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
              href="#governance-blueprint"
            >
              View the blueprint
              <ArrowRight className="h-4 w-4" />
            </a>
          </>
        }
        description="Design better systems, propose concrete reforms, and evaluate them together. Governance Lab is where the atlas stops only diagnosing failure and starts testing public alternatives."
        eyebrow="Governance Lab"
        imageAlt="A civic landscape with a public building, open space, and people walking toward institutions."
        imageSrc="/atlas/governance-hero.png"
        title="Propose, evaluate, and refine better systems together"
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Proposals", value: String(allProposals.length) },
            { label: "Total votes", value: `${(totalVotes / 1000).toFixed(1)}K` },
            { label: "Contributors", value: `${(contributorCount / 1000).toFixed(1)}K` },
            { label: "Active debates", value: String(activeDebates) },
          ].map((stat) => (
            <div
              className="rounded-[1.4rem] border border-[rgba(28,36,48,0.08)] bg-white/88 px-4 py-4 shadow-[0_14px_32px_rgba(28,36,48,0.04)]"
              key={stat.label}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{stat.label}</p>
              <p className="mt-2 atlas-display text-3xl text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>
      </IllustratedTabHero>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.12fr)_20rem]">
        <div className="space-y-6">
          <SoftPanel>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="atlas-kicker">Explore by theme</p>
                <h2 className="atlas-display mt-2 text-3xl text-slate-900">Choose a reform region</h2>
              </div>
              <Link className="text-sm font-semibold text-slate-500 transition hover:text-slate-900" href="/learn?view=tracks">
                Learn routes
              </Link>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {(CATEGORIES.filter((category) => category.key !== "all") as Array<{ key: ProposalCategory; label: string }>).map(
                ({ key, label }) => {
                  const meta = THEME_META[key];
                  const Icon = meta.icon;
                  const active = activeCategory === key;

                  return (
                    <button
                      className={cn(
                        "rounded-[1.35rem] border px-4 py-4 text-left transition",
                        active
                          ? "border-[rgba(59,130,246,0.22)] bg-[rgba(59,130,246,0.08)]"
                          : "border-[rgba(28,36,48,0.08)] bg-white/86 hover:border-[rgba(28,36,48,0.18)]",
                      )}
                      key={key}
                      onClick={() => setActiveCategory(key)}
                      type="button"
                    >
                      <div className={cn("inline-flex rounded-full border p-2", meta.pill)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-slate-900">{label}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{meta.description}</p>
                    </button>
                  );
                },
              )}
            </div>
          </SoftPanel>

          <SoftPanel>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="atlas-kicker">Trending proposals</p>
                <h2 className="atlas-display mt-2 text-3xl text-slate-900">What people are arguing for</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(({ key, label }) => (
                  <button
                    className={cn(
                      "rounded-full border px-3 py-2 text-sm font-medium transition",
                      activeCategory === key
                        ? "border-[rgba(59,130,246,0.25)] bg-[rgba(59,130,246,0.1)] text-slate-900"
                        : "border-[rgba(28,36,48,0.1)] bg-white/90 text-slate-500 hover:text-slate-800",
                    )}
                    key={key}
                    onClick={() => setActiveCategory(key)}
                    type="button"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {(["votes", "newest"] as SortKey[]).map((option) => (
                <button
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition",
                    sort === option
                      ? "border-[rgba(28,36,48,0.18)] bg-[rgba(246,244,238,0.9)] text-slate-900"
                      : "border-[rgba(28,36,48,0.1)] bg-white/90 text-slate-400 hover:text-slate-700",
                  )}
                  key={option}
                  onClick={() => setSort(option)}
                  type="button"
                >
                  {option === "votes" ? "Most voted" : "Newest"}
                </button>
              ))}
            </div>

            <div className="mt-6 divide-y divide-[rgba(28,36,48,0.08)]">
              {filtered.map((proposal) => {
                const meta = THEME_META[proposal.category];

                return (
                  <article className="grid gap-4 py-5 first:pt-0 last:pb-0 md:grid-cols-[minmax(0,1fr)_6rem_6rem]" key={proposal.id}>
                    <div>
                      <span className={cn("inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]", meta.pill)}>
                        {CATEGORIES.find((category) => category.key === proposal.category)?.label}
                      </span>
                      <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-900">{proposal.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{proposal.description}</p>
                      {proposal.moduleSlug ? (
                        <Link
                          className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
                          href={`/learn/${proposal.moduleSlug}`}
                        >
                          Connected module: {proposal.moduleTitle}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      ) : null}
                    </div>

                    <div className="md:text-right">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Votes</p>
                      <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.9)] px-3 py-2 text-slate-800">
                        <ThumbsUp className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm font-semibold">
                          {proposal.netScore > 0 ? `+${proposal.netScore}` : proposal.netScore}
                        </span>
                      </div>
                    </div>

                    <div className="md:text-right">
                      <Button asChild className="rounded-full px-4" size="sm" variant="outline">
                        <Link href={`/governance/${proposal.id}`}>View</Link>
                      </Button>
                    </div>
                  </article>
                );
              })}

              {filtered.length === 0 ? (
                <p className="py-8 text-sm text-slate-500">No proposals match that theme yet.</p>
              ) : null}
            </div>
          </SoftPanel>
        </div>

        <div className="space-y-6">
          <SoftPanel tone="gold">
            <p className="atlas-kicker">How it works</p>
            <h2 className="atlas-display mt-2 text-2xl text-slate-900">A simple civic loop</h2>
            <div className="mt-4 space-y-3">
              {[
                "Propose: submit a concrete reform with a rationale and linked evidence.",
                "Evaluate: community votes and comments surface tradeoffs and weak spots.",
                "Refine: better versions emerge as arguments get sharper.",
                "Decide: the best proposals become candidates for the governance roadmap.",
              ].map((step, index) => (
                <div className="flex gap-3 rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-white/86 px-4 py-4" key={step}>
                  <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.9)] text-sm font-semibold text-slate-700">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-slate-600">{step}</p>
                </div>
              ))}
            </div>
          </SoftPanel>

          <SoftPanel className="space-y-4" id="governance-blueprint">
            <button
              className="flex w-full items-center justify-between gap-3 text-left"
              onClick={() => setBlueprintOpen((value) => !value)}
              type="button"
            >
              <div>
                <p className="atlas-kicker">Blueprint</p>
                <h2 className="atlas-display mt-2 text-2xl text-slate-900">Five pillars of redesign</h2>
              </div>
              {blueprintOpen ? <ChevronUp className="h-5 w-5 text-slate-500" /> : <ChevronDown className="h-5 w-5 text-slate-500" />}
            </button>

            <p className="atlas-copy text-sm">
              Governance Lab is not only a proposal wall. It also carries a more coherent direction for what a
              public-interest system might actually look like.
            </p>

            {blueprintOpen ? (
              <div className="space-y-3">
                {PILLARS.map(({ icon: Icon, summary, title }) => (
                  <div
                    className="flex gap-3 rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-white/88 px-4 py-4"
                    key={title}
                  >
                    <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-[rgba(59,130,246,0.16)] bg-[rgba(59,130,246,0.08)] text-[rgb(var(--atlas-primary))]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </SoftPanel>
        </div>
      </div>
    </AtlasPage>
  );
}
