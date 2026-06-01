"use client";

import dynamic from "next/dynamic";
import { Globe2, BarChart2, TrendingDown, Smile } from "lucide-react";

const WorldMap = dynamic(() => import("@/components/map/WorldMap"), {
  ssr: false,
  loading: () => (
    <div className="rounded-[2rem] border border-slate-800 bg-slate-950/85 p-8 text-center">
      <p className="text-slate-400 animate-pulse">Loading world map...</p>
    </div>
  ),
});

const INDICATORS = [
  {
    icon: <TrendingDown className="h-4 w-4 text-rose-300" />,
    label: "Gini Index",
    desc: "Income inequality — higher = more unequal",
    color: "border-rose-800/40",
  },
  {
    icon: <BarChart2 className="h-4 w-4 text-amber-300" />,
    label: "Corruption Index",
    desc: "Perceived public sector corruption (CPI)",
    color: "border-amber-800/40",
  },
  {
    icon: <Globe2 className="h-4 w-4 text-cyan-300" />,
    label: "Press Freedom",
    desc: "RSF Press Freedom Index — lower rank = more free",
    color: "border-cyan-800/40",
  },
  {
    icon: <Smile className="h-4 w-4 text-violet-300" />,
    label: "Wellbeing Gap",
    desc: "Distance from optimal wellbeing (0 = optimal)",
    color: "border-violet-800/40",
  },
];

export default function MapPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-10">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/85 p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-cyan-400/10 via-cyan-400/3 to-transparent" />
        <div className="relative space-y-4">
          <span className="inline-flex rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-100">
            Global systems map
          </span>
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-3">
              <h1 className="text-3xl font-black tracking-tight text-slate-50 sm:text-4xl">
                How does your country compare?
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-300">
                Four indicators that reveal how systems actually perform across 180+ countries.
                Inequality, corruption, press freedom, and wellbeing are not random — they are
                outputs of deliberate policy choices. Click any country to explore its data.
              </p>
            </div>

            {/* Indicator legend */}
            <div className="grid grid-cols-2 gap-2">
              {INDICATORS.map(({ icon, label, desc, color }) => (
                <div
                  key={label}
                  className={`flex flex-col gap-1.5 rounded-2xl border bg-slate-900/60 p-3 ${color}`}
                >
                  <div className="flex items-center gap-2">
                    {icon}
                    <span className="text-xs font-semibold text-slate-200">{label}</span>
                  </div>
                  <p className="text-[11px] leading-4 text-slate-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <WorldMap />
    </div>
  );
}
