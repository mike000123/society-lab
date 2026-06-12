import type { LearningModule } from "./_types";
import { owidEvidenceLinks } from "./_shared";

export const lessonData: LearningModule = {
    betterMetrics: [
      {
        description: "Are people actually healthy enough to live long, capable lives?",
        label: "Health",
      },
      {
        description: "Do people have enough discretionary time to rest, care, and participate?",
        label: "Free time",
      },
      {
        description: "Can ordinary households access stable shelter without permanent financial strain?",
        label: "Housing affordability",
      },
      {
        description: "Does daily life build cooperation, trust, and social resilience?",
        label: "Trust",
      },
      {
        description: "Are ecosystems carrying the hidden cost of today's output?",
        label: "Ecological load",
      },
      {
        description: "How do people report their lives going, not just the economy's cash flow?",
        label: "Wellbeing",
      },
    ],
    betterMetricsTitle: "Measure these alongside GDP",
    counterArguments: [
      {
        point:
          "GDP still matters because states need a taxable economy to fund healthcare, infrastructure, and social protection.",
        response:
          "That is true. The issue is not that GDP is useless, but that it becomes dangerous when it is treated as the only scoreboard for success.",
        title: "GDP supports state capacity",
      },
      {
        point:
          "Poorer countries often need strong economic growth before they can seriously improve living standards.",
        response:
          "Also true. But even there, the question is what kind of growth improves broad living conditions rather than concentrating gains while exhausting people and ecosystems.",
        title: "Growth can still be necessary",
      },
      {
        point:
          "A single number is useful for comparison and planning. Broader dashboards can become messy and political.",
        response:
          "Simplicity is valuable, but oversimplification is costly. A compact wellbeing dashboard can still stay legible while revealing blind spots that GDP hides.",
        title: "Simple metrics are easier to use",
      },
    ],
    causalLoop: {
      description:
        "When societies celebrate output without checking lived outcomes, growth pressure can reinforce longer work, more stress, and weaker wellbeing.",
      edges: [
        {
          from: "work-hours",
          label: "more market activity",
          polarity: "positive",
          to: "gdp-output",
        },
        {
          bend: 10,
          from: "gdp-output",
          label: "headline success",
          polarity: "positive",
          to: "growth-pressure",
        },
        {
          bend: 14,
          from: "growth-pressure",
          label: "pressure to produce",
          polarity: "positive",
          to: "work-hours",
        },
        {
          bend: 8,
          from: "work-hours",
          label: "fatigue",
          polarity: "positive",
          to: "stress",
        },
        {
          from: "stress",
          label: "burnout",
          polarity: "negative",
          to: "wellbeing",
        },
        {
          bend: -16,
          from: "work-hours",
          label: "less care time",
          polarity: "negative",
          to: "free-time",
        },
        {
          bend: -10,
          from: "free-time",
          label: "rest and connection",
          polarity: "positive",
          to: "wellbeing",
        },
        {
          bend: -18,
          from: "wellbeing",
          label: "less panic for raw growth",
          polarity: "negative",
          to: "growth-pressure",
        },
      ],
      loops: [
        "Reinforcing loop: growth pressure pushes longer work hours, which lifts GDP output, which then gets rewarded as proof that the current model is working.",
        "Balancing loop: when wellbeing becomes visible, societies can ask for shorter hours, stronger protections, and better metrics instead of more extraction.",
      ],
      nodes: [
        { id: "work-hours", label: "Longer work hours", tone: "amber", x: 18, y: 18 },
        { id: "gdp-output", label: "GDP output", tone: "cyan", x: 80, y: 18 },
        { id: "growth-pressure", label: "Political pressure for growth", tone: "rose", x: 18, y: 48 },
        { id: "stress", label: "Stress and burnout", tone: "rose", x: 82, y: 56 },
        { id: "wellbeing", label: "Wellbeing", tone: "emerald", x: 18, y: 82 },
        { id: "free-time", label: "Time for care and community", tone: "emerald", x: 52, y: 82 },
      ],
      title: "Causal loop: output can rise while life quality falls",
    },
    discussionPrompt:
      "Where do you see GDP improving the headline while real life around you feels more expensive, rushed, or fragile?",
    heroHighlights: [
      "GDP counts market transactions, not whether people are flourishing.",
      "Accidents, illness, overwork, pollution cleanup, and housing speculation can all lift GDP.",
      "A healthier dashboard tracks wellbeing, health, time, trust, housing, and ecological cost too.",
    ],
    miniLesson: {
      bands: [
        {
          insight:
            "At lower work-hour levels, output is more modest, but people keep more time for care, recovery, and civic life.",
          threshold: 0,
        },
        {
          insight:
            "In the middle zone, GDP looks solid, but stress begins to eat into what that extra output is actually for.",
          threshold: 40,
        },
        {
          insight:
            "At high work-hour levels, output keeps rising, but stress compounds and wellbeing falls, revealing why GDP alone is too narrow.",
          threshold: 55,
        },
      ],
      defaultValue: 40,
      description:
        "This simplified toy model shows how a policy culture obsessed with longer work can push output up while also pushing stress up and wellbeing down.",
      highLabel: "Longer workweek",
      lowLabel: "Shorter workweek",
      metrics: [
        {
          base: 22,
          description: "A rough proxy for measured market output.",
          key: "gdp",
          label: "Measured GDP activity",
          max: 100,
          min: 0,
          slope: 0.95,
          suffix: "/100",
          tone: "cyan",
        },
        {
          base: 6,
          description: "Accumulated strain, time pressure, and burnout risk.",
          key: "stress",
          label: "Stress load",
          max: 100,
          min: 0,
          slope: 1.15,
          suffix: "/100",
          tone: "rose",
        },
        {
          base: 95,
          description: "A proxy for how sustainable and humane life feels.",
          key: "wellbeing",
          label: "Wellbeing",
          max: 100,
          min: 0,
          slope: -0.9,
          suffix: "/100",
          tone: "emerald",
        },
      ],
      prompt: "Move the work-hours slider and watch how the system responds.",
      sliderLabel: "Working hours per week",
      step: 1,
      title: "Mini lesson: more work can lift GDP and still damage life",
      unit: "h",
      valueLabel: "hours",
      valueMax: 70,
      valueMin: 20,
    },
    realWorldExamples: [
      {
        title: "US healthcare: highest spending, middling outcomes",
        insight:
          "The United States spends 17% of GDP on healthcare — by far the highest proportion among OECD nations. France, Germany, Japan, and the UK spend 10–12% of GDP. By GDP metrics, the US healthcare sector looks like a massive success.",
        outcome:
          "US life expectancy at birth is 78.5 years — lower than the UK (82.9), France (82.4), Australia (83.4), and Japan (84.3). The US has higher rates of preventable death, higher infant mortality, and higher rates of chronic disease than peers who spend less. GDP counts the spending, not the health. The waste, administrative overhead, and access inequality that drive high US spending appear as economic activity, not as failure.",
      },
      {
        title: "Post-2008 recovery: GDP bounced back, median income did not",
        insight:
          "The US economy returned to its pre-crisis GDP level by mid-2010 — roughly two years after the 2008 financial crisis. Measured by the standard benchmark, the recession was over.",
        outcome:
          "US median household income, adjusted for inflation, did not return to its 2007 level until 2016 (US Census Bureau, American Community Survey). For the eight years between those points, the economy was 'recovering' by GDP measurement while the median household was earning less than before the crisis. The gap reveals that GDP growth aggregates across income groups — it can be positive while most households are still worse off.",
      },
      {
        title: "The Erika tanker disaster: cleanup adds to GDP, damage does not subtract",
        insight:
          "In December 1999, the oil tanker Erika broke apart off the coast of Brittany, spilling 20,000 tonnes of heavy fuel oil that contaminated 400 kilometres of French coastline. Fishing was banned, beaches closed, and tens of thousands of seabirds were killed.",
        outcome:
          "The cleanup operation — costing hundreds of millions of euros — registered as positive economic activity in French GDP figures. The loss of fishing livelihoods, the destruction of ecosystems, and the cost to tourism were not subtracted. GDP recorded the spending required to partially repair a disaster as equivalent to productive economic activity. This is not a quirk of one event but a structural feature of how national accounts treat defensive and restorative spending.",
      },
    ],
    evidenceLinks: [owidEvidenceLinks.happiness, owidEvidenceLinks.workingHours, owidEvidenceLinks.poverty],
    relatedFrameworks: [
      "World3 model / Limits to Growth",
      "Donella Meadows leverage points",
      "System dynamics and causal loops",
      "Wellbeing economics",
    ],
    simulationPrompt:
      "Test a scenario where shorter work hours and stronger baseline security trade a little output for higher wellbeing and lower stress.",
    simulatorSlug: "purchasing-power",
    simpleExplanation: [
      "GDP measures the market value of goods and services produced in an economy. That makes it useful for tracking activity, tax capacity, and macroeconomic scale.",
      "But GDP is not the same thing as a good life. It can rise when people work longer hours, pay more for housing, buy more healthcare after avoidable illness, or spend money cleaning up environmental damage.",
      "It also misses what is not priced well: unpaid care, social trust, free time, mental health, ecological depletion, and the difference between productive investment and extractive speculation.",
      "So the real lesson is not to throw GDP away. It is to stop asking one production metric to answer a wellbeing question it was never designed to answer.",
    ],
    slug: "why-gdp-is-not-the-same-as-wellbeing",
    systemBug: {
      signals: [
        "More monetized activity is treated as progress even when it comes from accidents, illness, or cleanup.",
        "Overwork can increase output while draining sleep, care time, and mental health.",
        "Speculation can make housing more expensive and still show up as healthy economic activity.",
      ],
      summary:
        "The score goes up whenever money moves, even if the underlying reality includes damage, exhaustion, or rising insecurity.",
      title: "System bug: the indicator rewards transactions, not lived outcomes",
    },
  proposals: [
    {
      title: "Replace GDP headline with a Genuine Progress Indicator",
      summary: "Adopt GPI as the primary national accounting standard — it adds unpaid care work and volunteer labour, then subtracts inequality, pollution, and crime. Governments optimise for what they measure; change the metric and you change the incentive.",
      actor: "national_gov",
      domain: "economic",
      feasibility: "emerging",
      precedents: [
        { place: "Maryland, USA", year: 2010, outcome: "First US state to compute GPI officially; found GPI has fallen since the 1970s even as GDP doubled" },
        { place: "New Zealand", year: 2019, outcome: "Wellbeing Budget directed spending to mental health and child poverty — first government to formally deprioritise GDP growth as the goal" },
      ],
    },
    {
      title: "Mandate wellbeing impact assessments for every major budget decision",
      summary: "Require ministries to publish a wellbeing scorecard alongside every significant spending proposal. Forces hidden costs — care gaps, mental health, time poverty — into the calculus before money is allocated.",
      actor: "national_gov",
      domain: "political",
      feasibility: "proven",
      precedents: [
        { place: "Scotland", year: 2018, outcome: "National Performance Framework embeds wellbeing indicators into all public policy evaluation" },
        { place: "Wales", year: 2015, outcome: "Well-being of Future Generations Act legally requires all public bodies to consider long-term wellbeing" },
      ],
    },
    {
      title: "Teach GDP's limits in secondary school economics curricula",
      summary: "Students who only learn GDP grow up to design policies that maximise it. Embedding alternative metrics — ISEW, HDI, time-use — into standard curricula builds a generation of decision-makers with a richer toolkit.",
      actor: "national_gov",
      domain: "social",
      feasibility: "proven",
      precedents: [
        { place: "Finland", year: 2016, outcome: "Curriculum reform introduced systems thinking and multi-dimensional welfare concepts at secondary level" },
      ],
    },
  ],

  };
