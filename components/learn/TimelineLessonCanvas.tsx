"use client";

import Image from "next/image";
import Link from "next/link";
import { type PointerEvent as ReactPointerEvent, type ReactNode, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpenText,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Globe2,
  Landmark,
  MessageSquare,
  Network,
  Percent,
  PiggyBank,
  Play,
  RefreshCcw,
  Scale,
  TrendingDown,
  TrendingUp,
  WalletCards,
  X,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { MiniLesson } from "@/components/learn/MiniLesson";
import { LearningTimeline } from "@/components/learn/LearningTimeline";
import { LessonSectionHeader } from "@/components/learn/LessonSectionHeader";
import { Button } from "@/components/ui/button";
import type {
  LearningArticleBlock,
  LearningArticleChart,
  LearningArticleDocument,
  LearningArticleSource,
} from "@/lib/learn/content";
import type {
  LearningEvidenceLink,
  LearningModule,
  MiniLessonConfig,
  ModuleProposal,
  ResolvedLearningModule,
} from "@/lib/learn/modules";
import type { LearningTrack } from "@/lib/tracks/config";
import { cn, withQuery } from "@/lib/utils";

import {
  buildMechanismSteps,
  extractFirstSentence,
  getExpectedObservations,
  getLessonTakeaway,
  lessonAccentClasses,
} from "@/components/learn/lesson-theme";

const TRACK_RELATED_LABS: Record<string, { href: string; label: string }> = {
  economy: { href: "/simulator/macro-economy", label: "Run a simulation" },
  "politics-and-democracy": { href: "/simulator/political-talent", label: "Open governance lab" },
  "cities-and-ecology": { href: "/simulator/world3", label: "Open World3" },
  "media-and-information": { href: "/simulator/social-movements", label: "Open movement lab" },
};

const US_MONEY_TIMELINE_CHART = [
  { confidence: 72, reserve: 100, stress: 18, year: "1971" },
  { confidence: 76, reserve: 96, stress: 28, year: "1980" },
  { confidence: 82, reserve: 91, stress: 40, year: "1990" },
  { confidence: 90, reserve: 86, stress: 58, year: "2000" },
  { confidence: 101, reserve: 80, stress: 82, year: "2010" },
  { confidence: 110, reserve: 71, stress: 108, year: "2020" },
  { confidence: 118, reserve: 62, stress: 132, year: "2024" },
];

const MECHANISM_STEP_DECOR = [
  { icon: Landmark, tone: "border-blue-200 bg-blue-50 text-blue-700" },
  { icon: TrendingUp, tone: "border-amber-200 bg-amber-50 text-amber-700" },
  { icon: AlertTriangle, tone: "border-rose-200 bg-rose-50 text-rose-700" },
  { icon: RefreshCcw, tone: "border-emerald-200 bg-emerald-50 text-emerald-700" },
] as const;

const WHY_CARD_STYLES = [
  {
    card: "border-emerald-100 bg-[linear-gradient(180deg,rgba(240,253,244,0.82),rgba(255,255,255,0.98))]",
    icon: "border-emerald-100 bg-emerald-50 text-emerald-600",
  },
  {
    card: "border-violet-100 bg-[linear-gradient(180deg,rgba(245,243,255,0.82),rgba(255,255,255,0.98))]",
    icon: "border-violet-100 bg-violet-50 text-violet-600",
  },
  {
    card: "border-blue-100 bg-[linear-gradient(180deg,rgba(239,246,255,0.82),rgba(255,255,255,0.98))]",
    icon: "border-blue-100 bg-blue-50 text-blue-600",
  },
] as const;

const COUNTER_ICONS = [MessageSquare, BarChart3, TrendingDown, RefreshCcw] as const;
const COUNTER_ICON_TONES = [
  "border-blue-100 bg-blue-50 text-blue-600",
  "border-slate-100 bg-slate-50 text-slate-600",
  "border-amber-100 bg-amber-50 text-amber-600",
  "border-emerald-100 bg-emerald-50 text-emerald-600",
] as const;

const ACTION_ICON_TONES = [
  "border-blue-100 bg-blue-50 text-blue-600",
  "border-emerald-100 bg-emerald-50 text-emerald-600",
  "border-slate-100 bg-slate-50 text-slate-600",
  "border-amber-100 bg-amber-50 text-amber-600",
] as const;

type FloatingPanelOffset = { x: number; y: number };

type FloatingPanelProps = {
  children: ReactNode;
  className?: string;
  closeable?: boolean;
  countLabel?: string;
  initialOffset?: FloatingPanelOffset;
  onClose?: () => void;
  title: string;
};

function DraggableFloatingPanel({
  children,
  className,
  closeable,
  countLabel,
  initialOffset = { x: 0, y: 0 },
  onClose,
  title,
}: FloatingPanelProps) {
  const [offset, setOffset] = useState(initialOffset);
  const [closed, setClosed] = useState(false);
  const dragStateRef = useRef<null | {
    originX: number; originY: number; startX: number; startY: number;
  }>(null);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    dragStateRef.current = {
      originX: offset.x, originY: offset.y,
      startX: event.clientX, startY: event.clientY,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current) return;
    setOffset({
      x: dragStateRef.current.originX + (event.clientX - dragStateRef.current.startX),
      y: dragStateRef.current.originY + (event.clientY - dragStateRef.current.startY),
    });
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragStateRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  if (closed) return null;

  return (
    <aside
      className={cn(
        "pointer-events-auto absolute z-20 w-[16.6rem] rounded-[1.25rem] border border-[rgba(28,36,48,0.08)] bg-white/98 px-4 py-4 shadow-[0_24px_46px_rgba(28,36,48,0.13)] ring-1 ring-white/70 backdrop-blur-[2px]",
        className,
      )}
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
    >
      <div
        className="flex cursor-grab touch-none items-start justify-between gap-3 select-none active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div>
          <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">Drag panel</p>
        </div>
        <div className="flex items-center gap-1.5 pt-0.5">
          {countLabel ? <span className="text-[11px] text-slate-400">{countLabel}</span> : null}
          {closeable ? (
            <button
              className="flex h-5 w-5 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              onClick={() => { setClosed(true); onClose?.(); }}
              type="button"
            >
              <X className="h-3 w-3" />
            </button>
          ) : null}
        </div>
      </div>
      <div className="mt-3">{children}</div>
    </aside>
  );
}

function getWhyMattersCards(module: ResolvedLearningModule) {
  if (module.slug === "how-the-us-rewrites-the-rules-of-money") {
    return [
      { body: "Rules determine what savers earn and how stable purchasing power is.", icon: PiggyBank, title: "Savings" },
      { body: "Monetary rules influence price stability and real incomes.", icon: TrendingUp, title: "Inflation" },
      { body: "The issuer of reserve currency gains privilege and geopolitical influence.", icon: Globe2, title: "Global power" },
    ];
  }
  return module.betterMetrics.slice(0, 3).map((metric, index) => ({
    body: extractFirstSentence(metric.description),
    icon: [PiggyBank, TrendingUp, Globe2][index],
    title: metric.label,
  }));
}

function getMechanismSteps(module: ResolvedLearningModule) {
  if (module.slug === "how-the-us-rewrites-the-rules-of-money") {
    return ["Monetary order", "Pressure builds", "Crisis", "Rewrite"];
  }
  return buildMechanismSteps(module.causalLoop.nodes, 4).map((step) => step.label);
}

function getMechanismPanels(module: ResolvedLearningModule) {
  return [
    {
      bullets: ["Persistent deficits financed by debt", "Rising asset bubbles and inequality", "Eroding confidence in the rules"],
      body: "Over time, every monetary order creates winners in the short term. Those benefits create imbalances that accumulate until a rewrite becomes unavoidable.",
      title: "Why does pressure build?",
    },
    {
      bullets: ["Early movers reposition before the official rewrite", "Debtors and states usually gain room to maneuver", "Creditors, savers, and latecomers absorb the reset"],
      body: extractFirstSentence(module.heroHighlights[2]) || "Every rewrite transfers wealth and power between groups even when it is framed as technical stabilization.",
      title: "Who gains from a rewrite?",
    },
    {
      bullets: ["Long stable periods make the order look natural", "Stress builds quietly inside reserves, trade, and debt", "The official announcement arrives after the system is already strained"],
      body: extractFirstSentence(module.systemBug.summary) || "The rules feel permanent right up to the moment they change.",
      title: "Why don't people see it coming?",
    },
    {
      bullets: ["Reserve share crosses a floor that triggers diversification", "Deficit financing exceeds creditor tolerance", "A political crisis removes the anchor that held the order together"],
      body: "When stress crosses a threshold, leaders rewrite the rules to restore stability — and redistribute power in the process.",
      title: "When stress crosses the threshold",
    },
  ];
}

function getEvidenceNotes(module: ResolvedLearningModule) {
  return [
    {
      body: "If the explanation is right, reserve dominance should decline over time while systemic stress rises and confidence in the old order erodes.",
      title: "What would we expect to observe?",
    },
    {
      body: extractFirstSentence(module.systemBug.summary) || "The claim is that monetary systems redistribute wealth and power whenever the rules are rewritten.",
      title: "What is the core claim?",
    },
    {
      body: "Watch the structure beneath inflation headlines: who writes the rules, who absorbs the pressure, and who gets the windfall when the system resets.",
      title: "Why this matters",
    },
  ];
}

function getExampleTimelineMatches(
  example: ResolvedLearningModule["realWorldExamples"][number],
  timeline?: ResolvedLearningModule["timeline"],
) {
  if (!timeline) return [];
  return timeline.events.filter((event) => example.title.includes(event.timeLabel));
}

function getChartBlock(article?: LearningArticleDocument | null) {
  return article?.blocks.find(
    (block): block is Extract<LearningArticleBlock, { type: "charts" }> => block.type === "charts",
  );
}

function getSourceItems(article?: LearningArticleDocument | null, evidenceLinks?: LearningEvidenceLink[]) {
  const sourceBlock = article?.blocks.find(
    (block): block is Extract<LearningArticleBlock, { type: "sources" }> => block.type === "sources",
  );
  if (sourceBlock?.items?.length) return sourceBlock.items;
  return evidenceLinks ?? [];
}

function renderSourceCard(item: LearningArticleSource | LearningEvidenceLink) {
  const title = "title" in item ? item.title : "";
  const kicker = "label" in item ? item.label : item.source;
  const note = "note" in item ? item.note : "";
  return (
    <a
      className="rounded-[1.05rem] border border-[rgba(28,36,48,0.08)] bg-white px-3 py-3 transition hover:border-[rgba(28,36,48,0.16)]"
      href={item.url}
      key={`${item.url}-${title}`}
      rel="noreferrer"
      target="_blank"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">{kicker}</p>
      <p className="mt-1 text-sm font-semibold leading-5 text-slate-900">{title}</p>
      {note ? <p className="mt-1 text-xs leading-5 text-slate-500">{note}</p> : null}
    </a>
  );
}

function TimelineEvidenceChart({ chart }: { chart?: LearningArticleChart }) {
  return (
    <div className="rounded-[1.3rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4 shadow-[0_10px_20px_rgba(28,36,48,0.03)]">
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-slate-900">
          {chart?.title ?? "Global monetary system indicators (relative to 1971)"}
        </h3>
        <p className="text-sm leading-6 text-slate-600">
          {chart?.note ?? "The dollar's reserve dominance has declined while system stress rises, and confidence in the old order is repeatedly tested."}
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-[11px] font-medium text-slate-500">
        <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#2563eb]" />Reserve dominance (USD)</span>
        <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#22c55e]" />Confidence (stablecoin-like)</span>
        <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#ef4444]" />System stress (index)</span>
      </div>
      <div className="mt-3 h-[16rem]">
        <ResponsiveContainer height="100%" width="100%">
          <LineChart data={US_MONEY_TIMELINE_CHART} margin={{ bottom: 4, left: -20, right: 8, top: 10 }}>
            <CartesianGrid stroke="rgba(148,163,184,0.14)" vertical={false} />
            <XAxis axisLine={false} dataKey="year" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} />
            <YAxis axisLine={false} domain={[0, 140]} tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} width={34} />
            <Tooltip contentStyle={{ background: "rgba(255,255,255,0.96)", border: "1px solid rgba(28,36,48,0.08)", borderRadius: "14px", boxShadow: "0 16px 32px rgba(28,36,48,0.08)" }} />
            <Line dataKey="reserve" dot={false} stroke="#2563eb" strokeWidth={2.5} type="monotone" />
            <Line dataKey="confidence" dot={false} stroke="#22c55e" strokeWidth={2.5} type="monotone" />
            <Line dataKey="stress" dot={false} stroke="#ef4444" strokeWidth={2.5} type="monotone" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
        <p>Sources: IMF COFER, BIS, World Bank, GFSR</p>
        <span className="font-medium text-primary">View full data</span>
      </div>
    </div>
  );
}

// ── Metric status helpers ─────────────────────────────────────────────────────
const METRIC_DISPLAY_ICONS = [Scale, Landmark, Percent] as const;

function getMetricStatus(fill: number, tone: string): { color: string; label: string } {
  const toneMap: Record<string, { high: string; highL: string; mid: string; midL: string; low: string; lowL: string }> = {
    rose:    { high: "text-rose-600",    highL: "High",     mid: "text-amber-600", midL: "Moderate", low: "text-emerald-600", lowL: "Low" },
    emerald: { high: "text-rose-600",    highL: "Rising",   mid: "text-amber-600", midL: "Moderate", low: "text-slate-500",   lowL: "Falling" },
    cyan:    { high: "text-emerald-600", highL: "High",     mid: "text-amber-600", midL: "Moderate", low: "text-rose-600",    lowL: "Low" },
    amber:   { high: "text-emerald-600", highL: "High",     mid: "text-amber-600", midL: "Moderate", low: "text-rose-600",    lowL: "Low" },
  };
  const cfg = toneMap[tone] ?? toneMap.cyan;
  if (fill > 65) return { color: cfg.high, label: cfg.highL };
  if (fill > 35) return { color: cfg.mid, label: cfg.midL };
  return { color: cfg.low, label: cfg.lowL };
}

function formatMetricDisplay(value: number, suffix: string | undefined): string {
  if (!suffix) return String(Math.round(value));
  if (suffix === "%") return `${Math.round(value)}%`;
  if (suffix === " countries") return String(Math.round(value));
  if (suffix.includes("GDP")) return `${value.toFixed(1)}%`;
  return `${Math.round(value * 10) / 10}${suffix}`;
}

// ── Custom interactive exploration layout (matches mockup) ─────────────────
function TimelineInteractiveExploration({
  accent,
  lesson,
}: {
  accent: keyof typeof lessonAccentClasses;
  lesson: MiniLessonConfig;
}) {
  const [sliderValue, setSliderValue] = useState(lesson.defaultValue);
  const accentColorMap: Record<string, string> = {
    amber: "#D4A84F", cyan: "#3B82F6", emerald: "#4CAF50", rose: "#C46A6A",
  };
  const accentColor = accentColorMap[accent] ?? "#3B82F6";

  const computedMetrics = lesson.metrics.map((metric) => {
    const value = Math.max(metric.min, Math.min(metric.max, metric.base + metric.slope * sliderValue));
    const fill = ((value - metric.min) / (metric.max - metric.min || 1)) * 100;
    return { ...metric, computedValue: value, fill };
  });

  const sublabelMap: Record<string, string> = {
    "sanction-reach": "out of ~195",
    "deficit-capacity": "of GDP",
    "alt-reserve": "of reserves",
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-5 sm:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)]">
        {/* Left: big number + slider */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-medium text-slate-700">{lesson.sliderLabel}</p>
            <CircleHelp className="h-3.5 w-3.5 flex-none text-slate-400" />
          </div>
          <p className="font-display text-[3.6rem] font-bold leading-none tracking-tight text-slate-900">
            {sliderValue}<span className="text-[2rem] font-semibold">{lesson.unit ?? ""}</span>
          </p>
          <input
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[rgba(28,36,48,0.10)] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(28,36,48,0.18)] [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-[rgba(28,36,48,0.15)]"
            max={lesson.valueMax}
            min={lesson.valueMin}
            onChange={(e) => setSliderValue(Number(e.target.value))}
            step={lesson.step}
            style={{ accentColor }}
            type="range"
            value={sliderValue}
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>{lesson.valueMin}{lesson.unit ?? ""}</span>
            <span>{lesson.valueMax}{lesson.unit ?? ""}</span>
          </div>
        </div>

        {/* Right: 3 metric output cards */}
        <p className="sr-only">Resulting scenario (illustrative)</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {computedMetrics.map((metric, index) => {
            const Icon = METRIC_DISPLAY_ICONS[index % METRIC_DISPLAY_ICONS.length];
            const status = getMetricStatus(metric.fill, metric.tone);
            const sublabel = sublabelMap[metric.key] ?? metric.suffix ?? "";
            return (
              <article
                className="flex flex-col gap-2 rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(250,249,246,0.7)] px-4 py-4"
                key={metric.key}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(28,36,48,0.08)] bg-white text-slate-500">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-xs font-medium leading-5 text-slate-500">{metric.label}</p>
                <p className="font-display text-[1.9rem] font-bold leading-none tracking-tight text-slate-900">
                  {formatMetricDisplay(metric.computedValue, metric.suffix)}
                </p>
                {sublabel ? <p className="text-xs text-slate-400">{sublabel}</p> : null}
                <p className={cn("text-xs font-semibold uppercase tracking-[0.14em]", status.color)}>
                  {status.label}
                </p>
              </article>
            );
          })}
        </div>
      </div>
      <p className="text-xs text-slate-400">
        Model for learning only. Not financial advice.{" "}
        <span className="cursor-pointer underline-offset-2 hover:underline">See assumptions</span>
      </p>
    </div>
  );
}

function CollapsedProposals({ proposals }: { proposals: ModuleProposal[] }) {
  return (
    <details className="rounded-[1.5rem] border border-[rgba(28,36,48,0.08)] bg-white/84 px-5 py-5" id="what-could-change">
      <summary className="cursor-pointer list-none">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">What could change this?</p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">Proven and emerging reforms</h3>
          </div>
          <span className="text-sm font-medium text-primary">Open proposals</span>
        </div>
      </summary>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {proposals.map((proposal) => (
          <article className="rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(250,249,246,0.92)] px-4 py-4" key={proposal.title}>
            <h4 className="text-sm font-semibold leading-6 text-slate-900">{proposal.title}</h4>
            <p className="mt-1 text-sm leading-6 text-slate-600">{proposal.summary}</p>
          </article>
        ))}
      </div>
    </details>
  );
}

export function TimelineLessonCanvas({
  article,
  currentTrack,
  heroImageSrc,
  module,
  nextModule,
  quizQuestionCount,
  supportImageSrc,
}: {
  article?: LearningArticleDocument | null;
  currentTrack?: LearningTrack | null;
  heroImageSrc: string;
  module: ResolvedLearningModule;
  nextModule?: LearningModule | null;
  quizQuestionCount?: number;
  supportImageSrc: string;
}) {
  const accent = lessonAccentClasses[module.accent];
  const whyCards = getWhyMattersCards(module);
  const mechanismSteps = getMechanismSteps(module);
  const mechanismPanels = getMechanismPanels(module);
  const evidenceNotes = getEvidenceNotes(module);
  const expectedObservations = getExpectedObservations(module);
  const chartBlock = getChartBlock(article);
  const sourceItems = getSourceItems(article, module.evidenceLinks).slice(0, 4);
  const [activeMechanismPanel, setActiveMechanismPanel] = useState(0);
  const [activeEvidenceNote, setActiveEvidenceNote] = useState(0);
  const [activeRealWorldExample, setActiveRealWorldExample] = useState<number | null>(0);
  const evidencePanels = useMemo(() => evidenceNotes, [evidenceNotes]);

  const discussionHref = withQuery("/discussions", { module: module.slug, prompt: module.discussionPrompt });
  const simulatorBase = module.simulatorSlug
    ? `/simulator/${module.simulatorSlug}`
    : TRACK_RELATED_LABS[currentTrack?.id ?? ""]?.href ?? "/simulator";
  const simulationHref = withQuery(simulatorBase, { focus: module.simulationPrompt, module: module.slug });
  const continueHref = nextModule ? `/learn/${nextModule.slug}` : "/learn?view=tracks";
  const quizHref = `/quiz/${module.slug}`;

  const hasInteractiveMiniLesson =
    module.miniLesson && !("conclusion" in module.miniLesson) && "metrics" in module.miniLesson;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 2xl:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)]">
        {/* Left column: Why this matters + Evidence */}
        <div className="space-y-4">
          <section className="rounded-[1.75rem] border border-[rgba(28,36,48,0.08)] bg-white px-5 py-5 shadow-[0_16px_32px_rgba(28,36,48,0.045)]" id="why-this-matters">
            <LessonSectionHeader
              accent={module.accent}
              compact
              id="why-this-matters-heading"
              index={2}
              subtitle="The ordinary stakes before we get into the history and structure."
              title="Why this matters"
            />
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {whyCards.map((card, index) => {
                const Icon = card.icon;
                const tones = WHY_CARD_STYLES[index % WHY_CARD_STYLES.length];
                return (
                  <article
                    className={cn(
                      "rounded-[1.2rem] border px-4 py-4 shadow-[0_6px_18px_rgba(28,36,48,0.02)]",
                      tones.card,
                    )}
                    key={card.title}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn("flex h-10 w-10 flex-none items-center justify-center rounded-[0.85rem] border", tones.icon)}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold text-slate-900">{card.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{card.body}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="relative rounded-[1.75rem] border border-[rgba(28,36,48,0.08)] bg-white px-5 py-5 shadow-[0_16px_32px_rgba(28,36,48,0.045)]" id="evidence">
            <LessonSectionHeader
              accent={module.accent}
              compact
              id="evidence-heading"
              index={4}
              subtitle="What the data shows across monetary regimes."
              title="Evidence"
            />

            <div className="mt-5 space-y-4">
              <TimelineEvidenceChart chart={chartBlock?.items?.[0]} />

              <div className="grid gap-4 xl:grid-cols-[12.25rem_minmax(0,1fr)]">
                <div className="space-y-2">
                  <button
                    className="w-full rounded-[1.1rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.72)] px-3 py-3 text-left transition hover:border-[rgba(28,36,48,0.14)]"
                    onClick={() => setActiveEvidenceNote(Math.min(1, evidencePanels.length - 1))}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Claim</p>
                        <p className="mt-1 text-sm leading-6 text-slate-700">{extractFirstSentence(module.systemBug.summary)}</p>
                      </div>
                      <ArrowRight className="mt-1 h-3.5 w-3.5 flex-none text-slate-400" />
                    </div>
                  </button>
                  {evidencePanels.map((note, index) => (
                    <button
                      className={cn(
                        "flex w-full items-center justify-between rounded-[1rem] border px-3 py-3 text-left text-xs font-medium transition",
                        activeEvidenceNote === index
                          ? cn(accent.chip, "text-slate-900 shadow-[0_10px_20px_rgba(28,36,48,0.05)]")
                          : "border-[rgba(28,36,48,0.08)] bg-white text-slate-600 hover:border-[rgba(28,36,48,0.14)] hover:text-slate-900",
                      )}
                      key={note.title}
                      onClick={() => setActiveEvidenceNote(index)}
                      type="button"
                    >
                      <span className="max-w-[8rem] leading-5">{note.title}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                  ))}
                </div>

                <div className="grid gap-3 md:grid-cols-2">{sourceItems.map((item) => renderSourceCard(item))}</div>
              </div>
            </div>

            <DraggableFloatingPanel
              className="bottom-[-2.15rem] left-[-1.55rem]"
              closeable
              countLabel={`${activeEvidenceNote + 1} of ${evidencePanels.length}`}
              initialOffset={{ x: 0, y: 0 }}
              title={evidencePanels[activeEvidenceNote].title}
            >
              <p className="text-sm leading-6 text-slate-600">{evidencePanels[activeEvidenceNote].body}</p>
              {activeEvidenceNote === 0 ? (
                <ul className="mt-3 space-y-1.5">
                  {expectedObservations.map((observation) => (
                    <li className="text-sm leading-6 text-slate-600" key={observation}>
                      {"•"} {observation}
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="mt-4 flex items-center justify-end gap-2 border-t border-[rgba(28,36,48,0.08)] pt-3">
                <button
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(28,36,48,0.08)] bg-white transition hover:border-[rgba(28,36,48,0.16)] hover:text-slate-800"
                  onClick={() => setActiveEvidenceNote((activeEvidenceNote - 1 + evidencePanels.length) % evidencePanels.length)}
                  type="button"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(28,36,48,0.08)] bg-white transition hover:border-[rgba(28,36,48,0.16)] hover:text-slate-800"
                  onClick={() => setActiveEvidenceNote((activeEvidenceNote + 1) % evidencePanels.length)}
                  type="button"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </DraggableFloatingPanel>
          </section>
        </div>

        {/* Right column: Core mechanism */}
        <section className="relative rounded-[1.75rem] border border-[rgba(28,36,48,0.08)] bg-white px-5 py-5 shadow-[0_16px_32px_rgba(28,36,48,0.045)]" id="core-mechanism">
          <div className="space-y-4">
            <div className="grid gap-4 xl:grid-cols-[minmax(15rem,0.28fr)_minmax(0,0.72fr)]">
              <div className="space-y-4">
                <LessonSectionHeader
                  accent={module.accent}
                  compact
                  id="core-mechanism-heading"
                  index={3}
                  subtitle="Monetary systems follow a pattern: rules are created to solve a crisis, then eventually rewritten when pressures exceed the old order."
                  title="Core mechanism"
                />
                <p className="text-sm leading-6 text-slate-600">
                  {extractFirstSentence(module.simpleExplanation[2]) || extractFirstSentence(module.simpleExplanation[1])}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 rounded-[1.25rem] border border-[rgba(28,36,48,0.07)] bg-[rgba(249,248,244,0.94)] px-3 py-3">
                  {mechanismSteps.map((step, index) => {
                    const decor = MECHANISM_STEP_DECOR[index % MECHANISM_STEP_DECOR.length];
                    const StepIcon = decor.icon;
                    return (
                      <div className="flex items-center gap-2" key={step}>
                        <span className={cn("inline-flex items-center gap-2 rounded-[1rem] border px-3 py-2 text-xs font-semibold shadow-[0_6px_14px_rgba(28,36,48,0.03)]", decor.tone)}>
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-current/20 bg-white/70">
                            <StepIcon className="h-3.5 w-3.5" />
                          </span>
                          {step}
                        </span>
                        {index < mechanismSteps.length - 1 ? <ChevronRight className="h-4 w-4 text-slate-400" /> : null}
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap gap-2">
                  {mechanismPanels.map((panel, index) => (
                    <button
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition",
                        activeMechanismPanel === index
                          ? cn(accent.chip, "text-slate-900 shadow-[0_10px_20px_rgba(28,36,48,0.05)]")
                          : "border-[rgba(28,36,48,0.08)] bg-white text-slate-600 hover:border-[rgba(28,36,48,0.14)] hover:text-slate-900",
                      )}
                      key={panel.title}
                      onClick={() => setActiveMechanismPanel(index)}
                      type="button"
                    >
                      {panel.title}
                      {activeMechanismPanel === index
                        ? <ChevronDown className="h-3.5 w-3.5 flex-none" />
                        : <CircleHelp className="h-3.5 w-3.5 flex-none text-slate-400" />
                      }
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {module.timeline ? <LearningTimeline accent={module.accent} dense timeline={module.timeline} /> : null}

            <div className="space-y-3" id="real-world-examples">
              <div className="flex items-center gap-3">
                <span className={cn("inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold", accent.step)}>5</span>
                <p className="text-base font-semibold text-slate-900">Real world examples</p>
              </div>
              <div className="grid gap-3 lg:grid-cols-3">
                {module.realWorldExamples.map((example, index) => (
                  <button
                    className={cn(
                      "overflow-hidden rounded-[1.15rem] border bg-white text-left shadow-[0_10px_20px_rgba(28,36,48,0.04)] transition hover:border-[rgba(28,36,48,0.16)]",
                      activeRealWorldExample === index
                        ? "border-[rgba(59,130,246,0.24)] ring-1 ring-[rgba(59,130,246,0.14)]"
                        : "border-[rgba(28,36,48,0.08)]",
                    )}
                    key={example.title}
                    onClick={() => setActiveRealWorldExample(activeRealWorldExample === index ? null : index)}
                    type="button"
                  >
                    <div className="relative h-24">
                      <Image
                        alt={example.title}
                        className="object-cover"
                        fill
                        sizes="(min-width: 1280px) 220px, 100vw"
                        src={index === 1 ? heroImageSrc : supportImageSrc}
                      />
                    </div>
                    <div className="space-y-2 px-3 py-2.5">
                      <div className="flex items-start justify-between gap-3">
                        <p className={cn("inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]", accent.chip)}>
                          {index === 0 ? "Wealth transfer" : index === 1 ? "System reset" : "Emerging shift"}
                        </p>
                        <ChevronDown
                          className={cn(
                            "mt-0.5 h-4 w-4 flex-none text-slate-400 transition",
                            activeRealWorldExample === index ? "rotate-180 text-slate-700" : "",
                          )}
                        />
                      </div>
                      <h4 className="text-[11.5px] font-semibold leading-5 text-slate-900">{example.title}</h4>
                      <p className="text-xs leading-5 text-slate-500">{extractFirstSentence(example.insight)}</p>
                    </div>
                  </button>
                ))}
              </div>

              {activeRealWorldExample !== null ? (
                <div className="rounded-[1.25rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(250,249,246,0.72)] px-4 py-4 shadow-[0_10px_20px_rgba(28,36,48,0.03)]">
                  {(() => {
                    const example = module.realWorldExamples[activeRealWorldExample];
                    const relatedEvents = getExampleTimelineMatches(example, module.timeline);
                    return (
                      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)]">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className={cn("inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]", accent.chip)}>
                                Expanded case study
                              </p>
                              <h4 className="mt-2 text-base font-semibold text-slate-900">{example.title}</h4>
                            </div>
                            <button
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(28,36,48,0.08)] bg-white text-slate-400 transition hover:border-[rgba(28,36,48,0.16)] hover:text-slate-700"
                              onClick={() => setActiveRealWorldExample(null)}
                              type="button"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="grid gap-3 md:grid-cols-2">
                            <div className="rounded-[1rem] border border-[rgba(28,36,48,0.08)] bg-white px-3.5 py-3.5">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">What happened</p>
                              <p className="mt-2 text-sm leading-6 text-slate-700">{example.insight}</p>
                            </div>
                            <div className="rounded-[1rem] border border-[rgba(28,36,48,0.08)] bg-white px-3.5 py-3.5">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Result</p>
                              <p className="mt-2 text-sm leading-6 text-slate-700">{example.outcome}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="rounded-[1rem] border border-[rgba(28,36,48,0.08)] bg-white px-3.5 py-3.5">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Reboot points involved</p>
                            <div className="mt-3 space-y-3">
                              {relatedEvents.length ? (
                                relatedEvents.map((event) => (
                                  <div className="rounded-[0.95rem] bg-[rgba(246,244,238,0.74)] px-3 py-3" key={`${example.title}-${event.timeLabel}-${event.title}`}>
                                    <div className="flex items-center gap-2">
                                      <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold", accent.chip)}>
                                        {event.timeLabel}
                                      </span>
                                      <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                                    </div>
                                    <p className="mt-2 text-xs leading-5 text-slate-600">{event.turningPoint}</p>
                                    <ul className="mt-2 space-y-1.5">
                                      {event.characteristics.slice(0, 3).map((characteristic) => (
                                        <li className="text-xs leading-5 text-slate-500" key={characteristic}>
                                          {"•"} {characteristic}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm leading-6 text-slate-600">
                                  This case points to a broader monetary rewrite rather than a single dated event.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : null}
            </div>
          </div>

          <DraggableFloatingPanel
            className="right-[-2.3rem] top-[4.9rem]"
            closeable
            countLabel={`${activeMechanismPanel + 1} of ${mechanismPanels.length}`}
            initialOffset={{ x: 0, y: 0 }}
            title={mechanismPanels[activeMechanismPanel].title}
          >
            <p className="mt-3 text-sm leading-6 text-slate-600">{mechanismPanels[activeMechanismPanel].body}</p>
            <ul className="mt-4 space-y-2">
              {mechanismPanels[activeMechanismPanel].bullets.map((bullet) => (
                <li className="flex items-start gap-2 text-sm leading-6 text-slate-600" key={bullet}>
                  <span className={cn("mt-1.5 inline-flex h-4 w-4 flex-none items-center justify-center rounded-full border", accent.icon)}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between border-t border-[rgba(28,36,48,0.08)] pt-3 text-sm text-slate-500">
              <span>Flip through prompts</span>
              <div className="flex items-center gap-2">
                <button
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(28,36,48,0.08)] bg-white transition hover:border-[rgba(28,36,48,0.16)] hover:text-slate-800"
                  onClick={() => setActiveMechanismPanel((activeMechanismPanel - 1 + mechanismPanels.length) % mechanismPanels.length)}
                  type="button"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(28,36,48,0.08)] bg-white transition hover:border-[rgba(28,36,48,0.16)] hover:text-slate-800"
                  onClick={() => setActiveMechanismPanel((activeMechanismPanel + 1) % mechanismPanels.length)}
                  type="button"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </DraggableFloatingPanel>
        </section>
      </div>

      {/* Bottom row: Interactive exploration / Counterarguments / Choose next step */}
      <div className="grid items-start gap-4 2xl:grid-cols-[minmax(0,0.43fr)_minmax(0,0.25fr)_minmax(0,0.32fr)]">
        <section className="rounded-[1.75rem] border border-[rgba(28,36,48,0.08)] bg-white px-5 py-5 shadow-[0_16px_32px_rgba(28,36,48,0.045)]" id="interactive-exploration">
          <LessonSectionHeader
            accent={module.accent}
            compact
            id="interactive-exploration-heading"
            index={6}
            subtitle="Adjust the dollar's role in global reserves to see possible outcomes."
            title="Interactive exploration"
          />
          <div className="mt-5">
            {hasInteractiveMiniLesson ? (
              <TimelineInteractiveExploration
                accent={module.accent}
                lesson={module.miniLesson as MiniLessonConfig}
              />
            ) : (
              <MiniLesson accent={module.accent} compact lesson={module.miniLesson} />
            )}
          </div>
          <div className={cn("mt-5 rounded-[1.1rem] border px-4 py-4", accent.panel, accent.line)}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Key lesson</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {extractFirstSentence(module.heroHighlights[1]) || extractFirstSentence(module.systemBug.summary)}
            </p>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-[rgba(28,36,48,0.08)] bg-white px-5 py-5 shadow-[0_16px_32px_rgba(28,36,48,0.045)]" id="counterarguments">
          <LessonSectionHeader
            accent={module.accent}
            compact
            id="counterarguments-heading"
            index={7}
            subtitle="A useful lesson should face its strongest objections directly."
            title="Counterarguments"
          />
          <div className="mt-4 divide-y divide-[rgba(28,36,48,0.07)] overflow-hidden rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-white">
            {module.counterArguments.map((argument, index) => {
              const CounterIcon = COUNTER_ICONS[index % COUNTER_ICONS.length];
              const iconTone = COUNTER_ICON_TONES[index % COUNTER_ICON_TONES.length];
              return (
                <details className="group" key={argument.title} open={index === 0}>
                  <summary className="flex cursor-pointer list-none items-start gap-3 px-4 py-4">
                    <div className={cn("flex h-8 w-8 flex-none items-center justify-center rounded-[0.6rem] border", iconTone)}>
                      <CounterIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold leading-5 text-slate-900">{argument.title}</p>
                    </div>
                    <ChevronDown className="mt-0.5 h-4 w-4 flex-none text-slate-400 transition group-open:rotate-180" />
                  </summary>
                  <div className="space-y-3 px-4 pb-4 pl-[3.5rem]">
                    <div className="rounded-[1rem] bg-[rgba(246,244,238,0.78)] px-3 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Claim</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{argument.point}</p>
                    </div>
                    <div className="rounded-[1rem] bg-[rgba(246,244,238,0.78)] px-3 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Response</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{argument.response}</p>
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-slate-400">Open each to see the strongest case and our response.</p>
        </section>

        <section className="rounded-[1.75rem] border border-[rgba(28,36,48,0.08)] bg-white px-5 py-5 shadow-[0_16px_32px_rgba(28,36,48,0.045)]" id="next-actions">
          <div className="flex items-start justify-between gap-4">
            <LessonSectionHeader
              accent={module.accent}
              compact
              id="next-actions-heading"
              index={8}
              subtitle="Choose your next step."
              title="Choose your next step"
            />
            {quizQuestionCount ? (
              <Button asChild className="h-auto rounded-full px-4 py-2.5">
                <Link href={quizHref}>Quiz <ClipboardCheck className="h-4 w-4" /></Link>
              </Button>
            ) : null}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              {
                cta: "Go to discussions →",
                description: "Join a conversation with peers and share perspectives.",
                href: discussionHref,
                icon: MessageSquare,
                iconTone: ACTION_ICON_TONES[0],
                label: "Discuss this idea",
              },
              {
                cta: "Open simulator →",
                description: "Test scenarios and explore long-term impacts.",
                href: simulationHref,
                icon: Network,
                iconTone: ACTION_ICON_TONES[1],
                label: "Run a simulation",
              },
              {
                cta: "Open governance lab →",
                description: "See proposals and reforms that could reshape the system.",
                href: module.proposals?.length ? "#what-could-change" : "/governance",
                icon: Landmark,
                iconTone: ACTION_ICON_TONES[2],
                label: "Explore reforms",
              },
              {
                cta: "Go to study library →",
                description: "Find readings, videos, and data to go deeper.",
                href: "/study",
                icon: BookOpenText,
                iconTone: ACTION_ICON_TONES[3],
                label: "Study more",
              },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  className="flex min-h-[11rem] flex-col rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4 transition hover:border-[rgba(28,36,48,0.16)]"
                  href={action.href}
                  key={action.label}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn("flex h-9 w-9 flex-none items-center justify-center rounded-full border", action.iconTone)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{action.label}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{action.description}</p>
                    </div>
                  </div>
                  <p className="mt-auto pt-3 text-sm font-semibold text-primary">{action.cta}</p>
                </Link>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between rounded-[1rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-3">
            <p className="text-sm text-slate-600">
              {nextModule ? `Continue with ${nextModule.title}.` : "Open the broader track and keep exploring from here."}
            </p>
            <Link className="inline-flex items-center gap-2 text-sm font-semibold text-primary" href={continueHref}>
              {nextModule ? "Continue the track" : "Open track explorer"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>

      {module.proposals?.length ? <CollapsedProposals proposals={module.proposals} /> : null}
    </div>
  );
}
