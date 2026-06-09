export interface StudyPath {
  id: string;
  title: string;
  tagline: string;
  summary: string;
  duration: string;
  outcome: string;
  resourceIds: string[];
  relatedCategoryIds: string[];
}

export const STUDY_PATHS: StudyPath[] = [
  {
    id: "understanding-modern-money",
    title: "Understanding Modern Money",
    tagline: "Follow money creation, credit, and who gets first access",
    summary:
      "A curated path through bank-created money, the hierarchy of finance, macro instability, and the political economy behind who gets to shape the rules.",
    duration: "6 resources · 4-6 hrs",
    outcome:
      "You leave with a stronger mental model of money as an institutional system, not a neutral object that simply exists before politics begins.",
    resourceIds: [
      "money-boe-money-creation",
      "money-positive-money",
      "money-mehrling-course",
      "money-ecb-explainers",
      "pe-core-econ",
      "money-chartbook",
    ],
    relatedCategoryIds: ["money-banking", "political-economy", "owid-shortlist"],
  },
  {
    id: "inequality-and-power",
    title: "Inequality & Power",
    tagline: "Connect value, ownership, corruption, and concentrated influence",
    summary:
      "This path moves from inequality data to the legal coding of capital, elite deal-making, lobbying, corruption, and the institutions that quietly decide who keeps value.",
    duration: "6 resources · 4-6 hrs",
    outcome:
      "You come away seeing inequality not only as an outcome in the charts, but as the result of law, institutional design, and organized power.",
    resourceIds: [
      "pe-wid",
      "pe-code-of-capital",
      "pe-value-of-everything",
      "corr-ti",
      "corr-global-witness",
      "data-opensecrets",
    ],
    relatedCategoryIds: ["political-economy", "corruption-development", "data-research"],
  },
  {
    id: "climate-and-ecological-limits",
    title: "Climate & Ecological Limits",
    tagline: "Build the World3 and planetary-boundaries mindset",
    summary:
      "A systems path through doughnut economics, planetary boundaries, overshoot, climate response, and the modeling tools that make delayed ecological stress legible.",
    duration: "6 resources · 4-7 hrs",
    outcome:
      "You build the long-run lens needed to understand why ecological ceilings, delay, and feedback loops belong inside economic and civic thinking.",
    resourceIds: [
      "systems-limits-to-growth",
      "eco-kate-raworth",
      "eco-planetary-boundaries",
      "eco-ipcc",
      "eco-earth4all",
      "systems-en-roads",
    ],
    relatedCategoryIds: ["systems-thinking", "ecology-climate", "owid-shortlist"],
  },
  {
    id: "democracy-and-better-governance",
    title: "Democracy & Better Governance",
    tagline: "From participation design to accountability systems",
    summary:
      "This path focuses on participation, institutional redesign, anti-corruption, open government, and practical cases that show how governance can become more capable and more democratic.",
    duration: "7 resources · 4-6 hrs",
    outcome:
      "You leave with a more concrete sense of how democratic capacity is built through institutions, process design, and accountable implementation.",
    resourceIds: [
      "demo-participedia",
      "demo-democracynext",
      "demo-ogp",
      "demo-world-justice-project",
      "corr-open-contracting",
      "demo-vtaiwan",
      "demo-brennan",
    ],
    relatedCategoryIds: ["democracy-governance", "corruption-development", "data-research"],
  },
];
