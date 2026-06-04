import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type FeatureItem = {
  description?: string;
  icon?: ReactNode;
  label: string;
  value: string;
};

export function FeatureStrip({
  className,
  items,
}: {
  className?: string;
  items: FeatureItem[];
}) {
  return (
    <div className={cn("rounded-[2rem] atlas-surface px-5 py-4 sm:px-6 sm:py-5", className)}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item, index) => (
          <div
            className={cn(
              "space-y-2",
              index > 0 ? "sm:border-l sm:border-[rgba(28,36,48,0.08)] sm:pl-4 dark:sm:border-slate-700/70" : "",
            )}
            key={`${item.label}-${item.value}`}
          >
            <div className="flex items-center gap-2 text-slate-500">
              {item.icon ? <span className="text-slate-500">{item.icon}</span> : null}
              <p className="text-xs uppercase tracking-[0.18em]">{item.label}</p>
            </div>
            <p className="atlas-display text-3xl text-slate-900">{item.value}</p>
            {item.description ? <p className="atlas-copy text-sm">{item.description}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
