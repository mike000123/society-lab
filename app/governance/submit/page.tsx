"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PlusCircle, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SEEDED_PROPOSALS, CATEGORY_META, type ProposalCategory } from "@/lib/governance/proposals";
import { useSubmissions } from "@/lib/governance/votes";

const CATEGORIES: { key: ProposalCategory; label: string; description: string }[] = [
  { key: "economic",    label: "Economic",    description: "Money, taxation, markets, banking" },
  { key: "political",   label: "Political",   description: "Governance, elections, regulation" },
  { key: "social",      label: "Social",      description: "Housing, cities, health, education" },
  { key: "information", label: "Information", description: "Media, data, algorithms, privacy" },
];

// Build a list of modules from seeded proposals (deduplicated)
const MODULE_OPTIONS = Array.from(
  new Map(
    SEEDED_PROPOSALS.filter((p) => p.moduleSlug).map((p) => [p.moduleSlug, { slug: p.moduleSlug!, title: p.moduleTitle! }])
  ).values()
);

export default function SubmitProposalPage() {
  const router = useRouter();
  const { addSubmission } = useSubmissions();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rationale, setRationale] = useState("");
  const [category, setCategory] = useState<ProposalCategory | "">("");
  const [moduleSlug, setModuleSlug] = useState<string>("");
  const [authorName, setAuthorName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function validate() {
    if (!title.trim() || title.trim().length < 10) return "Title must be at least 10 characters.";
    if (!description.trim() || description.trim().length < 30) return "Description must be at least 30 characters.";
    if (!rationale.trim() || rationale.trim().length < 50) return "Rationale must be at least 50 characters.";
    if (!category) return "Please select a category.";
    if (!authorName.trim()) return "Please enter a name or handle.";
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setSubmitting(true);

    const selectedModule = MODULE_OPTIONS.find((m) => m.slug === moduleSlug);
    const id = addSubmission({
      title: title.trim(),
      description: description.trim(),
      rationale: rationale.trim(),
      category: category as ProposalCategory,
      moduleSlug: selectedModule?.slug ?? null,
      moduleTitle: selectedModule?.title ?? null,
      authorName: authorName.trim(),
    });

    router.push(`/governance/${id}`);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5 pb-10">
      <Link
        href="/governance"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All proposals
      </Link>

      {/* Header */}
      <section className="rounded-[2rem] border border-slate-800 bg-slate-950/85 p-6 sm:p-8 space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/25 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-100">
          <Landmark className="h-3.5 w-3.5" /> New proposal
        </span>
        <h1 className="text-2xl font-black text-slate-50">Submit a system redesign proposal</h1>
        <p className="text-sm leading-6 text-slate-400">
          Proposals should address a specific structural problem — not a symptom. Link it to a learning
          module if you can. Your submission is saved locally in this browser.
        </p>
      </section>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category */}
        <div className="rounded-[1.75rem] border border-slate-800 bg-panel/90 p-5 sm:p-6 space-y-3">
          <label className="block text-xs uppercase tracking-[0.22em] text-slate-500">
            Category <span className="text-rose-400">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {CATEGORIES.map(({ key, label }) => {
              const meta = CATEGORY_META[key];
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => setCategory(key)}
                  className={cn(
                    "rounded-2xl border px-3 py-2.5 text-sm font-medium transition-colors text-left",
                    category === key
                      ? cn(meta.border, meta.bg, meta.color)
                      : "border-slate-700 bg-slate-900/60 text-slate-400 hover:border-slate-500"
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Title */}
        <div className="rounded-[1.75rem] border border-slate-800 bg-panel/90 p-5 sm:p-6 space-y-2">
          <label htmlFor="title" className="block text-xs uppercase tracking-[0.22em] text-slate-500">
            Title <span className="text-rose-400">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={160}
            placeholder="A specific, actionable reform proposal…"
            className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-amber-500/60 focus:outline-none focus:ring-0"
          />
          <p className="text-right text-xs text-slate-600">{title.length}/160</p>
        </div>

        {/* Description */}
        <div className="rounded-[1.75rem] border border-slate-800 bg-panel/90 p-5 sm:p-6 space-y-2">
          <label htmlFor="description" className="block text-xs uppercase tracking-[0.22em] text-slate-500">
            Short description <span className="text-rose-400">*</span>
          </label>
          <p className="text-xs text-slate-600">2–3 sentences shown on the proposal card.</p>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={400}
            placeholder="What is the proposal and what problem does it solve?"
            className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-amber-500/60 focus:outline-none"
          />
          <p className="text-right text-xs text-slate-600">{description.length}/400</p>
        </div>

        {/* Rationale */}
        <div className="rounded-[1.75rem] border border-slate-800 bg-panel/90 p-5 sm:p-6 space-y-2">
          <label htmlFor="rationale" className="block text-xs uppercase tracking-[0.22em] text-slate-500">
            Rationale <span className="text-rose-400">*</span>
          </label>
          <p className="text-xs text-slate-600">The full argument — why would this work? What evidence supports it?</p>
          <textarea
            id="rationale"
            value={rationale}
            onChange={(e) => setRationale(e.target.value)}
            rows={6}
            maxLength={2000}
            placeholder="Explain the system mechanism this addresses, why existing approaches fail, and what makes this proposal viable…"
            className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-amber-500/60 focus:outline-none"
          />
          <p className="text-right text-xs text-slate-600">{rationale.length}/2000</p>
        </div>

        {/* Module link */}
        <div className="rounded-[1.75rem] border border-slate-800 bg-panel/90 p-5 sm:p-6 space-y-2">
          <label htmlFor="module" className="block text-xs uppercase tracking-[0.22em] text-slate-500">
            Related module <span className="text-slate-600">(optional)</span>
          </label>
          <select
            id="module"
            value={moduleSlug}
            onChange={(e) => setModuleSlug(e.target.value)}
            className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 focus:border-amber-500/60 focus:outline-none"
          >
            <option value="">— Select a module —</option>
            {MODULE_OPTIONS.map((m) => (
              <option key={m.slug} value={m.slug}>{m.title}</option>
            ))}
          </select>
        </div>

        {/* Author */}
        <div className="rounded-[1.75rem] border border-slate-800 bg-panel/90 p-5 sm:p-6 space-y-2">
          <label htmlFor="author" className="block text-xs uppercase tracking-[0.22em] text-slate-500">
            Your name or handle <span className="text-rose-400">*</span>
          </label>
          <input
            id="author"
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            maxLength={60}
            placeholder="Anonymous citizen, researcher, activist…"
            className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-amber-500/60 focus:outline-none"
          />
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-700/50 bg-rose-900/20 px-4 py-3 text-sm text-rose-300">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={submitting} className="rounded-2xl gap-2">
            <PlusCircle className="h-4 w-4" />
            {submitting ? "Submitting…" : "Submit proposal"}
          </Button>
          <Button asChild variant="outline" className="rounded-2xl">
            <Link href="/governance">Cancel</Link>
          </Button>
        </div>

        <p className="text-xs text-slate-600">
          Submissions are saved to your browser only (alpha stage). Shared governance database coming in a future update.
        </p>
      </form>
    </div>
  );
}
