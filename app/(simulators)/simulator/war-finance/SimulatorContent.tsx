"use client";

import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CheckCircle2, ChevronLeft, ChevronRight, Circle, Menu, X } from "lucide-react";

import { AtlasPage } from "@/components/atlas/AtlasPage";
import { SimulatorCallout, SimulatorChartPanel, SimulatorHero } from "@/components/simulator/SimulatorAtlas";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ChartPoint {
  year: number;
  UK?: number;
  US?: number;
  France?: number;
}

interface Lesson {
  id: string;
  title: string;
  era: string | null;
  chartRange: [number, number];
  highlightYear: number | null;
  content: string | null;
  keyPoint?: string;
  tags: string[];
}

interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explain: string;
}

// ── Historical Debt Data (% of GDP) ───────────────────────────────────────────
const UK_RAW: { y: number; v: number }[] = [
  {y:1700,v:18},{y:1710,v:45},{y:1720,v:60},{y:1730,v:65},{y:1740,v:70},
  {y:1750,v:95},{y:1760,v:110},{y:1770,v:115},{y:1780,v:130},{y:1790,v:145},
  {y:1800,v:170},{y:1810,v:190},{y:1820,v:200},{y:1830,v:175},{y:1840,v:145},
  {y:1850,v:105},{y:1860,v:90},{y:1870,v:70},{y:1880,v:55},{y:1890,v:45},
  {y:1900,v:30},{y:1910,v:28},{y:1914,v:30},{y:1918,v:130},{y:1920,v:150},
  {y:1930,v:160},{y:1938,v:140},{y:1940,v:165},{y:1945,v:240},{y:1950,v:200},
  {y:1960,v:130},{y:1970,v:80},{y:1980,v:55},{y:1990,v:35},{y:2000,v:40},
  {y:2008,v:52},{y:2010,v:80},{y:2020,v:105},{y:2023,v:100},
];
const US_RAW: { y: number; v: number }[] = [
  {y:1790,v:30},{y:1800,v:12},{y:1810,v:8},{y:1815,v:14},{y:1820,v:10},
  {y:1830,v:2},{y:1840,v:2},{y:1850,v:2},{y:1860,v:2},{y:1865,v:32},
  {y:1870,v:28},{y:1880,v:18},{y:1890,v:10},{y:1900,v:7},{y:1910,v:5},
  {y:1916,v:5},{y:1919,v:33},{y:1920,v:29},{y:1930,v:18},{y:1933,v:42},
  {y:1938,v:44},{y:1940,v:50},{y:1945,v:119},{y:1950,v:94},{y:1960,v:56},
  {y:1970,v:37},{y:1980,v:33},{y:1990,v:56},{y:2000,v:55},{y:2008,v:68},
  {y:2010,v:91},{y:2020,v:127},{y:2023,v:123},
];
const FR_RAW: { y: number; v: number }[] = [
  {y:1700,v:40},{y:1720,v:50},{y:1740,v:55},{y:1760,v:65},{y:1770,v:75},
  {y:1780,v:100},{y:1789,v:120},{y:1800,v:60},{y:1810,v:55},{y:1815,v:55},
  {y:1820,v:50},{y:1830,v:45},{y:1840,v:45},{y:1850,v:55},{y:1860,v:55},
  {y:1870,v:55},{y:1880,v:70},{y:1890,v:65},{y:1900,v:70},{y:1910,v:70},
  {y:1914,v:72},{y:1918,v:155},{y:1920,v:170},{y:1925,v:140},{y:1930,v:110},
  {y:1938,v:95},{y:1940,v:100},{y:1944,v:160},{y:1950,v:75},{y:1960,v:45},
  {y:1970,v:20},{y:1980,v:21},{y:1990,v:35},{y:2000,v:58},{y:2008,v:68},
  {y:2010,v:83},{y:2020,v:115},{y:2023,v:110},
];

function buildChartData(): ChartPoint[] {
  const map: Record<number, ChartPoint> = {};
  UK_RAW.forEach(({ y, v }) => { if (!map[y]) map[y] = { year: y }; map[y].UK = v; });
  US_RAW.forEach(({ y, v }) => { if (!map[y]) map[y] = { year: y }; map[y].US = v; });
  FR_RAW.forEach(({ y, v }) => { if (!map[y]) map[y] = { year: y }; map[y].France = v; });
  return Object.values(map).sort((a, b) => a.year - b.year);
}
const ALL_CHART_DATA = buildChartData();

// ── Curriculum ────────────────────────────────────────────────────────────────
const LESSONS: Lesson[] = [
  {
    id: "intro",
    title: "When Crisis Becomes Catalyst",
    era: null,
    chartRange: [1700, 2023],
    highlightYear: null,
    content: `Throughout history, the most transformative financial institutions weren't invented by economists in peacetime. They were improvised by desperate governments trying to survive wars they couldn't afford.

The pattern repeats across six centuries: a crisis so severe that existing financial tools collapse, followed by an institutional innovation that outlasts the conflict by centuries.

This module traces eight such moments — from the lagoons of medieval Venice to the Bretton Woods conference of 1944. Each crisis left behind infrastructure we still use today.

The debt chart beside this text shows the signature of these moments: sharp spikes in government borrowing, followed by the gradual deleveraging that only became possible because a new institution existed to manage it.`,
    keyPoint: "Crisis is the mother of financial invention.",
    tags: ["Overview", "Methodology"],
  },
  {
    id: "venice",
    title: "Venice: The First Government Bond",
    era: "1171 AD",
    chartRange: [1700, 1760],
    highlightYear: null,
    content: `In 1171, Venice was at war with Byzantium. The war was expensive, the treasury empty, and the Doge needed money fast.

His solution was radical: a forced loan from wealthy citizens, repaid with interest from future tax revenues. These instruments — called prestiti — could be bought and sold between citizens. A market formed.

The prestiti became the world's first actively traded government securities. Venice's Great Council formalized the system through the Monte Vecchio in 1262, creating what we'd recognise as a sovereign debt market.

Why it mattered: The innovation separated "the state needs money now" from "citizens part with money now." The promise of future repayment — with interest — allowed Venice to mobilise private capital for public purposes. Every government bond issued today descends from this mechanism.

The market price of prestiti also became the first real-time indicator of public confidence in government solvency — a function that bond yields still serve today.`,
    keyPoint: "Forced war loans → tradeable debt instruments → sovereign bond markets.",
    tags: ["Venice", "Bonds", "1171"],
  },
  {
    id: "boe",
    title: "Nine Years' War: Birth of the Bank of England",
    era: "1694",
    chartRange: [1700, 1750],
    highlightYear: 1710,
    content: `By 1694, England was four years into the Nine Years' War against Louis XIV's France. King William III had exhausted conventional borrowing. Goldsmiths and private lenders charged extortionate rates; the Crown had defaulted before.

Scottish merchant William Paterson proposed a solution: a syndicate of private investors would lend £1.2 million to the Crown at 8% interest. In exchange, the syndicate received a royal charter to operate as a bank — the Bank of England.

The Bank could issue banknotes, take deposits, and crucially, manage the national debt. The government gained a permanent, reliable creditor. Investors gained an institution backed by the state's taxing power.

The UK debt chart shows what happened next: debt climbed steeply through the 18th century as Britain fought war after war — but it climbed in an orderly, manageable way. The Bank of England made large-scale sovereign borrowing a sustainable operation rather than a crisis each time.

The model — a private central bank with a public mandate — was copied by France (1800), the Netherlands, and ultimately the United States Federal Reserve (1913).`,
    keyPoint: "War debt + default risk → chartered central bank with debt management mandate.",
    tags: ["UK", "Central Bank", "1694"],
  },
  {
    id: "income_tax",
    title: "Napoleonic Wars: The Income Tax",
    era: "1799",
    chartRange: [1790, 1830],
    highlightYear: 1800,
    content: `By 1799, Britain's debt had reached 100% of GDP and was climbing. Fighting Napoleon was expensive — more expensive than any previous European war. Prime Minister William Pitt the Younger had a problem: the traditional revenue base (customs, excise, land taxes) was maxed out.

His response was the world's first modern income tax: a levy of 2 shillings per pound (10%) on incomes above £200 per year. It was meant to be temporary. It raised £6 million in its first year.

The tax was abolished in 1802 after the Peace of Amiens, with Parliament ordering the records burned. But when war resumed in 1803, it returned. After Napoleon's defeat in 1815, Parliament abolished it again. It returned permanently in 1842 — and has never left.

The income tax represented a fundamental shift: the state could now claim a direct, scalable share of economic output, not just transactions at borders or ownership of land. This made deficit spending sustainable in a new way: future income tax revenues could credibly back long-term borrowing.

The Napoleonic peak — UK debt reaching nearly 200% of GDP — is the highest pre-WWII level in the chart, and it was managed down precisely because income tax gave the state a growing revenue base.`,
    keyPoint: "Unsustainable war costs → direct taxation of income → permanent fiscal state.",
    tags: ["UK", "Income Tax", "Napoleon"],
  },
  {
    id: "civil_war",
    title: "US Civil War: Mass Bond Sales & Greenbacks",
    era: "1861–1865",
    chartRange: [1840, 1890],
    highlightYear: 1865,
    content: `The US Civil War cost roughly $5.2 billion — an amount that dwarfed the entire federal budget of the prior decade. The Treasury had two problems: it needed to borrow at scale, and it needed a stable currency.

Treasury Secretary Salmon Chase and financier Jay Cooke invented retail war bonds. Rather than selling exclusively to banks and wealthy investors, Cooke organised a nationwide network of agents selling bonds directly to ordinary citizens for as little as $50. Patriotism was marketing. Sales reached $1 billion.

Simultaneously, Congress authorised the issuance of United States Notes — "Greenbacks" — paper currency not backed by gold, declared legal tender by law alone. This was fiat money at scale in the US for the first time.

Two lasting consequences: First, the infrastructure Cooke built became the template for all subsequent US savings bond programs, including the WWII war bonds that raised $185 billion. Second, the Greenback debate — whether paper money needed gold backing — dominated US politics for 30 years and eventually produced the Federal Reserve as a compromise institution.

The US debt chart shows the Civil War spike to 32% of GDP — modest by European standards, but the political and monetary infrastructure it created was transformational.`,
    keyPoint: "Mass war financing → retail bond markets + fiat currency legitimised.",
    tags: ["USA", "Bonds", "Fiat Money", "Civil War"],
  },
  {
    id: "fed",
    title: "Panic of 1907: The Federal Reserve",
    era: "1913",
    chartRange: [1890, 1930],
    highlightYear: 1919,
    content: `The Panic of 1907 wasn't a war — it was a banking crisis. But it produced an institution designed specifically to finance future wars and manage the national debt.

In October 1907, a failed attempt to corner the copper market triggered a cascade of bank runs across New York. J.P. Morgan personally organised a private bailout, corralling other bankers to pledge reserves. The system held — but only because one private citizen happened to have the resources and authority to act.

Congress recognised this as unacceptable. The Aldrich-Vreeland Act of 1908 established a commission to study central banking. After years of debate — including the secret Jekyll Island meeting of 1910 — the Federal Reserve Act passed in 1913.

The Fed arrived just in time for WWI. When the US entered in 1917, the Fed was the mechanism through which Liberty Bonds were sold, through which the government financed $32 billion in war spending, and through which the money supply was managed.

The US debt chart's WWI spike to 33% of GDP looks modest, but without the Federal Reserve it would have been a financial crisis rather than a managed borrowing program.`,
    keyPoint: "Banking panic → lender of last resort → war financing infrastructure.",
    tags: ["USA", "Federal Reserve", "Central Bank"],
  },
  {
    id: "fdic",
    title: "Great Depression: Deposit Insurance",
    era: "1933",
    chartRange: [1920, 1950],
    highlightYear: 1933,
    content: `Between 1930 and 1933, roughly 9,000 US banks failed. Depositors lost savings. Runs spread from bank to bank through pure contagion — if your neighbour panicked, you had rational reason to panic too.

The Banking Act of 1933 created the Federal Deposit Insurance Corporation (FDIC), guaranteeing deposits up to $2,500 (later raised repeatedly). The logic was simple: if depositors knew their money was safe, they wouldn't run. Bank runs would become self-defeating.

The innovation worked. Bank runs as a systemic phenomenon essentially disappeared in the US until 2023 (Silicon Valley Bank), and even then the FDIC mechanism contained it.

The Depression-era financial reforms — the FDIC, Glass-Steagall's separation of commercial and investment banking, the SEC — represented the first time financial regulation was understood as public infrastructure rather than private self-governance.

The debt chart shows the US Depression-era debt climbing to ~44% of GDP not from the banks but from New Deal spending — the fiscal response the new institutional framework made possible.`,
    keyPoint: "Mass bank failure → state guarantee of deposits → systemic banking stability.",
    tags: ["USA", "Deposit Insurance", "Great Depression"],
  },
  {
    id: "bretton",
    title: "WWII: IMF, World Bank & the Dollar System",
    era: "1944",
    chartRange: [1935, 1970],
    highlightYear: 1945,
    content: `In July 1944, with WWII still ongoing, 730 delegates from 44 nations met at the Mount Washington Hotel in Bretton Woods, New Hampshire. Their task: design the postwar international monetary system before anyone knew exactly what the postwar would look like.

The UK debt chart shows the scale of the problem: UK debt at 240% of GDP, US at 119%. Europe was physically destroyed. Trade had collapsed. Pre-war gold standard mechanisms were gone.

John Maynard Keynes (UK) and Harry Dexter White (US) proposed competing visions. The compromise produced three institutions: the International Monetary Fund (to manage exchange rates and provide short-term balance of payments support), the International Bank for Reconstruction and Development — the World Bank (long-term development lending), and the Bretton Woods system itself — fixed exchange rates pegged to the dollar, with the dollar pegged to gold at $35/oz.

This created the US dollar as the global reserve currency — a status it holds today even after the gold link was severed by Nixon in 1971.

The innovation was international: for the first time, monetary order was a multilateral construction rather than an outcome of hegemony alone. Every currency crisis since — from Mexico 1994 to Greece 2010 — has been managed through institutions designed in that New Hampshire hotel in wartime.`,
    keyPoint: "WWII debt crisis → multilateral monetary institutions → dollar reserve system.",
    tags: ["IMF", "World Bank", "Bretton Woods", "WWII"],
  },
  {
    id: "fiat",
    title: "The World Wars: Fiat Money Completes",
    era: "1914–1971",
    chartRange: [1910, 1980],
    highlightYear: 1920,
    content: `The gold standard — which tied currency supply to gold reserves — was the defining monetary institution of the 19th century. It collapsed in WWI and never fully recovered.

When WWI began in August 1914, every major belligerent suspended gold convertibility within weeks. You could no longer exchange paper money for gold at the bank. Governments needed to print money to finance the war, and gold backing made that impossible.

After WWI, countries attempted to restore the gold standard. Britain returned in 1925 at the prewar parity — a catastrophic mistake that contributed to the Depression by forcing deflationary pressure. The experiment collapsed again in the 1930s as countries abandoned gold one by one.

WWII made the question moot. No country could fight a total war on a gold standard. The Bretton Woods gold-dollar system was a partial bridge: the dollar was backed by gold, other currencies backed by dollars — one step removed. When Nixon closed the gold window in 1971, the last link was severed.

Today every currency in the world is fiat: its value rests entirely on the taxing power and institutional credibility of its issuing government. The intellectual and political work to make this acceptable — to convince publics that paper was "real" money — ran from the American Civil War Greenbacks through two World Wars to Nixon's Sunday night televised announcement in August 1971.`,
    keyPoint: "Total war financing → gold standard abandonment → pure fiat monetary system.",
    tags: ["Fiat Money", "Gold Standard", "WWI", "WWII"],
  },
  {
    id: "quiz",
    title: "Check Your Understanding",
    era: null,
    chartRange: [1700, 2023],
    highlightYear: null,
    content: null,
    tags: ["Assessment"],
  },
];

const QUIZ: QuizQuestion[] = [
  {
    q: "Which institution was created specifically to lend money to the English Crown during the Nine Years' War?",
    options: ["The Treasury", "The Bank of England", "Lloyd's of London", "The East India Company"],
    answer: 1,
    explain: "The Bank of England was chartered in 1694, with its initial purpose being to lend £1.2 million to King William III to finance the Nine Years' War against France.",
  },
  {
    q: "The world's first tradeable government debt instruments — the prestiti — originated in which city-state?",
    options: ["Florence", "Genoa", "Venice", "Amsterdam"],
    answer: 2,
    explain: "Venice issued prestiti (forced loans with interest) starting in 1171 to finance war with Byzantium. These became tradeable on a secondary market, creating the first sovereign debt market.",
  },
  {
    q: "Britain's income tax was introduced in 1799 as what?",
    options: ["A permanent fiscal measure", "A temporary wartime measure", "A property tax replacement", "A trade tariff substitute"],
    answer: 1,
    explain: "Pitt the Younger introduced income tax explicitly as a temporary wartime measure to finance the Napoleonic Wars. Parliament even ordered the records burned when it was abolished in 1802. It returned permanently in 1842.",
  },
  {
    q: "The Panic of 1907 was resolved temporarily by whom before the Federal Reserve existed?",
    options: ["The US Treasury", "Congress", "J.P. Morgan personally", "The New York Stock Exchange"],
    answer: 2,
    explain: "J.P. Morgan personally coordinated a private sector bailout, corralling other bankers to pledge reserves to stop the cascade of bank runs. This dependence on one private individual prompted Congress to create the Federal Reserve.",
  },
  {
    q: "The Bretton Woods conference (1944) established which two lasting institutions?",
    options: [
      "The Federal Reserve and the SEC",
      "The IMF and the World Bank",
      "The FDIC and the WTO",
      "The BIS and the ECB",
    ],
    answer: 1,
    explain: "The 1944 Bretton Woods conference created the International Monetary Fund (for exchange rate management and balance of payments support) and the International Bank for Reconstruction and Development (the World Bank), along with the dollar-gold exchange standard.",
  },
];

// ── Debt Chart ────────────────────────────────────────────────────────────────
function DebtChart({ range, highlightYear }: { range: [number, number]; highlightYear: number | null }) {
  const [xMin, xMax] = range;
  const filtered = ALL_CHART_DATA.filter((d) => d.year >= xMin && d.year <= xMax);
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={filtered} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
        <CartesianGrid stroke="rgba(148,163,184,0.2)" strokeDasharray="3 3" />
        <XAxis
          dataKey="year"
          tick={{ fill: "#64748b", fontSize: 10 }}
          tickLine={false}
          axisLine={{ stroke: "rgba(148,163,184,0.3)" }}
        />
        <YAxis
          tickFormatter={(v: number) => `${v}%`}
          tick={{ fill: "#64748b", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip
          contentStyle={{
            background: "#0f172a",
            border: "1px solid rgba(148,163,184,0.2)",
            borderRadius: 8,
            fontSize: 11,
          }}
          labelStyle={{ color: "#94a3b8" }}
          itemStyle={{ color: "#e2e8f0" }}
          formatter={(value: number) => [`${value}%`, undefined]}
        />
        {highlightYear ? (
          <ReferenceLine x={highlightYear} stroke="#dc2626" strokeDasharray="4 3" strokeWidth={1.5} />
        ) : null}
        <Line dataKey="UK" stroke="#60a5fa" dot={false} strokeWidth={2} connectNulls name="UK" />
        <Line dataKey="US" stroke="#f87171" dot={false} strokeWidth={2} connectNulls name="US" />
        <Line dataKey="France" stroke="#86efac" dot={false} strokeWidth={2} connectNulls name="France" />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ── Chart Legend ──────────────────────────────────────────────────────────────
function ChartLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 pt-2">
      {([["UK", "#60a5fa"], ["US", "#f87171"], ["France", "#86efac"]] as const).map(([name, col]) => (
        <div key={name} className="flex items-center gap-2">
          <div className="h-0.5 w-5 rounded-full" style={{ background: col }} />
          <span className="text-[11px] text-slate-400">{name} Debt / GDP</span>
        </div>
      ))}
    </div>
  );
}

// ── Quiz ──────────────────────────────────────────────────────────────────────
function Quiz() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [current, setCurrent] = useState(0);

  const q = QUIZ[current];
  const score = QUIZ.filter((item, i) => answers[i] === item.answer).length;

  function handleSelect(qi: number, ai: number) {
    if (!submitted) setAnswers((prev) => ({ ...prev, [qi]: ai }));
  }

  return (
    <div className="space-y-4">
      {!submitted ? (
        <>
          {/* Question pills */}
          <div className="flex flex-wrap gap-2">
            {QUIZ.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                type="button"
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition",
                  current === i
                    ? "bg-amber-500 text-white"
                    : answers[i] !== undefined
                      ? "bg-emerald-100 text-emerald-700"
                      : "border border-[rgba(28,36,48,0.12)] bg-white text-slate-500 hover:border-[rgba(28,36,48,0.22)]",
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* Question card */}
          <div className="rounded-[1.3rem] border border-[rgba(28,36,48,0.08)] bg-white p-5 shadow-[0_8px_20px_rgba(28,36,48,0.05)]">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Question {current + 1} / {QUIZ.length}
            </p>
            <p className="mb-5 text-[0.95rem] font-medium leading-6 text-slate-900">{q.q}</p>
            <div className="space-y-2">
              {q.options.map((opt, ai) => (
                <button
                  key={ai}
                  onClick={() => handleSelect(current, ai)}
                  type="button"
                  className={cn(
                    "w-full rounded-[1rem] border px-4 py-3 text-left text-sm transition",
                    answers[current] === ai
                      ? "border-[rgba(59,130,246,0.3)] bg-[rgba(59,130,246,0.07)] text-slate-900"
                      : "border-[rgba(28,36,48,0.10)] bg-white text-slate-600 hover:border-[rgba(28,36,48,0.2)]",
                  )}
                >
                  <span className="mr-3 font-mono text-slate-400">{String.fromCharCode(65 + ai)}.</span>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                disabled={current === 0}
                type="button"
                className="flex items-center gap-1 rounded-full border border-[rgba(28,36,48,0.12)] px-3 py-1.5 text-sm text-slate-500 transition hover:text-slate-800 disabled:opacity-30"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Prev
              </button>
              <button
                onClick={() => setCurrent((c) => Math.min(QUIZ.length - 1, c + 1))}
                disabled={current === QUIZ.length - 1}
                type="button"
                className="flex items-center gap-1 rounded-full border border-[rgba(28,36,48,0.12)] px-3 py-1.5 text-sm text-slate-500 transition hover:text-slate-800 disabled:opacity-30"
              >
                Next <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
            {Object.keys(answers).length === QUIZ.length ? (
              <button
                onClick={() => setSubmitted(true)}
                type="button"
                className="rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
              >
                Submit answers
              </button>
            ) : null}
          </div>
        </>
      ) : (
        <>
          {/* Score */}
          <div
            className={cn(
              "rounded-[1.3rem] border p-5 text-center",
              score >= 4
                ? "border-emerald-200 bg-emerald-50"
                : "border-rose-200 bg-rose-50",
            )}
          >
            <p className={cn("text-4xl font-black", score >= 4 ? "text-emerald-600" : "text-rose-600")}>
              {score} / {QUIZ.length}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {score === 5
                ? "Perfect — you've internalised the crisis-to-innovation chain."
                : score >= 3
                  ? "Solid grasp of the material. Review the explanations below."
                  : "Return to the lessons and try again."}
            </p>
          </div>

          {/* Review */}
          <div className="space-y-3">
            {QUIZ.map((item, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-[1.2rem] border p-4",
                  answers[i] === item.answer
                    ? "border-emerald-200 bg-emerald-50/60"
                    : "border-rose-200 bg-rose-50/60",
                )}
              >
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Q{i + 1}</p>
                <p className="text-sm font-medium text-slate-900">{item.q}</p>
                <p className={cn("mt-2 text-sm font-semibold", answers[i] === item.answer ? "text-emerald-600" : "text-rose-600")}>
                  {answers[i] === item.answer
                    ? "✓ Correct"
                    : `✗ You chose: ${item.options[answers[i]]} · Correct: ${item.options[item.answer]}`}
                </p>
                <p className="mt-2 border-t border-[rgba(28,36,48,0.08)] pt-2 text-sm leading-6 text-slate-600">
                  {item.explain}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => { setAnswers({}); setSubmitted(false); setCurrent(0); }}
            type="button"
            className="rounded-full border border-[rgba(28,36,48,0.12)] px-4 py-2 text-sm text-slate-500 transition hover:text-slate-900"
          >
            Retake quiz
          </button>
        </>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function WarFinanceSimulator() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const lesson = LESSONS[activeIndex];
  const contentLessons = LESSONS.length - 1; // exclude quiz
  const progress = Math.round((completed.size / contentLessons) * 100);

  function goTo(i: number) {
    setCompleted((prev) => new Set([...prev, activeIndex]));
    setActiveIndex(i);
  }

  return (
    <AtlasPage className="space-y-0 !p-0">
      {/* Hero */}
      <SimulatorHero
        eyebrow="War & Financial Innovation"
        title="How crisis built the financial system"
        description="Six centuries of wars, panics, and defaults produced the institutions that govern money today — central banks, sovereign bonds, income tax, deposit insurance, and the IMF. Trace each crisis to its institutional invention."
        imageSrc="/atlas/simulators/war-finance.png"
        imageAlt="Historical debt-to-GDP chart showing war spikes"
        metrics={[
          { label: "Lessons", value: "9" },
          { label: "Countries tracked", value: "3" },
          { label: "Centuries of data", value: "3+" },
          { label: "Institutions traced", value: "8" },
        ]}
      />

      {/* Body */}
      <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className={cn("flex gap-6", sidebarOpen ? "lg:grid lg:grid-cols-[14rem_1fr] lg:items-start" : "")}>

          {/* ── Sidebar ── */}
          {sidebarOpen ? (
            <aside className="hidden shrink-0 lg:block">
              <div className="sticky top-6 rounded-[1.5rem] border border-[rgba(28,36,48,0.08)] bg-slate-950 shadow-[0_18px_36px_rgba(28,36,48,0.12)]">
                {/* Header */}
                <div className="border-b border-slate-800 px-4 py-4">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-slate-500">Society Lab</p>
                  <p className="mt-0.5 font-serif text-sm leading-5 text-amber-200/90">War &amp; Financial Innovation</p>
                  {/* Progress */}
                  <div className="mt-3">
                    <div className="mb-1.5 flex justify-between text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      <span>Progress</span><span>{progress}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-amber-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Lesson list */}
                <div className="py-2">
                  {LESSONS.map((l, i) => (
                    <button
                      key={l.id}
                      onClick={() => goTo(i)}
                      type="button"
                      className={cn(
                        "flex w-full items-center gap-3 border-l-2 px-4 py-2.5 text-left transition",
                        activeIndex === i
                          ? "border-amber-500 bg-slate-800/60"
                          : "border-transparent hover:bg-slate-900",
                      )}
                    >
                      <div className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px]",
                        completed.has(i)
                          ? "bg-emerald-500 text-white"
                          : activeIndex === i
                            ? "bg-amber-500 text-white"
                            : "bg-slate-800 text-slate-500",
                      )}>
                        {completed.has(i) ? "✓" : ""}
                      </div>
                      <div>
                        <p className={cn("text-[11px] leading-4", activeIndex === i ? "text-slate-100" : "text-slate-400")}>
                          {l.title}
                        </p>
                        {l.era ? (
                          <p className="mt-0.5 font-mono text-[9px] text-slate-600">{l.era}</p>
                        ) : null}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Chart legend */}
                <div className="border-t border-slate-800 px-4 py-3">
                  <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-600">Chart key</p>
                  {([["UK", "#60a5fa"], ["US", "#f87171"], ["France", "#86efac"]] as const).map(([name, col]) => (
                    <div key={name} className="mb-1.5 flex items-center gap-2">
                      <div className="h-0.5 w-4 rounded-full" style={{ background: col }} />
                      <span className="text-[10px] text-slate-500">{name} Debt/GDP</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          ) : null}

          {/* ── Main ── */}
          <div className="min-w-0 space-y-5">
            {/* Mobile / collapse top bar */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen((s) => !s)}
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(28,36,48,0.12)] text-slate-500 transition hover:text-slate-900 lg:flex"
              >
                {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
              <div className="flex flex-wrap gap-2">
                {lesson.era ? (
                  <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-rose-600">
                    {lesson.era}
                  </span>
                ) : null}
                {lesson.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[rgba(28,36,48,0.10)] bg-[rgba(246,244,238,0.8)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <span className="ml-auto text-[11px] font-medium text-slate-400">
                {lesson.id === "quiz" ? "Assessment" : `Lesson ${activeIndex + 1} of ${contentLessons}`}
              </span>
            </div>

            {/* Lesson title */}
            <h2 className="font-serif text-2xl font-bold leading-8 text-slate-900 sm:text-3xl">
              {lesson.title}
            </h2>

            {/* Chart */}
            <SimulatorChartPanel
              title={`Public Debt / GDP — ${lesson.chartRange[0]}–${lesson.chartRange[1]}`}
              description={lesson.highlightYear ? `Red line marks ${lesson.highlightYear}` : undefined}
              className="bg-slate-950 dark"
            >
              <DebtChart range={lesson.chartRange} highlightYear={lesson.highlightYear} />
              <ChartLegend />
            </SimulatorChartPanel>

            {/* Content or Quiz */}
            {lesson.id === "quiz" ? (
              <Quiz />
            ) : (
              <>
                <div className="space-y-4 text-[0.9rem] leading-7 text-slate-700">
                  {lesson.content?.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
                {lesson.keyPoint ? (
                  <SimulatorCallout title="Key mechanism" tone="gold">
                    {lesson.keyPoint}
                  </SimulatorCallout>
                ) : null}
              </>
            )}

            {/* Prev / Next */}
            <div className="flex items-center justify-between border-t border-[rgba(28,36,48,0.08)] pt-5">
              <button
                onClick={() => goTo(Math.max(0, activeIndex - 1))}
                disabled={activeIndex === 0}
                type="button"
                className="flex items-center gap-2 rounded-full border border-[rgba(28,36,48,0.12)] px-4 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-900 disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
              <button
                onClick={() => goTo(Math.min(LESSONS.length - 1, activeIndex + 1))}
                disabled={activeIndex === LESSONS.length - 1}
                type="button"
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-30",
                  activeIndex === LESSONS.length - 2
                    ? "bg-amber-500 text-white hover:bg-amber-600"
                    : "border border-[rgba(28,36,48,0.12)] text-slate-600 hover:text-slate-900",
                )}
              >
                {activeIndex === LESSONS.length - 2 ? "Take the Assessment" : "Next lesson"}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AtlasPage>
  );
}
