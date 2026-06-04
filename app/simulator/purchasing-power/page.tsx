"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
import {
  SimulatorActionRow,
  SimulatorCallout,
  SimulatorChartPanel,
  SimulatorHero,
  SimulatorPrimer,
  SimulatorSidebarPanel,
} from "@/components/simulator/SimulatorAtlas";

// ─── Model ────────────────────────────────────────────────────────────────────
interface PPParams {
  monthlyIncome: number;      // € per month
  inflation: number;          // % per year
  wageGrowth: number;         // % per year
  cbRate: number;             // central bank interest rate %
  housingFrac: number;        // fraction of income (0.25 = 25%)
  energyMultiplier: number;   // 1.0 = baseline energy price, 2.0 = doubled
  savingsFrac: number;        // fraction of disposable income saved each month
}

interface PPYear {
  year: number;
  realIncome: number;
  housing: number;
  energy: number;
  food: number;
  transport: number;
  disposable: number;
  savings: number;
  purchasingPowerIdx: number; // 100 = year-0
}

const TODAY = new Date().getFullYear();

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function runPP(p: PPParams, years = 20): PPYear[] {
  const I = p.monthlyIncome;
  // Baseline real costs at t=0 (today)
  const housing0   = I * p.housingFrac;
  const energy0    = I * 0.10 * p.energyMultiplier;
  // Food rises with energy (fertilisers, transport of goods)
  const food0      = I * 0.15 * (1 + 0.10 * (p.energyMultiplier - 1));
  // Transport is ~60% energy-driven
  const transport0 = I * 0.08 * (0.55 + 0.45 * p.energyMultiplier);
  const disposable0 = Math.max(10, I - housing0 - energy0 - food0 - transport0);

  const results: PPYear[] = [];
  let cumSavings = 0;

  for (let t = 0; t <= years; t++) {
    // Real income: wage growth minus inflation each year
    const realIncome = I * Math.pow(1 + (p.wageGrowth - p.inflation) / 100, t);

    // Housing rises above inflation when rates are high (mortgage repricing, rent pressure)
    const housingPremium = clamp(p.cbRate * 0.12 + 0.4, 0, 5); // % real housing cost rise/yr
    const housing = housing0 * Math.pow(1 + housingPremium / 100, t);

    // Energy shocks are mean-reverting; high spikes partially unwind after ~5 years
    const energyDecay = p.energyMultiplier > 1.4 ? Math.pow(0.94, t) : 1;
    const effectiveEnergyMult = 1 + (p.energyMultiplier - 1) * (0.3 + 0.7 * energyDecay);
    const energy = I * 0.10 * effectiveEnergyMult;

    // Food: partly energy-driven, partly inflation-driven
    const foodRealDrift = clamp((p.inflation - 2) * 0.12 + (p.energyMultiplier - 1) * 0.04, -0.5, 4) / 100;
    const food = food0 * Math.pow(1 + foodRealDrift, t);

    // Transport: partially adjusts with energy
    const transportMult = 0.55 + 0.45 * effectiveEnergyMult;
    const transport = I * 0.08 * transportMult;

    const disposable = Math.max(0, realIncome - housing - energy - food - transport);

    // Savings: real return = cbRate − inflation (can be negative = financial repression)
    const realReturn = (p.cbRate - p.inflation) / 100;
    const monthlySaved = disposable * p.savingsFrac;
    cumSavings = cumSavings * Math.pow(1 + realReturn / 12, 1) + monthlySaved;
    cumSavings = Math.max(0, cumSavings);

    results.push({
      year: TODAY + t,
      realIncome: Math.round(realIncome),
      housing: Math.round(housing),
      energy: Math.round(energy),
      food: Math.round(food),
      transport: Math.round(transport),
      disposable: Math.round(disposable),
      savings: Math.round(cumSavings),
      purchasingPowerIdx: Math.round((disposable / disposable0) * 1000) / 10,
    });
  }
  return results;
}

// ─── Presets ─────────────────────────────────────────────────────────────────
interface Preset {
  label: string;
  description: string;
  color: string;
  params: Omit<PPParams, "monthlyIncome" | "savingsFrac">;
}

const PRESETS: Preset[] = [
  {
    label: "Healthy economy",
    description: "Stable prices, wages keep pace, energy affordable.",
    color: "#34d399",
    params: { inflation: 2.5, wageGrowth: 3.0, cbRate: 3.0, housingFrac: 0.28, energyMultiplier: 1.0 },
  },
  {
    label: "Financial repression",
    description: "Near-zero rates, low inflation, stagnant wages — savings earn nothing.",
    color: "#38bdf8",
    params: { inflation: 1.5, wageGrowth: 1.0, cbRate: 0.5, housingFrac: 0.30, energyMultiplier: 1.1 },
  },
  {
    label: "2022 energy crisis",
    description: "Russia-Ukraine shock: energy spikes, inflation surges, rates rise sharply.",
    color: "#fbbf24",
    params: { inflation: 8.5, wageGrowth: 3.5, cbRate: 4.5, housingFrac: 0.34, energyMultiplier: 2.1 },
  },
  {
    label: "1970s stagflation",
    description: "Oil embargo, wages can't keep up, high rates crush disposable income.",
    color: "#f87171",
    params: { inflation: 12, wageGrowth: 5.0, cbRate: 10.0, housingFrac: 0.36, energyMultiplier: 2.5 },
  },
];

// ─── Slider config ────────────────────────────────────────────────────────────
const SLIDERS = [
  { key: "monthlyIncome",     label: "Monthly income",          icon: "💶", min: 1000, max: 10000, step: 100,  unit: "€",  tooltip: "Your gross monthly income in today's euros." },
  { key: "inflation",         label: "Inflation rate",          icon: "📈", min: 0,    max: 20,    step: 0.5,  unit: "%",  tooltip: "Annual general price level increase. Historical averages: 2% (stable), 5–10% (crisis)." },
  { key: "wageGrowth",        label: "Wage growth",             icon: "💼", min: 0,    max: 10,    step: 0.5,  unit: "%",  tooltip: "How much your nominal salary rises each year. Below inflation = real pay cut." },
  { key: "cbRate",            label: "Central bank rate",       icon: "🏦", min: 0,    max: 15,    step: 0.25, unit: "%",  tooltip: "The benchmark interest rate. High rates raise mortgage costs and slow growth. Low rates can fuel asset bubbles and erode savings." },
  { key: "housingFrac",       label: "Housing cost (% income)", icon: "🏠", min: 0.15, max: 0.60,  step: 0.01, unit: "%",  tooltip: "Rent or mortgage as a fraction of your income. In many cities this has risen from ~25% in 1980 to 40–50% today." },
  { key: "energyMultiplier",  label: "Energy price level",      icon: "⚡", min: 0.5,  max: 3.0,   step: 0.1,  unit: "×",  tooltip: "Multiplier on baseline energy costs. 2× = energy doubled (as in 2022). Cascades into food and transport prices." },
  { key: "savingsFrac",       label: "Savings rate",            icon: "🏦", min: 0,    max: 0.5,   step: 0.05, unit: "%",  tooltip: "Fraction of your disposable income you save each month." },
] as const;

type SliderKey = typeof SLIDERS[number]["key"];

// ─── Tooltip ──────────────────────────────────────────────────────────────────
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
          {e.name}: <span className="font-semibold">
            {typeof e.value === "number" && e.name.includes("€") ? `€${e.value.toLocaleString()}` : e.value}
          </span>
        </p>
      ))}
    </div>
  );
}

function ChartPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <SimulatorChartPanel title={title}>
      <ResponsiveContainer width="100%" height={220}>
        {children as React.ReactElement}
      </ResponsiveContainer>
    </SimulatorChartPanel>
  );
}

const fmtEur = (v: number) => `€${v.toLocaleString()}`;
const gridProps = { strokeDasharray: "3 3", stroke: "#1e293b" };
const xAxisProps = { dataKey: "year", tick: { fill: "#64748b", fontSize: 10 } };
const yAxisProps = { tick: { fill: "#64748b", fontSize: 10 } };
const legendProps = { wrapperStyle: { fontSize: 10 } };

// ─── Main component ───────────────────────────────────────────────────────────
export default function PurchasingPowerPage() {
  const [params, setParams] = useState<PPParams>({
    monthlyIncome: 3000,
    inflation: 3.0,
    wageGrowth: 2.0,
    cbRate: 3.5,
    housingFrac: 0.30,
    energyMultiplier: 1.2,
    savingsFrac: 0.10,
  });

  const data = useMemo(() => runPP(params), [params]);

  const setParam = (key: SliderKey, val: number) =>
    setParams((p) => ({ ...p, [key]: val }));

  const loadPreset = (preset: Preset) =>
    setParams((p) => ({ ...p, ...preset.params }));

  // Energy cascade breakdown today
  const today = data[0];
  const yr10  = data[10];
  const yr20  = data[data.length - 1];

  const costBreakdown = (d: PPYear) => [
    { name: "Housing",    value: d.housing,    fill: "#f87171" },
    { name: "Energy",     value: d.energy,     fill: "#fbbf24" },
    { name: "Food",       value: d.food,       fill: "#34d399" },
    { name: "Transport",  value: d.transport,  fill: "#38bdf8" },
    { name: "Disposable", value: d.disposable, fill: "#a78bfa" },
  ];

  // What €1000 buys after N years of inflation
  const inflationErosion = Array.from({ length: 21 }, (_, t) => ({
    year: TODAY + t,
    real: Math.round(1000 / Math.pow(1 + params.inflation / 100, t)),
  }));

  // Real wage vs inflation: are you keeping up?
  const realWageGap = params.wageGrowth - params.inflation;

  return (
    <AtlasPage className="simulator-atlas space-y-6 pb-12">
      <SimulatorHero
        actions={<SimulatorActionRow primaryHref="#purchasing-power-lab" primaryLabel="Open the lab" secondaryHref="#purchasing-power-ideas" secondaryLabel="Read the lessons" />}
        description="Move the levers around wages, inflation, energy, housing, and interest rates to see how everyday budgets evolve over two decades. The goal is not just to watch prices rise, but to understand why some households still fall behind even when their payslip gets bigger."
        eyebrow="Personal Economy Model"
        imageAlt="City and household economy simulation landscape"
        imageSrc="/atlas/simulator-hero.png"
        metrics={[
          { label: `Power in ${yr10.year}`, value: `${yr10.purchasingPowerIdx}%`, description: "Share of today's disposable income after ten years." },
          { label: `Power in ${yr20.year}`, value: `${yr20.purchasingPowerIdx}%`, description: "Long-run purchasing power relative to today." },
          { label: "Real savings", value: `€${yr20.savings.toLocaleString()}`, description: "Total savings built after inflation over 20 years." },
          { label: "Real wage gap", value: `${realWageGap >= 0 ? "+" : ""}${realWageGap.toFixed(1)}%`, description: "How much wages outpace or lag inflation each year." },
        ]}
        title="Your Purchasing Power"
      />

      <SimulatorPrimer
        aside="This lab is most useful when you compare the same household under different macro conditions. Try one stable baseline, then one energy shock or high-housing scenario, and watch which line in the budget starts eating the most breathing room."
        items={[
          {
            title: "Follow disposable income, not just salary.",
            text: "A higher nominal wage can still leave you worse off if housing, food, transport, and energy rise faster. The key signal is the disposable slice left after core costs.",
          },
          {
            title: "Watch the cascade from energy into everything else.",
            text: "Energy shocks do not stay in utility bills. They feed into food, transport, and manufacturing, then prompt central banks to raise rates, which squeezes housing separately.",
          },
          {
            title: "Treat the wage-price gap as the quiet pressure point.",
            text: "If wages trail inflation for long enough, the system erodes living standards slowly rather than all at once. That is why the purchasing-power index often matters more than one dramatic crisis headline.",
          },
        ]}
        summary="This simulator works best as a household lens on macroeconomics. It translates inflation, rate policy, housing pressure, and energy shocks into the question people actually feel: what is left at the end of the month, and how does that change over time?"
        title="Read the household system first"
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]" id="purchasing-power-lab">
        {/* ── Charts ── */}
        <div className="space-y-4">
          {/* Real income vs costs over 20 years */}
          <ChartPanel title="Monthly budget breakdown (real €, today's money)">
            <AreaChart data={data} stackOffset="none">
              <CartesianGrid {...gridProps} />
              <XAxis {...xAxisProps} />
              <YAxis {...yAxisProps} tickFormatter={fmtEur} />
              <Tooltip content={<ChartTooltip />} />
              <Legend {...legendProps} />
              <Area type="monotone" dataKey="housing"    name="Housing €"    stroke="#f87171" fill="#f87171" fillOpacity={0.7} stackId="costs" dot={false} />
              <Area type="monotone" dataKey="energy"     name="Energy €"     stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.7} stackId="costs" dot={false} />
              <Area type="monotone" dataKey="food"       name="Food €"       stroke="#34d399" fill="#34d399" fillOpacity={0.7} stackId="costs" dot={false} />
              <Area type="monotone" dataKey="transport"  name="Transport €"  stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.7} stackId="costs" dot={false} />
              <Area type="monotone" dataKey="disposable" name="Disposable €" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.85} stackId="costs" dot={false} />
            </AreaChart>
          </ChartPanel>

          {/* Purchasing power index + savings */}
          <div className="grid gap-4 sm:grid-cols-2">
            <ChartPanel title="Purchasing power index (100 = today)">
              <LineChart data={data}>
                <CartesianGrid {...gridProps} />
                <XAxis {...xAxisProps} />
                <YAxis {...yAxisProps} domain={[0, 150]} />
                <Tooltip content={<ChartTooltip />} />
                <ReferenceLine y={100} stroke="#64748b" strokeDasharray="4 2" />
                <Line type="monotone" dataKey="purchasingPowerIdx" name="Purchasing power %" stroke="#a78bfa" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ChartPanel>
            <ChartPanel title="Cumulative savings (real €)">
              <AreaChart data={data}>
                <CartesianGrid {...gridProps} />
                <XAxis {...xAxisProps} />
                <YAxis {...yAxisProps} tickFormatter={fmtEur} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="savings" name="Savings €" stroke="#34d399" fill="#34d399" fillOpacity={0.15} strokeWidth={2} dot={false} />
              </AreaChart>
            </ChartPanel>
          </div>

          {/* What €1000 buys over time */}
          <ChartPanel title={"What €1,000 in savings buys in future years (at " + params.inflation + "% inflation)"}>
            <AreaChart data={inflationErosion}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 10 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickFormatter={(v) => `€${v}`} domain={[0, 1100]} />
              <Tooltip formatter={(v: number) => [`€${v}`, "Real value"]} labelFormatter={(l) => `Year ${l}`} />
              <ReferenceLine y={1000} stroke="#64748b" strokeDasharray="4 2" label={{ value: "€1,000 today", fill: "#64748b", fontSize: 9 }} />
              <Area type="monotone" dataKey="real" name="Real value €" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.15} strokeWidth={2} dot={false} />
            </AreaChart>
          </ChartPanel>

          {/* Budget snapshot bars: today vs year 10 vs year 20 */}
          <SimulatorChartPanel title="Monthly budget snapshot (real €)">
            <p className="mb-4 text-xs font-semibold text-slate-400">Monthly budget snapshot (real €)</p>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { label: "Today (" + TODAY + ")", d: today },
                { label: "In 10 years (" + yr10.year + ")", d: yr10 },
                { label: "In 20 years (" + yr20.year + ")", d: yr20 },
              ].map(({ label, d }) => (
                <div key={label}>
                  <p className="mb-2 text-xs text-slate-500">{label}</p>
                  <div className="space-y-1.5">
                    {costBreakdown(d).map((item) => (
                      <div key={item.name} className="flex items-center gap-2 text-xs">
                        <div className="h-3 rounded" style={{
                          backgroundColor: item.fill,
                          width: `${Math.round((item.value / params.monthlyIncome) * 100)}%`,
                          minWidth: 4,
                          maxWidth: "100%",
                          opacity: 0.8,
                        }} />
                        <span className="text-slate-400 w-20 shrink-0">{item.name}</span>
                        <span className="font-mono text-slate-300">€{item.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SimulatorChartPanel>

          {/* Energy cascade explanation */}
          {params.energyMultiplier > 1.3 && (
            <SimulatorCallout title={`Energy cascade effect at ${params.energyMultiplier.toFixed(1)}× price level`} tone="gold">
                Energy isn&apos;t just your electricity bill. At {params.energyMultiplier.toFixed(1)}× baseline prices,
                food rises by ~{Math.round((params.energyMultiplier - 1) * 8)}% (fertilisers and transport run on oil),
                transport costs climb by ~{Math.round((params.energyMultiplier - 1) * 35)}%,
                and manufactured goods rise by ~{Math.round((params.energyMultiplier - 1) * 12)}%.
                Central banks respond by raising rates — which then increases your housing cost separately.
                This is the mechanism behind the 1973 and 2022 inflation shocks.
            </SimulatorCallout>
          )}

          {realWageGap < 0 && (
            <SimulatorCallout title={`Real wage decline: wages grow at ${params.wageGrowth}% but inflation is ${params.inflation}%`} tone="rose">
                Your nominal salary is rising, but purchasing power is shrinking by {Math.abs(realWageGap).toFixed(1)}% per year in real terms.
                After 10 years that compounds to a {Math.round((1 - Math.pow(1 + realWageGap / 100, 10)) * 100)}% real pay cut — even though your payslip shows a higher number.
                This is how sustained inflation quietly redistributes income from workers to asset holders.
            </SimulatorCallout>
          )}
        </div>

        {/* ── Controls ── */}
        <div className="space-y-4">
          {/* Sliders */}
          <SimulatorSidebarPanel kicker="Your situation" title="Set the pressures" tone="gold">
            {SLIDERS.map((sl) => {
              const val = params[sl.key];
              const display = sl.unit === "%" && sl.key !== "housingFrac"
                ? `${val}%`
                : sl.key === "housingFrac"
                ? `${Math.round(val * 100)}%`
                : sl.key === "energyMultiplier"
                ? `${val.toFixed(1)}×`
                : `€${(val as number).toLocaleString()}`;
              return (
                <label key={sl.key} className="block">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-800 dark:text-slate-100">{sl.icon} {sl.label}</span>
                    <span className="font-mono font-bold text-[rgb(var(--atlas-gold))]">{display}</span>
                  </div>
                  <input
                    type="range"
                    min={sl.min} max={sl.max} step={sl.step}
                    value={val as number}
                    onChange={(e) => setParam(sl.key, Number(e.target.value))}
                    className="w-full accent-[rgb(var(--atlas-gold))]"
                  />
                  <p className="mt-0.5 text-xs text-slate-500">{sl.tooltip}</p>
                </label>
              );
            })}
          </SimulatorSidebarPanel>

          {/* Scenario presets */}
          <SimulatorSidebarPanel kicker="Historical scenarios" title="Load a preset">
            {PRESETS.map((preset) => (
              <button key={preset.label} onClick={() => loadPreset(preset)}
                className="w-full rounded-2xl border border-[rgba(28,36,48,0.08)] bg-white/76 p-3 text-left transition hover:border-[rgba(28,36,48,0.18)] dark:border-slate-800 dark:bg-slate-900/65"
                style={{ borderLeftColor: preset.color, borderLeftWidth: 3 }}>
                <p className="text-xs font-semibold" style={{ color: preset.color }}>{preset.label}</p>
                <p className="mt-0.5 text-xs text-slate-500">{preset.description}</p>
              </button>
            ))}
          </SimulatorSidebarPanel>

          {/* Key insights */}
          <SimulatorSidebarPanel kicker="Key mechanisms" title="What drives the squeeze" className="space-y-3">
            {[
              { title: "Wage-price gap", text: "When inflation exceeds wage growth, every extra year means a hidden pay cut — even if your payslip shows a bigger number.", color: "text-rose-300" },
              { title: "Energy cascade", text: "Energy price shocks don't just raise your utility bill. They flow through fertilisers → food prices, fuel → transport costs, and heating → manufacturing costs.", color: "text-amber-300" },
              { title: "Interest rate squeeze", text: "Higher central bank rates reduce inflation but raise mortgage rates and rents simultaneously, squeezing you from both sides.", color: "text-cyan-300" },
              { title: "Financial repression", text: "When savings rates are below inflation, every euro you save loses value. Central banks used this deliberately after 2008 to reduce debt burdens.", color: "text-violet-300" },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.58)] p-3 dark:border-slate-800 dark:bg-slate-900/60">
                <p className={`text-xs font-semibold ${item.color}`}>{item.title}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.text}</p>
              </div>
            ))}
          </SimulatorSidebarPanel>
        </div>
      </div>
      <div id="purchasing-power-ideas" />
    </AtlasPage>
  );
}
