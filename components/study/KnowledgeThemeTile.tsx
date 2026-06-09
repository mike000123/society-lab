"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenText, Database, Globe2, Landmark, Leaf, MessageSquare, Monitor, type LucideIcon } from "lucide-react";

import type { StudyAccent, StudyCategory } from "@/lib/study/catalog";
import { cn } from "@/lib/utils";

const ACCENT_STYLES: Record<
  StudyAccent,
  {
    badge: string;
    ring: string;
    tint: string;
  }
> = {
  amber: {
    badge: "text-amber-700",
    ring: "border-amber-200",
    tint: "from-amber-50/95 via-white/88 to-white/92",
  },
  cyan: {
    badge: "text-cyan-700",
    ring: "border-cyan-200",
    tint: "from-cyan-50/95 via-white/88 to-white/92",
  },
  emerald: {
    badge: "text-emerald-700",
    ring: "border-emerald-200",
    tint: "from-emerald-50/95 via-white/88 to-white/92",
  },
  rose: {
    badge: "text-rose-700",
    ring: "border-rose-200",
    tint: "from-rose-50/95 via-white/88 to-white/92",
  },
};

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "cities-housing": Landmark,
  "corruption-development": Database,
  "data-research": Database,
  "democracy-governance": Landmark,
  "ecology-climate": Leaf,
  "media-surveillance": Monitor,
  "money-banking": BookOpenText,
  "owid-shortlist": Globe2,
  "political-economy": Landmark,
  "systems-thinking": BookOpenText,
};

export function KnowledgeThemeTile({
  category,
  discussionHref,
  imageSrc,
  isSelected,
  onOpenTopic,
}: {
  category: StudyCategory;
  discussionHref: string;
  imageSrc: string;
  isSelected: boolean;
  onOpenTopic: () => void;
}) {
  const Icon = CATEGORY_ICONS[category.id] ?? BookOpenText;
  const accent = ACCENT_STYLES[category.accent];

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[1.55rem] border bg-white shadow-[0_18px_40px_rgba(28,36,48,0.05)] transition-all",
        isSelected
          ? "border-primary shadow-[0_20px_44px_rgba(59,130,246,0.12)]"
          : "border-[rgba(28,36,48,0.08)] hover:border-[rgba(28,36,48,0.16)] hover:shadow-[0_20px_42px_rgba(28,36,48,0.08)]",
      )}
    >
      <div className="absolute inset-0">
        <Image
          alt={category.title}
          className="object-cover object-center"
          fill
          sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, 100vw"
          src={imageSrc}
        />
        <div className={cn("absolute inset-0 bg-gradient-to-br", accent.tint)} />
      </div>

      <div className="relative z-10 flex h-full flex-col px-5 py-5">
        <div className="flex items-start justify-between gap-3">
          <div className={cn("flex h-11 w-11 items-center justify-center rounded-full border bg-white/94", accent.ring, accent.badge)}>
            <Icon className="h-5 w-5" />
          </div>
          <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-white/92 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
            {category.items.length} resources
          </span>
        </div>

        <div className="mt-4 flex-1 space-y-3">
          <h3 className="text-[1.05rem] font-semibold leading-6 text-slate-900">{category.title}</h3>
          <p className="text-sm leading-6 text-slate-600">{category.description}</p>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            onClick={onOpenTopic}
            type="button"
          >
            Open topic
            <ArrowRight className="h-4 w-4" />
          </button>
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white/94 px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
            href={discussionHref}
          >
            Discuss
            <MessageSquare className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
