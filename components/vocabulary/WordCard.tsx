"use client";

import { useRef, useState } from "react";
import Badge from "@/components/ui/Badge";
import { apiFetch } from "@/lib/api";
import type { Word } from "@/lib/types";

interface Props {
  word: Word;
}

export default function WordCard({ word }: Props) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function speak() {
    if (playing) return;
    setPlaying(true);

    try {
      const res = await apiFetch("/api/tts/", {
        method: "POST",
        body: JSON.stringify({ text: word.word, voice: "female", speed: 0.85 }),
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
        audio.onended = () => { setPlaying(false); URL.revokeObjectURL(url); };
        audio.onerror = () => { setPlaying(false); fallback(); };
        await audio.play();
        return;
      }
    } catch {}

    fallback();
  }

  function fallback() {
    if (!("speechSynthesis" in window)) { setPlaying(false); return; }
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(word.word);
    utt.lang  = "en-US";
    utt.rate  = 0.85;
    utt.onend = utt.onerror = () => setPlaying(false);
    window.speechSynthesis.speak(utt);
  }

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 hover:border-[var(--color-border-2)] transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="font-semibold text-[var(--color-text)]">{word.word}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={speak}
            disabled={playing}
            aria-label="Escuchar pronunciación"
            className="text-[var(--color-text-3)] hover:text-[var(--color-acc)] transition-colors disabled:opacity-40"
          >
            {playing ? (
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-acc)] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--color-acc)]" />
              </span>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
            )}
          </button>
          <Badge variant="level">{word.level}</Badge>
        </div>
      </div>
      <p className="text-sm text-[var(--color-acc)]">{word.translation}</p>
      <p className="text-xs text-[var(--color-text-2)] mt-2 italic">"{word.example}"</p>
    </div>
  );
}
