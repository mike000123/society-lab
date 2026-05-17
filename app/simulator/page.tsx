"use client";
import { useMemo, useState } from "react";
import { PolicyTrendChart } from "@/components/charts/policy-trend-chart";

export default function SimulatorPage() {
  const [security, setSecurity] = useState(35);
  const [transparency, setTransparency] = useState(50);
  const [education, setEducation] = useState(55);

  const model = useMemo(() => {
    const wellbeing = Math.min(100, Math.round(20 + security * 0.45 + education * 0.35));
    const stability = Math.min(100, Math.round(25 + transparency * 0.5 + education * 0.2));
    const timeline = Array.from({ length: 8 }, (_, i) => ({ year: `Y${i + 1}`, wellbeing: Math.round(40 + (wellbeing - 40) * ((i + 1) / 8)), stability: Math.round(42 + (stability - 42) * ((i + 1) / 8)) }));
    return { wellbeing, stability, timeline };
  }, [security, transparency, education]);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Policy Simulator (MVP)</h1>
      <p className="text-sm text-slate-400">This is a demo model for UI architecture only. No real policy inference yet.</p>
      <section className="grid gap-3 sm:grid-cols-3">
        <Range label="Economic security" value={security} setValue={setSecurity} />
        <Range label="Institutional transparency" value={transparency} setValue={setTransparency} />
        <Range label="Critical education" value={education} setValue={setEducation} />
      </section>
      <div className="rounded-2xl border border-slate-800 bg-panel p-4">
        <p>Projected wellbeing: <b>{model.wellbeing}</b></p>
        <p>Projected stability: <b>{model.stability}</b></p>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-panel p-4"><PolicyTrendChart data={model.timeline} /></div>
    </div>
  );
}

function Range({ label, value, setValue }: { label: string; value: number; setValue: (v: number) => void }) {
  return <label className="rounded-xl border border-slate-800 bg-panel p-3 text-sm">{label}<input type="range" min={0} max={100} value={value} onChange={(e) => setValue(Number(e.target.value))} className="mt-2 w-full" /><span className="text-cyan-300">{value}%</span></label>;
}
