"use client";

import { useState, useEffect, useRef } from "react";
import { recordChallengeCompleted } from "@/lib/hooks/useProgress";
import { apiFetch } from "@/lib/api";

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
  { question: "Correct the error: She don't like coffee", options: ["She doesn't likes","She doesn't like","She not like","She isn't like"], correct: 1, explanation: "Third person singular uses 'doesn't' + base verb." },
];

const OPTION_COLORS = [
  { bg: "bg-red-500",    hover: "hover:bg-red-400",    light: "bg-red-500/20 border-red-500",    icon: "▲" },
  { bg: "bg-blue-500",   hover: "hover:bg-blue-400",   light: "bg-blue-500/20 border-blue-500",   icon: "◆" },
  { bg: "bg-yellow-400", hover: "hover:bg-yellow-300", light: "bg-yellow-400/20 border-yellow-400",icon: "●" },
  { bg: "bg-green-500",  hover: "hover:bg-green-400",  light: "bg-green-500/20 border-green-500",  icon: "■" },
];

const TIME_PER_QUESTION = 20; // segundos

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
  const [phase, setPhase]         = useState<"loading"|"intro"|"question"|"answer"|"results">("loading");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent]     = useState(0);
  const [selected, setSelected]   = useState<number | null>(null);
  const [answers, setAnswers]     = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft]   = useState(TIME_PER_QUESTION);
  const [points, setPoints]       = useState(0);
  const [streak, setStreak]       = useState(0);
  const [showStreak, setShowStreak] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetchQuestions().then((qs) => {
      setQuestions(qs);
      setAnswers(Array(qs.length).fill(null));
      setPhase("intro");
    });
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // Timer
  useEffect(() => {
    if (phase !== "question") return;
    setTimeLeft(TIME_PER_QUESTION);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          handleSelect(null); // tiempo agotado
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, current]);

  function handleSelect(idx: number | null) {
    if (phase !== "question") return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelected(idx);
    setAnswers((prev) => { const next = [...prev]; next[current] = idx; return next; });

    const q       = questions[current];
    const correct = idx === q.correct;
    const speed   = timeLeft / TIME_PER_QUESTION; // 0-1, más rápido = más puntos
    const earned  = correct ? Math.round(500 + speed * 500) : 0;

    if (correct) {
      setPoints((p) => p + earned);
      setStreak((s) => {
        const ns = s + 1;
        if (ns >= 3) setShowStreak(true);
        return ns;
      });
    } else {
      setStreak(0);
      setShowStreak(false);
    }

    setPhase("answer");
  }

  function nextQuestion() {
    setShowStreak(false);
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setPhase("question");
    } else {
      const correct = answers.filter((a, i) => a === questions[i]?.correct).length +
        (selected === questions[current]?.correct ? 1 : 0);
      recordChallengeCompleted(correct, questions.length);
      setPhase("results");
    }
  }

  function restart() {
    setPhase("loading");
    setCurrent(0); setSelected(null); setAnswers([]); setPoints(0); setStreak(0); setShowStreak(false);
    fetchQuestions().then((qs) => {
      setQuestions(qs);
      setAnswers(Array(qs.length).fill(null));
      setPhase("intro");
    });
  }

  const q           = questions[current];
  const timerPct    = (timeLeft / TIME_PER_QUESTION) * 100;
  const timerColor  = timeLeft > 10 ? "bg-emerald-400" : timeLeft > 5 ? "bg-yellow-400" : "bg-red-500";
  const correctCount = answers.filter((a, i) => a === questions[i]?.correct).length;
  const pct          = questions.length > 0 ? Math.round(correctCount / questions.length * 100) : 0;

  // ── LOADING ──
  if (phase === "loading") return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-8 h-8 rounded-full border-2 border-[var(--color-acc)] border-t-transparent animate-spin" />
      <p className="text-sm text-[var(--color-text-2)]">Generando preguntas con IA...</p>
    </div>
  );

  // ── INTRO ──
  if (phase === "intro") return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center max-w-md mx-auto">
      <div className="text-6xl animate-bounce">⚡</div>
      <h1 className="text-3xl font-bold tracking-tight">Daily Challenge</h1>
      <p className="text-[var(--color-text-2)]">
        {questions.length} preguntas · {TIME_PER_QUESTION}s por pregunta<br/>
        Responde rápido para ganar más puntos
      </p>
      <div className="grid grid-cols-2 gap-3 w-full">
        {OPTION_COLORS.map((c, i) => (
          <div key={i} className={`${c.bg} rounded-[var(--radius-lg)] p-4 flex items-center gap-3 text-white font-bold text-lg`}>
            <span>{c.icon}</span>
            <span className="text-sm opacity-80">Opción {String.fromCharCode(65+i)}</span>
          </div>
        ))}
      </div>
      <button onClick={() => setPhase("question")}
        className="px-10 py-4 rounded-full font-bold text-lg text-white transition-all hover:brightness-110 hover:-translate-y-1"
        style={{ background: "linear-gradient(135deg, var(--color-acc), var(--color-acc-2))", boxShadow: "0 8px 32px rgba(124,106,255,0.4)" }}>
        ¡Empezar! →
      </button>
    </div>
  );

  // ── RESULTS ──
  if (phase === "results") return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center max-w-sm mx-auto">
      <div className="text-5xl">{pct >= 80 ? "🏆" : pct >= 60 ? "👍" : "📚"}</div>
      <div>
        <p className="text-4xl font-bold text-[var(--color-acc)]">{points.toLocaleString()}</p>
        <p className="text-sm text-[var(--color-text-2)] mt-1">puntos totales</p>
      </div>
      <div className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--color-text-2)]">Correctas</span>
          <span className="font-bold text-emerald-400">{correctCount}/{questions.length}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--color-text-2)]">Precisión</span>
          <span className="font-bold">{pct}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--color-text-2)]">XP ganados</span>
          <span className="font-bold text-[var(--color-acc)]">+{pct >= 80 ? 200 : pct >= 60 ? 100 : 40}</span>
        </div>
        <div className="h-2 bg-[var(--color-surface-2)] rounded-full overflow-hidden mt-2">
          <div className="h-full rounded-full bg-[var(--color-acc)] transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <p className="text-[var(--color-text-2)] text-sm">
        {pct >= 80 ? "¡Excelente! Sigues siendo imparable 🔥" :
         pct >= 60 ? "Buen intento. ¡Sigue practicando!" :
         "No te rindas, cada error te enseña algo."}
      </p>
      <button onClick={restart}
        className="px-8 py-3 rounded-full font-semibold text-white transition-all hover:brightness-110"
        style={{ background: "linear-gradient(135deg, var(--color-acc), var(--color-acc-2))" }}>
        Jugar de nuevo ↻
      </button>
    </div>
  );

  // ── QUESTION / ANSWER ──
  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">

      {/* Streak badge */}
      {showStreak && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="px-6 py-3 rounded-full bg-orange-500 text-white font-bold text-lg shadow-2xl">
            🔥 {streak} en racha! +BONUS
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <span className="text-sm font-mono text-[var(--color-text-2)]">
          {current + 1} / {questions.length}
        </span>
        <div className="flex items-center gap-2">
          {streak >= 2 && <span className="text-xs text-orange-400 font-bold">🔥 ×{streak}</span>}
          <span className="text-sm font-mono font-bold text-[var(--color-acc)]">
            ⚡ {points.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Timer bar */}
      <div className="h-2 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${timerColor}`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      {/* Pregunta */}
      <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center relative overflow-hidden">
        {/* Countdown number */}
        {phase === "question" && (
          <div className={`absolute top-3 right-4 font-mono font-bold text-2xl transition-colors ${
            timeLeft <= 5 ? "text-red-500 animate-pulse" : "text-[var(--color-text-2)]"
          }`}>
            {timeLeft}
          </div>
        )}
        <p className="text-lg font-semibold leading-relaxed pr-8">{q?.question}</p>
      </div>

      {/* Opciones estilo Kahoot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {q?.options.map((opt, idx) => {
          const color = OPTION_COLORS[idx];
          const isSelected = selected === idx;
          const isCorrect  = idx === q.correct;
          const answered   = phase === "answer";

          let style = "";
          if (!answered) {
            style = `${color.bg} ${color.hover} text-white cursor-pointer hover:-translate-y-1`;
          } else if (isCorrect) {
            style = "bg-emerald-500 text-white scale-105";
          } else if (isSelected && !isCorrect) {
            style = "bg-red-500 text-white opacity-80";
          } else {
            style = "bg-[var(--color-surface-2)] text-[var(--color-text-3)] opacity-40";
          }

          return (
            <button key={idx} onClick={() => handleSelect(idx)} disabled={answered}
              className={`relative rounded-[var(--radius-lg)] p-5 font-semibold text-left transition-all duration-200 ${style}`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl opacity-80">{color.icon}</span>
                <span className="text-sm leading-snug">{opt}</span>
                {answered && isCorrect && <span className="ml-auto text-xl">✓</span>}
                {answered && isSelected && !isCorrect && <span className="ml-auto text-xl">✗</span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explicación + Next */}
      {phase === "answer" && (
        <div className="space-y-3 animate-[fadeIn_0.3s_ease]">
          <div className={`p-4 rounded-[var(--radius-lg)] border text-sm ${
            selected === q.correct
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}>
            <p className="font-semibold mb-1">
              {selected === null ? "⏱ Tiempo agotado" : selected === q.correct ? "✓ ¡Correcto!" : "✗ Incorrecto"}
              {selected === q.correct && timeLeft > 0 && (
                <span className="ml-2 text-xs opacity-75">
                  +{Math.round(500 + (timeLeft / TIME_PER_QUESTION) * 500)} pts
                </span>
              )}
            </p>
            <p className="text-[var(--color-text-2)] text-xs">💡 {q.explanation}</p>
          </div>

          <button onClick={nextQuestion}
            className="w-full py-3 rounded-[var(--radius-lg)] font-semibold text-white transition-all hover:brightness-110"
            style={{ background: "linear-gradient(135deg, var(--color-acc), var(--color-acc-2))" }}>
            {current < questions.length - 1 ? "Siguiente →" : "Ver resultado"}
          </button>
        </div>
      )}

      {/* Dots progreso */}
      <div className="flex justify-center gap-1.5 mt-2">
        {questions.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all ${
            i < current ? (answers[i] === questions[i].correct ? "bg-emerald-400 w-4" : "bg-red-400 w-4") :
            i === current ? "bg-[var(--color-acc)] w-6" :
            "bg-[var(--color-surface-2)] w-4"
          }`} />
        ))}
      </div>
    </div>
  );
}
