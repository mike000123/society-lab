"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, ExternalLink, Send, ShieldCheck, Sparkles } from "lucide-react";

import { SoftPanel } from "@/components/atlas/SoftPanel";
import { Button } from "@/components/ui/button";
import type { Database } from "@/lib/database.types";
import {
  STUDY_SUBMISSION_ACCESS_OPTIONS,
  STUDY_SUBMISSION_CATEGORY_OPTIONS,
  STUDY_SUBMISSION_FORMATS,
  STUDY_SUBMISSION_LEVELS,
  type StudySubmissionKind,
  type StudySubmissionStatus,
} from "@/lib/study/community";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";
import { cn } from "@/lib/utils";

type SubmissionRow = Database["public"]["Tables"]["study_resource_submissions"]["Row"] & {
  reviewerName?: string | null;
  submitterName?: string | null;
};

type SubmissionFormState = {
  access: (typeof STUDY_SUBMISSION_ACCESS_OPTIONS)[number];
  bodyMarkdown: string;
  categoryId: string;
  format: (typeof STUDY_SUBMISSION_FORMATS)[number];
  level: (typeof STUDY_SUBMISSION_LEVELS)[number];
  rationale: string;
  source: string;
  submissionKind: StudySubmissionKind;
  summary: string;
  tags: string;
  title: string;
  url: string;
};

const DEFAULT_FORM_STATE: SubmissionFormState = {
  access: "Free",
  bodyMarkdown: "",
  categoryId: STUDY_SUBMISSION_CATEGORY_OPTIONS[0]?.id ?? "systems-thinking",
  format: STUDY_SUBMISSION_FORMATS[0] ?? "Article",
  level: STUDY_SUBMISSION_LEVELS[0] ?? "Starter",
  rationale: "",
  source: "",
  submissionKind: "link",
  summary: "",
  tags: "",
  title: "",
  url: "",
};

const STATUS_BADGES: Record<StudySubmissionStatus, string> = {
  approved: "border-emerald-300 bg-emerald-50 text-emerald-700",
  pending: "border-amber-300 bg-amber-50 text-amber-700",
  rejected: "border-rose-300 bg-rose-50 text-rose-700",
};

const KIND_LABELS: Record<StudySubmissionKind, string> = {
  article: "Essay",
  link: "Link",
};

function FieldLabel({ children }: { children: string }) {
  return <span className="mb-2 block text-sm font-medium text-slate-800">{children}</span>;
}

export function StudyContributionPanel({
  initialSubmissionKind = "link",
  onResourcesChanged,
  variant = "page",
}: {
  initialSubmissionKind?: StudySubmissionKind;
  onResourcesChanged?: () => void | Promise<void>;
  variant?: "modal" | "page";
}) {
  const [form, setForm] = useState<SubmissionFormState>(DEFAULT_FORM_STATE);
  const [mySubmissions, setMySubmissions] = useState<SubmissionRow[]>([]);
  const [reviewQueue, setReviewQueue] = useState<SubmissionRow[]>([]);
  const [reviewerNotes, setReviewerNotes] = useState<Record<string, string>>({});
  const [canReview, setCanReview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isSignedOut = useMemo(() => loadError === "auth", [loadError]);
  const isModal = variant === "modal";

  useEffect(() => {
    setForm((current) => ({
      ...current,
      access: initialSubmissionKind === "article" ? "Free" : current.access,
      format: initialSubmissionKind === "article" ? "Article" : current.format === "Article" ? STUDY_SUBMISSION_FORMATS[0] ?? "Article" : current.format,
      source: initialSubmissionKind === "article" ? "Society Lab community" : current.source === "Society Lab community" ? "" : current.source,
      submissionKind: initialSubmissionKind,
      url: initialSubmissionKind === "article" ? "" : current.url,
    }));
  }, [initialSubmissionKind]);

  const loadDashboard = useCallback(async () => {
    if (!hasSupabaseEnv) {
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    try {
      const response = await fetch("/api/study/submissions", {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      const payload = (await response.json()) as {
        canReview?: boolean;
        error?: string;
        mySubmissions?: SubmissionRow[];
        reviewQueue?: SubmissionRow[];
      };

      if (response.status === 401) {
        setLoadError("auth");
        setCanReview(false);
        setMySubmissions([]);
        setReviewQueue([]);
        return;
      }

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to load the study contribution panel.");
      }

      setCanReview(payload.canReview === true);
      setMySubmissions(payload.mySubmissions ?? []);
      setReviewQueue(payload.reviewQueue ?? []);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to load the study contribution panel.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/study/submissions", {
        body: JSON.stringify({
          ...form,
          tags: form.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to submit this resource right now.");
      }

      setForm(DEFAULT_FORM_STATE);
      setSuccessMessage("Resource submitted for review. It will appear in the Study library once approved.");
      await loadDashboard();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to submit this resource right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function reviewSubmission(id: string, status: Exclude<StudySubmissionStatus, "pending">) {
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/study/submissions", {
        body: JSON.stringify({
          id,
          reviewerNotes: reviewerNotes[id] ?? "",
          status,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to review this suggestion right now.");
      }

      setSuccessMessage(status === "approved" ? "Resource approved and published in the library." : "Resource marked as not approved.");
      await loadDashboard();
      if (status === "approved") {
        await onResourcesChanged?.();
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to review this suggestion right now.");
    }
  }

  if (!hasSupabaseEnv) {
    return (
      <SoftPanel className="space-y-3">
        <p className="atlas-kicker">Community study suggestions</p>
        <p className="text-sm leading-7 text-slate-600">
          Connect Supabase to let members suggest books, papers, and articles for the Study library.
        </p>
      </SoftPanel>
    );
  }

  const introBlock = (
    <div className={cn("flex items-start justify-between gap-4", isModal && "relative z-[1]")}>
      <div className={cn(isModal ? "max-w-[36rem]" : "")}>
        <p className="atlas-kicker">Community study suggestions</p>
        <h2 className="atlas-display mt-2 text-[2rem] leading-tight text-slate-900">
          {form.submissionKind === "article" ? "Write a study article" : "Suggest a resource"}
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Text-only essays are stored as internal Society Lab study articles once approved. Links and original member
          articles both move through the same review flow before joining the public Study library.
        </p>
        {isModal ? (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-white/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
              {form.submissionKind === "article" ? "Community article" : "Curated link"}
            </span>
            <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-white/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
              Reviewed before publishing
            </span>
          </div>
        ) : null}
      </div>
      <div className="rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.9)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        Phase 2
      </div>
    </div>
  );

  const submissionToggle = (
    <div
      className={cn(
        "flex flex-wrap gap-2",
        isModal
          ? "rounded-[1.4rem] border border-[rgba(28,36,48,0.08)] bg-white/80 px-3 py-3 shadow-[0_10px_24px_rgba(28,36,48,0.03)]"
          : "",
      )}
    >
      {(["link", "article"] as StudySubmissionKind[]).map((kind) => (
        <button
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-medium transition",
            form.submissionKind === kind
              ? "border-primary bg-[rgba(59,130,246,0.1)] text-primary"
              : "border-[rgba(28,36,48,0.12)] bg-white text-slate-600 hover:border-[rgba(28,36,48,0.2)] hover:text-slate-900",
          )}
          key={kind}
          onClick={() =>
            setForm((current) => ({
              ...current,
              access: kind === "article" ? "Free" : current.access,
              format: kind === "article" ? "Article" : current.format,
              source: kind === "article" ? "Society Lab community" : current.source,
              submissionKind: kind,
              url: kind === "article" ? "" : current.url,
            }))
          }
          type="button"
        >
          {kind === "link" ? "Suggest a link" : "Write an article"}
        </button>
      ))}
    </div>
  );

  return (
    <section className={cn("grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]", isModal && "xl:grid-cols-[minmax(0,1fr)_21rem]")}>
      {isModal ? (
        <div className="space-y-5 rounded-[1.85rem] border border-[rgba(28,36,48,0.08)] bg-[linear-gradient(180deg,rgba(255,251,243,0.98)_0%,rgba(255,255,255,0.98)_28%,rgba(255,255,255,0.98)_100%)] p-5 shadow-[0_18px_40px_rgba(28,36,48,0.05)] sm:p-6">
          <div className="relative overflow-hidden rounded-[1.6rem] border border-[rgba(28,36,48,0.08)] bg-[linear-gradient(135deg,#fff9ee_0%,#ffffff_48%,#f2f7ff_100%)] px-5 py-5 sm:px-6 sm:py-6">
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] md:block">
              <Image
                alt="Study contribution illustration"
                className="object-cover object-right"
                fill
                sizes="(min-width: 768px) 28rem, 0px"
                src="/atlas/study-hero.png"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,249,238,0.98)_0%,rgba(255,255,255,0.9)_32%,rgba(255,255,255,0)_100%)]" />
            </div>
            {introBlock}
          </div>

          {isSignedOut ? (
            <div className="rounded-[1.35rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4 text-sm text-slate-600">
              Sign in first to suggest resources or review pending submissions.
            </div>
          ) : (
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
              <div className="sm:col-span-2">{submissionToggle}</div>

              <label className="sm:col-span-2">
                <FieldLabel>Title</FieldLabel>
                <input
                  className="w-full rounded-[1.15rem] border border-[rgba(28,36,48,0.12)] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  placeholder="The resource title"
                  value={form.title}
                />
              </label>

              {form.submissionKind === "link" ? (
                <label className="sm:col-span-2">
                  <FieldLabel>URL</FieldLabel>
                  <input
                    className="w-full rounded-[1.15rem] border border-[rgba(28,36,48,0.12)] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
                    onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))}
                    placeholder="https://..."
                    value={form.url}
                  />
                </label>
              ) : null}

              <label>
                <FieldLabel>Category</FieldLabel>
                <select
                  className="w-full rounded-[1.15rem] border border-[rgba(28,36,48,0.12)] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
                  onChange={(event) => setForm((current) => ({ ...current, categoryId: event.target.value }))}
                  value={form.categoryId}
                >
                  {STUDY_SUBMISSION_CATEGORY_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.title}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <FieldLabel>Format</FieldLabel>
                {form.submissionKind === "article" ? (
                  <div className="rounded-[1.15rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.72)] px-4 py-3 text-sm font-medium text-slate-700">
                    Article
                  </div>
                ) : (
                  <select
                    className="w-full rounded-[1.15rem] border border-[rgba(28,36,48,0.12)] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
                    onChange={(event) => setForm((current) => ({ ...current, format: event.target.value as SubmissionFormState["format"] }))}
                    value={form.format}
                  >
                    {STUDY_SUBMISSION_FORMATS.map((format) => (
                      <option key={format} value={format}>
                        {format}
                      </option>
                    ))}
                  </select>
                )}
              </label>

              <label>
                <FieldLabel>Level</FieldLabel>
                <select
                  className="w-full rounded-[1.15rem] border border-[rgba(28,36,48,0.12)] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
                  onChange={(event) => setForm((current) => ({ ...current, level: event.target.value as SubmissionFormState["level"] }))}
                  value={form.level}
                >
                  {STUDY_SUBMISSION_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <FieldLabel>Access</FieldLabel>
                {form.submissionKind === "article" ? (
                  <div className="rounded-[1.15rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.72)] px-4 py-3 text-sm font-medium text-slate-700">
                    Free
                  </div>
                ) : (
                  <select
                    className="w-full rounded-[1.15rem] border border-[rgba(28,36,48,0.12)] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
                    onChange={(event) => setForm((current) => ({ ...current, access: event.target.value as SubmissionFormState["access"] }))}
                    value={form.access}
                  >
                    {STUDY_SUBMISSION_ACCESS_OPTIONS.map((access) => (
                      <option key={access} value={access}>
                        {access}
                      </option>
                    ))}
                  </select>
                )}
              </label>

              {form.submissionKind === "link" ? (
                <label className="sm:col-span-2">
                  <FieldLabel>Source</FieldLabel>
                  <input
                    className="w-full rounded-[1.15rem] border border-[rgba(28,36,48,0.12)] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
                    onChange={(event) => setForm((current) => ({ ...current, source: event.target.value }))}
                    placeholder="Publisher, organization, or author"
                    value={form.source}
                  />
                </label>
              ) : null}

              <label className="sm:col-span-2">
                <FieldLabel>Short summary</FieldLabel>
                <textarea
                  className="min-h-[110px] w-full rounded-[1.15rem] border border-[rgba(28,36,48,0.12)] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
                  onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))}
                  placeholder="What does this resource cover?"
                  value={form.summary}
                />
              </label>

              <label className="sm:col-span-2">
                <FieldLabel>Why it matters</FieldLabel>
                <textarea
                  className="min-h-[110px] w-full rounded-[1.15rem] border border-[rgba(28,36,48,0.12)] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
                  onChange={(event) => setForm((current) => ({ ...current, rationale: event.target.value }))}
                  placeholder="Why is this worth adding to Society Lab?"
                  value={form.rationale}
                />
              </label>

              <label className="sm:col-span-2">
                <FieldLabel>Tags</FieldLabel>
                <input
                  className="w-full rounded-[1.15rem] border border-[rgba(28,36,48,0.12)] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
                  onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
                  placeholder="comma-separated tags, e.g. inequality, banking, public value"
                  value={form.tags}
                />
              </label>

              {form.submissionKind === "article" ? (
                <label className="sm:col-span-2">
                  <FieldLabel>Article body</FieldLabel>
                  <textarea
                    className="min-h-[320px] w-full rounded-[1.15rem] border border-[rgba(28,36,48,0.12)] bg-white px-4 py-3 font-mono text-sm text-slate-900 outline-none transition focus:border-primary"
                    onChange={(event) => setForm((current) => ({ ...current, bodyMarkdown: event.target.value }))}
                    placeholder={"Write in simple markdown.\n\n## Section heading\nParagraph text...\n\n- bullet one\n- bullet two\n\n> callout"}
                    value={form.bodyMarkdown}
                  />
                </label>
              ) : null}

              <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
                <Button className="rounded-full" disabled={isSubmitting} type="submit">
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Submitting..." : "Submit for review"}
                </Button>
                {successMessage ? <p className="text-sm text-emerald-700">{successMessage}</p> : null}
                {submitError ? <p className="text-sm text-rose-700">{submitError}</p> : null}
              </div>
            </form>
          )}
        </div>
      ) : (
        <SoftPanel className="space-y-5">
          {introBlock}

          {isSignedOut ? (
            <div className="rounded-[1.35rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4 text-sm text-slate-600">
              Sign in first to suggest resources or review pending submissions.
            </div>
          ) : (
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
              <div className="sm:col-span-2">{submissionToggle}</div>

              <label className="sm:col-span-2">
                <FieldLabel>Title</FieldLabel>
                <input
                  className="w-full rounded-[1.15rem] border border-[rgba(28,36,48,0.12)] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  placeholder="The resource title"
                  value={form.title}
                />
              </label>

              {form.submissionKind === "link" ? (
                <label className="sm:col-span-2">
                  <FieldLabel>URL</FieldLabel>
                  <input
                    className="w-full rounded-[1.15rem] border border-[rgba(28,36,48,0.12)] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
                    onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))}
                    placeholder="https://..."
                    value={form.url}
                  />
                </label>
              ) : null}

              <label>
                <FieldLabel>Category</FieldLabel>
                <select
                  className="w-full rounded-[1.15rem] border border-[rgba(28,36,48,0.12)] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
                  onChange={(event) => setForm((current) => ({ ...current, categoryId: event.target.value }))}
                  value={form.categoryId}
                >
                  {STUDY_SUBMISSION_CATEGORY_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.title}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <FieldLabel>Format</FieldLabel>
                {form.submissionKind === "article" ? (
                  <div className="rounded-[1.15rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.72)] px-4 py-3 text-sm font-medium text-slate-700">
                    Article
                  </div>
                ) : (
                  <select
                    className="w-full rounded-[1.15rem] border border-[rgba(28,36,48,0.12)] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
                    onChange={(event) => setForm((current) => ({ ...current, format: event.target.value as SubmissionFormState["format"] }))}
                    value={form.format}
                  >
                    {STUDY_SUBMISSION_FORMATS.map((format) => (
                      <option key={format} value={format}>
                        {format}
                      </option>
                    ))}
                  </select>
                )}
              </label>

              <label>
                <FieldLabel>Level</FieldLabel>
                <select
                  className="w-full rounded-[1.15rem] border border-[rgba(28,36,48,0.12)] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
                  onChange={(event) => setForm((current) => ({ ...current, level: event.target.value as SubmissionFormState["level"] }))}
                  value={form.level}
                >
                  {STUDY_SUBMISSION_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <FieldLabel>Access</FieldLabel>
                {form.submissionKind === "article" ? (
                  <div className="rounded-[1.15rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.72)] px-4 py-3 text-sm font-medium text-slate-700">
                    Free
                  </div>
                ) : (
                  <select
                    className="w-full rounded-[1.15rem] border border-[rgba(28,36,48,0.12)] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
                    onChange={(event) => setForm((current) => ({ ...current, access: event.target.value as SubmissionFormState["access"] }))}
                    value={form.access}
                  >
                    {STUDY_SUBMISSION_ACCESS_OPTIONS.map((access) => (
                      <option key={access} value={access}>
                        {access}
                      </option>
                    ))}
                  </select>
                )}
              </label>

              {form.submissionKind === "link" ? (
                <label className="sm:col-span-2">
                  <FieldLabel>Source</FieldLabel>
                  <input
                    className="w-full rounded-[1.15rem] border border-[rgba(28,36,48,0.12)] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
                    onChange={(event) => setForm((current) => ({ ...current, source: event.target.value }))}
                    placeholder="Publisher, organization, or author"
                    value={form.source}
                  />
                </label>
              ) : null}

              <label className="sm:col-span-2">
                <FieldLabel>Short summary</FieldLabel>
                <textarea
                  className="min-h-[110px] w-full rounded-[1.15rem] border border-[rgba(28,36,48,0.12)] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
                  onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))}
                  placeholder="What does this resource cover?"
                  value={form.summary}
                />
              </label>

              <label className="sm:col-span-2">
                <FieldLabel>Why it matters</FieldLabel>
                <textarea
                  className="min-h-[110px] w-full rounded-[1.15rem] border border-[rgba(28,36,48,0.12)] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
                  onChange={(event) => setForm((current) => ({ ...current, rationale: event.target.value }))}
                  placeholder="Why is this worth adding to Society Lab?"
                  value={form.rationale}
                />
              </label>

              <label className="sm:col-span-2">
                <FieldLabel>Tags</FieldLabel>
                <input
                  className="w-full rounded-[1.15rem] border border-[rgba(28,36,48,0.12)] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
                  onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
                  placeholder="comma-separated tags, e.g. inequality, banking, public value"
                  value={form.tags}
                />
              </label>

              {form.submissionKind === "article" ? (
                <label className="sm:col-span-2">
                  <FieldLabel>Article body</FieldLabel>
                  <textarea
                    className="min-h-[300px] w-full rounded-[1.15rem] border border-[rgba(28,36,48,0.12)] bg-white px-4 py-3 font-mono text-sm text-slate-900 outline-none transition focus:border-primary"
                    onChange={(event) => setForm((current) => ({ ...current, bodyMarkdown: event.target.value }))}
                    placeholder={"Write in simple markdown.\n\n## Section heading\nParagraph text...\n\n- bullet one\n- bullet two\n\n> callout"}
                    value={form.bodyMarkdown}
                  />
                </label>
              ) : null}

              <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
                <Button className="rounded-full" disabled={isSubmitting} type="submit">
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Submitting..." : "Submit for review"}
                </Button>
                {successMessage ? <p className="text-sm text-emerald-700">{successMessage}</p> : null}
                {submitError ? <p className="text-sm text-rose-700">{submitError}</p> : null}
              </div>
            </form>
          )}
        </SoftPanel>
      )}

      <div className="space-y-5">
        <SoftPanel className="space-y-4">
          <div className="flex items-center gap-3">
            <Clock3 className="h-5 w-5 text-primary" />
            <div>
              <p className="atlas-kicker">Your submissions</p>
              <p className="text-sm text-slate-600">Track which suggestions are still pending review.</p>
            </div>
          </div>

          {isLoading ? (
            <p className="text-sm text-slate-500">Loading your study suggestions...</p>
          ) : mySubmissions.length > 0 ? (
            <div className="space-y-3">
              {mySubmissions.slice(0, 4).map((submission) => (
                <div className="rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4" key={submission.id}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn("rounded-full border px-2.5 py-1 text-[11px] font-medium", STATUS_BADGES[submission.status])}>
                      {submission.status}
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                      {KIND_LABELS[submission.submission_kind]} · {submission.format}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{submission.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{submission.source}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No study suggestions yet. Your first good link can start here.</p>
          )}
        </SoftPanel>

        {canReview ? (
          <SoftPanel className="space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="atlas-kicker">Reviewer queue</p>
                <p className="text-sm text-slate-600">Approve strong additions so they appear in the Study library.</p>
              </div>
            </div>

            {reviewQueue.length > 0 ? (
              <div className="space-y-4">
                {reviewQueue.slice(0, 6).map((submission) => (
                  <div className="rounded-[1.3rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4" key={submission.id}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.9)] px-2.5 py-1 text-[11px] font-medium text-slate-600">
                        {KIND_LABELS[submission.submission_kind]}
                      </span>
                      <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.9)] px-2.5 py-1 text-[11px] font-medium text-slate-600">
                        {submission.level}
                      </span>
                    </div>
                    <p className="mt-3 text-base font-semibold text-slate-900">{submission.title}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Submitted by {submission.submitterName ?? "a member"} · {submission.source}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{submission.summary}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-500">{submission.rationale}</p>
                    {submission.submission_kind === "article" ? (
                      <a
                        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                        href={`/study/articles/${submission.id}`}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Preview article
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : submission.url ? (
                      <a
                        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                        href={submission.url}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Preview link
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : null}
                    <textarea
                      className="mt-4 min-h-[88px] w-full rounded-[1.1rem] border border-[rgba(28,36,48,0.12)] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
                      onChange={(event) => setReviewerNotes((current) => ({ ...current, [submission.id]: event.target.value }))}
                      placeholder="Optional reviewer note"
                      value={reviewerNotes[submission.id] ?? ""}
                    />
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button className="rounded-full" onClick={() => void reviewSubmission(submission.id, "approved")} type="button">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button className="rounded-full" onClick={() => void reviewSubmission(submission.id, "rejected")} type="button" variant="outline">
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4 text-sm text-slate-500">
                No study submissions waiting right now.
              </div>
            )}
          </SoftPanel>
        ) : (
          <SoftPanel className="space-y-3">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <div>
                <p className="atlas-kicker">Reviewer flow</p>
                <p className="text-sm text-slate-600">Approved suggestions join the public Study library after review.</p>
              </div>
            </div>
            <p className="text-sm leading-7 text-slate-500">
              Review access is currently a moderator role. Once your profile is granted reviewer access, the pending queue will appear here.
            </p>
          </SoftPanel>
        )}

        {loadError && !isSignedOut ? (
          <p className="text-sm text-rose-700">{loadError}</p>
        ) : null}
      </div>
    </section>
  );
}
