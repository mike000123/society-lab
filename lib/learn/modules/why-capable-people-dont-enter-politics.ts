import type { LearningModule } from "./_types";

export const lessonData: LearningModule = {
    betterMetrics: [
      {
        description: "The share of parliamentarians who are related to a previous elected official — a direct measure of how much hereditary advantage shapes access over merit.",
        label: "Political dynasty rate",
      },
      {
        description: "The ratio of private-sector executive pay to ministerial pay at equivalent responsibility levels. A large gap signals that capable candidates face a real opportunity cost.",
        label: "Public-private pay gap (executive level)",
      },
      {
        description: "The share of working-class citizens in the legislature relative to their share of the population. A ratio near zero signals systematic exclusion, not voter preference.",
        label: "Working class parliamentary representation ratio",
      },
      {
        description: "Whether party selection processes use open primaries, closed internal votes, or leader appointment — the mechanism matters more than the formal rules.",
        label: "Candidate selection openness",
      },
    ],
    betterMetricsTitle: "What to measure instead of just election turnout",
    counterArguments: [
      {
        point: "Voters are free to choose. If bad politicians keep getting elected, that reflects genuine voter preferences.",
        response: "This is the core confusion the module addresses. The barrier operates before the ballot — on who is allowed to stand, not who voters choose. In Greece in 2023, only 24.5% of eligible voters chose the governing party. The constraint is on the supply side, not demand.",
        title: "Voters get what they choose",
      },
      {
        point: "Political families have name recognition and voter trust built over generations — that is a legitimate competitive advantage.",
        response: "Name recognition is an advantage, but the Berkeley/Brown/ECLA study found that only years in office — not policy success or competence — predicted whether a relative got elected. The advantage operates through recognition and access, not performance.",
        title: "Political dynasties reflect earned trust",
      },
      {
        point: "Raising politician salaries would just reward people who were already going to enter politics — it will not attract a different kind of candidate.",
        response: "The international evidence is more specific: higher salaries increase the number of candidates competing for each seat, which raises average quality through competition. The relevant mechanism is not loyalty but selection pressure.",
        title: "Higher salaries just reward the same people more",
      },
    ],
    causalLoop: {
      description:
        "The Casel-Morelli cycle: parties that systematically select for loyalty over competence produce governments that use state resources to entrench incumbents, which makes the original selection bias worse in the next cycle.",
      edges: [
        { from: "party_selection", label: "filters out", polarity: "negative", to: "capable_pool" },
        { from: "capable_pool", label: "determines", polarity: "positive", to: "gov_quality" },
        { from: "gov_quality", label: "shapes", polarity: "positive", to: "institution_integrity" },
        { from: "institution_integrity", label: "constrains", polarity: "negative", to: "party_power" },
        { from: "party_power", label: "tightens", polarity: "positive", to: "party_selection" },
        { from: "gov_quality", label: "undermines", polarity: "negative", to: "citizen_wellbeing" },
        { from: "institution_integrity", label: "if low → enables", polarity: "negative", to: "clientelism" },
        { from: "clientelism", label: "reinforces", polarity: "positive", to: "party_power" },
      ],
      loops: [
        "Reinforcing (decay): party selects loyal over capable → lower quality government → weaker institutions → more party power over state resources → tighter selection → lower quality",
        "Balancing (slow): external shocks — quotas, crisis, international pressure — can interrupt the cycle if institutions are not yet fully captured",
      ],
      nodes: [
        { id: "party_selection",     label: "Party selection bias",      tone: "rose",    x: 300, y: 60 },
        { id: "capable_pool",        label: "Capable candidate pool",    tone: "amber",   x: 560, y: 160 },
        { id: "gov_quality",         label: "Government quality",        tone: "amber",   x: 560, y: 320 },
        { id: "institution_integrity", label: "Institutional integrity", tone: "cyan",    x: 360, y: 420 },
        { id: "party_power",         label: "Party control of state",    tone: "rose",    x: 80,  y: 320 },
        { id: "citizen_wellbeing",   label: "Citizen wellbeing",         tone: "emerald", x: 640, y: 440 },
        { id: "clientelism",         label: "Clientelism / patronage",   tone: "rose",    x: 120, y: 180 },
      ],
      title: "The Casel-Morelli decay cycle",
    },
    discussionPrompt:
      "If the barriers operate on who can stand rather than who voters choose, where should reform focus — party internal rules, electoral law, pay structures, or all three simultaneously?",
    heroHighlights: [
      "In Greece in 2023, 68% of the population is working class but only 2% of parliament came from that background — and even those were party-affiliated unionists, not working professionals.",
      "Every additional year a US Congress member serves roughly doubles the probability that a relative will win a future election — regardless of their policy record.",
      "Swedish evidence shows mandatory gender quotas raised average legislator quality not by adding women, but by removing the low-ability incumbent men who had been actively blocking capable challengers.",
    ],
    miniLesson: {
    bands: [
      {
        threshold: 0,
        insight:
          "At 30% pay parity, political office requires a severe personal income sacrifice. Only those with independent wealth, party machine support, or ideological commitment can afford to run — narrowing the effective candidate pool to a thin slice of the population.",
      },
      {
        threshold: 30,
        insight:
          "At 60% — roughly where US Congressional pay sits relative to comparable private-sector lawyers and executives — politics is accessible to dedicated professionals but still demands significant financial sacrifice. Incumbents from wealthy backgrounds face no equivalent cost.",
      },
      {
        threshold: 60,
        insight:
          "At 90% pay parity, the financial deterrent largely disappears. Primary gatekeeping, harassment risk, and media scrutiny remain, but the pool of people who can afford to serve expands substantially to include working-class and middle-class candidates.",
      },
      {
        threshold: 90,
        insight:
          "At 120% — competitive with private employment (approximately Finland or Denmark) — political office attracts a wider talent pool and reduces the wealth prerequisite for entry. Research shows corruption risk falls as officials are less dependent on supplementary income.",
      },
    ],
    defaultValue: 60,
    description:
      "When public-sector pay is a fraction of private-sector equivalents, political office is accessible mainly to the wealthy or party-sponsored. Adjust the public-to-private pay ratio to see how it shapes who can realistically enter politics.",
    highLabel: "120% (Nordic parity)",
    lowLabel: "30% (severe gap)",
    metrics: [
      {
        base: 1,
        description: "Share of legislators from manual, service, or low-income backgrounds",
        key: "working-class-share",
        label: "Working-class representation",
        max: 28,
        min: 1,
        slope: 0.27,
        suffix: "%",
        tone: "emerald",
      },
      {
        base: 75,
        description: "Risk index: officials underpaid relative to private sector are more likely to supplement income through improper means",
        key: "corruption-risk",
        label: "Corruption risk index",
        max: 75,
        min: 12,
        slope: -0.7,
        suffix: "/100",
        tone: "rose",
      },
      {
        base: 90,
        description: "Wealth percentile a candidate typically needs to be in to absorb the financial cost of running",
        key: "wealth-bar",
        label: "Minimum wealth percentile to run",
        max: 90,
        min: 50,
        slope: -0.44,
        suffix: "th",
        tone: "amber",
      },
    ],
    prompt: "Adjust the pay ratio to see how the financial barrier shapes the realistic candidate pool.",
    sliderLabel: "Public / private pay ratio",
    step: 5,
    title: "The pay gap and who can afford to serve",
    unit: "%",
    valueMax: 120,
    valueMin: 30,
  },
    realWorldExamples: [
      {
        insight:
          "Berkeley/Brown/ECLA researchers used two centuries of US data and found that only years served — not competence, not policy success, not voter satisfaction — predicted whether a Congress member\'s relative would subsequently win election. The mechanism was name recognition, donor network access, and party infrastructure, not merit inheritance.",
        outcome:
          "Political families remain structurally over-represented in US Congress relative to their population share, and the advantage compounds over generations regardless of legislative performance.",
        title: "US dynasty study: what predicts a relative winning",
      },
      {
        insight:
          "Patrikios and Xatzikonstandinou (Glasgow, 2015) coded biographic data on Greek MPs from 2000-2012 and found 1 in 5 New Democracy MPs and 1 in 10 PASOK MPs were relatives of previous MPs. Eight of ten post-junta prime ministers came from political dynasties.",
        outcome:
          "Greece\'s equivalent of an alternating hereditary monarchy in the executive: the same family networks rotated through government while the economy deteriorated. The correlation between dynasty dominance and institutional erosion was not coincidental.",
        title: "Greece: eight of ten prime ministers from political dynasties",
      },
      {
        insight:
          "When Sweden introduced mandatory gender quotas, parties were forced to recruit outside their existing networks. Research showed the largest measurable effect was not adding capable women — it was removing the low-ability male incumbents who had been actively blocking better candidates. The quota disrupted the Casel-Morelli selection loop.",
        outcome:
          "Average legislator quality by measurable indicators rose after quota introduction. The mechanism — exogenous disruption of the incumbent protection network — suggests the Casel-Morelli cycle is reversible if interrupted before full institutional capture.",
        title: "Sweden: how gender quotas accidentally improved overall legislator quality",
      },
    ],
    relatedFrameworks: [
      "Entry barriers (industrial organisation)",
      "Casel and Morelli — adverse selection in politics (LSE/Bocconi)",
      "Mancur Olson — logic of collective action",
      "Acemoglu and Robinson — institutions and development",
      "Downs — economic theory of democracy",
    ],
    simulationPrompt:
      "Adjust each entry barrier to see how the capable politician pool, public service quality, and citizen wellbeing respond — with and without the Casel-Morelli feedback spiral activating.",
    simulatorSlug: "political-talent",
    simpleExplanation: [
      "The question of whether we get the politicians we deserve assumes that bad outcomes result from bad voter choices. But the constraint operates on a different side of the system: who is permitted or able to stand for election in the first place. This is the economics of entry barriers applied to political markets.",
      "There are five main barriers. Political dynasties give incumbent families structural advantages in name recognition, fundraising, and party access that no amount of voter discernment can overcome. Party monopolies select for obedience and controllability rather than competence — party leaders prefer candidates who have no good alternatives outside politics, because those candidates are easier to manage. Low public-sector salaries relative to private-sector equivalents create a real opportunity cost for the most capable people with the widest career options. Class exclusion means the largest social group — working people — is nearly absent from legislatures despite no evidence that voters discriminate against them at the ballot box. Gender exclusion removes half the talent pool.",
      "These barriers compound. And according to Casel and Morelli, once the quality floor drops far enough, a feedback loop activates: low-quality politicians use state resources to entrench themselves, which makes the selection bias worse in the next cycle. The system does not produce bad politicians by accident — it produces them structurally. And understanding that changes what reform looks like: not asking voters to choose better, but changing who can enter the system at all.",
    ],
    slug: "why-capable-people-dont-enter-politics",
    systemBug: {
      signals: [
        "A high share of parliamentarians are relatives of previous elected officials.",
        "The largest social class in the country has near-zero representation in the legislature.",
        "Parties lose ideological coherence and shift to distributing state resources rather than competing on policy.",
        "Domestic scandals are exposed by foreign prosecutors rather than national institutions.",
        "Capable professionals in law, medicine, engineering, and business consistently avoid politics despite stated concern for public affairs.",
      ],
      summary:
        "Universal suffrage is a necessary but not sufficient condition for representative government. When entry barriers control who can stand, free elections can produce systematically unrepresentative outcomes without any voter choosing badly.",
      title: "System bug: free elections with controlled entry produce unrepresentative government",
    },
    timeline: {
      intro:
        "The intellectual history of the question — from philosophers who blamed the people to economists who identified the structural mechanism.",
      title: "From divine providence to entry barriers: the evolution of an idea",
      events: [
        {
          characteristics: [
            "Plato argued governments reflect the character of the people who produce them",
            "Aristotle added that the relationship is circular: the regime also shapes the people",
            "Both framed the question in moral and psychological terms, not structural ones",
          ],
          family: "Philosophical framing",
          outcome:
            "The moralistic framing — we get the government we deserve — dominated Western political thought for two millennia without producing tools for structural diagnosis.",
          timeLabel: "4th century BC",
          title: "Plato and Aristotle: governments reflect the people",
          turningPoint:
            "The circular insight — people produce regime, regime produces people — was correct but provided no mechanism for breaking the cycle.",
          whyItStarted:
            "Ancient Athens produced the first systematic attempts to explain why different cities had such different political characters.",
        },
        {
          characteristics: [
            "De Maistre claimed nations get the governments they deserve as a matter of divine providence",
            "Montesquieu matched specific civic virtues to specific regime types",
            "The Enlightenment framed the question as civic character, not structural design",
          ],
          family: "Enlightenment framing",
          outcome:
            "The moral responsibility frame — citizens are accountable for their governments — became the dominant popular understanding of democracy and remains so today.",
          timeLabel: "1748 – 1811",
          title: "Montesquieu to De Maistre: character determines government",
          turningPoint:
            "De Maistre\'s 1811 formulation — every nation gets the government it deserves — became the most quoted expression of the idea, cited ever since without its theological basis.",
          whyItStarted:
            "Post-revolutionary Europe needed frameworks for explaining why revolutionary governments so often degenerated, without blaming the institutional design.",
        },
        {
          characteristics: [
            "Adam Smith\'s invisible hand: individuals pursuing self-interest produce optimal collective outcomes",
            "Applied to politics: voters pursuing self-interest produce representative governments",
            "The analogy assumed free entry — the same assumption that Smith himself knew was violated in practice",
          ],
          family: "Economic analogy",
          outcome:
            "The invisible hand became the implicit model for democratic theory: free elections were treated as analogous to free markets, with voters as consumers and politicians as producers.",
          timeLabel: "1776",
          title: "Adam Smith\'s invisible hand — and its limits",
          turningPoint:
            "Smith himself documented economic oligarchies and political capture in book five of The Wealth of Nations, suggesting he knew the self-regulating model had exceptions. He never applied his doubts to the political analogy.",
          whyItStarted:
            "The Wealth of Nations provided the first systematic framework for understanding how decentralised choice could produce order — and the political application seemed natural.",
        },
        {
          characteristics: [
            "Entry barriers: structural features that prevent competitive markets from working, independent of freedom of choice",
            "Applied to politics: the constraint is on who can stand, not who voters choose",
            "Five political entry barriers identified: dynasties, party monopolies, salary gaps, class exclusion, gender exclusion",
          ],
          family: "Structural diagnosis",
          outcome:
            "The entry barrier framework shifts responsibility from voters to institutional design — and from the demand side of politics to the supply side.",
          timeLabel: "20th–21st century",
          title: "The entry barriers framework: supply-side politics",
          turningPoint:
            "Recognising that a perfectly free voting system can produce systematically unrepresentative outcomes if entry to the candidate pool is controlled — without any fraud or manipulation of the vote.",
          whyItStarted:
            "Industrial organisation economics developed entry barrier theory to explain why free markets sometimes produce persistent monopolies. Political scientists began applying the same logic to candidate selection.",
        },
        {
          characteristics: [
            "Parties that select for loyalty over competence lose capable candidates to private careers",
            "Lower quality government produces weaker institutions",
            "Weaker institutions give party networks more control over state resources",
            "More party power enables tighter control over candidate selection",
          ],
          family: "Feedback mechanism",
          outcome:
            "Countries that cross the clientelism threshold face a structurally self-reinforcing spiral. The same party networks that caused the problem gain the resources to perpetuate it.",
          timeLabel: "Casel & Morelli (LSE / Bocconi)",
          title: "The Casel-Morelli adverse selection cycle",
          turningPoint:
            "Adverse selection in political markets: bad candidates drive out good ones not through competition but through party control of the entry mechanism. Once patronage replaces policy competition, the equilibrium is stable and self-reinforcing.",
          whyItStarted:
            "Casel and Morelli formalised the observation that low-quality political systems seem to get worse over time even without external shocks — the selection mechanism itself produces the deterioration.",
        },
        {
          characteristics: [
            "Mandatory quotas forced parties outside their incumbent networks",
            "Parties recruited women with genuine professional qualifications rather than party pedigree",
            "The largest measurable effect was removing the low-ability men who had been blocking better candidates",
            "Average legislator quality rose",
          ],
          family: "Reform evidence",
          outcome:
            "Proof of concept that the Casel-Morelli cycle can be interrupted by exogenous shock to the selection mechanism — not necessarily through voter mobilisation but through changes to who is eligible to stand.",
          timeLabel: "Sweden — post-quota evidence",
          title: "Swedish gender quotas as unintended system reform",
          turningPoint:
            "The finding that the quality gain came from removing blocking incumbents rather than adding qualified women reframed quotas as an institutional reform tool, not just an equity measure.",
          whyItStarted:
            "Mandatory quotas were introduced primarily as a gender equity policy. The spillover effect on overall legislative quality was an empirical finding, not a design intention.",
        },
      ],
    },
  proposals: [
    {
      title: "Introduce open party primaries to reduce gatekeeping by party machines",
      summary: "Candidate selection by small party committees filters out anyone who does not fit the existing mould. Open primaries — where registered voters choose party candidates — widen the pool and reduce the power of factional insiders.",
      actor: "civil_society",
      domain: "political",
      feasibility: "proven",
      precedents: [
        { place: "California", year: 2010, outcome: "Top-two open primary reduced partisan extremism in safe seats; more moderate candidates won competitive general elections" },
        { place: "France", year: 2011, outcome: "Socialist Party open primary attracted 2.7m voters; selected candidate over party machine preference" },
      ],
    },
    {
      title: "Publicly fund independent candidate campaigns through small-donor matching",
      summary: "When campaign funding comes entirely from parties or wealthy donors, independents and challengers cannot compete. Public matching funds available to any candidate who collects small donations from a threshold of constituents democratise electoral entry.",
      actor: "national_gov",
      domain: "political",
      feasibility: "proven",
      precedents: [
        { place: "New York City", year: 1988, outcome: "6:1 matching funds for small donations; more diverse candidates; model adopted by 12+ US states" },
        { place: "Canada", year: 2004, outcome: "Per-vote public subsidy diversified candidate pools; reduced party dependence on large donors" },
      ],
    },
    {
      title: "Offer job-protected sabbaticals and return-to-career guarantees for public service",
      summary: "Many capable professionals refuse elected office because political careers are terminal. Guaranteed return rights to their field after one or two terms, plus salary continuity, remove a major structural barrier to entry.",
      actor: "national_gov",
      domain: "political",
      feasibility: "emerging",
      precedents: [
        { place: "France", year: 1984, outcome: "Right to reinstatement after elected mandate for civil servants; applied to 200,000+ public sector employees" },
        { place: "Nordic countries", year: 1970, outcome: "Strong employment protection for elected officials on leave; contributes to higher professional diversity in Nordic parliaments" },
      ],
    },
  ],

  };
