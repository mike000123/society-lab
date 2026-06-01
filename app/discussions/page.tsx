"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpenText, MessageSquare, Sparkles, Users } from "lucide-react";
import { DiscussionThread } from "@/components/discussion/discussion-thread";
import { AgentPanel } from "@/components/discussion/AgentPanel";

const DEMO_TOPIC = "How do financial, political, and social systems create and sustain inequality — and what leverage points exist for change?";

const RELATED_MODULES = [
  {
    slug: "why-gdp-is-not-the-same-as-wellbeing",
    title: "Why GDP does not equal Wellbeing",
    tag: "Economics",
    color: "border-cyan-800/40 hover:border-cyan-600/50",
  },
  {
    slug: "how-inequality-compounds",
    title: "How Inequality Compounds",
    tag: "Inequality",
    color: "border-violet-800/40 hover:border-violet-600/50",
  },
  {
    slug: "the-democracy-deficit",
    title: "The Democracy Deficit",
    tag: "Governance",
    color: "border-amber-800/40 hover:border-amber-600/50",
  },
];

export default function DiscussionsPage() {
  const [recentPosts] = useState<{ kind: string; content: string; author: string }[]>([]);

  return (
    <div className="mx-auto max-w-4xl space-y-10 pb-12">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/85 p-6 sm:p-10">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-violet-400/12 via-violet-400/4 to-transparent" />
        <div className="relative space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <span className="inline-flex rounded-full border border-violet-300/25 bg-violet-400/10 px-3 py-1 text-xs font-medium text-violet-100">
              Structured discussion
            </span>
            <div className="flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1">
              <Users className="h-3 w-3 text-slate-400" />
              <span className="text-xs text-slate-400">Open to all</span>
            </div>
          </div>

          <div className="max-w-2xl space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl leading-tight">
              Test your thinking against others.
            </h1>
            <p className="text-base leading-8 text-slate-300">
              Not a comments section. Each post plays a role — claim, evidence, counterpoint, or
              proposal. The goal is collective clarity, not winning arguments.
            </p>
          </div>

          {/* How it works */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 max-w-xl">
            {[
              { step: "1", label: "Make a claim", desc: "State a position clearly", icon: <MessageSquare className="h-3.5 w-3.5 text-violet-300" /> },
              { step: "2", label: "Add evidence", desc: "Link to modules or sources", icon: <BookOpenText className="h-3.5 w-3.5 text-cyan-300" /> },
              { step: "3", label: "Steel-man it", desc: "Engage the strongest counter", icon: <Sparkles className="h-3.5 w-3.5 text-amber-300" /> },
            ].map(({ step, label, desc, icon }) => (
              <div key={step} className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-800/80">
                    {icon}
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Step {step}</span>
                </div>
                <p className="text-xs font-semibold text-slate-200">{label}</p>
                <p className="text-[11px] leading-4 text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related modules */}
      <section className="space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Prepare your thinking</p>
          <p className="mt-1 text-sm text-slate-400">Read these modules before you debate.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {RELATED_MODULES.map((mod) => (
            <Link
              key={mod.slug}
              href={`/learn/${mod.slug}`}
              className={`group flex items-center justify-between gap-3 rounded-2xl border bg-slate-950/60 p-4 transition-colors hover:bg-slate-900/60 ${mod.color}`}
            >
              <div>
                <span className="inline-flex rounded-full border border-slate-700 bg-slate-800/60 px-2 py-0.5 text-[10px] text-slate-400">
                  {mod.tag}
                </span>
                <p className="mt-1.5 text-xs font-semibold text-slate-200">{mod.title}</p>
              </div>
              <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-slate-600 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>

      {/* Thread */}
      <DiscussionThread />

      {/* AI Agents */}
      <AgentPanel topic={DEMO_TOPIC} recentPosts={recentPosts} />
    </div>
  );
}
