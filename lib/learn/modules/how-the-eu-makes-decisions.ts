import type { LearningModule } from "./_types";

export const lessonData: LearningModule = {
    betterMetrics: [
      {
        description:
          "How long it takes a proposal to move from Commission initiative to adopted law, especially under the ordinary legislative procedure.",
        label: "Proposal-to-adoption time",
      },
      {
        description:
          "How many proposals are adopted through the ordinary legislative procedure versus special procedures or unanimity-heavy routes.",
        label: "Ordinary procedure share",
      },
      {
        description:
          "How often member-state disagreement or unanimity requirements slow or block adoption.",
        label: "Council conflict / unanimity friction",
      },
      {
        description:
          "How often national parliaments trigger subsidiarity concerns or force a rethink of where decisions should be taken.",
        label: "Subsidiarity warnings from national parliaments",
      },
    ],
    betterMetricsTitle: "Signals that show how the EU actually governs",
    counterArguments: [
      {
        point:
          "The EU is basically an unelected bureaucracy because the Commission can propose laws and ordinary people do not directly elect it.",
        response:
          "The Commission does have the monopoly on legislative initiative in most areas, and that is a real democratic design choice. But most EU laws are then jointly decided by the directly elected Parliament and the Council representing elected national governments.",
        title: "The EU is just an unelected bureaucracy",
      },
      {
        point:
          "The EU has become a superstate that simply overrides member democracies.",
        response:
          "The EU can act only within competences conferred by the treaties. In many areas the Council and national governments remain central, some decisions require unanimity, treaty change needs every member state's agreement, and national parliaments still police subsidiarity.",
        title: "The EU has replaced national democracy",
      },
      {
        point:
          "If the system is this slow and negotiated, that proves it is dysfunctional rather than democratic.",
        response:
          "A multilingual union of 27 member states will always trade speed for legitimacy and coordination. The question is not whether the system is fast, but whether its veto points, representation channels, and implementation burdens are visible and accountable.",
        title: "Slow decision-making means broken decision-making",
      },
    ],
    causalLoop: {
      description:
        "EU lawmaking is a hybrid loop between supranational initiative and member-state bargaining. The Commission proposes, Parliament and Council co-legislate, national governments implement, and the resulting political feedback shapes the next agenda cycle.",
      edges: [
        { from: "euPriorities", label: "shape", polarity: "positive", to: "commissionAgenda" },
        { from: "commissionAgenda", label: "becomes", polarity: "positive", to: "commissionProposal" },
        { from: "commissionProposal", label: "enters", polarity: "positive", to: "parliamentCouncilBargain" },
        { from: "memberStateAlignment", label: "speeds", polarity: "positive", to: "parliamentCouncilBargain" },
        { from: "parliamentCouncilBargain", label: "produces", polarity: "positive", to: "adoptedLaw" },
        { from: "adoptedLaw", label: "requires", polarity: "positive", to: "nationalImplementation" },
        { from: "nationalImplementation", label: "shapes", polarity: "positive", to: "publicLegitimacy" },
        { from: "publicLegitimacy", label: "feeds back into", polarity: "positive", to: "euPriorities" },
        { from: "memberStateAlignment", label: "reduces need for", polarity: "negative", to: "summitEscalation" },
        { from: "summitEscalation", label: "pushes", polarity: "positive", to: "euPriorities" },
      ],
      loops: [
        "Reinforcing: political priorities → Commission agenda → proposal → adoption → implementation → political feedback → next priorities",
        "Balancing: disagreement among member states slows bargaining and pushes issues upward to the European Council for political steering",
      ],
      nodes: [
        { id: "euPriorities", label: "European priorities", tone: "amber", x: 80, y: 80 },
        { id: "commissionAgenda", label: "Commission agenda", tone: "cyan", x: 280, y: 40 },
        { id: "commissionProposal", label: "Legislative proposal", tone: "cyan", x: 500, y: 100 },
        { id: "parliamentCouncilBargain", label: "Parliament-Council bargaining", tone: "emerald", x: 500, y: 280 },
        { id: "adoptedLaw", label: "Adopted EU law", tone: "emerald", x: 280, y: 360 },
        { id: "nationalImplementation", label: "National implementation", tone: "amber", x: 80, y: 320 },
        { id: "publicLegitimacy", label: "Public legitimacy", tone: "rose", x: 80, y: 180 },
        { id: "memberStateAlignment", label: "Member-state alignment", tone: "amber", x: 280, y: 180 },
        { id: "summitEscalation", label: "European Council escalation", tone: "rose", x: 500, y: 420 },
      ],
      title: "The EU lawmaking feedback loop",
    },
    discussionPrompt:
      "If the EU is not a nation-state but also not just a treaty club, what kind of democratic system is it? Which parts should become more directly political, and which parts should stay negotiated between member states?",
    heroHighlights: [
      "The EU is a union of 27 member states, not a single state with one simple chain of command.",
      "Most EU laws are made through the ordinary legislative procedure: the Commission proposes, and Parliament plus Council must agree.",
      "The European Council sets broad political direction, but it does not itself pass EU laws.",
    ],
    miniLesson: {
      bands: [
        {
          insight:
            "Low institutional alignment. The Commission can still propose, but Parliament and Council are far apart, so bargaining is slow and summit-level political steering becomes more important.",
          threshold: 0,
        },
        {
          insight:
            "Partial alignment. Committees, rapporteurs, working parties, and trilogues do most of the hard work of finding a text both Parliament and Council can live with.",
          threshold: 35,
        },
        {
          insight:
            "High alignment. Ordinary legislative procedure moves faster because the main institutions already agree on the broad direction and can compromise on details.",
          threshold: 70,
        },
        {
          insight:
            "Very high alignment or crisis mode. The system can move quickly, but speed may come with concerns about scrutiny, implementation capacity, or how much space remained for dissent.",
          threshold: 90,
        },
      ],
      defaultValue: 45,
      description:
        "This slider simplifies one major variable in EU decision-making: how closely aligned the Commission, Parliament, and member-state governments are on the direction of travel.",
      highLabel: "High institutional alignment",
      lowLabel: "Low institutional alignment",
      metrics: [
        {
          base: 22,
          description: "How quickly proposals can move from initiative to adopted text.",
          key: "eu-adoption-speed",
          label: "Adoption speed",
          max: 100,
          min: 0,
          slope: 0.75,
          suffix: "/100",
          tone: "emerald",
        },
        {
          base: 82,
          description: "How much conflict, amendment churn, and procedural friction appear between co-legislators.",
          key: "eu-bargaining-friction",
          label: "Bargaining friction",
          max: 100,
          min: 0,
          slope: -0.68,
          suffix: "/100",
          tone: "rose",
        },
        {
          base: 78,
          description: "How likely political disputes are to spill into national implementation disputes or summit-level escalation.",
          key: "eu-national-friction",
          label: "National friction",
          max: 100,
          min: 0,
          slope: -0.55,
          suffix: "/100",
          tone: "amber",
        },
      ],
      prompt:
        "Move the slider to see how alignment changes speed, friction, and the likelihood that a proposal gets kicked upward into broader political bargaining.",
      sliderLabel: "Alignment across Commission, Parliament, and Council",
      step: 1,
      title: "Mini lesson: the EU runs on negotiated alignment",
      unit: "%",
      valueMax: 100,
      valueMin: 0,
    },
    realWorldExamples: [
      {
        insight:
          "The EU's strongest laws often come from the ordinary legislative procedure, not from one institution acting alone. Commission initiative plus Parliament-Council bargaining is the normal pattern.",
        outcome:
          "The GDPR began as a Commission proposal and was jointly shaped by Parliament and the Council before becoming an EU regulation that applied directly across member states.",
        title: "GDPR and co-legislation",
      },
      {
        insight:
          "Fast-moving technology policy shows how central trilogue compromise has become. Parliament, member states, and Commission often agree only after intense interinstitutional negotiation.",
        outcome:
          "The AI Act moved through the standard EU legislative architecture, with major changes emerging through negotiations between Parliament and the Council after the Commission's original proposal.",
        title: "The AI Act and trilogue bargaining",
      },
      {
        insight:
          "Not everything works like ordinary legislation. The biggest constitutional shifts still depend on the member states themselves, which is why treaty change is rare and politically demanding.",
        outcome:
          "Treaty revision requires the unanimous agreement of all 27 EU countries, making constitutional change much harder than passing an ordinary regulation or directive.",
        title: "Treaty change and unanimity",
      },
    ],
    relatedFrameworks: [
      "Ordinary legislative procedure",
      "Qualified majority voting",
      "Subsidiarity",
      "Trilogues",
      "Delegated and implementing acts",
    ],
    simulationPrompt:
      "Route a Commission proposal through Parliament committees, Council working groups, trilogues, qualified-majority voting, and national implementation to see where EU decisions slow down or succeed.",
    simpleExplanation: [
      "The European Union is not a normal state and not just an international organization either. It is a hybrid system in which 27 member states share some powers through common institutions while keeping many powers at the national level.",
      "In most EU lawmaking, three institutions matter most. The European Commission proposes legislation. The European Parliament represents EU citizens through direct elections. The Council of the European Union represents the governments of the member states. In the ordinary legislative procedure, Parliament and Council must agree on the text.",
      "That means the EU's lawmaking chain is less like a single parliament and more like a structured negotiation between citizens' representation and governments' representation, with the Commission setting the formal agenda. If Parliament and Council cannot agree, the proposal can move into second readings and conciliation.",
      "There are important extras. The European Council sets broad political direction but does not itself pass laws. National parliaments can raise subsidiarity objections in shared competences. And some areas, such as treaty change, follow special procedures or require unanimity rather than ordinary co-decision.",
    ],
    simulatorSlug: "eu-decision-making",
    slug: "how-the-eu-makes-decisions",
    systemBug: {
      signals: [
        "People regularly confuse the European Council, the Council of the EU, and the European Commission.",
        "Critics and defenders alike often talk about 'Brussels' as if it were one actor with one democratic mandate.",
        "When implementation goes badly, blame is often assigned to the EU level without distinguishing between EU law design and national execution.",
      ],
      summary:
        "The biggest bug is institutional opacity. When people cannot tell who proposes, who amends, who adopts, and who implements, accountability becomes blurry and serious reform debates turn into slogans.",
      title: "System bug: one label, many institutions, blurry accountability",
    },
  proposals: [
    {
      title: "Extend qualified majority voting to tax and foreign policy to end single-state vetoes",
      summary: "EU member state vetoes on tax and foreign policy allow single governments acting for national lobbying interests to block EU-wide reforms. Switching to QMV would enable coherent corporate tax floors and a unified foreign policy voice.",
      actor: "international",
      domain: "political",
      feasibility: "contested",
      precedents: [
        { place: "EU Single European Act", year: 1986, outcome: "Moved internal market legislation to QMV; completed the single market in 7 years — impossible under unanimity" },
        { place: "EU enhanced cooperation", year: 2022, outcome: "Allowed 10+ member states to move ahead without unanimity on financial transaction tax — a partial workaround to veto power" },
      ],
    },
    {
      title: "Give the European Parliament the right to initiate legislation",
      summary: "The EU's directly-elected parliament cannot propose laws — only the unelected Commission can. Granting Parliament legislative initiative rights would make EU democracy meaningfully accountable to European voters.",
      actor: "international",
      domain: "political",
      feasibility: "contested",
      precedents: [
        { place: "European Parliament", year: 2023, outcome: "Parliament voted 305-206 to request legislative initiative rights via treaty change; Convention on Future of Europe recommended this in 2003 but it was not enacted" },
        { place: "Most national parliaments", year: 1900, outcome: "Parliamentary initiative is universal in national democracies; the EU is anomalous in denying it to its directly-elected chamber" },
      ],
    },
  ],

  };
