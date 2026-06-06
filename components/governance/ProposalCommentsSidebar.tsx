"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Loader2, MessageSquare, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  PROPOSAL_COMMENT_TAGS,
  proposalCommentTagLabel,
  proposalCommentTagTone,
  type ProposalCommentTag,
} from "@/lib/governance/comment-tags";
import type { Database } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";

type CommentRow = Database["public"]["Tables"]["proposal_comments"]["Row"];

type ProposalCommentView = {
  authorAvatarUrl: string | null;
  authorLabel: string;
  authorId: string;
  content: string;
  createdAt: string;
  id: string;
  tag: ProposalCommentTag;
};

function formatRelativeTime(timestamp: string) {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  if (!Number.isFinite(diffMs) || diffMs < 0) return "Recently";

  const hour = 60 * 60 * 1000;
  const day = 24 * hour;

  if (diffMs < day) {
    return `${Math.max(1, Math.round(diffMs / hour))}h ago`;
  }

  return `${Math.max(1, Math.round(diffMs / day))}d ago`;
}

function getInitials(label: string) {
  const parts = label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) return "SL";
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export function ProposalCommentsSidebar({
  proposalId,
}: {
  proposalId: string;
}) {
  const supabase = useMemo(() => (hasSupabaseEnv ? createClient() : null), []);
  const [comments, setComments] = useState<ProposalCommentView[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [tag, setTag] = useState<ProposalCommentTag | "">("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const client = supabase;
    if (!client) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError(null);

      const {
        data: { user },
      } = await client!.auth.getUser();

      if (!cancelled) {
        setUserId(user?.id ?? null);
      }

      const { data: rows, error } = await client!
        .from("proposal_comments")
        .select("*")
        .eq("proposal_id", proposalId)
        .order("created_at", { ascending: false });

      if (cancelled) return;

      if (error) {
        setLoadError(error.message);
        setComments([]);
        setLoading(false);
        return;
      }

      const authorIds = Array.from(new Set((rows ?? []).map((row) => row.author_id)));
      const { data: profiles } =
        authorIds.length > 0
          ? await client!
              .from("profiles")
              .select("id,full_name,username,avatar_url")
              .in("id", authorIds)
          : { data: [] as Array<{ avatar_url: string | null; full_name: string | null; id: string; username: string | null }> };
      if (cancelled) return;

      const profileMap = new Map(
        (profiles ?? []).map((profile) => [
          profile.id,
          {
            avatarUrl: profile.avatar_url,
            label: profile.full_name ?? profile.username ?? "Society Lab member",
          },
        ]),
      );

      setComments(
        (rows ?? []).map((row: CommentRow) => ({
          authorAvatarUrl: profileMap.get(row.author_id)?.avatarUrl ?? null,
          authorId: row.author_id,
          authorLabel: profileMap.get(row.author_id)?.label ?? "Society Lab member",
          content: row.content,
          createdAt: row.created_at,
          id: row.id,
          tag: row.tag,
        })),
      );
      setLoading(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [proposalId, supabase]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const client = supabase;
    if (!client || !userId || !tag || !content.trim()) return;

    setSubmitting(true);
    setSubmitError(null);

    const { data, error } = await client
      .from("proposal_comments")
      .insert({
        author_id: userId,
        content: content.trim(),
        proposal_id: proposalId,
        tag,
      })
      .select("*")
      .single();

    if (error || !data) {
      setSubmitError(error?.message ?? "Unable to add your comment right now.");
      setSubmitting(false);
      return;
    }

    const {
      data: { user },
    } = await client.auth.getUser();
    const authorLabel = comments.find((comment) => comment.authorId === user?.id)?.authorLabel ?? "You";
    const authorAvatarUrl = comments.find((comment) => comment.authorId === user?.id)?.authorAvatarUrl ?? null;

    setComments((previous) => [
      {
        authorAvatarUrl,
        authorId: data.author_id,
        authorLabel,
        content: data.content,
        createdAt: data.created_at,
        id: data.id,
        tag: data.tag,
      },
      ...previous,
    ]);
    setContent("");
    setTag("");
    setSubmitting(false);
  }

  return (
    <aside className="rounded-[1.7rem] border border-slate-200 bg-white/95 p-5 shadow-[0_18px_40px_rgba(28,36,48,0.05)]">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(28,36,48,0.1)] bg-[rgba(246,244,238,0.72)] text-slate-700">
          <MessageSquare className="h-4.5 w-4.5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Proposal comments</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">
            Comments ({loading ? "…" : comments.length})
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Keep feedback practical. Every comment must be tagged so proposal authors can separate improvement ideas from feasibility concerns and evidence.
          </p>
        </div>
      </div>

      <div className="mt-5">
        {!hasSupabaseEnv ? (
          <p className="rounded-[1.1rem] border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-800">
            Connect Supabase to enable proposal comments.
          </p>
        ) : null}

        {hasSupabaseEnv && userId ? (
          <form className="space-y-3 rounded-[1.25rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.45)] px-4 py-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Constructive tag</label>
              <select
                className="w-full rounded-[1rem] border border-[rgba(28,36,48,0.12)] bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[rgb(var(--atlas-primary))]"
                onChange={(event) => setTag(event.target.value as ProposalCommentTag | "")}
                required
                value={tag}
              >
                <option value="">Choose a tag</option>
                {PROPOSAL_COMMENT_TAGS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {tag ? (
              <p className="text-xs leading-5 text-slate-500">
                {PROPOSAL_COMMENT_TAGS.find((option) => option.value === tag)?.description}
              </p>
            ) : null}

            <textarea
              className="w-full resize-none rounded-[1rem] border border-[rgba(28,36,48,0.12)] bg-white px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[rgb(var(--atlas-primary))]"
              onChange={(event) => setContent(event.target.value)}
              placeholder="Add a constructive comment that helps improve the proposal."
              required
              rows={4}
              value={content}
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              {submitError ? <p className="text-sm text-rose-600">{submitError}</p> : <div />}
              <Button className="rounded-full px-5" disabled={submitting || !tag || !content.trim()} type="submit">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {submitting ? "Posting..." : "Post comment"}
              </Button>
            </div>
          </form>
        ) : hasSupabaseEnv ? (
          <div className="rounded-[1.1rem] border border-slate-200 bg-slate-50/80 px-4 py-4 text-sm leading-6 text-slate-600">
            <Link className="font-semibold text-primary transition hover:text-slate-900" href="/auth">
              Sign in
            </Link>{" "}
            to add tagged feedback to this proposal.
          </div>
        ) : null}
      </div>

      <div className="mt-5 space-y-3">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading comments...
          </div>
        ) : loadError ? (
          <p className="rounded-[1.1rem] border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm text-rose-700">
            {loadError}
          </p>
        ) : comments.length === 0 ? (
          <p className="rounded-[1.1rem] border border-dashed border-slate-200 bg-slate-50/75 px-4 py-4 text-sm leading-6 text-slate-600">
            No comments yet. The first useful contribution could be a feasibility issue, a point of improvement, or supporting evidence.
          </p>
        ) : (
          comments.map((comment) => (
            <article
              className="rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4 shadow-[0_10px_22px_rgba(28,36,48,0.03)]"
              key={comment.id}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[rgba(28,36,48,0.12)] bg-[linear-gradient(145deg,#eef4ff,#f8fafc)] text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
                  {comment.authorAvatarUrl ? (
                    <Image
                      alt={comment.authorLabel}
                      className="h-full w-full object-cover"
                      height={40}
                      src={comment.authorAvatarUrl}
                      unoptimized
                      width={40}
                    />
                  ) : (
                    getInitials(comment.authorLabel)
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">{comment.authorLabel}</p>
                    <span className="text-xs text-slate-400">{formatRelativeTime(comment.createdAt)}</span>
                  </div>
                  <span
                    className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${proposalCommentTagTone(
                      comment.tag,
                    )}`}
                  >
                    {proposalCommentTagLabel(comment.tag)}
                  </span>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{comment.content}</p>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </aside>
  );
}
