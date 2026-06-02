"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import { syncFromAPI, getProgress, getWeeklyXP, type ProgressData } from "@/lib/hooks/useProgress";

const QUICK_ACCESS = [
  { href: "/chat",          icon: "✦", label: "AI Chat",       desc: "Practica conversación" },
  { href: "/pronunciation", icon: "◎", label: "Pronunciación", desc: "Entrena tu acento" },
  { href: "/vocabulary",    icon: "▣", label: "Vocabulario",   desc: "119 palabras A1–C2" },
  { href: "/challenge",     icon: "⚡", label: "Challenge",     desc: "Quiz diario" },
  { href: "/verbs",         icon: "∞", label: "Verbos",        desc: "48 verbos irregulares" },
  { href: "/game",          icon: "◈", label: "Word Attack",   desc: "Juego de velocidad" },
];

// Sistema de niveles — XP necesario para cada nivel
const LEVELS = [
  { level: 1,  label: "Principiante",  xpRequired: 0     },
  { level: 2,  label: "Aprendiz",      xpRequired: 500   },
  { level: 3,  label: "Estudiante",    xpRequired: 1500  },
  { level: 4,  label: "Practicante",   xpRequired: 3000  },
  { level: 5,  label: "Intermedio",    xpRequired: 6000  },
  { level: 6,  label: "Avanzado",      xpRequired: 10000 },
  { level: 7,  label: "Experto",       xpRequired: 15000 },
  { level: 8,  label: "Maestro",       xpRequired: 25000 },
  { level: 9,  label: "Leyenda",       xpRequired: 40000 },
  { level: 10, label: "Nativo",        xpRequired: 60000 },
];

function getLevelInfo(xp: number) {
  let current = LEVELS[0];
  let next    = LEVELS[1];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      current = LEVELS[i];
      next    = LEVELS[i + 1] ?? null;
      break;
    }
  }
  const xpInLevel  = xp - current.xpRequired;
  const xpForNext  = next ? next.xpRequired - current.xpRequired : 1;
  const pct        = next ? Math.min((xpInLevel / xpForNext) * 100, 100) : 100;
  return { current, next, xpInLevel, xpForNext, pct };
}

export default function DashboardScreen() {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [weekly, setWeekly]     = useState<{ day: string; xp: number }[]>([]);
  const [userName, setUserName] = useState("Anabel");
  const [userLevel, setUserLevel] = useState("B1");

  useEffect(() => {
    setProgress(getProgress());
    setWeekly(getWeeklyXP());
    try {
      const user = JSON.parse(localStorage.getItem("sf_user") || "{}");
      if (user.name)  setUserName(user.name);
      if (user.level) setUserLevel(user.level);
    } catch {}
    syncFromAPI().then((remote) => {
      if (remote) { setProgress(remote); setWeekly(getWeeklyXP()); }
    });
  }, []);

  const totalWeeklyXP = weekly.reduce((a, w) => a + w.xp, 0);
  const maxXP         = Math.max(...weekly.map((w) => w.xp), 1);
  const levelInfo     = progress ? getLevelInfo(progress.xp) : null;

  const STATS = progress ? [
    { label: "Racha actual",        value: `${progress.streak} días`, icon: "🔥" },
    { label: "XP total",            value: progress.xp.toLocaleString(), icon: "⚡" },
    { label: "Palabras destruidas", value: progress.wordsDestroyed,    icon: "◈" },
    { label: "Mensajes en chat",    value: progress.chatMessages,      icon: "✦" },
  ] : [
    { label: "Racha actual",        value: "—", icon: "🔥" },
    { label: "XP total",            value: "—", icon: "⚡" },
    { label: "Palabras destruidas", value: "—", icon: "◈" },
    { label: "Mensajes en chat",    value: "—", icon: "✦" },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <p className="text-[var(--color-text-2)] text-sm mb-1">Bienvenida de nuevo</p>
        <h1 className="text-2xl font-semibold tracking-tight">
          {userName} <span className="text-[var(--color-acc)]">·</span> Nivel{" "}
          <Badge variant="level">{userLevel}</Badge>
        </h1>
      </div>

      {/* Barra de nivel XP */}
      {levelInfo && (
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-[var(--color-acc)]">Lv.{levelInfo.current.level}</span>
              <span className="text-sm font-medium text-[var(--color-text)]">{levelInfo.current.label}</span>
            </div>
            {levelInfo.next && (
              <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-3)]">
                <span>{levelInfo.xpInLevel.toLocaleString()}</span>
                <span>/</span>
                <span>{levelInfo.xpForNext.toLocaleString()} XP</span>
                <span className="ml-1 text-[var(--color-acc)] font-medium">→ {levelInfo.next.label}</span>
              </div>
            )}
          </div>

          {/* Barra de progreso de nivel */}
          <div className="relative h-3 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${levelInfo.pct}%`,
                background: "linear-gradient(90deg, var(--color-acc), var(--color-acc-2))",
                boxShadow: "0 0 8px rgba(124,106,255,0.5)",
              }}
            />
            {/* Brillo animado */}
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                style={{ transform: `translateX(${levelInfo.pct * 2}%)`, transition: "transform 0.7s ease" }} />
            </div>
          </div>

          {levelInfo.next ? (
            <p className="text-xs text-[var(--color-text-3)]">
              Faltan <span className="text-[var(--color-acc)] font-medium">
                {(levelInfo.xpForNext - levelInfo.xpInLevel).toLocaleString()} XP
              </span> para subir a <span className="font-medium">{levelInfo.next.label}</span>
            </p>
          ) : (
            <p className="text-xs text-[var(--color-acc)] font-medium">🏆 Nivel máximo alcanzado</p>
          )}
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STATS.map((s) => (
          <Card key={s.label} className="flex flex-col gap-1">
            <span className="text-xl">{s.icon}</span>
            <span className="text-xl font-semibold text-[var(--color-text)]">{s.value}</span>
            <span className="text-xs text-[var(--color-text-2)]">{s.label}</span>
          </Card>
        ))}
      </div>

      {/* Accesos rápidos */}
      <div>
        <h2 className="text-sm font-medium text-[var(--color-text-2)] mb-3 uppercase tracking-wider">Practicar ahora</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {QUICK_ACCESS.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="group hover:border-[var(--color-acc)]/40 hover:bg-[var(--color-surface-2)] transition-all duration-200 cursor-pointer h-full">
                <div className="flex items-start gap-3">
                  <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                  <div>
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-[var(--color-text-2)] mt-0.5">{item.desc}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Gráfico semanal */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-[var(--color-text-2)] uppercase tracking-wider">XP esta semana</h2>
          <span className="text-xs font-mono text-[var(--color-acc)]">{totalWeeklyXP.toLocaleString()} XP</span>
        </div>

        {totalWeeklyXP === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <p className="text-3xl">🚀</p>
            <p className="text-sm text-[var(--color-text-2)]">Completa tu primera actividad para ver tu progreso.</p>
            <Link href="/game" className="text-xs text-[var(--color-acc)] hover:underline mt-1">Ir a Word Attack →</Link>
          </div>
        ) : (
          <div className="flex items-end gap-2 h-32">
            {weekly.map((w, i) => {
              const isToday = i === weekly.length - 1;
              // Altura mínima visible de 6px para días con algo de XP, 3px para días vacíos
              const heightPct = w.xp > 0 ? Math.max((w.xp / maxXP) * 100, 10) : 3;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                  {w.xp > 0 && (
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded px-1.5 py-0.5 text-[9px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      {w.xp.toLocaleString()} XP
                    </div>
                  )}
                  <div className="w-full flex-1 flex items-end">
                    <div className="w-full rounded-t-sm transition-all duration-700"
                      style={{
                        height: `${heightPct}%`,
                        background: isToday
                          ? "linear-gradient(180deg, var(--color-acc), var(--color-acc-2))"
                          : w.xp > 0
                            ? "rgba(124,106,255,0.45)"
                            : "rgba(255,255,255,0.04)",
                        boxShadow: isToday && w.xp > 0 ? "0 0 8px rgba(124,106,255,0.4)" : "none",
                      }}
                    />
                  </div>
                  <span className={`text-[10px] ${isToday ? "text-[var(--color-acc)] font-medium" : "text-[var(--color-text-3)]"}`}>
                    {w.day}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Actividad reciente */}
      {progress && (progress.chatMessages > 0 || progress.wordsDestroyed > 0 || progress.pronunciationSessions > 0 || progress.challengesCompleted > 0) && (
        <Card>
          <h2 className="text-sm font-medium text-[var(--color-text-2)] mb-3 uppercase tracking-wider">Actividad</h2>
          <div className="space-y-2">
            {progress.wordsDestroyed > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[var(--color-acc)]/15 flex items-center justify-center">◈</span>
                  <span className="text-[var(--color-text-2)]">Palabras destruidas</span>
                </div>
                <span className="font-mono text-xs text-[var(--color-acc)]">{progress.wordsDestroyed}</span>
              </div>
            )}
            {progress.chatMessages > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[var(--color-acc-2)]/15 flex items-center justify-center">✦</span>
                  <span className="text-[var(--color-text-2)]">Mensajes en Chat</span>
                </div>
                <span className="font-mono text-xs text-[var(--color-acc-2)]">{progress.chatMessages}</span>
              </div>
            )}
            {progress.pronunciationSessions > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-blue-500/15 flex items-center justify-center">◎</span>
                  <span className="text-[var(--color-text-2)]">Sesiones de pronunciación</span>
                </div>
                <span className="font-mono text-xs text-blue-400">{progress.pronunciationSessions}</span>
              </div>
            )}
            {progress.challengesCompleted > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center">⚡</span>
                  <span className="text-[var(--color-text-2)]">Challenges completados</span>
                </div>
                <span className="font-mono text-xs text-amber-400">{progress.challengesCompleted}</span>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
