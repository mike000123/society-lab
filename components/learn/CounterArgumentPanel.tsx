import { ShieldEllipsis } from "lucide-react";

import type { CounterArgument } from "@/lib/learn/modules";

export function CounterArgumentPanel({
  counterArguments,
}: {
  counterArguments: CounterArgument[];
}) {
  return (
    <section className="rounded-[1.9rem] border border-[rgba(28,36,48,0.08)] bg-white/76 p-5 shadow-[0_18px_40px_rgba(28,36,48,0.05)] sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-600">
          <ShieldEllipsis className="h-5 w-5" />
        </div>
        <div className="space-y-3">
          <p className="atlas-kicker">Counterarguments</p>
          <h2 className="atlas-display text-3xl leading-tight text-slate-900">
            Arguments serious learners should face directly
          </h2>
          <p className="atlas-copy max-w-4xl text-sm">
            Society Lab works better when each lesson can present the strongest objections clearly, then respond to
            them without caricature. That keeps the platform educational rather than tribal.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {counterArguments.map((argument) => (
          <article
            className="rounded-[1.55rem] border border-[rgba(28,36,48,0.08)] bg-white/88 p-5"
            key={argument.title}
          >
            <p className="text-lg font-semibold text-slate-900">{argument.title}</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">{argument.point}</p>

            <div className="mt-5 rounded-[1.3rem] border border-[rgba(28,36,48,0.08)] bg-[rgba(246,244,238,0.88)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Response</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">{argument.response}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
