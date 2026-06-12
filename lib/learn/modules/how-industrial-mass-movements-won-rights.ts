import type { LearningModule } from "./_types";

export const lessonData: LearningModule = {
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
    discussionPrompt:
      "Why did factories, railways, and newspapers help oppositional movements as much as they helped the industrial economy itself? Which mattered more: shared hardship, or the new ability to coordinate at scale?",
    heroHighlights: [
      "Factories and cities concentrated people who shared the same risks and demands.",
      "Railways, telegraphs, and cheap newspapers helped local campaigns become national ones.",
      "Movements became durable when they built organizations that could survive a lost strike or failed petition.",
    ],
    miniLesson: {
    bands: [
      {
        threshold: 0,
        insight:
          "At 5% union density — roughly where the US private sector stands today — collective bargaining covers a small fraction of the workforce. Without density, individual workers have almost no leverage; employers can replace any single worker who negotiates.",
      },
      {
        threshold: 15,
        insight:
          "At 20% density, unions retain enough members to mount significant industrial action in key sectors — but wage gains may not extend to non-union workers. The movement is influential but not hegemonic.",
      },
      {
        threshold: 35,
        insight:
          "At 40% density — above most Western European averages today — collective agreements in many countries extend by law to non-union workers in the same sector through 'erga omnes' provisions, effectively setting industry-wide floors.",
      },
      {
        threshold: 60,
        insight:
          "At 65%+ density — the Nordic model — collective bargaining functions almost as a labour market institution. Wages track productivity, working weeks are shorter, and strike success rates are high because employers cannot credibly threaten replacement.",
      },
    ],
    defaultValue: 35,
    description:
      "Union density determines collective bargaining power. Below a threshold, individual workers cannot credibly threaten industrial action. As density rises, the labour movement gains leverage to extract shorter hours, higher wages, and safer conditions. Adjust the slider to see the relationship.",
    highLabel: "80% (Nordic)",
    lowLabel: "5% (US private sector)",
    metrics: [
      {
        base: 48,
        description: "Average working hours per week across the economy — one of the most durable gains of industrial labour movements",
        key: "working-hours",
        label: "Average working week",
        max: 48,
        min: 33,
        slope: -0.2,
        suffix: " hrs",
        tone: "cyan",
      },
      {
        base: -2,
        description: "Annual real wage growth relative to productivity growth — positive means workers capture their share of economic gains",
        key: "wage-vs-productivity",
        label: "Wages vs productivity",
        max: 3,
        min: -2,
        slope: 0.067,
        suffix: "%/yr",
        tone: "emerald",
      },
      {
        base: 25,
        description: "Share of industrial actions that achieve their stated objective",
        key: "strike-success",
        label: "Strike success rate",
        max: 80,
        min: 25,
        slope: 0.73,
        suffix: "%",
        tone: "amber",
      },
    ],
    prompt: "Adjust union density to see how collective organisation translates into working conditions and wages.",
    sliderLabel: "Union density (% of workforce organised)",
    step: 5,
    title: "How density determines bargaining power",
    unit: "%",
    valueMax: 80,
    valueMin: 5,
  },
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
  proposals: [
    {
      title: "Introduce sectoral collective bargaining covering all workers in an industry",
      summary: "Enterprise-level bargaining leaves individual workers in a weak position against large employers. Sectoral bargaining — where unions negotiate for an entire industry — raises the floor for all workers including non-unionised ones and prevents races to the bottom.",
      actor: "national_gov",
      domain: "economic",
      feasibility: "proven",
      precedents: [
        { place: "Germany", year: 1949, outcome: "Industry-level bargaining; 50% of workers covered by sectoral agreements; German manufacturing wages among highest in world" },
        { place: "Australia", year: 2023, outcome: "Multi-employer bargaining restored for low-paid sectors; first major expansion of collective bargaining rights in 30 years" },
      ],
    },
    {
      title: "Require worker representation on corporate boards for companies above 250 employees",
      summary: "Codetermination — mandatory worker directors — gives labour a voice in decisions about investment, wages, and restructuring. It moderates executive pay, increases investment in training, and reduces the frequency of mass layoffs.",
      actor: "national_gov",
      domain: "economic",
      feasibility: "proven",
      precedents: [
        { place: "Germany", year: 1976, outcome: "Codetermination Act requires near-parity worker representation; lower executive pay ratios, higher wage shares than comparable countries" },
        { place: "Sweden", year: 1987, outcome: "Worker directors on all boards with 25+ employees; contributes to high union density and wage equality" },
      ],
    },
    {
      title: "Legislate a 32-hour working week without loss of pay",
      summary: "The 40-hour week was won by labour movements in the early 20th century. Productivity growth since has not been shared as leisure. A 32-hour week distributes productivity gains as time — reducing overwork, improving health, and spreading employment.",
      actor: "national_gov",
      domain: "economic",
      feasibility: "emerging",
      precedents: [
        { place: "Iceland", year: 2015, outcome: "Largest 4-day week trials globally; productivity maintained or improved in 86% of cases; spread to cover 86% of Icelandic workforce" },
        { place: "Belgium", year: 2022, outcome: "Right to compress 38-hour week into 4 days enacted into law; first country to legislate the option nationally" },
      ],
    },
  ],

  };
