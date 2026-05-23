"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { getProgress, type ProgressData } from "@/lib/hooks/useProgress";

const ACHIEVEMENTS = [
  { icon: "🔥", label: "7-Day Streak",    earned: (p: ProgressData) => p.streak >= 7 },
  { icon: "💬", label: "First Chat",       earned: (p: ProgressData) => p.chatMessages >= 1 },
  { icon: "◈",  label: "50 Palabras",      earned: (p: ProgressData) => p.wordsDestroyed >= 50 },
  { icon: "⚡", label: "Quiz Master",      earned: (p: ProgressData) => p.challengesCompleted >= 5 },
  { icon: "🎮", label: "Word Attack x100", earned: (p: ProgressData) => p.wordsDestroyed >= 100 },
  { icon: "🏆", label: "C1 Level",         earned: (_: ProgressData) => false }, // futuro: nivel real
];

export default function ProfileScreen() {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [userName, setUserName] = useState("Anabel");
  const [userEmail, setUserEmail] = useState("");
  const [userLevel, setUserLevel] = useState("B1");

  useEffect(() => {
    setProgress(getProgress());
    try {
      const user = JSON.parse(localStorage.getItem("sf_user") || "{}");
      if (user.name)  setUserName(user.name);
      if (user.email) setUserEmail(user.email);
      if (user.level) setUserLevel(user.level);
    } catch {}
  }, []);

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-lg font-semibold">Perfil</h1>

      {/* User card */}
      <Card className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-[var(--color-acc)]/20 border-2 border-[var(--color-acc)]/40 flex items-center justify-center text-xl font-semibold text-[var(--color-acc)] shrink-0">
          {userName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-[var(--color-text)]">{userName}</p>
          {userEmail && <p className="text-sm text-[var(--color-text-2)]">{userEmail}</p>}
          <div className="mt-1"><Badge variant="level">{userLevel}</Badge></div>
        </div>
      </Card>

      {/* Stats reales */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "XP",      value: progress ? progress.xp.toLocaleString() : "—" },
          { label: "Racha",   value: progress ? `${progress.streak}d` : "—" },
          { label: "Challenges", value: progress ? progress.challengesCompleted : "—" },
        ].map((s) => (
          <Card key={s.label} className="text-center">
            <p className="text-xl font-semibold text-[var(--color-text)]">{s.value}</p>
            <p className="text-xs text-[var(--color-text-2)] mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Logros */}
      <div>
        <h2 className="text-sm font-medium text-[var(--color-text-2)] uppercase tracking-wider mb-3">Logros</h2>
        <div className="grid grid-cols-3 gap-3">
          {ACHIEVEMENTS.map((a) => {
            const earned = progress ? a.earned(progress) : false;
            return (
              <Card key={a.label} className={`text-center py-4 transition-all ${!earned ? "opacity-35 grayscale" : "border-[var(--color-acc)]/30"}`}>
                <p className="text-2xl mb-1">{a.icon}</p>
                <p className="text-xs text-[var(--color-text-2)]">{a.label}</p>
                {earned && <p className="text-[9px] text-[var(--color-acc)] mt-1">Conseguido</p>}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Actividad detallada */}
      {progress && (
        <Card>
          <h2 className="text-sm font-medium text-[var(--color-text-2)] uppercase tracking-wider mb-3">Estadísticas</h2>
          <div className="space-y-2 text-sm">
            {[
              { label: "Palabras destruidas",   value: progress.wordsDestroyed },
              { label: "Mensajes en chat",       value: progress.chatMessages },
              { label: "Sesiones de pronunciación", value: progress.pronunciationSessions },
              { label: "Challenges completados", value: progress.challengesCompleted },
            ].map((s) => (
              <div key={s.label} className="flex justify-between">
                <span className="text-[var(--color-text-2)]">{s.label}</span>
                <span className="font-mono text-[var(--color-acc)]">{s.value}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
