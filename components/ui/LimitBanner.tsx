"use client";

interface Props {
  feature:  "chat" | "challenge" | "vocab" | "tts";
  used:     number;
  limit:    number;
  onWatchAd?: () => void;
}

const FEATURE_INFO = {
  chat:      { label: "mensajes de chat",         icon: "💬", reset: "mañana a medianoche" },
  challenge: { label: "challenges diarios",        icon: "⚡", reset: "mañana a medianoche" },
  vocab:     { label: "generaciones de vocabulario", icon: "📚", reset: "mañana a medianoche" },
  tts:       { label: "reproducciones de voz",    icon: "🔊", reset: "mañana a medianoche" },
};

export default function LimitBanner({ feature, used, limit, onWatchAd }: Props) {
  const info = FEATURE_INFO[feature];

  return (
    <div className="rounded-[var(--radius-lg)] border border-amber-500/30 bg-amber-500/10 p-4 space-y-3">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{info.icon}</span>
        <div>
          <p className="font-semibold text-amber-400 text-sm">Límite diario alcanzado</p>
          <p className="text-xs text-[var(--color-text-2)] mt-0.5">
            Has usado {used}/{limit} {info.label} de hoy.
            Se reinicia {info.reset}.
          </p>
        </div>
      </div>

      {/* Barra de progreso */}
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
