import type { LearningModule } from "./_types";

export const lessonData: LearningModule = {
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
    discussionPrompt:
      "At what point does treating housing as an investment start breaking its role as a basic social good?",
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
    realWorldExamples: [
      {
        title: "UK price-to-income: from 4× to 9× in a generation",
        insight:
          "In 1997, the median UK house price was approximately 4.4 times the median full-time salary. By 2022 it was 9.1 times — and in London over 12 times — according to ONS data. The bulk of the increase occurred not during construction booms but during periods of credit expansion, low interest rates, and rising buy-to-let investment.",
        outcome:
          "A generation of UK renters now spends a larger share of income on housing than any previous generation since records began. The shift is structural: the same property holds vastly more exchange value (investment return) relative to its use value (shelter), because credit and capital flows have repriced it as a financial asset rather than a consumption good.",
      },
      {
        title: "Blackstone and the institutionalisation of single-family rentals",
        insight:
          "After the 2008 crash, Blackstone's Invitation Homes became the largest single-family landlord in US history, acquiring over 80,000 homes between 2012 and 2017. The strategy was explicitly financial: buy distressed properties in bulk at post-crisis prices, rent them at market rates, then securitise the rental income streams.",
        outcome:
          "Academic research found rents rose 7–15% faster in ZIP codes with high institutional ownership compared to comparable areas without it. Neighbourhoods where families had been foreclosed were repopulated with the same families as tenants, now paying rent to institutional investors. The homes had not changed; their role in the financial system had.",
      },
      {
        title: "Germany's different path: rental culture and stable prices",
        insight:
          "Germany has a homeownership rate of around 49% — the lowest in the EU — compared to 65% in the UK and 66% in the US. Strong tenant protection laws, long-term leases, strict rent control mechanisms, and a large social housing stock created an environment where housing was primarily treated as shelter rather than investment.",
        outcome:
          "German house prices were broadly flat in real terms between 2000 and 2015, a period when UK, Australian, and Canadian prices roughly doubled. The German example shows the trajectory is not inevitable: institutional design choices determine whether housing functions predominantly as a commodity or as a social good.",
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
  proposals: [
    {
      title: "Tax land value rather than buildings to discourage speculative holding",
      summary: "Land value tax falls entirely on the unimproved value of land — the monopoly gain from location that owners did not create. It cannot be passed to tenants, discourages land-banking, and incentivises development.",
      actor: "national_gov",
      domain: "economic",
      feasibility: "proven",
      precedents: [
        { place: "Estonia", year: 1993, outcome: "LVT introduced post-independence; one of Europe's lowest rates of housing speculation and fastest development cycles" },
        { place: "Pittsburgh, USA", year: 1913, outcome: "Two-rate tax (higher on land, lower on buildings) stimulated construction and reduced vacant lots for 60 years" },
      ],
    },
    {
      title: "Expand community land trusts to permanently remove housing from speculative markets",
      summary: "CLTs own the land in perpetuity and lease it to homeowners at below-market rates, with resale price caps. Once land is in a trust it can never be re-financialised — it accumulates as permanent affordable stock.",
      actor: "community",
      domain: "economic",
      feasibility: "proven",
      precedents: [
        { place: "Burlington, Vermont", year: 1984, outcome: "Champlain Housing Trust is now the largest CLT in the US; homes remain affordable across resale cycles" },
        { place: "London, UK", year: 2016, outcome: "London CLT established; city-funded expansion targets 1,000+ permanently affordable homes by 2030" },
      ],
    },
    {
      title: "Regulate short-term rental platforms to recover housing stock for long-term residents",
      summary: "Every dwelling converted to a short-term rental removes a unit from the long-term market. Requiring platforms to share owner data, capping licences per building, and enforcing primary-residence rules recovers stock without new construction.",
      actor: "local_gov",
      domain: "economic",
      feasibility: "proven",
      precedents: [
        { place: "Amsterdam", year: 2020, outcome: "30-night annual cap and licence requirement reduced Airbnb listings by 75% in two years" },
        { place: "Barcelona", year: 2017, outcome: "Moratorium on new STR licences stabilised rental prices in affected neighbourhoods" },
      ],
    },
  ],

  };
