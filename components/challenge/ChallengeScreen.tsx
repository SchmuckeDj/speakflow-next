"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { recordChallengeCompleted } from "@/lib/hooks/useProgress";
import { apiFetch } from "@/lib/api";
import clsx from "clsx";

interface Question {
  question:    string;
  options:     string[];
  correct:     number;
  explanation: string;
}

const FALLBACK_QUESTIONS: Question[] = [
  { question: "Choose the correct past tense: She ___ to the store yesterday", options: ["go","goes","went","gone"], correct: 2, explanation: "Simple past of 'go' is 'went'." },
  { question: "Which sentence is correct", options: ["I have went there","I have gone there","I have go there","I have going there"], correct: 1, explanation: "'Have gone' uses the past participle." },
  { question: "Fill in the blank: He ___ English for 3 years", options: ["is learning","has been learning","was learning","learns"], correct: 1, explanation: "Present perfect continuous for ongoing actions." },
  { question: "Future commitment: I ___ finish this by tomorrow", options: ["will","would","shall","should"], correct: 0, explanation: "'Will' expresses future commitment." },
  { question: "Correct the error: She don't like coffee", options: ["She doesn't likes coffee","She doesn't like coffee","She not like coffee","She isn't like coffee"], correct: 1, explanation: "Third person singular uses 'doesn't' + base verb." },
];

async function fetchQuestions(): Promise<Question[]> {
  try {
    const user  = JSON.parse(localStorage.getItem("sf_user") || "{}");
    const level = user.level || "B1";
    const res   = await apiFetch(`/api/challenge/?level=${level}`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return FALLBACK_QUESTIONS;
  }
}

export default function ChallengeScreen() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [current,   setCurrent]   = useState(0);
  const [selected,  setSelected]  = useState<number | null>(null);
  const [answers,   setAnswers]   = useState<(number | null)[]>([]);
  const [finished,  setFinished]  = useState(false);

  useEffect(() => {
    fetchQuestions().then((qs) => {
      setQuestions(qs);
      setAnswers(Array(qs.length).fill(null));
      setLoading(false);
    });
  }, []);

  function select(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    setAnswers((prev) => { const next = [...prev]; next[current] = idx; return next; });
  }

  function next() {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(answers[current + 1]);
    } else {
      const correct = answers.filter((a, i) => a === questions[i].correct).length;
      recordChallengeCompleted(correct, questions.length);
      setFinished(true);
    }
  }

  function restart() {
    setCurrent(0); setSelected(null);
    setAnswers([]); setFinished(false); setLoading(true); setQuestions([]);
    fetchQuestions().then((qs) => {
      setQuestions(qs);
      setAnswers(Array(qs.length).fill(null));
      setLoading(false);
    });
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--color-acc)] border-t-transparent animate-spin" />
        <p className="text-sm text-[var(--color-text-2)]">Generando preguntas con IA...</p>
      </div>
    );
  }

  if (finished) {
    const correct = answers.filter((a, i) => a === questions[i]?.correct).length;
    const pct     = correct / questions.length;
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center max-w-sm mx-auto">
        <div className="text-5xl">{pct >= 0.8 ? "🏆" : pct >= 0.6 ? "👍" : "📚"}</div>
        <h2 className="text-2xl font-semibold">{correct}/{questions.length} correctas</h2>
        <p className="text-[var(--color-text-2)]">
          {pct >= 0.8 ? "¡Excelente! +200 XP ganados." : pct >= 0.6 ? "Buen intento. +100 XP." : "Sigue practicando. +40 XP."}
        </p>
        <div className="w-full bg-[var(--color-surface-2)] rounded-full h-2">
          <div className="h-2 rounded-full bg-[var(--color-acc)] transition-all duration-700" style={{ width: `${pct * 100}%` }} />
        </div>
        <Button onClick={restart} size="lg">Nuevo Challenge ↻</Button>
      </div>
    );
  }

  const q        = questions[current];
  const answered = selected !== null;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Daily Challenge</h1>
        <span className="text-sm text-[var(--color-text-2)]">{current + 1} / {questions.length}</span>
      </div>

      <div className="h-1 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
        <div className="h-full bg-[var(--color-acc)] rounded-full transition-all duration-500"
          style={{ width: `${(current / questions.length) * 100}%` }} />
      </div>

      <Card glow={answered && selected === q.correct}>
        <p className="font-medium text-[var(--color-text)] mb-5">{q.question}</p>
        <div className="space-y-2">
          {q.options.map((opt, idx) => (
            <button key={idx} onClick={() => select(idx)}
              className={clsx(
                "w-full text-left px-4 py-3 rounded-[var(--radius-md)] border text-sm transition-all",
                !answered && "border-[var(--color-border)] hover:border-[var(--color-acc)]/50 hover:bg-[var(--color-surface-2)]",
                answered && idx === q.correct && "border-emerald-500 bg-emerald-500/10 text-emerald-400",
                answered && idx === selected && idx !== q.correct && "border-red-500 bg-red-500/10 text-red-400",
                answered && idx !== selected && idx !== q.correct && "border-[var(--color-border)] opacity-50"
              )}>
              <span className="text-[var(--color-text-3)] mr-2">{String.fromCharCode(65 + idx)}.</span>
              {opt}
            </button>
          ))}
        </div>
        {answered && (
          <div className="mt-4 p-3 rounded-[var(--radius-md)] bg-[var(--color-surface-2)] text-sm text-[var(--color-text-2)]">
            💡 {q.explanation}
          </div>
        )}
      </Card>

      <Button onClick={next} disabled={!answered} className="w-full" size="lg">
        {current < questions.length - 1 ? "Siguiente →" : "Ver resultado"}
      </Button>
    </div>
  );
}
