import Link from "next/link";
import { ArrowRight, BookOpenText, MessageSquare, Scale, Sparkles, Users } from "lucide-react";

import { AtlasPage } from "@/components/atlas/AtlasPage";
import { IllustratedTabHero } from "@/components/atlas/IllustratedTabHero";
import { SoftPanel } from "@/components/atlas/SoftPanel";
import { AgentPanel } from "@/components/discussion/AgentPanel";
import { DiscussionThread } from "@/components/discussion/discussion-thread";
import { Button } from "@/components/ui/button";

const DEMO_TOPIC =
  "How do financial, political, and social systems create and sustain inequality — and what leverage points exist for change?";

const RELATED_MODULES = [
  {
    slug: "why-gdp-is-not-the-same-as-wellbeing",
    title: "Why GDP does not equal wellbeing",
    tag: "Economy",
  },
  {
    slug: "how-wealth-compounds-faster-than-wages",
    title: "How wealth compounds faster than wages",
    tag: "Inequality",
  },
  {
    slug: "how-electoral-rules-shape-political-power",
    title: "How electoral rules shape political power",
    tag: "Governance",
  },
];

const DISCUSSION_ROLES = [
  {
    icon: MessageSquare,
    title: "Make a claim",
    description: "State the position clearly so the rest of the thread has something precise to respond to.",
    tone: "text-amber-600 border-amber-200 bg-amber-50/80",
  },
  {
    icon: BookOpenText,
    title: "Add evidence",
    description: "Connect your point to a module, dataset, article, or concrete example rather than only opinion.",
    tone: "text-cyan-600 border-cyan-200 bg-cyan-50/80",
  },
  {
    icon: Scale,
    title: "Steel-man it",
    description: "Engage the strongest counterargument before pushing the conversation toward a conclusion.",
    tone: "text-rose-600 border-rose-200 bg-rose-50/80",
  },
];

const EMPTY_POSTS: { kind: string; content: string; author: string }[] = [];

export default function DiscussionsPage() {
  return (
    <AtlasPage className="space-y-8 pb-14">
      <IllustratedTabHero
        actions={
          <>
            <Button asChild className="rounded-full px-5">
              <a href="#discussion-board">
                Start a discussion
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
              href="/learn"
            >
              Explore related modules
              <BookOpenText className="h-4 w-4" />
            </Link>
          </>
        }
        description="Structured conversations for collective clarity, not for winning arguments. Bring a claim, back it up, face the strongest counterpoint, and keep the thread useful for the next person."
        eyebrow="Discuss"
        imageAlt="People gathered around an outdoor table discussing the future of society."
        imageSrc="/atlas/discuss-hero.png"
        title="Discuss what shapes our future"
      >
        <div className="grid gap-3 md:grid-cols-3">
          {DISCUSSION_ROLES.map(({ description, icon: Icon, title, tone }) => (
            <div
              className="rounded-[1.4rem] border border-[rgba(28,36,48,0.08)] bg-white/88 px-4 py-4 shadow-[0_14px_32px_rgba(28,36,48,0.04)]"
              key={title}
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${tone}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold text-slate-900">{title}</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </IllustratedTabHero>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_20rem]">
        <SoftPanel className="space-y-6" id="discussion-board">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="atlas-kicker">Conversation board</p>
              <h2 className="atlas-display mt-2 text-3xl text-slate-900">Current discussions</h2>
              <p className="atlas-copy mt-3 max-w-3xl text-sm">
                Threads should feel more like civic workshops than comment feeds. The structure is simple on purpose:
                make the reasoning visible and keep each contribution legible for the next reader.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {["All discussions", "Following", "My contributions"].map((label, index) => (
                <button
                  className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
                    index === 0
                      ? "border-[rgba(59,130,246,0.25)] bg-[rgba(59,130,246,0.1)] text-slate-900"
                      : "border-[rgba(28,36,48,0.1)] bg-white/90 text-slate-500 hover:text-slate-800"
                  }`}
                  key={label}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <DiscussionThread />
        </SoftPanel>

        <div className="space-y-6">
          <SoftPanel>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-600">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <p className="atlas-kicker">Roles</p>
                <h2 className="atlas-display text-2xl text-slate-900">What makes a good thread</h2>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {DISCUSSION_ROLES.map(({ description, title }) => (
                <div
                  className="rounded-[1.25rem] border border-[rgba(28,36,48,0.08)] bg-white/86 px-4 py-4"
                  key={title}
                >
                  <p className="text-sm font-semibold text-slate-900">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                </div>
              ))}
            </div>
          </SoftPanel>

          <SoftPanel tone="blue">
            <p className="atlas-kicker">Prepare your thinking</p>
            <h2 className="atlas-display mt-2 text-2xl text-slate-900">Start from shared material</h2>
            <div className="mt-4 space-y-3">
              {RELATED_MODULES.map((module) => (
                <Link
                  className="flex items-center justify-between gap-3 rounded-[1.2rem] border border-[rgba(28,36,48,0.08)] bg-white/88 px-4 py-3 transition hover:border-[rgba(28,36,48,0.18)]"
                  href={`/learn/${module.slug}`}
                  key={module.slug}
                >
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{module.tag}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{module.title}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>
              ))}
            </div>
          </SoftPanel>

          <AgentPanel topic={DEMO_TOPIC} recentPosts={EMPTY_POSTS} />
        </div>
      </div>
    </AtlasPage>
  );
}
