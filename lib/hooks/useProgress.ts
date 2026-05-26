"use client";

import { apiFetch } from "@/lib/api";

export interface ProgressData {
  xp: number;
  streak: number;
  lastActiveDate: string;
  wordsDestroyed: number;
  chatMessages: number;
  pronunciationSessions: number;
  challengesCompleted: number;
  weeklyActivity: Record<string, number>;
}

const KEY = "sf_progress";

const DEFAULT: ProgressData = {
  xp: 0, streak: 0, lastActiveDate: "",
  wordsDestroyed: 0, chatMessages: 0,
  pronunciationSessions: 0, challengesCompleted: 0,
  weeklyActivity: {},
};

function load(): ProgressData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT };
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch { return { ...DEFAULT }; }
}

function save(data: ProgressData) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function updateStreak(data: ProgressData): ProgressData {
  const t  = today();
  if (data.lastActiveDate === t) return data;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yd     = yesterday.toISOString().slice(0, 10);
  const streak = data.lastActiveDate === yd ? data.streak + 1 : 1;
  return { ...data, streak, lastActiveDate: t };
}

function addXPLocal(data: ProgressData, amount: number): ProgressData {
  const t              = today();
  const weeklyActivity = { ...data.weeklyActivity };
  weeklyActivity[t]    = (weeklyActivity[t] ?? 0) + amount;
  return { ...data, xp: data.xp + amount, weeklyActivity };
}

// ── Sincronizar con la API (fire-and-forget) ──
async function syncAPI(type: string, value: number, extra?: Record<string, number>) {
  try {
    await apiFetch("/api/progress/record/", {
      method: "POST",
      body:   JSON.stringify({ type, value, ...extra }),
    });
  } catch {}
}

// ── Sincronizar DESDE la API al cargar dashboard ──
export async function syncFromAPI(): Promise<ProgressData | null> {
  try {
    const res = await apiFetch("/api/progress/");
    if (!res.ok) return null;
    const data = await res.json();

    // Convertir formato snake_case del backend a camelCase del frontend
    const remote: ProgressData = {
      xp:                    data.xp ?? 0,
      streak:                data.streak ?? 0,
      lastActiveDate:        data.last_active_date ?? "",
      wordsDestroyed:        data.words_destroyed ?? 0,
      chatMessages:          data.chat_messages ?? 0,
      pronunciationSessions: data.pronunciation_sessions ?? 0,
      challengesCompleted:   data.challenges_completed ?? 0,
      weeklyActivity:        data.weekly_activity ?? {},
    };

    // Guardar en localStorage para acceso offline
    save(remote);
    return remote;
  } catch {
    return null;
  }
}

// ── API pública ──────────────────────────────

export function getProgress(): ProgressData {
  return load();
}

export function recordWordDestroyed(count = 1) {
  let d = load();
  d = updateStreak(d);
  d = addXPLocal(d, count * 10);
  d.wordsDestroyed += count;
  save(d);
  syncAPI("word", count);
}

export function recordChatMessage() {
  let d = load();
  d = updateStreak(d);
  d = addXPLocal(d, 5);
  d.chatMessages += 1;
  save(d);
  syncAPI("chat", 1);
}

export function recordPronunciationSession(score: number) {
  let d = load();
  d = updateStreak(d);
  d = addXPLocal(d, Math.round(score * 0.5));
  d.pronunciationSessions += 1;
  save(d);
  syncAPI("pronunciation", score);
}

export function recordChallengeCompleted(correct: number, total: number) {
  let d     = load();
  d         = updateStreak(d);
  const pct = correct / total;
  const xp  = pct >= 0.8 ? 200 : pct >= 0.6 ? 100 : 40;
  d = addXPLocal(d, xp);
  d.challengesCompleted += 1;
  save(d);
  syncAPI("challenge", correct, { total });
}

export function getWeeklyXP(): { day: string; xp: number }[] {
  const d      = load();
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const date  = new Date();
    date.setDate(date.getDate() - i);
    const key   = date.toISOString().slice(0, 10);
    const label = ["D", "L", "M", "X", "J", "V", "S"][date.getDay()];
    result.push({ day: label, xp: d.weeklyActivity[key] ?? 0 });
  }
  return result;
}
