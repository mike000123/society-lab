import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";

import type { LessonVariant } from "@/lib/learn/lesson-variants";
import { LESSON_VARIANT_META } from "@/lib/learn/lesson-variants";
import type { ResolvedLearningModule } from "@/lib/learn/modules";

export function LessonMockupCard({
  heroImageSrc,
  module,
  variant,
}: {
  heroImageSrc: string;
  module: ResolvedLearningModule;
  variant: LessonVariant;
}) {
  const meta = LESSON_VARIANT_META[variant];

  return (
    <article className="overflow-hidden rounded-[1.8rem] border border-[rgba(28,36,48,0.08)] bg-white/88 shadow-[0_18px_40px_rgba(28,36,48,0.05)]">
      <div className="grid gap-0 lg:grid-cols-[13rem_minmax(0,1fr)]">
        <div className="relative min-h-[12rem] overflow-hidden bg-[rgba(246,244,238,0.8)]">
          <Image
            alt={module.title}
            className="object-cover"
            fill
            sizes="(min-width: 1024px) 208px, 100vw"
            src={heroImageSrc}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(255,255,255,0.1)] via-transparent to-transparent" />
        </div>

        <div className="space-y-4 px-5 py-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.84)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              {meta.shortLabel}
            </span>
            <span className="inline-flex rounded-full border border-[rgba(28,36,48,0.08)] bg-white/86 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              {module.eyebrow}
            </span>
            <span className="text-xs text-slate-400">{module.readingTime}</span>
          </div>

          <div className="space-y-2">
            <h3 className="atlas-display text-[2rem] leading-tight text-slate-900">{module.title}</h3>
            <p className="text-sm leading-7 text-slate-600">{module.summary}</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-[1.15rem] bg-[rgba(246,244,238,0.72)] px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Why this variant fits</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{meta.summary}</p>
            </div>
            <div className="rounded-[1.15rem] bg-[rgba(246,244,238,0.72)] px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Visual focus</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{meta.visualFocus}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              className="inline-flex items-center gap-2 rounded-full bg-[rgb(var(--atlas-primary))] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              href={`/learn/mockups/${module.slug}`}
            >
              <Eye className="h-4 w-4" />
              Open mockup
            </Link>
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white/88 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
              href={`/learn/${module.slug}`}
            >
              Open live lesson
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
