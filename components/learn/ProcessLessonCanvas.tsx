import Image from "next/image";
import {
  AlertTriangle,
  Building2,
  ChevronRight,
  Clock,
  Gavel,
  GitBranch,
  Landmark,
  Network,
  Scale,
  ScrollText,
  ShieldCheck,
  Users2,
  Vote,
  Zap,
} from "lucide-react";

import { CausalLoopDiagram } from "@/components/learn/CausalLoopDiagram";
import { LessonCaseStudies } from "@/components/learn/LessonCaseStudies";
import { LessonCounterarguments } from "@/components/learn/LessonCounterarguments";
import { LessonEvidence } from "@/components/learn/LessonEvidence";
import { LessonInteractive } from "@/components/learn/LessonInteractive";
import { LessonNextActions } from "@/components/learn/LessonNextActions";
import { LessonProposals } from "@/components/learn/LessonProposals";
import { LessonSectionHeader } from "@/components/learn/LessonSectionHeader";
import { extractFirstSentence, lessonAccentClasses } from "@/components/learn/lesson-theme";
import type { LearningArticleBlock, LearningArticleCard, LearningArticleDocument } from "@/lib/learn/content";
import type { LearningModule, ResolvedLearningModule } from "@/lib/learn/modules";
import type { LearningTrack } from "@/lib/tracks/config";
import { cn } from "@/lib/utils";

// ── Icon sets ──────────────────────────────────────────────────────────────────

const WHY_IT_MATTERS_ICONS = [ShieldCheck, Clock, AlertTriangle, Scale] as const;
const PROCESS_STAGE_ICONS = [ScrollText, Users2, Landmark, Gavel, ShieldCheck] as const;
const MECHANISM_ICONS = [GitBranch, Network, Scale, Zap, Clock, AlertTriangle] as const;

const ROLE_ICON_MAP = {
  commission: ScrollText,
  council: Landmark,
  court: Gavel,
  parliament: Users2,
  senate: Vote,
  state: Building2,
} as const;

// ── Article helpers ────────────────────────────────────────────────────────────

type ArticleSection = { blocks: LearningArticleBlock[]; heading?: string };

function getQuickMapCards(article?: LearningArticleDocument | null): LearningArticleCard[] {
  const cardsBlock = article?.blocks.find(
    (b): b is Extract<LearningArticleBlock, { type: "cards" }> => b.type === "cards",
  );
  return cardsBlock?.items ?? [];
}

function getArticleSections(article?: LearningArticleDocument | null): ArticleSection[] {
  if (!article) return [];
  const sections: ArticleSection[] = [];
  let current: ArticleSection = { blocks: [] };
  let skippedCards = false;
  for (const block of article.blocks) {
    if (!skippedCards && block.type === "cards") { skippedCards = true; continue; }
    if (block.type === "heading" && block.level === 2) {
      if (current.heading || current.blocks.length) sections.push(current);
      current = { blocks: [], heading: block.text };
      continue;
    }
    if (block.type === "sources") continue;
    current.blocks.push(block);
  }
  if (current.heading || current.blocks.length) sections.push(current);
  return sections;
}

function getParagraphs(blocks: LearningArticleBlock[]) {
  return blocks
    .filter((b): b is Extract<LearningArticleBlock, { type: "paragraph" }> => b.type === "paragraph")
    .map((b) => b.text);
}

function getLists(blocks: LearningArticleBlock[]) {
  return blocks
    .filter((b): b is Extract<LearningArticleBlock, { type: "list" }> => b.type === "list")
    .flatMap((b) => b.items);
}

function getCallouts(blocks: LearningArticleBlock[]) {
  return blocks
    .filter((b): b is Extract<LearningArticleBlock, { type: "callout" }> => b.type === "callout")
    .map((b) => b.text);
}

// ── Module-specific data ───────────────────────────────────────────────────────

function getProcessStages(module: ResolvedLearningModule): string[] {
  if (module.slug === "how-the-eu-makes-decisions") {
    return [
      "Commission proposes",
      "Parliament amends",
      "Council bargains",
      "Trilogue aligns",
      "Member states implement",
    ];
  }
  if (module.slug === "how-the-us-government-makes-decisions") {
    return [
      "House moves first",
      "Senate clears hurdles",
      "President signs or vetoes",
      "Agencies interpret",
      "Courts can reshape",
    ];
  }
  return module.causalLoop.nodes.slice(0, 5).map((n) => n.label);
}

function getRoleSnapshots(
  module: ResolvedLearningModule,
): Array<{ body: string; iconKey: keyof typeof ROLE_ICON_MAP; title: string }> {
  if (module.slug === "how-the-eu-makes-decisions") {
    return [
      {
        body: "Sets the formal agenda — only it can initiate most EU legislation.",
        iconKey: "commission",
        title: "Commission",
      },
      {
        body: "Directly elected chamber that amends, rejects, and bargains over the text.",
        iconKey: "parliament",
        title: "Parliament",
      },
      {
        body: "Represents member-state governments and can slow, reshape, or unblock adoption.",
        iconKey: "council",
        title: "Council",
      },
      {
        body: "Pushes issues upward when disagreement becomes too political for ordinary bargaining.",
        iconKey: "state",
        title: "European Council",
      },
    ];
  }
  return [
    {
      body: "Population-based chamber where bills begin and coalition discipline matters most.",
      iconKey: "parliament",
      title: "House",
    },
    {
      body: "Equal-state chamber where cloture is the procedural choke point for almost any major bill.",
      iconKey: "senate",
      title: "Senate",
    },
    {
      body: "Signs or vetoes legislation, then shapes implementation through agency direction.",
      iconKey: "commission",
      title: "Presidency",
    },
    {
      body: "Reviews how far statutes and executive actions can go — often the final veto point.",
      iconKey: "court",
      title: "Courts",
    },
  ];
}

// ── Process flow diagram ──────────────────────────────────────────────────────

function ProcessFlowDiagram({ module }: { module: ResolvedLearningModule }) {
  const isEU = module.slug === "how-the-eu-makes-decisions";
  const isUS = module.slug === "how-the-us-government-makes-decisions";
  const processStages = getProcessStages(module);

  if (isEU) {
    return (
      <svg aria-hidden className="w-full" viewBox="0 0 880 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="pf-arrow-eu" markerHeight="6" markerWidth="6" orient="auto" refX="5.5" refY="3" viewBox="0 0 6 6">
            <path d="M 0,0 L 6,3 L 0,6 Z" fill="#94a3b8" />
          </marker>
        </defs>
        {/* Parallel zone background */}
        <rect fill="rgba(241,245,249,0.55)" height="180" rx="10" width="148" x="185" y="10" />
        {/* Connector paths */}
        <g fill="none" markerEnd="url(#pf-arrow-eu)" stroke="#cbd5e1" strokeLinecap="round" strokeWidth="1.5">
          <path d="M 138,100 H 168 V 46 H 193" />
          <path d="M 168,100 V 154 H 193" />
          <path d="M 321,46 C 355,46 355,100 388,100" />
          <path d="M 321,154 C 355,154 355,100 388,100" />
          <path d="M 506,100 H 565" />
          <path d="M 671,100 H 728" />
        </g>
        {/* Fork junction dot */}
        <circle cx="168" cy="100" fill="#94a3b8" r="3.5" />
        {/* Edge labels */}
        <g fill="#94a3b8" fontFamily="system-ui,-apple-system,sans-serif" fontSize="9" textAnchor="middle">
          <text x="347" y="62">position</text>
          <text x="347" y="143">position</text>
          <text x="534" y="93">agreement</text>
          <text x="698" y="93">requires</text>
          <text fill="rgba(148,163,184,0.65)" fontStyle="italic" x="257" y="103">in parallel</text>
        </g>
        {/* Node 1: Commission */}
        <rect fill="white" height="48" rx="10" stroke="rgba(28,36,48,0.1)" strokeWidth="1" width="128" x="10" y="76" />
        <rect fill="#0f172a" height="16" rx="3.5" width="16" x="17" y="83" />
        <text fill="white" fontFamily="system-ui,-apple-system,sans-serif" fontSize="8" fontWeight="700" textAnchor="middle" x="25" y="95">1</text>
        <text fill="#0f172a" fontFamily="system-ui,-apple-system,sans-serif" fontSize="11" fontWeight="600" textAnchor="middle" x="74" y="97">Commission</text>
        <text fill="#64748b" fontFamily="system-ui,-apple-system,sans-serif" fontSize="9.5" textAnchor="middle" x="74" y="113">proposes</text>
        {/* Node 2: Parliament */}
        <rect fill="white" height="48" rx="10" stroke="rgba(28,36,48,0.1)" strokeWidth="1" width="128" x="193" y="22" />
        <rect fill="#0f172a" height="16" rx="3.5" width="16" x="200" y="29" />
        <text fill="white" fontFamily="system-ui,-apple-system,sans-serif" fontSize="8" fontWeight="700" textAnchor="middle" x="208" y="41">2</text>
        <text fill="#0f172a" fontFamily="system-ui,-apple-system,sans-serif" fontSize="11" fontWeight="600" textAnchor="middle" x="257" y="43">Parliament</text>
        <text fill="#64748b" fontFamily="system-ui,-apple-system,sans-serif" fontSize="9.5" textAnchor="middle" x="257" y="59">amends</text>
        {/* Node 3: Council */}
        <rect fill="white" height="48" rx="10" stroke="rgba(28,36,48,0.1)" strokeWidth="1" width="128" x="193" y="130" />
        <rect fill="#0f172a" height="16" rx="3.5" width="16" x="200" y="137" />
        <text fill="white" fontFamily="system-ui,-apple-system,sans-serif" fontSize="8" fontWeight="700" textAnchor="middle" x="208" y="149">3</text>
        <text fill="#0f172a" fontFamily="system-ui,-apple-system,sans-serif" fontSize="11" fontWeight="600" textAnchor="middle" x="257" y="151">Council</text>
        <text fill="#64748b" fontFamily="system-ui,-apple-system,sans-serif" fontSize="9.5" textAnchor="middle" x="257" y="167">bargains</text>
        {/* Node 4: Trilogue */}
        <rect fill="white" height="48" rx="10" stroke="rgba(28,36,48,0.1)" strokeWidth="1" width="118" x="388" y="76" />
        <rect fill="#0f172a" height="16" rx="3.5" width="16" x="395" y="83" />
        <text fill="white" fontFamily="system-ui,-apple-system,sans-serif" fontSize="8" fontWeight="700" textAnchor="middle" x="403" y="95">4</text>
        <text fill="#0f172a" fontFamily="system-ui,-apple-system,sans-serif" fontSize="11" fontWeight="600" textAnchor="middle" x="447" y="97">Trilogue</text>
        <text fill="#64748b" fontFamily="system-ui,-apple-system,sans-serif" fontSize="9.5" textAnchor="middle" x="447" y="113">aligns</text>
        {/* Node 5: EU Law */}
        <rect fill="white" height="48" rx="10" stroke="rgba(28,36,48,0.1)" strokeWidth="1" width="106" x="565" y="76" />
        <rect fill="#0f172a" height="16" rx="3.5" width="16" x="572" y="83" />
        <text fill="white" fontFamily="system-ui,-apple-system,sans-serif" fontSize="8" fontWeight="700" textAnchor="middle" x="580" y="95">5</text>
        <text fill="#0f172a" fontFamily="system-ui,-apple-system,sans-serif" fontSize="11" fontWeight="600" textAnchor="middle" x="618" y="97">EU Law</text>
        <text fill="#64748b" fontFamily="system-ui,-apple-system,sans-serif" fontSize="9.5" textAnchor="middle" x="618" y="113">adopted</text>
        {/* Node 6: Implementation */}
        <rect fill="white" height="48" rx="10" stroke="rgba(28,36,48,0.1)" strokeWidth="1" width="140" x="728" y="76" />
        <rect fill="#0f172a" height="16" rx="3.5" width="16" x="735" y="83" />
        <text fill="white" fontFamily="system-ui,-apple-system,sans-serif" fontSize="8" fontWeight="700" textAnchor="middle" x="743" y="95">6</text>
        <text fill="#0f172a" fontFamily="system-ui,-apple-system,sans-serif" fontSize="11" fontWeight="600" textAnchor="middle" x="798" y="97">Implementation</text>
        <text fill="#64748b" fontFamily="system-ui,-apple-system,sans-serif" fontSize="9.5" textAnchor="middle" x="798" y="113">national</text>
      </svg>
    );
  }

  if (isUS) {
    return (
      <svg aria-hidden className="w-full" viewBox="0 0 880 220" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="pf-arrow-us" markerHeight="6" markerWidth="6" orient="auto" refX="5.5" refY="3" viewBox="0 0 6 6">
            <path d="M 0,0 L 6,3 L 0,6 Z" fill="#94a3b8" />
          </marker>
          <marker id="pf-arrow-us-dash" markerHeight="6" markerWidth="6" orient="auto" refX="5.5" refY="3" viewBox="0 0 6 6">
            <path d="M 0,0 L 6,3 L 0,6 Z" fill="#cbd5e1" />
          </marker>
        </defs>
        {/* Connector paths */}
        <g fill="none" stroke="#cbd5e1" strokeLinecap="round" strokeWidth="1.5">
          <path d="M 120,85 H 168" markerEnd="url(#pf-arrow-us)" />
          <path d="M 288,85 H 340" markerEnd="url(#pf-arrow-us)" />
          <path d="M 470,85 H 528" markerEnd="url(#pf-arrow-us)" />
          <path d="M 652,85 H 706" markerEnd="url(#pf-arrow-us)" />
          <path d="M 405,110 V 148" markerEnd="url(#pf-arrow-us-dash)" strokeDasharray="5 3" />
        </g>
        {/* Edge labels */}
        <g fill="#94a3b8" fontFamily="system-ui,-apple-system,sans-serif" fontSize="9" textAnchor="middle">
          <text x="143" y="79">passes</text>
          <text x="313" y="79">enrolled</text>
          <text x="498" y="79">delegates</text>
          <text x="678" y="79">challenges</text>
          <text x="417" y="134">if vetoed</text>
        </g>
        {/* Node 1: House */}
        <rect fill="white" height="50" rx="10" stroke="rgba(28,36,48,0.1)" strokeWidth="1" width="110" x="10" y="60" />
        <rect fill="#0f172a" height="16" rx="3.5" width="16" x="17" y="67" />
        <text fill="white" fontFamily="system-ui,-apple-system,sans-serif" fontSize="8" fontWeight="700" textAnchor="middle" x="25" y="79">1</text>
        <text fill="#0f172a" fontFamily="system-ui,-apple-system,sans-serif" fontSize="11" fontWeight="600" textAnchor="middle" x="65" y="82">House</text>
        <text fill="#64748b" fontFamily="system-ui,-apple-system,sans-serif" fontSize="9.5" textAnchor="middle" x="65" y="98">bills begin</text>
        {/* Node 2: Senate */}
        <rect fill="white" height="50" rx="10" stroke="rgba(28,36,48,0.1)" strokeWidth="1" width="120" x="168" y="60" />
        <rect fill="#0f172a" height="16" rx="3.5" width="16" x="175" y="67" />
        <text fill="white" fontFamily="system-ui,-apple-system,sans-serif" fontSize="8" fontWeight="700" textAnchor="middle" x="183" y="79">2</text>
        <text fill="#0f172a" fontFamily="system-ui,-apple-system,sans-serif" fontSize="11" fontWeight="600" textAnchor="middle" x="228" y="82">Senate</text>
        <text fill="#64748b" fontFamily="system-ui,-apple-system,sans-serif" fontSize="9.5" textAnchor="middle" x="228" y="98">must also pass</text>
        {/* Node 3: President */}
        <rect fill="white" height="50" rx="10" stroke="rgba(28,36,48,0.1)" strokeWidth="1" width="130" x="340" y="60" />
        <rect fill="#0f172a" height="16" rx="3.5" width="16" x="347" y="67" />
        <text fill="white" fontFamily="system-ui,-apple-system,sans-serif" fontSize="8" fontWeight="700" textAnchor="middle" x="355" y="79">3</text>
        <text fill="#0f172a" fontFamily="system-ui,-apple-system,sans-serif" fontSize="11" fontWeight="600" textAnchor="middle" x="405" y="82">President</text>
        <text fill="#64748b" fontFamily="system-ui,-apple-system,sans-serif" fontSize="9.5" textAnchor="middle" x="405" y="98">signs or vetoes</text>
        {/* Node 4: Agencies */}
        <rect fill="white" height="50" rx="10" stroke="rgba(28,36,48,0.1)" strokeWidth="1" width="124" x="528" y="60" />
        <rect fill="#0f172a" height="16" rx="3.5" width="16" x="535" y="67" />
        <text fill="white" fontFamily="system-ui,-apple-system,sans-serif" fontSize="8" fontWeight="700" textAnchor="middle" x="543" y="79">4</text>
        <text fill="#0f172a" fontFamily="system-ui,-apple-system,sans-serif" fontSize="11" fontWeight="600" textAnchor="middle" x="590" y="82">Agencies</text>
        <text fill="#64748b" fontFamily="system-ui,-apple-system,sans-serif" fontSize="9.5" textAnchor="middle" x="590" y="98">implement</text>
        {/* Node 5: Courts */}
        <rect fill="white" height="50" rx="10" stroke="rgba(28,36,48,0.1)" strokeWidth="1" width="120" x="706" y="60" />
        <rect fill="#0f172a" height="16" rx="3.5" width="16" x="713" y="67" />
        <text fill="white" fontFamily="system-ui,-apple-system,sans-serif" fontSize="8" fontWeight="700" textAnchor="middle" x="721" y="79">5</text>
        <text fill="#0f172a" fontFamily="system-ui,-apple-system,sans-serif" fontSize="11" fontWeight="600" textAnchor="middle" x="766" y="82">Courts</text>
        <text fill="#64748b" fontFamily="system-ui,-apple-system,sans-serif" fontSize="9.5" textAnchor="middle" x="766" y="98">can reshape</text>
        {/* Veto branch node (dashed — conditional path) */}
        <rect fill="rgba(248,250,252,0.95)" height="44" rx="10" stroke="#cbd5e1" strokeDasharray="5 3" strokeWidth="1" width="130" x="340" y="148" />
        <text fill="#475569" fontFamily="system-ui,-apple-system,sans-serif" fontSize="11" fontWeight="600" textAnchor="middle" x="405" y="168">2/3 Override Vote</text>
        <text fill="#94a3b8" fontFamily="system-ui,-apple-system,sans-serif" fontSize="9.5" textAnchor="middle" x="405" y="183">Congress must vote</text>
      </svg>
    );
  }

  // Generic fallback: horizontal stage pills
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {processStages.map((stage, index) => {
        const Icon = PROCESS_STAGE_ICONS[index % PROCESS_STAGE_ICONS.length];
        return (
          <div className="flex items-center gap-1.5" key={stage}>
            <div className="flex items-center gap-2 rounded-[0.9rem] border border-[rgba(28,36,48,0.08)] bg-white px-3 py-2 shadow-[0_2px_6px_rgba(28,36,48,0.04)]">
              <span className="inline-flex h-5 w-5 flex-none items-center justify-center rounded-[0.4rem] bg-slate-900 text-[0.625rem] font-bold leading-none text-white">
                {index + 1}
              </span>
              <span className="inline-flex h-5 w-5 flex-none items-center justify-center rounded-[0.4rem] border border-[rgba(28,36,48,0.09)] bg-[rgba(246,244,238,0.8)] text-slate-500">
                <Icon className="h-3 w-3" />
              </span>
              <span className="text-[0.75rem] font-semibold leading-none text-slate-800">{stage}</span>
            </div>
            {index < processStages.length - 1 && (
              <ChevronRight className="h-3.5 w-3.5 flex-none text-slate-300" />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Canvas ─────────────────────────────────────────────────────────────────────

export function ProcessLessonCanvas({
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
  const articleSections = getArticleSections(article);
  const bigPictureSection = articleSections[0];
  const processNarrativeSection = articleSections[1];
  const powerNarrativeSection = articleSections[2];

  const quickMapCards = getQuickMapCards(article).slice(0, 4);
  const whyItMattersCards = module.betterMetrics.slice(0, 4);
  const processStages = getProcessStages(module);
  const roleSnapshots = getRoleSnapshots(module);
  const supportingImage = supportImageSrc || heroImageSrc;

  // Big picture content — show ALL paragraphs above the image, split into lead + overflow
  const allBigPictureParagraphs = getParagraphs(bigPictureSection?.blocks ?? []).length
    ? getParagraphs(bigPictureSection?.blocks ?? [])
    : module.simpleExplanation.slice(0, 2);
  const bigPictureLead = allBigPictureParagraphs.slice(0, 2);
  const bigPictureOverflow = allBigPictureParagraphs.slice(2);
  const bigPictureCallouts = getCallouts(bigPictureSection?.blocks ?? []);

  // Process narrative — ALL paragraphs + ALL list items
  const processNarrativeParagraphs = getParagraphs(processNarrativeSection?.blocks ?? []).length
    ? getParagraphs(processNarrativeSection?.blocks ?? [])
    : module.simpleExplanation.slice(1, 3);
  const processNarrativePoints = getLists(processNarrativeSection?.blocks ?? []);
  const processCallouts = getCallouts(processNarrativeSection?.blocks ?? []);

  // Power narrative — ALL paragraphs + ALL list items
  const powerNarrativeParagraphs = getParagraphs(powerNarrativeSection?.blocks ?? []).length
    ? getParagraphs(powerNarrativeSection?.blocks ?? [])
    : module.simpleExplanation.slice(2, 4);
  const powerNarrativePoints = getLists(powerNarrativeSection?.blocks ?? []);
  const powerCallouts = getCallouts(powerNarrativeSection?.blocks ?? []);

  return (
    <div className="space-y-5 xl:space-y-6">

      {/* ── Row 1: Why This Matters  │  Quick Map ── */}
      <div className="grid items-stretch gap-6 xl:grid-cols-[1fr_2fr]">

        {/* Why This Matters */}
        <section className="flex h-full flex-col gap-4" id="why-this-matters">
          <LessonSectionHeader
            accent={module.accent}
            compact
            id="why-this-matters-heading"
            index={1}
            subtitle="The practical stakes before we get into the institutional plumbing."
            title="Why this matters"
          />
          <div className="flex flex-1 flex-col overflow-hidden rounded-[1.8rem] border border-[rgba(28,36,48,0.08)] bg-white/84 px-4 py-4 shadow-[0_16px_30px_rgba(28,36,48,0.04)] sm:px-5 sm:py-5">
            <div className="grid grid-cols-2 gap-3">
              {whyItMattersCards.map((metric, index) => {
                const Icon = WHY_IT_MATTERS_ICONS[index % WHY_IT_MATTERS_ICONS.length];
                return (
                  <article
                    className="flex h-full flex-col rounded-[1.25rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4 shadow-[0_4px_12px_rgba(28,36,48,0.02)]"
                    key={metric.label}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-[0.75rem] border border-[rgba(28,36,48,0.09)] bg-[rgba(246,244,238,0.8)] text-slate-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold leading-tight text-slate-900">{metric.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{extractFirstSentence(metric.description)}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Quick Map */}
        <section className="flex h-full flex-col gap-4" id="quick-map">
          <LessonSectionHeader
            accent={module.accent}
            compact
            id="quick-map-heading"
            index={2}
            subtitle="A fast orienting view of the key structural facts before the detail."
            title="Quick map"
          />
          <div className="flex flex-1 flex-col overflow-hidden rounded-[1.8rem] border border-[rgba(28,36,48,0.08)] bg-white/84 px-4 py-4 shadow-[0_16px_30px_rgba(28,36,48,0.04)] sm:px-5 sm:py-5">
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
              {(quickMapCards.length
                ? quickMapCards.map((c) => ({ body: c.body, title: c.title }))
                : roleSnapshots.map((s) => ({ body: s.body, title: s.title }))
              ).map((card, index) => {
                const snapshot = roleSnapshots[index];
                const Icon = snapshot ? ROLE_ICON_MAP[snapshot.iconKey] : ScrollText;
                return (
                  <article
                    className="flex h-full flex-col rounded-[1.25rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4 shadow-[0_4px_12px_rgba(28,36,48,0.02)]"
                    key={`${card.title}-${index}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-[0.5rem] bg-slate-900 text-xs font-semibold text-white">
                        {index + 1}
                      </span>
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-[0.5rem] border border-[rgba(28,36,48,0.09)] bg-[rgba(246,244,238,0.8)] text-slate-500">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                    </div>
                    <h3 className="mt-3 text-sm font-semibold leading-snug text-slate-900">{card.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{card.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

      </div>

      {/* ── Row 2: Big Picture  │  Core Mechanism ── */}
      <div className="grid items-stretch gap-6 xl:grid-cols-[1fr_2fr]">

        {/* Big Picture */}
        <section className="flex h-full flex-col gap-4" id="big-picture">
          <LessonSectionHeader
            accent={module.accent}
            compact
            id="big-picture-heading"
            index={3}
            subtitle="The design logic underneath the formal process."
            title="Big picture"
          />
          <div className="flex flex-1 flex-col overflow-hidden rounded-[1.8rem] border border-[rgba(28,36,48,0.08)] bg-white/84 shadow-[0_16px_30px_rgba(28,36,48,0.04)]">
            <div className="space-y-3 px-4 py-4 sm:px-5 sm:py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                {bigPictureSection?.heading ?? "How the design works"}
              </p>
              <div className="space-y-3">
                {bigPictureLead.map((paragraph) => (
                  <p className="text-sm leading-7 text-slate-700" key={paragraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
              {bigPictureCallouts[0] && (
                <div className={cn("rounded-[1rem] px-4 py-3", accent.panel)}>
                  <p className="text-sm leading-6 text-slate-700">{bigPictureCallouts[0]}</p>
                </div>
              )}
            </div>
            {supportingImage && (
              <div className="relative flex min-h-[12rem] flex-1 border-t border-[rgba(28,36,48,0.06)]">
                <Image
                  alt=""
                  className="object-cover"
                  fill
                  sizes="(max-width: 1280px) 100vw, 33vw"
                  src={supportingImage}
                />
              </div>
            )}
          </div>
          {bigPictureOverflow.length > 0 && (
            <div className="rounded-[1.8rem] border border-[rgba(28,36,48,0.08)] bg-white/84 px-4 py-4 shadow-[0_16px_30px_rgba(28,36,48,0.04)] sm:px-5 sm:py-5">
              <div className="space-y-3">
                {bigPictureOverflow.map((paragraph) => (
                  <p className="text-sm leading-7 text-slate-700" key={paragraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Core Mechanism */}
        <section className="flex h-full flex-col gap-4" id="core-mechanism">
          <LessonSectionHeader
            accent={module.accent}
            compact
            id="core-mechanism-heading"
            index={4}
            subtitle="How proposals move through the system, where bargaining happens, and where veto points reshape the outcome."
            title="Core mechanism"
          />
          <div className="flex flex-1 flex-col overflow-hidden rounded-[1.8rem] border border-[rgba(28,36,48,0.08)] bg-white/84 shadow-[0_16px_30px_rgba(28,36,48,0.04)]">

            {/* Process flowchart */}
            <div className="border-b border-[rgba(28,36,48,0.06)] px-4 py-4 sm:px-5 sm:py-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Decision process
              </p>
              <ProcessFlowDiagram module={module} />
            </div>

            {/* 3-column narrative grid */}
            <div className="grid gap-4 px-4 py-4 sm:px-5 sm:py-5 xl:grid-cols-3">

              {/* Col 1 */}
              <article className="flex h-full flex-col rounded-[1.3rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(244,248,252,0.92)] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                <h3 className="text-[1rem] font-semibold text-slate-900">
                  {processNarrativeSection?.heading ?? "How it actually moves"}
                </h3>
                <div className="mt-3 space-y-2.5">
                  {processNarrativeParagraphs.map((paragraph) => (
                    <p className="text-sm leading-6 text-slate-600" key={paragraph}>
                      {paragraph}
                    </p>
                  ))}
                </div>
                {processNarrativePoints.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {processNarrativePoints.map((point) => (
                      <li className="flex gap-2 text-sm leading-6 text-slate-600" key={point}>
                        <span className={cn("mt-1.5 h-1.5 w-1.5 flex-none rounded-full", accent.step)} />
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
                {processCallouts[0] && (
                  <div className={cn("mt-3 rounded-[1rem] px-3 py-2.5", accent.panel)}>
                    <p className="text-sm leading-6 text-slate-700">{processCallouts[0]}</p>
                  </div>
                )}
              </article>

              {/* Col 2 */}
              <article className="flex h-full flex-col rounded-[1.3rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(244,248,252,0.92)] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                <h3 className="text-[1rem] font-semibold text-slate-900">
                  {powerNarrativeSection?.heading ?? "Where leverage accumulates"}
                </h3>
                <div className="mt-3 space-y-2.5">
                  {powerNarrativeParagraphs.map((paragraph) => (
                    <p className="text-sm leading-6 text-slate-600" key={paragraph}>
                      {paragraph}
                    </p>
                  ))}
                </div>
                {powerNarrativePoints.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {powerNarrativePoints.map((point) => (
                      <li className="flex gap-2 text-sm leading-6 text-slate-600" key={point}>
                        <span className={cn("mt-1.5 h-1.5 w-1.5 flex-none rounded-full", accent.step)} />
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
                {powerCallouts[0] && (
                  <div className={cn("mt-3 rounded-[1rem] px-3 py-2.5", accent.panel)}>
                    <p className="text-sm leading-6 text-slate-700">{powerCallouts[0]}</p>
                  </div>
                )}
              </article>

              {/* Col 3 */}
              <article className="flex h-full flex-col rounded-[1.3rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(244,248,252,0.92)] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                <h3 className="text-[1rem] font-semibold text-slate-900">Where friction shows up</h3>
                <ul className="mt-3 space-y-2.5">
                  {module.systemBug.signals.map((signal) => (
                    <li className="flex gap-2 text-sm leading-6 text-slate-600" key={signal}>
                      <span className={cn("mt-1.5 h-1.5 w-1.5 flex-none rounded-full", accent.step)} />
                      {signal}
                    </li>
                  ))}
                </ul>
                {module.systemBug.summary && (
                  <div className={cn("mt-3 rounded-[1rem] px-3 py-2.5", accent.panel)}>
                    <p className="text-sm leading-6 text-slate-700">{extractFirstSentence(module.systemBug.summary)}</p>
                  </div>
                )}
              </article>

            </div>

            {/* Actor roles */}
            <div className="border-t border-[rgba(28,36,48,0.06)] px-4 py-4 sm:px-5 sm:py-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Key actors</p>
              <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                {roleSnapshots.map((role) => {
                  const Icon = ROLE_ICON_MAP[role.iconKey];
                  return (
                    <div
                      className="flex flex-col rounded-[1.25rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-3 shadow-[0_4px_12px_rgba(28,36,48,0.02)]"
                      key={role.title}
                    >
                      <div className={cn("flex h-8 w-8 items-center justify-center rounded-[0.6rem] border border-[rgba(28,36,48,0.07)]", accent.icon)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <h4 className="mt-2 text-sm font-semibold text-slate-900">{role.title}</h4>
                      <p className="mt-1 text-xs leading-5 text-slate-500">{role.body}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Causal loop */}
            <div className="border-t border-[rgba(28,36,48,0.06)] px-4 py-4 sm:px-5 sm:py-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">System dynamics</p>
              <CausalLoopDiagram
                accent={module.accent}
                compact
                description={module.causalLoop.description}
                edges={module.causalLoop.edges}
                loops={module.causalLoop.loops}
                nodes={module.causalLoop.nodes}
                title={module.causalLoop.title}
              />
            </div>

          </div>
        </section>

      </div>

      {/* Row 3: Evidence | Interactive + Counterarguments */}
      <div className="grid items-stretch gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <LessonEvidence
          article={article}
          module={module}
        />
        <div className="flex flex-col gap-6">
          <LessonInteractive
            module={module}
          />
          <LessonCounterarguments
            module={module}
          />
        </div>
      </div>

      {/* Row 4: Case Studies | Next Actions */}
      <div className="grid items-stretch gap-6 xl:grid-cols-[1.04fr_0.96fr]">
        <LessonCaseStudies
          module={module}
        />
        <LessonNextActions
          currentTrack={currentTrack}
          module={module}
          nextModule={nextModule}
          quizQuestionCount={quizQuestionCount}
        />
      </div>

      <LessonProposals
        module={module}
      />

    </div>
  );
}
