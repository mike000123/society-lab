export type AccentTone = "amber" | "cyan" | "emerald" | "rose";

export type CausalLoopNode = {
  id: string;
  label: string;
  tone?: AccentTone;
  x: number;
  y: number;
};

export type CausalLoopEdge = {
  bend?: number;
  from: string;
  label: string;
  polarity: "negative" | "positive";
  to: string;
};
export type CausalLoop = {
  description: string;
  label: string;
  nodeIds: string[];
  polarity: "reinforcing" | "balancing";
};



export type RealWorldExample = {
  insight: string;
  outcome: string;
  title: string;
};

export type CounterArgument = {
  point: string;
  response: string;
  title: string;
};

export type FoundationalReference = {
  focus: string;
  status: "Active lens" | "Coming next";
  summary: string;
  title: string;
};

export type LearningEvidenceLink = {
  note: string;
  source: string;
  title: string;
  url: string;
};

export type LearningTimelineEvent = {
  characteristics: string[];
  family: string;
  outcome: string;
  timeLabel: string;
  title: string;
  turningPoint: string;
  whyItStarted: string;
};

export type LearningTimeline = {
  intro: string;
  title: string;
  events: LearningTimelineEvent[];
};

export type BetterMetric = {
  description: string;
  label: string;
};

export type MiniLessonMetric = {
  base: number;
  description: string;
  key: string;
  label: string;
  max: number;
  min: number;
  slope: number;
  suffix?: string;
  tone: AccentTone;
};

export type MiniLessonBand = {
  insight: string;
  threshold: number;
};

export type MiniLessonConfig = {
  bands: MiniLessonBand[];
  defaultValue: number;
  description: string;
  highLabel: string;
  lowLabel: string;
  metrics: MiniLessonMetric[];
  prompt: string;
  sliderLabel: string;
  step: number;
  title: string;
  unit?: string;
  valueLabel?: string;
  valueMax: number;
  valueMin: number;
};

export type StaticMiniLessonMetric = {
  description: string;
  high: string;
  label: string;
  low: string;
  signal: string;
};

export type StaticMiniLesson = {
  accent: AccentTone;
  conclusion: string;
  metrics: StaticMiniLessonMetric[];
  subtitle: string;
  title: string;
};

export type LearningModule = {
  accent: AccentTone;
  betterMetrics: BetterMetric[];
  betterMetricsTitle: string;
  counterArguments: CounterArgument[];
  causalLoop: {
    description: string;
    edges: CausalLoopEdge[];
    loops: (string | CausalLoop)[];
    nodes: CausalLoopNode[];
    title: string;
  };
  difficulty: string;
  discussionPrompt: string;
  eyebrow: string;
  heroHighlights: string[];
  miniLesson: MiniLessonConfig | StaticMiniLesson;
  readingTime: string;
  realWorldExamples: RealWorldExample[];
  evidenceLinks?: LearningEvidenceLink[];
  relatedFrameworks: string[];
  simulationPrompt: string;
  simulatorSlug?: string;
  simpleExplanation: string[];
  slug: string;
  summary: string;
  timeline?: LearningTimeline;
  systemBug: {
    signals: string[];
    summary: string;
    title: string;
  };
  title: string;
};

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

const owidEvidenceLinks = {
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

export const learningModules: LearningModule[] = [
  {
    accent: "cyan",
    betterMetrics: [
      {
        description: "Are people actually healthy enough to live long, capable lives?",
        label: "Health",
      },
      {
        description: "Do people have enough discretionary time to rest, care, and participate?",
        label: "Free time",
      },
      {
        description: "Can ordinary households access stable shelter without permanent financial strain?",
        label: "Housing affordability",
      },
      {
        description: "Does daily life build cooperation, trust, and social resilience?",
        label: "Trust",
      },
      {
        description: "Are ecosystems carrying the hidden cost of today's output?",
        label: "Ecological load",
      },
      {
        description: "How do people report their lives going, not just the economy's cash flow?",
        label: "Wellbeing",
      },
    ],
    betterMetricsTitle: "Measure these alongside GDP",
    counterArguments: [
      {
        point:
          "GDP still matters because states need a taxable economy to fund healthcare, infrastructure, and social protection.",
        response:
          "That is true. The issue is not that GDP is useless, but that it becomes dangerous when it is treated as the only scoreboard for success.",
        title: "GDP supports state capacity",
      },
      {
        point:
          "Poorer countries often need strong economic growth before they can seriously improve living standards.",
        response:
          "Also true. But even there, the question is what kind of growth improves broad living conditions rather than concentrating gains while exhausting people and ecosystems.",
        title: "Growth can still be necessary",
      },
      {
        point:
          "A single number is useful for comparison and planning. Broader dashboards can become messy and political.",
        response:
          "Simplicity is valuable, but oversimplification is costly. A compact wellbeing dashboard can still stay legible while revealing blind spots that GDP hides.",
        title: "Simple metrics are easier to use",
      },
    ],
    causalLoop: {
      description:
        "When societies celebrate output without checking lived outcomes, growth pressure can reinforce longer work, more stress, and weaker wellbeing.",
      edges: [
        {
          from: "work-hours",
          label: "more market activity",
          polarity: "positive",
          to: "gdp-output",
        },
        {
          bend: 10,
          from: "gdp-output",
          label: "headline success",
          polarity: "positive",
          to: "growth-pressure",
        },
        {
          bend: 14,
          from: "growth-pressure",
          label: "pressure to produce",
          polarity: "positive",
          to: "work-hours",
        },
        {
          bend: 8,
          from: "work-hours",
          label: "fatigue",
          polarity: "positive",
          to: "stress",
        },
        {
          from: "stress",
          label: "burnout",
          polarity: "negative",
          to: "wellbeing",
        },
        {
          bend: -16,
          from: "work-hours",
          label: "less care time",
          polarity: "negative",
          to: "free-time",
        },
        {
          bend: -10,
          from: "free-time",
          label: "rest and connection",
          polarity: "positive",
          to: "wellbeing",
        },
        {
          bend: -18,
          from: "wellbeing",
          label: "less panic for raw growth",
          polarity: "negative",
          to: "growth-pressure",
        },
      ],
      loops: [
        "Reinforcing loop: growth pressure pushes longer work hours, which lifts GDP output, which then gets rewarded as proof that the current model is working.",
        "Balancing loop: when wellbeing becomes visible, societies can ask for shorter hours, stronger protections, and better metrics instead of more extraction.",
      ],
      nodes: [
        { id: "work-hours", label: "Longer work hours", tone: "amber", x: 18, y: 18 },
        { id: "gdp-output", label: "GDP output", tone: "cyan", x: 80, y: 18 },
        { id: "growth-pressure", label: "Political pressure for growth", tone: "rose", x: 18, y: 48 },
        { id: "stress", label: "Stress and burnout", tone: "rose", x: 82, y: 56 },
        { id: "wellbeing", label: "Wellbeing", tone: "emerald", x: 18, y: 82 },
        { id: "free-time", label: "Time for care and community", tone: "emerald", x: 52, y: 82 },
      ],
      title: "Causal loop: output can rise while life quality falls",
    },
    difficulty: "Starter",
    discussionPrompt:
      "Where do you see GDP improving the headline while real life around you feels more expensive, rushed, or fragile?",
    eyebrow: "Economic measurement",
    heroHighlights: [
      "GDP counts market transactions, not whether people are flourishing.",
      "Accidents, illness, overwork, pollution cleanup, and housing speculation can all lift GDP.",
      "A healthier dashboard tracks wellbeing, health, time, trust, housing, and ecological cost too.",
    ],
    miniLesson: {
      bands: [
        {
          insight:
            "At lower work-hour levels, output is more modest, but people keep more time for care, recovery, and civic life.",
          threshold: 0,
        },
        {
          insight:
            "In the middle zone, GDP looks solid, but stress begins to eat into what that extra output is actually for.",
          threshold: 40,
        },
        {
          insight:
            "At high work-hour levels, output keeps rising, but stress compounds and wellbeing falls, revealing why GDP alone is too narrow.",
          threshold: 55,
        },
      ],
      defaultValue: 40,
      description:
        "This simplified toy model shows how a policy culture obsessed with longer work can push output up while also pushing stress up and wellbeing down.",
      highLabel: "Longer workweek",
      lowLabel: "Shorter workweek",
      metrics: [
        {
          base: 22,
          description: "A rough proxy for measured market output.",
          key: "gdp",
          label: "Measured GDP activity",
          max: 100,
          min: 0,
          slope: 0.95,
          suffix: "/100",
          tone: "cyan",
        },
        {
          base: 6,
          description: "Accumulated strain, time pressure, and burnout risk.",
          key: "stress",
          label: "Stress load",
          max: 100,
          min: 0,
          slope: 1.15,
          suffix: "/100",
          tone: "rose",
        },
        {
          base: 95,
          description: "A proxy for how sustainable and humane life feels.",
          key: "wellbeing",
          label: "Wellbeing",
          max: 100,
          min: 0,
          slope: -0.9,
          suffix: "/100",
          tone: "emerald",
        },
      ],
      prompt: "Move the work-hours slider and watch how the system responds.",
      sliderLabel: "Working hours per week",
      step: 1,
      title: "Mini lesson: more work can lift GDP and still damage life",
      unit: "h",
      valueLabel: "hours",
      valueMax: 70,
      valueMin: 20,
    },
    readingTime: "7 min",
    realWorldExamples: [
      {
        insight:
          "GDP records the spending, but it does not subtract the pain, time loss, or insecurity caused by the event itself.",
        outcome:
          "Car crashes, stress-related illness, and defensive healthcare spending can all increase measured output.",
        title: "Accidents and illness create market activity",
      },
      {
        insight:
          "Repairing damage can look like growth even when people are only paying to recover from harm that never should have happened.",
        outcome:
          "Pollution cleanup, flood response, or preventable public-health crises can all add to GDP after conditions worsen.",
        title: "Cleanup spending is counted as success",
      },
      {
        insight:
          "Prices and transactions can climb while the basic function of housing gets worse for ordinary people.",
        outcome:
          "Housing booms driven by speculation can increase financial activity while affordability and security collapse.",
        title: "Speculative housing can inflate the score",
      },
    ],
    evidenceLinks: [owidEvidenceLinks.happiness, owidEvidenceLinks.workingHours, owidEvidenceLinks.poverty],
    relatedFrameworks: [
      "World3 model / Limits to Growth",
      "Donella Meadows leverage points",
      "System dynamics and causal loops",
      "Wellbeing economics",
    ],
    simulationPrompt:
      "Test a scenario where shorter work hours and stronger baseline security trade a little output for higher wellbeing and lower stress.",
    simulatorSlug: "purchasing-power",
    simpleExplanation: [
      "GDP measures the market value of goods and services produced in an economy. That makes it useful for tracking activity, tax capacity, and macroeconomic scale.",
      "But GDP is not the same thing as a good life. It can rise when people work longer hours, pay more for housing, buy more healthcare after avoidable illness, or spend money cleaning up environmental damage.",
      "It also misses what is not priced well: unpaid care, social trust, free time, mental health, ecological depletion, and the difference between productive investment and extractive speculation.",
      "So the real lesson is not to throw GDP away. It is to stop asking one production metric to answer a wellbeing question it was never designed to answer.",
    ],
    slug: "why-gdp-is-not-the-same-as-wellbeing",
    summary:
      "GDP can climb while people become more stressed, less healthy, less secure, and less able to afford a decent life.",
    systemBug: {
      signals: [
        "More monetized activity is treated as progress even when it comes from accidents, illness, or cleanup.",
        "Overwork can increase output while draining sleep, care time, and mental health.",
        "Speculation can make housing more expensive and still show up as healthy economic activity.",
      ],
      summary:
        "The score goes up whenever money moves, even if the underlying reality includes damage, exhaustion, or rising insecurity.",
      title: "System bug: the indicator rewards transactions, not lived outcomes",
    },
    title: "Why GDP is not the same as wellbeing",
  },
  {
    accent: "emerald",
    betterMetrics: [
      {
        description:
          "Whether everyone is above a minimum social floor such as housing, nutrition, health, energy, mobility, and education.",
        label: "Social foundation coverage",
      },
      {
        description:
          "Whether production remains inside ecological ceilings such as climate stability, biodiversity, freshwater use, land pressure, and pollution loads.",
        label: "Ecological ceiling pressure",
      },
      {
        description:
          "How much finance and public investment are steering resources toward retrofit, efficiency, care, and low-carbon infrastructure rather than extraction and lock-in.",
        label: "Transition investment direction",
      },
      {
        description:
          "Whether gains from greener production reduce insecurity for ordinary people or mostly create new rents for asset owners.",
        label: "Fair transition distribution",
      },
    ],
    betterMetricsTitle: "What to measure in an economy that has to live inside nature",
    counterArguments: [
      {
        point:
          "The economy cannot be run around ecological ceilings because growth has always solved scarcity and environmental problems eventually.",
        response:
          "Growth can finance solutions, but it does not automatically respect physical limits. Climate, biodiversity, soils, and pollution sinks are not abstract market signals; they are real conditions the economy depends on whether prices fully capture them or not.",
        title: "Growth will solve limits later",
      },
      {
        point:
          "Green economy policy is enough if emissions intensity falls, even if inequality and insecurity stay high.",
        response:
          "Doughnut economics is not only about the ecological ceiling. It also asks whether people actually reach a social foundation. An economy can decarbonize parts of production while still leaving people priced out of housing, energy, transport, or care.",
        title: "Green growth alone is enough",
      },
      {
        point:
          "Finance already prices environmental risk correctly through insurance, markets, and technological expectations.",
        response:
          "Markets often reward short-term returns while ecological damage accumulates off-balance-sheet or with long delays. That is why climate stress tests, public development banks, disclosure rules, and transition standards keep being proposed: the current system does not naturally steer capital fast enough.",
        title: "Finance already accounts for nature",
      },
    ],
    causalLoop: {
      description:
        "The economy sits inside society, and both sit inside the biosphere. When production ignores ecological ceilings, pollution and extraction undermine the very conditions that support prosperity. If investment is redirected, the loop can begin to stabilize instead of overshooting.",
      edges: [
        { from: "economicActivity", label: "raises", polarity: "positive", to: "resourceUse" },
        { from: "economicActivity", label: "raises", polarity: "positive", to: "socialProvision" },
        { from: "resourceUse", label: "drives", polarity: "positive", to: "ecologicalPressure" },
        { from: "ecologicalPressure", label: "undermines", polarity: "negative", to: "biosphereStability" },
        { from: "biosphereStability", label: "supports", polarity: "positive", to: "socialProvision" },
        { from: "socialProvision", label: "strengthens", polarity: "positive", to: "publicLegitimacy" },
        { from: "publicLegitimacy", label: "pushes", polarity: "positive", to: "transitionPolicy" },
        { from: "transitionPolicy", label: "redirects", polarity: "positive", to: "investmentShift" },
        { from: "investmentShift", label: "reduces", polarity: "negative", to: "resourceUse" },
        { from: "investmentShift", label: "expands", polarity: "positive", to: "socialProvision" },
      ],
      loops: [
        "Reinforcing: more production without limits -> more extraction and pollution -> weaker ecological stability -> rising social stress",
        "Balancing: transition policy and redirected investment can reduce ecological pressure while strengthening the social floor",
      ],
      nodes: [
        { id: "economicActivity", label: "Economic activity", tone: "emerald", x: 80, y: 100 },
        { id: "resourceUse", label: "Resource and energy use", tone: "amber", x: 280, y: 50 },
        { id: "ecologicalPressure", label: "Ecological pressure", tone: "rose", x: 500, y: 120 },
        { id: "biosphereStability", label: "Biosphere stability", tone: "cyan", x: 500, y: 300 },
        { id: "socialProvision", label: "Social foundation", tone: "emerald", x: 280, y: 350 },
        { id: "publicLegitimacy", label: "Public legitimacy", tone: "amber", x: 80, y: 300 },
        { id: "transitionPolicy", label: "Transition policy", tone: "cyan", x: 80, y: 460 },
        { id: "investmentShift", label: "Investment shift", tone: "emerald", x: 280, y: 500 },
      ],
      title: "The economy only works inside living systems",
    },
    difficulty: "Starter",
    discussionPrompt:
      "If the economy depends on ecological systems it does not replace, what should count as success: GDP growth, lower emissions intensity, or keeping everyone above a social floor while staying below ecological ceilings?",
    eyebrow: "Ecological economics",
    heroHighlights: [
      "Doughnut economics says a good economy must keep everyone above a social floor and below ecological ceilings.",
      "Nature is not an external side issue; it is the material base the economy operates inside.",
      "Green finance matters only if it actually redirects investment and shares the gains fairly.",
    ],
    miniLesson: {
      accent: "emerald",
      conclusion:
        "The doughnut is useful because it makes the design problem visible: an economy can grow while failing people below the social foundation, or it can meet social needs while overshooting ecological ceilings. A viable system has to do both at once.",
      metrics: [
        {
          description: "Whether basic needs are materially secured across society",
          high: "Housing, care, mobility, health, and energy are broadly secure",
          label: "Social floor",
          low: "Large groups remain below basic security",
          signal: "higher floor -> more human wellbeing",
        },
        {
          description: "Whether production stays inside planetary boundaries and pollution sinks",
          high: "Pressure on climate and ecosystems is falling",
          label: "Ecological ceiling",
          low: "Overshoot is rising",
          signal: "less overshoot -> more long-run stability",
        },
        {
          description: "Whether money and credit are steering toward retrofit and resilience",
          high: "Investment supports transition and repair",
          label: "Finance direction",
          low: "Capital still locks in extraction",
          signal: "better direction -> faster transition",
        },
      ],
      subtitle: "Why the economy has to fit inside both society and nature",
      title: "Mini lesson: the doughnut as a design constraint",
    },
    readingTime: "8 min",
    realWorldExamples: [
      {
        insight:
          "The city of Amsterdam used Doughnut framing to ask not only how to reduce environmental pressure, but how to redesign housing, materials, and procurement around social and ecological goals together.",
        outcome:
          "The framework became a planning lens rather than a single policy, showing how city governments can use it to reframe what success means.",
        title: "Amsterdam and city-scale Doughnut thinking",
      },
      {
        insight:
          "Climate stress tests, green public banks, and retrofit lending all respond to the same missing feature in conventional finance: ecological risks and transition needs are not priced or funded quickly enough by default.",
        outcome:
          "Central banks, regulators, and public financiers have begun treating climate and transition planning as balance-sheet issues rather than purely ethical side questions.",
        title: "Green finance as a systems correction",
      },
      {
        insight:
          "An economy can cut carbon intensity and still fail socially if transition costs are dumped on households while asset owners capture the upside.",
        outcome:
          "Debates over energy bills, building retrofits, and transport access show why a fair transition has to connect climate policy to distribution, not just emissions averages.",
        title: "Why social floors matter in the transition",
      },
    ],
    evidenceLinks: [owidEvidenceLinks.co2, owidEvidenceLinks.energy, owidEvidenceLinks.biodiversity],
    relatedFrameworks: [
      "Doughnut economics",
      "Planetary boundaries",
      "Just transition",
      "Green industrial policy",
      "Ecological macroeconomics",
    ],
    simulationPrompt:
      "Test how changing investment priorities, pollution controls, and social provisioning affects whether a system stays inside ecological ceilings without dropping people below a social floor.",
    simpleExplanation: [
      "Doughnut economics starts from a simple but powerful correction: the economy is not a machine floating outside nature. It is a subsystem of society, and society itself depends on the biosphere. That means the economy cannot be judged only by growth, profit, or spending; it must also be judged by whether it keeps life materially secure without destabilizing the living systems it depends on.",
      "The doughnut image has two boundaries. The inner ring is the social foundation: enough housing, food, energy, health, education, care, voice, and basic security for everyone. The outer ring is the ecological ceiling: the planetary limits we should not overshoot if we want a stable climate, functioning ecosystems, clean water, and a livable future.",
      "Most conventional economics pays more attention to market efficiency than to this double constraint. And most conventional finance allocates money toward the highest short-run private returns, which often means mortgages, extraction, and asset speculation rather than insulation, public transport, resilient grids, or care infrastructure.",
      "That is why a green or doughnut economy is not just about liking nature. It is about redesigning credit, investment, tax policy, and public goals so that the economy can meet human needs inside real system limits rather than pretending those limits are external forever.",
    ],
    slug: "how-doughnut-economics-puts-the-economy-inside-limits",
    summary:
      "Doughnut economics asks whether society keeps everyone above a social foundation while staying below ecological ceilings. It shifts the question from how fast the economy grows to whether it remains socially fair and biophysically viable.",
    systemBug: {
      signals: [
        "Success is discussed in terms of output growth even when ecological damage and social insecurity are both rising.",
        "Finance treats climate, biodiversity, and pollution as external risks rather than core system conditions.",
        "Green transition policies are judged only on emissions numbers while distributional fallout is treated as secondary.",
      ],
      summary:
        "The core bug is category error: treating the economy as if it were separate from society and nature. Once that happens, policy keeps optimizing flows of money while degrading the systems that make those flows possible.",
      title: "System bug: the economy is treated as if it exists outside nature",
    },
    title: "How Doughnut economics puts the economy inside limits",
  },
  {
    accent: "cyan",
    betterMetrics: [
      {
        description:
          "How much pollution is accumulating in the stock, not just how emissions changed this year.",
        label: "Accumulated pollution stock",
      },
      {
        description:
          "How close the system is to thresholds beyond which damage becomes abrupt, harder to reverse, or self-reinforcing.",
        label: "Distance to tipping points",
      },
      {
        description:
          "How long the delay is between a harmful action and the visible damage it causes.",
        label: "Feedback delay length",
      },
      {
        description:
          "How much adaptive capacity remains in ecosystems, infrastructure, and public health before recovery becomes much more expensive.",
        label: "Remaining resilience",
      },
    ],
    betterMetricsTitle: "The signals that matter when damage builds slowly and then hits fast",
    counterArguments: [
      {
        point:
          "If pollution were really a systems threat, the damage would already be obvious to everyone all the time.",
        response:
          "Many environmental harms are delayed. Stocks build quietly, ecosystems absorb stress for a while, and then visible damage appears later, often after prevention has become more expensive than it would have been earlier.",
        title: "Real problems would be obvious immediately",
      },
      {
        point:
          "Technology can always clean up pollution later, so there is no need to worry about tipping points now.",
        response:
          "Some pollution can be cleaned up, but not all system damage is reversible on useful timescales. Species loss, ice-sheet melt, reef collapse, or soil degradation can create long shadows that technology cannot simply rewind.",
        title: "Cleanup later is enough",
      },
      {
        point:
          "Tipping points are too uncertain to matter for policy.",
        response:
          "Uncertainty is not a reason for delay when the downside risk is large and potentially irreversible. In systems with nonlinear thresholds, waiting for total certainty often means waiting until the safe margin is already gone.",
        title: "Uncertainty means we should wait",
      },
    ],
    causalLoop: {
      description:
        "Pollution behaves like a stock. It can accumulate faster than natural systems absorb it. Because damage is delayed, society often keeps expanding the flow until resilience weakens and a tipping point becomes more likely.",
      edges: [
        { from: "economicFlow", label: "creates", polarity: "positive", to: "pollutionFlow" },
        { from: "pollutionFlow", label: "adds to", polarity: "positive", to: "pollutionStock" },
        { from: "naturalAbsorption", label: "reduces", polarity: "negative", to: "pollutionStock" },
        { from: "pollutionStock", label: "erodes", polarity: "negative", to: "ecosystemResilience" },
        { from: "ecosystemResilience", label: "buffers", polarity: "negative", to: "visibleDamage" },
        { from: "visibleDamage", label: "raises", polarity: "positive", to: "publicAlarm" },
        { from: "publicAlarm", label: "pushes", polarity: "positive", to: "pollutionControl" },
        { from: "pollutionControl", label: "cuts", polarity: "negative", to: "pollutionFlow" },
        { from: "lowResilience", label: "raises risk of", polarity: "positive", to: "tippingDynamics" },
        { from: "tippingDynamics", label: "amplify", polarity: "positive", to: "visibleDamage" },
      ],
      loops: [
        "Balancing: more public alarm -> more pollution control -> lower pollution flow",
        "Reinforcing danger loop: accumulated pollution -> lower resilience -> higher tipping risk -> more visible damage",
      ],
      nodes: [
        { id: "economicFlow", label: "Economic activity", tone: "amber", x: 80, y: 100 },
        { id: "pollutionFlow", label: "Pollution flow", tone: "rose", x: 280, y: 50 },
        { id: "pollutionStock", label: "Pollution stock", tone: "rose", x: 500, y: 120 },
        { id: "naturalAbsorption", label: "Natural absorption", tone: "emerald", x: 500, y: 300 },
        { id: "ecosystemResilience", label: "Ecosystem resilience", tone: "cyan", x: 280, y: 350 },
        { id: "visibleDamage", label: "Visible damage", tone: "amber", x: 80, y: 300 },
        { id: "publicAlarm", label: "Public alarm", tone: "emerald", x: 80, y: 460 },
        { id: "pollutionControl", label: "Pollution control", tone: "cyan", x: 280, y: 500 },
        { id: "lowResilience", label: "Low resilience", tone: "rose", x: 500, y: 430 },
        { id: "tippingDynamics", label: "Tipping dynamics", tone: "rose", x: 500, y: 520 },
      ],
      title: "Why slow accumulation can end in abrupt instability",
    },
    difficulty: "Starter",
    discussionPrompt:
      "Why do societies often react late to environmental danger? Is it because people do not care, or because delayed feedback makes accumulation look harmless until the system is already close to a threshold?",
    eyebrow: "Systems risk",
    heroHighlights: [
      "Pollution is often a stock problem: what matters is accumulation over time, not only today’s flow.",
      "Delayed feedback can hide damage until the system is already much less resilient.",
      "Tipping points matter because change can become abrupt, nonlinear, and harder to reverse.",
    ],
    miniLesson: {
      accent: "cyan",
      conclusion:
        "The key mistake is to look only at this year’s emissions or this year’s cleanup. In systems with accumulation and delayed feedback, a problem can look manageable right up until resilience is gone and the response has become too late or too expensive.",
      metrics: [
        {
          description: "Whether harmful material is still building in the system",
          high: "Accumulation is rising faster than sinks absorb it",
          label: "Stock buildup",
          low: "Sinks and repair outpace additions",
          signal: "more buildup -> more danger later",
        },
        {
          description: "Whether the system still has room to absorb shocks",
          high: "Resilience is still strong",
          label: "Resilience",
          low: "Buffer capacity is almost exhausted",
          signal: "less resilience -> sharper damage",
        },
        {
          description: "How likely change is to become abrupt or self-reinforcing",
          high: "Thresholds are near",
          label: "Tipping risk",
          low: "System remains far from major thresholds",
          signal: "higher risk -> more caution needed",
        },
      ],
      subtitle: "Why slow pollution problems can suddenly feel fast",
      title: "Mini lesson: stocks, delays, and thresholds",
    },
    readingTime: "8 min",
    realWorldExamples: [
      {
        insight:
          "The Great Smog of London made visible what had been building for years: pollution can look normal until a weather pattern or threshold reveals the full health cost at once.",
        outcome:
          "The crisis helped drive the UK Clean Air Act, showing how delayed damage often becomes politically real only after a visible shock.",
        title: "London smog and delayed visibility",
      },
      {
        insight:
          "The ozone crisis showed that atmospheric pollution can accumulate invisibly across borders and then require global coordination once the damage becomes undeniable.",
        outcome:
          "The Montreal Protocol became a model for acting on a systemic pollution threat before the damage became even larger and harder to reverse.",
        title: "Ozone depletion and coordinated response",
      },
      {
        insight:
          "Climate-linked coral bleaching, wildfire feedbacks, and ecosystem collapse risks show why environmental change is not always gradual. Loss of resilience can make damage arrive in jumps.",
        outcome:
          "These cases keep shifting environmental policy toward risk management, precaution, and resilience rather than waiting for neat linear forecasts.",
        title: "Tipping risk in climate and ecosystems",
      },
    ],
    evidenceLinks: [owidEvidenceLinks.airPollution, owidEvidenceLinks.biodiversity, owidEvidenceLinks.cleanWater],
    relatedFrameworks: [
      "Stocks and flows",
      "Overshoot",
      "Planetary boundaries",
      "Delayed feedback",
      "Tipping points",
    ],
    simulationPrompt:
      "Test what happens when pollution controls arrive early versus late in a system where pollution accumulates, resilience erodes, and tipping risks rise after long delays.",
    simpleExplanation: [
      "Many environmental problems are hard to govern because they do not behave like a simple one-time accident. They behave like stocks: pollution, heat, nutrient overload, or ecological damage can accumulate slowly while the system still appears stable.",
      "That apparent stability is misleading. Ecosystems, oceans, forests, soils, and even public health systems often absorb damage for a while. This buffering capacity makes the problem look smaller than it really is. But once resilience is weakened enough, the same level of pressure can suddenly produce much larger visible harm.",
      "That is where tipping points matter. A tipping point is not just a bad outcome. It is a threshold after which change becomes nonlinear, self-reinforcing, or much harder to reverse. In practical terms, it means prevention was cheaper earlier, but institutions often wait because the feedback arrived late.",
      "The lesson is not panic; it is systems literacy. If you only look at immediate flows or only react to visible crisis, you will almost always intervene too late. The safer strategy is to watch stocks, delays, buffer capacity, and threshold risk before the system is forced into abrupt adjustment.",
    ],
    slug: "how-pollution-builds-up-until-systems-tip",
    summary:
      "Pollution becomes a systems risk when it accumulates faster than the environment can absorb it. Delayed feedback hides the danger, resilience erodes quietly, and then change can become abrupt and harder to reverse.",
    systemBug: {
      signals: [
        "Policy reacts to visible damage while ignoring the stock that was accumulating beforehand.",
        "Success is measured by short-run output while resilience, sink capacity, and threshold risk are barely tracked.",
        "Environmental cleanup is funded after crisis, while prevention struggles to compete with immediate returns.",
      ],
      summary:
        "The system bug is delayed visibility. When harm accumulates invisibly for years, institutions organized around short-term signals tend to underreact until prevention has become far more costly than it needed to be.",
      title: "System bug: delayed feedback makes overshoot look harmless until it isn't",
    },
    title: "How pollution builds up until systems tip",
  },
  {
    accent: "amber",
    betterMetrics: [
      {
        description: "Who gets access to lawmakers, hearings, and draft text?",
        label: "Access equality",
      },
      {
        description: "Are meetings, donations, and revolving-door relationships visible?",
        label: "Transparency",
      },
      {
        description: "Do consultations include citizens, workers, and affected communities too?",
        label: "Voice diversity",
      },
      {
        description: "Can agencies actually resist capture and enforce rules?",
        label: "Regulatory capacity",
      },
    ],
    betterMetricsTitle: "Healthy guardrails to watch",
    counterArguments: [
      {
        point:
          "Policymakers genuinely need industry expertise when writing complicated rules.",
        response:
          "Yes, but expertise and agenda control are not the same thing. The fix is transparent, balanced input rather than privileged access for the most resourced actors.",
        title: "Expertise matters",
      },
      {
        point:
          "Lobbying is not the same as bribery; many civil-society groups lobby too.",
        response:
          "Correct. The concern is asymmetry. When some actors can fund armies of advocates and others cannot, the policy field tilts even without explicit corruption.",
        title: "Influence can be legal",
      },
    ],
    causalLoop: {
      description:
        "Money often shapes policy through agenda setting, drafting access, and delay power long before anything openly illegal appears.",
      edges: [
        { from: "donor-dependence", label: "more dependence", polarity: "positive", to: "privileged-access" },
        { from: "privileged-access", label: "agenda control", polarity: "positive", to: "policy-carveouts" },
        { from: "policy-carveouts", label: "concentrated benefits", polarity: "positive", to: "private-gains" },
        { bend: 12, from: "private-gains", label: "more money for influence", polarity: "positive", to: "donor-dependence" },
        { from: "policy-carveouts", label: "public cynicism", polarity: "negative", to: "public-trust" },
        { from: "public-trust", label: "reform mandate", polarity: "positive", to: "reform-capacity" },
        { bend: -16, from: "reform-capacity", label: "stronger guardrails", polarity: "negative", to: "policy-carveouts" },
      ],
      loops: [
        "Reinforcing loop: money buys access, access shapes carve-outs, carve-outs create gains, and gains finance more influence.",
        "Balancing loop: when trust loss becomes visible, reforms like disclosure, public financing, and conflict rules can reduce capture.",
      ],
      nodes: [
        { id: "donor-dependence", label: "Dependence on private donors", tone: "amber", x: 18, y: 18 },
        { id: "privileged-access", label: "Privileged policy access", tone: "cyan", x: 78, y: 20 },
        { id: "policy-carveouts", label: "Policy carve-outs and delays", tone: "rose", x: 78, y: 54 },
        { id: "private-gains", label: "Concentrated private gains", tone: "amber", x: 18, y: 54 },
        { id: "public-trust", label: "Public trust", tone: "emerald", x: 20, y: 84 },
        { id: "reform-capacity", label: "Reform capacity", tone: "emerald", x: 78, y: 84 },
      ],
      title: "Causal loop: influence becomes self-financing",
    },
    difficulty: "Starter",
    discussionPrompt:
      "Which forms of lobbying feel like legitimate expertise, and which feel like structural capture in your country?",
    eyebrow: "Political influence",
    heroHighlights: [
      "Policy can be bent through access, timing, and drafting power without a dramatic scandal.",
      "Capture usually works by privileging some voices over others, not by banning public input altogether.",
      "Transparency and countervailing institutions matter because influence compounds.",
    ],
    miniLesson: {
      bands: [
        {
          insight:
            "Lower donor dependence gives lawmakers more room to respond to broader public interests.",
          threshold: 0,
        },
        {
          insight:
            "As donor dependence rises, access becomes more unequal and trust starts to erode even before rules visibly change.",
          threshold: 40,
        },
        {
          insight:
            "At high dependence, the system begins to optimize for insiders, and reform gets harder because the winners can protect the arrangement.",
          threshold: 70,
        },
      ],
      defaultValue: 45,
      description:
        "This mini lesson compresses one mechanism of policy capture: money changes who gets heard, and that changes which outcomes feel politically possible.",
      highLabel: "High donor influence",
      lowLabel: "Low donor influence",
      metrics: [
        {
          base: 18,
          description: "How strongly policy tracks concentrated funders.",
          key: "donor-response",
          label: "Donor responsiveness",
          max: 100,
          min: 0,
          slope: 0.95,
          suffix: "/100",
          tone: "amber",
        },
        {
          base: 90,
          description: "How much ordinary people believe the system listens back.",
          key: "trust",
          label: "Public trust",
          max: 100,
          min: 0,
          slope: -0.78,
          suffix: "/100",
          tone: "emerald",
        },
        {
          base: 88,
          description: "How likely the system is to pass broad public-interest reform.",
          key: "reform",
          label: "Reform capacity",
          max: 100,
          min: 0,
          slope: -0.72,
          suffix: "/100",
          tone: "cyan",
        },
      ],
      prompt: "Move the influence slider to see how capture accumulates.",
      sliderLabel: "Dependence on private donors",
      step: 1,
      title: "Mini lesson: access quietly rewrites incentives",
      unit: "%",
      valueMax: 100,
      valueMin: 0,
    },
    readingTime: "6 min",
    realWorldExamples: [
      {
        insight:
          "Capture often looks like delay, exemption, or complexity rather than dramatic public reversals.",
        outcome:
          "Industries with deep lobbying resources can slow or dilute rules that would otherwise be straightforward.",
        title: "Regulatory delay can be a win",
      },
      {
        insight:
          "The revolving door turns private knowledge into privileged access and insider timing.",
        outcome:
          "Officials, consultants, and firms can end up navigating both sides of the same policy process.",
        title: "Personnel pipelines matter",
      },
      {
        insight:
          "Even where corruption laws are strict, policy can still systematically over-serve the best-organized players.",
        outcome:
          "Real-estate, healthcare, finance, or energy interests often shape the boundaries of feasible reform.",
        title: "Legal influence can still distort priorities",
      },
    ],
    relatedFrameworks: [
      "Political economy",
      "Institutional capture",
      "Public choice and incentive design",
      "Causal loop mapping",
    ],
    simulationPrompt:
      "Test a scenario with stronger lobbying disclosure, public campaign finance, and more citizen oversight.",
    simpleExplanation: [
      "Lobbying shapes policy less by issuing explicit orders and more by controlling access, timing, framing, and detail. The question is often not 'Who wrote the law?' but 'Who was in the room early enough to shape it?'",
      "Organizations with money can hire advocates, analysts, lawyers, and public-relations teams. That lets them show up repeatedly with draft language, talking points, and warnings about costs or disruption.",
      "This does not mean every lobbyist is malign. It means influence is unevenly distributed, so the system can over-hear concentrated interests and under-hear dispersed ones.",
    ],
    slug: "how-lobbying-shapes-policy",
    summary:
      "Influence usually works through access, repetition, and carve-outs, not just dramatic corruption scandals.",
    systemBug: {
      signals: [
        "The best-resourced actors appear earlier, more often, and with more technical support.",
        "Policy delay can be as valuable as policy victory.",
        "Public trust falls when people sense that formal democracy hides informal hierarchy.",
      ],
      summary:
        "The system rewards persistent organized influence, so those with the most money and staff shape the policy menu before the public sees it.",
      title: "System bug: access is unequal, so representation becomes unequal too",
    },
    title: "How lobbying shapes policy",
  },
  {
    accent: "emerald",
    betterMetrics: [
      {
        description: "How much life is lost to mandatory travel between basic needs?",
        label: "Commute burden",
      },
      {
        description: "Can people reach daily essentials without a car?",
        label: "Local access",
      },
      {
        description: "Do neighborhoods create chances for rest, play, and everyday meeting?",
        label: "Public space quality",
      },
      {
        description: "Does the built environment support calm, safety, and autonomy?",
        label: "Freedom in daily life",
      },
    ],
    betterMetricsTitle: "Signals of a humane city",
    counterArguments: [
      {
        point:
          "Cars give flexibility, privacy, and reach that dense urban systems sometimes cannot match.",
        response:
          "They can, especially in weak transit regions. The issue is not banning cars but avoiding a city where every basic task requires one.",
        title: "Cars can be genuinely useful",
      },
      {
        point:
          "Density can feel noisy, crowded, or expensive.",
        response:
          "That is why the question is design quality, not density alone. Green space, mixed use, housing supply, and walkability change how density is experienced.",
        title: "Density is not automatically liberating",
      },
    ],
    causalLoop: {
      description:
        "Urban form quietly decides how much time, attention, money, and nervous-system load people must spend just to move through ordinary life.",
      edges: [
        { from: "car-dependence", label: "more mandatory driving", polarity: "positive", to: "commute-time" },
        { from: "commute-time", label: "friction and fatigue", polarity: "positive", to: "stress" },
        { from: "stress", label: "less room to breathe", polarity: "negative", to: "daily-freedom" },
        { from: "public-space", label: "rest and contact", polarity: "positive", to: "daily-freedom" },
        { from: "daily-freedom", label: "stronger civic life", polarity: "positive", to: "local-trust" },
        { bend: -14, from: "local-trust", label: "support for shared space", polarity: "positive", to: "public-space" },
        { bend: 12, from: "car-dependence", label: "space taken from people", polarity: "negative", to: "public-space" },
      ],
      loops: [
        "Reinforcing stress loop: more car dependence drives longer commutes, which raises stress and reduces the freedom people feel in everyday life.",
        "Positive civic loop: better public space supports freedom, trust, and local support for even better public space.",
      ],
      nodes: [
        { id: "car-dependence", label: "Car dependence", tone: "amber", x: 16, y: 18 },
        { id: "commute-time", label: "Commute time", tone: "amber", x: 80, y: 18 },
        { id: "stress", label: "Stress", tone: "rose", x: 80, y: 54 },
        { id: "daily-freedom", label: "Daily freedom", tone: "emerald", x: 18, y: 54 },
        { id: "public-space", label: "Public space and local access", tone: "cyan", x: 20, y: 84 },
        { id: "local-trust", label: "Local trust", tone: "emerald", x: 80, y: 84 },
      ],
      title: "Causal loop: design choices become nervous-system outcomes",
    },
    difficulty: "Starter",
    discussionPrompt:
      "What makes your city feel like it is designed around cars, rent, and throughput instead of human time and calm?",
    eyebrow: "Urban systems",
    heroHighlights: [
      "Cities decide whether ordinary life feels exhausting or breathable.",
      "Commute time is not just inconvenience; it changes stress, family time, and civic participation.",
      "Freedom in a city often means proximity, safety, and options, not just speed.",
    ],
    miniLesson: {
      bands: [
        {
          insight:
            "Shorter travel burdens leave more cognitive and emotional space for work, care, and civic participation.",
          threshold: 0,
        },
        {
          insight:
            "In the middle range, commutes start eating into time and attention even if the city still feels manageable.",
          threshold: 35,
        },
        {
          insight:
            "At long commute levels, stress surges and freedom collapses because too much of life is spent just getting between necessities.",
          threshold: 60,
        },
      ],
      defaultValue: 35,
      description:
        "This lesson models one everyday urban mechanism: when travel time rises, life loses flexibility and nervous-system cost rises.",
      highLabel: "Long commute burden",
      lowLabel: "Short commute burden",
      metrics: [
        {
          base: 12,
          description: "A rough load of daily stress caused by long trips and low flexibility.",
          key: "stress",
          label: "Stress load",
          max: 100,
          min: 0,
          slope: 0.95,
          suffix: "/100",
          tone: "rose",
        },
        {
          base: 92,
          description: "How much daily life feels open, nearby, and manageable.",
          key: "freedom",
          label: "Daily freedom",
          max: 100,
          min: 0,
          slope: -0.82,
          suffix: "/100",
          tone: "emerald",
        },
        {
          base: 10,
          description: "Environmental load from transport-heavy living.",
          key: "ecology",
          label: "Transport ecological load",
          max: 100,
          min: 0,
          slope: 0.86,
          suffix: "/100",
          tone: "amber",
        },
      ],
      prompt: "Shift commute burden to see how time design changes life quality.",
      sliderLabel: "Average commute burden",
      step: 1,
      title: "Mini lesson: commute time rewrites the day",
      unit: "min",
      valueLabel: "minutes",
      valueMax: 90,
      valueMin: 10,
    },
    readingTime: "6 min",
    realWorldExamples: [
      {
        insight:
          "A city can increase freedom not by moving people faster, but by moving necessities closer.",
        outcome:
          "Walkable districts and 15-minute planning often improve daily autonomy without requiring constant high-speed travel.",
        title: "Proximity changes lived freedom",
      },
      {
        insight:
          "Public space is infrastructure for mental health and social trust, not a decorative extra.",
        outcome:
          "Trees, benches, plazas, and traffic calming can change whether people linger, meet, and recover.",
        title: "Streets can calm or agitate",
      },
      {
        insight:
          "Long commutes quietly tax family life, unpaid care, and civic energy.",
        outcome:
          "Urban systems that demand constant travel often make people feel permanently rushed even when nominal incomes rise.",
        title: "Time poverty is a city outcome",
      },
    ],
    evidenceLinks: [owidEvidenceLinks.urbanization, owidEvidenceLinks.airPollution],
    relatedFrameworks: [
      "Urban systems thinking",
      "Jane Jacobs",
      "Human-centered planning",
      "Causal loop mapping",
    ],
    simulationPrompt:
      "Test a scenario with shorter commutes, more mixed-use neighborhoods, and higher investment in public space.",
    simpleExplanation: [
      "Cities are not neutral containers. Street layout, land use, transit, green space, and housing patterns shape how much friction daily life contains.",
      "When basic needs are far apart, people spend more money, attention, and time just moving between them. That can mean more stress, less spontaneity, and less room for relationships or civic life.",
      "A freedom-producing city usually offers proximity, safety, and options. It lets people do ordinary things without constant logistical strain.",
    ],
    slug: "why-cities-create-stress-or-freedom",
    summary:
      "Urban design can either tax people with distance and friction or create calm, flexibility, and local freedom.",
    systemBug: {
      signals: [
        "Long commutes become normal enough that their health and civic cost disappears from policy debates.",
        "Road capacity is often treated as mobility while proximity and local access are ignored.",
        "Shared space is cut back even though it creates recovery, trust, and autonomy.",
      ],
      summary:
        "The city optimizes movement throughput and real-estate logic, while the actual goal should be livable, low-friction daily life.",
      title: "System bug: movement efficiency is mistaken for human freedom",
    },
    title: "Why cities create stress or freedom",
  },
  {
    accent: "rose",
    betterMetrics: [
      {
        description: "Are platforms rewarding verified understanding or raw reaction?",
        label: "Nuance capacity",
      },
      {
        description: "How much trust remains after repeated outrage cycles?",
        label: "Trust resilience",
      },
      {
        description: "Do correction, context, and slower reporting get reach too?",
        label: "Truth incentives",
      },
      {
        description: "Can people disagree without being shoved into enemy narratives?",
        label: "Deliberative quality",
      },
    ],
    betterMetricsTitle: "Signals beyond raw engagement",
    counterArguments: [
      {
        point:
          "Outrage can be appropriate when something genuinely unjust or dangerous is happening.",
        response:
          "Absolutely. The issue is when platforms structurally over-reward outrage because it performs well commercially, even when calmer truth-seeking would serve the public better.",
        title: "Some outrage is justified",
      },
      {
        point:
          "High-engagement media is sometimes the only way serious issues break through public apathy.",
        response:
          "Attention matters, but the long-term question is whether the system leaves people better informed or merely more activated and less grounded.",
        title: "Emotion can mobilize attention",
      },
    ],
    causalLoop: {
      description:
        "When attention is monetized, emotionally extreme content often wins. That creates a feedback loop between outrage, engagement, and platform incentives.",
      edges: [
        { from: "outrage-reward", label: "boosts reach", polarity: "positive", to: "sensational-content" },
        { from: "sensational-content", label: "stronger reactions", polarity: "positive", to: "engagement" },
        { from: "engagement", label: "ad revenue", polarity: "positive", to: "platform-incentives" },
        { bend: 12, from: "platform-incentives", label: "train the feed", polarity: "positive", to: "outrage-reward" },
        { from: "sensational-content", label: "reduces context", polarity: "negative", to: "nuance" },
        { from: "nuance", label: "protects trust", polarity: "positive", to: "public-trust" },
        { bend: -14, from: "public-trust", label: "less paranoia demand", polarity: "negative", to: "outrage-reward" },
      ],
      loops: [
        "Reinforcing loop: outrage earns engagement, engagement earns revenue, and revenue pushes platforms to reward more outrage.",
        "Balancing loop: stronger context, slower reporting, and better trust can reduce the demand for reflexive enemy narratives.",
      ],
      nodes: [
        { id: "outrage-reward", label: "Reward for outrage", tone: "rose", x: 20, y: 18 },
        { id: "sensational-content", label: "Sensational content", tone: "rose", x: 80, y: 18 },
        { id: "engagement", label: "Engagement spikes", tone: "amber", x: 80, y: 54 },
        { id: "platform-incentives", label: "Platform incentives", tone: "amber", x: 18, y: 54 },
        { id: "nuance", label: "Nuance and context", tone: "cyan", x: 20, y: 84 },
        { id: "public-trust", label: "Public trust", tone: "emerald", x: 80, y: 84 },
      ],
      title: "Causal loop: attention markets reward emotional intensity",
    },
    difficulty: "Starter",
    discussionPrompt:
      "Where have you noticed a platform or news format push you toward reaction before understanding?",
    eyebrow: "Media systems",
    heroHighlights: [
      "Outrage is often profitable even when it is socially corrosive.",
      "Feeds and headlines shape emotional tempo, not just information flow.",
      "A healthier media system would reward context, correction, and slower public judgment.",
    ],
    miniLesson: {
      bands: [
        {
          insight:
            "When outrage reward is low, people can spend more time with context and less time being whipped into reaction.",
          threshold: 0,
        },
        {
          insight:
            "As outrage reward rises, engagement improves quickly, but nuance and trust begin to fall away.",
          threshold: 40,
        },
        {
          insight:
            "At high reward levels, the system starts training users, creators, and journalists into constant escalation.",
          threshold: 70,
        },
      ],
      defaultValue: 50,
      description:
        "This lesson shows the platform trade-off: what grows fastest in an attention market is not always what helps a public think well.",
      highLabel: "High outrage reward",
      lowLabel: "Low outrage reward",
      metrics: [
        {
          base: 20,
          description: "How strongly content is optimized for anger and shock.",
          key: "engagement",
          label: "Engagement spikes",
          max: 100,
          min: 0,
          slope: 0.9,
          suffix: "/100",
          tone: "amber",
        },
        {
          base: 94,
          description: "How much space remains for context, nuance, and slower judgment.",
          key: "nuance",
          label: "Nuance capacity",
          max: 100,
          min: 0,
          slope: -0.8,
          suffix: "/100",
          tone: "cyan",
        },
        {
          base: 92,
          description: "How likely the public is to trust one another and shared information.",
          key: "trust",
          label: "Public trust",
          max: 100,
          min: 0,
          slope: -0.76,
          suffix: "/100",
          tone: "emerald",
        },
      ],
      prompt: "Move the slider and watch what the attention market optimizes for.",
      sliderLabel: "Reward for outrage in the feed",
      step: 1,
      title: "Mini lesson: the feed learns what makes you react",
      unit: "%",
      valueMax: 100,
      valueMin: 0,
    },
    readingTime: "8 min",
    realWorldExamples: [
      {
        insight:
          "MIT researchers found that false news on Twitter spread farther, faster, deeper, and more broadly than true news, especially in politics.",
        outcome:
          "Novelty and emotional charge had a structural edge in the attention market, helping falsehood outperform correction even without assuming a giant army of bots caused the whole effect.",
        title: "False news outruns true news",
      },
      {
        insight:
          "Yale researchers showed that likes and shares can train people to express more moral outrage online because outrage gets socially rewarded on platforms.",
        outcome:
          "People are not only reacting to outrage. They are learning that outrage is a successful performance inside the system.",
        title: "The feed teaches outrage",
      },
      {
        insight:
          "A Nature Human Behaviour study of headline experiments found that negative words increase click-through rates in online news.",
        outcome:
          "Editors and publishers face a measurable incentive to make headlines darker, sharper, and more threatening than calmer wording would be.",
        title: "Negative headlines get rewarded",
      },
      {
        insight:
          "Once a hot claim wins the first round of attention, later corrections usually reach a smaller and less emotionally primed audience.",
        outcome:
          "Even when the record is fixed later, the first outrage object often remains what people remember and organize around.",
        title: "Corrections lose the race",
      },
    ],
    evidenceLinks: [
      {
        note:
          "A canonical study showing that false stories can outperform true ones in reach and speed inside social platforms.",
        source: "MIT News / Science",
        title: "Study: On Twitter, false news travels faster than true stories",
        url: "https://news.mit.edu/2018/study-twitter-false-news-travels-faster-true-stories-0308",
      },
      {
        note:
          "Helpful for the mechanism: platform feedback does not just reward outrage, it can train users to produce more of it.",
        source: "Yale News",
        title: "Likes and shares teach people to express more outrage online",
        url: "https://news.yale.edu/2021/08/13/likes-and-shares-teach-people-express-more-outrage-online",
      },
      {
        note:
          "Useful for headline economics: negativity wins clicks even when outlets are running large-scale tests rather than guessing.",
        source: "Nature Human Behaviour",
        title: "Negativity drives online news consumption",
        url: "https://www.nature.com/articles/s41562-023-01538-4",
      },
    ],
    relatedFrameworks: [
      "Attention economics",
      "Incentive design",
      "Moral contagion",
      "System dynamics",
      "Information ecology",
    ],
    simulationPrompt:
      "Test a scenario where feeds reward verified context, slower amplification, and cross-perspective exposure.",
    simpleExplanation: [
      "Modern media systems often make money from attention, and attention is not neutral. Human beings react faster to threat, conflict, status challenge, and outrage than to calm complexity.",
      "That means the platform can reward emotionally intense content even when that content makes people less informed or more divided.",
      "The result is a public sphere that becomes quicker to react and slower to understand. Outrage is not invented from nowhere, but the incentive structure can turn every issue into a heightened conflict format.",
    ],
    slug: "how-media-incentives-produce-outrage",
    summary:
      "Attention markets often reward emotional escalation, which can increase engagement while degrading trust and nuance.",
    systemBug: {
      signals: [
        "Emotionally loaded content gets amplified faster than careful context.",
        "Corrections underperform compared with the original outrage object.",
        "Creators learn that certainty and conflict are rewarded more than precision.",
      ],
      summary:
        "The platform gets paid when users stay activated, so content design gravitates toward what reliably triggers reaction.",
      title: "System bug: what is profitable to amplify is not always healthy to absorb",
    },
    title: "How media incentives produce outrage",
  },
  {
    accent: "rose",
    betterMetrics: [
      {
        description:
          "How much repeated persuasive messaging reaches people before they can meaningfully opt out or compare alternatives?",
        label: "Exposure concentration",
      },
      {
        description:
          "Can people easily tell whether a message is grassroots speech, journalism, sponsorship, or paid image management?",
        label: "Source transparency",
      },
      {
        description:
          "How much commercial persuasion is aimed at youth or identity formation rather than narrow product information?",
        label: "Identity targeting",
      },
      {
        description:
          "Do public-health, civic, and educational institutions have enough reach to answer well-funded corporate narratives?",
        label: "Countervailing capacity",
      },
    ],
    betterMetricsTitle: "What a healthier public-opinion system would track",
    causalLoop: {
      description:
        "When a company can repeatedly attach a product to freedom, status, belonging, or modernity, the product feels culturally normal rather than commercially pushed. Higher sales then fund even more image management and lobbying.",
      edges: [
        { from: "marketingBudget", label: "funds", polarity: "positive", to: "symbolicCampaigns" },
        { from: "movementSymbols", label: "supplies", polarity: "positive", to: "symbolicCampaigns" },
        { from: "symbolicCampaigns", label: "shape", polarity: "positive", to: "culturalMeaning" },
        { from: "culturalMeaning", label: "normalizes", polarity: "positive", to: "socialAcceptance" },
        { from: "socialAcceptance", label: "raises", polarity: "positive", to: "sales" },
        { from: "sales", label: "expands", polarity: "positive", to: "marketingBudget" },
        { from: "sales", label: "finances", polarity: "positive", to: "prAndLobbyPower" },
        { from: "prAndLobbyPower", label: "weakens", polarity: "negative", to: "publicGuardrails" },
        { from: "publicGuardrails", label: "limits", polarity: "negative", to: "symbolicCampaigns" },
      ],
      loops: [
        "Reinforcing: symbolic campaigns -> cultural meaning -> social acceptance -> sales -> larger marketing budgets -> more symbolic campaigns",
        "Balancing: scrutiny, health rules, and transparency can interrupt the loop, but often only after a norm has already been stabilized",
      ],
      nodes: [
        { id: "marketingBudget", label: "Marketing budget", tone: "amber", x: 18, y: 18 },
        { id: "movementSymbols", label: "Borrowed social symbols", tone: "cyan", x: 18, y: 52 },
        { id: "symbolicCampaigns", label: "Identity campaigns", tone: "rose", x: 50, y: 30 },
        { id: "culturalMeaning", label: "Product meaning", tone: "rose", x: 82, y: 18 },
        { id: "socialAcceptance", label: "Social acceptance", tone: "emerald", x: 82, y: 52 },
        { id: "sales", label: "Sales growth", tone: "amber", x: 50, y: 82 },
        { id: "prAndLobbyPower", label: "PR and lobbying power", tone: "rose", x: 18, y: 84 },
        { id: "publicGuardrails", label: "Public guardrails", tone: "emerald", x: 82, y: 84 },
      ],
      title: "The norm-engineering loop",
    },
    counterArguments: [
      {
        point:
          "Advertising mostly responds to preferences people already have. It does not create them from nothing.",
        response:
          "That is partly true. But repeated campaigns can still decide which preferences feel normal, modern, respectable, rebellious, or desirable. Marketing often shapes the meaning around a product rather than only describing the product itself.",
        title: "Ads only mirror demand",
      },
      {
        point:
          "People are not passive. Culture is too complex to be engineered by a company campaign.",
        response:
          "People do interpret messages actively. The structural issue is asymmetry: firms can repeat a story across media, celebrities, events, and sponsorships until it starts to feel like common sense. That does not guarantee control, but it does buy disproportionate influence over the symbolic environment.",
        title: "Culture cannot be engineered from above",
      },
    ],
    difficulty: "Intermediate",
    discussionPrompt:
      "When does marketing stop being ordinary persuasion and start functioning like political engineering of public norms, identities, and movements?",
    evidenceLinks: [
      {
        note:
          "Useful for the big-picture biography: Bernays was Sigmund Freud's nephew and a foundational figure in public relations, not just a tobacco ad man.",
        source: "Britannica",
        title: "Edward Bernays",
        url: "https://www.britannica.com/biography/Edward-Bernays",
      },
      {
        note:
          "This public-health history tracks how smoking among women was recoded from taboo to freedom and modernity through promotional strategy.",
        source: "Tobacco Control",
        title: "From social taboo to 'torch of freedom'",
        url: "https://tobaccocontrol.bmj.com/content/8/2/136",
      },
      {
        note:
          "Helpful for showing that marketing can create cultural expectations, not just boost short-term sales: De Beers helped turn the diamond engagement ring into a mass social norm.",
        source: "Britannica",
        title: "How Did the Tradition of Wedding Rings Start?",
        url: "https://www.britannica.com/topic/How-Did-the-Tradition-of-Wedding-Rings-Start",
      },
      {
        note:
          "A strong case of blame-shifting: anti-litter campaigns and corporate partnerships often moved responsibility from producers of disposable waste onto individual consumers.",
        source: "Tobacco Control",
        title: "Covering Their Butts: Responses to the Cigarette Litter Problem",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3209806/",
      },
      {
        note:
          "Useful for the street-space example: the auto industry did not only sell cars, it helped redefine who streets were for and made pedestrian behavior seem backward or irresponsible.",
        source: "JSTOR Daily",
        title: "\"Jay Walking\" and the Fight for the Streets",
        url: "https://daily.jstor.org/jay-walking-and-the-fight-for-the-streets/",
      },
      {
        note:
          "Useful for a modern climate-era example: BP's green advertising helped soften consumer punishment, while later research found a mismatch between clean-energy discourse and actual investment patterns.",
        source: "American Economic Association",
        title: "Advertising and Environmental Stewardship: Evidence from the BP Oil Spill",
        url: "https://www.aeaweb.org/articles?id=10.1257/pol.20160555",
      },
      {
        note:
          "A broader greenwashing lens on oil majors: BP and peers sharply increased climate discourse without matching it with a comparable shift in underlying business models.",
        source: "PLOS One",
        title: "The clean energy claims of BP, Chevron, ExxonMobil and Shell",
        url: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0263596",
      },
      {
        note:
          "A broader health lens showing how the tobacco industry deliberately targeted women through symbolism, glamour, slimness, and emancipation themes.",
        source: "National Cancer Institute / NCBI",
        title: "Women and Smoking",
        url: "https://www.ncbi.nlm.nih.gov/books/NBK53022/",
      },
    ],
    eyebrow: "Public opinion design",
    heroHighlights: [
      "Modern marketing often sells meanings first and products second: freedom, status, adulthood, rebellion, care, or belonging.",
      "Companies can borrow the language of real social change and redirect it toward commercial ends.",
      "The same techniques can also shift blame away from producers and toward consumers, making structural problems look personal.",
      "Once a norm is culturally stabilized, higher sales and lobbying power help keep the narrative in place.",
    ],
    miniLesson: {
      accent: "rose",
      conclusion:
        "The deepest marketing campaigns do not ask, 'How do we describe this product?' They ask, 'What identity, fear, aspiration, or movement can this product attach itself to?'",
      metrics: [
        {
          description:
            "Whether the campaign sells a feature or links the product to freedom, adulthood, beauty, rebellion, or belonging",
          high: "Identity, emotion, and movement symbolism",
          label: "Symbolic hook",
          low: "Mostly factual product information",
          signal: "stronger hook -> deeper norm shift",
        },
        {
          description:
            "How many channels can repeat the same frame until it feels natural",
          high: "Celebrities, events, press, sponsorship, retail, schools",
          label: "Repetition power",
          low: "One-off ads with limited reach",
          signal: "more repetition -> stronger cultural normalization",
        },
        {
          description:
            "Whether journalism, health institutions, and civic education can contest the frame in time",
          high: "Strong transparency and public-interest pushback",
          label: "Public resistance",
          low: "Weak scrutiny and captured regulation",
          signal: "stronger resistance -> weaker manipulation loop",
        },
      ],
      subtitle: "Why the sale often happens through meaning rather than utility",
      title: "Mini lesson: sell the identity, not just the object",
    },
    readingTime: "10 min",
    realWorldExamples: [
      {
        insight:
          "In 1929 Edward Bernays staged the 'Torches of Freedom' publicity event during New York's Easter Parade for the American Tobacco Company, borrowing women's emancipation imagery to make public smoking feel modern and defiant.",
        outcome:
          "The stunt did not create feminism or the first feminist protest. It showed how a company could appropriate the symbolism of a real social movement to expand a market among women.",
        title: "Bernays, Lucky Strike, and 'Torches of Freedom'",
      },
      {
        insight:
          "De Beers did not invent engagement rings, but its 1947 'A Diamond Is Forever' campaign helped make the diamond ring feel like the natural proof of love, permanence, and seriousness across the mass market.",
        outcome:
          "A purchasable luxury became a cultural expectation. The campaign did not merely sell stones; it reshaped romance, social pressure, and what counted as a 'proper' proposal.",
        title: "De Beers and the manufactured romance norm",
      },
      {
        insight:
          "Corporate-backed anti-litter campaigns such as Keep America Beautiful encouraged people to see waste mainly as the result of irresponsible individuals rather than of disposable packaging systems designed by producers.",
        outcome:
          "The culture of blame shifted toward personal behavior, which softened pressure for stronger regulation of packaging waste and corporate accountability.",
        title: "Keep America Beautiful and the individualization of waste",
      },
      {
        insight:
          "Auto interests in the 1920s did not only lobby for infrastructure. They also helped popularize the term 'jaywalking' and recast streets as places that naturally belonged to fast-moving cars rather than shared public space.",
        outcome:
          "What had once looked like dangerous driving was gradually reframed as improper pedestrian behavior. The culture of the street shifted in favor of car dominance, and that shift later shaped law, planning, and everyday common sense.",
        title: "Motordom, jaywalking, and the remaking of the street",
      },
      {
        insight:
          "BP's 'Beyond Petroleum' branding and promotion of individual carbon-footprint thinking helped present the company as climate-aware while redirecting part of the public conversation toward consumer behavior.",
        outcome:
          "Later research found that green discourse and advertising can reduce reputational damage even when the underlying fossil-fuel business model changes much less than the messaging suggests.",
        title: "BP, green branding, and climate blame-shifting",
      },
      {
        insight:
          "Across tobacco, diamonds, cars, packaging, and fossil fuels, the common move is not just 'buy this.' It is 'be this,' 'love this,' 'feel guilty this way,' or 'see the system through this frame.'",
        outcome:
          "Public opinion is steered not only by arguments and facts, but by meanings that are made to feel natural, moral, aspirational, or inevitable.",
        title: "The wider pattern across industries",
      },
    ],
    relatedFrameworks: [
      "Public relations and propaganda",
      "Agenda setting and framing",
      "Greenwashing and blame-shifting",
      "Identity marketing",
      "Movement co-option",
    ],
    simulationPrompt:
      "Compare two societies: one where commercial actors can freely tie products to identity and public causes, and one with strong transparency rules, youth protections, and publicly trusted counter-messaging.",
    simulatorSlug: "social-movements",
    simpleExplanation: [
      "Marketing is often described as simple persuasion: a company explains what a product does, and consumers decide whether to buy it. In reality, the deepest campaigns do something larger. They attach products to meaning. A cigarette becomes freedom. A car becomes adulthood. A brand becomes self-expression. A purchase becomes membership in a way of life.",
      "That is why the Edward Bernays story matters. Bernays, who was Sigmund Freud's nephew and one of the early architects of public relations, did not organize the first feminist protest. Women had been organizing and protesting for decades. What he did in 1929 was stage a publicity event that borrowed the symbolism of women's emancipation to help normalize smoking in public and open a larger market for cigarettes among women.",
      "The same structure appears far beyond tobacco. De Beers made diamonds feel essential to romance. Anti-litter campaigns made consumers feel mainly responsible for packaging waste. Auto interests helped make car-dominated streets feel natural. Fossil-fuel companies used green branding to soften scrutiny and redirect attention toward individual footprints.",
      "Once a company succeeds at rewriting cultural meaning, the effect is bigger than a single ad campaign. Sales rise, more money flows into publicity and lobbying, and the new norm starts to feel natural. People experience themselves as choosing freely, even when the symbolic environment around the choice has been carefully engineered.",
    ],
    slug: "how-companies-engineer-public-opinion-through-marketing",
    summary:
      "Corporate marketing can do more than sell products: it can borrow movement language, shape norms, and reorganize public opinion by tying consumption to identity and freedom.",
    systemBug: {
      signals: [
        "Commercial campaigns frame products as liberation, belonging, or moral identity rather than as things to evaluate on their merits.",
        "Paid image management becomes hard to distinguish from grassroots sentiment or everyday common sense.",
        "Higher sales feed bigger PR and lobbying budgets, making the narrative harder to challenge once it is normalized.",
      ],
      summary:
        "Actors with large budgets can buy symbolic influence at scale, shaping what feels normal or desirable long before the public has clearly recognized the manipulation.",
      title: "System bug: markets can purchase cultural influence, not just attention",
    },
    title: "How companies engineer public opinion through marketing",
  },
  {
    accent: "amber",
    betterMetrics: [
      {
        description: "Can median earners actually buy or rent secure housing?",
        label: "Affordability",
      },
      {
        description: "Is housing serving shelter first or portfolio growth first?",
        label: "Use value vs asset value",
      },
      {
        description: "How much of the market is driven by speculative investors?",
        label: "Speculative share",
      },
      {
        description: "Are vacancy, short-term conversion, and rent burden rising together?",
        label: "Extraction pressure",
      },
    ],
    betterMetricsTitle: "What a healthy housing system tracks",
    counterArguments: [
      {
        point:
          "Investment can increase supply by financing new construction and maintenance.",
        response:
          "It can. The issue is when policy treats homes mainly as appreciating assets, so capital gain logic outruns shelter logic.",
        title: "Capital can help build homes",
      },
      {
        point:
          "If prices rise, owners feel wealthier and the financial system looks stronger.",
        response:
          "That may help some households, but it can simultaneously lock younger or poorer households out of stable housing and deepen inequality.",
        title: "Asset appreciation has winners",
      },
    ],
    causalLoop: {
      description:
        "Once housing is treated primarily as an asset, rising prices attract more capital, which can further weaken affordability and push politics toward protecting owners.",
      edges: [
        { from: "investor-demand", label: "more capital chasing homes", polarity: "positive", to: "home-prices" },
        { from: "home-prices", label: "expectation of gains", polarity: "positive", to: "financial-story" },
        { bend: 12, from: "financial-story", label: "more investors", polarity: "positive", to: "investor-demand" },
        { from: "home-prices", label: "higher burden", polarity: "negative", to: "affordability" },
        { from: "affordability", label: "greater insecurity", polarity: "negative", to: "housing-stability" },
        { from: "housing-stability", label: "pressure for reform", polarity: "negative", to: "owner-protection-politics" },
        { bend: -14, from: "owner-protection-politics", label: "preserve scarcity", polarity: "positive", to: "home-prices" },
      ],
      loops: [
        "Reinforcing asset loop: expected appreciation attracts more investment, which raises prices and makes the asset story look even stronger.",
        "Political loop: when many balance sheets depend on rising prices, reform that improves affordability becomes harder to pass.",
      ],
      nodes: [
        { id: "investor-demand", label: "Investor demand", tone: "amber", x: 18, y: 18 },
        { id: "home-prices", label: "Home prices", tone: "rose", x: 80, y: 18 },
        { id: "financial-story", label: "Housing as a financial asset", tone: "amber", x: 80, y: 52 },
        { id: "affordability", label: "Affordability", tone: "emerald", x: 18, y: 52 },
        { id: "housing-stability", label: "Housing stability", tone: "emerald", x: 18, y: 84 },
        { id: "owner-protection-politics", label: "Politics that protect price growth", tone: "rose", x: 80, y: 84 },
      ],
      title: "Causal loop: homes become assets first, shelter second",
    },
    difficulty: "Starter",
    discussionPrompt:
      "At what point does treating housing as an investment start breaking its role as a basic social good?",
    eyebrow: "Housing systems",
    heroHighlights: [
      "Housing can be treated as shelter, as an investment vehicle, or both, but the balance matters.",
      "Price growth can make balance sheets look stronger while making daily life less stable.",
      "Financialization often means the market serves capital allocation better than human need.",
    ],
    miniLesson: {
      bands: [
        {
          insight:
            "At lower investor share, housing behaves more like a place to live than a speculative growth machine.",
          threshold: 0,
        },
        {
          insight:
            "As investor participation rises, prices and rent pressure can increase even if construction headlines still look positive.",
          threshold: 35,
        },
        {
          insight:
            "At high investor share, affordability and stability deteriorate quickly because homes are being priced as assets rather than wages can support.",
          threshold: 65,
        },
      ],
      defaultValue: 35,
      description:
        "This toy model illustrates a familiar tension: what boosts the asset value of housing can undermine its affordability and social function.",
      highLabel: "High investor share",
      lowLabel: "Low investor share",
      metrics: [
        {
          base: 18,
          description: "The degree to which prices behave like a speculative asset story.",
          key: "price-pressure",
          label: "Price pressure",
          max: 100,
          min: 0,
          slope: 0.92,
          suffix: "/100",
          tone: "amber",
        },
        {
          base: 95,
          description: "How reachable secure housing remains for ordinary households.",
          key: "affordability",
          label: "Affordability",
          max: 100,
          min: 0,
          slope: -0.86,
          suffix: "/100",
          tone: "emerald",
        },
        {
          base: 8,
          description: "Vacancy, churn, or underused stock driven by asset logic.",
          key: "speculation",
          label: "Speculation load",
          max: 100,
          min: 0,
          slope: 0.8,
          suffix: "/100",
          tone: "rose",
        },
      ],
      prompt: "Move investor share to see how the system reallocates value.",
      sliderLabel: "Investor share of housing purchases",
      step: 1,
      title: "Mini lesson: the asset story can outrun the shelter story",
      unit: "%",
      valueMax: 100,
      valueMin: 0,
    },
    readingTime: "6 min",
    realWorldExamples: [
      {
        insight:
          "The more homes are treated as wealth storage, the more affordability becomes secondary.",
        outcome:
          "In many global cities, housing absorbs capital from abroad and from financial institutions while local incomes lag far behind.",
        title: "Global capital can reprice local life",
      },
      {
        insight:
          "Housing scarcity narratives can hide the role of speculative demand and asset-protection politics.",
        outcome:
          "Even where supply matters, the final price system can still be heavily shaped by tax rules, finance, and investor behavior.",
        title: "Supply is part of the story, not the whole story",
      },
      {
        insight:
          "Short-term yield strategies can turn neighborhoods into revenue machines rather than stable communities.",
        outcome:
          "Short-let conversion, vacancy, and rent extraction can hollow out local belonging even when property values rise.",
        title: "Returns can outrank residency",
      },
    ],
    relatedFrameworks: [
      "Political economy",
      "Housing as asset system",
      "Rent extraction",
      "Urban systems thinking",
    ],
    simulationPrompt:
      "Test a scenario with lower investor share, stronger tenant security, and housing rules that prioritize use value over asset inflation.",
    simulatorSlug: "debt",
    simpleExplanation: [
      "Housing becomes financialized when homes are treated less as places to live and more as assets expected to appreciate, generate yield, or store wealth.",
      "That changes incentives. Rising prices stop looking like a warning sign and start looking like success for owners, lenders, and local revenue systems.",
      "The result can be a housing market where balance sheets improve while ordinary residents face rising rent burden, delayed family formation, and long-term insecurity.",
    ],
    slug: "why-housing-becomes-financialized",
    summary:
      "When homes become investment vehicles first, affordability and security often weaken even as prices and transactions rise.",
    systemBug: {
      signals: [
        "Price growth is celebrated even when it outruns local wages.",
        "Policy increasingly protects homeowners' paper wealth and lenders' stability.",
        "The market allocates homes according to purchasing power and expected return, not human need.",
      ],
      summary:
        "The system rewards housing as an appreciating asset, so affordability becomes a side effect rather than the primary design goal.",
      title: "System bug: shelter is absorbed into portfolio logic",
    },
    title: "Why housing becomes financialized",
  },
  {
    accent: "rose",
    betterMetrics: [
      {
        description: "How much extra cost do firms and citizens pay just to pass through the system?",
        label: "Hidden extraction",
      },
      {
        description: "Do permits, contracts, and services depend on informal payments or connections?",
        label: "Gatekeeping risk",
      },
      {
        description: "How much trust is lost because rules are not applied evenly?",
        label: "Institutional trust",
      },
      {
        description: "How much public capacity gets hollowed out by skimming and fear?",
        label: "Service quality",
      },
    ],
    betterMetricsTitle: "How to spot the hidden tax",
    counterArguments: [
      {
        point:
          "Some petty corruption is just a symptom of low wages or weak state capacity, not the real core problem.",
        response:
          "That is often true, but once informal extraction becomes normal, it acts like a tax on everything else and further weakens the very capacity that could solve it.",
        title: "Corruption can be downstream of other weakness",
      },
      {
        point:
          "Small facilitation payments sometimes make slow systems function at all.",
        response:
          "They may create short-term workarounds, but they also lock in a dual system where access depends on cash, status, or connections instead of equal rights.",
        title: "It can feel like lubrication",
      },
    ],
    causalLoop: {
      description:
        "Corruption behaves like a hidden tax because it raises the effective cost of ordinary action while simultaneously hollowing out trust and service quality.",
      edges: [
        { from: "gatekeeping", label: "more discretion", polarity: "positive", to: "bribe-pressure" },
        { from: "bribe-pressure", label: "higher hidden cost", polarity: "positive", to: "business-cost" },
        { from: "business-cost", label: "worse service and prices", polarity: "negative", to: "public-trust" },
        { from: "public-trust", label: "weaker accountability", polarity: "positive", to: "service-quality" },
        { bend: -12, from: "service-quality", label: "more desperate workarounds", polarity: "negative", to: "gatekeeping" },
        { bend: 12, from: "business-cost", label: "demand for shortcuts", polarity: "positive", to: "gatekeeping" },
      ],
      loops: [
        "Reinforcing loop: more gatekeeping creates more bribery pressure, which raises costs and encourages even more informal shortcuts.",
        "Trust loop: when services feel unfair or predatory, public trust falls, making accountability and reform weaker.",
      ],
      nodes: [
        { id: "gatekeeping", label: "Discretionary gatekeepers", tone: "rose", x: 20, y: 20 },
        { id: "bribe-pressure", label: "Bribe pressure", tone: "amber", x: 80, y: 20 },
        { id: "business-cost", label: "Hidden cost on business and citizens", tone: "amber", x: 80, y: 56 },
        { id: "public-trust", label: "Public trust", tone: "emerald", x: 18, y: 56 },
        { id: "service-quality", label: "Service quality", tone: "cyan", x: 20, y: 84 },
      ],
      title: "Causal loop: extraction gets baked into ordinary life",
    },
    difficulty: "Starter",
    discussionPrompt:
      "Where have you seen corruption function less like a scandal and more like an everyday tax on time, money, or dignity?",
    eyebrow: "Institutional integrity",
    heroHighlights: [
      "Corruption is not only dramatic theft; it is also friction, delay, and unequal access built into everyday systems.",
      "It behaves like a hidden tax because people pay more and receive less.",
      "The cost shows up in prices, fear, lower trust, and weaker public capacity.",
    ],
    miniLesson: {
      bands: [
        {
          insight:
            "Lower gatekeeping discretion reduces the need for side payments and makes the system feel more predictable and equal.",
          threshold: 0,
        },
        {
          insight:
            "As discretion rises, informal payments and delays start to behave like a tax layered on top of formal rules.",
          threshold: 35,
        },
        {
          insight:
            "At high discretion, extraction becomes normal and trust collapses because people expect access to depend on favors or money.",
          threshold: 65,
        },
      ],
      defaultValue: 30,
      description:
        "This mini lesson frames corruption as a system cost, not only a moral problem. It quietly raises prices, delays, and uncertainty across the whole economy.",
      highLabel: "High gatekeeping discretion",
      lowLabel: "Low gatekeeping discretion",
      metrics: [
        {
          base: 10,
          description: "How likely people are to meet bribe requests or informal tolls.",
          key: "bribes",
          label: "Bribe pressure",
          max: 100,
          min: 0,
          slope: 0.95,
          suffix: "/100",
          tone: "rose",
        },
        {
          base: 14,
          description: "Extra cost layered onto permits, services, and market activity.",
          key: "cost",
          label: "Hidden tax load",
          max: 100,
          min: 0,
          slope: 0.82,
          suffix: "/100",
          tone: "amber",
        },
        {
          base: 96,
          description: "The sense that institutions work the same way for everyone.",
          key: "trust",
          label: "Institutional trust",
          max: 100,
          min: 0,
          slope: -0.84,
          suffix: "/100",
          tone: "emerald",
        },
      ],
      prompt: "Move the discretion slider to see how everyday extraction spreads.",
      sliderLabel: "Discretionary gatekeeping",
      step: 1,
      title: "Mini lesson: informal extraction is still extraction",
      unit: "%",
      valueMax: 100,
      valueMin: 0,
    },
    readingTime: "6 min",
    realWorldExamples: [
      {
        insight:
          "The cost is not just the payment itself; it is also uncertainty, delay, and the chilling effect on people who cannot pay.",
        outcome:
          "Permits, inspections, customs, and licensing can all become points of hidden extraction.",
        title: "Routine bureaucracy can become tollbooth governance",
      },
      {
        insight:
          "Public money lost to skimming does double damage: the budget shrinks and trust in public service collapses.",
        outcome:
          "Procurement corruption often leaves citizens paying more for worse infrastructure or worse care.",
        title: "Procurement drains capacity",
      },
      {
        insight:
          "When corruption becomes expected, honest actors start behaving defensively too.",
        outcome:
          "People invest in connections, favors, or bribes instead of productive effort, which drags the whole system down.",
        title: "Incentives shift away from productive work",
      },
    ],
    evidenceLinks: [owidEvidenceLinks.corruption, owidEvidenceLinks.stateCapacity, owidEvidenceLinks.taxation],
    relatedFrameworks: [
      "Institutional economics",
      "Hidden tax framing",
      "State capacity",
      "Causal loop mapping",
    ],
    simulationPrompt:
      "Test a scenario with fewer discretionary chokepoints, stronger transparency, and better frontline wages and enforcement.",
    simulatorSlug: "purchasing-power",
    simpleExplanation: [
      "Corruption is often described as theft, but systemically it behaves more like a hidden tax. It raises the cost of getting basic things done while lowering the quality and fairness of what people receive.",
      "A bribe, a gatekeeper's favor, or a politically connected shortcut all mean the rules are no longer equal. That weakens trust and encourages everyone else to play defensively too.",
      "The result is an economy and a public sphere with more friction, more fear, and lower state capacity than the formal budget or tax code would suggest.",
    ],
    slug: "how-corruption-behaves-like-a-hidden-tax",
    summary:
      "Corruption quietly increases costs, delays, and uncertainty across the system, much like an unofficial tax that buys worse outcomes.",
    systemBug: {
      signals: [
        "People pay extra in time, cash, or connections just to access formal rights or services.",
        "Service quality falls because money and attention are diverted away from the public mission.",
        "Trust collapses because people assume equal rules do not really exist.",
      ],
      summary:
        "The system creates chokepoints where private extraction becomes possible, and that extraction spreads through prices, delays, and lost trust.",
      title: "System bug: informal tollbooths appear inside formal institutions",
    },
    title: "How corruption behaves like a hidden tax",
  },

  // ─── Module 7: How banks create money ────────────────────────────────────────
  {
    accent: "emerald",
    betterMetrics: [
      { description: "How much of newly created money reaches wages, services, and productive investment.", label: "Credit directionality" },
      { description: "The ratio of speculative asset lending vs. real-economy lending.", label: "Productive lending ratio" },
      { description: "Whether monetary expansion reduces or increases wealth concentration.", label: "Distributional effect of money creation" },
      { description: "How exposed ordinary savers are to bank failure given current reserve ratios.", label: "Depositor risk exposure" },
    ],
    betterMetricsTitle: "Measure these alongside money supply growth",
    counterArguments: [
      {
        point: "Fractional reserve banking enabled unprecedented investment and rising living standards over two centuries.",
        response: "True. The question is not whether credit creation can fund growth, but who decides where new money flows and who carries the risk when it goes wrong.",
        title: "Credit creation funded the modern economy",
      },
      {
        point: "Central banks and regulators apply capital ratios and stress tests to prevent instability.",
        response: "Regulation is real, but it has consistently lagged financial innovation — as 2008 demonstrated.",
        title: "Regulation keeps the system safe",
      },
      {
        point: "If banks could not create money through lending, credit would be scarcer and investment would slow.",
        response: "Scarcity is one constraint. The current design also creates the opposite problem: credit is abundant for asset speculation and scarce for people without collateral.",
        title: "The alternative would restrict credit too much",
      },
    ],
    causalLoop: {
      description: "Banks create money by issuing loans. More loans expand the money supply, raise asset prices, which raise collateral values and enable more lending — a self-reinforcing loop.",
      edges: [
        { from: "bank_loan", label: "creates", polarity: "positive", to: "new_deposit" },
        { from: "new_deposit", label: "expands", polarity: "positive", to: "money_supply" },
        { from: "money_supply", label: "inflates", polarity: "positive", to: "asset_prices" },
        { from: "asset_prices", label: "raises", polarity: "positive", to: "collateral_value" },
        { from: "collateral_value", label: "enables more", polarity: "positive", to: "bank_loan" },
        { from: "money_supply", label: "triggers", polarity: "positive", to: "inflation" },
        { from: "inflation", label: "erodes", polarity: "negative", to: "real_wages" },
      ],
      loops: [
        "Reinforcing: loan → deposit → money supply → asset prices → collateral → more loans",
        "Balancing (weak): inflation → central bank rate rise → reduced lending",
      ],
      nodes: [
        { id: "bank_loan", label: "Bank loan issued", tone: "emerald", x: 60, y: 180 },
        { id: "new_deposit", label: "New deposit created", tone: "emerald", x: 220, y: 80 },
        { id: "money_supply", label: "Money supply", tone: "cyan", x: 400, y: 80 },
        { id: "asset_prices", label: "Asset prices", tone: "amber", x: 560, y: 180 },
        { id: "collateral_value", label: "Collateral value", tone: "amber", x: 400, y: 300 },
        { id: "inflation", label: "Inflation", tone: "rose", x: 220, y: 300 },
        { id: "real_wages", label: "Real wages", tone: "rose", x: 60, y: 300 },
      ],
      title: "The money creation loop",
    },
    difficulty: "Intermediate",
    discussionPrompt: "Should the power to create money be a public utility, a regulated private function, or something else? Who should decide where new money flows?",
    eyebrow: "Financial system",
    heroHighlights: [
      "Commercial banks create around 97% of the money in circulation through lending — not central banks printing notes.",
      "New money is created as a matching loan and deposit entry; it is an accounting act, not a transfer of existing funds.",
      "This means the direction of credit determines what gets built, who gets rich, and what stays scarce.",
    ],
    miniLesson: {
      bands: [
        { insight: "Almost all lending targets real economy: wages, production, small business, public investment.", threshold: 20 },
        { insight: "Mixed picture: some asset lending but productive credit still dominant.", threshold: 45 },
        { insight: "Asset lending dominant: most new money enters housing, equities, and financial instruments.", threshold: 70 },
        { insight: "Financialization peak: banking primarily recycles wealth among asset holders.", threshold: 90 },
      ],
      defaultValue: 65,
      description: "Drag to shift the share of new bank lending going to financial assets vs. productive real-economy investment.",
      highLabel: "Asset speculation dominates",
      lowLabel: "Productive economy dominates",
      metrics: [
        { base: 8, description: "Annual increase in house prices, equities, and financial instruments.", key: "asset_inflation", label: "Asset price inflation", max: 100, min: 0, slope: 0.55, suffix: "%", tone: "rose" },
        { base: 72, description: "Wage growth relative to productivity gains.", key: "wage_share", label: "Wage share of growth", max: 100, min: 0, slope: -0.48, suffix: "%", tone: "emerald" },
        { base: 55, description: "Ability of median household to access credit for productive purposes.", key: "credit_access", label: "Productive credit access", max: 100, min: 0, slope: -0.42, suffix: "/100", tone: "cyan" },
      ],
      prompt: "Adjust the share of lending going to financial assets to see how it reshapes wages, asset prices, and credit access.",
      sliderLabel: "Share of new lending to financial assets",
      step: 1,
      title: "Mini lesson: where money goes when banks create it",
      unit: "%",
      valueMax: 100,
      valueMin: 0,
    },
    readingTime: "7 min",
    realWorldExamples: [
      {
        insight: "The bailouts confirmed that in a bank-run money creation system, systemic risk is privately held but socialized in a crisis.",
        outcome: "Banks received trillion-dollar guarantees while mortgage holders faced foreclosure.",
        title: "2008: the asymmetry of money creation risk",
      },
      {
        insight: "QE fed new money primarily into financial markets — it was transmitted to the wealthy faster than to wages or services.",
        outcome: "Asset prices recovered quickly after 2008 and 2020; real wage growth lagged for years.",
        title: "QE and the distributional gap",
      },
      {
        insight: "When mortgage credit was freely created for housing speculation, affordability collapsed even as supply remained roughly constant.",
        outcome: "Cities like London, Sydney, and Vancouver saw housing become a financial instrument rather than shelter.",
        title: "Housing markets as credit-creation experiments",
      },
    ],
    relatedFrameworks: [
      "Endogenous money theory",
      "Positive Money reform proposals",
      "Minsky financial instability hypothesis",
      "Modern Monetary Theory",
    ],
    simulationPrompt: "Adjust reserve ratios, lending direction rules, and central bank mandate to see how credit directionality affects wages, asset prices, and stability.",
    simulatorSlug: "purchasing-power",
    simpleExplanation: [
      "Most people assume money is printed by governments or held in vaults before being lent. The reality is different: commercial banks create the vast majority of money in circulation simply by issuing loans. When a bank approves a mortgage, it does not move existing deposits — it creates a new deposit and a matching debt simultaneously.",
      "This means private banks, driven by profit, decide where new money flows. Because lending against existing assets is less risky than funding new production, credit tends to flow toward housing and financial instruments rather than wages, services, or innovation.",
      "The result is a self-reinforcing cycle: more credit raises asset prices, which raises collateral values, which enables more credit — until something breaks. The gains accrue primarily to asset holders; the instability is shared by everyone.",
    ],
    slug: "how-banks-create-money",
    summary: "Commercial banks create most of the money supply through lending, which means private credit decisions quietly shape the entire economy.",
    systemBug: {
      signals: [
        "Asset prices rise much faster than wages over multi-decade periods.",
        "Credit is abundant for asset-backed speculation but scarce for unproductive or uncollateralized borrowers.",
        "Financial crises are followed by public rescues that restore asset prices faster than living standards.",
      ],
      summary: "The power to create money is held by private institutions optimizing for profit, so new money systematically flows toward existing wealth rather than broad economic capacity.",
      title: "System bug: private money creation amplifies inequality by design",
    },
    title: "How banks create money",
  },

  // ─── Module 8: Tax havens ─────────────────────────────────────────────────────
  {
    accent: "rose",
    betterMetrics: [
      { description: "The share of corporate profits reported in jurisdictions with near-zero effective tax rates.", label: "Profit shifting ratio" },
      { description: "Lost public revenue as a share of health, education, and infrastructure spending.", label: "Revenue gap vs. public services" },
      { description: "The share of ultra-high-net-worth wealth held in offshore structures.", label: "Offshore wealth share" },
      { description: "Number of treaty pathways available to route income through zero-tax jurisdictions.", label: "Treaty shopping routes" },
    ],
    betterMetricsTitle: "Measure these alongside the headline corporate tax rate",
    counterArguments: [
      {
        point: "Tax competition between countries is healthy — it pressures governments to be efficient and not over-tax productive activity.",
        response: "Tax competition theory assumes countries compete on public goods quality. Offshore havens offer regulatory secrecy, not services — they extract from the competition rather than participating in it.",
        title: "Tax competition keeps governments efficient",
      },
      {
        point: "Multinationals provide jobs, investment, and technology transfer that benefit host countries.",
        response: "True. But a company that employs thousands in a country should also pay taxes there, not route all profits to a subsidiary with one employee in a no-tax jurisdiction.",
        title: "Multinationals bring real economic benefits",
      },
      {
        point: "Wealthy individuals have a right to arrange their affairs legally within the existing rules.",
        response: "Legal and fair are different things. The rules themselves were shaped by the same interests that benefit most from them.",
        title: "Legal tax planning is a right",
      },
    ],
    causalLoop: {
      description: "Profits shift to low-tax jurisdictions through transfer pricing and IP licensing, reducing effective tax rates and public revenue while reinforcing the political influence of those who benefit.",
      edges: [
        { from: "profit_shifting", label: "reduces", polarity: "negative", to: "effective_tax" },
        { from: "effective_tax", label: "shrinks", polarity: "negative", to: "public_revenue" },
        { from: "public_revenue", label: "cuts", polarity: "negative", to: "public_services" },
        { from: "profit_shifting", label: "concentrates", polarity: "positive", to: "corporate_profit" },
        { from: "corporate_profit", label: "funds", polarity: "positive", to: "political_lobbying" },
        { from: "political_lobbying", label: "protects", polarity: "positive", to: "tax_rules" },
        { from: "tax_rules", label: "enables", polarity: "positive", to: "profit_shifting" },
      ],
      loops: [
        "Reinforcing: profit shifting → higher retained profit → more lobbying → rules preserved → more shifting",
        "Balancing: public pressure → international reform → closing specific loopholes",
      ],
      nodes: [
        { id: "profit_shifting", label: "Profit shifting", tone: "rose", x: 80, y: 160 },
        { id: "effective_tax", label: "Effective tax rate", tone: "amber", x: 280, y: 60 },
        { id: "public_revenue", label: "Public revenue", tone: "cyan", x: 460, y: 60 },
        { id: "public_services", label: "Public services", tone: "cyan", x: 560, y: 200 },
        { id: "corporate_profit", label: "Retained profit", tone: "emerald", x: 80, y: 300 },
        { id: "political_lobbying", label: "Political lobbying", tone: "rose", x: 280, y: 340 },
        { id: "tax_rules", label: "Tax treaty rules", tone: "amber", x: 460, y: 280 },
      ],
      title: "The profit-shifting loop",
    },
    difficulty: "Intermediate",
    discussionPrompt: "Is the offshore system a natural result of sovereign competition or an engineered architecture of extraction? Who is responsible for closing it?",
    eyebrow: "Financial system",
    heroHighlights: [
      "An estimated $600bn–$1tn in corporate profits are shifted to low-tax jurisdictions every year.",
      "The mechanism is legal: subsidiaries, IP licenses, and intra-company loans allow profits to appear wherever tax is lowest.",
      "Around 10% of global private wealth — roughly $8–12tn — is held offshore, often invisibly.",
    ],
    miniLesson: {
      bands: [
        { insight: "Tax rules are tight and enforced. Effective rates roughly match statutory rates.", threshold: 15 },
        { insight: "Transfer pricing and IP arrangements enable some shifting. Effective rates begin to diverge.", threshold: 40 },
        { insight: "Large multinationals report most global profit in near-zero-rate jurisdictions.", threshold: 70 },
        { insight: "Havens dominant. Public revenue depends on non-mobile taxes like wages and consumption.", threshold: 90 },
      ],
      defaultValue: 60,
      description: "Adjust how permissive the international profit-shifting regime is to see its effect on public revenue and inequality.",
      highLabel: "Fully permissive shifting",
      lowLabel: "Fully restricted shifting",
      metrics: [
        { base: 88, description: "Corporate tax collected as a share of what the statutory rate implies.", key: "tax_collection", label: "Effective tax yield", max: 100, min: 0, slope: -0.62, suffix: "%", tone: "emerald" },
        { base: 28, description: "Post-corporate-tax wealth inequality measure.", key: "inequality", label: "Post-tax inequality", max: 100, min: 0, slope: 0.51, suffix: "/100", tone: "rose" },
        { base: 82, description: "Public infrastructure and services funded relative to political commitments.", key: "services", label: "Public service funding", max: 100, min: 0, slope: -0.45, suffix: "%", tone: "cyan" },
      ],
      prompt: "Move the slider to see how profit-shifting permissiveness drives the gap between statutory and effective tax rates.",
      sliderLabel: "Profit-shifting permissiveness",
      step: 1,
      title: "Mini lesson: the gap between tax rate and tax paid",
      unit: "%",
      valueMax: 100,
      valueMin: 0,
    },
    readingTime: "8 min",
    realWorldExamples: [
      {
        insight: "The route is legal: a US company licenses IP to an Irish subsidiary, which licenses to a Dutch holding company, which routes to Bermuda. Each step has a treaty justification.",
        outcome: "Tech companies reported effective global tax rates below 5% on billions in profit while trading in markets that provided educated workers and legal infrastructure.",
        title: "The Double Irish and Dutch Sandwich",
      },
      {
        insight: "Secrecy jurisdictions allow asset hiding, sanctions evasion, and corruption concealment alongside legitimate tax planning.",
        outcome: "Panama Papers and Pandora Papers revealed heads of state, oligarchs, and criminal networks using the same legal infrastructure as corporate tax planners.",
        title: "The Panama and Pandora Papers",
      },
      {
        insight: "When corporate tax revenue drops, states face a choice: cut services, raise taxes on less mobile income, or borrow.",
        outcome: "The tax mix in most high-income countries has shifted toward consumption and labor taxes as capital has become easier to shift.",
        title: "The tax burden shifts to wages",
      },
    ],
    relatedFrameworks: [
      "Transfer pricing rules",
      "OECD BEPS framework",
      "Global minimum tax (Pillar Two)",
      "Beneficial ownership registries",
    ],
    simulationPrompt: "Model the effect of a universal beneficial ownership registry plus a global minimum effective rate on public revenues, inequality, and cross-border investment flows.",
    simulatorSlug: "wealth-gap",
    simpleExplanation: [
      "Tax havens are not just small islands — they are an integrated system of legal rules, treaties, and corporate structures that allow large corporations and wealthy individuals to report income where taxes are lowest, regardless of where business actually happens.",
      "The main tools are transfer pricing (artificially high or low prices between subsidiaries to move profit), IP licensing (holding patents in no-tax jurisdictions and charging royalties everywhere else), and holding company structures that let dividends pass through untaxed.",
      "The result is a two-tier system: ordinary workers and small businesses pay the statutory rate; large corporations pay a fraction of it. The gap is filled by cutting services or shifting the burden to wages and consumption.",
    ],
    slug: "how-tax-havens-drain-public-revenue",
    summary: "Tax havens are a legally engineered system that lets corporations and wealthy individuals separate where profit is made from where it is taxed.",
    systemBug: {
      signals: [
        "Large profitable multinationals report near-zero effective tax rates in countries where they employ thousands.",
        "Public revenues stagnate while corporate profits reach historic highs.",
        "States compete to offer lower rates and more secrecy rather than better public goods.",
      ],
      summary: "The international tax system was built before capital became fully mobile and has not been redesigned to prevent legal profit extraction from the jurisdictions that generate it.",
      title: "System bug: profits earned everywhere, taxed nowhere",
    },
    title: "How tax havens drain public revenue",
  },

  // ─── Module 9: Wealth compounding ────────────────────────────────────────────
  {
    accent: "amber",
    betterMetrics: [
      { description: "The ratio of annual capital income returns to median wage growth over the same period.", label: "Return on capital vs. wage growth" },
      { description: "Share of total new wealth each year captured by the top 1% vs. the bottom 50%.", label: "Wealth capture by decile" },
      { description: "How many generations it takes for a low-wealth household to reach median wealth.", label: "Intergenerational mobility lag" },
      { description: "Share of capital income reinvested vs. consumed, shaping future compounding speed.", label: "Reinvestment rate of capital returns" },
    ],
    betterMetricsTitle: "Measure these alongside headline growth and unemployment",
    counterArguments: [
      {
        point: "High returns on capital incentivize saving, investment, and risk-taking, which benefits everyone through job creation.",
        response: "Investment and risk-taking matter. But when returns consistently exceed broad growth, the primary effect is wealth concentration — not proportional innovation.",
        title: "Capital returns reward risk and fuel growth",
      },
      {
        point: "Estate taxes, inheritance taxes, and progressive income taxes already redistribute accumulated wealth.",
        response: "They do, but capital income is taxed at lower rates than labor income in most countries, and estate tax thresholds exempt most large transfers.",
        title: "Redistribution already addresses this",
      },
      {
        point: "Entrepreneurship and innovation are the primary sources of large fortunes — they reflect value creation.",
        response: "The initial creation is real. But once capital is large enough to compound at market returns, further growth no longer requires the original entrepreneur's effort.",
        title: "Large fortunes are earned through innovation",
      },
    ],
    causalLoop: {
      description: "When the return on capital (r) exceeds economic growth (g), existing wealth grows faster than new wealth is created. Capital holders capture a rising share of total income, reinvest it, and compound the gap.",
      edges: [
        { from: "capital_stock", label: "generates", polarity: "positive", to: "capital_income" },
        { from: "capital_income", label: "reinvested as", polarity: "positive", to: "capital_stock" },
        { from: "capital_stock", label: "grows faster than", polarity: "positive", to: "wealth_gap" },
        { from: "wealth_gap", label: "reduces", polarity: "negative", to: "wage_bargaining" },
        { from: "wage_bargaining", label: "constrains", polarity: "negative", to: "labor_share" },
        { from: "labor_share", label: "increases relative", polarity: "positive", to: "wealth_gap" },
        { from: "capital_income", label: "funds", polarity: "positive", to: "political_influence" },
        { from: "political_influence", label: "maintains low", polarity: "negative", to: "capital_tax_rate" },
      ],
      loops: [
        "Reinforcing: capital stock → income → reinvestment → larger capital stock → larger income share",
        "Balancing (partial): wage growth reduces gap when labor markets are tight and unions are strong",
      ],
      nodes: [
        { id: "capital_stock", label: "Capital stock", tone: "amber", x: 80, y: 160 },
        { id: "capital_income", label: "Capital income", tone: "amber", x: 280, y: 80 },
        { id: "wealth_gap", label: "Wealth gap", tone: "rose", x: 500, y: 160 },
        { id: "wage_bargaining", label: "Wage bargaining power", tone: "cyan", x: 500, y: 300 },
        { id: "labor_share", label: "Labor share of income", tone: "cyan", x: 280, y: 340 },
        { id: "political_influence", label: "Political influence", tone: "rose", x: 80, y: 300 },
        { id: "capital_tax_rate", label: "Capital tax rate", tone: "emerald", x: 80, y: 80 },
      ],
      title: "The r > g compounding loop",
    },
    difficulty: "Intermediate",
    discussionPrompt: "If capital consistently outgrows wages by design, is the solution higher capital taxes, stronger unions, different ownership models, or something structural not yet tried at scale?",
    eyebrow: "Economic system",
    heroHighlights: [
      "Thomas Piketty documented that the return on capital has exceeded overall economic growth in most years across two centuries.",
      "Capital income (dividends, rents, interest) is taxed at lower rates than labor income in most OECD countries.",
      "The top 1% hold more wealth than the bottom 50% combined in every major economy.",
    ],
    miniLesson: {
      bands: [
        { insight: "Returns roughly match growth. Wealth distribution remains relatively stable across generations.", threshold: 20 },
        { insight: "Capital slightly outpaces growth. The gap widens slowly but compounds over decades.", threshold: 40 },
        { insight: "Capital return meaningfully exceeds growth. Concentration accelerates. Wages lose share.", threshold: 65 },
        { insight: "Strong r > g. Top decile captures most new wealth annually. Labor share collapses.", threshold: 85 },
      ],
      defaultValue: 58,
      description: "Drag to adjust the gap between return on capital and economic growth rate.",
      highLabel: "r >> g (fast compounding)",
      lowLabel: "r ≈ g (balanced)",
      metrics: [
        { base: 48, description: "Share of total annual income growth captured by the top 10% of wealth holders.", key: "wealth_capture", label: "Wealth captured by top 10%", max: 100, min: 0, slope: 0.46, suffix: "%", tone: "rose" },
        { base: 58, description: "Wages as a share of total national income.", key: "labor_share", label: "Labor income share", max: 100, min: 0, slope: -0.38, suffix: "%", tone: "cyan" },
        { base: 35, description: "Index of how easy it is for median-wealth households to improve their relative position.", key: "mobility", label: "Upward mobility index", max: 100, min: 0, slope: -0.42, suffix: "/100", tone: "emerald" },
      ],
      prompt: "Increase the r > g gap to see how faster compounding affects wage share, wealth capture, and mobility.",
      sliderLabel: "r minus g gap (return over growth)",
      step: 1,
      title: "Mini lesson: the compound interest of inherited advantage",
      unit: "%",
      valueMax: 100,
      valueMin: 0,
    },
    readingTime: "7 min",
    realWorldExamples: [
      {
        insight: "The divergence began in the late 1970s. The mechanism is not primarily entrepreneurship but the compounding of existing assets.",
        outcome: "US wealth inequality returned to pre-Depression levels by the 2010s, driven by rising capital incomes and declining top marginal tax rates.",
        title: "US wealth concentration since the 1970s",
      },
      {
        insight: "The fall in top marginal rates was followed, with a lag, by a sustained rise in capital income share of total income.",
        outcome: "The effective tax rate on the top 400 US earners fell from over 50% in 1960 to under 25% by 2018.",
        title: "Top marginal tax cuts and the capital income surge",
      },
      {
        insight: "Inheritance is one of the fastest-growing sources of wealth in high-income countries, reversing 20th-century trends toward earned wealth.",
        outcome: "In France, inherited wealth now represents around 60% of total private wealth accumulation — a ratio not seen since the 19th century.",
        title: "The return of inherited wealth",
      },
    ],
    evidenceLinks: [
      owidEvidenceLinks.economicInequality,
      owidEvidenceLinks.workingHours,
      owidEvidenceLinks.workEmployment,
    ],
    relatedFrameworks: [
      "Piketty r > g framework",
      "Labor share analysis",
      "Kalecki profit equations",
      "Wealth tax design",
    ],
    simulationPrompt: "Adjust capital tax rates, union density, and inheritance rules to find the combination where the wealth gap stabilizes or reverses.",
    simulatorSlug: "wealth-gap",
    simpleExplanation: [
      "The core dynamic is simple: if the return on existing wealth is consistently higher than the overall growth rate of the economy, those who already have wealth will capture a rising share of total income every year, purely through ownership.",
      "The gap compounds. A 4% annual return on a large asset base, reinvested year after year, grows much faster than a 2% wage increase. Over decades this produces extreme concentration — not because wealthy people work harder, but because the accounting structure of capital income rewards scale.",
      "The political economy reinforces the cycle: capital income is taxed at lower rates than wages in most countries, and the owners of large capital have the most resources to shape the rules that govern it.",
    ],
    slug: "how-wealth-compounds-faster-than-wages",
    summary: "When the return on capital consistently exceeds economic growth, existing wealth compounds faster than wages rise, structurally widening inequality over time.",
    systemBug: {
      signals: [
        "Capital income grows faster than wages across multi-decade periods in most high-income economies.",
        "Effective tax rates on capital income are lower than on labor income.",
        "Inherited wealth accounts for an increasing share of large fortunes.",
      ],
      summary: "The rules of the system tax capital gains less than wages and allow reinvestment to compound without significant friction, so the gap between capital holders and wage earners widens as a mathematical consequence of the design.",
      title: "System bug: capital compounds by design while wages are structurally constrained",
    },
    title: "How wealth compounds faster than wages",
  },

  // ─── Module 10: Electoral system design ──────────────────────────────────────
  {
    accent: "cyan",
    betterMetrics: [
      { description: "The share of votes that translate into no seat or no influence on election outcome.", label: "Wasted vote percentage" },
      { description: "The gap between a party's vote share and its seat share in the legislature.", label: "Proportionality gap" },
      { description: "How far district boundaries systematically favor one party over another.", label: "Gerrymandering index" },
      { description: "Voter turnout across different income and education levels.", label: "Turnout inequality" },
    ],
    betterMetricsTitle: "Measure these alongside voter turnout and seat counts",
    counterArguments: [
      {
        point: "First-past-the-post systems produce strong, stable governments with clear majorities and direct constituency links.",
        response: "Stability matters, but a government elected on 35% of the vote while 65% voted for others tests the meaning of democratic mandate.",
        title: "Strong governments need clear majorities",
      },
      {
        point: "Proportional systems produce fragmented legislatures and endless coalition negotiations that slow decision-making.",
        response: "Coalition governance has trade-offs, but it also produces broader representation and prevents minority rule. Nordic countries demonstrate proportional systems can be both stable and legitimate.",
        title: "Proportional systems create instability",
      },
      {
        point: "Electoral system design is a sovereign choice with legitimate defenders on all sides.",
        response: "True. But when rules persistently produce outcomes where a minority of votes produces a majority of power, the trade-off should at minimum be transparent.",
        title: "System design is a legitimate sovereign choice",
      },
    ],
    causalLoop: {
      description: "Winner-take-all rules allow parties to win disproportionate power with minority vote shares. That power controls boundary drawing and campaign finance rules that reinforce the advantage.",
      edges: [
        { from: "electoral_rules", label: "produce", polarity: "positive", to: "seat_distortion" },
        { from: "seat_distortion", label: "grants", polarity: "positive", to: "governing_power" },
        { from: "governing_power", label: "controls", polarity: "positive", to: "boundary_drawing" },
        { from: "boundary_drawing", label: "amplifies", polarity: "positive", to: "seat_distortion" },
        { from: "governing_power", label: "sets", polarity: "positive", to: "campaign_finance_rules" },
        { from: "campaign_finance_rules", label: "advantages", polarity: "positive", to: "incumbents" },
        { from: "incumbents", label: "defend", polarity: "positive", to: "electoral_rules" },
      ],
      loops: [
        "Reinforcing: seat distortion → governing power → boundary control → more distortion",
        "Balancing: voter mobilization, independent redistricting commissions, electoral reform campaigns",
      ],
      nodes: [
        { id: "electoral_rules", label: "Electoral rules", tone: "cyan", x: 80, y: 200 },
        { id: "seat_distortion", label: "Seat distortion", tone: "rose", x: 260, y: 100 },
        { id: "governing_power", label: "Governing power", tone: "amber", x: 460, y: 100 },
        { id: "boundary_drawing", label: "Boundary drawing", tone: "rose", x: 460, y: 300 },
        { id: "campaign_finance_rules", label: "Campaign finance rules", tone: "amber", x: 280, y: 340 },
        { id: "incumbents", label: "Incumbent advantage", tone: "amber", x: 80, y: 340 },
      ],
      title: "The electoral self-reinforcement loop",
    },
    difficulty: "Beginner",
    discussionPrompt: "Should democracies optimize for strong decisive governments or proportional representation of all voters? Can those goals coexist?",
    eyebrow: "Political system",
    heroHighlights: [
      "In first-past-the-post systems, a party can win a parliamentary majority with under 40% of the popular vote.",
      "Gerrymandering can reliably deliver 60% of seats to a party with 50% of the votes.",
      "Campaign finance rules in most democracies systematically advantage incumbents over challengers.",
    ],
    miniLesson: {
      bands: [
        { insight: "Highly proportional system. Vote share closely matches seat share. Coalitions are necessary; representation is broad.", threshold: 25 },
        { insight: "Mixed system. Some distortion, but multiple parties maintain real influence.", threshold: 50 },
        { insight: "Significant distortion. Winning party consistently gets more seats than votes warrant.", threshold: 72 },
        { insight: "Winner-take-all maximum. Minority rule is common. Large vote blocs are systematically unrepresented.", threshold: 90 },
      ],
      defaultValue: 65,
      description: "Adjust the distortion level — how far seat share can diverge from vote share under the system's rules.",
      highLabel: "Maximum winner bonus",
      lowLabel: "Fully proportional",
      metrics: [
        { base: 5, description: "How often a party wins a parliamentary majority with under 50% of votes.", key: "minority_rule", label: "Minority-vote majorities", max: 100, min: 0, slope: 0.72, suffix: "%", tone: "rose" },
        { base: 85, description: "The share of voters whose ballot materially influences the final composition of government.", key: "effective_votes", label: "Effective vote share", max: 100, min: 0, slope: -0.58, suffix: "%", tone: "cyan" },
        { base: 42, description: "Voter turnout in lower-income and younger age groups relative to the overall average.", key: "turnout_gap", label: "Turnout equality", max: 100, min: 0, slope: -0.35, suffix: "/100", tone: "emerald" },
      ],
      prompt: "Adjust electoral distortion to see how voter representation and turnout equity shift.",
      sliderLabel: "Electoral system distortion",
      step: 1,
      title: "Mini lesson: votes cast vs. votes that count",
      unit: "%",
      valueMax: 100,
      valueMin: 0,
    },
    readingTime: "6 min",
    realWorldExamples: [
      {
        insight: "Both the 2000 and 2016 US presidential elections were won by candidates who received fewer total votes — a direct result of the Electoral College's winner-take-all state allocation.",
        outcome: "The US Electoral College creates a system where swing-state votes determine the presidency while voters in safe states are effectively non-participants.",
        title: "Electoral College and popular vote divergence",
      },
      {
        insight: "In 2019, the UK Conservative Party won 56% of seats with 44% of the vote. The Brexit Party won 2% of seats with a similar vote share to the SNP, which won 7%.",
        outcome: "First-past-the-post consistently converts vote share into wildly unequal seat shares depending on geographic concentration.",
        title: "UK general election and geographic vote weighting",
      },
      {
        insight: "After the 2010 US Census, Republican-controlled states redrew district maps to pack Democrats into fewer districts.",
        outcome: "In North Carolina, Republicans won 10 of 13 congressional seats in 2012 despite winning only 49% of the congressional vote.",
        title: "Gerrymandering after the 2010 Census",
      },
    ],
    evidenceLinks: [owidEvidenceLinks.democracy],
    relatedFrameworks: [
      "Duverger's Law",
      "Proportional representation models",
      "Ranked-choice voting",
      "Independent redistricting commissions",
    ],
    simulationPrompt: "Compare winner-take-all, proportional, and ranked-choice systems across different vote distributions to see how the translation of votes to power changes.",
    simpleExplanation: [
      "Electoral systems are not neutral plumbing. The rules that translate votes into seats determine who governs, by how much, and which voters are effectively represented. Winner-take-all systems routinely produce majority governments from minority vote shares.",
      "The distortion is self-reinforcing: the party that wins power controls redistricting, sets campaign finance rules, and determines voter access legislation — all of which influence the next election.",
      "Reforming an electoral system is hardest for exactly those most likely to benefit from reform: challengers and voters whose preferences are geographically dispersed.",
    ],
    slug: "how-electoral-rules-shape-political-power",
    summary: "Electoral system design determines how votes translate into representation — and the rules are maintained by those who benefit most from the current design.",
    systemBug: {
      signals: [
        "Parties regularly win legislative majorities with under 50% of the popular vote.",
        "Electoral boundaries are drawn by the parties most interested in a favorable outcome.",
        "Campaign finance advantages compound incumbency, making seat turnover rare.",
      ],
      summary: "The rules that convert votes to power were designed in earlier eras and are maintained by those who benefit from them, creating structural barriers to the representation of new majorities.",
      title: "System bug: the rules that count votes are made by the people who win under those rules",
    },
    title: "How electoral rules shape political power",
  },

  // ─── Module 11: Surveillance capitalism ──────────────────────────────────────
  {
    accent: "rose",
    betterMetrics: [
      { description: "How much of each person's online activity is tracked, stored, and monetized without meaningful consent.", label: "Behavioral data extraction rate" },
      { description: "The share of digital infrastructure revenue derived from behavioral prediction products.", label: "Prediction product revenue share" },
      { description: "Whether individuals can meaningfully opt out without losing access to essential services.", label: "Exit cost from surveillance systems" },
      { description: "Correlation between algorithmic amplification scores and emotional arousal content.", label: "Outrage amplification coefficient" },
    ],
    betterMetricsTitle: "Measure these alongside platform engagement and ad revenue",
    counterArguments: [
      {
        point: "Personalization improves user experience — people see content and products more relevant to them.",
        response: "Relevance and manipulation are not the same thing. Behavioral prediction systems optimize for engagement, not for user satisfaction or accuracy.",
        title: "Personalization benefits users",
      },
      {
        point: "Users consent to data collection through terms of service and can choose not to use platforms.",
        response: "Consent through a 10,000-word legal document, accepted under social and professional pressure, is not meaningful informed consent.",
        title: "Users consent freely",
      },
      {
        point: "The data economy produced enormous value: free services, rapid product innovation, and connectivity for billions.",
        response: "The services are not free — they are paid in behavioral data. The question is whether the value extracted from users is proportional to the value they receive.",
        title: "The attention economy created enormous value",
      },
    ],
    causalLoop: {
      description: "Platforms maximize engagement by amplifying emotionally arousing content. More engagement generates behavioral data that improves prediction accuracy, enabling higher ad prices, funding further attention extraction infrastructure.",
      edges: [
        { from: "attention_extraction", label: "generates", polarity: "positive", to: "behavioral_data" },
        { from: "behavioral_data", label: "trains", polarity: "positive", to: "prediction_models" },
        { from: "prediction_models", label: "increase", polarity: "positive", to: "ad_price" },
        { from: "ad_price", label: "funds", polarity: "positive", to: "platform_investment" },
        { from: "platform_investment", label: "improves", polarity: "positive", to: "attention_extraction" },
        { from: "attention_extraction", label: "requires", polarity: "positive", to: "outrage_amplification" },
        { from: "outrage_amplification", label: "degrades", polarity: "negative", to: "public_discourse" },
        { from: "public_discourse", label: "weakens", polarity: "negative", to: "epistemic_quality" },
      ],
      loops: [
        "Reinforcing: attention → behavioral data → prediction accuracy → ad revenue → more attention infrastructure",
        "Balancing (slow): regulatory backlash, user burnout, advertiser brand safety concerns",
      ],
      nodes: [
        { id: "attention_extraction", label: "Attention extraction", tone: "rose", x: 80, y: 160 },
        { id: "behavioral_data", label: "Behavioral data", tone: "amber", x: 280, y: 60 },
        { id: "prediction_models", label: "Prediction accuracy", tone: "amber", x: 480, y: 60 },
        { id: "ad_price", label: "Ad price premium", tone: "emerald", x: 560, y: 200 },
        { id: "platform_investment", label: "Platform investment", tone: "cyan", x: 420, y: 320 },
        { id: "outrage_amplification", label: "Outrage amplification", tone: "rose", x: 80, y: 320 },
        { id: "public_discourse", label: "Public discourse quality", tone: "cyan", x: 240, y: 400 },
        { id: "epistemic_quality", label: "Epistemic quality", tone: "cyan", x: 420, y: 400 },
      ],
      title: "The behavioral extraction loop",
    },
    difficulty: "Beginner",
    discussionPrompt: "Can the attention economy be reformed from inside through better design or regulation, or does monetizing human attention inevitably corrupt the information environment?",
    eyebrow: "Information system",
    heroHighlights: [
      "Shoshana Zuboff named the business model: behavioral data is extracted at scale, processed into prediction products, and sold to advertisers — human experience is the raw material.",
      "Engagement optimization algorithms consistently surface anger, fear, and outrage because these emotions produce higher dwell time and sharing.",
      "An estimated 5,000–10,000 data points are held on each active user of major platforms.",
    ],
    miniLesson: {
      bands: [
        { insight: "Low behavioral monetization. Platforms funded by subscriptions or public models. Algorithmic amplification is modest.", threshold: 20 },
        { insight: "Mixed model. Behavioral data collected but the outrage-engagement loop is not fully dominant.", threshold: 45 },
        { insight: "Engagement optimization dominant. Emotional and divisive content structurally amplified across the feed.", threshold: 70 },
        { insight: "Full surveillance capitalism. Behavioral prediction is the core product. Public discourse shaped around maximum engagement extraction.", threshold: 90 },
      ],
      defaultValue: 70,
      description: "Adjust how deeply the behavioral prediction business model dominates the platform economy.",
      highLabel: "Full surveillance capitalism",
      lowLabel: "Minimal behavioral monetization",
      metrics: [
        { base: 18, description: "Share of algorithmically distributed content that is emotionally negative or divisive.", key: "outrage_share", label: "Outrage content amplification", max: 100, min: 0, slope: 0.58, suffix: "%", tone: "rose" },
        { base: 72, description: "User ability to understand and meaningfully control what data is collected and how it is used.", key: "autonomy", label: "Informational autonomy", max: 100, min: 0, slope: -0.52, suffix: "/100", tone: "cyan" },
        { base: 68, description: "The degree to which different groups share a common factual baseline for public debate.", key: "shared_reality", label: "Shared epistemic ground", max: 100, min: 0, slope: -0.45, suffix: "/100", tone: "emerald" },
      ],
      prompt: "Move the slider to see how deeper behavioral monetization reshapes what gets amplified and what kind of public discourse emerges.",
      sliderLabel: "Behavioral prediction business model depth",
      step: 1,
      title: "Mini lesson: when attention is the product",
      unit: "%",
      valueMax: 100,
      valueMin: 0,
    },
    readingTime: "9 min",
    realWorldExamples: [
      {
        insight: "Facebook's own internal research showed its algorithm's preference for engagement systematically amplified outrage and divisive content.",
        outcome: "Internal documents (Frances Haugen leaks) showed Facebook understood the link between its engagement model and societal harm but prioritized growth.",
        title: "Facebook's internal research on amplification",
      },
      {
        insight: "The Cambridge Analytica scandal showed how platform data could be harvested, profiled, and merged with voter records to build behavior-targeting tools at political scale.",
        outcome: "The case made visible that surveillance capitalism is not just about selling products. The same behavioral infrastructure can be repurposed for political persuasion and voter manipulation.",
        title: "Cambridge Analytica and behavioral targeting",
      },
      {
        insight: "Data brokers such as X-Mode/Outlogic were found to sell precise location data that could reveal visits to clinics, shelters, and religious sites.",
        outcome: "Surveillance capitalism extends far beyond social-media feeds. It creates a market where intimate movement patterns become tradable commercial intelligence.",
        title: "Data brokers and location surveillance",
      },
      {
        insight: "The ad-tech system known as real-time bidding broadcasts user information across many actors in order to auction attention in milliseconds.",
        outcome: "Even when no single app feels oppressive, the background market architecture can still expose personal data so widely that meaningful consent becomes close to fictional.",
        title: "Real-time bidding as background surveillance",
      },
      {
        insight: "Facebook whistleblower Frances Haugen's testimony showed the company understood how engagement ranking could spread divisive content, harm young users, and erode privacy while still defending the underlying business model.",
        outcome: "The scandal made the system-level point clear: if profit depends on extracting data and maximizing engagement, safety reforms will keep colliding with the incentives of the business model itself.",
        title: "The Facebook Files and internal awareness",
      },
    ],
    evidenceLinks: [
      {
        note:
          "An official summary of the Cambridge Analytica case and how harvested Facebook data was used for behavioral profiling and political targeting.",
        source: "Federal Trade Commission",
        title: "FTC Sues Cambridge Analytica",
        url: "https://www.ftc.gov/news-events/news/press-releases/2019/07/ftc-sues-cambridge-analytica-settles-former-ceo-app-developer",
      },
      {
        note:
          "A strong official data-broker case showing that the surveillance market includes sensitive location patterns, not just clicks and likes.",
        source: "Federal Trade Commission",
        title: "FTC Order Prohibits Data Broker X-Mode Social / Outlogic from Selling Sensitive Location Data",
        url: "https://www.ftc.gov/news-events/news/press-releases/2024/01/ftc-order-prohibits-data-broker-x-mode-social-outlogic-selling-sensitive-location-data",
      },
      {
        note:
          "Helpful for the infrastructure layer: the ICO explains how personal data is circulated across ad-tech real-time bidding systems.",
        source: "UK Information Commissioner's Office",
        title: "Update report into adtech and real time bidding",
        url: "https://ico.org.uk/media/about-the-ico/documents/2615156/adtech-real-time-bidding-report-201906.pdf",
      },
      {
        note:
          "Useful for the whistleblower angle: internal research and testimony made the platform's knowledge of social harms part of the public record.",
        source: "U.S. Senate Commerce Committee",
        title: "Frances Haugen Written Testimony",
        url: "https://www.commerce.senate.gov/wp-content/uploads/media/doc/Frances%20Haugen%20Written%20Testimony.pdf",
      },
    ],
    relatedFrameworks: [
      "Shoshana Zuboff — The Age of Surveillance Capitalism",
      "Attention economy (Herbert Simon)",
      "Behavioral economics and dark patterns",
      "Ad-tech and data brokerage",
      "GDPR and consent architecture",
    ],
    simulationPrompt: "Compare platform designs: full behavioral monetization, subscription funding, and public utility models — how do they differ in discourse quality, radicalization risk, and informational autonomy?",
    simpleExplanation: [
      "Surveillance capitalism is not primarily about watching people. It is a business model: human behavior is turned into data, data is fed into prediction machines, and predictions are sold to advertisers and political actors who want to influence what people do next.",
      "The system incentivizes emotional manipulation because emotions are the most reliable drivers of engagement. Anger, fear, and outrage keep users on the platform longer, generating more data, improving prediction accuracy, commanding higher ad prices.",
      "The effect on public knowledge is structural: content is not selected for accuracy or importance but for its ability to trigger a response. This is not a bug in the design — it is the design working exactly as its incentives demand.",
    ],
    slug: "how-surveillance-capitalism-shapes-attention",
    summary: "Surveillance capitalism turns human behavioral data into prediction products sold to influence behavior — with outrage amplification as a structural side effect of the business model.",
    systemBug: {
      signals: [
        "Emotionally negative and divisive content is systematically over-distributed relative to its accuracy or social value.",
        "Users cannot meaningfully opt out of behavioral tracking without losing access to socially essential platforms.",
        "Political and commercial actors can purchase precision influence over specific behavioral and demographic profiles.",
      ],
      summary: "The economic incentive to maximize engagement drives platforms to structurally amplify outrage, fear, and divisiveness — not because engineers want this, but because it is what the business model demands.",
      title: "System bug: engagement maximization degrades information quality and political discourse",
    },
    title: "How surveillance capitalism shapes attention",
  },
  {
    accent: "emerald",
    betterMetrics: [
      {
        label: "Shadow banking ratio",
        description: "Assets held by unregulated institutions as a fraction of total financial system assets. A rising ratio signals growing systemic fragility outside the regulatory perimeter.",
      },
      {
        label: "Leverage-adjusted capital buffer",
        description: "Bank equity as a % of total assets (not risk-weighted). Simple, hard to game, and the best single predictor of whether a bank survives a crisis.",
      },
      {
        label: "Time since last crisis",
        description: "A counter-intuitive metric: long stability periods correlate with rising systemic risk, as regulatory memory fades and leverage accumulates.",
      },
    ],
    betterMetricsTitle: "Better measures of systemic financial risk",
    counterArguments: [
      {
        point: "Modern finance is too complex to regulate like 1930s banking. Derivatives and securitisation serve real economic needs.",
        response: "The complexity argument is often made by those who benefit from complexity. The 2008 crisis showed that instruments too complex to value or understand are instruments too complex to regulate — and therefore instruments that should not be permitted in systemically important institutions. Simplicity is a feature, not a limitation.",
        title: "Complexity is progress",
      },
      {
        point: "Bailouts create moral hazard. We should let banks fail so markets can discipline risk-taking.",
        response: "In theory correct. In practice, the interconnection of modern finance means a disorderly bank failure immediately threatens the payments system, credit supply, and pension funds — hitting ordinary people first. The solution is not to abandon bailouts but to prevent the conditions that make them unavoidable: higher capital requirements, living wills, and credible resolution regimes that wipe out shareholders before taxpayers pay.",
        title: "Let them fail — moral hazard",
      },
      {
        point: "Strong banking regulation just pushes risk into less regulated shadow banking.",
        response: "This is the 'whack-a-mole' critique, and historically it has merit. The response is to regulate by function, not by institutional label: any institution that takes deposits, creates leverage, and promises liquidity should face bank-equivalent oversight — regardless of whether it calls itself a hedge fund, a money market fund, or a trust.",
        title: "Regulation just moves risk",
      },
    ],
    causalLoop: {
      description: "Banking crises follow a recurrent loop: stability breeds complacency, which weakens regulation, which enables shadow banking and leverage, which inflates bubbles, which eventually collapse into crises that prompt re-regulation — until the memory fades and the cycle restarts.",
      edges: [
        { from: "stability", to: "complacency", label: "+", polarity: "positive" as const },
        { from: "complacency", to: "regGap", label: "+", polarity: "positive" as const },
        { from: "regGap", to: "shadow", label: "+", polarity: "positive" as const },
        { from: "shadow", to: "leverage", label: "+", polarity: "positive" as const },
        { from: "leverage", to: "assetPrices", label: "+", polarity: "positive" as const },
        { from: "assetPrices", to: "leverage", label: "+", polarity: "positive" as const, bend: 0.4 },
        { from: "leverage", to: "fragility", label: "+", polarity: "positive" as const },
        { from: "fragility", to: "crisis", label: "+", polarity: "positive" as const },
        { from: "crisis", to: "regulation", label: "+", polarity: "positive" as const },
        { from: "regulation", to: "regGap", label: "−", polarity: "negative" as const },
        { from: "crisis", to: "stability", label: "−", polarity: "negative" as const, bend: -0.3 },
      ],
      loops: ["R1 — Leverage spiral (leverage ↔ asset prices)", "B1 — Regulatory response (crisis → new rules)", "R2 — Stability–complacency–deregulation (the 30-year cycle)"],
      nodes: [
        { id: "stability", label: "Stability & growth", x: 200, y: 30, tone: "cyan" as const },
        { id: "complacency", label: "Regulatory complacency", x: 340, y: 100, tone: "amber" as const },
        { id: "regGap", label: "Regulatory gap", x: 340, y: 200, tone: "amber" as const },
        { id: "shadow", label: "Shadow banking growth", x: 260, y: 290, tone: "rose" as const },
        { id: "leverage", label: "Leverage & speculation", x: 140, y: 290, tone: "rose" as const },
        { id: "assetPrices", label: "Asset price bubble", x: 60, y: 200, tone: "rose" as const },
        { id: "fragility", label: "Systemic fragility", x: 60, y: 110, tone: "rose" as const },
        { id: "crisis", label: "Crisis & contagion", x: 140, y: 30, tone: "rose" as const },
        { id: "regulation", label: "New regulation", x: 340, y: 30, tone: "emerald" as const },
      ],
      title: "The Banking Crisis Cycle",
    },
    difficulty: "Intermediate",
    discussionPrompt: "If regulators know this pattern — stability → complacency → shadow banking → crisis — why does it keep repeating? Is the problem a failure of knowledge, a failure of political will, or a structural feature of how financial regulation is captured by the industry it oversees?",
    eyebrow: "Financial System Design",
    heroHighlights: [
      "Every major financial crisis since 1907 has involved institutions operating as banks without bank-level regulation.",
      "Deposit insurance broke the retail bank run loop — but shadow banking recreated the same vulnerability outside its perimeter.",
      "The cycle of crisis → regulation → stability → complacency → deregulation → crisis repeats roughly every 30 years.",
    ],
    miniLesson: {
      bands: [
        { threshold: 8,  insight: "At 8× leverage, a 12.5% asset decline wipes out equity. This is typical commercial banking. Manageable if reserves and capital buffers are adequate." },
        { threshold: 20, insight: "At 20× leverage, a 5% asset price fall causes insolvency. Many banks operated here before 2008. A modest housing correction becomes an existential crisis." },
        { threshold: 33, insight: "At 33× leverage — where Lehman Brothers operated in 2008 — a 3% asset decline destroys the bank. This is not a margin for error. It is a guaranteed failure waiting for a trigger." },
        { threshold: 45, insight: "At 45× leverage, the institution is effectively a bet that nothing will ever go wrong by even 2%. LTCM operated here in 1998 before collapsing and nearly taking global markets with it." },
      ],
      defaultValue: 10,
      description: "Leverage amplifies everything: in a boom, it turbocharges returns. In a bust, it turbocharges losses. Adjust the slider to see how the same 5% asset price decline affects a bank depending on its leverage ratio.",
      highLabel: "Highly leveraged (Lehman 2008 level)",
      lowLabel: "Conservative (equity-funded)",
      metrics: [
        {
          key: "roe",
          label: "Return on equity (5% asset return year)",
          description: "Annual profit as % of equity when assets return 5%",
          base: 0,
          slope: 5,
          min: 5,
          max: 250,
          tone: "emerald" as const,
          suffix: "%",
        },
        {
          key: "insolvency_threshold",
          label: "Asset decline before insolvency",
          description: "How far asset prices can fall before equity is wiped out",
          base: 102,
          slope: -2,
          min: 1,
          max: 100,
          tone: "rose" as const,
          suffix: "%",
        },
        {
          key: "taxpayer_risk",
          label: "Systemic risk to taxpayers",
          description: "Likelihood that a failure requires public bailout",
          base: 0,
          slope: 2,
          min: 0,
          max: 100,
          tone: "amber" as const,
          suffix: "%",
        },
      ],
      prompt: "Move the slider to explore how leverage changes the risk profile of a financial institution.",
      sliderLabel: "Leverage ratio",
      step: 1,
      title: "The Leverage Trade-off",
      unit: "×",
      valueLabel: "Leverage",
      valueMax: 50,
      valueMin: 1,
    },
    readingTime: "9 min read",
    realWorldExamples: [
      {
        title: "Panic of 1907 — The Original Shadow Bank",
        outcome: "New York 'trusts' acted like banks — accepting deposits, speculating in stocks — but faced no reserve requirements and no clearinghouse backing. When the Knickerbocker Trust collapsed, panic spread to all trusts within days. J.P. Morgan personally organised a rescue. The US entered a four-year recession. Output fell 11%, unemployment rose to 8%.",
        insight: "The 1907 panic was caused not by a regulated bank but by an institution that looked like a bank, acted like a bank, but escaped bank regulation. This pattern — shadow institutions taking bank risks — would repeat in every major crisis that followed.",
      },
      {
        title: "S&L Crisis 1980s — Deregulation + Deposit Insurance = Disaster",
        outcome: "Congress deregulated savings & loans in 1980, allowing them to make risky real estate bets while keeping federal deposit insurance. Executives gambled freely — losses were the government's problem. Over 1,000 S&Ls failed between 1986–1995, costing US taxpayers $124 billion. The resulting credit crunch contributed to the 1990 recession.",
        insight: "Moral hazard in its purest form: privatise the gains, socialise the losses. Deposit insurance is essential to prevent panics — but it must be paired with strict oversight, or it becomes a subsidy for recklessness.",
      },
      {
        title: "2008 Global Financial Crisis — Leverage × Shadow Banking × No Memory",
        outcome: "Investment banks at 30:1 leverage held securitised subprime mortgages they couldn't value. Shadow institutions — SIVs, money market funds, broker-dealers — held more assets than regulated banks but had no deposit insurance and no Fed backstop. When Lehman Brothers failed in September 2008, global credit froze within 72 hours. GDP fell in every major economy. 8 million jobs were lost in the US alone.",
        insight: "2008 was 1907 repeated at a scale orders of magnitude larger, enabled by financial innovation that outpaced regulatory imagination. The Glass-Steagall Act — designed precisely to prevent this — had been gutted by 1999.",
      },
    ],
    relatedFrameworks: [
      "Hyman Minsky — financial instability hypothesis",
      "Walter Bagehot — lender of last resort",
      "Glass-Steagall Act 1933 (and its 1999 repeal)",
      "Basel III capital requirements",
      "Shadow banking and regulatory arbitrage",
      "Too big to fail / too connected to fail",
    ],
    simulationPrompt: "Set reserve ratios, deposit insurance coverage, and central bank response speed to test whether your regulatory design would have contained the 1907 panic or the 2008 collapse.",
    simulatorSlug: "bank-run",
    slug: "how-banking-crises-repeat",
    simpleExplanation: [
      "Banking crises are not accidents — they are the predictable output of a system that rewards risk-taking in good times and socialises losses in bad ones. Every major crisis since 1907 has followed the same basic script: a period of stability breeds complacency, regulation is loosened, institutions take on more leverage, and eventually a shock reveals that the safety net was an illusion.",
      "The self-fulfilling nature of bank runs is the key mechanism. Banks borrow short and lend long — they take deposits that can be withdrawn today and make loans that mature over years. If enough depositors believe others will withdraw, it becomes rational for everyone to withdraw simultaneously, even from a perfectly solvent bank. Deposit insurance was invented specifically to break this panic loop by removing the first-mover advantage.",
      "What changes across each crisis is not the mechanism but the venue. In 1907 it was unregulated trust companies. In the 1980s it was savings and loans given investment powers without capital requirements. In 2008 it was a shadow banking system operating at bank-like leverage without bank-like oversight. In 2023 it was concentrated uninsured deposits and duration-mismatched bond portfolios. The regulatory perimeter keeps moving; the underlying dynamic does not.",
    ],
    summary: "Every major financial crisis since 1907 follows the same pattern: unregulated institutions take bank-like risks, leverage inflates a bubble, the bubble bursts, and the real economy pays the price. The lesson has been learned repeatedly — and forgotten just as regularly.",
    systemBug: {
      signals: [
        "Shadow banking sector grows faster than regulated banking between crises",
        "Leverage ratios at major institutions rise steadily during boom periods",
        "Regulatory bodies staffed by former or future industry employees",
        "Crisis-era legislation progressively weakened during periods of stability",
        "Complexity of financial instruments outpaces regulators' ability to value them",
      ],
      summary: "The financial system is structured so that those who take risks are not those who pay for failure. Profits flow to shareholders and executives during booms; losses flow to taxpayers and employees during busts. This asymmetry creates a permanent incentive to take excessive risk — and a permanent political pressure to weaken the regulation that constrains it.",
      title: "System bug: private risk, public losses — the moral hazard loop",
    },
    title: "Why Banking Crises Keep Happening",
  },

  {
    accent: "rose",
    betterMetrics: [
      {
        description: "Tracks risk hidden off-balance-sheet in structured vehicles, repo, and money markets.",
        label: "Shadow banking system size (% of GDP)",
      },
      {
        description: "Rising spread signals funding stress and counterparty distrust — a real-time crisis indicator.",
        label: "TED spread / LIBOR-OIS spread",
      },
      {
        description: "Measures how much leverage sits in the financial sector relative to real economic activity.",
        label: "Financial sector debt-to-GDP",
      },
      {
        description: "Tracks the proportion of mortgages issued with no income verification or deposit — a measure of origination quality.",
        label: "Subprime and no-doc origination share",
      },
    ],
    betterMetricsTitle: "Signals that matter more than headline growth",
    causalLoop: {
      description:
        "A reinforcing bubble builds as rising prices justify further leverage; when prices stall the same leverage unwinds faster than it built, with shadow banking amplifying each step.",
      edges: [
        { from: "housePrice", label: "boosts", polarity: "positive", to: "origination" },
        { from: "origination", label: "funds", polarity: "positive", to: "securitisation" },
        { from: "securitisation", label: "frees capital for", polarity: "positive", to: "origination" },
        { from: "securitisation", label: "feeds", polarity: "positive", to: "shadow" },
        { from: "shadow", label: "amplifies", polarity: "positive", to: "leverage" },
        { from: "leverage", label: "supports", polarity: "positive", to: "housePrice" },
        { from: "housePrice", label: "collapse triggers", polarity: "negative", to: "defaults" },
        { from: "defaults", label: "impairs", polarity: "negative", to: "bankCapital" },
        { from: "bankCapital", label: "forces", polarity: "negative", to: "creditFlow" },
        { from: "creditFlow", label: "depresses", polarity: "negative", to: "housePrice" },
        { from: "shadow", label: "evades", polarity: "negative", to: "regulation" },
      ],
      loops: [
        {
          description: "Rising house prices improve collateral, enabling more lending, which funds more buying — until prices reverse.",
          label: "R1",
          nodeIds: ["housePrice", "origination", "securitisation", "leverage", "housePrice"],
          polarity: "reinforcing",
        },
        {
          description: "Price falls raise defaults, destroying capital, tightening credit, falling prices further.",
          label: "B1",
          nodeIds: ["housePrice", "defaults", "bankCapital", "creditFlow", "housePrice"],
          polarity: "balancing",
        },
      ],
      nodes: [
        { id: "housePrice", label: "House Prices", x: 350, y: 60 },
        { id: "origination", label: "Mortgage Origination", x: 580, y: 160 },
        { id: "securitisation", label: "Securitisation (MBS/CDO)", x: 580, y: 300 },
        { id: "shadow", label: "Shadow Banking", x: 350, y: 390 },
        { id: "leverage", label: "System Leverage", x: 120, y: 300 },
        { id: "defaults", label: "Mortgage Defaults", x: 580, y: 460 },
        { id: "bankCapital", label: "Bank Capital", x: 350, y: 540 },
        { id: "creditFlow", label: "Credit Flow", x: 120, y: 460 },
        { id: "regulation", label: "Regulatory Perimeter", x: 120, y: 160 },
      ],
      title: "2008 Bubble–Bust Causal Loop",
    },
    counterArguments: [
      {
        point:
          "Many economists and ratings agencies genuinely believed diversification made CDOs safe — it was a model error, not deliberate fraud.",
        response:
          "Internal emails at Goldman, Citigroup, and rating agencies show awareness of deteriorating collateral quality. Epistemic failure and incentive-driven blindness are different problems, and the latter still demands structural reform.",
        title: "It was an honest intellectual mistake",
      },
      {
        point:
          "Regulators, central banks, and economists also missed the bubble — the problem was universal blindness, not deregulation.",
        response:
          "The Gramm-Leach-Bliley Act (1999) and the Commodity Futures Modernization Act (2000) explicitly removed capital and disclosure requirements from the shadow sector. Blindness was institutionalized through policy choices, not random.",
        title: "Everyone missed it — regulators included",
      },
      {
        point:
          "The Dodd-Frank Act and Basel III responded with massive reforms. Blaming the 2008 system is fair; pretending nothing changed is not.",
        response:
          "Significant reforms passed, but leverage caps were watered down, stress tests became periodic rather than continuous, and shadow banking has grown again — this time in private credit and money market funds.",
        title: "Dodd-Frank fixed the core problems",
      },
    ],
    difficulty: "Advanced",
    discussionPrompt:
      "If subprime mortgages were obviously risky, why did AAA-rated CDOs built from them remain attractive to pension funds and sovereign wealth funds?",
    eyebrow: "Crisis anatomy",
    heroHighlights: [
      "Securitisation let originators profit by selling risk, not bearing it",
      "AAA-rated CDOs concentrated, rather than dispersed, systemic risk",
      "Shadow banking grew to rival regulated banking — without any safety net",
    ],
    miniLesson: {
      accent: "rose",
      conclusion:
        "The CDO machine concentrated risk invisibly. By 2007, the weakest mortgages in America had been repackaged into securities held by pension funds in Norway, Germany, and Japan — with nobody along the chain bearing the final loss.",
      metrics: [
        {
          description: "2003–2006 US subprime origination ($ bn / year)",
          high: "$600bn",
          label: "Subprime volume",
          low: "$120bn",
          signal: "rising → bubble",
        },
        {
          description: "Peak leverage at major investment banks before 2008",
          high: "35:1",
          label: "Leverage ratio",
          low: "10:1",
          signal: "rising → fragile",
        },
        {
          description: "US shadow banking system ($ tn) vs regulated banking",
          high: "$20tn",
          label: "Shadow banking",
          low: "$5tn",
          signal: "rising → unmonitored",
        },
      ],
      subtitle: "How safe mortgages became toxic bonds",
      title: "The CDO Machine",
    },
    readingTime: "10 min read",
    realWorldExamples: [
      {
        insight:
          "Tranching allowed a pool of B-rated mortgages to produce a senior tranche rated AAA. This mathematical alchemy required house prices to never fall nationally at the same time — an assumption that failed in 2006.",
        outcome:
          "By 2006, over 80% of subprime mortgages were securitised into MBS and re-pooled into CDOs, receiving investment-grade ratings. When defaults rose, correlation between tranches — assumed to be low — proved near-perfect.",
        title: "Mortgage-backed securities and CDOs",
      },
      {
        insight:
          "AIG's CDS business functioned as insurance without reserves. When the housing market fell, AIG owed $440bn in credit protection it could not pay — turning a large insurer into a $182bn government bailout.",
        outcome:
          "AIG sold credit default swaps on CDOs to banks globally, effectively promising to pay if the CDOs defaulted. Without capital requirements, AIG's Financial Products division built a position it had no capacity to honour.",
        title: "AIG and the credit default swap market",
      },
      {
        insight:
          "Repo markets were the shadow banking system's deposit base. When Lehman's counterparties stopped rolling over repo, its $600bn balance sheet froze in 24 hours — showing how overnight funding can detonate a systemically important institution instantly.",
        outcome:
          "Lehman Brothers funded long-term illiquid assets with overnight repo. A $2bn collateral dispute triggered counterparty refusal to roll positions, making Chapter 11 the only option within days.",
        title: "Lehman Brothers and the repo freeze",
      },
    ],
    relatedFrameworks: ["Shadow Banking", "Securitisation", "Leverage Cycles", "Systemic Risk", "Moral Hazard"],
    simulationPrompt:
      "Adjust housing bubble size, leverage ratio, and bailout speed to see how 2008 could have been worse — or cut short with early intervention.",
    simulatorSlug: "financial-crisis",
    slug: "how-the-2008-financial-crisis-happened",
    simpleExplanation: [
      "The 2008 crisis was the result of a machine built to create and sell mortgage debt as fast as possible, with nobody in the chain having a lasting stake in whether the debt could actually be repaid. Mortgage originators sold loans for fees and passed the risk on. Banks packaged those loans into securities and sold them. Rating agencies rated those securities AAA for fees. Investors bought them without understanding what was inside.",
      "The critical invention was the CDO — a security built from tranches of mortgage pools. Mathematical models suggested that pooling thousands of geographically dispersed mortgages would diversify away default risk. The models assumed house prices in different US cities were uncorrelated. When the housing market fell nationally in 2006-2007, that assumption failed simultaneously everywhere, and the senior tranches rated AAA proved worthless.",
      "Shadow banking amplified everything. Investment banks, money market funds, and structured investment vehicles were performing bank-like functions — borrowing short, lending long, at high leverage — but without deposit insurance, capital requirements, or a lender of last resort. When confidence broke, the entire shadow system froze simultaneously. Lehman Brothers collapsed in 36 hours when repo counterparties stopped rolling overnight funding. The resulting credit freeze transmitted the financial crisis into a global recession.",
    ],
    summary:
      "The 2008 crisis was not caused by a single bad loan or reckless bank. It was a system-wide architecture that let risk be hidden, sold, and multiplied faster than anyone could see it. Understanding how securitisation, leverage, and shadow banking interacted is essential to understanding why it happened — and why the next version is already building.",
    systemBug: {
      signals: [
        "Originators earn fees on volume regardless of loan quality",
        "Ratings agencies are paid by the issuers they rate",
        "Regulatory capital rules apply only inside the official perimeter",
        "Rising asset prices validate the very leverage that inflated them",
      ],
      summary:
        "The system separated the party who originates risk from the party who bears it. Each link in the chain — originator, securitiser, rating agency, investor — had an incentive to pass the parcel rather than examine it.",
      title: "System bug: originate-to-distribute breaks the risk signal",
    },
    title: "How the 2008 Financial Crisis Happened",
  },

  {
    accent: "amber",
    betterMetrics: [
      {
        description: "When thrift assets cannot reprice but liabilities can, rising rates produce guaranteed insolvency.",
        label: "Asset-liability duration gap (years)",
      },
      {
        description: "Zombie institutions that cannot meet obligations but continue operating amplify eventual losses.",
        label: "Number of insolvent-but-operating institutions",
      },
      {
        description: "Deposit insurance without corresponding risk-based premiums subsidises excessive risk-taking.",
        label: "Deposit insurance premium vs. portfolio risk",
      },
      {
        description: "Tracks the share of thrift assets moving from long-term mortgages into junk bonds and commercial real estate.",
        label: "Share of assets in high-risk non-mortgage investments",
      },
    ],
    betterMetricsTitle: "What the regulators were not watching",
    causalLoop: {
      description:
        "Fixed-rate mortgages funded by floating deposits became a guaranteed loss when rates rose. Deregulation then allowed zombie thrifts to double down on junk bonds and commercial real estate — expanding losses until the government had no choice but to absorb them.",
      edges: [
        { from: "interestRates", label: "crush margins on", polarity: "negative", to: "thriftMargin" },
        { from: "thriftMargin", label: "erodes", polarity: "negative", to: "solvency" },
        { from: "solvency", label: "triggers", polarity: "negative", to: "regulatoryForbearance" },
        { from: "regulatoryForbearance", label: "allows continued operation of", polarity: "positive", to: "zombies" },
        { from: "zombies", label: "chase yield in", polarity: "positive", to: "junkAndCRE" },
        { from: "junkAndCRE", label: "amplifies", polarity: "negative", to: "losses" },
        { from: "losses", label: "drains", polarity: "negative", to: "FSLICReserves" },
        { from: "FSLICReserves", label: "depletion delays", polarity: "negative", to: "closures" },
        { from: "closures", label: "passes costs to", polarity: "negative", to: "taxpayer" },
        { bend: -30, from: "interestRates", label: "motivates", polarity: "positive", to: "deregulation" },
        { from: "deregulation", label: "expands risk-taking by", polarity: "positive", to: "zombies" },
      ],
      loops: [
        {
          description: "Insolvent thrifts allowed to operate took bigger bets hoping to grow back to solvency — each loss deepened the hole.",
          label: "R1",
          nodeIds: ["solvency", "regulatoryForbearance", "zombies", "junkAndCRE", "losses", "solvency"],
          polarity: "reinforcing",
        },
      ],
      nodes: [
        { id: "interestRates", label: "Rising Interest Rates", x: 350, y: 60 },
        { id: "thriftMargin", label: "Thrift Net Margin", x: 580, y: 160 },
        { id: "solvency", label: "Thrift Solvency", x: 580, y: 300 },
        { id: "regulatoryForbearance", label: "Regulatory Forbearance", x: 350, y: 390 },
        { id: "zombies", label: "Zombie Thrifts", x: 120, y: 300 },
        { id: "junkAndCRE", label: "Junk Bonds & CRE", x: 120, y: 160 },
        { id: "losses", label: "Cumulative Losses", x: 350, y: 240 },
        { id: "FSLICReserves", label: "FSLIC Reserves", x: 580, y: 460 },
        { id: "closures", label: "Forced Closures", x: 350, y: 540 },
        { id: "taxpayer", label: "Taxpayer Bailout", x: 120, y: 460 },
        { id: "deregulation", label: "Deregulation (1982)", x: 120, y: 60 },
      ],
      title: "S&L Crisis Causal Loop",
    },
    counterArguments: [
      {
        point:
          "The Volcker rate shock was a deliberate policy choice to break inflation. The S&L sector was collateral damage from a necessary macroeconomic correction, not a failure of financial regulation.",
        response:
          "The rate shock exposed the structural mismatch, but regulatory forbearance — allowing insolvent institutions to expand — turned a manageable write-down into a decade-long amplification of losses. The $130bn taxpayer bill was the cost of delay, not the initial shock.",
        title: "Blaming the interest rate shock is unfair to regulators",
      },
      {
        point:
          "Deregulation was the industry's own solution to survive the rate shock. Restricting thrifts to fixed-rate home mortgages while funding costs floated was itself the structural trap — deregulation gave them a fighting chance.",
        response:
          "Broadened investment powers without matching capital requirements or supervision created moral hazard at scale. The Garn-St Germain Act enabled junk bond speculation by entities whose deposits were federally insured.",
        title: "Deregulation gave thrifts a chance to survive",
      },
      {
        point:
          "The RTC wound down over 700 failed institutions and recovered significant assets. The resolution was professionally managed and losses were contained relative to the financial system size.",
        response:
          "The RTC was effective, but it was created seven years after the crisis began. The lesson is not that the resolution worked — it is that forbearance and delayed recognition multiplied the original loss several times over.",
        title: "The RTC resolution was a success story",
      },
    ],
    difficulty: "Intermediate",
    discussionPrompt:
      "When an insolvent institution is allowed to continue operating, who benefits and who pays? Why might regulators choose forbearance even when they know the institution is already insolvent?",
    eyebrow: "Crisis anatomy",
    heroHighlights: [
      "Rate rises exposed a structural mismatch: 30-year fixed assets funded by floating deposits",
      "Deregulation let insolvent thrifts gamble with junk bonds and commercial real estate",
      "Regulatory forbearance turned a $20bn problem into a $130bn taxpayer bill",
    ],
    miniLesson: {
      accent: "amber",
      conclusion:
        "The S&L crisis taught that allowing insolvent institutions to continue operating does not give them time to recover — it gives them time to get worse. The Resolution Trust Corporation eventually liquidated over 700 failed thrifts. Every year of delay added roughly $10bn to the final cost.",
      metrics: [
        {
          description: "Peak Fed Funds Rate (1981) vs. typical 30-yr fixed mortgage yield",
          high: "21.5% (1981 rate)",
          label: "Short-term rate",
          low: "7% (mortgage yield)",
          signal: "mismatch → insolvency",
        },
        {
          description: "Estimated taxpayer cost of S&L resolution (1986–1995)",
          high: "$130bn",
          label: "Taxpayer cost",
          low: "$20bn (early est.)",
          signal: "forbearance → amplification",
        },
        {
          description: "Thrift failures resolved by the RTC (1989–1995)",
          high: "747",
          label: "Institutions resolved",
          low: "0 (pre-FIRREA)",
          signal: "delay → cascade",
        },
      ],
      subtitle: "How a rate mismatch became a $130bn bailout",
      title: "The Zombie Thrift Problem",
    },
    readingTime: "8 min read",
    realWorldExamples: [
      {
        insight:
          "The rate shock did not create the mismatch — it revealed a structure that had always been fragile. Regulators had allowed thrifts to borrow short and lend long for decades because it appeared stable during the low-rate postwar period.",
        outcome:
          "When Paul Volcker raised rates to 20% to break 1970s inflation, savings and loan associations found themselves paying 15% on deposits while earning 8% on 30-year mortgages. By 1982, the industry was collectively insolvent by any honest accounting.",
        title: "The Volcker shock and duration mismatch",
      },
      {
        insight:
          "Lincoln Savings, run by Charles Keating, illustrates how regulatory capture prolonged the crisis. Five US senators — the Keating Five — intervened with regulators on Lincoln's behalf after receiving $1.3m in campaign contributions.",
        outcome:
          "The Garn-St Germain Act (1982) deregulated thrift investment powers. Operators like Charles Keating used deposit funding to buy junk bonds and commercial real estate. Lincoln Savings alone cost the FSLIC $3.4bn.",
        title: "Garn-St Germain, junk bonds, and the Keating Five",
      },
      {
        insight:
          "FIRREA and the RTC demonstrated that a well-designed resolution authority can manage even very large financial failures if given proper mandate and funding. The problem was the seven-year lag before they were created.",
        outcome:
          "FIRREA (1989) created the Resolution Trust Corporation, which wound down 747 failed thrifts between 1989 and 1995. Final taxpayer cost was approximately $130bn — significantly higher than early estimates due to the losses accumulated during forbearance.",
        title: "FIRREA and the Resolution Trust Corporation",
      },
    ],
    relatedFrameworks: [
      "Duration Mismatch",
      "Regulatory Forbearance",
      "Moral Hazard",
      "Zombie Institutions",
      "Resolution Frameworks",
    ],
    simulationPrompt:
      "Adjust the interest rate shock, forbearance duration, and deregulation level to see how quickly a rate mismatch becomes a taxpayer liability.",
    simulatorSlug: "financial-crisis",
    slug: "the-savings-and-loan-crisis-of-the-1980s",
    simpleExplanation: [
      "The savings and loan crisis was not a sudden crash — it was a slow-motion collapse enabled by a specific structural trap and then amplified by the regulatory decision to look the other way. Savings and loans (thrifts) existed to fund home ownership: they took short-term deposits and made long-term fixed-rate mortgages. This worked fine as long as interest rates were stable.",
      "When Paul Volcker raised the Federal Funds Rate to 20% in 1981 to break inflation, the trap sprang. Thrifts were paying 15% on deposits but earning 8% on mortgages locked in years earlier. The industry was collectively insolvent. The regulatory response — forbearance, allowing insolvent institutions to keep operating on relaxed accounting rules — turned a $20bn problem into a $130bn taxpayer liability.",
      "The Garn-St Germain Act (1982) made it worse by deregulating thrift investment powers without adding capital requirements. Insolvent thrifts had nothing to lose: if speculative bets in junk bonds and commercial real estate paid off, they survived; if they failed, the federal insurance fund absorbed the loss. This is the moral hazard trap in its purest form. Every year of regulatory delay added roughly $10bn to the final cost.",
    ],
    summary:
      "The savings and loan crisis was not a sudden crash — it was a slow-motion collapse enabled by regulatory delay. A structural mismatch between short-term deposits and long-term fixed mortgages became catastrophic when rates rose, and deregulation allowed insolvent institutions to gamble their way deeper into insolvency. The final cost: $130bn, paid by taxpayers.",
    systemBug: {
      signals: [
        "Institutions are insolvent but allowed to keep taking deposits",
        "Insurance premiums are flat regardless of risk taken",
        "Regulators have discretion to delay recognition of losses",
        "Political pressure shields large or well-connected failing institutions",
      ],
      summary:
        "Once a deposit-insured institution is technically insolvent, continuing to operate creates a one-way bet: if the gambles pay off, the institution survives; if they fail, the insurer — ultimately the taxpayer — absorbs the loss. Forbearance institutionalizes this bet.",
      title: "System bug: regulatory forbearance creates a heads-I-win, tails-you-lose structure",
    },
    title: "The Savings and Loan Crisis of the 1980s",
  },
  {
    accent: "emerald",
    betterMetrics: [
      {
        description:
          "Who owns or controls the major productive assets in the economy: private investors, the public, cooperatives, or some mix?",
        label: "Ownership of the means of production",
      },
      {
        description:
          "How much influence workers have over investment, firm governance, and how surplus is distributed.",
        label: "Worker voice over production",
      },
      {
        description:
          "How much of everyday life is secured through public guarantees such as health, housing, education, pensions, and unemployment protection.",
        label: "Social provisioning coverage",
      },
      {
        description:
          "How much coordination happens through competitive markets versus public planning, regulation, or democratic budgeting.",
        label: "Market dependence vs. planned coordination",
      },
    ],
    betterMetricsTitle: "Questions that compare systems better than slogans",
    counterArguments: [
      {
        point:
          "These labels are too old and ideological to be useful. Modern economies are all mixed, so the distinctions no longer matter.",
        response:
          "It is true that real systems are mixed. But the labels still point to real design questions: who owns productive assets, who controls investment, how much is allocated by markets, and how much security is guaranteed outside the market.",
        title: "The labels are outdated anyway",
      },
      {
        point:
          "Socialism always means state control and therefore always ends in bureaucracy or dictatorship.",
        response:
          "Some historical socialist projects did centralize power in the state, and that history matters. But socialism is a broader family than state command alone: it can include municipal ownership, worker cooperatives, social wealth funds, and market-socialist designs.",
        title: "Socialism always becomes one-party statism",
      },
      {
        point:
          "Capitalism simply means freedom and voluntary exchange, so comparing it to socialism or communism is basically comparing freedom to coercion.",
        response:
          "Markets can expand choice in some domains, but capitalism also structures power through ownership. If a small group controls investment, workplaces, and housing finance, that is not power-free. The comparison is about different forms of coordination and control, not freedom versus no freedom.",
        title: "Capitalism is just freedom in economic form",
      },
    ],
    causalLoop: {
      description:
        "Economic systems are not just about markets or states in the abstract. The core loop is ownership: whoever controls investment and surplus also gains political power to defend or reshape the rules, which then reproduces the next round of ownership patterns.",
      edges: [
        { from: "ownershipRules", label: "shape", polarity: "positive", to: "investmentControl" },
        { from: "investmentControl", label: "determines", polarity: "positive", to: "surplusDistribution" },
        { from: "surplusDistribution", label: "concentrates or diffuses", polarity: "positive", to: "wealthPower" },
        { from: "wealthPower", label: "funds", polarity: "positive", to: "politicalInfluence" },
        { from: "politicalInfluence", label: "protects or rewrites", polarity: "positive", to: "ownershipRules" },
        { from: "socialProvision", label: "strengthens", polarity: "positive", to: "workerSecurity" },
        { from: "workerSecurity", label: "raises demand for voice over", polarity: "positive", to: "ownershipRules" },
        { from: "wealthPower", label: "can weaken", polarity: "negative", to: "socialProvision" },
      ],
      loops: [
        "Reinforcing: ownership rules → investment control → surplus distribution → wealth power → political influence → ownership rules",
        "Balancing (potential): stronger social provision and worker security can create political room to redesign ownership and bargaining rules",
      ],
      nodes: [
        { id: "ownershipRules", label: "Ownership rules", tone: "amber", x: 80, y: 120 },
        { id: "investmentControl", label: "Control over investment", tone: "cyan", x: 280, y: 60 },
        { id: "surplusDistribution", label: "Who keeps the surplus", tone: "emerald", x: 500, y: 120 },
        { id: "wealthPower", label: "Wealth concentration", tone: "rose", x: 500, y: 300 },
        { id: "politicalInfluence", label: "Political influence", tone: "rose", x: 280, y: 360 },
        { id: "socialProvision", label: "Public guarantees", tone: "emerald", x: 80, y: 300 },
        { id: "workerSecurity", label: "Worker security", tone: "cyan", x: 80, y: 420 },
      ],
      title: "Who owns production shapes who rules",
    },
    difficulty: "Starter",
    discussionPrompt:
      "When people argue about capitalism, socialism, or communism, which concrete institutional question are they usually skipping: ownership, planning, class power, or democratic accountability?",
    eyebrow: "Political economy",
    heroHighlights: [
      "Most real economies are mixed; the real question is which institutions dominate, not which label wins.",
      "Capitalism centers private ownership and profit-driven investment, but states still set the rules of the game.",
      "Socialism and communism are not identical: socialism includes many models, while communism in Marx's sense was imagined as a classless end state.",
    ],
    miniLesson: {
      bands: [
        {
          insight:
            "Private ownership dominates. Markets and profit signals make most investment decisions, while social protection depends heavily on redistribution after the market has already allocated power.",
          threshold: 0,
        },
        {
          insight:
            "Mixed-economy zone. Markets still dominate production, but welfare states, unions, regulation, and public services reduce some of the inequalities pure market allocation would create.",
          threshold: 30,
        },
        {
          insight:
            "Socialist design zone. More major assets are publicly, municipally, or cooperatively controlled, so democratic choices shape investment more directly than private return alone.",
          threshold: 60,
        },
        {
          insight:
            "Very high collective control. Historical regimes often centralized this through the state, while communist theory imagined the state eventually fading away. Those are not the same thing.",
          threshold: 90,
        },
      ],
      defaultValue: 35,
      description:
        "Move the slider across one simplified dimension: how much control over major productive assets sits in private hands versus collective or public hands. It does not settle the whole debate, but it makes the design trade-offs visible.",
      highLabel: "Collective control dominant",
      lowLabel: "Private ownership dominant",
      metrics: [
        {
          base: 92,
          description: "How much power private capital holders have over investment and workplace direction.",
          key: "private-capital-power",
          label: "Private capital power",
          max: 100,
          min: 0,
          slope: -0.92,
          suffix: "/100",
          tone: "rose",
        },
        {
          base: 28,
          description: "How much basic security can be guaranteed outside the labor market if institutions are designed to do so.",
          key: "social-guarantees",
          label: "Potential for social guarantees",
          max: 100,
          min: 0,
          slope: 0.58,
          suffix: "/100",
          tone: "emerald",
        },
        {
          base: 18,
          description: "How much democratic or administrative coordination the system must perform instead of leaving outcomes to price signals.",
          key: "coordination-burden",
          label: "Coordination burden",
          max: 100,
          min: 0,
          slope: 0.72,
          suffix: "/100",
          tone: "cyan",
        },
      ],
      prompt:
        "Use the slider to compare how ownership structure changes power, public guarantees, and the amount of coordination society must perform deliberately.",
      sliderLabel: "Collective control of major productive assets",
      step: 1,
      title: "Mini lesson: labels are shorthand for design choices",
      unit: "%",
      valueMax: 100,
      valueMin: 0,
    },
    readingTime: "8 min",
    realWorldExamples: [
      {
        insight:
          "Nordic economies show that generous welfare states, public services, and strong unions can exist inside capitalist market systems. Calling them simply 'socialist' hides the mixed design.",
        outcome:
          "Countries such as Sweden and Denmark combine private firms and competitive markets with high taxation, broad public provision, and stronger labor institutions than Anglo-American capitalism.",
        title: "Social democracy inside capitalism",
      },
      {
        insight:
          "Socialism is not limited to a ministry running every factory. Worker-owned firms can keep markets while changing who controls the workplace and the surplus.",
        outcome:
          "The Mondragon cooperative network in Spain shows one socialist design path: market exchange remains, but ownership and governance shift toward workers rather than outside shareholders.",
        title: "Worker cooperatives and market socialism",
      },
      {
        insight:
          "Most 20th-century communist states operated through centralized party-state control, which is different from Marx's stateless end vision. That gap matters when people use the label loosely.",
        outcome:
          "The Soviet model achieved rapid industrial mobilization and some universal guarantees, but it also concentrated information, planning power, and repression in a single political hierarchy.",
        title: "Command planning and the communist label",
      },
    ],
    relatedFrameworks: [
      "Means of production",
      "Social democracy",
      "Market socialism",
      "Central planning",
      "Worker cooperatives",
    ],
    simulationPrompt:
      "Compare a capitalist, social-democratic, market-socialist, and command-planning model across inequality, innovation, bargaining power, and accountability.",
    simpleExplanation: [
      "Capitalism, socialism, and communism are best understood as families of institutional arrangements, not as magic words. The key questions are who owns productive assets, who decides where investment goes, and whether people get access to basic goods only through the market or also through public guarantees.",
      "In capitalism, productive assets are mostly privately owned, and firms invest primarily where they expect profit. Markets do much of the coordination. The state still matters enormously, but it usually acts by setting rules, taxes, contracts, and safety nets around a mostly private investment system.",
      "In socialism, the central idea is that major productive assets should be socially controlled rather than dominated by a separate owner class. That does not automatically mean one giant central plan. Socialist models range from state ownership to municipal ownership, cooperative firms, public utilities, and market-socialist systems that still use prices but alter who owns capital.",
      "Communism, in Marx's theory, described a future classless society with common ownership and no need for a coercive state. Historical communist regimes generally claimed to be moving toward that goal through centralized party states. That historical reality is important, but it should not be confused with the theory's end-state description.",
    ],
    slug: "how-capitalism-socialism-and-communism-differ",
    summary:
      "These labels only become useful when they are translated into concrete institutional questions: who owns productive assets, how investment is coordinated, and who has power over surplus and basic security.",
    systemBug: {
      signals: [
        "Public debate treats labels like insults or badges rather than as design questions about ownership and control.",
        "Countries with capitalist markets and large welfare states are often described as if they were fully socialist.",
        "Historical communist states are discussed as if they were identical to every possible socialist model.",
      ],
      summary:
        "The real bug is conceptual compression. One-word labels hide the underlying institutional choices, making it harder to compare systems on ownership, accountability, equality, and freedom in a serious way.",
      title: "System bug: ideological labels hide the actual design choices",
    },
    title: "How capitalism, socialism, and communism differ",
  },
  {
    accent: "cyan",
    betterMetrics: [
      {
        description:
          "How long it takes a proposal to move from Commission initiative to adopted law, especially under the ordinary legislative procedure.",
        label: "Proposal-to-adoption time",
      },
      {
        description:
          "How many proposals are adopted through the ordinary legislative procedure versus special procedures or unanimity-heavy routes.",
        label: "Ordinary procedure share",
      },
      {
        description:
          "How often member-state disagreement or unanimity requirements slow or block adoption.",
        label: "Council conflict / unanimity friction",
      },
      {
        description:
          "How often national parliaments trigger subsidiarity concerns or force a rethink of where decisions should be taken.",
        label: "Subsidiarity warnings from national parliaments",
      },
    ],
    betterMetricsTitle: "Signals that show how the EU actually governs",
    counterArguments: [
      {
        point:
          "The EU is basically an unelected bureaucracy because the Commission can propose laws and ordinary people do not directly elect it.",
        response:
          "The Commission does have the monopoly on legislative initiative in most areas, and that is a real democratic design choice. But most EU laws are then jointly decided by the directly elected Parliament and the Council representing elected national governments.",
        title: "The EU is just an unelected bureaucracy",
      },
      {
        point:
          "The EU has become a superstate that simply overrides member democracies.",
        response:
          "The EU can act only within competences conferred by the treaties. In many areas the Council and national governments remain central, some decisions require unanimity, treaty change needs every member state's agreement, and national parliaments still police subsidiarity.",
        title: "The EU has replaced national democracy",
      },
      {
        point:
          "If the system is this slow and negotiated, that proves it is dysfunctional rather than democratic.",
        response:
          "A multilingual union of 27 member states will always trade speed for legitimacy and coordination. The question is not whether the system is fast, but whether its veto points, representation channels, and implementation burdens are visible and accountable.",
        title: "Slow decision-making means broken decision-making",
      },
    ],
    causalLoop: {
      description:
        "EU lawmaking is a hybrid loop between supranational initiative and member-state bargaining. The Commission proposes, Parliament and Council co-legislate, national governments implement, and the resulting political feedback shapes the next agenda cycle.",
      edges: [
        { from: "euPriorities", label: "shape", polarity: "positive", to: "commissionAgenda" },
        { from: "commissionAgenda", label: "becomes", polarity: "positive", to: "commissionProposal" },
        { from: "commissionProposal", label: "enters", polarity: "positive", to: "parliamentCouncilBargain" },
        { from: "memberStateAlignment", label: "speeds", polarity: "positive", to: "parliamentCouncilBargain" },
        { from: "parliamentCouncilBargain", label: "produces", polarity: "positive", to: "adoptedLaw" },
        { from: "adoptedLaw", label: "requires", polarity: "positive", to: "nationalImplementation" },
        { from: "nationalImplementation", label: "shapes", polarity: "positive", to: "publicLegitimacy" },
        { from: "publicLegitimacy", label: "feeds back into", polarity: "positive", to: "euPriorities" },
        { from: "memberStateAlignment", label: "reduces need for", polarity: "negative", to: "summitEscalation" },
        { from: "summitEscalation", label: "pushes", polarity: "positive", to: "euPriorities" },
      ],
      loops: [
        "Reinforcing: political priorities → Commission agenda → proposal → adoption → implementation → political feedback → next priorities",
        "Balancing: disagreement among member states slows bargaining and pushes issues upward to the European Council for political steering",
      ],
      nodes: [
        { id: "euPriorities", label: "European priorities", tone: "amber", x: 80, y: 80 },
        { id: "commissionAgenda", label: "Commission agenda", tone: "cyan", x: 280, y: 40 },
        { id: "commissionProposal", label: "Legislative proposal", tone: "cyan", x: 500, y: 100 },
        { id: "parliamentCouncilBargain", label: "Parliament-Council bargaining", tone: "emerald", x: 500, y: 280 },
        { id: "adoptedLaw", label: "Adopted EU law", tone: "emerald", x: 280, y: 360 },
        { id: "nationalImplementation", label: "National implementation", tone: "amber", x: 80, y: 320 },
        { id: "publicLegitimacy", label: "Public legitimacy", tone: "rose", x: 80, y: 180 },
        { id: "memberStateAlignment", label: "Member-state alignment", tone: "amber", x: 280, y: 180 },
        { id: "summitEscalation", label: "European Council escalation", tone: "rose", x: 500, y: 420 },
      ],
      title: "The EU lawmaking feedback loop",
    },
    difficulty: "Intermediate",
    discussionPrompt:
      "If the EU is not a nation-state but also not just a treaty club, what kind of democratic system is it? Which parts should become more directly political, and which parts should stay negotiated between member states?",
    eyebrow: "Institutional design",
    heroHighlights: [
      "The EU is a union of 27 member states, not a single state with one simple chain of command.",
      "Most EU laws are made through the ordinary legislative procedure: the Commission proposes, and Parliament plus Council must agree.",
      "The European Council sets broad political direction, but it does not itself pass EU laws.",
    ],
    miniLesson: {
      bands: [
        {
          insight:
            "Low institutional alignment. The Commission can still propose, but Parliament and Council are far apart, so bargaining is slow and summit-level political steering becomes more important.",
          threshold: 0,
        },
        {
          insight:
            "Partial alignment. Committees, rapporteurs, working parties, and trilogues do most of the hard work of finding a text both Parliament and Council can live with.",
          threshold: 35,
        },
        {
          insight:
            "High alignment. Ordinary legislative procedure moves faster because the main institutions already agree on the broad direction and can compromise on details.",
          threshold: 70,
        },
        {
          insight:
            "Very high alignment or crisis mode. The system can move quickly, but speed may come with concerns about scrutiny, implementation capacity, or how much space remained for dissent.",
          threshold: 90,
        },
      ],
      defaultValue: 45,
      description:
        "This slider simplifies one major variable in EU decision-making: how closely aligned the Commission, Parliament, and member-state governments are on the direction of travel.",
      highLabel: "High institutional alignment",
      lowLabel: "Low institutional alignment",
      metrics: [
        {
          base: 22,
          description: "How quickly proposals can move from initiative to adopted text.",
          key: "eu-adoption-speed",
          label: "Adoption speed",
          max: 100,
          min: 0,
          slope: 0.75,
          suffix: "/100",
          tone: "emerald",
        },
        {
          base: 82,
          description: "How much conflict, amendment churn, and procedural friction appear between co-legislators.",
          key: "eu-bargaining-friction",
          label: "Bargaining friction",
          max: 100,
          min: 0,
          slope: -0.68,
          suffix: "/100",
          tone: "rose",
        },
        {
          base: 78,
          description: "How likely political disputes are to spill into national implementation disputes or summit-level escalation.",
          key: "eu-national-friction",
          label: "National friction",
          max: 100,
          min: 0,
          slope: -0.55,
          suffix: "/100",
          tone: "amber",
        },
      ],
      prompt:
        "Move the slider to see how alignment changes speed, friction, and the likelihood that a proposal gets kicked upward into broader political bargaining.",
      sliderLabel: "Alignment across Commission, Parliament, and Council",
      step: 1,
      title: "Mini lesson: the EU runs on negotiated alignment",
      unit: "%",
      valueMax: 100,
      valueMin: 0,
    },
    readingTime: "8 min",
    realWorldExamples: [
      {
        insight:
          "The EU's strongest laws often come from the ordinary legislative procedure, not from one institution acting alone. Commission initiative plus Parliament-Council bargaining is the normal pattern.",
        outcome:
          "The GDPR began as a Commission proposal and was jointly shaped by Parliament and the Council before becoming an EU regulation that applied directly across member states.",
        title: "GDPR and co-legislation",
      },
      {
        insight:
          "Fast-moving technology policy shows how central trilogue compromise has become. Parliament, member states, and Commission often agree only after intense interinstitutional negotiation.",
        outcome:
          "The AI Act moved through the standard EU legislative architecture, with major changes emerging through negotiations between Parliament and the Council after the Commission's original proposal.",
        title: "The AI Act and trilogue bargaining",
      },
      {
        insight:
          "Not everything works like ordinary legislation. The biggest constitutional shifts still depend on the member states themselves, which is why treaty change is rare and politically demanding.",
        outcome:
          "Treaty revision requires the unanimous agreement of all 27 EU countries, making constitutional change much harder than passing an ordinary regulation or directive.",
        title: "Treaty change and unanimity",
      },
    ],
    relatedFrameworks: [
      "Ordinary legislative procedure",
      "Qualified majority voting",
      "Subsidiarity",
      "Trilogues",
      "Delegated and implementing acts",
    ],
    simulationPrompt:
      "Route a Commission proposal through Parliament committees, Council working groups, trilogues, qualified-majority voting, and national implementation to see where EU decisions slow down or succeed.",
    simpleExplanation: [
      "The European Union is not a normal state and not just an international organization either. It is a hybrid system in which 27 member states share some powers through common institutions while keeping many powers at the national level.",
      "In most EU lawmaking, three institutions matter most. The European Commission proposes legislation. The European Parliament represents EU citizens through direct elections. The Council of the European Union represents the governments of the member states. In the ordinary legislative procedure, Parliament and Council must agree on the text.",
      "That means the EU's lawmaking chain is less like a single parliament and more like a structured negotiation between citizens' representation and governments' representation, with the Commission setting the formal agenda. If Parliament and Council cannot agree, the proposal can move into second readings and conciliation.",
      "There are important extras. The European Council sets broad political direction but does not itself pass laws. National parliaments can raise subsidiarity objections in shared competences. And some areas, such as treaty change, follow special procedures or require unanimity rather than ordinary co-decision.",
    ],
    simulatorSlug: "eu-decision-making",
    slug: "how-the-eu-makes-decisions",
    summary:
      "The EU governs through a hybrid decision system: the Commission proposes, Parliament and Council usually co-legislate, and member states remain central through implementation, Council bargaining, and treaty control.",
    systemBug: {
      signals: [
        "People regularly confuse the European Council, the Council of the EU, and the European Commission.",
        "Critics and defenders alike often talk about 'Brussels' as if it were one actor with one democratic mandate.",
        "When implementation goes badly, blame is often assigned to the EU level without distinguishing between EU law design and national execution.",
      ],
      summary:
        "The biggest bug is institutional opacity. When people cannot tell who proposes, who amends, who adopts, and who implements, accountability becomes blurry and serious reform debates turn into slogans.",
      title: "System bug: one label, many institutions, blurry accountability",
    },
    title: "How the European Union makes decisions",
  },
  {
    accent: "amber",
    betterMetrics: [
      {
        description:
          "How many proposed laws die in committee, the Senate calendar, or cross-chamber bargaining before reaching the president.",
        label: "Legislative bottleneck rate",
      },
      {
        description:
          "How often Senate action depends on cloture, filibuster management, or other supermajority-style hurdles not found in the Constitution itself.",
        label: "Senate cloture dependence",
      },
      {
        description:
          "How often divided institutions shift policymaking from Congress toward executive action and litigation.",
        label: "Executive-order / litigation substitution",
      },
      {
        description:
          "Whether basic budget and appropriations deadlines are met without crisis politics, continuing resolutions, or shutdown threats.",
        label: "Budget-governance stability",
      },
    ],
    betterMetricsTitle: "Signals that show how the U.S. system really works",
    counterArguments: [
      {
        point:
          "The U.S. system is supposed to be slow. If majorities cannot easily pass laws, that is proof that checks and balances are working.",
        response:
          "Checks matter. But when the number of veto points becomes so high that broad, durable public support still cannot become law, the system can slide from restraint into paralysis or minority obstruction.",
        title: "Gridlock is always a democratic virtue",
      },
      {
        point:
          "The President effectively runs the government, so Congress matters mainly for symbolism and partisan theater.",
        response:
          "The president leads the executive branch, but Congress writes laws, controls appropriations, confirms many appointments through the Senate, and can block or reshape the president's agenda. The president is powerful, but not a parliamentary prime minister.",
        title: "The President basically governs alone",
      },
      {
        point:
          "The Supreme Court is just another political branch, so treating judicial review as distinct from ordinary politics is naive.",
        response:
          "The Court is unavoidably political in consequence, but its structure is distinct: life tenure, case-driven review, and constitutional interpretation let it shape policy without direct electoral turnover. That makes it a different kind of veto point.",
        title: "Courts are just ordinary politics by other means",
      },
    ],
    causalLoop: {
      description:
        "The U.S. system routes policy through multiple veto points. Elections shape House, Senate, and presidency separately; legislation then depends on bicameral agreement, presidential approval, agency implementation, and often court review.",
      edges: [
        { from: "publicDemand", label: "shapes", polarity: "positive", to: "elections" },
        { from: "elections", label: "set", polarity: "positive", to: "houseMajority" },
        { from: "elections", label: "set", polarity: "positive", to: "senateMajority" },
        { from: "elections", label: "select", polarity: "positive", to: "president" },
        { from: "houseMajority", label: "enters", polarity: "positive", to: "legislativeBargain" },
        { from: "senateMajority", label: "enters", polarity: "positive", to: "legislativeBargain" },
        { from: "president", label: "pressures", polarity: "positive", to: "legislativeBargain" },
        { from: "legislativeBargain", label: "produces", polarity: "positive", to: "enactedLaw" },
        { from: "enactedLaw", label: "delegates to", polarity: "positive", to: "agencies" },
        { from: "agencies", label: "triggers", polarity: "positive", to: "courtReview" },
        { from: "courtReview", label: "shapes", polarity: "positive", to: "policyDurability" },
        { from: "policyDurability", label: "feeds back into", polarity: "positive", to: "publicDemand" },
        { from: "institutionalDivision", label: "reduces", polarity: "negative", to: "legislativeBargain" },
        { from: "institutionalDivision", label: "raises reliance on", polarity: "positive", to: "agencies" },
      ],
      loops: [
        "Reinforcing: elections produce institutional control, which shapes laws, implementation, and outcomes, which then reshape future elections",
        "Balancing: divided government and multiple veto points slow or block legislation, shifting conflict into executive action and courts",
      ],
      nodes: [
        { id: "publicDemand", label: "Public demand", tone: "cyan", x: 80, y: 100 },
        { id: "elections", label: "Separate elections", tone: "amber", x: 280, y: 40 },
        { id: "houseMajority", label: "House majority", tone: "amber", x: 500, y: 40 },
        { id: "senateMajority", label: "Senate majority", tone: "amber", x: 500, y: 180 },
        { id: "president", label: "President", tone: "emerald", x: 500, y: 320 },
        { id: "legislativeBargain", label: "Legislative bargaining", tone: "rose", x: 280, y: 180 },
        { id: "enactedLaw", label: "Enacted law", tone: "emerald", x: 80, y: 220 },
        { id: "agencies", label: "Agency implementation", tone: "cyan", x: 80, y: 360 },
        { id: "courtReview", label: "Court review", tone: "rose", x: 280, y: 360 },
        { id: "policyDurability", label: "Policy durability", tone: "emerald", x: 500, y: 420 },
        { id: "institutionalDivision", label: "Institutional division", tone: "rose", x: 280, y: 500 },
      ],
      title: "The U.S. veto-point loop",
    },
    difficulty: "Intermediate",
    discussionPrompt:
      "At what point do checks and balances stop protecting liberty and start protecting deadlock? Which veto points in the U.S. system are constitutional, and which are historical rules layered on later?",
    eyebrow: "Institutional design",
    heroHighlights: [
      "The U.S. federal government splits power across House, Senate, presidency, courts, and the states rather than concentrating it in one elected majority.",
      "The House has 435 voting members by population; the Senate has 100 members with two per state, regardless of size.",
      "Even after both chambers act, the president can veto and courts can still reshape the result.",
    ],
    miniLesson: {
      bands: [
        {
          insight:
            "Low cross-branch division. Unified party control does not eliminate bargaining, but it raises the odds that major legislation can move all the way through Congress and the presidency.",
          threshold: 0,
        },
        {
          insight:
            "Moderate division. Bargaining becomes harder, committees and Senate procedure matter more, and budget deadlines start to become leverage points.",
          threshold: 35,
        },
        {
          insight:
            "High division. Congress struggles to legislate, so presidents lean more on executive action and agencies, while courts become more consequential to policy.",
          threshold: 70,
        },
        {
          insight:
            "Extreme polarization and division. Shutdown threats, reconciliation fights, and litigation politics become normal tools because the ordinary legislative route is clogged.",
          threshold: 90,
        },
      ],
      defaultValue: 55,
      description:
        "This slider compresses one important variable in U.S. governance: how politically divided the House, Senate, and presidency are from one another.",
      highLabel: "Deep institutional division",
      lowLabel: "Unified government",
      metrics: [
        {
          base: 84,
          description: "How likely major bills are to survive all the veto points needed to become federal law.",
          key: "us-law-passage",
          label: "Law passage probability",
          max: 100,
          min: 0,
          slope: -0.78,
          suffix: "/100",
          tone: "emerald",
        },
        {
          base: 18,
          description: "How much policymaking shifts toward executive orders, waivers, agency rulemaking, and prosecutorial discretion.",
          key: "us-executive-unilateralism",
          label: "Executive unilateralism",
          max: 100,
          min: 0,
          slope: 0.58,
          suffix: "/100",
          tone: "amber",
        },
        {
          base: 24,
          description: "How central courts become to major policy disputes when legislation stalls or statutes are broad and contested.",
          key: "us-court-salience",
          label: "Court salience",
          max: 100,
          min: 0,
          slope: 0.52,
          suffix: "/100",
          tone: "rose",
        },
      ],
      prompt:
        "Move the slider to see how divided government changes legislative output, executive improvisation, and the role of courts.",
      sliderLabel: "Cross-branch partisan division",
      step: 1,
      title: "Mini lesson: many veto points, one policy outcome",
      unit: "%",
      valueMax: 100,
      valueMin: 0,
    },
    readingTime: "8 min",
    realWorldExamples: [
      {
        insight:
          "Major federal laws often depend not only on majority support but on surviving Senate procedure. Bicameralism plus Senate rules can dramatically raise the threshold for action.",
        outcome:
          "The Civil Rights Act of 1964 passed the House, then required the Senate to defeat a long filibuster before final passage and presidential signature were possible.",
        title: "Civil Rights Act and Senate procedure",
      },
      {
        insight:
          "Passing the same broad policy through two chambers is rarely linear. Different chamber coalitions, procedural rules, and presidential timing all reshape the final law.",
        outcome:
          "The Affordable Care Act depended on separate House and Senate bargaining, plus follow-up budget reconciliation, showing how bicameralism and procedure can be as important as headline ideology.",
        title: "The Affordable Care Act as bicameral bargaining",
      },
      {
        insight:
          "Even after Congress legislates and agencies act, courts can narrow or reinterpret what the executive branch is allowed to do under the statute.",
        outcome:
          "In West Virginia v. EPA, the Supreme Court limited how broadly the Environmental Protection Agency could regulate under existing statutory authority, illustrating the judiciary's role as a major policy veto point.",
        title: "Judicial review and agency power",
      },
    ],
    relatedFrameworks: [
      "Separation of powers",
      "Bicameralism",
      "Filibuster and cloture",
      "Judicial review",
      "Federalism",
    ],
    simulationPrompt:
      "Route a federal bill through committee, House floor, Senate procedure, conference bargaining, presidential veto, agency implementation, and court review to test where U.S. decision-making jams.",
    simpleExplanation: [
      "The U.S. governing system is built around separated powers rather than a single parliamentary majority. Congress writes laws, the president executes them, and the courts interpret them. That structure is then layered with federalism, because states also have their own powers and institutions.",
      "Congress itself has two chambers with different logics. The House of Representatives is population-based and has 435 voting members. The Senate has 100 members, two per state, regardless of population. A bill normally has to pass both chambers in the same form before it goes to the president, and revenue bills must originate in the House.",
      "The president heads the executive branch, appoints agency leaders and many officials, can sign or veto legislation, and directs implementation through departments and agencies. The Senate also has special roles outside ordinary lawmaking, such as confirming many appointments and consenting to treaties.",
      "On top of that, the judiciary can review laws and executive actions, and the president is chosen through the Electoral College rather than by a direct national popular vote. The result is a system with many veto points: it can prevent rapid concentration of power, but it can also make broad public demands very hard to translate into law.",
    ],
    simulatorSlug: "us-decision-making",
    slug: "how-the-us-government-makes-decisions",
    summary:
      "The U.S. system spreads power across House, Senate, president, courts, and states. That creates strong checks and many veto points, making governing as much about procedure and institutional alignment as about winning elections.",
    systemBug: {
      signals: [
        "Popular proposals can win broad public support yet still die in committee, in the Senate, or through veto threats.",
        "Budget deadlines repeatedly become crisis points because ordinary legislative bargaining is so hard.",
        "Presidents and courts become more central to policy when Congress cannot produce durable statutes.",
      ],
      summary:
        "The core bug is not one bad actor but a dense veto-point architecture. Because power is split so many ways, the system can protect against domination while also protecting stalemate and minority obstruction.",
      title: "System bug: so many veto points that policy can stall everywhere",
    },
    title: "How the United States government makes decisions",
  },
  {
    accent: "amber",
    betterMetrics: [
      {
        description:
          "How cheaply a movement can copy and circulate its arguments across towns, congregations, and trading routes.",
        label: "Message replication cost",
      },
      {
        description:
          "How many local reading circles, congregations, or petition networks can repeat the same frame in their own language.",
        label: "Local organizer density",
      },
      {
        description:
          "Whether printers, merchants, nobles, or officials defect from the old order and give the movement protection or resources.",
        label: "Elite shelter and defections",
      },
      {
        description:
          "Whether copied ideas turn into changed laws, church settlements, or durable civic practices rather than staying as scattered dissent.",
        label: "Institutional conversion rate",
      },
    ],
    betterMetricsTitle: "Signals that a print-era movement is becoming mass politics",
    counterArguments: [
      {
        point:
          "The printing press caused these movements by itself, so the main story is technology rather than social conflict.",
        response:
          "Cheaper copying mattered, but only because it met real grievances: church corruption, exclusion from voice, slavery, taxation, or blocked reform. Technology lowers coordination costs; it does not invent the grievance.",
        title: "Technology alone explains the movement",
      },
      {
        point:
          "Early movements like the Reformation were only theological disputes, not political struggles.",
        response:
          "Once ideas could be reproduced widely in vernacular languages, doctrinal disputes became arguments about authority, taxation, education, censorship, and who could speak for the community. That is already politics.",
        title: "They were religious, not political",
      },
      {
        point:
          "Pre-modern rulers were too strong for anything resembling mass politics to exist.",
        response:
          "Repression was strong, but rulers also depended on printers, merchants, local officials, and tax-paying subjects. When ideas spread faster than authorities could contain them, even early states had to negotiate, co-opt, or split.",
        title: "States were too strong for movements to matter",
      },
    ],
    causalLoop: {
      description:
        "When copying ideas becomes cheaper, grievances can travel farther than rumor. Shared texts create local circles, petitions, and moral pressure; if some elites defect from the old order, movements gain protection and turn argument into institutional change.",
      edges: [
        { from: "cheapPrint", label: "widens", polarity: "positive", to: "ideaCirculation" },
        { from: "ideaCirculation", label: "builds", polarity: "positive", to: "sharedFrame" },
        { from: "sharedFrame", label: "organizes", polarity: "positive", to: "localCircles" },
        { from: "localCircles", label: "raises", polarity: "positive", to: "publicPressure" },
        { from: "publicPressure", label: "pushes", polarity: "positive", to: "institutionalChange" },
        { from: "institutionalChange", label: "legitimizes", polarity: "positive", to: "movementDurability" },
        { from: "publicPressure", label: "provokes", polarity: "positive", to: "repression" },
        { from: "repression", label: "disrupts", polarity: "negative", to: "localCircles" },
        { from: "eliteProtection", label: "reduces", polarity: "negative", to: "repression" },
        { from: "eliteProtection", label: "extends", polarity: "positive", to: "movementDurability" },
      ],
      loops: [
        "Reinforcing: cheap copying -> shared frame -> local circles -> public pressure -> institutional wins -> movement durability",
        "Balancing: repression can break local circles unless parts of the elite shelter the movement long enough for it to scale",
      ],
      nodes: [
        { id: "cheapPrint", label: "Cheap print access", tone: "amber", x: 80, y: 80 },
        { id: "ideaCirculation", label: "Idea circulation", tone: "cyan", x: 280, y: 40 },
        { id: "sharedFrame", label: "Shared moral frame", tone: "emerald", x: 500, y: 100 },
        { id: "localCircles", label: "Local circles and sermons", tone: "emerald", x: 500, y: 280 },
        { id: "publicPressure", label: "Petitions and public pressure", tone: "rose", x: 280, y: 340 },
        { id: "institutionalChange", label: "Institutional change", tone: "amber", x: 80, y: 300 },
        { id: "movementDurability", label: "Movement durability", tone: "emerald", x: 80, y: 180 },
        { id: "repression", label: "Censorship and repression", tone: "rose", x: 280, y: 500 },
        { id: "eliteProtection", label: "Elite protection", tone: "cyan", x: 500, y: 440 },
      ],
      title: "The print-era mobilization loop",
    },
    difficulty: "Intermediate",
    discussionPrompt:
      "When does a new communication technology simply spread noise, and when does it become the backbone of a real movement? What else has to be present besides the tool itself?",
    eyebrow: "Movement families",
    heroHighlights: [
      "Cheap print turned sermons, pamphlets, and petitions into scalable political tools.",
      "Movements spread faster when people could read arguments in their own language rather than through elite gatekeepers.",
      "Success usually required both grassroots repetition and elite splits that made repression harder.",
    ],
    miniLesson: {
      accent: "amber",
      conclusion:
        "Print-era movements became historic turning points when lower communication costs met real grievances, recognizable moral language, and enough organizational shelter to survive censorship.",
      metrics: [
        {
          description: "How expensive it is to copy arguments and transport them across communities",
          high: "Cheap pamphlets, broadsides, and sermons",
          label: "Communication cost",
          low: "Manuscript copying and elite-controlled speech",
          signal: "lower cost -> wider recruitment",
        },
        {
          description: "Whether ordinary people can join the debate in the language they already use",
          high: "Vernacular texts and local preaching",
          label: "Language reach",
          low: "Restricted scholarly or clerical language",
          signal: "greater reach -> stronger identity",
        },
        {
          description: "Whether printers, merchants, nobles, or officials protect the movement long enough to scale",
          high: "Visible defectors and patrons",
          label: "Elite shelter",
          low: "No protection from censorship",
          signal: "more shelter -> more durability",
        },
      ],
      subtitle: "When copied words became a political force",
      title: "Mini lesson: the first low-cost mass messaging systems",
    },
    readingTime: "8 min",
    realWorldExamples: [
      {
        insight:
          "The Protestant Reformation spread because criticism of church authority could now be reproduced rapidly, translated, debated, and carried across cities rather than staying local to one scholar or monastery.",
        outcome:
          "What began as disputes over indulgences and authority became a continental rupture in church power, education, state formation, and political legitimacy.",
        title: "The Reformation as a print-amplified movement",
      },
      {
        insight:
          "Abolitionists combined moral testimony, pamphlets, boycotts, and petitioning to transform slavery from a commercial issue into a public moral crisis.",
        outcome:
          "The British campaign against the slave trade became one of the first modern mass petition movements, contributing to the 1807 abolition of the British slave trade and later abolition struggles.",
        title: "Abolitionist print and petition networks",
      },
      {
        insight:
          "Seventeenth-century petitioners and radical pamphleteers learned that the same text could coordinate thousands of people who would never meet in one room.",
        outcome:
          "English petition campaigns and Leveller-style pamphlet politics widened expectations about who could speak to Parliament and on what terms.",
        title: "Pamphlet politics and petition culture",
      },
    ],
    relatedFrameworks: [
      "Public sphere",
      "Petition politics",
      "Vernacularization",
      "Moral shock",
      "Print capitalism",
    ],
    simulationPrompt:
      "Compare a movement with cheap print, vernacular messaging, and elite defections against one facing high copying costs, censorship, and no institutional allies.",
    simulatorSlug: "social-movements",
    simpleExplanation: [
      "Many early social movements became possible when the cost of copying ideas fell sharply. Before that, dissent could exist, but it traveled slowly and depended heavily on priests, nobles, or scholars. Print allowed ideas to move between towns, ports, congregations, and workshops much more quickly.",
      "That matters because movements are not just bursts of anger. They require a shared story about what is wrong, why it is wrong, and what ought to replace it. Pamphlets, translated Bibles, broadsides, petitions, and printed testimony helped ordinary people recognize that their grievance was not purely local.",
      "These movements succeeded when they combined three things: a grievance that many people could recognize, a communication technology that made repetition cheap, and enough organizational shelter to resist repression. Churches, merchants, sympathetic rulers, printers, and reform-minded officials often played that sheltering role.",
      "Their turning points were not only policy wins. They changed who counted as a political actor. Print-era movements widened the public sphere itself, making it harder for established institutions to monopolize knowledge, legitimacy, and the right to speak for society.",
    ],
    slug: "how-print-era-movements-turned-ideas-into-power",
    summary:
      "Early mass movements often emerged when cheap copying, vernacular language, and moral framing turned local grievances into a public campaign that elites could no longer fully contain.",
    systemBug: {
      signals: [
        "Authorities treat communication tools as neutral even after they radically lower the cost of coordination.",
        "Movements are remembered as pure ideas while the printers, petitioners, and organizers who scaled them disappear from the story.",
        "People assume early publics were passive, even when petitioning and pamphleteering were already reshaping institutions.",
      ],
      summary:
        "The hidden bug is monopoly over speech. When only a few institutions can copy, certify, and distribute ideas, political power stays narrow; when that monopoly weakens, public life expands and conflict becomes harder to contain privately.",
      title: "System bug: control over communication is control over politics",
    },
    title: "How print-era movements turned ideas into power",
  },
  {
    accent: "emerald",
    betterMetrics: [
      {
        description:
          "How concentrated workers, reformers, or excluded voters are in cities, factories, and associations where they can coordinate repeatedly.",
        label: "Concentration of participants",
      },
      {
        description:
          "How many stable organizations collect dues, train leaders, print newspapers, and keep campaigning after a failed petition or strike.",
        label: "Organizational durability",
      },
      {
        description:
          "How quickly railways, telegraphs, and cheap newspapers let one local dispute become a national campaign.",
        label: "National coordination speed",
      },
      {
        description:
          "Whether disruption at work or in elections can be converted into labor law, suffrage reform, or party representation.",
        label: "Policy conversion capacity",
      },
    ],
    betterMetricsTitle: "Signals that industrial-era movements can win durable rights",
    counterArguments: [
      {
        point:
          "Industrial reform happened because elites gradually modernized society, not because movements forced the issue.",
        response:
          "Industrial elites and states often conceded only after repeated strikes, petitions, unrest, and organized campaigns made the existing order costly or unstable. Reform was negotiated under pressure.",
        title: "Rights arrived through elite modernization alone",
      },
      {
        point:
          "Labor struggles and suffrage struggles were separate stories with little overlap.",
        response:
          "In practice they often overlapped. Questions about who works, who votes, who can sit in Parliament, and who bears industrial risk were deeply linked in the politics of the nineteenth and early twentieth centuries.",
        title: "Labor and voting rights were separate movements",
      },
      {
        point:
          "Industrial protests mostly produced chaos and repression rather than useful reform.",
        response:
          "Many campaigns did face repression, but over time they created durable institutions: unions, mutual aid societies, mass parties, and expanded voting rights. Those institutional legacies are part of what made later welfare states possible.",
        title: "Industrial protest only created disorder",
      },
    ],
    causalLoop: {
      description:
        "Industrialization concentrated people, grievances, and communication routes in one place. That made it easier to build unions, suffrage organizations, and reform parties that could survive defeat and return stronger.",
      edges: [
        { from: "industrialConcentration", label: "raises", polarity: "positive", to: "sharedGrievance" },
        { from: "sharedGrievance", label: "feeds", polarity: "positive", to: "associations" },
        { from: "transportMedia", label: "connects", polarity: "positive", to: "associations" },
        { from: "associations", label: "build", polarity: "positive", to: "strikePetitionPower" },
        { from: "strikePetitionPower", label: "pushes", polarity: "positive", to: "stateConcessions" },
        { from: "stateConcessions", label: "expand", polarity: "positive", to: "politicalInclusion" },
        { from: "politicalInclusion", label: "strengthens", polarity: "positive", to: "associations" },
        { from: "stateRepression", label: "breaks", polarity: "negative", to: "associations" },
        { from: "strikePetitionPower", label: "provokes", polarity: "positive", to: "stateRepression" },
        { from: "warShock", label: "weakens resistance to", polarity: "positive", to: "stateConcessions" },
      ],
      loops: [
        "Reinforcing: concentration -> associations -> disruptive capacity -> concessions -> broader inclusion -> stronger associations",
        "Balancing: repression can break organizations, but transport, newspapers, and repeated membership structures often let them rebuild",
      ],
      nodes: [
        { id: "industrialConcentration", label: "Industrial concentration", tone: "amber", x: 80, y: 60 },
        { id: "sharedGrievance", label: "Shared workplace grievance", tone: "rose", x: 280, y: 40 },
        { id: "transportMedia", label: "Rail, telegraph, press", tone: "cyan", x: 500, y: 80 },
        { id: "associations", label: "Unions and suffrage groups", tone: "emerald", x: 500, y: 260 },
        { id: "strikePetitionPower", label: "Strike and petition power", tone: "rose", x: 280, y: 320 },
        { id: "stateConcessions", label: "State concessions", tone: "amber", x: 80, y: 280 },
        { id: "politicalInclusion", label: "Political inclusion", tone: "emerald", x: 80, y: 160 },
        { id: "stateRepression", label: "State repression", tone: "rose", x: 280, y: 500 },
        { id: "warShock", label: "War and crisis shocks", tone: "cyan", x: 500, y: 420 },
      ],
      title: "The industrial mass-movement loop",
    },
    difficulty: "Intermediate",
    discussionPrompt:
      "Why did factories, railways, and newspapers help oppositional movements as much as they helped the industrial economy itself? Which mattered more: shared hardship, or the new ability to coordinate at scale?",
    eyebrow: "Movement families",
    heroHighlights: [
      "Factories and cities concentrated people who shared the same risks and demands.",
      "Railways, telegraphs, and cheap newspapers helped local campaigns become national ones.",
      "Movements became durable when they built organizations that could survive a lost strike or failed petition.",
    ],
    miniLesson: {
      accent: "emerald",
      conclusion:
        "Industrial-era movements won more than headlines when they combined large concentrated constituencies, repeated organization, and tactics that could disrupt production or elections until reform became cheaper than refusal.",
      metrics: [
        {
          description: "How tightly people are clustered in workplaces and cities that support repeated organizing",
          high: "Large factories and dense cities",
          label: "Participant concentration",
          low: "Scattered households with little contact",
          signal: "more concentration -> faster mobilization",
        },
        {
          description: "How strong the movement's recurring institutions are after the first burst of protest",
          high: "Unions, dues, newspapers, mutual aid",
          label: "Organizational depth",
          low: "One-off rallies without structure",
          signal: "more depth -> greater staying power",
        },
        {
          description: "Whether the movement can turn grievance into leverage over production or representation",
          high: "Strikes, mass petitions, voting blocs",
          label: "Leverage",
          low: "Moral appeal only",
          signal: "more leverage -> more concessions",
        },
      ],
      subtitle: "Why the industrial age created mass membership politics",
      title: "Mini lesson: from crowd protest to durable organization",
    },
    readingTime: "8 min",
    realWorldExamples: [
      {
        insight:
          "The Chartists showed how industrial workers could use a national charter, monster petitions, meetings, and newspapers to make electoral exclusion visible across Britain.",
        outcome:
          "The movement failed to win all six demands at once, but many of its demands later became standard democratic practice, and it helped normalize working-class mass politics.",
        title: "Chartism and petition-driven mass politics",
      },
      {
        insight:
          "Labor movements won not because strikes always succeeded immediately, but because repeated workplace organization made employers and states face rising costs of refusing reform.",
        outcome:
          "Campaigns around hours, safety, collective bargaining, and child labor helped produce factory legislation, union recognition, and labor parties in many industrial countries.",
        title: "Labor movements and workplace leverage",
      },
      {
        insight:
          "Suffrage movements gained momentum when longstanding organizing met a legitimacy shock large enough to move the political center.",
        outcome:
          "In Britain, years of campaigning combined with wartime political change to help produce the Representation of the People Act 1918 and later equal franchise reforms.",
        title: "Women's suffrage and political inclusion",
      },
    ],
    relatedFrameworks: [
      "Mass membership politics",
      "Trade unionism",
      "Collective action",
      "Resource mobilization",
      "Political opportunity structures",
    ],
    simulationPrompt:
      "Compare an industrial movement with dense unions, mass press, and strike leverage against one with scattered workers, weak organizations, and no national coordination.",
    simulatorSlug: "social-movements",
    simpleExplanation: [
      "Industrial-era movements were different from earlier movements because the economy itself started to gather people together. Factories, mines, mills, rail hubs, and expanding cities created large populations exposed to the same employer, the same schedules, and often the same political exclusion.",
      "That concentration made organization easier. A union hall, friendly society, newspaper, or suffrage committee could recruit from a shared daily environment. Railways and telegraphs helped these local campaigns become national campaigns, so a strike or petition could no longer be dismissed as a purely local disturbance.",
      "Success usually depended on durable institutions. A crowd can protest once, but a union with dues, a newspaper, a legal committee, and local chapters can come back after defeat. Industrial movements became powerful when they could survive repression, coordinate across regions, and impose real economic or electoral costs.",
      "Their turning points often came when governments faced both moral pressure and practical disruption. That is why labor reform, wider suffrage, and party representation tended to arrive unevenly, after repeated cycles of mobilization rather than one single speech or one famous march.",
    ],
    slug: "how-industrial-mass-movements-won-rights",
    summary:
      "Industrial mass movements succeeded when concentrated populations built durable organizations and could turn shared grievance into leverage over production, voting, and legitimacy.",
    systemBug: {
      signals: [
        "Democratic histories often celebrate the final reform act while skipping the decades of organizing that made it unavoidable.",
        "Economic growth is remembered as if it naturally delivered labor rights, even when workers had to fight for nearly every protection.",
        "Short-term defeats are misread as failure, even when they build the organizations that win later rounds.",
      ],
      summary:
        "The hidden bug is treating society as if markets modernize politics automatically. In reality, industrial capitalism often concentrated wealth and exclusion faster than it expanded rights, forcing movements to organize the missing democracy themselves.",
      title: "System bug: industrial growth does not automatically distribute power",
    },
    title: "How industrial mass movements won labor and voting rights",
  },
  {
    accent: "cyan",
    betterMetrics: [
      {
        description:
          "How deeply colonial extraction, hierarchy, and exclusion are felt across workers, peasants, students, and local elites.",
        label: "Extraction and grievance intensity",
      },
      {
        description:
          "How many schools, newspapers, unions, parties, or religious networks can carry a national frame beyond one city or class.",
        label: "National organizing infrastructure",
      },
      {
        description:
          "Whether war, fiscal stress, or international pressure weakens the empire's willingness or ability to rule by force.",
        label: "Imperial vulnerability",
      },
      {
        description:
          "Whether the movement can govern after independence rather than winning sovereignty only in name.",
        label: "Post-independence state capacity",
      },
    ],
    betterMetricsTitle: "Signals that an anti-colonial movement can break empire",
    counterArguments: [
      {
        point:
          "Empires gave up colonies because they became too expensive, not because anti-colonial movements changed history.",
        response:
          "Imperial overstretch mattered, but it rarely translated into independence automatically. Organized boycotts, strikes, parties, diplomatic campaigns, and insurgencies turned imperial weakness into a political break.",
        title: "Empires simply walked away",
      },
      {
        point:
          "Anti-colonial movements were basically elite nationalist projects with little mass participation.",
        response:
          "Many were led by educated elites, but the decisive movements usually built mass participation through workers, farmers, students, religious institutions, or veterans. Without that broader base, nationalist claims stayed narrow.",
        title: "Only elites mattered",
      },
      {
        point:
          "Once a colony becomes independent, the anti-colonial project is complete.",
        response:
          "Formal sovereignty is a turning point, not the end of the story. Borders, debt, trade dependence, military structures, and elite bargains often leave deep colonial legacies inside the new state.",
        title: "Independence solved the problem",
      },
    ],
    causalLoop: {
      description:
        "Colonial extraction generates grievance, but grievance becomes independence only when organizing infrastructure, imperial weakness, and international legitimacy line up. Winning sovereignty then creates a second challenge: whether the movement can build a state stronger than the colonial shell it inherits.",
      edges: [
        { from: "colonialExtraction", label: "drives", polarity: "positive", to: "massGrievance" },
        { from: "massGrievance", label: "feeds", polarity: "positive", to: "nationalOrganizations" },
        { from: "nationalOrganizations", label: "raise", polarity: "positive", to: "massMobilization" },
        { from: "imperialWeakness", label: "amplifies", polarity: "positive", to: "massMobilization" },
        { from: "massMobilization", label: "creates", polarity: "positive", to: "legitimacyCrisis" },
        { from: "internationalSupport", label: "deepens", polarity: "positive", to: "legitimacyCrisis" },
        { from: "legitimacyCrisis", label: "pushes", polarity: "positive", to: "independence" },
        { from: "independence", label: "depends on", polarity: "positive", to: "stateCapacity" },
        { from: "weakInstitutions", label: "reduces", polarity: "negative", to: "stateCapacity" },
        { from: "stateCapacity", label: "stabilizes", polarity: "positive", to: "independence" },
      ],
      loops: [
        "Reinforcing: extraction -> grievance -> national organizations -> mobilization -> imperial legitimacy crisis -> independence",
        "Balancing: weak inherited institutions can limit what independence can deliver unless movements build administrative capacity as well as symbolic legitimacy",
      ],
      nodes: [
        { id: "colonialExtraction", label: "Colonial extraction", tone: "rose", x: 80, y: 80 },
        { id: "massGrievance", label: "Mass grievance", tone: "amber", x: 280, y: 40 },
        { id: "nationalOrganizations", label: "National organizations", tone: "emerald", x: 500, y: 100 },
        { id: "massMobilization", label: "Mass mobilization", tone: "emerald", x: 500, y: 280 },
        { id: "legitimacyCrisis", label: "Imperial legitimacy crisis", tone: "rose", x: 280, y: 340 },
        { id: "independence", label: "Independence", tone: "cyan", x: 80, y: 300 },
        { id: "stateCapacity", label: "State capacity", tone: "amber", x: 80, y: 180 },
        { id: "imperialWeakness", label: "Imperial weakness", tone: "cyan", x: 500, y: 420 },
        { id: "internationalSupport", label: "International support", tone: "amber", x: 280, y: 500 },
        { id: "weakInstitutions", label: "Weak inherited institutions", tone: "rose", x: 80, y: 460 },
      ],
      title: "The anti-colonial liberation loop",
    },
    difficulty: "Intermediate",
    discussionPrompt:
      "What turns resentment against empire into a successful independence movement? Is it mass participation, outside pressure, imperial weakness, or the ability to govern afterward?",
    eyebrow: "Movement families",
    heroHighlights: [
      "Anti-colonial movements often succeeded when imperial weakness met strong national organization.",
      "Print, schools, radio, unions, and parties helped people imagine themselves as one political community.",
      "Independence was a turning point, but inherited borders, debt, and institutions shaped what came next.",
    ],
    miniLesson: {
      accent: "cyan",
      conclusion:
        "Anti-colonial movements broke empires most effectively when they joined local grievance to a national frame, expanded participation beyond one elite, and exploited moments when imperial rule had lost both money and legitimacy.",
      metrics: [
        {
          description: "How many people experience colonial rule as daily extraction rather than distant symbolism",
          high: "Tax, land, labor, and racial hierarchy felt broadly",
          label: "Breadth of grievance",
          low: "Narrow elite dissatisfaction only",
          signal: "broader grievance -> wider mobilization",
        },
        {
          description: "Whether the movement can link villages, cities, workers, students, and political leaders",
          high: "Parties, unions, schools, newspapers, radio",
          label: "National infrastructure",
          low: "Small leadership circle only",
          signal: "more infrastructure -> stronger scale",
        },
        {
          description: "Whether the empire can still rule cheaply and credibly",
          high: "War fatigue, fiscal stress, global pressure",
          label: "Imperial vulnerability",
          low: "Strong imperial confidence",
          signal: "more vulnerability -> higher chance of rupture",
        },
      ],
      subtitle: "How colonies become nations in practice",
      title: "Mini lesson: when empire loses the ability to command",
    },
    readingTime: "8 min",
    realWorldExamples: [
      {
        insight:
          "Indian independence showed how anti-colonial struggle could combine elite negotiation, mass noncooperation, boycotts, and symbolic acts that made imperial rule appear illegitimate rather than inevitable.",
        outcome:
          "Campaigns such as noncooperation, civil disobedience, and the Salt March helped transform nationalist sentiment into a mass movement that Britain could no longer treat as marginal.",
        title: "India and the scaling of noncooperation",
      },
      {
        insight:
          "Postwar African independence movements spread quickly once colonial rule lost prestige and a generation of local organizers could build parties around the language of self-determination.",
        outcome:
          "Ghana's independence in 1957 became an important signal that helped accelerate the wider decolonization wave later described as the Year of Africa.",
        title: "Ghana and the momentum of decolonization",
      },
      {
        insight:
          "Some empires yielded only after much more violent confrontation, showing that anti-colonial movements were a family of strategies rather than one script.",
        outcome:
          "The Algerian war demonstrated how imperial crisis, armed struggle, and international legitimacy battles could combine to make colonial rule unsustainable.",
        title: "Algeria and the high-cost route to independence",
      },
    ],
    relatedFrameworks: [
      "Self-determination",
      "National liberation",
      "Political opportunity structures",
      "Imperial overstretch",
      "Postcolonial state formation",
    ],
    simulationPrompt:
      "Compare an anti-colonial movement with broad mass organization and a weakened empire against one facing strong imperial capacity, narrow elites, and no international recognition.",
    simulatorSlug: "social-movements",
    simpleExplanation: [
      "Anti-colonial movements were usually responses to a system in which political rule, economic extraction, and racial hierarchy were fused together. People were not only denied representation; they were governed by an external power that treated land, labor, and law as instruments of empire.",
      "These movements became powerful when they could turn many local grievances into a single national frame. Schools, newspapers, unions, churches, parties, and radio mattered because they helped people imagine that they were part of one political community with a claim to self-rule.",
      "Success often required timing as much as bravery. After major wars, empires were poorer, less legitimate, and under more international pressure. Movements that already had organization could use those windows far better than movements that relied on symbolism alone.",
      "Their outcomes were transformative but unfinished. Independence changed flags, constitutions, and legal sovereignty, yet many new states inherited colonial borders, export dependence, debt structures, or militarized institutions that continued to shape politics long after formal rule ended.",
    ],
    slug: "how-anti-colonial-movements-dismantled-empires",
    summary:
      "Anti-colonial movements succeeded when broad grievance, national organization, and imperial weakness aligned strongly enough to turn resistance into a legitimacy crisis for empire.",
    systemBug: {
      signals: [
        "Independence is taught as if it arrived because empire matured morally rather than because movements made rule too costly and illegitimate.",
        "National heroes are remembered while the unions, schools, and local organizers that built real capacity disappear from view.",
        "Formal sovereignty is mistaken for complete decolonization even where dependence survived through trade, debt, borders, or military structures.",
      ],
      summary:
        "The central bug is external rule without reciprocal accountability. Empire can extract from people whose consent it does not need, so anti-colonial movements become the mechanism through which political community is claimed and rebuilt.",
      title: "System bug: rule without equal political membership",
    },
    title: "How anti-colonial movements dismantled empires",
  },
  {
    accent: "rose",
    betterMetrics: [
      {
        description:
          "How clearly the movement can reveal the gap between a society's stated principles and the exclusion people experience in daily life.",
        label: "Moral contrast visibility",
      },
      {
        description:
          "How broad the coalition is across churches, unions, students, professionals, families, and international allies.",
        label: "Coalition breadth",
      },
      {
        description:
          "Whether direct action is linked to legal, legislative, and administrative strategies that can lock gains in.",
        label: "Institutional follow-through",
      },
      {
        description:
          "How much national or international media forces bystanders to see repression rather than letting exclusion remain private.",
        label: "Witness and media pressure",
      },
    ],
    betterMetricsTitle: "Signals that a rights-based movement can expand citizenship",
    counterArguments: [
      {
        point:
          "Courts and enlightened leaders created equal rights; street movements were mostly symbolic.",
        response:
          "Court victories mattered, but they often needed movements to make inaction politically costly and to demonstrate that the excluded group could organize at scale. Protest and law usually worked together rather than separately.",
        title: "Institutions granted rights on their own",
      },
      {
        point:
          "Disciplined nonviolent action is passive and too weak to change entrenched power.",
        response:
          "Disciplined disruption is not passive. Boycotts, sit-ins, strikes, marches, and occupation of public institutions can impose reputational, economic, and legal costs while also widening sympathy.",
        title: "Nonviolent tactics are too soft",
      },
      {
        point:
          "Once formal equality is passed into law, the movement's work is mostly done.",
        response:
          "Legal wins are turning points, not endpoints. Implementation, backlash, underfunding, and cultural resistance often continue for decades after the headline reform.",
        title: "Law ends the struggle",
      },
    ],
    causalLoop: {
      description:
        "Rights-based movements grow when visible injustice is turned into a public contradiction: a society claims equality, yet its institutions deny it. Disciplined disruption, media visibility, and legal follow-through help convert that contradiction into expanded citizenship.",
      edges: [
        { from: "visibleInjustice", label: "creates", polarity: "positive", to: "moralOutrage" },
        { from: "moralOutrage", label: "recruits", polarity: "positive", to: "movementOrganizations" },
        { from: "movementOrganizations", label: "coordinate", polarity: "positive", to: "disciplinedDisruption" },
        { from: "disciplinedDisruption", label: "draws", polarity: "positive", to: "mediaWitness" },
        { from: "mediaWitness", label: "raises", polarity: "positive", to: "publicLegitimacy" },
        { from: "publicLegitimacy", label: "pushes", polarity: "positive", to: "legalReform" },
        { from: "legalReform", label: "expands", polarity: "positive", to: "citizenship" },
        { from: "citizenship", label: "strengthens", polarity: "positive", to: "movementOrganizations" },
        { from: "backlash", label: "reduces", polarity: "negative", to: "legalReform" },
        { from: "disciplinedDisruption", label: "provokes", polarity: "positive", to: "backlash" },
      ],
      loops: [
        "Reinforcing: visible injustice -> outrage -> disciplined disruption -> public legitimacy -> legal reform -> wider citizenship",
        "Balancing: backlash can slow reform, which is why coalition breadth and legal follow-through matter after the dramatic protest moment",
      ],
      nodes: [
        { id: "visibleInjustice", label: "Visible injustice", tone: "rose", x: 80, y: 80 },
        { id: "moralOutrage", label: "Moral outrage", tone: "amber", x: 280, y: 40 },
        { id: "movementOrganizations", label: "Movement organizations", tone: "emerald", x: 500, y: 100 },
        { id: "disciplinedDisruption", label: "Disciplined disruption", tone: "emerald", x: 500, y: 280 },
        { id: "mediaWitness", label: "Media witness", tone: "cyan", x: 280, y: 320 },
        { id: "publicLegitimacy", label: "Public legitimacy", tone: "amber", x: 80, y: 280 },
        { id: "legalReform", label: "Legal reform", tone: "cyan", x: 80, y: 160 },
        { id: "citizenship", label: "Expanded citizenship", tone: "emerald", x: 280, y: 500 },
        { id: "backlash", label: "Backlash", tone: "rose", x: 500, y: 440 },
      ],
      title: "The rights-expansion loop",
    },
    difficulty: "Intermediate",
    discussionPrompt:
      "What makes a rights-based movement more than moral testimony? Why do some moments of public outrage become durable legal change while others fade after the headlines?",
    eyebrow: "Movement families",
    heroHighlights: [
      "These movements expose the gap between stated universal values and lived exclusion.",
      "Disciplined public disruption matters most when it is paired with legal and institutional follow-through.",
      "Turning points often arrive when repression becomes visible to bystanders who can no longer deny the contradiction.",
    ],
    miniLesson: {
      accent: "rose",
      conclusion:
        "Rights-based movements tend to break through when they make exclusion impossible to hide, widen the coalition beyond the directly harmed group, and lock moral pressure into law, administration, and public norms.",
      metrics: [
        {
          description: "How vividly the movement can show the contradiction between ideals and reality",
          high: "Repression seen clearly by the public",
          label: "Moral visibility",
          low: "Harm remains private or deniable",
          signal: "more visibility -> more sympathy",
        },
        {
          description: "How many institutions beyond the core movement are drawn into action",
          high: "Churches, unions, students, professionals, allies",
          label: "Coalition breadth",
          low: "Isolated constituency only",
          signal: "broader coalition -> more leverage",
        },
        {
          description: "Whether protest is connected to enforceable institutional change",
          high: "Courts, legislation, administration, budgets",
          label: "Follow-through",
          low: "Symbolic recognition only",
          signal: "more follow-through -> more durable gains",
        },
      ],
      subtitle: "Why some demands become citizenship rather than slogan",
      title: "Mini lesson: converting moral force into enforceable rights",
    },
    readingTime: "8 min",
    realWorldExamples: [
      {
        insight:
          "The U.S. civil rights movement linked courtroom strategy, churches, student action, boycotts, and media-visible confrontation to force the gap between constitutional ideals and segregation into the open.",
        outcome:
          "Turning points such as Brown, Montgomery, Birmingham, and Selma helped produce the Civil Rights Act of 1964 and Voting Rights Act of 1965, while also reshaping the political agenda far beyond the South.",
        title: "Civil rights and the contradiction of democracy",
      },
      {
        insight:
          "The anti-apartheid struggle showed that rights-based movements can operate both inside and outside a country, combining domestic resistance with boycotts, sanctions, and international legitimacy pressure.",
        outcome:
          "Global solidarity campaigns helped isolate the apartheid regime and contributed to the negotiated transition that led to multiracial democracy in South Africa.",
        title: "Anti-apartheid and international legitimacy",
      },
      {
        insight:
          "Disability rights activism demonstrated that citizenship expansion is not only about ballots and desegregation, but also about access, design, and everyday participation in public life.",
        outcome:
          "Actions such as the 504 sit-ins helped push accessibility and anti-discrimination into law, culminating in major reforms like the Americans with Disabilities Act.",
        title: "Disability rights and access as citizenship",
      },
    ],
    evidenceLinks: [owidEvidenceLinks.humanRights, owidEvidenceLinks.womenRights],
    relatedFrameworks: [
      "Civil disobedience",
      "Rights claiming",
      "Coalition politics",
      "Legal mobilization",
      "Media framing",
    ],
    simulationPrompt:
      "Compare a rights-based movement with strong coalition breadth, visible repression, and legal strategy against one with outrage but little institutional follow-through.",
    simulatorSlug: "social-movements",
    simpleExplanation: [
      "Rights-based movements usually emerge inside societies that already claim some version of universal equality, citizenship, or dignity but fail to apply it in practice. Their power comes from making that contradiction visible and politically costly.",
      "That is why tactics like boycotts, sit-ins, school strikes, freedom rides, occupation of public offices, or mass marches can matter so much. They are not only appeals for sympathy. They interrupt ordinary life and force institutions to choose whether to reform or to reveal their coercive core publicly.",
      "These movements are often most successful when moral pressure is connected to law. Lawyers, churches, unions, students, journalists, and families all play different roles. Protest creates urgency; legal and administrative strategies make the gain harder to reverse.",
      "Their turning points are memorable because they change both policy and political imagination. A society that once treated exclusion as normal begins to see it as intolerable, even if backlash and incomplete enforcement remain after the first victories.",
    ],
    slug: "how-rights-based-movements-expand-citizenship",
    summary:
      "Rights-based movements expand citizenship when visible injustice, broad coalitions, and disciplined disruption are converted into enforceable reforms rather than left as temporary moral outrage.",
    systemBug: {
      signals: [
        "States proclaim equal rights while designing institutions that still exclude whole groups from safety, access, voting, or dignity.",
        "Later generations remember the legal act but forget the organizing, sacrifice, and backlash that made it necessary.",
        "Formal equality is mistaken for practical equality even when budgets, policing, or built environments keep exclusion alive.",
      ],
      summary:
        "The underlying bug is hypocrisy embedded in institutions. When a system promises universal membership but distributes real power and protection unequally, rights-based movements arise to force the promise into practice.",
      title: "System bug: universal ideals with unequal citizenship",
    },
    title: "How rights-based movements expand citizenship",
  },
  {
    accent: "cyan",
    betterMetrics: [
      {
        description:
          "How quickly a movement can capture, verify, and spread a concrete event or testimony before gatekeepers suppress it.",
        label: "Documentation speed",
      },
      {
        description:
          "How easy it is for new participants to join, repost, donate, attend, or self-organize without waiting for a formal hierarchy.",
        label: "Entry barrier",
      },
      {
        description:
          "Whether there are organizations, leaders, or institutions that can turn viral attention into negotiation, policy, or durable pressure.",
        label: "Institutional depth",
      },
      {
        description:
          "How consistently the movement can keep a shared narrative when platforms reward speed, novelty, and fragmentation.",
        label: "Narrative coherence",
      },
    ],
    betterMetricsTitle: "Signals that a networked movement can last beyond virality",
    counterArguments: [
      {
        point:
          "Hashtag movements are not real movements because posting is easier than organizing.",
        response:
          "Low-cost posting can be shallow, but it can also perform a real movement function: witnessing, recruitment, mutual recognition, fundraising, and rapid agenda setting. The real question is what offline and institutional structures follow.",
        title: "Digital activism is only slacktivism",
      },
      {
        point:
          "Leaderless networked movements are always better because no one can be co-opted or arrested.",
        response:
          "Loose networks are flexible, but they can also struggle to negotiate, maintain strategy, or survive attention cycles. Horizontal energy and organizational depth are not the same thing.",
        title: "Leaderless always means stronger",
      },
      {
        point:
          "If a movement trends globally, success is basically guaranteed.",
        response:
          "Virality can shift culture or trigger protest quickly, but institutions still matter. Without strategy, coalition partners, or policy channels, even massive attention can fade without durable change.",
        title: "Virality equals victory",
      },
    ],
    causalLoop: {
      description:
        "Networked movements scale when smartphones and platforms make witnessing instant. Viral evidence lowers entry barriers, pulls people into public action, and pressures institutions. But if institutional depth stays weak, the movement can peak faster than it consolidates.",
      edges: [
        { from: "smartphoneWitness", label: "creates", polarity: "positive", to: "viralEvidence" },
        { from: "viralEvidence", label: "drives", polarity: "positive", to: "publicAttention" },
        { from: "publicAttention", label: "lowers", polarity: "positive", to: "participantEntry" },
        { from: "participantEntry", label: "expands", polarity: "positive", to: "streetAndNetworkAction" },
        { from: "streetAndNetworkAction", label: "raises", polarity: "positive", to: "institutionalPressure" },
        { from: "institutionalPressure", label: "produces", polarity: "positive", to: "policyOrCulturalShift" },
        { from: "policyOrCulturalShift", label: "sustains", polarity: "positive", to: "publicAttention" },
        { from: "platformVolatility", label: "fragments", polarity: "negative", to: "publicAttention" },
        { from: "weakOrganizations", label: "reduces", polarity: "negative", to: "policyOrCulturalShift" },
        { from: "streetAndNetworkAction", label: "exposes need for", polarity: "positive", to: "organizations" },
        { from: "organizations", label: "reduces", polarity: "negative", to: "weakOrganizations" },
      ],
      loops: [
        "Reinforcing: viral evidence -> attention -> low-barrier entry -> collective action -> institutional pressure -> cultural or policy shift",
        "Balancing: platform volatility and weak organizations can make a movement peak quickly without translating its energy into durable wins",
      ],
      nodes: [
        { id: "smartphoneWitness", label: "Smartphone witness", tone: "cyan", x: 80, y: 60 },
        { id: "viralEvidence", label: "Viral evidence", tone: "rose", x: 280, y: 40 },
        { id: "publicAttention", label: "Public attention", tone: "amber", x: 500, y: 100 },
        { id: "participantEntry", label: "Low-barrier entry", tone: "emerald", x: 500, y: 260 },
        { id: "streetAndNetworkAction", label: "Street and network action", tone: "emerald", x: 280, y: 320 },
        { id: "institutionalPressure", label: "Institutional pressure", tone: "amber", x: 80, y: 280 },
        { id: "policyOrCulturalShift", label: "Policy or cultural shift", tone: "emerald", x: 80, y: 160 },
        { id: "platformVolatility", label: "Platform volatility", tone: "rose", x: 500, y: 420 },
        { id: "weakOrganizations", label: "Weak organizations", tone: "rose", x: 280, y: 500 },
        { id: "organizations", label: "Durable organizations", tone: "cyan", x: 80, y: 460 },
      ],
      title: "The networked movement loop",
    },
    difficulty: "Intermediate",
    discussionPrompt:
      "What is the real difference between a movement that trends and a movement that changes institutions? At what point does networked speed become a substitute for organization rather than a complement to it?",
    eyebrow: "Movement families",
    heroHighlights: [
      "Smartphones and platforms let movements document events before traditional gatekeepers can erase them.",
      "Networked movements can scale extremely fast, but their durability depends on what exists beyond the feed.",
      "The biggest turning points often come when online witness spills into courts, workplaces, streets, schools, or legislatures.",
    ],
    miniLesson: {
      accent: "cyan",
      conclusion:
        "Digital movements change history most when fast witnessing and low-barrier entry are paired with organizations strong enough to hold attention after the viral moment passes.",
      metrics: [
        {
          description: "How fast the movement can show evidence or testimony to a mass public",
          high: "Phones, livestreams, searchable hashtags",
          label: "Witness speed",
          low: "Slow, gatekept documentation",
          signal: "faster witness -> quicker agenda shift",
        },
        {
          description: "How easy it is for people to recognize themselves as part of the same struggle",
          high: "Simple tags, stories, shareable frames",
          label: "Entry barrier",
          low: "High organizational threshold",
          signal: "lower barrier -> faster scale",
        },
        {
          description: "Whether the movement has durable structures after the first wave",
          high: "Campaigns, legal teams, local groups, unions",
          label: "Institutional depth",
          low: "Attention without structure",
          signal: "more depth -> longer impact",
        },
      ],
      subtitle: "Why some viral waves become durable politics",
      title: "Mini lesson: speed is not the same as power",
    },
    readingTime: "8 min",
    realWorldExamples: [
      {
        insight:
          "The Arab Spring showed how digital platforms could accelerate witness, coordination, and symbolic occupation of space, while also revealing the limits of rapid mobilization without stable post-revolt institutions.",
        outcome:
          "Networked protest helped shatter the aura of inevitability around several regimes, but political outcomes diverged sharply depending on military power, organization, and institutional succession.",
        title: "Arab Spring and the speed of networked revolt",
      },
      {
        insight:
          "The #MeToo movement spread because a simple digital frame let survivors convert isolated experience into collective visibility at global scale.",
        outcome:
          "The movement changed workplace norms, public language, and accountability expectations in many countries, even though reforms and enforcement remained uneven.",
        title: "#MeToo and testimony at scale",
      },
      {
        insight:
          "Black Lives Matter demonstrated the political force of viral witness, while youth climate mobilization showed how platforms can help turn scattered anxiety into recurring public action.",
        outcome:
          "Videos, hashtags, and school strikes helped move police violence and climate urgency toward the center of public debate, while also exposing how hard it is to convert cultural attention into consistent institutional change.",
        title: "Black Lives Matter and youth climate mobilization",
      },
    ],
    evidenceLinks: [owidEvidenceLinks.internet, owidEvidenceLinks.humanRights],
    relatedFrameworks: [
      "Connective action",
      "Platform politics",
      "Witnessing",
      "Agenda setting",
      "Hybrid online-offline mobilization",
    ],
    simulationPrompt:
      "Compare a digital movement with viral witness and strong local organizations against one that trends globally but lacks durable leadership, coalition partners, and policy channels.",
    simulatorSlug: "social-movements",
    simpleExplanation: [
      "Networked digital movements differ from earlier movements because the first act is often witnessing. A phone camera, post, or hashtag can make a local event visible to millions before journalists, employers, or states can fully control the story.",
      "That lowers the cost of participation. People can identify with a frame, share testimony, donate, attend a protest, or self-organize quickly. This is one reason modern movements can grow much faster than earlier print or industrial-era movements.",
      "But speed is not enough. Durable change still requires organization, coalition-building, legal strategy, bargaining power, or electoral channels. Otherwise the movement may win a cultural moment without winning institutional change.",
      "Their turning points are often double-edged. They can rapidly change what is discussable and what evidence the public accepts, yet they also operate inside platforms built for novelty, fragmentation, and attention churn. That makes the leap from visibility to durable power especially hard.",
    ],
    slug: "how-networked-digital-movements-scale",
    summary:
      "Networked movements scale through fast witness and low participation costs, but their historic impact depends on whether viral attention is converted into durable institutions and enforceable change.",
    systemBug: {
      signals: [
        "Public debate confuses attention with power and treats trending visibility as if it were already reform.",
        "Platforms make entry easy but also fragment memory, strategy, and accountability.",
        "Movements are judged either as complete failures or instant victories without tracing what happens after the viral peak.",
      ],
      summary:
        "The deep bug is a mismatch between communication speed and institutional speed. Platforms let collective awareness form almost instantly, but law, workplaces, and states still change slowly unless someone organizes the bridge.",
      title: "System bug: attention moves faster than institutions",
    },
    title: "How networked movements scale through digital media",
  },
  {
    accent: "amber",
    betterMetrics: [
      {
        description:
          "How sharply communication costs drop when a new medium lets people witness, copy, or coordinate more cheaply than before.",
        label: "Coordination cost shock",
      },
      {
        description:
          "Whether movements build durable organizations that survive after the first march, boycott, strike, or viral spike.",
        label: "Organizational persistence",
      },
      {
        description:
          "How often a movement turns repression or crisis into a legitimacy problem for the existing order rather than being crushed quietly.",
        label: "Legitimacy reversal rate",
      },
      {
        description:
          "Whether new rights or institutions actually outlast the founding protest moment.",
        label: "Durable outcome rate",
      },
    ],
    betterMetricsTitle: "Signals that reveal why one movement changes history and another stalls",
    counterArguments: [
      {
        point:
          "History just moves in a progressive direction, so successful movements mostly arrive when society is ready.",
        response:
          "Timing matters, but readiness is often created rather than discovered. Movements change what people can see, say, coordinate, and demand. That is why similar grievances can produce very different outcomes in different periods.",
        title: "Society was simply ready",
      },
      {
        point:
          "Great leaders are the main reason movements succeed, so broad structural comparisons miss the point.",
        response:
          "Leadership matters, but leaders operate inside structures: communication tools, coalition networks, repression levels, elite splits, and policy openings. A timeline helps show how similar mechanisms recur across very different personalities.",
        title: "It was all about leaders",
      },
      {
        point:
          "Every movement is unique, so grouping them by family hides too much complexity.",
        response:
          "No grouping can capture every detail, but comparison is still useful. It helps explain why some movements scale, why others fragment, and why turning points often appear when technology, grievance, and institutional weakness line up together.",
        title: "Comparison oversimplifies history",
      },
    ],
    causalLoop: {
      description:
        "Across centuries, social movements recur when grievance meets a new way to coordinate, enough organization to persist, and some opening in the dominant order. Turning points happen when repression backfires into a legitimacy crisis and institutions are forced to adapt.",
      edges: [
        { from: "grievance", label: "creates demand for", polarity: "positive", to: "newFrame" },
        { from: "newMedia", label: "lowers cost of", polarity: "positive", to: "newFrame" },
        { from: "newFrame", label: "recruits", polarity: "positive", to: "organization" },
        { from: "organization", label: "coordinates", polarity: "positive", to: "collectiveAction" },
        { from: "collectiveAction", label: "provokes", polarity: "positive", to: "repression" },
        { from: "repression", label: "can deepen", polarity: "positive", to: "legitimacyCrisis" },
        { from: "eliteSplits", label: "amplify", polarity: "positive", to: "legitimacyCrisis" },
        { from: "legitimacyCrisis", label: "forces", polarity: "positive", to: "institutionalChange" },
        { from: "institutionalChange", label: "reshapes", polarity: "positive", to: "citizenshipAndPower" },
        { from: "citizenshipAndPower", label: "changes future", polarity: "positive", to: "grievance" },
        { from: "weakOrganization", label: "reduces", polarity: "negative", to: "collectiveAction" },
        { from: "organization", label: "reduces", polarity: "negative", to: "weakOrganization" },
      ],
      loops: [
        "Reinforcing: grievance -> frame -> organization -> action -> legitimacy crisis -> institutional change -> new political expectations",
        "Balancing: when organizations stay weak, even strong outrage can dissipate before it becomes durable reform",
      ],
      nodes: [
        { id: "grievance", label: "Shared grievance", tone: "rose", x: 80, y: 90 },
        { id: "newMedia", label: "Communication shift", tone: "cyan", x: 280, y: 40 },
        { id: "newFrame", label: "Shared movement frame", tone: "amber", x: 500, y: 100 },
        { id: "organization", label: "Durable organization", tone: "emerald", x: 500, y: 280 },
        { id: "collectiveAction", label: "Collective action", tone: "emerald", x: 280, y: 330 },
        { id: "repression", label: "Repression", tone: "rose", x: 80, y: 300 },
        { id: "legitimacyCrisis", label: "Legitimacy crisis", tone: "amber", x: 80, y: 170 },
        { id: "institutionalChange", label: "Institutional change", tone: "cyan", x: 280, y: 500 },
        { id: "citizenshipAndPower", label: "New citizenship and power", tone: "emerald", x: 500, y: 440 },
        { id: "eliteSplits", label: "Elite splits", tone: "cyan", x: 80, y: 500 },
        { id: "weakOrganization", label: "Weak organization", tone: "rose", x: 500, y: 20 },
      ],
      title: "The long arc of movement change",
    },
    difficulty: "Intermediate",
    discussionPrompt:
      "Looking across the full timeline, which mattered most to historic breakthroughs: the grievance itself, the communication technology of the time, organizational depth, or splits inside the existing order?",
    eyebrow: "Movement synthesis",
    heroHighlights: [
      "Movements usually become historic turning points when grievance, communication, organization, and institutional weakness align.",
      "New media do not replace organization, but they often decide how fast a movement can scale.",
      "The same broad logic appears from pamphlet politics to digital witness, even though the tools change dramatically.",
    ],
    miniLesson: {
      accent: "amber",
      conclusion:
        "The timeline shows that movements rarely win because one speech or one platform changes everything. They win when new ways of coordinating meet broad grievance, durable organizing, and an order that can no longer govern without conceding change.",
      metrics: [
        {
          description: "How fast a new medium lets people copy or witness the same event",
          high: "Rapid, low-cost circulation",
          label: "Communication shift",
          low: "Slow, gatekept information",
          signal: "faster spread -> faster scaling",
        },
        {
          description: "How much structure exists after the first emotional breakthrough",
          high: "Persistent organizations and trained organizers",
          label: "Organizational depth",
          low: "Attention without staying power",
          signal: "more depth -> more durability",
        },
        {
          description: "Whether the existing order can still absorb conflict without losing legitimacy",
          high: "Visible elite splits and brittle authority",
          label: "Regime vulnerability",
          low: "Confident, cohesive authority",
          signal: "more vulnerability -> higher chance of breakthrough",
        },
      ],
      subtitle: "One timeline, many recurring movement mechanics",
      title: "Mini lesson: history changes through recurring combinations",
    },
    readingTime: "9 min",
    realWorldExamples: [
      {
        insight:
          "The Reformation and abolition campaigns show that falling communication costs can turn scattered grievance into a moral public capable of pressuring institutions.",
        outcome:
          "Pamphlets, translated texts, petitions, and testimony helped create a modern expectation that public argument can reshape authority.",
        title: "Print turns grievance into a public",
      },
      {
        insight:
          "Chartists, labor organizers, suffragists, and anti-colonial parties reveal that mass membership and repeated organization matter more than one successful protest.",
        outcome:
          "Rights and independence usually arrived after long cycles of organization, disruption, negotiation, repression, and return.",
        title: "Organization outlasts the event",
      },
      {
        insight:
          "Civil rights, disability rights, #MeToo, Black Lives Matter, and youth climate mobilization show that visible contradiction and witness can rapidly shift public legitimacy.",
        outcome:
          "Modern movements can change language and agendas very quickly, but durable outcomes still depend on institutional follow-through.",
        title: "Witness creates pressure, but institutions still decide durability",
      },
    ],
    evidenceLinks: [
      owidEvidenceLinks.humanRights,
      owidEvidenceLinks.womenRights,
      owidEvidenceLinks.globalEducation,
      owidEvidenceLinks.internet,
    ],
    relatedFrameworks: [
      "Political opportunity structures",
      "Resource mobilization",
      "Media shifts and public spheres",
      "Legitimacy crises",
      "Movement cycles",
    ],
    simulationPrompt:
      "Compare two movement families side by side and test how communication tools, coalition depth, repression, elite splits, and institutional openness determine whether one breaks through while the other stalls.",
    simulatorSlug: "social-movements",
    simpleExplanation: [
      "Social movements look very different on the surface, but across history many of them succeed through a recurring set of mechanisms. People experience a shared grievance, find a way to frame it publicly, build organizations around it, and then force institutions to respond.",
      "What changes over time is the coordination technology. In one era it is pamphlets, sermons, and petitions. In another it is railways, telegraphs, and mass newspapers. Later it becomes television, and today it often begins with phones, platforms, and viral witness. The tool changes, but the organizational question never disappears.",
      "This is why a timeline is useful. It shows that turning points usually happen when movements become harder to isolate. Repression becomes visible, elites split, or the governing order becomes too weak or too illegitimate to preserve the old arrangement at an acceptable cost.",
      "The outcome is not always immediate justice. Some victories create new exclusions, and some movements win recognition faster than they win material change. But over the long run, these movement waves repeatedly redraw who counts, who speaks, and what institutions must answer for.",
    ],
    slug: "how-social-movements-reshape-history",
    summary:
      "From pamphlets to hashtags, movements repeatedly change history when new coordination tools, durable organization, and elite vulnerability combine strongly enough to turn grievance into institutional transformation.",
    timeline: {
      intro:
        "This timeline is not a list of famous protests. It is a map of recurring movement mechanics across time: what triggered mobilization, what tools helped scale it, where the turning point appeared, and what long-run outcomes followed.",
      title: "From pamphlets to platforms: thirteen turning points in movement history",
      events: [
        {
          characteristics: ["cheap print", "vernacular texts", "elite shelter", "doctrinal dispute"],
          family: "Protestant Reformation — print-era religious revolt",
          outcome:
            "Church authority over doctrine, education, and political legitimacy fractured permanently, widening the public sphere and establishing that printed argument could challenge institutional monopolies.",
          timeLabel: "1517–1648",
          title: "Luther's pamphlets: print breaks the monopoly on doctrine",
          turningPoint:
            "Martin Luther's 95 Theses spread across Germany in weeks via the printing press — faster than any authority could suppress them. Sympathetic princes provided shelter, turning a theological dispute into a continental power struggle.",
          whyItStarted:
            "Corruption inside the Catholic Church, resentment of indulgences and clerical wealth, rising urban literacy, and the printing press all converged. When Luther nailed his theses in 1517, he had a tool — cheap reproduction — that previous reformers like Hus and Wycliffe lacked.",
        },
        {
          characteristics: ["colonial taxation without representation", "merchant boycotts", "pamphlet networks", "armed insurrection", "foreign alliance"],
          family: "American Revolution — colonial print-era uprising",
          outcome:
            "The thirteen colonies became the United States, establishing a constitutional republic with separation of powers. The revolution also produced influential political texts — the Declaration of Independence, the Federalist Papers — that shaped democratic thinking worldwide.",
          timeLabel: "1775–1783",
          title: "American Revolution: taxation, pamphlets, and a new republic",
          turningPoint:
            "Thomas Paine's Common Sense (1776) framed independence not as rebellion but as common sense, swinging colonial opinion decisively. The Franco-American alliance after Saratoga (1777) made continued British rule militarily untenable.",
          whyItStarted:
            "British Parliament levied taxes on colonies that had no parliamentary representation. Merchant elites, lawyers, and artisans organized boycotts through Committees of Correspondence, while pamphlets spread Enlightenment arguments about natural rights. Elite splits within Britain — with figures like Burke sympathizing with colonists — weakened the imperial response.",
        },
        {
          characteristics: ["bread riots", "elite collapse", "Enlightenment ideas", "urban crowd", "radical phases"],
          family: "French Revolution — urban insurrection and elite implosion",
          outcome:
            "The ancien régime was dismantled: feudal privileges abolished, the Declaration of the Rights of Man proclaimed, and eventually the monarchy abolished. France's revolutionary upheaval reverberated across Europe, triggering both liberal reform movements and conservative counter-revolutions for a century.",
          timeLabel: "1789–1799",
          title: "French Revolution: when elite collapse and bread crisis ignite a republic",
          turningPoint:
            "The storming of the Bastille on 14 July 1789 was as much symbol as strategy — it showed the king's troops would not reliably fire on Parisian crowds. When the National Assembly refused to disband and the king was forced to accept it, the political order had already broken.",
          whyItStarted:
            "France was financially bankrupt from war debts (including funding the American Revolution), harvests had failed causing bread prices to spike, and Enlightenment ideas about popular sovereignty had delegitimized hereditary absolutism among educated elites. When Louis XVI convened the Estates-General to raise taxes, the Third Estate seized the moment to demand constitutional change.",
        },
        {
          characteristics: ["petitions", "printed testimony", "consumer boycotts", "transatlantic networks"],
          family: "Atlantic abolitionism — moral public campaign",
          outcome:
            "Britain abolished the slave trade in 1807 and slavery across its empire in 1833. Abolitionism established the model of mass moral campaigning — petitions, boycotts, and testimony — that subsequent reform movements would repeatedly copy.",
          timeLabel: "1787–1833",
          title: "Abolition: turning enslaved testimony into legislative pressure",
          turningPoint:
            "The 1792 petition to Parliament gathered 400,000 signatures — the largest in British history to that date. Printed accounts of the Middle Passage by formerly enslaved people like Olaudah Equiano made the slave trade impossible to treat as a distant abstraction.",
          whyItStarted:
            "Religious dissent (Quakers, evangelical Anglicans), Black testimony, and Enlightenment natural-rights arguments converged with the organizational infrastructure of the Society for Effecting the Abolition of the Slave Trade (1787). Sugar boycotts showed that consumer action could translate moral conviction into economic pressure.",
        },
        {
          characteristics: ["factories", "trade unions", "dues", "mass newspapers", "strike leverage"],
          family: "Industrial labour and suffrage movements",
          outcome:
            "Mass membership politics became normal. Over decades these movements contributed to wider male and female suffrage, union recognition, the eight-hour working day, and welfare state foundations across Western Europe and North America.",
          timeLabel: "1838–1918",
          title: "Industrial mass movements: strikes, petitions, and the vote",
          turningPoint:
            "Britain's 1842 general strike — involving over 500,000 workers across dozens of trades — demonstrated that organized labour could threaten production at a national scale. Suffragette militancy (window-smashing, hunger strikes, arson) forced parliamentarians to weigh the cost of continued exclusion.",
          whyItStarted:
            "Industrial concentration packed workers into factories and cities, creating shared conditions and shared grievance. Railways and telegraphs made national coordination possible. Mass newspapers gave movements cheap publicity. Dues-paying union membership created financial staying power no earlier movement had.",
        },
        {
          characteristics: ["war exhaustion", "soldiers' soviets", "industrial strikes", "elite collapse", "party vanguard"],
          family: "Russian Revolution — industrial insurrection and state collapse",
          outcome:
            "The Romanov dynasty fell in February 1917; the Bolsheviks seized power in October. The Soviet state that followed shaped the geopolitics of the entire twentieth century — and provided a reference point, positive and negative, for every subsequent mass movement.",
          timeLabel: "1905–1917",
          title: "Russian Revolution: when war exhaustion collapses a regime from within",
          turningPoint:
            "By October 1917 the Provisional Government had failed to end the war or redistribute land. Soldiers deserted en masse, soviets (workers' councils) controlled key infrastructure, and the Bolsheviks — alone among factions — promised 'Peace, Land, Bread.' The regime had lost coercive capacity before the insurrection began.",
          whyItStarted:
            "Three years of catastrophic World War I losses (over 1.7 million Russian dead by 1917), food shortages in cities, and a tsar who combined autocracy with military incompetence had produced a legitimacy vacuum. The 1905 revolution had already shown the regime's fragility; factory councils and socialist parties provided the organizational skeleton that 1917 filled.",
        },
        {
          characteristics: ["nonviolent discipline", "mass civil disobedience", "salt", "spinning wheel", "international press"],
          family: "Gandhi & Indian independence — nonviolent anti-colonial campaign",
          outcome:
            "Britain granted Indian independence in 1947. Gandhi's satyagraha (truth-force) demonstrated that disciplined nonviolent mass action could be strategically superior to armed revolt against a colonial power dependent on international legitimacy — a lesson that directly influenced the US civil rights movement and dozens of later campaigns.",
          timeLabel: "1919–1947",
          title: "Gandhi's Salt March: nonviolence as strategic weapon against empire",
          turningPoint:
            "The 1930 Salt March — 240 miles to the sea to make salt illegally — was chosen precisely because it was impossible to justify arresting people for collecting salt. International press coverage of British officers beating nonresisting marchers destroyed imperial legitimacy faster than any armed attack could have.",
          whyItStarted:
            "The 1919 Amritsar Massacre (British troops killing 379 unarmed Indians) crystallized anti-colonial grievance. Gandhi had developed satyagraha in South Africa; returning to India he built the Indian National Congress into a mass organization capable of coordinating nationwide civil disobedience. The spinning wheel symbolized economic self-reliance — refusing British cloth was both protest and programme.",
        },
        {
          characteristics: ["national liberation parties", "post-war imperial weakness", "self-determination", "Cold War leverage", "armed and unarmed tactics"],
          family: "Anti-colonial liberation waves — empire loses legitimacy",
          outcome:
            "Between 1945 and 1975 over fifty new states were created as European empires retreated from Asia, Africa, and the Caribbean. Many inherited colonial borders, debt structures, and fragile institutions, generating their own waves of subsequent conflict and movement.",
          timeLabel: "1945–1975",
          title: "Decolonisation: empire loses legitimacy faster than it can adapt",
          turningPoint:
            "War exhaustion drained Britain and France of the capacity and will to hold vast overseas territories by force. The 1956 Suez Crisis exposed British imperial overreach to global ridicule; France's defeat in Dien Bien Phu (1954) and the Algerian war showed that colonial armies could not indefinitely suppress popular national movements.",
          whyItStarted:
            "Colonial extraction, racial hierarchy, and the contradiction between Allied wartime rhetoric about freedom and continued colonial rule radicalized educated local organizers. The Cold War created space: both superpowers, for different reasons, opposed European colonial empires, giving liberation movements diplomatic leverage.",
        },
        {
          characteristics: ["nonviolent disruption", "television", "legal strategy", "church networks", "sit-ins", "freedom rides"],
          family: "US Civil Rights Movement — visible contradiction forces law",
          outcome:
            "The Civil Rights Act (1964) and Voting Rights Act (1965) dismantled legal segregation in the United States and established a legal template for anti-discrimination law worldwide. The movement also changed the normative baseline — what exclusion now requires justification — permanently.",
          timeLabel: "1955–1968",
          title: "Civil Rights: television turns repression into a legitimacy crisis",
          turningPoint:
            "The 1963 Birmingham campaign was designed to provoke Sheriff Bull Connor into using fire hoses and police dogs in front of television cameras. It worked. Images of children being beaten by state forces made segregation internationally indefensible and forced the Kennedy administration to propose civil rights legislation.",
          whyItStarted:
            "Legal segregation, disenfranchisement, and racial violence persisted in the American South despite constitutional equal-protection guarantees. The 1955 Montgomery Bus Boycott — triggered by Rosa Parks' arrest — demonstrated that Black economic power (bus fares) could be wielded collectively. Church networks provided organizational infrastructure, and television created a national audience for repression.",
        },
        {
          characteristics: ["student revolt", "factory strikes", "cultural rebellion", "generational rupture", "no central leadership"],
          family: "May 1968, France — when students and workers briefly converge",
          outcome:
            "De Gaulle survived by calling elections, which he won. But May '68 permanently changed French (and Western) cultural politics: it accelerated secularisation, feminism, and sexual liberation, and established that cultural authority — not just economic power — could be a site of collective challenge.",
          timeLabel: "May 1968",
          title: "May '68: student revolt meets general strike — and falls short of revolution",
          turningPoint:
            "When Paris students' barricades on the Left Bank triggered a spontaneous general strike of ten million workers, France seemed on the edge of revolution. But no unified political leadership existed to convert the energy into institutional power, and de Gaulle's promise of elections gave moderates an off-ramp. The movement dissolved as quickly as it had assembled.",
          whyItStarted:
            "A generational revolt against authoritarian universities collided with long-standing industrial grievances. France's post-war economic boom had created a large student population and a restless industrial working class, both chafing against Gaullist paternalism. Global context mattered: US civil rights, anti-Vietnam protests, and Prague Spring all signalled that the existing order was contested everywhere.",
        },
        {
          characteristics: ["student-led", "hunger strikes", "Goddess of Democracy", "no elite splits", "closed institutions", "violent repression"],
          family: "Tiananmen Square — when the turning point never comes",
          outcome:
            "Military crackdown on 3–4 June 1989 killed hundreds to thousands. The protest left no institutional change inside China, but its international images — especially the 'Tank Man' photograph — became enduring symbols of nonviolent resistance against authoritarian power, and shaped how subsequent movements thought about repression and witness.",
          timeLabel: "April–June 1989",
          title: "Tiananmen Square: a movement that reached the turning point but found no crack",
          turningPoint:
            "There was no turning point — that is the lesson. The movement had massive grievance, genuine public sympathy, and global media attention. What it lacked was elite splits: the hardliners in the Politburo Standing Committee (led by Li Peng) prevailed over reformers (Zhao Ziyang), and the military remained loyal. Without an internal crack in the regime, pressure had nowhere to go.",
          whyItStarted:
            "The death of reformist General Secretary Hu Yaobang in April 1989 gave students a pretext to gather in Tiananmen Square to mourn publicly — mourning was politically safer than protest. Underlying grievances were inflation, corruption, and the contradiction between China's economic opening and persistent one-party rule. Mikhail Gorbachev's May visit brought international press already in position to cover events.",
        },
        {
          characteristics: ["leaderless", "smartphones", "social media coordination", "horizontal structure", "occupation tactic", "thin organization"],
          family: "Arab Spring & Occupy Wall Street — platform surge meets institutional wall",
          outcome:
            "Egypt's Mubarak fell within 18 days; Tunisia's Ben Ali fled after 28. But durable democratic change proved elusive: Egypt returned to military rule by 2013, Syria descended into civil war. Occupy set inequality firmly on the political agenda ('the 1%') but won no legislation. The movements revealed both the speed of networked mobilisation and its organizational limits.",
          timeLabel: "2010–2012",
          title: "Arab Spring & Occupy: fast mobilisation, slow institutionalisation",
          turningPoint:
            "In Egypt, the moment Mubarak's interior minister announced a curfew and crowds ignored it, the regime's coercive credibility collapsed. But the same horizontal network that brought millions to Tahrir Square had no structure to navigate electoral politics afterward. In Occupy, the 'mic check' general assembly model was inclusive but could not produce durable demands or leadership.",
          whyItStarted:
            "Mohamed Bouazizi's self-immolation in Tunisia (December 2010) ignited grievances — unemployment, corruption, authoritarian humiliation — already at flashpoint across the Arab world. In the US, the 2008 financial crisis had created deep anger about bank bailouts and rising inequality. Facebook and Twitter made coordination nearly frictionless; smartphones made witness immediate. But coordination is not the same as organisation.",
        },
        {
          characteristics: ["hashtag viral witness", "decentralised", "fast agenda-setting", "uneven institutionalisation", "platform dependency"],
          family: "Networked digital movements — #MeToo, BLM, Fridays for Future",
          outcome:
            "Agenda-setting accelerated dramatically: workplace abuse (#MeToo, 2017), police violence (#BlackLivesMatter, 2013–present), and climate urgency (#FridaysForFuture, 2018) became global issues within days. Durable reform proved uneven — legislative and institutional change required sustained organizational effort beyond the initial viral moment.",
          timeLabel: "2013–today",
          title: "Platforms make witness immediate but durability still depends on organisation",
          turningPoint:
            "The first viral proof or shared hashtag turns isolated experience into a collective public almost instantaneously. But each movement's durability diverged based on whether it built lasting organisations: the Movement for Black Lives developed a policy platform and local chapters; #MeToo produced concrete legal reforms in some jurisdictions; Fridays for Future struggled to translate school strikes into legislative traction.",
          whyItStarted:
            "Smartphones gave everyone a witness device; social platforms gave everyone a distribution channel. The result was that experiences previously too diffuse or stigmatised to organise around — sexual harassment, everyday racism, climate anxiety — could suddenly find each other at scale. The cost of the first moment of visibility dropped to near zero; the cost of sustained organisation did not.",
        },
      ],
    },
    systemBug: {
      signals: [
        "People remember iconic moments but forget the communication systems and organizations that made them scalable.",
        "Histories of progress often skip the fact that many rights were won only after repression started damaging the regime more than concession would.",
        "Modern attention cycles make it easy to overestimate fast visibility and underestimate slow institution-building.",
      ],
      summary:
        "The repeating bug is unequal access to voice, organization, and institutional leverage. Social movements arise whenever a system blocks participation strongly enough that people must build alternative channels to be heard and counted.",
      title: "System bug: blocked participation creates recurring movement waves",
    },
    title: "How social movements reshape history",
  },

  // ─── Module N: US Monetary System Reboots ────────────────────────────────────
  {
    accent: "amber",
    betterMetrics: [
      {
        description: "The share of global trade and financial reserves denominated in a single national currency — a structural advantage that can be withdrawn without warning.",
        label: "Reserve currency concentration",
      },
      {
        description: "The gap between the official price of a monetary anchor (gold, a peg, a basket) and its market-clearing value — a measure of how much pressure is building before the next rewrite.",
        label: "Monetary anchor stress index",
      },
      {
        description: "Who holds veto power over the rules of international monetary settlement — and whether those rules can survive a political shock.",
        label: "Rule-making legitimacy",
      },
      {
        description: "How easily ordinary savers can move wealth outside the dominant monetary system when rules change — a measure of how concentrated monetary risk really is.",
        label: "Household monetary exit options",
      },
    ],
    betterMetricsTitle: "What to watch beyond inflation and GDP",
    counterArguments: [
      {
        point: "Each rewrite was a pragmatic emergency response, not a grand conspiracy. Roosevelt faced deflation and bank collapse; Nixon faced a real run on gold. Crisis management is not sinister.",
        response: "True — each decision had a genuine emergency behind it. The pattern worth understanding is not that elites are conspiring, but that the rules of money are political and revisable. Knowing that is useful regardless of who is in power.",
        title: "These were emergency responses, not power grabs",
      },
      {
        point: "The Bretton Woods system and the petrodollar era produced decades of relative stability and growth. Rewriting the rules worked.",
        response: "For most wealthy countries, yes. The distributional picture is more complex: dollar privilege allowed the US to run persistent deficits that would have forced adjustment in any other country, and the rules were written by the strongest player.",
        title: "The system delivered real prosperity",
      },
      {
        point: "A Bitcoin or crypto reserve is categorically different — it is not controlled by any government and cannot be inflated away. This makes it more honest than fiat.",
        response: "Scarcity by design does not guarantee stability. A fixed supply asset held as a national reserve asset still creates winners (early holders) and losers (latecomers), and its price volatility makes it a poor unit of account for international trade settlement.",
        title: "Crypto is a genuinely different kind of money",
      },
    ],
    causalLoop: {
      description:
        "Each monetary order creates structural pressures that accumulate until a rewrite becomes unavoidable. The stability of the new system depends on whether the underlying tensions are resolved or merely deferred.",
      edges: [
        { from: "monetary_order", label: "enables", polarity: "positive", to: "credit_expansion" },
        { from: "credit_expansion", label: "builds", polarity: "positive", to: "imbalances" },
        { from: "imbalances", label: "stress-test", polarity: "negative", to: "anchor_credibility" },
        { from: "anchor_credibility", label: "collapse triggers", polarity: "negative", to: "political_crisis" },
        { from: "political_crisis", label: "forces", polarity: "positive", to: "rule_rewrite" },
        { from: "rule_rewrite", label: "creates new", polarity: "positive", to: "monetary_order" },
        { from: "rule_rewrite", label: "redistributes", polarity: "positive", to: "winners_losers" },
        { from: "winners_losers", label: "shapes next", polarity: "positive", to: "imbalances" },
      ],
      loops: [
        "Reinforcing: stability breeds credit expansion → imbalances build → anchor stress → crisis → rewrite → new stability → repeat",
        "Balancing (slow): accumulated institutional memory and reform can delay the next crisis, but has never prevented it",
      ],
      nodes: [
        { id: "monetary_order", label: "Monetary order", tone: "amber", x: 300, y: 60 },
        { id: "credit_expansion", label: "Credit expansion", tone: "emerald", x: 560, y: 140 },
        { id: "imbalances", label: "Structural imbalances", tone: "rose", x: 560, y: 300 },
        { id: "anchor_credibility", label: "Anchor credibility", tone: "cyan", x: 380, y: 380 },
        { id: "political_crisis", label: "Political crisis", tone: "rose", x: 140, y: 300 },
        { id: "rule_rewrite", label: "Rule rewrite", tone: "amber", x: 60, y: 160 },
        { id: "winners_losers", label: "New winners & losers", tone: "amber", x: 300, y: 240 },
      ],
      title: "The monetary rewrite cycle",
    },
    difficulty: "Intermediate",
    discussionPrompt:
      "If the rules of money can always be rewritten by the most powerful state under sufficient pressure, what does that mean for how individuals and nations should store and protect wealth?",
    eyebrow: "Financial system",
    heroHighlights: [
      "In 1933, Franklin Roosevelt made it illegal for Americans to own gold and repriced it the next year by 41% — a default in all but name.",
      "In 1971, Richard Nixon ended the dollar's convertibility to gold in a single weekend TV address, dissolving the Bretton Woods system that 44 nations had spent years building.",
      "Each US monetary rewrite transferred enormous wealth between groups — and was presented as a technical fix rather than a political choice.",
    ],
    miniLesson: {
      accent: "amber",
      conclusion:
        "The common thread across every rewrite is that the official rules of money lagged behind economic reality until the gap became unsustainable. Each new system resolved the immediate crisis while creating the conditions for the next one.",
      metrics: [
        {
          description: "What the government said money was worth and what people could actually exchange it for.",
          high: "Official and market values aligned — credibility intact",
          label: "Official vs. market value of monetary anchor",
          low: "Large gap — system under severe stress, rewrite imminent",
          signal: "Gold premium, capital flight, or reserve depletion all signal anchor failure before the official rewrite arrives.",
        },
        {
          description: "Whether the monetary regime benefited savers, debtors, or asset holders differently.",
          high: "Rules broadly neutral across income levels",
          label: "Distributional effect of the rewrite",
          low: "Concentrated gains to early movers, losses to latecomers",
          signal: "Asset price windfalls immediately after a rewrite indicate structural redistribution, not neutral adjustment.",
        },
        {
          description: "How many countries had input into the new rules versus how many had the rules imposed on them.",
          high: "Multilateral agreement — broad legitimacy, slower reform",
          label: "Legitimacy of the new order",
          low: "Unilateral US action — fast but contested",
          signal: "Currency substitution, bilateral currency deals, and reserve diversification all indicate legitimacy erosion.",
        },
      ],
      subtitle: "Five rewrites, one pattern",
      title: "Reading a monetary system rewrite",
    },
    readingTime: "9 min",
    realWorldExamples: [
      {
        insight:
          "By making gold ownership illegal at $20.67/oz and then repricing it to $35/oz, the US government effectively devalued the dollar by 41% overnight. Holders of gold certificates — mostly banks and foreign creditors — bore the loss; the US Treasury captured the gain.",
        outcome:
          "The Gold Reserve Act of 1934 gave the Treasury a multi-billion dollar windfall that funded New Deal programs. Domestic gold holders had already been forced to sell at the lower price.",
        title: "1933–34: the compulsory gold swap and overnight revaluation",
      },
      {
        insight:
          "Under Bretton Woods, foreign central banks could demand gold from the US at $35/oz. By 1971, the US held far less gold than its dollar obligations required — France had already started cashing in. Nixon closed the gold window before the US ran out.",
        outcome:
          "The dollar was cut loose from any fixed anchor. The US gained the ability to run deficits without the discipline of gold conversion. Within two years, inflation surged globally as dollar-denominated oil prices tripled.",
        title: "1971: Nixon closes the gold window",
      },
      {
        insight:
          "By early 2025, a US executive order directed agencies to explore a Strategic Bitcoin Reserve — treating seized and purchased bitcoin as a reserve asset. If pursued, it would mark the first time a sovereign incorporated a privately-designed, algorithmically-scarce asset into official reserves.",
        outcome:
          "The policy remained contested and unimplemented as of mid-2025. Its significance is structural: it signals that monetary architecture is once again being treated as a live political question rather than a settled technical matter.",
        title: "2025: Bitcoin as a potential reserve asset",
      },
    ],
    relatedFrameworks: [
      "Triffin dilemma (reserve currency paradox)",
      "Bretton Woods system and its collapse",
      "Modern Monetary Theory",
      "Gold standard history",
      "Exorbitant privilege (Barry Eichengreen)",
      "Petrodollar system",
    ],
    simulationPrompt:
      "Run the macro economy simulator with different monetary anchor assumptions — gold standard, fiat with inflation target, or currency board — to see how each constrains or enables fiscal and monetary policy.",
    simulatorSlug: "macro-economy",
    simpleExplanation: [
      "Most people treat money as a fixed fact of life — like gravity. But the specific rules that define what money is, who can create it, and what it can be exchanged for have been rewritten multiple times, usually in moments of crisis, always by those who held state power.",
      "The US has gone through at least five such rewrites since 1913: the creation of the Federal Reserve to prevent bank panics, FDR\'s gold confiscation and repricing in 1933–34, the Bretton Woods system that made the dollar the world\'s reserve currency in 1944, Nixon\'s shock that cut the dollar free from gold in 1971, and the Plaza Accord of 1985 that engineered a deliberate dollar devaluation by international agreement. A potential sixth — the incorporation of bitcoin into US reserves — was live policy as of 2025.",
      "Each rewrite had a genuine crisis behind it. But each also redistributed wealth on a massive scale: from gold holders to the Treasury, from creditor nations to the US, from savers to debtors. Understanding that monetary rules are political — not just technical — is the starting point for understanding how the financial system actually works.",
    ],
    slug: "how-the-us-rewrites-the-rules-of-money",
    summary:
      "The rules of money have been rewritten at least five times since 1913 — each rewrite transferring wealth and power while being presented as a technical adjustment to an emergency.",
    systemBug: {
      signals: [
        "The monetary anchor (gold, fixed peg, or credibility) is under visible strain before the official rewrite is announced.",
        "Each rewrite creates large windfall gains for early movers and losses for those who trusted the old rules.",
        "International monetary agreements are negotiated by the strongest powers and presented as universal frameworks.",
        "Long periods of stability erode the institutional memory of how fast the rules can change.",
      ],
      summary:
        "The design flaw is not in any specific monetary system but in the belief that any monetary system is permanent. The rules are made by states under political pressure and can be changed by states under political pressure — usually faster than ordinary citizens can respond.",
      title: "System bug: monetary rules feel permanent until they change overnight",
    },
    timeline: {
      intro:
        "Six turning points in which the United States rewrote the fundamental rules of its monetary system — each one a response to a genuine crisis, each one reshaping who holds wealth and who bears risk.",
      title: "Six times the US changed the rules of money",
      events: [
        {
          characteristics: [
            "Created a lender of last resort to stop bank runs",
            "Established a network of regional Federal Reserve banks",
            "Transferred some monetary authority from private clearinghouses to a public institution",
          ],
          family: "Institutional creation",
          outcome:
            "Bank panics became less frequent, but the Fed\'s independence from both government and Wall Street remained contested from day one.",
          timeLabel: "1913",
          title: "Federal Reserve Act",
          turningPoint:
            "First time the US accepted a permanent central bank — reversing Andrew Jackson\'s abolition of the Second Bank of the United States eighty years earlier.",
          whyItStarted:
            "The Panic of 1907 showed that without a central bank, private bankers (principally J.P. Morgan) were the only thing standing between the financial system and collapse.",
        },
        {
          characteristics: [
            "Executive Order 6102 made it illegal for most Americans to own gold coins, bullion, or gold certificates",
            "Owners were required to surrender gold to the Federal Reserve at $20.67 per troy ounce",
            "Exemptions for jewelry, collectible coins, and industrial use",
          ],
          family: "Compulsory confiscation",
          outcome:
            "Roughly $300 million in gold (billions in today\'s terms) was transferred to the Treasury. Many historians regard it as a soft default on the gold standard.",
          timeLabel: "1933",
          title: "Executive Order 6102 — Gold Confiscation",
          turningPoint:
            "The US government demonstrated it could override property rights over monetary assets in a national emergency — a precedent with no peacetime parallel before or since.",
          whyItStarted:
            "Bank runs were draining gold reserves as the Depression deepened. Roosevelt needed to expand the money supply but could not do so under gold standard rules as long as people could convert dollars to gold.",
        },
        {
          characteristics: [
            "Transferred legal title of all gold from the Federal Reserve to the US Treasury",
            "Officially repriced gold from $20.67 to $35.00 per troy ounce",
            "The 41% revaluation produced an immediate profit for the Treasury",
          ],
          family: "Monetary devaluation",
          outcome:
            "The Treasury windfall funded New Deal programs. Holders of dollar-denominated assets saw 41% of their gold-equivalent purchasing power wiped out. Foreign creditors who had trusted the old peg took the loss.",
          timeLabel: "1934",
          title: "Gold Reserve Act — Dollar Devaluation",
          turningPoint:
            "The first explicit, legally-enacted devaluation of the US dollar — framed as stabilization, functioning as a redistribution from creditors to debtors and from private gold holders to the state.",
          whyItStarted:
            "With gold now concentrated in the Treasury, Roosevelt could set the new price. The higher price made US exports cheaper, discouraged gold outflows, and gave the government fiscal room.",
        },
        {
          characteristics: [
            "Dollar pegged to gold at $35 per ounce — the only currency with direct gold convertibility",
            "All other currencies pegged to the dollar within a ±1% band",
            "Created the IMF and World Bank as institutional pillars",
            "US veto guaranteed at both institutions",
          ],
          family: "International monetary architecture",
          outcome:
            "Two decades of relative exchange rate stability and reconstruction finance for war-damaged economies. The US gained structural economic advantages — the \'exorbitant privilege\' of issuing the world\'s reserve currency.",
          timeLabel: "1944",
          title: "Bretton Woods Agreement",
          turningPoint:
            "The dollar was formally installed as the global reserve currency — a position that allowed the US to run trade deficits without the balance-of-payments discipline every other country faced.",
          whyItStarted:
            "With WWII still running, 44 allied nations met in New Hampshire to design a post-war monetary order that avoided the competitive devaluations and gold hoarding of the 1930s. The US, holding 70% of the world\'s gold reserves at the time, set the terms.",
        },
        {
          characteristics: [
            "Nixon announced the end of gold convertibility in a Sunday TV address with no advance notice to allies",
            "Foreign central banks could no longer exchange dollar reserves for US gold",
            "Temporary 10% import surcharge imposed simultaneously",
            "Bretton Woods fixed exchange rate system collapsed within two years",
          ],
          family: "Unilateral dissolution",
          outcome:
            "The dollar became pure fiat money. Exchange rates floated. Inflation surged through the 1970s. The US retained reserve currency status but without the gold anchor discipline — gaining the ability to run unlimited deficits.",
          timeLabel: "1971",
          title: "Nixon Shock — End of Gold Convertibility",
          turningPoint:
            "The most consequential monetary rewrite of the 20th century: the world moved from commodity-backed to pure fiat money with no international agreement, no treaty, and no transition period.",
          whyItStarted:
            "The US had printed far more dollars than it held gold to redeem. France and other creditors were actively converting dollar reserves to gold. Nixon faced a choice between devaluation, austerity, or closing the gold window — and chose the third.",
        },
        {
          characteristics: [
            "G5 finance ministers (US, UK, France, West Germany, Japan) agreed to coordinated currency intervention",
            "Central banks sold dollars in foreign exchange markets to push the exchange rate down",
            "The dollar fell approximately 40–50% against the yen and deutschmark over two years",
          ],
          family: "Coordinated devaluation",
          outcome:
            "US manufacturing exports became competitive again. Japanese and German exporters faced a sudden cost shock. The agreement demonstrated that exchange rates — supposedly set by markets — were fully available as a policy instrument when major powers chose to act together.",
          timeLabel: "1985",
          title: "Plaza Accord — Engineered Dollar Depreciation",
          turningPoint:
            "The first explicit multilateral agreement to deliberately move a major currency in a specific direction — establishing that G-level coordination could override market pricing.",
          whyItStarted:
            "The strong dollar of the early 1980s (driven by Volcker\'s high interest rates) had made US manufacturing uncompetitive and ballooned the trade deficit. The Reagan administration, normally market-oriented, decided intervention was necessary.",
        },
        {
          characteristics: [
            "Executive order directed relevant agencies to explore a Strategic Bitcoin Reserve",
            "Would treat confiscated and potentially purchased bitcoin as a sovereign reserve asset",
            "Marks the first time a G7 government formally considered a privately-issued, algorithmically-scarce asset as reserves",
          ],
          family: "Potential new monetary layer (contested)",
          outcome:
            "Policy status uncertain as of mid-2025. If pursued, it would represent the first significant change to US reserve asset policy since the end of gold convertibility in 1971.",
          timeLabel: "2025",
          title: "Bitcoin Strategic Reserve Proposal",
          turningPoint:
            "Signals that monetary architecture is again being treated as a live political question — and that the definition of what counts as a reserve asset is once more open to revision.",
          whyItStarted:
            "A combination of distrust in dollar-denominated debt, political pressure from the crypto industry, and a broader desire to diversify from traditional reserve instruments following the Russia sanctions seizure of USD reserves in 2022.",
        },
      ],
    },
    title: "How the US Rewrites the Rules of Money",
  },

  // ─── Module N: Political Talent Barriers ────────────────────────────────────
  {
    accent: "amber",
    betterMetrics: [
      {
        description: "The share of parliamentarians who are related to a previous elected official — a direct measure of how much hereditary advantage shapes access over merit.",
        label: "Political dynasty rate",
      },
      {
        description: "The ratio of private-sector executive pay to ministerial pay at equivalent responsibility levels. A large gap signals that capable candidates face a real opportunity cost.",
        label: "Public-private pay gap (executive level)",
      },
      {
        description: "The share of working-class citizens in the legislature relative to their share of the population. A ratio near zero signals systematic exclusion, not voter preference.",
        label: "Working class parliamentary representation ratio",
      },
      {
        description: "Whether party selection processes use open primaries, closed internal votes, or leader appointment — the mechanism matters more than the formal rules.",
        label: "Candidate selection openness",
      },
    ],
    betterMetricsTitle: "What to measure instead of just election turnout",
    counterArguments: [
      {
        point: "Voters are free to choose. If bad politicians keep getting elected, that reflects genuine voter preferences.",
        response: "This is the core confusion the module addresses. The barrier operates before the ballot — on who is allowed to stand, not who voters choose. In Greece in 2023, only 24.5% of eligible voters chose the governing party. The constraint is on the supply side, not demand.",
        title: "Voters get what they choose",
      },
      {
        point: "Political families have name recognition and voter trust built over generations — that is a legitimate competitive advantage.",
        response: "Name recognition is an advantage, but the Berkeley/Brown/ECLA study found that only years in office — not policy success or competence — predicted whether a relative got elected. The advantage operates through recognition and access, not performance.",
        title: "Political dynasties reflect earned trust",
      },
      {
        point: "Raising politician salaries would just reward people who were already going to enter politics — it will not attract a different kind of candidate.",
        response: "The international evidence is more specific: higher salaries increase the number of candidates competing for each seat, which raises average quality through competition. The relevant mechanism is not loyalty but selection pressure.",
        title: "Higher salaries just reward the same people more",
      },
    ],
    causalLoop: {
      description:
        "The Casel-Morelli cycle: parties that systematically select for loyalty over competence produce governments that use state resources to entrench incumbents, which makes the original selection bias worse in the next cycle.",
      edges: [
        { from: "party_selection", label: "filters out", polarity: "negative", to: "capable_pool" },
        { from: "capable_pool", label: "determines", polarity: "positive", to: "gov_quality" },
        { from: "gov_quality", label: "shapes", polarity: "positive", to: "institution_integrity" },
        { from: "institution_integrity", label: "constrains", polarity: "negative", to: "party_power" },
        { from: "party_power", label: "tightens", polarity: "positive", to: "party_selection" },
        { from: "gov_quality", label: "undermines", polarity: "negative", to: "citizen_wellbeing" },
        { from: "institution_integrity", label: "if low → enables", polarity: "negative", to: "clientelism" },
        { from: "clientelism", label: "reinforces", polarity: "positive", to: "party_power" },
      ],
      loops: [
        "Reinforcing (decay): party selects loyal over capable → lower quality government → weaker institutions → more party power over state resources → tighter selection → lower quality",
        "Balancing (slow): external shocks — quotas, crisis, international pressure — can interrupt the cycle if institutions are not yet fully captured",
      ],
      nodes: [
        { id: "party_selection",     label: "Party selection bias",      tone: "rose",    x: 300, y: 60 },
        { id: "capable_pool",        label: "Capable candidate pool",    tone: "amber",   x: 560, y: 160 },
        { id: "gov_quality",         label: "Government quality",        tone: "amber",   x: 560, y: 320 },
        { id: "institution_integrity", label: "Institutional integrity", tone: "cyan",    x: 360, y: 420 },
        { id: "party_power",         label: "Party control of state",    tone: "rose",    x: 80,  y: 320 },
        { id: "citizen_wellbeing",   label: "Citizen wellbeing",         tone: "emerald", x: 640, y: 440 },
        { id: "clientelism",         label: "Clientelism / patronage",   tone: "rose",    x: 120, y: 180 },
      ],
      title: "The Casel-Morelli decay cycle",
    },
    difficulty: "Intermediate",
    discussionPrompt:
      "If the barriers operate on who can stand rather than who voters choose, where should reform focus — party internal rules, electoral law, pay structures, or all three simultaneously?",
    eyebrow: "Political system",
    heroHighlights: [
      "In Greece in 2023, 68% of the population is working class but only 2% of parliament came from that background — and even those were party-affiliated unionists, not working professionals.",
      "Every additional year a US Congress member serves roughly doubles the probability that a relative will win a future election — regardless of their policy record.",
      "Swedish evidence shows mandatory gender quotas raised average legislator quality not by adding women, but by removing the low-ability incumbent men who had been actively blocking capable challengers.",
    ],
    miniLesson: {
      accent: "amber",
      conclusion:
        "The five barriers do not operate independently. Dynasty networks fund party campaigns; salary gaps deter the capable; class and gender exclusion narrow the effective talent pool further. Combined, they can reduce the realistic candidate pool to a fraction of the population — not because of voter preferences, but before voters are ever consulted.",
      metrics: [
        {
          description: "What fraction of the adult population is realistically able to enter politics given current barriers.",
          high: "Open system — any qualified adult can realistically run",
          label: "Effective candidate pool (% of adult population)",
          low: "Closed system — candidates drawn from a small pre-selected network",
          signal: "When dynasty rate, class exclusion, and gender exclusion are all high, the realistic pool may be under 5% of the population despite universal suffrage.",
        },
        {
          description: "Whether parties replace ideological platforms with patronage networks as the primary way to hold voter coalitions.",
          high: "Parties compete on policy, not resources",
          label: "Patronage vs. policy competition",
          low: "Patronage dominant — parties trade state jobs and contracts for votes",
          signal: "Loss of ideological coherence is an early symptom: a right-wing government running subsidy programmes, a left-wing one applying austerity, both protecting the same party infrastructure.",
        },
        {
          description: "Whether judicial, regulatory, and media institutions can operate independently of political party networks.",
          high: "Institutions operate independently of incumbent parties",
          label: "Institutional independence from party networks",
          low: "Institutions captured — citizens learn about domestic scandals from foreign prosecutors",
          signal: "When scandals are exposed by foreign investigators rather than domestic ones, institutional capture is already advanced.",
        },
      ],
      subtitle: "Barriers compound, not add",
      title: "Mini lesson: five filters on one pipeline",
    },
    readingTime: "8 min",
    realWorldExamples: [
      {
        insight:
          "Berkeley/Brown/ECLA researchers used two centuries of US data and found that only years served — not competence, not policy success, not voter satisfaction — predicted whether a Congress member\'s relative would subsequently win election. The mechanism was name recognition, donor network access, and party infrastructure, not merit inheritance.",
        outcome:
          "Political families remain structurally over-represented in US Congress relative to their population share, and the advantage compounds over generations regardless of legislative performance.",
        title: "US dynasty study: what predicts a relative winning",
      },
      {
        insight:
          "Patrikios and Xatzikonstandinou (Glasgow, 2015) coded biographic data on Greek MPs from 2000-2012 and found 1 in 5 New Democracy MPs and 1 in 10 PASOK MPs were relatives of previous MPs. Eight of ten post-junta prime ministers came from political dynasties.",
        outcome:
          "Greece\'s equivalent of an alternating hereditary monarchy in the executive: the same family networks rotated through government while the economy deteriorated. The correlation between dynasty dominance and institutional erosion was not coincidental.",
        title: "Greece: eight of ten prime ministers from political dynasties",
      },
      {
        insight:
          "When Sweden introduced mandatory gender quotas, parties were forced to recruit outside their existing networks. Research showed the largest measurable effect was not adding capable women — it was removing the low-ability male incumbents who had been actively blocking better candidates. The quota disrupted the Casel-Morelli selection loop.",
        outcome:
          "Average legislator quality by measurable indicators rose after quota introduction. The mechanism — exogenous disruption of the incumbent protection network — suggests the Casel-Morelli cycle is reversible if interrupted before full institutional capture.",
        title: "Sweden: how gender quotas accidentally improved overall legislator quality",
      },
    ],
    relatedFrameworks: [
      "Entry barriers (industrial organisation)",
      "Casel and Morelli — adverse selection in politics (LSE/Bocconi)",
      "Mancur Olson — logic of collective action",
      "Acemoglu and Robinson — institutions and development",
      "Downs — economic theory of democracy",
    ],
    simulationPrompt:
      "Adjust each entry barrier to see how the capable politician pool, public service quality, and citizen wellbeing respond — with and without the Casel-Morelli feedback spiral activating.",
    simulatorSlug: "political-talent",
    simpleExplanation: [
      "The question of whether we get the politicians we deserve assumes that bad outcomes result from bad voter choices. But the constraint operates on a different side of the system: who is permitted or able to stand for election in the first place. This is the economics of entry barriers applied to political markets.",
      "There are five main barriers. Political dynasties give incumbent families structural advantages in name recognition, fundraising, and party access that no amount of voter discernment can overcome. Party monopolies select for obedience and controllability rather than competence — party leaders prefer candidates who have no good alternatives outside politics, because those candidates are easier to manage. Low public-sector salaries relative to private-sector equivalents create a real opportunity cost for the most capable people with the widest career options. Class exclusion means the largest social group — working people — is nearly absent from legislatures despite no evidence that voters discriminate against them at the ballot box. Gender exclusion removes half the talent pool.",
      "These barriers compound. And according to Casel and Morelli, once the quality floor drops far enough, a feedback loop activates: low-quality politicians use state resources to entrench themselves, which makes the selection bias worse in the next cycle. The system does not produce bad politicians by accident — it produces them structurally. And understanding that changes what reform looks like: not asking voters to choose better, but changing who can enter the system at all.",
    ],
    slug: "why-capable-people-dont-enter-politics",
    summary:
      "Five structural barriers — dynasties, party monopolies, salary gaps, class exclusion, and gender exclusion — filter out capable candidates before voters ever get a choice. The Casel-Morelli cycle then makes the problem self-reinforcing.",
    systemBug: {
      signals: [
        "A high share of parliamentarians are relatives of previous elected officials.",
        "The largest social class in the country has near-zero representation in the legislature.",
        "Parties lose ideological coherence and shift to distributing state resources rather than competing on policy.",
        "Domestic scandals are exposed by foreign prosecutors rather than national institutions.",
        "Capable professionals in law, medicine, engineering, and business consistently avoid politics despite stated concern for public affairs.",
      ],
      summary:
        "Universal suffrage is a necessary but not sufficient condition for representative government. When entry barriers control who can stand, free elections can produce systematically unrepresentative outcomes without any voter choosing badly.",
      title: "System bug: free elections with controlled entry produce unrepresentative government",
    },
    timeline: {
      intro:
        "The intellectual history of the question — from philosophers who blamed the people to economists who identified the structural mechanism.",
      title: "From divine providence to entry barriers: the evolution of an idea",
      events: [
        {
          characteristics: [
            "Plato argued governments reflect the character of the people who produce them",
            "Aristotle added that the relationship is circular: the regime also shapes the people",
            "Both framed the question in moral and psychological terms, not structural ones",
          ],
          family: "Philosophical framing",
          outcome:
            "The moralistic framing — we get the government we deserve — dominated Western political thought for two millennia without producing tools for structural diagnosis.",
          timeLabel: "4th century BC",
          title: "Plato and Aristotle: governments reflect the people",
          turningPoint:
            "The circular insight — people produce regime, regime produces people — was correct but provided no mechanism for breaking the cycle.",
          whyItStarted:
            "Ancient Athens produced the first systematic attempts to explain why different cities had such different political characters.",
        },
        {
          characteristics: [
            "De Maistre claimed nations get the governments they deserve as a matter of divine providence",
            "Montesquieu matched specific civic virtues to specific regime types",
            "The Enlightenment framed the question as civic character, not structural design",
          ],
          family: "Enlightenment framing",
          outcome:
            "The moral responsibility frame — citizens are accountable for their governments — became the dominant popular understanding of democracy and remains so today.",
          timeLabel: "1748 – 1811",
          title: "Montesquieu to De Maistre: character determines government",
          turningPoint:
            "De Maistre\'s 1811 formulation — every nation gets the government it deserves — became the most quoted expression of the idea, cited ever since without its theological basis.",
          whyItStarted:
            "Post-revolutionary Europe needed frameworks for explaining why revolutionary governments so often degenerated, without blaming the institutional design.",
        },
        {
          characteristics: [
            "Adam Smith\'s invisible hand: individuals pursuing self-interest produce optimal collective outcomes",
            "Applied to politics: voters pursuing self-interest produce representative governments",
            "The analogy assumed free entry — the same assumption that Smith himself knew was violated in practice",
          ],
          family: "Economic analogy",
          outcome:
            "The invisible hand became the implicit model for democratic theory: free elections were treated as analogous to free markets, with voters as consumers and politicians as producers.",
          timeLabel: "1776",
          title: "Adam Smith\'s invisible hand — and its limits",
          turningPoint:
            "Smith himself documented economic oligarchies and political capture in book five of The Wealth of Nations, suggesting he knew the self-regulating model had exceptions. He never applied his doubts to the political analogy.",
          whyItStarted:
            "The Wealth of Nations provided the first systematic framework for understanding how decentralised choice could produce order — and the political application seemed natural.",
        },
        {
          characteristics: [
            "Entry barriers: structural features that prevent competitive markets from working, independent of freedom of choice",
            "Applied to politics: the constraint is on who can stand, not who voters choose",
            "Five political entry barriers identified: dynasties, party monopolies, salary gaps, class exclusion, gender exclusion",
          ],
          family: "Structural diagnosis",
          outcome:
            "The entry barrier framework shifts responsibility from voters to institutional design — and from the demand side of politics to the supply side.",
          timeLabel: "20th–21st century",
          title: "The entry barriers framework: supply-side politics",
          turningPoint:
            "Recognising that a perfectly free voting system can produce systematically unrepresentative outcomes if entry to the candidate pool is controlled — without any fraud or manipulation of the vote.",
          whyItStarted:
            "Industrial organisation economics developed entry barrier theory to explain why free markets sometimes produce persistent monopolies. Political scientists began applying the same logic to candidate selection.",
        },
        {
          characteristics: [
            "Parties that select for loyalty over competence lose capable candidates to private careers",
            "Lower quality government produces weaker institutions",
            "Weaker institutions give party networks more control over state resources",
            "More party power enables tighter control over candidate selection",
          ],
          family: "Feedback mechanism",
          outcome:
            "Countries that cross the clientelism threshold face a structurally self-reinforcing spiral. The same party networks that caused the problem gain the resources to perpetuate it.",
          timeLabel: "Casel & Morelli (LSE / Bocconi)",
          title: "The Casel-Morelli adverse selection cycle",
          turningPoint:
            "Adverse selection in political markets: bad candidates drive out good ones not through competition but through party control of the entry mechanism. Once patronage replaces policy competition, the equilibrium is stable and self-reinforcing.",
          whyItStarted:
            "Casel and Morelli formalised the observation that low-quality political systems seem to get worse over time even without external shocks — the selection mechanism itself produces the deterioration.",
        },
        {
          characteristics: [
            "Mandatory quotas forced parties outside their incumbent networks",
            "Parties recruited women with genuine professional qualifications rather than party pedigree",
            "The largest measurable effect was removing the low-ability men who had been blocking better candidates",
            "Average legislator quality rose",
          ],
          family: "Reform evidence",
          outcome:
            "Proof of concept that the Casel-Morelli cycle can be interrupted by exogenous shock to the selection mechanism — not necessarily through voter mobilisation but through changes to who is eligible to stand.",
          timeLabel: "Sweden — post-quota evidence",
          title: "Swedish gender quotas as unintended system reform",
          turningPoint:
            "The finding that the quality gain came from removing blocking incumbents rather than adding qualified women reframed quotas as an institutional reform tool, not just an equity measure.",
          whyItStarted:
            "Mandatory quotas were introduced primarily as a gender equity policy. The spillover effect on overall legislative quality was an empirical finding, not a design intention.",
        },
      ],
    },
    title: "Why Capable People Don\'t Enter Politics",
  },
];

export function getLearningModuleBySlug(slug: string): LearningModule | undefined {
  return learningModules.find((m) => m.slug === slug);
}
