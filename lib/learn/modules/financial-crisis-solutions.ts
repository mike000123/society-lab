import type { LearningModule } from "./_types";

export const lessonData: LearningModule = {
  slug: "financial-crisis-solutions",
  synthesisOf: [
    "how-banking-crises-repeat",
    "the-savings-and-loan-crisis-of-the-1980s",
    "how-the-2008-financial-crisis-happened",
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
      title: "Implement counter-cyclical capital buffers that automatically tighten as credit expands",
      summary: "Banks accumulate excess capital during booms and release it during downturns — automatically dampening the credit cycle that causes crises. Rules-based and automatic, removing the political economy problem of tightening during popular booms.",
      actor: "international",
      domain: "economic",
      feasibility: "proven",
      precedents: [
        { place: "Basel III (CCyB)", year: 2010, outcome: "Counter-cyclical capital buffer framework adopted by 44 countries; activated by Switzerland, UK, Norway in 2022-23 credit expansion." },
        { place: "Spain (dynamic provisioning)", year: 2000, outcome: "Pre-crisis loan-loss provisioning rule built bank buffers during the boom; cushioned the 2008 shock." },
      ],
    },
    {
      title: "Establish credible bail-in frameworks that eliminate implicit government guarantees for large banks",
      summary: "If bondholders and shareholders know losses will fall on them rather than taxpayers, they price risk accurately and constrain excessive risk-taking at source — without requiring regulators to predict every bank's behaviour.",
      actor: "national_gov",
      domain: "legal",
      feasibility: "proven",
      precedents: [
        { place: "EU Bank Recovery and Resolution Directive", year: 2014, outcome: "Bail-in tool used in Cyprus (2013) and several Italian banks; shifted losses from taxpayers to creditors." },
        { place: "Switzerland (AT1 bonds)", year: 2023, outcome: "Credit Suisse resolution wrote down CHF 16 billion in AT1 bonds; demonstrated credibility of bail-in tool." },
      ],
    },
    {
      title: "Create a public option for retail banking to compete with private banks",
      summary: "A public bank offering basic deposit, payment, and savings services sets a floor on retail banking quality and cost, and provides a competitive alternative that disciplines private bank behaviour without requiring nationalisation.",
      actor: "national_gov",
      domain: "economic",
      feasibility: "proven",
      precedents: [
        { place: "Post Office savings (UK, Japan)", year: 1861, outcome: "Postal savings provided universal safe deposit and payment services for a century before privatisation." },
        { place: "North Dakota (Bank of North Dakota)", year: 1919, outcome: "Only US state-owned bank; provides below-market lending to local businesses and lower student loan rates." },
      ],
    },
  ],
};
