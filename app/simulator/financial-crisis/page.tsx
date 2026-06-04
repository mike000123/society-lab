"use client";

import { useMemo, useState } from "react";
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
interface FCParams {
  initialLeverage: number;        // × (e.g. 30 = 30:1)
  subprimeFraction: number;       // % of loans that are subprime/risky
  bubblePeak: number;             // % above baseline when bubble peaks (e.g. 70 = 170 index)
  bubblePeakMonth: number;        // month when bubble bursts (0–60)
  burstSpeed: number;             // % monthly price decline after burst (1–8)
  bailoutPolicy: boolean;         // government recapitalises banks
  bailoutDelay: number;           // months before bailout kicks in (0–12)
  regulationLevel: number;        // 1–5: strength of oversight
  shadowBankingShare: number;     // % of total lending by unregulated institutions
}

interface FCSnapshot {
  month: number;
  year: string;
  housePriceIdx: number;          // 100 = baseline
  bankCapital: number;            // 100 = well capitalised
  creditFlow: number;             // 100 = normal
  gdpIdx: number;                 // 100 = pre-crisis
  defaults: number;               // cumulative % of loans defaulted
  bailoutCost: number;            // €B
  shadowExposure: number;         // shadow bank losses index
  unemploymentDelta: number;      // pp above pre-crisis
}

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

function runFinancialCrisis(p: FCParams, months = 96): FCSnapshot[] {
  let housePrice = 100;
  let bankCapital = 100;
  let shadowCapital = 100;
  let creditFlow = 100;
  let gdp = 100;
  let defaults = 0;
  let bailoutCost = 0;
  const results: FCSnapshot[] = [];

  const burstMonth = p.bubblePeakMonth;
  const regulationBonus = (p.regulationLevel - 1) / 4; // 0–1

  for (let m = 0; m <= months; m++) {
    const yearFrac = 2003 + m / 12;
    const yearLabel = yearFrac.toFixed(1);

    if (m < burstMonth) {
      // ── Bubble phase ──────────────────────────────────────────────────────
      const monthlyGrowth = (p.bubblePeak / 100) / burstMonth;
      housePrice = 100 * Math.pow(1 + monthlyGrowth, m);

      // Shadow banks grow rapidly in bubble, less regulated → more leverage
      shadowCapital = 100 + m * (p.shadowBankingShare / 100) * 2;
      bankCapital = Math.min(100, 100 + m * 0.1); // regulated banks stay stable
      creditFlow = Math.min(110, 100 + m * 0.15);
      gdp = Math.min(105, 100 + m * 0.08);
    } else {
      // ── Burst & crisis phase ───────────────────────────────────────────────
      const t = m - burstMonth; // months since burst

      // House prices fall
      housePrice = clamp(
        (100 + p.bubblePeak) * Math.pow(1 - p.burstSpeed / 100, t),
        20, 200
      );

      // Defaults cascade as prices fall below loan values
      const underwaterFrac = clamp((100 + p.bubblePeak - housePrice) / (100 + p.bubblePeak), 0, 1);
      const newDefaultRate = p.subprimeFraction / 100 * underwaterFrac * 0.08;
      defaults = clamp(defaults + newDefaultRate * 100, 0, 80);

      // Losses amplified by leverage
      const leverageMult = p.initialLeverage / 10;
      const regulationDamper = 0.3 + 0.7 * regulationBonus;
      const capitalLoss = newDefaultRate * leverageMult * (1 - regulationDamper * 0.4) * 30;

      // Shadow banks fail first (less regulation, more leverage)
      shadowCapital = clamp(shadowCapital - newDefaultRate * p.shadowBankingShare / 100 * leverageMult * 60, 0, 200);

      // Regulated banks hit by both direct losses and shadow bank contagion
      const shadowContagion = shadowCapital < 50 ? (50 - shadowCapital) * 0.2 * (p.shadowBankingShare / 100) : 0;
      bankCapital = clamp(bankCapital - capitalLoss - shadowContagion, 0, 100);

      // Bailout
      if (p.bailoutPolicy && t >= p.bailoutDelay && bankCapital < 40) {
        const bailoutAmount = clamp(60 - bankCapital, 0, 40);
        bankCapital += bailoutAmount;
        bailoutCost += bailoutAmount * 0.5;
      }

      // Credit crunch: banks protect capital → stop lending
      const capitalRatio = bankCapital / 100;
      creditFlow = clamp(
        100 * Math.pow(capitalRatio, 1.5) * (0.5 + 0.5 * regulationBonus),
        10, 100
      );

      // GDP: credit crunch → recession, with lag of ~3 months
      const laggedCredit = m >= burstMonth + 3
        ? results[m - 3]?.creditFlow ?? creditFlow
        : creditFlow;
      gdp = clamp(100 * (0.35 + 0.65 * (laggedCredit / 100)), 60, 105);
    }

    const unemploymentDelta = clamp((100 - gdp) * 0.35, 0, 15);

    results.push({
      month: m,
      year: yearLabel,
      housePriceIdx: Math.round(housePrice * 10) / 10,
      bankCapital: Math.round(bankCapital * 10) / 10,
      creditFlow: Math.round(creditFlow * 10) / 10,
      gdpIdx: Math.round(gdp * 10) / 10,
      defaults: Math.round(defaults * 10) / 10,
      bailoutCost: Math.round(bailoutCost),
      shadowExposure: Math.round(clamp(100 - shadowCapital, 0, 100) * 10) / 10,
      unemploymentDelta: Math.round(unemploymentDelta * 10) / 10,
    });
  }
  return results;
}

// ─── Presets ─────────────────────────────────────────────────────────────────
const PRESETS = [
  {
    label: "2008 US Subprime Crisis",
    description: "30× leverage, 35% subprime, housing bubble +70%, no bailout until month 12.",
    color: "#f87171",
    params: { initialLeverage: 30, subprimeFraction: 35, bubblePeak: 70, bubblePeakMonth: 36, burstSpeed: 3, bailoutPolicy: true, bailoutDelay: 12, regulationLevel: 2, shadowBankingShare: 45 },
  },
  {
    label: "With early regulation",
    description: "Same as 2008 but with strong oversight: lower leverage caps, shadow banks regulated.",
    color: "#34d399",
    params: { initialLeverage: 12, subprimeFraction: 15, bubblePeak: 40, bubblePeakMonth: 36, burstSpeed: 2, bailoutPolicy: true, bailoutDelay: 3, regulationLevel: 5, shadowBankingShare: 10 },
  },
  {
    label: "1930s Great Depression",
    description: "No bailout, no deposit insurance. Credit froze completely. GDP fell 30%.",
    color: "#fb923c",
    params: { initialLeverage: 20, subprimeFraction: 25, bubblePeak: 80, bubblePeakMonth: 24, burstSpeed: 5, bailoutPolicy: false, bailoutDelay: 99, regulationLevel: 1, shadowBankingShare: 60 },
  },
  {
    label: "S&L Crisis 1980s",
    description: "Deregulation + inflation shock. S&Ls given freedom to gamble with insured deposits.",
    color: "#fbbf24",
    params: { initialLeverage: 15, subprimeFraction: 40, bubblePeak: 50, bubblePeakMonth: 30, burstSpeed: 2, bailoutPolicy: true, bailoutDelay: 24, regulationLevel: 2, shadowBankingShare: 55 },
  },
  {
    label: "Fast decisive response",
    description: "2008-scale shock but with immediate bailout, fast regulation, and transparent losses.",
    color: "#38bdf8",
    params: { initialLeverage: 30, subprimeFraction: 35, bubblePeak: 70, bubblePeakMonth: 36, burstSpeed: 3, bailoutPolicy: true, bailoutDelay: 0, regulationLevel: 4, shadowBankingShare: 30 },
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { color: string; name: string; value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/95 px-4 py-3 text-xs shadow-xl">
      <p className="mb-2 font-bold text-slate-200">{label}</p>
      {payload.map(e => (
        <p key={e.name} style={{ color: e.color }}>{e.name}: <span className="font-semibold">{e.value}</span></p>
      ))}
    </div>
  );
}
function ChartPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <SimulatorChartPanel title={title}>
      <ResponsiveContainer width="100%" height={210}>{children as React.ReactElement}</ResponsiveContainer>
    </SimulatorChartPanel>
  );
}
const gridProps = { strokeDasharray: "3 3", stroke: "#1e293b" };
const xProps = { dataKey: "year", tick: { fill: "#64748b", fontSize: 9 }, interval: 11 };
const yProps = { tick: { fill: "#64748b", fontSize: 10 } };
const legendProps = { wrapperStyle: { fontSize: 10 } };

// ─── Component ────────────────────────────────────────────────────────────────
export default function FinancialCrisisPage() {
  const [params, setParams] = useState<FCParams>({
    initialLeverage: 30,
    subprimeFraction: 35,
    bubblePeak: 70,
    bubblePeakMonth: 36,
    burstSpeed: 3,
    bailoutPolicy: true,
    bailoutDelay: 12,
    regulationLevel: 2,
    shadowBankingShare: 45,
  });

  const data = useMemo(() => runFinancialCrisis(params), [params]);
  const setP = (key: keyof FCParams, val: number | boolean) =>
    setParams(p => ({ ...p, [key]: val }));

  const burstIdx = params.bubblePeakMonth;
  const burstYear = data[burstIdx]?.year ?? "";
  const troughGDP = Math.min(...data.map(d => d.gdpIdx));
  const peakDefaults = Math.max(...data.map(d => d.defaults));
  const last = data[data.length - 1];

  return (
    <AtlasPage className="simulator-atlas space-y-6 pb-12">
      <SimulatorHero
        actions={<SimulatorActionRow primaryHref="#financial-crisis-lab" primaryLabel="Open the lab" secondaryHref="#financial-crisis-patterns" secondaryLabel="Pattern notes" />}
        description="Cheap credit inflates an asset bubble, leverage magnifies the boom, and shadow banking spreads fragility through the system. Adjust the same crisis levers to see why some busts become depressions while others get contained."
        eyebrow="Leverage and Contagion"
        imageAlt="Financial systems simulation landscape"
        imageSrc="/atlas/simulator-hero.png"
        metrics={[
          { label: "GDP trough", value: `${troughGDP.toFixed(1)}`, description: "Index where 100 is pre-crisis output." },
          { label: "Peak defaults", value: `${peakDefaults.toFixed(1)}%`, description: "Share of the loan book that fails." },
          { label: "Bailout cost", value: `€${last.bailoutCost.toLocaleString()}B`, description: "Public funds used to recapitalize banks." },
          { label: "Unemployment rise", value: `+${last.unemploymentDelta.toFixed(1)}pp`, description: "Increase above the pre-crisis labor market." },
        ]}
        title="Financial Crisis Simulator"
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]" id="financial-crisis-lab">
        {/* Charts */}
        <div className="space-y-4">
          {/* Housing bubble */}
          <ChartPanel title="Housing price index (100 = baseline)">
            <AreaChart data={data}>
              <CartesianGrid {...gridProps} />
              <XAxis {...xProps} />
              <YAxis {...yProps} />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine x={burstYear} stroke="#f87171" strokeDasharray="4 2" label={{ value: "Bubble bursts", fill: "#f87171", fontSize: 9, position: "insideTopLeft" }} />
              <ReferenceLine y={100} stroke="#475569" strokeDasharray="3 3" />
              <Area type="monotone" dataKey="housePriceIdx" name="House price" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.15} strokeWidth={2.5} dot={false} />
            </AreaChart>
          </ChartPanel>

          {/* Bank capital + credit */}
          <div className="grid gap-4 sm:grid-cols-2">
            <ChartPanel title="Bank capital & credit flow (100 = normal)">
              <LineChart data={data}>
                <CartesianGrid {...gridProps} />
                <XAxis {...xProps} />
                <YAxis {...yProps} domain={[0, 110]} />
                <Tooltip content={<ChartTooltip />} />
                <Legend {...legendProps} />
                <ReferenceLine x={burstYear} stroke="#f87171" strokeDasharray="4 2" />
                <ReferenceLine y={40} stroke="#f87171" strokeDasharray="2 4" label={{ value: "Crisis zone", fill: "#f87171", fontSize: 8 }} />
                <Line type="monotone" dataKey="bankCapital" name="Bank capital" stroke="#34d399" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="creditFlow" name="Credit flow" stroke="#38bdf8" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartPanel>
            <ChartPanel title="GDP & unemployment impact">
              <LineChart data={data}>
                <CartesianGrid {...gridProps} />
                <XAxis {...xProps} />
                <YAxis {...yProps} />
                <Tooltip content={<ChartTooltip />} />
                <Legend {...legendProps} />
                <ReferenceLine x={burstYear} stroke="#f87171" strokeDasharray="4 2" />
                <Line type="monotone" dataKey="gdpIdx" name="GDP index" stroke="#a78bfa" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="unemploymentDelta" name="Unemployment +pp" stroke="#f87171" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartPanel>
          </div>

          {/* Defaults + shadow bank exposure */}
          <div className="grid gap-4 sm:grid-cols-2">
            <ChartPanel title="Cumulative mortgage defaults (%)">
              <AreaChart data={data}>
                <CartesianGrid {...gridProps} />
                <XAxis {...xProps} />
                <YAxis {...yProps} />
                <Tooltip content={<ChartTooltip />} />
                <ReferenceLine x={burstYear} stroke="#f87171" strokeDasharray="4 2" />
                <Area type="monotone" dataKey="defaults" name="Defaults %" stroke="#f87171" fill="#f87171" fillOpacity={0.15} strokeWidth={2} dot={false} />
              </AreaChart>
            </ChartPanel>
            <ChartPanel title="Shadow bank loss exposure (index)">
              <AreaChart data={data}>
                <CartesianGrid {...gridProps} />
                <XAxis {...xProps} />
                <YAxis {...yProps} domain={[0, 100]} />
                <Tooltip content={<ChartTooltip />} />
                <ReferenceLine x={burstYear} stroke="#f87171" strokeDasharray="4 2" />
                <Area type="monotone" dataKey="shadowExposure" name="Shadow losses" stroke="#fb923c" fill="#fb923c" fillOpacity={0.15} strokeWidth={2} dot={false} />
              </AreaChart>
            </ChartPanel>
          </div>

          {/* Dynamic callouts */}
          {params.shadowBankingShare > 35 && troughGDP < 88 && (
            <SimulatorCallout title="Shadow banking amplifies the collapse" tone="gold">
                At {params.shadowBankingShare}% of lending done by unregulated institutions, the shadow banking sector acts as a hidden leverage multiplier. In 2008, money market funds, broker-dealers, and mortgage conduits collectively held more assets than regulated banks — but had no deposit insurance, no reserve requirements, and access to the Fed&apos;s backstop was ambiguous. When Lehman failed, the entire shadow system froze within 72 hours.
            </SimulatorCallout>
          )}
          {params.initialLeverage > 20 && (
            <SimulatorCallout title={`Leverage at ${params.initialLeverage}× means a ${Math.round(100 / params.initialLeverage)}% fall can wipe out equity`} tone="rose">
                At {params.initialLeverage}:1 leverage, the bank owns €{params.initialLeverage} of assets for every €1 of equity. A {Math.round(100/params.initialLeverage)}% fall in asset values — well within the range of a housing correction — renders it insolvent. Lehman Brothers was operating at ~30:1 in 2008. Bear Stearns at 33:1.
            </SimulatorCallout>
          )}
          {!params.bailoutPolicy && troughGDP < 80 && (
            <SimulatorCallout title="Without recapitalization, credit can freeze into a depression" tone="gold">
                Without recapitalisation, banks stop lending to protect their remaining capital. Businesses cannot borrow to make payroll; households cannot refinance. This is the 1933 mechanism: the banking system&apos;s collapse rendered monetary policy powerless, as Friedman and Schwartz documented. The RFC&apos;s eventual bank nationalisations ended it — but only after GDP had fallen by a third.
            </SimulatorCallout>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <SimulatorSidebarPanel kicker="Crisis parameters" title="Set the fragility" tone="gold">
            {([
              { key: "initialLeverage",    label: "Bank leverage ratio",      icon: "📐", min: 5,  max: 50, step: 1,  fmt: (v: number) => `${v}×`,   tip: "Assets per €1 of equity. Pre-2008 investment banks: 25–33×. After Basel III reforms: capped at ~12×." },
              { key: "subprimeFraction",   label: "Risky lending fraction",   icon: "🎲", min: 5,  max: 60, step: 1,  fmt: (v: number) => `${v}%`,   tip: "% of loans made to borrowers unlikely to repay if prices fall. In 2006 US: ~30% of all mortgages were subprime." },
              { key: "shadowBankingShare", label: "Shadow banking share",     icon: "👻", min: 0,  max: 80, step: 5,  fmt: (v: number) => `${v}%`,   tip: "% of credit provided by unregulated institutions (hedge funds, SIVs, money market funds). In 2008 this exceeded regulated banking." },
              { key: "bubblePeak",         label: "Bubble size",              icon: "🫧", min: 10, max: 150, step: 5, fmt: (v: number) => `+${v}%`, tip: "How far house prices rise above baseline before bursting. US 2006 peak: +70%. Ireland/Spain: +100%+." },
              { key: "bubblePeakMonth",    label: "Months until bubble bursts", icon: "⏱️", min: 12, max: 72, step: 3, fmt: (v: number) => `${v}mo`, tip: "Duration of the bubble phase. Longer bubbles allow more leverage to accumulate, making the bust worse." },
              { key: "burstSpeed",         label: "Price collapse speed",     icon: "📉", min: 1,  max: 8,  step: 0.5, fmt: (v: number) => `${v}%/mo`, tip: "Monthly rate of price decline after the bubble bursts. 2008 US: ~1.5%/mo. Ireland: ~3%/mo." },
              { key: "regulationLevel",    label: "Regulatory strength",      icon: "🏛️", min: 1,  max: 5,  step: 1,  fmt: (v: number) => `${v}/5`,  tip: "Quality of oversight: capital requirements, stress tests, leverage limits. 1 = 1990s deregulation era. 5 = post-Basel III." },
            ] as const).map(sl => (
              <label key={sl.key} className="block">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-800 dark:text-slate-100">{sl.icon} {sl.label}</span>
                  <span className="font-mono font-bold text-[rgb(var(--atlas-gold))]">{sl.fmt(params[sl.key] as number)}</span>
                </div>
                <input type="range" min={sl.min} max={sl.max} step={sl.step}
                  value={params[sl.key] as number}
                  onChange={e => setP(sl.key, Number(e.target.value))}
                  className="w-full accent-[rgb(var(--atlas-gold))]" />
                <p className="mt-0.5 text-xs text-slate-600">{sl.tip}</p>
              </label>
            ))}
            {/* Bailout toggle */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-xs text-slate-300">🏦 Government bailout</p>
                <p className="text-xs text-slate-600 mt-0.5">Recapitalise banks when capital falls below 40%</p>
              </div>
              <button onClick={() => setP("bailoutPolicy", !params.bailoutPolicy)}
                className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors ${params.bailoutPolicy ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300" : "border-[rgba(28,36,48,0.12)] text-slate-500"}`}>
                {params.bailoutPolicy ? "ON" : "OFF"}
              </button>
            </div>
            {params.bailoutPolicy && (
              <label className="block">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">⏳ Bailout delay</span>
                  <span className="font-mono font-bold text-orange-300">{params.bailoutDelay} months</span>
                </div>
                <input type="range" min={0} max={24} step={1} value={params.bailoutDelay}
                  onChange={e => setP("bailoutDelay", Number(e.target.value))}
                  className="w-full accent-[rgb(var(--atlas-gold))]" />
                <p className="mt-0.5 text-xs text-slate-600">TARP (2008) came ~12 months after the first warning signs. Every month of delay worsens the credit freeze.</p>
              </label>
            )}
          </SimulatorSidebarPanel>

          {/* Presets */}
          <SimulatorSidebarPanel kicker="Historical crises" title="Load a crisis">
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
          <SimulatorSidebarPanel kicker="Recurring pattern" title="System lessons" className="space-y-3">
            {[
              { title: "Shadow banks, same lesson", text: "1907: trusts. 1980s: S&Ls. 2008: SIVs, money market funds, broker-dealers. Each generation creates a new institution that does banking without banking regulation. When it fails, the taxpayer pays.", color: "text-rose-300" },
              { title: "Leverage amplifies everything", text: "A 5% asset price fall is uncomfortable at 10× leverage (equity halved), catastrophic at 30× (insolvent). Leverage turns market corrections into systemic crises.", color: "text-amber-300" },
              { title: "Regulatory amnesia", text: "The Glass-Steagall Act (1933) was dismantled by 1999. Capital requirements weakened in the 1990s. Bagehot's rules written in 1873 were forgotten by 2007. Stability breeds complacency.", color: "text-cyan-300" },
              { title: "Bailouts socialise losses", text: "Private profits flow to shareholders during the bubble. Losses flow to taxpayers in the bust. This moral hazard — knowing the state will rescue you — encourages future risk-taking.", color: "text-violet-300" },
            ].map(item => (
              <div key={item.title} className="rounded-xl border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.58)] p-3 dark:border-slate-800 dark:bg-slate-900/60">
                <p className={`text-xs font-semibold ${item.color}`}>{item.title}</p>
                <p className="mt-1 text-xs text-slate-400">{item.text}</p>
              </div>
            ))}
          </SimulatorSidebarPanel>
        </div>
      </div>
      <div id="financial-crisis-patterns" />
    </AtlasPage>
  );
}
