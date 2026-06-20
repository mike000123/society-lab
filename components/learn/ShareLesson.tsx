"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Linkedin, Share2, Twitter } from "lucide-react";

import { cn } from "@/lib/utils";

// ── Share targets ──────────────────────────────────────────────────────────────

function buildShareText(title: string, summary: string): string {
  // Keep under 240 chars so the URL fits in a tweet
  const base = `"${title}" — ${summary}`;
  return base.length > 220 ? base.slice(0, 217) + "…" : base;
}

function shareUrls(title: string, summary: string, url: string) {
  const text = buildShareText(title, summary);
  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + "\n\n" + url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ShareLesson({
  className,
  slug,
  summary,
  title,
}: {
  className?: string;
  slug: string;
  summary: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Detect native share support (mobile / some desktop browsers)
  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  // Close popover on outside click
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const getUrl = () => `${window.location.origin}/learn/${slug}`;

  async function handleShare() {
    const url = getUrl();
    if (canNativeShare) {
      try {
        await navigator.share({ title, text: buildShareText(title, summary), url });
        return;
      } catch {
        // User cancelled or API unavailable — fall through to popover
      }
    }
    setOpen((v) => !v);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select the URL from a temp input
      const el = document.createElement("input");
      el.value = getUrl();
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const urls = open ? shareUrls(title, summary, getUrl()) : { twitter: "#", linkedin: "#" };

  return (
    <div className="relative" ref={ref}>
      <button
        aria-label="Share this lesson"
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white/88 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900",
          className,
        )}
        onClick={handleShare}
        type="button"
      >
        <Share2 className="h-4 w-4" />
        Share
      </button>

      {open && (
        <div className="absolute bottom-full left-0 z-50 mb-2 w-52 overflow-hidden rounded-[1.2rem] border border-[rgba(28,36,48,0.1)] bg-white shadow-[0_16px_40px_rgba(28,36,48,0.12)]">
          <p className="px-4 pb-1 pt-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Share this lesson
          </p>

          <a
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            href={urls.twitter}
            onClick={() => setOpen(false)}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Twitter className="h-4 w-4 shrink-0 text-[#1d9bf0]" />
            Share on X
          </a>

          <a
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            href={urls.linkedin}
            onClick={() => setOpen(false)}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Linkedin className="h-4 w-4 shrink-0 text-[#0a66c2]" />
            Share on LinkedIn
          </a>

          <div className="mx-4 my-1 border-t border-[rgba(28,36,48,0.06)]" />

          <button
            className={cn(
              "flex w-full items-center gap-3 px-4 py-2.5 pb-3 text-sm font-medium transition",
              copied ? "text-emerald-600" : "text-slate-700 hover:bg-slate-50",
            )}
            onClick={copyLink}
            type="button"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 shrink-0" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 shrink-0" />
                    Copy link
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
