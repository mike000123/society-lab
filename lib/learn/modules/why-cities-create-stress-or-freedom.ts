import type { LearningModule } from "./_types";
import { owidEvidenceLinks } from "./_shared";

export const lessonData: LearningModule = {
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
    discussionPrompt:
      "What makes your city feel like it is designed around cars, rent, and throughput instead of human time and calm?",
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
    realWorldExamples: [
      {
        title: "Copenhagen's cycling dividend: 62% modal share and measurable health gains",
        insight:
          "Copenhagen invested heavily in cycling infrastructure between 1980 and 2020 — expanding its network to 390 km of protected lanes and making cycling the default mode for most trips under 5 km. By 2022, 62% of residents cycled to work or school daily, regardless of income level.",
        outcome:
          "The city estimates Copenhagen cyclists collectively save the health system €0.16 per km cycled (vs a cost of €0.11 per km driven) through reduced cardiovascular disease and obesity. The infrastructure investment changed the city's daily stress profile: commutes became exercise rather than time spent in traffic. The key mechanism was not persuasion but physical design — protected lanes made cycling the most convenient choice.",
      },
      {
        title: "US commuting: the most disliked activity and its costs",
        insight:
          "Gallup's work-and-wellbeing surveys consistently rank commuting as the activity Americans enjoy least — below work itself, housework, and childcare. Economists Alois Stutzer and Bruno Frey (2008) found that each additional 20 minutes of daily commute time is equivalent in life-satisfaction terms to a 19% pay cut.",
        outcome:
          "The average American commutes 27 minutes each way, almost entirely by car. Because most US metropolitan areas were planned around car access after 1950, the commute penalty is structural rather than personal — it reflects zoning decisions, transit investment choices, and land-use patterns that locked in car dependency. Atlanta residents drive an average of 34 miles per day; Amsterdam residents average 4 miles by bike.",
      },
      {
        title: "Paris 15-minute city: reclaiming street space as policy",
        insight:
          "Mayor Anne Hidalgo's 2020 re-election platform centred on the concept of the '15-minute city' — redesigning Paris so that every resident could reach work, shops, schools, and healthcare within 15 minutes on foot or by bike. Between 2014 and 2022, Paris removed 72 km of car lanes, added 130 km of cycling infrastructure, and permanently pedestrianised the Seine riverbanks.",
        outcome:
          "Car traffic in central Paris fell by 40% between 2000 and 2020. Air pollution fell; pedestrian counts rose. The programme faced significant political opposition from commuters dependent on cars from outer suburbs — revealing that '15-minute city' benefits accrue most directly to inner-city residents, and that urban design changes redistribute convenience as well as stress.",
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
  proposals: [
    {
      title: "Legalise missing middle housing in all urban zones as-of-right",
      summary: "Single-family zoning in high-demand cities inflates housing costs and mandates car dependency. Legalising duplexes, triplexes, and small apartment buildings city-wide increases supply near jobs and services without mega-developments.",
      actor: "local_gov",
      domain: "economic",
      feasibility: "proven",
      precedents: [
        { place: "Auckland, New Zealand", year: 2016, outcome: "Upzoning the whole city to allow three-storey buildings anywhere increased consents by 44% and moderated rent growth" },
        { place: "Minneapolis, USA", year: 2018, outcome: "First major US city to eliminate single-family zoning citywide; rents grew more slowly than comparable metros through 2023" },
      ],
    },
    {
      title: "Invest in 15-minute city infrastructure: bike lanes, local services, public transit",
      summary: "Car dependency is a policy choice baked into street design. Reallocating road space to protected cycling, pedestrian priority, and feeder transit cuts commute stress, emissions, and household transport costs simultaneously.",
      actor: "local_gov",
      domain: "social",
      feasibility: "proven",
      precedents: [
        { place: "Paris", year: 2015, outcome: "15-minute city programme added 1,000km of bike lanes; cycling increased 70% and car trips fell 8% by 2023" },
        { place: "Bogota", year: 2000, outcome: "Ciclovia and BRT TransMilenio cut commute times 30 min/day for low-income residents" },
      ],
    },
    {
      title: "Give residents binding power over local planning through participatory budgeting",
      summary: "Allocating a fixed share of municipal capital budgets to direct resident vote — with enforceable implementation — builds public trust and produces infrastructure people actually use.",
      actor: "local_gov",
      domain: "political",
      feasibility: "proven",
      precedents: [
        { place: "Porto Alegre, Brazil", year: 1989, outcome: "Participatory budgeting expanded to 200+ cities globally; sewage access rose from 49% to 98% in a decade" },
        { place: "New York City", year: 2012, outcome: "PB NYC allocated $300m+ by 2023 through direct district votes; strongest impact in historically underserved areas" },
      ],
    },
  ],

  };
