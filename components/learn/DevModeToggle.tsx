"use client";

import { FlaskConical } from "lucide-react";
import { useProgress } from "@/lib/progress/store";
import { cn } from "@/lib/utils";

export function DevModeToggle({ editorial = false }: { editorial?: boolean }) {
  const { devMode, toggleDevMode } = useProgress();

  return (
    <button
      onClick={toggleDevMode}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        editorial
          ? devMode
            ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
            : "border-slate-300 bg-white text-slate-500 hover:border-slate-400 hover:text-slate-700"
          : devMode
            ? "border-amber-400/40 bg-amber-400/10 text-amber-300 hover:bg-amber-400/15"
            : "border-slate-700 bg-slate-900/50 text-slate-500 hover:border-slate-600 hover:text-slate-400",
      )}
      title="Toggle dev mode — unlocks all modules"
    >
      <FlaskConical className="h-3.5 w-3.5" />
      {devMode ? "Dev mode: ON" : "Dev mode: OFF"}
    </button>
  );
}
