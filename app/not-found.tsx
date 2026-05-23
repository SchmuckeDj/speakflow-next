import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4"
      style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(124,106,255,0.1) 0%, transparent 60%), var(--color-bg)" }}>

      <div className="space-y-2">
        <p className="text-8xl font-bold text-[var(--color-surface-2)]">404</p>
        <p className="text-xl font-semibold text-[var(--color-text)]">Página no encontrada</p>
        <p className="text-sm text-[var(--color-text-2)] max-w-xs">
          Esta ruta no existe. Quizás el meteorito la destruyó.
        </p>
      </div>

      <div className="flex gap-3">
        <Link href="/dashboard"
          className="px-5 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-acc)] text-white text-sm font-medium hover:brightness-110 transition-all">
          Ir al Dashboard
        </Link>
        <Link href="/"
          className="px-5 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border-2)] text-sm text-[var(--color-text-2)] hover:text-[var(--color-text)] hover:border-[var(--color-acc)]/50 transition-all">
          Inicio
        </Link>
      </div>
    </div>
  );
}
