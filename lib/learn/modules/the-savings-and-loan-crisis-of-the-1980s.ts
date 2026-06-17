import type { LearningModule } from "./_types";

export const lessonData: LearningModule = {
    betterMetrics: [
      {
        description: "When thrift assets cannot reprice but liabilities can, rising rates produce guaranteed insolvency.",
        label: "Asset-liability duration gap (years)",
      },
      {
        description: "Zombie institutions that cannot meet obligations but continue operating amplify eventual losses.",
        label: "Number of insolvent-but-operating institutions",
      },
      {
        description: "Deposit insurance without corresponding risk-based premiums subsidises excessive risk-taking.",
        label: "Deposit insurance premium vs. portfolio risk",
      },
      {
        description: "Tracks the share of thrift assets moving from long-term mortgages into junk bonds and commercial real estate.",
        label: "Share of assets in high-risk non-mortgage investments",
      },
    ],
    betterMetricsTitle: "What the regulators were not watching",
    causalLoop: {
      description:
        "Fixed-rate mortgages funded by floating deposits became a guaranteed loss when rates rose. Deregulation then allowed zombie thrifts to double down on junk bonds and commercial real estate — expanding losses until the government had no choice but to absorb them.",
      edges: [
        { from: "interestRates", label: "crush margins on", polarity: "negative", to: "thriftMargin" },
        { from: "thriftMargin", label: "erodes", polarity: "negative", to: "solvency" },
        { from: "solvency", label: "triggers", polarity: "negative", to: "regulatoryForbearance" },
        { from: "regulatoryForbearance", label: "allows continued operation of", polarity: "positive", to: "zombies" },
        { from: "zombies", label: "chase yield in", polarity: "positive", to: "junkAndCRE" },
        { from: "junkAndCRE", label: "amplifies", polarity: "negative", to: "losses" },
        { from: "losses", label: "drains", polarity: "negative", to: "FSLICReserves" },
        { from: "FSLICReserves", label: "depletion delays", polarity: "negative", to: "closures" },
        { from: "closures", label: "passes costs to", polarity: "negative", to: "taxpayer" },
        { bend: -30, from: "interestRates", label: "motivates", polarity: "positive", to: "deregulation" },
        { from: "deregulation", label: "expands risk-taking by", polarity: "positive", to: "zombies" },
      ],
      loops: [
        {
          description: "Insolvent thrifts allowed to operate took bigger bets hoping to grow back to solvency — each loss deepened the hole.",
          label: "R1",
          nodeIds: ["solvency", "regulatoryForbearance", "zombies", "junkAndCRE", "losses", "solvency"],
          polarity: "reinforcing",
        },
      ],
      nodes: [
        { id: "interestRates", label: "Rising Interest Rates", x: 350, y: 60 },
        { id: "thriftMargin", label: "Thrift Net Margin", x: 580, y: 160 },
        { id: "solvency", label: "Thrift Solvency", x: 580, y: 300 },
        { id: "regulatoryForbearance", label: "Regulatory Forbearance", x: 350, y: 390 },
        { id: "zombies", label: "Zombie Thrifts", x: 120, y: 300 },
        { id: "junkAndCRE", label: "Junk Bonds & CRE", x: 120, y: 160 },
        { id: "losses", label: "Cumulative Losses", x: 350, y: 240 },
        { id: "FSLICReserves", label: "FSLIC Reserves", x: 580, y: 460 },
        { id: "closures", label: "Forced Closures", x: 350, y: 540 },
        { id: "taxpayer", label: "Taxpayer Bailout", x: 120, y: 460 },
        { id: "deregulation", label: "Deregulation (1982)", x: 120, y: 60 },
      ],
      title: "S&L Crisis Causal Loop",
    },
    counterArguments: [
      {
        point:
          "The Volcker rate shock was a deliberate policy choice to break inflation. The S&L sector was collateral damage from a necessary macroeconomic correction, not a failure of financial regulation.",
        response:
          "The rate shock exposed the structural mismatch, but regulatory forbearance — allowing insolvent institutions to expand — turned a manageable write-down into a decade-long amplification of losses. The $130bn taxpayer bill was the cost of delay, not the initial shock.",
        title: "Blaming the interest rate shock is unfair to regulators",
      },
      {
        point:
          "Deregulation was the industry's own solution to survive the rate shock. Restricting thrifts to fixed-rate home mortgages while funding costs floated was itself the structural trap — deregulation gave them a fighting chance.",
        response:
          "Broadened investment powers without matching capital requirements or supervision created moral hazard at scale. The Garn-St Germain Act enabled junk bond speculation by entities whose deposits were federally insured.",
        title: "Deregulation gave thrifts a chance to survive",
      },
      {
        point:
          "The RTC wound down over 700 failed institutions and recovered significant assets. The resolution was professionally managed and losses were contained relative to the financial system size.",
        response:
          "The RTC was effective, but it was created seven years after the crisis began. The lesson is not that the resolution worked — it is that forbearance and delayed recognition multiplied the original loss several times over.",
        title: "The RTC resolution was a success story",
      },
    ],
    discussionPrompt:
      "When an insolvent institution is allowed to continue operating, who benefits and who pays? Why might regulators choose forbearance even when they know the institution is already insolvent?",
    heroHighlights: [
      "Rate rises exposed a structural mismatch: 30-year fixed assets funded by floating deposits",
      "Deregulation let insolvent thrifts gamble with junk bonds and commercial real estate",
      "Regulatory forbearance turned a $20bn problem into a $130bn taxpayer bill",
    ],
    miniLesson: {
    bands: [
      {
        threshold: 0,
        insight:
          "When short-term funding costs match long-term mortgage yields, S&Ls operate profitably. Borrow short, lend long is a viable model as long as the yield curve is normal — and regulators have nothing to panic about.",
      },
      {
        threshold: 3,
        insight:
          "At a 3 percentage-point gap, S&Ls begin losing money on their existing mortgage portfolio. The interest they pay on deposits exceeds the interest they receive on long-term fixed mortgages written years earlier. Insolvencies are emerging but contained.",
      },
      {
        threshold: 7,
        insight:
          "At a 7pp gap, a significant fraction of thrifts are technically insolvent. Their existing fixed-rate mortgage portfolios are worth less than their liabilities — but regulators use 'forbearance' accounting to avoid triggering mass closures. Each extra year of forbearance adds billions to the final cost.",
      },
      {
        threshold: 12,
        insight:
          "At 12+ pp — where the Fed pushed rates in 1981 to break inflation — almost every S&L with a standard mortgage portfolio is insolvent. The political response was to deregulate and gamble: thrifts were allowed to invest in riskier assets, hoping to grow their way out. This made the eventual crisis far worse.",
      },
    ],
    defaultValue: 7,
    description:
      "S&Ls borrowed short (deposits) and lent long (30-year mortgages). When the Fed raised short-term rates to combat inflation, that mismatch became fatal. Adjust the rate gap to see how the interest-rate mismatch drove insolvency and bailout costs.",
    highLabel: "15pp (extreme inversion)",
    lowLabel: "0pp (balanced)",
    metrics: [
      {
        base: 1,
        description: "Share of S&Ls technically insolvent three years after this rate gap emerges",
        key: "insolvency-rate",
        label: "S&L insolvency rate (3 yrs)",
        max: 70,
        min: 1,
        slope: 4.6,
        suffix: "%",
        tone: "rose",
      },
      {
        base: 5,
        description: "Estimated total taxpayer cost of resolving failed thrifts ($bn)",
        key: "bailout-cost",
        label: "Taxpayer bailout cost",
        max: 135,
        min: 5,
        slope: 8.67,
        suffix: "$bn",
        tone: "amber",
      },
      {
        base: 0.5,
        description: "Years between insolvency becoming widespread and regulators forcing resolution — 'zombie thrift' period",
        key: "forbearance-years",
        label: "Regulatory forbearance period",
        max: 8,
        min: 0.5,
        slope: 0.5,
        suffix: " yrs",
        tone: "cyan",
      },
    ],
    prompt: "Adjust the rate gap to see how the interest mismatch drove insolvency, regulatory delay, and the final bailout cost.",
    sliderLabel: "Short-term rate vs mortgage yield gap",
    step: 1,
    title: "The duration mismatch and its costs",
    unit: "pp",
    valueMax: 15,
    valueMin: 0,
  },
    realWorldExamples: [
      {
        insight:
          "The rate shock did not create the mismatch — it revealed a structure that had always been fragile. Regulators had allowed thrifts to borrow short and lend long for decades because it appeared stable during the low-rate postwar period.",
        outcome:
          "When Paul Volcker raised rates to 20% to break 1970s inflation, savings and loan associations found themselves paying 15% on deposits while earning 8% on 30-year mortgages. By 1982, the industry was collectively insolvent by any honest accounting.",
        title: "The Volcker shock and duration mismatch",
      },
      {
        insight:
          "Lincoln Savings, run by Charles Keating, illustrates how regulatory capture prolonged the crisis. Five US senators — the Keating Five — intervened with regulators on Lincoln's behalf after receiving $1.3m in campaign contributions.",
        outcome:
          "The Garn-St Germain Act (1982) deregulated thrift investment powers. Operators like Charles Keating used deposit funding to buy junk bonds and commercial real estate. Lincoln Savings alone cost the FSLIC $3.4bn.",
        title: "Garn-St Germain, junk bonds, and the Keating Five",
      },
      {
        insight:
          "FIRREA and the RTC demonstrated that a well-designed resolution authority can manage even very large financial failures if given proper mandate and funding. The problem was the seven-year lag before they were created.",
        outcome:
          "FIRREA (1989) created the Resolution Trust Corporation, which wound down 747 failed thrifts between 1989 and 1995. Final taxpayer cost was approximately $130bn — significantly higher than early estimates due to the losses accumulated during forbearance.",
        title: "FIRREA and the Resolution Trust Corporation",
      },
    ],
    timeline: {
      title: "How a mortgage model became a taxpayer crisis",
      intro:
        "The S&L crisis was a slow-motion sequence: a fragile funding model, a rate shock, political delay, and then a final public clean-up after years of gambling for resurrection.",
      events: [
        {
          timeLabel: "1940s–1970s",
          title: "Thrifts are built for a stable-rate world",
          family: "Institutional design",
          whyItStarted:
            "Savings and loans were created to fund home ownership by taking short-term deposits and issuing long-term fixed-rate mortgages.",
          turningPoint:
            "The business model assumed funding costs would stay low and reasonably stable across decades.",
          characteristics: [
            "30-year fixed-rate mortgage books",
            "Short-term deposit funding",
            "Low competition and narrow asset menus",
          ],
          outcome:
            "The model appeared safe for decades, but only because the interest-rate environment protected it from its own duration mismatch.",
        },
        {
          timeLabel: "1979–1981",
          title: "The Volcker shock reveals insolvency",
          family: "Macro shock",
          whyItStarted:
            "The Federal Reserve raised short-term rates aggressively to break entrenched inflation.",
          turningPoint:
            "Thrifts suddenly had to pay far more on deposits than they were earning on mortgages written years earlier.",
          characteristics: [
            "Fed funds rate pushed near 20%",
            "Deposit costs jump while mortgage income stays fixed",
            "Industry becomes economically insolvent before many closures occur",
          ],
          outcome:
            "What had looked like a safe housing-finance model was exposed as a giant maturity mismatch waiting for a rate shock.",
        },
        {
          timeLabel: "1980",
          title: "Policymakers choose deregulation over fast resolution",
          family: "Political response",
          whyItStarted:
            "Closing the insolvent sector quickly would have imposed visible losses and forced a public recapitalisation the political system wanted to avoid.",
          turningPoint:
            "Depository deregulation raised deposit-rate competition and gave troubled institutions more room to keep operating instead of shutting them down.",
          characteristics: [
            "Delay replaces recognition of losses",
            "Funding competition intensifies",
            "The immediate bill is hidden rather than paid",
          ],
          outcome:
            "The crisis stops being a contained write-down and becomes a drawn-out political decision to keep zombie institutions alive.",
        },
        {
          timeLabel: "1982",
          title: "Garn-St Germain turns zombies into speculators",
          family: "Moral hazard escalation",
          whyItStarted:
            "Insolvent thrifts were given broader investment powers in the hope that higher returns could rescue them.",
          turningPoint:
            "Deposit-insured institutions could now chase yield in junk bonds, speculative real estate, and development lending without matching capital discipline.",
          characteristics: [
            "Heads-I-win, tails-taxpayers-lose incentives",
            "Commercial real estate and junk-bond exposure rises",
            "Flat insurance premiums subsidise the riskiest firms",
          ],
          outcome:
            "The expected losses multiplied because weak institutions were encouraged to take even bigger bets with public backing.",
        },
        {
          timeLabel: "1986–1988",
          title: "Failures spread and capture becomes visible",
          family: "Crisis recognition",
          whyItStarted:
            "The speculative rescue strategy failed, while regulators and politicians continued delaying full recognition of the hole in the system.",
          turningPoint:
            "Lincoln Savings, the Keating Five scandal, and a widening failure wave made it impossible to pretend the problem was temporary.",
          characteristics: [
            "Hundreds of thrifts fail",
            "Political intervention shields connected operators",
            "FSLIC reserves prove far too small",
          ],
          outcome:
            "The public finally sees that forbearance was not neutral delay — it was the mechanism through which losses were enlarged.",
        },
        {
          timeLabel: "1989–1995",
          title: "FIRREA and the RTC close the chapter",
          family: "Forced cleanup",
          whyItStarted:
            "The system could no longer carry the fiction that insolvent thrifts would grow their way back to health.",
          turningPoint:
            "FIRREA abolished the old thrift regulator, recapitalised deposit insurance, and created the Resolution Trust Corporation to unwind failures at scale.",
          characteristics: [
            "747 failed thrifts wound down",
            "New oversight architecture replaces the old one",
            "Public absorbs roughly $130bn in final costs",
          ],
          outcome:
            "The clean-up worked, but only after years of delay had transformed a manageable problem into one of the largest taxpayer-financed financial rescues of the era.",
        },
      ],
    },
    relatedFrameworks: [
      "Duration Mismatch",
      "Regulatory Forbearance",
      "Moral Hazard",
      "Zombie Institutions",
      "Resolution Frameworks",
    ],
    simulationPrompt:
      "Adjust the interest rate shock, forbearance duration, and deregulation level to see how quickly a rate mismatch becomes a taxpayer liability.",
    simulatorSlug: "financial-crisis",
    slug: "the-savings-and-loan-crisis-of-the-1980s",
    simpleExplanation: [
      "The savings and loan crisis was not a sudden crash — it was a slow-motion collapse enabled by a specific structural trap and then amplified by the regulatory decision to look the other way. Savings and loans (thrifts) existed to fund home ownership: they took short-term deposits and made long-term fixed-rate mortgages. This worked fine as long as interest rates were stable.",
      "When Paul Volcker raised the Federal Funds Rate to 20% in 1981 to break inflation, the trap sprang. Thrifts were paying 15% on deposits but earning 8% on mortgages locked in years earlier. The industry was collectively insolvent. The regulatory response — forbearance, allowing insolvent institutions to keep operating on relaxed accounting rules — turned a $20bn problem into a $130bn taxpayer liability.",
      "The Garn-St Germain Act (1982) made it worse by deregulating thrift investment powers without adding capital requirements. Insolvent thrifts had nothing to lose: if speculative bets in junk bonds and commercial real estate paid off, they survived; if they failed, the federal insurance fund absorbed the loss. This is the moral hazard trap in its purest form. Every year of regulatory delay added roughly $10bn to the final cost.",
    ],
    systemBug: {
      signals: [
        "Institutions are insolvent but allowed to keep taking deposits",
        "Insurance premiums are flat regardless of risk taken",
        "Regulators have discretion to delay recognition of losses",
        "Political pressure shields large or well-connected failing institutions",
      ],
      summary:
        "Once a deposit-insured institution is technically insolvent, continuing to operate creates a one-way bet: if the gambles pay off, the institution survives; if they fail, the insurer — ultimately the taxpayer — absorbs the loss. Forbearance institutionalizes this bet.",
      title: "System bug: regulatory forbearance creates a heads-I-win, tails-you-lose structure",
    },
  proposals: [
    {
      title: "Require bank supervisors to have personal accountability for regulatory failures",
      summary: "Captured regulators face no personal consequence for allowing crises to develop. Personal civil accountability for supervisors who demonstrably ignored warning signs changes the incentive structure from forbearance to enforcement.",
      actor: "national_gov",
      domain: "legal",
      feasibility: "contested",
      precedents: [
        { place: "Singapore (MAS)", year: 2000, outcome: "MAS supervisors subject to internal accountability reviews with career consequences; Singapore avoided most of 2008 crisis impacts due to enforcement culture" },
        { place: "New Zealand", year: 1994, outcome: "Reserve Bank Act introduced performance agreements for supervisors with measurable prudential outcomes" },
      ],
    },
    {
      title: "Fund deposit insurance through risk-weighted premiums rather than flat assessments",
      summary: "When all banks pay the same deposit insurance rate, safe banks subsidise reckless ones. Risk-weighted premiums higher for banks with more leverage or weaker capital create a financial incentive for prudent behaviour.",
      actor: "national_gov",
      domain: "economic",
      feasibility: "proven",
      precedents: [
        { place: "USA (FDIC)", year: 1993, outcome: "Risk-based deposit insurance premiums introduced after S and L crisis; reduced moral hazard; healthier banks pay near zero while riskier institutions pay more" },
        { place: "EU (DGSD)", year: 2014, outcome: "Deposit Guarantee Schemes Directive requires risk-based contribution methodology across all EU member states" },
      ],
    },
  ],

  };
