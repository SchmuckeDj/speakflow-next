"use client";

import { useState, useEffect } from "react";
import { VOCABULARY, CEFR_LEVELS, getWordsForLevel, isLevelUnlocked } from "@/lib/data/vocabulary";
import type { Word } from "@/lib/types";
import WordCard from "./WordCard";
import { apiFetch } from "@/lib/api";
import clsx from "clsx";

const CACHE_TTL = 60 * 60 * 1000; // 1 hora en ms

function getCachedWords(key: string): Word[] | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { words, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) { sessionStorage.removeItem(key); return null; }
    return words;
  } catch { return null; }
}

function setCachedWords(key: string, words: Word[]) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ words, ts: Date.now() }));
  } catch {}
}

export default function VocabularyScreen() {
  const [userLevel, setUserLevel]     = useState("B1");
  const [userGoals, setUserGoals]     = useState<string[]>([]);
  const [activeLevel, setActiveLevel] = useState<string>("All");
  const [search, setSearch]           = useState("");
  const [aiWords, setAiWords]         = useState<Word[]>([]);
  const [aiLoading, setAiLoading]     = useState(false);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("sf_user") || "{}");
      if (user.level) setUserLevel(user.level);
      if (user.goals) setUserGoals(user.goals);
    } catch {}
  }, []);

  useEffect(() => {
    if (!userLevel) return;
    const goals   = userGoals.length > 0 ? userGoals.join(",") : "general";
    const cacheKey = `sf_vocab_ai_${userLevel}_${goals}`;

    // Intentar caché primero
    const cached = getCachedWords(cacheKey);
    if (cached) { setAiWords(cached); return; }

    setAiLoading(true);
    apiFetch(`/api/vocabulary/?level=${userLevel}&goals=${goals}&count=15`)
      .then((res) => res.ok ? res.json() : [])
      .then((data: Word[]) => {
        const baseWords = new Set(VOCABULARY.map((w) => w.word.toLowerCase()));
        const unique    = data
          .filter((w) => !baseWords.has(w.word?.toLowerCase()))
          .map((w, i) => ({ ...w, id: `ai-${i}` }));
        setAiWords(unique);
        setCachedWords(cacheKey, unique); // guardar en caché
      })
      .catch(() => {})
      .finally(() => setAiLoading(false));
  }, [userLevel, userGoals]);

  const available      = getWordsForLevel(userLevel);
  const accessibleLvls = CEFR_LEVELS.filter((l) => isLevelUnlocked(l, userLevel));
  const lockedLvls     = CEFR_LEVELS.filter((l) => !isLevelUnlocked(l, userLevel));

  const filteredBase = available.filter((w) => {
    const matchLevel  = activeLevel === "All" || w.level === activeLevel;
    const matchSearch = !search ||
      w.word.toLowerCase().includes(search.toLowerCase()) ||
      w.translation.toLowerCase().includes(search.toLowerCase());
    return matchLevel && matchSearch;
  });

  const filteredAI = activeLevel === "All"
    ? aiWords.filter((w) =>
        !search ||
        w.word?.toLowerCase().includes(search.toLowerCase()) ||
        w.translation?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Vocabulario</h1>
        <p className="text-sm text-[var(--color-text-2)] mt-1">
          {available.length} palabras desbloqueadas · Tu nivel:{" "}
          <span className="text-[var(--color-acc)] font-medium">{userLevel}</span>
        </p>
      </div>

      {lockedLvls.length > 0 && (
        <div className="flex items-center gap-2 p-3 rounded-[var(--radius-md)] bg-[var(--color-surface-2)] border border-[var(--color-border)]">
          <span className="text-sm">🔒</span>
          <p className="text-xs text-[var(--color-text-2)]">
            Niveles bloqueados:{" "}
            <span className="font-medium text-[var(--color-text-3)]">{lockedLvls.join(", ")}</span>
            {" "}— sube de nivel para desbloquearlos
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <input type="text" placeholder="Buscar palabra o traducción..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-72 bg-[var(--color-surface)] border border-[var(--color-border-2)] rounded-[var(--radius-md)] px-4 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-3)] focus:outline-none focus:border-[var(--color-acc)]"
        />
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setActiveLevel("All")}
            className={clsx("px-3 py-1 rounded-full text-xs font-medium border transition-all",
              activeLevel === "All"
                ? "bg-[var(--color-acc)] text-white border-[var(--color-acc)]"
                : "border-[var(--color-border-2)] text-[var(--color-text-2)] hover:border-[var(--color-acc)]/50"
            )}>
            Todas ({available.length})
          </button>
          {accessibleLvls.map((lvl) => {
            const count = available.filter((w) => w.level === lvl).length;
            return (
              <button key={lvl} onClick={() => setActiveLevel(lvl)}
                className={clsx("px-3 py-1 rounded-full text-xs font-medium border transition-all",
                  activeLevel === lvl
                    ? "bg-[var(--color-acc)] text-white border-[var(--color-acc)]"
                    : "border-[var(--color-border-2)] text-[var(--color-text-2)] hover:border-[var(--color-acc)]/50"
                )}>
                {lvl} ({count})
              </button>
            );
          })}
          {lockedLvls.map((lvl) => (
            <button key={lvl} disabled
              className="px-3 py-1 rounded-full text-xs font-medium border border-[var(--color-border)] text-[var(--color-text-3)] opacity-40 cursor-not-allowed">
              🔒 {lvl}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredBase.map((w) => <WordCard key={w.id} word={w} />)}
      </div>

      {filteredBase.length === 0 && !aiLoading && (
        <p className="text-center text-[var(--color-text-2)] py-8">No se encontraron palabras.</p>
      )}

      {activeLevel === "All" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--color-border)]" />
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-2)] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-acc)] animate-pulse" />
              Palabras recomendadas por IA para ti
            </div>
            <div className="h-px flex-1 bg-[var(--color-border)]" />
          </div>

          {aiLoading ? (
            <div className="flex items-center justify-center gap-3 py-8">
              <div className="w-5 h-5 rounded-full border-2 border-[var(--color-acc)] border-t-transparent animate-spin" />
              <p className="text-sm text-[var(--color-text-2)]">Claude está generando vocabulario para ti...</p>
            </div>
          ) : filteredAI.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredAI.map((w) => <WordCard key={w.id} word={w} aiGenerated />)}
            </div>
          ) : (
            <p className="text-center text-xs text-[var(--color-text-3)] py-4">
              No se pudieron cargar palabras de IA en este momento.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
