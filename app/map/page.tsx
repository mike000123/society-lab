 "use client";

import dynamic from "next/dynamic";
import { BarChart2, Globe2, Smile, TrendingDown } from "lucide-react";

import { AtlasPage } from "@/components/atlas/AtlasPage";
import { IllustratedTabHero } from "@/components/atlas/IllustratedTabHero";
import { SoftPanel } from "@/components/atlas/SoftPanel";

const WorldMap = dynamic(() => import("@/components/map/WorldMap"), {
  ssr: false,
  loading: () => (
    <div className="rounded-[2rem] border border-[rgba(28,36,48,0.08)] bg-white/84 p-8 text-center text-sm text-slate-500 shadow-[0_18px_40px_rgba(28,36,48,0.05)]">
      Loading world map...
    </div>
  ),
});

const INDICATORS = [
  {
    icon: TrendingDown,
    label: "Gini Index",
    description: "Income inequality, where higher values mean a more unequal society.",
    tone: "border-rose-200 bg-rose-50 text-rose-700",
  },
  {
    icon: BarChart2,
    label: "Corruption",
    description: "Perceived public-sector corruption and institutional capture.",
    tone: "border-amber-200 bg-amber-50 text-amber-700",
  },
  {
    icon: Globe2,
    label: "Press Freedom",
    description: "The openness of the information environment and the media system.",
    tone: "border-cyan-200 bg-cyan-50 text-cyan-700",
  },
  {
    icon: Smile,
    label: "Wellbeing Gap",
    description: "How far daily life outcomes sit from a stronger social baseline.",
    tone: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
];

export default function MapPage() {
  return (
    <AtlasPage className="space-y-8 pb-14">
      <IllustratedTabHero
        description="Compare how countries perform across inequality, corruption, press freedom, and wellbeing. The goal is not to rank for sport, but to see how different systems produce different lived outcomes."
        eyebrow="Global Systems Map"
        imageAlt="A world map showing different performance patterns across countries."
        imageClassName="object-cover object-center"
        imageSrc="/atlas/map-hero.png"
        title="See how systems differ across countries"
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {INDICATORS.map(({ description, icon: Icon, label, tone }) => (
            <div
              className="rounded-[1.4rem] border border-[rgba(28,36,48,0.08)] bg-white/88 px-4 py-4 shadow-[0_14px_32px_rgba(28,36,48,0.04)]"
              key={label}
            >
              <div className={`inline-flex rounded-full border p-2 ${tone}`}>
                <Icon className="h-4 w-4" />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-900">{label}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </IllustratedTabHero>

      <WorldMap />

      <div className="grid gap-4 lg:grid-cols-4">
        <SoftPanel tone="green">
          <p className="atlas-kicker">Top wellbeing</p>
          <p className="mt-2 text-sm leading-7 text-slate-700">Countries like Finland, Denmark, and the Netherlands tend to combine stronger safety nets with broader trust.</p>
        </SoftPanel>
        <SoftPanel tone="gold">
          <p className="atlas-kicker">Highest inequality</p>
          <p className="mt-2 text-sm leading-7 text-slate-700">South Africa, Namibia, Brazil, and Colombia show how structural concentration can persist across very different histories.</p>
        </SoftPanel>
        <SoftPanel tone="blue">
          <p className="atlas-kicker">Large improvements</p>
          <p className="mt-2 text-sm leading-7 text-slate-700">Several countries in Eastern Europe and parts of Asia improved quickly once institutions, media space, and public investment shifted together.</p>
        </SoftPanel>
        <SoftPanel>
          <p className="atlas-kicker">Use the atlas</p>
          <p className="mt-2 text-sm leading-7 text-slate-700">Click a country, then jump into the linked modules to understand which policies and structures may be driving the pattern.</p>
        </SoftPanel>
      </div>
    </AtlasPage>
  );
}
