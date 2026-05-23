import type { Scenario } from "@/lib/types";
import clsx from "clsx";

interface Props {
  scenarios: Scenario[];
  selected: Scenario;
  onSelect: (s: Scenario) => void;
}

export default function ScenarioPicker({ scenarios, selected, onSelect }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {scenarios.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s)}
          className={clsx(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 border",
            selected.id === s.id
              ? "bg-[var(--color-acc)] text-white border-[var(--color-acc)]"
              : "border-[var(--color-border-2)] text-[var(--color-text-2)] hover:border-[var(--color-acc)]/50 hover:text-[var(--color-text)]"
          )}
        >
          <span>{s.icon}</span>
          {s.title}
        </button>
      ))}
    </div>
  );
}
