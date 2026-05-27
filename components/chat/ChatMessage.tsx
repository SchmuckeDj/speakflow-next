"use client";

import { useState } from "react";
import clsx from "clsx";
import type { ChatMessage as ChatMessageType } from "@/lib/types";
import { apiFetch } from "@/lib/api";

interface Props {
  message: ChatMessageType;
}

async function speakText(text: string, onEnd: () => void) {
  const clean = text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .trim();

  try {
    const res = await apiFetch("/api/tts/", {
      method: "POST",
      body: JSON.stringify({ text: clean.slice(0, 300), voice: "female", speed: 0.9 }),
    });
    if (res.ok) {
      const data   = await res.json();
      const binary = atob(data.audio_base64);
      const bytes  = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob  = new Blob([bytes], { type: "audio/mp3" });
      const url   = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => { URL.revokeObjectURL(url); onEnd(); };
      audio.onerror = () => { onEnd(); fallback(clean, onEnd); };
      await audio.play();
      return;
    }
  } catch {}
  fallback(clean, onEnd);
}

function fallback(text: string, onEnd: () => void) {
  if (!("speechSynthesis" in window)) { onEnd(); return; }
  window.speechSynthesis.cancel();
  const utt  = new SpeechSynthesisUtterance(text.slice(0, 300));
  utt.lang   = "en-US";
  utt.rate   = 0.9;
  utt.onend  = onEnd;
  utt.onerror = onEnd;
  window.speechSynthesis.speak(utt);
}

export default function ChatMessage({ message }: Props) {
  const isAI = message.role === "assistant";
  const [playing, setPlaying] = useState(false);

  function handlePlay() {
    if (playing) {
      window.speechSynthesis?.cancel();
      setPlaying(false);
      return;
    }
    setPlaying(true);
    speakText(message.content, () => setPlaying(false));
  }

  return (
    <div className={clsx("flex gap-3 group", !isAI && "flex-row-reverse")}>
      {/* Avatar */}
      {isAI && (
        <div className="w-7 h-7 rounded-full bg-[var(--color-acc)]/20 border border-[var(--color-acc)]/30 flex items-center justify-center text-xs text-[var(--color-acc)] shrink-0 mt-1">
          AI
        </div>
      )}

      {/* Bubble + botón reproducir */}
      <div className="flex flex-col gap-1 max-w-[75%]">
        <div className={clsx(
          "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isAI
            ? "bg-[var(--color-surface-2)] text-[var(--color-text)] rounded-tl-sm"
            : "bg-[var(--color-acc)] text-white rounded-tr-sm"
        )}>
          {message.content}
          {message.correction && (
            <p className="mt-1.5 text-xs opacity-70 border-t border-white/20 pt-1.5">
              ✎ {message.correction}
            </p>
          )}
        </div>

        {/* Botón reproducir — solo en mensajes AI, no en el init */}
        {isAI && message.id !== "init" && (
          <button
            onClick={handlePlay}
            title={playing ? "Detener" : "Reproducir"}
            className={clsx(
              "self-start flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-full border transition-all",
              playing
                ? "border-[var(--color-acc)]/50 bg-[var(--color-acc)]/10 text-[var(--color-acc)]"
                : "border-[var(--color-border)] text-[var(--color-text-3)] opacity-0 group-hover:opacity-100"
            )}>
            {playing ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-acc)] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-acc)]" />
                </span>
                Detener
              </>
            ) : (
              <>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Reproducir
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
