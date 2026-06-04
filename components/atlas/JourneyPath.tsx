import type { ReactNode } from "react";

import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { SoftPanel } from "@/components/atlas/SoftPanel";

type JourneyStep = {
  description: string;
  icon: ReactNode;
  label: string;
  title: string;
};

export function JourneyPath({
  className,
  steps,
}: {
  className?: string;
  steps: JourneyStep[];
}) {
  return (
    <div className={cn("grid gap-4 lg:grid-cols-[repeat(4,minmax(0,1fr))]", className)}>
      {steps.map((step, index) => (
        <SoftPanel className="relative overflow-hidden" key={step.title} tone={index === 1 ? "blue" : index === 2 ? "gold" : "neutral"}>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 atlas-mapline" />
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full border border-[rgba(28,36,48,0.12)] bg-white/70 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
              {step.icon}
            </div>
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{step.label}</p>
              <h3 className="atlas-display text-2xl text-slate-900">{step.title}</h3>
              <p className="atlas-copy text-sm">{step.description}</p>
            </div>
          </div>
          {index < steps.length - 1 ? (
            <ArrowRight className="absolute bottom-5 right-5 hidden h-4 w-4 text-slate-400 lg:block" />
          ) : null}
        </SoftPanel>
      ))}
    </div>
  );
}
