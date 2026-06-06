"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import { LEARNING_JOURNEYS } from "@/lib/learn/journeys";
import { learningModules } from "@/lib/learn/modules";
import { LEARNING_TRACKS } from "@/lib/tracks/config";
import { cn } from "@/lib/utils";

type SearchEntry = {
  href: string;
  keywords: string;
  subtitle: string;
  title: string;
  type: "Journey" | "Module" | "Simulator" | "Track";
};

const SIMULATOR_SEARCH_ITEMS: SearchEntry[] = [
  {
    href: "/simulator/world3",
    keywords: "world3 civilization systems resources population pollution welfare ecology model",
    subtitle: "Long-run civilization dynamics",
    title: "World3 Civilization Simulator",
    type: "Simulator",
  },
  {
    href: "/simulator/financial-crisis",
    keywords: "financial crisis leverage contagion shadow banking bubble",
    subtitle: "Leverage and contagion",
    title: "Financial Crisis Simulator",
    type: "Simulator",
  },
  {
    href: "/simulator/macro-economy",
    keywords: "macro economy fiscal monetary policy debt inflation recession",
    subtitle: "Fiscal and monetary policy lab",
    title: "Macro Economy Lab",
    type: "Simulator",
  },
  {
    href: "/simulator/purchasing-power",
    keywords: "purchasing power inflation housing energy wages income",
    subtitle: "Inflation and real income",
    title: "Your Purchasing Power",
    type: "Simulator",
  },
  {
    href: "/simulator/wealth-gap",
    keywords: "wealth gap inequality capital taxation wages concentration",
    subtitle: "Inequality over time",
    title: "The Wealth Gap",
    type: "Simulator",
  },
  {
    href: "/simulator/bank-run",
    keywords: "bank run panic deposit insurance reserves banking collapse",
    subtitle: "Panic and banking stability",
    title: "Bank Run Simulator",
    type: "Simulator",
  },
  {
    href: "/simulator/debt",
    keywords: "debt savings compound interest personal finance loans",
    subtitle: "Debt and compound interest",
    title: "Debt vs Savings",
    type: "Simulator",
  },
  {
    href: "/simulator/social-movements",
    keywords: "social movements politics coalitions repression collective action",
    subtitle: "Movement conditions and outcomes",
    title: "Social Movement Lab",
    type: "Simulator",
  },
  {
    href: "/simulator/eu-decision-making",
    keywords: "eu european union governance legislative process trilogue parliament council",
    subtitle: "EU legislative process",
    title: "EU Legislative Process",
    type: "Simulator",
  },
  {
    href: "/simulator/us-decision-making",
    keywords: "us united states congress senate house veto filibuster legislative process",
    subtitle: "US legislative process",
    title: "US Legislative Process",
    type: "Simulator",
  },
];

const SEARCH_ITEMS: SearchEntry[] = [
  ...LEARNING_TRACKS.map((track) => ({
    href: `/learn?view=tracks&track=${track.id}`,
    keywords: `${track.title} ${track.tagline} ${track.description}`,
    subtitle: track.tagline,
    title: track.title,
    type: "Track" as const,
  })),
  ...LEARNING_JOURNEYS.map((journey) => ({
    href: `/learn?view=journeys&journey=${journey.id}`,
    keywords: `${journey.title} ${journey.tagline} ${journey.summary}`,
    subtitle: journey.tagline,
    title: journey.title,
    type: "Journey" as const,
  })),
  ...learningModules.map((module) => ({
    href: `/learn/${module.slug}`,
    keywords: `${module.title} ${module.summary} ${module.eyebrow}`,
    subtitle: module.eyebrow,
    title: module.title,
    type: "Module" as const,
  })),
  ...SIMULATOR_SEARCH_ITEMS,
];

const BADGE_STYLES: Record<SearchEntry["type"], string> = {
  Journey: "border-amber-200 bg-amber-50 text-amber-700",
  Module: "border-cyan-200 bg-cyan-50 text-cyan-700",
  Simulator: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Track: "border-violet-200 bg-violet-50 text-violet-700",
};

export function ToolbarSearch({
  className,
  placeholder = "Search simulators, topics, models...",
}: {
  className?: string;
  placeholder?: string;
}) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const pool = term
      ? SEARCH_ITEMS.filter((item) => `${item.title} ${item.subtitle} ${item.keywords}`.toLowerCase().includes(term))
      : SEARCH_ITEMS;

    return pool.slice(0, 8);
  }, [query]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const first = filtered[0];
    if (!first) {
      router.push("/study?view=library");
      setOpen(false);
      return;
    }

    router.push(first.href);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className={cn("relative", className)} ref={rootRef}>
      <form
        className="flex h-12 min-w-[18rem] items-center gap-3 rounded-[1.1rem] border border-[rgba(28,36,48,0.1)] bg-white px-4 text-slate-500 shadow-[0_10px_24px_rgba(28,36,48,0.04)] xl:min-w-[21rem]"
        onSubmit={handleSubmit}
      >
        <Search className="h-4 w-4 text-slate-400" />
        <input
          aria-label="Search"
          className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          value={query}
        />
      </form>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+0.75rem)] z-30 w-[min(34rem,92vw)] overflow-hidden rounded-[1.45rem] border border-[rgba(28,36,48,0.08)] bg-white/96 shadow-[0_24px_50px_rgba(28,36,48,0.14)] backdrop-blur">
          <div className="border-b border-[rgba(28,36,48,0.08)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            {query.trim() ? "Best matches" : "Explore the atlas"}
          </div>

          <div className="max-h-[26rem] overflow-y-auto p-2">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <Link
                  className="flex items-start justify-between gap-3 rounded-[1rem] px-3 py-3 transition hover:bg-[rgba(28,36,48,0.04)]"
                  href={item.href}
                  key={`${item.type}-${item.href}`}
                  onClick={() => {
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.subtitle}</p>
                  </div>
                  <span className={cn("flex-none rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]", BADGE_STYLES[item.type])}>
                    {item.type}
                  </span>
                </Link>
              ))
            ) : (
              <div className="px-3 py-6 text-sm text-slate-500">
                No exact matches yet. Press Enter to open the study library.
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
