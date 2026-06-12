"use client";

import { useEffect, useRef, useState } from "react";
import { MessageSquare, Users, X } from "lucide-react";

import { PublicDiscussionStarter } from "@/components/discussion/PublicDiscussionStarter";
import { SharedLearnersPanel } from "@/components/social/SharedLearnersPanel";
import type { ResolvedLearningModule } from "@/lib/learn/modules";
import { cn } from "@/lib/utils";

type Tab = "public" | "circle";

export function StartDiscussionModal({ module }: { module: ResolvedLearningModule }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("public");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Scroll modal to top when switching tabs
  function switchTab(next: Tab) {
    setTab(next);
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      {/* ── Trigger ── */}
      <button
        className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white/88 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
        onClick={() => setOpen(true)}
        type="button"
      >
        <MessageSquare className="h-4 w-4" />
        Discuss
      </button>

      {/* ── Modal overlay ── */}
      {open ? (
        <div
          aria-modal
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Card */}
          <div className="relative z-10 flex w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_80px_rgba(28,36,48,0.22)]" style={{ maxHeight: "90dvh" }}>

            {/* Header — sticky */}
            <div className="flex flex-none items-start justify-between gap-4 border-b border-[rgba(28,36,48,0.08)] px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Start a discussion
                </p>
                <h2 className="mt-0.5 text-base font-semibold leading-6 text-slate-900">
                  {module.title}
                </h2>
              </div>
              <button
                aria-label="Close dialog"
                className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-[rgba(28,36,48,0.10)] bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                onClick={() => setOpen(false)}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex flex-none border-b border-[rgba(28,36,48,0.08)]">
              {(
                [
                  { icon: MessageSquare, id: "public" as const, label: "Public discussion" },
                  { icon: Users,         id: "circle" as const, label: "Study circle" },
                ] as const
              ).map(({ id, label, icon: Icon }) => (
                <button
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 border-b-2 px-4 py-3.5 text-sm font-semibold transition",
                    tab === id
                      ? "border-slate-900 text-slate-900"
                      : "border-transparent text-slate-500 hover:text-slate-800",
                  )}
                  key={id}
                  onClick={() => switchTab(id)}
                  type="button"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto" ref={scrollRef}>
              <div className="p-6">
                {tab === "public" ? (
                  <PublicDiscussionStarter
                    compact
                    contextSlug={module.slug}
                    contextType="module"
                    initialPrompt={module.discussionPrompt}
                    initialTitle={`Let's discuss: ${module.title}`}
                    onSuccess={() => setOpen(false)}
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-[1.35rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.55)] px-4 py-4">
                      <p className="text-sm font-semibold text-slate-900">How study circles work</p>
                      <p className="mt-1.5 text-sm leading-6 text-slate-600">
                        A study circle is a small private thread tied to this module. Select one or more
                        fellow learners below and send them an invite. Once they accept, you share a
                        private space to discuss, question, and build on the material together.
                      </p>
                    </div>
                    <SharedLearnersPanel
                      contextSlug={module.slug}
                      contextTitle={module.title}
                      contextType="module"
                      onSuccess={() => setOpen(false)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
