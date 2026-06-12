import type { LearningModule } from "./_types";

export const lessonData: LearningModule = {
  slug: "housing-solutions",
  synthesisOf: [
    "how-banks-create-money",
    "why-housing-becomes-financialized",
    "why-cities-create-stress-or-freedom",
    "how-wealth-compounds-faster-than-wages",
  ],
  betterMetrics: [],
  betterMetricsTitle: "",
  causalLoop: { title: "", description: "", nodes: [], edges: [], loops: [] },
  counterArguments: [],
  discussionPrompt: "",
  heroHighlights: [],
  miniLesson: { accent: "emerald", title: "", subtitle: "", conclusion: "", metrics: [] },
  realWorldExamples: [],
  relatedFrameworks: [],
  simpleExplanation: [],
  simulationPrompt: "",
  systemBug: { title: "", summary: "", signals: [] },
  proposals: [
    {
      title: "Introduce social and community land trusts to permanently remove land from speculative markets",
      summary: "Community land trusts hold land in perpetual trust, selling only the structures above it. This permanently decouples housing from speculative investment and keeps homes affordable across generations.",
      actor: "community",
      domain: "economic",
      feasibility: "proven",
      precedents: [
        { place: "Burlington, Vermont", year: 1984, outcome: "Champlain Housing Trust created over 2,500 permanently affordable homes; resale prices stayed affordable through multiple housing booms." },
        { place: "London (RUSS)", year: 2009, outcome: "Community-led housing cooperative developed self-build affordable homes outside the speculative market." },
      ],
    },
    {
      title: "Tax vacant land and empty homes at punitive rates to force productive use",
      summary: "Holding urban land idle is profitable under current tax regimes. Vacancy taxes change the calculation, releasing land into use and reducing the speculative premium embedded in housing prices.",
      actor: "local_gov",
      domain: "economic",
      feasibility: "proven",
      precedents: [
        { place: "Vancouver", year: 2017, outcome: "Empty Homes Tax reduced vacancy rates measurably in its first two years; revenues fund affordable housing." },
        { place: "Ireland", year: 2023, outcome: "Vacant Property Refurbishment Grant and derelict site levies combined to accelerate return of empty units to use." },
      ],
    },
    {
      title: "Expand social housing as a permanent tenure option, not a last resort",
      summary: "Social housing that is well-funded, well-maintained, and open to a broad income range acts as a rent anchor in local markets — not just a safety net but a structural counter to private market inflation.",
      actor: "national_gov",
      domain: "social",
      feasibility: "proven",
      precedents: [
        { place: "Vienna", year: 1923, outcome: "60% of residents live in subsidised or social housing; rents are roughly half the private market rate, sustained for a century." },
        { place: "Singapore (HDB)", year: 1960, outcome: "80% of citizens live in public housing; homeownership rates among the world's highest despite high density." },
      ],
    },
  ],
};
