"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight, BookOpenText, ChevronDown, ChevronUp,
  FlaskConical, MessageSquare,
} from "lucide-react";
import { TrackSection } from "@/components/learn/TrackSection";
import { DevModeToggle } from "@/components/learn/DevModeToggle";
import { ProgressBanner } from "@/components/learn/ProgressBanner";
import { foundationalReferences, learningModules } from "@/lib/learn/modules";
import { LEARNING_TRACKS } from "@/lib/tracks/config";

const moduleCount = learningModules.length;
const trackCount = LEARNING_TRACKS.filter((t) => t.moduleSlugs.length > 0).length;

function FlowStep({
  step, icon, title, desc, href, color,
}: {
  step: string; icon: React.ReactNode; title: string;
  desc: string; href: string; color: string;
}) {
  return (
    <Link
      href={href}
      className={`group flex flex-col gap-3 rounded-2xl border bg-slate-950/60 p-4 transition-colors hover:bg-slate-900/60 ${color}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900/80">
          {icon}
        </div>
        <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{step}</span>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-100">{title}</p>
        <p className="mt-0.5 text-xs leading-5 text-slate-400">{desc}</p>
      </div>
      <ArrowRight className="h-3.5 w-3.5 text-slate-600 transition-transform group-hover:translate-x-0.5 mt-auto" />
    </Link>
  );
}

export default function LearnPage() {
  const [refsOpen, setRefsOpen] = useState(false);

  return (
    <div className="mx-auto max-w-6xl space-y-10 pb-10">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/85 p-6 sm:p-10">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-cyan-400/12 via-cyan-400/4 to-transparent" />
        <div className="relative space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-100">
              Learning hub
            </span>
            <DevModeToggle />
          </div>

          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl leading-tight">
              Understand the systems that shape your world.
            </h1>
            <p className="text-base leading-8 text-slate-300 max-w-2xl">
              {moduleCount} modules across {trackCount} tracks. Each one explains a real system —
              where the hidden flaw is, how everyday life feels downstream, and what a redesigned
              version could look like. Complete each quiz to unlock the next module.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-8 pt-2 border-t border-slate-800">
            <div>
              <p className="text-3xl font-bold text-slate-50">{moduleCount}</p>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500 mt-0.5">Modules</p>
            </div>
            <div className="w-px h-10 bg-slate-800" />
            <div>
              <p className="text-3xl font-bold text-slate-50">{trackCount}</p>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500 mt-0.5">Tracks</p>
            </div>
            <div className="w-px h-10 bg-slate-800" />
            <Link
              href="/learn/why-gdp-is-not-the-same-as-wellbeing"
              className="group flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-slate-100 transition-colors"
            >
              <span className="text-[11px] uppercase tracking-widest text-slate-500 mr-1">Start here</span>
              Why GDP is not the same as wellbeing
              <ArrowRight className="h-3.5 w-3.5 text-slate-500 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Learn -> Simulate -> Discuss flow */}
          <div className="grid grid-cols-3 gap-3 max-w-xl">
            <FlowStep
              step="1 · Learn"
              icon={<BookOpenText className="h-4 w-4 text-cyan-300" />}
              title="Read the module"
              desc="Theory, loops, examples"
              href="/learn"
              color="border-cyan-800/40"
            />
            <FlowStep
              step="2 · Simulate"
              icon={<FlaskConical className="h-4 w-4 text-amber-300" />}
              title="Run the model"
              desc="Change the variables"
              href="/simulator"
              color="border-amber-800/40"
            />
            <FlowStep
              step="3 · Discuss"
              icon={<MessageSquare className="h-4 w-4 text-violet-300" />}
              title="Test your thinking"
              desc="Debate with others"
              href="/discussions"
              color="border-violet-800/40"
            />
          </div>
        </div>
      </section>

      {/* Progress */}
      <ProgressBanner />

      {/* Tracks */}
      <section className="space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500 mb-1">Learning tracks</p>
          <h2 className="text-2xl font-bold text-slate-50">Follow a track or explore freely</h2>
          <p className="mt-1 text-sm text-slate-400 leading-6">
            Each track is a structured path through a domain. Quizzes gate the next module.
          </p>
        </div>
        <div className="space-y-5">
          {LEARNING_TRACKS.map((track) => (
            <TrackSection key={track.id} track={track} modules={learningModules} />
          ))}
        </div>
      </section>

      {/* Foundations */}
      <section className="rounded-[2rem] border border-slate-800 bg-slate-950/70 overflow-hidden">
        <button
          className="w-full flex items-center justify-between gap-3 px-6 py-5 text-left hover:bg-slate-900/40 transition-colors"
          onClick={() => setRefsOpen((v) => !v)}
        >
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Intellectual foundations</p>
            <h2 className="mt-0.5 text-lg font-bold text-slate-50">What this platform is built on</h2>
          </div>
          {refsOpen
            ? <ChevronUp className="h-5 w-5 text-slate-500 flex-shrink-0" />
            : <ChevronDown className="h-5 w-5 text-slate-500 flex-shrink-0" />
          }
        </button>

        {refsOpen && (
          <div className="border-t border-slate-800 px-6 pb-8 pt-6">
            <p className="max-w-3xl text-sm leading-7 text-slate-400 mb-6">
              Every module is grounded in systems thinking, not hot takes. The intellectual backbone:
              World3, Meadows, causal loops, and political-economy lenses that explain why systems
              drift before they break.
            </p>
            <div className="grid gap-4 xl:grid-cols-2">
              {foundationalReferences.map((reference) => (
                <article
                  className="rounded-[1.75rem] border border-slate-800 bg-panel/90 p-5"
                  key={reference.title}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-base font-semibold text-slate-50">{reference.title}</h3>
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                        reference.status === "Active lens"
                          ? "border-cyan-300/25 bg-cyan-400/10 text-cyan-100"
                          : "border-amber-300/25 bg-amber-400/10 text-amber-100"
                      }`}
                    >
                      {reference.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-300">{reference.summary}</p>
                  <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Why it matters here</p>
                    <p className="mt-1 text-xs leading-5 text-slate-200">{reference.focus}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
