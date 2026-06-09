import type { AccentTone } from "@/lib/learn/modules";

import { cn } from "@/lib/utils";

import { lessonAccentClasses } from "@/components/learn/lesson-theme";

export function LessonSectionHeader({
  accent,
  id,
  index,
  subtitle,
  title,
}: {
  accent: AccentTone;
  id: string;
  index: number;
  subtitle?: string;
  title: string;
}) {
  return (
    <header className="space-y-3" id={id}>
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
            lessonAccentClasses[accent].step,
          )}
        >
          {index}
        </span>
        <h2 className="atlas-display text-[2rem] leading-tight text-slate-900 sm:text-[2.2rem]">{title}</h2>
      </div>
      {subtitle ? <p className="atlas-copy max-w-[52rem] text-base leading-8">{subtitle}</p> : null}
    </header>
  );
}
