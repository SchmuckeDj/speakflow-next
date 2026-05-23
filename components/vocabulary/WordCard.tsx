import Badge from "@/components/ui/Badge";
import type { Word } from "@/lib/types";

interface Props {
  word: Word;
}

export default function WordCard({ word }: Props) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 hover:border-[var(--color-border-2)] transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="font-semibold text-[var(--color-text)]">{word.word}</span>
        <Badge variant="level">{word.level}</Badge>
      </div>
      <p className="text-sm text-[var(--color-acc)]">{word.translation}</p>
      <p className="text-xs text-[var(--color-text-2)] mt-2 italic">"{word.example}"</p>
    </div>
  );
}
