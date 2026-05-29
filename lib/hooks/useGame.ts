"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { GameWord } from "@/lib/types";
import { recordWordDestroyed } from "@/lib/hooks/useProgress";

export const LEVELS = [
  {
    level: 1, label: "A1 — Presente simple",
    words: [
      "I am", "you are", "he is", "she is", "we are",
      "I go", "I eat", "I see", "I have", "I do",
      "come here", "sit down", "stand up", "thank you", "good job",
      "my name", "how are you", "I like it", "I don't know",
    ],
    boss: "What is your name and where are you from",
    speed: 0.35, spawnEvery: 140,
  },
  {
    level: 2, label: "A1 — Pasado simple I",
    words: [
      "I was", "you were", "he was", "she was", "we were",
      "I went", "I ate", "I saw", "I had", "I did",
      "I came", "I sat", "I stood", "I liked", "I knew",
      "I got", "I said", "I made", "I took",
    ],
    boss: "Yesterday I went to school and I ate lunch there",
    speed: 0.42, spawnEvery: 132,
  },
  {
    level: 3, label: "A2 — Presente continuo",
    words: [
      "I am going", "she is eating", "he is working", "we are talking",
      "they are playing", "I am reading", "he is running", "she is sleeping",
      "we are waiting", "I am trying", "he is learning", "she is cooking",
      "they are watching", "I am listening", "he is driving",
      "she is writing", "we are studying", "I am thinking", "he is coming",
    ],
    boss: "She is working hard because she is trying to learn English",
    speed: 0.47, spawnEvery: 126,
  },
  {
    level: 4, label: "A2 — Pasado continuo",
    words: [
      "I was going", "she was eating", "he was working", "we were talking",
      "they were playing", "I was reading", "he was running", "she was sleeping",
      "we were waiting", "I was trying", "he was learning", "she was cooking",
      "they were watching", "I was listening", "he was driving",
      "she was writing", "we were studying", "I was thinking", "he was coming",
    ],
    boss: "She was working when I called her yesterday morning",
    speed: 0.52, spawnEvery: 120,
  },
  {
    level: 5, label: "B1 — Presente perfecto",
    words: [
      "I have gone", "she has eaten", "he has worked", "we have talked",
      "they have played", "I have read", "he has run", "she has slept",
      "I have tried", "he has learned", "she has cooked", "I have finished",
      "she has never been", "we have just arrived", "have you ever tried",
      "I haven't seen him", "they have already left", "he has always known",
      "I have done it",
    ],
    boss: "Have you ever traveled abroad and worked in another country",
    speed: 0.57, spawnEvery: 114,
  },
  {
    level: 6, label: "B1 — Pasado perfecto",
    words: [
      "I had gone", "she had eaten", "he had worked", "we had talked",
      "they had played", "I had read", "he had run", "she had slept",
      "I had tried", "he had learned", "she had cooked", "I had finished",
      "she had never been", "we had already arrived", "he had just left",
      "I hadn't seen him", "they had already left", "he had always known",
      "I had done it",
    ],
    boss: "By the time I arrived she had already finished all the work",
    speed: 0.62, spawnEvery: 108,
  },
  {
    level: 7, label: "B2 — Condicionales",
    words: [
      "if I go", "if she had gone", "I would go", "I would have gone",
      "if he works", "he would work", "if they had known", "we would have told",
      "if it rains we stay", "I should have called", "he might be late",
      "she could have done it", "if I had more time", "I would help you",
      "you should have tried", "they might have left", "if we had known",
      "I could have done more", "he would have succeeded",
    ],
    boss: "If I had studied harder I would have gotten a better job offer",
    speed: 0.68, spawnEvery: 102,
  },
  {
    level: 8, label: "B2 — Voz pasiva",
    words: [
      "it was done", "it has been done", "it had been done", "it will be done",
      "it is being done", "the report was written", "the email was sent",
      "the meeting was scheduled", "the project was completed", "it was approved",
      "the decision was made", "the feedback was given", "the task was assigned",
      "the issue was resolved", "the data was analyzed",
      "the plan was implemented", "the results were shared",
      "the budget was approved", "the deadline was extended",
    ],
    boss: "The project had been completed before the deadline was extended by management",
    speed: 0.74, spawnEvery: 96,
  },
  {
    level: 9, label: "C1 — Frases avanzadas",
    words: [
      "the implications are nuanced", "a pragmatic approach", "it remains coherent",
      "the data is compelling", "she articulated it well", "ambiguous requirements",
      "a significant milestone", "the perspective shifted", "it warrants attention",
      "the findings are conclusive", "a comprehensive review", "he elaborated further",
      "the argument is compelling", "it lacks credibility", "a reliable framework",
      "the outcome was unprecedented", "she demonstrated professionalism",
      "the analysis was thorough", "it requires careful consideration",
    ],
    boss: "The ambiguous phrasing in the requirements led to a significant misunderstanding among the team",
    speed: 0.81, spawnEvery: 90,
  },
  {
    level: 10, label: "C2 — Maestro",
    words: [
      "smartphones are ubiquitous", "an ephemeral experience", "a fundamental dichotomy",
      "an inextricable connection", "the paradigm has shifted", "a seminal contribution",
      "the implications are far-reaching", "a predominantly digital landscape",
      "the nuances are compelling", "it defies conventional wisdom",
      "a sophisticated framework", "simultaneously compelling and complex",
      "the data is predominantly inconclusive", "a profound intellectual debate",
      "the rhetoric was deliberately ambiguous", "it warrants further investigation",
      "a comprehensive yet concise analysis", "the findings are nonetheless significant",
      "it fundamentally challenges existing assumptions",
    ],
    boss: "The ubiquitous nature of technology creates an inextricable dependency that fundamentally challenges conventional wisdom",
    speed: 0.92, spawnEvery: 82,
  },
];

export type WordWithMeta = GameWord & { isBoss?: boolean };

const CANVAS_W = 800;
const CANVAS_H = 500;
export const WORDS_TO_NEXT_LEVEL = 19; // 19 palabras + 1 boss = 20 por nivel
export const MAX_LIVES = 5;

export function useGame() {
  const [words, setWords]                   = useState<WordWithMeta[]>([]);
  const [score, setScore]                   = useState(0);
  const [lives, setLives]                   = useState(MAX_LIVES);
  const [running, setRunning]               = useState(false);
  const [gameOver, setGameOver]             = useState(false);
  const [currentLevel, setCurrentLevel]     = useState(0);
  const [bossActive, setBossActive]         = useState(false);
  const [wordsDestroyed, setWordsDestroyed] = useState(0);

  const rafRef        = useRef<number>(0);
  const spawnTimerRef = useRef(0);
  const stateRef      = useRef({ running: false, level: 0, bossActive: false, wordsDestroyed: 0 });

  useEffect(() => {
    stateRef.current = { running, level: currentLevel, bossActive, wordsDestroyed };
  }, [running, currentLevel, bossActive, wordsDestroyed]);

  const spawnRegular = useCallback((levelIdx: number): WordWithMeta => {
    const lvl  = LEVELS[levelIdx];
    const text = lvl.words[Math.floor(Math.random() * lvl.words.length)];
    const lane = Math.floor(Math.random() * 5);
    return { id: crypto.randomUUID(), text, x: (CANVAS_W / 5) * lane + CANVAS_W / 10, y: -40, speed: lvl.speed, lane, isBoss: false };
  }, []);

  const spawnBoss = useCallback((levelIdx: number): WordWithMeta => {
    const lvl = LEVELS[levelIdx];
    return { id: crypto.randomUUID(), text: lvl.boss, x: CANVAS_W / 2, y: -60, speed: lvl.speed * 0.6, lane: 2, isBoss: true };
  }, []);

  const tick = useCallback(() => {
    const { running: r, level, bossActive: ba, wordsDestroyed: wd } = stateRef.current;
    if (!r) return;
    const lvl = LEVELS[level];
    spawnTimerRef.current += 1;
    if (!ba && spawnTimerRef.current >= lvl.spawnEvery) {
      spawnTimerRef.current = 0;
      if (wd >= WORDS_TO_NEXT_LEVEL) {
        setBossActive(true); stateRef.current.bossActive = true;
        setWords((prev) => [...prev, spawnBoss(level)]);
      } else {
        setWords((prev) => [...prev, spawnRegular(level)]);
      }
    }
    setWords((prev) => {
      const updated = prev.map((w) => ({ ...w, y: w.y + w.speed }));
      const escaped = updated.filter((w) => w.y > CANVAS_H + 60);
      if (escaped.length > 0) {
        setLives((l) => {
          const next = l - escaped.length;
          if (next <= 0) { stateRef.current.running = false; setRunning(false); setGameOver(true); }
          return Math.max(0, next);
        });
        if (escaped.some((w) => w.isBoss)) { setBossActive(false); stateRef.current.bossActive = false; }
      }
      return updated.filter((w) => w.y <= CANVAS_H + 60);
    });
    rafRef.current = requestAnimationFrame(tick);
  }, [spawnRegular, spawnBoss]);

  useEffect(() => {
    if (running) { rafRef.current = requestAnimationFrame(tick); }
    else { cancelAnimationFrame(rafRef.current); }
    return () => cancelAnimationFrame(rafRef.current);
  }, [running, tick]);

  const typeWord = useCallback((input: string) => {
    const trimmed = input.trim().toLowerCase();
    setWords((prev) => {
      const idx = prev.findIndex((w) => w.text.toLowerCase() === trimmed);
      if (idx === -1) return prev;
      const hit = prev[idx];
      setScore((s) => s + (hit.isBoss ? 50 : 10));
      recordWordDestroyed(1);
      setWordsDestroyed((d) => {
        const next = d + 1;
        stateRef.current.wordsDestroyed = next;
        return next;
      });
      if (hit.isBoss) {
        setBossActive(false); stateRef.current.bossActive = false;
        setWordsDestroyed(0); stateRef.current.wordsDestroyed = 0;
        setCurrentLevel((l) => { const next = Math.min(l + 1, LEVELS.length - 1); stateRef.current.level = next; return next; });
      }
      return prev.filter((_, i) => i !== idx);
    });
  }, []);

  const start = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setWords([]); setScore(0); setLives(MAX_LIVES); setGameOver(false);
    setCurrentLevel(0); setBossActive(false); setWordsDestroyed(0);
    spawnTimerRef.current = 0;
    stateRef.current = { running: true, level: 0, bossActive: false, wordsDestroyed: 0 };
    setRunning(true);
  }, []);

  const stop = useCallback(() => { stateRef.current.running = false; setRunning(false); }, []);

  return { words, score, lives, running, gameOver, currentLevel, bossActive, wordsDestroyed, start, stop, typeWord, CANVAS_W, CANVAS_H, WORDS_TO_NEXT_LEVEL, MAX_LIVES };
}
