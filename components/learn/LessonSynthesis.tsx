import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, CircleDashed, FlaskConical, Scale } from "lucide-react";

import { learningModules } from "@/lib/learn/modules";
import type {
  ModuleProposal,
  ProposalActor,
  ProposalDomain,
  ProposalFeasibility,
  ResolvedLearningModule,
} from "@/lib/learn/modules";
import { cn } from "@/lib/utils";

// ── Label maps ────────────────────────────────────────────────────────────────

const ACTOR_LABEL: Record<ProposalActor, string> = {
  individual: "Individual",
  community: "Community",
  civil_society: "Civil society",
  local_gov: "Local government",
  national_gov: "National government",
  private_sector: "Private sector",
  international: "International",
};

const DOMAIN_LABEL: Record<ProposalDomain, string> = {
  economic: "Economic",
  political: "Political",
  media: "Media",
  legal: "Legal",
  social: "Social",
  environmental: "Environmental",
};

const DOMAIN_ORDER: ProposalDomain[] = [
  "economic",
  "political",
  "legal",
  "environmental",
  "social",
  "media",
];

const FEASIBILITY_CONFIG: Record<
  ProposalFeasibility,
  { label: string; icon: React.ElementType; classes: string; dotClass: string }
> = {
  proven: {
    label: "Proven",
    icon: CheckCircle2,
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
  },
  emerging: {
    label: "Emerging",
    icon: FlaskConical,
    classes: "bg-cyan-50 text-cyan-700 border-cyan-200",
    dotClass: "bg-cyan-500",
  },
  contested: {
    label: "Contested",
    icon: Scale,
    classes: "bg-amber-50 text-amber-700 border-amber-200",
    dotClass: "bg-amber-500",
  },
  long_horizon: {
    label: "Long horizon",
    icon: CircleDashed,
    classes: "bg-slate-100 text-slate-600 border-slate-200",
    dotClass: "bg-slate-400",
  },
};

const FEASIBILITY_ORDER: ProposalFeasibility[] = ["proven", "emerging", "contested", "long_horizon"];

// ── Sub-components ─────────────────────────────────────────────────────────────

function FeasibilityBadge({ feasibility }: { feasibility: ProposalFeasibility }) {
  const cfg = FEASIBILITY_CONFIG[feasibility];
  const Icon = cfg.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold",
        cfg.classes,
      )}
    >
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}

type SourcedProposal = ModuleProposal & { sourceSlug: string; sourceTitle: string };

function ProposalRow({ proposal }: { proposal: SourcedProposal }) {
  return (
    <div className="rounded-[1.25rem] border border-[rgba(28,36,48,0.08)] bg-white px-5 py-4 shadow-[0_1px_4px_rgba(28,36,48,0.05)]">
      <div className="flex flex-wrap items-center gap-2">
        <FeasibilityBadge feasibility={proposal.feasibility} />
        <span className="rounded-full border border-[rgba(28,36,48,0.10)] bg-[rgba(246,244,238,0.8)] px-2 py-0.5 text-[11px] font-medium text-slate-600">
          {ACTOR_LABEL[proposal.actor]}
        </span>
        <Link
          className="inline-flex items-center gap-1 rounded-full border border-[rgba(28,36,48,0.10)] bg-[rgba(246,244,238,0.8)] px-2 py-0.5 text-[11px] font-medium text-slate-500 transition hover:text-slate-800"
          href={`/learn/${proposal.sourceSlug}`}
        >
          <BookOpen className="h-3 w-3" />
          {proposal.sourceTitle}
        </Link>
      </div>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-900">{proposal.title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">{proposal.summary}</p>
      {proposal.precedents && proposal.precedents.length > 0 ? (
        <ul className="mt-3 space-y-1">
          {proposal.precedents.map((p) => (
            <li
              className="flex items-baseline gap-2 text-xs text-slate-500"
              key={`${p.place}-${p.year}`}
            >
              <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-slate-300" />
              <span>
                <span className="font-medium text-slate-700">{p.place}, {p.year}:</span>{" "}
                {p.outcome}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function FeasibilityLegend() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {FEASIBILITY_ORDER.map((f) => {
        const cfg = FEASIBILITY_CONFIG[f];
        return (
          <span key={f} className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className={cn("h-2 w-2 rounded-full", cfg.dotClass)} />
            {cfg.label}
          </span>
        );
      })}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function LessonSynthesis({ module }: { module: ResolvedLearningModule }) {
  if (!module.synthesisOf || module.synthesisOf.length === 0) return null;

  // Collect all proposals from source modules, annotated with source info
  const sourceModules = module.synthesisOf
    .map((slug) => learningModules.find((m) => m.slug === slug))
    .filter(Boolean) as ResolvedLearningModule[];

  const allProposals: SourcedProposal[] = sourceModules.flatMap((src) =>
    (src.proposals ?? []).map((p) => ({
      ...p,
      sourceSlug: src.slug,
      sourceTitle: src.title,
    })),
  );

  // Also include proposals defined directly on the synthesis module
  const ownProposals: SourcedProposal[] = (module.proposals ?? []).map((p) => ({
    ...p,
    sourceSlug: module.slug,
    sourceTitle: "This synthesis",
  }));

  // Group all proposals by domain
  const grouped = new Map<ProposalDomain, SourcedProposal[]>();
  for (const p of [...ownProposals, ...allProposals]) {
    const list = grouped.get(p.domain) ?? [];
    list.push(p);
    grouped.set(p.domain, list);
  }

  const domainCount = DOMAIN_ORDER.filter((d) => (grouped.get(d)?.length ?? 0) > 0).length;
  const totalProposals = [...grouped.values()].reduce((sum, arr) => sum + arr.length, 0);

  return (
    <section className="space-y-8" id="reform-proposals">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Reform synthesis
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              What could change this?
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              {totalProposals} proposals across {domainCount} domains — drawn from{" "}
              {sourceModules.length} modules in this track
            </p>
          </div>
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white/88 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
            href={`/governance/submit?module=${module.slug}`}
          >
            Add your proposal
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <FeasibilityLegend />
      </div>

      {/* Source modules */}
      <div className="rounded-[1.45rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.55)] px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Proposals drawn from
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {sourceModules.map((src) => (
            <Link
              className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(28,36,48,0.10)] bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-[rgba(28,36,48,0.20)] hover:text-slate-900"
              href={`/learn/${src.slug}`}
              key={src.slug}
            >
              <BookOpen className="h-3 w-3 text-slate-400" />
              {src.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Proposals by domain */}
      <div className="space-y-8">
        {DOMAIN_ORDER.map((domain) => {
          const proposals = grouped.get(domain);
          if (!proposals || proposals.length === 0) return null;
          return (
            <div key={domain} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-px flex-1 bg-[rgba(28,36,48,0.08)]" />
                <span className="rounded-full border border-[rgba(28,36,48,0.10)] bg-[rgba(246,244,238,0.8)] px-3 py-0.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {DOMAIN_LABEL[domain]}
                </span>
                <span className="h-px flex-1 bg-[rgba(28,36,48,0.08)]" />
              </div>
              <div className="space-y-3">
                {proposals.map((p, i) => (
                  <ProposalRow key={`${p.sourceSlug}-${i}`} proposal={p} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA to systems-change track */}
      <div className="rounded-[1.45rem] border border-[rgba(28,36,48,0.08)] bg-gradient-to-br from-[rgba(246,244,238,0.72)] to-white px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Next step
        </p>
        <p className="mt-1.5 text-sm font-semibold text-slate-900">
          How does reform actually happen?
        </p>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          The Systems Change track brings together the reform agendas from all four domains and asks
          what makes structural change durable — and how to create the conditions for it.
        </p>
        <Link
          className="mt-3 inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
          href="/learn?track=systems-change"
        >
          Explore Systems Change
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
