import type { LearningModule } from "./_types";

export const lessonData: LearningModule = {
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
    discussionPrompt: "Is the offshore system a natural result of sovereign competition or an engineered architecture of extraction? Who is responsible for closing it?",
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
    realWorldExamples: [
      {
        title: "Apple Ireland: 0.005% effective tax rate",
        insight:
          "In August 2016, the European Commission ruled that Ireland had granted Apple illegal state aid through two tax rulings — allowing Apple to attribute almost all profits from European sales to a stateless 'head office' with no employees and no physical presence. The effective tax rate on Apple's European profits in 2014: 0.005%. The standard Irish corporate rate: 12.5%.",
        outcome:
          "The Commission ordered Apple to repay €13 billion in back taxes plus interest to Ireland. Ireland appealed — because the deal had been central to its industrial policy of attracting US multinationals. The ECJ overturned the ruling on procedural grounds in 2024. The case established the basic architecture: IP rights are attributed to low-tax entities, profits follow the IP, and the mismatch between where value is created and where it is taxed can be almost total.",
      },
      {
        title: "The scale of offshore wealth: Zucman's estimate",
        insight:
          "Economist Gabriel Zucman, using Swiss National Bank data and national accounts discrepancies, estimated in 2015 that approximately $8.7 trillion in financial wealth was held offshore — roughly 11% of global GDP. This wealth earns returns but pays minimal tax because it sits in jurisdictions that do not share information with the owner's country of residence.",
        outcome:
          "Zucman estimated the annual global tax revenue loss at approximately $200 billion, with the burden falling disproportionately on countries with high marginal tax rates. Because offshore wealth is concentrated at the top of the distribution — the bottom 90% have negligible offshore assets — the effect is to systematically reduce the progressivity of tax systems even where statutory rates appear high.",
      },
      {
        title: "Amazon UK 2012: £3.8M tax on £3.35B in sales",
        insight:
          "In 2012, Amazon processed an estimated £3.35 billion in UK consumer sales. UK customers purchased from Amazon EU S.à.r.l., a Luxembourg entity. Amazon's UK subsidiary was classified as a 'service provider', earning a small fee rather than sales revenue.",
        outcome:
          "Amazon paid £3.8 million in UK corporation tax for the year — an effective rate on UK turnover of approximately 0.1%. The Guardian's investigation prompted public outrage and a UK parliamentary hearing; Amazon UK's head testified that the structure was legal and tax was paid where value was created. The case illustrated how transfer pricing allows multinational firms to choose where profit is recognised — and therefore where it is taxed.",
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
    systemBug: {
      signals: [
        "Large profitable multinationals report near-zero effective tax rates in countries where they employ thousands.",
        "Public revenues stagnate while corporate profits reach historic highs.",
        "States compete to offer lower rates and more secrecy rather than better public goods.",
      ],
      summary: "The international tax system was built before capital became fully mobile and has not been redesigned to prevent legal profit extraction from the jurisdictions that generate it.",
      title: "System bug: profits earned everywhere, taxed nowhere",
    },
  proposals: [
    {
      title: "Enforce a 15% global minimum corporate tax through mutual enforcement treaties",
      summary: "The OECD's Pillar Two deal agreed a 15% floor but enforcement gaps let conduit jurisdictions remain useful. Closing those gaps by requiring full country-by-country reporting and denying deductions for sub-minimum-tax payments makes the floor real.",
      actor: "international",
      domain: "economic",
      feasibility: "emerging",
      precedents: [
        { place: "EU", year: 2023, outcome: "Minimum Tax Directive transposed into law across all 27 member states; large multinationals pay top-up taxes from 2024" },
        { place: "USA (CAMT)", year: 2022, outcome: "Inflation Reduction Act 15% corporate AMT — first unilateral US move toward global floor" },
      ],
    },
    {
      title: "Require full public country-by-country reporting for multinationals above 750m revenue",
      summary: "Tax authorities cannot close gaps they cannot see. Public reporting forces companies to disclose profits, taxes paid, employees, and assets in every jurisdiction — enabling civil society to spot mismatches between where profit is booked and where business is done.",
      actor: "international",
      domain: "legal",
      feasibility: "proven",
      precedents: [
        { place: "EU", year: 2021, outcome: "Public CbCR Directive passed; large multinationals must publish tax data per jurisdiction from 2025" },
        { place: "Australia", year: 2015, outcome: "Voluntary public reporting database; researchers found effective rates far below statutory; increased pressure for reform" },
      ],
    },
    {
      title: "Create a UN intergovernmental tax body to replace the OECD-dominated process",
      summary: "The OECD represents wealthy countries; the rules it writes protect their multinationals. Moving global tax governance to the UN — where all 193 nations have a voice — shifts negotiating power toward the countries that lose most to profit-shifting.",
      actor: "international",
      domain: "political",
      feasibility: "contested",
      precedents: [
        { place: "UN Tax Committee", year: 2023, outcome: "UN General Assembly voted 125-48 to begin negotiations for a UN tax convention, over OECD-country objection" },
        { place: "Africa Group", year: 2023, outcome: "African countries lose an estimated 89bn per year to illicit financial flows; leading the UN push for reform" },
      ],
    },
  ],

  };
