"use client";

import { useMemo, useState } from "react";
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
import {
  SimulatorActionRow,
  SimulatorCallout,
  SimulatorChartPanel,
  SimulatorHero,
  SimulatorPrimer,
  SimulatorSidebarPanel,
} from "@/components/simulator/SimulatorAtlas";

// ─── Model ────────────────────────────────────────────────────────────────────
interface WGParams {
  initialCapital: number;       // starting wealth of capital owner (€)
  capitalReturnRate: number;    // % annual return on capital (stocks, property, etc.)
  capitalGainsTax: number;      // % effective tax rate on capital gains
  taxHavenFactor: number;       // 0 = no haven, 1 = full offshore (reduces effective tax ~80%)

  workerSalary: number;         // annual salary of worker (€)
  wageGrowth: number;           // % annual wage growth
  incomeTax: number;            // % income tax rate
  workerSavingsRate: number;    // % of net salary saved each year
  workerSavingsReturn: number;  // % annual return on worker savings (bank deposit, etc.)

  initialWorkerSavings: number; // worker starting savings (€)
}

interface WGYear {
  year: number;
  capitalWealth: number;
  workerWealth: number;
  ratio: number;        // capital / worker wealth
  workerSalary: number;
  capitalIncome: number; // annual capital return
}

const TODAY = new Date().getFullYear();

function runWealthGap(p: WGParams, years = 35): WGYear[] {
  let capitalWealth = p.initialCapital;
  let workerWealth = p.initialWorkerSavings;
  let salary = p.workerSalary;
  const results: WGYear[] = [];

  for (let t = 0; t <= years; t++) {
    // Capital owner: annual return, taxed (with possible haven discount)
    const effectiveCGTax = p.capitalGainsTax * (1 - p.taxHavenFactor * 0.80) / 100;
    const capitalReturn = capitalWealth * p.capitalReturnRate / 100;
    const capitalTax = capitalReturn * effectiveCGTax;
    capitalWealth += capitalReturn - capitalTax;

    // Worker: salary grows, pay income tax, save a fraction
    salary *= (1 + p.wageGrowth / 100);
    const netSalary = salary * (1 - p.incomeTax / 100);
    const annualSavings = netSalary * p.workerSavingsRate / 100;
    // Worker savings earn a lower return (savings account vs capital market)
    workerWealth = workerWealth * (1 + p.workerSavingsReturn / 100) + annualSavings;
    workerWealth = Math.max(0, workerWealth);

    results.push({
      year: TODAY + t,
      capitalWealth: Math.round(capitalWealth),
      workerWealth: Math.round(workerWealth),
      ratio: workerWealth > 0 ? Math.round((capitalWealth / workerWealth) * 10) / 10 : 999,
      workerSalary: Math.round(salary),
      capitalIncome: Math.round(capitalReturn - capitalTax),
    });
  }

  return results;
}

// ─── Presets ─────────────────────────────────────────────────────────────────
const PRESETS = [
  {
    label: "Current trends",
    description: "Typical OECD: capital earns 5%, wages grow 2%, light capital taxes.",
    color: "#f87171",
    params: { capitalReturnRate: 5, capitalGainsTax: 20, taxHavenFactor: 0, wageGrowth: 2, incomeTax: 30, workerSavingsRate: 10, workerSavingsReturn: 2 },
  },
  {
    label: "Tax haven advantage",
    description: "Capital shifted offshore reduces effective rate to ~4%. Compounding gap widens sharply.",
    color: "#fbbf24",
    params: { capitalReturnRate: 5.5, capitalGainsTax: 20, taxHavenFactor: 0.8, wageGrowth: 2, incomeTax: 30, workerSavingsRate: 10, workerSavingsReturn: 2 },
  },
  {
    label: "1980s deregulation",
    description: "Reagan/Thatcher era: higher capital returns, weaker unions, slower wage growth.",
    color: "#fb923c",
    params: { capitalReturnRate: 7, capitalGainsTax: 15, taxHavenFactor: 0.2, wageGrowth: 1.0, incomeTax: 35, workerSavingsRate: 8, workerSavingsReturn: 1.5 },
  },
  {
    label: "Progressive reform",
    description: "Higher capital gains tax, wealth tax, stronger wage protections.",
    color: "#34d399",
    params: { capitalReturnRate: 5, capitalGainsTax: 40, taxHavenFactor: 0, wageGrowth: 3.5, incomeTax: 28, workerSavingsRate: 15, workerSavingsReturn: 3 },
  },
  {
    label: "Scandinavia model",
    description: "High taxes, strong unions, robust public services. Gap narrows over time.",
    color: "#38bdf8",
    params: { capitalReturnRate: 4.5, capitalGainsTax: 35, taxHavenFactor: 0, wageGrowth: 3, incomeTax: 35, workerSavingsRate: 18, workerSavingsReturn: 3.5 },
  },
];

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
            {String(e.name).includes("Ratio") ? `${e.value}×` : `€${Number(e.value).toLocaleString()}`}
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

const fmtEur = (v: number) => `€${(v / 1000).toFixed(0)}k`;
const gridProps = { strokeDasharray: "3 3", stroke: "#1e293b" };
const xAxisProps = { dataKey: "year", tick: { fill: "#64748b", fontSize: 10 } };
const legendProps = { wrapperStyle: { fontSize: 10 } };

// ─── Main component ───────────────────────────────────────────────────────────
export default function WealthGapPage() {
  const [params, setParams] = useState<WGParams>({
    initialCapital: 250000,
    capitalReturnRate: 5.0,
    capitalGainsTax: 20,
    taxHavenFactor: 0,
    workerSalary: 40000,
    wageGrowth: 2.0,
    incomeTax: 30,
    workerSavingsRate: 10,
    workerSavingsReturn: 2.0,
    initialWorkerSavings: 15000,
  });

  const data = useMemo(() => runWealthGap(params), [params]);
  const setP = (key: keyof WGParams, val: number) =>
    setParams((p) => ({ ...p, [key]: val }));

  const yr0  = data[0];
  const yr20 = data[Math.min(20, data.length - 1)];
  const yr35 = data[data.length - 1];

  // Piketty: r vs g
  const effectiveCGTax = params.capitalGainsTax * (1 - params.taxHavenFactor * 0.80) / 100;
  const r = params.capitalReturnRate * (1 - effectiveCGTax);
  const g = params.wageGrowth;

  return (
    <AtlasPage className="simulator-atlas space-y-6 pb-12">
      <SimulatorHero
        actions={<SimulatorActionRow primaryHref="#wealth-gap-lab" primaryLabel="Open the lab" secondaryHref="#wealth-gap-ideas" secondaryLabel="Read the lessons" />}
        description="When wealth compounds faster than wages, inequality widens even if everyone works hard. Test how tax policy, offshore strategies, savings rates, and different return profiles change the balance between labour income and capital income over a generation."
        eyebrow="Capital vs Labour Model"
        imageAlt="Wealth and labour simulation landscape"
        imageSrc="/atlas/simulator-hero.png"
        metrics={[
          { label: "Starting ratio", value: `${yr0.ratio}×`, description: "How much richer the capital owner begins compared with the worker." },
          { label: `Ratio in ${yr20.year}`, value: `${yr20.ratio}×`, description: "Wealth gap after two decades of compounding." },
          { label: `Ratio in ${yr35.year}`, value: `${yr35.ratio}×`, description: "Long-run inequality after a generation." },
          { label: "r vs g", value: `${r.toFixed(1)} vs ${g.toFixed(1)}`, description: "After-tax capital return compared with wage growth." },
        ]}
        title="The Wealth Gap"
      />

      <SimulatorPrimer
        aside="A useful way to use this lab is to hold the worker side constant, then change only the capital side. That makes the structural asymmetry visible much faster than changing everything at once."
        items={[
          {
            title: "Watch the spread between r and g.",
            text: "When after-tax capital returns stay above wage growth, the capital owner compounds into a different world than the wage earner. That spread is the engine behind the long-run divergence.",
          },
          {
            title: "Notice when passive income beats salary.",
            text: "The crossover point matters because it shows when capital no longer needs labour to keep expanding. After that, wealth can reproduce itself with very little new effort.",
          },
          {
            title: "Tax design changes the slope, not just the ethics.",
            text: "Capital gains taxes, offshore leakage, and worker savings returns all change the curve. This is why inequality is not only about who works hard, but about which income streams the system rewards most.",
          },
        ]}
        summary="This lab is not about comparing two individuals morally. It is about comparing two income mechanisms: one grows because a person works, the other grows because assets already exist. The charts make that structural difference visible across a generation."
        title="Read inequality as a compounding mechanism"
      />

      {/* r vs g badge */}
      <div className={`rounded-[1.5rem] border px-5 py-4 flex items-center gap-4 ${r > g ? "border-[rgba(239,68,68,0.18)] bg-[rgba(239,68,68,0.08)]" : "border-[rgba(76,175,80,0.2)] bg-[rgba(76,175,80,0.08)]"}`}>
        <div className="text-3xl font-black">
          <span className="text-violet-400">r</span>
          <span className={`mx-2 ${r > g ? "text-rose-400" : "text-emerald-400"}`}>{r > g ? ">" : "<"}</span>
          <span className="text-cyan-400">g</span>
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-300">
          <span className="text-violet-400 font-semibold">r</span> = {r.toFixed(1)}% (after-tax capital return) &nbsp;|&nbsp;
          <span className="text-cyan-400 font-semibold">g</span> = {g}% (wage growth)
          {r > g
            ? <span className="ml-2 text-rose-400">Wealth inequality is growing.</span>
            : <span className="ml-2 text-emerald-400">Wages are gaining ground.</span>}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]" id="wealth-gap-lab">
        {/* ── Charts ── */}
        <div className="space-y-4">
          {/* Wealth divergence chart */}
          <ChartPanel title="Wealth over 35 years">
            <AreaChart data={data}>
              <CartesianGrid {...gridProps} />
              <XAxis {...xAxisProps} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickFormatter={fmtEur} />
              <Tooltip content={<ChartTooltip />} />
              <Legend {...legendProps} />
              <Area type="monotone" dataKey="capitalWealth" name="Capital owner wealth €"
                stroke="#f87171" fill="#f87171" fillOpacity={0.15} strokeWidth={2.5} dot={false} />
              <Area type="monotone" dataKey="workerWealth" name="Worker wealth €"
                stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.15} strokeWidth={2.5} dot={false} />
            </AreaChart>
          </ChartPanel>

          {/* Wealth ratio + income comparison */}
          <div className="grid gap-4 sm:grid-cols-2">
            <ChartPanel title="Wealth ratio (capital / worker)">
              <LineChart data={data}>
                <CartesianGrid {...gridProps} />
                <XAxis {...xAxisProps} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                <Tooltip content={<ChartTooltip />} />
                <ReferenceLine y={yr0.ratio} stroke="#64748b" strokeDasharray="4 2"
                  label={{ value: "Start", fill: "#64748b", fontSize: 9 }} />
                <Line type="monotone" dataKey="ratio" name="Ratio ×"
                  stroke="#a78bfa" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ChartPanel>
            <ChartPanel title="Annual capital income vs worker salary">
              <LineChart data={data}>
                <CartesianGrid {...gridProps} />
                <XAxis {...xAxisProps} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickFormatter={fmtEur} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="capitalIncome" name="Capital income €"
                  stroke="#f87171" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="workerSalary" name="Worker salary €"
                  stroke="#38bdf8" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartPanel>
          </div>

          {/* Insight callout: when capital income > salary */}
          {data.some((d) => d.capitalIncome > d.workerSalary) && (() => {
            const crossover = data.find((d) => d.capitalIncome >= d.workerSalary);
            return crossover ? (
              <SimulatorCallout title={`Capital income exceeds worker salary by ${crossover.year}`} tone="rose">
                  By {crossover.year}, the capital owner earns €{crossover.capitalIncome.toLocaleString()}/year
                  from passive returns — more than the worker&apos;s salary of €{crossover.workerSalary.toLocaleString()}.
                  The capital owner does not need to work. The gap becomes self-reinforcing: more wealth → more returns → even more wealth.
              </SimulatorCallout>
            ) : null;
          })()}
        </div>

        {/* ── Controls ── */}
        <div className="space-y-4">
          {/* Capital owner inputs */}
          <SimulatorSidebarPanel kicker="Capital owner" title="Set the asset side" className="space-y-4">
            {([
              { key: "initialCapital",    label: "Starting wealth",          icon: "🏦", min: 50000,  max: 2000000, step: 10000, fmt: (v: number) => `€${v.toLocaleString()}` },
              { key: "capitalReturnRate", label: "Annual return on capital", icon: "📈", min: 1,      max: 12,      step: 0.25,  fmt: (v: number) => `${v}%` },
              { key: "capitalGainsTax",   label: "Capital gains tax rate",   icon: "🏛️", min: 0,      max: 60,      step: 1,     fmt: (v: number) => `${v}%` },
              { key: "taxHavenFactor",    label: "Offshore / tax haven use", icon: "🏝️", min: 0,      max: 1,       step: 0.05,  fmt: (v: number) => `${Math.round(v * 100)}%` },
            ] as const).map((sl) => (
              <label key={sl.key} className="block">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-800 dark:text-slate-100">{sl.icon} {sl.label}</span>
                  <span className="font-mono font-bold text-rose-400">{sl.fmt(params[sl.key])}</span>
                </div>
                <input type="range" min={sl.min} max={sl.max} step={sl.step}
                  value={params[sl.key] as number}
                  onChange={(e) => setP(sl.key, Number(e.target.value))}
                  className="w-full accent-rose-400" />
              </label>
            ))}
          </SimulatorSidebarPanel>

          {/* Worker inputs */}
          <SimulatorSidebarPanel kicker="Worker" title="Set the wage path" tone="blue" className="space-y-4">
            {([
              { key: "initialWorkerSavings", label: "Starting savings",     icon: "💰", min: 0,      max: 100000, step: 1000, fmt: (v: number) => `€${v.toLocaleString()}` },
              { key: "workerSalary",         label: "Annual salary",        icon: "💼", min: 15000,  max: 120000, step: 1000, fmt: (v: number) => `€${v.toLocaleString()}` },
              { key: "wageGrowth",           label: "Annual wage growth",   icon: "📊", min: 0,      max: 8,      step: 0.25, fmt: (v: number) => `${v}%` },
              { key: "incomeTax",            label: "Income tax rate",      icon: "🏛️", min: 10,     max: 55,     step: 1,    fmt: (v: number) => `${v}%` },
              { key: "workerSavingsRate",    label: "Savings rate",         icon: "🏦", min: 0,      max: 40,     step: 1,    fmt: (v: number) => `${v}%` },
              { key: "workerSavingsReturn",  label: "Return on savings",    icon: "📈", min: 0,      max: 6,      step: 0.25, fmt: (v: number) => `${v}%` },
            ] as const).map((sl) => (
              <label key={sl.key} className="block">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-800 dark:text-slate-100">{sl.icon} {sl.label}</span>
                  <span className="font-mono font-bold text-[rgb(var(--atlas-blue))]">{sl.fmt(params[sl.key])}</span>
                </div>
                <input type="range" min={sl.min} max={sl.max} step={sl.step}
                  value={params[sl.key] as number}
                  onChange={(e) => setP(sl.key, Number(e.target.value))}
                  className="w-full accent-[rgb(var(--atlas-blue))]" />
              </label>
            ))}
          </SimulatorSidebarPanel>

          {/* Presets */}
          <SimulatorSidebarPanel kicker="Historical models" title="Load a preset">
            {PRESETS.map((preset) => (
              <button key={preset.label}
                onClick={() => setParams((p) => ({ ...p, ...preset.params }))}
                className="w-full rounded-2xl border border-[rgba(28,36,48,0.08)] bg-white/76 p-3 text-left transition hover:border-[rgba(28,36,48,0.18)] dark:border-slate-800 dark:bg-slate-900/65"
                style={{ borderLeftColor: preset.color, borderLeftWidth: 3 }}>
                <p className="text-xs font-semibold" style={{ color: preset.color }}>{preset.label}</p>
                <p className="mt-0.5 text-xs text-slate-500">{preset.description}</p>
              </button>
            ))}
          </SimulatorSidebarPanel>

          {/* Key concepts */}
          <SimulatorSidebarPanel kicker="Key concepts" title="Why the gap compounds" className="space-y-3">
            {[
              { title: "r > g (Piketty)", text: "When the return on capital (r) exceeds economic growth (g), those who own capital accumulate wealth faster than those who earn it through work.", color: "text-violet-300" },
              { title: "Compound asymmetry", text: "Capital earns 5–8% per year. Bank deposits earn 1–3%. This isn't a level playing field — it's a structural advantage for whoever starts with capital.", color: "text-rose-300" },
              { title: "Tax haven multiplier", text: "Offshore structures can reduce effective capital gains tax from 25% to under 5%, dramatically widening the gap — legally.", color: "text-amber-300" },
              { title: "The inheritance lock-in", text: "Wealth that compounds over 35 years is then passed on, giving the next generation a head start that compound interest turns into a permanent lead.", color: "text-cyan-300" },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.58)] p-3 dark:border-slate-800 dark:bg-slate-900/60">
                <p className={`text-xs font-semibold ${item.color}`}>{item.title}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.text}</p>
              </div>
            ))}
          </SimulatorSidebarPanel>
        </div>
      </div>
      <div id="wealth-gap-ideas" />
    </AtlasPage>
  );
}
