"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Loader2, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  ACADEMIC_LEVEL_OPTIONS,
  EXPERTISE_DOMAIN_OPTIONS,
  PROFESSIONAL_STAGE_OPTIONS,
  summarizeBackgroundFilters,
} from "@/lib/community/profile-options";
import type { Database } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";
import { cn } from "@/lib/utils";

type ThreadParticipationMode = Database["public"]["Enums"]["thread_participation_mode"];

export function PublicDiscussionStarter() {
  const router = useRouter();
  const supabase = useMemo(() => (hasSupabaseEnv ? createClient() : null), []);
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [participationMode, setParticipationMode] = useState<ThreadParticipationMode>("open");
  const [desiredAcademicLevels, setDesiredAcademicLevels] = useState<string[]>([]);
  const [desiredProfessionalStages, setDesiredProfessionalStages] = useState<string[]>([]);
  const [desiredExpertiseDomains, setDesiredExpertiseDomains] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const hasParticipationFilters =
    desiredAcademicLevels.length > 0 ||
    desiredProfessionalStages.length > 0 ||
    desiredExpertiseDomains.length > 0;

  const participationSummary = summarizeBackgroundFilters({
    academicLevels: desiredAcademicLevels,
    expertiseDomains: desiredExpertiseDomains,
    professionalStages: desiredProfessionalStages,
  });

  function toggleSelection(
    currentValues: string[],
    nextValue: string,
    setter: (values: string[]) => void,
  ) {
    setter(
      currentValues.includes(nextValue)
        ? currentValues.filter((value) => value !== nextValue)
        : [...currentValues, nextValue],
    );
  }

  useEffect(() => {
    if (!supabase) return;
    const activeSupabase = supabase;
    let cancelled = false;

    async function loadUser() {
      const {
        data: { user },
      } = await activeSupabase.auth.getUser();
      if (!cancelled) {
        setUserId(user?.id ?? null);
      }
    }

    void loadUser();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!supabase || !title.trim() || !prompt.trim()) return;

    if (participationMode === "background_guided" && !hasParticipationFilters) {
      setError("Choose at least one academic, professional, or expertise filter for guided participation.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.id) {
      setUserId(null);
      setError("Sign in to start a public discussion.");
      setSubmitting(false);
      return;
    }

    setUserId(user.id);

    const { data, error: insertError } = await supabase
      .from("threads")
      .insert({
        author_id: user.id,
        context_slug: null,
        context_type: "general",
        desired_academic_levels: participationMode === "background_guided" ? desiredAcademicLevels : [],
        desired_expertise_domains: participationMode === "background_guided" ? desiredExpertiseDomains : [],
        desired_professional_stages: participationMode === "background_guided" ? desiredProfessionalStages : [],
        kind: "public_discussion",
        participation_mode: participationMode,
        prompt: prompt.trim(),
        status: "open",
        title: title.trim(),
        visibility: "public",
      })
      .select("id")
      .single();

    if (insertError || !data) {
      setError(insertError?.message ?? "Unable to create a discussion right now.");
      setSubmitting(false);
      return;
    }

    setTitle("");
    setPrompt("");
    setParticipationMode("open");
    setDesiredAcademicLevels([]);
    setDesiredProfessionalStages([]);
    setDesiredExpertiseDomains([]);
    setSubmitting(false);
    router.push(`/discussions?filter=all&thread=${data.id}#discussion-board`);
  }

  if (!hasSupabaseEnv) {
    return null;
  }

  return (
    <div
      className="rounded-[1.35rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.55)] px-4 py-4"
      id="start-discussion"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="atlas-kicker">Start a public discussion</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">Open a new public thread</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Frame the core question clearly, then use the thread below to add claims, evidence, counterclaims,
            and synthesis around it.
          </p>
        </div>

        {!userId ? (
          <Link className="text-sm font-semibold text-primary transition hover:text-slate-900" href="/auth">
            Sign in to post <ArrowRight className="ml-1 inline h-4 w-4" />
          </Link>
        ) : null}
      </div>

      <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
        <input
          className="w-full rounded-[1.1rem] border border-[rgba(28,36,48,0.12)] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[rgb(var(--atlas-primary))]"
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Thread title"
          value={title}
        />
        <textarea
          className="w-full resize-none rounded-[1.1rem] border border-[rgba(28,36,48,0.12)] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[rgb(var(--atlas-primary))]"
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="What is the discussion about, and what kind of reasoning do you want people to bring?"
          rows={3}
          value={prompt}
        />

        <div className="rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.5)] px-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-900">Who do you want to participate?</p>
            <p className="text-sm leading-6 text-slate-600">
              Every public thread stays readable to everyone. You can either open participation completely or guide replies toward self-declared backgrounds that fit the topic.
            </p>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {([
              {
                description: "Any signed-in member can contribute.",
                label: "Completely public",
                value: "open",
              },
              {
                description: "Everyone can read, but replies are guided to selected backgrounds.",
                label: "Guided participation",
                value: "background_guided",
              },
            ] satisfies Array<{ description: string; label: string; value: ThreadParticipationMode }>).map((mode) => (
              <button
                className={cn(
                  "rounded-[1.15rem] border px-4 py-4 text-left transition",
                  participationMode === mode.value
                    ? "border-[rgba(59,130,246,0.24)] bg-[rgba(59,130,246,0.08)]"
                    : "border-[rgba(28,36,48,0.08)] bg-white hover:border-[rgba(28,36,48,0.16)]",
                )}
                key={mode.value}
                onClick={() => setParticipationMode(mode.value)}
                type="button"
              >
                <p className="text-sm font-semibold text-slate-900">{mode.label}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{mode.description}</p>
              </button>
            ))}
          </div>

          {participationMode === "background_guided" ? (
            <div className="mt-4 space-y-4 rounded-[1.15rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">Requested participant backgrounds</p>
                <p className="text-sm leading-6 text-slate-600">
                  Use any combination below. A member only needs to match the filters you select here.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Academic level</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {ACADEMIC_LEVEL_OPTIONS.map((option) => {
                      const selected = desiredAcademicLevels.includes(option.value);
                      return (
                        <button
                          className={cn(
                            "rounded-full border px-3 py-2 text-sm transition",
                            selected
                              ? "border-[rgba(59,130,246,0.22)] bg-[rgba(59,130,246,0.08)] text-slate-900"
                              : "border-[rgba(28,36,48,0.12)] bg-white text-slate-600 hover:text-slate-900",
                          )}
                          key={option.value}
                          onClick={() => toggleSelection(desiredAcademicLevels, option.value, setDesiredAcademicLevels)}
                          type="button"
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Professional stage</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {PROFESSIONAL_STAGE_OPTIONS.map((option) => {
                      const selected = desiredProfessionalStages.includes(option.value);
                      return (
                        <button
                          className={cn(
                            "rounded-full border px-3 py-2 text-sm transition",
                            selected
                              ? "border-[rgba(59,130,246,0.22)] bg-[rgba(59,130,246,0.08)] text-slate-900"
                              : "border-[rgba(28,36,48,0.12)] bg-white text-slate-600 hover:text-slate-900",
                          )}
                          key={option.value}
                          onClick={() =>
                            toggleSelection(desiredProfessionalStages, option.value, setDesiredProfessionalStages)
                          }
                          type="button"
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Fields of experience</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {EXPERTISE_DOMAIN_OPTIONS.map((option) => {
                      const selected = desiredExpertiseDomains.includes(option.value);
                      return (
                        <button
                          className={cn(
                            "rounded-full border px-3 py-2 text-sm transition",
                            selected
                              ? "border-[rgba(59,130,246,0.22)] bg-[rgba(59,130,246,0.08)] text-slate-900"
                              : "border-[rgba(28,36,48,0.12)] bg-white text-slate-600 hover:text-slate-900",
                          )}
                          key={option.value}
                          onClick={() => toggleSelection(desiredExpertiseDomains, option.value, setDesiredExpertiseDomains)}
                          type="button"
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <p className="text-sm leading-6 text-slate-600">
                <span className="font-semibold text-slate-900">Current audience:</span> {participationSummary}
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          {error ? <p className="text-sm text-rose-600">{error}</p> : <div />}
          <Button className="rounded-full px-5" disabled={submitting || !title.trim() || !prompt.trim()} type="submit">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
            {submitting ? "Opening..." : "Create thread"}
          </Button>
        </div>
      </form>
    </div>
  );
}
