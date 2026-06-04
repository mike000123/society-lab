import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SectionNarrative({
  children,
  className,
  description,
  eyebrow,
  side,
  title,
}: {
  children: ReactNode;
  className?: string;
  description: string;
  eyebrow: string;
  side?: ReactNode;
  title: string;
}) {
  return (
    <section className={cn("space-y-8", className)}>
      <div className="grid gap-6 border-b atlas-rule pb-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(15rem,0.7fr)] lg:items-end">
        <div className="space-y-3">
          <p className="atlas-kicker">{eyebrow}</p>
          <h2 className="atlas-display text-3xl leading-tight text-slate-900 sm:text-4xl">{title}</h2>
          <p className="atlas-copy max-w-3xl text-base">{description}</p>
        </div>
        {side ? <div className="atlas-copy text-sm lg:pl-4">{side}</div> : null}
      </div>

      {children}
    </section>
  );
}
