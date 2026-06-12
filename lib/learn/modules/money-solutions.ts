import type { LearningModule } from "./_types";

export const lessonData: LearningModule = {
  slug: "money-solutions",
  synthesisOf: [
    "why-gdp-is-not-the-same-as-wellbeing",
    "how-banks-create-money",
    "how-wealth-compounds-faster-than-wages",
    "how-tax-havens-drain-public-revenue",
    "how-the-us-rewrites-the-rules-of-money",
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
      title: "Require banks to hold full reserves for demand deposits, ending fractional-reserve money creation",
      summary: "Under full-reserve banking, banks can only lend money they actually hold. New money creation becomes a public function, removing the pro-cyclical credit expansion that fuels asset bubbles and crises.",
      actor: "national_gov",
      domain: "economic",
      feasibility: "contested",
      precedents: [
        { place: "Iceland (Frosti Sigurjonsson report)", year: 2015, outcome: "Parliamentary commission recommended Sovereign Money system; proposal advanced to public debate stage." },
        { place: "Switzerland (Vollgeld Initiative)", year: 2018, outcome: "Referendum held on sovereign money; defeated 24% to 76% but placed issue firmly in public debate." },
      ],
    },
    {
      title: "Implement automatic country-by-country tax reporting with public beneficial ownership registers",
      summary: "Multinational corporations report profits, taxes, and employees in each jurisdiction publicly. Beneficial ownership registers expose the individuals behind shell companies. Together these close the main routes through which money escapes taxation.",
      actor: "international",
      domain: "economic",
      feasibility: "emerging",
      precedents: [
        { place: "EU public CbCR", year: 2021, outcome: "Directive requires public country-by-country reporting for large multinationals from 2025." },
        { place: "UK Companies House reform", year: 2023, outcome: "Economic Crime Act created first verified beneficial ownership register in a major financial centre." },
      ],
    },
    {
      title: "Establish a sovereign wealth fund distributing investment returns to all citizens",
      summary: "When public resources — including the money-creation power of central banks — generate returns, those returns can be distributed as a citizen dividend rather than accruing to asset-holders alone.",
      actor: "national_gov",
      domain: "economic",
      feasibility: "proven",
      precedents: [
        { place: "Norway (Government Pension Fund)", year: 1990, outcome: "World's largest sovereign wealth fund; annual oil dividends fund public services for future generations." },
        { place: "Alaska Permanent Fund", year: 1976, outcome: "Annual dividend paid to every Alaskan resident since 1982; reduced state poverty rate measurably." },
      ],
    },
  ],
};
