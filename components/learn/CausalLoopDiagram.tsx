import type { AccentTone, CausalLoop, CausalLoopEdge, CausalLoopNode } from "@/lib/learn/modules";
import { cn } from "@/lib/utils";

const toneClasses: Record<
  AccentTone,
  {
    badge: string;
    glow: string;
    node: string;
    nodeText: string;
    loop: string;
    line: string;
  }
> = {
  amber: {
    badge: "border-amber-300 bg-amber-50 text-amber-700",
    glow: "from-[rgba(212,168,79,0.12)] via-[rgba(212,168,79,0.04)] to-transparent",
    node: "border-amber-200 bg-amber-50/95",
    nodeText: "text-amber-800",
    loop: "border-amber-200/80 bg-amber-50/55",
    line: "border-amber-200/80",
  },
  cyan: {
    badge: "border-cyan-300 bg-cyan-50 text-cyan-700",
    glow: "from-[rgba(59,130,246,0.12)] via-[rgba(59,130,246,0.04)] to-transparent",
    node: "border-cyan-200 bg-cyan-50/95",
    nodeText: "text-cyan-800",
    loop: "border-cyan-200/80 bg-cyan-50/55",
    line: "border-cyan-200/80",
  },
  emerald: {
    badge: "border-emerald-300 bg-emerald-50 text-emerald-700",
    glow: "from-[rgba(76,175,80,0.12)] via-[rgba(76,175,80,0.04)] to-transparent",
    node: "border-emerald-200 bg-emerald-50/95",
    nodeText: "text-emerald-800",
    loop: "border-emerald-200/80 bg-emerald-50/55",
    line: "border-emerald-200/80",
  },
  rose: {
    badge: "border-rose-300 bg-rose-50 text-rose-700",
    glow: "from-[rgba(244,114,182,0.12)] via-[rgba(244,114,182,0.04)] to-transparent",
    node: "border-rose-200 bg-rose-50/95",
    nodeText: "text-rose-800",
    loop: "border-rose-200/80 bg-rose-50/55",
    line: "border-rose-200/80",
  },
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
  const x = (1 - t) * (1 - t) * curve.startX + 2 * (1 - t) * t * curve.controlX + t * t * curve.endX;
  const y = (1 - t) * (1 - t) * curve.startY + 2 * (1 - t) * t * curve.controlY + t * t * curve.endY;

  return { x, y };
}

export function CausalLoopDiagram({
  accent,
  compact = false,
  description,
  edges,
  loops,
  nodes,
  title,
}: {
  accent: AccentTone;
  compact?: boolean;
  description: string;
  edges: CausalLoopEdge[];
  loops: (string | CausalLoop)[];
  nodes: CausalLoopNode[];
  title: string;
}) {
  const styles = toneClasses[accent];
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const positiveMarkerId = `arrow-positive-${accent}`;
  const negativeMarkerId = `arrow-negative-${accent}`;

  return (
    <section
      className={cn(
        "rounded-[1.9rem] border border-[rgba(28,36,48,0.08)] bg-white/76 p-5 shadow-[0_18px_40px_rgba(28,36,48,0.05)] sm:p-6",
        compact ? "shadow-none" : "",
      )}
    >
      {!compact ? (
        <div className="space-y-3">
          <span
            className={cn(
              "inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
              styles.badge,
            )}
          >
            System map
          </span>
          <h2 className="atlas-display text-3xl leading-tight text-slate-900">{title}</h2>
          <p className="atlas-copy max-w-4xl text-sm">{description}</p>
        </div>
      ) : (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="text-sm leading-7 text-slate-600">{description}</p>
        </div>
      )}

      <div className="relative mt-6 overflow-hidden rounded-[1.75rem] border border-[rgba(28,36,48,0.08)] bg-[linear-gradient(180deg,rgba(251,253,255,0.96),rgba(241,245,249,0.92))] p-4 sm:p-5">
        <div className="atlas-grid absolute inset-0 opacity-50" />
        <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b", styles.glow)} />

        <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-2xl text-sm leading-7 text-slate-600">
            Read the arrows as feedback relationships. Reinforcing links amplify a pattern, while balancing links try to
            contain or reverse it.
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-medium">
            <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(247,250,252,0.94)] px-3 py-1 text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full bg-[#3B82F6]" />
              Reinforcing
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(247,250,252,0.94)] px-3 py-1 text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full bg-[#C46A6A]" />
              Balancing
            </span>
          </div>
        </div>

        <div className="relative h-[25rem] sm:h-[30rem]">
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
                <path d="M0,0 L6,3 L0,6 Z" fill="#3B82F6" />
              </marker>
              <marker
                id={negativeMarkerId}
                markerHeight="8"
                markerWidth="8"
                orient="auto-start-reverse"
                refX="6"
                refY="3"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="#C46A6A" />
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
              const stroke = edge.polarity === "positive" ? "#3B82F6" : "#C46A6A";

              return (
                <g key={`${edge.from}-${edge.to}-${edge.label}`}>
                  <path
                    d={curve.path}
                    fill="none"
                    markerEnd={`url(#${edge.polarity === "positive" ? positiveMarkerId : negativeMarkerId})`}
                    stroke={stroke}
                    strokeDasharray={edge.polarity === "negative" ? "4 4" : undefined}
                    strokeLinecap="round"
                    strokeWidth="0.65"
                  />
                  <text fill="#556274" fontSize="2.2" textAnchor="middle" x={labelPoint.x} y={labelPoint.y - 1}>
                    {edge.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {nodes.map((node) => (
            <div
              className={cn(
                "absolute w-24 -translate-x-1/2 -translate-y-1/2 rounded-[1.2rem] border px-3 py-2 text-center text-[11px] font-semibold leading-tight shadow-[0_16px_36px_rgba(28,36,48,0.08)] sm:w-32 sm:text-xs",
                toneClasses[node.tone ?? accent].node,
                toneClasses[node.tone ?? accent].nodeText,
              )}
              key={node.id}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              {node.label}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {loops.map((loop, idx) => {
          if (typeof loop === "string") {
            return (
              <div
                className="rounded-[1.3rem] border border-[rgba(28,36,48,0.08)] bg-white/88 px-4 py-4 text-sm leading-7 text-slate-600"
                key={idx}
              >
                {loop}
              </div>
            );
          }

          return (
            <div className={cn("rounded-[1.35rem] border px-4 py-4", styles.loop)} key={loop.label}>
              <span
                className={cn(
                  "inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
                  loop.polarity === "reinforcing"
                    ? "border-cyan-200 bg-cyan-50 text-cyan-700"
                    : "border-rose-200 bg-rose-50 text-rose-700",
                )}
              >
                {loop.label} · {loop.polarity}
              </span>
              <p className="mt-3 text-sm leading-7 text-slate-700">{loop.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
