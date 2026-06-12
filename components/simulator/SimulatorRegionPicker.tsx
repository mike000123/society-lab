"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, X } from "lucide-react";

import { SoftPanel } from "@/components/atlas/SoftPanel";
import { CardCarousel } from "@/components/ui/CardCarousel";
import { cn } from "@/lib/utils";
import {
  FEATURE_STYLES,
  SIMULATOR_GROUPS,
  SIMULATORS,
  type SimulatorEntry,
  type SimulatorGroup,
} from "@/lib/simulator/data";

export type { SimulatorEntry } from "@/lib/simulator/data";

function RegionCard({
  group,
  isSelected,
  onSelect,
}: {
  group: SimulatorGroup;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      className={cn(
        "flex flex-col items-center justify-center rounded-[1.35rem] border px-4 py-4 text-center transition sm:min-h-[14rem] xl:aspect-[4/3] xl:min-h-0",
        isSelected
          ? "border-primary bg-white shadow-[0_18px_38px_rgba(59,130,246,0.10)]"
          : "border-[rgba(28,36,48,0.08)] bg-white/88 hover:border-[rgba(28,36,48,0.18)] hover:shadow-[0_14px_28px_rgba(28,36,48,0.06)]",
      )}
      onClick={onSelect}
      type="button"
    >
      <div className="mb-3 flex items-center justify-center">
        <Image
          alt={group.iconAlt}
          className="h-[4.25rem] w-[4.25rem] object-contain"
          height={68}
          src={group.iconSrc}
          width={68}
        />
      </div>
      <p className="text-sm font-semibold text-slate-900">{group.label}</p>
      <p className="mx-auto mt-1.5 max-w-[15rem] text-sm leading-6 text-slate-600">
        {group.description}
      </p>
      <p className="mt-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        {group.slugs.length} simulator{group.slugs.length > 1 ? "s" : ""}
      </p>
      {isSelected ? (
        <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary">
          <ChevronDown className="h-3.5 w-3.5" />
          Showing below
        </div>
      ) : null}
    </button>
  );
}

function SimulatorCard({ simulator }: { simulator: SimulatorEntry }) {
  const styles = FEATURE_STYLES[simulator.accent];
  const heroImage = simulator.featuredImageSrc ?? simulator.cardImageSrc;

  return (
    <Link
      className="group flex flex-col overflow-hidden rounded-[1.6rem] border border-[rgba(28,36,48,0.08)] bg-white shadow-[0_14px_32px_rgba(28,36,48,0.04)] transition hover:border-[rgba(28,36,48,0.16)] hover:shadow-[0_18px_32px_rgba(28,36,48,0.08)]"
      href={simulator.slug}
    >
      {heroImage ? (
        <div className="relative h-36 shrink-0 overflow-hidden border-b border-[rgba(28,36,48,0.07)] bg-[rgba(246,244,238,0.9)]">
          <Image
            alt={simulator.title}
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            fill
            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 90vw"
            src={heroImage}
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-3">
          <span className={cn("inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]", styles.badge)}>
            {simulator.complexity}
          </span>
          <span className="text-xs text-slate-500">{simulator.tagline}</span>
        </div>
        <h4 className="mt-3 text-[1rem] font-semibold leading-6 text-slate-900">{simulator.title}</h4>
        <p className="mt-2 text-sm leading-6 text-slate-600">{simulator.description}</p>
      </div>
    </Link>
  );
}

export function SimulatorRegionPicker() {
  const [selectedLabel, setSelectedLabel] = useState<string | null>("Banking and crises");

  const selectedGroup = SIMULATOR_GROUPS.find((g) => g.label === selectedLabel) ?? null;
  const selectedSimulators = selectedGroup
    ? selectedGroup.slugs
        .map((slug) => SIMULATORS.find((s) => s.slug === slug))
        .filter((s): s is SimulatorEntry => Boolean(s))
    : [];

  return (
    <SoftPanel className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="atlas-kicker">Browse by category</p>
          <h2 className="atlas-display mt-2 text-3xl text-slate-900">
            Choose a simulation region
          </h2>
        </div>
        <Link
          className="text-sm font-semibold text-slate-500 transition hover:text-slate-900"
          href="/learn"
        >
          Learn the theory first
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {SIMULATOR_GROUPS.map((group) => (
          <RegionCard
            group={group}
            isSelected={selectedLabel === group.label}
            key={group.label}
            onSelect={() =>
              setSelectedLabel((prev) => (prev === group.label ? null : group.label))
            }
          />
        ))}
      </div>

      {selectedGroup && selectedSimulators.length > 0 ? (
        <SoftPanel className="space-y-4" id="region-simulators" tone="blue">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {selectedGroup.label}
              </p>
              <p className="mt-0.5 text-sm text-slate-600">{selectedGroup.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-[rgba(28,36,48,0.08)] bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                {selectedSimulators.length} simulator{selectedSimulators.length > 1 ? "s" : ""}
              </span>
              <button
                aria-label="Close region panel"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(28,36,48,0.10)] bg-white text-slate-400 transition hover:text-slate-700"
                onClick={() => setSelectedLabel(null)}
                type="button"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <CardCarousel perPage={3} className="px-6">
            {selectedSimulators.map((simulator) => (
              <SimulatorCard key={simulator.slug} simulator={simulator} />
            ))}
          </CardCarousel>
        </SoftPanel>
      ) : null}
    </SoftPanel>
  );
}
