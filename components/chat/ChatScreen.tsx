"use client";

import { useState, useRef, useEffect } from "react";
import { SCENARIOS } from "@/lib/data/scenarios";
import { useChat } from "@/lib/hooks/useChat";
import { useToast } from "@/components/ui/Toast";
import ChatMessage from "./ChatMessage";
import ScenarioPicker from "./ScenarioPicker";
import Button from "@/components/ui/Button";

export default function ChatScreen() {
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0]);
  const [input, setInput] = useState("");
  const { messages, isTyping, sendMessage, reset } = useChat(selectedScenario);
  const { showXP } = useToast();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    sendMessage(text);
    showXP(5);
  }

  function handleScenarioChange(s: typeof SCENARIOS[0]) {
    setSelectedScenario(s);
    reset();
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] md:h-[calc(100vh-4rem)] gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">AI Chat</h1>
        <Button variant="ghost" size="sm" onClick={reset}>Reiniciar</Button>
      </div>

      <ScenarioPicker scenarios={SCENARIOS} selected={selectedScenario} onSelect={handleScenarioChange} />

      <div className="flex-1 overflow-y-auto space-y-4 py-2 pr-1">
        {messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-[var(--color-acc)]/20 border border-[var(--color-acc)]/30 flex items-center justify-center text-xs text-[var(--color-acc)] shrink-0">AI</div>
            <div className="bg-[var(--color-surface-2)] rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-2)] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 border-t border-[var(--color-border)] pt-4">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Escribe en inglés..."
          className="flex-1 bg-[var(--color-surface-2)] border border-[var(--color-border-2)] rounded-[var(--radius-md)] px-4 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-3)] focus:outline-none focus:border-[var(--color-acc)]"
        />
        <Button onClick={handleSend} disabled={!input.trim()}>Send</Button>
      </div>
    </div>
  );
}
