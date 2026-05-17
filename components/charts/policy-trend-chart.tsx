"use client";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

export function PolicyTrendChart({ data }: { data: { year: string; wellbeing: number; stability: number }[] }) {
  return <div className="h-64 w-full"><ResponsiveContainer width="100%" height="100%"><LineChart data={data}><XAxis dataKey="year" stroke="#94a3b8" /><YAxis domain={[0, 100]} stroke="#94a3b8" /><Tooltip contentStyle={{ background: "#0e1726", border: "1px solid #334155" }} /><Line type="monotone" dataKey="wellbeing" stroke="#22d3ee" strokeWidth={2} /><Line type="monotone" dataKey="stability" stroke="#60a5fa" strokeWidth={2} /></LineChart></ResponsiveContainer></div>;
}
