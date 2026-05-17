const seed = [
  { author: "Systems Analyst", stance: "Assumption", text: "Current housing policy incentivizes asset inflation over social stability." },
  { author: "Economist", stance: "Counterpoint", text: "Supply constraints dominate; financing incentives are secondary but still meaningful." },
];

export function DiscussionThread() {
  return (
    <section className="space-y-3">
      {seed.map((post) => (
        <article key={post.text} className="rounded-2xl border border-slate-800 bg-panel p-4">
          <p className="text-xs text-cyan-300">{post.stance}</p>
          <p className="font-medium">{post.author}</p>
          <p className="text-sm text-slate-300">{post.text}</p>
        </article>
      ))}
    </section>
  );
}
