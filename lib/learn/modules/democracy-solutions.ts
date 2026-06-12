import type { LearningModule } from "./_types";

export const lessonData: LearningModule = {
  slug: "democracy-solutions",
  synthesisOf: [
    "how-capitalism-socialism-and-communism-differ",
    "why-capable-people-dont-enter-politics",
    "how-lobbying-shapes-policy",
    "how-electoral-rules-shape-political-power",
    "how-corruption-behaves-like-a-hidden-tax",
    "why-democracies-struggle-with-long-term-problems",
    "how-the-eu-makes-decisions",
    "how-the-us-government-makes-decisions",
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
      title: "Introduce public campaign financing to break the link between wealth and political power",
      summary: "Public funding for election campaigns — matched small donations, spending caps, or direct grants — reduces candidates' dependence on large donors and opens politics to people without wealthy networks.",
      actor: "national_gov",
      domain: "political",
      feasibility: "proven",
      precedents: [
        { place: "Norway / Sweden / Denmark", year: 1970, outcome: "State party funding decoupled Scandinavian parties from corporate donors; combined with high transparency requirements." },
        { place: "New York City (matching funds)", year: 1988, outcome: "6:1 small donor match programme broadened donor pool dramatically; more diverse candidates ran and won." },
      ],
    },
    {
      title: "Create a constitutional right to competent, non-partisan public administration",
      summary: "Professionalised civil services insulated from political appointment preserve institutional memory and prevent the hollowing-out of state capacity that makes long-term governance impossible.",
      actor: "national_gov",
      domain: "legal",
      feasibility: "proven",
      precedents: [
        { place: "UK (Northcote-Trevelyan reform)", year: 1854, outcome: "Competitive examination replaced patronage in British civil service; credited with enabling Victorian era public works." },
        { place: "South Korea", year: 1987, outcome: "Competitive civil service exam system built state capacity that underpinned economic development." },
      ],
    },
    {
      title: "Establish transnational democratic bodies with real authority over cross-border problems",
      summary: "Climate, tax, financial regulation, and migration cannot be solved by nation-states acting alone. New institutions with democratic mandates and enforcement power at the transnational level are necessary to match the scale of the problems.",
      actor: "international",
      domain: "political",
      feasibility: "long_horizon",
      precedents: [
        { place: "European Parliament", year: 1979, outcome: "Directly elected transnational legislature with real legislative co-decision powers; imperfect but functional precedent." },
        { place: "OECD Global Tax Framework", year: 2021, outcome: "136 countries agreed binding rules on minimum corporate tax — first substantive transnational fiscal governance." },
      ],
    },
  ],
};
