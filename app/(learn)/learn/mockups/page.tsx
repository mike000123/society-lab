import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";

import { AtlasPage } from "@/components/atlas/AtlasPage";
import { LessonMockupCard } from "@/components/learn/LessonMockupCard";
import { getLessonHeroImage } from "@/lib/learn/hero-art";
import { groupModulesByVariant } from "@/lib/learn/lesson-variants";
import { learningModules } from "@/lib/learn/modules";
import { LEARNING_TRACKS } from "@/lib/tracks/config";

export const metadata: Metadata = {
  description: "Preview the visual mockup direction for every Society Lab learn module.",
  title: "Learn Module Mockups | Society Lab",
};

export default function LearnMockupsPage() {
  const grouped = groupModulesByVariant(learningModules);

  return (
    <AtlasPage className="!max-w-[118rem] pb-20">
      <div className="space-y-10">
        <section className="overflow-hidden rounded-[2.6rem] border border-[rgba(28,36,48,0.08)] bg-white shadow-[0_24px_56px_rgba(28,36,48,0.05)]">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="space-y-5 px-6 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
              <span className="inline-flex rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.84)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Learn design preview
              </span>
              <div className="space-y-3">
                <h1 className="atlas-display max-w-[38rem] text-[2.8rem] leading-[0.94] text-slate-900 sm:text-[3.6rem]">
                  Visual mockups for every Learn module.
                </h1>
                <p className="atlas-copy max-w-[38rem] text-[1.02rem] leading-8 text-slate-700">
                  This gallery shows each lesson assigned to the variant that fits it best, using the real Society Lab
                  module content and the current shared lesson architecture.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.35rem] bg-[rgba(246,244,238,0.72)] px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Modules</p>
                  <p className="mt-2 atlas-display text-[2rem] leading-none text-slate-900">{learningModules.length}</p>
                </div>
                <div className="rounded-[1.35rem] bg-[rgba(246,244,238,0.72)] px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Tracks</p>
                  <p className="mt-2 atlas-display text-[2rem] leading-none text-slate-900">{LEARNING_TRACKS.length}</p>
                </div>
                <div className="rounded-[1.35rem] bg-[rgba(246,244,238,0.72)] px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Variants</p>
                  <p className="mt-2 atlas-display text-[2rem] leading-none text-slate-900">{grouped.length}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  className="inline-flex items-center gap-2 rounded-full bg-[rgb(var(--atlas-primary))] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  href="/learn"
                >
                  Open Learn
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white/88 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
                  href={`/learn/mockups/${learningModules[0]?.slug}`}
                >
                  <Eye className="h-4 w-4" />
                  Open first mockup
                </Link>
              </div>
            </div>

            <div className="grid gap-px border-t border-[rgba(28,36,48,0.08)] bg-[rgba(28,36,48,0.08)] lg:border-l lg:border-t-0">
              {grouped.map((group) => (
                <div className="bg-white/94 px-5 py-5" key={group.variant}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-base font-semibold text-slate-900">{group.meta.label}</p>
                      <p className="mt-1 text-sm leading-7 text-slate-600">{group.meta.summary}</p>
                    </div>
                    <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.84)] px-3 py-1 text-xs font-semibold text-slate-500">
                      {group.modules.length}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="space-y-10">
          {grouped.map((group) => (
            <section className="space-y-5" id={group.variant} key={group.variant}>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="atlas-display text-[2.2rem] leading-tight text-slate-900">{group.meta.label}</h2>
                  <p className="mt-2 max-w-[44rem] text-sm leading-7 text-slate-600">{group.meta.visualFocus}</p>
                </div>
                <span className="text-sm font-medium text-slate-400">{group.modules.length} modules</span>
              </div>

              <div className="grid gap-5">
                {group.modules.map((module) => {
                  const track = LEARNING_TRACKS.find((candidate) => candidate.moduleSlugs.includes(module.slug));
                  return (
                    <LessonMockupCard
                      heroImageSrc={getLessonHeroImage(module.slug, track?.id)}
                      key={module.slug}
                      module={module}
                      variant={group.variant}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </AtlasPage>
  );
}
