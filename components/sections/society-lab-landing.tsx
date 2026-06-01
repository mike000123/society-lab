"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Bar, BarChart, Line, LineChart,
  PolarAngleAxis, PolarGrid, PolarRadiusAxis,
  Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  Brain, BookOpenText, Building2, Globe2, Landmark,
  MessageSquare, Play, ShieldCheck, Sparkles,
  Users, Vote, WalletCards, ArrowRight, FlaskConical,
} from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

// ─── Types ────────────────────────────────────────────────────────────────────
type DiscussionPost = { id: string; name: string; tag: string; text: string };
type TabId = "map" | "sim" | "quiz" | "forum";

// ─── Data ─────────────────────────────────────────────────────────────────────
const tabs: { id: TabId; label: string }[] = [
  { id: "map",   label: "Systems Map" },
  { id: "sim",   label: "Simulation"  },
  { id: "quiz",  label: "Quiz"        },
  { id: "forum", label: "Dialogue"    },
];

const systems = [
  {
    key: "economy", title: "Economic System", href: "/learn",
    icon: WalletCards,
    cardBg:   "bg-amber-50  dark:bg-amber-950/40",
    border:   "border-amber-200 dark:border-amber-800/50",
    illoBg:   "bg-amber-100 dark:bg-amber-900/30",
    iconBg:   "bg-amber-100 dark:bg-amber-900/50",
    accent:   "text-amber-700 dark:text-amber-400",
    bug:      "The system measures output and consumption better than human flourishing.",
    alt:      "Wellbeing metrics, baseline security, and lower dependence on endless growth.",
    question: "What if the economy optimised health, time, housing, and meaning?",
  },
  {
    key: "politics", title: "Politics & Democracy", href: "/learn",
    icon: Landmark,
    cardBg:   "bg-rose-50  dark:bg-rose-950/40",
    border:   "border-rose-200 dark:border-rose-800/50",
    illoBg:   "bg-rose-100 dark:bg-rose-900/30",
    iconBg:   "bg-rose-100 dark:bg-rose-900/50",
    accent:   "text-rose-700 dark:text-rose-400",
    bug:      "Periodic elections are too weak for continuous, high-complexity decisions.",
    alt:      "Citizens' assemblies, liquid democracy, and lobbying transparency.",
    question: "How can citizens contribute continuously without creating chaos?",
  },
  {
    key: "cities", title: "Cities & Everyday Life", href: "/learn",
    icon: Building2,
    cardBg:   "bg-cyan-50  dark:bg-cyan-950/40",
    border:   "border-cyan-200 dark:border-cyan-800/50",
    illoBg:   "bg-cyan-100 dark:bg-cyan-900/30",
    iconBg:   "bg-cyan-100 dark:bg-cyan-900/50",
    accent:   "text-cyan-700 dark:text-cyan-400",
    bug:      "Cities are optimised for cars, speculation, and consumption instead of people.",
    alt:      "15-minute neighbourhoods, civic green space, mixed-use blocks.",
    question: "How different would daily life feel if urban design reduced stress?",
  },
  {
    key: "information", title: "Media & Information", href: "/learn",
    icon: Brain,
    cardBg:   "bg-violet-50  dark:bg-violet-950/40",
    border:   "border-violet-200 dark:border-violet-800/50",
    illoBg:   "bg-violet-100 dark:bg-violet-900/30",
    iconBg:   "bg-violet-100 dark:bg-violet-900/50",
    accent:   "text-violet-700 dark:text-violet-400",
    bug:      "Attention becomes the product, so systems reward outrage and shallow conflict.",
    alt:      "Critical-thinking tools, argument maps, evidence scoring, slower dialogue.",
    question: "How do we train societies to think systemically?",
  },
];

const quizQuestions = [
  { answer: 1, question: "Which goal is closest to the spirit of Society Lab?",
    options: ["Find who to blame", "Design better systems", "Help one ideology win"] },
  { answer: 1, question: "What best reduces the risk of an echo chamber?",
    options: ["Let only like-minded people in", "Steelman the opposing view", "Ban disagreement"] },
  { answer: 0, question: "What metric should sit next to GDP?",
    options: ["Wellbeing", "Number of ads", "Hours of scrolling"] },
];

const starterDiscussion: DiscussionPost[] = [
  { id: "1", name: "Citizen A", tag: "Economy",
    text: "If we only measure GDP, we hide the cost of stress, ill health, and social isolation." },
  { id: "2", name: "Citizen B", tag: "Democracy",
    text: "Participation needs structure. Without it, dialogue becomes noise instead of collective intelligence." },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }
function scoreLabel(v: number) {
  if (v >= 75) return "Strong";
  if (v >= 55) return "Moderate";
  if (v >= 35) return "Fragile";
  return "Critical";
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function SliderControl({ label, value, setValue, min = 0, max = 100, suffix = "%" }: {
  label: string; value: number; setValue: (v: number) => void;
  min?: number; max?: number; suffix?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-slate-600 dark:text-slate-400">{label}</span>
        <span className="font-semibold text-slate-800 dark:text-slate-200">{value}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} value={value}
        onChange={e => setValue(Number(e.target.value))}
        className="w-full accent-[#a51c30] cursor-pointer" />
    </div>
  );
}

function MetricCard({ icon: Icon, title, value }: { icon: React.ElementType; title: string; value: number }) {
  const label = scoreLabel(value);
  const c = value >= 75 ? "text-emerald-600 dark:text-emerald-400"
    : value >= 55 ? "text-amber-600 dark:text-amber-400"
    : value >= 35 ? "text-orange-600 dark:text-orange-400"
    : "text-rose-600 dark:text-rose-400";
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-slate-400 dark:text-slate-500" />
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{title}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-slate-900 dark:text-white">{Math.round(value)}</span>
        <span className={`text-xs font-semibold mb-0.5 ${c}`}>{label}</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-700">
        <div className="h-1.5 rounded-full bg-[#a51c30] transition-all duration-500" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

// Mini SVG illustrations for domain cards
function DomainIllo({ k }: { k: string }) {
  if (k === "economy") return (
    <svg viewBox="0 0 100 70" className="w-full h-full" aria-hidden>
      <path d="M10 55 C25 45 35 58 50 40 C60 28 72 33 90 18"
        fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="10" y="58" width="10" height="12" rx="2" fill="#fbbf24" opacity="0.7" />
      <rect x="26" y="50" width="10" height="20" rx="2" fill="#f59e0b" opacity="0.7" />
      <rect x="42" y="43" width="10" height="27" rx="2" fill="#d97706" opacity="0.7" />
      <circle cx="90" cy="18" r="5" fill="#f97316" />
      <circle cx="90" cy="18" r="10" fill="#f97316" opacity="0.2" />
    </svg>
  );
  if (k === "politics") return (
    <svg viewBox="0 0 100 70" className="w-full h-full" aria-hidden>
      <circle cx="50" cy="35" r="8" fill="#e11d48" opacity="0.25" />
      <circle cx="50" cy="35" r="4" fill="#e11d48" opacity="0.7" />
      {[[20,18],[80,18],[15,52],[85,52],[50,8],[50,62]].map(([x,y],i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="4" fill="#f43f5e" opacity="0.7" />
          <line x1="50" y1="35" x2={x} y2={y} stroke="#e11d48" strokeWidth="1.5" opacity="0.4" />
        </g>
      ))}
    </svg>
  );
  if (k === "cities") return (
    <svg viewBox="0 0 100 70" className="w-full h-full" aria-hidden>
      <rect x="8"  y="40" width="14" height="30" rx="2" fill="#67e8f9" opacity="0.6" />
      <rect x="25" y="30" width="18" height="40" rx="2" fill="#22d3ee" opacity="0.7" />
      <rect x="46" y="18" width="20" height="52" rx="2" fill="#06b6d4" opacity="0.75" />
      <polygon points="56,8 56,20 46,20" fill="#0891b2" opacity="0.7" />
      <circle cx="56" cy="6" r="3" fill="#fbbf24" opacity="0.9" />
      <rect x="70" y="35" width="16" height="35" rx="2" fill="#67e8f9" opacity="0.6" />
      <line x1="56" y1="6" x2="25" y2="30" stroke="#fbbf24" strokeWidth="1" opacity="0.5" />
      <line x1="56" y1="6" x2="78" y2="35" stroke="#fbbf24" strokeWidth="1" opacity="0.5" />
    </svg>
  );
  return (
    <svg viewBox="0 0 100 70" className="w-full h-full" aria-hidden>
      <circle cx="50" cy="35" r="24" fill="none" stroke="#a78bfa" strokeWidth="1.5" opacity="0.5" />
      <circle cx="50" cy="35" r="14" fill="none" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.4" />
      <circle cx="50" cy="35" r="6"  fill="#7c3aed" opacity="0.4" />
      <ellipse cx="50" cy="35" rx="24" ry="10" fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.4" />
      {[[50,11],[74,35],[50,59],[26,35]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#c4b5fd" opacity="0.8" />
      ))}
    </svg>
  );
}

// Hero SVG fallback
function HeroFallback() {
  return (
    <div className="w-full py-16 flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-950">
      <svg viewBox="0 0 520 240" className="w-full max-w-lg" aria-hidden>
        <defs>
          <radialGradient id="fg" cx="55%" cy="55%" r="45%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#fef3c7" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="270" cy="130" rx="130" ry="100" fill="url(#fg)" />
        <rect x="80"  y="115" width="35" height="125" rx="3" fill="#c7a88a" />
        <rect x="128" y="90"  width="48" height="150" rx="3" fill="#b8906e" />
        <rect x="214" y="55"  width="58" height="185" rx="3" fill="#d4956a" />
        <polygon points="243,35 243,58 232,58" fill="#c8784a" opacity="0.8" />
        <circle cx="243" cy="32" r="6" fill="#f59e0b" opacity="0.9" />
        <circle cx="243" cy="32" r="14" fill="#f59e0b" opacity="0.2" />
        <rect x="288" y="78"  width="50" height="162" rx="3" fill="#c09070" />
        <rect x="356" y="100" width="44" height="140" rx="3" fill="#b8876a" />
        <rect x="413" y="118" width="38" height="122" rx="3" fill="#c49878" />
        <line x1="243" y1="32" x2="152" y2="90"  stroke="#f59e0b" strokeWidth="1.5" opacity="0.5" />
        <line x1="243" y1="32" x2="313" y2="78"  stroke="#f59e0b" strokeWidth="1.5" opacity="0.5" />
        <line x1="243" y1="32" x2="432" y2="118" stroke="#f59e0b" strokeWidth="1"   opacity="0.3" />
        <rect x="60" y="238" width="400" height="3" rx="2" fill="#e8d5c0" opacity="0.5" />
      </svg>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function SocietyLabLanding() {
  const [activeTab, setActiveTab] = useState<TabId>("map");
  const [ubi, setUbi]           = useState(50);
  const [workweek, setWork]     = useState(40);
  const [transparency, setTrans]= useState(50);
  const [greenCities, setGreen] = useState(50);
  const [education, setEdu]     = useState(50);
  const [community, setCom]     = useState(50);
  const [quizIndex, setQI]      = useState(0);
  const [quizScore, setQS]      = useState(0);
  const [selAns, setSelAns]     = useState<number | null>(null);
  const [discussion, setDisc]   = useState<DiscussionPost[]>(starterDiscussion);
  const [newPost, setNewPost]   = useState("");

  const metrics = useMemo(() => {
    const wellbeing  = clamp(35 + ubi * 0.25 + (55 - workweek) * 0.5 + greenCities * 0.15 + community * 0.1, 0, 100);
    const democracy  = clamp(30 + transparency * 0.35 + community * 0.3 + education * 0.2, 0, 100);
    const stability  = clamp(25 + ubi * 0.15 + transparency * 0.2 + community * 0.2 + greenCities * 0.1 + education * 0.1, 0, 100);
    const inequality = clamp(80 - ubi * 0.4 - transparency * 0.15 - education * 0.1, 0, 100);
    const innovation = clamp(30 + education * 0.3 + ubi * 0.1 + (55 - workweek) * 0.4, 0, 100);
    const ecology    = clamp(20 + greenCities * 0.5 + (55 - workweek) * 0.3 + education * 0.1, 0, 100);
    const timeline   = Array.from({ length: 9 }, (_, i) => ({
      year: 2025 + i,
      Wellbeing: clamp(wellbeing + i * (community * 0.05 - 1.5), 0, 100),
      Stability:  clamp(stability  + i * (transparency * 0.04 - 1), 0, 100),
      Ecology:    clamp(ecology    + i * (greenCities * 0.06 - 2), 0, 100),
    }));
    return { wellbeing, democracy, stability, inequality, innovation, ecology, timeline };
  }, [ubi, workweek, transparency, greenCities, education, community]);

  const radarData = [
    { metric: "Wellbeing",  value: metrics.wellbeing  },
    { metric: "Democracy",  value: metrics.democracy  },
    { metric: "Stability",  value: metrics.stability  },
    { metric: "Innovation", value: metrics.innovation },
    { metric: "Ecology",    value: metrics.ecology    },
    { metric: "Equality",   value: 100 - metrics.inequality },
  ];

  function addPost() {
    if (!newPost.trim()) return;
    setDisc(d => [...d, { id: String(Date.now()), name: "You", tag: "New", text: newPost.trim() }]);
    setNewPost("");
  }

  function answerQuiz(idx: number) {
    setSelAns(idx);
    const ok = idx === quizQuestions[quizIndex].answer;
    window.setTimeout(() => {
      if (ok) setQS(s => s + 1);
      setSelAns(null);
      setQI(i => (i + 1) % quizQuestions.length);
    }, 450);
  }

  const NAV_LINKS = [
    { href: "/learn",       label: "Learn"      },
    { href: "/study",       label: "Library"    },
    { href: "/simulator",   label: "Simulate"   },
    { href: "/discussions", label: "Discuss"    },
    { href: "/governance",  label: "Governance" },
    { href: "/map",         label: "Map"        },
  ];

  return (
    <div className="relative -mx-4 -my-6 overflow-hidden md:-mx-8 bg-[#f5f0ea] dark:bg-slate-950 text-slate-900 dark:text-slate-100">

      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-amber-200/30 dark:bg-cyan-500/8 blur-3xl" />
        <div className="absolute -left-32 top-[40rem] h-80 w-80 rounded-full bg-rose-200/20 dark:bg-amber-500/6 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">

        {/* ══ NAV ══════════════════════════════════════════════════════════════ */}
        <nav className="flex flex-wrap items-center justify-between gap-3 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-amber-300/40 dark:border-cyan-300/20 bg-amber-400/10 dark:bg-cyan-400/10 p-2.5">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-amber-600 dark:text-cyan-300 fill-none stroke-current" strokeWidth="1.8">
                <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
              </svg>
            </div>
            <div>
              <div className="text-base font-bold text-slate-900 dark:text-slate-100">Society Lab</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">{"Let's Change the World"}</div>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-wrap">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href}
                className="hidden lg:inline-flex items-center text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2.5 py-1.5 rounded-xl hover:bg-white/70 dark:hover:bg-slate-800 transition-colors">
                {label}
              </Link>
            ))}
            <span className="inline-flex rounded-full border border-amber-400/30 bg-amber-100 dark:bg-amber-400/15 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-200">
              Alpha
            </span>
            <ThemeToggle />
            <Link href="/learn"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#a51c30] px-4 py-2 text-sm font-semibold text-white hover:bg-[#8b1a2b] transition-colors shadow-sm ml-1">
              Begin the experiment
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </nav>

        {/* ══ HERO IMAGE ═══════════════════════════════════════════════════════
             TO SWAP THE IMAGE:
               1. Drop any file into new_society/public/
               2. Change src="/hero.png" below to "/your-filename.jpg"
               3. Supported: JPG, PNG, WebP — any aspect ratio works
        ═══════════════════════════════════════════════════════════════════════ */}
        <section className="space-y-5 pb-4">
          <div className="w-full rounded-[2rem] overflow-hidden border border-slate-200/80 dark:border-slate-700 shadow-[0_20px_60px_rgba(0,0,0,0.10)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
            {/* ↓↓ HERO IMAGE — change src to swap ↓↓ */}
            <img
              src="/hero.png"
              alt="Society Lab — designing better systems"
              className="w-full h-auto block"
              onError={e => {
                const img = e.currentTarget as HTMLImageElement;
                img.style.display = "none";
                const fb = img.nextElementSibling as HTMLElement | null;
                if (fb) fb.style.display = "block";
              }}
            />
            <div style={{ display: "none" }}>
              <HeroFallback />
            </div>
          </div>

          {/* Text + CTAs below image */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a51c30] dark:text-amber-400">
                A civic intelligence lab
              </p>
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                Explore the bugs in today's economic, political, urban, and informational systems — then test alternatives through simulations, dialogue, and civic design tools.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => { setActiveTab("sim"); document.getElementById("demo-section")?.scrollIntoView({ behavior: "smooth" }); }}
                className="inline-flex items-center gap-2 rounded-xl bg-[#a51c30] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#8b1a2b] transition-colors shadow-sm">
                <FlaskConical className="h-4 w-4" />
                Try the simulator
              </button>
              <Link href="/learn"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 transition-colors">
                <BookOpenText className="h-4 w-4" />
                Explore modules
              </Link>
              {/* Stats */}
              <div className="hidden sm:flex items-center gap-5 ml-2">
                {[["12+", "Modules"], ["10+", "Simulators"], ["4", "Domains"]].map(([n, l]) => (
                  <div key={l} className="text-center">
                    <div className="text-lg font-bold text-slate-900 dark:text-white">{n}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ FOUR DOMAINS ═════════════════════════════════════════════════════ */}
        <section className="py-8 space-y-6">
          <div className="text-center space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a51c30] dark:text-amber-400">Four domains</p>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">The systems shaping your world</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {systems.map(s => {
              const Icon = s.icon;
              return (
                <Link key={s.key} href={s.href}
                  className={`group flex flex-col rounded-[1.5rem] border overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${s.cardBg} ${s.border}`}>
                  {/* Illustration area */}
                  <div className={`${s.illoBg} h-24 flex items-center justify-center p-4`}>
                    <DomainIllo k={s.key} />
                  </div>
                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-xl ${s.iconBg}`}>
                        <Icon className={`h-3.5 w-3.5 ${s.accent}`} />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{s.title}</h3>
                    </div>
                    <p className="text-xs leading-5 text-slate-600 dark:text-slate-400 flex-1 line-clamp-2">{s.bug}</p>
                    <div className={`mt-3 flex items-center gap-1 text-xs font-semibold ${s.accent} group-hover:gap-2 transition-all`}>
                      Explore <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ══ INTERACTIVE DEMO ════════════════════════════════════════════════ */}
        <section id="demo-section" className="pb-16 space-y-5">
          <div className="text-center space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a51c30] dark:text-amber-400">Live demo</p>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Explore &amp; experiment</h2>
          </div>

          <div className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-4 gap-1 pt-3">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 text-sm font-medium rounded-t-xl transition-colors ${
                    activeTab === tab.id
                      ? "bg-white dark:bg-slate-900 text-[#a51c30] dark:text-amber-400 border-t border-x border-slate-200 dark:border-slate-700 -mb-px"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-5 md:p-8">

              {/* Systems Map */}
              {activeTab === "map" && (
                <div className="grid gap-4 md:grid-cols-2">
                  {systems.map(s => {
                    const Icon = s.icon;
                    return (
                      <div key={s.key} className={`rounded-2xl border p-5 space-y-3 ${s.cardBg} ${s.border}`}>
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.iconBg}`}>
                            <Icon className={`h-4 w-4 ${s.accent}`} />
                          </div>
                          <h3 className="font-bold text-slate-900 dark:text-slate-100">{s.title}</h3>
                        </div>
                        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                          <p><span className="font-semibold text-rose-600 dark:text-rose-400">Bug:</span> {s.bug}</p>
                          <p><span className="font-semibold text-emerald-600 dark:text-emerald-400">Alternative:</span> {s.alt}</p>
                          <p><span className="font-semibold text-amber-600 dark:text-amber-300">Question:</span> {s.question}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Simulation */}
              {activeTab === "sim" && (
                <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Policy Sandbox</h2>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Adjust levers and watch indicators respond.</p>
                    </div>
                    <div className="space-y-4">
                      <SliderControl label="Baseline economic security" value={ubi} setValue={setUbi} />
                      <SliderControl label="Work hours per week" min={25} max={55} suffix="h" value={workweek} setValue={setWork} />
                      <SliderControl label="Institutional transparency" value={transparency} setValue={setTrans} />
                      <SliderControl label="Green cities / public space" value={greenCities} setValue={setGreen} />
                      <SliderControl label="Critical education" value={education} setValue={setEdu} />
                      <SliderControl label="Community participation" value={community} setValue={setCom} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <MetricCard icon={Users}      title="Wellbeing"  value={metrics.wellbeing} />
                      <MetricCard icon={Vote}       title="Democracy"  value={metrics.democracy} />
                      <MetricCard icon={ShieldCheck} title="Stability" value={metrics.stability} />
                    </div>
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
                      <h3 className="mb-4 text-sm font-bold text-slate-800 dark:text-slate-100">Eight-year trajectory</h3>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={metrics.timeline}>
                            <XAxis dataKey="year" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                            <YAxis domain={[0, 100]} stroke="#94a3b8" tick={{ fontSize: 11 }} />
                            <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 12 }} />
                            <Line dataKey="Wellbeing" dot={false} stroke="#a51c30" strokeWidth={2} type="monotone" />
                            <Line dataKey="Stability"  dot={false} stroke="#f59e0b" strokeWidth={2} type="monotone" />
                            <Line dataKey="Ecology"    dot={false} stroke="#34d399" strokeWidth={2} type="monotone" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
                        <h3 className="mb-3 text-sm font-bold text-slate-800 dark:text-slate-100">System radar</h3>
                        <div className="h-44">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={radarData}>
                              <PolarGrid stroke="#e2e8f0" />
                              <PolarAngleAxis dataKey="metric" tick={{ fill: "#64748b", fontSize: 10 }} />
                              <PolarRadiusAxis axisLine={false} domain={[0, 100]} tick={false} />
                              <Radar dataKey="value" fill="#a51c30" fillOpacity={0.2} stroke="#a51c30" strokeWidth={1.5} />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
                        <h3 className="mb-3 text-sm font-bold text-slate-800 dark:text-slate-100">Trade-offs</h3>
                        <div className="h-44">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                              { name: "Inequality", value: Math.round(metrics.inequality) },
                              { name: "Innovation", value: Math.round(metrics.innovation) },
                              { name: "Ecology",    value: Math.round(metrics.ecology)    },
                            ]}>
                              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                              <YAxis domain={[0, 100]} stroke="#94a3b8" tick={{ fontSize: 11 }} />
                              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 12 }} />
                              <Bar dataKey="value" fill="#a51c30" radius={[6, 6, 0, 0]} opacity={0.8} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quiz */}
              {activeTab === "quiz" && (
                <div className="mx-auto max-w-2xl space-y-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Systems Thinking Quiz</h2>
                    <span className="rounded-full bg-[#a51c30]/10 border border-[#a51c30]/20 px-3 py-1 text-xs font-semibold text-[#a51c30] dark:text-rose-300">
                      Score {quizScore}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className="h-1.5 rounded-full bg-[#a51c30] transition-all"
                      style={{ width: `${((quizIndex + 1) / quizQuestions.length) * 100}%` }} />
                  </div>
                  <p className="text-base font-medium text-slate-800 dark:text-slate-100">
                    {quizQuestions[quizIndex].question}
                  </p>
                  <div className="space-y-3">
                    {quizQuestions[quizIndex].options.map((opt, i) => (
                      <button key={opt} onClick={() => answerQuiz(i)}
                        className={`w-full text-left rounded-2xl border px-5 py-3.5 text-sm font-medium transition-all ${
                          selAns === i
                            ? "border-[#a51c30] bg-[#a51c30]/8 text-[#a51c30]"
                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#a51c30]/40"
                        }`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dialogue */}
              {activeTab === "forum" && (
                <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
                  <div className="space-y-3">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Structured dialogue</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-5">
                      Each contribution should connect to a problem, evidence, a counterargument, and a possible test.
                    </p>
                    <input
                      className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-[#a51c30] transition"
                      placeholder="Topic or proposal title" />
                    <textarea
                      className="w-full min-h-24 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-[#a51c30] transition resize-none"
                      onChange={e => setNewPost(e.target.value)}
                      placeholder="Write a proposal, question, or counterpoint..."
                      value={newPost} />
                    <button onClick={addPost}
                      className="w-full rounded-2xl bg-[#a51c30] px-4 py-3 text-sm font-semibold text-white hover:bg-[#8b1a2b] transition-colors">
                      Publish
                    </button>
                  </div>
                  <div className="space-y-3">
                    {discussion.map(post => (
                      <div key={post.id}
                        className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{post.name}</span>
                          <span className="rounded-full border border-slate-200 dark:border-slate-700 px-2.5 py-0.5 text-[10px] text-slate-500 dark:text-slate-400">{post.tag}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{post.text}</p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {["Evidence", "Counterargument", "Simulation", "Action"].map(l => (
                            <span key={l} className="rounded-lg border border-slate-200 dark:border-slate-600 px-2 py-0.5 text-[10px] text-slate-500 dark:text-slate-400">+ {l}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
