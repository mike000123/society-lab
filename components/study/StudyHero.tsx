"use client";

import { ArrowRight, BookOpenText, Compass } from "lucide-react";

import { IllustratedTabHero } from "@/components/atlas/IllustratedTabHero";

export function StudyHero({
  onBrowseJourneys,
  onExploreThemes,
  pathCount,
  resourceCount,
  themeCount,
}: {
  onBrowseJourneys: () => void;
  onExploreThemes: () => void;
  pathCount: number;
  resourceCount: number;
  themeCount: number;
}) {
  return (
    <IllustratedTabHero
      actions={
        <>
          <button
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(59,130,246,0.18)] transition hover:bg-blue-500"
            onClick={onBrowseJourneys}
            type="button"
          >
            Browse journeys
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
            onClick={onExploreThemes}
            type="button"
          >
            Explore themes
            <Compass className="h-4 w-4" />
          </button>
        </>
      }
      description="Explore the books, papers, datasets, tools, and public knowledge projects that shaped how we understand society."
      eyebrow="Study"
      imageAlt="An open atlas-like book turning into a city, civic institutions, and ecological systems."
      imageSrc="/atlas/study-hero.png"
      title="Go beyond explanations."
    >
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            icon: BookOpenText,
            label: "Study journeys",
            value: `${pathCount}`,
          },
          {
            icon: Compass,
            label: "Knowledge themes",
            value: `${themeCount}`,
          },
          {
            icon: ArrowRight,
            label: "Resources on the shelf",
            value: `${resourceCount}`,
          },
        ].map(({ icon: Icon, label, value }) => (
          <div
            className="rounded-[1.3rem] border border-[rgba(28,36,48,0.08)] bg-white/90 px-4 py-4 shadow-[0_12px_28px_rgba(28,36,48,0.035)]"
            key={label}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.9)] text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
                <p className="mt-1 text-xl font-semibold text-slate-900">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </IllustratedTabHero>
  );
}
