import type { FoundationalReference, LearningEvidenceLink } from "./_types";

export const foundationalReferences: FoundationalReference[] = [
  {
    focus:
      "Stocks, flows, delays, overshoot, and the danger of optimizing one variable while the whole system destabilizes.",
    status: "Active lens",
    summary:
      "World3 matters because Society Lab is not just cataloguing problems. It is trying to think in interacting variables, delayed effects, and unintended consequences.",
    title: "World3 model and Limits to Growth",
  },
  {
    focus:
      "Feedback loops, mental models, buffers, rules, goals, and leverage points for real system change.",
    status: "Active lens",
    summary:
      "Meadows helps us ask where to intervene: are we changing a symptom, a rule, a feedback loop, or the goal of the system itself?",
    title: "Donella Meadows and leverage points",
  },
  {
    focus:
      "Reinforcing loops, balancing loops, and visual explanations of how causes interact rather than moving in a straight line.",
    status: "Active lens",
    summary:
      "The module pages already use this lens directly. It is the simplest way to show why a system can create the opposite of what it claims to optimize.",
    title: "System dynamics and causal loop diagrams",
  },
  {
    focus:
      "Why institutions drift toward capture, rent extraction, and self-protection even when nobody planned the full outcome.",
    status: "Active lens",
    summary:
      "This is the bridge between abstract systems thinking and real power: incentives, lobbying, ownership structure, and who benefits from the current design.",
    title: "Political economy and institutional capture",
  },
  {
    focus:
      "Why a viable economy has to keep everyone above a social foundation while staying below ecological ceilings like climate, pollution, biodiversity, and material overshoot.",
    status: "Active lens",
    summary:
      "Planetary boundaries and Doughnut economics make the missing point explicit: the economy is not outside nature, and finance cannot treat system limits as external forever.",
    title: "Planetary boundaries and Doughnut economics",
  },
  {
    focus:
      "How urban design, public space, mixed use, and street life shape trust, autonomy, and daily freedom.",
    status: "Coming next",
    summary:
      "Urban modules already point in this direction, and a stronger Jane Jacobs style layer would deepen the city, housing, and neighborhood learning tracks.",
    title: "Jane Jacobs and urban social fabric",
  },
];

export const owidEvidenceLinks = {
  airPollution: {
    note:
      "Use the mortality and exposure charts here to show that pollution is not only a future ecological issue but also a present public-health burden.",
    source: "Our World in Data",
    title: "Air Pollution",
    url: "https://ourworldindata.org/air-pollution",
  },
  biodiversity: {
    note:
      "A strong way to show that ecological limits are not only about carbon: extinction pressure, habitat loss, and ecosystem decline follow their own dangerous trajectories.",
    source: "Our World in Data",
    title: "Biodiversity",
    url: "https://ourworldindata.org/biodiversity",
  },
  cleanWater: {
    note:
      "Useful for connecting environmental systems to everyday life through sanitation, safe water, disease, and unequal infrastructure access.",
    source: "Our World in Data",
    title: "Clean Water and Sanitation",
    url: "https://ourworldindata.org/clean-water-sanitation",
  },
  co2: {
    note:
      "Best for comparing total, per-capita, and cumulative emissions so users can see why responsibility looks different depending on the lens.",
    source: "Our World in Data",
    title: "CO2 and Greenhouse Gas Emissions",
    url: "https://ourworldindata.org/co2-and-greenhouse-gas-emissions",
  },
  corruption: {
    note:
      "Good for giving the corruption module a cross-country baseline before moving into deeper causal explanations about hidden taxes and weakened institutions.",
    source: "Our World in Data",
    title: "Corruption",
    url: "https://ourworldindata.org/corruption",
  },
  democracy: {
    note:
      "Helpful for long-run regime trends and broad democratic change, even though it is less specific than our own lesson on electoral-system mechanics.",
    source: "Our World in Data",
    title: "Democracy",
    url: "https://ourworldindata.org/democracy",
  },
  economicInequality: {
    note:
      "A direct evidence layer for top-income shares, Gini trends, and how distribution changes across countries and over time.",
    source: "Our World in Data",
    title: "Economic Inequality",
    url: "https://ourworldindata.org/economic-inequality",
  },
  energy: {
    note:
      "Useful for showing where energy transitions are actually happening, how electricity mixes differ, and why infrastructure matters for decarbonization.",
    source: "Our World in Data",
    title: "Energy",
    url: "https://ourworldindata.org/energy",
  },
  globalEducation: {
    note:
      "Helpful when a lesson touches literacy, schooling, or why certain movements and institutions could scale more easily than others.",
    source: "Our World in Data",
    title: "Global Education",
    url: "https://ourworldindata.org/global-education",
  },
  happiness: {
    note:
      "A strong companion to the GDP module because it lets users compare economic output with self-reported life satisfaction and related wellbeing measures.",
    source: "Our World in Data",
    title: "Happiness and Life Satisfaction",
    url: "https://ourworldindata.org/happiness-and-life-satisfaction",
  },
  humanRights: {
    note:
      "Useful for showing that rights protections have improved over the long run overall, while remaining uneven across countries and groups.",
    source: "Our World in Data",
    title: "Human Rights",
    url: "https://ourworldindata.org/human-rights",
  },
  internet: {
    note:
      "Best used as background for networked movements and attention systems: it shows when and where the material infrastructure for digital mobilization existed.",
    source: "Our World in Data",
    title: "Internet",
    url: "https://ourworldindata.org/internet",
  },
  poverty: {
    note:
      "Useful for grounding discussions of material deprivation, progress, and distribution rather than relying on vague claims about living standards.",
    source: "Our World in Data",
    title: "Poverty",
    url: "https://ourworldindata.org/poverty",
  },
  stateCapacity: {
    note:
      "One of the best OWID fits for governance lessons because it connects taxation, territorial control, bureaucratic quality, and implementation capacity.",
    source: "Our World in Data",
    title: "State Capacity",
    url: "https://ourworldindata.org/state-capacity",
  },
  taxation: {
    note:
      "Good for comparing tax-to-GDP and tax composition when users want to connect state capacity, redistribution, and social provisioning.",
    source: "Our World in Data",
    title: "Taxation",
    url: "https://ourworldindata.org/taxation",
  },
  urbanization: {
    note:
      "Useful for long-run context on city growth, slum populations, density, and the scale of the global urban transition.",
    source: "Our World in Data",
    title: "Urbanization",
    url: "https://ourworldindata.org/urbanization",
  },
  womenRights: {
    note:
      "A direct fit for suffrage, gendered power, and long-run institutional change in formal rights for women across countries.",
    source: "Our World in Data",
    title: "Women’s Rights",
    url: "https://ourworldindata.org/women-rights",
  },
  workEmployment: {
    note:
      "Helpful for connecting labor-market structure, sector shifts, and employment trends to broader political-economy questions.",
    source: "Our World in Data",
    title: "Work and Employment",
    url: "https://ourworldindata.org/work-employment",
  },
  workingHours: {
    note:
      "Especially useful for the wellbeing and labor modules because it makes visible whether productivity gains are becoming more free time or not.",
    source: "Our World in Data",
    title: "Working Hours",
    url: "https://ourworldindata.org/working-hours",
  },
} satisfies Record<string, LearningEvidenceLink>;

