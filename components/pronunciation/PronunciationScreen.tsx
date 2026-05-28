"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { recordPronunciationSession } from "@/lib/hooks/useProgress";
import { useToast } from "@/components/ui/Toast";
import { apiFetch } from "@/lib/api";
import { getWordsForLevel } from "@/lib/data/vocabulary";
import type { Word } from "@/lib/types";

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
  return Math.round(Math.max(0, (1 - dp[m][n] / Math.max(m, n)) * 100));
}

interface SpeechRecognitionEvent extends Event { results: SpeechRecognitionResultList; }
interface SpeechRecognitionErrorEvent extends Event { error: string; }

const DIFF_COLOR: Record<string, string> = {
  A1: "text-emerald-400", A2: "text-green-400",
  B1: "text-blue-400",    B2: "text-violet-400",
  C1: "text-orange-400",  C2: "text-red-400",
};

export default function PronunciationScreen() {
  const [userLevel, setUserLevel]   = useState("B1");
  const [words, setWords]           = useState<Word[]>([]);
  const [activeIdx, setActiveIdx]   = useState(0);
  const [recording, setRecording]   = useState(false);
  const [speaking, setSpeaking]     = useState(false);
  const [score, setScore]           = useState<number | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [noSupport, setNoSupport]   = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const recognitionRef = useRef<unknown>(null);
  const audioRef       = useRef<HTMLAudioElement | null>(null);
  const { showToast }  = useToast();

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("sf_user") || "{}");
      const level = user.level || "B1";
      setUserLevel(level);
      const available = getWordsForLevel(level).filter((w) => w.phonetic);
      setWords(available);
    } catch {
      const available = getWordsForLevel("B1").filter((w) => w.phonetic);
      setWords(available);
    }
  }, []);

  const word = words[activeIdx];

  const speak = useCallback(async () => {
    if (!word || speaking) return;
    setSpeaking(true);
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    window.speechSynthesis?.cancel();

    try {
      const res = await apiFetch("/api/tts/", {
        method: "POST",
        body: JSON.stringify({ text: word.word, voice: "female", speed: 0.8 }),
      });
      if (res.ok) {
        const data   = await res.json();
        const binary = atob(data.audio_base64);
        const bytes  = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const blob   = new Blob([bytes], { type: "audio/mp3" });
        const url    = URL.createObjectURL(blob);
        const audio  = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => { setSpeaking(false); URL.revokeObjectURL(url); };
        audio.onerror = () => { setSpeaking(false); fallbackSpeak(); };
        await audio.play();
        return;
      }
    } catch {}
    fallbackSpeak();
  }, [word, speaking]);

  function fallbackSpeak() {
    if (!word || !("speechSynthesis" in window)) { setSpeaking(false); return; }
    const utt = new SpeechSynthesisUtterance(word.word);
    utt.lang = "en-US"; utt.rate = 0.85;
    utt.onend = utt.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
  }

  function startRecording() {
    const SR =
      (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
        .SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;

    if (!SR) { setNoSupport(true); showToast("Usa Chrome, Brave o Edge.", "error"); return; }

    setScore(null); setTranscript(null); setRecording(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new (SR as any)();
    recognition.lang = "en-US"; recognition.interimResults = false; recognition.maxAlternatives = 3;

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const results = e.results[0];
      let bestScore = 0, bestTranscript = "";
      for (let i = 0; i < results.length; i++) {
        const t = results[i].transcript;
        const s = calcScore(t, word.word);
        if (s > bestScore) { bestScore = s; bestTranscript = t; }
      }
      setTranscript(bestTranscript); setScore(bestScore); setRecording(false);
      recordPronunciationSession(bestScore);
      if (bestScore === 100) showToast("¡Pronunciación perfecta! 🎉", "success");
      else if (bestScore >= 80) showToast(`Muy bien — ${bestScore}/100`, "success");
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      setRecording(false);
      if (e.error === "no-speech") showToast("No se detectó voz.", "info");
      else if (e.error === "not-allowed") showToast("Permiso de micrófono denegado.", "error");
    };

    recognition.onend = () => setRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
  }

  function changeWord(idx: number) {
    window.speechSynthesis?.cancel();
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (recognitionRef.current as any)?.abort();
    setSpeaking(false); setRecording(false);
    setScore(null); setTranscript(null); setShowTranslation(false);
    setActiveIdx(idx);
  }

  const scoreColor =
    score === null ? "" : score >= 90 ? "text-emerald-400" : score >= 70 ? "text-amber-400" : "text-red-400";

  if (!word) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-[var(--color-text-2)]">Cargando palabras...</p>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Pronunciación</h1>
          <p className="text-sm text-[var(--color-text-2)] mt-0.5">
            {words.length} palabras · Nivel <span className="text-[var(--color-acc)] font-medium">{userLevel}</span>
          </p>
        </div>
        <Badge variant="level">{word.level}</Badge>
      </div>

      {/* Palabra principal */}
      <Card glow className="text-center py-10 space-y-3">
        <p className="text-5xl font-serif font-medium text-[var(--color-text)]">{word.word}</p>
        {word.phonetic && (
          <p className={`font-mono text-lg ${DIFF_COLOR[word.level] ?? "text-[var(--color-acc)]"}`}>
            {word.phonetic}
          </p>
        )}
        <p className="text-xs text-[var(--color-text-3)]">{word.category}</p>

        {/* Traducción */}
        <button onClick={() => setShowTranslation((v) => !v)}
          className="text-xs text-[var(--color-acc)] hover:underline transition-all">
          {showTranslation ? "Ocultar traducción" : "Ver traducción"}
        </button>
        {showTranslation && (
          <div className="space-y-1 animate-[fadeIn_0.2s_ease]">
            <p className="text-base font-medium text-[var(--color-text)]">{word.translation}</p>
            <p className="text-xs text-[var(--color-text-2)] italic">{word.example}</p>
          </div>
        )}
      </Card>

      {/* Resultado */}
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

      {/* Controles */}
      <div className="flex gap-3 justify-center flex-wrap">
        <Button variant="ghost" onClick={() => changeWord((activeIdx - 1 + words.length) % words.length)}>←</Button>

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

        <Button onClick={() => recording ? (recognitionRef.current as any)?.stop?.() || setRecording(false) : startRecording()}
          disabled={noSupport} size="md"
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

        <Button variant="ghost" onClick={() => changeWord((activeIdx + 1) % words.length)}>→</Button>
      </div>

      <p className="text-xs text-center text-[var(--color-text-3)]">
        {noSupport ? "⚠️ Usa Chrome, Brave o Edge" : "Escucha · Repite · Mejora"}
      </p>

      {/* Grid de palabras */}
      <div className="grid grid-cols-3 gap-2">
        {words.map((w, i) => (
          <button key={w.id} onClick={() => changeWord(i)}
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
