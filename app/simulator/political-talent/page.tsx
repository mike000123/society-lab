"use client";

import { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import { Shield, Users, TrendingDown, Building2, UserX, DollarSign, Award, AlertTriangle } from "lucide-react";

// ─── Model ───────────────────────────────────────────────────────────────────

interface Blockers {
  dynasties: number;
  partyMonopoly: number;
  salaryGap: number;
  classExclusion: number;
  genderExclusion: number;
}

function computeInstant(b: Blockers) {
  const dyn  = (b.dynasties      / 100) * 0.28;
  const par  = (b.partyMonopoly  / 100) * 0.32;
  const sal  = (b.salaryGap      / 100) * 0.18;
  const cls  = (b.classExclusion / 100) * 0.14;
  const gen  = (b.genderExclusion/ 100) * 0.14;

  const access = (1 - dyn) * (1 - par) * (1 - sal) * (1 - cls) * (1 - gen);
  const capable = Math.max(4, Math.round(access * 100));

  const caseliMorelli = ((b.dynasties + b.partyMonopoly) / 2) / 100;
  const govQuality   = Math.max(5, Math.round(capable * 0.85 + 8  - caseliMorelli * 10));
  const pubService   = Math.max(5, Math.round(capable * 0.75 + 10 - caseliMorelli * 8));
  const wellbeing    = Math.max(5, Math.round((govQuality * 0.6 + pubService * 0.4) * 0.9 + 5));
  const institutions = Math.max(4, Math.round(capable * 0.9  + 5  - caseliMorelli * 15));

  return { capable, govQuality, pubService, wellbeing, institutions };
}

function simulate20Years(b: Blockers, feedback: boolean) {
  const rows: { year: number; capable: number; wellbeing: number; institutions: number; pubService: number }[] = [];
  let cur = { ...b };

  for (let y = 0; y <= 20; y++) {
    const s = computeInstant(cur);
    rows.push({ year: y, capable: s.capable, wellbeing: s.wellbeing, institutions: s.institutions, pubService: s.pubService });

    if (feedback && y < 20) {
      const score = s.capable;
      const decay = score <= 30 ? 2.5 : score <= 50 ? 1.5 : score <= 70 ? 0.5 : 0;
      cur = {
        dynasties:      Math.min(100, cur.dynasties      + decay * 0.9),
        partyMonopoly:  Math.min(100, cur.partyMonopoly  + decay * 1.1),
        salaryGap:      Math.min(100, cur.salaryGap      + decay * 0.5),
        classExclusion: Math.min(100, cur.classExclusion + decay * 0.6),
        genderExclusion:Math.min(100, cur.genderExclusion+ decay * 0.4),
      };
    }
  }
  return rows;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Gauge({ label, value, color, icon: Icon }: { label: string; value: number; color: string; icon: React.ElementType }) {
  const pct = Math.round(value);
  const level = pct >= 70 ? "Good" : pct >= 45 ? "Strained" : pct >= 25 ? "Poor" : "Critical";
  const levelColor = pct >= 70 ? "text-emerald-400" : pct >= 45 ? "text-amber-400" : pct >= 25 ? "text-orange-400" : "text-rose-400";
  const barColor   = pct >= 70 ? "bg-emerald-500" : pct >= 45 ? "bg-amber-500" : pct >= 25 ? "bg-orange-500" : "bg-rose-500";

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className={`flex h-7 w-7 items-center justify-center rounded-xl border ${color}`}>
            <Icon className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-medium text-slate-300">{label}</span>
        </div>
        <span className={`text-xs font-semibold ${levelColor}`}>{level}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-800">
        <div className={`h-2 rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-right text-lg font-bold text-slate-100">{pct}<span className="text-xs text-slate-500">/100</span></span>
    </div>
  );
}

function Slider({
  label, description, icon: Icon, value, onChange, color,
}: {
  label: string; description: string; icon: React.ElementType;
  value: number; onChange: (v: number) => void; color: string;
}) {
  const intensity = value >= 75 ? "Extreme" : value >= 50 ? "High" : value >= 25 ? "Moderate" : "Low";
  const iColor    = value >= 75 ? "text-rose-400" : value >= 50 ? "text-orange-400" : value >= 25 ? "text-amber-400" : "text-emerald-400";

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl border ${color}`}>
            <Icon className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-200">{label}</div>
            <div className="text-xs text-slate-500 leading-4 mt-0.5">{description}</div>
          </div>
        </div>
        <div className="flex-shrink-0 text-right ml-2">
          <div className="text-sm font-bold text-slate-100">{value}</div>
          <div className={`text-[10px] font-medium ${iColor}`}>{intensity}</div>
        </div>
      </div>
      <input
        type="range" min={0} max={100} step={1} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-amber-400 cursor-pointer"
      />
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { dataKey: string; color: string; name: string; value: number }[]; label?: number }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-3 shadow-xl text-xs space-y-1">
      <p className="font-semibold text-slate-300 mb-1">Year {label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="text-slate-400">{p.name}:</span>
          <span className="font-bold text-slate-200">{Math.round(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Presets ─────────────────────────────────────────────────────────────────

const PRESETS: { label: string; values: Blockers }[] = [
  { label: "Nordic baseline",   values: { dynasties: 12, partyMonopoly: 20, salaryGap: 18, classExclusion: 22, genderExclusion: 8  } },
  { label: "Pre-crisis Greece", values: { dynasties: 75, partyMonopoly: 82, salaryGap: 55, classExclusion: 78, genderExclusion: 68 } },
  { label: "Mild patronage",    values: { dynasties: 40, partyMonopoly: 50, salaryGap: 35, classExclusion: 45, genderExclusion: 40 } },
  { label: "All barriers max",  values: { dynasties: 100, partyMonopoly: 100, salaryGap: 100, classExclusion: 100, genderExclusion: 100 } },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PoliticalTalentPage() {
  const [blockers, setBlockers] = useState<Blockers>({
    dynasties: 65, partyMonopoly: 70, salaryGap: 50, classExclusion: 72, genderExclusion: 62,
  });
  const [feedback, setFeedback] = useState(true);

  const set = (key: keyof Blockers) => (v: number) => setBlockers(b => ({ ...b, [key]: v }));

  const instant    = useMemo(() => computeInstant(blockers), [blockers]);
  const timeData   = useMemo(() => simulate20Years(blockers, feedback), [blockers, feedback]);
  const noFeedback = useMemo(() => simulate20Years(blockers, false),    [blockers]);

  const chartData = timeData.map((d, i) => ({
    ...d,
    capableNo:      noFeedback[i].capable,
    wellbeingNo:    noFeedback[i].wellbeing,
    institutionsNo: noFeedback[i].institutions,
  }));

  const totalBlocker = Math.round(
    (blockers.dynasties + blockers.partyMonopoly + blockers.salaryGap + blockers.classExclusion + blockers.genderExclusion) / 5
  );

  const spiralRisk = instant.capable < 35
    ? { text: "Kleptocratic threshold — institutions are actively dismantled to protect incumbents.", color: "text-rose-400", bg: "border-rose-400/20 bg-rose-400/5" }
    : instant.capable < 60
    ? { text: "Clientelism emerging — party patronage starts to replace meritocracy in public appointments.", color: "text-amber-400", bg: "border-amber-400/20 bg-amber-400/5" }
    : instant.capable < 65
    ? { text: "Approaching Nordic threshold (65) — barriers visible but reform tractable before feedback loop locks in.", color: "text-yellow-400", bg: "border-yellow-400/20 bg-yellow-400/5" }
    : { text: "Above Nordic baseline — open-entry system, capable pool broadly accessible.", color: "text-emerald-400", bg: "border-emerald-400/20 bg-emerald-400/5" };

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-12">

      {/* Header */}
      <section className="relative overflow-hidden rounded-[2rem] border border-amber-400/30 bg-slate-950/85 p-6 sm:p-10">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-amber-400/14 via-amber-400/4 to-transparent" />
        <div className="relative space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full border border-amber-300/25 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-100">
              Politics &amp; Governance
            </span>
            <span className="inline-flex rounded-full border border-slate-700 bg-slate-800/50 px-3 py-1 text-xs text-slate-400">
              Intermediate
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
            Political Talent Barrier Simulator
          </h1>
          <p className="max-w-3xl text-base leading-7 text-slate-300">
            Five structural barriers filter out capable people before voters ever get a choice.
            Adjust each barrier to see how the capable politician pool, public service quality,
            and citizen wellbeing respond — with or without the Casel-Morelli feedback spiral.
          </p>
          <p className="text-xs text-slate-500">
            Based on research presented by Kosmas Marinakis (Greconomic). Sources: Berkeley/Brown/ECLA dynasty study (2009),
            Patrikios &amp; Xatzikonstandinou, Glasgow (2015), Casel &amp; Morelli (LSE/Bocconi), Swedish quota studies.
          </p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">

        {/* ── Sidebar ── */}
        <div className="space-y-4">

          {/* Sliders */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-200">Five Entry Barriers</h2>
              <span className={`text-xs font-bold ${totalBlocker >= 70 ? "text-rose-400" : totalBlocker >= 45 ? "text-orange-400" : totalBlocker >= 25 ? "text-amber-400" : "text-emerald-400"}`}>
                Average: {totalBlocker}/100
              </span>
            </div>

            <Slider
              label="1. Political Dynasties"
              description="Family connections dominate party lists, funding networks, and name recognition — each year in office roughly doubles the probability a relative gets elected"
              icon={Award}
              value={blockers.dynasties}
              onChange={set("dynasties")}
              color="text-amber-300 border-amber-300/20 bg-amber-400/10"
            />
            <Slider
              label="2. Party Monopoly"
              description="Parties prefer obedient low-ability insiders over capable outsiders; leaders select candidates they can control, not those with the best alternative careers"
              icon={Shield}
              value={blockers.partyMonopoly}
              onChange={set("partyMonopoly")}
              color="text-rose-300 border-rose-300/20 bg-rose-400/10"
            />
            <Slider
              label="3. Salary Gap"
              description="Large gap between public sector political pay and equivalent private sector compensation drives capable candidates toward private careers"
              icon={DollarSign}
              value={blockers.salaryGap}
              onChange={set("salaryGap")}
              color="text-violet-300 border-violet-300/20 bg-violet-400/10"
            />
            <Slider
              label="4. Class Exclusion"
              description="Working class candidates (68% of population in Greece, ~2% of parliament) are excluded from party selection processes despite real-world competence"
              icon={Users}
              value={blockers.classExclusion}
              onChange={set("classExclusion")}
              color="text-cyan-300 border-cyan-300/20 bg-cyan-400/10"
            />
            <Slider
              label="5. Gender Exclusion"
              description="Women (51% of population, 23% of Greek parliament) are underrepresented; Swedish evidence shows mandatory quotas raised average MP quality by breaking incumbent networks"
              icon={UserX}
              value={blockers.genderExclusion}
              onChange={set("genderExclusion")}
              color="text-emerald-300 border-emerald-300/20 bg-emerald-400/10"
            />
          </div>

          {/* Presets */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
            <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Scenario Presets</h3>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map(p => (
                <button
                  key={p.label}
                  onClick={() => setBlockers(p.values)}
                  className="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2.5 text-left text-xs text-slate-300 hover:border-amber-400/40 hover:text-amber-200 transition-colors leading-4"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback toggle */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-200">Casel-Morelli Feedback Loop</p>
                <p className="text-xs text-slate-500 mt-1 leading-5">
                  When capable politicians score drops below 70, barriers creep up each year as incumbents
                  use their position to further exclude capable challengers.
                </p>
              </div>
              <button
                onClick={() => setFeedback(v => !v)}
                className={`mt-0.5 relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${feedback ? "bg-amber-500" : "bg-slate-700"}`}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform shadow ${feedback ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="space-y-5">

          {/* Gauges */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Gauge label="Capable Politicians" value={instant.capable}    icon={Award}      color="text-amber-300 border-amber-300/20 bg-amber-400/10" />
            <Gauge label="Government Quality"  value={instant.govQuality} icon={Building2}  color="text-violet-300 border-violet-300/20 bg-violet-400/10" />
            <Gauge label="Public Service"      value={instant.pubService} icon={Shield}     color="text-cyan-300 border-cyan-300/20 bg-cyan-400/10" />
            <Gauge label="Citizen Wellbeing"   value={instant.wellbeing}  icon={Users}      color="text-emerald-300 border-emerald-300/20 bg-emerald-400/10" />
            <Gauge label="Institutional Integrity" value={instant.institutions} icon={TrendingDown} color="text-rose-300 border-rose-300/20 bg-rose-400/10" />
            <div className={`flex flex-col justify-between rounded-2xl border p-4 ${spiralRisk.bg}`}>
              <div className="flex items-center gap-2">
                <AlertTriangle className={`h-4 w-4 ${spiralRisk.color}`} />
                <span className="text-xs font-semibold text-slate-300">Spiral risk</span>
              </div>
              <p className="text-xs text-slate-400 leading-5 mt-2">{spiralRisk.text}</p>
            </div>
          </div>

          {/* Chart */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 space-y-4">
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-slate-200">20-Year Trajectory</h2>
              {/* Line legend */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-slate-400">
                <span className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-5 bg-amber-400 rounded" /> Capable politicians</span>
                <span className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-5 bg-emerald-400 rounded" /> Citizen wellbeing</span>
                <span className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-5 bg-rose-400 rounded" /> Institutions</span>
                <span className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-5 bg-cyan-400 rounded" /> Public service</span>
                <span className="flex items-center gap-1.5"><span className="inline-block h-px w-5 border-t border-dashed border-amber-400/70" /> Capable (no feedback)</span>
              </div>
              {/* Threshold legend */}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[10px]">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-px w-5 border-t-2 border-dashed border-emerald-500" />
                  <span className="text-emerald-400 font-medium">Nordic threshold (65)</span>
                  <span className="text-slate-500 ml-1">— capable pool typical of open-entry systems</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-px w-5 border-t-2 border-dashed border-rose-800" />
                  <span className="text-rose-400 font-medium">Kleptocracy threshold (35)</span>
                  <span className="text-slate-500 ml-1">— institutions actively dismantled by incumbents</span>
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={65} stroke="#16a34a" strokeDasharray="4 3" label={{ value: "Nordic", fill: "#16a34a", fontSize: 9, position: "insideTopLeft" }} />
                <ReferenceLine y={35} stroke="#7f1d1d" strokeDasharray="3 3" label={{ value: "Kleptocracy", fill: "#991b1b", fontSize: 9, position: "insideTopLeft" }} />
                <Line type="monotone" dataKey="capable"       name="Capable politicians"     stroke="#f59e0b" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="capableNo"     name="Capable (no feedback)"   stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="5 4" dot={false} />
                <Line type="monotone" dataKey="wellbeing"     name="Citizen wellbeing"       stroke="#34d399" strokeWidth={2}   dot={false} />
                <Line type="monotone" dataKey="institutions"  name="Institutional integrity" stroke="#f87171" strokeWidth={2}   dot={false} />
                <Line type="monotone" dataKey="pubService"    name="Public service"          stroke="#67e8f9" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Mechanism notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4 space-y-2">
              <h3 className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Casel-Morelli Cycle</h3>
              <p className="text-xs leading-5 text-slate-400">
                Parties preferring obedient low-ability candidates lose ideological identity — you can get a right-wing
                government running subsidy programmes and a left-wing one applying austerity. The primary
                motive shifts from policy to protecting incumbents, which makes the talent filter worse in each subsequent cycle.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4 space-y-2">
              <h3 className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">What Can Break the Loop</h3>
              <p className="text-xs leading-5 text-slate-400">
                Swedish evidence shows mandatory gender quotas forced parties to recruit outside incumbent networks.
                The largest benefit was removing candidates who actively blocked capable competitors.
                Any exogenous disruption to the pool — quotas, proportional pay reform, open primaries — can interrupt
                the Casel-Morelli spiral if applied before institutional capture is complete.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
