"use client";

/**
 * useProgress — store de progreso en localStorage
 *
 * Estructura guardada en "sf_progress":
 * {
 *   xp: number,
 *   streak: number,
 *   lastActiveDate: string (YYYY-MM-DD),
 *   wordsDestroyed: number,
 *   chatMessages: number,
 *   pronunciationSessions: number,
 *   challengesCompleted: number,
 *   weeklyActivity: Record<YYYY-MM-DD, number>  ← XP por día
 * }
 */

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
  xp: 0,
  streak: 0,
  lastActiveDate: "",
  wordsDestroyed: 0,
  chatMessages: 0,
  pronunciationSessions: 0,
  challengesCompleted: 0,
  weeklyActivity: {},
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function load(): ProgressData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT };
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT };
  }
}

function save(data: ProgressData) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {}
}

/** Actualiza la racha según la fecha de hoy */
function updateStreak(data: ProgressData): ProgressData {
  const t = today();
  if (data.lastActiveDate === t) return data; // ya registrado hoy

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yd = yesterday.toISOString().slice(0, 10);

  const streak = data.lastActiveDate === yd ? data.streak + 1 : 1;
  return { ...data, streak, lastActiveDate: t };
}

/** Añade XP y registra actividad en el día actual */
function addXP(data: ProgressData, amount: number): ProgressData {
  const t = today();
  const weeklyActivity = { ...data.weeklyActivity };
  weeklyActivity[t] = (weeklyActivity[t] ?? 0) + amount;
  return { ...data, xp: data.xp + amount, weeklyActivity };
}

// ── API pública ──────────────────────────────────

export function getProgress(): ProgressData {
  return load();
}

export function recordWordDestroyed(count = 1) {
  let d = load();
  d = updateStreak(d);
  d = addXP(d, count * 10);
  d.wordsDestroyed += count;
  save(d);
}

export function recordChatMessage() {
  let d = load();
  d = updateStreak(d);
  d = addXP(d, 5);
  d.chatMessages += 1;
  save(d);
}

export function recordPronunciationSession(score: number) {
  let d = load();
  d = updateStreak(d);
  const xp = Math.round(score * 0.5); // score 0-100 → 0-50 XP
  d = addXP(d, xp);
  d.pronunciationSessions += 1;
  save(d);
}

export function recordChallengeCompleted(correct: number, total: number) {
  let d = load();
  d = updateStreak(d);
  const pct = correct / total;
  const xp = pct >= 0.8 ? 200 : pct >= 0.6 ? 100 : 40;
  d = addXP(d, xp);
  d.challengesCompleted += 1;
  save(d);
}

/** Devuelve XP de los últimos 7 días en orden L→D */
export function getWeeklyXP(): { day: string; xp: number }[] {
  const d = load();
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = date.toISOString().slice(0, 10);
    const label = ["D", "L", "M", "X", "J", "V", "S"][date.getDay()];
    result.push({ day: label, xp: d.weeklyActivity[key] ?? 0 });
  }
  return result;
}
