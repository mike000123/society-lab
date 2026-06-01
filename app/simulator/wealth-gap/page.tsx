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
    <div className="rounded-2xl border border-slate-800 bg-panel p-4">
      <p className="mb-3 text-xs font-semibold text-slate-400">{title}</p>
      <ResponsiveContainer width="100%" height={220}>
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
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
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* Header */}
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/85 p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-violet-400/12 via-violet-400/4 to-transparent" />
        <div className="relative">
          <span className="inline-flex rounded-full border border-violet-300/25 bg-violet-400/10 px-3 py-1 text-xs font-medium text-violet-100">
            Capital vs Labour Model
          </span>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-50 sm:text-4xl">
            The Wealth Gap
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
            When capital returns exceed wage growth — Piketty&apos;s <em>r &gt; g</em> — wealth concentrates regardless of individual effort. See how tax rates, offshore structures, and union density change the trajectory.
          </p>
        </div>
      </section>

      {/* r vs g badge */}
      <div className={`rounded-2xl border p-4 flex items-center gap-4 ${r > g ? "border-rose-400/30 bg-rose-400/5" : "border-emerald-400/30 bg-emerald-400/5"}`}>
        <div className="text-3xl font-black">
          <span className="text-violet-400">r</span>
          <span className={`mx-2 ${r > g ? "text-rose-400" : "text-emerald-400"}`}>{r > g ? ">" : "<"}</span>
          <span className="text-cyan-400">g</span>
        </div>
        <div className="text-sm text-slate-300">
          <span className="text-violet-400 font-semibold">r</span> = {r.toFixed(1)}% (after-tax capital return) &nbsp;|&nbsp;
          <span className="text-cyan-400 font-semibold">g</span> = {g}% (wage growth)
          {r > g
            ? <span className="ml-2 text-rose-400">Wealth inequality is growing.</span>
            : <span className="ml-2 text-emerald-400">Wages are gaining ground.</span>}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* ── Charts ── */}
        <div className="space-y-4">

          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Initial wealth ratio", value: `${yr0.ratio}×`, sub: "Capital owner vs worker", color: "text-slate-300" },
              { label: "Wealth ratio in 20 years", value: `${yr20.ratio}×`, sub: "Capital vs worker", color: yr20.ratio > yr0.ratio ? "text-rose-400" : "text-emerald-400" },
              { label: "Wealth ratio in 35 years", value: `${yr35.ratio}×`, sub: "Capital vs worker", color: yr35.ratio > yr0.ratio * 1.5 ? "text-rose-400" : yr35.ratio > yr0.ratio ? "text-amber-400" : "text-emerald-400" },
            ].map((c) => (
              <div key={c.label} className="rounded-2xl border border-slate-800 bg-panel p-4">
                <p className="text-xs text-slate-500">{c.label}</p>
                <p className={`mt-1 text-2xl font-black ${c.color}`}>{c.value}</p>
                <p className="text-xs text-slate-600">{c.sub}</p>
              </div>
            ))}
          </div>

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
              <div className="rounded-2xl border border-rose-400/20 bg-rose-400/5 p-5">
                <p className="text-xs font-semibold text-rose-300 mb-2">
                  💡 Capital income exceeds worker salary by {crossover.year}
                </p>
                <p className="text-xs text-slate-300 leading-5">
                  By {crossover.year}, the capital owner earns €{crossover.capitalIncome.toLocaleString()}/year
                  from passive returns — more than the worker&apos;s salary of €{crossover.workerSalary.toLocaleString()}.
                  The capital owner does not need to work. The gap becomes self-reinforcing: more wealth → more returns → even more wealth.
                </p>
              </div>
            ) : null;
          })()}
        </div>

        {/* ── Controls ── */}
        <div className="space-y-4">
          {/* Capital owner inputs */}
          <div className="rounded-[1.75rem] border border-rose-400/20 bg-panel p-5 space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-rose-300">Capital owner</p>
            {([
              { key: "initialCapital",    label: "Starting wealth",          icon: "🏦", min: 50000,  max: 2000000, step: 10000, fmt: (v: number) => `€${v.toLocaleString()}` },
              { key: "capitalReturnRate", label: "Annual return on capital", icon: "📈", min: 1,      max: 12,      step: 0.25,  fmt: (v: number) => `${v}%` },
              { key: "capitalGainsTax",   label: "Capital gains tax rate",   icon: "🏛️", min: 0,      max: 60,      step: 1,     fmt: (v: number) => `${v}%` },
              { key: "taxHavenFactor",    label: "Offshore / tax haven use", icon: "🏝️", min: 0,      max: 1,       step: 0.05,  fmt: (v: number) => `${Math.round(v * 100)}%` },
            ] as const).map((sl) => (
              <label key={sl.key} className="block">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">{sl.icon} {sl.label}</span>
                  <span className="font-mono font-bold text-rose-300">{sl.fmt(params[sl.key])}</span>
                </div>
                <input type="range" min={sl.min} max={sl.max} step={sl.step}
                  value={params[sl.key] as number}
                  onChange={(e) => setP(sl.key, Number(e.target.value))}
                  className="w-full accent-rose-400" />
              </label>
            ))}
          </div>

          {/* Worker inputs */}
          <div className="rounded-[1.75rem] border border-cyan-400/20 bg-panel p-5 space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Worker</p>
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
                  <span className="text-slate-300">{sl.icon} {sl.label}</span>
                  <span className="font-mono font-bold text-cyan-300">{sl.fmt(params[sl.key])}</span>
                </div>
                <input type="range" min={sl.min} max={sl.max} step={sl.step}
                  value={params[sl.key] as number}
                  onChange={(e) => setP(sl.key, Number(e.target.value))}
                  className="w-full accent-cyan-400" />
              </label>
            ))}
          </div>

          {/* Presets */}
          <div className="rounded-[1.75rem] border border-slate-800 bg-panel p-5 space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Historical models</p>
            {PRESETS.map((preset) => (
              <button key={preset.label}
                onClick={() => setParams((p) => ({ ...p, ...preset.params }))}
                className="w-full rounded-2xl border border-slate-800 p-3 text-left hover:border-slate-600 transition-colors"
                style={{ borderLeftColor: preset.color, borderLeftWidth: 3 }}>
                <p className="text-xs font-semibold" style={{ color: preset.color }}>{preset.label}</p>
                <p className="mt-0.5 text-xs text-slate-500">{preset.description}</p>
              </button>
            ))}
          </div>

          {/* Key concepts */}
          <div className="rounded-[1.75rem] border border-slate-800 bg-panel p-5 space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Key concepts</p>
            {[
              { title: "r > g (Piketty)", text: "When the return on capital (r) exceeds economic growth (g), those who own capital accumulate wealth faster than those who earn it through work.", color: "text-violet-300" },
              { title: "Compound asymmetry", text: "Capital earns 5–8% per year. Bank deposits earn 1–3%. This isn't a level playing field — it's a structural advantage for whoever starts with capital.", color: "text-rose-300" },
              { title: "Tax haven multiplier", text: "Offshore structures can reduce effective capital gains tax from 25% to under 5%, dramatically widening the gap — legally.", color: "text-amber-300" },
              { title: "The inheritance lock-in", text: "Wealth that compounds over 35 years is then passed on, giving the next generation a head start that compound interest turns into a permanent lead.", color: "text-cyan-300" },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <p className={`text-xs font-semibold ${item.color}`}>{item.title}</p>
                <p className="mt-1 text-xs text-slate-400">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
