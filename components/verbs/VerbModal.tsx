"use client";

import { useState, useEffect } from "react";
import type { Verb } from "@/lib/types";
import Button from "@/components/ui/Button";
import { apiFetch } from "@/lib/api";

interface Props {
  verb: Verb | null;
  onClose: () => void;
}

function speakFallback(text: string, onEnd: () => void) {
  if (!("speechSynthesis" in window)) { onEnd(); return; }
  window.speechSynthesis.cancel();
  const utt   = new SpeechSynthesisUtterance(text);
  utt.lang    = "en-US";
  utt.rate    = 0.85;
  utt.onend   = onEnd;
  utt.onerror = onEnd;
  window.speechSynthesis.speak(utt);
}

async function speakWord(text: string, setPlaying: (v: string | null) => void) {
  setPlaying(text);

  // Hablar inmediatamente con Web Speech mientras carga TTS
  speakFallback(text, () => {});

  try {
    const res = await apiFetch("/api/tts/", {
      method: "POST",
      body: JSON.stringify({ text, voice: "female", speed: 0.85 }),
    });
    if (res.ok) {
      const data   = await res.json();
      const binary = atob(data.audio_base64);
      const bytes  = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob   = new Blob([bytes], { type: "audio/mp3" });
      const url    = URL.createObjectURL(blob);
      const audio  = new Audio(url);
      // Cancelar el Web Speech y reemplazar con el TTS de Google
      window.speechSynthesis?.cancel();
      audio.onended = () => { URL.revokeObjectURL(url); setPlaying(null); };
      audio.onerror = () => { setPlaying(null); };
      await audio.play();
      return;
    }
  } catch {}

  // Si TTS falla, el Web Speech ya está hablando — solo terminar el estado
  setPlaying(null);
}

interface VerbFormCardProps {
  label:   string;
  value:   string;
  playing: string | null;
  onPlay:  (text: string) => void;
}

function VerbFormCard({ label, value, playing, onPlay }: VerbFormCardProps) {
  const isPlaying = playing === value;
  return (
    <div className="bg-[var(--color-surface-2)] rounded-[var(--radius-md)] p-3 flex items-center justify-between gap-2">
      <div>
        <p className="text-[var(--color-text-3)] text-xs mb-0.5">{label}</p>
        <p className="font-mono font-medium text-sm">{value}</p>
      </div>
      <button
        onClick={() => onPlay(value)}
        disabled={!!playing && !isPlaying}
        className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110 disabled:opacity-40"
        style={{ background: isPlaying ? "var(--color-acc)" : "rgba(124,106,255,0.15)" }}
        title={`Escuchar "${value}"`}
      >
        {isPlaying ? (
          <span className="flex gap-0.5 items-end h-3">
            {[0,1,2].map((i) => (
              <span key={i} className="w-0.5 bg-white rounded-full animate-bounce"
                style={{ height: `${6 + i * 2}px`, animationDelay: `${i * 0.1}s` }} />
            ))}
          </span>
        ) : (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--color-acc)" strokeWidth="2.5">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          </svg>
        )}
      </button>
    </div>
  );
}

export default function VerbModal({ verb, onClose }: Props) {
  const [playing, setPlaying] = useState<string | null>(null);

  // Reproducir el infinitivo al abrir — solo una vez
  useEffect(() => {
    if (!verb) return;
    const timer = setTimeout(() => {
      speakWord(verb.infinitive, setPlaying);
    }, 200);
    return () => {
      clearTimeout(timer);
      window.speechSynthesis?.cancel();
      setPlaying(null);
    };
  }, [verb?.id]); // solo cuando cambia el verbo

  if (!verb) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border-2)] rounded-[var(--radius-xl)] p-6 w-full max-w-sm space-y-4"
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">to {verb.infinitive}</h2>
            <p className="text-sm text-[var(--color-acc)]">{verb.spanish}</p>
          </div>
          <button onClick={onClose} className="text-[var(--color-text-2)] hover:text-[var(--color-text)] transition-colors text-lg">✕</button>
        </div>

        {/* Formas principales */}
        <div className="grid grid-cols-2 gap-2">
          <VerbFormCard label="Infinitive"      value={verb.infinitive}              playing={playing} onPlay={(t) => speakWord(t, setPlaying)} />
          <VerbFormCard label="Past Simple"     value={verb.pastSimple}              playing={playing} onPlay={(t) => speakWord(t, setPlaying)} />
          <VerbFormCard label="Past Participle" value={verb.pastParticiple}          playing={playing} onPlay={(t) => speakWord(t, setPlaying)} />
          <VerbFormCard label="Present -ing"    value={verb.forms.presentParticiple} playing={playing} onPlay={(t) => speakWord(t, setPlaying)} />
        </div>

        {/* Presente */}
        <div className="space-y-1.5">
          <p className="text-xs text-[var(--color-text-3)] uppercase tracking-wider">Presente</p>
          <div className="grid grid-cols-2 gap-2">
            <VerbFormCard label="I / You / We"  value={verb.forms.present}      playing={playing} onPlay={(t) => speakWord(t, setPlaying)} />
            <VerbFormCard label="He / She / It" value={verb.forms.presentThird} playing={playing} onPlay={(t) => speakWord(t, setPlaying)} />
          </div>
        </div>

        <p className="text-xs text-center text-[var(--color-text-3)]">
          Toca 🔊 en cada forma para escuchar
        </p>

        <Button variant="ghost" className="w-full" onClick={onClose}>Cerrar</Button>
      </div>
    </div>
  );
}
