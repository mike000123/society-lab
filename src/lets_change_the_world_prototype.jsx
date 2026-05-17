import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar } from "recharts";
import { Brain, Building2, Globe2, Landmark, MessageSquare, Play, ShieldCheck, Sparkles, Users, Vote, WalletCards } from "lucide-react";

const themes = [
  {
    key: "economy",
    title: "Οικονομικό Σύστημα",
    icon: WalletCards,
    bug: "Το σύστημα μετρά κυρίως παραγωγή και κατανάλωση, όχι πραγματική ευημερία.",
    alternative: "Δείκτες ευημερίας, βασική ασφάλεια, μειωμένη εξάρτηση από διαρκή ανάπτυξη.",
    question: "Πώς θα έμοιαζε μια οικονομία που βελτιστοποιεί υγεία, χρόνο, στέγη και νόημα;",
  },
  {
    key: "politics",
    title: "Πολιτική & Δημοκρατία",
    icon: Landmark,
    bug: "Οι εκλογές κάθε λίγα χρόνια δεν αρκούν για σύνθετα προβλήματα και συνεχείς αποφάσεις.",
    alternative: "Συμμετοχική δημοκρατία, citizen assemblies, liquid democracy, διαφάνεια lobbying.",
    question: "Πώς μπορεί ο πολίτης να συμμετέχει ουσιαστικά χωρίς να γίνει το σύστημα χαοτικό;",
  },
  {
    key: "cities",
    title: "Πόλεις & Τρόπος Ζωής",
    icon: Building2,
    bug: "Οι πόλεις συχνά σχεδιάζονται γύρω από αυτοκίνητα, ακίνητα και κατανάλωση, όχι γύρω από ανθρώπους.",
    alternative: "15-minute cities, δημόσιοι χώροι, μικτές χρήσεις, πράσινες υποδομές, τοπικές κοινότητες.",
    question: "Πόσο διαφορετική θα ήταν η ζωή αν η πόλη μείωνε άγχος, χρόνο μετακίνησης και απομόνωση;",
  },
  {
    key: "information",
    title: "ΜΜΕ, Πληροφορία & Συνείδηση",
    icon: Brain,
    bug: "Η προσοχή γίνεται προϊόν. Το σύστημα επιβραβεύει θυμό, φόβο και επιφανειακή σύγκρουση.",
    alternative: "Εργαλεία κριτικής σκέψης, argument maps, evidence scoring, αργός διάλογος.",
    question: "Πώς εκπαιδεύουμε κοινωνίες να σκέφτονται συστημικά αντί να αντιδρούν παρορμητικά;",
  },
];

const quizQuestions = [
  {
    q: "Ποιο είναι πιο κοντά στη λογική του project;",
    options: ["Να βρούμε ποιος φταίει", "Να σχεδιάσουμε καλύτερα συστήματα", "Να κερδίσει μια ιδεολογία"],
    answer: 1,
  },
  {
    q: "Τι μειώνει περισσότερο τον κίνδυνο echo chamber;",
    options: ["Μόνο άτομα που συμφωνούν", "Steelman της αντίθετης άποψης", "Απαγόρευση διαφωνίας"],
    answer: 1,
  },
  {
    q: "Ποιος δείκτης θα έπρεπε να μετράται δίπλα στο ΑΕΠ;",
    options: ["Ευημερία", "Αριθμός διαφημίσεων", "Ώρες scrolling"],
    answer: 0,
  },
];

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function scoreLabel(value) {
  if (value >= 75) return "Ισχυρό";
  if (value >= 55) return "Μέτριο";
  if (value >= 35) return "Αδύναμο";
  return "Κρίσιμο";
}

export default function App() {
  const [ubi, setUbi] = useState([35]);
  const [workweek, setWorkweek] = useState([40]);
  const [transparency, setTransparency] = useState([55]);
  const [greenCities, setGreenCities] = useState([45]);
  const [education, setEducation] = useState([50]);
  const [community, setCommunity] = useState([40]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [discussion, setDiscussion] = useState([
    { name: "Citizen A", text: "Αν μετράμε μόνο ΑΕΠ, χάνουμε το κόστος άγχους, υγείας και κοινωνικής απομόνωσης.", tag: "Οικονομία" },
    { name: "Citizen B", text: "Η συμμετοχή χρειάζεται δομή. Αλλιώς ο διάλογος γίνεται φωνές χωρίς αποτέλεσμα.", tag: "Δημοκρατία" },
  ]);
  const [newPost, setNewPost] = useState("");

  const metrics = useMemo(() => {
    const u = ubi[0];
    const w = workweek[0];
    const t = transparency[0];
    const g = greenCities[0];
    const e = education[0];
    const c = community[0];

    const wellbeing = clamp(35 + u * 0.22 + (50 - w) * 0.85 + g * 0.18 + e * 0.2 + c * 0.18, 0, 100);
    const inequality = clamp(75 - u * 0.35 - t * 0.12 - e * 0.12, 0, 100);
    const ecology = clamp(30 + g * 0.45 + (50 - w) * 0.25 + e * 0.1, 0, 100);
    const democracy = clamp(25 + t * 0.45 + e * 0.22 + c * 0.2, 0, 100);
    const stability = clamp(40 + wellbeing * 0.18 + democracy * 0.22 - inequality * 0.18, 0, 100);
    const innovation = clamp(35 + e * 0.32 + t * 0.08 + Math.max(0, 45 - w) * 0.32, 0, 100);

    const timeline = Array.from({ length: 8 }, (_, i) => ({
      year: `Y${i + 1}`,
      Wellbeing: clamp(35 + (wellbeing - 35) * ((i + 1) / 8), 0, 100),
      Stability: clamp(38 + (stability - 38) * ((i + 1) / 8), 0, 100),
      Ecology: clamp(30 + (ecology - 30) * ((i + 1) / 8), 0, 100),
    }));

    return { wellbeing, inequality, ecology, democracy, stability, innovation, timeline };
  }, [ubi, workweek, transparency, greenCities, education, community]);

  const radarData = [
    { metric: "Ευημερία", value: Math.round(metrics.wellbeing) },
    { metric: "Ισότητα", value: Math.round(100 - metrics.inequality) },
    { metric: "Οικολογία", value: Math.round(metrics.ecology) },
    { metric: "Δημοκρατία", value: Math.round(metrics.democracy) },
    { metric: "Σταθερότητα", value: Math.round(metrics.stability) },
    { metric: "Καινοτομία", value: Math.round(metrics.innovation) },
  ];

  const addPost = () => {
    if (!newPost.trim()) return;
    setDiscussion([{ name: "You", text: newPost.trim(), tag: "Νέα πρόταση" }, ...discussion]);
    setNewPost("");
  };

  const answerQuiz = (i) => {
    setSelected(i);
    const correct = i === quizQuestions[quizIndex].answer;
    setTimeout(() => {
      if (correct) setQuizScore((s) => s + 1);
      setSelected(null);
      setQuizIndex((q) => (q + 1) % quizQuestions.length);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full" />
        <div className="absolute top-80 -left-40 w-96 h-96 bg-amber-500/10 blur-3xl rounded-full" />
      </div>

      <main className="relative max-w-7xl mx-auto px-4 md:px-8 py-8">
        <nav className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-cyan-400/10 border border-cyan-300/20">
              <Globe2 className="w-6 h-6 text-cyan-300" />
            </div>
            <div>
              <div className="font-bold text-lg">System Shift Lab</div>
              <div className="text-xs text-slate-400">Prototype for “Let’s Change the World”</div>
            </div>
          </div>
          <Badge className="bg-amber-400/15 text-amber-200 border border-amber-300/20">Alpha concept</Badge>
        </nav>

        <section className="grid lg:grid-cols-[1.1fr_.9fr] gap-6 items-center mb-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
              Ένα online εργαστήριο για καλύτερα κοινωνικά συστήματα.
            </h1>
            <p className="mt-5 text-lg text-slate-300 max-w-2xl">
              Ανάλυση των bugs της οικονομίας, της πολιτικής, των πόλεων και του τρόπου ζωής — όχι για να μείνουμε στην κριτική, αλλά για να δοκιμάσουμε εναλλακτικά μοντέλα, σενάρια και συλλογικές ιδέες.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button className="rounded-2xl bg-cyan-400 text-slate-950 hover:bg-cyan-300">
                <Play className="w-4 h-4 mr-2" /> Δοκίμασε simulation
              </Button>
              <Button variant="outline" className="rounded-2xl border-slate-700 bg-slate-900/50 text-slate-100 hover:bg-slate-800">
                <MessageSquare className="w-4 h-4 mr-2" /> Άνοιξε διάλογο
              </Button>
            </div>
          </motion.div>

          <Card className="bg-slate-900/70 border-slate-800 rounded-3xl shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h2 className="font-bold text-xl text-slate-100">Core idea</h2>
              </div>
              <div className="space-y-4 text-slate-300">
                <p><b className="text-slate-100">Όχι:</b> “ποιος φταίει;”</p>
                <p><b className="text-slate-100">Ναι:</b> “ποιος κανόνας δημιουργεί το λάθος αποτέλεσμα;”</p>
                <p><b className="text-slate-100">Στόχος:</b> να εκπαιδεύσει πολίτες στη συστημική σκέψη και να δοκιμάζει εναλλακτικές πριν γίνουν δράσεις.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Tabs defaultValue="map" className="w-full">
          <TabsList className="grid grid-cols-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-1 mb-6">
            <TabsTrigger value="map" className="rounded-xl">Χάρτης</TabsTrigger>
            <TabsTrigger value="sim" className="rounded-xl">Simulation</TabsTrigger>
            <TabsTrigger value="game" className="rounded-xl">Quiz</TabsTrigger>
            <TabsTrigger value="forum" className="rounded-xl">Διάλογος</TabsTrigger>
          </TabsList>

          <TabsContent value="map">
            <div className="grid md:grid-cols-2 gap-4">
              {themes.map((t) => {
                const Icon = t.icon;
                return (
                  <Card key={t.key} className="bg-slate-900/70 border-slate-800 rounded-3xl hover:border-cyan-500/40 transition">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-2xl bg-cyan-400/10"><Icon className="w-6 h-6 text-cyan-300" /></div>
                        <h3 className="font-bold text-xl text-slate-100">{t.title}</h3>
                      </div>
                      <div className="space-y-3 text-sm text-slate-300">
                        <p><b className="text-red-300">Bug:</b> {t.bug}</p>
                        <p><b className="text-emerald-300">Εναλλακτική:</b> {t.alternative}</p>
                        <p><b className="text-amber-200">Ερώτηση:</b> {t.question}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="sim">
            <div className="grid lg:grid-cols-[.85fr_1.15fr] gap-5">
              <Card className="bg-slate-900/70 border-slate-800 rounded-3xl">
                <CardContent className="p-6 space-y-6">
                  <h2 className="font-bold text-2xl text-slate-100">Policy Sandbox</h2>
                  <p className="text-slate-400 text-sm">Άλλαξε κανόνες και δες πώς μεταβάλλονται οι δείκτες. Τα μαθηματικά εδώ είναι απλοποιημένα για demo, όχι πραγματικό οικονομικό μοντέλο.</p>

                  <Control label="Βασική οικονομική ασφάλεια" value={ubi} setValue={setUbi} suffix="%" />
                  <Control label="Ώρες εργασίας / εβδομάδα" value={workweek} setValue={setWorkweek} min={25} max={55} suffix="h" />
                  <Control label="Διαφάνεια θεσμών" value={transparency} setValue={setTransparency} suffix="%" />
                  <Control label="Πράσινες πόλεις / δημόσιοι χώροι" value={greenCities} setValue={setGreenCities} suffix="%" />
                  <Control label="Κριτική παιδεία / ενημέρωση" value={education} setValue={setEducation} suffix="%" />
                  <Control label="Κοινότητα / συμμετοχή" value={community} setValue={setCommunity} suffix="%" />
                </CardContent>
              </Card>

              <div className="space-y-5">
                <div className="grid sm:grid-cols-3 gap-4">
                  <Metric title="Ευημερία" value={metrics.wellbeing} icon={Users} />
                  <Metric title="Δημοκρατία" value={metrics.democracy} icon={Vote} />
                  <Metric title="Σταθερότητα" value={metrics.stability} icon={ShieldCheck} />
                </div>

                <Card className="bg-slate-900/70 border-slate-800 rounded-3xl">
                  <CardContent className="p-6">
                    <h3 className="font-bold mb-4 text-slate-100">Εξέλιξη 8 ετών</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={metrics.timeline}>
                          <XAxis dataKey="year" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" domain={[0, 100]} />
                          <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 12 }} />
                          <Line type="monotone" dataKey="Wellbeing" stroke="#22d3ee" strokeWidth={3} dot={false} />
                          <Line type="monotone" dataKey="Stability" stroke="#f59e0b" strokeWidth={3} dot={false} />
                          <Line type="monotone" dataKey="Ecology" stroke="#34d399" strokeWidth={3} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-5">
                  <Card className="bg-slate-900/70 border-slate-800 rounded-3xl">
                    <CardContent className="p-6">
                      <h3 className="font-bold mb-4 text-slate-100">System Radar</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={radarData}>
                            <PolarGrid stroke="#334155" />
                            <PolarAngleAxis dataKey="metric" tick={{ fill: "#cbd5e1", fontSize: 11 }} />
                            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar dataKey="value" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.25} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/70 border-slate-800 rounded-3xl">
                    <CardContent className="p-6">
                      <h3 className="font-bold mb-4 text-slate-100">Trade-offs</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[{ name: "Ανισότητα", value: Math.round(metrics.inequality) }, { name: "Καινοτομία", value: Math.round(metrics.innovation) }, { name: "Οικολογία", value: Math.round(metrics.ecology) }]}>
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" domain={[0, 100]} />
                            <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 12 }} />
                            <Bar dataKey="value" fill="#f59e0b" radius={[10, 10, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="game">
            <Card className="bg-slate-900/70 border-slate-800 rounded-3xl max-w-3xl mx-auto">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-100">Systems Thinking Quiz</h2>
                  <Badge className="bg-cyan-400/15 text-cyan-200">Score {quizScore}</Badge>
                </div>
                <Progress value={((quizIndex + 1) / quizQuestions.length) * 100} className="mb-6" />
                <h3 className="text-xl mb-5 text-slate-100">{quizQuestions[quizIndex].q}</h3>
                <div className="space-y-3">
                  {quizQuestions[quizIndex].options.map((o, i) => (
                    <Button
                      key={o}
                      variant="outline"
                      onClick={() => answerQuiz(i)}
                      className={`w-full justify-start rounded-2xl border-slate-700 bg-slate-950/40 text-slate-100 hover:bg-slate-800 ${selected === i ? "border-cyan-300 bg-cyan-400/10" : ""}`}
                    >
                      {o}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forum">
            <div className="grid lg:grid-cols-[.8fr_1.2fr] gap-5">
              <Card className="bg-slate-900/70 border-slate-800 rounded-3xl">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-3 text-slate-100">Structured Dialogue</h2>
                  <p className="text-sm text-slate-400 mb-5">Η ιδέα δεν είναι απλό forum. Κάθε πρόταση πρέπει να μπορεί να συνδεθεί με πρόβλημα, απόδειξη, αντίλογο και πιθανή δοκιμή.</p>
                  <Input placeholder="Τίτλος ιδέας / θέματος" className="mb-3 bg-slate-950 border-slate-700 text-slate-100" />
                  <Textarea value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder="Γράψε πρόταση, ερώτηση ή αντίλογο..." className="mb-3 bg-slate-950 border-slate-700 text-slate-100 min-h-32" />
                  <Button onClick={addPost} className="rounded-2xl bg-cyan-400 text-slate-950 hover:bg-cyan-300">Δημοσίευση demo</Button>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {discussion.map((p, i) => (
                  <Card key={i} className="bg-slate-900/70 border-slate-800 rounded-3xl">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-bold text-slate-100">{p.name}</div>
                        <Badge variant="outline" className="border-slate-700 text-slate-300">{p.tag}</Badge>
                      </div>
                      <p className="text-slate-300 mb-4">{p.text}</p>
                      <div className="grid sm:grid-cols-4 gap-2 text-xs">
                        <MiniPill label="Evidence" />
                        <MiniPill label="Counterargument" />
                        <MiniPill label="Simulation" />
                        <MiniPill label="Action" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function Control({ label, value, setValue, min = 0, max = 100, suffix = "%" }) {
  return (
    <div>
      <div className="flex justify-between mb-2 text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="text-cyan-200 font-bold">{value[0]}{suffix}</span>
      </div>
      <Slider value={value} onValueChange={setValue} min={min} max={max} step={1} />
    </div>
  );
}

function Metric({ title, value, icon: Icon }) {
  return (
    <Card className="bg-slate-900/70 border-slate-800 rounded-3xl">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <Icon className="w-5 h-5 text-cyan-300" />
          <Badge className="bg-slate-800 text-slate-200">{scoreLabel(value)}</Badge>
        </div>
        <div className="text-sm text-slate-400">{title}</div>
        <div className="text-3xl font-black text-slate-100">{Math.round(value)}</div>
        <Progress value={value} className="mt-3" />
      </CardContent>
    </Card>
  );
}

function MiniPill({ label }) {
  return <div className="px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400 text-center">{label}</div>;
}
