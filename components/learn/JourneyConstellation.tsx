"use client";

import { ArrowRight } from "lucide-react";

import type { LearningJourney } from "@/lib/learn/journeys";
import { cn } from "@/lib/utils";

const POSITIONS: Record<string, { x: string; y: string }> = {
  "build-a-wellbeing-economy": { x: "80%", y: "25%" },
  "fixing-democracy-and-governance": { x: "80%", y: "72%" },
  "planetary-boundaries-and-world3": { x: "22%", y: "72%" },
  "understand-modern-money": { x: "22%", y: "25%" },
};

export function JourneyConstellation({
  journeys,
  onSelect,
  selectedJourneyId,
}: {
  journeys: LearningJourney[];
  onSelect: (journeyId: string) => void;
  selectedJourneyId: string;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 lg:hidden">
        {journeys.map((journey) => {
          const selected = journey.id === selectedJourneyId;

          return (
            <button
              className={cn(
                "rounded-[1.5rem] border px-4 py-4 text-left transition-colors",
                selected
                  ? "border-primary bg-[rgba(59,130,246,0.08)]"
                  : "border-[rgba(28,36,48,0.08)] bg-white/72 hover:border-[rgba(28,36,48,0.16)]",
              )}
              key={journey.id}
              onClick={() => onSelect(journey.id)}
              type="button"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{journey.duration}</p>
              <h3 className="atlas-display mt-2 text-2xl text-slate-900">{journey.title}</h3>
              <p className="atlas-copy mt-2 text-sm">{journey.tagline}</p>
            </button>
          );
        })}
      </div>

      <div className="relative hidden min-h-[26rem] overflow-hidden rounded-[2rem] border border-[rgba(28,36,48,0.08)] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.98),rgba(241,235,222,0.88)_42%,rgba(225,236,243,0.9))] lg:block">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          {journeys.map((journey) => {
            const position = POSITIONS[journey.id];
            const selected = journey.id === selectedJourneyId;

            return (
              <line
                key={journey.id}
                stroke={selected ? "#3B82F6" : "rgba(28,36,48,0.18)"}
                strokeDasharray={selected ? "0" : "3 3"}
                strokeWidth={selected ? "0.65" : "0.45"}
                x1="50"
                x2={position?.x.replace("%", "") ?? "50"}
                y1="50"
                y2={position?.y.replace("%", "") ?? "50"}
              />
            );
          })}
        </svg>

        <div className="absolute left-1/2 top-1/2 w-[13rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white/88 px-6 py-7 text-center shadow-[0_18px_40px_rgba(28,36,48,0.10)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Knowledge map</p>
          <h3 className="atlas-display mt-3 text-3xl leading-tight text-slate-900">Civilization Atlas</h3>
          <p className="atlas-copy mt-2 text-sm">Learning journeys connect the same system from different entry points.</p>
        </div>

        {journeys.map((journey) => {
          const position = POSITIONS[journey.id];
          const selected = journey.id === selectedJourneyId;

          return (
            <button
              className={cn(
                "absolute w-[15rem] -translate-x-1/2 -translate-y-1/2 rounded-[1.75rem] border px-5 py-4 text-left transition-all",
                selected
                  ? "border-primary bg-white shadow-[0_20px_44px_rgba(59,130,246,0.12)]"
                  : "border-[rgba(28,36,48,0.08)] bg-white/74 hover:border-[rgba(28,36,48,0.16)] hover:bg-white/88",
              )}
              key={journey.id}
              onClick={() => onSelect(journey.id)}
              style={{ left: position?.x, top: position?.y }}
              type="button"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">{journey.duration}</p>
                  <h4 className="atlas-display mt-2 text-[1.7rem] leading-tight text-slate-900">{journey.title}</h4>
                  <p className="atlas-copy mt-2 text-sm">{journey.tagline}</p>
                </div>
                {selected ? <ArrowRight className="mt-1 h-4 w-4 flex-none text-primary" /> : null}
              </div>
            </button>
          );
        })}

        <div className="absolute bottom-4 left-4 rounded-full border border-[rgba(28,36,48,0.08)] bg-white/76 px-4 py-2 text-xs font-medium text-slate-500">
          {"Read -> Simulate -> Discuss -> Govern"}
        </div>
      </div>
    </div>
  );
}
