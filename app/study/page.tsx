import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, LibraryBig, Sparkles } from "lucide-react";

import { StudyLibrary } from "@/components/study/StudyLibrary";
import { Button } from "@/components/ui/button";
import { STUDY_CATEGORIES, STUDY_RESOURCES } from "@/lib/study/catalog";

export const metadata: Metadata = {
  title: "Study | Society Lab",
  description:
    "A curated study library for systems thinking, political economy, ecology, governance, corruption, media power, and civic redesign.",
};

const resourceCount = STUDY_RESOURCES.length;
const categoryCount = STUDY_CATEGORIES.length;
const freeCount = STUDY_RESOURCES.filter((resource) => resource.access === "Free").length;
const sourceCount = new Set(STUDY_RESOURCES.map((resource) => resource.source)).size;

export default function StudyPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-10">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/85 p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-emerald-400/18 via-cyan-400/8 to-transparent" />
        <div className="relative grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5">
            <span className="inline-flex rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-100">
              Study library
            </span>
            <div>
              <h1 className="max-w-4xl text-3xl font-black tracking-tight text-slate-50 sm:text-5xl">
                Curated material for going deeper after the module ends.
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
                This tab collects books, papers, datasets, reports, websites, tools, podcasts, and channels across
                the themes Society Lab already covers. It is meant to turn curiosity into a study path.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-4">
              <div className="rounded-[1.5rem] border border-slate-800 bg-panel/85 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Resources</p>
                <p className="mt-2 text-3xl font-black text-slate-50">{resourceCount}</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-800 bg-panel/85 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Topics</p>
                <p className="mt-2 text-3xl font-black text-slate-50">{categoryCount}</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-800 bg-panel/85 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Free picks</p>
                <p className="mt-2 text-3xl font-black text-slate-50">{freeCount}</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-800 bg-panel/85 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Sources</p>
                <p className="mt-2 text-3xl font-black text-slate-50">{sourceCount}</p>
              </div>
            </div>
          </div>

          <article className="rounded-[1.75rem] border border-slate-800 bg-panel/90 p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <LibraryBig className="h-5 w-5 text-emerald-300" />
              <p className="font-semibold text-slate-50">How to use this tab</p>
            </div>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-4">
                <p className="text-sm font-semibold text-slate-100">Start broad, then deepen</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Use starter explainers and channels to get oriented, then move into papers, books, and datasets once
                  the frame is clear.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-4">
                <p className="text-sm font-semibold text-slate-100">Mix formats on purpose</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Pair one readable source with one primary-source institution or dataset so the learning loop stays
                  both accessible and grounded.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-4">
                <p className="text-sm font-semibold text-slate-100">Follow the same themes as Learn</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  The categories mirror the site: systems, economy, ecology, democracy, corruption, media power, and
                  everyday urban life.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild className="rounded-2xl">
                <Link href="/learn">
                  Open learn modules
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild className="rounded-2xl" variant="outline">
                <Link href="/governance">
                  Explore governance
                  <Compass className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </article>
        </div>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-3 rounded-[1.75rem] border border-slate-800 bg-panel/80 px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Curation note</p>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">
            The list prioritizes high-signal starting points: official institutions, respected research hubs, useful
            public datasets, and a smaller set of books or channels that make complex topics easier to enter.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-100">
          <Sparkles className="h-4 w-4" />
          Built for guided self-study
        </div>
      </section>

      <StudyLibrary />
    </div>
  );
}
