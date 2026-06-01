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

function getTimeUntilMidnight() {
  const now      = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff    = midnight.getTime() - now.getTime();
  const h       = Math.floor(diff / 3600000);
  const m       = Math.floor((diff % 3600000) / 60000);
  const s       = Math.floor((diff % 60000) / 1000);
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

export default function LimitBanner({ feature, used, limit, onWatchAd }: Props) {
  const info = FEATURE_INFO[feature];
  const [countdown, setCountdown] = useState(() => getTimeUntilMidnight());

  useEffect(() => {
    setCountdown(getTimeUntilMidnight());
    const id = setInterval(() => setCountdown(getTimeUntilMidnight()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-[var(--radius-lg)] border border-amber-500/30 bg-amber-500/10 p-4 space-y-3">
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0">{info.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-amber-400 text-sm">Límite diario alcanzado</p>
          <p className="text-xs text-[var(--color-text-2)] mt-0.5">
            Has usado {used}/{limit} {info.label} de hoy.
          </p>
        </div>
      </div>

      {/* Countdown */}
      <div className="flex items-center justify-between rounded-[var(--radius-md)] px-3 py-2"
        style={{ background: "rgba(0,0,0,0.25)" }}>
        <span className="text-xs text-[var(--color-text-2)]">⏰ Se reinicia en</span>
        <span className="font-mono font-bold text-amber-400 text-base tracking-widest">
          {countdown}
        </span>
      </div>

      {/* Barra */}
      <div className="h-1.5 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full transition-all"
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
