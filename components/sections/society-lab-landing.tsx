"use client";

import Image from "next/image";
import Link from "next/link";
import type { ElementType } from "react";
import {
  ArrowRight,
  Banknote,
  BookOpenText,
  Building2,
  ChartColumnBig,
  CircleDot,
  Compass,
  FlaskConical,
  Globe2,
  House,
  Landmark,
  Leaf,
  MessagesSquare,
  Newspaper,
  Users,
} from "lucide-react";

import { AtlasPage } from "@/components/atlas/AtlasPage";
import { Button } from "@/components/ui/button";
import { getSeededPublicThreadById, SEEDED_PUBLIC_THREADS } from "@/lib/discussion/seeded-public-threads";
import {
  POPULAR_QUESTIONS,
  type PopularQuestionCard,
} from "@/lib/learn/discovery";
import { cn } from "@/lib/utils";

const QUESTION_ICONS: Record<PopularQuestionCard["icon"], ElementType> = {
  banking: Banknote,
  city: House,
  ecology: Leaf,
  media: MessagesSquare,
  metrics: ChartColumnBig,
  politics: Landmark,
};

const QUESTION_CARD_TONES: Record<
  PopularQuestionCard["icon"],
  {
    card: string;
    icon: string;
  }
> = {
  banking: {
    card: "bg-[linear-gradient(180deg,rgba(240,252,244,0.95),rgba(255,255,255,0.98))]",
    icon: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  city: {
    card: "bg-[linear-gradient(180deg,rgba(255,247,237,0.96),rgba(255,255,255,0.98))]",
    icon: "border-amber-200 bg-amber-50 text-amber-700",
  },
  ecology: {
    card: "bg-[linear-gradient(180deg,rgba(240,253,250,0.96),rgba(255,255,255,0.98))]",
    icon: "border-cyan-200 bg-cyan-50 text-cyan-700",
  },
  media: {
    card: "bg-[linear-gradient(180deg,rgba(254,242,242,0.96),rgba(255,255,255,0.98))]",
    icon: "border-rose-200 bg-rose-50 text-rose-700",
  },
  metrics: {
    card: "bg-[linear-gradient(180deg,rgba(239,246,255,0.96),rgba(255,255,255,0.98))]",
    icon: "border-blue-200 bg-blue-50 text-blue-700",
  },
  politics: {
    card: "bg-[linear-gradient(180deg,rgba(245,243,255,0.96),rgba(255,255,255,0.98))]",
    icon: "border-violet-200 bg-violet-50 text-violet-700",
  },
};

const WHY_IT_EXISTS = [
  {
    description: "Events and headlines tell us what is happening in the world.",
    icon: Newspaper,
    imageSrc: "/atlas/home-domain-media-information.png",
    prompt: "What happened?",
    title: "1. News",
  },
  {
    description: "We study the underlying systems and structures that drive outcomes.",
    icon: Building2,
    imageSrc: "/atlas/home-domain-economy.png",
    prompt: "Why did it happen?",
    title: "2. Systems",
  },
  {
    description: "We test ideas and policies in models to explore alternative futures.",
    icon: FlaskConical,
    imageSrc: "/atlas/home-world3-card.png",
    prompt: "What if we change the rules?",
    title: "3. Simulations",
  },
  {
    description: "We discuss, challenge assumptions, and design better solutions together.",
    icon: Users,
    imageSrc: "/atlas/discuss-hero.png",
    prompt: "What should we do about it?",
    title: "4. Discussion & Action",
  },
];

const VALUE_STRIP = [
  {
    description: "Grounded in data and research",
    icon: BookOpenText,
    title: "Evidence-first",
  },
  {
    description: "See the big picture, not just parts",
    icon: Globe2,
    title: "Systems thinking",
  },
  {
    description: "Explore multiple perspectives",
    icon: Compass,
    title: "Open & neutral",
  },
  {
    description: "Better together than alone",
    icon: CircleDot,
    title: "People-powered",
  },
];

const SIMULATION_PROMPTS = [
  {
    badge: "Intermediate",
    href: "/simulator/macro-economy",
    imageSrc: "/atlas/learn-track-money-wealth.png",
    subtitle: "Macro Economy Lab",
    title: "…banks stop creating money?",
  },
  {
    badge: "Intermediate",
    href: "/simulator/financial-crisis",
    imageSrc: "/atlas/simulator-financial-crisis-card.png",
    subtitle: "Financial Crisis Simulator",
    title: "…a housing bubble bursts?",
  },
  {
    badge: "Advanced",
    href: "/simulator/world3",
    imageSrc: "/atlas/home-world3-card.png",
    subtitle: "World3 Simulator",
    title: "…growth hits ecological limits?",
  },
  {
    badge: "Beginner",
    href: "/simulator/purchasing-power",
    imageSrc: "/atlas/simulator-purchasing-power-card.png",
    subtitle: "Purchasing Power",
    title: "…inflation stays high for 10 years?",
  },
];

const COMMUNITY_EXPLORING = SEEDED_PUBLIC_THREADS.map((thread) => {
  const linkedProposal = getSeededPublicThreadById(thread.id)?.proposalId;

  return {
    discussionHref: `/discussions?thread=${thread.id}`,
    kind: thread.homeKind,
    meta: thread.homeMeta,
    proposalHref: linkedProposal ? `/governance/${linkedProposal}` : null,
    title: thread.title,
  };
});

const FOOTER_STEPS = [
  { href: "/learn", title: "Learn how it works." },
  { href: "/simulator", title: "Test your assumptions." },
  { href: "/discussions", title: "Discuss what matters." },
  { href: "/governance", title: "Build better systems together." },
];

function CommunityAvatars() {
  const hues = ["bg-blue-100 text-blue-700", "bg-green-100 text-green-700", "bg-amber-100 text-amber-700", "bg-rose-100 text-rose-700"];
  return (
    <div className="flex -space-x-2">
      {["AL", "MK", "EN", "SO"].map((label, index) => (
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-semibold",
            hues[index % hues.length],
          )}
          key={label}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

function QuestionCard({ question }: { question: PopularQuestionCard }) {
  const Icon = QUESTION_ICONS[question.icon];
  const tone = QUESTION_CARD_TONES[question.icon];

  return (
    <Link
      className={cn(
        "group flex h-full flex-col justify-between rounded-[1.65rem] border border-[rgba(28,36,48,0.08)] px-4 py-4 shadow-[0_14px_28px_rgba(28,36,48,0.04)] transition-all hover:border-[rgba(28,36,48,0.18)] hover:shadow-[0_18px_36px_rgba(28,36,48,0.06)]",
        tone.card,
      )}
      href={`/learn?question=${question.id}#popular-questions`}
    >
      <div className="space-y-4">
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-full border", tone.icon)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-3">
          <h3 className="text-[1.05rem] font-semibold leading-7 text-slate-900">{question.title}</h3>
          <p className="text-sm leading-6 text-slate-600">{question.description}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-3 text-slate-500">
          <span>{question.moduleCount} lessons</span>
          <CommunityAvatars />
          <span>+{question.learnerCount}</span>
        </div>
        <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>
    </Link>
  );
}

function SimulationPromptCard({
  badge,
  href,
  imageSrc,
  subtitle,
  title,
}: (typeof SIMULATION_PROMPTS)[number]) {
  return (
    <Link
      className="group rounded-[1.35rem] border border-[rgba(28,36,48,0.08)] bg-white p-3 shadow-[0_12px_26px_rgba(28,36,48,0.04)] transition-all hover:border-[rgba(28,36,48,0.18)] hover:shadow-[0_16px_30px_rgba(28,36,48,0.06)]"
      href={href}
    >
      <div className="relative h-[8.25rem] overflow-hidden rounded-[1rem]">
        <Image alt={title} className="object-cover object-center" fill sizes="280px" src={imageSrc} />
      </div>
      <div className="space-y-2 px-1 pb-1 pt-3">
        <h3 className="text-[1rem] font-semibold leading-6 text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">{subtitle}</p>
        <span className="inline-flex rounded-full border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.84)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
          {badge}
        </span>
      </div>
    </Link>
  );
}

function CommunityCard({
  discussionHref,
  kind,
  meta,
  proposalHref,
  title,
}: (typeof COMMUNITY_EXPLORING)[number]) {
  const tone =
    kind === "Claim"
      ? "bg-blue-50 text-blue-700"
      : kind === "Proposal"
        ? "bg-green-50 text-green-700"
        : kind === "Question"
          ? "bg-amber-50 text-amber-700"
          : "bg-violet-50 text-violet-700";

  return (
    <div className="rounded-[1.45rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4 shadow-[0_12px_26px_rgba(28,36,48,0.04)]">
      <div className="space-y-4">
        <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]", tone)}>
          {kind}
        </span>
        <Link className="block text-[1.02rem] font-semibold leading-7 text-slate-900 transition hover:text-primary" href={discussionHref}>
          {title}
        </Link>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-sm text-slate-500">{meta}</span>
        <CommunityAvatars />
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
        <Link className="inline-flex items-center gap-1 text-primary transition hover:text-blue-700" href={discussionHref}>
          Open discussion
          <ArrowRight className="h-4 w-4" />
        </Link>
        {proposalHref ? (
          <Link className="inline-flex items-center gap-1 text-slate-600 transition hover:text-slate-900" href={proposalHref}>
            Related proposal
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export function SocietyLabLanding() {
  return (
    <AtlasPage className="space-y-6 pb-20">
      <section className="relative ml-[calc(50%-50vw)] w-screen overflow-hidden border-y border-[rgba(28,36,48,0.08)] bg-white shadow-[0_28px_72px_rgba(28,36,48,0.05)]">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] md:block lg:w-[55%] xl:w-[53%]">
          <Image
            alt="People looking over a city while asking what kind of future is being built."
            className="object-cover object-right-center"
            fill
            sizes="(min-width: 1280px) 53vw, (min-width: 1024px) 55vw, 58vw"
            src="/atlas/home-hero.png"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0.92)_14%,rgba(255,255,255,0.58)_34%,rgba(255,255,255,0.16)_56%,rgba(255,255,255,0)_74%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[88rem] px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="flex min-h-[20rem] max-w-[37rem] flex-col justify-center gap-5 lg:min-h-[22rem]">
            <h1 className="atlas-display max-w-[31rem] text-[2.8rem] leading-[0.94] text-slate-900 sm:text-[3.45rem] lg:text-[4.1rem]">
              Why does the world feel harder than it should?
            </h1>

            <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-700">
              <span className="inline-flex items-center gap-2">
                <House className="h-4 w-4 text-primary" />
                Housing becomes less affordable.
              </span>
              <span className="inline-flex items-center gap-2">
                <ChartColumnBig className="h-4 w-4 text-primary" />
                Stress rises despite economic growth.
              </span>
            </div>

            <p className="max-w-[31rem] text-[0.98rem] leading-8 text-slate-700">
              Society Lab helps you understand the systems behind these problems, explore alternative futures, and discuss solutions together.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button asChild className="rounded-full px-6" size="lg">
                <Link href="/learn#popular-questions">Start with a question</Link>
              </Button>
              <Button asChild className="rounded-full px-6" size="lg" variant="outline">
                <Link href="/simulator">
                  Explore simulations
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[rgba(28,36,48,0.08)] bg-white px-6 py-6 shadow-[0_18px_40px_rgba(28,36,48,0.05)]">
        <h2 className="text-[1.85rem] font-semibold text-slate-900">Why Society Lab exists</h2>
        <div className="mt-6 grid gap-5 xl:grid-cols-4 xl:items-stretch">
          {WHY_IT_EXISTS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div className="relative h-full" key={step.title}>
                <div className="relative h-full min-h-[12.5rem] overflow-hidden rounded-[1.55rem] border border-[rgba(28,36,48,0.08)] bg-white px-5 py-5 shadow-[0_12px_26px_rgba(28,36,48,0.04)]">
                  <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <Image
                      alt={step.title}
                      className="object-cover object-center opacity-100"
                      fill
                      sizes="(min-width: 1280px) 21vw, (min-width: 768px) 42vw, 100vw"
                      src={step.imageSrc}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.52)_0%,rgba(255,255,255,0.36)_20%,rgba(255,255,255,0.18)_46%,rgba(255,255,255,0.12)_72%,rgba(255,255,255,0.34)_100%)]" />
                  </div>

                  <div className="relative z-10 flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-none items-center justify-center rounded-[1.4rem] border border-[rgba(28,36,48,0.12)] bg-white text-primary shadow-[0_8px_18px_rgba(28,36,48,0.05)]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 space-y-2 pt-0.5">
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{step.title}</p>
                      <p className="text-[1.02rem] font-semibold text-slate-900">{step.prompt}</p>
                      <p className="text-sm leading-6 text-slate-600">{step.description}</p>
                    </div>
                  </div>
                </div>

                {index < WHY_IT_EXISTS.length - 1 ? (
                  <div className="pointer-events-none absolute -right-7 top-1/2 z-20 hidden -translate-y-1/2 items-center xl:flex">
                    <span className="h-px w-7 bg-[rgba(28,36,48,0.22)]" />
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(28,36,48,0.12)] bg-white shadow-[0_10px_18px_rgba(28,36,48,0.08)]">
                      <ArrowRight className="h-4 w-4 text-slate-500" />
                    </span>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="mt-0 rounded-[1.35rem] border border-[rgba(28,36,48,0.08)] bg-white px-5 py-4 text-center shadow-[0_10px_24px_rgba(28,36,48,0.03)]">
          <p className="text-[1.12rem] font-semibold text-slate-900">
            Society Lab connects <span className="text-primary">all four.</span>
          </p>
        </div>

        <div className="mt-0 rounded-[1.4rem] border border-[rgba(28,36,48,0.08)] bg-white px-4 py-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {VALUE_STRIP.map((item) => {
              const Icon = item.icon;
              return (
                <div className="flex items-start gap-3 rounded-[1.05rem] bg-white px-3 py-3" key={item.title}>
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-[rgba(28,36,48,0.1)] bg-white text-primary">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="text-xs leading-5 text-slate-600">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="space-y-4" id="start-with-a-question">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-[1.95rem] font-semibold text-slate-900">Start with a question</h2>
            <p className="text-sm leading-7 text-slate-600">Pick a topic that resonates with you.</p>
          </div>
          <Link className="text-sm font-semibold text-primary transition hover:text-blue-700" href="/learn#popular-questions">
            Explore all questions
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {POPULAR_QUESTIONS.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="rounded-[2rem] border border-[rgba(28,36,48,0.08)] bg-white px-6 py-6 shadow-[0_18px_40px_rgba(28,36,48,0.05)]">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-500">Explore the world</p>
            <h2 className="text-[1.9rem] font-semibold text-slate-900">Why do some societies perform better than others?</h2>
            <p className="text-sm leading-7 text-slate-600">Compare countries across wellbeing, inequality, corruption, media freedom, and more.</p>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[14rem_minmax(0,1fr)] lg:items-center">
            <div className="space-y-3 text-sm text-slate-600">
              {["Wellbeing", "Inequality", "Corruption", "Media freedom", "And more..."].map((item) => (
                <div className="flex items-center gap-2" key={item}>
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                  {item}
                </div>
              ))}
              <Button asChild className="mt-2 rounded-full px-5" variant="outline">
                <Link href="/map">
                  Open the map
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="relative h-[15rem] overflow-hidden rounded-[1.5rem] border border-[rgba(28,36,48,0.08)] bg-[linear-gradient(180deg,rgba(247,249,246,0.94),rgba(255,255,255,0.92))]">
              <Image alt="Global systems map" className="object-cover object-center" fill sizes="700px" src="/atlas/home-world-map.png" />
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[rgba(28,36,48,0.08)] bg-white px-6 py-6 shadow-[0_18px_40px_rgba(28,36,48,0.05)]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-500">Simulate the future</p>
              <h2 className="text-[1.9rem] font-semibold text-slate-900">What happens if...</h2>
            </div>
            <Link className="text-sm font-semibold text-primary transition hover:text-blue-700" href="/simulator">
              Browse all simulations
            </Link>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {SIMULATION_PROMPTS.map((prompt) => (
              <SimulationPromptCard key={prompt.title} {...prompt} />
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-[1.95rem] font-semibold text-slate-900">What the community is exploring</h2>
            <p className="text-sm leading-7 text-slate-600">Claims, questions and proposals from across Society Lab.</p>
          </div>
          <Link className="text-sm font-semibold text-primary transition hover:text-blue-700" href="/discussions">
            See all activity
          </Link>
        </div>

        <div className="grid gap-4 xl:grid-cols-4">
          {COMMUNITY_EXPLORING.map((item) => (
            <CommunityCard key={item.title} {...item} />
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-[2.2rem] bg-[linear-gradient(135deg,#131c37,#1c2548_55%,#24335f)] px-6 py-8 text-white shadow-[0_24px_50px_rgba(10,16,32,0.18)] sm:px-8 sm:py-10">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
          <div className="space-y-5">
            <h2 className="atlas-display max-w-[28rem] text-[2.6rem] leading-[0.96] text-white sm:text-[3.3rem]">
              The world is too complex for simple answers.
            </h2>
            <div className="flex flex-wrap gap-6 text-sm text-white/80">
              {FOOTER_STEPS.map((step) => (
                <Link className="transition hover:text-white" href={step.href} key={step.title}>
                  {step.title}
                </Link>
              ))}
            </div>
          </div>

          <Button asChild className="rounded-full bg-white px-7 text-slate-900 hover:bg-slate-100" size="lg">
            <Link href="/auth">
              Join Society Lab
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </AtlasPage>
  );
}
