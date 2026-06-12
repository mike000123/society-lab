import type { LearningModule } from "./_types";
import { owidEvidenceLinks } from "./_shared";

export const lessonData: LearningModule = {
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
    discussionPrompt: "If capital consistently outgrows wages by design, is the solution higher capital taxes, stronger unions, different ownership models, or something structural not yet tried at scale?",
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
    realWorldExamples: [
      {
        title: "Piketty's 200-year French dataset: r > g is not a theory, it's a finding",
        insight:
          "Thomas Piketty's analysis of French national accounts from 1820 to 2010 found that the return on capital — rents, dividends, interest, and profits — averaged approximately 5% per year in real terms across the entire period. GDP growth averaged around 1.6% per year over the same period.",
        outcome:
          "When r consistently exceeds g, wealth owners' share of total income rises over time regardless of individual merit or effort. The 20th-century compression — when the wealth share of the top 1% fell substantially — was caused by specific shocks: two world wars, the Depression, and the progressive taxation that followed them. The underlying dynamic reasserted itself as those shocks receded. This is not a prediction but an empirical pattern in 200 years of data.",
      },
      {
        title: "US capital share vs labour share: the 20-year divergence",
        insight:
          "Corporate after-tax profits as a share of US GDP rose from 6.9% in 2001 to 11.4% in 2021, according to Bureau of Economic Analysis data. Over the same period, labour's share of national income fell from 63% to 58%. Productivity grew; median wages did not keep pace.",
        outcome:
          "The divergence accelerated during and after the 2008 financial crisis and again during the 2020 pandemic: asset values recovered quickly while wages stagnated. This is the empirical signature of r > g operating at macroeconomic scale: when the economy grows, a rising share of that growth accrues to those who own capital rather than those who provide labour.",
      },
      {
        title: "US billionaire wealth during the 2020 pandemic",
        insight:
          "Between March 18 and December 7 2020 — a period when 22 million Americans lost their jobs in the initial COVID lockdowns — the combined wealth of 664 US billionaires increased by $1.61 trillion, from $2.95T to $4.56T, according to Forbes and Americans for Tax Fairness.",
        outcome:
          "The mechanism was not pandemic profiteering in most cases but asset price inflation: the Federal Reserve's emergency interventions flooded financial markets with liquidity, which inflated the value of equities and property. Those assets are concentrated among the already-wealthy. The pandemic produced the starkest single illustration of the r > g dynamic in recent decades: capital gains accrued to owners while labour income collapsed.",
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
    systemBug: {
      signals: [
        "Capital income grows faster than wages across multi-decade periods in most high-income economies.",
        "Effective tax rates on capital income are lower than on labor income.",
        "Inherited wealth accounts for an increasing share of large fortunes.",
      ],
      summary: "The rules of the system tax capital gains less than wages and allow reinvestment to compound without significant friction, so the gap between capital holders and wage earners widens as a mathematical consequence of the design.",
      title: "System bug: capital compounds by design while wages are structurally constrained",
    },
  proposals: [
    {
      title: "Introduce a progressive annual wealth tax on net assets above 1m",
      summary: "Income taxes leave capital accumulation largely untouched. An annual tax of 1-2% on net wealth above one million slows compounding at the top and funds public investment without taxing labour.",
      actor: "national_gov",
      domain: "economic",
      feasibility: "contested",
      precedents: [
        { place: "Norway", year: 1990, outcome: "Ongoing 0.85% net wealth tax funds universal services; among lowest inequality in OECD" },
        { place: "Spain", year: 2022, outcome: "Solidarity wealth tax on assets above 3m raised 623m euros in first year" },
      ],
    },
    {
      title: "Reform inheritance and gift taxes to break intergenerational wealth concentration",
      summary: "Most inherited wealth is untaxed capital gains. Closing the step-up-in-basis loophole and strengthening inheritance taxes above meaningful thresholds limits dynasty formation while exempting family farms and small businesses.",
      actor: "national_gov",
      domain: "economic",
      feasibility: "contested",
      precedents: [
        { place: "Japan", year: 2015, outcome: "Lowered inheritance tax threshold; one of higher estate tax revenues as share of GDP among developed nations" },
        { place: "South Korea", year: 2019, outcome: "Strengthened enforcement; top rate 50%; estimated to reduce chaebol concentration over two generations" },
      ],
    },
    {
      title: "Expand universal basic capital: a cash endowment at age 18",
      summary: "Give every citizen a cash endowment at adulthood, funded by a dedicated wealth levy. It gives every person an initial stake for education, a business, or a deposit — compressing the starting-line gap.",
      actor: "national_gov",
      domain: "economic",
      feasibility: "emerging",
      precedents: [
        { place: "UK (Child Trust Fund)", year: 2002, outcome: "Government vouchers invested for every child born 2002-2011; first cohort received funds at 18 in 2020" },
        { place: "Singapore (CPF)", year: 1955, outcome: "Mandatory savings plus top-ups gave citizens a capital base; Singapore has among the highest household net worth in Asia" },
      ],
    },
  ],

  };
