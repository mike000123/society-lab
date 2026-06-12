import type { LearningModule } from "./_types";

export const lessonData: LearningModule = {
    betterMetrics: [
      {
        description:
          "How cheaply a movement can copy and circulate its arguments across towns, congregations, and trading routes.",
        label: "Message replication cost",
      },
      {
        description:
          "How many local reading circles, congregations, or petition networks can repeat the same frame in their own language.",
        label: "Local organizer density",
      },
      {
        description:
          "Whether printers, merchants, nobles, or officials defect from the old order and give the movement protection or resources.",
        label: "Elite shelter and defections",
      },
      {
        description:
          "Whether copied ideas turn into changed laws, church settlements, or durable civic practices rather than staying as scattered dissent.",
        label: "Institutional conversion rate",
      },
    ],
    betterMetricsTitle: "Signals that a print-era movement is becoming mass politics",
    counterArguments: [
      {
        point:
          "The printing press caused these movements by itself, so the main story is technology rather than social conflict.",
        response:
          "Cheaper copying mattered, but only because it met real grievances: church corruption, exclusion from voice, slavery, taxation, or blocked reform. Technology lowers coordination costs; it does not invent the grievance.",
        title: "Technology alone explains the movement",
      },
      {
        point:
          "Early movements like the Reformation were only theological disputes, not political struggles.",
        response:
          "Once ideas could be reproduced widely in vernacular languages, doctrinal disputes became arguments about authority, taxation, education, censorship, and who could speak for the community. That is already politics.",
        title: "They were religious, not political",
      },
      {
        point:
          "Pre-modern rulers were too strong for anything resembling mass politics to exist.",
        response:
          "Repression was strong, but rulers also depended on printers, merchants, local officials, and tax-paying subjects. When ideas spread faster than authorities could contain them, even early states had to negotiate, co-opt, or split.",
        title: "States were too strong for movements to matter",
      },
    ],
    causalLoop: {
      description:
        "When copying ideas becomes cheaper, grievances can travel farther than rumor. Shared texts create local circles, petitions, and moral pressure; if some elites defect from the old order, movements gain protection and turn argument into institutional change.",
      edges: [
        { from: "cheapPrint", label: "widens", polarity: "positive", to: "ideaCirculation" },
        { from: "ideaCirculation", label: "builds", polarity: "positive", to: "sharedFrame" },
        { from: "sharedFrame", label: "organizes", polarity: "positive", to: "localCircles" },
        { from: "localCircles", label: "raises", polarity: "positive", to: "publicPressure" },
        { from: "publicPressure", label: "pushes", polarity: "positive", to: "institutionalChange" },
        { from: "institutionalChange", label: "legitimizes", polarity: "positive", to: "movementDurability" },
        { from: "publicPressure", label: "provokes", polarity: "positive", to: "repression" },
        { from: "repression", label: "disrupts", polarity: "negative", to: "localCircles" },
        { from: "eliteProtection", label: "reduces", polarity: "negative", to: "repression" },
        { from: "eliteProtection", label: "extends", polarity: "positive", to: "movementDurability" },
      ],
      loops: [
        "Reinforcing: cheap copying -> shared frame -> local circles -> public pressure -> institutional wins -> movement durability",
        "Balancing: repression can break local circles unless parts of the elite shelter the movement long enough for it to scale",
      ],
      nodes: [
        { id: "cheapPrint", label: "Cheap print access", tone: "amber", x: 80, y: 80 },
        { id: "ideaCirculation", label: "Idea circulation", tone: "cyan", x: 280, y: 40 },
        { id: "sharedFrame", label: "Shared moral frame", tone: "emerald", x: 500, y: 100 },
        { id: "localCircles", label: "Local circles and sermons", tone: "emerald", x: 500, y: 280 },
        { id: "publicPressure", label: "Petitions and public pressure", tone: "rose", x: 280, y: 340 },
        { id: "institutionalChange", label: "Institutional change", tone: "amber", x: 80, y: 300 },
        { id: "movementDurability", label: "Movement durability", tone: "emerald", x: 80, y: 180 },
        { id: "repression", label: "Censorship and repression", tone: "rose", x: 280, y: 500 },
        { id: "eliteProtection", label: "Elite protection", tone: "cyan", x: 500, y: 440 },
      ],
      title: "The print-era mobilization loop",
    },
    discussionPrompt:
      "When does a new communication technology simply spread noise, and when does it become the backbone of a real movement? What else has to be present besides the tool itself?",
    heroHighlights: [
      "Cheap print turned sermons, pamphlets, and petitions into scalable political tools.",
      "Movements spread faster when people could read arguments in their own language rather than through elite gatekeepers.",
      "Success usually required both grassroots repetition and elite splits that made repression harder.",
    ],
    miniLesson: {
    bands: [
      {
        threshold: 0,
        insight:
          "When fewer than 10% of adults can read, ideas spread through oral tradition, public preaching, and elite manuscript networks. The Church and state can plausibly control what the literate class thinks — and the literate class is too small to constitute a mass movement.",
      },
      {
        threshold: 15,
        insight:
          "At 20% literacy — roughly Europe in the 1520s — the printing press became transformative. Luther's 95 Theses circulated to thousands within weeks. A critical mass of readers existed for the first time to sustain a pamphlet market.",
      },
      {
        threshold: 35,
        insight:
          "At 40% literacy — mid-17th century England, Revolutionary America — pamphlet politics became a genuine mass force. Thomas Paine's Common Sense reached one in five American colonists. The reading public became a political actor.",
      },
      {
        threshold: 60,
        insight:
          "At 65%+, print media functions as information infrastructure. Ideas spread across borders faster than authorities can suppress them. Abolition, suffrage, and labour movements all used print to coordinate action across geography and class.",
      },
    ],
    defaultValue: 30,
    description:
      "Print amplified ideas — but only where there were enough readers to carry them. Literacy rate determined whether the printing press was a tool for elites or a mass medium. Adjust the slider to see how the communication landscape changed with print reach.",
    highLabel: "80% (19th century industrial)",
    lowLabel: "5% (medieval)",
    metrics: [
      {
        base: 100,
        description: "Years for a new political idea to reach a majority of the politically active population",
        key: "idea-spread-years",
        label: "Years for idea to reach mass audience",
        max: 100,
        min: 4,
        slope: -1.28,
        suffix: " yrs",
        tone: "amber",
      },
      {
        base: 85,
        description: "Probability that authorities can suppress a new idea before it reaches political salience",
        key: "suppression-probability",
        label: "Ruling-class ability to suppress",
        max: 85,
        min: 15,
        slope: -0.93,
        suffix: "%",
        tone: "rose",
      },
      {
        base: 8,
        description: "Probability that an idea spreads across national borders within five years of publication",
        key: "cross-border-spread",
        label: "Cross-border spread within 5 yrs",
        max: 78,
        min: 8,
        slope: 0.93,
        suffix: "%",
        tone: "emerald",
      },
    ],
    prompt: "Adjust the literacy and print reach to see how communication infrastructure shaped the speed and scale of political ideas.",
    sliderLabel: "Literacy / print reach (% of adult population)",
    step: 5,
    title: "Print reach and the speed of ideas",
    unit: "%",
    valueMax: 80,
    valueMin: 5,
  },
    realWorldExamples: [
      {
        insight:
          "The Protestant Reformation spread because criticism of church authority could now be reproduced rapidly, translated, debated, and carried across cities rather than staying local to one scholar or monastery.",
        outcome:
          "What began as disputes over indulgences and authority became a continental rupture in church power, education, state formation, and political legitimacy.",
        title: "The Reformation as a print-amplified movement",
      },
      {
        insight:
          "Abolitionists combined moral testimony, pamphlets, boycotts, and petitioning to transform slavery from a commercial issue into a public moral crisis.",
        outcome:
          "The British campaign against the slave trade became one of the first modern mass petition movements, contributing to the 1807 abolition of the British slave trade and later abolition struggles.",
        title: "Abolitionist print and petition networks",
      },
      {
        insight:
          "Seventeenth-century petitioners and radical pamphleteers learned that the same text could coordinate thousands of people who would never meet in one room.",
        outcome:
          "English petition campaigns and Leveller-style pamphlet politics widened expectations about who could speak to Parliament and on what terms.",
        title: "Pamphlet politics and petition culture",
      },
    ],
    relatedFrameworks: [
      "Public sphere",
      "Petition politics",
      "Vernacularization",
      "Moral shock",
      "Print capitalism",
    ],
    simulationPrompt:
      "Compare a movement with cheap print, vernacular messaging, and elite defections against one facing high copying costs, censorship, and no institutional allies.",
    simulatorSlug: "social-movements",
    simpleExplanation: [
      "Many early social movements became possible when the cost of copying ideas fell sharply. Before that, dissent could exist, but it traveled slowly and depended heavily on priests, nobles, or scholars. Print allowed ideas to move between towns, ports, congregations, and workshops much more quickly.",
      "That matters because movements are not just bursts of anger. They require a shared story about what is wrong, why it is wrong, and what ought to replace it. Pamphlets, translated Bibles, broadsides, petitions, and printed testimony helped ordinary people recognize that their grievance was not purely local.",
      "These movements succeeded when they combined three things: a grievance that many people could recognize, a communication technology that made repetition cheap, and enough organizational shelter to resist repression. Churches, merchants, sympathetic rulers, printers, and reform-minded officials often played that sheltering role.",
      "Their turning points were not only policy wins. They changed who counted as a political actor. Print-era movements widened the public sphere itself, making it harder for established institutions to monopolize knowledge, legitimacy, and the right to speak for society.",
    ],
    slug: "how-print-era-movements-turned-ideas-into-power",
    systemBug: {
      signals: [
        "Authorities treat communication tools as neutral even after they radically lower the cost of coordination.",
        "Movements are remembered as pure ideas while the printers, petitioners, and organizers who scaled them disappear from the story.",
        "People assume early publics were passive, even when petitioning and pamphleteering were already reshaping institutions.",
      ],
      summary:
        "The hidden bug is monopoly over speech. When only a few institutions can copy, certify, and distribute ideas, political power stays narrow; when that monopoly weakens, public life expands and conflict becomes harder to contain privately.",
      title: "System bug: control over communication is control over politics",
    },
  proposals: [
    {
      title: "Invest in public libraries as digital civic infrastructure",
      summary: "Libraries were the original free-information infrastructure. Funding them as active civic hubs with universal digital access, maker spaces, and civic education programmes revives their role as the material base for an informed citizenry.",
      actor: "local_gov",
      domain: "media",
      feasibility: "proven",
      precedents: [
        { place: "Netherlands", year: 2015, outcome: "Libraries Act mandated digital literacy training; 14m visits per year to workshops on media literacy and civic participation" },
        { place: "Chicago, USA", year: 2013, outcome: "YOUmedia digital lab programmes; model for youth digital civic engagement adopted by 60+ US cities" },
      ],
    },
    {
      title: "Protect independent local newspapers through not-for-profit conversion mechanisms",
      summary: "Local papers are closing because the advertising model collapsed. Converting them to not-for-profit or reader-owned cooperatives — with transition funding and tax incentives — preserves the accountability journalism that holds local power to account.",
      actor: "national_gov",
      domain: "media",
      feasibility: "emerging",
      precedents: [
        { place: "USA", year: 2021, outcome: "15+ papers converted to nonprofit status 2020-2023 including Philadelphia Inquirer; Local Journalism Sustainability Act proposed tax credits" },
        { place: "Denmark", year: 2019, outcome: "Media Agreement provided 1.5bn DKK over 4 years to local and regional media; maintained coverage in news deserts" },
      ],
    },
  ],

  };
