import type { LearningModule } from "./_types";

export const lessonData: LearningModule = {
  slug: "how-capitalism-evolved-through-stages",

  heroHighlights: [
    "Capitalism is not a fixed system — it has passed through at least six distinct organisational stages, each with different rules about who captures value and who carries risk.",
    "The shift from Keynesian managed capitalism to shareholder capitalism after 1980 was a deliberate political choice, not an economic inevitability.",
    "Platform and surveillance capitalism represent a qualitative break: data extracted from behaviour becomes a raw material, and the logic of enclosure moves from land and factories to attention and prediction.",
  ],

  simpleExplanation: [
    "Most people experience capitalism as simply the way the economy works — but the system has reorganised itself radically at least six times since the 1500s. Each stage rested on a different answer to the same three questions: What is the primary source of profit? Who bears risk? And what does the state permit, encourage, or forbid?",
    "Merchant capitalism (roughly 1500–1800) was built on trade across long distances and colonial extraction. Profit came from buying cheap in one place and selling dear in another — or from seizing resources outright. The joint-stock company and the slave trade were its defining institutions.",
    "Industrial capitalism (1800–1914) shifted profit to the production process itself. Wage labour in factories meant owners could extract surplus from the gap between what workers produced and what they were paid. This stage produced the labour movement, the first unions, and the first socialist political parties as responses.",
    "Finance capitalism (1900–1930s) saw banks and financial institutions gain dominance over industrial firms — Hilferding called it 'finance capital', Lenin saw it as imperialism's infrastructure. Investment banks became the commanding heights of the system.",
    "Keynesian or managed capitalism (1945–1975) was a deliberate political settlement after the Depression and World War II. Governments managed demand, welfare states guaranteed floors, and collective bargaining distributed productivity gains more evenly. Profit was still the motive, but the state set guardrails and the deal between capital and labour was explicit.",
    "Shareholder capitalism (1976–present) was a counter-revolution. Milton Friedman's 1970 essay argued the sole responsibility of a firm is to increase profit for shareholders. Reagan and Thatcher enacted it. Firms shrank workforces, offshored production, bought back shares, and stripped accumulated reserves to maximise quarterly returns. Risk transferred from corporations and states back onto individuals.",
    "Platform and surveillance capitalism (2000s–present) is a qualitative shift within shareholder capitalism. Data extracted from human behaviour becomes a raw material for predicting and modifying future behaviour. The platforms do not simply sell products — they sell certainty about what users will do next to advertisers and other buyers. The economic logic resembles enclosure: commons of attention and social life are fenced off for private profit.",
    "Stakeholder capitalism is a proposal — most prominently associated with Klaus Schwab and the World Economic Forum — that corporations should serve all stakeholders (employees, communities, environment) rather than shareholders alone. Critics on the left argue it is shareholder capitalism with better marketing; critics on the right argue it is political overreach by business elites. Whether it represents a genuine stage shift or a rebranding exercise is an open empirical question.",
  ],

  betterMetricsTitle: "What actually distinguishes one stage from another",
  betterMetrics: [
    {
      label: "Primary source of profit",
      description: "Where does the surplus originate — trade arbitrage, production, financial intermediation, government contracts, or extraction of behavioural data?",
    },
    {
      label: "Who bears economic risk",
      description: "Is risk distributed across society through welfare states and collective bargaining, or concentrated on individuals through flexible labour, gig contracts, and asset price exposure?",
    },
    {
      label: "State–market boundary",
      description: "Which domains are governed by market logic and which by public planning, regulation, or rights — and how has that boundary been drawn and redrawn?",
    },
    {
      label: "Labour's share of productivity gains",
      description: "When the economy grows, how much of the gain flows to wages versus capital returns? This ratio has moved dramatically across stages.",
    },
    {
      label: "Dominant institutional form",
      description: "The joint-stock company, the industrial conglomerate, the welfare state, the shareholder-value firm, the platform ecosystem — each stage has a characteristic organising form.",
    },
  ],

  counterArguments: [
    {
      title: "Capitalism has always been essentially the same",
      point: "Private property, markets, and profit incentives are constant across all these stages. Calling them different capitalisms obscures more than it reveals.",
      response: "The constants exist, but they do not determine outcomes. Keynesian capitalism and shareholder capitalism share private property, but produced dramatically different distributions of income, risk, and security. The institutional variation within capitalism is what generates its different political and social consequences.",
    },
    {
      title: "The stages were driven by technology, not politics",
      point: "Each stage emerged because technology changed production — steam power, electrification, computing — not because of ideological choices.",
      response: "Technology creates possibilities; politics determines which possibilities become dominant. The shift to shareholder capitalism was codified through specific legal changes (stock options, hostile takeover rules, financial deregulation) and macroeconomic policy (abandoning full employment as a target). Those were choices made by people in political conflict.",
    },
    {
      title: "Stakeholder capitalism is the solution",
      point: "We do not need to change the system fundamentally — we just need corporations to take responsibility for their broader impact.",
      response: "Stakeholder capitalism is a claim about corporate purpose that relies on the goodwill of executives and has no enforcement mechanism. History suggests that when shareholder returns and stakeholder interests conflict, shareholders win unless there is a legal or political structure that compels otherwise. Purpose statements without accountability are branding.",
    },
    {
      title: "Platform capitalism is just capitalism with better technology",
      point: "Google and Amazon are just very efficient firms — the underlying logic is profit, same as always.",
      response: "Shoshana Zuboff's argument is that the raw material is genuinely new: it is behavioural data harvested at scale to build prediction products. The economic logic is not selling goods to users — it is selling predictions about users to third parties. This asymmetry in information and power is structurally different from previous stages.",
    },
  ],

  realWorldExamples: [
    {
      title: "The East India Company as merchant capitalism",
      outcome: "The British East India Company (1600–1874) combined state charter, joint-stock ownership, private armies, and territorial control to extract wealth from South Asia. It was not just a trading firm — it governed 90 million people at its peak and remitted tax revenue to shareholders.",
      insight: "Merchant capitalism required state power as infrastructure. The company did not conquer Bengal; the British state's navy and diplomatic backing made it possible. The private–public boundary was dissolved from the start.",
    },
    {
      title: "The post-war settlement and its limits",
      outcome: "Between 1945 and 1975 across Western Europe and North America, GDP grew faster than at any other period, unions covered 30–50% of workers, and the income share going to the bottom half of earners rose substantially. The Gini coefficient fell in most OECD countries over this period.",
      insight: "Managed capitalism was not natural or self-sustaining. It required continuous political pressure from labour movements and left parties, a memory of the Depression, and the Cold War context in which Western elites accepted social contracts to forestall communist appeal.",
    },
    {
      title: "The shareholder revolution — GE as a case",
      outcome: "Under Jack Welch (1981–2001), General Electric became the paradigm case of shareholder capitalism. Welch cut 100,000 workers in his first five years, built GE Capital into a finance arm that generated 40% of profits, expanded share buybacks, and hit quarterly targets ruthlessly. GE's stock rose 4,000% over his tenure. After his departure, GE Capital nearly destroyed the company in 2008, and GE itself was broken up by 2021.",
      insight: "Shareholder capitalism produced enormous short-term returns while degrading long-term capacity. The quarterly earnings discipline transferred wealth from workers, suppliers, and long-term investors to managers (via options) and short-term shareholders.",
    },
    {
      title: "Google's surveillance capitalism in practice",
      outcome: "Google's advertising revenue grew from $70 million in 2001 to $237 billion in 2023. The core product is not search — it is a prediction machine trained on behavioural data harvested from search, email, maps, video, and mobile operating systems. Users are the input, not the customer.",
      insight: "The enclosure of behavioural commons happened quietly and by stealth. Users did not agree to provide raw material for a prediction product; they agreed to free services. The asymmetry of information between the platform and the user is the foundation of the business model.",
    },
  ],

  systemBug: {
    title: "System bug: treating the current stage as the final form",
    summary: "Each stage of capitalism was treated by its contemporaries as natural, permanent, and optimal. Merchant capitalists believed empire was the natural order. Industrial capitalists believed poverty wages were an iron law. Shareholder capitalism today is presented as the only rational form of market organisation. This naturalisation makes the political choices that produced each stage invisible, and makes deliberate redesign seem impossible.",
    signals: [
      "Business school curricula present shareholder value maximisation as a law of economics rather than a legal and political choice made in the 1970s and 80s.",
      "Platform companies describe data harvesting as a fair exchange for free services, obscuring the asymmetry of information and the behaviour-modification product being sold.",
      "'Stakeholder capitalism' is presented as a new stage by its proponents, while its critics note it has no enforcement mechanism and relies on the discretion of the same executives whose compensation is tied to share price.",
      "Economic historians who study earlier stages of capitalism are rarely invited to help design the next one.",
    ],
  },

  causalLoop: {
    title: "How each stage of capitalism reproduces itself",
    description: "Each stage of capitalism creates the institutional conditions that make the next round of capital accumulation possible, while also generating contradictions that eventually force a transition. The current stage extracts value from behavioural data — but the concentration this creates also produces political resistance that may force a redesign.",
    nodes: [
      { id: "dominantInstitution", label: "Dominant institution", tone: "amber", x: 250, y: 40 },
      { id: "rulesSetting",        label: "Rules of accumulation", tone: "cyan",  x: 480, y: 120 },
      { id: "profitFlows",         label: "Where profit flows",    tone: "emerald",x: 480, y: 280 },
      { id: "riskDistribution",    label: "Who bears risk",        tone: "rose",   x: 250, y: 360 },
      { id: "politicalPressure",   label: "Counter-pressure",      tone: "rose",   x: 60,  y: 220 },
      { id: "crisisEvent",         label: "Crisis or rupture",     tone: "amber",  x: 250, y: 220 },
    ],
    edges: [
      { from: "dominantInstitution", to: "rulesSetting",      label: "lobbies for",    polarity: "positive" },
      { from: "rulesSetting",        to: "profitFlows",        label: "determines",     polarity: "positive" },
      { from: "profitFlows",         to: "riskDistribution",   label: "shapes",         polarity: "positive" },
      { from: "riskDistribution",    to: "politicalPressure",  label: "generates",      polarity: "positive" },
      { from: "politicalPressure",   to: "crisisEvent",        label: "accelerates",    polarity: "positive" },
      { from: "crisisEvent",         to: "dominantInstitution",label: "disrupts or replaces", polarity: "negative" },
      { from: "profitFlows",         to: "dominantInstitution",label: "concentrates power in", polarity: "positive" },
    ],
    loops: [
      "Reinforcing: dominant institution → rules of accumulation → profit flows → concentration → dominant institution (each stage self-reinforces until crisis)",
      "Balancing: risk concentration → counter-pressure → crisis → institutional disruption → new stage (the mechanism of stage transition)",
    ],
  },

  miniLesson: {
    title: "Mini lesson: where does profit come from in each stage?",
    description: "Adjust the slider from merchant capitalism through to platform capitalism. Watch how the source of profit, the labour share, and the risk distribution change across stages.",
    sliderLabel: "Stage of capitalism",
    lowLabel: "Merchant (1600s)",
    highLabel: "Platform (2020s)",
    unit: "",
    valueMin: 1,
    valueMax: 6,
    defaultValue: 4,
    step: 1,
    metrics: [
      {
        key: "labour-share",
        label: "Labour share of income",
        description: "How much of total national income goes to wages versus capital returns. Peaked in Keynesian stage, collapsed under shareholder capitalism.",
        base: 30,
        slope: 6,
        min: 20,
        max: 70,
        suffix: "%",
        tone: "emerald",
      },
      {
        key: "risk-on-individuals",
        label: "Risk borne by individuals",
        description: "The degree to which economic risk sits on workers and households versus being pooled through welfare states, pensions, or employer guarantees.",
        base: 20,
        slope: 10,
        min: 10,
        max: 90,
        suffix: "/100",
        tone: "rose",
      },
      {
        key: "financial-sector-share",
        label: "Financial sector profit share",
        description: "What fraction of total corporate profits flows to financial intermediaries (banks, asset managers, platforms) rather than to producers of goods and services.",
        base: 10,
        slope: 8,
        min: 5,
        max: 55,
        suffix: "%",
        tone: "cyan",
      },
    ],
    bands: [
      {
        threshold: 0,
        insight: "Merchant capitalism: profit comes from trade arbitrage and colonial extraction. Labour share is minimal — most workers are enslaved, bonded, or subsistence peasants. Risk is borne by the merchant syndicate and the state.",
      },
      {
        threshold: 2,
        insight: "Industrial capitalism: profit shifts to the factory floor — the gap between wages and the value workers produce. Labour share is low but contested; the labour movement begins to organise to raise it.",
      },
      {
        threshold: 3,
        insight: "Finance capitalism: banks and financial institutions intermediate between savers and industrial producers and take a growing cut. Investment decisions concentrate in financial institutions, not just industrialists.",
      },
      {
        threshold: 4,
        insight: "Keynesian capitalism: the post-war settlement. Labour share rises, welfare states pool risk, productivity gains are broadly shared. Financial sector is regulated and subordinate. This is the anomaly in the historical record.",
      },
      {
        threshold: 5,
        insight: "Shareholder capitalism: corporations restructure around quarterly returns. Wages stagnate, benefits are cut, gig arrangements shift risk onto workers. Finance grows to 40%+ of corporate profits in some economies.",
      },
      {
        threshold: 6,
        insight: "Platform capitalism: profit comes from behavioural data harvested at scale. Users are inputs, not customers. The financial sector and the platform ecosystem merge as the dominant institutional form. Risk is entirely individualised.",
      },
    ],
    prompt: "The slider moves through six distinct stages. The metrics do not show smooth trends — the Keynesian reversal shows that stage transitions are political choices, not inevitable progressions.",
  },

  timeline: {
    title: "Six stages of capitalism",
    intro: "Each stage represents a distinct answer to who profits, who bears risk, and what the state permits or forbids.",
    events: [
      {
        timeLabel: "1500–1800",
        title: "Merchant capitalism",
        family: "Trade and extraction",
        whyItStarted: "European states chartered joint-stock companies to finance long-distance trade and colonial seizure, sharing risk while concentrating returns.",
        turningPoint: "The British East India Company (1600) and the Dutch VOC combined state power, private capital, and corporate form for the first time.",
        characteristics: [
          "Profit from trade arbitrage across distance",
          "Colonial extraction and the slave trade as infrastructure",
          "Joint-stock company as the key institution",
          "State and capital fused rather than separate",
        ],
        outcome: "Accumulated the capital and global trade networks that funded industrial investment.",
      },
      {
        timeLabel: "1800–1914",
        title: "Industrial capitalism",
        family: "Production and labour",
        whyItStarted: "Steam power and factory organisation made it profitable to concentrate workers in large production units and extract surplus from wage labour.",
        turningPoint: "The factory system and the railway network crystallised industrial capitalism in Britain; the Chartist movement and the First International were early labour responses.",
        characteristics: [
          "Profit from the gap between wages and output",
          "Urbanisation and the proletarianisation of the peasantry",
          "Capital accumulation through reinvestment of industrial profit",
          "First unions, first socialist parties, first factory legislation",
        ],
        outcome: "Produced enormous productivity growth and equally enormous inequality — and the organised labour movement that would reshape the next stage.",
      },
      {
        timeLabel: "1890–1940",
        title: "Finance capitalism",
        family: "Banking and investment",
        whyItStarted: "Industrial firms became too capital-intensive to self-finance; banks and investment houses gained control over which industries expanded and on what terms.",
        turningPoint: "J.P. Morgan's restructuring of US Steel (1901) and the German Großbanken model showed finance capital becoming the commanding height of the system.",
        characteristics: [
          "Banks and investment houses direct industrial investment",
          "Monopoly and cartel formation",
          "Imperialism as competition for markets and raw materials among finance-capital powers",
          "Stock markets become the arbiter of corporate structure",
        ],
        outcome: "The concentration of financial power and the instability it produced led directly to the Depression and the political crisis that produced World War II.",
      },
      {
        timeLabel: "1945–1975",
        title: "Keynesian managed capitalism",
        family: "Welfare state and social contract",
        whyItStarted: "The Depression and the war had delegitimised unregulated capitalism. Labour was politically powerful. Cold War competition made social concessions strategically necessary for Western elites.",
        turningPoint: "The Bretton Woods agreement (1944), the Marshall Plan, and the expansion of welfare states across Europe codified the settlement between capital and organised labour.",
        characteristics: [
          "Active demand management by governments",
          "Collective bargaining covers 30–60% of workers",
          "Welfare state provides universal floors",
          "Financial sector regulated and subordinate to industrial policy",
          "Productivity gains shared through rising real wages",
        ],
        outcome: "The fastest and most broadly shared period of economic growth in capitalist history — and the stage that shareholder capitalism was explicitly designed to reverse.",
      },
      {
        timeLabel: "1976–present",
        title: "Shareholder capitalism",
        family: "Finance and quarterly returns",
        whyItStarted: "The 1970s stagflation crisis delegitimised Keynesian management. Business lobbied for deregulation. Friedman's doctrine provided the ideological frame; Reagan and Thatcher provided the political vehicle.",
        turningPoint: "The Business Roundtable's 1978 pivot to shareholder primacy, Reagan's firing of the air traffic controllers (1981), and financial deregulation across the 1980s set the template.",
        characteristics: [
          "Corporations restructure around maximising shareholder returns",
          "Share buybacks replace investment in production capacity",
          "Offshoring and outsourcing transfer risk to supply chains",
          "Executive compensation tied to share price via options",
          "Finance grows to 40%+ of corporate profits in some economies",
          "Wages decouple from productivity",
        ],
        outcome: "Enormous returns for capital owners and executives; stagnant wages for most workers; fragile supply chains exposed by COVID-19; a political backlash that has not yet produced a new institutional settlement.",
      },
      {
        timeLabel: "2000s–present",
        title: "Platform and surveillance capitalism",
        family: "Data extraction and prediction markets",
        whyItStarted: "The internet made it possible to harvest behavioural data at near-zero marginal cost. Advertising markets were restructured around predicted behaviour rather than mass reach.",
        turningPoint: "Google's discovery that search behaviour data could be used to predict ad-click probability (c. 2000) created the surveillance capitalism business model; Facebook generalised it to social behaviour.",
        characteristics: [
          "Behavioural data as primary raw material",
          "Prediction products (not goods or search results) sold to advertisers and others",
          "Network effects create winner-take-most markets",
          "Attention as the scarce resource to be captured and monetised",
          "Users are inputs; third-party buyers are customers",
          "Platforms influence behaviour, not just predict it",
        ],
        outcome: "Five companies (Apple, Microsoft, Google, Amazon, Meta) reached a combined market capitalisation exceeding $10 trillion by 2024. Regulatory response lags by a decade or more.",
      },
    ],
  },

  relatedFrameworks: [
    "Shareholder primacy",
    "Stakeholder capitalism",
    "Surveillance capitalism",
    "Keynesian economics",
    "Finance capital",
    "Primitive accumulation",
    "Varieties of capitalism",
  ],

  simulationPrompt:
    "Simulate how labour share, financial sector profit, and individual risk exposure change as you shift between the six stages of capitalism.",

  discussionPrompt:
    "Which stage of capitalism are we actually in — and does the answer differ depending on whether you are a platform worker, a pension fund manager, or a smallholder farmer in the Global South?",

  proposals: [
    {
      title: "Mandate employee representation on corporate boards",
      summary: "Codetermination laws require workers to hold seats on supervisory boards of large companies, giving labour a structural voice in investment decisions, executive pay, and long-term strategy — altering the shareholder-primacy model from within.",
      actor: "national_gov",
      domain: "economic",
      feasibility: "proven",
      precedents: [
        { place: "Germany", year: 1976, outcome: "Codetermination Act requires employee parity on supervisory boards of firms with 2,000+ employees. German firms invest more in training, have lower executive-to-worker pay ratios, and maintained employment better through the 2008 crisis than comparable UK or US firms." },
        { place: "Sweden", year: 1987, outcome: "Board representation law covers firms with 25+ employees. Sweden consistently achieves lower inequality than comparable capitalist economies." },
      ],
    },
    {
      title: "Tax share buybacks and redirect proceeds to worker ownership funds",
      summary: "Share buybacks returned $6 trillion to shareholders in S&P 500 companies between 2010 and 2020. A 2% buyback tax with proceeds directed to employee ownership trusts would begin unwinding the shareholder-primacy structure from within.",
      actor: "national_gov",
      domain: "economic",
      feasibility: "emerging",
      precedents: [
        { place: "United States", year: 2022, outcome: "Inflation Reduction Act introduced a 1% excise tax on share buybacks — the first such tax in US history. Revenue modest but demonstrates political viability." },
        { place: "UK Labour Party proposal", year: 2019, outcome: "Proposed an Inclusive Ownership Fund requiring large firms to transfer 10% of equity to employee trusts over a decade. Not enacted but extensively modelled." },
      ],
    },
    {
      title: "Establish a data dividend — pay users for behavioural data extraction",
      summary: "Platform capitalism profits by converting behavioural data into prediction products without compensating the users who generate the raw material. A data dividend would acknowledge data as labour and create a revenue stream flowing to users rather than exclusively to platforms.",
      actor: "national_gov",
      domain: "economic",
      feasibility: "contested",
      precedents: [
        { place: "California (AB 1712 proposal)", year: 2019, outcome: "Proposed a state data dividend; did not pass but generated significant debate and modelling of what users would receive (estimates ranged from $2 to $200/year per person)." },
        { place: "Alaska Permanent Fund", year: 1982, outcome: "The closest existing analogy: oil revenues (a natural resource) distributed as an annual dividend to every resident. A data dividend applies the same logic to digital natural resources." },
      ],
    },
  ],
};
