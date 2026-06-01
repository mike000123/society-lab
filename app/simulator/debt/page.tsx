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
interface DebtParams {
  // Debt side
  debtAmount: number;           // € starting debt
  debtInterestRate: number;     // % annual (e.g. mortgage, credit card)
  monthlyDebtPayment: number;   // € per month repaid

  // Savings side
  initialSavings: number;       // € starting savings
  monthlySavingsDeposit: number; // € per month saved
  savingsReturnRate: number;    // % annual return on savings/investments

  // Income context
  monthlyIncome: number;        // for affordability ratios
}

interface DebtYear {
  year: number;
  month: number;
  debt: number;
  savings: number;
  netWorth: number;
  totalInterestPaid: number;
  totalPrincipalPaid: number;
}

const TODAY_YEAR = new Date().getFullYear();

function runDebt(p: DebtParams, years = 30): DebtYear[] {
  let debt = p.debtAmount;
  let savings = p.initialSavings;
  let totalInterest = 0;
  let totalPrincipal = 0;
  const results: DebtYear[] = [];
  const totalMonths = years * 12;

  for (let m = 0; m <= totalMonths; m++) {
    if (m % 12 === 0) {
      results.push({
        year: TODAY_YEAR + Math.floor(m / 12),
        month: m,
        debt: Math.round(Math.max(0, debt)),
        savings: Math.round(savings),
        netWorth: Math.round(savings - Math.max(0, debt)),
        totalInterestPaid: Math.round(totalInterest),
        totalPrincipalPaid: Math.round(totalPrincipal),
      });
    }

    if (debt > 0) {
      const monthlyInterest = debt * (p.debtInterestRate / 100 / 12);
      const payment = Math.min(p.monthlyDebtPayment, debt + monthlyInterest);
      const principalPaid = payment - monthlyInterest;
      totalInterest += monthlyInterest;
      totalPrincipal += Math.max(0, principalPaid);
      debt = Math.max(0, debt - principalPaid);
    }

    savings = savings * (1 + p.savingsReturnRate / 100 / 12) + p.monthlySavingsDeposit;
  }

  return results;
}

// Net worth trajectory for comparing scenarios
function netWorthAt(p: DebtParams, years: number): number {
  const data = runDebt(p, years);
  return data[data.length - 1]?.netWorth ?? 0;
}

// ─── Presets ─────────────────────────────────────────────────────────────────
const PRESETS = [
  {
    label: "Affordable mortgage (low rate)",
    description: "30-year mortgage at 3.5% — pre-2022 era of cheap money.",
    color: "#34d399",
    params: { debtAmount: 200000, debtInterestRate: 3.5, monthlyDebtPayment: 900, initialSavings: 20000, monthlySavingsDeposit: 300, savingsReturnRate: 4 },
  },
  {
    label: "Mortgage after rate hike",
    description: "Same mortgage re-priced at 6.5% — post-2022 central bank tightening.",
    color: "#fbbf24",
    params: { debtAmount: 200000, debtInterestRate: 6.5, monthlyDebtPayment: 1265, initialSavings: 20000, monthlySavingsDeposit: 150, savingsReturnRate: 4 },
  },
  {
    label: "Credit card spiral",
    description: "€8,000 credit card debt at 22%. Minimum payments barely cover interest.",
    color: "#f87171",
    params: { debtAmount: 8000, debtInterestRate: 22, monthlyDebtPayment: 200, initialSavings: 1000, monthlySavingsDeposit: 50, savingsReturnRate: 2 },
  },
  {
    label: "Student loan",
    description: "€25,000 degree debt at 6%, manageable payments, growing savings.",
    color: "#a78bfa",
    params: { debtAmount: 25000, debtInterestRate: 6, monthlyDebtPayment: 280, initialSavings: 2000, monthlySavingsDeposit: 250, savingsReturnRate: 5 },
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
          {e.name}: <span className="font-semibold">€{Number(e.value).toLocaleString()}</span>
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

const fmtEur = (v: number) => v >= 1000 ? `€${(v / 1000).toFixed(0)}k` : `€${v}`;
const gridProps = { strokeDasharray: "3 3", stroke: "#1e293b" };
const xAxisProps = { dataKey: "year", tick: { fill: "#64748b", fontSize: 10 } };
const yAxisProps = { tick: { fill: "#64748b", fontSize: 10 }, tickFormatter: fmtEur };
const legendProps = { wrapperStyle: { fontSize: 10 } };

// ─── Main component ───────────────────────────────────────────────────────────
export default function DebtSimulatorPage() {
  const [params, setParams] = useState<DebtParams>({
    debtAmount: 200000,
    debtInterestRate: 5.5,
    monthlyDebtPayment: 1100,
    initialSavings: 20000,
    monthlySavingsDeposit: 300,
    savingsReturnRate: 4.0,
    monthlyIncome: 3500,
  });

  const data = useMemo(() => runDebt(params), [params]);
  const setP = (key: keyof DebtParams, val: number) =>
    setParams((p) => ({ ...p, [key]: val }));

  const debtFreeYear = data.find((d) => d.debt === 0);
  const lastYear = data[data.length - 1];
  const totalCostOfDebt = params.debtAmount + (lastYear?.totalInterestPaid ?? 0);
  const debtPaymentPct = Math.round((params.monthlyDebtPayment / params.monthlyIncome) * 100);

  // What if you invested the debt payment instead of paying debt?
  const noDebtScenario = useMemo(() => {
    let savings = params.initialSavings;
    const monthly = params.monthlySavingsDeposit + params.monthlyDebtPayment;
    const results = [];
    for (let m = 0; m <= 30 * 12; m++) {
      if (m % 12 === 0) results.push({ year: TODAY_YEAR + m / 12, savings: Math.round(savings) });
      savings = savings * (1 + params.savingsReturnRate / 100 / 12) + monthly;
    }
    return results;
  }, [params]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* Header */}
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/85 p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-rose-400/12 via-rose-400/4 to-transparent" />
        <div className="relative">
          <span className="inline-flex rounded-full border border-rose-300/25 bg-rose-400/10 px-3 py-1 text-xs font-medium text-rose-100">
            Debt & Compound Interest Model
          </span>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-50 sm:text-4xl">
            Debt vs Savings
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
            Compound interest is the most powerful force in personal finance — and it works against you on debt while working for you on savings. See how interest rates, payment sizes and time interact to shape your net worth.
          </p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* ── Charts ── */}
        <div className="space-y-4">

          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              {
                label: "Debt-free in",
                value: debtFreeYear ? String(debtFreeYear.year) : "30+ yrs",
                sub: debtFreeYear ? `${debtFreeYear.year - TODAY_YEAR} years` : "Not within 30 years",
                color: debtFreeYear ? "text-emerald-400" : "text-rose-400",
              },
              {
                label: "Total interest paid",
                value: `€${(lastYear?.totalInterestPaid ?? 0).toLocaleString()}`,
                sub: `${Math.round(((lastYear?.totalInterestPaid ?? 0) / params.debtAmount) * 100)}% of principal`,
                color: "text-rose-400",
              },
              {
                label: "Net worth in 30 years",
                value: `€${(lastYear?.netWorth ?? 0).toLocaleString()}`,
                sub: lastYear?.netWorth && lastYear.netWorth > 0 ? "Positive equity" : "Still in debt",
                color: (lastYear?.netWorth ?? 0) > 0 ? "text-emerald-400" : "text-rose-400",
              },
              {
                label: "Debt payment burden",
                value: `${debtPaymentPct}%`,
                sub: "of monthly income",
                color: debtPaymentPct > 35 ? "text-rose-400" : debtPaymentPct > 25 ? "text-amber-400" : "text-emerald-400",
              },
            ].map((c) => (
              <div key={c.label} className="rounded-2xl border border-slate-800 bg-panel p-4">
                <p className="text-xs text-slate-500">{c.label}</p>
                <p className={`mt-1 text-lg font-black leading-tight ${c.color}`}>{c.value}</p>
                <p className="text-xs text-slate-600">{c.sub}</p>
              </div>
            ))}
          </div>

          {/* Debt balance vs savings over time */}
          <ChartPanel title="Debt balance vs savings over time">
            <LineChart data={data}>
              <CartesianGrid {...gridProps} />
              <XAxis {...xAxisProps} />
              <YAxis {...yAxisProps} />
              <Tooltip content={<ChartTooltip />} />
              <Legend {...legendProps} />
              <ReferenceLine y={0} stroke="#475569" strokeDasharray="3 3" />
              <Line type="monotone" dataKey="debt" name="Debt balance €"
                stroke="#f87171" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="savings" name="Savings €"
                stroke="#34d399" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="netWorth" name="Net worth €"
                stroke="#a78bfa" strokeWidth={2} strokeDasharray="4 2" dot={false} />
            </LineChart>
          </ChartPanel>

          {/* Interest paid vs principal paid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <ChartPanel title="Cumulative interest vs principal paid">
              <AreaChart data={data}>
                <CartesianGrid {...gridProps} />
                <XAxis {...xAxisProps} />
                <YAxis {...yAxisProps} />
                <Tooltip content={<ChartTooltip />} />
                <Legend {...legendProps} />
                <Area type="monotone" dataKey="totalInterestPaid" name="Interest paid €"
                  stroke="#f87171" fill="#f87171" fillOpacity={0.15} strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="totalPrincipalPaid" name="Principal paid €"
                  stroke="#34d399" fill="#34d399" fillOpacity={0.15} strokeWidth={2} dot={false} />
              </AreaChart>
            </ChartPanel>

            {/* Opportunity cost: what if you invested instead? */}
            <ChartPanel title={"Opportunity cost: savings with vs without debt"}>
              <LineChart>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 10 }} allowDuplicatedCategory={false} />
                <YAxis {...yAxisProps} />
                <Tooltip content={<ChartTooltip />} />
                <Legend {...legendProps} />
                <Line data={data} type="monotone" dataKey="savings" name="Savings (with debt) €"
                  stroke="#38bdf8" strokeWidth={2} dot={false} />
                <Line data={noDebtScenario} type="monotone" dataKey="savings" name="Savings (no debt, invest instead) €"
                  stroke="#34d399" strokeWidth={2} strokeDasharray="4 2" dot={false} />
              </LineChart>
            </ChartPanel>
          </div>

          {/* Interest rate impact callout */}
          {params.debtInterestRate > 7 && (
            <div className="rounded-2xl border border-rose-400/20 bg-rose-400/5 p-5">
              <p className="text-xs font-semibold text-rose-300 mb-2">
                ⚠️ High interest rate — debt is very expensive at {params.debtInterestRate}%
              </p>
              <p className="text-xs text-slate-300 leading-5">
                At {params.debtInterestRate}%, your monthly interest charge on €{params.debtAmount.toLocaleString()} is
                €{Math.round(params.debtAmount * params.debtInterestRate / 100 / 12).toLocaleString()}.
                {params.monthlyDebtPayment <= params.debtAmount * params.debtInterestRate / 100 / 12
                  ? " Your current payment doesn't cover the interest — the debt is growing, not shrinking. This is a debt trap."
                  : ` Only €${Math.round(params.monthlyDebtPayment - params.debtAmount * params.debtInterestRate / 100 / 12).toLocaleString()} of your monthly payment reduces the principal.`}
              </p>
            </div>
          )}

          {debtPaymentPct > 35 && (
            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
              <p className="text-xs font-semibold text-amber-300 mb-2">
                ⚠️ Debt payment burden: {debtPaymentPct}% of income
              </p>
              <p className="text-xs text-slate-300 leading-5">
                Financial stress typically starts above 30–35% of income committed to debt service. At {debtPaymentPct}%,
                any income shock (job loss, medical costs, energy price spike) could tip you into arrears.
                Banks and central banks monitor this — it&apos;s a key driver of housing market fragility.
              </p>
            </div>
          )}
        </div>

        {/* ── Controls ── */}
        <div className="space-y-4">
          <div className="rounded-[1.75rem] border border-rose-400/20 bg-panel p-5 space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-rose-300">Debt</p>
            {([
              { key: "debtAmount",          label: "Debt amount",           icon: "💸", min: 1000,   max: 500000, step: 1000,  fmt: (v: number) => `€${v.toLocaleString()}` },
              { key: "debtInterestRate",    label: "Interest rate",         icon: "📈", min: 0.5,    max: 25,     step: 0.25,  fmt: (v: number) => `${v}%` },
              { key: "monthlyDebtPayment",  label: "Monthly repayment",     icon: "📅", min: 50,     max: 5000,   step: 50,    fmt: (v: number) => `€${v.toLocaleString()}` },
              { key: "monthlyIncome",       label: "Monthly income",        icon: "💶", min: 1000,   max: 10000,  step: 100,   fmt: (v: number) => `€${v.toLocaleString()}` },
            ] as const).map((sl) => (
              <label key={sl.key} className="block">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">{sl.icon} {sl.label}</span>
                  <span className="font-mono font-bold text-rose-300">{sl.fmt(params[sl.key])}</span>
                </div>
                <input type="range" min={sl.min} max={sl.max} step={sl.step}
                  value={params[sl.key]} onChange={(e) => setP(sl.key, Number(e.target.value))}
                  className="w-full accent-rose-400" />
              </label>
            ))}
          </div>

          <div className="rounded-[1.75rem] border border-emerald-400/20 bg-panel p-5 space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Savings</p>
            {([
              { key: "initialSavings",         label: "Starting savings",        icon: "🏦", min: 0,     max: 100000, step: 1000, fmt: (v: number) => `€${v.toLocaleString()}` },
              { key: "monthlySavingsDeposit",  label: "Monthly savings deposit", icon: "💰", min: 0,     max: 2000,   step: 50,   fmt: (v: number) => `€${v.toLocaleString()}` },
              { key: "savingsReturnRate",      label: "Return on savings",        icon: "📈", min: 0,     max: 10,     step: 0.25, fmt: (v: number) => `${v}%` },
            ] as const).map((sl) => (
              <label key={sl.key} className="block">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">{sl.icon} {sl.label}</span>
                  <span className="font-mono font-bold text-emerald-300">{sl.fmt(params[sl.key])}</span>
                </div>
                <input type="range" min={sl.min} max={sl.max} step={sl.step}
                  value={params[sl.key]} onChange={(e) => setP(sl.key, Number(e.target.value))}
                  className="w-full accent-emerald-400" />
              </label>
            ))}
          </div>

          {/* Presets */}
          <div className="rounded-[1.75rem] border border-slate-800 bg-panel p-5 space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Scenarios</p>
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

          <div className="rounded-[1.75rem] border border-slate-800 bg-panel p-5 space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Key mechanisms</p>
            {[
              { title: "Front-loaded interest", text: "Early loan payments are mostly interest. On a 30-year mortgage at 6%, over half your total payments in the first decade go to the bank, not to your equity.", color: "text-rose-300" },
              { title: "Rate sensitivity", text: "A 2% interest rate increase on a €200,000 mortgage adds ~€250/month — €3,000/year. Multiplied across millions of households, this is how central banks slow economies.", color: "text-amber-300" },
              { title: "Debt trap threshold", text: "When your monthly payment barely covers the interest charge, the principal never shrinks. Payday loans and credit cards at 20%+ are designed around this dynamic.", color: "text-rose-300" },
              { title: "Opportunity cost", text: "Every euro servicing expensive debt is a euro not compounding in investments. The gap between your debt rate and savings rate is the real cost of borrowing.", color: "text-cyan-300" },
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
