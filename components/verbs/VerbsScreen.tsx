"use client";

import { useState } from "react";
import { VERBS } from "@/lib/data/verbs";
import { CEFR_LEVELS } from "@/lib/data/vocabulary";
import type { Verb } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import VerbModal from "./VerbModal";
import clsx from "clsx";

export default function VerbsScreen() {
  const [activeLevel, setActiveLevel] = useState<string>("All");
  const [selectedVerb, setSelectedVerb] = useState<Verb | null>(null);

  const filtered = VERBS.filter(
    (v) => activeLevel === "All" || v.level === activeLevel
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Verbos Irregulares</h1>
        <p className="text-sm text-[var(--color-text-2)] mt-1">{VERBS.length} verbos · A1–B2</p>
      </div>

      {/* Level filter */}
      <div className="flex gap-2 flex-wrap">
        {["All", ...CEFR_LEVELS.filter((l) => ["A1", "A2", "B1", "B2"].includes(l))].map((lvl) => (
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

      {/* Table */}
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
              <tr
                key={verb.id}
                onClick={() => setSelectedVerb(verb)}
                className="border-b border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)] cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 font-mono font-medium text-[var(--color-text)]">{verb.infinitive}</td>
                <td className="px-4 py-3 font-mono text-[var(--color-acc)]">{verb.pastSimple}</td>
                <td className="px-4 py-3 font-mono text-[var(--color-text-2)] hidden sm:table-cell">{verb.pastParticiple}</td>
                <td className="px-4 py-3 text-[var(--color-text-2)] hidden md:table-cell">{verb.spanish}</td>
                <td className="px-4 py-3 text-center">
                  <Badge variant="level">{verb.level}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <VerbModal verb={selectedVerb} onClose={() => setSelectedVerb(null)} />
    </div>
  );
}
