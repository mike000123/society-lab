"use client";

import { useCallback, useMemo, useState } from "react";
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

const GROUPS = ["Resources", "Environment", "Population", "Food", "Welfare"];

type TabId = "overview" | "population" | "welfare" | "resources" | "food";
const TABS: { id: TabId; label: string }[] = [
  { id: "overview",    label: "Overview"    },
  { id: "population",  label: "Population"  },
  { id: "welfare",     label: "Welfare"     },
  { id: "resources",   label: "Resources"   },
  { id: "food",        label: "Food & Land" },
];

// ─── Custom tooltip ───────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { color: string; name: string; value: number }[];
  label?: number;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/95 px-4 py-3 text-xs shadow-xl">
      <p className="mb-2 font-bold text-slate-200">{label}</p>
      {payload.map((e) => (
        <p key={e.name} style={{ color: e.color }}>
          {e.name}: <span className="font-semibold">{e.value}</span>
        </p>
      ))}
    </div>
  );
}

// ─── Chart panel ─────────────────────────────────────────────────────────────
function ChartPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-panel p-4">
      <p className="mb-3 text-xs font-semibold text-slate-400">{title}</p>
      <ResponsiveContainer width="100%" height={220}>
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

  // Build chart data (every 5 years from 1970)
  const chartData = useMemo(() => {
    const years: number[] = [];
    for (let y = 1970; y <= endYear; y += 5) years.push(y);
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

  const gridProps = { strokeDasharray: "3 3", stroke: "#1e293b" };
  const xAxisProps = { dataKey: "year", tick: { fill: "#64748b", fontSize: 10 } };
  const yAxisProps = { tick: { fill: "#64748b", fontSize: 10 } };
  const legendProps = { wrapperStyle: { fontSize: 10 } };

  // Terminal snapshots
  const termBau  = bauData.find((s) => s.year === endYear)  ?? bauData[bauData.length - 1];
  const termYour = yourData.find((s) => s.year === endYear) ?? yourData[yourData.length - 1];

  // Check if custom differs from BAU
  const isModified = JSON.stringify(customParams) !== JSON.stringify(BASE);

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* Header */}
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/85 p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-emerald-400/12 via-emerald-400/4 to-transparent" />
        <div className="relative">
          <span className="inline-flex rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-100">
            World3 System Dynamics Model
          </span>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-50 sm:text-4xl">
            Civilisation Simulator
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
            Move the sliders to shape the future. See how policy and technology choices change the trajectory of population, welfare, and resources compared to business as usual.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Based on the World3 system dynamics model (Meadows et al., <em>Limits to Growth</em>). Educational simplification — the original has ~200 variables.
          </p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* ── Left: Charts ── */}
        <div className="space-y-4">
          {/* Tab bar + year range */}
          <div className="flex items-center gap-2">
            <div className="flex flex-1 gap-1 rounded-2xl border border-slate-800 bg-panel p-1.5">
              {TABS.map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex-1 rounded-xl py-1.5 text-xs font-medium transition-colors ${
                    tab === t.id ? "bg-slate-700 text-slate-50" : "text-slate-500 hover:text-slate-300"
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>
            <select value={endYear} onChange={(e) => setEndYear(Number(e.target.value))}
              className="rounded-xl border border-slate-800 bg-panel px-3 py-2 text-xs text-slate-300">
              {[2050, 2075, 2100, 2150].map((y) => <option key={y} value={y}>to {y}</option>)}
            </select>
          </div>

          {/* Charts */}
          {tab === "overview" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <ChartPanel title="Population (billions)">
                <LineChart data={chartData}>
                  {renderLines("pop")}{todayLine}
                  <CartesianGrid {...gridProps} /><XAxis {...xAxisProps} /><YAxis {...yAxisProps} />
                  <Tooltip content={<ChartTooltip />} /><Legend {...legendProps} />
                </LineChart>
              </ChartPanel>
              <ChartPanel title="Human Welfare Index (0–100)">
                <AreaChart data={chartData}>
                  {renderAreas("hwi")}{todayLine}
                  <CartesianGrid {...gridProps} /><XAxis {...xAxisProps} /><YAxis {...yAxisProps} domain={[0, 100]} />
                  <Tooltip content={<ChartTooltip />} /><Legend {...legendProps} />
                </AreaChart>
              </ChartPanel>
              <ChartPanel title="Nonrenewable Resources (% remaining)">
                <AreaChart data={chartData}>
                  {renderAreas("nr")}{todayLine}
                  <CartesianGrid {...gridProps} /><XAxis {...xAxisProps} /><YAxis {...yAxisProps} domain={[0, 100]} />
                  <Tooltip content={<ChartTooltip />} /><Legend {...legendProps} />
                </AreaChart>
              </ChartPanel>
              <ChartPanel title="Pollution Index">
                <LineChart data={chartData}>
                  {renderLines("poll")}{todayLine}
                  <CartesianGrid {...gridProps} /><XAxis {...xAxisProps} /><YAxis {...yAxisProps} />
                  <Tooltip content={<ChartTooltip />} /><Legend {...legendProps} />
                </LineChart>
              </ChartPanel>
            </div>
          )}

          {tab === "population" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <ChartPanel title="Population (billions)">
                <LineChart data={chartData}>
                  {renderLines("pop")}{todayLine}
                  <CartesianGrid {...gridProps} /><XAxis {...xAxisProps} /><YAxis {...yAxisProps} />
                  <Tooltip content={<ChartTooltip />} /><Legend {...legendProps} />
                </LineChart>
              </ChartPanel>
              <ChartPanel title="Life Expectancy (years)">
                <LineChart data={chartData}>
                  {renderLines("le")}{todayLine}
                  <CartesianGrid {...gridProps} /><XAxis {...xAxisProps} /><YAxis {...yAxisProps} domain={[20, 95]} />
                  <Tooltip content={<ChartTooltip />} /><Legend {...legendProps} />
                </LineChart>
              </ChartPanel>
            </div>
          )}

          {tab === "welfare" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <ChartPanel title="Human Welfare Index (0–100)">
                <AreaChart data={chartData}>
                  {renderAreas("hwi")}{todayLine}
                  <CartesianGrid {...gridProps} /><XAxis {...xAxisProps} /><YAxis {...yAxisProps} domain={[0, 100]} />
                  <Tooltip content={<ChartTooltip />} /><Legend {...legendProps} />
                </AreaChart>
              </ChartPanel>
              <ChartPanel title="Industrial Output per Capita">
                <LineChart data={chartData}>
                  {renderLines("iop")}{todayLine}
                  <CartesianGrid {...gridProps} /><XAxis {...xAxisProps} /><YAxis {...yAxisProps} />
                  <Tooltip content={<ChartTooltip />} /><Legend {...legendProps} />
                </LineChart>
              </ChartPanel>
            </div>
          )}

          {tab === "resources" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <ChartPanel title="Nonrenewable Resources (% remaining)">
                <AreaChart data={chartData}>
                  {renderAreas("nr")}{todayLine}
                  <CartesianGrid {...gridProps} /><XAxis {...xAxisProps} /><YAxis {...yAxisProps} domain={[0, 100]} />
                  <Tooltip content={<ChartTooltip />} /><Legend {...legendProps} />
                </AreaChart>
              </ChartPanel>
              <ChartPanel title="Pollution Index">
                <LineChart data={chartData}>
                  {renderLines("poll")}{todayLine}
                  <CartesianGrid {...gridProps} /><XAxis {...xAxisProps} /><YAxis {...yAxisProps} />
                  <Tooltip content={<ChartTooltip />} /><Legend {...legendProps} />
                </LineChart>
              </ChartPanel>
            </div>
          )}

          {tab === "food" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <ChartPanel title="Food per Capita (index)">
                <AreaChart data={chartData}>
                  {renderAreas("food")}{todayLine}
                  <CartesianGrid {...gridProps} /><XAxis {...xAxisProps} /><YAxis {...yAxisProps} />
                  <Tooltip content={<ChartTooltip />} /><Legend {...legendProps} />
                </AreaChart>
              </ChartPanel>
              <ChartPanel title="Food & Pollution (Your Scenario)">
                <LineChart data={chartData}>
                  <Line type="monotone" dataKey="Your_food" name="Food" stroke="#34d399" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Your_poll" name="Pollution" stroke="#f87171" strokeWidth={2} dot={false} />
                  {todayLine}
                  <CartesianGrid {...gridProps} /><XAxis {...xAxisProps} /><YAxis {...yAxisProps} />
                  <Tooltip content={<ChartTooltip />} /><Legend {...legendProps} />
                </LineChart>
              </ChartPanel>
            </div>
          )}

          {/* ── Outcome comparison cards ── */}
          {termBau && termYour && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-700 bg-panel p-4" style={{ borderLeftColor: "#f87171", borderLeftWidth: 3 }}>
                <p className="text-xs font-semibold text-rose-400">Business as Usual — {endYear}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-200">
                  <span>Population</span><span className="font-bold text-right">{termBau.population}B</span>
                  <span>Welfare index</span><span className="font-bold text-right">{termBau.human_welfare_index}/100</span>
                  <span>Resources left</span><span className="font-bold text-right">{termBau.nonrenewable_resources}%</span>
                  <span>Life expectancy</span><span className="font-bold text-right">{termBau.life_expectancy}y</span>
                </div>
              </div>
              <div className={`rounded-2xl border bg-panel p-4 ${isModified ? "border-violet-400/50" : "border-slate-700"}`} style={{ borderLeftColor: "#a78bfa", borderLeftWidth: 3 }}>
                <p className="text-xs font-semibold text-violet-400">Your Scenario — {endYear}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-200">
                  <span>Population</span>
                  <span className="font-bold text-right">
                    {termYour.population}B
                    <DeltaBadge value={termYour.population} baseline={termBau.population} />
                  </span>
                  <span>Welfare index</span>
                  <span className="font-bold text-right">
                    {termYour.human_welfare_index}/100
                    <DeltaBadge value={termYour.human_welfare_index} baseline={termBau.human_welfare_index} />
                  </span>
                  <span>Resources left</span>
                  <span className="font-bold text-right">
                    {termYour.nonrenewable_resources}%
                    <DeltaBadge value={termYour.nonrenewable_resources} baseline={termBau.nonrenewable_resources} unit="%" />
                  </span>
                  <span>Life expectancy</span>
                  <span className="font-bold text-right">
                    {termYour.life_expectancy}y
                    <DeltaBadge value={termYour.life_expectancy} baseline={termBau.life_expectancy} unit="y" />
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Controls ── */}
        <div className="space-y-4">
          {/* Sliders */}
          <div className="rounded-[1.75rem] border border-violet-400/20 bg-panel p-5 space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-violet-300">Shape the future</p>
              {isModified && (
                <button onClick={() => setCustomParams({ ...BASE })}
                  className="rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-500 hover:text-slate-300 transition-colors">
                  Reset
                </button>
              )}
            </div>

            {GROUPS.map((group) => {
              const groupSliders = SLIDERS.filter((s) => s.group === group);
              return (
                <div key={group}>
                  <p className="mb-2 text-xs font-semibold text-slate-500">{group}</p>
                  <div className="space-y-3">
                    {groupSliders.map((sl) => {
                      const val = customParams[sl.key] as number;
                      const baseVal = BASE[sl.key] as number;
                      const pct = ((val - sl.min) / (sl.max - sl.min)) * 100;
                      const changed = Math.abs(val - baseVal) > 0.001;
                      return (
                        <label key={sl.key} className="block">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-slate-300">{sl.icon} {sl.label}</span>
                            <span className={`font-mono font-bold tabular-nums ${changed ? "text-violet-300" : "text-slate-500"}`}>
                              {val.toFixed(sl.step < 0.1 ? 2 : 1)}
                              {changed && <span className="ml-1 text-slate-600 font-normal">(was {baseVal})</span>}
                            </span>
                          </div>
                          <div className="relative">
                            <input
                              type="range"
                              min={sl.min}
                              max={sl.max}
                              step={sl.step}
                              value={val}
                              onChange={(e) => setParam(sl.key, Number(e.target.value))}
                              className="w-full accent-violet-400 h-1.5"
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                          <p className="mt-0.5 text-xs text-slate-600">{sl.tooltip}</p>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load preset */}
          <div className="rounded-[1.75rem] border border-slate-800 bg-panel p-5 space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Load a preset</p>
            <p className="text-xs text-slate-500">Fill the sliders with a predefined scenario, or toggle it as a comparison line in the charts.</p>
            {PRESETS.map((preset, idx) => (
              <div key={preset.label} className="flex items-start gap-2">
                <button
                  onClick={() => loadPreset(idx)}
                  className="flex-1 rounded-2xl border border-slate-800 p-3 text-left text-sm transition-colors hover:border-slate-600"
                  style={{ borderLeftColor: preset.color, borderLeftWidth: 3 }}
                >
                  <p className="text-xs font-semibold" style={{ color: preset.color }}>{preset.label}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{preset.description}</p>
                </button>
                {idx !== 0 && (
                  <button
                    onClick={() => togglePreset(idx)}
                    title="Toggle as chart overlay"
                    className={`mt-1 rounded-xl border px-2.5 py-2 text-xs transition-colors ${
                      activePresets.includes(idx)
                        ? "border-current font-semibold"
                        : "border-slate-700 text-slate-600 hover:text-slate-400"
                    }`}
                    style={activePresets.includes(idx) ? { color: preset.color } : {}}
                  >
                    {activePresets.includes(idx) ? "✓" : "+"}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Key feedback loops */}
          <div className="rounded-[1.75rem] border border-slate-800 bg-panel p-5 space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Key feedback loops</p>
            {[
              { label: "R1 — Industrial growth",   desc: "Capital → output → investment → more capital (reinforcing)",           color: "text-cyan-300"    },
              { label: "B1 — Resource depletion",  desc: "Output → resource use → depletion → output falls (balancing)",         color: "text-amber-300"   },
              { label: "B2 — Pollution sink",      desc: "Industry → pollution → health & ag damage → output falls",             color: "text-rose-300"    },
              { label: "B3 — Population pressure", desc: "Rising welfare → lower birth rate → population stabilises",            color: "text-emerald-300" },
              { label: "R2 — Food feedback",       desc: "Ag capital → food → lower mortality → more population → food demand",  color: "text-violet-300"  },
            ].map((f) => (
              <div key={f.label} className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <p className={`text-xs font-semibold ${f.color}`}>{f.label}</p>
                <p className="mt-0.5 text-xs text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
