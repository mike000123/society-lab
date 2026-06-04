"use client";

import { useEffect } from "react";

export default function SimulatorError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Simulator route error", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-3xl rounded-[2rem] border border-[rgba(239,68,68,0.18)] bg-[rgba(255,255,255,0.94)] px-8 py-10 shadow-[0_18px_34px_rgba(28,36,48,0.05)]">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">Simulator Error</p>
      <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">This simulator failed to load.</h1>
      <p className="mt-4 text-base leading-7 text-slate-600">
        {error.message || "An unexpected client-side error occurred."}
      </p>
      {error.digest ? <p className="mt-3 text-xs text-slate-500">Digest: {error.digest}</p> : null}
      <button
        className="mt-6 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(59,130,246,0.18)]"
        onClick={reset}
        type="button"
      >
        Try again
      </button>
    </div>
  );
}
