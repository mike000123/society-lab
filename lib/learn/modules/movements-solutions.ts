import type { LearningModule } from "./_types";

export const lessonData: LearningModule = {
  slug: "movements-solutions",
  synthesisOf: [
    "how-print-era-movements-turned-ideas-into-power",
    "how-industrial-mass-movements-won-rights",
    "how-anti-colonial-movements-dismantled-empires",
    "how-rights-based-movements-expand-citizenship",
    "how-networked-digital-movements-scale",
    "how-social-movements-reshape-history",
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
      title: "Build pre-figurative institutions that demonstrate alternatives work before seeking legal change",
      summary: "Movements that created visible, functioning alternatives — worker cooperatives, free schools, community health centres — built political credibility alongside pressure. The institution proves the alternative is viable, the movement scales it.",
      actor: "civil_society",
      domain: "social",
      feasibility: "proven",
      precedents: [
        { place: "Mondragon cooperatives (Spain)", year: 1956, outcome: "Worker cooperative network grew to 80,000 members demonstrating cooperative enterprise at scale — influenced labour law and cooperative legislation." },
        { place: "UK suffragette movement", year: 1903, outcome: "Combined illegal direct action with legal institution-building — women's education, employment networks — that created the social infrastructure for post-suffrage participation." },
      ],
    },
    {
      title: "Invest in movement infrastructure: legal funds, training networks, and shared research capacity",
      summary: "The most durable movements built institutional capacity alongside street presence. Legal defence funds, leadership training programmes, and shared research organisations are what allow movements to persist across generations.",
      actor: "civil_society",
      domain: "political",
      feasibility: "proven",
      precedents: [
        { place: "NAACP Legal Defense Fund", year: 1940, outcome: "Systematic legal strategy built over decades culminated in Brown v. Board of Education (1954) — movement infrastructure made the decisive case possible." },
        { place: "South African UDF", year: 1983, outcome: "United Democratic Front created shared infrastructure for 700+ organisations; sustained resistance through the state of emergency years." },
      ],
    },
    {
      title: "Establish cross-movement coordination bodies to align campaigns without merging organisations",
      summary: "Movements that won durable change built coalitions that respected organisational autonomy while coordinating strategy. Formal coordination bodies — not mergers — allow different constituencies to act jointly on shared goals.",
      actor: "civil_society",
      domain: "political",
      feasibility: "proven",
      precedents: [
        { place: "US Civil Rights movement coordination", year: 1957, outcome: "Southern Christian Leadership Conference coordinated without absorbing NAACP, SNCC, or CORE — diversity of tactics with shared targets." },
        { place: "NZ climate coalition", year: 2019, outcome: "Cross-movement coordination between iwi, unions, climate groups, and faith organisations produced unified climate budget demands." },
      ],
    },
  ],
};
