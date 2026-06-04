"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Area, AreaChart, CartesianGrid, Legend, Line, LineChart,
  ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

import { AtlasPage } from "@/components/atlas/AtlasPage";
import {
  SimulatorActionRow,
  SimulatorCallout,
  SimulatorChartPanel,
  SimulatorHero,
  SimulatorSidebarPanel,
} from "@/components/simulator/SimulatorAtlas";

// ─── Model ────────────────────────────────────────────────────────────────────
interface BankRunParams {
  reserveRatio: number;        // % of deposits held as cash (5–30)
  depositInsurance: number;    // % of deposits insured (0–100)
  numBanks: number;            // banks in the system (1–20)
  panicSeverity: number;       // 1–5: severity of the triggering shock
  contagionRate: number;       // 0–1: how strongly one failure spreads
  cbResponseSpeed: number;     // 1–5: central bank lender-of-last-resort speed
  depositBase: number;         // € millions per bank
}

interface DaySnapshot {
  day: number;
  avgConfidence: number;
  reservesRemaining: number;   // % of initial
  failedBanks: number;
  totalWithdrawals: number;    // €M cumulative
  cbLoansProvided: number;     // €M cumulative
  depositorsProtected: number; // % of deposits that are safe
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function runBankRun(p: BankRunParams, days = 90): DaySnapshot[] {
  const banks = Array.from({ length: p.numBanks }, (_, i) => ({
    id: i,
    deposits: p.depositBase,
    reserves: p.depositBase * p.reserveRatio / 100,
    confidence: 100 - p.panicSeverity * 6,
    failed: false,
  }));

  const results: DaySnapshot[] = [];
  let cbLoansTotal = 0;
  let cumulativeWithdrawals = 0;

  for (let day = 0; day <= days; day++) {
    let failedThisDay = 0;

    for (const bank of banks) {
      if (bank.failed) continue;

      // Uninsured depositors run based on confidence loss
      const uninsuredFrac = 1 - p.depositInsurance / 100;
      const panicRate = clamp(
        0.002 + Math.pow(Math.max(0, 60 - bank.confidence) / 60, 2) * 0.25,
        0, 0.40
      ) * uninsuredFrac;

      const dailyWithdrawals = bank.deposits * panicRate;

      // Central bank lender of last resort
      let cbLoan = 0;
      if (bank.reserves < dailyWithdrawals) {
        const responseFrac = (p.cbResponseSpeed - 1) / 4; // 0 to 1
        cbLoan = Math.min(
          (dailyWithdrawals - bank.reserves) * responseFrac,
          bank.deposits * 0.30
        );
        cbLoansTotal += cbLoan;
        bank.reserves += cbLoan;
      }

      const actual = Math.min(dailyWithdrawals, bank.reserves);
      bank.reserves -= actual;
      bank.deposits -= actual;
      cumulativeWithdrawals += actual;

      if (bank.reserves <= 0.001 && bank.deposits > p.depositBase * 0.05) {
        bank.failed = true;
        failedThisDay++;
        // Contagion: hit confidence of all surviving banks
        for (const other of banks) {
          if (!other.failed && other.id !== bank.id) {
            other.confidence -= p.contagionRate * 18 * (1 - p.depositInsurance / 100);
          }
        }
      }
    }

    // Confidence slowly recovers for surviving banks once CB acts
    for (const bank of banks) {
      if (!bank.failed) {
        const cbBoost = p.cbResponseSpeed * 0.3;
        bank.confidence = clamp(bank.confidence - 0.5 + cbBoost * 0.2, 0, 100);
      }
    }

    const alive = banks.filter(b => !b.failed);
    const avgConf = alive.length > 0
      ? alive.reduce((s, b) => s + b.confidence, 0) / alive.length
      : 0;
    const reservesPct = banks.reduce((s, b) => s + b.reserves, 0)
      / (p.depositBase * p.numBanks * p.reserveRatio / 100) * 100;
    const failed = banks.filter(b => b.failed).length;
    const totalDeposits = p.depositBase * p.numBanks;
    const insuredDeposits = totalDeposits * p.depositInsurance / 100;
    const remainingDeposits = banks.reduce((s, b) => s + b.deposits, 0);
    const protected_ = Math.min(100, (insuredDeposits + remainingDeposits) / totalDeposits * 100);

    results.push({
      day,
      avgConfidence: Math.round(avgConf * 10) / 10,
      reservesRemaining: Math.round(clamp(reservesPct, 0, 100) * 10) / 10,
      failedBanks: failed,
      totalWithdrawals: Math.round(cumulativeWithdrawals),
      cbLoansProvided: Math.round(cbLoansTotal),
      depositorsProtected: Math.round(protected_ * 10) / 10,
    });
  }

  return results;
}

// ─── Presets ─────────────────────────────────────────────────────────────────
const PRESETS = [
  {
    label: "Panic of 1907",
    description: "No deposit insurance, no central bank backstop. Trusts collapse, contagion spreads fast.",
    color: "#f87171",
    params: { reserveRatio: 5, depositInsurance: 0, numBanks: 12, panicSeverity: 4, contagionRate: 0.8, cbResponseSpeed: 1, depositBase: 500 },
  },
  {
    label: "Great Depression 1933",
    description: "Severe agricultural shock, no FDIC yet, slow government response.",
    color: "#fb923c",
    params: { reserveRatio: 8, depositInsurance: 0, numBanks: 15, panicSeverity: 5, contagionRate: 0.9, cbResponseSpeed: 1, depositBase: 400 },
  },
  {
    label: "Modern with FDIC",
    description: "Post-1933 regime: deposit insurance eliminates retail panic. Contagion mostly contained.",
    color: "#34d399",
    params: { reserveRatio: 10, depositInsurance: 90, numBanks: 10, panicSeverity: 3, contagionRate: 0.4, cbResponseSpeed: 4, depositBase: 1000 },
  },
  {
    label: "2023 SVB collapse",
    description: "Concentrated uninsured deposits (tech firms), social-media-accelerated run, CB responds.",
    color: "#fbbf24",
    params: { reserveRatio: 7, depositInsurance: 30, numBanks: 5, panicSeverity: 4, contagionRate: 0.6, cbResponseSpeed: 3, depositBase: 2000 },
  },
  {
    label: "Well-regulated system",
    description: "High reserves, full insurance, fast CB response. Bank run is self-limiting.",
    color: "#38bdf8",
    params: { reserveRatio: 20, depositInsurance: 100, numBanks: 8, panicSeverity: 3, contagionRate: 0.2, cbResponseSpeed: 5, depositBase: 800 },
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { color: string; name: string; value: number }[]; label?: number }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/95 px-4 py-3 text-xs shadow-xl">
      <p className="mb-2 font-bold text-slate-200">Day {label}</p>
      {payload.map((e) => (
        <p key={e.name} style={{ color: e.color }}>{e.name}: <span className="font-semibold">{e.value}</span></p>
      ))}
    </div>
  );
}
function ChartPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <SimulatorChartPanel title={title}>
      <ResponsiveContainer width="100%" height={200}>{children as React.ReactElement}</ResponsiveContainer>
    </SimulatorChartPanel>
  );
}
const gridProps = { strokeDasharray: "3 3", stroke: "#1e293b" };
const xAxisProps = { dataKey: "day", tick: { fill: "#64748b", fontSize: 10 }, label: { value: "Days", position: "insideBottomRight", fill: "#475569", fontSize: 10 } };
const legendProps = { wrapperStyle: { fontSize: 10 } };

// ─── Component ────────────────────────────────────────────────────────────────
export default function BankRunPage() {
  const [params, setParams] = useState<BankRunParams>({
    reserveRatio: 8,
    depositInsurance: 0,
    numBanks: 10,
    panicSeverity: 4,
    contagionRate: 0.7,
    cbResponseSpeed: 1,
    depositBase: 500,
  });

  const data = useMemo(() => runBankRun(params), [params]);
  const setP = useCallback((key: keyof BankRunParams, val: number) =>
    setParams(p => ({ ...p, [key]: val })), []);

  const last = data[data.length - 1];
  const peak = data.reduce((m, d) => d.failedBanks > m.failedBanks ? d : m, data[0]);
  const runDay = data.find(d => d.failedBanks > 0);

  return (
    <AtlasPage className="simulator-atlas space-y-6 pb-12">
      <SimulatorHero
        actions={<SimulatorActionRow primaryHref="#bank-run-lab" primaryLabel="Open the lab" secondaryHref="#bank-run-ideas" secondaryLabel="Why it matters" />}
        description="Bank runs are self-fulfilling: if enough depositors expect failure, their rush to withdraw can destroy an otherwise solvent bank. Test how reserves, deposit insurance, contagion, and central bank speed change the outcome."
        eyebrow="Bank Run Dynamics"
        imageAlt="Simulation landscape for banking stability"
        imageSrc="/atlas/simulator-hero.png"
        metrics={[
          { label: "Banks failed", value: `${last.failedBanks} / ${params.numBanks}`, description: "At the end of the 90-day run." },
          { label: "First failure", value: runDay ? `Day ${runDay.day}` : "None", description: "When confidence crosses into collapse." },
          { label: "Depositors protected", value: `${last.depositorsProtected}%`, description: "Higher insurance breaks the incentive to run." },
          { label: "CB loans", value: `€${last.cbLoansProvided.toLocaleString()}M`, description: "Emergency liquidity supplied to keep banks open." },
        ]}
        title="Bank Run Simulator"
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]" id="bank-run-lab">
        {/* Charts */}
        <div className="space-y-4">
          {/* Confidence + reserves */}
          <div className="grid gap-4 sm:grid-cols-2">
            <ChartPanel title="Depositor confidence (avg %)">
              <LineChart data={data}>
                <CartesianGrid {...gridProps} />
                <XAxis {...xAxisProps} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} domain={[0, 100]} />
                <Tooltip content={<ChartTooltip />} />
                <ReferenceLine y={50} stroke="#f87171" strokeDasharray="4 2" label={{ value: "Run threshold", fill: "#f87171", fontSize: 9, position: "insideTopRight" }} />
                <Line type="monotone" dataKey="avgConfidence" name="Confidence %" stroke="#38bdf8" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ChartPanel>
            <ChartPanel title="Reserve levels remaining (%)">
              <AreaChart data={data}>
                <CartesianGrid {...gridProps} />
                <XAxis {...xAxisProps} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} domain={[0, 110]} />
                <Tooltip content={<ChartTooltip />} />
                <ReferenceLine y={0} stroke="#f87171" strokeDasharray="4 2" />
                <Area type="monotone" dataKey="reservesRemaining" name="Reserves %" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.15} strokeWidth={2} dot={false} />
              </AreaChart>
            </ChartPanel>
          </div>

          {/* Failed banks + withdrawals */}
          <div className="grid gap-4 sm:grid-cols-2">
            <ChartPanel title="Cumulative bank failures">
              <AreaChart data={data}>
                <CartesianGrid {...gridProps} />
                <XAxis {...xAxisProps} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} domain={[0, params.numBanks]} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="stepAfter" dataKey="failedBanks" name="Failed banks" stroke="#f87171" fill="#f87171" fillOpacity={0.2} strokeWidth={2.5} dot={false} />
              </AreaChart>
            </ChartPanel>
            <ChartPanel title="Depositor protection & CB loans (€M)">
              <LineChart data={data}>
                <CartesianGrid {...gridProps} />
                <XAxis {...xAxisProps} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend {...legendProps} />
                <Line type="monotone" dataKey="cbLoansProvided" name="CB loans €M" stroke="#34d399" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="totalWithdrawals" name="Withdrawals €M" stroke="#f87171" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartPanel>
          </div>

          {/* Insight callouts */}
          {params.depositInsurance < 20 && last.failedBanks > 0 && (
            <SimulatorCallout title="No deposit insurance means panic can become rational" tone="rose">
                With {params.depositInsurance}% deposit insurance, even perfectly solvent banks can be destroyed by panic. Each rational depositor, knowing others might run, is incentivised to run first. This is exactly what destroyed 9,000 US banks in 1930–33 — most were solvent when the panic started.
            </SimulatorCallout>
          )}
          {params.depositInsurance >= 80 && last.failedBanks === 0 && (
            <SimulatorCallout title="Deposit insurance breaks the self-fulfilling loop" tone="green">
                At {params.depositInsurance}% coverage, insured depositors have no reason to run — they know they&apos;ll be paid regardless. The self-fulfilling prophecy is broken. The FDIC was created in 1933 precisely for this reason, and since then retail bank runs have been virtually eliminated in the US.
            </SimulatorCallout>
          )}
          {params.contagionRate > 0.6 && last.failedBanks > params.numBanks * 0.4 && (
            <SimulatorCallout title="Contagion can turn one failure into a system event" tone="gold">
                High contagion ({Math.round(params.contagionRate * 100)}%) means each failure amplifies the next. This is the &quot;bank holiday&quot; scenario: once confidence collapses in one institution, the panic spreads faster than any individual bank can respond. FDR&apos;s 1933 bank holiday — closing all banks for a week — was the only way to break this cascade by resetting confidence collectively.
            </SimulatorCallout>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <SimulatorSidebarPanel kicker="Banking system parameters" title="Set the conditions" tone="blue">
            {([
              { key: "reserveRatio",    label: "Reserve ratio",            icon: "🏦", min: 2,   max: 40,  step: 1,   fmt: (v: number) => `${v}%`,      tip: "Cash the bank holds per €100 of deposits. Fractional reserve: real banks hold 5–15%." },
              { key: "depositInsurance", label: "Deposit insurance",       icon: "🛡️", min: 0,   max: 100, step: 5,   fmt: (v: number) => `${v}%`,      tip: "% of deposits guaranteed by government. The key reform after the 1933 bank runs." },
              { key: "numBanks",         label: "Number of banks",         icon: "🏗️", min: 1,   max: 20,  step: 1,   fmt: (v: number) => `${v}`,       tip: "Banks in the system. More banks = larger contagion surface." },
              { key: "panicSeverity",    label: "Triggering shock",        icon: "💥", min: 1,   max: 5,   step: 1,   fmt: (v: number) => `${v}/5`,     tip: "Severity of the news/event that starts the panic. 1=minor rumour, 5=major institution collapses." },
              { key: "contagionRate",    label: "Contagion speed",         icon: "🌊", min: 0,   max: 1,   step: 0.05, fmt: (v: number) => `${Math.round(v*100)}%`, tip: "How strongly one bank failure spreads panic to others. Higher in 1907/1933, lower today." },
              { key: "cbResponseSpeed",  label: "Central bank response",   icon: "🚒", min: 1,   max: 5,   step: 1,   fmt: (v: number) => `${v}/5`,     tip: "Speed of lender-of-last-resort lending. 1=1907 style (none), 5=modern Fed with standing facilities." },
              { key: "depositBase",      label: "Deposits per bank (€M)",  icon: "💶", min: 100, max: 5000, step: 100, fmt: (v: number) => `€${v}M`,    tip: "Deposit base size per bank. Affects absolute cost of bailout." },
            ] as const).map(sl => (
              <label key={sl.key} className="block">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-800 dark:text-slate-100">{sl.icon} {sl.label}</span>
                  <span className="font-mono font-bold text-[rgb(var(--atlas-primary))]">{sl.fmt(params[sl.key])}</span>
                </div>
                <input type="range" min={sl.min} max={sl.max} step={sl.step}
                  value={params[sl.key]}
                  onChange={e => setP(sl.key, Number(e.target.value))}
                  className="w-full accent-[rgb(var(--atlas-primary))]" />
                <p className="mt-0.5 text-xs text-slate-600">{sl.tip}</p>
              </label>
            ))}
          </SimulatorSidebarPanel>

          {/* Historical presets */}
          <SimulatorSidebarPanel kicker="Historical crises" title="Load a preset">
            {PRESETS.map(preset => (
              <button key={preset.label}
                onClick={() => setParams(p => ({ ...p, ...preset.params }))}
                className="w-full rounded-2xl border border-[rgba(28,36,48,0.08)] bg-white/76 p-3 text-left transition hover:border-[rgba(28,36,48,0.18)] dark:border-slate-800 dark:bg-slate-900/65"
                style={{ borderLeftColor: preset.color, borderLeftWidth: 3 }}>
                <p className="text-xs font-semibold" style={{ color: preset.color }}>{preset.label}</p>
                <p className="mt-0.5 text-xs text-slate-500">{preset.description}</p>
              </button>
            ))}
          </SimulatorSidebarPanel>

          {/* Key concepts */}
          <SimulatorSidebarPanel kicker="Why this keeps happening" title="System lessons" className="space-y-3" >
            {[
              { title: "Shadow bank loophole", text: "Every major crisis featured institutions that acted like banks (took deposits, made risky bets) but weren't regulated like banks. Trusts in 1907, S&Ls in the 1980s, money-market funds and mortgage vehicles in 2008.", color: "text-rose-300" },
              { title: "Self-fulfilling prophecy", text: "Bank runs don't require the bank to be insolvent. If enough depositors believe the bank will fail, their simultaneous withdrawals make it fail. Deposit insurance breaks this logic by removing the incentive to run first.", color: "text-amber-300" },
              { title: "Contagion & network effects", text: "In a connected banking system, one failure signals that similar institutions may also be unsound. This is why crises cascade — not because all banks made the same bad bets, but because panic is contagious.", color: "text-cyan-300" },
              { title: "Lender of last resort", text: "Bagehot's 1873 rule: in a panic, the central bank should lend freely to solvent institutions at a penalty rate against good collateral. This breaks the liquidity crisis without rewarding bad behaviour. The US had no such mechanism in 1907 or 1930.", color: "text-violet-300" },
            ].map(item => (
              <div key={item.title} className="rounded-xl border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.58)] p-3 dark:border-slate-800 dark:bg-slate-900/60">
                <p className={`text-xs font-semibold ${item.color}`}>{item.title}</p>
                <p className="mt-1 text-xs text-slate-400">{item.text}</p>
              </div>
            ))}
          </SimulatorSidebarPanel>
        </div>
      </div>
      <div id="bank-run-ideas" />
    </AtlasPage>
  );
}
