"use client";

import { useState, useEffect } from "react";
import { VERBS, getVerbsForLevel, isVerbLevelUnlocked } from "@/lib/data/verbs";
import type { Verb } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import VerbModal from "./VerbModal";
import clsx from "clsx";

const ALL_LEVELS = ["A1", "A2", "B1", "B2"] as const;

export default function VerbsScreen() {
  const [userLevel, setUserLevel]     = useState("B1");
  const [activeLevel, setActiveLevel] = useState<string>("All");
  const [selectedVerb, setSelectedVerb] = useState<Verb | null>(null);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("sf_user") || "{}");
      if (user.level) setUserLevel(user.level);
    } catch {}
  }, []);

  const available     = getVerbsForLevel(userLevel);
  const accessibleLvls = ALL_LEVELS.filter((l) => isVerbLevelUnlocked(l, userLevel));
  const lockedLvls     = ALL_LEVELS.filter((l) => !isVerbLevelUnlocked(l, userLevel));

  const filtered = available.filter(
    (v) => activeLevel === "All" || v.level === activeLevel
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Verbos Irregulares</h1>
        <p className="text-sm text-[var(--color-text-2)] mt-1">
          {available.length} verbos desbloqueados · Tu nivel: <span className="text-[var(--color-acc)] font-medium">{userLevel}</span>
        </p>
      </div>

      {lockedLvls.length > 0 && (
        <div className="flex items-center gap-2 p-3 rounded-[var(--radius-md)] bg-[var(--color-surface-2)] border border-[var(--color-border)]">
          <span className="text-sm">🔒</span>
          <p className="text-xs text-[var(--color-text-2)]">
            Bloqueados: <span className="text-[var(--color-text-3)] font-medium">{lockedLvls.join(", ")}</span> — sube de nivel para desbloquearlos
          </p>
        </div>
      )}

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setActiveLevel("All")}
          className={clsx(
            "px-3 py-1 rounded-full text-xs font-medium border transition-all",
            activeLevel === "All"
              ? "bg-[var(--color-acc)] text-white border-[var(--color-acc)]"
              : "border-[var(--color-border-2)] text-[var(--color-text-2)] hover:border-[var(--color-acc)]/50"
          )}
        >
          Todos ({available.length})
        </button>
        {accessibleLvls.map((lvl) => {
          const count = available.filter((v) => v.level === lvl).length;
          return (
            <button key={lvl} onClick={() => setActiveLevel(lvl)}
              className={clsx(
                "px-3 py-1 rounded-full text-xs font-medium border transition-all",
                activeLevel === lvl
                  ? "bg-[var(--color-acc)] text-white border-[var(--color-acc)]"
                  : "border-[var(--color-border-2)] text-[var(--color-text-2)] hover:border-[var(--color-acc)]/50"
              )}
            >
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

      {/* Tabla */}
      <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
              <th className="text-left px-4 py-3 text-[var(--color-text-2)] font-medium">Infinitive</th>
              <th className="text-left px-4 py-3 text-[var(--color-text-2)] font-medium">Past Simple</th>
              <th className="text-left px-4 py-3 text-[var(--color-text-2)] font-medium hidden sm:table-cell">Past Participle</th>
              <th className="text-left px-4 py-3 text-[var(--color-text-2)] font-medium hidden md:table-cell">Español</th>
              <th className="px-4 py-3 text-[var(--color-text-2)] font-medium">Nivel</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((verb) => (
              <tr key={verb.id} onClick={() => setSelectedVerb(verb)}
                className="border-b border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)] cursor-pointer transition-colors">
                <td className="px-4 py-3 font-mono font-medium text-[var(--color-text)]">{verb.infinitive}</td>
                <td className="px-4 py-3 font-mono text-[var(--color-acc)]">{verb.pastSimple}</td>
                <td className="px-4 py-3 font-mono text-[var(--color-text-2)] hidden sm:table-cell">{verb.pastParticiple}</td>
                <td className="px-4 py-3 text-[var(--color-text-2)] hidden md:table-cell">{verb.spanish}</td>
                <td className="px-4 py-3 text-center"><Badge variant="level">{verb.level}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <VerbModal verb={selectedVerb} onClose={() => setSelectedVerb(null)} />
    </div>
  );
}
