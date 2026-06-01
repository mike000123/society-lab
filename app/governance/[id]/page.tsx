"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ThumbsUp, ThumbsDown, BookOpen, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CATEGORY_META,
  getProposalById,
  type Proposal,
} from "@/lib/governance/proposals";
import { useVotes, useSubmissions } from "@/lib/governance/votes";

export default function ProposalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { castVote, getVote, getLocalDelta } = useVotes();
  const { submissions } = useSubmissions();
  const [proposal, setProposal] = useState<Proposal | null>(null);

  useEffect(() => {
    setProposal(getProposalById(id, submissions));
  }, [id, submissions]);

  if (!proposal) {
    return (
      <div className="mx-auto max-w-3xl py-16 text-center">
        <p className="text-slate-400">Proposal not found.</p>
        <Link href="/governance" className="mt-4 inline-block text-sm text-cyan-400 hover:underline">
          Back to governance
        </Link>
      </div>
    );
  }

  const cat = CATEGORY_META[proposal.category];
  const userVote = getVote(proposal.id);
  const delta = getLocalDelta(proposal.id);
  const netScore = proposal.seedUpvotes - proposal.seedDownvotes + delta;
  const totalVotes = proposal.seedUpvotes + proposal.seedDownvotes;
  const pct = totalVotes === 0 ? 50 : Math.round((proposal.seedUpvotes / totalVotes) * 100);

  return (
    <div className="mx-auto max-w-3xl space-y-5 pb-10">
      {/* Back nav */}
      <Link
        href="/governance"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All proposals
      </Link>

      {/* Header card */}
      <article className="rounded-[2rem] border border-slate-800 bg-slate-950/85 p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", cat.border, cat.bg, cat.color)}>
            {cat.label}
          </span>
          {!proposal.isSeeded && (
            <span className="rounded-full border border-slate-600 bg-slate-800/60 px-2.5 py-0.5 text-xs text-slate-400">
              Community submission
            </span>
          )}
        </div>

        <h1 className="text-2xl font-black leading-8 text-slate-50 sm:text-3xl">{proposal.title}</h1>

        <p className="text-sm leading-6 text-slate-300">
          Proposed by <span className="text-slate-200 font-medium">{proposal.authorName}</span>
          {" · "}
          {new Date(proposal.createdAt).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        {/* Vote widget */}
        <div className="rounded-[1.5rem] border border-slate-700 bg-slate-900/80 p-5 space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Net score</p>
              <p className={cn("mt-1 text-3xl font-black", netScore >= 0 ? "text-emerald-300" : "text-rose-300")}>
                {netScore > 0 ? `+${netScore}` : netScore}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">{totalVotes.toLocaleString()} total votes</p>
            </div>

            {/* Approval bar */}
            <div className="flex-1 min-w-[180px] space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500">
                <span className="text-emerald-400">{pct}% support</span>
                <span className="text-rose-400">{100 - pct}% oppose</span>
              </div>
              <div className="h-2 w-full rounded-full bg-rose-400/30 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Vote buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => castVote(proposal.id, 1)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-2xl border py-3 text-sm font-medium transition-colors",
                userVote === 1
                  ? "border-emerald-500 bg-emerald-500/15 text-emerald-200"
                  : "border-slate-700 bg-slate-900/60 text-slate-400 hover:border-emerald-600 hover:text-emerald-300"
              )}
            >
              <ThumbsUp className="h-4 w-4" />
              {userVote === 1 ? "You support this" : "Support"}
            </button>
            <button
              onClick={() => castVote(proposal.id, -1)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-2xl border py-3 text-sm font-medium transition-colors",
                userVote === -1
                  ? "border-rose-500 bg-rose-500/15 text-rose-200"
                  : "border-slate-700 bg-slate-900/60 text-slate-400 hover:border-rose-600 hover:text-rose-300"
              )}
            >
              <ThumbsDown className="h-4 w-4" />
              {userVote === -1 ? "You oppose this" : "Oppose"}
            </button>
          </div>
          <p className="text-xs text-slate-600 text-center">
            Your vote is stored locally in this browser.
          </p>
        </div>
      </article>

      {/* Description */}
      <section className="rounded-[1.75rem] border border-slate-800 bg-panel/90 p-5 sm:p-6 space-y-3">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Summary</p>
        <p className="text-base leading-7 text-slate-200">{proposal.description}</p>
      </section>

      {/* Rationale */}
      <section className="rounded-[1.75rem] border border-slate-800 bg-panel/90 p-5 sm:p-6 space-y-3">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Rationale</p>
        <p className="text-sm leading-7 text-slate-300 whitespace-pre-line">{proposal.rationale}</p>
      </section>

      {/* Related module */}
      {proposal.moduleSlug && (
        <section className="rounded-[1.75rem] border border-slate-800 bg-panel/90 p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">This proposal addresses</p>
          <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-cyan-300" />
              <span className="text-sm font-medium text-slate-200">{proposal.moduleTitle}</span>
            </div>
            <Button asChild variant="outline" size="sm" className="rounded-2xl gap-1.5">
              <Link href={`/learn/${proposal.moduleSlug}`}>
                Open module <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline" className="rounded-2xl gap-2">
          <Link href="/governance">
            <ArrowLeft className="h-4 w-4" /> All proposals
          </Link>
        </Button>
        <Button asChild className="rounded-2xl gap-2">
          <Link href="/governance/submit">
            Submit your own proposal <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
