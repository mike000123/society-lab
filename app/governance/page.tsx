"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight, PlusCircle, ThumbsUp, Landmark,
  Vote, ShieldCheck, Cpu, Eye, Banknote, ChevronDown, ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  SEEDED_PROPOSALS,
  CATEGORY_META,
  getAllProposals,
  type ProposalCategory,
} from "@/lib/governance/proposals";
import { useVotes, useSubmissions } from "@/lib/governance/votes";

type SortKey = "votes" | "newest";

const CATEGORIES: { key: ProposalCategory | "all"; label: string }[] = [
  { key: "all",         label: "All" },
  { key: "banking",     label: "Banking" },
  { key: "democracy",   label: "Democracy" },
  { key: "technology",  label: "Technology" },
  { key: "economic",    label: "Economic" },
  { key: "political",   label: "Political" },
  { key: "social",      label: "Social" },
  { key: "information", label: "Information" },
];

const PILLARS = [
  {
    icon: Vote,
    accent: "violet",
    title: "Direct & Liquid Democracy",
    tagline: "Citizens vote on policy, not just politicians",
    points: [
      "Liquid democracy: delegate your vote by topic, revoke any time",
      "Citizens' assemblies for structural decisions (sortition)",
      "Participatory budgeting — 10% of public spending decided directly",
      "Ranked-choice and proportional representation as baseline",
    ],
  },
  {
    icon: ShieldCheck,
    accent: "emerald",
    title: "Structural Anti-Corruption",
    tagline: "Transparency as architecture, not promise",
    points: [
      "All public spending published real-time, machine-readable",
      "Beneficial ownership registries — no anonymous shell companies",
      "5-year revolving-door ban with criminal penalties",
      "AI conflict-of-interest detection across all parliamentary votes",
    ],
  },
  {
    icon: Cpu,
    accent: "cyan",
    title: "Technology-Enabled Governance",
    tagline: "Open, auditable, citizen-owned infrastructure",
    points: [
      "Universal digital identity (Estonia model) for all services",
      "All government software open source and publicly auditable",
      "Blockchain procurement audit trails — immutable public records",
      "Constitutionally guaranteed digital rights",
    ],
  },
  {
    icon: Eye,
    accent: "amber",
    title: "Radical Transparency",
    tagline: "Opacity is the precondition for every abuse",
    points: [
      "Annual public asset declarations — all elected and senior officials",
      "Real-time lobbying registry with 48-hour reporting",
      "Algorithmic explanation rights for every automated decision",
      "Open-source voting infrastructure with public audit",
    ],
  },
  {
    icon: Banknote,
    accent: "teal",
    title: "A Banking System for People, Not Profit",
    tagline: "Money as a public utility — not a private extraction machine",
    points: [
      "Sovereign money: debt-free creation by a democratic authority",
      "Strict retail/investment separation — no more casino banking on deposits",
      "Public banks with a social mandate; cooperative banking floor of 30%",
      "Interest-free public credit for housing, education, and green transition",
      "Real-time AML monitoring with executive criminal liability",
      "Universal basic banking — free accounts for every resident",
    ],
  },
];

const ACCENT_PILLAR: Record<string, { border: string; bg: string; icon: string; glow: string }> = {
  violet:  { border: "border-violet-400/30",  bg: "bg-violet-400/8",  icon: "text-violet-300 border-violet-300/20 bg-violet-400/10",  glow: "from-violet-400/12 via-violet-400/4 to-transparent" },
  emerald: { border: "border-emerald-400/30", bg: "bg-emerald-400/8", icon: "text-emerald-300 border-emerald-300/20 bg-emerald-400/10", glow: "from-emerald-400/12 via-emerald-400/4 to-transparent" },
  cyan:    { border: "border-cyan-400/30",    bg: "bg-cyan-400/8",    icon: "text-cyan-300 border-cyan-300/20 bg-cyan-400/10",     glow: "from-cyan-400/12 via-cyan-400/4 to-transparent" },
  amber:   { border: "border-amber-400/30",   bg: "bg-amber-400/8",   icon: "text-amber-300 border-amber-300/20 bg-amber-400/10",  glow: "from-amber-400/12 via-amber-400/4 to-transparent" },
  teal:    { border: "border-teal-400/30",    bg: "bg-teal-400/8",    icon: "text-teal-300 border-teal-300/20 bg-teal-400/10",     glow: "from-teal-400/12 via-teal-400/4 to-transparent" },
};

export default function GovernancePage() {
  const { getLocalDelta } = useVotes();
  const { submissions } = useSubmissions();

  const [activeCategory, setActiveCategory] = useState<ProposalCategory | "all">("all");
  const [sort, setSort] = useState<SortKey>("votes");
  const [blueprintOpen, setBlueprintOpen] = useState(false);

  const allProposals = getAllProposals(submissions);

  const filtered = allProposals
    .filter((p) => activeCategory === "all" || p.category === activeCategory)
    .map((p) => ({
      ...p,
      netScore: p.seedUpvotes - p.seedDownvotes + getLocalDelta(p.id),
    }))
    .sort((a, b) =>
      sort === "votes"
        ? b.netScore - a.netScore
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const totalProposals = allProposals.length;
  const totalVotes = SEEDED_PROPOSALS.reduce((s, p) => s + p.seedUpvotes + p.seedDownvotes, 0);
  const democracyCount = allProposals.filter((p) => p.category === "democracy").length;
  const techCount = allProposals.filter((p) => p.category === "technology").length;
  const bankingCount = allProposals.filter((p) => p.category === "banking").length;

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-10">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/85 p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-violet-400/14 via-violet-400/4 to-transparent" />
        <div className="relative grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-300/25 bg-violet-400/10 px-3 py-1 text-xs font-medium text-violet-100">
              <Landmark className="h-3.5 w-3.5" /> Governance lab
            </span>
            <h1 className="text-3xl font-black tracking-tight text-slate-50 sm:text-4xl">
              Designing the political and financial system we don&apos;t have yet
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-300">
              Representative democracy was designed for a pre-digital world. Our banking system was designed
              to generate private debt, not public welfare. Technology now makes direct participation,
              radical transparency, and structural anti-corruption not just possible — but practical.
              These proposals are concrete, evidence-based steps toward that system.
            </p>
            <Button asChild className="rounded-2xl gap-2 w-fit">
              <Link href="/governance/submit">
                <PlusCircle className="h-4 w-4" /> Submit a proposal
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 content-start">
            <div className="rounded-[1.5rem] border border-slate-800 bg-panel/85 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Proposals</p>
              <p className="mt-2 text-3xl font-black text-slate-50">{totalProposals}</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-800 bg-panel/85 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Total votes</p>
              <p className="mt-2 text-3xl font-black text-slate-50">{totalVotes.toLocaleString()}</p>
            </div>
            <div className="rounded-[1.5rem] border border-teal-400/20 bg-teal-400/8 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-teal-400/70">Banking reform</p>
              <p className="mt-2 text-3xl font-black text-teal-200">{bankingCount}</p>
            </div>
            <div className="rounded-[1.5rem] border border-violet-400/20 bg-violet-400/8 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-violet-400/70">Democracy</p>
              <p className="mt-2 text-3xl font-black text-violet-200">{democracyCount}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Blueprint ─────────────────────────────────────────────────────── */}
      <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 overflow-hidden">
        <button
          className="w-full flex items-center justify-between gap-3 px-6 py-5 text-left hover:bg-slate-900/40 transition-colors"
          onClick={() => setBlueprintOpen((v) => !v)}
        >
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Blueprint</p>
            <h2 className="mt-0.5 text-xl font-black text-slate-50 sm:text-2xl">
              Five pillars of a system redesigned for people
            </h2>
          </div>
          {blueprintOpen
            ? <ChevronUp className="h-5 w-5 text-slate-500 flex-shrink-0" />
            : <ChevronDown className="h-5 w-5 text-slate-500 flex-shrink-0" />
          }
        </button>

        {blueprintOpen && (
          <div className="border-t border-slate-800 px-6 pb-6 pt-5">
            <p className="max-w-3xl text-sm leading-6 text-slate-400 mb-6">
              Every proposal maps to one of five design principles. Together they describe a system that is
              structurally resistant to corruption, genuinely participatory, and built around welfare rather than debt and extraction.
            </p>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {PILLARS.map((pillar) => {
                const a = ACCENT_PILLAR[pillar.accent];
                const Icon = pillar.icon;
                return (
                  <article
                    key={pillar.title}
                    className={cn(
                      "relative overflow-hidden rounded-[1.75rem] border p-5",
                      a.border, a.bg
                    )}
                  >
                    <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b", a.glow)} />
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={cn("flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border", a.icon)}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-50">{pillar.title}</p>
                          <p className="text-xs text-slate-400">{pillar.tagline}</p>
                        </div>
                      </div>
                      <ul className="space-y-1.5">
                        {pillar.points.map((pt) => (
                          <li key={pt} className="flex items-start gap-2 text-xs leading-5 text-slate-300">
                            <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-slate-500" />
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* ── Filters + sort ────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={cn(
                "rounded-2xl border px-3.5 py-1.5 text-sm font-medium transition-colors",
                activeCategory === key
                  ? "border-violet-400/50 bg-violet-400/10 text-violet-100"
                  : "border-slate-700 bg-slate-900/60 text-slate-400 hover:border-slate-500 hover:text-slate-200"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {(["votes", "newest"] as SortKey[]).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={cn(
                "rounded-2xl border px-3 py-1.5 text-xs font-medium transition-colors",
                sort === s
                  ? "border-slate-500 text-slate-200"
                  : "border-slate-700 text-slate-500 hover:text-slate-300"
              )}
            >
              {s === "votes" ? "Most voted" : "Newest"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Proposal grid ─────────────────────────────────────────────────── */}
      <div className="grid gap-4 xl:grid-cols-2">
        {filtered.map((proposal) => {
          const cat = CATEGORY_META[proposal.category];
          return (
            <article
              key={proposal.id}
              className="flex flex-col rounded-[1.75rem] border border-slate-800 bg-panel/90 p-5 shadow-[0_18px_50px_rgba(2,8,23,0.18)] sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", cat.border, cat.bg, cat.color)}>
                  {cat.label}
                </span>
                {!proposal.isSeeded && (
                  <span className="rounded-full border border-slate-600 bg-slate-800/60 px-2.5 py-0.5 text-xs text-slate-400">
                    Community
                  </span>
                )}
              </div>

              <h2 className="mt-3 text-base font-semibold leading-6 text-slate-50">{proposal.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-400 line-clamp-3">{proposal.description}</p>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-sm">
                    <ThumbsUp className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="font-semibold text-slate-200">
                      {proposal.netScore > 0 ? `+${proposal.netScore}` : proposal.netScore}
                    </span>
                  </div>
                  <span className="text-xs text-slate-600">
                    {(proposal.seedUpvotes + proposal.seedDownvotes).toLocaleString()} votes
                  </span>
                </div>
                <Button asChild variant="outline" size="sm" className="rounded-2xl gap-1.5">
                  <Link href={`/governance/${proposal.id}`}>
                    Read & vote <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>

              {proposal.moduleSlug && (
                <div className="mt-3 border-t border-slate-800 pt-3">
                  <Link
                    href={`/learn/${proposal.moduleSlug}`}
                    className="text-xs text-slate-500 hover:text-cyan-300 transition-colors"
                  >
                    Module: {proposal.moduleTitle}
                  </Link>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-slate-500">No proposals in this category yet.</p>
      )}
    </div>
  );
}