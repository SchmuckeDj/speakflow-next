import clsx from "clsx";
import type { ChatMessage as ChatMessageType } from "@/lib/types";

interface Props {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: Props) {
  const isAI = message.role === "assistant";

  return (
    <div className={clsx("flex gap-3", !isAI && "flex-row-reverse")}>
      {/* Avatar */}
      {isAI && (
        <div className="w-7 h-7 rounded-full bg-[var(--color-acc)]/20 border border-[var(--color-acc)]/30 flex items-center justify-center text-xs text-[var(--color-acc)] shrink-0 mt-1">
          AI
        </div>
      )}

      {/* Bubble */}
      <div
        className={clsx(
          "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isAI
            ? "bg-[var(--color-surface-2)] text-[var(--color-text)] rounded-tl-sm"
            : "bg-[var(--color-acc)] text-white rounded-tr-sm"
        )}
      >
        {message.content}
        {message.correction && (
          <p className="mt-1.5 text-xs opacity-70 border-t border-white/20 pt-1.5">
            ✎ {message.correction}
          </p>
        )}
      </div>
    </div>
  );
}
