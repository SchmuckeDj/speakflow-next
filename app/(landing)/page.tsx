import Link from "next/link";

const FEATURES = [
  {
    icon: "✦",
    title: "AI Chat Coach",
    desc: "Practica conversaciones reales en inglés con IA que corrige tus errores al instante. Job interviews, viajes, gaming — elige tu escenario.",
  },
  {
    icon: "◎",
    title: "Pronunciación",
    desc: "Graba tu voz y recibe un score detallado por fonema. Entrena el acento americano con feedback inmediato.",
  },
  {
    icon: "◈",
    title: "Word Attack",
    desc: "Destruye meteoritos escribiendo palabras en inglés. 10 niveles de dificultad A1 → C2, con boss fights épicos.",
  },
  {
    icon: "▣",
    title: "Vocabulary Bank",
    desc: "Más de 100 palabras organizadas por nivel CEFR. Marca las que ya dominas y enfócate en las que necesitas.",
  },
  {
    icon: "∞",
    title: "Verbos Irregulares",
    desc: "Los verbos más usados en inglés con ejemplos reales. Haz clic en cualquiera para ver todas sus formas.",
  },
  {
    icon: "⚡",
    title: "Daily Challenge",
    desc: "Un quiz de gramática cada día. Mantén tu racha y gana XP. +200 XP si llegas al 80%.",
  },
];

const LEVELS = [
  { level: "A1", label: "Principiante", color: "text-emerald-400" },
  { level: "A2", label: "Básico", color: "text-green-400" },
  { level: "B1", label: "Intermedio", color: "text-blue-400" },
  { level: "B2", label: "Int. Alto", color: "text-violet-400" },
  { level: "C1", label: "Avanzado", color: "text-orange-400" },
  { level: "C2", label: "Maestro", color: "text-red-400" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] backdrop-blur-xl"
        style={{ background: "rgba(10,10,15,0.85)" }}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-acc)] shadow-[0_0_12px_var(--color-acc)]" />
            <span className="font-semibold tracking-tight">SpeakFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-[var(--color-text-2)] hover:text-[var(--color-text)] transition-colors">
              Iniciar sesión
            </Link>
            <Link href="/register"
              className="text-sm font-medium px-4 py-2 rounded-[var(--radius-md)] bg-[var(--color-acc)] text-white hover:brightness-110 transition-all">
              Empezar gratis
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center relative">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(124,106,255,0.12) 0%, transparent 70%)" }} />

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-border-2)] bg-[var(--color-surface)] text-xs text-[var(--color-text-2)] mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Aprende inglés hablando con IA
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
          Habla inglés con{" "}
          <span style={{ background: "linear-gradient(90deg, var(--color-acc), var(--color-acc-2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            confianza
          </span>
          <br />desde el primer día
        </h1>

        <p className="text-lg text-[var(--color-text-2)] max-w-xl mx-auto mb-8 leading-relaxed">
          Practica conversaciones reales con IA, entrena tu pronunciación y sube de nivel A1 → C2.
          Sin vergüenza, sin juicios — solo tú y la IA.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/register"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white transition-all hover:brightness-110 hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, var(--color-acc), var(--color-acc-2))", boxShadow: "0 8px 32px rgba(124,106,255,0.35)" }}>
            Empezar gratis →
          </Link>
          <Link href="/login"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium text-sm border border-[var(--color-border-2)] text-[var(--color-text)] hover:border-[var(--color-acc)]/50 transition-all">
            Ya tengo cuenta
          </Link>
        </div>

        {/* Level pills */}
        <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
          {LEVELS.map(({ level, label, color }) => (
            <div key={level} className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-xs">
              <span className={`font-bold ${color}`}>{level}</span>
              <span className="text-[var(--color-text-3)]">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold mb-3">Todo lo que necesitas para fluir en inglés</h2>
          <p className="text-[var(--color-text-2)] text-sm">6 módulos diseñados para aprender haciendo, no memorizando.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title}
              className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 hover:border-[var(--color-border-2)] transition-colors">
              <div className="text-2xl mb-3 text-[var(--color-acc)]">{f.icon}</div>
              <h3 className="font-semibold text-sm mb-1.5">{f.title}</h3>
              <p className="text-xs text-[var(--color-text-2)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-[var(--color-border)] py-12"
        style={{ background: "var(--color-surface)" }}>
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "119+", label: "palabras A1–C2" },
            { value: "48+", label: "verbos irregulares" },
            { value: "6", label: "escenarios de chat" },
            { value: "10", label: "niveles Word Attack" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-[var(--color-acc)] mb-1">{s.value}</div>
              <div className="text-xs text-[var(--color-text-2)]">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4 tracking-tight">
          Tu próximo trabajo remoto<br />empieza con una conversación
        </h2>
        <p className="text-[var(--color-text-2)] mb-8 max-w-md mx-auto">
          Únete y empieza a practicar hoy. Sin tarjeta de crédito.
        </p>
        <Link href="/register"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white transition-all hover:brightness-110 hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg, var(--color-acc), var(--color-acc-2))", boxShadow: "0 8px 32px rgba(124,106,255,0.3)" }}>
          Crear cuenta gratis →
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--color-border)] py-6 text-center text-xs text-[var(--color-text-3)]">
        SpeakFlow © 2026 · Hecho con IA en Santo Domingo 🇩🇴
      </footer>
    </div>
  );
}
