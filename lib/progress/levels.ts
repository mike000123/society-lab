// ─── Progression level system ─────────────────────────────────────────────────
// Levels are earned by passing module quizzes (score ≥ 60%).
// There are 25 modules total; thresholds are spaced to feel rewarding.

export type LevelId = "beginner" | "systems-thinker" | "scenario-designer" | "civic-architect";

export interface ProgressLevel {
  id: LevelId;
  label: string;
  tagline: string;
  description: string;
  /** Minimum quizzes passed to reach this level */
  minPassed: number;
  /** Quizzes needed to reach NEXT level (undefined for max level) */
  nextAt?: number;
  color: {
    badge: string;      // border + bg + text classes
    glow: string;       // gradient class
    bar: string;        // progress bar fill class
    icon: string;       // icon color class
    ring: string;       // ring/border class
  };
  emoji: string;
}

export const LEVELS: ProgressLevel[] = [
  {
    id: "beginner",
    label: "Beginner",
    tagline: "Starting to see the system",
    description:
      "You've taken the first step. Every expert was once here — the difference is they kept asking why.",
    minPassed: 0,
    nextAt: 2,
    emoji: "🌱",
    color: {
      badge: "border-slate-600 bg-slate-800/60 text-slate-300",
      glow:  "from-slate-400/10 via-slate-400/3 to-transparent",
      bar:   "bg-slate-400",
      icon:  "text-slate-300",
      ring:  "border-slate-600",
    },
  },
  {
    id: "systems-thinker",
    label: "Systems Thinker",
    tagline: "You see feedback loops, not just events",
    description:
      "You've started connecting causes to effects across time. Most people never get here.",
    minPassed: 2,
    nextAt: 7,
    emoji: "🔁",
    color: {
      badge: "border-cyan-500/50 bg-cyan-900/30 text-cyan-200",
      glow:  "from-cyan-400/14 via-cyan-400/4 to-transparent",
      bar:   "bg-cyan-400",
      icon:  "text-cyan-300",
      ring:  "border-cyan-500/50",
    },
  },
  {
    id: "scenario-designer",
    label: "Scenario Designer",
    tagline: "You can model change, not just describe it",
    description:
      "You understand leverage points, policy tradeoffs, and why well-intentioned interventions often backfire.",
    minPassed: 7,
    nextAt: 15,
    emoji: "⚙️",
    color: {
      badge: "border-violet-500/50 bg-violet-900/30 text-violet-200",
      glow:  "from-violet-400/14 via-violet-400/4 to-transparent",
      bar:   "bg-violet-400",
      icon:  "text-violet-300",
      ring:  "border-violet-500/50",
    },
  },
  {
    id: "civic-architect",
    label: "Civic Architect",
    tagline: "You design systems, not just react to them",
    description:
      "You've built a mental model of how power, money, and information interact — and you know where the real levers are.",
    minPassed: 15,
    nextAt: undefined,
    emoji: "🏛️",
    color: {
      badge: "border-amber-500/50 bg-amber-900/30 text-amber-200",
      glow:  "from-amber-400/14 via-amber-400/4 to-transparent",
      bar:   "bg-amber-400",
      icon:  "text-amber-300",
      ring:  "border-amber-500/50",
    },
  },
];

export function getLevelForPassed(passed: number): ProgressLevel {
  // Walk backwards — return the highest level the user qualifies for
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (passed >= LEVELS[i].minPassed) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getLevelProgress(passed: number): {
  level: ProgressLevel;
  pct: number;        // 0–100 within current level range
  remaining: number;  // quizzes until next level (0 if max)
} {
  const level = getLevelForPassed(passed);
  if (!level.nextAt) {
    return { level, pct: 100, remaining: 0 };
  }
  const range = level.nextAt - level.minPassed;
  const within = passed - level.minPassed;
  const pct = Math.min(100, Math.round((within / range) * 100));
  const remaining = level.nextAt - passed;
  return { level, pct, remaining };
}
