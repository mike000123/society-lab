"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import {
  ArrowRight,
  Compass,
  FlaskConical,
  Globe2,
  Leaf,
  LineChart as LineChartIcon,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AtlasPage } from "@/components/atlas/AtlasPage";
import { FeatureStrip } from "@/components/atlas/FeatureStrip";
import { IllustratedTabHero } from "@/components/atlas/IllustratedTabHero";
import { InsightBlock } from "@/components/atlas/InsightBlock";
import { SectionNarrative } from "@/components/atlas/SectionNarrative";
import { SoftPanel } from "@/components/atlas/SoftPanel";
import { SimulatorPrimer } from "@/components/simulator/SimulatorAtlas";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── World3-inspired system dynamics model ────────────────────────────────────
interface World3State {
  year: number;
  population: number;
  industrial_capital: number;
  service_capital: number;
  agricultural_capital: number;
  nonrenewable_resources: number;
  pollution: number;
  food_per_capita: number;
  life_expectancy: number;
  human_welfare_index: number;
  industrial_output_pc: number;
}

interface ScenarioParams {
  resourceEfficiency: number;
  resourceReserveMultiplier: number;
  pollutionControl: number;
  pollutionAbsorption: number;
  landYieldTech: number;
  erosionControl: number;
  fertilityControl: number;
  mortalityReduction: number;
  industrialDepreciation: number;
  serviceCapitalPriority: number;
}

const BASE: ScenarioParams = {
  resourceEfficiency: 1,
  resourceReserveMultiplier: 1,
  pollutionControl: 0,
  pollutionAbsorption: 1,
  landYieldTech: 1,
  erosionControl: 0,
  fertilityControl: 0,
  mortalityReduction: 1,
  industrialDepreciation: 1,
  serviceCapitalPriority: 1,
};

function sigmoid(x: number, midpoint: number, steepness: number): number {
  return 1 / (1 + Math.exp(-steepness * (x - midpoint)));
}
function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1);
}

function runWorld3(p: ScenarioParams, endYear = 2100): World3State[] {
  const dt = 0.5;
  const results: World3State[] = [];
  let pop   = 1.6;
  let iCap  = 0.09;
  let sCap  = 0.07;
  let aCap  = 7.0;
  let nr    = 1.0 * p.resourceReserveMultiplier;
  let poll  = 0.02;
  const NR_INITIAL = 1.0 * p.resourceReserveMultiplier;
  let lastPushedYear = -1;

  for (let t = 1900; t <= endYear; t += dt) {
    const nrFraction = nr / NR_INITIAL;
    const resourceStress = Math.sqrt(Math.max(nrFraction, 0.01));
    const pollDampen = clamp(1 - (poll - 1) * 0.035 * (1 - p.pollutionControl), 0.12, 1);
    const industrialOutputRaw = iCap * 3.5 * resourceStress * pollDampen;
    const industrialOutputPC  = clamp(industrialOutputRaw / pop, 0.01, 50);

    const investFrac  = clamp(0.22 + industrialOutputPC * 0.007, 0.14, 0.36) * Math.min(resourceStress * 1.1, 1);
    const iCapGrowth  = industrialOutputRaw * investFrac * 0.11;
    iCap = Math.max(0.01, iCap + (iCapGrowth - iCap * 0.05 / p.industrialDepreciation) * dt);

    const sCapGrowth = industrialOutputRaw * 0.08 * p.serviceCapitalPriority;
    sCap = Math.max(0.01, sCap + (sCapGrowth - sCap * 0.04) * dt);

    const aCapCarry  = 40.0 * (0.25 + 0.75 * nrFraction) * p.landYieldTech;
    const aCapGrowth = industrialOutputRaw * 0.40 * Math.max(0, 1 - aCap / aCapCarry);
    aCap = Math.max(0.1, aCap + (aCapGrowth - aCap * 0.008) * dt);

    const rawDeplRate    = Math.max(iCap * 3.5 * resourceStress, 0) * 0.00110 / p.resourceEfficiency;
    const resourceUseRate = Math.min(rawDeplRate, nr * 0.12);
    nr = Math.max(0, nr - resourceUseRate * dt);

    const yieldBase  = lerp(1, 2.5, clamp((t - 1900) / 120, 0, 1)) * p.landYieldTech;
    const yieldTech  = yieldBase * clamp(0.5 + 0.5 * nrFraction / (nrFraction + 0.1), 0.5, 1);
    const pollAgri   = clamp(1 - (poll - 1) * 0.065 * (1 - p.pollutionControl * 0.5), 0.08, 1);
    const erosion    = p.erosionControl > 0.5 ? 1 : clamp(1 - Math.max(0, t - 1950) * 0.0018, 0.45, 1);
    const foodOutput = aCap * yieldTech * pollAgri * erosion * 0.21;
    const foodPerCapita = clamp(foodOutput / pop, 0.05, 6.0);

    const pollEmit  = industrialOutputRaw * 0.012 * (1 - p.pollutionControl * 0.85)
                    + aCap * 0.001 * (1 - p.pollutionControl * 0.4);
    const pollDecay = poll * 0.016 * p.pollutionAbsorption;
    poll = Math.max(0, poll + (pollEmit - pollDecay) * dt);

    const serviceEffect = clamp(sCap / pop * 10, 0, 20);
    const pollPenalty   = clamp((poll - 0.5) * 4 * (1 - p.pollutionControl), 0, 28);
    const techGain = Math.min((t - 1900) * 0.10 * p.mortalityReduction, 30) * clamp(nrFraction * 2, 0, 1);
    const leBase = clamp(30 + techGain + serviceEffect - pollPenalty, 20, 84);
    const foodLEpenalty = foodPerCapita < 0.85 ? clamp((0.85 - foodPerCapita) * 55, 0, 38) : 0;
    const le = clamp(leBase - foodLEpenalty, 20, 88);

    const cbrBase  = lerp(0.042, 0.010, sigmoid(industrialOutputPC, 2.0, 1.43));
    const fertCtrl = p.fertilityControl * clamp((t - 1950) / 50, 0, 1) * 0.42;
    const cbr      = cbrBase * (1 - clamp(fertCtrl, 0, 0.48));

    const cdrNatural = clamp(Math.pow(34 / le, 2.0) * 0.022 + 0.005, 0.006, 0.045);
    const foodMultiplier = foodPerCapita < 0.85
      ? clamp(1 + Math.pow((0.85 - foodPerCapita) / 0.38, 2) * 3.5, 1, 4.5) : 1.0;
    const cdr = clamp(cdrNatural * foodMultiplier, 0.006, 0.065);
    pop = Math.max(0.1, pop + pop * (cbr - cdr) * dt);

    const lifeNorm   = clamp((le - 25) / 60, 0, 1) * 40;
    const foodNorm   = clamp((foodPerCapita - 0.3) / 2.7, 0, 1) * 30;
    const incomeNorm = clamp(industrialOutputPC / 18, 0, 1) * 20;
    const pollPenHWI = clamp((poll - 2) * 3 * (1 - p.pollutionControl), 0, 10);
    const hwi = clamp(lifeNorm + foodNorm + incomeNorm - pollPenHWI, 0, 100);

    const yearInt = Math.round(t);
    if (yearInt !== lastPushedYear && Math.abs(t - yearInt) < dt * 0.6) {
      lastPushedYear = yearInt;
      results.push({
        year:                    yearInt,
        population:              Math.round(pop * 100) / 100,
        industrial_capital:      Math.round(iCap * 100) / 100,
        service_capital:         Math.round(sCap * 100) / 100,
        agricultural_capital:    Math.round(aCap * 100) / 100,
        nonrenewable_resources:  Math.round(nrFraction * 1000) / 10,
        pollution:               Math.round(poll * 100) / 100,
        food_per_capita:         Math.round(foodPerCapita * 100) / 100,
        life_expectancy:         Math.round(le * 10) / 10,
        human_welfare_index:     Math.round(hwi * 10) / 10,
        industrial_output_pc:    Math.round(industrialOutputPC * 100) / 100,
      });
    }
  }
  return results;
}

// ─── Presets ──────────────────────────────────────────────────────────────────
interface Preset {
  label: string;
  description: string;
  color: string;
  params: ScenarioParams;
}

const PRESETS: Preset[] = [
  {
    label: "Business as Usual",
    description: "No major policy changes.",
    color: "#f87171",
    params: { ...BASE },
  },
  {
    label: "Tech Fix",
    description: "Doubled resource efficiency and yield tech, no policy change.",
    color: "#fbbf24",
    params: { ...BASE, resourceEfficiency: 2, landYieldTech: 1.8, resourceReserveMultiplier: 1.5 },
  },
  {
    label: "Stabilised World",
    description: "Pollution controls, fertility access, erosion control.",
    color: "#34d399",
    params: {
      ...BASE,
      pollutionControl: 0.9, pollutionAbsorption: 1.6, fertilityControl: 1,
      erosionControl: 1, mortalityReduction: 1.2, serviceCapitalPriority: 1.4,
      resourceEfficiency: 1.6, landYieldTech: 1.4,
    },
  },
  {
    label: "Full Transition",
    description: "All levers engaged: green tech, education, policy reform.",
    color: "#38bdf8",
    params: {
      resourceEfficiency: 2.5, resourceReserveMultiplier: 1.2, pollutionControl: 1,
      pollutionAbsorption: 2, landYieldTech: 1.6, erosionControl: 1,
      fertilityControl: 1, mortalityReduction: 1.3,
      industrialDepreciation: 0.7, serviceCapitalPriority: 1.6,
    },
  },
];

// ─── Slider config ────────────────────────────────────────────────────────────
type ParamKey = keyof ScenarioParams;

interface SliderConfig {
  key: ParamKey;
  label: string;
  min: number;
  max: number;
  step: number;
  icon: string;
  group: string;
  tooltip: string;
}

const SLIDERS: SliderConfig[] = [
  { key: "resourceEfficiency",      label: "Resource efficiency",       min: 1,   max: 3,   step: 0.05, icon: "⚙️",  group: "Resources",    tooltip: "How much output per unit of nonrenewable resource consumed. Higher = less depletion per unit of growth." },
  { key: "resourceReserveMultiplier", label: "Known resource reserves", min: 1,   max: 3,   step: 0.1,  icon: "🪨",  group: "Resources",    tooltip: "Multiplier on starting nonrenewable resources — represents discovery or renewable substitution." },
  { key: "pollutionControl",        label: "Pollution controls",        min: 0,   max: 1,   step: 0.05, icon: "🌿",  group: "Environment",  tooltip: "Fraction of emissions cut by policy and clean technology." },
  { key: "fertilityControl",        label: "Family planning access",    min: 0,   max: 1,   step: 0.05, icon: "👶",  group: "Population",   tooltip: "Access to education and family planning reduces birth rates through the demographic transition." },
  { key: "landYieldTech",           label: "Agricultural yield tech",   min: 1,   max: 2.5, step: 0.05, icon: "🌾",  group: "Food",         tooltip: "Multiplier on food output per unit of agricultural capital (e.g. precision farming, better seeds)." },
  { key: "erosionControl",          label: "Soil erosion control",      min: 0,   max: 1,   step: 0.05, icon: "🏔️",  group: "Food",         tooltip: "Prevents long-run degradation of agricultural land quality." },
  { key: "serviceCapitalPriority",  label: "Education & healthcare",    min: 1,   max: 2,   step: 0.05, icon: "🏥",  group: "Welfare",      tooltip: "Shifts investment toward public services — boosts life expectancy and accelerates demographic transition." },
  { key: "mortalityReduction",      label: "Public health investment",  min: 1,   max: 1.5, step: 0.05, icon: "💊",  group: "Welfare",      tooltip: "Directly boosts life expectancy through targeted health spending and disease prevention." },
];

const PRIMARY_SLIDER_KEYS: ParamKey[] = [
  "resourceEfficiency",
  "pollutionControl",
  "landYieldTech",
  "fertilityControl",
  "serviceCapitalPriority",
  "mortalityReduction",
];
const SECONDARY_SLIDER_KEYS: ParamKey[] = ["resourceReserveMultiplier", "erosionControl"];

type TabId = "overview" | "population" | "industrial" | "food" | "pollution" | "resources" | "welfare";
const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "population", label: "Population" },
  { id: "industrial", label: "Industrial Output" },
  { id: "food", label: "Food per Capita" },
  { id: "pollution", label: "Pollution" },
  { id: "resources", label: "Resources" },
  { id: "welfare", label: "Welfare Index" },
];

// ─── Custom tooltip ───────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { color: string; name: string; value: number }[];
  label?: number;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-white/96 px-4 py-3 text-xs shadow-[0_16px_30px_rgba(28,36,48,0.08)] dark:border-slate-700 dark:bg-slate-950/95">
      <p className="mb-2 font-bold text-slate-900 dark:text-slate-100">{label}</p>
      {payload.map((e) => (
        <p className="text-slate-700 dark:text-slate-200" key={e.name} style={{ color: e.color }}>
          {e.name}: <span className="font-semibold">{e.value}</span>
        </p>
      ))}
    </div>
  );
}

// ─── Chart panel ─────────────────────────────────────────────────────────────
function ChartPanel({
  title,
  description,
  children,
  height = 360,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  height?: number;
}) {
  return (
    <div className="rounded-[1.8rem] border border-[rgba(28,36,48,0.08)] bg-white/94 p-5 shadow-[0_18px_34px_rgba(28,36,48,0.05)] dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mb-4 space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</p>
        {description ? <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p> : null}
      </div>
      <ResponsiveContainer width="100%" height={height}>
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
}

// ─── Delta badge ──────────────────────────────────────────────────────────────
function DeltaBadge({ value, baseline, unit = "", lowerIsBetter = false }: {
  value: number; baseline: number; unit?: string; lowerIsBetter?: boolean;
}) {
  const delta = value - baseline;
  if (Math.abs(delta) < 0.01 * Math.abs(baseline) + 0.01) return null;
  const positive = lowerIsBetter ? delta < 0 : delta > 0;
  return (
    <span className={`ml-1 text-xs font-semibold ${positive ? "text-emerald-400" : "text-rose-400"}`}>
      {delta > 0 ? "+" : ""}{unit === "%" ? delta.toFixed(1) : Math.round(delta * 10) / 10}{unit}
    </span>
  );
}

function OutcomeMetric({
  label,
  value,
  detail,
  delta,
}: {
  label: string;
  value: string;
  detail?: string;
  delta?: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.35rem] border border-[rgba(28,36,48,0.08)] bg-white/92 px-4 py-4 shadow-[0_10px_24px_rgba(28,36,48,0.04)] dark:border-slate-800 dark:bg-slate-950/80">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <div className="mt-2 flex items-end gap-2">
        <p className="atlas-display text-3xl leading-none text-slate-900 dark:text-slate-50">{value}</p>
        {delta ? <div className="pb-1">{delta}</div> : null}
      </div>
      {detail ? <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{detail}</p> : null}
    </div>
  );
}

function formatSliderValue(config: SliderConfig, value: number) {
  if (config.key === "pollutionControl" || config.key === "fertilityControl" || config.key === "erosionControl") {
    return `${Math.round(value * 100)}%`;
  }
  return `${value.toFixed(config.step < 0.1 ? 2 : 1)}x`;
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function SimulatorPage() {
  const [customParams, setCustomParams] = useState<ScenarioParams>({ ...BASE });
  const [tab, setTab] = useState<TabId>("overview");
  const [endYear, setEndYear] = useState(2100);
  const [activePresets, setActivePresets] = useState<number[]>([0]); // BAU always shown for comparison

  // Run model: always run BAU + custom
  const bauData   = useMemo(() => runWorld3(BASE, endYear), [endYear]);
  const yourData  = useMemo(() => runWorld3(customParams, endYear), [customParams, endYear]);
  const presetData = useMemo(() => {
    const map: Record<number, World3State[]> = {};
    activePresets.filter((i) => i !== 0).forEach((i) => {
      map[i] = runWorld3(PRESETS[i].params, endYear);
    });
    return map;
  }, [activePresets, endYear]);

  const setParam = useCallback((key: ParamKey, val: number) => {
    setCustomParams((prev) => ({ ...prev, [key]: val }));
  }, []);

  const loadPreset = useCallback((idx: number) => {
    setCustomParams({ ...PRESETS[idx].params });
  }, []);

  const togglePreset = useCallback((idx: number) => {
    setActivePresets((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  }, []);

  // Build chart data (every 5 years from the present window)
  const chartData = useMemo(() => {
    const years: number[] = [];
    for (let y = 2025; y <= endYear; y += 5) years.push(y);
    return years.map((year) => {
      const row: Record<string, number | string> = { year };
      const b = bauData.find((s) => s.year === year);
      const y = yourData.find((s) => s.year === year);
      if (b) {
        row["BAU_pop"]  = b.population;
        row["BAU_hwi"]  = b.human_welfare_index;
        row["BAU_nr"]   = b.nonrenewable_resources;
        row["BAU_food"] = b.food_per_capita;
        row["BAU_poll"] = Math.round(b.pollution * 10) / 10;
        row["BAU_le"]   = b.life_expectancy;
        row["BAU_iop"]  = b.industrial_output_pc;
      }
      if (y) {
        row["Your_pop"]  = y.population;
        row["Your_hwi"]  = y.human_welfare_index;
        row["Your_nr"]   = y.nonrenewable_resources;
        row["Your_food"] = y.food_per_capita;
        row["Your_poll"] = Math.round(y.pollution * 10) / 10;
        row["Your_le"]   = y.life_expectancy;
        row["Your_iop"]  = y.industrial_output_pc;
      }
      activePresets.filter((i) => i !== 0).forEach((i) => {
        const ps = presetData[i]?.find((s) => s.year === year);
        if (ps) {
          const lbl = PRESETS[i].label.replace(/ /g, "_");
          row[`${lbl}_pop`]  = ps.population;
          row[`${lbl}_hwi`]  = ps.human_welfare_index;
          row[`${lbl}_nr`]   = ps.nonrenewable_resources;
          row[`${lbl}_food`] = ps.food_per_capita;
          row[`${lbl}_poll`] = Math.round(ps.pollution * 10) / 10;
          row[`${lbl}_le`]   = ps.life_expectancy;
          row[`${lbl}_iop`]  = ps.industrial_output_pc;
        }
      });
      return row;
    });
  }, [bauData, yourData, presetData, activePresets, endYear]);

  const overviewData = useMemo(
    () =>
      chartData.map((row) => ({
        year: row.year,
        population: Math.min(100, Number(row.Your_pop ?? 0) / 12 * 100),
        industrial: Math.min(100, Number(row.Your_iop ?? 0) / 20 * 100),
        food: Math.min(100, Number(row.Your_food ?? 0) / 3.5 * 100),
        pollution: Math.min(100, Number(row.Your_poll ?? 0) / 5 * 100),
        resources: Number(row.Your_nr ?? 0),
        welfare: Number(row.Your_hwi ?? 0),
      })),
    [chartData],
  );

  // Lines to render per chart
  function renderLines(suffix: string) {
    const lines = [
      <Line key="BAU" type="monotone" dataKey={`BAU_${suffix}`} name="Business as Usual"
        stroke="#f87171" strokeWidth={2} strokeDasharray="5 3" dot={false} activeDot={{ r: 4 }} />,
      <Line key="Your" type="monotone" dataKey={`Your_${suffix}`} name="Your scenario"
        stroke="#a78bfa" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />,
    ];
    activePresets.filter((i) => i !== 0).forEach((i) => {
      const lbl = PRESETS[i].label.replace(/ /g, "_");
      lines.push(
        <Line key={lbl} type="monotone" dataKey={`${lbl}_${suffix}`} name={PRESETS[i].label}
          stroke={PRESETS[i].color} strokeWidth={1.5} strokeDasharray="3 3" dot={false} activeDot={{ r: 3 }} />
      );
    });
    return lines;
  }

  function renderAreas(suffix: string) {
    const areas = [
      <Area key="BAU" type="monotone" dataKey={`BAU_${suffix}`} name="Business as Usual"
        stroke="#f87171" fill="#f87171" fillOpacity={0.05} strokeWidth={2} strokeDasharray="5 3" dot={false} />,
      <Area key="Your" type="monotone" dataKey={`Your_${suffix}`} name="Your scenario"
        stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.12} strokeWidth={2.5} dot={false} />,
    ];
    activePresets.filter((i) => i !== 0).forEach((i) => {
      const lbl = PRESETS[i].label.replace(/ /g, "_");
      areas.push(
        <Area key={lbl} type="monotone" dataKey={`${lbl}_${suffix}`} name={PRESETS[i].label}
          stroke={PRESETS[i].color} fill={PRESETS[i].color} fillOpacity={0.04} strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
      );
    });
    return areas;
  }

  // Reference line at today
  const todayLine = (
    <ReferenceLine x={2026} stroke="#64748b" strokeDasharray="4 2" strokeOpacity={0.7}
      label={{ value: "Today", fill: "#64748b", fontSize: 9, position: "insideTopLeft" }} />
  );

  const gridProps = { strokeDasharray: "3 3", stroke: "#ddd6c8" };
  const xAxisProps = { dataKey: "year", tick: { fill: "#6b7280", fontSize: 10 } };
  const yAxisProps = { tick: { fill: "#6b7280", fontSize: 10 } };
  const legendProps = { wrapperStyle: { fontSize: 10 } };

  // Terminal snapshots
  const termBau  = bauData.find((s) => s.year === endYear)  ?? bauData[bauData.length - 1];
  const termYour = yourData.find((s) => s.year === endYear) ?? yourData[yourData.length - 1];

  // Check if custom differs from BAU
  const isModified = JSON.stringify(customParams) !== JSON.stringify(BASE);

  const currentPresetIndex = PRESETS.findIndex((preset) => JSON.stringify(preset.params) === JSON.stringify(customParams));
  const primarySliders = SLIDERS.filter((slider) => PRIMARY_SLIDER_KEYS.includes(slider.key));
  const secondarySliders = SLIDERS.filter((slider) => SECONDARY_SLIDER_KEYS.includes(slider.key));

  const scenarioSnapshots = useMemo(
    () =>
      PRESETS.map((preset) => {
        const result = runWorld3(preset.params, endYear);
        const terminal = result.find((state) => state.year === endYear) ?? result[result.length - 1];
        return { ...preset, terminal };
      }),
    [endYear],
  );

  const driverSummary = useMemo(() => {
    const welfareDelta = termYour.human_welfare_index - termBau.human_welfare_index;
    const resourceDelta = termYour.nonrenewable_resources - termBau.nonrenewable_resources;
    const pollutionDelta = termYour.pollution - termBau.pollution;

    if (welfareDelta > 8 && resourceDelta > 8 && pollutionDelta < -0.5) {
      return "Your current setup bends the system toward a later, gentler peak: welfare rises, resources deplete more slowly, and pollution stays better contained than under business as usual.";
    }
    if (welfareDelta > 6 && pollutionDelta < -0.25) {
      return "This run improves human welfare and health outcomes, but it still depends on keeping resource use and pollution from catching up later in the century.";
    }
    if (resourceDelta > 10 && welfareDelta < 4) {
      return "Your scenario conserves material limits better than business as usual, but it is not yet converting enough of that breathing room into broad human wellbeing.";
    }
    if (pollutionDelta > 0.4 || welfareDelta < -4) {
      return "The current mix still behaves like overshoot: output and population keep pressing forward while pollution or declining welfare signal the system is outrunning its buffers.";
    }
    return "This scenario stays close to the default path. Small improvements appear, but the model is still behaving like a growth-first system unless several levers move together.";
  }, [termBau, termYour]);

  return (
    <AtlasPage className="space-y-8 pb-14">
      <IllustratedTabHero
        actions={
          <>
            <Button asChild className="rounded-full px-5">
              <a href="#world3-lab">Open the lab</a>
            </Button>
            <Button asChild className="rounded-full px-5" variant="outline">
              <a href="#world3-briefing">How to read this model</a>
            </Button>
          </>
        }
        description="Explore 200 years of civilization. Adjust the main drivers, compare futures, and watch how population, output, food, pollution, resources, and welfare move together."
        eyebrow="Simulation Lab"
        imageAlt="World3 civilization landscape"
        imageSrc="/atlas/simulator-hero.png"
        title="World3 Civilization Simulator"
      >
        <FeatureStrip
          items={[
            {
              label: "Forecast horizon",
              value: String(endYear),
              description: "Every run follows the same system from 2025 into the century ahead.",
              icon: <Compass className="h-4 w-4" />,
            },
            {
              label: "Welfare",
              value: `${termYour.human_welfare_index}/100`,
              description: `Compared with ${termBau.human_welfare_index}/100 under business as usual.`,
              icon: <Sparkles className="h-4 w-4" />,
            },
            {
              label: "Resources left",
              value: `${termYour.nonrenewable_resources}%`,
              description: `Business as usual ends at ${termBau.nonrenewable_resources}%.`,
              icon: <Leaf className="h-4 w-4" />,
            },
            {
              label: "Population",
              value: `${termYour.population}B`,
              description: `Life expectancy reaches ${termYour.life_expectancy} years in this run.`,
              icon: <Globe2 className="h-4 w-4" />,
            },
          ]}
        />
      </IllustratedTabHero>

      <SimulatorPrimer
        aside="A good first exercise is to keep business as usual in view while you move only one or two levers. World3 becomes much easier to understand when you compare trajectories rather than chasing one ideal future in a single jump."
        items={[
          {
            title: "Look for delays, not instant reactions.",
            text: "In World3, policies often help at first and hurt later, or seem weak at first and matter decades later. The most important part of the model is the lag between cause and visible effect.",
          },
          {
            title: "Watch welfare against material pressure.",
            text: "A run can increase output for a while while still eroding long-run welfare through pollution, depletion, or food stress. Rising production is not the same as a stable civilization.",
          },
          {
            title: "Use the chart tabs as one system seen from many angles.",
            text: "Population, industrial output, resources, food, and pollution are not separate stories. Turning points usually appear across several lines at once, which is why comparison matters so much here.",
          },
        ]}
        summary="World3 is the atlas flagship because it teaches the pattern underneath many civic crises: feedback loops, delays, overshoot, and tradeoffs between short-term gains and long-term stability. The point is not narrow prediction, but systems intuition."
        title="Read World3 as a civilization pattern"
      />

      <section className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset, idx) => {
            const active = currentPresetIndex === idx;
            return (
              <button
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-semibold transition",
                  active
                    ? "border-[rgba(59,130,246,0.22)] bg-[rgba(59,130,246,0.12)] text-[rgb(var(--atlas-primary))]"
                    : "border-[rgba(28,36,48,0.08)] bg-white/85 text-slate-600 hover:border-[rgba(28,36,48,0.16)] hover:text-slate-900",
                )}
                key={preset.label}
                onClick={() => loadPreset(idx)}
                type="button"
              >
                {preset.label}
              </button>
            );
          })}
          {isModified && currentPresetIndex === -1 ? (
            <span className="inline-flex items-center rounded-full border border-[rgba(212,168,79,0.22)] bg-[rgba(212,168,79,0.1)] px-4 py-2 text-sm font-semibold text-[rgb(var(--atlas-gold))]">
              Custom scenario
            </span>
          ) : null}
        </div>
        <p className="max-w-4xl text-sm leading-6 text-slate-600 dark:text-slate-300">{driverSummary}</p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]" id="world3-lab">
        <div className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <SoftPanel className="space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="atlas-kicker">Variables</p>
                <h2 className="atlas-display text-2xl text-slate-900">Shape the future</h2>
              </div>
              {isModified ? (
                <button
                  className="rounded-full border border-[rgba(28,36,48,0.12)] px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
                  onClick={() => setCustomParams({ ...BASE })}
                  type="button"
                >
                  Reset all
                </button>
              ) : null}
            </div>

            <div className="space-y-5">
              {primarySliders.map((slider) => {
                const value = customParams[slider.key] as number;
                return (
                  <label className="block" key={slider.key}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                        {slider.icon} {slider.label}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--atlas-primary))]">
                        {formatSliderValue(slider, value)}
                      </span>
                    </div>
                    <input
                      className="h-2 w-full cursor-pointer accent-[rgb(var(--atlas-primary))]"
                      max={slider.max}
                      min={slider.min}
                      onChange={(event) => setParam(slider.key, Number(event.target.value))}
                      step={slider.step}
                      type="range"
                      value={value}
                    />
                    <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{slider.tooltip}</p>
                  </label>
                );
              })}
            </div>
          </SoftPanel>

          <SoftPanel className="space-y-4" tone="blue">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="atlas-kicker">Run settings</p>
                <h3 className="atlas-display text-2xl text-slate-900">Scope of the forecast</h3>
              </div>
              <FlaskConical className="h-5 w-5 text-[rgb(var(--atlas-primary))]" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">End year</span>
                <select
                  className="w-full rounded-[1rem] border border-[rgba(28,36,48,0.1)] bg-white px-3 py-3 text-sm text-slate-800 outline-none transition focus:border-[rgba(59,130,246,0.25)] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  onChange={(event) => setEndYear(Number(event.target.value))}
                  value={endYear}
                >
                  {[2050, 2075, 2100, 2150].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>
              <div className="rounded-[1rem] border border-[rgba(28,36,48,0.08)] bg-white/75 px-4 py-3 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
                The forecast updates live as you move the sliders, so you can see turning points as soon as they appear.
              </div>
            </div>

            <details className="rounded-[1.25rem] border border-[rgba(28,36,48,0.08)] bg-white/78 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70">
              <summary className="cursor-pointer list-none text-sm font-semibold text-slate-800 dark:text-slate-100">
                Advanced assumptions
              </summary>
              <div className="mt-4 space-y-4">
                {secondarySliders.map((slider) => {
                  const value = customParams[slider.key] as number;
                  return (
                    <label className="block" key={slider.key}>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                          {slider.icon} {slider.label}
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          {formatSliderValue(slider, value)}
                        </span>
                      </div>
                      <input
                        className="h-2 w-full cursor-pointer accent-[rgb(var(--atlas-gold))]"
                        max={slider.max}
                        min={slider.min}
                        onChange={(event) => setParam(slider.key, Number(event.target.value))}
                        step={slider.step}
                        type="range"
                        value={value}
                      />
                      <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{slider.tooltip}</p>
                    </label>
                  );
                })}
              </div>
            </details>
          </SoftPanel>
        </div>

        <div className="space-y-5">
          <SoftPanel className="space-y-5 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-2">
                <p className="atlas-kicker">Chart focus</p>
                <div className="flex flex-wrap gap-2">
                  {TABS.map((item) => (
                    <button
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm font-semibold transition",
                        tab === item.id
                          ? "border-[rgba(59,130,246,0.22)] bg-[rgba(59,130,246,0.12)] text-[rgb(var(--atlas-primary))]"
                          : "border-[rgba(28,36,48,0.08)] bg-white/80 text-slate-600 hover:border-[rgba(28,36,48,0.16)] hover:text-slate-900",
                      )}
                      key={item.id}
                      onClick={() => setTab(item.id)}
                      type="button"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-full border border-[rgba(28,36,48,0.08)] bg-white/75 px-4 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
                Comparing against <span className="font-semibold text-slate-900 dark:text-slate-100">Business as usual</span>
              </div>
            </div>

            {tab === "overview" ? (
              <ChartPanel
                description="The overview normalizes the main variables so you can read the broad system pattern at a glance."
                height={430}
                title="Global outcomes over time"
              >
                <LineChart data={overviewData}>
                  <CartesianGrid {...gridProps} />
                  <XAxis {...xAxisProps} />
                  <YAxis {...yAxisProps} domain={[0, 100]} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend {...legendProps} />
                  <Line activeDot={{ r: 4 }} dataKey="population" dot={false} name="Population" stroke="#3b82f6" strokeWidth={2.4} type="monotone" />
                  <Line activeDot={{ r: 4 }} dataKey="industrial" dot={false} name="Industrial output" stroke="#f97316" strokeWidth={2.4} type="monotone" />
                  <Line activeDot={{ r: 4 }} dataKey="food" dot={false} name="Food per capita" stroke="#10b981" strokeWidth={2.4} type="monotone" />
                  <Line activeDot={{ r: 4 }} dataKey="pollution" dot={false} name="Pollution" stroke="#d946ef" strokeWidth={2.4} type="monotone" />
                  <Line activeDot={{ r: 4 }} dataKey="resources" dot={false} name="Resources" stroke="#f59e0b" strokeWidth={2.4} type="monotone" />
                  <Line activeDot={{ r: 4 }} dataKey="welfare" dot={false} name="Welfare index" stroke="#14b8a6" strokeWidth={2.4} type="monotone" />
                </LineChart>
              </ChartPanel>
            ) : null}

            {tab === "population" ? (
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
                <ChartPanel description="Population stays higher when food, health, and output keep expanding together." title="Population trajectory">
                  <LineChart data={chartData}>
                    {renderLines("pop")}
                    {todayLine}
                    <CartesianGrid {...gridProps} />
                    <XAxis {...xAxisProps} />
                    <YAxis {...yAxisProps} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend {...legendProps} />
                  </LineChart>
                </ChartPanel>
                <ChartPanel description="Health and services matter because they delay mortality shocks and support welfare." title="Life expectancy">
                  <LineChart data={chartData}>
                    {renderLines("le")}
                    {todayLine}
                    <CartesianGrid {...gridProps} />
                    <XAxis {...xAxisProps} />
                    <YAxis {...yAxisProps} domain={[20, 95]} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend {...legendProps} />
                  </LineChart>
                </ChartPanel>
              </div>
            ) : null}

            {tab === "industrial" ? (
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
                <ChartPanel description="Industrial output rises when capital, resources, and pollution constraints stay aligned." title="Industrial output per capita">
                  <LineChart data={chartData}>
                    {renderLines("iop")}
                    {todayLine}
                    <CartesianGrid {...gridProps} />
                    <XAxis {...xAxisProps} />
                    <YAxis {...yAxisProps} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend {...legendProps} />
                  </LineChart>
                </ChartPanel>
                <ChartPanel description="Welfare is broader than output. It combines health, food, and living standards." title="Welfare index">
                  <AreaChart data={chartData}>
                    {renderAreas("hwi")}
                    {todayLine}
                    <CartesianGrid {...gridProps} />
                    <XAxis {...xAxisProps} />
                    <YAxis {...yAxisProps} domain={[0, 100]} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend {...legendProps} />
                  </AreaChart>
                </ChartPanel>
              </div>
            ) : null}

            {tab === "food" ? (
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
                <ChartPanel description="Food per capita weakens when land, resources, and pollution no longer support agricultural productivity." title="Food per capita">
                  <AreaChart data={chartData}>
                    {renderAreas("food")}
                    {todayLine}
                    <CartesianGrid {...gridProps} />
                    <XAxis {...xAxisProps} />
                    <YAxis {...yAxisProps} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend {...legendProps} />
                  </AreaChart>
                </ChartPanel>
                <ChartPanel description="This overlay makes the agriculture versus pollution tension explicit inside your current run." title="Food and pollution together">
                  <LineChart data={chartData}>
                    <Line activeDot={{ r: 4 }} dataKey="Your_food" dot={false} name="Food" stroke="#10b981" strokeWidth={2.2} type="monotone" />
                    <Line activeDot={{ r: 4 }} dataKey="Your_poll" dot={false} name="Pollution" stroke="#ef4444" strokeWidth={2.2} type="monotone" />
                    {todayLine}
                    <CartesianGrid {...gridProps} />
                    <XAxis {...xAxisProps} />
                    <YAxis {...yAxisProps} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend {...legendProps} />
                  </LineChart>
                </ChartPanel>
              </div>
            ) : null}

            {tab === "pollution" ? (
              <ChartPanel description="Pollution does not just rise directly from industry. It also feeds back through health and food, weakening the rest of the system." height={420} title="Pollution index">
                <LineChart data={chartData}>
                  {renderLines("poll")}
                  {todayLine}
                  <CartesianGrid {...gridProps} />
                  <XAxis {...xAxisProps} />
                  <YAxis {...yAxisProps} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend {...legendProps} />
                </LineChart>
              </ChartPanel>
            ) : null}

            {tab === "resources" ? (
              <ChartPanel description="Resources fall more slowly when efficiency improves or when the system stabilizes before chasing every last unit of output." height={420} title="Nonrenewable resources remaining">
                <AreaChart data={chartData}>
                  {renderAreas("nr")}
                  {todayLine}
                  <CartesianGrid {...gridProps} />
                  <XAxis {...xAxisProps} />
                  <YAxis {...yAxisProps} domain={[0, 100]} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend {...legendProps} />
                </AreaChart>
              </ChartPanel>
            ) : null}

            {tab === "welfare" ? (
              <ChartPanel description="Welfare rises when food, health, and material output reinforce each other instead of forcing tradeoffs too early." height={420} title="Human welfare index">
                <AreaChart data={chartData}>
                  {renderAreas("hwi")}
                  {todayLine}
                  <CartesianGrid {...gridProps} />
                  <XAxis {...xAxisProps} />
                  <YAxis {...yAxisProps} domain={[0, 100]} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend {...legendProps} />
                </AreaChart>
              </ChartPanel>
            ) : null}
          </SoftPanel>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <OutcomeMetric label="Year" value={String(endYear)} detail="The end-state snapshot below the main chart." />
            <OutcomeMetric label="Population" value={`${termYour.population}B`} detail="Business as usual baseline" delta={<DeltaBadge baseline={termBau.population} value={termYour.population} />} />
            <OutcomeMetric label="Industrial output" value={`${termYour.industrial_output_pc}`} detail="Per-capita output index" delta={<DeltaBadge baseline={termBau.industrial_output_pc} value={termYour.industrial_output_pc} />} />
            <OutcomeMetric label="Food per capita" value={`${termYour.food_per_capita}`} detail="Agricultural sufficiency index" delta={<DeltaBadge baseline={termBau.food_per_capita} value={termYour.food_per_capita} />} />
            <OutcomeMetric label="Pollution" value={`${termYour.pollution}`} detail="Lower is better" delta={<DeltaBadge baseline={termBau.pollution} lowerIsBetter value={termYour.pollution} />} />
            <OutcomeMetric label="Welfare index" value={`${termYour.human_welfare_index}/100`} detail="Combined life, food, and income outcome" delta={<DeltaBadge baseline={termBau.human_welfare_index} value={termYour.human_welfare_index} />} />
          </div>
        </div>
      </section>

      <SectionNarrative
        className="pt-4"
        description="World3 matters because it links economic growth, population, food, resources, and pollution into one system. The key question is not whether growth exists, but whether reinforcing loops hit balancing limits before societies redesign the path."
        eyebrow="Interpretation"
        side={
          <p>
            Based on the World3 system dynamics model from <em>Limits to Growth</em>. This is a simplified educational version, but the logic of interacting feedback loops is preserved.
          </p>
        }
        title="What this run is really showing"
      >
        <div className="grid gap-4 lg:grid-cols-3" id="world3-briefing">
          <InsightBlock
            description="Industrial growth is a reinforcing loop: more capital creates more output, which funds more capital. But it only looks stable while resources and ecological buffers still absorb the strain."
            icon={<LineChartIcon className="h-5 w-5" />}
            title="Growth loop"
            tone="blue"
          />
          <InsightBlock
            description="Resource depletion and pollution are balancing loops. They do not stop growth immediately, but once they bite, they drag down food, health, and output together."
            icon={<Leaf className="h-5 w-5" />}
            title="Limits loop"
            tone="gold"
          />
          <InsightBlock
            description="Education, healthcare, and cleaner production matter because they help the system peak later and softer, rather than racing into overshoot and collapse dynamics."
            icon={<SlidersHorizontal className="h-5 w-5" />}
            title="Stabilization loop"
            tone="green"
          />
        </div>
      </SectionNarrative>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <SoftPanel className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="atlas-kicker">Scenarios</p>
              <h2 className="atlas-display text-3xl text-slate-900">Compare futures at a glance</h2>
            </div>
            <span className="rounded-full border border-[rgba(28,36,48,0.08)] px-4 py-2 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
              Toggle lines directly from the table
            </span>
          </div>

          <div className="overflow-hidden rounded-[1.6rem] border border-[rgba(28,36,48,0.08)]">
            <div className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,0.75fr)_minmax(0,0.75fr)_auto] gap-3 bg-[rgba(246,244,238,0.82)] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:bg-slate-900/70">
              <span>Scenario</span>
              <span>Resources</span>
              <span>Welfare</span>
              <span>Overlay</span>
            </div>
            {scenarioSnapshots.map((scenario, idx) => (
              <div
                className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,0.75fr)_minmax(0,0.75fr)_auto] items-center gap-3 border-t border-[rgba(28,36,48,0.08)] bg-white/88 px-4 py-4 dark:border-slate-800 dark:bg-slate-950/75"
                key={scenario.label}
              >
                <button className="text-left" onClick={() => loadPreset(idx)} type="button">
                  <p className="text-sm font-semibold" style={{ color: scenario.color }}>
                    {scenario.label}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{scenario.description}</p>
                </button>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{scenario.terminal.nonrenewable_resources}%</span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{scenario.terminal.human_welfare_index}/100</span>
                <button
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                    idx === 0
                      ? "border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.7)] text-slate-400"
                      : activePresets.includes(idx)
                        ? "border-[rgba(59,130,246,0.2)] bg-[rgba(59,130,246,0.12)] text-[rgb(var(--atlas-primary))]"
                        : "border-[rgba(28,36,48,0.12)] bg-white text-slate-600 hover:border-[rgba(28,36,48,0.2)] hover:text-slate-900",
                  )}
                  disabled={idx === 0}
                  onClick={() => togglePreset(idx)}
                  type="button"
                >
                  {idx === 0 ? "Base" : activePresets.includes(idx) ? "Visible" : "Compare"}
                </button>
              </div>
            ))}
          </div>
        </SoftPanel>

        <SoftPanel className="space-y-4" tone="gold">
          <div>
            <p className="atlas-kicker">Feedback loops</p>
            <h2 className="atlas-display text-3xl text-slate-900">The logic underneath the chart</h2>
          </div>
          {[
            {
              label: "R1 — Industrial growth",
              desc: "Capital creates output, output funds investment, and investment creates more capital.",
            },
            {
              label: "B1 — Resource depletion",
              desc: "Higher output consumes resources faster, so later growth becomes harder to sustain.",
            },
            {
              label: "B2 — Pollution sink",
              desc: "Industry and agriculture create pollution, which pushes back through health and food.",
            },
            {
              label: "B3 — Demographic transition",
              desc: "Welfare, education, and health eventually lower birth rates and stabilize population pressure.",
            },
          ].map((loop) => (
            <div className="rounded-[1.35rem] border border-[rgba(28,36,48,0.08)] bg-white/70 px-4 py-4 dark:border-slate-700 dark:bg-slate-900/65" key={loop.label}>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{loop.label}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{loop.desc}</p>
            </div>
          ))}
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold text-[rgb(var(--atlas-primary))] transition hover:text-slate-900"
            href="/learn/how-pollution-builds-up-until-systems-tip"
          >
            Continue into the ecology lessons
            <ArrowRight className="h-4 w-4" />
          </Link>
        </SoftPanel>
      </div>
    </AtlasPage>
  );
}
