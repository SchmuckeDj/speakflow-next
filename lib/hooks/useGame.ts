"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { GameWord } from "@/lib/types";
import { recordWordDestroyed } from "@/lib/hooks/useProgress";

export const LEVELS = [
  { level: 1,  label: "A1 — Básico",            words: ["I am", "you are", "he is", "she is", "we go", "I see", "I eat", "come here", "sit down", "stand up", "thank you", "good job", "my name", "how are you"],                                                                                          boss: "What is your name",                                                speed: 0.35, spawnEvery: 140 },
  { level: 2,  label: "A1 — Saludos",            words: ["good morning", "good night", "see you", "how old are you", "I am fine", "nice to meet you", "where are you", "I like it", "help me please", "I don't know"],                                                                                       boss: "Nice to meet you too",                                              speed: 0.42, spawnEvery: 130 },
  { level: 3,  label: "A2 — Presente",           words: ["she works here", "he plays soccer", "they eat lunch", "I wake up early", "we take the bus", "do you like coffee", "I go to school", "she has a cat"],                                                                                             boss: "Do you speak English every day",                                    speed: 0.40, spawnEvery: 132 },
  { level: 4,  label: "A2 — Comparaciones",      words: ["she is taller than me", "he runs faster", "it is more expensive", "this is the best", "my bag is bigger", "she is smarter than him"],                                                                                                             boss: "She is much taller than her sister",                                speed: 0.47, spawnEvery: 126 },
  { level: 5,  label: "B1 — Pasado simple",      words: ["I went to the store", "she didn't come", "we had a meeting", "he forgot his keys", "they finished the work", "I called you yesterday"],                                                                                                           boss: "I didn't understand what he said",                                  speed: 0.54, spawnEvery: 120 },
  { level: 6,  label: "B1 — Presente perfecto",  words: ["I have finished", "she has never been", "we have just arrived", "have you ever tried", "I haven't seen him", "they have already left"],                                                                                                           boss: "Have you ever traveled to another country",                         speed: 0.61, spawnEvery: 114 },
  { level: 7,  label: "B2 — Condicionales",      words: ["if I had more time", "I would help you", "she could have done it", "if it rains we stay", "I should have called", "he might be late"],                                                                                                           boss: "If I had known I would have done it differently",                   speed: 0.68, spawnEvery: 108 },
  { level: 8,  label: "B2 — Vocabulario",        words: ["the deadline is tomorrow", "we need to prioritize", "let's collaborate on this", "the feedback was positive", "please implement the fix", "it's not scalable"],                                                                                   boss: "We need to leverage our resources more efficiently",                speed: 0.75, spawnEvery: 102 },
  { level: 9,  label: "C1 — Avanzado",           words: ["the implications are nuanced", "ambiguous requirements", "a pragmatic approach", "it remains coherent", "the data is compelling", "she articulated it well"],                                                                                     boss: "The ambiguous phrasing led to a significant misunderstanding",      speed: 0.83, spawnEvery: 96  },
  { level: 10, label: "C2 — Maestro",            words: ["smartphones are ubiquitous", "an ephemeral experience", "a fundamental dichotomy", "an inextricable connection", "the paradigm has shifted", "a seminal contribution"],                                                                           boss: "The ubiquitous nature of technology creates an inextricable dependency", speed: 0.92, spawnEvery: 88 },
];

export type WordWithMeta = GameWord & { isBoss?: boolean };

const CANVAS_W = 800;
const CANVAS_H = 500;
const WORDS_TO_NEXT_LEVEL = 8;
export const MAX_LIVES = 5;

export function useGame() {
  const [words, setWords]               = useState<WordWithMeta[]>([]);
  const [score, setScore]               = useState(0);
  const [lives, setLives]               = useState(MAX_LIVES);
  const [running, setRunning]           = useState(false);
  const [gameOver, setGameOver]         = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [bossActive, setBossActive]     = useState(false);
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
