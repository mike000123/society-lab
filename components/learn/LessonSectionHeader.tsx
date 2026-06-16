import type { AccentTone } from "@/lib/learn/modules";

import { cn } from "@/lib/utils";

import { lessonAccentClasses } from "@/components/learn/lesson-theme";

export function LessonSectionHeader({
  accent,
  compact = false,
  id,
  index,
  subtitle,
  title,
}: {
  accent: AccentTone;
  compact?: boolean;
  id: string;
  index: number;
  subtitle?: string;
  title: string;
}) {
  return (
    <header className={compact ? "space-y-2" : "space-y-3"} id={id}>
      <div className="flex items-center gap-3">
        <span
          className={cn(
            compact
              ? "inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold"
              : "inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
            lessonAccentClasses[accent].step,
          )}
        >
          {index}
        </span>
        <h2
          className={cn(
            "atlas-display leading-tight text-slate-900",
            compact ? "text-[1.75rem] sm:text-[1.95rem]" : "text-[2rem] sm:text-[2.2rem]",
          )}
        >
          {title}
        </h2>
      </div>
      {subtitle ? (
        <p className={cn("atlas-copy max-w-[52rem]", compact ? "text-sm leading-7" : "text-base leading-8")}>
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
