import type { LearningModule } from "./_types";

export const lessonData: LearningModule = {
  slug: "wellbeing-solutions",
  synthesisOf: [
    "why-gdp-is-not-the-same-as-wellbeing",
    "how-doughnut-economics-puts-the-economy-inside-limits",
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
      title: "Pilot unconditional basic income to decouple survival from labour market participation",
      summary: "A regular unconditional payment to all citizens covers basic needs regardless of employment status, reducing the stress and precarity that GDP growth can mask. Pilots show improvements in health, trust, and community participation.",
      actor: "national_gov",
      domain: "social",
      feasibility: "emerging",
      precedents: [
        { place: "Finland (basic income pilot)", year: 2017, outcome: "Recipients showed significant improvements in wellbeing, trust, and mental health compared to control group." },
        { place: "Stockton, California (SEED)", year: 2019, outcome: "Guaranteed income recipients were more likely to gain full-time employment; self-reported wellbeing significantly higher." },
      ],
    },
    {
      title: "Legislate a four-day working week without pay reduction",
      summary: "Reducing working hours increases time for care, community, rest, and civic participation — the activities that most reliably produce wellbeing gains. Productivity evidence from pilots is consistently positive.",
      actor: "national_gov",
      domain: "social",
      feasibility: "emerging",
      precedents: [
        { place: "Iceland (working hours trial)", year: 2015, outcome: "35-36 hour weeks produced equal or higher productivity; majority of Icelandic workers now on shorter hours." },
        { place: "Microsoft Japan", year: 2019, outcome: "Four-day week trial increased productivity 40%; became permanent for many teams." },
      ],
    },
    {
      title: "Adopt doughnut economics as the legal framework for local and national planning decisions",
      summary: "Planning decisions assessed against both social foundations (minimum wellbeing for all) and ecological ceilings (maximum sustainable impact) — embedding the doughnut as an operational planning tool, not just a conceptual frame.",
      actor: "local_gov",
      domain: "political",
      feasibility: "emerging",
      precedents: [
        { place: "Amsterdam", year: 2020, outcome: "First city to formally adopt Doughnut Economics as its recovery framework post-COVID; embedded in city strategy." },
        { place: "Copenhagen", year: 2021, outcome: "Doughnut model integrated into urban development assessment processes." },
      ],
    },
  ],
};
