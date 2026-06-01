"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  root.classList.add(theme);
  try { localStorage.setItem("theme", theme); } catch {}
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let saved: Theme = "dark";
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "light" || stored === "dark") saved = stored as Theme;
    } catch {}
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
      aria-label={isLight ? "Switch to dark theme" : "Switch to light (Harvard) theme"}
      className={[
        "flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all duration-200",
        isLight
          ? "border-[#ddd8cf] bg-white text-[#a51c30] shadow-sm hover:border-[#a51c30]/50 hover:shadow"
          : "border-slate-600 bg-slate-800 text-slate-200 hover:border-slate-400 hover:text-white hover:bg-slate-700",
        !mounted && "opacity-0 pointer-events-none",
      ].join(" ")}
    >
      {isLight
        ? <><Moon className="h-3.5 w-3.5" /><span className="hidden sm:inline">Dark</span></>
        : <><Sun className="h-3.5 w-3.5" /><span className="hidden sm:inline">Light</span></>
      }
    </button>
  );
}
