"use client";

import { useState, useMemo, useCallback } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Params {
  depositBase: number;          // total deposits $bn
  uninsuredFrac: number;        // % of deposits over FDIC limit
  durationGap: number;          // avg duration of bond portfolio (years)
  rateRise: number;             // interest rate increase in 18 months (%)
  twitterAmplifier: number;     // 1–3: how fast social media spreads panic
  vcConcentration: number;      // % of deposits from VC-backed startups
  cbResponseSpeed: number;      // days until FDIC guarantee announcement
  capitalBuffer: number;        // Tier-1 capital % of assets
}

interface DayState {
  day: number;
  deposits: number;
  bondPortfolioValue: number;
  unrealisedLoss: number;
  capitalRatio: number;
  confidence: number;
  withdrawalRate: number;
  cumulativeWithdrawals: number;
  failed: boolean;
  fdic: boolean;
  liquidityBuffer: number;
}

// ─── Simulation ───────────────────────────────────────────────────────────────

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function runSVB(p: Params): DayState[] {
  const days = 60;
  const results: DayState[] = [];

  // Bond portfolio: duration gap determines unrealised loss from rate rise
  // Duration × rate change ≈ % price change
  const unrealisedLossTotal = p.depositBase * 0.55 * (p.durationGap * (p.rateRise / 100));
  const capitalTotal = p.depositBase * (p.capitalBuffer / 100);
  const isInsolventAtStart = unrealisedLossTotal > capitalTotal * 0.85;

  let deposits = p.depositBase;
  let confidence = isInsolventAtStart ? 45 : 72;
  let failed = false;
  let fdic = false;
  let cumulativeWithdrawals = 0;
  let liquidityBuffer = p.depositBase * 0.12; // initial liquid assets

  for (let day = 1; day <= days; day++) {
    // FDIC guarantee kicks in after cbResponseSpeed days
    if (!fdic && day >= p.cbResponseSpeed) {
      fdic = true;
      confidence = Math.min(confidence + 35, 85);
    }

    // Confidence dynamics
    // Confidence drops faster with high VC concentration (herd behaviour)
    // Social media amplifier increases daily confidence decay when below 50
    const panicDecay = confidence < 50
      ? (50 - confidence) / 50 * 1.8 * p.twitterAmplifier * (p.vcConcentration / 60)
      : 0;
    const naturalDecay = isInsolventAtStart ? 1.2 : 0.3;
    if (!fdic) {
      confidence = clamp(confidence - naturalDecay - panicDecay, 0, 100);
    } else {
      confidence = clamp(confidence + 1.5, 0, 90);
    }

    // Withdrawal rate: uninsured depositors run when confidence drops
    // They have more incentive to run because they can lose everything
    const uninsuredFrac = p.uninsuredFrac / 100;
    const basePanic = Math.pow(Math.max(0, 60 - confidence) / 60, 2.2);
    const withdrawalRate = fdic
      ? clamp(0.002 + basePanic * 0.04 * uninsuredFrac, 0, 0.15)
      : clamp(0.003 + basePanic * 0.35 * uninsuredFrac, 0, 0.45);

    const withdrawn = deposits * withdrawalRate;
    liquidityBuffer -= withdrawn;
    cumulativeWithdrawals += withdrawn;
    deposits = Math.max(0, deposits - withdrawn);

    // Failure condition: liquidity buffer exhausted and can't sell bonds fast enough
    const bondPortfolioValue = p.depositBase * 0.55 * (1 - (p.durationGap * p.rateRise / 100) * 0.6);
    const unrealisedLoss = Math.max(0, unrealisedLossTotal);
    const realCapital = Math.max(0, capitalTotal - unrealisedLoss);
    const capitalRatio = deposits > 0 ? (realCapital / deposits) * 100 : 0;

    if (!failed && liquidityBuffer < 0 && !fdic) {
      failed = true;
    }

    results.push({
      day,
      deposits: Math.round(deposits * 10) / 10,
      bondPortfolioValue: Math.round(bondPortfolioValue * 10) / 10,
      unrealisedLoss: Math.round(unrealisedLoss * 10) / 10,
      capitalRatio: Math.round(capitalRatio * 10) / 10,
      confidence: Math.round(confidence),
      withdrawalRate: Math.round(withdrawalRate * 1000) / 10,
      cumulativeWithdrawals: Math.round(cumulativeWithdrawals * 10) / 10,
      failed,
      fdic,
      liquidityBuffer: Math.round(liquidityBuffer * 10) / 10,
    });

    if (failed && day > 5) break;
  }

  return results;
}

// ─── Presets ─────────────────────────────────────────────────────────────────

const PRESETS: { label: string; description: string; params: Params }[] = [
  {
    label: "SVB Actual (2023)",
    description: "The real SVB: 94% uninsured, 10yr duration gap, 4.5% rate shock, VC concentration, slow FDIC",
    params: {
      depositBase: 175,
      uninsuredFrac: 94,
      durationGap: 10,
      rateRise: 4.5,
      twitterAmplifier: 2.8,
      vcConcentration: 85,
      cbResponseSpeed: 3,
      capitalBuffer: 7,
    },
  },
  {
    label: "With FDIC on Day 1",
    description: "Same SVB structure but FDIC guarantees all deposits immediately — panic never starts",
    params: {
      depositBase: 175,
      uninsuredFrac: 94,
      durationGap: 10,
      rateRise: 4.5,
      twitterAmplifier: 2.8,
      vcConcentration: 85,
      cbResponseSpeed: 1,
      capitalBuffer: 7,
    },
  },
  {
    label: "Diversified Depositor Base",
    description: "Lower VC concentration and uninsured share — same rate shock but slower run dynamics",
    params: {
      depositBase: 175,
      uninsuredFrac: 45,
      durationGap: 10,
      rateRise: 4.5,
      twitterAmplifier: 1.5,
      vcConcentration: 25,
      cbResponseSpeed: 3,
      capitalBuffer: 7,
    },
  },
  {
    label: "Shorter Duration Portfolio",
    description: "Better rate risk management: shorter-duration bonds mean smaller unrealised loss",
    params: {
      depositBase: 175,
      uninsuredFrac: 94,
      durationGap: 3,
      rateRise: 4.5,
      twitterAmplifier: 2.8,
      vcConcentration: 85,
      cbResponseSpeed: 3,
      capitalBuffer: 7,
    },
  },
  {
    label: "Slow Pre-Social Media",
    description: "2004 equivalent: same structural problems but without Twitter-speed contagion",
    params: {
      depositBase: 175,
      uninsuredFrac: 90,
      durationGap: 9,
      rateRise: 4.0,
      twitterAmplifier: 1.0,
      vcConcentration: 80,
      cbResponseSpeed: 5,
      capitalBuffer: 7,
    },
  },
];

const BASE = PRESETS[0].params;

// ─── Component ────────────────────────────────────────────────────────────────

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">{label}</span>
        <span className="text-xs font-semibold text-amber-300">{format(value)}</span>
      </div>
      <input
        className="w-full accent-amber-400"
        max={max}
        min={min}
        step={step}
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

export default function SVBCrisisPage() {
  const [params, setParams] = useState<Params>(BASE);

  const set = useCallback(
    (key: keyof Params) => (v: number) =>
      setParams((p) => ({ ...p, [key]: v })),
    []
  );

  const data = useMemo(() => runSVB(params), [params]);
  const actual = useMemo(() => runSVB(PRESETS[0].params), []);

  const failDay = data.find((d) => d.failed)?.day ?? null;
  const finalDeposits = data[data.length - 1].deposits;
  const depositLoss = params.depositBase - finalDeposits;
  const depositLossPct = Math.round((depositLoss / params.depositBase) * 100);
  const maxWithdrawalRate = Math.max(...data.map((d) => d.withdrawalRate));
  const unrealisedLoss = data[0].unrealisedLoss;

  // Callout conditions
  const isHighlyConcentrated = params.vcConcentration > 70 && params.uninsuredFrac > 80;
  const isDurationRisk = params.durationGap > 6 && params.rateRise > 3;
  const isTwitterAccelerated = params.twitterAmplifier > 2;

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-10">
      {/* Header */}
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/85 p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-amber-400/18 via-amber-400/6 to-transparent" />
        <div className="relative space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex rounded-full border border-amber-300/25 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-100">
              SVB 2023 · Crisis simulator
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-50 sm:text-4xl">
            Silicon Valley Bank Collapse
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-300">
            SVB collapsed in 36 hours in March 2023 — the fastest large bank failure in US history. Adjust the structural 
            vulnerabilities: duration mismatch, uninsured deposit concentration, VC herd behaviour, and social media speed. 
            See how each one contributed and what could have stopped the run.
          </p>
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-800 bg-panel/80 px-4 py-3 text-center">
              <p className="text-xs text-slate-500">Unrealised Bond Loss</p>
              <p className="mt-1 text-xl font-black text-amber-300">${unrealisedLoss.toFixed(1)}bn</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-panel/80 px-4 py-3 text-center">
              <p className="text-xs text-slate-500">Deposit Loss</p>
              <p className="mt-1 text-xl font-black text-rose-400">{depositLossPct}%</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-panel/80 px-4 py-3 text-center">
              <p className="text-xs text-slate-500">Peak Daily Withdrawal</p>
              <p className="mt-1 text-xl font-black text-orange-300">{maxWithdrawalRate.toFixed(1)}%/day</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-panel/80 px-4 py-3 text-center">
              <p className="text-xs text-slate-500">Bank Failed</p>
              <p className={`mt-1 text-xl font-black ${failDay ? "text-red-400" : "text-emerald-400"}`}>
                {failDay ? `Day ${failDay}` : "Survived"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Callouts */}
      {(isHighlyConcentrated || isDurationRisk || isTwitterAccelerated) && (
        <div className="space-y-3">
          {isHighlyConcentrated && (
            <div className="rounded-2xl border border-amber-400/25 bg-amber-400/8 px-5 py-4">
              <p className="text-sm font-semibold text-amber-300">Depositor concentration creates a herd dynamic</p>
              <p className="mt-1 text-sm leading-6 text-slate-300">
                When {params.vcConcentration}% of deposits come from VC-backed startups, word travels instantly through the same 
                networks. A Slack message or tweet from one prominent VC can trigger simultaneous withdrawals across hundreds of 
                portfolio companies — this is exactly what happened on March 9, 2023.
              </p>
            </div>
          )}
          {isDurationRisk && (
            <div className="rounded-2xl border border-rose-400/25 bg-rose-400/8 px-5 py-4">
              <p className="text-sm font-semibold text-rose-300">Duration mismatch created a solvency trap</p>
              <p className="mt-1 text-sm leading-6 text-slate-300">
                A {params.durationGap}-year average bond duration with a {params.rateRise}% rate rise creates ~
                {(params.durationGap * params.rateRise).toFixed(0)}% unrealised losses on the bond portfolio. 
                SVB had to sell bonds at a loss to meet withdrawals, crystallising losses that confirmed 
                depositor fears — a self-fulfilling solvency spiral.
              </p>
            </div>
          )}
          {isTwitterAccelerated && (
            <div className="rounded-2xl border border-cyan-400/25 bg-cyan-400/8 px-5 py-4">
              <p className="text-sm font-semibold text-cyan-300">Social media compressed the run from days to hours</p>
              <p className="mt-1 text-sm leading-6 text-slate-300">
                Historical bank runs took days to weeks as news spread by phone and newspaper. In 2023, 
                Peter Thiel&apos;s Founders Fund&apos;s withdrawal advice circulated via Twitter within minutes. 
                Regulators had no time to respond before $42bn in withdrawal requests had been submitted.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Main layout */}
      <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
        {/* Controls */}
        <aside className="space-y-5">
          <div className="rounded-[1.75rem] border border-slate-800 bg-panel/90 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Bank Structure</p>
            <div className="mt-4 space-y-5">
              <SliderRow
                label="Total deposits ($bn)"
                value={params.depositBase}
                min={20}
                max={300}
                step={5}
                format={(v) => `$${v}bn`}
                onChange={set("depositBase")}
              />
              <SliderRow
                label="Uninsured deposits (%)"
                value={params.uninsuredFrac}
                min={20}
                max={99}
                step={1}
                format={(v) => `${v}%`}
                onChange={set("uninsuredFrac")}
              />
              <SliderRow
                label="VC/startup concentration (%)"
                value={params.vcConcentration}
                min={5}
                max={95}
                step={5}
                format={(v) => `${v}%`}
                onChange={set("vcConcentration")}
              />
              <SliderRow
                label="Capital buffer (%)"
                value={params.capitalBuffer}
                min={3}
                max={20}
                step={0.5}
                format={(v) => `${v}%`}
                onChange={set("capitalBuffer")}
              />
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-800 bg-panel/90 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Rate & Duration Risk</p>
            <div className="mt-4 space-y-5">
              <SliderRow
                label="Bond portfolio duration (years)"
                value={params.durationGap}
                min={1}
                max={15}
                step={0.5}
                format={(v) => `${v} yr`}
                onChange={set("durationGap")}
              />
              <SliderRow
                label="Interest rate rise (%)"
                value={params.rateRise}
                min={0.5}
                max={7}
                step={0.25}
                format={(v) => `${v}%`}
                onChange={set("rateRise")}
              />
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-800 bg-panel/90 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Contagion & Response</p>
            <div className="mt-4 space-y-5">
              <SliderRow
                label="Social media amplifier (1–3)"
                value={params.twitterAmplifier}
                min={1}
                max={3}
                step={0.1}
                format={(v) => `${v.toFixed(1)}×`}
                onChange={set("twitterAmplifier")}
              />
              <SliderRow
                label="Days to FDIC guarantee"
                value={params.cbResponseSpeed}
                min={1}
                max={14}
                step={1}
                format={(v) => `${v}d`}
                onChange={set("cbResponseSpeed")}
              />
            </div>
          </div>

          {/* Presets */}
          <div className="rounded-[1.75rem] border border-slate-800 bg-panel/90 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Scenario presets</p>
            <div className="mt-3 space-y-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-left text-xs text-slate-300 transition hover:border-amber-400/40 hover:text-slate-100"
                  onClick={() => setParams(preset.params)}
                >
                  <span className="font-semibold text-amber-200">{preset.label}</span>
                  <span className="mt-0.5 block leading-5 text-slate-400">{preset.description}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Charts */}
        <div className="space-y-5">
          {/* Deposit flight */}
          <div className="rounded-[1.75rem] border border-slate-800 bg-panel/90 p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Deposit flight</p>
            <p className="mt-1 text-lg font-semibold text-slate-50">Remaining vs. Cumulative Withdrawals ($bn)</p>
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 11 }} label={{ value: "Day", position: "insideBottom", offset: -2, fill: "#64748b", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12 }} />
                  <Legend />
                  {failDay && <ReferenceLine x={failDay} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "Failure", fill: "#ef4444", fontSize: 10 }} />}
                  <ReferenceLine x={params.cbResponseSpeed} stroke="#22d3ee" strokeDasharray="4 4" label={{ value: "FDIC", fill: "#22d3ee", fontSize: 10 }} />
                  <Area dataKey="deposits" fill="#f59e0b22" name="Remaining deposits" stroke="#f59e0b" strokeWidth={2} type="monotone" />
                  <Area dataKey="cumulativeWithdrawals" fill="#ef444422" name="Cumulative withdrawals" stroke="#ef4444" strokeWidth={2} type="monotone" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Confidence + withdrawal rate */}
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-[1.75rem] border border-slate-800 bg-panel/90 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Depositor confidence</p>
              <div className="mt-3 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 10 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12 }} />
                    <ReferenceLine y={50} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: "Panic threshold", fill: "#f59e0b", fontSize: 9 }} />
                    {failDay && <ReferenceLine x={failDay} stroke="#ef4444" strokeDasharray="4 4" />}
                    <Line dataKey="confidence" dot={false} name="Confidence" stroke="#a78bfa" strokeWidth={2} type="monotone" />
                    <Line data={actual} dataKey="confidence" dot={false} name="Actual SVB" stroke="#64748b" strokeDasharray="4 4" strokeWidth={1.5} type="monotone" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-800 bg-panel/90 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Daily withdrawal rate (%/day)</p>
              <div className="mt-3 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.slice(0, 30)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 10 }} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12 }} />
                    {failDay && failDay <= 30 && <ReferenceLine x={failDay} stroke="#ef4444" strokeDasharray="4 4" />}
                    <Bar dataKey="withdrawalRate" fill="#f59e0b99" name="Withdrawal rate %/day" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Capital ratio */}
          <div className="rounded-[1.75rem] border border-slate-800 bg-panel/90 p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Capital ratio vs. solvency threshold</p>
            <div className="mt-3 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12 }} />
                  <ReferenceLine y={4} stroke="#ef4444" strokeDasharray="3 3" label={{ value: "Min capital %", fill: "#ef4444", fontSize: 9 }} />
                  {failDay && <ReferenceLine x={failDay} stroke="#ef4444" strokeDasharray="4 4" />}
                  <Line dataKey="capitalRatio" dot={false} name="Capital ratio %" stroke="#34d399" strokeWidth={2} type="monotone" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key lessons */}
          <div className="rounded-[1.75rem] border border-slate-800 bg-panel/90 p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">What the SVB collapse revealed</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {[
                {
                  title: "Duration risk is not hypothetical",
                  body: "SVB held $91bn in long-duration bonds when rates rose 4.5%. Mark-to-market losses of ~$15bn exceeded its capital. Banks lobbied successfully to exempt themselves from unrealised-loss capital rules — SVB was the cost.",
                },
                {
                  title: "Deposit concentration = systemic vulnerability",
                  body: "94% of SVB deposits were uninsured. A $250k FDIC limit designed for retail customers left VC-backed startups with payrolls at risk. One Sequoia tweet triggered a $42bn withdrawal queue in hours.",
                },
                {
                  title: "Social media changed the speed of crises",
                  body: "Pre-digital bank runs took days; customers queued outside branches. The SVB run was digital, coordinated via group chats and Twitter, and complete before regulators could respond. The 1933 playbook needed updating.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <p className="text-sm font-semibold text-slate-50">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
