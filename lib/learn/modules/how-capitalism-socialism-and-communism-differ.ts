import type { LearningModule } from "./_types";

export const lessonData: LearningModule = {
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
    discussionPrompt:
      "When people argue about capitalism, socialism, or communism, which concrete institutional question are they usually skipping: ownership, planning, class power, or democratic accountability?",
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
  proposals: [
    {
      title: "Expand worker cooperative ownership through dedicated public finance and conversion support",
      summary: "Worker cooperatives demonstrate that companies can be democratically owned without state control or loss of competitiveness. Dedicated cooperative development banks, favourable tax treatment, and succession support can shift a material share of the economy into democratic ownership.",
      actor: "national_gov",
      domain: "economic",
      feasibility: "proven",
      precedents: [
        { place: "Mondragon, Basque Country", year: 1956, outcome: "80,000 workers, 100+ cooperatives, own bank and university; higher wages and lower inequality than comparable private sector" },
        { place: "Emilia-Romagna, Italy", year: 1970, outcome: "40% of regional GDP from cooperatives; region among richest in Europe with lower inequality than Italian average" },
      ],
    },
    {
      title: "Establish a sovereign wealth fund that builds collective public wealth from natural resource revenues",
      summary: "Natural resources are the common inheritance of citizens. Channelling resource royalties into a sovereign wealth fund with universal dividend distribution converts one-off extraction into permanent shared capital.",
      actor: "national_gov",
      domain: "economic",
      feasibility: "proven",
      precedents: [
        { place: "Norway (GPFG)", year: 1990, outcome: "Petroleum fund now worth 1.6 trillion dollars; annual dividend to every citizen; Norway consistently among world least unequal nations" },
        { place: "Alaska (PFD)", year: 1982, outcome: "Permanent Fund Dividend of 1,000-2,000 dollars per year per resident from oil revenues; Alaska has lowest inequality of any US state" },
      ],
    },
  ],

  };
