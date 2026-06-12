import type { LearningModule } from "./_types";
import { owidEvidenceLinks } from "./_shared";

export const lessonData: LearningModule = {
    betterMetrics: [
      {
        description:
          "How sharply communication costs drop when a new medium lets people witness, copy, or coordinate more cheaply than before.",
        label: "Coordination cost shock",
      },
      {
        description:
          "Whether movements build durable organizations that survive after the first march, boycott, strike, or viral spike.",
        label: "Organizational persistence",
      },
      {
        description:
          "How often a movement turns repression or crisis into a legitimacy problem for the existing order rather than being crushed quietly.",
        label: "Legitimacy reversal rate",
      },
      {
        description:
          "Whether new rights or institutions actually outlast the founding protest moment.",
        label: "Durable outcome rate",
      },
    ],
    betterMetricsTitle: "Signals that reveal why one movement changes history and another stalls",
    counterArguments: [
      {
        point:
          "History just moves in a progressive direction, so successful movements mostly arrive when society is ready.",
        response:
          "Timing matters, but readiness is often created rather than discovered. Movements change what people can see, say, coordinate, and demand. That is why similar grievances can produce very different outcomes in different periods.",
        title: "Society was simply ready",
      },
      {
        point:
          "Great leaders are the main reason movements succeed, so broad structural comparisons miss the point.",
        response:
          "Leadership matters, but leaders operate inside structures: communication tools, coalition networks, repression levels, elite splits, and policy openings. A timeline helps show how similar mechanisms recur across very different personalities.",
        title: "It was all about leaders",
      },
      {
        point:
          "Every movement is unique, so grouping them by family hides too much complexity.",
        response:
          "No grouping can capture every detail, but comparison is still useful. It helps explain why some movements scale, why others fragment, and why turning points often appear when technology, grievance, and institutional weakness line up together.",
        title: "Comparison oversimplifies history",
      },
    ],
    causalLoop: {
      description:
        "Across centuries, social movements recur when grievance meets a new way to coordinate, enough organization to persist, and some opening in the dominant order. Turning points happen when repression backfires into a legitimacy crisis and institutions are forced to adapt.",
      edges: [
        { from: "grievance", label: "creates demand for", polarity: "positive", to: "newFrame" },
        { from: "newMedia", label: "lowers cost of", polarity: "positive", to: "newFrame" },
        { from: "newFrame", label: "recruits", polarity: "positive", to: "organization" },
        { from: "organization", label: "coordinates", polarity: "positive", to: "collectiveAction" },
        { from: "collectiveAction", label: "provokes", polarity: "positive", to: "repression" },
        { from: "repression", label: "can deepen", polarity: "positive", to: "legitimacyCrisis" },
        { from: "eliteSplits", label: "amplify", polarity: "positive", to: "legitimacyCrisis" },
        { from: "legitimacyCrisis", label: "forces", polarity: "positive", to: "institutionalChange" },
        { from: "institutionalChange", label: "reshapes", polarity: "positive", to: "citizenshipAndPower" },
        { from: "citizenshipAndPower", label: "changes future", polarity: "positive", to: "grievance" },
        { from: "weakOrganization", label: "reduces", polarity: "negative", to: "collectiveAction" },
        { from: "organization", label: "reduces", polarity: "negative", to: "weakOrganization" },
      ],
      loops: [
        "Reinforcing: grievance -> frame -> organization -> action -> legitimacy crisis -> institutional change -> new political expectations",
        "Balancing: when organizations stay weak, even strong outrage can dissipate before it becomes durable reform",
      ],
      nodes: [
        { id: "grievance", label: "Shared grievance", tone: "rose", x: 80, y: 90 },
        { id: "newMedia", label: "Communication shift", tone: "cyan", x: 280, y: 40 },
        { id: "newFrame", label: "Shared movement frame", tone: "amber", x: 500, y: 100 },
        { id: "organization", label: "Durable organization", tone: "emerald", x: 500, y: 280 },
        { id: "collectiveAction", label: "Collective action", tone: "emerald", x: 280, y: 330 },
        { id: "repression", label: "Repression", tone: "rose", x: 80, y: 300 },
        { id: "legitimacyCrisis", label: "Legitimacy crisis", tone: "amber", x: 80, y: 170 },
        { id: "institutionalChange", label: "Institutional change", tone: "cyan", x: 280, y: 500 },
        { id: "citizenshipAndPower", label: "New citizenship and power", tone: "emerald", x: 500, y: 440 },
        { id: "eliteSplits", label: "Elite splits", tone: "cyan", x: 80, y: 500 },
        { id: "weakOrganization", label: "Weak organization", tone: "rose", x: 500, y: 20 },
      ],
      title: "The long arc of movement change",
    },
    discussionPrompt:
      "Looking across the full timeline, which mattered most to historic breakthroughs: the grievance itself, the communication technology of the time, organizational depth, or splits inside the existing order?",
    heroHighlights: [
      "Movements usually become historic turning points when grievance, communication, organization, and institutional weakness align.",
      "New media do not replace organization, but they often decide how fast a movement can scale.",
      "The same broad logic appears from pamphlet politics to digital witness, even though the tools change dramatically.",
    ],
    miniLesson: {
    bands: [
      {
        threshold: 0,
        insight:
          "A movement that disperses within 12 months rarely achieves structural change. Elites can simply wait. Without sustained pressure across multiple political cycles, concessions made under immediate stress are typically reversed.",
      },
      {
        threshold: 3,
        insight:
          "At 3–4 years, a movement begins to establish institutional memory, leadership pipelines, and tactical learning. It can outlast individual governments and survive the co-option of its first-generation leaders.",
      },
      {
        threshold: 8,
        insight:
          "At 8–10 years of sustained pressure, movements have typically outlasted initial suppression attempts and entered a consolidation phase — building legal infrastructure, political alliances, and an electoral base. This is when structural concessions become more likely.",
      },
      {
        threshold: 15,
        insight:
          "At 15–20 years, the movements that survive are often transforming institutions from within — their demands have been partially absorbed, their leaders have entered formal politics, and the framing of the issue has permanently shifted. This is when cultural change becomes self-sustaining.",
      },
    ],
    defaultValue: 8,
    description:
      "Duration of sustained pressure is one of the strongest predictors of whether a movement achieves structural — rather than symbolic — change. But longer campaigns also accumulate internal contradictions. Adjust the slider to explore the relationship.",
    highLabel: "20 years",
    lowLabel: "1 year",
    metrics: [
      {
        base: 8,
        description: "Probability that the movement achieves formal institutional change (legislation, court ruling, constitutional amendment)",
        key: "institutional-change",
        label: "Institutional change probability",
        max: 87,
        min: 8,
        slope: 4.16,
        suffix: "%",
        tone: "emerald",
      },
      {
        base: 10,
        description: "Probability that elites offer substantive concessions before the movement reaches its stated goal",
        key: "elite-concession",
        label: "Elite concession probability",
        max: 73,
        min: 10,
        slope: 3.32,
        suffix: "%",
        tone: "cyan",
      },
      {
        base: 15,
        description: "Probability that the movement splits into factions before fully achieving its goal",
        key: "fragmentation-risk",
        label: "Fragmentation risk",
        max: 75,
        min: 15,
        slope: 3.16,
        suffix: "%",
        tone: "rose",
      },
    ],
    prompt: "Adjust the duration of sustained pressure to see how time affects the probability of structural change — and fragmentation.",
    sliderLabel: "Years of sustained pressure",
    step: 1,
    title: "Duration of pressure and structural change",
    unit: " yrs",
    valueMax: 20,
    valueMin: 1,
  },
    realWorldExamples: [
      {
        insight:
          "The Reformation and abolition campaigns show that falling communication costs can turn scattered grievance into a moral public capable of pressuring institutions.",
        outcome:
          "Pamphlets, translated texts, petitions, and testimony helped create a modern expectation that public argument can reshape authority.",
        title: "Print turns grievance into a public",
      },
      {
        insight:
          "Chartists, labor organizers, suffragists, and anti-colonial parties reveal that mass membership and repeated organization matter more than one successful protest.",
        outcome:
          "Rights and independence usually arrived after long cycles of organization, disruption, negotiation, repression, and return.",
        title: "Organization outlasts the event",
      },
      {
        insight:
          "Civil rights, disability rights, #MeToo, Black Lives Matter, and youth climate mobilization show that visible contradiction and witness can rapidly shift public legitimacy.",
        outcome:
          "Modern movements can change language and agendas very quickly, but durable outcomes still depend on institutional follow-through.",
        title: "Witness creates pressure, but institutions still decide durability",
      },
    ],
    evidenceLinks: [
      owidEvidenceLinks.humanRights,
      owidEvidenceLinks.womenRights,
      owidEvidenceLinks.globalEducation,
      owidEvidenceLinks.internet,
    ],
    relatedFrameworks: [
      "Political opportunity structures",
      "Resource mobilization",
      "Media shifts and public spheres",
      "Legitimacy crises",
      "Movement cycles",
    ],
    simulationPrompt:
      "Compare two movement families side by side and test how communication tools, coalition depth, repression, elite splits, and institutional openness determine whether one breaks through while the other stalls.",
    simulatorSlug: "social-movements",
    simpleExplanation: [
      "Social movements look very different on the surface, but across history many of them succeed through a recurring set of mechanisms. People experience a shared grievance, find a way to frame it publicly, build organizations around it, and then force institutions to respond.",
      "What changes over time is the coordination technology. In one era it is pamphlets, sermons, and petitions. In another it is railways, telegraphs, and mass newspapers. Later it becomes television, and today it often begins with phones, platforms, and viral witness. The tool changes, but the organizational question never disappears.",
      "This is why a timeline is useful. It shows that turning points usually happen when movements become harder to isolate. Repression becomes visible, elites split, or the governing order becomes too weak or too illegitimate to preserve the old arrangement at an acceptable cost.",
      "The outcome is not always immediate justice. Some victories create new exclusions, and some movements win recognition faster than they win material change. But over the long run, these movement waves repeatedly redraw who counts, who speaks, and what institutions must answer for.",
    ],
    slug: "how-social-movements-reshape-history",
    timeline: {
      intro:
        "This timeline is not a list of famous protests. It is a map of recurring movement mechanics across time: what triggered mobilization, what tools helped scale it, where the turning point appeared, and what long-run outcomes followed.",
      title: "From pamphlets to platforms: thirteen turning points in movement history",
      events: [
        {
          characteristics: ["cheap print", "vernacular texts", "elite shelter", "doctrinal dispute"],
          family: "Protestant Reformation — print-era religious revolt",
          outcome:
            "Church authority over doctrine, education, and political legitimacy fractured permanently, widening the public sphere and establishing that printed argument could challenge institutional monopolies.",
          timeLabel: "1517–1648",
          title: "Luther's pamphlets: print breaks the monopoly on doctrine",
          turningPoint:
            "Martin Luther's 95 Theses spread across Germany in weeks via the printing press — faster than any authority could suppress them. Sympathetic princes provided shelter, turning a theological dispute into a continental power struggle.",
          whyItStarted:
            "Corruption inside the Catholic Church, resentment of indulgences and clerical wealth, rising urban literacy, and the printing press all converged. When Luther nailed his theses in 1517, he had a tool — cheap reproduction — that previous reformers like Hus and Wycliffe lacked.",
        },
        {
          characteristics: ["colonial taxation without representation", "merchant boycotts", "pamphlet networks", "armed insurrection", "foreign alliance"],
          family: "American Revolution — colonial print-era uprising",
          outcome:
            "The thirteen colonies became the United States, establishing a constitutional republic with separation of powers. The revolution also produced influential political texts — the Declaration of Independence, the Federalist Papers — that shaped democratic thinking worldwide.",
          timeLabel: "1775–1783",
          title: "American Revolution: taxation, pamphlets, and a new republic",
          turningPoint:
            "Thomas Paine's Common Sense (1776) framed independence not as rebellion but as common sense, swinging colonial opinion decisively. The Franco-American alliance after Saratoga (1777) made continued British rule militarily untenable.",
          whyItStarted:
            "British Parliament levied taxes on colonies that had no parliamentary representation. Merchant elites, lawyers, and artisans organized boycotts through Committees of Correspondence, while pamphlets spread Enlightenment arguments about natural rights. Elite splits within Britain — with figures like Burke sympathizing with colonists — weakened the imperial response.",
        },
        {
          characteristics: ["bread riots", "elite collapse", "Enlightenment ideas", "urban crowd", "radical phases"],
          family: "French Revolution — urban insurrection and elite implosion",
          outcome:
            "The ancien régime was dismantled: feudal privileges abolished, the Declaration of the Rights of Man proclaimed, and eventually the monarchy abolished. France's revolutionary upheaval reverberated across Europe, triggering both liberal reform movements and conservative counter-revolutions for a century.",
          timeLabel: "1789–1799",
          title: "French Revolution: when elite collapse and bread crisis ignite a republic",
          turningPoint:
            "The storming of the Bastille on 14 July 1789 was as much symbol as strategy — it showed the king's troops would not reliably fire on Parisian crowds. When the National Assembly refused to disband and the king was forced to accept it, the political order had already broken.",
          whyItStarted:
            "France was financially bankrupt from war debts (including funding the American Revolution), harvests had failed causing bread prices to spike, and Enlightenment ideas about popular sovereignty had delegitimized hereditary absolutism among educated elites. When Louis XVI convened the Estates-General to raise taxes, the Third Estate seized the moment to demand constitutional change.",
        },
        {
          characteristics: ["petitions", "printed testimony", "consumer boycotts", "transatlantic networks"],
          family: "Atlantic abolitionism — moral public campaign",
          outcome:
            "Britain abolished the slave trade in 1807 and slavery across its empire in 1833. Abolitionism established the model of mass moral campaigning — petitions, boycotts, and testimony — that subsequent reform movements would repeatedly copy.",
          timeLabel: "1787–1833",
          title: "Abolition: turning enslaved testimony into legislative pressure",
          turningPoint:
            "The 1792 petition to Parliament gathered 400,000 signatures — the largest in British history to that date. Printed accounts of the Middle Passage by formerly enslaved people like Olaudah Equiano made the slave trade impossible to treat as a distant abstraction.",
          whyItStarted:
            "Religious dissent (Quakers, evangelical Anglicans), Black testimony, and Enlightenment natural-rights arguments converged with the organizational infrastructure of the Society for Effecting the Abolition of the Slave Trade (1787). Sugar boycotts showed that consumer action could translate moral conviction into economic pressure.",
        },
        {
          characteristics: ["factories", "trade unions", "dues", "mass newspapers", "strike leverage"],
          family: "Industrial labour and suffrage movements",
          outcome:
            "Mass membership politics became normal. Over decades these movements contributed to wider male and female suffrage, union recognition, the eight-hour working day, and welfare state foundations across Western Europe and North America.",
          timeLabel: "1838–1918",
          title: "Industrial mass movements: strikes, petitions, and the vote",
          turningPoint:
            "Britain's 1842 general strike — involving over 500,000 workers across dozens of trades — demonstrated that organized labour could threaten production at a national scale. Suffragette militancy (window-smashing, hunger strikes, arson) forced parliamentarians to weigh the cost of continued exclusion.",
          whyItStarted:
            "Industrial concentration packed workers into factories and cities, creating shared conditions and shared grievance. Railways and telegraphs made national coordination possible. Mass newspapers gave movements cheap publicity. Dues-paying union membership created financial staying power no earlier movement had.",
        },
        {
          characteristics: ["war exhaustion", "soldiers' soviets", "industrial strikes", "elite collapse", "party vanguard"],
          family: "Russian Revolution — industrial insurrection and state collapse",
          outcome:
            "The Romanov dynasty fell in February 1917; the Bolsheviks seized power in October. The Soviet state that followed shaped the geopolitics of the entire twentieth century — and provided a reference point, positive and negative, for every subsequent mass movement.",
          timeLabel: "1905–1917",
          title: "Russian Revolution: when war exhaustion collapses a regime from within",
          turningPoint:
            "By October 1917 the Provisional Government had failed to end the war or redistribute land. Soldiers deserted en masse, soviets (workers' councils) controlled key infrastructure, and the Bolsheviks — alone among factions — promised 'Peace, Land, Bread.' The regime had lost coercive capacity before the insurrection began.",
          whyItStarted:
            "Three years of catastrophic World War I losses (over 1.7 million Russian dead by 1917), food shortages in cities, and a tsar who combined autocracy with military incompetence had produced a legitimacy vacuum. The 1905 revolution had already shown the regime's fragility; factory councils and socialist parties provided the organizational skeleton that 1917 filled.",
        },
        {
          characteristics: ["nonviolent discipline", "mass civil disobedience", "salt", "spinning wheel", "international press"],
          family: "Gandhi & Indian independence — nonviolent anti-colonial campaign",
          outcome:
            "Britain granted Indian independence in 1947. Gandhi's satyagraha (truth-force) demonstrated that disciplined nonviolent mass action could be strategically superior to armed revolt against a colonial power dependent on international legitimacy — a lesson that directly influenced the US civil rights movement and dozens of later campaigns.",
          timeLabel: "1919–1947",
          title: "Gandhi's Salt March: nonviolence as strategic weapon against empire",
          turningPoint:
            "The 1930 Salt March — 240 miles to the sea to make salt illegally — was chosen precisely because it was impossible to justify arresting people for collecting salt. International press coverage of British officers beating nonresisting marchers destroyed imperial legitimacy faster than any armed attack could have.",
          whyItStarted:
            "The 1919 Amritsar Massacre (British troops killing 379 unarmed Indians) crystallized anti-colonial grievance. Gandhi had developed satyagraha in South Africa; returning to India he built the Indian National Congress into a mass organization capable of coordinating nationwide civil disobedience. The spinning wheel symbolized economic self-reliance — refusing British cloth was both protest and programme.",
        },
        {
          characteristics: ["national liberation parties", "post-war imperial weakness", "self-determination", "Cold War leverage", "armed and unarmed tactics"],
          family: "Anti-colonial liberation waves — empire loses legitimacy",
          outcome:
            "Between 1945 and 1975 over fifty new states were created as European empires retreated from Asia, Africa, and the Caribbean. Many inherited colonial borders, debt structures, and fragile institutions, generating their own waves of subsequent conflict and movement.",
          timeLabel: "1945–1975",
          title: "Decolonisation: empire loses legitimacy faster than it can adapt",
          turningPoint:
            "War exhaustion drained Britain and France of the capacity and will to hold vast overseas territories by force. The 1956 Suez Crisis exposed British imperial overreach to global ridicule; France's defeat in Dien Bien Phu (1954) and the Algerian war showed that colonial armies could not indefinitely suppress popular national movements.",
          whyItStarted:
            "Colonial extraction, racial hierarchy, and the contradiction between Allied wartime rhetoric about freedom and continued colonial rule radicalized educated local organizers. The Cold War created space: both superpowers, for different reasons, opposed European colonial empires, giving liberation movements diplomatic leverage.",
        },
        {
          characteristics: ["nonviolent disruption", "television", "legal strategy", "church networks", "sit-ins", "freedom rides"],
          family: "US Civil Rights Movement — visible contradiction forces law",
          outcome:
            "The Civil Rights Act (1964) and Voting Rights Act (1965) dismantled legal segregation in the United States and established a legal template for anti-discrimination law worldwide. The movement also changed the normative baseline — what exclusion now requires justification — permanently.",
          timeLabel: "1955–1968",
          title: "Civil Rights: television turns repression into a legitimacy crisis",
          turningPoint:
            "The 1963 Birmingham campaign was designed to provoke Sheriff Bull Connor into using fire hoses and police dogs in front of television cameras. It worked. Images of children being beaten by state forces made segregation internationally indefensible and forced the Kennedy administration to propose civil rights legislation.",
          whyItStarted:
            "Legal segregation, disenfranchisement, and racial violence persisted in the American South despite constitutional equal-protection guarantees. The 1955 Montgomery Bus Boycott — triggered by Rosa Parks' arrest — demonstrated that Black economic power (bus fares) could be wielded collectively. Church networks provided organizational infrastructure, and television created a national audience for repression.",
        },
        {
          characteristics: ["student revolt", "factory strikes", "cultural rebellion", "generational rupture", "no central leadership"],
          family: "May 1968, France — when students and workers briefly converge",
          outcome:
            "De Gaulle survived by calling elections, which he won. But May '68 permanently changed French (and Western) cultural politics: it accelerated secularisation, feminism, and sexual liberation, and established that cultural authority — not just economic power — could be a site of collective challenge.",
          timeLabel: "May 1968",
          title: "May '68: student revolt meets general strike — and falls short of revolution",
          turningPoint:
            "When Paris students' barricades on the Left Bank triggered a spontaneous general strike of ten million workers, France seemed on the edge of revolution. But no unified political leadership existed to convert the energy into institutional power, and de Gaulle's promise of elections gave moderates an off-ramp. The movement dissolved as quickly as it had assembled.",
          whyItStarted:
            "A generational revolt against authoritarian universities collided with long-standing industrial grievances. France's post-war economic boom had created a large student population and a restless industrial working class, both chafing against Gaullist paternalism. Global context mattered: US civil rights, anti-Vietnam protests, and Prague Spring all signalled that the existing order was contested everywhere.",
        },
        {
          characteristics: ["student-led", "hunger strikes", "Goddess of Democracy", "no elite splits", "closed institutions", "violent repression"],
          family: "Tiananmen Square — when the turning point never comes",
          outcome:
            "Military crackdown on 3–4 June 1989 killed hundreds to thousands. The protest left no institutional change inside China, but its international images — especially the 'Tank Man' photograph — became enduring symbols of nonviolent resistance against authoritarian power, and shaped how subsequent movements thought about repression and witness.",
          timeLabel: "April–June 1989",
          title: "Tiananmen Square: a movement that reached the turning point but found no crack",
          turningPoint:
            "There was no turning point — that is the lesson. The movement had massive grievance, genuine public sympathy, and global media attention. What it lacked was elite splits: the hardliners in the Politburo Standing Committee (led by Li Peng) prevailed over reformers (Zhao Ziyang), and the military remained loyal. Without an internal crack in the regime, pressure had nowhere to go.",
          whyItStarted:
            "The death of reformist General Secretary Hu Yaobang in April 1989 gave students a pretext to gather in Tiananmen Square to mourn publicly — mourning was politically safer than protest. Underlying grievances were inflation, corruption, and the contradiction between China's economic opening and persistent one-party rule. Mikhail Gorbachev's May visit brought international press already in position to cover events.",
        },
        {
          characteristics: ["leaderless", "smartphones", "social media coordination", "horizontal structure", "occupation tactic", "thin organization"],
          family: "Arab Spring & Occupy Wall Street — platform surge meets institutional wall",
          outcome:
            "Egypt's Mubarak fell within 18 days; Tunisia's Ben Ali fled after 28. But durable democratic change proved elusive: Egypt returned to military rule by 2013, Syria descended into civil war. Occupy set inequality firmly on the political agenda ('the 1%') but won no legislation. The movements revealed both the speed of networked mobilisation and its organizational limits.",
          timeLabel: "2010–2012",
          title: "Arab Spring & Occupy: fast mobilisation, slow institutionalisation",
          turningPoint:
            "In Egypt, the moment Mubarak's interior minister announced a curfew and crowds ignored it, the regime's coercive credibility collapsed. But the same horizontal network that brought millions to Tahrir Square had no structure to navigate electoral politics afterward. In Occupy, the 'mic check' general assembly model was inclusive but could not produce durable demands or leadership.",
          whyItStarted:
            "Mohamed Bouazizi's self-immolation in Tunisia (December 2010) ignited grievances — unemployment, corruption, authoritarian humiliation — already at flashpoint across the Arab world. In the US, the 2008 financial crisis had created deep anger about bank bailouts and rising inequality. Facebook and Twitter made coordination nearly frictionless; smartphones made witness immediate. But coordination is not the same as organisation.",
        },
        {
          characteristics: ["hashtag viral witness", "decentralised", "fast agenda-setting", "uneven institutionalisation", "platform dependency"],
          family: "Networked digital movements — #MeToo, BLM, Fridays for Future",
          outcome:
            "Agenda-setting accelerated dramatically: workplace abuse (#MeToo, 2017), police violence (#BlackLivesMatter, 2013–present), and climate urgency (#FridaysForFuture, 2018) became global issues within days. Durable reform proved uneven — legislative and institutional change required sustained organizational effort beyond the initial viral moment.",
          timeLabel: "2013–today",
          title: "Platforms make witness immediate but durability still depends on organisation",
          turningPoint:
            "The first viral proof or shared hashtag turns isolated experience into a collective public almost instantaneously. But each movement's durability diverged based on whether it built lasting organisations: the Movement for Black Lives developed a policy platform and local chapters; #MeToo produced concrete legal reforms in some jurisdictions; Fridays for Future struggled to translate school strikes into legislative traction.",
          whyItStarted:
            "Smartphones gave everyone a witness device; social platforms gave everyone a distribution channel. The result was that experiences previously too diffuse or stigmatised to organise around — sexual harassment, everyday racism, climate anxiety — could suddenly find each other at scale. The cost of the first moment of visibility dropped to near zero; the cost of sustained organisation did not.",
        },
      ],
    },
    systemBug: {
      signals: [
        "People remember iconic moments but forget the communication systems and organizations that made them scalable.",
        "Histories of progress often skip the fact that many rights were won only after repression started damaging the regime more than concession would.",
        "Modern attention cycles make it easy to overestimate fast visibility and underestimate slow institution-building.",
      ],
      summary:
        "The repeating bug is unequal access to voice, organization, and institutional leverage. Social movements arise whenever a system blocks participation strongly enough that people must build alternative channels to be heard and counted.",
      title: "System bug: blocked participation creates recurring movement waves",
    },
  proposals: [
    {
      title: "Lower barriers to ballot initiatives and citizens referenda at national level",
      summary: "Social movements build mass legitimacy but often cannot translate it into law through captured legislatures. Citizens initiative mechanisms allowing a threshold of signatures to trigger a binding referendum give organised movements a direct legislative path.",
      actor: "national_gov",
      domain: "political",
      feasibility: "proven",
      precedents: [
        { place: "Switzerland", year: 1891, outcome: "Federal popular initiative mechanism; hundreds of successful initiatives including environmental protections and workers rights" },
        { place: "Ireland", year: 2015, outcome: "Marriage equality referendum followed years of LGBTQ+ movement organising; passed 62% — first country to legalise by popular vote" },
      ],
    },
    {
      title: "Legally protect the right to strike and peaceful assembly in all workplaces",
      summary: "Movements lose power when collective action is criminalised. Robust legal protection for strikes, boycotts, and peaceful public assembly — including from civil liability — preserves the tools through which organised labour and social movements operate.",
      actor: "national_gov",
      domain: "legal",
      feasibility: "contested",
      precedents: [
        { place: "South Africa", year: 1995, outcome: "Labour Relations Act gave broad strike protections; post-apartheid union movement became one of the most powerful in Africa" },
        { place: "ILO Convention 87", year: 1948, outcome: "Ratified by 156 countries; establishes freedom of association and right to organise as universal labour standards" },
      ],
    },
    {
      title: "Fund civic infrastructure: community organisations, legal aid, organising schools",
      summary: "Movements are sustained by unglamorous infrastructure — organisers, legal defence, training. Public funding for civic infrastructure with genuine independence from government reduces the resource gap between organised money and organised people.",
      actor: "national_gov",
      domain: "political",
      feasibility: "emerging",
      precedents: [
        { place: "Nordic countries", year: 1970, outcome: "Public funding for civil society organisations created civic infrastructure underpinning high union density and political participation" },
        { place: "Canada", year: 1981, outcome: "Court Challenges Programme funded equality rights litigation; enabled Charter challenges that would otherwise be unaffordable" },
      ],
    },
  ],

  };
