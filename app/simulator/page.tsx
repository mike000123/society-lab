import Link from "next/link";
import {
  ArrowRight, FlaskConical, Globe, Landmark, TrendingDown,
  TrendingUp, Users, Wallet, Zap, BarChart3, ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SimulatorEntry {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  accent: "emerald" | "rose" | "amber" | "violet" | "cyan" | "orange" | "teal";
  icon: React.ElementType;
  tags: string[];
  complexity: "Introductory" | "Intermediate" | "Advanced";
  featured?: boolean;
}

const SIMULATORS: SimulatorEntry[] = [
  {
    slug: "/simulator/world3",
    title: "Civilisation Simulator",
    tagline: "World3 system dynamics model",
    description: "Shape the future of civilisation across 200 years. Adjust resource efficiency, pollution controls, agricultural technology, and public health investment to see how the world trajectory changes compared to business as usual.",
    accent: "emerald",
    icon: Globe,
    tags: ["Systems thinking", "Resources", "Population", "Welfare"],
    complexity: "Advanced",
    featured: true,
  },
  {
    slug: "/simulator/bank-run",
    title: "Bank Run Simulator",
    tagline: "Bank Run Dynamics",
    description: "Bank runs are self-fulfilling prophecies. If enough depositors believe a bank will fail, their simultaneous withdrawal makes it fail — regardless of underlying solvency. Adjust reserve ratios, deposit insurance, and central bank response speed.",
    accent: "rose",
    icon: TrendingDown,
    tags: ["Banking", "Contagion", "Deposit insurance", "Central bank"],
    complexity: "Intermediate",
  },
  {
    slug: "/simulator/svb-crisis",
    title: "SVB Collapse 2023",
    tagline: "Silicon Valley Bank Crisis",
    description: "SVB collapsed in 36 hours in March 2023 — the fastest large bank failure in US history. Adjust duration mismatch, uninsured deposit concentration, VC herd behaviour, and social media amplification to see how the panic unfolded.",
    accent: "amber",
    icon: Zap,
    tags: ["Banking", "Duration risk", "Social media", "Contagion"],
    complexity: "Intermediate",
  },
  {
    slug: "/simulator/financial-crisis",
    title: "Financial Crisis Simulator",
    tagline: "Leverage & Contagion Model",
    description: "Cheap credit inflates an asset bubble, leverage amplifies the gains — then amplifies the collapse. Shadow banks accelerate both phases. Model the 2008 playbook and see how regulation and policy response change the outcome.",
    accent: "orange",
    icon: TrendingDown,
    tags: ["Banking", "Leverage", "Bubble", "Shadow banking"],
    complexity: "Advanced",
  },
  {
    slug: "/simulator/macro-economy",
    title: "Macro Economy Lab",
    tagline: "IS-LM / New Keynesian model",
    description: "A full macroeconomic simulator with fiscal policy, monetary policy, Phillips curve, Okun's law, exchange rates, and debt dynamics. Run 10-year projections across six historical scenarios — from stagflation to the 2008 recession.",
    accent: "emerald",
    icon: BarChart3,
    tags: ["Macro", "Fiscal policy", "Monetary policy", "Phillips curve", "Debt"],
    complexity: "Advanced",
    featured: true,
  },
  {
    slug: "/simulator/wealth-gap",
    title: "The Wealth Gap",
    tagline: "Piketty r > g in motion",
    description: "When capital returns exceed wage growth, wealth concentrates regardless of individual effort. See how tax rates, offshore structures, and union density change the trajectory of inequality over decades.",
    accent: "violet",
    icon: TrendingUp,
    tags: ["Inequality", "Capital", "Taxation", "Wages"],
    complexity: "Intermediate",
  },
  {
    slug: "/simulator/debt",
    title: "Debt vs Savings",
    tagline: "Compound interest mechanics",
    description: "Compound interest is the most powerful force in personal finance — it works against you on debt while working for you on savings. See how interest rates, payment sizes, and time interact to shape your net worth.",
    accent: "rose",
    icon: Wallet,
    tags: ["Personal finance", "Debt", "Compound interest"],
    complexity: "Introductory",
  },
  {
    slug: "/simulator/purchasing-power",
    title: "Your Purchasing Power",
    tagline: "Inflation & income erosion",
    description: "Set your income and the economic conditions around you. See how inflation, energy shocks, interest rates, and housing costs eat into your real disposable income over 20 years.",
    accent: "amber",
    icon: Wallet,
    tags: ["Inflation", "Housing", "Energy", "Personal finance"],
    complexity: "Introductory",
  },
  {
    slug: "/simulator/political-talent",
    title: "Political Talent Barriers",
    tagline: "Why capable people stay out of politics",
    description: "Five structural barriers — dynasties, party monopolies, salary gaps, class exclusion, and gender exclusion — filter out capable candidates before voters ever get a choice. Adjust each blocker and see how government quality, public service, and citizen wellbeing degrade over 20 years, with or without the Casel-Morelli feedback spiral.",
    accent: "amber",
    icon: ShieldAlert,
    tags: ["Governance", "Institutions", "Entry barriers", "Casel-Morelli"],
    complexity: "Intermediate",
    featured: true,
  },
  {
    slug: "/simulator/social-movements",
    title: "Social Movement Lab",
    tagline: "Why movements succeed or fail",
    description: "Test why one movement breaks through while another stalls. The model compares how communication shifts, organisation, coalitions, repression, elite splits, and institutional access determine whether change happens.",
    accent: "cyan",
    icon: Users,
    tags: ["Politics", "Collective action", "Coalitions", "Change"],
    complexity: "Intermediate",
  },
  {
    slug: "/simulator/eu-decision-making",
    title: "EU Legislative Process",
    tagline: "Ordinary procedure simulator",
    description: "Route a Commission proposal through EP committees, Council qualified majority voting, trilogue negotiations, and national transposition. Adjust member-state alignment, QMV threshold, and institutional flexibility to see how EU law is made — or stalled.",
    accent: "violet",
    icon: Landmark,
    tags: ["EU governance", "QMV", "Trilogue", "Institutional design"],
    complexity: "Intermediate",
  },
  {
    slug: "/simulator/us-decision-making",
    title: "US Legislative Process",
    tagline: "Congress & the White House",
    description: "Move a bill through House committee, Senate cloture, bicameral conference, and presidential veto. Adjust party polarization, Senate majority size, the filibuster threshold, and executive action tendency to see where the US system succeeds or gridlocks.",
    accent: "amber",
    icon: Landmark,
    tags: ["US Congress", "Filibuster", "Veto", "Polarization"],
    complexity: "Intermediate",
  },
];

const ACCENT = {
  emerald: { glow: "from-emerald-400/14 via-emerald-400/4 to-transparent", border: "border-emerald-400/30", bg: "bg-emerald-400/8", badge: "border-emerald-300/25 bg-emerald-400/10 text-emerald-100", icon: "text-emerald-300 border-emerald-300/20 bg-emerald-400/10", tag: "border-emerald-800 bg-emerald-950/40 text-emerald-400", btn: "border-emerald-400/40 text-emerald-200 hover:bg-emerald-400/10" },
  rose:    { glow: "from-rose-400/14 via-rose-400/4 to-transparent",    border: "border-rose-400/30",    bg: "bg-rose-400/8",    badge: "border-rose-300/25 bg-rose-400/10 text-rose-100",       icon: "text-rose-300 border-rose-300/20 bg-rose-400/10",       tag: "border-rose-800 bg-rose-950/40 text-rose-400",       btn: "border-rose-400/40 text-rose-200 hover:bg-rose-400/10"    },
  amber:   { glow: "from-amber-400/14 via-amber-400/4 to-transparent",   border: "border-amber-400/30",   bg: "bg-amber-400/8",   badge: "border-amber-300/25 bg-amber-400/10 text-amber-100",     icon: "text-amber-300 border-amber-300/20 bg-amber-400/10",     tag: "border-amber-800 bg-amber-950/40 text-amber-400",     btn: "border-amber-400/40 text-amber-200 hover:bg-amber-400/10"   },
  violet:  { glow: "from-violet-400/14 via-violet-400/4 to-transparent", border: "border-violet-400/30", bg: "bg-violet-400/8", badge: "border-violet-300/25 bg-violet-400/10 text-violet-100",   icon: "text-violet-300 border-violet-300/20 bg-violet-400/10",   tag: "border-violet-800 bg-violet-950/40 text-violet-400",   btn: "border-violet-400/40 text-violet-200 hover:bg-violet-400/10" },
  cyan:    { glow: "from-cyan-400/14 via-cyan-400/4 to-transparent",     border: "border-cyan-400/30",   bg: "bg-cyan-400/8",   badge: "border-cyan-300/25 bg-cyan-400/10 text-cyan-100",         icon: "text-cyan-300 border-cyan-300/20 bg-cyan-400/10",         tag: "border-cyan-800 bg-cyan-950/40 text-cyan-400",         btn: "border-cyan-400/40 text-cyan-200 hover:bg-cyan-400/10"     },
  orange:  { glow: "from-orange-400/14 via-orange-400/4 to-transparent", border: "border-orange-400/30", bg: "bg-orange-400/8", badge: "border-orange-300/25 bg-orange-400/10 text-orange-100",   icon: "text-orange-300 border-orange-300/20 bg-orange-400/10",   tag: "border-orange-800 bg-orange-950/40 text-orange-400",   btn: "border-orange-400/40 text-orange-200 hover:bg-orange-400/10" },
  teal:    { glow: "from-teal-400/14 via-teal-400/4 to-transparent",     border: "border-teal-400/30",   bg: "bg-teal-400/8",   badge: "border-teal-300/25 bg-teal-400/10 text-teal-100",         icon: "text-teal-300 border-teal-300/20 bg-teal-400/10",         tag: "border-teal-800 bg-teal-950/40 text-teal-400",         btn: "border-teal-400/40 text-teal-200 hover:bg-teal-400/10"     },
};

const COMPLEXITY_COLOR: Record<SimulatorEntry["complexity"], string> = {
  Introductory: "border-emerald-700/50 bg-emerald-900/20 text-emerald-300",
  Intermediate: "border-amber-700/50 bg-amber-900/20 text-amber-300",
  Advanced:     "border-rose-700/50 bg-rose-900/20 text-rose-300",
};

const GROUPS: { label: string; description: string; slugs: string[] }[] = [
  { label: "Macro Systems",                  description: "Long-run civilisational and planetary dynamics",              slugs: ["/simulator/world3"] },
  { label: "Banking & Financial Crises",     description: "How banks fail, bubbles burst, and contagion spreads",        slugs: ["/simulator/bank-run", "/simulator/svb-crisis", "/simulator/financial-crisis"] },
  { label: "Economics & Personal Finance",   description: "Inequality, debt, inflation, and purchasing power",           slugs: ["/simulator/macro-economy", "/simulator/wealth-gap", "/simulator/debt", "/simulator/purchasing-power"] },
  { label: "Society & Politics",             description: "Collective action, movements, and political change",          slugs: ["/simulator/political-talent", "/simulator/social-movements", "/simulator/eu-decision-making", "/simulator/us-decision-making"] },
];

function SimCard({ sim }: { sim: SimulatorEntry }) {
  const a = ACCENT[sim.accent];
  const Icon = sim.icon;
  return (
    <article className={cn("relative flex flex-col overflow-hidden rounded-[1.75rem] border bg-slate-950/80 p-5 shadow-[0_18px_50px_rgba(2,8,23,0.2)] transition-all duration-200 hover:shadow-[0_20px_60px_rgba(2,8,23,0.3)]", sim.featured ? cn(a.border, a.bg) : "border-slate-800")}>
      <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b", a.glow)} />
      <div className="relative flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className={cn("flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border", a.icon)}><Icon className="h-5 w-5" /></div>
          <div className="flex flex-wrap gap-1.5">
            <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", COMPLEXITY_COLOR[sim.complexity])}>{sim.complexity}</span>
            {sim.featured && <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", a.badge)}>Featured</span>}
          </div>
        </div>
        <div className="mt-3">
          <p className={cn("text-[10px] font-medium uppercase tracking-[0.18em]", a.badge.split(" ").find((c: string) => c.startsWith("text-")))}>{sim.tagline}</p>
          <h2 className="mt-0.5 text-lg font-bold text-slate-50">{sim.title}</h2>
        </div>
        <p className="mt-2 flex-1 text-sm leading-6 text-slate-400 line-clamp-3">{sim.description}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {sim.tags.map((tag) => (<span key={tag} className={cn("rounded-lg border px-2 py-0.5 text-[10px]", a.tag)}>{tag}</span>))}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-800">
          <Link href={sim.slug} className={cn("inline-flex items-center gap-1.5 rounded-2xl border px-4 py-2 text-sm font-medium transition-colors", a.btn)}>
            Launch simulator <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function SimulatorHubPage() {
  const totalSims = SIMULATORS.length;
  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-12">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/85 p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-violet-400/12 via-violet-400/4 to-transparent" />
        <div className="relative grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-300/25 bg-violet-400/10 px-3 py-1 text-xs font-medium text-violet-100">
              <FlaskConical className="h-3.5 w-3.5" /> Simulation lab
            </span>
            <h1 className="text-3xl font-black tracking-tight text-slate-50 sm:text-4xl">Systems you can actually run</h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-300">
              Every simulator here is a working model of a real system — not an explainer, not an infographic. Move the sliders, load historical scenarios, and watch the feedback loops play out in real time.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 content-start">
            <div className="rounded-[1.5rem] border border-slate-800 bg-panel/85 px-4 py-4"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Simulators</p><p className="mt-2 text-3xl font-black text-slate-50">{totalSims}</p></div>
            <div className="rounded-[1.5rem] border border-slate-800 bg-panel/85 px-4 py-4"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Categories</p><p className="mt-2 text-3xl font-black text-slate-50">{GROUPS.length}</p></div>
            <div className="rounded-[1.5rem] border border-emerald-400/20 bg-emerald-400/8 px-4 py-4"><p className="text-xs uppercase tracking-[0.18em] text-emerald-400/70">Most complex</p><p className="mt-1 text-sm font-semibold text-emerald-200">World3 model</p></div>
            <div className="rounded-[1.5rem] border border-amber-400/20 bg-amber-400/8 px-4 py-4"><p className="text-xs uppercase tracking-[0.18em] text-amber-400/70">Start here</p><p className="mt-1 text-sm font-semibold text-amber-200">Debt vs Savings</p></div>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-3 text-xs text-slate-500">
        <span className="font-semibold text-slate-400 mr-1">Complexity:</span>
        {(["Introductory", "Intermediate", "Advanced"] as const).map((c) => (
          <span key={c} className={cn("rounded-full border px-2.5 py-1", COMPLEXITY_COLOR[c])}>{c}</span>
        ))}
        <span className="ml-2 text-slate-600">— start with Introductory if you are new to system thinking</span>
      </div>

      {GROUPS.map((group) => {
        const sims = group.slugs.map((slug) => SIMULATORS.find((s) => s.slug === slug)).filter(Boolean) as SimulatorEntry[];
        return (
          <section key={group.label} className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{group.description}</p>
              <h2 className="mt-1 text-2xl font-black text-slate-50">{group.label}</h2>
            </div>
            <div className={cn("grid gap-4", sims.length === 1 ? "grid-cols-1 max-w-2xl" : sims.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-3")}>
              {sims.map((sim) => <SimCard key={sim.slug} sim={sim} />)}
            </div>
          </section>
        );
      })}

      <section className="rounded-[2rem] border border-slate-800 bg-slate-950/60 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Want to go deeper?</p>
          <h2 className="text-xl font-black text-slate-50">Every simulator is linked to a learning module</h2>
          <p className="text-sm text-slate-400">The learning track explains the theory behind each model — causal loops, historical examples, and what the data actually shows.</p>
        </div>
        <Link href="/learn" className="flex-shrink-0 inline-flex items-center gap-2 rounded-2xl border border-slate-600 bg-slate-900 px-5 py-3 text-sm font-medium text-slate-200 transition-colors hover:border-slate-400 hover:text-slate-50">
          <Landmark className="h-4 w-4" /> Go to Learning hub <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </section>
    </div>
  );
}
