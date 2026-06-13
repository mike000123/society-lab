"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenText, Clock3, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { StudyPath } from "@/lib/study/paths";

export function StudyJourneyCard({
  description,
  imageSrc,
  linkedTopics,
  path,
  progress,
  startHref,
  onDiscuss,
  onPreview,
}: {
  description: string;
  imageSrc: string;
  linkedTopics: string[];
  path: StudyPath;
  progress: number;
  startHref?: string;
  onDiscuss: () => void;
  onPreview: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-[1.7rem] border border-[rgba(28,36,48,0.08)] bg-white shadow-[0_18px_40px_rgba(28,36,48,0.05)]">
      <div className="relative h-40 overflow-hidden border-b border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.75)]">
        <Image alt={path.title} className="object-cover object-center" fill sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw" src={imageSrc} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.0)_38%,rgba(255,255,255,0.86)_100%)]" />
        <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-2">
          <span className="rounded-full border border-emerald-200 bg-white/92 px-3 py-1 text-[11px] font-semibold text-emerald-700">
            {path.resourceIds.length} resources
          </span>
          <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-white/92 px-3 py-1 text-[11px] font-semibold text-slate-500">
            {path.duration.replace(`${path.resourceIds.length} resources · `, "")}
          </span>
        </div>
      </div>

      <div className="space-y-4 px-4 py-4">
        <div className="space-y-2">
          <h3 className="atlas-display text-[1.7rem] leading-tight text-slate-900">{path.title}</h3>
          <p className="text-sm font-medium text-slate-600">{description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {linkedTopics.map((topic) => (
            <span
              className="rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.82)] px-3 py-1 text-[11px] font-medium text-slate-600"
              key={topic}
            >
              {topic}
            </span>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3 text-xs font-medium text-slate-500">
            <span>Progress placeholder</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-[rgba(226,232,240,0.88)]">
            <div className="h-full rounded-full bg-[linear-gradient(90deg,#4f8cff,#7cb2ff)]" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {startHref ? (
            <Button asChild className="rounded-full">
              <a href={startHref} rel={startHref.startsWith("http") ? "noreferrer" : undefined} target={startHref.startsWith("http") ? "_blank" : undefined}>
                Start reading
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          ) : (
            <Button className="rounded-full" disabled type="button">
              Start reading
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}

          <Button className="rounded-full" onClick={onPreview} type="button" variant="outline">
            <BookOpenText className="h-4 w-4" />
            Relevant material
          </Button>

          <Button className="rounded-full" onClick={onDiscuss} type="button" variant="outline">
            <MessageSquare className="h-4 w-4" />
            Discuss
          </Button>
        </div>
      </div>
    </article>
  );
}
