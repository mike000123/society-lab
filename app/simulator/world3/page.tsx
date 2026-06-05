"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import {
  ArrowRight,
  BookmarkPlus,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  Globe2,
  Info,
  LineChart as LineChartIcon,
  MoreHorizontal,
  Play,
  Share2,
} from "lucide-react";
import {
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
import { SoftPanel } from "@/components/atlas/SoftPanel";
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
  lastRun: string;
  params: ScenarioParams;
}

const PRESETS: Preset[] = [
  {
    label: "Business as Usual",
    description: "Current trends continue.",
    color: "#2563eb",
    lastRun: "2 hours ago",
    params: { ...BASE },
  },
  {
    label: "Welfare Economy",
    description: "Focus on wellbeing and equity.",
    color: "#14b8a6",
    lastRun: "1 day ago",
    params: {
      ...BASE,
      resourceEfficiency: 1.25,
      pollutionControl: 0.45,
      landYieldTech: 1.15,
      fertilityControl: 0.45,
      mortalityReduction: 1.18,
      serviceCapitalPriority: 1.45,
    },
  },
  {
    label: "Green Technology",
    description: "High investment in clean tech.",
    color: "#22c55e",
    lastRun: "3 days ago",
    params: {
      ...BASE,
      resourceEfficiency: 1.95,
      pollutionControl: 0.72,
      pollutionAbsorption: 1.55,
      landYieldTech: 1.45,
      erosionControl: 0.55,
      mortalityReduction: 1.08,
      serviceCapitalPriority: 1.12,
    },
  },
  {
    label: "Resource Scarcity",
    description: "Low resource availability.",
    color: "#f59e0b",
    lastRun: "5 days ago",
    params: {
      ...BASE,
      resourceEfficiency: 0.9,
      resourceReserveMultiplier: 0.72,
      pollutionControl: 0.18,
      pollutionAbsorption: 0.95,
      landYieldTech: 1.02,
      serviceCapitalPriority: 0.95,
    },
  },
  {
    label: "High Equality",
    description: "Strong redistribution policies.",
    color: "#a855f7",
    lastRun: "1 week ago",
    params: {
      ...BASE,
      resourceEfficiency: 1.22,
      pollutionControl: 0.55,
      fertilityControl: 0.76,
      landYieldTech: 1.12,
      mortalityReduction: 1.24,
      serviceCapitalPriority: 1.58,
    },
  },
  {
    label: "Collapse Prevention",
    description: "Coordinated long-term stabilisation.",
    color: "#0f172a",
    lastRun: "1 week ago",
    params: {
      resourceEfficiency: 2.25,
      resourceReserveMultiplier: 1.15,
      pollutionControl: 1,
      pollutionAbsorption: 1.95,
      landYieldTech: 1.55,
      erosionControl: 1,
      fertilityControl: 1,
      mortalityReduction: 1.28,
      industrialDepreciation: 0.82,
      serviceCapitalPriority: 1.64,
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
    <div className="rounded-[1.6rem] border border-[rgba(28,36,48,0.08)] bg-white px-5 py-5 shadow-[0_14px_28px_rgba(28,36,48,0.05)] dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mb-4 space-y-1">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{title}</h3>
        {description ? <p className="text-sm leading-6 text-slate-500 dark:text-slate-300">{description}</p> : null}
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

function ScenarioSparkline({
  values,
  color,
}: {
  values: number[];
  color: string;
}) {
  if (!values.length) return null;

  const width = 72;
  const height = 22;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg aria-hidden="true" className="h-6 w-[4.5rem]" viewBox={`0 0 ${width} ${height}`}>
      <polyline fill="none" points={points} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
    </svg>
  );
}

function World3SystemSketch() {
  const nodes = [
    { label: "Population", className: "left-6 top-6" },
    { label: "Resources", className: "left-2 top-1/2 -translate-y-1/2" },
    { label: "Food", className: "left-10 bottom-5" },
    { label: "Pollution", className: "right-6 top-7" },
    { label: "Welfare", className: "right-2 top-1/2 -translate-y-1/2" },
    { label: "Economy", className: "right-10 bottom-5" },
  ];

  return (
    <div className="relative mx-auto h-40 w-full max-w-[18rem] overflow-hidden rounded-[1.25rem] border border-[rgba(28,36,48,0.06)] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12),transparent_58%)]">
      <div className="absolute inset-[25%] rounded-full border border-[rgba(28,36,48,0.08)] bg-[radial-gradient(circle_at_35%_35%,rgba(246,244,238,0.9),rgba(231,226,214,0.65))]" />
      <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(28,36,48,0.08)] bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.9),rgba(234,228,216,0.75))] text-center shadow-[0_8px_16px_rgba(28,36,48,0.06)]">
        <div className="flex h-full items-center justify-center text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          World3
        </div>
      </div>
      {nodes.map((node) => (
        <div
          key={node.label}
          className={cn(
            "absolute rounded-full border border-[rgba(28,36,48,0.08)] bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-600 shadow-[0_8px_16px_rgba(28,36,48,0.05)]",
            node.className,
          )}
        >
          {node.label}
        </div>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function SimulatorPage() {
  const [customParams, setCustomParams] = useState<ScenarioParams>({ ...BASE });
  const [tab, setTab] = useState<TabId>("overview");
  const [endYear, setEndYear] = useState(2225);
  const [displayStep, setDisplayStep] = useState(5);
  const [showAdvanced, setShowAdvanced] = useState(false);
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
    for (let y = 2025; y <= endYear; y += displayStep) years.push(y);
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
  }, [bauData, yourData, presetData, activePresets, endYear, displayStep]);

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
  const snapshotYear = endYear >= 2075 ? 2075 : endYear;
  const comparisonYear = endYear >= 2100 ? 2100 : endYear;
  const snapBau = bauData.find((state) => state.year === snapshotYear) ?? termBau;
  const snapYour = yourData.find((state) => state.year === snapshotYear) ?? termYour;

  // Check if custom differs from BAU
  const isModified = JSON.stringify(customParams) !== JSON.stringify(BASE);

  const currentPresetIndex = PRESETS.findIndex((preset) => JSON.stringify(preset.params) === JSON.stringify(customParams));
  const primarySliders = SLIDERS.filter((slider) => PRIMARY_SLIDER_KEYS.includes(slider.key));
  const secondarySliders = SLIDERS.filter((slider) => SECONDARY_SLIDER_KEYS.includes(slider.key));

  const scenarioSnapshots = useMemo(
    () =>
      PRESETS.map((preset) => {
        const result = runWorld3(preset.params, endYear);
        const comparison = result.find((state) => state.year === comparisonYear) ?? result[result.length - 1];
        const terminal = result.find((state) => state.year === endYear) ?? result[result.length - 1];
        return { ...preset, comparison, terminal, sparkline: result.filter((state) => state.year >= 2025 && state.year % 20 === 5).map((state) => state.human_welfare_index) };
      }),
    [comparisonYear, endYear],
  );

  const tabMeta: Record<TabId, { title: string; description: string; suffix?: string; overview?: boolean; yDomain?: [number, number] }> = {
    overview: {
      title: "Global Outcomes Over Time",
      description: "Normalized indices let you read the whole system at a glance.",
      overview: true,
    },
    population: {
      title: "Population",
      description: "Population grows when food, health, and output stay in balance.",
      suffix: "pop",
    },
    industrial: {
      title: "Industrial Output",
      description: "Per-capita output rises until resource and pollution constraints begin to bite.",
      suffix: "iop",
    },
    food: {
      title: "Food per Capita",
      description: "Food pressure usually reveals the first signs of overshoot.",
      suffix: "food",
    },
    pollution: {
      title: "Pollution",
      description: "Pollution accumulates with delay, then feeds back through health and food.",
      suffix: "poll",
    },
    resources: {
      title: "Resources",
      description: "Remaining nonrenewable resources show how fast the system burns through its base.",
      suffix: "nr",
      yDomain: [0, 100],
    },
    welfare: {
      title: "Welfare Index",
      description: "Welfare combines life expectancy, food sufficiency, and material living standards.",
      suffix: "hwi",
      yDomain: [0, 100],
    },
  };

  const activeTab = tabMeta[tab];

  return (
    <AtlasPage className="space-y-6 pb-12">
      <section className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <Link className="transition hover:text-slate-600" href="/simulator">
                Simulate
              </Link>
              <span>/</span>
              <span className="text-slate-500">World3 Civilization Simulator</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="atlas-display text-4xl text-slate-900 sm:text-5xl">World3 Civilization Simulator</h1>
              <span className="rounded-full border border-[rgba(59,130,246,0.14)] bg-[rgba(59,130,246,0.08)] px-3 py-1 text-xs font-semibold text-[rgb(var(--atlas-primary))]">
                Intermediate
              </span>
            </div>

            <p className="max-w-3xl text-sm leading-6 text-slate-600">
              Explore 200 years of civilization. Adjust key drivers and see how the world evolves. Compare different futures and discover turning points.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button className="rounded-full px-4 text-slate-600" size="sm" variant="ghost">
              <Info className="mr-2 h-4 w-4" />
              Guide
            </Button>
            <Button asChild className="rounded-full px-4 text-slate-600" size="sm" variant="ghost">
              <Link href="/learn/how-pollution-builds-up-until-systems-tip">
                <CircleHelp className="mr-2 h-4 w-4" />
                About World3
              </Link>
            </Button>
            <Button className="rounded-full px-4 text-slate-600" size="sm" variant="ghost">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button className="rounded-full px-5" size="sm">
              <BookmarkPlus className="mr-2 h-4 w-4" />
              Save Scenario
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset, idx) => {
            const active = currentPresetIndex === idx;
            return (
              <button
                className={cn(
                  "rounded-[0.95rem] border px-4 py-2 text-sm font-semibold transition",
                  active
                    ? "border-[rgba(59,130,246,0.18)] bg-[rgb(var(--atlas-primary))] text-white shadow-[0_12px_24px_rgba(59,130,246,0.18)]"
                    : "border-[rgba(28,36,48,0.08)] bg-white text-slate-600 hover:border-[rgba(28,36,48,0.16)] hover:text-slate-900",
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
            <span className="inline-flex items-center rounded-[0.95rem] border border-[rgba(212,168,79,0.2)] bg-[rgba(212,168,79,0.1)] px-4 py-2 text-sm font-semibold text-[rgb(var(--atlas-gold))]">
              Custom scenario
            </span>
          ) : null}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[270px_minmax(0,1fr)]" id="world3-lab">
        <div className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <SoftPanel className="space-y-5 border-[rgba(28,36,48,0.08)] bg-white px-5 py-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-slate-900">Variables</p>
              </div>
              <button
                className="text-sm font-medium text-slate-400 transition hover:text-slate-700"
                onClick={() => setCustomParams({ ...BASE })}
                type="button"
              >
                Reset all
              </button>
            </div>

            <div className="space-y-4">
              {primarySliders.map((slider) => {
                const value = customParams[slider.key] as number;
                return (
                  <label className="block space-y-2" key={slider.key}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                        {slider.label}
                        <span title={slider.tooltip}>
                          <CircleHelp className="h-3.5 w-3.5 text-slate-400" />
                        </span>
                      </span>
                      <span className="text-sm font-semibold text-slate-700">{formatSliderValue(slider, value)}</span>
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
                  </label>
                );
              })}
            </div>

            <button
              className="inline-flex items-center gap-2 rounded-[0.95rem] border border-[rgba(28,36,48,0.08)] px-4 py-2 text-sm font-medium text-[rgb(var(--atlas-primary))] transition hover:border-[rgba(59,130,246,0.18)] hover:bg-[rgba(59,130,246,0.04)]"
              onClick={() => setShowAdvanced((prev) => !prev)}
              type="button"
            >
              {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {showAdvanced ? "Hide advanced variables" : "Add custom variable"}
            </button>

            {showAdvanced ? (
              <div className="space-y-4 rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.6)] px-4 py-4">
                {secondarySliders.map((slider) => {
                  const value = customParams[slider.key] as number;
                  return (
                    <label className="block space-y-2" key={slider.key}>
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                          {slider.label}
                          <span title={slider.tooltip}>
                            <CircleHelp className="h-3.5 w-3.5 text-slate-400" />
                          </span>
                        </span>
                        <span className="text-sm font-semibold text-slate-700">{formatSliderValue(slider, value)}</span>
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
                    </label>
                  );
                })}
              </div>
            ) : null}
          </SoftPanel>

          <SoftPanel className="space-y-4 border-[rgba(28,36,48,0.08)] bg-white px-5 py-5">
            <p className="text-lg font-semibold text-slate-900">Run settings</p>

            <div className="space-y-3">
              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Time horizon</span>
                <select
                  className="w-full rounded-[0.95rem] border border-[rgba(28,36,48,0.1)] bg-white px-3 py-3 text-sm text-slate-800 outline-none transition focus:border-[rgba(59,130,246,0.25)]"
                  onChange={(event) => setEndYear(Number(event.target.value))}
                  value={endYear}
                >
                  <option value={2125}>100 years</option>
                  <option value={2175}>150 years</option>
                  <option value={2225}>200 years</option>
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Start year</span>
                <input
                  className="w-full rounded-[0.95rem] border border-[rgba(28,36,48,0.1)] bg-[rgba(246,244,238,0.5)] px-3 py-3 text-sm text-slate-500 outline-none"
                  readOnly
                  type="text"
                  value="2025"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Time step</span>
                <select
                  className="w-full rounded-[0.95rem] border border-[rgba(28,36,48,0.1)] bg-white px-3 py-3 text-sm text-slate-800 outline-none transition focus:border-[rgba(59,130,246,0.25)]"
                  onChange={(event) => setDisplayStep(Number(event.target.value))}
                  value={displayStep}
                >
                  <option value={1}>1 year</option>
                  <option value={5}>5 years</option>
                  <option value={10}>10 years</option>
                </select>
              </label>
            </div>

            <Button
              className="w-full rounded-[1rem] py-6 text-base"
              onClick={() => setCustomParams((prev) => ({ ...prev }))}
              type="button"
            >
              <Play className="mr-2 h-4 w-4" />
              Run Simulation
            </Button>
          </SoftPanel>
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.6rem] border border-[rgba(28,36,48,0.08)] bg-white px-5 py-5 shadow-[0_14px_28px_rgba(28,36,48,0.05)]">
            <div className="flex flex-wrap items-center gap-2 border-b border-[rgba(28,36,48,0.08)] pb-4">
              {TABS.map((item) => (
                <button
                  className={cn(
                    "rounded-full px-3 py-2 text-sm font-semibold transition",
                    tab === item.id
                      ? "bg-[rgba(59,130,246,0.08)] text-[rgb(var(--atlas-primary))]"
                      : "text-slate-500 hover:bg-[rgba(246,244,238,0.85)] hover:text-slate-900",
                  )}
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="pt-5">
              <ChartPanel description={activeTab.description} height={420} title={activeTab.title}>
                {tab === "overview" ? (
                  <LineChart data={overviewData}>
                    <CartesianGrid {...gridProps} />
                    <XAxis {...xAxisProps} />
                    <YAxis {...yAxisProps} domain={[0, 100]} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend {...legendProps} />
                    <Line activeDot={{ r: 4 }} dataKey="population" dot={false} name="Population" stroke="#2563eb" strokeWidth={2.4} type="monotone" />
                    <Line activeDot={{ r: 4 }} dataKey="industrial" dot={false} name="Industrial Output" stroke="#ef4444" strokeWidth={2.4} type="monotone" />
                    <Line activeDot={{ r: 4 }} dataKey="food" dot={false} name="Food per Capita" stroke="#22c55e" strokeWidth={2.4} type="monotone" />
                    <Line activeDot={{ r: 4 }} dataKey="pollution" dot={false} name="Pollution" stroke="#a855f7" strokeWidth={2.4} type="monotone" />
                    <Line activeDot={{ r: 4 }} dataKey="resources" dot={false} name="Resources" stroke="#f59e0b" strokeWidth={2.4} type="monotone" />
                    <Line activeDot={{ r: 4 }} dataKey="welfare" dot={false} name="Welfare Index" stroke="#14b8a6" strokeWidth={2.4} type="monotone" />
                  </LineChart>
                ) : (
                  <LineChart data={chartData}>
                    {renderLines(activeTab.suffix!)}
                    {todayLine}
                    <CartesianGrid {...gridProps} />
                    <XAxis {...xAxisProps} />
                    <YAxis {...yAxisProps} domain={activeTab.yDomain} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend {...legendProps} />
                  </LineChart>
                )}
              </ChartPanel>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
            <OutcomeMetric label="Year" value={String(snapshotYear)} />
            <OutcomeMetric label="Population" value={`${snapYour.population}B`} delta={<DeltaBadge baseline={snapBau.population} value={snapYour.population} />} />
            <OutcomeMetric label="Industrial Output" value={`${snapYour.industrial_output_pc}/100`} delta={<DeltaBadge baseline={snapBau.industrial_output_pc} value={snapYour.industrial_output_pc} />} />
            <OutcomeMetric label="Food per Capita" value={`${snapYour.food_per_capita}/100`} delta={<DeltaBadge baseline={snapBau.food_per_capita} value={snapYour.food_per_capita} />} />
            <OutcomeMetric label="Pollution" value={`${snapYour.pollution}/100`} delta={<DeltaBadge baseline={snapBau.pollution} lowerIsBetter value={snapYour.pollution} />} />
            <OutcomeMetric label="Welfare Index" value={`${snapYour.human_welfare_index}/100`} delta={<DeltaBadge baseline={snapBau.human_welfare_index} value={snapYour.human_welfare_index} />} />
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="rounded-[1.4rem] border border-[rgba(28,36,48,0.08)] bg-white px-5 py-5 shadow-[0_12px_22px_rgba(28,36,48,0.04)]">
              <div className="mb-3 flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-[rgb(var(--atlas-primary))]" />
                <p className="text-lg font-semibold text-slate-900">What is World3?</p>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-slate-600">
                World3 is a dynamic model developed by the Club of Rome to explore long-term interactions between population, economy, food, pollution, resources, and wellbeing.
              </p>
              <Link
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[rgb(var(--atlas-primary))] transition hover:text-slate-900"
                href="/learn/how-pollution-builds-up-until-systems-tip"
              >
                Learn more
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-[1.4rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4 shadow-[0_12px_22px_rgba(28,36,48,0.04)]">
              <World3SystemSketch />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[1.6rem] border border-[rgba(28,36,48,0.08)] bg-white px-5 py-5 shadow-[0_16px_28px_rgba(28,36,48,0.05)]">
        <div className="flex flex-col gap-3 border-b border-[rgba(28,36,48,0.08)] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Scenarios</h2>
            <p className="text-sm text-slate-500">Compare your current run with other scenarios.</p>
          </div>
          <Button className="rounded-full px-4" size="sm" variant="outline">
            + New Scenario
          </Button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <div className="min-w-[940px]">
            <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1.2fr)_140px_120px_90px_100px] gap-4 px-2 pb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              <span>Scenario</span>
              <span>Description</span>
              <span>Last run</span>
              <span>Welfare index ({comparisonYear})</span>
              <span className="text-center">Trend</span>
              <span className="text-right">Actions</span>
            </div>

            {scenarioSnapshots.map((scenario, idx) => {
              const overlayVisible = activePresets.includes(idx);
              const overlayDisabled = idx === 0;
              const trendColor =
                scenario.comparison.human_welfare_index >= termBau.human_welfare_index ? "#22c55e" : "#ef4444";

              return (
                <div
                  className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1.2fr)_140px_120px_90px_100px] items-center gap-4 border-t border-[rgba(28,36,48,0.08)] px-2 py-4"
                  key={scenario.label}
                >
                  <button className="flex items-center gap-3 text-left" onClick={() => loadPreset(idx)} type="button">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: scenario.color }} />
                    <span className="text-sm font-semibold text-slate-800">{scenario.label}</span>
                  </button>

                  <p className="text-sm text-slate-500">{scenario.description}</p>
                  <span className="text-sm text-slate-500">{scenario.lastRun}</span>
                  <span className="text-sm font-semibold text-slate-800">{Math.round(scenario.comparison.human_welfare_index)}/100</span>
                  <div className="flex justify-center">
                    <ScenarioSparkline color={trendColor} values={scenario.sparkline} />
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <button
                      className={cn(
                        "rounded-full border p-2 transition",
                        overlayDisabled
                          ? "cursor-default border-[rgba(28,36,48,0.08)] text-slate-300"
                          : overlayVisible
                            ? "border-[rgba(59,130,246,0.18)] bg-[rgba(59,130,246,0.08)] text-[rgb(var(--atlas-primary))]"
                            : "border-[rgba(28,36,48,0.1)] text-slate-500 hover:border-[rgba(28,36,48,0.18)] hover:text-slate-900",
                      )}
                      disabled={overlayDisabled}
                      onClick={() => togglePreset(idx)}
                      title={overlayDisabled ? "Business as usual is always the baseline" : overlayVisible ? "Hide comparison line" : "Show comparison line"}
                      type="button"
                    >
                      <LineChartIcon className="h-4 w-4" />
                    </button>
                    <button
                      className="rounded-full border border-[rgba(28,36,48,0.1)] p-2 text-slate-500 transition hover:border-[rgba(28,36,48,0.18)] hover:text-slate-900"
                      onClick={() => loadPreset(idx)}
                      title="Load scenario"
                      type="button"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                    <button
                      className="rounded-full border border-[rgba(28,36,48,0.1)] p-2 text-slate-500 transition hover:border-[rgba(28,36,48,0.18)] hover:text-slate-900"
                      title="More actions"
                      type="button"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </AtlasPage>
  );
}
