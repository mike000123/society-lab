import Image from "next/image";
import Link from "next/link";
import type { ElementType } from "react";
import { ArrowRight, FlaskConical, Globe, PlayCircle, TrendingUp, Zap } from "lucide-react";

import { FEATURE_STYLES, FEATURED_SLUGS, SIMULATORS, type SimulatorEntry } from "@/lib/simulator/data";

import { AtlasPage } from "@/components/atlas/AtlasPage";
import { IllustratedTabHero } from "@/components/atlas/IllustratedTabHero";
import { SimulatorRegionPicker } from "@/components/simulator/SimulatorRegionPicker";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function FeaturedSimulationCard({ simulator }: { simulator: SimulatorEntry }) {
  const Icon = simulator.icon;
  const styles = FEATURE_STYLES[simulator.accent];
  const usesFeaturedImage = Boolean(simulator.featuredImageSrc);

  return (
    <article className="overflow-hidden rounded-[1.6rem] border border-[rgba(28,36,48,0.08)] bg-white/90 shadow-[0_14px_32px_rgba(28,36,48,0.04)]">
      <div className="relative h-36 overflow-hidden border-b border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.9)]">
        {usesFeaturedImage ? (
          <Image
            alt={simulator.featuredImageAlt ?? simulator.title}
            className="object-cover"
            fill
            sizes="(max-width: 1024px) 100vw, 25vw"
            src={simulator.featuredImageSrc!}
          />
        ) : (
          <>
            <div className={cn("absolute inset-x-0 top-0 h-full bg-gradient-to-br", styles.glow)} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={cn("flex h-14 w-14 items-center justify-center rounded-full border", styles.badge)}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <span className={cn("inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]", styles.badge)}>
            {simulator.complexity}
          </span>
          <span className="text-xs text-slate-500">{simulator.tagline}</span>
        </div>
        <h2 className="mt-3 text-xl font-semibold leading-7 text-slate-900">{simulator.title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">{simulator.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {simulator.tags.slice(0, 3).map((tag) => (
            <span className={cn("rounded-full border px-3 py-1 text-xs font-medium", styles.tile)} key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-5">
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold text-[rgb(var(--atlas-primary))] transition hover:text-slate-900"
            href={simulator.slug}
          >
            Launch
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function SimulatorHubPage() {
  const featuredSimulators = FEATURED_SLUGS
    .map((slug) => SIMULATORS.find((s) => s.slug === slug))
    .filter(Boolean) as SimulatorEntry[];

  return (
    <AtlasPage className="space-y-8 pb-14">
      <IllustratedTabHero
        actions={
          <>
            <Button asChild className="rounded-full px-5">
              <a href="#featured-simulations">Browse simulators</a>
            </Button>
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[rgba(28,36,48,0.22)] hover:text-slate-900"
              href="/simulator/world3"
            >
              <PlayCircle className="h-4 w-4" />
              Open World3
            </Link>
          </>
        }
        description="Run real models, test alternate decisions, and explore the long-term consequences before they happen."
        eyebrow="Simulation Lab"
        imageAlt="A mountain valley containing a future city and people overlooking a systems dashboard."
        imageSrc="/atlas/simulator-hero.png"
        title="Run the systems. Explore the futures."
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {([
            { description: "Built from systems thinking and real data patterns.", icon: Globe, title: "Real models" },
            { description: "Change variables directly and watch the dynamics respond.", icon: Zap, title: "Interactive" },
            { description: "Many simulators show years or decades, not just a moment.", icon: TrendingUp, title: "Long-term view" },
            { description: "Compare scenarios and see which futures become more stable.", icon: FlaskConical, title: "Compare futures" },
          ] as { description: string; icon: ElementType; title: string }[]).map(({ description, icon: Icon, title }) => (
            <div
              className="rounded-[1.4rem] border border-[rgba(28,36,48,0.08)] bg-white/88 px-4 py-4 shadow-[0_14px_32px_rgba(28,36,48,0.04)]"
              key={title}
            >
              <div className="inline-flex rounded-full border border-[rgba(59,130,246,0.16)] bg-[rgba(59,130,246,0.08)] p-2 text-[rgb(var(--atlas-primary))]">
                <Icon className="h-4 w-4" />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-900">{title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </IllustratedTabHero>
      <section className="space-y-4" id="featured-simulations">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="atlas-kicker">Featured simulations</p>
            <h2 className="atlas-display mt-2 text-3xl text-slate-900">Start with the clearest entry points</h2>
          </div>
          <span className="text-sm text-slate-500">{SIMULATORS.length} simulators across 4 regions</span>
        </div>
        <div className="grid gap-4 xl:grid-cols-4">
          {featuredSimulators.map((simulator) => (
            <FeaturedSimulationCard key={simulator.slug} simulator={simulator} />
          ))}
        </div>
      </section>
      <SimulatorRegionPicker />
    </AtlasPage>
  );
}
