import type { LearningModule } from "./_types";
import { owidEvidenceLinks } from "./_shared";

export const lessonData: LearningModule = {
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
    discussionPrompt:
      "If the economy depends on ecological systems it does not replace, what should count as success: GDP growth, lower emissions intensity, or keeping everyone above a social floor while staying below ecological ceilings?",
    heroHighlights: [
      "Doughnut economics says a good economy must keep everyone above a social floor and below ecological ceilings.",
      "Nature is not an external side issue; it is the material base the economy operates inside.",
      "Green finance matters only if it actually redirects investment and shares the gains fairly.",
    ],
    miniLesson: {
    bands: [
      {
        threshold: 0,
        insight:
          "At 2 tonnes/capita — typical of sub-Saharan Africa and parts of South Asia — material consumption is far below ecological ceilings, but most social floors are unmet: inadequate healthcare, housing, nutrition, and energy access.",
      },
      {
        threshold: 6,
        insight:
          "Around 7–8 tonnes/capita sits the theoretically viable zone: research suggests most social floors can be met without necessarily breaching all ecological ceilings at this level. No country currently achieves both simultaneously.",
      },
      {
        threshold: 14,
        insight:
          "At 16 tonnes — close to the EU average — social floors are largely met, but ecological ceilings are clearly being breached: CO₂ budgets, freshwater drawdown, and land-use change all exceed safe operating space.",
      },
      {
        threshold: 24,
        insight:
          "At 26–30 tonnes — the US and Australian average — all social floors are met, but the economy consumes material at 3–4 times the sustainable rate. Growth at this level is ecologically incompatible with a safe operating space for all 8 billion people.",
      },
    ],
    defaultValue: 16,
    description:
      "The doughnut has two boundaries: a social floor (basic needs met) and an ecological ceiling (planetary limits not breached). Move the slider to see where different consumption levels land — and why no country currently sits inside the doughnut.",
    highLabel: "30 t (US/Australia)",
    lowLabel: "2 t (low-income avg)",
    metrics: [
      {
        base: 10,
        description: "Share of the 12 core social floor indicators (food, health, housing, energy, education, etc.) broadly met at this consumption level",
        key: "social-floor",
        label: "Social floor indicators met",
        max: 90,
        min: 10,
        slope: 2.86,
        suffix: "%",
        tone: "emerald",
      },
      {
        base: 10,
        description: "Share of planetary boundaries (climate, biodiversity, freshwater, land use, nitrogen) under pressure at this consumption level",
        key: "ceiling-pressure",
        label: "Ecological ceiling pressure",
        max: 95,
        min: 10,
        slope: 3.04,
        suffix: "%",
        tone: "rose",
      },
      {
        base: 60,
        description: "Share of current countries whose consumption level sits in or below the doughnut's viable zone",
        key: "in-doughnut",
        label: "Countries within viable range",
        max: 60,
        min: 1,
        slope: -2.1,
        suffix: "%",
        tone: "cyan",
      },
    ],
    prompt: "Move the slider to see the trade-off between meeting social needs and staying within ecological limits.",
    sliderLabel: "Material consumption per capita",
    step: 1,
    title: "The social floor vs ecological ceiling trade-off",
    unit: " t/yr",
    valueMax: 30,
    valueMin: 2,
  },
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
  proposals: [
    {
      title: "Adopt Doughnut Economics as the official framework for city and regional planning",
      summary: "The Doughnut model — meeting social foundations while staying within ecological ceilings — provides a practical planning tool that cities can apply today. Embedding it in statutory planning requirements changes what counts as a successful development application.",
      actor: "local_gov",
      domain: "environmental",
      feasibility: "emerging",
      precedents: [
        { place: "Amsterdam", year: 2020, outcome: "First city to adopt Doughnut as official policy framework; used to redesign post-COVID recovery plan; attracted global policy interest" },
        { place: "Copenhagen, Brussels, Dunedin", year: 2021, outcome: "Cities joined Doughnut Cities Network; embedding framework in local planning documents and budget processes" },
      ],
    },
    {
      title: "Mandate full environmental and social footprint accounting in corporate reporting",
      summary: "Companies that only report financial profit are optimising for a partial picture. Mandatory integrated reporting including Scope 3 emissions, water use, biodiversity impact, and supply chain labour conditions makes true costs visible and comparable.",
      actor: "national_gov",
      domain: "economic",
      feasibility: "emerging",
      precedents: [
        { place: "EU (CSRD)", year: 2023, outcome: "Corporate Sustainability Reporting Directive requires 50,000+ EU companies to report against sustainability standards from 2024-2028" },
        { place: "New Zealand", year: 2021, outcome: "First country to mandate climate-risk reporting for all large financial firms; TCFD-aligned; extends to 200 largest entities from 2023" },
      ],
    },
  ],

  };
