import type { LearningModule } from "./_types";

export const lessonData: LearningModule = {
    betterMetrics: [
      {
        description:
          "How many proposed laws die in committee, the Senate calendar, or cross-chamber bargaining before reaching the president.",
        label: "Legislative bottleneck rate",
      },
      {
        description:
          "How often Senate action depends on cloture, filibuster management, or other supermajority-style hurdles not found in the Constitution itself.",
        label: "Senate cloture dependence",
      },
      {
        description:
          "How often divided institutions shift policymaking from Congress toward executive action and litigation.",
        label: "Executive-order / litigation substitution",
      },
      {
        description:
          "Whether basic budget and appropriations deadlines are met without crisis politics, continuing resolutions, or shutdown threats.",
        label: "Budget-governance stability",
      },
    ],
    betterMetricsTitle: "Signals that show how the U.S. system really works",
    counterArguments: [
      {
        point:
          "The U.S. system is supposed to be slow. If majorities cannot easily pass laws, that is proof that checks and balances are working.",
        response:
          "Checks matter. But when the number of veto points becomes so high that broad, durable public support still cannot become law, the system can slide from restraint into paralysis or minority obstruction.",
        title: "Gridlock is always a democratic virtue",
      },
      {
        point:
          "The President effectively runs the government, so Congress matters mainly for symbolism and partisan theater.",
        response:
          "The president leads the executive branch, but Congress writes laws, controls appropriations, confirms many appointments through the Senate, and can block or reshape the president's agenda. The president is powerful, but not a parliamentary prime minister.",
        title: "The President basically governs alone",
      },
      {
        point:
          "The Supreme Court is just another political branch, so treating judicial review as distinct from ordinary politics is naive.",
        response:
          "The Court is unavoidably political in consequence, but its structure is distinct: life tenure, case-driven review, and constitutional interpretation let it shape policy without direct electoral turnover. That makes it a different kind of veto point.",
        title: "Courts are just ordinary politics by other means",
      },
    ],
    causalLoop: {
      description:
        "The U.S. system routes policy through multiple veto points. Elections shape House, Senate, and presidency separately; legislation then depends on bicameral agreement, presidential approval, agency implementation, and often court review.",
      edges: [
        { from: "publicDemand", label: "shapes", polarity: "positive", to: "elections" },
        { from: "elections", label: "set", polarity: "positive", to: "houseMajority" },
        { from: "elections", label: "set", polarity: "positive", to: "senateMajority" },
        { from: "elections", label: "select", polarity: "positive", to: "president" },
        { from: "houseMajority", label: "enters", polarity: "positive", to: "legislativeBargain" },
        { from: "senateMajority", label: "enters", polarity: "positive", to: "legislativeBargain" },
        { from: "president", label: "pressures", polarity: "positive", to: "legislativeBargain" },
        { from: "legislativeBargain", label: "produces", polarity: "positive", to: "enactedLaw" },
        { from: "enactedLaw", label: "delegates to", polarity: "positive", to: "agencies" },
        { from: "agencies", label: "triggers", polarity: "positive", to: "courtReview" },
        { from: "courtReview", label: "shapes", polarity: "positive", to: "policyDurability" },
        { from: "policyDurability", label: "feeds back into", polarity: "positive", to: "publicDemand" },
        { from: "institutionalDivision", label: "reduces", polarity: "negative", to: "legislativeBargain" },
        { from: "institutionalDivision", label: "raises reliance on", polarity: "positive", to: "agencies" },
      ],
      loops: [
        "Reinforcing: elections produce institutional control, which shapes laws, implementation, and outcomes, which then reshape future elections",
        "Balancing: divided government and multiple veto points slow or block legislation, shifting conflict into executive action and courts",
      ],
      nodes: [
        { id: "publicDemand", label: "Public demand", tone: "cyan", x: 80, y: 100 },
        { id: "elections", label: "Separate elections", tone: "amber", x: 280, y: 40 },
        { id: "houseMajority", label: "House majority", tone: "amber", x: 500, y: 40 },
        { id: "senateMajority", label: "Senate majority", tone: "amber", x: 500, y: 180 },
        { id: "president", label: "President", tone: "emerald", x: 500, y: 320 },
        { id: "legislativeBargain", label: "Legislative bargaining", tone: "rose", x: 280, y: 180 },
        { id: "enactedLaw", label: "Enacted law", tone: "emerald", x: 80, y: 220 },
        { id: "agencies", label: "Agency implementation", tone: "cyan", x: 80, y: 360 },
        { id: "courtReview", label: "Court review", tone: "rose", x: 280, y: 360 },
        { id: "policyDurability", label: "Policy durability", tone: "emerald", x: 500, y: 420 },
        { id: "institutionalDivision", label: "Institutional division", tone: "rose", x: 280, y: 500 },
      ],
      title: "The U.S. veto-point loop",
    },
    discussionPrompt:
      "At what point do checks and balances stop protecting liberty and start protecting deadlock? Which veto points in the U.S. system are constitutional, and which are historical rules layered on later?",
    heroHighlights: [
      "The U.S. federal government splits power across House, Senate, presidency, courts, and the states rather than concentrating it in one elected majority.",
      "The House has 435 voting members by population; the Senate has 100 members with two per state, regardless of size.",
      "Even after both chambers act, the president can veto and courts can still reshape the result.",
    ],
    miniLesson: {
      bands: [
        {
          insight:
            "Low cross-branch division. Unified party control does not eliminate bargaining, but it raises the odds that major legislation can move all the way through Congress and the presidency.",
          threshold: 0,
        },
        {
          insight:
            "Moderate division. Bargaining becomes harder, committees and Senate procedure matter more, and budget deadlines start to become leverage points.",
          threshold: 35,
        },
        {
          insight:
            "High division. Congress struggles to legislate, so presidents lean more on executive action and agencies, while courts become more consequential to policy.",
          threshold: 70,
        },
        {
          insight:
            "Extreme polarization and division. Shutdown threats, reconciliation fights, and litigation politics become normal tools because the ordinary legislative route is clogged.",
          threshold: 90,
        },
      ],
      defaultValue: 55,
      description:
        "This slider compresses one important variable in U.S. governance: how politically divided the House, Senate, and presidency are from one another.",
      highLabel: "Deep institutional division",
      lowLabel: "Unified government",
      metrics: [
        {
          base: 84,
          description: "How likely major bills are to survive all the veto points needed to become federal law.",
          key: "us-law-passage",
          label: "Law passage probability",
          max: 100,
          min: 0,
          slope: -0.78,
          suffix: "/100",
          tone: "emerald",
        },
        {
          base: 18,
          description: "How much policymaking shifts toward executive orders, waivers, agency rulemaking, and prosecutorial discretion.",
          key: "us-executive-unilateralism",
          label: "Executive unilateralism",
          max: 100,
          min: 0,
          slope: 0.58,
          suffix: "/100",
          tone: "amber",
        },
        {
          base: 24,
          description: "How central courts become to major policy disputes when legislation stalls or statutes are broad and contested.",
          key: "us-court-salience",
          label: "Court salience",
          max: 100,
          min: 0,
          slope: 0.52,
          suffix: "/100",
          tone: "rose",
        },
      ],
      prompt:
        "Move the slider to see how divided government changes legislative output, executive improvisation, and the role of courts.",
      sliderLabel: "Cross-branch partisan division",
      step: 1,
      title: "Mini lesson: many veto points, one policy outcome",
      unit: "%",
      valueMax: 100,
      valueMin: 0,
    },
    realWorldExamples: [
      {
        insight:
          "Major federal laws often depend not only on majority support but on surviving Senate procedure. Bicameralism plus Senate rules can dramatically raise the threshold for action.",
        outcome:
          "The Civil Rights Act of 1964 passed the House, then required the Senate to defeat a long filibuster before final passage and presidential signature were possible.",
        title: "Civil Rights Act and Senate procedure",
      },
      {
        insight:
          "Passing the same broad policy through two chambers is rarely linear. Different chamber coalitions, procedural rules, and presidential timing all reshape the final law.",
        outcome:
          "The Affordable Care Act depended on separate House and Senate bargaining, plus follow-up budget reconciliation, showing how bicameralism and procedure can be as important as headline ideology.",
        title: "The Affordable Care Act as bicameral bargaining",
      },
      {
        insight:
          "Even after Congress legislates and agencies act, courts can narrow or reinterpret what the executive branch is allowed to do under the statute.",
        outcome:
          "In West Virginia v. EPA, the Supreme Court limited how broadly the Environmental Protection Agency could regulate under existing statutory authority, illustrating the judiciary's role as a major policy veto point.",
        title: "Judicial review and agency power",
      },
    ],
    relatedFrameworks: [
      "Separation of powers",
      "Bicameralism",
      "Filibuster and cloture",
      "Judicial review",
      "Federalism",
    ],
    simulationPrompt:
      "Route a federal bill through committee, House floor, Senate procedure, conference bargaining, presidential veto, agency implementation, and court review to test where U.S. decision-making jams.",
    simpleExplanation: [
      "The U.S. governing system is built around separated powers rather than a single parliamentary majority. Congress writes laws, the president executes them, and the courts interpret them. That structure is then layered with federalism, because states also have their own powers and institutions.",
      "Congress itself has two chambers with different logics. The House of Representatives is population-based and has 435 voting members. The Senate has 100 members, two per state, regardless of population. A bill normally has to pass both chambers in the same form before it goes to the president, and revenue bills must originate in the House.",
      "The president heads the executive branch, appoints agency leaders and many officials, can sign or veto legislation, and directs implementation through departments and agencies. The Senate also has special roles outside ordinary lawmaking, such as confirming many appointments and consenting to treaties.",
      "On top of that, the judiciary can review laws and executive actions, and the president is chosen through the Electoral College rather than by a direct national popular vote. The result is a system with many veto points: it can prevent rapid concentration of power, but it can also make broad public demands very hard to translate into law.",
    ],
    simulatorSlug: "us-decision-making",
    slug: "how-the-us-government-makes-decisions",
    systemBug: {
      signals: [
        "Popular proposals can win broad public support yet still die in committee, in the Senate, or through veto threats.",
        "Budget deadlines repeatedly become crisis points because ordinary legislative bargaining is so hard.",
        "Presidents and courts become more central to policy when Congress cannot produce durable statutes.",
      ],
      summary:
        "The core bug is not one bad actor but a dense veto-point architecture. Because power is split so many ways, the system can protect against domination while also protecting stalemate and minority obstruction.",
      title: "System bug: so many veto points that policy can stall everywhere",
    },
  proposals: [
    {
      title: "Reform the Senate filibuster to require genuine live debate rather than a mere threat",
      summary: "The modern Senate filibuster allows a single senator to block legislation indefinitely without speaking a word. Restoring the original talking filibuster retains minority protection while ending costless obstruction of majority will.",
      actor: "national_gov",
      domain: "political",
      feasibility: "contested",
      precedents: [
        { place: "USA (historical)", year: 1957, outcome: "Strom Thurmond's 24-hour 18-minute filibuster demonstrates what a genuine filibuster requires; the modern version requires nothing" },
        { place: "USA", year: 1975, outcome: "Cloture threshold lowered to 60 votes; further reform to 51 votes for judicial nominees showed filibuster reform is procedurally achievable" },
      ],
    },
    {
      title: "Establish independent redistricting commissions to end partisan gerrymandering",
      summary: "Gerrymandering allows incumbents to choose their voters rather than voters choosing their representatives. Independent commissions using neutral criteria draw maps that reflect actual geographic distributions of opinion.",
      actor: "national_gov",
      domain: "political",
      feasibility: "proven",
      precedents: [
        { place: "California", year: 2008, outcome: "Citizens Redistricting Commission replaced legislative self-redistricting; maps significantly more competitive; voter-approved by 76%" },
        { place: "Arizona", year: 2000, outcome: "Independent commission established by referendum; upheld by Supreme Court 5-4 in 2015; consistent evidence of fairer maps" },
      ],
    },
  ],

  };
