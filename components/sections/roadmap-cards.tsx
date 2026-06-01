const modules = [
  "Production architecture",
  "Discussion system",
  "Multiplayer simulations",
  "AI debate agents",
  "Voting & governance",
  "Civilization simulator",
];

export function RoadmapCards() {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {modules.map((name) => (
        <article key={name} className="rounded-2xl border border-slate-800 bg-panel/80 p-4">
          <p className="text-sm text-slate-300">Upcoming module</p>
          <h3 className="mt-1 font-semibold text-cyan-200">{name}</h3>
        </article>
      ))}
    </section>
  );
}
