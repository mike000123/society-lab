import { ShieldEllipsis } from "lucide-react";

import type { CounterArgument } from "@/lib/learn/modules";

export function CounterArgumentPanel({
  counterArguments,
}: {
  counterArguments: CounterArgument[];
}) {
  return (
    <section className="rounded-[1.75rem] border border-slate-800 bg-panel/90 p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <ShieldEllipsis className="h-5 w-5 text-amber-300" />
        <h2 className="text-2xl font-semibold text-slate-50">Counterarguments worth taking seriously</h2>
      </div>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
        Society Lab should not become an echo chamber. Good learning modules make the strongest case for the other side before responding.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {counterArguments.map((argument) => (
          <article
            className="rounded-[1.5rem] border border-slate-800 bg-slate-950/60 p-5"
            key={argument.title}
          >
            <p className="text-sm font-semibold text-slate-50">{argument.title}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{argument.point}</p>
            <div className="mt-4 rounded-2xl border border-slate-800 bg-panel/80 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Response</p>
              <p className="mt-2 text-sm leading-6 text-slate-200">{argument.response}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

