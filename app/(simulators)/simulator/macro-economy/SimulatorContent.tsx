"use client";

import { useMemo, useState } from "react";
import {
  Area, AreaChart, CartesianGrid, ComposedChart, Legend, Line, LineChart,
  ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar,
} from "recharts";

import { AtlasPage } from "@/components/atlas/AtlasPage";
import {
  SimulatorActionRow,
  SimulatorHero,
  SimulatorPrimer,
  SimulatorSidebarPanel,
} from "@/components/simulator/SimulatorAtlas";

// ─── Types ────────────────────────────────────────────────────────────────────
interface MacroParams {
  // Fiscal
  govtSpendingPct: number;   // % of potential GDP (15–45)
  taxRatePct: number;        // effective avg tax rate (15–50)
  // Monetary
  policyMode: "taylor" | "manual";
  manualRate: number;        // % (0–20)
  inflationTarget: number;   // % (0–6)
  taylorAggressiveness: number; // 1–3 (1=dovish, 3=aggressive)
  // Supply side
  productivityGrowth: number;  // % annual TFP (0–3)
  oilPriceShock: number;       // % change in energy costs (-60 to +200)
  laborMarketRigidity: number; // 1–5
  // External
  globalGrowthRate: number;    // % world GDP growth (-3 to 6)
  exchangeRegime: "float" | "managed" | "peg";
  // Starting conditions
  initOutputGap: number;    // % (-10 to +4)
  initInflation: number;    // % (0–15)
  initDebtPct: number;      // % GDP (10–180)
}

interface MacroSnap {
  q: number;
  label: string;
  realGDP: number;          // index 100 = start
  potGDP: number;
  outputGap: number;        // %
  inflation: number;        // %
  unemployment: number;     // %
  policyRate: number;       // %
  realRate: number;         // %
  govtBalance: number;      // % GDP (negative = deficit)
  debtPct: number;          // % GDP
  currentAccount: number;   // % GDP
  exchRate: number;         // index 100 = start
  wageGrowth: number;       // %
}

// ─── Model ────────────────────────────────────────────────────────────────────
function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

/** Replace NaN / ±Infinity with a safe fallback so charts never break. */
function safe(v: number, fallback: number): number {
  return isFinite(v) ? v : fallback;
}

function runMacro(p: MacroParams, quarters = 40): MacroSnap[] {
  // Quarterly constants
  const potGrowthQ = (0.005 + p.productivityGrowth / 100) / 4;  // potential GDP growth per quarter
  const naturalU = clamp(4.5 + (p.laborMarketRigidity - 3) * 0.6, 2, 9);
  const OKUN = 0.4;
  const MPC = 0.72;
  const NEUTRAL_RATE = 2.2;          // natural real rate %
  const WORLD_RATE = 2.0;
  const INVEST_SENS = 0.35;          // investment response to real rate gap (pp per pp)
  const EX_RATE_SENS = 0.18;         // export volume response to exchange rate index
  const IMPORT_SHARE = 0.28;
  const EXPORT_SHARE = 0.30;
  const PHILLIPS = 0.28;             // slope of Phillips curve

  // Taylor rule coefficients scaled by aggressiveness
  const aggrScale = p.taylorAggressiveness;
  const PHI_PI = 1.2 + aggrScale * 0.3;   // 1.5 – 2.1
  const PHI_Y = 0.3 + aggrScale * 0.2;    // 0.5 – 0.9

  // Oil shock: spread over first 8 quarters (2 years)
  const oilImpactPerQ = (p.oilPriceShock / 100) * 0.25 / 8;  // quarterly CPI push

  // State
  let potGDP = 100;
  let realGDP = 100 * (1 + p.initOutputGap / 100);
  let inflation = p.initInflation;
  let infExpected = p.initInflation;
  let unemployment = clamp(naturalU - OKUN * p.initOutputGap, 0, 25);
  let debtPct = p.initDebtPct;
  let exchRate = 100;

  const results: MacroSnap[] = [];

  for (let q = 0; q <= quarters; q++) {
    const yr = 2025 + Math.floor(q / 4);
    const qtr = (q % 4) + 1;
    const label = `Q${qtr} ${yr}`;

    // 1. Potential GDP grows
    potGDP *= (1 + potGrowthQ);

    const outputGap = ((realGDP / potGDP) - 1) * 100;

    // 2. Policy rate
    let policyRate: number;
    if (p.policyMode === "manual") {
      policyRate = p.manualRate;
    } else {
      policyRate = clamp(
        NEUTRAL_RATE + inflation +
        PHI_PI * (inflation - p.inflationTarget) +
        PHI_Y * outputGap,
        0, 25
      );
    }
    const realRate = policyRate - infExpected;

    // 3. Aggregate demand
    const taxRate = p.taxRatePct / 100;
    const disposable = (1 - taxRate) * realGDP;
    const consumption = MPC * disposable;

    // Investment: sensitive to real rate vs neutral, & uncertainty (|gap|)
    const baseInvest = potGDP * 0.20;
    const investmentFactor = 1 - INVEST_SENS * (realRate - NEUTRAL_RATE) / 100
                               - Math.abs(outputGap) * 0.015;
    const investment = clamp(baseInvest * investmentFactor, potGDP * 0.05, potGDP * 0.35);

    const govtSpending = (p.govtSpendingPct / 100) * potGDP;

    // External: global demand lifts exports; exchange rate affects competitiveness
    const globalDemandFactor = 1 + (p.globalGrowthRate / 100) * (q / 4) * 0.15;
    const exchEffect = 100 / exchRate;           // depreciation → exports rise
    const exports = potGDP * EXPORT_SHARE * globalDemandFactor * (1 + EX_RATE_SENS * (exchEffect - 1));
    const imports = potGDP * IMPORT_SHARE * (realGDP / potGDP) * (1 / exchEffect);
    const netExports = exports - imports;

    // Multiplier (open-economy Keynesian)
    const rawDemand = safe(consumption + investment + govtSpending + netExports, realGDP);
    // GDP partially adjusts toward demand each quarter (sticky prices/wages)
    const adjustSpeed = 0.55;
    realGDP = safe(realGDP + adjustSpeed * (rawDemand - realGDP), potGDP * 0.8);
    // Hard floor/ceiling: economy can't collapse below 10% of potential or exceed 3×
    realGDP = clamp(realGDP, potGDP * 0.1, potGDP * 3);

    // 4. Inflation – New Keynesian Phillips curve
    const oilPush = q < 8 ? oilImpactPerQ * 4 : 0;  // annualised impact this quarter
    // Credibility erodes when debt is very high or if CB is dovish
    const credibility = clamp(
      1.0 - Math.max(0, debtPct - 80) * 0.004 - (p.policyMode === "manual" && p.manualRate < 1 ? 0.3 : 0),
      0.15, 1.0
    );
    infExpected = credibility * p.inflationTarget + (1 - credibility) * inflation;

    const newInflation = infExpected + PHILLIPS * outputGap + oilPush;
    inflation = clamp(safe(newInflation, inflation), -2, 30);

    // 5. Unemployment – Okun's law (with rigidity-based sluggishness)
    const targetU = clamp(naturalU - OKUN * ((realGDP / potGDP - 1) * 100), 1, 25);
    const uAdjSpeed = clamp(1.5 / p.laborMarketRigidity, 0.3, 1.2);
    unemployment = clamp(unemployment + uAdjSpeed * (targetU - unemployment) * 0.25, 0, 25);

    // 6. Exchange rate
    if (p.exchangeRegime === "float") {
      const rateDiff = (policyRate - WORLD_RATE) / 400;  // quarterly
      const caAdj = (netExports / realGDP) * 0.03;
      exchRate = clamp(exchRate * (1 + rateDiff + caAdj), 50, 200);
    } else if (p.exchangeRegime === "managed") {
      exchRate = exchRate * 0.97 + 100 * 0.03;
    }
    // peg: stays at 100

    // 7. Government finances
    const govtRevenue = taxRate * realGDP;
    const balance = ((govtRevenue - govtSpending) / realGDP) * 100;  // % GDP
    const nomGrowthQ = potGrowthQ + inflation / 400;
    debtPct = clamp(safe(debtPct * (1 - nomGrowthQ) - balance / 4, debtPct), 0, 300);

    // 8. Current account
    const currentAccount = (netExports / realGDP) * 100;

    // 9. Wage growth (real wage = labour productivity + bargaining power)
    const wageGrowth = inflation + (p.productivityGrowth / 4) +
                       Math.max(0, -outputGap * 0.1 * p.laborMarketRigidity);

    results.push({
      q,
      label,
      realGDP: parseFloat(realGDP.toFixed(2)),
      potGDP: parseFloat(potGDP.toFixed(2)),
      outputGap: parseFloat(outputGap.toFixed(2)),
      inflation: parseFloat(inflation.toFixed(2)),
      unemployment: parseFloat(unemployment.toFixed(2)),
      policyRate: parseFloat(policyRate.toFixed(2)),
      realRate: parseFloat(realRate.toFixed(2)),
      govtBalance: parseFloat(balance.toFixed(2)),
      debtPct: parseFloat(debtPct.toFixed(1)),
      currentAccount: parseFloat(currentAccount.toFixed(2)),
      exchRate: parseFloat(exchRate.toFixed(1)),
      wageGrowth: parseFloat(wageGrowth.toFixed(2)),
    });
  }

  return results;
}

// ─── Presets ──────────────────────────────────────────────────────────────────
const PRESETS: { label: string; color: string; description: string; params: MacroParams }[] = [
  {
    label: "Stable growth",
    color: "#34d399",
    description: "Well-anchored inflation, balanced budget, moderate growth.",
    params: {
      govtSpendingPct: 28, taxRatePct: 30, policyMode: "taylor", manualRate: 3,
      inflationTarget: 2, taylorAggressiveness: 2, productivityGrowth: 1.5,
      oilPriceShock: 0, laborMarketRigidity: 2, globalGrowthRate: 3,
      exchangeRegime: "float", initOutputGap: 0, initInflation: 2, initDebtPct: 55,
    },
  },
  {
    label: "2008 Recession",
    color: "#f87171",
    description: "Deep negative demand shock, ZLB, deficit spending, slow recovery.",
    params: {
      govtSpendingPct: 34, taxRatePct: 28, policyMode: "manual", manualRate: 0,
      inflationTarget: 2, taylorAggressiveness: 2, productivityGrowth: 0.8,
      oilPriceShock: -30, laborMarketRigidity: 3, globalGrowthRate: -1,
      exchangeRegime: "float", initOutputGap: -6, initInflation: 4, initDebtPct: 65,
    },
  },
  {
    label: "1970s Stagflation",
    color: "#fb923c",
    description: "Oil shock drives cost-push inflation while demand stagnates.",
    params: {
      govtSpendingPct: 32, taxRatePct: 30, policyMode: "manual", manualRate: 5,
      inflationTarget: 4, taylorAggressiveness: 1, productivityGrowth: 0.5,
      oilPriceShock: 150, laborMarketRigidity: 4, globalGrowthRate: 1,
      exchangeRegime: "managed", initOutputGap: -2, initInflation: 6, initDebtPct: 40,
    },
  },
  {
    label: "Eurozone debt crisis",
    color: "#c084fc",
    description: "High debt, austerity spending cuts, weak growth, low inflation risk.",
    params: {
      govtSpendingPct: 22, taxRatePct: 38, policyMode: "manual", manualRate: 1,
      inflationTarget: 2, taylorAggressiveness: 2, productivityGrowth: 0.4,
      oilPriceShock: 10, laborMarketRigidity: 4, globalGrowthRate: 1.5,
      exchangeRegime: "managed", initOutputGap: -4, initInflation: 1, initDebtPct: 130,
    },
  },
  {
    label: "Post-COVID boom",
    color: "#38bdf8",
    description: "Fiscal stimulus + supply disruptions → strong recovery then inflation surge.",
    params: {
      govtSpendingPct: 40, taxRatePct: 28, policyMode: "manual", manualRate: 0.5,
      inflationTarget: 2, taylorAggressiveness: 2, productivityGrowth: 1.2,
      oilPriceShock: 80, laborMarketRigidity: 2, globalGrowthRate: 4,
      exchangeRegime: "float", initOutputGap: -5, initInflation: 2, initDebtPct: 110,
    },
  },
  {
    label: "Overheating economy",
    color: "#fbbf24",
    description: "Above-potential output, wage-price spiral building, aggressive tightening needed.",
    params: {
      govtSpendingPct: 33, taxRatePct: 28, policyMode: "taylor", manualRate: 5,
      inflationTarget: 2, taylorAggressiveness: 3, productivityGrowth: 2,
      oilPriceShock: 20, laborMarketRigidity: 2, globalGrowthRate: 4,
      exchangeRegime: "float", initOutputGap: 3.5, initInflation: 5, initDebtPct: 50,
    },
  },
];

// ─── Slider helper ────────────────────────────────────────────────────────────
function Slider({
  label, value, min, max, step = 1, unit = "",
  onChange, accent = "cyan", description,
}: {
  label: string; value: number; min: number; max: number; step?: number;
  unit?: string; onChange: (v: number) => void; accent?: string; description?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const accentMap: Record<string, string> = {
    cyan: "accent-cyan-400", amber: "accent-amber-400",
    emerald: "accent-emerald-400", rose: "accent-rose-400",
    violet: "accent-violet-400",
  };
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs text-slate-300">{label}</span>
        <span className="text-xs font-semibold text-slate-100 tabular-nums">
          {value > 0 && unit === "%" && min < 0 ? "+" : ""}{value}{unit}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={`w-full h-1.5 rounded-full appearance-none cursor-pointer bg-slate-700 ${accentMap[accent] ?? "accent-cyan-400"}`}
      />
      {description && (
        <p className="text-[10px] text-slate-500 leading-4">{description}</p>
      )}
    </div>
  );
}

// ─── Small stat card ──────────────────────────────────────────────────────────
function StatCard({
  label, value, unit = "", sub, trend, accent = "slate",
}: {
  label: string; value: string | number; unit?: string; sub?: string;
  trend?: "up" | "down" | "neutral"; accent?: string;
}) {
  const colors: Record<string, string> = {
    emerald: "border-emerald-400/25 bg-emerald-400/8 text-emerald-200",
    rose: "border-rose-400/25 bg-rose-400/8 text-rose-200",
    amber: "border-amber-400/25 bg-amber-400/8 text-amber-200",
    cyan: "border-cyan-400/25 bg-cyan-400/8 text-cyan-200",
    violet: "border-violet-400/25 bg-violet-400/8 text-violet-200",
    slate: "border-slate-700 bg-slate-900/60 text-slate-200",
  };
  return (
    <div className={`rounded-2xl border p-4 ${colors[accent] ?? colors.slate}`}>
      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black tabular-nums">
        {value}<span className="text-sm font-medium ml-0.5 opacity-70">{unit}</span>
      </p>
      {sub && <p className="mt-0.5 text-[10px] text-slate-400">{sub}</p>}
    </div>
  );
}

// ─── Custom tooltip ───────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/95 px-3 py-2 text-xs shadow-xl">
      <p className="mb-1.5 font-semibold text-slate-200">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }} className="tabular-nums">
          {p.name}: {typeof p.value === "number" ? p.value.toFixed(2) : p.value}
          {p.unit ?? ""}
        </p>
      ))}
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const DEFAULT_PARAMS = PRESETS[0].params;

export default function MacroEconomyPage() {
  const [params, setParams] = useState<MacroParams>(DEFAULT_PARAMS);
  const [activePreset, setActivePreset] = useState(0);

  const set = (key: keyof MacroParams) => (v: number | string) =>
    setParams((p) => ({ ...p, [key]: v }));

  const data = useMemo(() => runMacro(params), [params]);
  const last = data[data.length - 1];
  const first = data[0];

  const gdpGrowthAnnual = ((last.realGDP / first.realGDP) ** (4 / data.length) - 1) * 100;

  function loadPreset(idx: number) {
    setActivePreset(idx);
    setParams(PRESETS[idx].params);
  }

  return (
    <AtlasPage className="simulator-atlas space-y-6 pb-14">
      <SimulatorHero
        actions={<SimulatorActionRow primaryHref="#macro-lab" primaryLabel="Open the lab" secondaryHref="#macro-presets" secondaryLabel="Explore scenarios" />}
        description="This quarterly macro model lets you test fiscal policy, monetary policy, supply shocks, exchange regimes, and debt dynamics together. Instead of isolated indicators, it shows how inflation, unemployment, output, and public debt move as one system."
        eyebrow="Macro Economy Simulator · IS-LM / New Keynesian Model"
        imageAlt="Macroeconomy simulation landscape"
        imageSrc="/atlas/simulator-hero.png"
        metrics={[
          { label: "GDP growth", value: `${gdpGrowthAnnual.toFixed(1)}%`, description: "Average annual real GDP growth over the full simulation." },
          { label: "Final inflation", value: `${last.inflation.toFixed(1)}%`, description: `Compared with a ${params.inflationTarget}% target.` },
          { label: "Debt / GDP", value: `${last.debtPct.toFixed(0)}%`, description: "Public debt ratio at the end of the run." },
          { label: "Output gap", value: `${last.outputGap.toFixed(1)}pp`, description: last.outputGap > 0 ? "Economy ends above potential output." : "Economy ends below potential output." },
        ]}
        title="Macroeconomy Lab"
      />

      <SimulatorPrimer
        aside="If you want a clean reading strategy, start with a preset, then move only one family of levers at a time: fiscal, monetary, supply, or external. The model becomes much easier to interpret when you isolate the source of the change."
        items={[
          {
            title: "Read output, inflation, and unemployment together.",
            text: "No single chart tells the story. A demand boost may raise GDP first, then tighten the labour market, then push inflation, then provoke a rate response that cools the expansion later.",
          },
          {
            title: "Treat debt as an outcome of the whole system.",
            text: "Debt rises or falls not only because governments spend more, but because growth, inflation, and interest rates change the denominator and the financing burden at the same time.",
          },
          {
            title: "Use the presets as historical lenses.",
            text: "The 1970s, 2008, and post-COVID paths are useful because they show different failure modes: supply shock, demand collapse, and stimulus colliding with constraints.",
          },
        ]}
        summary="This is the broadest economic lab in the platform. Its purpose is not to produce one perfect forecast, but to show how several macro mechanisms move together and why policy tradeoffs almost always come with delayed side effects."
        title="Read the economy as a moving system"
      />

      <div id="macro-presets">
        <SimulatorSidebarPanel kicker="Historical scenarios" title="Choose a macro regime" className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((pr, i) => (
              <button
                key={pr.label}
                onClick={() => loadPreset(i)}
                className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                  activePreset === i
                    ? "border-[rgba(28,36,48,0.18)] bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-50"
                    : "border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.58)] text-slate-600 hover:border-[rgba(28,36,48,0.16)] hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:text-slate-100"
                }`}
              >
                <span
                  className="mr-2 inline-block h-2 w-2 rounded-full"
                  style={{ background: pr.color }}
                />
                {pr.label}
              </button>
            ))}
          </div>
          {activePreset !== null ? (
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{PRESETS[activePreset].description}</p>
          ) : null}
        </SimulatorSidebarPanel>
      </div>

      {/* ── KPI cards ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        <StatCard
          label="Avg annual GDP growth" accent="emerald"
          value={gdpGrowthAnnual.toFixed(1)} unit="%"
          sub={`GDP index: ${last.realGDP.toFixed(0)} at end`}
        />
        <StatCard
          label="Final inflation" accent={last.inflation > 5 ? "rose" : last.inflation < 0 ? "violet" : "cyan"}
          value={last.inflation.toFixed(1)} unit="%"
          sub={`Target: ${params.inflationTarget}%`}
        />
        <StatCard
          label="Unemployment" accent={last.unemployment > 8 ? "rose" : last.unemployment < 3 ? "amber" : "slate"}
          value={last.unemployment.toFixed(1)} unit="%"
        />
        <StatCard
          label="Policy rate" accent="amber"
          value={last.policyRate.toFixed(1)} unit="%"
          sub={`Real rate: ${last.realRate.toFixed(1)}%`}
        />
        <StatCard
          label="Govt balance" accent={last.govtBalance < -5 ? "rose" : last.govtBalance > 0 ? "emerald" : "slate"}
          value={last.govtBalance.toFixed(1)} unit="% GDP"
        />
        <StatCard
          label="Debt / GDP" accent={last.debtPct > 100 ? "rose" : last.debtPct > 60 ? "amber" : "emerald"}
          value={last.debtPct.toFixed(0)} unit="%"
        />
        <StatCard
          label="Output gap" accent={Math.abs(last.outputGap) > 3 ? "rose" : "slate"}
          value={last.outputGap.toFixed(1)} unit="pp"
          sub={last.outputGap > 0 ? "above potential" : "below potential"}
        />
      </div>

      {/* ── Charts + Controls ──────────────────────────────────────────────────── */}
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]" id="macro-lab">
        {/* Charts */}
        <div className="space-y-5">

          {/* GDP */}
          <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/80 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Output</p>
            <h2 className="mt-1 text-base font-semibold text-slate-100">Real GDP vs Potential GDP</h2>
            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 10 }} interval={7} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} domain={["auto", "auto"]} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Area type="monotone" dataKey="potGDP" fill="#134e4a30" stroke="#2dd4bf40"
                  strokeWidth={1.5} name="Potential GDP" dot={false} />
                <Line type="monotone" dataKey="realGDP" stroke="#34d399"
                  strokeWidth={2} name="Real GDP" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Inflation & Unemployment */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/80 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Prices</p>
              <h2 className="mt-1 text-base font-semibold text-slate-100">Inflation</h2>
              <ResponsiveContainer width="100%" height={170}>
                <LineChart data={data} margin={{ top: 8, right: 10, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 10 }} interval={7} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                  <Tooltip content={<ChartTooltip />} />
                  <ReferenceLine y={params.inflationTarget} stroke="#fbbf2460" strokeDasharray="4 4" label={{ value: "Target", fill: "#fbbf24", fontSize: 9 }} />
                  <ReferenceLine y={0} stroke="#64748b60" />
                  <Line type="monotone" dataKey="inflation" stroke="#f87171" strokeWidth={2} name="Inflation %" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/80 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Labour</p>
              <h2 className="mt-1 text-base font-semibold text-slate-100">Unemployment</h2>
              <ResponsiveContainer width="100%" height={170}>
                <AreaChart data={data} margin={{ top: 8, right: 10, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 10 }} interval={7} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="unemployment" stroke="#c084fc" fill="#581c8730" strokeWidth={2} name="Unemployment %" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Rates */}
          <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/80 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Monetary</p>
            <h2 className="mt-1 text-base font-semibold text-slate-100">Policy Rate &amp; Real Rate</h2>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={data} margin={{ top: 8, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 10 }} interval={7} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                <ReferenceLine y={0} stroke="#64748b80" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="policyRate" stroke="#fbbf24" strokeWidth={2} name="Policy rate %" dot={false} />
                <Line type="monotone" dataKey="realRate" stroke="#38bdf8" strokeWidth={2} strokeDasharray="5 3" name="Real rate %" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Fiscal */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/80 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Fiscal</p>
              <h2 className="mt-1 text-base font-semibold text-slate-100">Govt Balance (% GDP)</h2>
              <ResponsiveContainer width="100%" height={160}>
                <ComposedChart data={data} margin={{ top: 8, right: 10, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 10 }} interval={7} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                  <Tooltip content={<ChartTooltip />} />
                  <ReferenceLine y={0} stroke="#64748b" />
                  <Bar dataKey="govtBalance" name="Balance % GDP"
                    fill="#34d39960" stroke="#34d399" strokeWidth={0.5}
                    radius={[3, 3, 0, 0]}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/80 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Fiscal</p>
              <h2 className="mt-1 text-base font-semibold text-slate-100">Debt / GDP (%)</h2>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={data} margin={{ top: 8, right: 10, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 10 }} interval={7} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="debtPct" stroke="#f87171" fill="#7f1d1d30" strokeWidth={2} name="Debt % GDP" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* External */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/80 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">External</p>
              <h2 className="mt-1 text-base font-semibold text-slate-100">Exchange Rate (index)</h2>
              <ResponsiveContainer width="100%" height={155}>
                <LineChart data={data} margin={{ top: 8, right: 10, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 10 }} interval={7} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                  <Tooltip content={<ChartTooltip />} />
                  <ReferenceLine y={100} stroke="#64748b60" strokeDasharray="4 4" />
                  <Line type="monotone" dataKey="exchRate" stroke="#38bdf8" strokeWidth={2} name="Exchange rate index" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/80 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Labour</p>
              <h2 className="mt-1 text-base font-semibold text-slate-100">Wage Growth (%)</h2>
              <ResponsiveContainer width="100%" height={155}>
                <LineChart data={data} margin={{ top: 8, right: 10, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 10 }} interval={7} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="wageGrowth" stroke="#fbbf24" strokeWidth={2} name="Wage growth %" dot={false} />
                  <Line type="monotone" dataKey="inflation" stroke="#f8717180" strokeWidth={1.5} strokeDasharray="4 3" name="Inflation %" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── Controls sidebar ────────────────────────────────────────────────── */}
        <aside className="space-y-4">

          {/* Fiscal */}
          <div className="rounded-[1.75rem] border border-amber-400/20 bg-amber-400/5 p-5 space-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-amber-400/70">Fiscal policy</p>
              <h3 className="mt-0.5 text-sm font-semibold text-slate-100">Government</h3>
            </div>
            <Slider label="Govt spending" value={params.govtSpendingPct} min={15} max={45} unit="%" accent="amber"
              onChange={set("govtSpendingPct")}
              description="% of potential GDP. Higher = more stimulus, more deficit pressure." />
            <Slider label="Tax rate" value={params.taxRatePct} min={15} max={50} unit="%" accent="amber"
              onChange={set("taxRatePct")}
              description="Effective average tax burden. Higher reduces disposable income but shrinks deficit." />
          </div>

          {/* Monetary */}
          <div className="rounded-[1.75rem] border border-cyan-400/20 bg-cyan-400/5 p-5 space-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-400/70">Monetary policy</p>
              <h3 className="mt-0.5 text-sm font-semibold text-slate-100">Central bank</h3>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-slate-300">Rate-setting mode</p>
              <div className="flex gap-2">
                {(["taylor", "manual"] as const).map((mode) => (
                  <button key={mode} onClick={() => set("policyMode")(mode)}
                    className={`flex-1 rounded-xl border py-1.5 text-xs font-medium transition-colors ${
                      params.policyMode === mode
                        ? "border-cyan-400/40 bg-cyan-400/15 text-cyan-200"
                        : "border-slate-700 text-slate-400 hover:text-slate-200"
                    }`}>
                    {mode === "taylor" ? "Taylor rule" : "Manual"}
                  </button>
                ))}
              </div>
            </div>
            {params.policyMode === "taylor" ? (
              <>
                <Slider label="Inflation target" value={params.inflationTarget} min={0} max={6} step={0.5} unit="%" accent="cyan"
                  onChange={set("inflationTarget")} description="CB's official inflation target. Lower = more tightening." />
                <Slider label="CB aggressiveness" value={params.taylorAggressiveness} min={1} max={3} step={0.5} accent="cyan"
                  onChange={set("taylorAggressiveness")}
                  description="1 = dovish (slow to hike), 3 = hawkish (large, fast rate moves)." />
              </>
            ) : (
              <Slider label="Policy rate (fixed)" value={params.manualRate} min={0} max={20} step={0.25} unit="%" accent="cyan"
                onChange={set("manualRate")} description="Override the CB — fix the nominal rate at this level for the whole simulation." />
            )}
          </div>

          {/* Supply side */}
          <div className="rounded-[1.75rem] border border-emerald-400/20 bg-emerald-400/5 p-5 space-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-400/70">Supply side</p>
              <h3 className="mt-0.5 text-sm font-semibold text-slate-100">Productive capacity</h3>
            </div>
            <Slider label="Productivity growth" value={params.productivityGrowth} min={0} max={3} step={0.1} unit="%" accent="emerald"
              onChange={set("productivityGrowth")}
              description="Annual TFP growth. Raises potential GDP; improves wages without inflation." />
            <Slider label="Oil / energy price shock" value={params.oilPriceShock} min={-60} max={200} step={5} unit="%" accent="emerald"
              onChange={set("oilPriceShock")}
              description="% change in energy costs applied over first 2 years. Positive = inflationary supply shock." />
            <Slider label="Labour market rigidity" value={params.laborMarketRigidity} min={1} max={5} step={0.5} accent="emerald"
              onChange={set("laborMarketRigidity")}
              description="1 = flexible (US-style), 5 = rigid (heavy employment protection). Affects unemployment adjustment speed & natural rate." />
          </div>

          {/* External */}
          <div className="rounded-[1.75rem] border border-violet-400/20 bg-violet-400/5 p-5 space-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-violet-400/70">External sector</p>
              <h3 className="mt-0.5 text-sm font-semibold text-slate-100">Global environment</h3>
            </div>
            <Slider label="World GDP growth" value={params.globalGrowthRate} min={-3} max={6} step={0.5} unit="%" accent="violet"
              onChange={set("globalGrowthRate")}
              description="Drives export demand. Negative = global recession pulling down net exports." />
            <div className="space-y-2">
              <p className="text-xs text-slate-300">Exchange rate regime</p>
              <div className="flex gap-2">
                {(["float", "managed", "peg"] as const).map((r) => (
                  <button key={r} onClick={() => set("exchangeRegime")(r)}
                    className={`flex-1 rounded-xl border py-1.5 text-[10px] font-medium transition-colors capitalize ${
                      params.exchangeRegime === r
                        ? "border-violet-400/40 bg-violet-400/15 text-violet-200"
                        : "border-slate-700 text-slate-400 hover:text-slate-200"
                    }`}>
                    {r}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500">Float adjusts via UIP. Peg loses exchange rate as a stabiliser.</p>
            </div>
          </div>

          {/* Starting conditions */}
          <div className="rounded-[1.75rem] border border-rose-400/20 bg-rose-400/5 p-5 space-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-rose-400/70">Starting conditions</p>
              <h3 className="mt-0.5 text-sm font-semibold text-slate-100">Initial state</h3>
            </div>
            <Slider label="Initial output gap" value={params.initOutputGap} min={-10} max={4} step={0.5} unit="%" accent="rose"
              onChange={set("initOutputGap")}
              description="Negative = recession / below potential. Zero = neutral. Positive = overheating." />
            <Slider label="Initial inflation" value={params.initInflation} min={0} max={15} step={0.5} unit="%" accent="rose"
              onChange={set("initInflation")} />
            <Slider label="Initial debt / GDP" value={params.initDebtPct} min={10} max={180} step={5} unit="%" accent="rose"
              onChange={set("initDebtPct")}
              description="High debt constrains fiscal space and erodes CB credibility." />
          </div>

          {/* Model notes */}
          <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/60 p-5 space-y-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Model mechanics</p>
            <div className="space-y-2 text-[11px] leading-5 text-slate-400">
              <p><span className="text-slate-200 font-medium">IS / Output gap</span> — demand components (C, I, G, NX) determine actual output vs potential. Multiplier ~1.4×.</p>
              <p><span className="text-slate-200 font-medium">Phillips curve</span> — output gap drives inflation with adaptive expectations. Oil shocks add cost-push pressure.</p>
              <p><span className="text-slate-200 font-medium">Taylor rule</span> — CB sets rate ≈ neutral + 1.5×(π−π*) + 0.5×gap. ZLB binds at 0%.</p>
              <p><span className="text-slate-200 font-medium">Okun&apos;s law</span> — each 1 pp negative gap adds ~0.4 pp unemployment. Rigidity slows adjustment.</p>
              <p><span className="text-slate-200 font-medium">Debt dynamics</span> — nominal GDP growth erodes debt; primary deficit adds to it.</p>
            </div>
          </div>
        </aside>
      </div>
    </AtlasPage>
  );
}
