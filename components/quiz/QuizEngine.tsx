"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Trophy, RotateCcw, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ModuleQuiz, QuizQuestion } from "@/lib/quiz/questions";
import { useProgress } from "@/lib/progress/store";

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase = "intro" | "question" | "feedback" | "result";

interface Answer {
  questionId: string;
  selected: string[];
  correct: boolean;
}

// ─── Difficulty badge ─────────────────────────────────────────────────────────
const DIFF_STYLE = {
  easy: "border-emerald-300/30 bg-emerald-400/10 text-emerald-200",
  medium: "border-amber-300/30 bg-amber-400/10 text-amber-200",
  hard: "border-rose-300/30 bg-rose-400/10 text-rose-200",
};

function DiffBadge({ d }: { d: QuizQuestion["difficulty"] }) {
  return (
    <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize", DIFF_STYLE[d])}>
      {d}
    </span>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-slate-500">
        <span>Question {current} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-cyan-400 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Score ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score, total }: { score: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((score / total) * 100);
  const r = 44;
  const circ = 2 * Math.PI * r;
  const dash = circ * (pct / 100);
  const color = pct >= 75 ? "#34d399" : pct >= 50 ? "#fbbf24" : "#f87171";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={112} height={112} viewBox="0 0 112 112">
        <circle cx={56} cy={56} r={r} fill="none" stroke="#1e293b" strokeWidth={8} />
        <circle
          cx={56} cy={56} r={r} fill="none"
          stroke={color} strokeWidth={8}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 56 56)"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-2xl font-black" style={{ color }}>{pct}%</p>
        <p className="text-xs text-slate-500">{score}/{total}</p>
      </div>
    </div>
  );
}

// ─── Option button ────────────────────────────────────────────────────────────
function OptionButton({
  optId, text, phase, selected, isCorrect, onToggle,
}: {
  optId: string;
  text: string;
  phase: Phase;
  selected: boolean;
  isCorrect: boolean;
  onToggle: (id: string) => void;
}) {
  const isFeedback = phase === "feedback";

  let style = "border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-500 hover:text-slate-100";
  if (selected && !isFeedback) style = "border-cyan-400 bg-cyan-400/10 text-cyan-100";
  if (isFeedback && isCorrect) style = "border-emerald-400 bg-emerald-400/10 text-emerald-100";
  if (isFeedback && selected && !isCorrect) style = "border-rose-400 bg-rose-400/10 text-rose-300 line-through";

  return (
    <button
      disabled={isFeedback}
      onClick={() => onToggle(optId)}
      className={cn(
        "flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition-colors",
        style,
      )}
    >
      <span className="mt-0.5 flex-shrink-0">
        {isFeedback && isCorrect ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        ) : isFeedback && selected && !isCorrect ? (
          <XCircle className="h-4 w-4 text-rose-400" />
        ) : (
          <span className={cn(
            "flex h-4 w-4 items-center justify-center rounded-full border text-[10px] font-bold",
            selected ? "border-cyan-400 bg-cyan-400 text-slate-900" : "border-slate-600 text-slate-500",
          )}>
            {optId.toUpperCase()}
          </span>
        )}
      </span>
      <span className="leading-snug">{text}</span>
    </button>
  );
}

// ─── Main quiz engine ─────────────────────────────────────────────────────────
export function QuizEngine({ quiz, moduleSlug }: { quiz: ModuleQuiz; moduleSlug: string }) {
  const { recordQuiz } = useProgress();
  const [phase, setPhase] = useState<Phase>("intro");
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const q = quiz.questions[idx];
  const totalQ = quiz.questions.length;
  const score = answers.filter((a) => a.correct).length;

  const isCorrectAnswer = useCallback(
    (sel: string[]): boolean => {
      const c = [...q.correct].sort().join(",");
      const s = [...sel].sort().join(",");
      return c === s;
    },
    [q],
  );

  const toggleOption = useCallback((optId: string) => {
    if (phase !== "question") return;
    if (q.kind === "single") {
      setSelected([optId]);
    } else {
      setSelected((prev) =>
        prev.includes(optId) ? prev.filter((x) => x !== optId) : [...prev, optId],
      );
    }
  }, [phase, q.kind]);

  const handleSubmit = useCallback(() => {
    const correct = isCorrectAnswer(selected);
    setAnswers((prev) => [...prev, { questionId: q.id, selected, correct }]);
    setPhase("feedback");
  }, [selected, q.id, isCorrectAnswer]);

  const handleNext = useCallback(() => {
    if (idx + 1 < totalQ) {
      setIdx((i) => i + 1);
      setSelected([]);
      setPhase("question");
    } else {
      const finalScore = answers.filter((a) => a.correct).length;
      recordQuiz(moduleSlug, finalScore, totalQ);
      setPhase("result");
    }
  }, [idx, totalQ, answers, moduleSlug, recordQuiz]);

  const handleRestart = useCallback(() => {
    setPhase("intro");
    setIdx(0);
    setSelected([]);
    setAnswers([]);
  }, []);

  const resultMessage = useMemo(() => {
    const pct = totalQ === 0 ? 0 : Math.round((score / totalQ) * 100);
    if (pct === 100) return "Perfect score. You understand this system deeply.";
    if (pct >= 75) return "Strong grasp of the material. A few details to revisit.";
    if (pct >= 50) return "Good foundation — the explanations below will sharpen your understanding.";
    return "This topic has real depth. Review the explanations and try again.";
  }, [score, totalQ]);

  // ── Intro ──────────────────────────────────────────────────────────────────
  if (phase === "intro") {
    const diffs = quiz.questions.reduce(
      (acc, q) => { acc[q.difficulty] = (acc[q.difficulty] || 0) + 1; return acc; },
      {} as Record<string, number>,
    );
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/85 p-8 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10">
            <BookOpen className="h-8 w-8 text-cyan-300" />
          </div>
          <h1 className="text-2xl font-black text-slate-50">{quiz.title}</h1>
          <p className="text-slate-400">{totalQ} questions to test your understanding of this system</p>
          <div className="flex justify-center gap-3 flex-wrap">
            {(Object.entries(diffs) as [QuizQuestion["difficulty"], number][]).map(([d, n]) => (
              <span key={d} className={cn("rounded-full border px-3 py-1 text-xs font-medium", DIFF_STYLE[d])}>
                {n} {d}
              </span>
            ))}
          </div>
          <Button onClick={() => setPhase("question")} className="mt-2 rounded-2xl gap-2 px-8">
            Start quiz <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-center">
          <Link href={`/learn/${moduleSlug}`} className="text-sm text-slate-500 hover:text-slate-300 inline-flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to module
          </Link>
        </div>
      </div>
    );
  }

  // ── Result ────────────────────────────────────────────────────────────────
  if (phase === "result") {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/85 p-8 text-center space-y-5">
          <Trophy className="mx-auto h-10 w-10 text-amber-300" />
          <h1 className="text-2xl font-black text-slate-50">Quiz complete</h1>
          <ScoreRing score={score} total={totalQ} />
          <p className="text-slate-300 max-w-md mx-auto">{resultMessage}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={handleRestart} variant="outline" className="rounded-2xl gap-2">
              <RotateCcw className="h-4 w-4" /> Retake
            </Button>
            <Button asChild className="rounded-2xl gap-2">
              <Link href={`/learn/${moduleSlug}`}>
                <BookOpen className="h-4 w-4" /> Review module
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-2xl gap-2">
              <Link href="/learn">All modules</Link>
            </Button>
          </div>
        </div>

        {/* Answer review */}
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-widest text-slate-500">Answer review</p>
          {quiz.questions.map((question, i) => {
            const ans = answers.find((a) => a.questionId === question.id);
            return (
              <div
                key={question.id}
                className={cn(
                  "rounded-[1.5rem] border bg-panel p-5 space-y-3",
                  ans?.correct ? "border-emerald-800/50" : "border-rose-800/50",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-slate-200 flex-1">
                    <span className="text-slate-500 mr-2">{i + 1}.</span>
                    {question.text}
                  </p>
                  {ans?.correct
                    ? <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    : <XCircle className="h-5 w-5 text-rose-400 flex-shrink-0 mt-0.5" />}
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3">
                  <p className="text-xs text-slate-500 mb-1">Explanation</p>
                  <p className="text-sm text-slate-300 leading-6">{question.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Question / Feedback ───────────────────────────────────────────────────
  const canSubmit = selected.length > 0;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <ProgressBar current={idx + 1} total={totalQ} />

      <div className="rounded-[2rem] border border-slate-800 bg-slate-950/85 p-6 sm:p-8 space-y-6">
        {/* Question header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <DiffBadge d={q.difficulty} />
            {q.kind === "multi" && (
              <span className="rounded-full border border-violet-300/25 bg-violet-400/10 px-2.5 py-0.5 text-xs text-violet-200">
                Select all that apply
              </span>
            )}
          </div>
          <p className="text-lg font-semibold leading-7 text-slate-50">{q.text}</p>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {q.options.map((opt) => (
            <OptionButton
              key={opt.id}
              optId={opt.id}
              text={opt.text}
              phase={phase}
              selected={selected.includes(opt.id)}
              isCorrect={q.correct.includes(opt.id)}
              onToggle={toggleOption}
            />
          ))}
        </div>

        {/* Explanation (feedback phase) */}
        {phase === "feedback" && (
          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 px-5 py-4 space-y-1">
            <p className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">Explanation</p>
            <p className="text-sm leading-6 text-slate-300">{q.explanation}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-600">
            {answers.filter((a) => a.correct).length} correct so far
          </span>
          {phase === "question" ? (
            <Button disabled={!canSubmit} onClick={handleSubmit} className="rounded-2xl gap-2">
              Check answer <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleNext} className="rounded-2xl gap-2">
              {idx + 1 < totalQ ? <><span>Next question</span> <ArrowRight className="h-4 w-4" /></> : <><span>See results</span> <Trophy className="h-4 w-4" /></>}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
