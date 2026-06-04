import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { SoftPanel } from "@/components/atlas/SoftPanel";

export function AtlasHero({
  actions,
  aside,
  children,
  className,
  description,
  eyebrow,
  title,
}: {
  actions?: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
  className?: string;
  description: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <section className={cn("relative overflow-hidden rounded-[2.5rem] atlas-panel atlas-grid p-6 sm:p-8 lg:p-10", className)}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[rgba(59,130,246,0.08)] via-[rgba(212,168,79,0.08)] to-transparent" />
      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.9fr)] lg:items-start">
        <div className="space-y-6">
          <p className="atlas-kicker">{eyebrow}</p>
          <div className="space-y-4">
            <h1 className="atlas-display max-w-4xl text-4xl leading-[0.95] text-slate-900 sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="atlas-lede max-w-3xl">{description}</p>
          </div>
          {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
          {children ? <div className="pt-2">{children}</div> : null}
        </div>

        {aside ? (
          <SoftPanel className="bg-white/78 dark:bg-slate-900/75" tone="gold">
            {aside}
          </SoftPanel>
        ) : null}
      </div>
    </section>
  );
}
