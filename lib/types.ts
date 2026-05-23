// ── Niveles CEFR ──
export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

// ── Vocabulario ──
export interface Word {
  id: string;
  word: string;
  translation: string;
  level: CEFRLevel;
  category: string;
  example: string;
}

// ── Verbos ──
export interface Verb {
  id: string;
  infinitive: string;
  pastSimple: string;
  pastParticiple: string;
  spanish: string;
  level: CEFRLevel;
  forms: {
    present: string;
    presentThird: string;
    presentParticiple: string;
  };
}

// ── Chat ──
export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  correction?: string;
  timestamp: Date;
}

export interface Scenario {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  systemPrompt: string;
}

// ── Challenge ──
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  level: CEFRLevel;
}

// ── Juego ──
export interface GameWord {
  id: string;
  text: string;
  x: number;
  y: number;
  speed: number;
  lane: number;
  isBoss?: boolean;
}

// ── Usuario (futuro: vendrá de la API) ──
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  level: CEFRLevel;
  xp: number;
  streak: number;
  joinedAt: Date;
}

// ── Stats del dashboard ──
export interface DashboardStat {
  label: string;
  value: string | number;
  delta?: string;
  icon: string;
}
