"use client";

import type { Verb } from "@/lib/types";
import Button from "@/components/ui/Button";

interface Props {
  verb: Verb | null;
  onClose: () => void;
}

export default function VerbModal({ verb, onClose }: Props) {
  if (!verb) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-[var(--color-surface)] border border-[var(--color-border-2)] rounded-[var(--radius-xl)] p-6 w-full max-w-sm space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">to {verb.infinitive}</h2>
          <button onClick={onClose} className="text-[var(--color-text-2)] hover:text-[var(--color-text)]">✕</button>
        </div>
        <p className="text-sm text-[var(--color-acc)]">{verb.spanish}</p>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-[var(--color-surface-2)] rounded-[var(--radius-md)] p-3">
            <p className="text-[var(--color-text-3)] text-xs mb-1">Infinitive</p>
            <p className="font-mono font-medium">{verb.infinitive}</p>
          </div>
          <div className="bg-[var(--color-surface-2)] rounded-[var(--radius-md)] p-3">
            <p className="text-[var(--color-text-3)] text-xs mb-1">Past Simple</p>
            <p className="font-mono font-medium">{verb.pastSimple}</p>
          </div>
          <div className="bg-[var(--color-surface-2)] rounded-[var(--radius-md)] p-3">
            <p className="text-[var(--color-text-3)] text-xs mb-1">Past Participle</p>
            <p className="font-mono font-medium">{verb.pastParticiple}</p>
          </div>
          <div className="bg-[var(--color-surface-2)] rounded-[var(--radius-md)] p-3">
            <p className="text-[var(--color-text-3)] text-xs mb-1">Present -ing</p>
            <p className="font-mono font-medium">{verb.forms.presentParticiple}</p>
          </div>
        </div>

        <Button variant="ghost" className="w-full" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </div>
  );
}
