"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Database } from "@/lib/database.types";
import { hasSupabaseEnv } from "@/lib/supabase/public-env";
import { createClient } from "@/lib/supabase/client";

type PostKind = Database["public"]["Enums"]["post_kind"];
type PostRow = Database["public"]["Tables"]["posts"]["Row"];

interface LivePost {
  id: string;
  kind: PostKind;
  content: string;
  created_at: string;
  author_label: string;
}

const KIND_LABELS: Record<PostKind, string> = {
  claim: "Claim",
  evidence: "Evidence",
  counterpoint: "Counterpoint",
  question: "Question",
  synthesis: "Synthesis",
};

const KIND_COLORS: Record<PostKind, string> = {
  claim: "text-cyan-300",
  evidence: "text-emerald-300",
  counterpoint: "text-rose-300",
  question: "text-amber-300",
  synthesis: "text-violet-300",
};

// Static fallback shown when Supabase is not connected
const SEED_POSTS: LivePost[] = [
  {
    id: "seed-1",
    kind: "claim",
    content: "Current housing policy incentivizes asset inflation over social stability.",
    created_at: new Date().toISOString(),
    author_label: "Systems Analyst",
  },
  {
    id: "seed-2",
    kind: "counterpoint",
    content: "Supply constraints dominate; financing incentives are secondary but still meaningful.",
    created_at: new Date().toISOString(),
    author_label: "Economist",
  },
  {
    id: "seed-3",
    kind: "question",
    content: "At what point does asset-price growth stop reflecting real productivity gains?",
    created_at: new Date().toISOString(),
    author_label: "Policy Analyst",
  },
];

// ─── Fallback (no Supabase env) ───────────────────────────────────────────────
function StaticThread() {
  return (
    <section className="space-y-3">
      <p className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-xs text-amber-200">
        Connect Supabase to enable live discussions. Showing example posts.
      </p>
      {SEED_POSTS.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </section>
  );
}

// ─── Shared post card ─────────────────────────────────────────────────────────
function PostCard({ post }: { post: LivePost }) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-panel p-4">
      <div className="flex items-center gap-2">
        <span className={`text-xs font-semibold ${KIND_COLORS[post.kind]}`}>
          {KIND_LABELS[post.kind]}
        </span>
        <span className="text-xs text-slate-500">·</span>
        <span className="text-xs text-slate-400">{post.author_label}</span>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-200">{post.content}</p>
    </article>
  );
}

// ─── Live thread (Supabase connected) ────────────────────────────────────────
function LiveThread({ threadId }: { threadId: string }) {
  const [posts, setPosts] = useState<LivePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [kind, setKind] = useState<PostKind>("claim");
  const [submitting, setSubmitting] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  const toDisplayPost = useCallback(
    async (row: PostRow): Promise<LivePost> => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, full_name")
        .eq("id", row.author_id)
        .single();
      const author_label =
        profile?.username ?? profile?.full_name ?? "Anonymous";
      return {
        id: row.id,
        kind: row.kind,
        content: row.content,
        created_at: row.created_at,
        author_label,
      };
    },
    [supabase],
  );

  // Initial load
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!cancelled) setUserId(user?.id ?? null);

      const { data: rows } = await supabase
        .from("posts")
        .select("*")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true })
        .limit(100);

      if (cancelled || !rows) return;

      const display = await Promise.all(rows.map(toDisplayPost));
      if (!cancelled) {
        setPosts(display);
        setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [threadId, supabase, toDisplayPost]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`thread:${threadId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "posts",
          filter: `thread_id=eq.${threadId}`,
        },
        async (payload) => {
          const newPost = await toDisplayPost(payload.new as PostRow);
          setPosts((prev) => {
            if (prev.some((p) => p.id === newPost.id)) return prev;
            return [...prev, newPost];
          });
          setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
        },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [threadId, supabase, toDisplayPost]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || !userId) return;
    setSubmitting(true);
    await supabase.from("posts").insert({
      thread_id: threadId,
      author_id: userId,
      kind,
      content: content.trim(),
    });
    setContent("");
    setSubmitting(false);
  }

  return (
    <section className="space-y-3">
      {loading ? (
        <p className="text-sm text-slate-500">Loading discussion…</p>
      ) : posts.length === 0 ? (
        <p className="text-sm text-slate-500">No posts yet — be the first to add a claim.</p>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
      <div ref={bottomRef} />

      {userId ? (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-700 bg-panel p-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(KIND_LABELS) as PostKind[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  kind === k
                    ? `border-current ${KIND_COLORS[k]} bg-white/5`
                    : "border-slate-700 text-slate-500 hover:border-slate-500"
                }`}
              >
                {KIND_LABELS[k]}
              </button>
            ))}
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Add a ${KIND_LABELS[kind].toLowerCase()}…`}
            rows={3}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={submitting || !content.trim()} className="rounded-2xl gap-2">
              <Send className="h-3.5 w-3.5" />
              {submitting ? "Posting…" : "Post"}
            </Button>
          </div>
        </form>
      ) : (
        <p className="text-xs text-slate-500 text-center py-2">
          <a href="/auth" className="text-cyan-400 hover:underline">Sign in</a> to join the discussion.
        </p>
      )}
    </section>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────
export function DiscussionThread({ threadId }: { threadId?: string }) {
  if (!hasSupabaseEnv) {
    return <StaticThread />;
  }

  if (!threadId) {
    return (
      <section className="space-y-3">
        <p className="text-sm text-slate-500">
          No thread selected. Pass a <code className="text-cyan-300">threadId</code> prop to load a live discussion.
        </p>
        <StaticThread />
      </section>
    );
  }

  return <LiveThread threadId={threadId} />;
}
