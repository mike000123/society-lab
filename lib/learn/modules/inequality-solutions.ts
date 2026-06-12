import type { LearningModule } from "./_types";

export const lessonData: LearningModule = {
  slug: "inequality-solutions",
  synthesisOf: [
    "how-wealth-compounds-faster-than-wages",
    "how-tax-havens-drain-public-revenue",
    "how-lobbying-shapes-policy",
    "how-corruption-behaves-like-a-hidden-tax",
    "why-capable-people-dont-enter-politics",
    "how-electoral-rules-shape-political-power",
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
      title: "Reform inheritance and gift taxes to limit the intergenerational transmission of extreme wealth",
      summary: "Compound returns on inherited capital are the primary mechanism for dynastic wealth accumulation. Progressive inheritance taxes with strong anti-avoidance rules address the source of the trend, not just its symptoms.",
      actor: "national_gov",
      domain: "economic",
      feasibility: "contested",
      precedents: [
        { place: "United States (estate tax 1916-1980)", year: 1916, outcome: "Top marginal rates above 70% during mid-century peak; correlated with historically lowest wealth concentration ratios." },
        { place: "South Korea", year: 2020, outcome: "Highest inheritance tax in OECD (up to 60%); Samsung founder's heirs paid ₩12 trillion — largest single inheritance tax payment in history." },
      ],
    },
    {
      title: "Mandate worker representation on corporate boards",
      summary: "Co-determination — legal requirements for worker representation on supervisory boards — gives labour a structural voice in decisions about wages, dividends, investment, and executive pay, rebalancing power without full nationalisation.",
      actor: "national_gov",
      domain: "economic",
      feasibility: "proven",
      precedents: [
        { place: "Germany (Mitbestimmung)", year: 1976, outcome: "Worker parity on supervisory boards of companies over 2,000 employees; correlated with lower CEO-to-worker pay ratios and more stable employment." },
        { place: "Sweden, Denmark, Norway", year: 1970, outcome: "Board representation rights for workers; combined with collective bargaining produced the most equal wage structures in the OECD." },
      ],
    },
    {
      title: "Introduce sectoral collective bargaining to set wage floors across entire industries",
      summary: "Enterprise-level bargaining allows employers to compete on labour costs; sectoral bargaining removes wages from competition and sets floors across whole industries, raising the bottom without requiring individual firm negotiations.",
      actor: "national_gov",
      domain: "economic",
      feasibility: "proven",
      precedents: [
        { place: "Austria / Germany", year: 1945, outcome: "Sectoral bargaining covers 95%+ of workers; among lowest wage inequality and poverty rates in Europe." },
        { place: "New Zealand (Fair Pay Agreements)", year: 2022, outcome: "Reintroduced sectoral bargaining after 30-year absence; first agreements covered cleaning, bus transport, hospitality." },
      ],
    },
  ],
};
