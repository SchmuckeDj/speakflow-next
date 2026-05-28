"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { getProgress, type ProgressData } from "@/lib/hooks/useProgress";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

const CEFR_LEVELS = ["A1","A2","B1","B2","C1","C2"];

const ACHIEVEMENTS = [
  { icon: "🔥", label: "7-Day Streak",       earned: (p: ProgressData) => p.streak >= 7 },
  { icon: "💬", label: "First Chat",          earned: (p: ProgressData) => p.chatMessages >= 1 },
  { icon: "◈",  label: "50 Palabras",         earned: (p: ProgressData) => p.wordsDestroyed >= 50 },
  { icon: "⚡", label: "Quiz Master",         earned: (p: ProgressData) => p.challengesCompleted >= 5 },
  { icon: "🎮", label: "Word Attack x100",    earned: (p: ProgressData) => p.wordsDestroyed >= 100 },
  { icon: "🏆", label: "Racha de 30 días",    earned: (p: ProgressData) => p.streak >= 30 },
];

export default function ProfileScreen() {
  const [progress, setProgress]   = useState<ProgressData | null>(null);
  const [userName, setUserName]   = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userLevel, setUserLevel] = useState("B1");
  const [editing, setEditing]     = useState(false);
  const [editName, setEditName]   = useState("");
  const [editLevel, setEditLevel] = useState("B1");
  const [saving, setSaving]       = useState(false);
  const { showToast }             = useToast();

  useEffect(() => {
    setProgress(getProgress());
    try {
      const user = JSON.parse(localStorage.getItem("sf_user") || "{}");
      if (user.name)  { setUserName(user.name);   setEditName(user.name); }
      if (user.email)   setUserEmail(user.email);
      if (user.level) { setUserLevel(user.level); setEditLevel(user.level); }
    } catch {}
  }, []);

  async function handleSave() {
    if (!editName.trim()) return;
    setSaving(true);
    try {
      const res = await apiFetch("/api/auth/me/", {
        method: "PATCH",
        body:   JSON.stringify({ username: editName.trim(), level: editLevel }),
      });

      if (res.ok) {
        const data = await res.json();
        const newName  = data.username || editName.trim();
        const newLevel = data.level    || editLevel;

        // Actualizar localStorage
        const existing = JSON.parse(localStorage.getItem("sf_user") || "{}");
        localStorage.setItem("sf_user", JSON.stringify({
          ...existing,
          name:  newName,
          level: newLevel,
        }));

        setUserName(newName);
        setUserLevel(newLevel);
        setEditing(false);
        showToast("Perfil actualizado ✓", "success");
      } else {
        showToast("Error al guardar.", "error");
      }
    } catch {
      showToast("Error de conexión.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Perfil</h1>
        {!editing && (
          <Button variant="ghost" size="sm" onClick={() => { setEditing(true); setEditName(userName); setEditLevel(userLevel); }}>
            ✎ Editar
          </Button>
        )}
      </div>

      {/* User card */}
      <Card className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[var(--color-acc)]/20 border-2 border-[var(--color-acc)]/40 flex items-center justify-center text-xl font-semibold text-[var(--color-acc)] shrink-0">
            {(userName || "?").charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[var(--color-text)] truncate">{userName}</p>
            {userEmail && <p className="text-sm text-[var(--color-text-2)] truncate">{userEmail}</p>}
            <div className="mt-1"><Badge variant="level">{userLevel}</Badge></div>
          </div>
        </div>

        {/* Formulario edición */}
        {editing && (
          <div className="space-y-3 pt-2 border-t border-[var(--color-border)]">
            <div className="space-y-1.5">
              <label className="text-xs text-[var(--color-text-2)] font-medium">Nombre</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                maxLength={50}
                className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border-2)] rounded-[var(--radius-md)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-acc)]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-[var(--color-text-2)] font-medium">Nivel de inglés</label>
              <div className="grid grid-cols-3 gap-2">
                {CEFR_LEVELS.map((lvl) => (
                  <button key={lvl} onClick={() => setEditLevel(lvl)}
                    className={`py-2 rounded-[var(--radius-md)] border text-xs font-medium transition-all ${
                      editLevel === lvl
                        ? "border-[var(--color-acc)] bg-[var(--color-acc)]/15 text-[var(--color-acc)]"
                        : "border-[var(--color-border)] text-[var(--color-text-2)] hover:border-[var(--color-border-2)]"
                    }`}>
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button variant="ghost" size="sm" className="flex-1" onClick={() => setEditing(false)}>
                Cancelar
              </Button>
              <Button size="sm" className="flex-1" disabled={saving || !editName.trim()} onClick={handleSave}>
                {saving ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "XP",         value: progress ? progress.xp.toLocaleString() : "—" },
          { label: "Racha",      value: progress ? `${progress.streak}d` : "—" },
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

      {/* Estadísticas */}
      {progress && (
        <Card>
          <h2 className="text-sm font-medium text-[var(--color-text-2)] uppercase tracking-wider mb-3">Estadísticas</h2>
          <div className="space-y-2 text-sm">
            {[
              { label: "Palabras destruidas",       value: progress.wordsDestroyed },
              { label: "Mensajes en chat",           value: progress.chatMessages },
              { label: "Sesiones de pronunciación", value: progress.pronunciationSessions },
              { label: "Challenges completados",    value: progress.challengesCompleted },
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
