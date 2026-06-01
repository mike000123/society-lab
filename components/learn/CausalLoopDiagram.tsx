import type { AccentTone, CausalLoop, CausalLoopEdge, CausalLoopNode } from "@/lib/learn/modules";
import { cn } from "@/lib/utils";

const toneClasses: Record<AccentTone, string> = {
  amber: "border-amber-300/25 bg-amber-400/10 text-amber-100",
  cyan: "border-cyan-300/25 bg-cyan-400/10 text-cyan-100",
  emerald: "border-emerald-300/25 bg-emerald-400/10 text-emerald-100",
  rose: "border-rose-300/25 bg-rose-400/10 text-rose-100",
};

function getPointAtDistance(start: CausalLoopNode, end: CausalLoopNode, distance = 7) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy) || 1;
  const ratio = distance / length;

  return {
    endX: end.x - dx * ratio,
    endY: end.y - dy * ratio,
    startX: start.x + dx * ratio,
    startY: start.y + dy * ratio,
  };
}

function getCurvedPath(start: CausalLoopNode, end: CausalLoopNode, bend = 0) {
  const { endX, endY, startX, startY } = getPointAtDistance(start, end);
  const dx = endX - startX;
  const dy = endY - startY;
  const length = Math.sqrt(dx * dx + dy * dy) || 1;
  const normalX = -dy / length;
  const normalY = dx / length;
  const controlX = (startX + endX) / 2 + normalX * bend;
  const controlY = (startY + endY) / 2 + normalY * bend;

  return {
    controlX,
    controlY,
    endX,
    endY,
    path: `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`,
    startX,
    startY,
  };
}

function getLabelPoint(start: CausalLoopNode, end: CausalLoopNode, bend = 0) {
  const curve = getCurvedPath(start, end, bend);
  const t = 0.5;
  const x =
    (1 - t) * (1 - t) * curve.startX +
    2 * (1 - t) * t * curve.controlX +
    t * t * curve.endX;
  const y =
    (1 - t) * (1 - t) * curve.startY +
    2 * (1 - t) * t * curve.controlY +
    t * t * curve.endY;

  return { x, y };
}

export function CausalLoopDiagram({
  accent,
  description,
  edges,
  loops,
  nodes,
  title,
}: {
  accent: AccentTone;
  description: string;
  edges: CausalLoopEdge[];
  loops: (string | CausalLoop)[];
  nodes: CausalLoopNode[];
  title: string;
}) {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const positiveMarkerId = `arrow-positive-${accent}`;
  const negativeMarkerId = `arrow-negative-${accent}`;

  return (
    <section className="rounded-[1.75rem] border border-slate-800 bg-panel/90 p-5 sm:p-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Causal loop</p>
        <h2 className="text-2xl font-semibold text-slate-50">{title}</h2>
        <p className="max-w-3xl text-sm leading-6 text-slate-300">{description}</p>
      </div>

      <div className="relative mt-6 h-[25rem] overflow-hidden rounded-[1.5rem] border border-slate-800 bg-slate-950/70 sm:h-[30rem]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_38%)]" />
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <defs>
            <marker
              id={positiveMarkerId}
              markerHeight="8"
              markerWidth="8"
              orient="auto-start-reverse"
              refX="6"
              refY="3"
            >
              <path d="M0,0 L6,3 L0,6 Z" fill="#22d3ee" />
            </marker>
            <marker
              id={negativeMarkerId}
              markerHeight="8"
              markerWidth="8"
              orient="auto-start-reverse"
              refX="6"
              refY="3"
            >
              <path d="M0,0 L6,3 L0,6 Z" fill="#fb7185" />
            </marker>
          </defs>

          {edges.map((edge) => {
            const start = nodeMap.get(edge.from);
            const end = nodeMap.get(edge.to);

            if (!start || !end) {
              return null;
            }

            const curve = getCurvedPath(start, end, edge.bend ?? 0);
            const labelPoint = getLabelPoint(start, end, edge.bend ?? 0);
            const stroke = edge.polarity === "positive" ? "#22d3ee" : "#fb7185";

            return (
              <g key={`${edge.from}-${edge.to}-${edge.label}`}>
                <path
                  d={curve.path}
                  fill="none"
                  markerEnd={`url(#${edge.polarity === "positive" ? positiveMarkerId : negativeMarkerId})`}
                  stroke={stroke}
                  strokeDasharray={edge.polarity === "negative" ? "3 3" : undefined}
                  strokeLinecap="round"
                  strokeWidth="0.75"
                />
                <text
                  fill="#cbd5e1"
                  fontSize="2.45"
                  textAnchor="middle"
                  x={labelPoint.x}
                  y={labelPoint.y - 1}
                >
                  {edge.label}
                </text>
              </g>
            );
          })}
        </svg>

        {nodes.map((node) => (
          <div
            className={cn(
              "absolute w-24 -translate-x-1/2 -translate-y-1/2 rounded-2xl border px-3 py-2 text-center text-[11px] font-medium leading-tight shadow-[0_12px_30px_rgba(2,8,23,0.35)] sm:w-32 sm:text-xs",
              toneClasses[node.tone ?? accent],
            )}
            key={node.id}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            {node.label}
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {loops.map((loop, idx) => {
          if (typeof loop === "string") {
            return (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-300" key={idx}>
                {loop}
              </div>
            );
          }
          return (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3" key={loop.label}>
              <div className="flex items-center gap-2 mb-1">
                <span className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                  loop.polarity === "reinforcing"
                    ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                    : "border-rose-400/30 bg-rose-400/10 text-rose-300"
                )}>
                  {loop.label} · {loop.polarity}
                </span>
              </div>
              <p className="text-sm leading-6 text-slate-300">{loop.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

