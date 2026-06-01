"use client";

import { useEffect, useState } from "react";

interface Props {
  feature:    "chat" | "challenge" | "vocab" | "tts";
  used:       number;
  limit:      number;
  onWatchAd?: () => void;
}

const FEATURE_INFO = {
  chat:      { label: "mensajes de chat",            icon: "💬" },
  challenge: { label: "challenges diarios",           icon: "⚡" },
  vocab:     { label: "generaciones de vocabulario", icon: "📚" },
  tts:       { label: "reproducciones de voz",       icon: "🔊" },
};

function getTimeUntilMidnight(): string {
  const now       = new Date();
  const midnight  = new Date();
  midnight.setHours(24, 0, 0, 0);
  const diff      = midnight.getTime() - now.getTime();
  const hours     = Math.floor(diff / (1000 * 60 * 60));
  const minutes   = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds   = Math.floor((diff % (1000 * 60)) / 1000);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function LimitBanner({ feature, used, limit, onWatchAd }: Props) {
  const info = FEATURE_INFO[feature];
  const [countdown, setCountdown] = useState(getTimeUntilMidnight());

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getTimeUntilMidnight());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-[var(--radius-lg)] border border-amber-500/30 bg-amber-500/10 p-4 space-y-3">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{info.icon}</span>
        <div className="flex-1">
          <p className="font-semibold text-amber-400 text-sm">Límite diario alcanzado</p>
          <p className="text-xs text-[var(--color-text-2)] mt-0.5">
            Has usado {used}/{limit} {info.label} de hoy.
          </p>
        </div>
      </div>

      {/* Countdown */}
      <div className="flex items-center justify-between bg-black/20 rounded-[var(--radius-md)] px-3 py-2">
        <span className="text-xs text-[var(--color-text-2)]">Se reinicia en</span>
        <span className="font-mono font-bold text-amber-400 text-sm tracking-widest">
          {countdown}
        </span>
      </div>

      {/* Barra progreso */}
      <div className="h-1.5 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full"
          style={{ width: `${Math.min((used / limit) * 100, 100)}%` }} />
      </div>

      {onWatchAd && (
        <button onClick={onWatchAd}
          className="w-full py-2.5 rounded-[var(--radius-md)] text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "white" }}>
          📺 Ver anuncio para continuar (+{limit} usos)
        </button>
      )}

      <p className="text-xs text-center text-[var(--color-text-3)]">
        ¿Usas SpeakFlow mucho? Considera apoyar el proyecto 💜
      </p>
    </div>
  );
}
