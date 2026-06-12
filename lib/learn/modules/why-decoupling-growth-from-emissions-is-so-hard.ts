import type { LearningModule } from "./_types";

export const lessonData: LearningModule = {
  betterMetrics: [
    {
      label: "Absolute decoupling rate",
      description:
        "Are total emissions falling while GDP grows — not just emissions per unit of GDP? Relative decoupling is common; absolute decoupling at scale is rare.",
    },
    {
      label: "Consumption-based carbon footprint",
      description:
        "Emissions from all goods consumed domestically, regardless of where they were produced. Production-based accounting lets rich countries outsource emissions while claiming progress.",
    },
    {
      label: "Material footprint per capita",
      description:
        "Total raw materials extracted globally to support a country's consumption. Has grown in parallel with GDP in most countries, despite efficiency improvements.",
    },
    {
      label: "Remaining carbon budget",
      description:
        "Cumulative CO₂ emissions compatible with staying below 1.5°C (~400 GtCO₂ as of 2024 at 67% probability). Measures whether current trajectories are compatible with the target.",
    },
  ],
  betterMetricsTitle: "What actual progress would look like",
  causalLoop: {
    description:
      "Economic growth increases energy demand. Efficiency improvements reduce emissions per unit of output — but lower costs enable more consumption, and growth typically outpaces efficiency gains. The result: relative decoupling without absolute decoupling.",
    edges: [
      { from: "gdp", label: "raises", polarity: "positive", to: "energy" },
      { from: "energy", label: "produces", polarity: "positive", to: "emissions" },
      { from: "emissions", label: "causes", polarity: "positive", to: "climate" },
      { from: "climate", label: "damages", polarity: "negative", to: "gdp" },
      { from: "efficiency", label: "cuts emissions per unit", polarity: "negative", to: "emissions" },
      { from: "efficiency", label: "lowers cost → more use", polarity: "positive", to: "energy", bend: 20 },
      { from: "gdp", label: "funds", polarity: "positive", to: "efficiency" },
      { from: "renewables", label: "displaces fossil fuels", polarity: "negative", to: "emissions" },
      { from: "gdp", label: "scales demand faster than", polarity: "positive", to: "energy", bend: -15 },
    ],
    loops: [
      "R1 — Growth–emissions spiral: GDP raises energy demand, which raises emissions, which damages GDP — but slowly and unevenly, so the feedback is too weak to constrain growth.",
      "R2 — Jevons rebound: efficiency improvements lower the cost of energy services, enabling more consumption, partially offsetting the emissions reduction.",
      "B1 — Renewable substitution: as renewable capacity scales, it displaces fossil energy — this is the balancing loop that decoupling strategies depend on.",
    ],
    nodes: [
      { id: "gdp", label: "GDP growth", tone: "cyan", x: 30, y: 20 },
      { id: "energy", label: "Total energy demand", tone: "amber", x: 70, y: 20 },
      { id: "emissions", label: "Total emissions", tone: "rose", x: 70, y: 55 },
      { id: "climate", label: "Climate damage", tone: "rose", x: 70, y: 85 },
      { id: "efficiency", label: "Energy efficiency", tone: "emerald", x: 30, y: 55 },
      { id: "renewables", label: "Renewable energy share", tone: "emerald", x: 10, y: 85 },
    ],
    title: "The growth–emissions–efficiency loop",
  },
  counterArguments: [
    {
      point:
        "Several wealthy countries have grown their economies while cutting absolute emissions — the UK, Germany, and Denmark are examples. Green growth is already happening.",
      response:
        "These are real achievements, but most rely partly on shifting manufacturing abroad. When emissions are accounted for on a consumption basis — including imported goods — the decoupling is significantly smaller. UK production-based emissions fell 44% between 1990 and 2019; consumption-based fell only 15%. The rest was outsourced.",
      title: "Some countries have already decoupled",
    },
    {
      point:
        "Technology moves fast. Solar, wind, and battery costs have fallen 90%+ in a decade. The clean energy transition will simply replace fossil fuels without requiring degrowth.",
      response:
        "Renewable deployment is real and fast — but the scale required to offset growth in demand is enormous. Global electricity demand is rising partly because of economic growth. Meanwhile, hard-to-abate sectors (cement, steel, shipping, aviation, agriculture) account for roughly 30% of emissions and have no near-term clean substitute at scale.",
      title: "Technology will solve it",
    },
    {
      point:
        "Carbon pricing internalises the externality. If emissions had a price, the market would automatically find the most efficient path to decoupling.",
      response:
        "Carbon pricing helps, but current prices are far below levels needed to change behaviour in most sectors. The IMF estimates an effective carbon price of $75/tonne is needed by 2030; most existing schemes are well below that. Pricing also doesn't address the distributional effects of making energy more expensive for low-income households.",
      title: "Carbon pricing fixes the incentive problem",
    },
  ],
  discussionPrompt:
    "If efficiency improvements often lead to more total consumption rather than less — the Jevons Paradox — what does that imply about technological optimism as a response to ecological limits? Is the problem one of incentives, of scale, or of something structural about how growth works?",
  evidenceLinks: [
    {
      note:
        "Production-based CO₂ emissions by country over time — shows where emissions are actually being generated, and tracks which economies have achieved absolute reductions.",
      source: "Our World in Data",
      title: "CO₂ emissions",
      url: "https://ourworldindata.org/co2-emissions",
    },
    {
      note:
        "Consumption-based vs production-based emissions comparison — the gap between these two measures reveals the extent of carbon outsourcing by high-income countries.",
      source: "Our World in Data",
      title: "Consumption-based CO₂ emissions",
      url: "https://ourworldindata.org/consumption-based-co2",
    },
    {
      note:
        "Global primary energy consumption over time — tracks whether the energy transition is displacing fossil fuels or adding on top of them.",
      source: "Our World in Data",
      title: "Energy mix",
      url: "https://ourworldindata.org/energy-mix",
    },
  ],
  heroHighlights: [
    "Global CO₂ emissions hit a new record in 2023 despite renewable energy growing faster than at any point in history — growth in demand outpaced clean supply.",
    "The Jevons Paradox: efficiency improvements lower the cost of energy services, enabling more consumption, partially or fully offsetting the emissions saved.",
    "Most rich-country emissions declines partly reflect carbon outsourcing — importing goods whose production emissions are counted in poorer countries.",
  ],
  miniLesson: {
    bands: [
      {
        threshold: 0,
        insight:
          "At zero GDP growth with rapid decarbonisation, the remaining carbon budget lasts decades and 1.5°C is achievable. This is the mathematical baseline — but it assumes no economic growth at all.",
      },
      {
        threshold: 1,
        insight:
          "At 1% annual growth, staying within the 1.5°C budget requires decarbonisation roughly 10× faster than the current global rate. Possible in theory; unprecedented in practice.",
      },
      {
        threshold: 2,
        insight:
          "At 2% global growth — below the historical average — the required pace of emissions reduction per unit of GDP is faster than any country has sustained. Some sectors have no clean substitute yet.",
      },
      {
        threshold: 3,
        insight:
          "At 3% growth, comparable to recent global averages, staying within 1.5°C requires decoupling emissions from GDP at a rate that has never been achieved at scale. The 2°C budget gives more room, but is still tight.",
      },
    ],
    defaultValue: 2,
    description:
      "The IPCC estimates a remaining carbon budget of roughly 400 GtCO₂ for a 67% chance of limiting warming to 1.5°C. Move the slider to see how GDP growth rate affects how long the budget lasts — assuming current emissions intensity improves at the fastest historical rate.",
    highLabel: "High growth (3%+/yr)",
    lowLabel: "Zero growth",
    metrics: [
      {
        base: 100,
        description: "Years until the 1.5°C carbon budget is exhausted at this growth rate",
        key: "budget_years",
        label: "Years of 1.5°C budget remaining",
        max: 100,
        min: 3,
        slope: -22,
        suffix: " yrs",
        tone: "emerald",
      },
      {
        base: 2,
        description: "Annual decarbonisation rate required to stay within the 1.5°C budget",
        key: "required_decarbonisation",
        label: "Required decarbonisation rate",
        max: 30,
        min: 2,
        slope: 7,
        suffix: "%/yr",
        tone: "rose",
      },
      {
        base: 0,
        description: "Ratio of required decarbonisation to fastest rate any major economy has sustained",
        key: "feasibility_gap",
        label: "Multiples of fastest historical rate",
        max: 15,
        min: 1,
        slope: 3.5,
        suffix: "×",
        tone: "amber",
      },
    ],
    prompt: "Adjust the GDP growth rate to see what decarbonisation challenge it implies.",
    sliderLabel: "Annual GDP growth rate",
    step: 1,
    title: "The growth–budget arithmetic",
    unit: "%",
    valueMax: 5,
    valueMin: 0,
  },
  realWorldExamples: [
    {
      title: "UK: the outsourcing illusion",
      insight:
        "The UK is often cited as a decoupling success story: production-based emissions fell by roughly 44% between 1990 and 2019 while GDP grew significantly. But the UK also deindustrialised over this period, moving manufacturing offshore.",
      outcome:
        "On a consumption basis — counting emissions in imported goods — the UK's reduction was only about 15%. The rest was outsourced to China, Bangladesh, and elsewhere. The UK's carbon footprint was exported, not eliminated. This pattern holds for most high-income countries that report large production-based reductions.",
    },
    {
      title: "The Jevons Paradox in LED lighting",
      insight:
        "LED lighting is roughly 75% more efficient than incandescent bulbs. As LEDs became cheap and ubiquitous after 2010, electricity used for lighting was expected to fall sharply.",
      outcome:
        "Global electricity consumption for lighting increased. Lower cost made lighting affordable in new contexts: streets, advertising, always-on commercial spaces, developing-country expansion. The efficiency gain enabled more use rather than less total consumption. This rebound dynamic operates across energy systems — fuel-efficient cars enable longer commutes; efficient appliances are bought in greater numbers.",
    },
    {
      title: "China: green energy and record emissions simultaneously",
      insight:
        "China installed more solar and wind capacity in 2023 than the entire rest of the world combined — a genuinely extraordinary feat of clean energy deployment. In the same year, China's CO₂ emissions hit a new record high.",
      outcome:
        "Renewable deployment is running in parallel with, not instead of, continued fossil fuel expansion to meet growth in total energy demand. China approved more new coal power plants in 2022–2023 than in any comparable period. This illustrates the central problem: when the economy is growing fast enough, efficiency and clean energy additions get absorbed by new demand rather than replacing old supply.",
    },
  ],
  relatedFrameworks: [
    "Jevons Paradox and the rebound effect",
    "Absolute vs relative decoupling",
    "IPCC carbon budgets",
    "Planetary boundaries (Rockström et al.)",
    "Degrowth and post-growth economics",
    "Material footprint accounting",
  ],
  simulationPrompt:
    "Set the GDP growth rate, clean energy deployment speed, and carbon price level to explore whether absolute decoupling is achievable within the remaining 1.5°C budget.",
  slug: "why-decoupling-growth-from-emissions-is-so-hard",
  simpleExplanation: [
    "Economic growth and energy use have moved together for the entire history of industrial capitalism. More output means more factories, more transport, more buildings, more heating and cooling. This relationship can be weakened — efficiency improvements mean less energy per unit of output — but weakening a ratio is not the same as shrinking the total.",
    "The Jevons Paradox captures the problem precisely: when you make something more efficient, you lower its effective cost, which enables more use of it. James Watt's improved steam engine didn't reduce coal consumption in England — it made coal-powered production so much cheaper that total coal use exploded. The same dynamic appears in modern LED lighting, fuel-efficient cars, and efficient industrial processes: relative efficiency goes up, total consumption often goes up too.",
    "This matters for climate because staying within the 1.5°C carbon budget requires absolute emissions to fall, starting now. Relative decoupling — falling emissions per unit of GDP — is not enough if the economy is growing fast enough to make total emissions rise anyway. And the hard-to-abate sectors (cement, steel, shipping, aviation, agriculture) have no low-cost clean substitute at present scale.",
    "None of this means the transition is impossible or that renewable energy is irrelevant — it is essential. But it does mean that the arithmetic of the carbon budget is more demanding than most public discourse acknowledges. The question is not whether clean energy is growing, but whether it is growing fast enough to both displace existing fossil energy and absorb new demand created by economic growth.",
  ],
  systemBug: {
    signals: [
      "Global emissions hit new records in years when the clean energy transition is described as accelerating",
      "Rich countries report large production-based emissions reductions while consumption-based footprints fall much less",
      "Efficiency gains in one sector are followed by increased total consumption in that sector",
      "Hard-to-abate sectors (cement, steel, shipping, aviation) continue growing without viable clean substitutes",
    ],
    summary:
      "GDP growth is the central measure of economic success, and growing GDP typically requires growing energy throughput. Efficiency improvements reduce emissions per unit but lower costs in ways that enable more consumption. The system is structured to reward growth and to treat emissions as an externality — a cost that falls on others, later.",
    title: "System bug: growth is rewarded; emissions are an externality the system doesn't see",
  },
  proposals: [
    {
      title: "Introduce a carbon border adjustment mechanism to prevent emissions being offshored",
      summary: "Carbon taxes only work if production cannot simply move to unregulated jurisdictions. Carbon border adjustments — tariffs on imports from countries without equivalent carbon pricing — close the leak and prevent competitive disadvantage, creating an incentive for global adoption.",
      actor: "national_gov",
      domain: "economic",
      feasibility: "proven",
      precedents: [
        { place: "EU (CBAM)", year: 2023, outcome: "Carbon Border Adjustment Mechanism in transitional phase from 2023; full implementation 2026; covers steel, cement, aluminium, fertilisers, electricity" },
        { place: "UK", year: 2024, outcome: "Committed to matching EU CBAM timeline; diplomatic pressure on trading partners to adopt carbon pricing accelerated" },
      ],
    },
    {
      title: "End fossil fuel subsidies and redirect them to renewable energy transition support",
      summary: "Governments globally provide $7 trillion/year in fossil fuel subsidies (explicit and implicit). Eliminating these and redirecting even a fraction to renewable deployment, energy efficiency, and just transition support for fossil fuel workers would accelerate decarbonisation faster than any other single measure.",
      actor: "national_gov",
      domain: "economic",
      feasibility: "contested",
      precedents: [
        { place: "Denmark", year: 2020, outcome: "Ended all new oil and gas licensing; redirected energy revenues to green transition fund — world's first oil producer to commit to managed fossil fuel phase-out" },
        { place: "Costa Rica", year: 1994, outcome: "Eliminated fossil fuel subsidies; reinvested in reforestation and renewables; now runs on 99%+ renewable electricity" },
      ],
    },
    {
      title: "Establish sectoral emissions standards for buildings, transport, and industry with enforcement teeth",
      summary: "Voluntary pledges without binding sectoral standards consistently miss targets. Legally mandated efficiency standards for new buildings, vehicle fleets, and industrial processes — with meaningful penalties — drive investment in low-carbon alternatives faster than price signals alone.",
      actor: "national_gov",
      domain: "environmental",
      feasibility: "proven",
      precedents: [
        { place: "EU (Fit for 55)", year: 2023, outcome: "Ban on new petrol/diesel cars from 2035; building renovation standards; industry ETS expansion; combined projected to achieve 57% emissions reduction vs. 1990 by 2030" },
        { place: "California", year: 2002, outcome: "Zero Emission Vehicle mandate drove EV development globally; ZEV standards adopted by 15+ US states and influenced global automaker investment decisions" },
      ],
    },
  ],
};
