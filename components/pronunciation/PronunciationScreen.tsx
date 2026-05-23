"use client";

import { useState, useCallback, useRef } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { recordPronunciationSession } from "@/lib/hooks/useProgress";
import { useToast } from "@/components/ui/Toast";

const PRACTICE_WORDS = [
  { word: "through",       phonetic: "/θruː/",              difficulty: "hard"   },
  { word: "world",         phonetic: "/wɜːrld/",             difficulty: "medium" },
  { word: "three",         phonetic: "/θriː/",               difficulty: "hard"   },
  { word: "clothes",       phonetic: "/kloʊðz/",             difficulty: "hard"   },
  { word: "comfortable",   phonetic: "/ˈkʌmftəbl/",          difficulty: "medium" },
  { word: "literally",     phonetic: "/ˈlɪtərəli/",          difficulty: "easy"   },
  { word: "specifically",  phonetic: "/spəˈsɪfɪkli/",        difficulty: "medium" },
  { word: "Wednesday",     phonetic: "/ˈwɛnzdeɪ/",           difficulty: "hard"   },
  { word: "pronunciation", phonetic: "/prəˌnʌnsiˈeɪʃən/",   difficulty: "hard"   },
  { word: "colonel",       phonetic: "/ˈkɜːrnəl/",           difficulty: "hard"   },
  { word: "February",      phonetic: "/ˈfɛbjuɛri/",          difficulty: "medium" },
  { word: "entrepreneur",  phonetic: "/ˌɑːntrəprəˈnɜːr/",   difficulty: "hard"   },
];

const DIFF_STYLE: Record<string, string> = {
  easy:   "bg-emerald-500/20 text-emerald-400",
  medium: "bg-amber-500/20 text-amber-400",
  hard:   "bg-red-500/20 text-red-400",
};

function calcScore(spoken: string, target: string): number {
  const a = spoken.toLowerCase().trim();
  const b = target.toLowerCase().trim();
  if (a === b) return 100;
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  const dist = dp[m][n];
  const maxLen = Math.max(m, n);
  return Math.round(Math.max(0, (1 - dist / maxLen) * 100));
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

export default function PronunciationScreen() {
  const [activeIdx, setActiveIdx]   = useState(0);
  const [recording, setRecording]   = useState(false);
  const [speaking, setSpeaking]     = useState(false);
  const [score, setScore]           = useState<number | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [noSupport, setNoSupport]   = useState(false);
  const recognitionRef              = useRef<unknown>(null);
  const { showToast }               = useToast();

  const word = PRACTICE_WORDS[activeIdx];

  const speak = useCallback(() => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(word.word);
    utt.lang    = "en-US";
    utt.rate    = 0.85;
    utt.onstart = () => setSpeaking(true);
    utt.onend   = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
  }, [word.word]);

  function startRecording() {
    const SR =
      (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
        .SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;

    if (!SR) {
      setNoSupport(true);
      showToast("Tu navegador no soporta reconocimiento de voz. Usa Chrome, Brave o Edge.", "error");
      return;
    }

    setScore(null);
    setTranscript(null);
    setRecording(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new (SR as any)();
    recognition.lang            = "en-US";
    recognition.interimResults  = false;
    recognition.maxAlternatives = 3;

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const results = e.results[0];
      let bestScore = 0;
      let bestTranscript = "";
      for (let i = 0; i < results.length; i++) {
        const t = results[i].transcript;
        const s = calcScore(t, word.word);
        if (s > bestScore) { bestScore = s; bestTranscript = t; }
      }
      setTranscript(bestTranscript);
      setScore(bestScore);
      setRecording(false);
      recordPronunciationSession(bestScore);
      if (bestScore === 100) showToast("¡Pronunciación perfecta! 🎉", "success");
      else if (bestScore >= 80) showToast(`Muy bien — ${bestScore}/100`, "success");
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      setRecording(false);
      if (e.error === "no-speech")    showToast("No se detectó voz. Intenta de nuevo.", "info");
      else if (e.error === "not-allowed") showToast("Permiso de micrófono denegado.", "error");
      else if (e.error === "network")  showToast("Error de red. En Brave, verifica que Shields no bloquee el micrófono.", "error");
    };

    recognition.onend = () => setRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
  }

  function stopRecording() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (recognitionRef.current as any)?.stop();
    setRecording(false);
  }

  function toggleRecord() {
    if (recording) stopRecording();
    else startRecording();
  }

  function changeWord(idx: number) {
    window.speechSynthesis?.cancel();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (recognitionRef.current as any)?.abort();
    setSpeaking(false);
    setRecording(false);
    setScore(null);
    setTranscript(null);
    setActiveIdx(idx);
  }

  const scoreColor =
    score === null   ? "" :
    score >= 90      ? "text-emerald-400" :
    score >= 70      ? "text-amber-400" :
                       "text-red-400";

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Pronunciación</h1>
        <p className="text-sm text-[var(--color-text-2)] mt-1">Escucha · Graba · Mejora</p>
      </div>

      <Card glow className="text-center py-10 space-y-3">
        <p className="text-5xl font-serif font-medium text-[var(--color-text)]">{word.word}</p>
        <p className="text-[var(--color-acc)] font-mono text-lg">{word.phonetic}</p>
        <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${DIFF_STYLE[word.difficulty]}`}>
          {word.difficulty}
        </span>
      </Card>

      {score !== null && (
        <Card className="text-center py-5 space-y-2">
          <p className={`text-4xl font-bold ${scoreColor}`}>
            {score}<span className="text-base text-[var(--color-text-2)] font-normal">/100</span>
          </p>
          {transcript && (
            <p className="text-sm text-[var(--color-text-2)]">
              Escuché: <span className="font-mono text-[var(--color-text)]">"{transcript}"</span>
            </p>
          )}
          <p className="text-sm text-[var(--color-text-2)]">
            {score === 100 ? "¡Pronunciación perfecta! 🎉" :
             score >= 90   ? "¡Excelente! Casi nativo." :
             score >= 75   ? "Muy bien, sigue practicando." :
             score >= 50   ? "Intenta de nuevo, escucha el fonema." :
                             "Escucha primero y repite despacio."}
          </p>
          <button onClick={() => { setScore(null); setTranscript(null); }}
            className="text-xs text-[var(--color-acc)] hover:underline">
            Intentar de nuevo
          </button>
        </Card>
      )}

      <div className="flex gap-3 justify-center flex-wrap">
        <Button variant="ghost" onClick={() => changeWord((activeIdx - 1 + PRACTICE_WORDS.length) % PRACTICE_WORDS.length)}>←</Button>

        <Button variant="ghost" onClick={speak} disabled={speaking} className="flex items-center gap-2">
          {speaking ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-acc)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-acc)]" />
              </span>
              Sonando...
            </>
          ) : "🔊 Escuchar"}
        </Button>

        <Button onClick={toggleRecord} disabled={noSupport} size="md"
          className={recording ? "bg-red-500 hover:brightness-110" : ""}>
          {recording ? (
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              Grabando...
            </span>
          ) : "🎙 Grabar"}
        </Button>

        <Button variant="ghost" onClick={() => changeWord((activeIdx + 1) % PRACTICE_WORDS.length)}>→</Button>
      </div>

      <p className="text-xs text-center text-[var(--color-text-3)]">
        {noSupport
          ? "⚠️ Usa Chrome, Brave o Edge para reconocimiento de voz"
          : "Presiona Grabar, di la palabra en inglés y espera el resultado"}
      </p>

      <div className="grid grid-cols-3 gap-2">
        {PRACTICE_WORDS.map((w, i) => (
          <button key={w.word} onClick={() => changeWord(i)}
            className={`text-sm py-2 px-3 rounded-[var(--radius-md)] border transition-all ${
              i === activeIdx
                ? "border-[var(--color-acc)] bg-[var(--color-acc)]/10 text-[var(--color-acc)]"
                : "border-[var(--color-border)] text-[var(--color-text-2)] hover:border-[var(--color-border-2)]"
            }`}>
            {w.word}
          </button>
        ))}
      </div>
    </div>
  );
}
