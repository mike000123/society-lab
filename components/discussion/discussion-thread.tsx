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
  author_label: string;
  content: string;
  created_at: string;
  id: string;
  kind: PostKind;
}

const KIND_LABELS: Record<PostKind, string> = {
  claim: "Claim",
  counterpoint: "Counterpoint",
  evidence: "Evidence",
  question: "Question",
  synthesis: "Synthesis",
};

const KIND_TONES: Record<PostKind, string> = {
  claim: "border-amber-200 bg-amber-50 text-amber-700",
  counterpoint: "border-rose-200 bg-rose-50 text-rose-700",
  evidence: "border-cyan-200 bg-cyan-50 text-cyan-700",
  question: "border-emerald-200 bg-emerald-50 text-emerald-700",
  synthesis: "border-violet-200 bg-violet-50 text-violet-700",
};

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
  {
    id: "seed-4",
    kind: "synthesis",
    content: "Both supply and financing matter, but the thread suggests the current system rewards asset appreciation faster than housing access.",
    created_at: new Date().toISOString(),
    author_label: "Civic Designer",
  },
];

function timeAgo(iso: string) {
  const delta = Date.now() - new Date(iso).getTime();
  const hours = Math.max(1, Math.floor(delta / (1000 * 60 * 60)));
  if (hours < 24) {
    return `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function ThreadShell({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.7rem] border border-[rgba(28,36,48,0.08)] bg-white/92 shadow-[0_14px_32px_rgba(28,36,48,0.04)]">
      <div className="divide-y divide-[rgba(28,36,48,0.08)] px-5">{children}</div>
      {footer ? <div className="border-t border-[rgba(28,36,48,0.08)] px-5 py-5">{footer}</div> : null}
    </div>
  );
}

function PostRow({ post }: { post: LivePost }) {
  return (
    <article className="grid gap-3 py-4 md:grid-cols-[8rem_minmax(0,1fr)]">
      <div className="space-y-2">
        <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${KIND_TONES[post.kind]}`}>
          {KIND_LABELS[post.kind]}
        </span>
        <div className="text-xs text-slate-500">
          <div className="font-medium text-slate-700">{post.author_label}</div>
          <div>{timeAgo(post.created_at)}</div>
        </div>
      </div>

      <p className="text-sm leading-7 text-slate-700">{post.content}</p>
    </article>
  );
}

function Composer({
  content,
  disabled,
  kind,
  onKindChange,
  onSubmit,
  onContentChange,
  submitting,
}: {
  content: string;
  disabled: boolean;
  kind: PostKind;
  onContentChange: (value: string) => void;
  onKindChange: (value: PostKind) => void;
  onSubmit: (event: React.FormEvent) => void;
  submitting: boolean;
}) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(KIND_LABELS) as PostKind[]).map((value) => (
          <button
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition ${
              kind === value
                ? KIND_TONES[value]
                : "border-[rgba(28,36,48,0.08)] bg-white/90 text-slate-500 hover:text-slate-800"
            }`}
            key={value}
            onClick={() => onKindChange(value)}
            type="button"
          >
            {KIND_LABELS[value]}
          </button>
        ))}
      </div>

      <textarea
        className="w-full rounded-[1.35rem] border border-[rgba(28,36,48,0.12)] bg-[rgba(251,249,245,0.95)] px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[rgb(var(--atlas-primary))] resize-none"
        onChange={(event) => onContentChange(event.target.value)}
        placeholder={`Add a ${KIND_LABELS[kind].toLowerCase()}...`}
        rows={3}
        value={content}
      />

      <div className="flex justify-end">
        <Button className="rounded-full gap-2 px-5" disabled={disabled} type="submit">
          <Send className="h-3.5 w-3.5" />
          {submitting ? "Posting..." : "Post"}
        </Button>
      </div>
    </form>
  );
}

function StaticThread() {
  return (
    <div className="space-y-3">
      <p className="rounded-[1.1rem] border border-amber-200 bg-amber-50/80 px-4 py-3 text-xs text-amber-700">
        Connect Supabase to enable live discussions. Showing example posts for now.
      </p>

      <ThreadShell>
        {SEED_POSTS.map((post) => (
          <PostRow key={post.id} post={post} />
        ))}
      </ThreadShell>
    </div>
  );
}

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
      const author_label = profile?.username ?? profile?.full_name ?? "Anonymous";
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

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!cancelled) {
        setUserId(user?.id ?? null);
      }

      const { data: rows } = await supabase
        .from("posts")
        .select("*")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true })
        .limit(100);

      if (cancelled || !rows) {
        return;
      }

      const display = await Promise.all(rows.map(toDisplayPost));
      if (!cancelled) {
        setPosts(display);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [threadId, supabase, toDisplayPost]);

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
          setPosts((previous) => {
            if (previous.some((post) => post.id === newPost.id)) {
              return previous;
            }
            return [...previous, newPost];
          });
          setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [threadId, supabase, toDisplayPost]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!content.trim() || !userId) {
      return;
    }

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
    <ThreadShell
      footer={
        userId ? (
          <Composer
            content={content}
            disabled={submitting || !content.trim()}
            kind={kind}
            onContentChange={setContent}
            onKindChange={setKind}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        ) : (
          <p className="text-center text-sm text-slate-500">
            <a className="font-medium text-[rgb(var(--atlas-primary))] hover:underline" href="/auth">
              Sign in
            </a>{" "}
            to join the discussion.
          </p>
        )
      }
    >
      {loading ? (
        <p className="py-4 text-sm text-slate-500">Loading discussion...</p>
      ) : posts.length === 0 ? (
        <p className="py-4 text-sm text-slate-500">No posts yet. Be the first to add a claim.</p>
      ) : (
        posts.map((post) => <PostRow key={post.id} post={post} />)
      )}
      <div ref={bottomRef} />
    </ThreadShell>
  );
}

export function DiscussionThread({ threadId }: { threadId?: string }) {
  if (!hasSupabaseEnv) {
    return <StaticThread />;
  }

  if (!threadId) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-500">
          No thread selected. Pass a <code className="font-semibold text-slate-700">threadId</code> prop to load a
          live discussion.
        </p>
        <StaticThread />
      </div>
    );
  }

  return <LiveThread threadId={threadId} />;
}
