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

export default function DashboardScreen() {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [weekly, setWeekly] = useState<{ day: string; xp: number }[]>([]);
  const [userName, setUserName] = useState("Anabel");
  const [userLevel, setUserLevel] = useState("B1");

  useEffect(() => {
    // Mostrar datos locales inmediatamente (sin flash)
    setProgress(getProgress());
    setWeekly(getWeeklyXP());
    try {
      const user = JSON.parse(localStorage.getItem("sf_user") || "{}");
      if (user.name) setUserName(user.name);
      if (user.level) setUserLevel(user.level);
    } catch {}

    // Luego hidratar desde la API (otro dispositivo, sesión nueva, etc.)
    syncFromAPI().then((remote) => {
      if (remote) {
        setProgress(remote);
        setWeekly(getWeeklyXP());
      }
    });
  }, []);

  const maxXP = Math.max(...weekly.map((w) => w.xp), 1);

  const STATS = progress
    ? [
        { label: "Racha actual",       value: `${progress.streak} días`,         icon: "🔥" },
        { label: "XP total",           value: progress.xp.toLocaleString(),       icon: "⚡" },
        { label: "Palabras destruidas",value: progress.wordsDestroyed,            icon: "◈" },
        { label: "Mensajes en chat",   value: progress.chatMessages,              icon: "✦" },
      ]
    : [
        { label: "Racha actual",       value: "—", icon: "🔥" },
        { label: "XP total",           value: "—", icon: "⚡" },
        { label: "Palabras destruidas",value: "—", icon: "◈" },
        { label: "Mensajes en chat",   value: "—", icon: "✦" },
      ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <p className="text-[var(--color-text-2)] text-sm mb-1">Bienvenida de nuevo</p>
        <h1 className="text-2xl font-semibold tracking-tight">
          {userName} <span className="text-[var(--color-acc)]">·</span> Nivel{" "}
          <Badge variant="level">{userLevel}</Badge>
        </h1>
      </div>

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
        <h2 className="text-sm font-medium text-[var(--color-text-2)] mb-3 uppercase tracking-wider">
          Practicar ahora
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {QUICK_ACCESS.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="group hover:border-[var(--color-acc)]/40 hover:bg-[var(--color-surface-2)] transition-all duration-200 cursor-pointer h-full">
                <div className="flex items-start gap-3">
                  <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                  <div>
                    <p className="font-medium text-sm text-[var(--color-text)]">{item.label}</p>
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
          <h2 className="text-sm font-medium text-[var(--color-text-2)] uppercase tracking-wider">
            XP esta semana
          </h2>
          {progress && (
            <span className="text-xs font-mono text-[var(--color-acc)]">
              {weekly.reduce((a, w) => a + w.xp, 0)} XP
            </span>
          )}
        </div>

        {weekly.every((w) => w.xp === 0) ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <p className="text-3xl">🚀</p>
            <p className="text-sm text-[var(--color-text-2)]">Completa tu primera actividad para ver tu progreso.</p>
            <Link href="/game" className="text-xs text-[var(--color-acc)] hover:underline mt-1">
              Ir a Word Attack →
            </Link>
          </div>
        ) : (
          <div className="flex items-end gap-2 h-28">
            {weekly.map((w, i) => {
              const pct = maxXP > 0 ? (w.xp / maxXP) * 100 : 0;
              const isToday = i === weekly.length - 1;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                  {w.xp > 0 && (
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded px-1.5 py-0.5 text-[9px] font-mono text-[var(--color-text)] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {w.xp} XP
                    </div>
                  )}
                  <div className="w-full flex-1 flex items-end">
                    <div
                      className="w-full rounded-sm transition-all duration-500"
                      style={{
                        height: pct > 0 ? `${Math.max(pct, 8)}%` : "4px",
                        background: isToday
                          ? "var(--color-acc)"
                          : pct > 0
                            ? "rgba(124,106,255,0.4)"
                            : "rgba(255,255,255,0.05)",
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
          <h2 className="text-sm font-medium text-[var(--color-text-2)] mb-3 uppercase tracking-wider">
            Actividad
          </h2>
          <div className="space-y-2">
            {progress.wordsDestroyed > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[var(--color-acc)]/15 flex items-center justify-center text-sm">◈</span>
                  <span className="text-[var(--color-text-2)]">Palabras destruidas en Word Attack</span>
                </div>
                <span className="font-mono text-xs text-[var(--color-acc)]">{progress.wordsDestroyed}</span>
              </div>
            )}
            {progress.chatMessages > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[var(--color-acc-2)]/15 flex items-center justify-center text-sm">✦</span>
                  <span className="text-[var(--color-text-2)]">Mensajes enviados en Chat</span>
                </div>
                <span className="font-mono text-xs text-[var(--color-acc-2)]">{progress.chatMessages}</span>
              </div>
            )}
            {progress.pronunciationSessions > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-blue-500/15 flex items-center justify-center text-sm">◎</span>
                  <span className="text-[var(--color-text-2)]">Sesiones de pronunciación</span>
                </div>
                <span className="font-mono text-xs text-blue-400">{progress.pronunciationSessions}</span>
              </div>
            )}
            {progress.challengesCompleted > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center text-sm">⚡</span>
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
