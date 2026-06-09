"use client";

import { cn } from "@/lib/utils";

type StudyView = "paths" | "topics";

const VIEW_LABELS: Array<{
  description: string;
  id: StudyView;
  label: string;
}> = [
  { description: "Curated reading journeys", id: "paths", label: "Study Journeys" },
  { description: "Browse the idea regions", id: "topics", label: "Knowledge Themes" },
];

export function StudyTabs({
  activeView,
  countsLabel,
  onChange,
}: {
  activeView: Exclude<StudyView, "library">;
  countsLabel: string;
  onChange: (view: Exclude<StudyView, "library">) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="overflow-x-auto pb-1">
        <div className="inline-flex min-w-full items-center gap-2 rounded-full border border-[rgba(28,36,48,0.08)] bg-white/92 p-1 shadow-[0_12px_30px_rgba(28,36,48,0.04)] md:min-w-0">
          {VIEW_LABELS.map((option) => (
            <button
              className={cn(
                "min-w-[10rem] flex-1 rounded-full px-4 py-3 text-left transition md:min-w-0",
                activeView === option.id
                  ? "bg-[rgba(59,130,246,0.1)] text-slate-900 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.14)]"
                  : "text-slate-500 hover:bg-[rgba(246,244,238,0.82)] hover:text-slate-900",
              )}
              key={option.id}
              onClick={() => onChange(option.id)}
              type="button"
            >
              <p className="text-sm font-semibold">{option.label}</p>
              <p className="mt-1 text-xs text-slate-500">{option.description}</p>
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">{countsLabel}</p>
    </div>
  );
}
