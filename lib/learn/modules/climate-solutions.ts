import type { LearningModule } from "./_types";

export const lessonData: LearningModule = {
  slug: "climate-solutions",
  synthesisOf: [
    "why-gdp-is-not-the-same-as-wellbeing",
    "how-doughnut-economics-puts-the-economy-inside-limits",
    "why-decoupling-growth-from-emissions-is-so-hard",
    "how-pollution-builds-up-until-systems-tip",
    "why-cities-create-stress-or-freedom",
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
      title: "Mandate legally binding national carbon budgets aligned with 1.5°C, reviewed by independent climate committees",
      summary: "Carbon budgets set a fixed quantity of emissions permitted over a period, with independent scientific committees assessing progress and governments legally required to explain shortfalls — removing climate targets from the annual political cycle.",
      actor: "national_gov",
      domain: "environmental",
      feasibility: "proven",
      precedents: [
        { place: "United Kingdom (Climate Change Act)", year: 2008, outcome: "Five-year carbon budgets enforced by independent Climate Change Committee; UK emissions fell 50% from 1990 to 2023." },
        { place: "New Zealand (Zero Carbon Act)", year: 2019, outcome: "Independent Climate Change Commission sets budgets; targets embedded in law with reporting requirements." },
      ],
    },
    {
      title: "Phase out all fossil fuel subsidies and redirect them to clean transition support",
      summary: "Global fossil fuel subsidies exceed $7 trillion annually (IMF, 2023). Removing them while protecting low-income households through targeted transfers is the largest single structural lever available to governments.",
      actor: "national_gov",
      domain: "economic",
      feasibility: "contested",
      precedents: [
        { place: "Iran", year: 2010, outcome: "Phased fossil fuel subsidy reform with direct cash transfers to households; largest subsidy reform in history." },
        { place: "Indonesia", year: 2014, outcome: "Fuel subsidy reform freed 1.3% of GDP for health and infrastructure investment." },
      ],
    },
    {
      title: "Establish ecosystem rights and legal personhood for critical natural systems",
      summary: "Granting rivers, forests, and ecosystems legal standing gives them representation in planning and legal processes, creating a legal mechanism to halt destruction before tipping points are crossed.",
      actor: "national_gov",
      domain: "legal",
      feasibility: "emerging",
      precedents: [
        { place: "New Zealand (Whanganui River)", year: 2017, outcome: "River granted legal personhood; legal guardians appointed; enabled court proceedings against polluters." },
        { place: "Ecuador (Rights of Nature)", year: 2008, outcome: "Constitutional rights granted to nature (Pachamama); used in multiple court cases to halt extractive projects." },
      ],
    },
  ],
};
