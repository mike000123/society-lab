"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export type Theme = "dark" | "light";

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  root.classList.add(theme);
  try { localStorage.setItem("theme", theme); } catch {}
}

export function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      return stored as Theme;
    }
  } catch {}

  return "light";
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = readStoredTheme();
    setTheme(saved);
    applyTheme(saved);
    setMounted(true);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  }

  const isLight = theme === "light";

  return (
    <button
      onClick={toggle}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      className={[
        compact
          ? "inline-flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200"
          : "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200",
        isLight
          ? compact
            ? "text-slate-600 hover:bg-[rgba(28,36,48,0.04)] hover:text-slate-950"
            : "border-[rgba(28,36,48,0.12)] bg-white/90 text-slate-700 shadow-sm hover:border-[rgba(59,130,246,0.35)] hover:text-slate-900"
          : compact
            ? "text-slate-200 hover:bg-slate-800 hover:text-white"
            : "border-slate-600 bg-slate-800 text-slate-200 hover:border-slate-400 hover:text-white hover:bg-slate-700",
        !mounted && "opacity-0 pointer-events-none",
      ].join(" ")}
    >
      {isLight
        ? <><Moon className={compact ? "h-5 w-5" : "h-3.5 w-3.5"} />{compact ? null : <span className="hidden sm:inline">Dark</span>}</>
        : <><Sun className={compact ? "h-5 w-5" : "h-3.5 w-3.5"} />{compact ? null : <span className="hidden sm:inline">Light</span>}</>
      }
    </button>
  );
}
