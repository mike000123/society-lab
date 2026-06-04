import type { ReactNode } from "react";

import { FeatureStrip } from "@/components/atlas/FeatureStrip";
import { IllustratedTabHero } from "@/components/atlas/IllustratedTabHero";
import { SoftPanel } from "@/components/atlas/SoftPanel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SimulatorHero({
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt,
  actions,
  metrics,
}: {
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  actions?: ReactNode;
  metrics?: {
    description?: string;
    icon?: ReactNode;
    label: string;
    value: string;
  }[];
}) {
  return (
    <IllustratedTabHero
      actions={actions}
      description={description}
      eyebrow={eyebrow}
      imageAlt={imageAlt}
      imageSrc={imageSrc}
      title={title}
    >
      {metrics?.length ? <FeatureStrip items={metrics} /> : null}
    </IllustratedTabHero>
  );
}

export function SimulatorActionRow({
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <>
      <Button asChild className="rounded-full px-5">
        <a href={primaryHref}>{primaryLabel}</a>
      </Button>
      {secondaryHref && secondaryLabel ? (
        <Button asChild className="rounded-full px-5" variant="outline">
          <a href={secondaryHref}>{secondaryLabel}</a>
        </Button>
      ) : null}
    </>
  );
}

export function SimulatorMetricCard({
  label,
  value,
  sub,
  valueClassName,
}: {
  label: string;
  value: string;
  sub?: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-[1.35rem] border border-[rgba(28,36,48,0.08)] bg-white/92 px-4 py-4 shadow-[0_10px_24px_rgba(28,36,48,0.04)] dark:border-slate-800 dark:bg-slate-950/80">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className={cn("mt-2 text-2xl font-black leading-tight text-slate-900 dark:text-slate-50", valueClassName)}>{value}</p>
      {sub ? <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{sub}</p> : null}
    </div>
  );
}

export function SimulatorChartPanel({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-[1.8rem] border border-[rgba(28,36,48,0.08)] bg-white/94 p-5 shadow-[0_18px_34px_rgba(28,36,48,0.05)] dark:border-slate-800 dark:bg-slate-950/80", className)}>
      <div className="mb-4 space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</p>
        {description ? <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p> : null}
      </div>
      {children}
    </div>
  );
}

export function SimulatorSidebarPanel({
  title,
  kicker,
  children,
  tone = "neutral",
  className,
}: {
  title?: string;
  kicker?: string;
  children: ReactNode;
  tone?: "neutral" | "blue" | "gold" | "green";
  className?: string;
}) {
  return (
    <SoftPanel className={cn("space-y-4", className)} tone={tone}>
      {kicker || title ? (
        <div>
          {kicker ? <p className="atlas-kicker">{kicker}</p> : null}
          {title ? <h3 className="atlas-display text-2xl text-slate-900">{title}</h3> : null}
        </div>
      ) : null}
      {children}
    </SoftPanel>
  );
}

export function SimulatorCallout({
  title,
  children,
  tone = "neutral",
}: {
  title: string;
  children: ReactNode;
  tone?: "neutral" | "blue" | "gold" | "green" | "rose";
}) {
  const toneClasses = {
    blue: "border-[rgba(59,130,246,0.18)] bg-[rgba(59,130,246,0.08)]",
    gold: "border-[rgba(212,168,79,0.24)] bg-[rgba(212,168,79,0.09)]",
    green: "border-[rgba(76,175,80,0.2)] bg-[rgba(76,175,80,0.08)]",
    neutral: "border-[rgba(28,36,48,0.08)] bg-white/76 dark:border-slate-800 dark:bg-slate-900/65",
    rose: "border-[rgba(239,68,68,0.18)] bg-[rgba(239,68,68,0.08)]",
  };

  return (
    <div className={cn("rounded-[1.45rem] border px-5 py-4", toneClasses[tone])}>
      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
      <div className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{children}</div>
    </div>
  );
}

export function SimulatorPrimer({
  eyebrow = "How to read this lab",
  title,
  summary,
  items,
  aside,
}: {
  aside?: string;
  eyebrow?: string;
  items: { title: string; text: string }[];
  summary: string;
  title: string;
}) {
  return (
    <section className="grid gap-6 rounded-[2rem] border border-[rgba(28,36,48,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(246,244,238,0.82))] px-6 py-6 shadow-[0_20px_42px_rgba(28,36,48,0.05)] lg:grid-cols-[minmax(0,0.92fr)_minmax(18rem,0.9fr)] lg:px-7">
      <div className="space-y-4">
        <p className="atlas-kicker">{eyebrow}</p>
        <div className="space-y-3">
          <h2 className="atlas-display text-3xl text-slate-900">{title}</h2>
          <p className="atlas-copy text-base leading-7">{summary}</p>
        </div>
        {aside ? (
          <div className="rounded-[1.3rem] border border-[rgba(28,36,48,0.08)] bg-white/76 px-4 py-4 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
            {aside}
          </div>
        ) : null}
      </div>

      <div className="grid gap-3">
        {items.map((item) => (
          <div
            className="rounded-[1.35rem] border border-[rgba(28,36,48,0.08)] bg-white/88 px-4 py-4 shadow-[0_12px_28px_rgba(28,36,48,0.04)] dark:border-slate-700 dark:bg-slate-900/72"
            key={item.title}
          >
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
