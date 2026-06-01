"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SliderParam {
  id: string; label: string; description: string;
  min: number; max: number; step: number; defaultValue: number;
  unit: string; lowLabel: string; highLabel: string;
  accent: "cyan" | "emerald" | "violet" | "amber" | "rose";
  affects: string;
}

interface StageResult {
  stage: string; label: string; shortLabel: string;
  passProb: number; bottleneck: boolean; detail: string;
}

interface SimResult {
  overallSuccessProb: number; legislativeSpeed: number; gridlockRisk: number;
  billDilution: number; bipartisanScore: number;
  stages: StageResult[]; cumulativeProbs: number[];
  verdict: string; verdictTone: "emerald" | "amber" | "rose";
}

// ─── Parameters ───────────────────────────────────────────────────────────────

const PARAMS: SliderParam[] = [
  { id:"partyPolarization", label:"Party polarization",
    description:"How ideologically divided the two parties are. High polarization reduces cross-party votes and raises filibuster usage.",
    min:0, max:100, step:1, defaultValue:65, unit:"%",
    lowLabel:"Bipartisan era", highLabel:"Maximum polarization", accent:"rose", affects:"All stages" },
  { id:"senateMajority", label:"Senate majority size",
    description:"Majority party's seat count. 60+ seats can break a filibuster without cross-party votes.",
    min:50, max:67, step:1, defaultValue:51, unit:" seats",
    lowLabel:"50+1 majority", highLabel:"Filibuster-proof 67", accent:"amber", affects:"Senate cloture" },
  { id:"cloturethreshold", label:"Cloture threshold",
    description:"Standard Senate rule requires 60 votes to end debate. Budget reconciliation only needs 51.",
    min:51, max:67, step:1, defaultValue:60, unit:" votes",
    lowLabel:"Simple majority (51)", highLabel:"Two-thirds (67)", accent:"cyan", affects:"Senate cloture" },
  { id:"houseMajority", label:"House majority margin",
    description:"Controlling party's margin above the 218-seat threshold. Thin margins empower party factions.",
    min:0, max:40, step:1, defaultValue:10, unit:" seats",
    lowLabel:"Razor-thin", highLabel:"Commanding margin", accent:"violet", affects:"House floor" },
  { id:"committeeGatekeeping", label:"Committee gatekeeping",
    description:"How much power committee chairs have to block or reshape bills before floor votes.",
    min:0, max:100, step:1, defaultValue:55, unit:"%",
    lowLabel:"Open floor process", highLabel:"Strong gatekeeper", accent:"amber", affects:"Committee" },
  { id:"presidentialVetoProbability", label:"Presidential veto probability",
    description:"Probability the president vetoes the bill. High if parties are divided; near zero if same party controls both.",
    min:0, max:100, step:1, defaultValue:20, unit:"%",
    lowLabel:"President will sign", highLabel:"Certain veto", accent:"rose", affects:"Presidential action" },
  { id:"overrideSupport", label:"Veto override support",
    description:"Share of Congress willing to override a presidential veto. Requires two-thirds of both chambers.",
    min:0, max:100, step:1, defaultValue:35, unit:"%",
    lowLabel:"No cross-party support", highLabel:"Veto-proof coalition", accent:"emerald", affects:"Presidential action" },
  { id:"executiveActionRisk", label:"Executive action tendency",
    description:"If Congress blocks, how likely is the president to use executive orders or agency rulemaking instead?",
    min:0, max:100, step:1, defaultValue:45, unit:"%",
    lowLabel:"Defers to Congress", highLabel:"Aggressive exec action", accent:"violet", affects:"Bypass signal" },
];

// ─── Scenarios ─────────────────────────────────────────────────────────────────

const SCENARIOS = [
  { label:"Bipartisan deal",    desc:"Moderate polarization, broad Senate support",
    values:{ partyPolarization:45, senateMajority:55, cloturethreshold:60, houseMajority:15, committeeGatekeeping:40, presidentialVetoProbability:5,  overrideSupport:55, executiveActionRisk:20 }},
  { label:"Reconciliation",     desc:"High polarization, 51-vote threshold",
    values:{ partyPolarization:80, senateMajority:51, cloturethreshold:51, houseMajority:8,  committeeGatekeeping:50, presidentialVetoProbability:5,  overrideSupport:30, executiveActionRisk:40 }},
  { label:"Divided government", desc:"Opposition blocks Senate, veto likely",
    values:{ partyPolarization:85, senateMajority:50, cloturethreshold:60, houseMajority:12, committeeGatekeeping:70, presidentialVetoProbability:90, overrideSupport:25, executiveActionRisk:75 }},
  { label:"1960s supermajority",desc:"Low polarization, large Senate majority",
    values:{ partyPolarization:30, senateMajority:65, cloturethreshold:60, houseMajority:35, committeeGatekeeping:75, presidentialVetoProbability:10, overrideSupport:60, executiveActionRisk:20 }},
];

// ─── Simulation ───────────────────────────────────────────────────────────────

function clamp(v: number, lo=0, hi=100) { return Math.max(lo, Math.min(hi, v)); }

function runSimulation(p: Record<string, number>): SimResult {
  const { partyPolarization:pp, senateMajority:sm, cloturethreshold:ct,
    houseMajority:hm, committeeGatekeeping:cg, presidentialVetoProbability:pv,
    overrideSupport:os, executiveActionRisk:ea } = p;

  const s1 = Math.max(0.15, clamp(100 - cg*0.5 + hm*0.8 - pp*0.2) / 100);
  const def = Math.max(0, pp*0.3 - hm*1.5) / 100;
  const s2 = clamp(0.9 - def * 0.5);
  const cross = clamp((100-pp)*0.3);
  const eff = sm + cross;
  const s3 = clamp(Math.min((eff/ct)*0.85, 0.98));
  const s4 = clamp(s3 * (pp < 50 ? 0.95 : 0.88));
  const div = Math.abs(hm - (sm-50)) / 40;
  const s5 = clamp(0.95 - div*0.25);
  const vetoP = pv/100;
  const overrP = os >= 67 ? 0.85 : os >= 55 ? 0.4 : 0.05;
  const s6 = (1-vetoP) + vetoP*overrP;
  const litR = clamp(pp*0.3 + cg*0.1) / 100;
  const s7 = clamp(1 - litR*0.6);

  const probs = [s1,s2,s3,s4,s5,s6,s7];
  const cumulative: number[] = [];
  let run = 1;
  for (const prob of probs) { run *= prob; cumulative.push(run*100); }

  const defCount = Math.round(Math.max(0,(pp-50)*0.05*(20-hm)));
  const stages: StageResult[] = [
    { stage:"1", label:"Committee markup & reporting", shortLabel:"Committee",
      passProb:s1, bottleneck:cg>60,
      detail: cg>70?"Strong gatekeeping: chairs can bottle the bill in subcommittee." :
        cg>40?"Moderate gatekeeping. Bill likely reaches markup but may be substantially amended." :
        "Relatively open. Bill likely reported to the floor with limited bottleneck." },
    { stage:"2", label:"House floor vote", shortLabel:"House\nFloor Vote",
      passProb:s2, bottleneck:hm<5,
      detail: hm<5?`Razor-thin majority (${218+hm} seats). Any 3-5 defections can kill the bill.` :
        hm<15?`Working majority. ${defCount>0?`${defCount} seats at risk of defection.`:"Limited defections tolerated."}` :
        "Commanding majority. Leadership has flexibility." },
    { stage:"3", label:"Senate cloture vote (filibuster)", shortLabel:"Senate\nCloture",
      passProb:s3, bottleneck:eff<ct,
      detail: eff<ct?`Projected ${Math.round(eff)} votes fall short of the ${Math.round(ct)}-vote threshold. Bill faces filibuster.` :
        `${Math.round(sm)} majority + ~${Math.round(cross)} cross-party votes = ${Math.round(eff)} ≥ ${Math.round(ct)}-vote threshold.` },
    { stage:"4", label:"Senate floor passage", shortLabel:"Senate\nFloor Vote",
      passProb:s4, bottleneck:pp>75&&sm<55,
      detail: pp>75?"Extreme polarization: nearly every vote along party lines. Majority must hold every member." :
        "Moderate polarization allows some amendment trading. Final passage achievable." },
    { stage:"5", label:"Conference committee", shortLabel:"Conference",
      passProb:s5, bottleneck:false,
      detail: div>0.3?"Significant House-Senate divergence. Conference may substantially rewrite the bill." :
        "Chambers relatively aligned. Reconciliation manageable." },
    { stage:"6", label:"Presidential signature or veto", shortLabel:"Presidential\nAction",
      passProb:s6, bottleneck:pv>50&&os<67,
      detail: pv>70&&os<55?`Likely veto (${Math.round(pv)}%), override coalition too weak (${Math.round(os)}% vs 67% needed).` :
        `Veto probability: ${Math.round(pv)}%. Override support: ${Math.round(os)}%.` },
    { stage:"7", label:"Implementation & litigation", shortLabel:"Implementation",
      passProb:s7, bottleneck:pp>70,
      detail: pp>70?"Highly polarized passage invites multi-year litigation and state-level resistance." :
        "Moderate opposition. Implementation proceeds with normal friction." },
  ];

  const overall = clamp(probs.reduce((a,b)=>a*b,1)*100);
  const gridlock = clamp(pp*0.4 + Math.max(0,ct-sm)*1.5 + (100-hm*2)*0.2 + cg*0.1);
  const execBypass = clamp(gridlock*ea/100);
  const tone: "emerald"|"amber"|"rose" = overall>=65?"emerald":overall>=30?"amber":"rose";

  return {
    overallSuccessProb: overall,
    legislativeSpeed: clamp(hm*1.5+(sm-50)*2+(100-pp)*0.4+(100-cg)*0.2-(ct-51)*0.8),
    gridlockRisk: gridlock,
    billDilution: clamp(cg*0.3+pp*0.25+Math.abs(50-hm)*0.5+(ct-sm)*0.8),
    bipartisanScore: clamp((100-pp)*0.5+(sm-50)*0.5+hm*0.5-pv*0.2),
    stages, cumulativeProbs: cumulative,
    verdict: overall>=65?"High probability of enactment. The majority coalition has enough structural advantage to move the bill through both chambers."
      : overall>=30?`Uncertain path. The bill faces structural bottlenecks — most likely the Senate cloture threshold. ${execBypass>40?"Presidential executive action is a significant alternative route.":""}`
      : `Low probability of enactment. ${pv>50?"Veto risk":"Thin majorities"} and procedural hurdles make conventional passage unlikely. ${ea>60?"High exec action tendency suggests agency rulemaking as the alternative.":""}`,
    verdictTone: tone,
  };
}

// ─── Hemicycle helper ─────────────────────────────────────────────────────────

function computeHemicycle(total:number,cx:number,cy:number,iR:number,oR:number,rows:number) {
  if (!total||!rows) return [] as {x:number;y:number}[];
  const step = rows>1?(oR-iR)/(rows-1):0;
  const radii = Array.from({length:rows},(_,i)=>iR+i*step);
  const tR = radii.reduce((s,r)=>s+r,0);
  const spr = radii.map(r=>Math.max(1,Math.round((r/tR)*total)));
  spr[rows-1]+=total-spr.reduce((a,b)=>a+b,0);
  const out:{x:number;y:number}[]=[];
  for(let row=0;row<rows;row++){
    const n=spr[row],r=radii[row];
    for(let i=0;i<n;i++){
      const a=n>1?Math.PI-(Math.PI*i/(n-1)):Math.PI/2;
      out.push({x:cx+r*Math.cos(a),y:cy-r*Math.sin(a)});
    }
  }
  return out;
}

const SENATE_POS = computeHemicycle(100,180,180,55,158,5);
const HOUSE_POS  = computeHemicycle(435,180,190,48,168,7);

const MAJ_C  = "#f59e0b";
const MIN_C  = "#60a5fa";
const CROSS_C= "#34d399";

// ─── Senate Viz ───────────────────────────────────────────────────────────────

function SenateViz({ sm, ct, pp }: { sm:number; ct:number; pp:number }) {
  const minSeats = 100 - sm;
  const cross = Math.round((100-pp)*0.3);
  const crossNeeded = Math.max(0, ct-sm);
  const crossActual = Math.min(crossNeeded, cross);
  const passes = sm + crossActual >= ct;
  const tAng = Math.PI*(ct/100);
  const tX = 180 + 158*Math.cos(tAng);
  const tY = 180 - 158*Math.sin(tAng);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">U.S. Senate · 100 seats</p>
        <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-bold",
          passes?"border-emerald-700/40 bg-emerald-900/20 text-emerald-300"
                :"border-rose-700/40 bg-rose-900/20 text-rose-400")}>
          {passes?"✓ Cloture":"✗ Filibuster"} {sm+crossActual}/{Math.round(ct)}
        </span>
      </div>
      <svg viewBox="0 0 360 194" className="w-full">
        <line x1="180" y1="180" x2={tX} y2={tY} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.7"/>
        <text x={180+150*Math.cos(tAng)} y={180-150*Math.sin(tAng)} textAnchor="middle" fontSize="8" fill="#f59e0b" opacity="0.9">{Math.round(ct)}</text>
        {SENATE_POS.map((pos,i)=>{
          const isMin=i<minSeats;
          const isCross=isMin&&i>=(minSeats-crossActual);
          return <circle key={i} cx={pos.x} cy={pos.y} r={4.6}
            fill={!isMin?MAJ_C:isCross?CROSS_C:MIN_C}
            opacity={!isMin?1:isCross?0.9:0.25}/>;
        })}
        <ellipse cx="180" cy="180" rx="14" ry="4" fill="#0f172a"/>
        <text x="180" y="191" textAnchor="middle" fontSize="7" fill="#334155">Presiding officer</text>
      </svg>
      <div className="space-y-1">
        <div className="relative h-1.5 w-full rounded-full bg-slate-800/80">
          <div className="h-1.5 rounded-full transition-all duration-500"
            style={{width:`${Math.min(100,((sm+crossActual)/100)*100)}%`,backgroundColor:passes?"#22c55e":"#ef4444"}}/>
          <div className="absolute top-0 h-1.5 w-px bg-amber-400" style={{left:`${ct}%`}}/>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[9px]">
          <span className="flex items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full inline-block" style={{backgroundColor:MAJ_C}}/> Majority {sm}</span>
          <span className="flex items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full inline-block" style={{backgroundColor:CROSS_C}}/> Cross-party {crossActual}</span>
          <span className="flex items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full inline-block opacity-25" style={{backgroundColor:MIN_C}}/> <span className="text-slate-600">Not voting {minSeats-crossActual}</span></span>
          <span className="ml-auto flex items-center gap-0.5 text-amber-400/80"><span className="w-3 border-t border-dashed border-amber-400/70 inline-block"/> {Math.round(ct)}-vote line</span>
        </div>
      </div>
    </div>
  );
}

// ─── House Viz ────────────────────────────────────────────────────────────────

function HouseViz({ hm, pp }: { hm:number; pp:number }) {
  const totalMaj = 218 + hm;
  const totalMin = 435 - totalMaj;
  const defCount = Math.round(Math.max(0,(pp-50)*0.05*(20-hm)));
  const tAng = Math.PI*(218/435);
  const tX = 180 + 168*Math.cos(tAng);
  const tY = 190 - 168*Math.sin(tAng);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">U.S. House · 435 seats</p>
        <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-bold",
          defCount===0?"border-emerald-700/40 bg-emerald-900/20 text-emerald-300"
                     :"border-amber-700/40 bg-amber-900/20 text-amber-300")}>
          {defCount===0?"✓":""} {totalMaj-defCount}/218
        </span>
      </div>
      <svg viewBox="0 0 360 206" className="w-full">
        <line x1="180" y1="190" x2={tX} y2={tY} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.6"/>
        <text x={180+150*Math.cos(tAng)} y={190-150*Math.sin(tAng)} textAnchor="middle" fontSize="8" fill="#f59e0b" opacity="0.8">218</text>
        {HOUSE_POS.map((pos,i)=>{
          const isMin=i<totalMin;
          const isDefy=!isMin&&(435-1-i)<defCount;
          return <circle key={i} cx={pos.x} cy={pos.y} r={2.5}
            fill={isMin?MIN_C:isDefy?"#ef4444":MAJ_C}
            opacity={isMin?0.25:isDefy?0.45:1}/>;
        })}
        <ellipse cx="180" cy="190" rx="13" ry="4" fill="#0f172a"/>
        <text x="180" y="201" textAnchor="middle" fontSize="7" fill="#334155">Speaker</text>
      </svg>
      <div className="space-y-1">
        <div className="relative h-1.5 w-full rounded-full bg-slate-800/80">
          <div className="h-1.5 rounded-full transition-all duration-500"
            style={{width:`${((totalMaj-defCount)/435)*100}%`,backgroundColor:totalMaj-defCount>=218?"#f59e0b":"#ef4444"}}/>
          <div className="absolute top-0 h-1.5 w-px bg-amber-400" style={{left:`${(218/435)*100}%`}}/>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[9px]">
          <span className="flex items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full inline-block" style={{backgroundColor:MAJ_C}}/> Majority {totalMaj}</span>
          {defCount>0&&<span className="flex items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full inline-block opacity-45 bg-rose-400"/> <span className="text-amber-400">At-risk {defCount}</span></span>}
          <span className="flex items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full inline-block opacity-25" style={{backgroundColor:MIN_C}}/> <span className="text-slate-600">Minority {totalMin}</span></span>
        </div>
      </div>
    </div>
  );
}

// ─── Process Flowchart ────────────────────────────────────────────────────────

function ProcessFlowchart({ stages, cumulative }: { stages: StageResult[]; cumulative: number[] }) {
  const [active, setActive] = useState<number|null>(null);
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Legislative process</p>
          <p className="text-[10px] text-slate-600 mt-0.5">Click any stage for details</p>
        </div>
        <div className="flex items-center gap-2 text-[9px]">
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block"/>≥80%</span>
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-amber-400 inline-block"/>55–79%</span>
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-rose-400 inline-block"/>&lt;55%</span>
        </div>
      </div>
      <div className="flex items-stretch overflow-x-auto pb-1 gap-0">
        {stages.map((stage,i)=>{
          const pct=stage.passProb*100;
          const tone=pct>=80?"emerald":pct>=55?"amber":"rose";
          const isAct=active===i;
          const C={emerald:{b:"border-emerald-700/50",bg:"bg-emerald-900/15",t:"text-emerald-300",bar:"bg-emerald-400"},
                   amber:  {b:"border-amber-700/50",  bg:"bg-amber-900/15",  t:"text-amber-300",  bar:"bg-amber-400"},
                   rose:   {b:"border-rose-700/50",   bg:"bg-rose-900/15",   t:"text-rose-400",   bar:"bg-rose-400"}};
          const c=C[tone];
          const lines=stage.shortLabel.split("\n");
          return (
            <div key={i} className="flex items-center flex-shrink-0">
              <button onClick={()=>setActive(isAct?null:i)}
                className={cn("flex flex-col gap-1 rounded-xl border p-2 text-left w-[108px] transition-all",
                  c.b,c.bg,isAct&&"ring-1 ring-white/10 scale-[1.02]")}>
                <div className="flex items-center justify-between w-full">
                  <span className={cn("text-[8px] font-bold",c.t)}>STEP {i+1}</span>
                  {stage.bottleneck&&<span className="text-[9px] text-amber-400">⚠</span>}
                </div>
                <div className="text-[9px] font-semibold text-slate-200 leading-tight min-h-[24px]">
                  {lines.map((l,j)=><span key={j} className="block">{l}</span>)}
                </div>
                <span className={cn("text-[15px] font-black tabular-nums leading-none",c.t)}>{Math.round(pct)}%</span>
                <div className="h-1 w-full rounded-full bg-slate-800/60">
                  <div className={cn("h-1 rounded-full transition-all duration-500",c.bar)} style={{width:`${pct}%`}}/>
                </div>
                <div className="flex justify-between">
                  <span className="text-[8px] text-slate-600">cum.</span>
                  <span className={cn("text-[9px] font-bold tabular-nums",c.t)}>{Math.round(cumulative[i])}%</span>
                </div>
              </button>
              {i<stages.length-1&&(
                <div className="flex items-center flex-shrink-0 px-0.5">
                  <div className="w-2 h-px bg-slate-700"/>
                  <svg width="8" height="8" viewBox="0 0 8 8"><path d="M0 2 L5 4 L0 6" fill="none" stroke="#334155" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {active!==null&&(
        <div className="rounded-xl border border-slate-700/50 bg-slate-900/60 p-3 text-[11px] leading-5 text-slate-300">
          <span className="font-semibold text-slate-200">Stage {active+1}: {stages[active].label} — </span>
          {stages[active].detail}
        </div>
      )}
      <div className="flex items-center gap-1 flex-wrap pt-1 border-t border-slate-800/60">
        <span className="text-[9px] text-slate-600 mr-1">Cumulative path:</span>
        {cumulative.map((c,i)=>(
          <span key={i} className={cn("text-[9px] font-semibold tabular-nums",
            c>60?"text-emerald-400":c>30?"text-amber-400":"text-rose-400")}>
            {Math.round(c)}%{i<cumulative.length-1&&<span className="text-slate-700"> →</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Compact Slider ────────────────────────────────────────────────────────────

const AHEX:Record<string,string>={cyan:"#22d3ee",emerald:"#34d399",violet:"#a78bfa",amber:"#fbbf24",rose:"#fb7185"};
const ASTYLE={cyan:{b:"border-cyan-700/50",t:"text-cyan-300"},emerald:{b:"border-emerald-700/50",t:"text-emerald-300"},
  violet:{b:"border-violet-700/50",t:"text-violet-300"},amber:{b:"border-amber-700/50",t:"text-amber-300"},rose:{b:"border-rose-700/50",t:"text-rose-300"}};

function CompactSlider({param,value,onChange}:{param:SliderParam;value:number;onChange:(id:string,v:number)=>void}) {
  const a=ASTYLE[param.accent];
  return (
    <div className="space-y-1" title={`${param.label}: ${param.description}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-slate-300 leading-tight truncate">{param.label}</span>
        <span className={cn("flex-shrink-0 rounded border px-1.5 py-0.5 text-[11px] font-bold tabular-nums",a.b,a.t)}>{value}{param.unit}</span>
      </div>
      <input type="range" min={param.min} max={param.max} step={param.step} value={value}
        onChange={e=>onChange(param.id,Number(e.target.value))}
        className="w-full h-1 rounded-full appearance-none cursor-pointer bg-slate-800"
        style={{accentColor:AHEX[param.accent]}}/>
      <div className="flex justify-between text-[9px] text-slate-700">
        <span className="truncate max-w-[45%]">{param.lowLabel}</span>
        <span className="truncate max-w-[45%] text-right">{param.highLabel}</span>
      </div>
    </div>
  );
}

function MetricBar({label,value,tone}:{label:string;value:number;tone:"emerald"|"amber"|"rose"|"cyan"}) {
  const tc={emerald:"text-emerald-300",amber:"text-amber-300",rose:"text-rose-300",cyan:"text-cyan-300"};
  const bc={emerald:"bg-emerald-400",amber:"bg-amber-400",rose:"bg-rose-400",cyan:"bg-cyan-400"};
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-slate-500 w-32 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-slate-800/80">
        <div className={cn("h-1.5 rounded-full transition-all duration-500",bc[tone])} style={{width:`${value}%`}}/>
      </div>
      <span className={cn("text-[10px] font-bold tabular-nums w-8 text-right",tc[tone])}>{Math.round(value)}%</span>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

const DEFAULT = Object.fromEntries(PARAMS.map(p=>[p.id,p.defaultValue]));

export default function USDecisionSimulator() {
  const [params,setParams]=useState<Record<string,number>>(DEFAULT);
  const result=useMemo(()=>runSimulation(params),[params]);
  const onChange=(id:string,v:number)=>setParams(prev=>({...prev,[id]:v}));
  const reset=()=>setParams(DEFAULT);

  const vBg={emerald:"border-emerald-700/40 bg-emerald-900/10",amber:"border-amber-700/40 bg-amber-900/10",rose:"border-rose-700/40 bg-rose-900/10"};
  const vTx={emerald:"text-emerald-200",amber:"text-amber-200",rose:"text-rose-200"};

  return (
    <div className="mx-auto max-w-7xl space-y-5 pb-12">

      {/* Compact header */}
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/85 px-6 py-5 sm:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-amber-400/10 to-transparent"/>
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Link href="/simulator" className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1">
                <ArrowLeft className="h-3 w-3"/> Simulators
              </Link>
              <span className="text-slate-700">·</span>
              <span className="inline-flex rounded-full border border-amber-300/25 bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-medium text-amber-100">US legislative process</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-50">US Decision-Making Simulator</h1>
            <p className="text-[11px] text-slate-500 max-w-xl">
              Adjust sliders → watch Senate and House seat maps update live. Click any flowchart stage to see why it passes or fails at your current settings.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/learn/how-the-us-government-makes-decisions" className="inline-flex items-center gap-1 rounded-xl border border-amber-400/30 px-3 py-1.5 text-[11px] font-medium text-amber-300 hover:bg-amber-400/10 transition-colors">
              Read module
            </Link>
            <button onClick={reset} className="inline-flex items-center gap-1 rounded-xl border border-slate-700 px-3 py-1.5 text-[11px] text-slate-400 hover:text-slate-200 transition-colors">
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* Main grid */}
      <div className="grid gap-5 lg:grid-cols-[340px_1fr]">

        {/* ── Left: guide + scenarios + sliders ── */}
        <div className="space-y-4">

          {/* How to use */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 space-y-2">
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">How to use</p>
            <ol className="space-y-1 text-[11px] text-slate-400 list-none">
              <li className="flex gap-2"><span className="text-amber-500 font-bold flex-shrink-0">①</span>Load a scenario preset below or start from defaults</li>
              <li className="flex gap-2"><span className="text-amber-500 font-bold flex-shrink-0">②</span>Drag sliders to change political & procedural conditions</li>
              <li className="flex gap-2"><span className="text-amber-500 font-bold flex-shrink-0">③</span>Watch Senate/House maps and flowchart update live</li>
            </ol>
          </div>

          {/* Scenario presets */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 space-y-2">
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Scenario presets</p>
            <div className="grid grid-cols-2 gap-1.5">
              {SCENARIOS.map(s=>(
                <button key={s.label} onClick={()=>setParams(s.values)}
                  className="text-left rounded-xl border border-slate-800 bg-slate-900/60 p-2 hover:border-slate-600 transition-colors">
                  <p className="text-[10px] font-semibold text-slate-200 leading-tight">{s.label}</p>
                  <p className="text-[9px] text-slate-600 mt-0.5 leading-tight">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4 space-y-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Parameters <span className="text-slate-700 normal-case tracking-normal">(hover for description)</span></p>
            {PARAMS.map(param=>(
              <CompactSlider key={param.id} param={param} value={params[param.id]} onChange={onChange}/>
            ))}
          </div>

          {/* Metrics */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4 space-y-2.5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Process metrics</p>
            <MetricBar label="Legislative speed" value={result.legislativeSpeed} tone="emerald"/>
            <MetricBar label="Gridlock risk" value={result.gridlockRisk} tone="rose"/>
            <MetricBar label="Bill dilution" value={result.billDilution} tone="amber"/>
            <MetricBar label="Bipartisan score" value={result.bipartisanScore} tone="cyan"/>
          </div>
        </div>

        {/* ── Right: congress maps + flowchart + verdict ── */}
        <div className="space-y-4">

          <div className="grid gap-3 sm:grid-cols-2">
            <SenateViz sm={params.senateMajority} ct={params.cloturethreshold} pp={params.partyPolarization}/>
            <HouseViz hm={params.houseMajority} pp={params.partyPolarization}/>
          </div>

          <ProcessFlowchart stages={result.stages} cumulative={result.cumulativeProbs}/>

          <div className={cn("rounded-2xl border p-4 flex items-start gap-4",vBg[result.verdictTone])}>
            <span className={cn("text-4xl font-black tabular-nums leading-none flex-shrink-0",vTx[result.verdictTone])}>
              {Math.round(result.overallSuccessProb)}%
            </span>
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-0.5">Probability of enactment</p>
              <p className="text-sm leading-5 text-slate-300">{result.verdict}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reference (below fold) */}
      <details className="rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden">
        <summary className="flex items-center justify-between cursor-pointer px-5 py-3 text-[10px] uppercase tracking-[0.22em] text-slate-500 hover:text-slate-400 list-none">
          <span>Key concepts reference</span>
          <ChevronDown className="h-3.5 w-3.5"/>
        </summary>
        <div className="grid gap-4 sm:grid-cols-3 px-5 pb-5 text-sm text-slate-400">
          <div>
            <p className="font-semibold text-slate-300 mb-1 mt-3">The filibuster</p>
            <p className="text-[12px] leading-5">The Senate filibuster is a Senate rule, not in the Constitution. Cloture (ending debate) requires 60 votes. Budget reconciliation only needs 51. The green seats in the hemicycle show cross-party votes bridging the gap.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-300 mb-1 mt-3">Veto override</p>
            <p className="text-[12px] leading-5">The president can veto any bill. Congress overrides with two-thirds of both chambers (67 Senate, 290 House). This has become nearly impossible in the polarized era — most overrides happened before the 1990s.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-300 mb-1 mt-3">Executive bypass</p>
            <p className="text-[12px] leading-5">When Congress gridlocks, presidents use executive orders and agency rulemaking. This is faster but vulnerable to court challenges and reversal by the next administration. The &quot;exec action&quot; slider signals this tendency.</p>
          </div>
        </div>
      </details>

    </div>
  );
}
