"use client";

import { useState } from "react";
import { VOCABULARY, CEFR_LEVELS } from "@/lib/data/vocabulary";
import WordCard from "./WordCard";
import clsx from "clsx";

export default function VocabularyScreen() {
  const [activeLevel, setActiveLevel] = useState<string>("All");
  const [search, setSearch] = useState("");

  const filtered = VOCABULARY.filter((w) => {
    const matchLevel = activeLevel === "All" || w.level === activeLevel;
    const matchSearch =
      !search ||
      w.word.toLowerCase().includes(search.toLowerCase()) ||
      w.translation.toLowerCase().includes(search.toLowerCase());
    return matchLevel && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Vocabulario</h1>
        <p className="text-sm text-[var(--color-text-2)] mt-1">{VOCABULARY.length} palabras · A1–C2</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Buscar palabra o traducción..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-72 bg-[var(--color-surface)] border border-[var(--color-border-2)] rounded-[var(--radius-md)] px-4 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-3)] focus:outline-none focus:border-[var(--color-acc)]"
        />
        <div className="flex gap-2 flex-wrap">
          {["All", ...CEFR_LEVELS].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setActiveLevel(lvl)}
              className={clsx(
                "px-3 py-1 rounded-full text-xs font-medium border transition-all",
                activeLevel === lvl
                  ? "bg-[var(--color-acc)] text-white border-[var(--color-acc)]"
                  : "border-[var(--color-border-2)] text-[var(--color-text-2)] hover:border-[var(--color-acc)]/50"
              )}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((w) => (
          <WordCard key={w.id} word={w} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-[var(--color-text-2)] py-12">No se encontraron palabras.</p>
      )}
    </div>
  );
}
