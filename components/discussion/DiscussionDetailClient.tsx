"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  Filter,
  Lightbulb,
  MessageSquare,
  Paperclip,
  Plus,
  Scale,
  Send,
  Sparkles,
  ThumbsUp,
  Users,
  Zap,
} from "lucide-react";

import { SoftPanel } from "@/components/atlas/SoftPanel";
import type { SeededPublicThread } from "@/lib/discussion/seeded-public-threads";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────

type PostKind = "comment" | "claim" | "counterpoint" | "evidence" | "question" | "synthesis";
type Tab = "overview" | "threads" | "evidence" | "questions" | "syntheses" | "activity";
type DiscussionStatus = "open" | "needs-evidence" | "synthesis-in-progress" | "proposal-emerging";

interface ThreadedPost {
  author_label: string;
  content: string;
  created_at: string;
  id: string;
  kind: PostKind;
  parentId?: string | null;
  proposalReference?: { id: string; title: string } | null;
  upvotes: number;
  source?: string | null;
}

// ── Static data ────────────────────────────────────────────────────────────────

const KIND_META: Record<PostKind, { label: string; color: string; lineColor: string; icon: React.FC<{ className?: string }> }> = {
  comment:      { label: "Comment",      color: "border-slate-200   bg-slate-50   text-slate-600",   lineColor: "border-slate-200",   icon: MessageSquare },
  claim:        { label: "Claim",        color: "border-amber-200   bg-amber-50   text-amber-700",   lineColor: "border-amber-200",   icon: FileText      },
  evidence:     { label: "Evidence",     color: "border-cyan-200    bg-cyan-50    text-cyan-700",    lineColor: "border-cyan-200",    icon: BookOpenText  },
  counterpoint: { label: "Counterpoint", color: "border-rose-200    bg-rose-50    text-rose-700",    lineColor: "border-rose-200",    icon: Scale         },
  question:     { label: "Question",     color: "border-emerald-200 bg-emerald-50 text-emerald-700", lineColor: "border-emerald-200", icon: MessageSquare },
  synthesis:    { label: "Synthesis",    color: "border-violet-200  bg-violet-50  text-violet-700",  lineColor: "border-violet-200",  icon: Lightbulb     },
};

const STATUS_META: Record<DiscussionStatus, { label: string; badge: string }> = {
  "open":                  { label: "Open",                  badge: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  "needs-evidence":        { label: "Needs Evidence",        badge: "border-amber-200   bg-amber-50   text-amber-700"   },
  "synthesis-in-progress": { label: "Synthesis in progress", badge: "border-blue-200    bg-blue-50    text-blue-700"    },
  "proposal-emerging":     { label: "Proposal emerging",     badge: "border-violet-200  bg-violet-50  text-violet-700"  },
};

const SEEDED_STATUSES: Record<string, DiscussionStatus> = {
  "seed-growth-distribution":                           "open",
  "seed-housing-public-good":                           "needs-evidence",
  "seed-public-banks-for-housing-and-green-investment": "synthesis-in-progress",
  "seed-gdp-not-wellbeing":                             "proposal-emerging",
};

const THREAD_DISPLAY_META: Record<string, {
  participants: number; evidenceCount: number; counterpointCount: number;
  questionCount: number; totalContributions: number;
  synthesisCount: number; proposalCount: number;
  lastActivity: string; extraAvatars: number;
}> = {
  "seed-growth-distribution":                           { participants: 425, evidenceCount: 186, counterpointCount: 73, questionCount: 42, totalContributions: 2300, synthesisCount: 8,  proposalCount: 6, lastActivity: "2h ago",  extraAvatars: 22 },
  "seed-housing-public-good":                           { participants: 84,  evidenceCount: 31,  counterpointCount: 19, questionCount: 12, totalContributions: 312,  synthesisCount: 5,  proposalCount: 4, lastActivity: "5h ago",  extraAvatars: 17 },
  "seed-public-banks-for-housing-and-green-investment": { participants: 101, evidenceCount: 38,  counterpointCount: 22, questionCount: 11, totalContributions: 421,  synthesisCount: 9,  proposalCount: 5, lastActivity: "1d ago",  extraAvatars: 19 },
  "seed-gdp-not-wellbeing":                             { participants: 72,  evidenceCount: 27,  counterpointCount: 14, questionCount: 7,  totalContributions: 203,  synthesisCount: 6,  proposalCount: 3, lastActivity: "1d ago",  extraAvatars: 11 },
};

const GOAL_META: Record<string, { participantsGoal: number; evidenceGoal: number; counterpointGoal: number; questionGoal: number }> = {
  "seed-growth-distribution":                           { participantsGoal: 1000, evidenceGoal: 300, counterpointGoal: 200, questionGoal: 100 },
  "seed-housing-public-good":                           { participantsGoal: 200,  evidenceGoal: 80,  counterpointGoal: 50,  questionGoal: 30  },
  "seed-public-banks-for-housing-and-green-investment": { participantsGoal: 250,  evidenceGoal: 100, counterpointGoal: 60,  questionGoal: 30  },
  "seed-gdp-not-wellbeing":                             { participantsGoal: 200,  evidenceGoal: 80,  counterpointGoal: 40,  questionGoal: 20  },
};

const STARTER_QUESTIONS: Record<string, { prefix: string; title: string; desc: string }[]> = {
  "seed-growth-distribution": [
    { prefix: "?", title: "What are the root causes?",        desc: "Identify the structural forces that separate growth from distribution." },
    { prefix: "E", title: "Which evidence matters most?",     desc: "Add data, research, or real-world examples that clarify the picture."  },
    { prefix: "S", title: "What solutions are worth trying?", desc: "Suggest policies or actions that could narrow the gap."                },
  ],
  "seed-housing-public-good": [
    { prefix: "?", title: "What are the biggest causes?",         desc: "Add facts about what is driving housing costs."              },
    { prefix: "E", title: "Which evidence matters most?",         desc: "Add facts or sources that help us understand the issue."     },
    { prefix: "S", title: "What solutions should be explored?",   desc: "Suggest policies or actions worth considering."             },
  ],
  "seed-public-banks-for-housing-and-green-investment": [
    { prefix: "?", title: "What are the key risks?",              desc: "Identify design challenges or governance risks."             },
    { prefix: "E", title: "What precedents exist?",               desc: "Add international models and their track records."          },
    { prefix: "S", title: "What would a good model look like?",   desc: "Describe the institutional design that could make it work." },
  ],
  "seed-gdp-not-wellbeing": [
    { prefix: "?", title: "What does GDP miss?",                  desc: "Identify what GDP excludes that matters for quality of life."},
    { prefix: "E", title: "What does the data show?",             desc: "Add research comparing GDP to alternative wellbeing measures."},
    { prefix: "S", title: "What should replace or supplement it?",desc: "Suggest metrics or dashboards governments could adopt."     },
  ],
};

const IDEAS_WORTH_EXPLORING: Record<string, { title: string; desc: string; supporters: number }[]> = {
  "seed-growth-distribution": [
    { title: "Progressive wealth tax",     desc: "Tax net wealth above a threshold to slow compounding at the top.",     supporters: 36 },
    { title: "Worker ownership mandates",  desc: "Require large firms to transfer equity to employee ownership trusts.", supporters: 29 },
    { title: "Universal basic services",   desc: "Provide healthcare, housing and education outside the market.",        supporters: 24 },
  ],
  "seed-housing-public-good": [
    { title: "Reform zoning for density",  desc: "Update rules to allow more density near transit and jobs.",            supporters: 36 },
    { title: "Invest in affordable housing",desc: "Increase public and nonprofit investment in affordable units.",       supporters: 29 },
    { title: "Regulate speculative buying",desc: "Implement taxes or limits on speculative and short-term purchases.",   supporters: 24 },
  ],
  "seed-public-banks-for-housing-and-green-investment": [
    { title: "National public banking",    desc: "Create a federally backed bank focused on housing and green investment.", supporters: 41 },
    { title: "Regional development banks", desc: "Establish state-level banks modelled on KfW and BND.",                supporters: 27 },
    { title: "Green bond guarantees",      desc: "Use public guarantees to lower borrowing costs for climate infrastructure.", supporters: 19 },
  ],
  "seed-gdp-not-wellbeing": [
    { title: "Adopt a wellbeing dashboard",desc: "Track 12 indicators across health, environment, and connection.",      supporters: 33 },
    { title: "Genuine Progress Indicator", desc: "Replace GDP with a metric that counts care work and subtracts harm.",  supporters: 28 },
    { title: "Doughnut economics framework",desc: "Set social floors and planetary ceilings as the policy target.",       supporters: 21 },
  ],
};

const EXTRA_REPLIES: Record<string, ThreadedPost[]> = {
  "seed-growth-distribution": [
    { id: "sg-r1a",  parentId: "seed-growth-distribution-1", author_label: "Labour Economist",    kind: "evidence",     upvotes: 24, source: "ONS Labour Market Overview, 2024", content: "ONS data shows UK real wages grew 1.2% in the decade after 2008, while FTSE dividends rose 34%. That gap is the compounding mechanism in action.", created_at: "2026-05-18T09:45:00Z" },
    { id: "sg-r1b",  parentId: "seed-growth-distribution-1", author_label: "Policy Researcher",   kind: "counterpoint", upvotes: 15, content: "The wage-capital split varies significantly by country. Nordic economies show much tighter tracking. Policy environment matters as much as structural tendency.", created_at: "2026-05-18T10:15:00Z" },
    { id: "sg-r1bi", parentId: "sg-r1b",                     author_label: "Systems Analyst",      kind: "question",     upvotes: 11, content: "What specific mechanisms explain the Nordic difference — stronger unions, wage boards, or capital gains tax design?", created_at: "2026-05-18T10:50:00Z" },
    { id: "sg-r1bii",parentId: "sg-r1bi",                    author_label: "Labour Economist",     kind: "evidence",     upvotes: 9,  source: "Swedish Mediation Institute, 2023", content: "Primarily sectoral collective bargaining covering 90% of workers. Sweden sets wage floors across entire industries with no legal minimum wage.", created_at: "2026-05-18T11:30:00Z" },
    { id: "sg-r2a",  parentId: "seed-growth-distribution-2", author_label: "Ecological Economist", kind: "counterpoint", upvotes: 11, content: "Asset inflation only helps if you own assets. For the bottom 60% of households, wealth-effect gains are largely theoretical.", created_at: "2026-05-18T10:45:00Z" },
    { id: "sg-r3a",  parentId: "seed-growth-distribution-3", author_label: "Civic Designer",       kind: "synthesis",    upvotes: 18, content: "Both framings coexist: planetary limits set the ceiling, distribution determines who lives well within it. Treating them as competing is the mistake.", created_at: "2026-05-18T11:45:00Z" },
    { id: "sg-r3ai", parentId: "sg-r3a",                     author_label: "Political Economist",  kind: "evidence",     upvotes: 6,  source: "Raworth, Doughnut Economics, 2017", content: "Doughnut economics formalises exactly that nested structure — social foundation inside ecological ceiling — with empirical metrics for both.", created_at: "2026-05-18T12:20:00Z" },
  ],
  "seed-housing-public-good": [
    { id: "shpg-r1a", parentId: "seed-housing-public-good-1", author_label: "Housing Researcher", kind: "evidence",     upvotes: 21, source: "Brookings Institution Report, 2024", content: "UK house prices rose 400% in real terms 1995-2020 while construction costs rose 50%. The gap is entirely land value inflation captured by existing owners.", created_at: "2026-05-20T08:50:00Z" },
    { id: "shpg-r1b", parentId: "seed-housing-public-good-1", author_label: "Market Liberal",     kind: "counterpoint", upvotes: 8,  content: "Price appreciation in constrained markets is primarily a planning failure. Fix supply and prices follow.", created_at: "2026-05-20T09:30:00Z" },
    { id: "shpg-r1bi",parentId: "shpg-r1b",                   author_label: "Urban Planner",       kind: "evidence",     upvotes: 13, source: "Urban Institute, 2023", content: "Tokyo shows that even with permissive zoning, land values still track financialisation cycles. Supply is necessary but not sufficient.", created_at: "2026-05-20T10:00:00Z" },
    { id: "shpg-r2a", parentId: "seed-housing-public-good-2", author_label: "Community Organiser",kind: "synthesis",    upvotes: 16, content: "The CLT model removes land from the speculative market permanently. Once in a trust it can never be sold for profit.", created_at: "2026-05-20T10:45:00Z" },
  ],
  "seed-public-banks-for-housing-and-green-investment": [
    { id: "spb-r1a",  parentId: "seed-public-banking-1",  author_label: "Systems Designer",   kind: "evidence",  upvotes: 19, source: "KfW Annual Report, 2022",              content: "KfW approved 135bn EUR in lending in 2022. Its federal guarantee allows long-term sub-market rates for social infrastructure.", created_at: "2026-05-22T10:10:00Z" },
    { id: "spb-r2a",  parentId: "seed-public-banking-2",  author_label: "Fiscal Conservative", kind: "question",  upvotes: 10, content: "KfW operates under EU state-aid rules — does that governance constraint travel to countries without external discipline?", created_at: "2026-05-22T11:00:00Z" },
    { id: "spb-r2ai", parentId: "spb-r2a",                author_label: "Regional Banker",     kind: "evidence",  upvotes: 7,  source: "Bank of North Dakota Annual Report, 2023", content: "The Bank of North Dakota has operated profitably since 1919 under state legislative oversight. Governance design matters more than legal jurisdiction.", created_at: "2026-05-22T11:40:00Z" },
    { id: "spb-r2aii",parentId: "spb-r2ai",               author_label: "Policy Analyst",      kind: "synthesis", upvotes: 14, content: "BND model: state agency deposits as capital base, lending only alongside local private banks, profit returned to treasury. That triple constraint limits political capture.", created_at: "2026-05-22T12:00:00Z" },
  ],
  "seed-gdp-not-wellbeing": [
    { id: "sgdp-r1a", parentId: "seed-gdp-not-wellbeing-1", author_label: "Public Health Res.",  kind: "evidence",    upvotes: 17, source: "ONS Personal Wellbeing Survey, 2024",        content: "UK life satisfaction peaked in 2019 and declined since despite GDP growth resuming. The divergence is statistically significant across three surveys.", created_at: "2026-05-24T09:00:00Z" },
    { id: "sgdp-r1b", parentId: "seed-gdp-not-wellbeing-1", author_label: "Macroeconomist",      kind: "counterpoint",upvotes: 9,  content: "The divergence may reflect pandemic scarring rather than structural decoupling. We need longer time series before strong causal conclusions.", created_at: "2026-05-24T09:30:00Z" },
    { id: "sgdp-r1bi",parentId: "sgdp-r1b",                 author_label: "Data Journalist",     kind: "evidence",    upvotes: 11, source: "Easterlin, Journal of Economic Behaviour, 2021", content: "Easterlin paradox holds across 40+ countries and 50+ years of data. Richer countries are not happier in absolute terms once basic needs are met.", created_at: "2026-05-24T10:00:00Z" },
    { id: "sgdp-r2a", parentId: "seed-gdp-not-wellbeing-2", author_label: "Policy Designer",     kind: "question",    upvotes: 8,  content: "If we use GPI or a dashboard, who decides the weights? Health vs leisure vs equality vs environment — those are inherently political trade-offs.", created_at: "2026-05-24T09:45:00Z" },
    { id: "sgdp-r2ai",parentId: "sgdp-r2a",                 author_label: "Public Health Res.",  kind: "synthesis",   upvotes: 12, content: "That is an argument FOR democratic metric design, not against it. GDPs weights are also political — we just made them invisible by calling them technical.", created_at: "2026-05-24T10:30:00Z" },
  ],
};

const RECENT_ACTIVITY: Record<string, { author: string; action: string; thread: string; kind: PostKind; time: string }[]> = {
  "seed-growth-distribution": [
    { author: "Labour Economist",    action: "added evidence to",           thread: "Wage-capital gap",    kind: "evidence",     time: "10m ago" },
    { author: "Policy Researcher",   action: "countered a claim in",        thread: "Nordic comparison",   kind: "counterpoint", time: "35m ago" },
    { author: "Ecological Econ.",    action: "added supporting evidence in", thread: "Asset ownership",    kind: "evidence",     time: "50m ago" },
    { author: "Civic Designer",      action: "posted synthesis in",         thread: "Nested problems",     kind: "synthesis",    time: "1h ago"  },
    { author: "Political Economist", action: "asked a question in",         thread: "Policy mechanisms",   kind: "question",     time: "1h ago"  },
  ],
  "seed-housing-public-good": [
    { author: "Housing Researcher",  action: "added evidence to",           thread: "Land value inflation",kind: "evidence",     time: "5h ago"  },
    { author: "Market Liberal",      action: "added counterpoint in",       thread: "Supply constraints",  kind: "counterpoint", time: "7h ago"  },
    { author: "Urban Planner",       action: "added evidence in",           thread: "Supply constraints",  kind: "evidence",     time: "8h ago"  },
    { author: "Community Org.",      action: "posted synthesis in",         thread: "CLT model",           kind: "synthesis",    time: "1d ago"  },
  ],
  "seed-public-banks-for-housing-and-green-investment": [
    { author: "Systems Designer",    action: "added evidence to",           thread: "KfW precedent",       kind: "evidence",     time: "1d ago"  },
    { author: "Fiscal Conservative", action: "asked a question in",         thread: "Governance design",   kind: "question",     time: "1d ago"  },
    { author: "Regional Banker",     action: "added evidence in",           thread: "BND model",           kind: "evidence",     time: "2d ago"  },
    { author: "Policy Analyst",      action: "posted synthesis in",         thread: "Triple constraint",   kind: "synthesis",    time: "2d ago"  },
  ],
  "seed-gdp-not-wellbeing": [
    { author: "Public Health Res.",  action: "added evidence to",           thread: "Wellbeing divergence",kind: "evidence",     time: "1d ago"  },
    { author: "Macroeconomist",      action: "countered a claim in",        thread: "Pandemic scarring",   kind: "counterpoint", time: "2d ago"  },
    { author: "Data Journalist",     action: "added evidence in",           thread: "Easterlin paradox",   kind: "evidence",     time: "2d ago"  },
    { author: "Policy Designer",     action: "asked a question in",         thread: "Metric weights",      kind: "question",     time: "2d ago"  },
  ],
};

const RELATED_MODULES: Record<string, { title: string; slug: string; duration: string }[]> = {
  "seed-growth-distribution":                           [{ title: "How wealth compounds faster than wages", slug: "how-wealth-compounds-faster-than-wages", duration: "14 min" }, { title: "Why GDP is not the same as wellbeing", slug: "why-gdp-is-not-the-same-as-wellbeing", duration: "12 min" }],
  "seed-housing-public-good":                           [{ title: "Housing Supply 101", slug: "why-housing-becomes-financialized", duration: "12 min" }, { title: "Zoning and Land Use", slug: "why-cities-create-stress-or-freedom", duration: "10 min" }, { title: "Global Approaches to Affordability", slug: "why-housing-becomes-financialized", duration: "14 min" }],
  "seed-public-banks-for-housing-and-green-investment": [{ title: "How banks create money", slug: "how-banks-create-money", duration: "10 min" }, { title: "Why housing becomes financialized", slug: "why-housing-becomes-financialized", duration: "12 min" }],
  "seed-gdp-not-wellbeing":                             [{ title: "Why GDP is not the same as wellbeing", slug: "why-gdp-is-not-the-same-as-wellbeing", duration: "12 min" }, { title: "How doughnut economics works", slug: "how-doughnut-economics-puts-the-economy-inside-limits", duration: "10 min" }],
};

const ACTIVE_VOICES_DATA = [
  { label: "Maya Patel",   posts: 54, color: "bg-blue-400"    },
  { label: "Daniel Kim",   posts: 42, color: "bg-emerald-400" },
  { label: "Aisha Rahman", posts: 30, color: "bg-amber-400"   },
  { label: "Leo Martinez", posts: 32, color: "bg-rose-400"    },
];

const PROGRESS_STEPS = [
  { num: 1, label: "Question",          sub: "Framing the topic"          },
  { num: 2, label: "Evidence",          sub: "Gathering the facts"        },
  { num: 3, label: "Counterpoints",     sub: "Testing the arguments"      },
  { num: 4, label: "Synthesis",         sub: "Building shared ground"     },
  { num: 5, label: "Proposal potential",sub: "Shaping ideas into action"  },
];

const TAGS: Record<string, { label: string; color: string }[]> = {
  "seed-growth-distribution":                           [{ label: "Economy",  color: "bg-emerald-50 text-emerald-700 border-emerald-200" }, { label: "Inequality", color: "bg-amber-50 text-amber-700 border-amber-200" }],
  "seed-housing-public-good":                           [{ label: "Housing",  color: "bg-cyan-50    text-cyan-700    border-cyan-200"    }, { label: "Economy",    color: "bg-emerald-50 text-emerald-700 border-emerald-200" }],
  "seed-public-banks-for-housing-and-green-investment": [{ label: "Banking",  color: "bg-blue-50    text-blue-700    border-blue-200"    }, { label: "Housing",    color: "bg-cyan-50 text-cyan-700 border-cyan-200"       }],
  "seed-gdp-not-wellbeing":                             [{ label: "Economy",  color: "bg-emerald-50 text-emerald-700 border-emerald-200" }, { label: "Wellbeing",  color: "bg-violet-50 text-violet-700 border-violet-200" }],
};

const TABS: { id: Tab; label: string }[] = [
  { id: "overview",  label: "Overview"  },
  { id: "threads",   label: "Threads"   },
  { id: "evidence",  label: "Evidence"  },
  { id: "questions", label: "Questions" },
  { id: "syntheses", label: "Syntheses" },
  { id: "activity",  label: "Activity"  },
];

const HOME_KIND_COLORS: Record<string, string> = {
  Claim:    "border-amber-200   bg-amber-50   text-amber-700",
  Question: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Proposal: "border-blue-200    bg-blue-50    text-blue-700",
  Analysis: "border-slate-200   bg-slate-50   text-slate-600",
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function deriveActiveStep(status: DiscussionStatus): number {
  if (status === "needs-evidence")        return 1;
  if (status === "synthesis-in-progress") return 3;
  if (status === "proposal-emerging")     return 4;
  return 2;
}

function initials(label: string) {
  return label.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = ["bg-blue-400","bg-emerald-400","bg-amber-400","bg-rose-400","bg-violet-400","bg-sky-400","bg-teal-400","bg-orange-400"];
function avatarColor(label: string) {
  let h = 0;
  for (let i = 0; i < label.length; i++) h = (h * 31 + label.charCodeAt(i)) & 0xffff;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function fmt(n: number) { return n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n); }

// ── PostNode ───────────────────────────────────────────────────────────────────

function PostNode({
  post, allPosts, depth = 0, onReply,
}: {
  post: ThreadedPost; allPosts: ThreadedPost[]; depth?: number; onReply: (parentId: string, kind: PostKind, content: string) => void;
}) {
  const [showReply, setShowReply] = useState(false);
  const [replyKind, setReplyKind] = useState<PostKind>("evidence");
  const [replyText, setReplyText] = useState("");
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [upvoted, setUpvoted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const children = allPosts.filter((p) => p.parentId === post.id);
  const kind = (post.kind in KIND_META ? post.kind : "comment") as PostKind;
  const meta = KIND_META[kind];
  const Icon = meta.icon;
  const aColor = avatarColor(post.author_label);
  const dateStr =
    new Date(post.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) +
    " · " +
    new Date(post.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  function submitReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyText.trim()) return;
    onReply(post.id, replyKind, replyText);
    setReplyText(""); setShowReply(false);
  }

  return (
    <div className={cn("relative", depth > 0 && "ml-9 border-l-2 pl-4", depth > 0 && meta.lineColor)}>
      <div className="flex gap-3 py-3">
        <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white", aColor)}>
          {initials(post.author_label)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[0.82rem] font-semibold text-slate-900">{post.author_label}</span>
            <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em]", meta.color)}>
              <Icon className="h-2.5 w-2.5" />{meta.label}
            </span>
            <span className="text-[10px] text-slate-400">{dateStr}</span>
          </div>
          <p className="mt-1.5 text-sm leading-6 text-slate-700">{post.content}</p>
          {post.source && (
            <p className="mt-1 flex items-center gap-1 text-[10px] text-blue-600">
              <ExternalLink className="h-2.5 w-2.5" />
              <span className="underline underline-offset-2">{post.source}</span>
            </p>
          )}
          {post.proposalReference && (
            <Link
              className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-100"
              href={"/governance/" + post.proposalReference.id}
            >
              <Sparkles className="h-3 w-3" />Proposal: {post.proposalReference.title}
              <ExternalLink className="h-2.5 w-2.5 opacity-60" />
            </Link>
          )}
          {/* ACTION ROW */}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
            <button
              className={cn("inline-flex items-center gap-1 transition", upvoted && "text-primary font-semibold")}
              onClick={() => { setUpvotes(n => upvoted ? n - 1 : n + 1); setUpvoted(v => !v); }}
              type="button"
            >
              <ThumbsUp className="h-3 w-3" />Support {upvotes > 0 && upvotes}
            </button>
            <button
              className="inline-flex items-center gap-1 hover:text-slate-700 transition"
              onClick={() => setShowReply(v => !v)}
              type="button"
            >
              <MessageSquare className="h-3 w-3" />{showReply ? "Cancel" : "Reply"}
            </button>
            <button
              className="inline-flex items-center gap-1 hover:text-cyan-600 transition"
              onClick={() => { setShowReply(true); setReplyKind("evidence"); }}
              type="button"
            >
              <BookOpenText className="h-3 w-3" />Add evidence
            </button>
            <button
              className="inline-flex items-center gap-1 hover:text-rose-600 transition"
              onClick={() => { setShowReply(true); setReplyKind("counterpoint"); }}
              type="button"
            >
              <Scale className="h-3 w-3" />Counter this
            </button>
            <button
              className="inline-flex items-center gap-1 hover:text-emerald-600 transition"
              onClick={() => { setShowReply(true); setReplyKind("question"); }}
              type="button"
            >
              <MessageSquare className="h-3 w-3" />Ask question
            </button>
            {children.length > 0 && (
              <button
                className="inline-flex items-center gap-1 hover:text-slate-700 transition ml-auto"
                onClick={() => setCollapsed(v => !v)}
                type="button"
              >
                {collapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
                {collapsed ? ("Show " + children.length + " repl" + (children.length === 1 ? "y" : "ies")) : "Collapse"}
              </button>
            )}
          </div>
          {/* INLINE REPLY FORM */}
          {showReply && (
            <form className="mt-3 space-y-2" onSubmit={submitReply}>
              <div className="flex flex-wrap gap-1">
                {(["evidence","counterpoint","question","synthesis"] as PostKind[]).map((k) => {
                  const km = KIND_META[k]; const KIcon = km.icon;
                  return (
                    <button
                      className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] transition", replyKind === k ? km.color : "border-[rgba(28,36,48,0.1)] bg-white text-slate-400 hover:text-slate-700")}
                      key={k}
                      onClick={() => setReplyKind(k)}
                      type="button"
                    >
                      <KIcon className="h-2.5 w-2.5" />{km.label}
                    </button>
                  );
                })}
              </div>
              <textarea
                className="w-full resize-none rounded-[0.85rem] border border-[rgba(28,36,48,0.12)] bg-white px-3 py-2 text-sm leading-6 text-slate-800 placeholder-slate-400 outline-none transition focus:border-[rgba(59,130,246,0.4)]"
                onChange={e => setReplyText(e.target.value)}
                placeholder={"Your " + KIND_META[replyKind].label.toLowerCase() + "..."}
                rows={2}
                value={replyText}
              />
              <div className="flex justify-end">
                <button
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40"
                  disabled={!replyText.trim()}
                  type="submit"
                >
                  <Send className="h-3 w-3" />Post {KIND_META[replyKind].label}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      {!collapsed && children.length > 0 && (
        <div>
          {children.map(child => (
            <PostNode key={child.id} post={child} allPosts={allPosts} depth={depth + 1} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function DiscussionDetailClient({ thread }: { thread: SeededPublicThread }) {
  const [activeTab, setActiveTab]   = useState<Tab>("threads");
  const [sortBy, setSortBy]         = useState("Most active");
  const [localPosts, setLocalPosts] = useState<ThreadedPost[]>([]);
  const [postKind, setPostKind]     = useState<PostKind>("comment");
  const [postText, setPostText]     = useState("");
  const [submitted, setSubmitted]   = useState(false);

  const status      = SEEDED_STATUSES[thread.id] ?? "open";
  const statusMeta  = STATUS_META[status];
  const displayMeta = THREAD_DISPLAY_META[thread.id];
  const goalMeta    = GOAL_META[thread.id];
  const relatedMods = RELATED_MODULES[thread.id] ?? [];
  const activeStep  = deriveActiveStep(status);
  const recentAct   = RECENT_ACTIVITY[thread.id] ?? [];
  const extraReplies = EXTRA_REPLIES[thread.id] ?? [];
  const starterQs   = STARTER_QUESTIONS[thread.id] ?? STARTER_QUESTIONS["seed-housing-public-good"];
  const ideas       = IDEAS_WORTH_EXPLORING[thread.id] ?? [];
  const tags        = TAGS[thread.id] ?? [];

  const seededPosts: ThreadedPost[] = thread.posts.map((p, i) => ({
    ...p,
    kind: (p.kind in KIND_META ? p.kind : "claim") as PostKind,
    upvotes: [24, 15, 11, 18][i % 4] ?? 8,
    parentId: null,
    proposalReference: p.proposalReference ?? null,
    source: null,
  }));

  const allPosts: ThreadedPost[] = [...seededPosts, ...extraReplies, ...localPosts];
  const rootPosts    = allPosts.filter(p => !p.parentId);
  const allQuestions = allPosts.filter(p => p.kind === "question");
  const allSyntheses = allPosts.filter(p => p.kind === "synthesis");

  function handleReply(parentId: string, kind: PostKind, content: string) {
    setLocalPosts(prev => [...prev, {
      author_label: "You",
      content,
      created_at: new Date().toISOString(),
      id: "local-" + Date.now(),
      kind,
      parentId,
      upvotes: 0,
    }]);
  }

  function handleTopPost(e: React.FormEvent) {
    e.preventDefault();
    if (!postText.trim()) return;
    setLocalPosts(prev => [...prev, {
      author_label: "You",
      content: postText,
      created_at: new Date().toISOString(),
      id: "local-" + Date.now(),
      kind: postKind,
      parentId: null,
      upvotes: 0,
    }]);
    setPostText(""); setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  const homeKindColor = HOME_KIND_COLORS[thread.homeKind] ?? HOME_KIND_COLORS.Analysis;

  return (
    <div className="pt-4">

      {/* BACK + ADD */}
      <div className="flex items-center justify-between gap-4">
        <Link className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-900" href="/discussions">
          <ArrowLeft className="h-4 w-4" />Back to Discussions
        </Link>
        <button className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90" type="button">
          <Plus className="h-4 w-4" />Add contribution
        </button>
      </div>

      {/* TITLE BLOCK */}
      <div className="mt-5">
        <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">{thread.title}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {thread.prompt ? (thread.prompt.length > 120 ? thread.prompt.slice(0, 120) + "..." : thread.prompt) : ""}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className={cn("rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em]", statusMeta.badge)}>
            {statusMeta.label}
          </span>
          <span className={cn("rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em]", homeKindColor)}>
            {thread.homeKind}
          </span>
          {tags.map(t => (
            <span className={cn("rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em]", t.color)} key={t.label}>
              {t.label}
            </span>
          ))}
          <div className="ml-auto flex items-center gap-3 text-xs text-slate-400">
            <button className="hover:text-slate-700 transition" type="button">Follow</button>
            <button className="hover:text-slate-700 transition" type="button">Bookmark</button>
            <button className="hover:text-slate-700 transition" type="button">Share</button>
          </div>
        </div>
      </div>

      {/* 5-ITEM STATS BAR */}
      {displayMeta && (
        <div className="mt-5 grid grid-cols-5 divide-x divide-[rgba(28,36,48,0.07)] overflow-hidden rounded-[1.25rem] border border-[rgba(28,36,48,0.08)] bg-white">
          {[
            { label: "Participants",        value: fmt(displayMeta.participants),       icon: Users,        color: "text-blue-600"    },
            { label: "Evidence posts",      value: fmt(displayMeta.evidenceCount),      icon: BookOpenText, color: "text-cyan-600"    },
            { label: "Counterpoints",       value: fmt(displayMeta.counterpointCount),  icon: Scale,        color: "text-rose-600"    },
            { label: "Open questions",      value: fmt(displayMeta.questionCount),      icon: MessageSquare,color: "text-emerald-600" },
            { label: "Total contributions", value: fmt(displayMeta.totalContributions), icon: FileText,     color: "text-violet-600"  },
          ].map(({ label, value, icon: StatIcon, color }) => (
            <div className="flex flex-col items-center px-3 py-3 text-center" key={label}>
              <StatIcon className={cn("h-4 w-4", color)} />
              <p className="mt-1.5 text-lg font-bold text-slate-900">{value}</p>
              <p className="text-[10px] text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* PROGRESS TIMELINE */}
      <div className="mt-5 overflow-hidden rounded-[1.25rem] border border-[rgba(28,36,48,0.08)] bg-white px-6 py-5">
        <div className="flex items-start">
          {PROGRESS_STEPS.map((step, i) => {
            const isComplete = i < activeStep;
            const isActive   = i === activeStep;
            const isDone     = isComplete || isActive;
            return (
              <div className="flex flex-1 items-start" key={step.label}>
                <div className="flex w-full flex-col items-center gap-2">
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-[11px] font-bold",
                    isComplete
                      ? "border-emerald-400 bg-emerald-400 text-white"
                      : isActive
                        ? "border-primary bg-primary text-white"
                        : "border-[rgba(28,36,48,0.15)] bg-white text-slate-400",
                  )}>
                    {isComplete ? <CheckCircle2 className="h-4 w-4" /> : step.num}
                  </div>
                  <div className="text-center">
                    <p className={cn("text-[11px] font-semibold leading-4", isDone ? "text-slate-900" : "text-slate-400")}>
                      {step.label}
                    </p>
                    <p className={cn("text-[9px] leading-4 mt-0.5", isDone ? "text-slate-500" : "text-slate-300")}>
                      {step.sub}
                    </p>
                  </div>
                </div>
                {i < PROGRESS_STEPS.length - 1 && (
                  <div className="mx-1 mt-4 h-0.5 flex-1 overflow-hidden rounded-full bg-[rgba(28,36,48,0.08)]">
                    <div
                      className={cn("h-full rounded-full transition-all duration-700", isComplete ? "bg-emerald-400 w-full" : "w-0")}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* TAB NAV + SORT */}
      <div className="mt-5 flex items-center gap-3">
        <div className="flex flex-1 overflow-x-auto border-b border-[rgba(28,36,48,0.1)]">
          {TABS.map(tab => (
            <button
              className={cn(
                "whitespace-nowrap px-4 py-2 text-sm font-medium transition",
                activeTab === tab.id
                  ? "border-b-2 border-primary text-primary -mb-px"
                  : "text-slate-500 hover:text-slate-800",
              )}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-2 pb-px">
          <label className="flex items-center gap-1.5 rounded-full border border-[rgba(28,36,48,0.1)] bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
            <span className="text-slate-400">Sort by:</span>
            <select
              className="bg-transparent outline-none"
              onChange={e => setSortBy(e.target.value)}
              value={sortBy}
            >
              <option>Most active</option>
              <option>Most recent</option>
              <option>Most supported</option>
            </select>
          </label>
          <button className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(28,36,48,0.1)] bg-white text-slate-500 hover:text-slate-800 transition" type="button">
            <Filter className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="mt-5 grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start">

        {/* ── LEFT COLUMN ── */}
        <div className="space-y-5">

          {/* DISCUSSION STARTER (threads + overview tabs) */}
          {(activeTab === "threads" || activeTab === "overview") && (
            <div className="overflow-hidden rounded-[1.25rem] border border-[rgba(28,36,48,0.08)] bg-white">
              <div className="flex items-center gap-2 px-5 py-4">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <h3 className="text-sm font-semibold text-slate-900">Discussion starter</h3>
              </div>
              <div className="px-5 pb-3">
                <p className="text-sm leading-6 text-slate-600">{thread.prompt}</p>
              </div>
              <div className="grid grid-cols-3 gap-3 border-t border-[rgba(28,36,48,0.06)] p-4">
                {starterQs.map((q, i) => (
                  <div
                    className={cn(
                      "flex flex-col gap-1.5 rounded-[1rem] border p-3",
                      i === 0 ? "border-emerald-200 bg-emerald-50/60"
                      : i === 1 ? "border-cyan-200 bg-cyan-50/60"
                      :           "border-amber-200 bg-amber-50/60",
                    )}
                    key={q.title}
                  >
                    <div className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold",
                      i === 0 ? "bg-emerald-100 text-emerald-700"
                      : i === 1 ? "bg-cyan-100 text-cyan-700"
                      :           "bg-amber-100 text-amber-700",
                    )}>
                      {q.prefix}
                    </div>
                    <p className="text-[11px] font-semibold text-slate-900">{q.title}</p>
                    <p className="text-[10px] leading-4 text-slate-500">{q.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* THREAD CONTENT PANEL */}
          <div className="overflow-hidden rounded-[1.25rem] border border-[rgba(28,36,48,0.08)] bg-white">

            {/* "Selected thread" header (threads tab) */}
            {activeTab === "threads" && rootPosts.length > 0 && (
              <div className="border-b border-[rgba(28,36,48,0.06)] px-5 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Selected thread</p>
                <h3 className="mt-0.5 text-sm font-semibold text-slate-900">
                  {rootPosts[0].content.length > 60 ? rootPosts[0].content.slice(0, 60) + "..." : rootPosts[0].content}
                </h3>
                <p className="text-[11px] text-slate-500">A structured conversation on this claim</p>
              </div>
            )}

            <div className="px-5 py-2">

              {/* OVERVIEW tab */}
              {activeTab === "overview" && displayMeta && (
                <div className="space-y-4 py-3">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Participants",    value: displayMeta.participants,  icon: Users,        color: "text-blue-600   bg-blue-50"   },
                      { label: "Evidence pieces", value: displayMeta.evidenceCount, icon: BookOpenText, color: "text-cyan-600   bg-cyan-50"   },
                      { label: "Proposals",       value: displayMeta.proposalCount, icon: Sparkles,     color: "text-violet-600 bg-violet-50" },
                    ].map(({ label, value, icon: Ic, color }) => (
                      <div className="rounded-[1rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.5)] p-3 text-center" key={label}>
                        <div className={cn("mx-auto flex h-8 w-8 items-center justify-center rounded-full", color)}>
                          <Ic className="h-4 w-4" />
                        </div>
                        <p className="mt-2 text-xl font-bold text-slate-900">{value}</p>
                        <p className="text-[10px] text-slate-500">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* THREADS tab */}
              {activeTab === "threads" && (
                <div className="divide-y divide-[rgba(28,36,48,0.06)]">
                  {rootPosts.length === 0 ? (
                    <p className="py-6 text-center text-sm text-slate-500">No contributions yet.</p>
                  ) : rootPosts.map(post => (
                    <PostNode key={post.id} post={post} allPosts={allPosts} depth={0} onReply={handleReply} />
                  ))}
                </div>
              )}

              {/* EVIDENCE tab */}
              {activeTab === "evidence" && (
                <div className="py-3 space-y-1">
                  <p className="text-xs font-semibold text-slate-500 pb-2">
                    {allPosts.filter(p => p.kind === "evidence").length} evidence posts
                  </p>
                  <div className="divide-y divide-[rgba(28,36,48,0.06)]">
                    {allPosts.filter(p => p.kind === "evidence").map(post => (
                      <PostNode key={post.id} post={post} allPosts={allPosts} depth={0} onReply={handleReply} />
                    ))}
                  </div>
                </div>
              )}

              {/* QUESTIONS tab */}
              {activeTab === "questions" && (
                <div className="py-3 space-y-3">
                  <p className="text-xs font-semibold text-slate-500">{allQuestions.length} open questions</p>
                  {allQuestions.map(p => (
                    <div className="flex items-start gap-3 rounded-[1rem] border border-emerald-100 bg-emerald-50/60 px-4 py-3" key={p.id}>
                      <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm leading-6 text-slate-700">{p.content}</p>
                        <p className="mt-0.5 text-[10px] text-slate-400">{p.author_label}</p>
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <ThumbsUp className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-500">{p.upvotes}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SYNTHESES tab */}
              {activeTab === "syntheses" && (
                <div className="py-3 space-y-3">
                  <p className="text-xs font-semibold text-slate-500">{allSyntheses.length} syntheses</p>
                  {allSyntheses.map(p => (
                    <div className="space-y-2 rounded-[1rem] border border-violet-100 bg-violet-50/60 px-4 py-3" key={p.id}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold text-slate-700">{p.author_label}</span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                          <ThumbsUp className="h-3 w-3" />{p.upvotes}
                        </span>
                      </div>
                      <p className="text-sm leading-6 text-slate-700">{p.content}</p>
                      {p.proposalReference && (
                        <Link className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 hover:underline" href={"/governance/" + p.proposalReference.id}>
                          <Sparkles className="h-3 w-3" />{p.proposalReference.title}
                          <ExternalLink className="h-2.5 w-2.5" />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* ACTIVITY tab */}
              {activeTab === "activity" && (
                <div className="py-3 space-y-2">
                  <p className="text-xs font-semibold text-slate-500 pb-1">Latest contributions</p>
                  {recentAct.map((act, i) => {
                    const km = KIND_META[act.kind]; const AIcon = km.icon;
                    return (
                      <div className="flex items-center gap-3 rounded-[0.85rem] border border-[rgba(28,36,48,0.07)] bg-[rgba(246,244,238,0.5)] px-3 py-2.5" key={i}>
                        <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white", avatarColor(act.author))}>
                          {initials(act.author)}
                        </div>
                        <div className="min-w-0 flex-1 text-[12px]">
                          <span className="font-semibold text-slate-800">{act.author}</span>{" "}
                          <span className="text-slate-500">{act.action}</span>{" "}
                          <span className="font-medium text-primary">{act.thread}</span>
                        </div>
                        <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em]", km.color)}>
                          <AIcon className="h-2.5 w-2.5" />{km.label}
                        </span>
                        <span className="shrink-0 text-[10px] text-slate-400">{act.time}</span>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          </div>

          {/* REPLY FORM */}
          <form className="overflow-hidden rounded-[1.25rem] border border-[rgba(28,36,48,0.08)] bg-white" onSubmit={handleTopPost}>
            <div className="px-5 pt-4 pb-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Reply to this thread</p>
              <textarea
                className="mt-2 w-full resize-none bg-transparent text-sm leading-6 text-slate-800 placeholder-slate-400 outline-none"
                onChange={e => setPostText(e.target.value)}
                placeholder="Share your thoughts, evidence, or questions about this thread..."
                rows={3}
                value={postText}
              />
            </div>
            <div className="border-t border-[rgba(28,36,48,0.06)] px-4 py-3">
              <div className="flex flex-wrap items-start gap-2">
                {([
                  { kind: "comment"      as PostKind, label: "Comment",      desc: "Share your thoughts",  icon: MessageSquare, color: "text-slate-600"    },
                  { kind: "evidence"     as PostKind, label: "Evidence",     desc: "Add facts or sources", icon: BookOpenText,  color: "text-cyan-600"    },
                  { kind: "counterpoint" as PostKind, label: "Counterpoint", desc: "Offer a different view",icon: Scale,        color: "text-rose-600"    },
                  { kind: "question"     as PostKind, label: "Question",     desc: "Ask for clarity",      icon: MessageSquare, color: "text-emerald-600" },
                  { kind: "synthesis"    as PostKind, label: "Synthesis",    desc: "Bring ideas together", icon: Lightbulb,     color: "text-violet-600"  },
                ]).map(item => {
                  const KIcon = item.icon;
                  const isSelected = postKind === item.kind;
                  return (
                    <button
                      className={cn(
                        "flex items-center gap-1.5 rounded-[0.65rem] border px-3 py-1.5 text-left transition",
                        isSelected
                          ? KIND_META[item.kind].color
                          : "border-[rgba(28,36,48,0.08)] bg-white hover:border-[rgba(28,36,48,0.16)]",
                      )}
                      key={item.kind}
                      onClick={() => setPostKind(item.kind)}
                      type="button"
                    >
                      <KIcon className={cn("h-3 w-3 shrink-0", isSelected ? "" : item.color)} />
                      <div>
                        <p className="text-[11px] font-semibold text-slate-900">{item.label}</p>
                        <p className="hidden text-[9px] text-slate-400 sm:block">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
                <div className="ml-auto flex items-center gap-3 pt-1">
                  <button className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-700 transition" type="button">
                    <Paperclip className="h-3.5 w-3.5" />Add file
                  </button>
                  <button
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition",
                      submitted ? "bg-emerald-500" : "bg-primary hover:bg-primary/90 disabled:opacity-40",
                    )}
                    disabled={!postText.trim() && !submitted}
                    type="submit"
                  >
                    {submitted ? (
                      <><CheckCircle2 className="h-4 w-4" />Posted</>
                    ) : (
                      <><Send className="h-4 w-4" />Post contribution</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* IDEAS WORTH EXPLORING */}
          {ideas.length > 0 && (
            <div>
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-base font-semibold text-slate-900">Ideas worth exploring</h3>
                <Link className="flex items-center gap-1 text-sm font-medium text-primary hover:underline" href="/governance">
                  View all ideas <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {ideas.map(idea => (
                  <div className="flex flex-col rounded-[1.25rem] border border-[rgba(28,36,48,0.08)] bg-white p-4" key={idea.title}>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(28,36,48,0.07)] bg-[rgba(246,244,238,0.8)]">
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                    </div>
                    <p className="mt-2 text-[12px] font-semibold leading-5 text-slate-900">{idea.title}</p>
                    <p className="mt-1 flex-1 text-[11px] leading-5 text-slate-500">{idea.desc}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">{idea.supporters} supporters</span>
                      <Link className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline" href="/governance">
                        Explore idea <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="space-y-5">

          {/* DISCUSSION OVERVIEW */}
          {displayMeta && goalMeta && (
            <SoftPanel className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Discussion overview</h3>
                <p className="text-[11px] text-slate-400">Our progress as a community</p>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Participation",        value: displayMeta.participants,      goal: goalMeta.participantsGoal, icon: Users,        color: "bg-blue-400"    },
                  { label: "Evidence collected",   value: displayMeta.evidenceCount,     goal: goalMeta.evidenceGoal,     icon: BookOpenText, color: "bg-cyan-400"    },
                  { label: "Counterpoints shared", value: displayMeta.counterpointCount, goal: goalMeta.counterpointGoal, icon: Scale,        color: "bg-rose-400"    },
                  { label: "Open questions",       value: displayMeta.questionCount,     goal: goalMeta.questionGoal,     icon: MessageSquare,color: "bg-emerald-400" },
                ].map(({ label, value, goal, icon: Ic, color }) => {
                  const pct = Math.min(100, Math.round((value / goal) * 100));
                  return (
                    <div key={label}>
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Ic className="h-3 w-3 text-slate-400" />
                          <span className="text-slate-600">{label}</span>
                        </div>
                        <span className="font-semibold text-slate-900">
                          {value} / {goal >= 1000 ? (goal / 1000).toFixed(0) + "k" : goal}
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[rgba(28,36,48,0.07)]">
                        <div className={cn("h-full rounded-full", color)} style={{ width: pct + "%" }} />
                      </div>
                      <p className="mt-0.5 text-right text-[10px] text-slate-400">{pct}%</p>
                    </div>
                  );
                })}
              </div>
              <Link className="text-[11px] font-medium text-primary hover:underline" href="#">View full overview →</Link>
            </SoftPanel>
          )}

          {/* HOW THIS DISCUSSION WORKS */}
          <SoftPanel className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">How this discussion works</h3>
            <ol className="space-y-3">
              {[
                { label: "Add evidence",        desc: "Share data, research, or experiences."              },
                { label: "Share counterpoints", desc: "Challenge ideas and offer different views."          },
                { label: "Ask questions",       desc: "Clarify doubts and dig deeper together."             },
                { label: "Build synthesis",     desc: "Connect insights and identify patterns."             },
                { label: "Shape proposals",     desc: "Turn our insights into actions and policies."        },
              ].map(({ label, desc }, i) => (
                <li className="flex items-start gap-3" key={label}>
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[rgba(28,36,48,0.12)] bg-white text-[10px] font-bold text-slate-600">
                    {i + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-slate-900">{label}</p>
                    <p className="text-[11px] text-slate-500">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link className="text-[11px] font-medium text-primary hover:underline" href="#">Learn more about our process →</Link>
          </SoftPanel>

          {/* RECENT ACTIVITY */}
          {recentAct.length > 0 && (
            <SoftPanel className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  <h3 className="text-sm font-semibold text-slate-900">Recent activity</h3>
                </div>
                <Link className="text-[11px] font-medium text-primary hover:underline" href="#">View all →</Link>
              </div>
              <ul className="space-y-2.5">
                {recentAct.slice(0, 5).map((act, i) => (
                  <li className="flex items-start gap-2" key={i}>
                    <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white", avatarColor(act.author))}>
                      {initials(act.author)}
                    </div>
                    <div className="min-w-0 flex-1 text-[11px] leading-5">
                      <span className="font-semibold text-slate-800">{act.author}</span>{" "}
                      <span className="text-slate-500">{act.action}</span>{" "}
                      <span className="font-medium text-slate-800">{act.thread}</span>
                      <p className="text-[10px] text-slate-400">{act.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </SoftPanel>
          )}

          {/* OPEN QUESTIONS */}
          {allQuestions.length > 0 && (
            <SoftPanel className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                  <h3 className="text-sm font-semibold text-slate-900">Open questions</h3>
                </div>
                <Link className="text-[11px] font-medium text-primary hover:underline" href="#">View all →</Link>
              </div>
              <ul className="space-y-2">
                {allQuestions.slice(0, 4).map((post) => (
                  <li className="flex items-start gap-2" key={post.id}>
                    <div className="flex flex-col items-center gap-0.5 pt-0.5">
                      <ThumbsUp className="h-3 w-3 text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-500">{post.upvotes}</span>
                    </div>
                    <p className="text-[11px] leading-5 text-slate-700">{post.content}</p>
                  </li>
                ))}
              </ul>
            </SoftPanel>
          )}

          {/* RELATED LEARNING */}
          {relatedMods.length > 0 && (
            <SoftPanel className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <BookOpenText className="h-3.5 w-3.5 text-primary" />
                  <h3 className="text-sm font-semibold text-slate-900">Related learning</h3>
                </div>
                <Link className="text-[11px] font-medium text-primary hover:underline" href="/learn">View all →</Link>
              </div>
              <ul className="space-y-2">
                {relatedMods.map((mod) => (
                  <li key={mod.slug}>
                    <Link
                      className="flex items-center gap-2 rounded-[0.85rem] border border-[rgba(28,36,48,0.08)] bg-white px-3 py-2 transition hover:border-primary/30"
                      href={"/learn/" + mod.slug}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[rgba(28,36,48,0.06)] bg-[rgba(246,244,238,0.8)]">
                        <BookOpenText className="h-3.5 w-3.5 text-slate-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[11px] font-medium text-slate-700">{mod.title}</p>
                        <p className="text-[10px] text-slate-400">Module · {mod.duration}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </SoftPanel>
          )}

          {/* ACTIVE VOICES */}
          <SoftPanel className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-slate-500" />
                <h3 className="text-sm font-semibold text-slate-900">Active voices</h3>
              </div>
              <Link className="text-[11px] font-medium text-primary hover:underline" href="#">View all →</Link>
            </div>
            <div className="flex flex-wrap items-start gap-3">
              {ACTIVE_VOICES_DATA.map(({ label, posts, color }) => (
                <div className="flex flex-col items-center gap-1 text-center" key={label}>
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-full text-[11px] font-bold text-white", color)}>
                    {initials(label)}
                  </div>
                  <p className="text-[10px] font-semibold leading-4 text-slate-700">
                    {label.split(" ")[0]}<br />{label.split(" ")[1]}
                  </p>
                  <p className="text-[10px] text-slate-400">{posts} posts</p>
                </div>
              ))}
              {displayMeta && (
                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-[rgba(28,36,48,0.15)] bg-white text-[11px] font-bold text-slate-400">
                    +{displayMeta.extraAvatars}
                  </div>
                  <p className="text-[10px] text-slate-400">more</p>
                </div>
              )}
            </div>
          </SoftPanel>

          {/* NEXT STEPS */}
          <SoftPanel className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">Next steps</h3>
            <ul className="space-y-2 text-[12px] text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />Keep contributing evidence and counterpoints
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-400" />Help build understanding together
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-violet-400" />Explore solutions and share proposals
              </li>
            </ul>
            <Link className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline" href="/governance">
              See how proposals work <ArrowRight className="h-3 w-3" />
            </Link>
          </SoftPanel>

        </div>
      </div>
    </div>
  );
}
