import type { LearningModule } from "./_types";

export const lessonData: LearningModule = {
    betterMetrics: [
      {
        description: "Who gets access to lawmakers, hearings, and draft text?",
        label: "Access equality",
      },
      {
        description: "Are meetings, donations, and revolving-door relationships visible?",
        label: "Transparency",
      },
      {
        description: "Do consultations include citizens, workers, and affected communities too?",
        label: "Voice diversity",
      },
      {
        description: "Can agencies actually resist capture and enforce rules?",
        label: "Regulatory capacity",
      },
    ],
    betterMetricsTitle: "Healthy guardrails to watch",
    counterArguments: [
      {
        point:
          "Policymakers genuinely need industry expertise when writing complicated rules.",
        response:
          "Yes, but expertise and agenda control are not the same thing. The fix is transparent, balanced input rather than privileged access for the most resourced actors.",
        title: "Expertise matters",
      },
      {
        point:
          "Lobbying is not the same as bribery; many civil-society groups lobby too.",
        response:
          "Correct. The concern is asymmetry. When some actors can fund armies of advocates and others cannot, the policy field tilts even without explicit corruption.",
        title: "Influence can be legal",
      },
      {
        point:
          "Markets need regulatory certainty, and business input helps prevent rules that are technically unworkable.",
        response:
          "True, but workability is not the only lens. Rules that are technically feasible can still be written in ways that entrench incumbents, exclude competitors, or shift costs onto workers and the public. Input on workability is valuable; input that defines the scope of what is even considered is a different matter.",
        title: "Business input prevents bad rules",
      },
    ],
    causalLoop: {
      description:
        "Money often shapes policy through agenda setting, drafting access, and delay power long before anything openly illegal appears.",
      edges: [
        { from: "donor-dependence", label: "more dependence", polarity: "positive", to: "privileged-access" },
        { from: "privileged-access", label: "agenda control", polarity: "positive", to: "policy-carveouts" },
        { from: "policy-carveouts", label: "concentrated benefits", polarity: "positive", to: "private-gains" },
        { bend: 12, from: "private-gains", label: "more money for influence", polarity: "positive", to: "donor-dependence" },
        { from: "policy-carveouts", label: "public cynicism", polarity: "negative", to: "public-trust" },
        { from: "public-trust", label: "reform mandate", polarity: "positive", to: "reform-capacity" },
        { bend: -16, from: "reform-capacity", label: "stronger guardrails", polarity: "negative", to: "policy-carveouts" },
      ],
      loops: [
        "Reinforcing loop: money buys access, access shapes carve-outs, carve-outs create gains, and gains finance more influence.",
        "Balancing loop: when trust loss becomes visible, reforms like disclosure, public financing, and conflict rules can reduce capture.",
      ],
      nodes: [
        { id: "donor-dependence", label: "Dependence on private donors", tone: "amber", x: 18, y: 18 },
        { id: "privileged-access", label: "Privileged policy access", tone: "cyan", x: 78, y: 20 },
        { id: "policy-carveouts", label: "Policy carve-outs and delays", tone: "rose", x: 78, y: 54 },
        { id: "private-gains", label: "Concentrated private gains", tone: "amber", x: 18, y: 54 },
        { id: "public-trust", label: "Public trust", tone: "emerald", x: 20, y: 84 },
        { id: "reform-capacity", label: "Reform capacity", tone: "emerald", x: 78, y: 84 },
      ],
      title: "Causal loop: influence becomes self-financing",
    },
    discussionPrompt:
      "Which forms of lobbying feel like legitimate expertise, and which feel like structural capture in your country?",
    heroHighlights: [
      "Policy can be bent through access, timing, and drafting power without a dramatic scandal.",
      "Capture usually works by privileging some voices over others, not by banning public input altogether.",
      "Transparency and countervailing institutions matter because influence compounds.",
    ],
    miniLesson: {
      bands: [
        {
          insight:
            "Lower donor dependence gives lawmakers more room to respond to broader public interests.",
          threshold: 0,
        },
        {
          insight:
            "As donor dependence rises, access becomes more unequal and trust starts to erode even before rules visibly change.",
          threshold: 40,
        },
        {
          insight:
            "At high dependence, the system begins to optimize for insiders, and reform gets harder because the winners can protect the arrangement.",
          threshold: 70,
        },
      ],
      defaultValue: 45,
      description:
        "This mini lesson compresses one mechanism of policy capture: money changes who gets heard, and that changes which outcomes feel politically possible.",
      highLabel: "High donor influence",
      lowLabel: "Low donor influence",
      metrics: [
        {
          base: 18,
          description: "How strongly policy tracks concentrated funders.",
          key: "donor-response",
          label: "Donor responsiveness",
          max: 100,
          min: 0,
          slope: 0.95,
          suffix: "/100",
          tone: "amber",
        },
        {
          base: 90,
          description: "How much ordinary people believe the system listens back.",
          key: "trust",
          label: "Public trust",
          max: 100,
          min: 0,
          slope: -0.78,
          suffix: "/100",
          tone: "emerald",
        },
        {
          base: 88,
          description: "How likely the system is to pass broad public-interest reform.",
          key: "reform",
          label: "Reform capacity",
          max: 100,
          min: 0,
          slope: -0.72,
          suffix: "/100",
          tone: "cyan",
        },
      ],
      prompt: "Move the influence slider to see how capture accumulates.",
      sliderLabel: "Dependence on private donors",
      step: 1,
      title: "Mini lesson: access quietly rewrites incentives",
      unit: "%",
      valueMax: 100,
      valueMin: 0,
    },
    realWorldExamples: [
      {
        insight:
          "The US pharmaceutical industry spent over $370 million lobbying Congress in a single year partly to prevent Medicare from directly negotiating drug prices — a policy that polls above 80% public support but was blocked for two decades.",
        outcome:
          "Drug prices in the US remain several times higher than in comparable countries with stronger negotiating mandates, a gap that correlates directly with the lobbying differential.",
        title: "US drug pricing: the cost of access asymmetry",
      },
      {
        insight:
          "Before the 2008 financial crisis, financial industry lobbying successfully weakened regulatory oversight of derivatives markets and prevented the extension of consumer-protection rules to new instruments.",
        outcome:
          "Deregulation of the exact instruments that triggered the crisis was partly the product of sustained lobbying through the late 1990s and 2000s, not only a technical oversight.",
        title: "Finance lobby and the 2008 crisis",
      },
      {
        insight:
          "In Brussels, big tech companies employed more lobbyists per major regulation than almost any other sector during negotiations over the Digital Markets Act and AI Act, with some firms running over 100 staff across lobbying, legal, and public-affairs roles.",
        outcome:
          "Key provisions on data access, interoperability obligations, and AI risk definitions were modified significantly between early drafts and final text — partly reflecting industry input delivered through formal and informal channels.",
        title: "EU tech regulation and the Brussels lobby machine",
      },
    ],
    evidenceLinks: [
      {
        note: "Democracy and political rights data — useful for comparing how transparent and accountable political systems are across countries, which correlates with lobbying regulation quality.",
        source: "Our World in Data",
        title: "Democracy",
        url: "https://ourworldindata.org/democracy",
      },
      {
        note: "State capacity data — shows how much implementation and enforcement power governments actually have, which determines how much lobbying can hollow out regulation.",
        source: "Our World in Data",
        title: "State Capacity",
        url: "https://ourworldindata.org/state-capacity",
      },
    ],
    relatedFrameworks: [
      "Political economy",
      "Institutional capture",
      "Public choice and incentive design",
      "Causal loop mapping",
    ],
    simulationPrompt:
      "Test a scenario with stronger lobbying disclosure, public campaign finance, and more citizen oversight.",
    simpleExplanation: [
      "Lobbying shapes policy less by issuing explicit orders and more by controlling access, timing, framing, and detail. The question is often not who wrote the law, but who was in the room early enough to shape it.",
      "Organisations with money can hire advocates, analysts, lawyers, and public-relations teams. That lets them show up repeatedly with draft language, talking points, and warnings about costs or disruption — long before the public consultation even opens.",
      "The revolving door deepens this. Officials who regulate an industry develop knowledge that has market value when they leave. Industry hires them. Former industry executives join agencies. Each move transfers maps, relationships, and assumptions across the public-private boundary.",
      "This does not mean every lobbyist is malign. It means influence is unevenly distributed, so the system over-hears concentrated interests and under-hears dispersed ones — even without a single corrupt act.",
    ],
    slug: "how-lobbying-shapes-policy",
    systemBug: {
      signals: [
        "The best-resourced actors appear earlier, more often, and with more technical support.",
        "Policy delay can be as valuable as policy victory.",
        "Public trust falls when people sense that formal democracy hides informal hierarchy.",
      ],
      summary:
        "The system rewards persistent organized influence, so those with the most money and staff shape the policy menu before the public sees it.",
      title: "System bug: access is unequal, so representation becomes unequal too",
    },
  proposals: [
    {
      title: "Require real-time public disclosure of all lobbying contacts with government officials",
      summary: "Transparency is the minimum condition for accountability. A mandatory public register listing every meeting, call, and written communication between lobbyists and officials within 48 hours makes influence visible and auditable.",
      actor: "national_gov",
      domain: "political",
      feasibility: "proven",
      precedents: [
        { place: "USA", year: 1995, outcome: "Lobbying Disclosure Act created first comprehensive register; 3.5bn dollars per year in spending disclosed by 2022" },
        { place: "EU", year: 2021, outcome: "Mandatory Transparency Register covers all EU institutions; meetings with Commissioners publicly published within 2 weeks" },
      ],
    },
    {
      title: "Impose a 5-year cooling-off period before officials can lobby their former institution",
      summary: "The revolving door converts public office into private value. A meaningful cooling-off period closes the most direct channel through which industry buys future influence by hiring former regulators and legislators.",
      actor: "national_gov",
      domain: "legal",
      feasibility: "proven",
      precedents: [
        { place: "Canada", year: 2006, outcome: "Federal Accountability Act imposed 5-year ban on senior officials lobbying former departments; violations criminally enforceable" },
        { place: "France", year: 2017, outcome: "Sapin II law created transparency commission reviewing post-public career moves; blocked several high-profile revolving-door cases" },
      ],
    },
    {
      title: "Fund citizen advocacy infrastructure to balance organised industry influence",
      summary: "Concentrated industries can afford permanent lobbying operations; diffuse publics cannot. Public funding for civic advocacy organisations — consumer groups, environmental NGOs, labour coalitions — restores rough balance to competition for legislative attention.",
      actor: "national_gov",
      domain: "political",
      feasibility: "emerging",
      precedents: [
        { place: "USA (CPSC)", year: 1975, outcome: "Consumer Product Safety Act allowed citizens to intervene in regulatory proceedings with compensation — created the template for public interest participation" },
        { place: "Canada (CRTC)", year: 1977, outcome: "Public participation fund allows citizen groups to intervene in telecom and broadcast regulatory hearings" },
      ],
    },
  ],

  };
