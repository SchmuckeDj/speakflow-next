"use client";

import { useState } from "react";
import type { Verb } from "@/lib/types";
import Button from "@/components/ui/Button";
import { apiFetch } from "@/lib/api";

interface Props {
  verb: Verb | null;
  onClose: () => void;
}

async function speakWord(text: string, setPlaying: (v: string | null) => void) {
  setPlaying(text);
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
      audio.onended = () => { URL.revokeObjectURL(url); setPlaying(null); };
      audio.onerror = () => { setPlaying(null); fallback(text, setPlaying); };
      await audio.play();
      return;
    }
  } catch {}
  fallback(text, setPlaying);
}

function fallback(text: string, setPlaying: (v: string | null) => void) {
  if (!("speechSynthesis" in window)) { setPlaying(null); return; }
  window.speechSynthesis.cancel();
  const utt  = new SpeechSynthesisUtterance(text);
  utt.lang   = "en-US";
  utt.rate   = 0.85;
  utt.onend  = () => setPlaying(null);
  utt.onerror = () => setPlaying(null);
  window.speechSynthesis.speak(utt);
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
        disabled={!!playing}
        className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110 disabled:opacity-40"
        style={{ background: isPlaying ? "var(--color-acc)" : "rgba(124,106,255,0.15)" }}
        title={`Escuchar "${value}"`}
      >
        {isPlaying ? (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
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

  if (!verb) return null;

  function handlePlay(text: string) {
    speakWord(text, setPlaying);
  }

  // Al abrir el modal reproducir el infinitivo automáticamente
  function handleOpen() {
    setTimeout(() => speakWord(`to ${verb!.infinitive}`, setPlaying), 300);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
      ref={(el) => { if (el) handleOpen(); }}
    >
      <div
        className="bg-[var(--color-surface)] border border-[var(--color-border-2)] rounded-[var(--radius-xl)] p-6 w-full max-w-sm space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-semibold">to {verb.infinitive}</h2>
              <p className="text-sm text-[var(--color-acc)]">{verb.spanish}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[var(--color-text-2)] hover:text-[var(--color-text)] transition-colors text-lg">✕</button>
        </div>

        {/* Formas del verbo con audio */}
        <div className="grid grid-cols-2 gap-2">
          <VerbFormCard label="Infinitive"      value={verb.infinitive}             playing={playing} onPlay={handlePlay} />
          <VerbFormCard label="Past Simple"     value={verb.pastSimple}             playing={playing} onPlay={handlePlay} />
          <VerbFormCard label="Past Participle" value={verb.pastParticiple}         playing={playing} onPlay={handlePlay} />
          <VerbFormCard label="Present -ing"    value={verb.forms.presentParticiple} playing={playing} onPlay={handlePlay} />
        </div>

        {/* Formas adicionales */}
        <div className="space-y-1.5">
          <p className="text-xs text-[var(--color-text-3)] uppercase tracking-wider">Presente</p>
          <div className="grid grid-cols-2 gap-2">
            <VerbFormCard label="1ª / 2ª persona" value={verb.forms.present}      playing={playing} onPlay={handlePlay} />
            <VerbFormCard label="3ª persona"       value={verb.forms.presentThird} playing={playing} onPlay={handlePlay} />
          </div>
        </div>

        {/* Toca para escuchar hint */}
        <p className="text-xs text-center text-[var(--color-text-3)]">
          Toca 🔊 en cada forma para escuchar la pronunciación
        </p>

        <Button variant="ghost" className="w-full" onClick={onClose}>Cerrar</Button>
      </div>
    </div>
  );
}
