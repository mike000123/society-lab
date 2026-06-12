"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { AtlasPage } from "@/components/atlas/AtlasPage";
import {
  SimulatorActionRow,
  SimulatorHero,
  SimulatorPrimer,
  SimulatorSidebarPanel,
} from "@/components/simulator/SimulatorAtlas";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SliderParam {
  id: string; label: string; description: string;
  min: number; max: number; step: number; defaultValue: number;
  unit: string; lowLabel: string; highLabel: string;
  accent: "cyan" | "emerald" | "violet" | "amber" | "rose";
  affects: string; // which stage(s) this slider mainly affects
}

interface StageResult {
  stage: string; label: string; shortLabel: string;
  passProb: number; bottleneck: boolean; detail: string;
}

interface SimResult {
  overallSuccessProb: number; adoptionSpeed: number; bargainingFriction: number;
  amendmentDepth: number; legitimacyScore: number;
  stages: StageResult[]; cumulativeProbs: number[];
  verdict: string; verdictTone: "emerald" | "amber" | "rose";
}

// ─── Parameters ───────────────────────────────────────────────────────────────

const PARAMS: SliderParam[] = [
  { id: "memberStateAlignment", label: "Council member-state alignment",
    description: "How closely EU governments agree on the proposal. High alignment = fewer blocking minorities, faster QMV passage.",
    min: 0, max: 100, step: 1, defaultValue: 50, unit: "%",
    lowLabel: "Deep disagreement", highLabel: "Strong consensus",
    accent: "cyan", affects: "Council vote" },
  { id: "qmvThreshold", label: "QMV threshold (% of states)",
    description: "Standard QMV requires 55% of states (15/27) + 65% of population. Adjust to test treaty reforms or special procedures.",
    min: 50, max: 100, step: 1, defaultValue: 55, unit: "%",
    lowLabel: "Simple majority", highLabel: "Near-unanimity",
    accent: "amber", affects: "Council vote" },
  { id: "parliamentUnity", label: "EP coalition unity",
    description: "How cohesive the winning EP coalition is. Strong unity = absolute majority; fragmentation = delays and conciliation.",
    min: 0, max: 100, step: 1, defaultValue: 60, unit: "%",
    lowLabel: "Fragmented EP", highLabel: "Unified majority",
    accent: "violet", affects: "EP plenary" },
  { id: "commissionFlexibility", label: "Commission flexibility on amendments",
    description: "If the Commission accepts Parliament / Council amendments readily, trilogue deals close faster. Low = longer negotiations.",
    min: 0, max: 100, step: 1, defaultValue: 55, unit: "%",
    lowLabel: "Rigid proposal", highLabel: "Open to compromise",
    accent: "emerald", affects: "Trilogue" },
  { id: "trilogueRounds", label: "Max trilogue rounds allowed",
    description: "How many informal interinstitutional negotiations can happen before political pressure forces a resolution.",
    min: 1, max: 8, step: 1, defaultValue: 3, unit: " rounds",
    lowLabel: "Fast track (1)", highLabel: "Extended (8)",
    accent: "cyan", affects: "Trilogue" },
  { id: "unanimityAreas", label: "Provisions requiring unanimity",
    description: "Some EU areas require all 27 states to agree. Higher proportion dramatically raises the blocking probability.",
    min: 0, max: 80, step: 5, defaultValue: 15, unit: "%",
    lowLabel: "Mostly QMV", highLabel: "Heavy unanimity",
    accent: "rose", affects: "Council vote" },
  { id: "nationalParliamentPressure", label: "National parliament subsidiarity pressure",
    description: "If enough national parliaments object (yellow/orange card), the Commission must reconsider before Parliament & Council can proceed.",
    min: 0, max: 100, step: 1, defaultValue: 25, unit: "%",
    lowLabel: "No concerns", highLabel: "Orange card risk",
    accent: "amber", affects: "Commission proposal" },
];

// ─── Simulation ───────────────────────────────────────────────────────────────

function clamp(v: number, lo = 0, hi = 100) { return Math.max(lo, Math.min(hi, v)); }

function runSimulation(p: Record<string, number>): SimResult {
  const { memberStateAlignment: msa, qmvThreshold: qmv, parliamentUnity: pu,
    commissionFlexibility: cf, trilogueRounds: tr, unanimityAreas: ua,
    nationalParliamentPressure: np } = p;

  const s1 = np > 65 ? 0.40 : np > 40 ? 0.75 : 0.95;
  const s2 = clamp(pu / 100 * 0.9 + 0.05);
  const qmvP = clamp((msa / qmv) * 0.85);
  const uniP = clamp(Math.pow(msa / 100, 2.5));
  const s3 = qmvP * (1 - ua / 100) + uniP * (ua / 100);
  const div = Math.abs(pu - msa) / 100;
  // Per-round success probability: Commission flexibility drives how likely each round closes a deal.
  // Range: cf=0 → 0.12/round, cf=100 → 0.72/round
  const triPR = clamp(cf / 100 * 0.60 + 0.12);
  // Cumulative: 1 - (failure per round)^rounds. div < 0.05 means near-identical positions → first-reading deal.
  const s4 = div < 0.05 ? 0.98 : 1 - Math.pow(1 - triPR, tr);
  const s5 = s4 * 0.97;
  const s6 = clamp(1 - (clamp(100 - msa) / 200) * 0.4);

  const probs = [s1, s2, s3, s4, s5, s6];
  const cumulative: number[] = [];
  let running = 1;
  for (const prob of probs) { running *= prob; cumulative.push(running * 100); }

  const stages: StageResult[] = [
    { stage: "1", label: "Commission proposal", shortLabel: "Commission\nProposal",
      passProb: s1, bottleneck: np > 55,
      detail: np > 65 ? "Orange card risk: multiple national parliaments raising subsidiarity objections — Commission must review." :
        np > 40 ? "Yellow card pressure. Commission may need to justify proportionality." :
        "Proposal advances without significant subsidiarity challenge." },
    { stage: "2", label: "EP committees & plenary", shortLabel: "EP\nPlenary",
      passProb: s2, bottleneck: pu < 40,
      detail: pu < 40 ? "EP coalition fragmented — committees may fail to agree, delaying the plenary position." :
        pu < 60 ? "Moderate EP unity. Rapporteur builds workable majority; expect significant amendments." :
        "Strong EP coalition. Committee stage moves quickly to plenary." },
    { stage: "3", label: "Council (QMV / unanimity)", shortLabel: "Council\nVote",
      passProb: s3, bottleneck: ua > 30 || msa < 40,
      detail: ua > 30 ? `${ua}% of provisions require unanimity — blocking minority risk is high.` :
        msa < 40 ? "Low alignment. Blocking minority likely in QMV vote." :
        "Sufficient alignment for QMV passage." },
    { stage: "4", label: "Trilogue negotiations", shortLabel: "Trilogue",
      passProb: s4, bottleneck: tr < 2 && div > 0.3,
      detail: div > 0.4 ? `High EP-Council divergence. ${tr} trilogue round(s) may not be enough.` :
        div < 0.15 ? "Low divergence — first-reading deal likely." :
        `Moderate divergence. ${tr} round(s) with ${Math.round(cf)}% Commission flexibility.` },
    { stage: "5", label: "Final formal adoption", shortLabel: "Final\nAdoption",
      passProb: s5, bottleneck: false,
      detail: "Formal confirmatory votes in EP and Council. Procedural if trilogue succeeded." },
    { stage: "6", label: "National transposition", shortLabel: "Transposition",
      passProb: s6, bottleneck: msa < 35,
      detail: msa < 35 ? "Low alignment signals likely transposition disputes and delays." :
        "Reasonable alignment. Transposition should proceed within standard deadlines." },
  ];

  const overall = clamp(probs.reduce((a, b) => a * b, 1) * 100);
  const tone: "emerald"|"amber"|"rose" = overall >= 70 ? "emerald" : overall >= 40 ? "amber" : "rose";

  return {
    overallSuccessProb: overall,
    adoptionSpeed: clamp(msa*0.3 + pu*0.2 + cf*0.25 + (tr<=3?20:10) - ua*0.4 - np*0.1),
    bargainingFriction: clamp(Math.abs(pu-msa)*0.4 + (100-cf)*0.25 + ua*0.5 + np*0.15 - msa*0.15),
    amendmentDepth: clamp((100-cf)*0.3 + (100-msa)*0.25 + Math.abs(pu-msa)*0.3 + tr*5),
    legitimacyScore: clamp(msa*0.25 + pu*0.3 + cf*0.15 + (100-ua)*0.1 + (100-np)*0.1 + 10),
    stages, cumulativeProbs: cumulative,
    verdict: overall >= 70
      ? "High probability of adoption. Institutional alignment is sufficient for the ordinary procedure to run its course."
      : overall >= 40
      ? "Uncertain outcome. The proposal faces bottlenecks — likely extended trilogue or summit-level intervention."
      : "Low probability of adoption. Disagreements between institutions mean the proposal will likely stall.",
    verdictTone: tone,
  };
}

// ─── Hemicycle helper ─────────────────────────────────────────────────────────

function computeHemicycle(total: number, cx: number, cy: number, innerR: number, outerR: number, numRows: number) {
  if (!total || !numRows) return [] as {x:number;y:number}[];
  const step = numRows > 1 ? (outerR - innerR) / (numRows - 1) : 0;
  const radii = Array.from({length: numRows}, (_, i) => innerR + i * step);
  const tR = radii.reduce((s, r) => s + r, 0);
  const spr = radii.map(r => Math.max(1, Math.round((r / tR) * total)));
  spr[numRows-1] += total - spr.reduce((a,b) => a+b, 0);
  const out: {x:number;y:number}[] = [];
  for (let row = 0; row < numRows; row++) {
    const n = spr[row], r = radii[row];
    for (let i = 0; i < n; i++) {
      const a = n > 1 ? Math.PI - (Math.PI * i / (n-1)) : Math.PI/2;
      out.push({ x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) });
    }
  }
  return out;
}

const EP_GROUPS = [
  { id:"left",     label:"Left",       seats:46,  color:"#ec4899" },
  { id:"greens",   label:"Greens/EFA", seats:53,  color:"#22c55e" },
  { id:"sd",       label:"S&D",        seats:136, color:"#ef4444" },
  { id:"renew",    label:"Renew",      seats:77,  color:"#f59e0b" },
  { id:"epp",      label:"EPP",        seats:188, color:"#3b82f6" },
  { id:"ecr",      label:"ECR",        seats:78,  color:"#06b6d4" },
  { id:"patriots", label:"Patriots",   seats:84,  color:"#a855f7" },
  { id:"esn",      label:"ESN",        seats:25,  color:"#475569" },
  { id:"ni",       label:"Others",     seats:18,  color:"#64748b" },
];
const EP_GROUP_MAP = Object.fromEntries(EP_GROUPS.map(g => [g.id, g]));
const EP_SEAT_GROUPS = EP_GROUPS.flatMap(g => Array(g.seats).fill(g.id));
const EP_POSITIONS = computeHemicycle(705, 200, 215, 50, 170, 6);

function getEPCoalition(u: number) {
  if (u >= 85) return new Set(["left","greens","sd","renew","epp"]);
  if (u >= 68) return new Set(["greens","sd","renew","epp"]);
  if (u >= 50) return new Set(["sd","renew","epp"]);
  if (u >= 32) return new Set(["sd","renew"]);
  if (u >= 16) return new Set(["sd"]);
  return new Set<string>();
}

const EU_STATES = [
  {code:"DE"},{code:"FR"},{code:"IT"},{code:"ES"},{code:"PL"},{code:"RO"},
  {code:"NL"},{code:"BE"},{code:"GR"},{code:"CZ"},{code:"SE"},{code:"PT"},
  {code:"HU"},{code:"AT"},{code:"BG"},{code:"DK"},{code:"FI"},{code:"SK"},
  {code:"IE"},{code:"HR"},{code:"LT"},{code:"LV"},{code:"SI"},{code:"EE"},
  {code:"CY"},{code:"MT"},{code:"LU"},
];

// ─── Visual Components ─────────────────────────────────────────────────────────

function EPHemicycleViz({ unity }: { unity: number }) {
  const coalition = useMemo(() => getEPCoalition(unity), [unity]);
  const seats = useMemo(() => EP_GROUPS.filter(g => coalition.has(g.id)).reduce((s,g) => s+g.seats, 0), [coalition]);
  const maj = seats >= 353;
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">European Parliament · 705 seats</p>
        <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-bold",
          maj ? "border-emerald-700/40 bg-emerald-900/20 text-emerald-300"
              : "border-rose-700/40 bg-rose-900/20 text-rose-400")}>
          {maj ? "✓" : "✗"} {seats} seats
        </span>
      </div>
      <svg viewBox="0 0 400 228" className="w-full">
        {EP_POSITIONS.map((pos, i) => {
          const g = EP_GROUP_MAP[EP_SEAT_GROUPS[i] ?? "ni"];
          return <circle key={i} cx={pos.x} cy={pos.y} r={2.5}
            fill={g?.color ?? "#64748b"} opacity={coalition.has(EP_SEAT_GROUPS[i]) ? 1 : 0.12} />;
        })}
        <ellipse cx="200" cy="215" rx="16" ry="5" fill="#0f172a" />
        <text x="200" y="225" textAnchor="middle" fontSize="8" fill="#334155">
          {EP_GROUPS.filter(g => coalition.has(g.id)).map(g => g.label).join(" · ") || "No coalition"}
        </text>
      </svg>
      <div className="space-y-1">
        <div className="relative h-1.5 w-full rounded-full bg-slate-800/80">
          <div className="h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100,(seats/705)*100)}%`, backgroundColor: maj ? "#22c55e" : "#ef4444" }} />
          <div className="absolute top-0 h-1.5 w-px bg-amber-400" style={{ left:`${(353/705)*100}%` }} />
        </div>
        <div className="flex flex-wrap gap-x-2 gap-y-0.5">
          {EP_GROUPS.map(g => (
            <span key={g.id} className="flex items-center gap-0.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: coalition.has(g.id) ? g.color : `${g.color}30` }} />
              <span className={cn("text-[9px]", coalition.has(g.id) ? "text-slate-400" : "text-slate-700")}>
                {g.label} {g.seats}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function CouncilViz({ msa, qmv }: { msa: number; qmv: number }) {
  const supporting = Math.round((msa / 100) * 27);
  const needed = Math.max(1, Math.ceil((qmv / 100) * 27));
  const passes = supporting >= needed;
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Council of the EU · 27 states</p>
        <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-bold",
          passes ? "border-emerald-700/40 bg-emerald-900/20 text-emerald-300"
                 : "border-rose-700/40 bg-rose-900/20 text-rose-400")}>
          {passes ? "✓ QMV" : "✗ Blocked"} {supporting}/{needed}
        </span>
      </div>
      <div className="grid grid-cols-9 gap-1">
        {EU_STATES.map((s, i) => (
          <div key={s.code} title={s.code}
            className={cn("flex h-6 w-full items-center justify-center rounded text-[8px] font-bold border transition-all",
              i < supporting
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                : "bg-slate-800/30 border-slate-700/30 text-slate-700",
              i === needed-1 && "ring-1 ring-amber-400/50")}>
            {s.code}
          </div>
        ))}
      </div>
      <div className="space-y-1">
        <div className="relative h-1.5 w-full rounded-full bg-slate-800/80">
          <div className="h-1.5 rounded-full transition-all duration-500"
            style={{ width:`${(supporting/27)*100}%`, backgroundColor: passes?"#22c55e99":"#ef444499" }} />
          <div className="absolute top-0 h-1.5 w-px bg-amber-400" style={{ left:`${(needed/27)*100}%` }} />
        </div>
        <div className="flex justify-between text-[9px]">
          <span className={passes?"text-emerald-400":"text-rose-400"}>{supporting} supporting</span>
          <span className="text-amber-400/70">↑ {needed} QMV threshold</span>
          <span className="text-slate-600">27 total</span>
        </div>
      </div>
    </div>
  );
}

// ─── Process Flowchart ────────────────────────────────────────────────────────

function ProcessFlowchart({ stages, cumulative }: { stages: StageResult[]; cumulative: number[] }) {
  const [activeStage, setActiveStage] = useState<number | null>(null);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Legislative process</p>
          <p className="text-[10px] text-slate-600 mt-0.5">Tap any stage to see details</p>
        </div>
        <div className="flex items-center gap-2 text-[9px]">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400 inline-block"/>≥80%</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400 inline-block"/>55–79%</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-400 inline-block"/>&lt;55%</span>
        </div>
      </div>

      {/* Flowchart row */}
      <div className="flex items-stretch overflow-x-auto pb-1 gap-0">
        {stages.map((stage, i) => {
          const pct = stage.passProb * 100;
          const tone = pct >= 80 ? "emerald" : pct >= 55 ? "amber" : "rose";
          const isActive = activeStage === i;
          const colors = {
            emerald: { border:"border-emerald-700/50", bg:"bg-emerald-900/15", text:"text-emerald-300", bar:"bg-emerald-400" },
            amber:   { border:"border-amber-700/50",   bg:"bg-amber-900/15",   text:"text-amber-300",   bar:"bg-amber-400" },
            rose:    { border:"border-rose-700/50",     bg:"bg-rose-900/15",    text:"text-rose-400",    bar:"bg-rose-400" },
          };
          const c = colors[tone];
          const lines = stage.shortLabel.split("\n");

          return (
            <div key={i} className="flex items-center flex-shrink-0">
              <button
                onClick={() => setActiveStage(isActive ? null : i)}
                className={cn(
                  "flex flex-col gap-1 rounded-xl border p-2 text-left w-[108px] transition-all duration-200",
                  c.border, c.bg,
                  isActive && "ring-1 ring-white/10 scale-[1.02]"
                )}>
                <div className="flex items-center justify-between w-full">
                  <span className={cn("text-[8px] font-bold", c.text)}>STEP {i+1}</span>
                  {stage.bottleneck && <span className="text-[9px] text-amber-400" title="Bottleneck risk">⚠</span>}
                </div>
                <div className="text-[9px] font-semibold text-slate-200 leading-tight min-h-[24px]">
                  {lines.map((l, j) => <span key={j} className="block">{l}</span>)}
                </div>
                <span className={cn("text-[15px] font-black tabular-nums leading-none", c.text)}>
                  {Math.round(pct)}%
                </span>
                <div className="h-1 w-full rounded-full bg-slate-800/60">
                  <div className={cn("h-1 rounded-full transition-all duration-500", c.bar)}
                    style={{ width: `${pct}%` }} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[8px] text-slate-600">cum.</span>
                  <span className={cn("text-[9px] font-bold tabular-nums", c.text)}>
                    {Math.round(cumulative[i])}%
                  </span>
                </div>
              </button>
              {i < stages.length - 1 && (
                <div className="flex items-center flex-shrink-0 px-0.5">
                  <div className="w-2 h-px bg-slate-700" />
                  <svg width="8" height="8" viewBox="0 0 8 8" className="flex-shrink-0">
                    <path d="M0 2 L5 4 L0 6" fill="none" stroke="#334155" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Active stage detail */}
      {activeStage !== null && (
        <div className="rounded-xl border border-slate-700/50 bg-slate-900/60 p-3 text-[11px] leading-5 text-slate-300 animate-in fade-in slide-in-from-top-1 duration-150">
          <span className="font-semibold text-slate-200">Stage {activeStage+1}: {stages[activeStage].label} — </span>
          {stages[activeStage].detail}
        </div>
      )}

      {/* Cumulative probability path */}
      <div className="flex items-center gap-1 flex-wrap pt-1 border-t border-slate-800/60">
        <span className="text-[9px] text-slate-600 mr-1">Cumulative path:</span>
        {cumulative.map((c, i) => (
          <span key={i} className={cn("text-[9px] font-semibold tabular-nums",
            c > 60 ? "text-emerald-400" : c > 30 ? "text-amber-400" : "text-rose-400")}>
            {Math.round(c)}%{i < cumulative.length-1 ? <span className="text-slate-700"> →</span> : null}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Compact Slider ────────────────────────────────────────────────────────────

const ACCENT_HEX: Record<string, string> = {
  cyan:"#22d3ee", emerald:"#34d399", violet:"#a78bfa", amber:"#fbbf24", rose:"#fb7185"
};
const ACCENT_STYLE = {
  cyan:    { border:"border-cyan-700/50",    text:"text-cyan-300"    },
  emerald: { border:"border-emerald-700/50", text:"text-emerald-300" },
  violet:  { border:"border-violet-700/50",  text:"text-violet-300"  },
  amber:   { border:"border-amber-700/50",   text:"text-amber-300"   },
  rose:    { border:"border-rose-700/50",    text:"text-rose-300"    },
};

function CompactSlider({ param, value, onChange }: {
  param: SliderParam; value: number; onChange: (id: string, v: number) => void;
}) {
  const a = ACCENT_STYLE[param.accent];
  return (
    <div className="space-y-1" title={`${param.label}: ${param.description}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-slate-300 leading-tight truncate">{param.label}</span>
        <span className={cn("flex-shrink-0 rounded border px-1.5 py-0.5 text-[11px] font-bold tabular-nums", a.border, a.text)}>
          {value}{param.unit}
        </span>
      </div>
      <input type="range" min={param.min} max={param.max} step={param.step} value={value}
        onChange={e => onChange(param.id, Number(e.target.value))}
        className="w-full h-1 rounded-full appearance-none cursor-pointer bg-slate-800"
        style={{ accentColor: ACCENT_HEX[param.accent] }} />
      <div className="flex justify-between text-[9px] text-slate-700">
        <span className="truncate max-w-[45%]">{param.lowLabel}</span>
        <span className="truncate max-w-[45%] text-right">{param.highLabel}</span>
      </div>
    </div>
  );
}

// ─── Metric bar ───────────────────────────────────────────────────────────────

function MetricBar({ label, value, tone }: { label: string; value: number; tone: "emerald"|"amber"|"rose"|"cyan" }) {
  const tc = { emerald:"text-emerald-300", amber:"text-amber-300", rose:"text-rose-300", cyan:"text-cyan-300" };
  const bc = { emerald:"bg-emerald-400", amber:"bg-amber-400", rose:"bg-rose-400", cyan:"bg-cyan-400" };
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-slate-500 w-32 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-slate-800/80">
        <div className={cn("h-1.5 rounded-full transition-all duration-500", bc[tone])} style={{ width:`${value}%` }} />
      </div>
      <span className={cn("text-[10px] font-bold tabular-nums w-8 text-right", tc[tone])}>{Math.round(value)}%</span>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

const DEFAULT = Object.fromEntries(PARAMS.map(p => [p.id, p.defaultValue]));

export default function EUDecisionSimulator() {
  const [params, setParams] = useState<Record<string, number>>(DEFAULT);
  const result = useMemo(() => runSimulation(params), [params]);
  const onChange = (id: string, v: number) => setParams(prev => ({ ...prev, [id]: v }));
  const reset = () => setParams(DEFAULT);

  const vBg = { emerald:"border-emerald-700/40 bg-emerald-900/10", amber:"border-amber-700/40 bg-amber-900/10", rose:"border-rose-700/40 bg-rose-900/10" };
  const vTx = { emerald:"text-emerald-200", amber:"text-amber-200", rose:"text-rose-200" };

  return (
    <AtlasPage className="simulator-atlas space-y-5 pb-12">
      <SimulatorHero
        actions={<SimulatorActionRow primaryHref="#eu-lab" primaryLabel="Open the lab" secondaryHref="/learn/how-the-eu-makes-decisions" secondaryLabel="Read module" />}
        description="The EU rarely makes decisions through a single vote. Proposals move through the Commission, Parliament, Council, and trilogue, with different bottlenecks at each stage. Adjust the seven levers and watch how coalition-building, subsidiarity pressure, and unanimity rules change the odds."
        eyebrow="EU legislative process"
        imageAlt="European governance simulation landscape"
        imageSrc="/atlas/simulator-hero.png"
        metrics={[
          { label: "Adoption chance", value: `${Math.round(result.overallSuccessProb)}%`, description: "Overall probability that the proposal survives every stage." },
          { label: "Adoption speed", value: `${Math.round(result.adoptionSpeed)}%`, description: "How quickly the proposal moves through the ordinary procedure." },
          { label: "Bargaining friction", value: `${Math.round(result.bargainingFriction)}%`, description: "How hard it is to bridge institutional differences." },
          { label: "Legitimacy", value: `${Math.round(result.legitimacyScore)}%`, description: "How politically robust the final outcome looks." },
        ]}
        title="EU Decision-Making Simulator"
      />

      <SimulatorPrimer
        aside="A good way to explore this lab is to start from one bottleneck. Raise member-state alignment while keeping Parliament fragmented, or lower unanimity while trilogue capacity stays weak. That makes the institutional choke point visible instead of turning the process into noise."
        items={[
          {
            title: "Every stage can slow the proposal for a different reason.",
            text: "The Commission can face subsidiarity pressure, Parliament can fail to build a coalition, the Council can hit unanimity barriers, and trilogue can stall even when everyone wants movement.",
          },
          {
            title: "Alignment matters more than formal procedure alone.",
            text: "Changing the voting rule helps, but if governments and parliamentary blocs are still far apart, the proposal simply carries conflict into the next stage instead of resolving it.",
          },
          {
            title: "The process rewards coalition-building, not just majorities.",
            text: "The EU system is designed to turn fragmented preferences into negotiated settlements. That often feels slow, but it is also why legitimacy and durability matter as much as speed.",
          },
        ]}
        summary="This simulator is best read as a chain of institutions rather than one vote. Its main lesson is that EU lawmaking depends on alignment across different political arenas, each with its own threshold, veto structure, and bargaining logic."
        title="Read the EU as a negotiation system"
      />

      <div className="flex justify-end">
        <button onClick={reset} className="inline-flex items-center gap-1 rounded-full border border-[rgba(28,36,48,0.12)] bg-white px-4 py-2 text-xs font-medium text-slate-600 transition hover:border-[rgba(28,36,48,0.2)] hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:text-slate-100">
          Reset
        </button>
      </div>

      {/* Main grid: sliders left, visuals right */}
      <div className="grid gap-5 lg:grid-cols-[340px_1fr]" id="eu-lab">

        {/* ── Left: sliders ── */}
        <div className="space-y-4">

          {/* How to use */}
          <SimulatorSidebarPanel kicker="How to use" title="Read the process" className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">How to use</p>
            <ol className="space-y-1 text-[11px] text-slate-400 list-none">
              <li className="flex gap-2"><span className="text-cyan-500 font-bold flex-shrink-0">①</span>Drag any slider to change the political or procedural conditions</li>
              <li className="flex gap-2"><span className="text-cyan-500 font-bold flex-shrink-0">②</span>Watch the parliament map, Council grid, and flowchart update live</li>
              <li className="flex gap-2"><span className="text-cyan-500 font-bold flex-shrink-0">③</span>Click a flowchart step to see why it passes or fails</li>
            </ol>
          </SimulatorSidebarPanel>

          {/* Sliders */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4 space-y-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Parameters <span className="text-slate-700 normal-case tracking-normal">(hover for description)</span></p>
            {PARAMS.map(param => (
              <CompactSlider key={param.id} param={param} value={params[param.id]} onChange={onChange} />
            ))}
          </div>

          {/* Outcome metrics */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4 space-y-2.5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Process metrics</p>
            <MetricBar label="Adoption speed" value={result.adoptionSpeed} tone="emerald" />
            <MetricBar label="Bargaining friction" value={result.bargainingFriction} tone="rose" />
            <MetricBar label="Amendment depth" value={result.amendmentDepth} tone="amber" />
            <MetricBar label="Legitimacy" value={result.legitimacyScore} tone="cyan" />
          </div>
        </div>

        {/* ── Right: infographics + flowchart + verdict ── */}
        <div className="space-y-4">

          {/* Parliament + Council side by side */}
          <div className="grid gap-3 sm:grid-cols-2">
            <EPHemicycleViz unity={params.parliamentUnity} />
            <CouncilViz msa={params.memberStateAlignment} qmv={params.qmvThreshold} />
          </div>

          {/* Process flowchart */}
          <ProcessFlowchart stages={result.stages} cumulative={result.cumulativeProbs} />

          {/* Verdict */}
          <div className={cn("rounded-2xl border p-4 flex items-start gap-4", vBg[result.verdictTone])}>
            <span className={cn("text-4xl font-black tabular-nums leading-none flex-shrink-0", vTx[result.verdictTone])}>
              {Math.round(result.overallSuccessProb)}%
            </span>
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-0.5">Probability of adoption</p>
              <p className="text-sm leading-5 text-slate-300">{result.verdict}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reference (below fold) */}
      <details className="rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden">
        <summary className="flex items-center justify-between cursor-pointer px-5 py-3 text-[10px] uppercase tracking-[0.22em] text-slate-500 hover:text-slate-400 list-none">
          <span>Key concepts reference</span>
          <ChevronDown className="h-3.5 w-3.5" />
        </summary>
        <div className="grid gap-4 sm:grid-cols-3 px-5 pb-5 text-sm text-slate-400">
          <div>
            <p className="font-semibold text-slate-300 mb-1 mt-3">QMV threshold</p>
            <p className="text-[12px] leading-5">Standard QMV requires 55% of states (15/27) representing 65% of the EU population. The slider tests treaty reforms. The Council grid updates live — the amber border marks the exact threshold state.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-300 mb-1 mt-3">EP coalition building</p>
            <p className="text-[12px] leading-5">The hemicycle shows 705 real EP seats coloured by political group. As you raise parliament unity, the coalition expands from S&D alone → EPP-S&D-Renew grand coalition (401 seats) → broader alliances.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-300 mb-1 mt-3">Subsidiarity & yellow card</p>
            <p className="text-[12px] leading-5">National parliaments have 8 weeks to issue reasoned opinions. A third of them = yellow card (Commission must review). A majority = orange card (full Council review required before Parliament and Council can vote).</p>
          </div>
        </div>
      </details>

    </AtlasPage>
  );
}
