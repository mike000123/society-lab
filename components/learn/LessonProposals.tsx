import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleDashed, FlaskConical, Scale } from "lucide-react";

import type { ModuleProposal, ProposalActor, ProposalDomain, ProposalFeasibility, ResolvedLearningModule } from "@/lib/learn/modules";
import { cn } from "@/lib/utils";

// ── Label maps ────────────────────────────────────────────────────────────────

const ACTOR_LABEL: Record<ProposalActor, string> = {
  individual:     "Individual",
  community:      "Community",
  civil_society:  "Civil society",
  local_gov:      "Local government",
  national_gov:   "National government",
  private_sector: "Private sector",
  international:  "International",
};

const DOMAIN_LABEL: Record<ProposalDomain, string> = {
  economic:    "Economic",
  political:   "Political",
  media:       "Media",
  legal:       "Legal",
  social:      "Social",
  environmental: "Environmental",
};

const FEASIBILITY_CONFIG: Record<
  ProposalFeasibility,
  { label: string; icon: React.ElementType; classes: string }
> = {
  proven:       { label: "Proven",       icon: CheckCircle2,  classes: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  emerging:     { label: "Emerging",     icon: FlaskConical,  classes: "border-cyan-200 bg-cyan-50 text-cyan-700" },
  contested:    { label: "Contested",    icon: Scale,         classes: "border-amber-200 bg-amber-50 text-amber-700" },
  long_horizon: { label: "Long horizon", icon: CircleDashed,  classes: "border-slate-200 bg-slate-50 text-slate-500" },
};

// ── Sub-components ─────────────────────────────────────────────────────────────

function FeasibilityBadge({ feasibility }: { feasibility: ProposalFeasibility }) {
  const cfg = FEASIBILITY_CONFIG[feasibility];
  const Icon = cfg.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", cfg.classes)}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}

function ProposalCard({ proposal }: { proposal: ModuleProposal }) {
  return (
    <div className="rounded-[1.35rem] border border-[rgba(28,36,48,0.08)] bg-white p-5 shadow-[0_2px_8px_rgba(28,36,48,0.06)]">
      <div className="flex flex-wrap items-start gap-2">
        <FeasibilityBadge feasibility={proposal.feasibility} />
        <span className="rounded-full border border-[rgba(28,36,48,0.10)] bg-[rgba(28,36,48,0.04)] px-2.5 py-0.5 text-[11px] font-semibold text-slate-500">
          {ACTOR_LABEL[proposal.actor]}
        </span>
        <span className="rounded-full border border-[rgba(28,36,48,0.10)] bg-[rgba(28,36,48,0.04)] px-2.5 py-0.5 text-[11px] font-semibold text-slate-500">
          {DOMAIN_LABEL[proposal.domain]}
        </span>
      </div>

      <h4 className="mt-3 text-sm font-semibold leading-5 text-slate-900">{proposal.title}</h4>
      <p className="mt-1.5 text-sm leading-6 text-slate-600">{proposal.summary}</p>

      {proposal.precedents && proposal.precedents.length > 0 ? (
        <div className="mt-4 space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Where it has worked</p>
          {proposal.precedents.map((p, i) => (
            <div key={i} className="rounded-xl border border-[rgba(28,36,48,0.07)] bg-[rgba(246,244,238,0.55)] px-3 py-2.5">
              <p className="text-xs font-semibold text-slate-700">
                {p.place}
                <span className="ml-1.5 font-normal text-slate-400">{p.year}</span>
              </p>
              <p className="mt-0.5 text-xs leading-5 text-slate-500">{p.outcome}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────

export function LessonProposals({ module }: { module: ResolvedLearningModule }) {
  if (!module.proposals || module.proposals.length === 0) return null;

  const governanceHref = `/governance/submit?module=${module.slug}`;

  return (
    <section className="space-y-5" id="what-could-change">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="atlas-kicker">What could change this?</p>
          <h3 className="mt-1 text-xl font-bold text-slate-900">
            Proven and emerging reforms
          </h3>
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-600">
            Each proposal below addresses a root cause identified in this module and has at least one documented precedent.
          </p>
        </div>
        <Link
          className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(28,36,48,0.12)] bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_2px_8px_rgba(28,36,48,0.06)] transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
          href={governanceHref}
        >
          Add your proposal
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {module.proposals.map((proposal, i) => (
          <ProposalCard key={i} proposal={proposal} />
        ))}
      </div>

      {/* Capstone nudge — don't show on the capstone itself */}
      {module.slug !== "pathways-to-change" ? (
        <div className="rounded-[1.5rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white px-5 py-4">
          <p className="text-sm font-semibold text-emerald-900">
            Want the full picture?
          </p>
          <p className="mt-0.5 text-sm leading-6 text-slate-600">
            The{" "}
            <Link className="font-semibold text-emerald-700 underline decoration-emerald-200 hover:text-emerald-900" href="/learn/pathways-to-change">
              Pathways to Change
            </Link>{" "}
            module brings together proposals from across all modules into a single framework for how structural reform actually happens.
          </p>
        </div>
      ) : null}    </section>
  );
}

