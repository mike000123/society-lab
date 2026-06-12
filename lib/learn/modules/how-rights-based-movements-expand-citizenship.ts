import type { LearningModule } from "./_types";
import { owidEvidenceLinks } from "./_shared";

export const lessonData: LearningModule = {
    betterMetrics: [
      {
        description:
          "How clearly the movement can reveal the gap between a society's stated principles and the exclusion people experience in daily life.",
        label: "Moral contrast visibility",
      },
      {
        description:
          "How broad the coalition is across churches, unions, students, professionals, families, and international allies.",
        label: "Coalition breadth",
      },
      {
        description:
          "Whether direct action is linked to legal, legislative, and administrative strategies that can lock gains in.",
        label: "Institutional follow-through",
      },
      {
        description:
          "How much national or international media forces bystanders to see repression rather than letting exclusion remain private.",
        label: "Witness and media pressure",
      },
    ],
    betterMetricsTitle: "Signals that a rights-based movement can expand citizenship",
    counterArguments: [
      {
        point:
          "Courts and enlightened leaders created equal rights; street movements were mostly symbolic.",
        response:
          "Court victories mattered, but they often needed movements to make inaction politically costly and to demonstrate that the excluded group could organize at scale. Protest and law usually worked together rather than separately.",
        title: "Institutions granted rights on their own",
      },
      {
        point:
          "Disciplined nonviolent action is passive and too weak to change entrenched power.",
        response:
          "Disciplined disruption is not passive. Boycotts, sit-ins, strikes, marches, and occupation of public institutions can impose reputational, economic, and legal costs while also widening sympathy.",
        title: "Nonviolent tactics are too soft",
      },
      {
        point:
          "Once formal equality is passed into law, the movement's work is mostly done.",
        response:
          "Legal wins are turning points, not endpoints. Implementation, backlash, underfunding, and cultural resistance often continue for decades after the headline reform.",
        title: "Law ends the struggle",
      },
    ],
    causalLoop: {
      description:
        "Rights-based movements grow when visible injustice is turned into a public contradiction: a society claims equality, yet its institutions deny it. Disciplined disruption, media visibility, and legal follow-through help convert that contradiction into expanded citizenship.",
      edges: [
        { from: "visibleInjustice", label: "creates", polarity: "positive", to: "moralOutrage" },
        { from: "moralOutrage", label: "recruits", polarity: "positive", to: "movementOrganizations" },
        { from: "movementOrganizations", label: "coordinate", polarity: "positive", to: "disciplinedDisruption" },
        { from: "disciplinedDisruption", label: "draws", polarity: "positive", to: "mediaWitness" },
        { from: "mediaWitness", label: "raises", polarity: "positive", to: "publicLegitimacy" },
        { from: "publicLegitimacy", label: "pushes", polarity: "positive", to: "legalReform" },
        { from: "legalReform", label: "expands", polarity: "positive", to: "citizenship" },
        { from: "citizenship", label: "strengthens", polarity: "positive", to: "movementOrganizations" },
        { from: "backlash", label: "reduces", polarity: "negative", to: "legalReform" },
        { from: "disciplinedDisruption", label: "provokes", polarity: "positive", to: "backlash" },
      ],
      loops: [
        "Reinforcing: visible injustice -> outrage -> disciplined disruption -> public legitimacy -> legal reform -> wider citizenship",
        "Balancing: backlash can slow reform, which is why coalition breadth and legal follow-through matter after the dramatic protest moment",
      ],
      nodes: [
        { id: "visibleInjustice", label: "Visible injustice", tone: "rose", x: 80, y: 80 },
        { id: "moralOutrage", label: "Moral outrage", tone: "amber", x: 280, y: 40 },
        { id: "movementOrganizations", label: "Movement organizations", tone: "emerald", x: 500, y: 100 },
        { id: "disciplinedDisruption", label: "Disciplined disruption", tone: "emerald", x: 500, y: 280 },
        { id: "mediaWitness", label: "Media witness", tone: "cyan", x: 280, y: 320 },
        { id: "publicLegitimacy", label: "Public legitimacy", tone: "amber", x: 80, y: 280 },
        { id: "legalReform", label: "Legal reform", tone: "cyan", x: 80, y: 160 },
        { id: "citizenship", label: "Expanded citizenship", tone: "emerald", x: 280, y: 500 },
        { id: "backlash", label: "Backlash", tone: "rose", x: 500, y: 440 },
      ],
      title: "The rights-expansion loop",
    },
    discussionPrompt:
      "What makes a rights-based movement more than moral testimony? Why do some moments of public outrage become durable legal change while others fade after the headlines?",
    heroHighlights: [
      "These movements expose the gap between stated universal values and lived exclusion.",
      "Disciplined public disruption matters most when it is paired with legal and institutional follow-through.",
      "Turning points often arrive when repression becomes visible to bystanders who can no longer deny the contradiction.",
    ],
    miniLesson: {
    bands: [
      {
        threshold: 0,
        insight:
          "With no cross-group coalition, a rights movement faces the full force of majority resistance — framed as a threat to existing order — with no counterweight from outside its own community. Change, if it comes, comes slowly and is often reversible.",
      },
      {
        threshold: 10,
        insight:
          "At 10% active cross-group support — sympathetic but not yet mobilised majorities — movements acquire moral legitimacy. The frame shifts from 'minority demand' toward 'rights question.' Strategic litigation and legislative allies become viable.",
      },
      {
        threshold: 20,
        insight:
          "At 20%, coalitions become electorally meaningful. Politicians in competitive districts begin calculating whether supporting the movement costs more than it gains. In two-party systems, this is often the inflection point for legislative movement.",
      },
      {
        threshold: 35,
        insight:
          "At 35–40% active cross-group support, the political calculus inverts: opposing the movement is now the higher electoral risk in many constituencies. Backlash remains, but is now the minority position — legally isolated rather than constitutionally protected.",
      },
    ],
    defaultValue: 15,
    description:
      "Rights movements rarely win through the mobilisation of affected groups alone — they require coalition building with the majority. Adjust the active cross-group support level to see how it determines speed, legislative viability, and durability of change.",
    highLabel: "40% (broad coalition)",
    lowLabel: "0% (isolated)",
    metrics: [
      {
        base: 40,
        description: "Expected years from mass mobilisation to formal legal recognition",
        key: "years-to-recognition",
        label: "Years to legal recognition",
        max: 40,
        min: 5,
        slope: -0.88,
        suffix: " yrs",
        tone: "amber",
      },
      {
        base: 10,
        description: "Probability that a legislative majority is achievable within a single parliamentary term",
        key: "legislative-majority",
        label: "Legislative majority probability",
        max: 82,
        min: 10,
        slope: 1.8,
        suffix: "%",
        tone: "emerald",
      },
      {
        base: 85,
        description: "Intensity of organised opposition at the moment of legal recognition",
        key: "backlash",
        label: "Backlash intensity",
        max: 85,
        min: 20,
        slope: -1.63,
        suffix: "/100",
        tone: "rose",
      },
    ],
    prompt: "Adjust cross-group support to see how coalition breadth determines the speed and durability of rights expansion.",
    sliderLabel: "Active cross-group coalition support",
    step: 2,
    title: "Coalition breadth and the speed of rights expansion",
    unit: "%",
    valueMax: 40,
    valueMin: 0,
  },
    realWorldExamples: [
      {
        insight:
          "The U.S. civil rights movement linked courtroom strategy, churches, student action, boycotts, and media-visible confrontation to force the gap between constitutional ideals and segregation into the open.",
        outcome:
          "Turning points such as Brown, Montgomery, Birmingham, and Selma helped produce the Civil Rights Act of 1964 and Voting Rights Act of 1965, while also reshaping the political agenda far beyond the South.",
        title: "Civil rights and the contradiction of democracy",
      },
      {
        insight:
          "The anti-apartheid struggle showed that rights-based movements can operate both inside and outside a country, combining domestic resistance with boycotts, sanctions, and international legitimacy pressure.",
        outcome:
          "Global solidarity campaigns helped isolate the apartheid regime and contributed to the negotiated transition that led to multiracial democracy in South Africa.",
        title: "Anti-apartheid and international legitimacy",
      },
      {
        insight:
          "Disability rights activism demonstrated that citizenship expansion is not only about ballots and desegregation, but also about access, design, and everyday participation in public life.",
        outcome:
          "Actions such as the 504 sit-ins helped push accessibility and anti-discrimination into law, culminating in major reforms like the Americans with Disabilities Act.",
        title: "Disability rights and access as citizenship",
      },
    ],
    evidenceLinks: [owidEvidenceLinks.humanRights, owidEvidenceLinks.womenRights],
    relatedFrameworks: [
      "Civil disobedience",
      "Rights claiming",
      "Coalition politics",
      "Legal mobilization",
      "Media framing",
    ],
    simulationPrompt:
      "Compare a rights-based movement with strong coalition breadth, visible repression, and legal strategy against one with outrage but little institutional follow-through.",
    simulatorSlug: "social-movements",
    simpleExplanation: [
      "Rights-based movements usually emerge inside societies that already claim some version of universal equality, citizenship, or dignity but fail to apply it in practice. Their power comes from making that contradiction visible and politically costly.",
      "That is why tactics like boycotts, sit-ins, school strikes, freedom rides, occupation of public offices, or mass marches can matter so much. They are not only appeals for sympathy. They interrupt ordinary life and force institutions to choose whether to reform or to reveal their coercive core publicly.",
      "These movements are often most successful when moral pressure is connected to law. Lawyers, churches, unions, students, journalists, and families all play different roles. Protest creates urgency; legal and administrative strategies make the gain harder to reverse.",
      "Their turning points are memorable because they change both policy and political imagination. A society that once treated exclusion as normal begins to see it as intolerable, even if backlash and incomplete enforcement remain after the first victories.",
    ],
    slug: "how-rights-based-movements-expand-citizenship",
    systemBug: {
      signals: [
        "States proclaim equal rights while designing institutions that still exclude whole groups from safety, access, voting, or dignity.",
        "Later generations remember the legal act but forget the organizing, sacrifice, and backlash that made it necessary.",
        "Formal equality is mistaken for practical equality even when budgets, policing, or built environments keep exclusion alive.",
      ],
      summary:
        "The underlying bug is hypocrisy embedded in institutions. When a system promises universal membership but distributes real power and protection unequally, rights-based movements arise to force the promise into practice.",
      title: "System bug: universal ideals with unequal citizenship",
    },
  proposals: [
    {
      title: "Enshrine positive economic and social rights in constitutions",
      summary: "Most Western constitutions protect freedoms from state interference but not rights to housing, healthcare, or education. Constitutionalising economic and social rights creates a judicial backstop against the worst deprivations and shifts political debate.",
      actor: "national_gov",
      domain: "legal",
      feasibility: "contested",
      precedents: [
        { place: "South Africa", year: 1996, outcome: "Constitution includes rights to housing, healthcare, food, and water; Constitutional Court enforced them in the Grootboom case" },
        { place: "Finland", year: 1999, outcome: "Constitutional reform included right to basic subsistence; courts have used it to strike down cuts to minimum income" },
      ],
    },
    {
      title: "Use proportional representation to ensure marginalised groups can translate mobilisation into seats",
      summary: "Under winner-take-all systems, even large minorities can be systematically excluded. Proportional systems naturally translate demographic diversity in the electorate into diversity in parliament.",
      actor: "national_gov",
      domain: "political",
      feasibility: "proven",
      precedents: [
        { place: "Rwanda", year: 2003, outcome: "Constitution reserved 30% of parliamentary seats for women; Rwanda now has highest share of women in parliament globally at 61%" },
        { place: "New Zealand", year: 1996, outcome: "MMP introduction correlated with significant increases in Maori, Pacific Islander, and women MPs" },
      ],
    },
  ],

  };
