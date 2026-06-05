export function PageSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="mx-auto max-w-7xl animate-pulse space-y-6 px-4 py-8 md:px-8">
      {/* Hero bar */}
      <div className="h-10 w-2/5 rounded-2xl bg-slate-200 dark:bg-slate-800" />
      <div className="h-5 w-3/5 rounded-xl bg-slate-100 dark:bg-slate-800/60" />

      {/* Content rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-40 w-full rounded-[1.75rem] bg-slate-100 dark:bg-slate-800/50"
          style={{ opacity: 1 - i * 0.15 }}
        />
      ))}
    </div>
  );
}
