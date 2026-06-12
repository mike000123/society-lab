import type { LearningModule } from "./_types";

export const lessonData: LearningModule = {
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
    discussionPrompt: "Should the power to create money be a public utility, a regulated private function, or something else? Who should decide where new money flows?",
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
    realWorldExamples: [
      {
        title: "Bank of England 2014: the moment the institution said it plainly",
        insight:
          "In March 2014, Bank of England economists Michael McLeay, Amar Radia, and Ryland Thomas published 'Money creation in the modern economy' in the Bank's Quarterly Bulletin. It stated explicitly: 'the majority of money in the modern economy is created by commercial banks making loans... Whenever a bank makes a loan, it simultaneously creates a matching deposit in the borrower's bank account.'",
        outcome:
          "The paper directly contradicted the 'financial intermediation' model still taught in most undergraduate economics courses — that banks collect deposits and lend them out. The Bank's own description confirmed that loans create deposits, not the reverse. The paper was widely cited by reformers and heterodox economists; most mainstream curricula have been slow to incorporate it.",
      },
      {
        title: "UK mortgage lending 2000–2007: credit creation inflated the housing market",
        insight:
          "Between 2000 and 2007, total UK mortgage lending outstanding grew from approximately £400 billion to £1.2 trillion — a 200% increase in seven years. This lending was created by commercial banks extending new credit, not recycled from existing deposits.",
        outcome:
          "The new money flowed predominantly into the existing housing stock, bidding up prices. Average UK house prices doubled over the same period (from roughly £81,000 to £185,000, ONS data). The inflation was not driven by government money printing or fiscal deficits but by private bank credit creation — the standard mechanism by which money enters and inflates asset markets.",
      },
      {
        title: "Quantitative easing: central banks confirming the mechanism",
        insight:
          "When the Bank of England launched quantitative easing in 2009, it created £200 billion of new central bank reserves by purchasing government bonds — typing the number into a computer, as the Bank's own communications described it. The Fed created $4.5 trillion in new reserves between 2008 and 2021 by the same mechanism.",
        outcome:
          "QE confirmed in practice what the 2014 paper described in theory: money is created as a digital accounting entry, not by printing physical notes or extracting it from reserves. The distributional effect was significant: new central bank reserves flowed to financial institutions, inflating asset prices that are disproportionately held by wealthier households, while wage growth remained slow.",
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
    systemBug: {
      signals: [
        "Asset prices rise much faster than wages over multi-decade periods.",
        "Credit is abundant for asset-backed speculation but scarce for unproductive or uncollateralized borrowers.",
        "Financial crises are followed by public rescues that restore asset prices faster than living standards.",
      ],
      summary: "The power to create money is held by private institutions optimizing for profit, so new money systematically flows toward existing wealth rather than broad economic capacity.",
      title: "System bug: private money creation amplifies inequality by design",
    },
  proposals: [
    {
      title: "Introduce full-reserve requirements for demand deposits",
      summary: "Commercial banks currently create money as a by-product of lending with no direct democratic oversight. Full-reserve requirements for demand deposits remove systemic instability while keeping private credit markets for savings-backed lending.",
      actor: "national_gov",
      domain: "economic",
      feasibility: "contested",
      precedents: [
        { place: "Chicago Plan (USA)", year: 1933, outcome: "Proposed by Irving Fisher after 1929 crash; IMF modelled it in 2012 finding it significantly reduces debt cycles" },
        { place: "Iceland", year: 2015, outcome: "Parliamentary report formally proposed sovereign money reform post-crisis; triggered global debate" },
      ],
    },
    {
      title: "Create a central bank digital currency for universal access to safe public money",
      summary: "CBDCs allow every citizen to hold an account at the central bank, bypassing commercial intermediaries. This extends financial inclusion and gives the public an alternative to private-bank deposits.",
      actor: "national_gov",
      domain: "economic",
      feasibility: "emerging",
      precedents: [
        { place: "Bahamas (Sand Dollar)", year: 2020, outcome: "First nationally-deployed CBDC; expanded financial access to unbanked islands" },
        { place: "China (e-CNY)", year: 2021, outcome: "260m wallets opened by 2023; provides state alternative to Alipay/WeChat duopoly" },
      ],
    },
    {
      title: "Use public credit guidance to direct new money toward green investment and productive industry",
      summary: "Rather than leaving all lending to profit-maximising banks, central banks should set guidance directing a share of new money toward green investment, social housing, and productive industry rather than mortgage speculation.",
      actor: "national_gov",
      domain: "economic",
      feasibility: "proven",
      precedents: [
        { place: "South Korea", year: 1960, outcome: "Bank of Korea directed credit toward industrial sectors; enabled export-led growth without inflation" },
        { place: "UK Green Finance", year: 2021, outcome: "Bank of England corporate bond portfolio tilted toward green bonds — a partial version of credit guidance" },
      ],
    },
  ],

  };
