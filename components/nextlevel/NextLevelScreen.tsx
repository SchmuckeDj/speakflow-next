"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

interface Question {
  question:    string;
  options:     string[];
  correct:     number;
  explanation: string;
}

const XP_TO_UNLOCK: Record<string, number> = {
  A1: 3000, A2: 6000, B1: 10000, B2: 15000, C1: 25000,
};

const NEXT_LEVEL: Record<string, string> = {
  A1: "A2", A2: "B1", B1: "B2", B2: "C1", C1: "C2",
};

export default function NextLevelScreen() {
  const router = useRouter();
  const [phase, setPhase]               = useState<"locked"|"ready"|"loading"|"exam"|"result">("loading");
  const [questions, setQuestions]       = useState<Question[]>([]);
  const [answers, setAnswers]           = useState<(number|null)[]>([]);
  const [current, setCurrent]           = useState(0);
  const [result, setResult]             = useState<{ passed: boolean; score: number; old_level?: string; new_level?: string; message?: string } | null>(null);
  const [currentLevel, setCurrentLevel] = useState("");
  const [nextLevel, setNextLevel]       = useState("");
  const [userXP, setUserXP]             = useState(0);
  const [submitting, setSubmitting]     = useState(false);
  const [timeLeft, setTimeLeft]         = useState(45);

  useEffect(() => {
    try {
      const user     = JSON.parse(localStorage.getItem("sf_user") || "{}");
      const progress = JSON.parse(localStorage.getItem("sf_progress") || "{}");
      const lvl      = user.level || "A1";
      const xp       = progress.xp || 0;
      setCurrentLevel(lvl);
      setUserXP(xp);
      const needed = XP_TO_UNLOCK[lvl] ?? 99999;
      setPhase(xp >= needed ? "ready" : "locked");
    } catch { setPhase("locked"); }
  }, []);

  useEffect(() => {
    if (phase !== "exam") return;
    setTimeLeft(45);
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(id); handleAnswer(null); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, phase]);

  async function startExam() {
    setPhase("loading");
    try {
      const res  = await apiFetch("/api/next-level/");
      const data = await res.json();
      if (!res.ok) { alert(data.error); setPhase("ready"); return; }
      setQuestions(data.questions);
      setNextLevel(data.next_level);
      setAnswers(Array(data.questions.length).fill(null));
      setCurrent(0);
      setPhase("exam");
    } catch { alert("Error conectando al servidor."); setPhase("ready"); }
  }

  function handleAnswer(idx: number | null) {
    if (phase !== "exam") return;
    const next = [...answers];
    next[current] = idx;
    setAnswers(next);
    if (current < questions.length - 1) {
      setTimeout(() => setCurrent((c) => c + 1), idx !== null ? 600 : 0);
    } else {
      submitExam(next);
    }
  }

  async function submitExam(finalAnswers: (number | null)[]) {
    setSubmitting(true);
    const correct = finalAnswers.filter((a, i) => a === questions[i]?.correct).length;
    try {
      const res  = await apiFetch("/api/next-level/submit/", {
        method: "POST",
        body:   JSON.stringify({ correct, total: questions.length }),
      });
      const data = await res.json();
      if (data.passed) {
        const user = JSON.parse(localStorage.getItem("sf_user") || "{}");
        localStorage.setItem("sf_user", JSON.stringify({ ...user, level: data.new_level }));
        const prog = JSON.parse(localStorage.getItem("sf_progress") || "{}");
        localStorage.setItem("sf_progress", JSON.stringify({ ...prog, xp: 0 }));
      }
      setResult({ ...data, correct } as typeof result);
      setPhase("result");
    } catch { alert("Error enviando resultados."); }
    finally { setSubmitting(false); }
  }

  const needed     = XP_TO_UNLOCK[currentLevel] ?? 99999;
  const xpPct      = Math.min((userXP / needed) * 100, 100);
  const q          = questions[current];
  const timerPct   = (timeLeft / 45) * 100;
  const timerColor = timeLeft > 20 ? "bg-emerald-400" : timeLeft > 10 ? "bg-yellow-400" : "bg-red-500";

  if (phase === "locked") return (
    <div className="max-w-md mx-auto space-y-6 text-center pt-8">
      <div className="text-5xl">🔒</div>
      <div>
        <h1 className="text-2xl font-bold">Examen de Nivel</h1>
        <p className="text-[var(--color-text-2)] mt-2">
          Necesitas <span className="text-[var(--color-acc)] font-bold">{needed.toLocaleString()} XP</span> para el examen{" "}
          <span className="font-medium">{currentLevel} → {NEXT_LEVEL[currentLevel] ?? "C2"}</span>
        </p>
      </div>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--color-text-2)]">Tu XP actual</span>
          <span className="font-mono font-bold text-[var(--color-acc)]">{userXP.toLocaleString()} / {needed.toLocaleString()}</span>
        </div>
        <div className="h-3 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${xpPct}%`, background: "linear-gradient(90deg, var(--color-acc), var(--color-acc-2))" }} />
        </div>
        <p className="text-xs text-[var(--color-text-3)]">
          Faltan <span className="text-[var(--color-acc)] font-medium">{Math.max(0, needed - userXP).toLocaleString()} XP</span> — practica en Chat, Challenge y Word Attack
        </p>
      </div>
      <button onClick={() => router.push("/dashboard")} className="text-sm text-[var(--color-acc)] hover:underline">← Volver al dashboard</button>
    </div>
  );

  if (phase === "loading") return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-8 h-8 rounded-full border-2 border-[var(--color-acc)] border-t-transparent animate-spin" />
      <p className="text-sm text-[var(--color-text-2)]">La IA está generando tu examen de nivel {currentLevel}...</p>
    </div>
  );

  if (phase === "ready") return (
    <div className="max-w-md mx-auto space-y-6 text-center pt-8">
      <div className="text-5xl animate-bounce">🎓</div>
      <div>
        <h1 className="text-2xl font-bold">¡Listo para el examen!</h1>
        <p className="text-[var(--color-text-2)] mt-2">
          Demuestra que dominas el nivel <span className="text-[var(--color-acc)] font-bold">{currentLevel}</span> y sube al siguiente
        </p>
      </div>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 space-y-3 text-left">
        {[
          { icon: "📝", text: "20 preguntas generadas por IA según tu nivel" },
          { icon: "⏱",  text: "45 segundos por pregunta" },
          { icon: "🎯", text: "Necesitas 85% o más para pasar (17/20)" },
          { icon: "🔓", text: `Si pasas, subes a ${NEXT_LEVEL[currentLevel] ?? "C2"} y se desbloquean nuevas palabras` },
          { icon: "⚡", text: "Tu XP se reinicia para el nuevo nivel" },
        ].map((item) => (
          <div key={item.text} className="flex items-start gap-3 text-sm">
            <span className="text-lg shrink-0">{item.icon}</span>
            <span className="text-[var(--color-text-2)]">{item.text}</span>
          </div>
        ))}
      </div>
      <button onClick={startExam}
        className="w-full py-4 rounded-[var(--radius-lg)] font-bold text-white transition-all hover:brightness-110"
        style={{ background: "linear-gradient(135deg, var(--color-acc), var(--color-acc-2))", boxShadow: "0 8px 24px rgba(124,106,255,0.4)" }}>
        Comenzar examen →
      </button>
    </div>
  );

  if (phase === "result" && result) return (
    <div className="max-w-md mx-auto space-y-6 text-center pt-8">
      <div className="text-6xl">{result.passed ? "🏆" : "📚"}</div>
      <h1 className="text-3xl font-black">{result.passed ? "¡Nivel superado!" : "Casi lo logras"}</h1>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--color-text-2)]">Puntuación</span>
          <span className={`font-bold text-lg ${result.passed ? "text-emerald-400" : "text-red-400"}`}>{result.score}%</span>
        </div>
        <div className="h-2 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${result.score}%`, background: result.passed ? "linear-gradient(90deg,#10b981,#34d399)" : "linear-gradient(90deg,#ef4444,#f87171)" }} />
        </div>
        <div className="flex justify-between text-xs text-[var(--color-text-3)]">
          <span>Mínimo: 85%</span>
          <span className={result.passed ? "text-emerald-400" : "text-red-400"}>{result.passed ? "✓ Aprobado" : "✗ No aprobado"}</span>
        </div>
        {result.passed && (
          <div className="pt-2 border-t border-[var(--color-border)] text-sm">
            <p className="text-emerald-400 font-semibold">{result.old_level} → {result.new_level} desbloqueado 🎉</p>
            <p className="text-xs text-[var(--color-text-3)] mt-1">Tu XP se reinició para el nuevo nivel</p>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <button onClick={() => router.push("/dashboard")}
          className="w-full py-3 rounded-[var(--radius-lg)] font-semibold text-white"
          style={{ background: "linear-gradient(135deg, var(--color-acc), var(--color-acc-2))" }}>
          {result.passed ? "Ver mi nuevo nivel →" : "Seguir practicando →"}
        </button>
        {!result.passed && (
          <button onClick={() => { setPhase("ready"); setResult(null); }}
            className="w-full py-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] text-sm text-[var(--color-text-2)]">
            Intentar de nuevo
          </button>
        )}
      </div>
    </div>
  );

  if (phase === "exam" && q) return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-mono text-[var(--color-text-2)]">{current + 1} / {questions.length}</span>
        <span className="text-xs px-2 py-1 rounded-full bg-[var(--color-acc)]/15 text-[var(--color-acc)]">Examen {currentLevel} → {nextLevel}</span>
        <span className={`text-sm font-mono font-bold ${timeLeft <= 10 ? "text-red-400 animate-pulse" : "text-[var(--color-text-2)]"}`}>⏱ {timeLeft}s</span>
      </div>
      <div className="h-1.5 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-1000 ${timerColor}`} style={{ width: `${timerPct}%` }} />
      </div>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6">
        <p className="text-base font-medium leading-relaxed">{q.question}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {q.options.map((opt, idx) => {
          const answered   = answers[current] !== null;
          const isSelected = answers[current] === idx;
          const isCorrect  = idx === q.correct;
          let style = "";
          if (!answered) style = "border-[var(--color-border-2)] hover:border-[var(--color-acc)]/60 hover:bg-[var(--color-acc)]/5 cursor-pointer";
          else if (isCorrect) style = "border-emerald-500 bg-emerald-500/10 text-emerald-400";
          else if (isSelected) style = "border-red-500 bg-red-500/10 text-red-400";
          else style = "border-[var(--color-border)] opacity-40";
          return (
            <button key={idx} disabled={answered || submitting} onClick={() => handleAnswer(idx)}
              className={`text-left p-4 rounded-[var(--radius-lg)] border text-sm transition-all ${style}`}>
              <span className="font-mono text-xs opacity-60 mr-2">{String.fromCharCode(65+idx)}.</span>
              {opt}
              {answered && isCorrect && <span className="ml-2">✓</span>}
              {answered && isSelected && !isCorrect && <span className="ml-2">✗</span>}
            </button>
          );
        })}
      </div>
      {answers[current] !== null && (
        <div className={`p-3 rounded-[var(--radius-md)] border text-sm ${answers[current] === q.correct ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
          💡 {q.explanation}
        </div>
      )}
      <div className="flex justify-center gap-1 flex-wrap">
        {questions.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all ${
            i < current ? (answers[i] === questions[i].correct ? "bg-emerald-400 w-4" : "bg-red-400 w-4") :
            i === current ? "bg-[var(--color-acc)] w-6" : "bg-[var(--color-surface-2)] w-4"
          }`} />
        ))}
      </div>
    </div>
  );

  return null;
}
