"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpenText, Database, ExternalLink, FileText, Globe2, GraduationCap, Hammer, Headphones, MessageSquare, MonitorPlay, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { type StudyAccent, type StudyFormat, type StudyResource } from "@/lib/study/catalog";
import { buildResourceDiscussionHref, isExternalStudyUrl } from "@/lib/study/discussions";
import { getStudyResourceArt } from "@/lib/study/resource-art";
import { cn } from "@/lib/utils";

const FORMAT_ICONS: Record<StudyFormat, LucideIcon> = {
  Article: FileText,
  Book: BookOpenText,
  Channel: MonitorPlay,
  Course: GraduationCap,
  Dataset: Database,
  Paper: FileText,
  Podcast: Headphones,
  Report: FileText,
  Tool: Hammer,
  Website: Globe2,
};

const ACCENT_STYLES: Record<
  StudyAccent,
  {
    badge: string;
    icon: string;
  }
> = {
  amber: {
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    icon: "border-amber-200 bg-amber-50 text-amber-700",
  },
  cyan: {
    badge: "border-cyan-200 bg-cyan-50 text-cyan-700",
    icon: "border-cyan-200 bg-cyan-50 text-cyan-700",
  },
  emerald: {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  rose: {
    badge: "border-rose-200 bg-rose-50 text-rose-700",
    icon: "border-rose-200 bg-rose-50 text-rose-700",
  },
};

export function ResourceListItem({
  accent,
  categoryId,
  categoryTitle,
  resource,
}: {
  accent: StudyAccent;
  categoryId: string;
  categoryTitle: string;
  resource: StudyResource;
}) {
  const Icon = FORMAT_ICONS[resource.format] ?? BookOpenText;
  const styles = ACCENT_STYLES[accent];
  const discussionHref = buildResourceDiscussionHref(resource, categoryTitle);
  const external = isExternalStudyUrl(resource.url);
  const imageSrc = getStudyResourceArt(resource.id, categoryId);

  return (
    <article className="grid gap-4 py-5 first:pt-0 last:pb-0 md:grid-cols-[7rem_minmax(0,1fr)] xl:grid-cols-[7rem_minmax(0,1fr)_auto]">
      <div className="space-y-3">
        <div className="relative h-[5.25rem] overflow-hidden rounded-[1rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.82)]">
          <Image alt={resource.title} className="object-cover object-center" fill sizes="112px" src={imageSrc} />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.0)_38%,rgba(255,255,255,0.28)_100%)]" />
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-full border", styles.icon)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            {resource.format}
          </span>
          <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-white px-2.5 py-1 text-[11px] font-medium text-slate-500">
            {resource.level}
          </span>
          <span className={cn("rounded-full border px-2.5 py-1 text-[11px] font-medium", styles.badge)}>{resource.access}</span>
          {resource.contributionSource === "community" ? (
            <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.86)] px-2.5 py-1 text-[11px] font-medium text-slate-500">
              Community suggestion
            </span>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{resource.source}</p>
          <h3 className="text-[1.1rem] font-semibold leading-7 text-slate-900">{resource.title}</h3>
          <p className="text-sm leading-6 text-slate-600">{resource.summary}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {resource.tags.map((tag) => (
            <span
              className="rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.8)] px-2.5 py-1 text-[11px] text-slate-500"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-2 xl:flex-col xl:items-end xl:justify-center">
        <Button asChild className="rounded-full" size="sm" variant="outline">
          <Link href={discussionHref}>
            <MessageSquare className="h-4 w-4" />
            Start discussion
          </Link>
        </Button>

        <Button asChild className="rounded-full" size="sm">
          <a href={resource.url} rel={external ? "noreferrer" : undefined} target={external ? "_blank" : undefined}>
            {resource.communityKind === "article" ? "Read article" : "Open"}
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </article>
  );
}
