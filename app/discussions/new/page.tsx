"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bold,
  Bot,
  CheckCircle2,
  Italic,
  Link2,
  List,
  ListOrdered,
  Lightbulb,
  Loader2,
  MessageSquare,
  Quote,
  Search,
  Sparkles,
  Users,
  Vote,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  ACADEMIC_LEVEL_OPTIONS,
  EXPERTISE_DOMAIN_OPTIONS,
  PROFESSIONAL_STAGE_OPTIONS,
  summarizeBackgroundFilters,
} from "@/lib/community/profile-options";
import type { Database } from "@/lib/database.types";
import { learningModules } from "@/lib/learn/modules";
import { SIMULATORS } from "@/lib/simulator/data";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";
import { cn } from "@/lib/utils";

type ThreadParticipationMode = Database["public"]["Enums"]["thread_participation_mode"];

// ── Resources for "Related learning" step ─────────────────────────────────────

const ALL_RESOURCES = [
  ...learningModules.slice(0, 20).map((m) => ({
    id: m.slug,
    title: m.title,
    kind: "Module" as const,
    duration: m.readingTime ?? "15 min",
    // Drop a PNG named after the slug into public/atlas/modules/ to get a card image.
    // e.g. public/atlas/modules/how-banks-create-money.png
    imageSrc: `/atlas/modules/${m.slug}.png` as string | null,
    accent: m.accent,
  })),
  ...SIMULATORS.slice(0, 8).map((s) => ({
    id: s.slug,
    title: s.title,
    kind: "Simulation" as const,
    duration: "15 min",
    imageSrc: s.cardImageSrc ?? null,
    accent: "slate" as const,
  })),
];

// ── Sidebar data ───────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Question",         sub: "What are you trying to understand?"         },
  { id: 2, label: "Context",          sub: "Why does this question matter?"             },
  { id: 3, label: "Related learning", sub: "Add modules, simulations or proposals", optional: true },
  { id: 4, label: "Participation",    sub: "Choose how people can contribute"           },
  { id: 5, label: "AI assistance",    sub: "Get help structuring this deliberation", optional: true },
  { id: 6, label: "Review & create",  sub: "Confirm and launch"                        },
];

const TIPS = [
  { icon: "◎", text: "Be specific and answerable"            },
  { icon: "◎", text: "Focus on causes, impacts or solutions" },
  { icon: "◎", text: "Keep it neutral and open-minded"       },
];

const EXAMPLES = [
  "Why is wealth concentrating?",
  "How should money be created?",
  "Can growth and ecology coexist?",
];

const WHAT_NEXT = [
  { icon: MessageSquare, color: "bg-blue-50    border-blue-200    text-blue-600",    title: "Your question goes live",      body: "Anyone can discover and join."                          },
  { icon: Bot,           color: "bg-violet-50  border-violet-200  text-violet-600",  title: "AI suggests starting points",  body: "We'll propose key angles and resources."                },
  { icon: Users,         color: "bg-cyan-50    border-cyan-200    text-cyan-600",    title: "Community adds evidence",      body: "People contribute sources, examples, and experiences."  },
  { icon: Lightbulb,     color: "bg-amber-50   border-amber-200   text-amber-600",   title: "Understanding emerges",        body: "Together we build clarity, not just opinions."          },
  { icon: Vote,          color: "bg-emerald-50 border-emerald-200 text-emerald-600", title: "Proposals can be created",     body: "Strong syntheses become real governance proposals."     },
];

// ── Page ───────────────────────────────────────────────────────────────────────

export default function NewDiscussionPage() {
  const router  = useRouter();
  const supabase = useMemo(() => (hasSupabaseEnv ? createClient() : null), []);

  const [focusedStep, setFocusedStep]           = useState(1);
  const [title, setTitle]                       = useState("");
  const [context, setContext]                   = useState("");
  const [search, setSearch]                     = useState("");
  const [linked, setLinked]                     = useState<string[]>([]);
  const [mode, setMode]                         = useState<ThreadParticipationMode>("open");
  const [academicLevels, setAcademicLevels]     = useState<string[]>([]);
  const [profStages, setProfStages]             = useState<string[]>([]);
  const [expertiseDomains, setExpertiseDomains] = useState<string[]>([]);
  const [submitting, setSubmitting]             = useState(false);
  const [error, setError]                       = useState<string | null>(null);
  const [userId, setUserId]                     = useState<string | null>(null);

  const titleMax   = 120;
  const contextMax = 1000;

  const participationSummary = summarizeBackgroundFilters({
    academicLevels, expertiseDomains, professionalStages: profStages,
  });

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data: { user } }) => setUserId(user?.id ?? null));
  }, [supabase]);

  const filteredResources = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ALL_RESOURCES.slice(0, 8);
    return ALL_RESOURCES.filter((r) => r.title.toLowerCase().includes(q)).slice(0, 8);
  }, [search]);

  function toggleLinked(id: string) {
    setLinked((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  }
  function toggleArr(arr: string[], val: string, set: (v: string[]) => void) {
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  }

  async function handleSubmit() {
    if (!supabase || !title.trim() || !context.trim()) return;
    if (mode === "background_guided" && !academicLevels.length && !profStages.length && !expertiseDomains.length) {
      setError("Choose at least one filter for guided participation.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user?.id) {
      setError("Sign in to start a public discussion.");
      setSubmitting(false);
      return;
    }
    const { data, error: insertErr } = await supabase
      .from("threads")
      .insert({
        author_id: user.id,
        context_slug: null,
        context_type: "general" as Database["public"]["Enums"]["thread_context_type"],
        desired_academic_levels:    mode === "background_guided" ? academicLevels : [],
        desired_expertise_domains:  mode === "background_guided" ? expertiseDomains : [],
        desired_professional_stages: mode === "background_guided" ? profStages : [],
        kind: "public_discussion",
        participation_mode: mode,
        prompt: context.trim(),
        status: "open",
        title: title.trim(),
        visibility: "public",
      })
      .select("id")
      .single();
    setSubmitting(false);
    if (insertErr || !data) { setError(insertErr?.message ?? "Unable to create discussion."); return; }
    router.push(`/discussions?filter=all&thread=${data.id}#discussion-board`);
  }

  if (!hasSupabaseEnv) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Supabase is not configured — sign-in required to post.
      </div>
    );
  }

  // Derive progress
  const completedSteps = new Set<number>();
  if (title.trim())   completedSteps.add(1);
  if (context.trim()) completedSteps.add(2);
  if (focusedStep > 3) completedSteps.add(3);
  if (focusedStep > 4) completedSteps.add(4);
  if (focusedStep > 5) completedSteps.add(5);

  return (
    /* Full-page wrapper — no extra padding so we can have a sticky bottom bar */
    <div className="flex min-h-screen flex-col bg-[rgba(246,244,238,0.6)]">

      {/* ── 3-column body ─────────────────────────────────────────────── */}
      <div className="mx-auto grid w-full max-w-[88rem] flex-1 gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[15rem_minmax(0,1fr)_17rem] lg:items-start">

        {/* ── LEFT SIDEBAR ──────────────────────────────────────────── */}
        <aside className="hidden lg:block">
          <div className="sticky top-8 space-y-5">

            {/* Title block */}
            <div>
              <h1 className="text-xl font-bold text-slate-900">Start a deliberation</h1>
              <p className="mt-1.5 text-sm leading-6 text-slate-500">
                Ask a question. We'll help the community explore it together.
              </p>
            </div>

            {/* Step list */}
            <nav aria-label="Form steps" className="overflow-hidden rounded-[1.4rem] border border-[rgba(28,36,48,0.08)] bg-white shadow-[0_6px_20px_rgba(28,36,48,0.04)]">
              <ul>
                {STEPS.map((step, i) => {
                  const done    = completedSteps.has(step.id);
                  const current = step.id === focusedStep;
                  return (
                    <li
                      className={cn("border-b border-[rgba(28,36,48,0.06)] last:border-0", current && "bg-[rgba(59,130,246,0.04)]")}
                      key={step.id}
                    >
                      <button
                        className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                        onClick={() => setFocusedStep(step.id)}
                        type="button"
                      >
                        <span className={cn(
                          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition",
                          done    ? "bg-emerald-500 text-white"       :
                          current ? "bg-blue-600    text-white"        :
                                    "bg-slate-100   text-slate-500",
                        )}>
                          {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : step.id}
                        </span>
                        <div className="min-w-0 pt-0.5">
                          <p className={cn(
                            "text-sm font-semibold leading-5",
                            current ? "text-slate-900" : done ? "text-emerald-700" : "text-slate-500",
                          )}>
                            {step.label}
                            {step.optional ? <span className="ml-1 text-[10px] font-normal text-slate-400">(optional)</span> : null}
                          </p>
                          <p className="mt-0.5 text-[11px] leading-4 text-slate-400 line-clamp-1">{step.sub}</p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Tips */}
            <div className="rounded-[1.4rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4 shadow-[0_6px_20px_rgba(28,36,48,0.04)]">
              <p className="text-sm font-semibold text-slate-800">Tips for a great question</p>
              <ul className="mt-3 space-y-2">
                {TIPS.map(({ text }) => (
                  <li className="flex items-start gap-2 text-xs leading-5 text-slate-600" key={text}>
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Examples */}
            <div className="rounded-[1.4rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4 shadow-[0_6px_20px_rgba(28,36,48,0.04)]">
              <p className="text-sm font-semibold text-slate-800">Examples</p>
              <div className="mt-3 flex flex-col gap-2">
                {EXAMPLES.map((ex) => (
                  <button
                    className="rounded-full border border-[rgba(28,36,48,0.1)] bg-slate-50 px-3 py-2 text-left text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    key={ex}
                    onClick={() => { setTitle(ex); setFocusedStep(1); }}
                    type="button"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ── CENTRE: All steps always visible ──────────────────────── */}
        <main className="space-y-5 pb-28">

          {/* Close button — top right */}
          <div className="flex items-center justify-between lg:hidden">
            <h1 className="text-lg font-bold text-slate-900">Start a deliberation</h1>
            <Link
              aria-label="Cancel"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(28,36,48,0.1)] bg-white text-slate-500 transition hover:bg-slate-100"
              href="/discussions"
            >
              <X className="h-4 w-4" />
            </Link>
          </div>
          <div className="hidden items-center justify-end lg:flex">
            <Link
              aria-label="Cancel"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(28,36,48,0.1)] bg-white text-slate-500 transition hover:bg-slate-100"
              href="/discussions"
            >
              <X className="h-4 w-4" />
            </Link>
          </div>

          {/* ── Step 1: Question ────────────────────────────────────── */}
          <Section number={1} title="What are you trying to understand?" hint="Keep it short and focused." focused={focusedStep === 1} onFocus={() => setFocusedStep(1)}>
            <div className="flex gap-5">
              {/* Input side */}
              <div className="flex-1 space-y-2">
                <input
                  autoFocus
                  className="w-full rounded-[1.1rem] border border-[rgba(28,36,48,0.12)] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  maxLength={titleMax}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Why is housing becoming unaffordable?"
                  value={title}
                />
                <p className="text-right text-[11px] text-slate-400">{title.length}/{titleMax}</p>
              </div>
              {/* Illustration */}
              <div className="hidden w-36 shrink-0 overflow-hidden rounded-[1.1rem] sm:block">
                <Image
                  alt=""
                  className="h-full w-full object-cover"
                  height={120}
                  src="/atlas/discuss-hero2.png"
                  width={144}
                />
              </div>
            </div>
          </Section>

          {/* ── Step 2: Context ─────────────────────────────────────── */}
          <Section number={2} title="Why does this question matter?" hint="Describe the issue in your own words." focused={focusedStep === 2} onFocus={() => setFocusedStep(2)}>
            {/* Formatting toolbar (visual) */}
            <div className="flex items-center gap-0.5 rounded-t-[0.9rem] border border-b-0 border-[rgba(28,36,48,0.12)] bg-[rgba(246,244,238,0.7)] px-3 py-2">
              {[
                { Icon: Bold,         label: "Bold"          },
                { Icon: Italic,       label: "Italic"        },
                { Icon: List,         label: "Bullet list"   },
                { Icon: ListOrdered,  label: "Numbered list" },
                { Icon: Quote,        label: "Blockquote"    },
                { Icon: Link2,        label: "Link"          },
              ].map(({ Icon, label }) => (
                <button
                  aria-label={label}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition hover:bg-white hover:text-slate-800"
                  key={label}
                  type="button"
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>
            <textarea
              className="w-full resize-none rounded-b-[1.1rem] border border-[rgba(28,36,48,0.12)] bg-white px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              maxLength={contextMax}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Describe the issue, why it matters, and what kind of reasoning you want the community to bring..."
              rows={6}
              value={context}
            />
            <p className="text-right text-[11px] text-slate-400">{context.length}/{contextMax}</p>
          </Section>

          {/* ── Step 3: Related learning ─────────────────────────────── */}
          <Section number={3} title="Related learning" hint="Add resources that can help ground this discussion in knowledge." optional focused={focusedStep === 3} onFocus={() => setFocusedStep(3)}>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="w-full rounded-[1.1rem] border border-[rgba(28,36,48,0.12)] bg-white py-2.5 pl-9 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search modules, simulations or proposals..."
                value={search}
              />
            </div>

            {filteredResources.length > 0 ? (
              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Suggested for this question
                </p>
                {/* Horizontal scrollable card row */}
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {filteredResources.map((r) => {
                    const sel = linked.includes(r.id);
                    return (
                      <button
                        className={cn(
                          "flex w-36 shrink-0 flex-col overflow-hidden rounded-[1.1rem] border text-left transition",
                          sel
                            ? "border-blue-300 bg-blue-50 shadow-[0_4px_12px_rgba(59,130,246,0.12)]"
                            : "border-[rgba(28,36,48,0.1)] bg-white hover:border-blue-200 hover:shadow-[0_4px_12px_rgba(28,36,48,0.06)]",
                        )}
                        key={r.id}
                        onClick={() => toggleLinked(r.id)}
                        type="button"
                      >
                        {/* Image / accent strip — falls back to accent colour if PNG missing */}
                        <div className="relative h-20 w-full overflow-hidden">
                          <div className={cn(
                            "absolute inset-0 flex items-center justify-center text-xs font-bold text-white",
                            r.accent === "amber"   ? "bg-amber-400"   :
                            r.accent === "cyan"    ? "bg-cyan-500"    :
                            r.accent === "emerald" ? "bg-emerald-500" :
                            r.accent === "rose"    ? "bg-rose-400"    : "bg-slate-400",
                          )}>
                            {r.kind[0]}
                          </div>
                          {r.imageSrc ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              alt=""
                              className="absolute inset-0 h-full w-full object-cover"
                              src={r.imageSrc}
                              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                            />
                          ) : null}
                          {sel ? (
                            <div className="absolute right-1.5 top-1.5 rounded-full bg-blue-500 p-0.5 text-white">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </div>
                          ) : null}
                        </div>
                        {/* Text */}
                        <div className="px-2.5 py-2">
                          <p className="line-clamp-2 text-[11px] font-semibold leading-4 text-slate-900">{r.title}</p>
                          <p className="mt-1 text-[10px] text-slate-400">{r.kind} · {r.duration}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </Section>

          {/* ── Step 4: Participation ────────────────────────────────── */}
          <Section number={4} title="How should people participate?" hint="You can change this later." focused={focusedStep === 4} onFocus={() => setFocusedStep(4)}>
            <div className="grid gap-3 sm:grid-cols-2">
              {([
                { value: "open"              as const, label: "Open participation",   desc: "Anyone can read, contribute, and vote. Best for broad exploration."        },
                { value: "background_guided" as const, label: "Guided participation", desc: "People are guided to consider selected backgrounds and evidence."           },
              ]).map((opt) => (
                <button
                  className={cn(
                    "rounded-[1.2rem] border px-4 py-4 text-left transition",
                    mode === opt.value
                      ? "border-blue-300 bg-[rgba(59,130,246,0.05)] shadow-[0_4px_12px_rgba(59,130,246,0.08)]"
                      : "border-[rgba(28,36,48,0.1)] bg-white hover:border-blue-200",
                  )}
                  key={opt.value}
                  onClick={() => setMode(opt.value)}
                  type="button"
                >
                  {/* Radio indicator */}
                  <span className={cn(
                    "mb-2 flex h-4 w-4 items-center justify-center rounded-full border-2 transition",
                    mode === opt.value ? "border-blue-500 bg-blue-500" : "border-slate-300 bg-white",
                  )}>
                    {mode === opt.value ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
                  </span>
                  <p className="text-sm font-semibold text-slate-900">{opt.label}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{opt.desc}</p>
                </button>
              ))}
            </div>

            {mode === "background_guided" ? (
              <div className="space-y-4 rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4">
                {([
                  { label: "Academic level",       opts: ACADEMIC_LEVEL_OPTIONS,     state: academicLevels,   setter: setAcademicLevels   },
                  { label: "Professional stage",   opts: PROFESSIONAL_STAGE_OPTIONS, state: profStages,       setter: setProfStages       },
                  { label: "Fields of experience", opts: EXPERTISE_DOMAIN_OPTIONS,   state: expertiseDomains, setter: setExpertiseDomains },
                ] as const).map(({ label, opts, state, setter }) => (
                  <div key={label}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {opts.map((o) => (
                        <button
                          className={cn(
                            "rounded-full border px-3 py-1.5 text-xs transition",
                            (state as string[]).includes(o.value)
                              ? "border-blue-200 bg-blue-50 text-blue-700"
                              : "border-[rgba(28,36,48,0.1)] bg-white text-slate-600 hover:text-slate-900",
                          )}
                          key={o.value}
                          onClick={() => toggleArr(state as string[], o.value, setter as (v: string[]) => void)}
                          type="button"
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {(academicLevels.length > 0 || profStages.length > 0 || expertiseDomains.length > 0) ? (
                  <p className="text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Audience: </span>{participationSummary}
                  </p>
                ) : null}
              </div>
            ) : null}
          </Section>

          {/* ── Step 5: AI assistance ────────────────────────────────── */}
          <Section number={5} title="Get help from AI" hint="AI can suggest possible explanations, evidence, and angles to explore." optional focused={focusedStep === 5} onFocus={() => setFocusedStep(5)}>
            <button
              className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-5 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
              type="button"
            >
              <Sparkles className="h-4 w-4" />
              Help structure this question
              <ArrowRight className="h-4 w-4" />
            </button>
            <p className="text-xs text-slate-400">AI will propose key angles, evidence types, and framing suggestions.</p>
          </Section>

        </main>

        {/* ── RIGHT SIDEBAR ─────────────────────────────────────────── */}
        <aside className="hidden lg:block">
          <div className="sticky top-8">
            <div className="overflow-hidden rounded-[1.5rem] border border-[rgba(28,36,48,0.08)] bg-white shadow-[0_8px_24px_rgba(28,36,48,0.04)]">
              <div className="border-b border-[rgba(28,36,48,0.07)] px-5 py-4">
                <p className="text-base font-semibold text-slate-900">What happens next?</p>
              </div>
              <ul className="divide-y divide-[rgba(28,36,48,0.06)]">
                {WHAT_NEXT.map(({ icon: Icon, color, title: t, body }) => (
                  <li className="flex items-start gap-3 px-5 py-3.5" key={t}>
                    <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full border", color)}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{t}</p>
                      <p className="mt-0.5 text-xs leading-5 text-slate-500">{body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

      </div>

      {/* ── STICKY BOTTOM ACTION BAR ──────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[rgba(28,36,48,0.08)] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[88rem] items-center justify-between gap-4 px-5 py-3 sm:px-8">
          {error ? (
            <p className="text-sm text-rose-600">{error}</p>
          ) : !userId ? (
            <p className="text-sm text-slate-500">
              <Link className="font-semibold text-primary underline" href="/auth">Sign in</Link>
              {" "}to publish your discussion.
            </p>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-3">
            <Link
              className="inline-flex items-center rounded-full border border-[rgba(28,36,48,0.12)] bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
              href="/discussions"
            >
              Save draft
            </Link>
            <Button
              className="rounded-full px-6"
              disabled={submitting || !title.trim() || !context.trim() || !userId}
              onClick={handleSubmit}
              type="button"
            >
              {submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Publishing...</>
              ) : (
                <>Review and create <ArrowRight className="h-4 w-4" /></>
              )}
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
}

// ── Section card ───────────────────────────────────────────────────────────────

function Section({
  children,
  focused,
  hint,
  number,
  onFocus,
  optional,
  title,
}: {
  children?: React.ReactNode;
  focused: boolean;
  hint: string;
  number: number;
  onFocus: () => void;
  optional?: boolean;
  title: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[1.5rem] border bg-white transition-shadow",
        focused
          ? "border-[rgba(59,130,246,0.18)] shadow-[0_12px_30px_rgba(28,36,48,0.07)]"
          : "border-[rgba(28,36,48,0.08)] shadow-[0_4px_12px_rgba(28,36,48,0.03)]",
      )}
      onClick={onFocus}
    >
      {/* Section header */}
      <div className="flex items-start gap-4 px-6 py-5">
        <span className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold",
          focused ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500",
        )}>
          {number}
        </span>
        <div>
          <h2 className={cn("text-base font-semibold", focused ? "text-slate-900" : "text-slate-700")}>
            {title}
            {optional ? <span className="ml-1.5 text-[11px] font-normal text-slate-400">(optional)</span> : null}
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">{hint}</p>
        </div>
      </div>

      {/* Section body */}
      {children ? (
        <div className="space-y-4 border-t border-[rgba(28,36,48,0.06)] px-6 pb-6 pt-5" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      ) : null}
    </div>
  );
}
