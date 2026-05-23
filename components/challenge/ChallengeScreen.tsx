"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { recordChallengeCompleted } from "@/lib/hooks/useProgress";
import clsx from "clsx";

const QUESTIONS = [
  { id: "q1", question: "Choose the correct past tense: 'She ___ to the store yesterday'", options: ["go", "goes", "went", "gone"], correct: 2, explanation: "'Went' is the simple past of 'go'." },
  { id: "q2", question: "Which sentence is correct", options: ["I have went there", "I have gone there", "I have go there", "I have going there"], correct: 1, explanation: "'Have gone' uses the past participle 'gone'." },
  { id: "q3", question: "Fill in the blank: 'He ___ English for 3 years'", options: ["is learning", "has been learning", "was learning", "learns"], correct: 1, explanation: "Present perfect continuous for ongoing actions." },
  { id: "q4", question: "'I ___ finish this by tomorrow' — future commitment", options: ["will", "would", "shall", "should"], correct: 0, explanation: "'Will' expresses a future commitment or decision." },
  { id: "q5", question: "Correct the error: 'She don't like coffee'", options: ["She doesn't likes coffee", "She doesn't like coffee", "She not like coffee", "She isn't like coffee"], correct: 1, explanation: "Third person singular uses 'doesn't' + base verb." },
  { id: "q6", question: "Which is correct", options: ["I am agree with you", "I agree with you", "I am agreeing you", "I agreeing with you"], correct: 1, explanation: "'Agree' is not used with 'be' in standard English." },
  { id: "q7", question: "'She ___ here since 2020'", options: ["is", "was", "has been", "had been"], correct: 2, explanation: "Present perfect for actions from the past until now." },
  { id: "q8", question: "Choose the right option: 'If I ___ rich, I would travel'", options: ["am", "was", "were", "be"], correct: 2, explanation: "Second conditional uses 'were' for all subjects." },
  { id: "q9", question: "Which sentence uses 'used to' correctly", options: ["I used to playing soccer", "I used to play soccer", "I use to play soccer", "I was used to play soccer"], correct: 1, explanation: "'Used to' is followed by the base verb." },
  { id: "q10", question: "'He suggested ___ a new approach'", options: ["to try", "try", "trying", "tried"], correct: 2, explanation: "'Suggest' is followed by the gerund (-ing form)." },
];

export default function ChallengeScreen() {
  const [current, setCurrent]   = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers]   = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null));
  const [finished, setFinished] = useState(false);

  const q       = QUESTIONS[current];
  const answered = selected !== null;
  const correct  = answers.filter((a, i) => a === QUESTIONS[i].correct).length;

  function select(idx: number) {
    if (answered) return;
    setSelected(idx);
    setAnswers((prev) => { const next = [...prev]; next[current] = idx; return next; });
  }

  function next() {
    if (current < QUESTIONS.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(answers[current + 1]);
    } else {
      // ── Registrar en progreso ──
      recordChallengeCompleted(correct + (selected === q.correct ? 1 : 0), QUESTIONS.length);
      setFinished(true);
    }
  }

  function restart() {
    setCurrent(0); setSelected(null);
    setAnswers(Array(QUESTIONS.length).fill(null));
    setFinished(false);
  }

  if (finished) {
    const finalCorrect = answers.filter((a, i) => a === QUESTIONS[i].correct).length;
    const pct = finalCorrect / QUESTIONS.length;
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center max-w-sm mx-auto">
        <div className="text-5xl">{pct >= 0.8 ? "🏆" : pct >= 0.6 ? "👍" : "📚"}</div>
        <h2 className="text-2xl font-semibold">{finalCorrect}/{QUESTIONS.length} correctas</h2>
        <p className="text-[var(--color-text-2)]">
          {pct >= 0.8 ? "¡Excelente! +200 XP ganados." : pct >= 0.6 ? "Buen intento. +100 XP." : "Sigue practicando. +40 XP."}
        </p>
        {/* Barra de resultado */}
        <div className="w-full bg-[var(--color-surface-2)] rounded-full h-2">
          <div className="h-2 rounded-full bg-[var(--color-acc)] transition-all duration-700"
            style={{ width: `${pct * 100}%` }} />
        </div>
        <Button onClick={restart} size="lg">Intentar de nuevo</Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Daily Challenge</h1>
        <span className="text-sm text-[var(--color-text-2)]">{current + 1} / {QUESTIONS.length}</span>
      </div>

      {/* Barra de progreso */}
      <div className="h-1 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
        <div className="h-full bg-[var(--color-acc)] rounded-full transition-all duration-500"
          style={{ width: `${(current / QUESTIONS.length) * 100}%` }} />
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
        {current < QUESTIONS.length - 1 ? "Siguiente →" : "Ver resultado"}
      </Button>
    </div>
  );
}
