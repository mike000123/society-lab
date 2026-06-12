import type { LearningModule } from "./_types";
import { owidEvidenceLinks } from "./_shared";

export const lessonData: LearningModule = {
    betterMetrics: [
      {
        description:
          "How much pollution is accumulating in the stock, not just how emissions changed this year.",
        label: "Accumulated pollution stock",
      },
      {
        description:
          "How close the system is to thresholds beyond which damage becomes abrupt, harder to reverse, or self-reinforcing.",
        label: "Distance to tipping points",
      },
      {
        description:
          "How long the delay is between a harmful action and the visible damage it causes.",
        label: "Feedback delay length",
      },
      {
        description:
          "How much adaptive capacity remains in ecosystems, infrastructure, and public health before recovery becomes much more expensive.",
        label: "Remaining resilience",
      },
    ],
    betterMetricsTitle: "The signals that matter when damage builds slowly and then hits fast",
    counterArguments: [
      {
        point:
          "If pollution were really a systems threat, the damage would already be obvious to everyone all the time.",
        response:
          "Many environmental harms are delayed. Stocks build quietly, ecosystems absorb stress for a while, and then visible damage appears later, often after prevention has become more expensive than it would have been earlier.",
        title: "Real problems would be obvious immediately",
      },
      {
        point:
          "Technology can always clean up pollution later, so there is no need to worry about tipping points now.",
        response:
          "Some pollution can be cleaned up, but not all system damage is reversible on useful timescales. Species loss, ice-sheet melt, reef collapse, or soil degradation can create long shadows that technology cannot simply rewind.",
        title: "Cleanup later is enough",
      },
      {
        point:
          "Tipping points are too uncertain to matter for policy.",
        response:
          "Uncertainty is not a reason for delay when the downside risk is large and potentially irreversible. In systems with nonlinear thresholds, waiting for total certainty often means waiting until the safe margin is already gone.",
        title: "Uncertainty means we should wait",
      },
    ],
    causalLoop: {
      description:
        "Pollution behaves like a stock. It can accumulate faster than natural systems absorb it. Because damage is delayed, society often keeps expanding the flow until resilience weakens and a tipping point becomes more likely.",
      edges: [
        { from: "economicFlow", label: "creates", polarity: "positive", to: "pollutionFlow" },
        { from: "pollutionFlow", label: "adds to", polarity: "positive", to: "pollutionStock" },
        { from: "naturalAbsorption", label: "reduces", polarity: "negative", to: "pollutionStock" },
        { from: "pollutionStock", label: "erodes", polarity: "negative", to: "ecosystemResilience" },
        { from: "ecosystemResilience", label: "buffers", polarity: "negative", to: "visibleDamage" },
        { from: "visibleDamage", label: "raises", polarity: "positive", to: "publicAlarm" },
        { from: "publicAlarm", label: "pushes", polarity: "positive", to: "pollutionControl" },
        { from: "pollutionControl", label: "cuts", polarity: "negative", to: "pollutionFlow" },
        { from: "lowResilience", label: "raises risk of", polarity: "positive", to: "tippingDynamics" },
        { from: "tippingDynamics", label: "amplify", polarity: "positive", to: "visibleDamage" },
      ],
      loops: [
        "Balancing: more public alarm -> more pollution control -> lower pollution flow",
        "Reinforcing danger loop: accumulated pollution -> lower resilience -> higher tipping risk -> more visible damage",
      ],
      nodes: [
        { id: "economicFlow", label: "Economic activity", tone: "amber", x: 80, y: 100 },
        { id: "pollutionFlow", label: "Pollution flow", tone: "rose", x: 280, y: 50 },
        { id: "pollutionStock", label: "Pollution stock", tone: "rose", x: 500, y: 120 },
        { id: "naturalAbsorption", label: "Natural absorption", tone: "emerald", x: 500, y: 300 },
        { id: "ecosystemResilience", label: "Ecosystem resilience", tone: "cyan", x: 280, y: 350 },
        { id: "visibleDamage", label: "Visible damage", tone: "amber", x: 80, y: 300 },
        { id: "publicAlarm", label: "Public alarm", tone: "emerald", x: 80, y: 460 },
        { id: "pollutionControl", label: "Pollution control", tone: "cyan", x: 280, y: 500 },
        { id: "lowResilience", label: "Low resilience", tone: "rose", x: 500, y: 430 },
        { id: "tippingDynamics", label: "Tipping dynamics", tone: "rose", x: 500, y: 520 },
      ],
      title: "Why slow accumulation can end in abrupt instability",
    },
    discussionPrompt:
      "Why do societies often react late to environmental danger? Is it because people do not care, or because delayed feedback makes accumulation look harmless until the system is already close to a threshold?",
    heroHighlights: [
      "Pollution is often a stock problem: what matters is accumulation over time, not only today’s flow.",
      "Delayed feedback can hide damage until the system is already much less resilient.",
      "Tipping points matter because change can become abrupt, nonlinear, and harder to reverse.",
    ],
    miniLesson: {
    bands: [
      {
        threshold: 0,
        insight:
          "When additions are below absorption capacity, the system is self-repairing. Lakes, forests, and atmospheric systems can clear themselves over decades — but only if the incoming load stays below the renewal rate.",
      },
      {
        threshold: 50,
        insight:
          "At 100% — exactly matching absorption capacity — the system appears stable indefinitely. But stock is not falling; there is no buffer left for a bad year. Any spike in inputs tips the balance from stable to accumulating.",
      },
      {
        threshold: 100,
        insight:
          "Above absorption capacity, harmful stock is growing silently. No visible effect yet — but the system is losing resilience with every year. When tipping happens, it will appear sudden even though it was decades in the making.",
      },
      {
        threshold: 150,
        insight:
          "At twice absorption capacity, visible system stress appears within years. Costs of repair are now exponential: every year of inaction roughly doubles the cost of remediation. The window for cheap intervention has closed.",
      },
    ],
    defaultValue: 120,
    description:
      "Pollution systems accumulate: what matters is not today's emission rate but the stock built up over years relative to the system's repair capacity. Move the slider to see how annual addition rate determines when tipping points arrive — and how reversible they are.",
    highLabel: "200% (rapid overload)",
    lowLabel: "50% (recovering)",
    metrics: [
      {
        base: 60,
        description: "Years before visible system stress first appears",
        key: "years-to-stress",
        label: "Years before visible stress",
        max: 60,
        min: 3,
        slope: -0.38,
        suffix: " yrs",
        tone: "amber",
      },
      {
        base: 95,
        description: "Percentage of original system function recoverable after the tipping point is crossed",
        key: "reversibility",
        label: "Reversibility after tipping",
        max: 95,
        min: 15,
        slope: -0.53,
        suffix: "%",
        tone: "emerald",
      },
      {
        base: 1,
        description: "Cost of remediation relative to acting now — compounds with each year of delay",
        key: "cost-multiplier",
        label: "Remediation cost multiplier",
        max: 18,
        min: 1,
        slope: 0.113,
        suffix: "×",
        tone: "rose",
      },
    ],
    prompt: "Set the annual addition rate relative to the system's absorption capacity and see when the bill arrives.",
    sliderLabel: "Annual additions as % of absorption capacity",
    step: 10,
    title: "The accumulation trap",
    unit: "%",
    valueMax: 200,
    valueMin: 50,
  },
    realWorldExamples: [
      {
        insight:
          "The Great Smog of London made visible what had been building for years: pollution can look normal until a weather pattern or threshold reveals the full health cost at once.",
        outcome:
          "The crisis helped drive the UK Clean Air Act, showing how delayed damage often becomes politically real only after a visible shock.",
        title: "London smog and delayed visibility",
      },
      {
        insight:
          "The ozone crisis showed that atmospheric pollution can accumulate invisibly across borders and then require global coordination once the damage becomes undeniable.",
        outcome:
          "The Montreal Protocol became a model for acting on a systemic pollution threat before the damage became even larger and harder to reverse.",
        title: "Ozone depletion and coordinated response",
      },
      {
        insight:
          "Climate-linked coral bleaching, wildfire feedbacks, and ecosystem collapse risks show why environmental change is not always gradual. Loss of resilience can make damage arrive in jumps.",
        outcome:
          "These cases keep shifting environmental policy toward risk management, precaution, and resilience rather than waiting for neat linear forecasts.",
        title: "Tipping risk in climate and ecosystems",
      },
    ],
    evidenceLinks: [owidEvidenceLinks.airPollution, owidEvidenceLinks.biodiversity, owidEvidenceLinks.cleanWater],
    relatedFrameworks: [
      "Stocks and flows",
      "Overshoot",
      "Planetary boundaries",
      "Delayed feedback",
      "Tipping points",
    ],
    simulationPrompt:
      "Test what happens when pollution controls arrive early versus late in a system where pollution accumulates, resilience erodes, and tipping risks rise after long delays.",
    simpleExplanation: [
      "Many environmental problems are hard to govern because they do not behave like a simple one-time accident. They behave like stocks: pollution, heat, nutrient overload, or ecological damage can accumulate slowly while the system still appears stable.",
      "That apparent stability is misleading. Ecosystems, oceans, forests, soils, and even public health systems often absorb damage for a while. This buffering capacity makes the problem look smaller than it really is. But once resilience is weakened enough, the same level of pressure can suddenly produce much larger visible harm.",
      "That is where tipping points matter. A tipping point is not just a bad outcome. It is a threshold after which change becomes nonlinear, self-reinforcing, or much harder to reverse. In practical terms, it means prevention was cheaper earlier, but institutions often wait because the feedback arrived late.",
      "The lesson is not panic; it is systems literacy. If you only look at immediate flows or only react to visible crisis, you will almost always intervene too late. The safer strategy is to watch stocks, delays, buffer capacity, and threshold risk before the system is forced into abrupt adjustment.",
    ],
    slug: "how-pollution-builds-up-until-systems-tip",
    systemBug: {
      signals: [
        "Policy reacts to visible damage while ignoring the stock that was accumulating beforehand.",
        "Success is measured by short-run output while resilience, sink capacity, and threshold risk are barely tracked.",
        "Environmental cleanup is funded after crisis, while prevention struggles to compete with immediate returns.",
      ],
      summary:
        "The system bug is delayed visibility. When harm accumulates invisibly for years, institutions organized around short-term signals tend to underreact until prevention has become far more costly than it needed to be.",
      title: "System bug: delayed feedback makes overshoot look harmless until it isn't",
    },
  proposals: [
    {
      title: "Set legally binding aggregate pollution budgets for air, water, and soil",
      summary: "Pollution is currently regulated substance-by-substance without a binding ceiling on systemic load. Setting national pollution budgets with declining annual caps prevents incremental exemptions from accumulating past tipping points.",
      actor: "national_gov",
      domain: "environmental",
      feasibility: "emerging",
      precedents: [
        { place: "EU (Zero Pollution Action Plan)", year: 2021, outcome: "First EU attempt to set integrated pollution reduction targets across air, water, and soil; aims for 55% reduction in premature deaths from air pollution by 2030" },
        { place: "UK (Environment Act)", year: 2021, outcome: "Legally binding targets for air quality, water quality, and biodiversity with 5-year review cycles" },
      ],
    },
    {
      title: "Apply strict liability and unlimited cleanup cost recovery to polluters including historical contamination",
      summary: "When cleanup costs can be externalised through bankruptcy, companies have a financial incentive to pollute. Strict liability plus unlimited cost recovery changes the calculus: the cheapest option becomes not polluting in the first place.",
      actor: "national_gov",
      domain: "legal",
      feasibility: "proven",
      precedents: [
        { place: "USA (Superfund)", year: 1980, outcome: "CERCLA established joint-and-several strict liability for hazardous waste cleanup; recovered 30bn+ from polluters over 40 years" },
        { place: "EU Environmental Liability Directive", year: 2004, outcome: "Strict liability for GMO and hazardous operations; polluter pays principle embedded in EU environmental law" },
      ],
    },
  ],

  };
