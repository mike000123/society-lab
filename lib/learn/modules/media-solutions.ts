import type { LearningModule } from "./_types";

export const lessonData: LearningModule = {
  slug: "media-solutions",
  synthesisOf: [
    "how-companies-engineer-public-opinion-through-marketing",
    "how-media-incentives-produce-outrage",
    "how-surveillance-capitalism-shapes-attention",
    "how-networked-digital-movements-scale",
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
      title: "Break up platform monopolies using competition law and interoperability mandates",
      summary: "Network effects concentrate power in a handful of platforms whose scale allows them to shape public discourse without accountability. Interoperability requirements — forcing platforms to connect with each other — restore competition without requiring state-run alternatives.",
      actor: "national_gov",
      domain: "legal",
      feasibility: "emerging",
      precedents: [
        { place: "EU Digital Markets Act", year: 2022, outcome: "Mandated interoperability for messaging services; Meta required to open WhatsApp to third-party clients." },
        { place: "EU (Meta fine)", year: 2023, outcome: "€1.2 billion GDPR fine for transferring EU user data to US; largest privacy fine in history." },
      ],
    },
    {
      title: "Fund independent public interest journalism through a platform levy",
      summary: "A small levy on digital advertising revenue directed to an independent journalism fund would restore the accountability reporting that advertising-funded platforms have destroyed, without creating state-controlled media.",
      actor: "national_gov",
      domain: "media",
      feasibility: "emerging",
      precedents: [
        { place: "Australia (News Media Bargaining Code)", year: 2021, outcome: "Compelled Google and Meta to negotiate payments with news publishers; raised AU$200M+ for Australian journalism." },
        { place: "Canada (Online News Act)", year: 2023, outcome: "Similar levy framework; platforms initially threatened withdrawal before negotiating." },
      ],
    },
    {
      title: "Require platforms to provide users with non-algorithmic chronological feeds as default",
      summary: "Engagement-maximising algorithms are not technically necessary for social communication — they are a design choice that serves advertising revenue. Mandating chronological alternatives as default removes the dark-pattern amplification of outrage.",
      actor: "national_gov",
      domain: "legal",
      feasibility: "emerging",
      precedents: [
        { place: "EU Digital Services Act", year: 2023, outcome: "Very large platforms must offer non-personalised feed options; compliance began 2024." },
      ],
    },
  ],
};
