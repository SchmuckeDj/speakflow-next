"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { SCENARIOS } from "@/lib/data/scenarios";
import { useChat } from "@/lib/hooks/useChat";
import { useToast } from "@/components/ui/Toast";
import ChatMessage from "./ChatMessage";
import ScenarioPicker from "./ScenarioPicker";
import Button from "@/components/ui/Button";
import { apiFetch } from "@/lib/api";

async function speakText(text: string): Promise<void> {
  // Limpiar markdown básico antes de hablar
  const clean = text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .trim();

  try {
    const res = await apiFetch("/api/tts/", {
      method: "POST",
      body: JSON.stringify({ text: clean.slice(0, 300), voice: "female", speed: 0.9 }),
    });
    if (res.ok) {
      const data   = await res.json();
      const binary = atob(data.audio_base64);
      const bytes  = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob   = new Blob([bytes], { type: "audio/mp3" });
      const url    = URL.createObjectURL(blob);
      const audio  = new Audio(url);
      audio.onended = () => URL.revokeObjectURL(url);
      await audio.play();
      return;
    }
  } catch {}

  // Fallback Web Speech
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utt  = new SpeechSynthesisUtterance(clean.slice(0, 300));
    utt.lang   = "en-US";
    utt.rate   = 0.9;
    window.speechSynthesis.speak(utt);
  }
}

export default function ChatScreen() {
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0]);
  const [input, setInput]     = useState("");
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [speaking, setSpeaking]   = useState(false);
  const { messages, isTyping, sendMessage, reset } = useChat(selectedScenario);
  const { showXP } = useToast();
  const bottomRef  = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(messages.length);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Auto-speak cuando llega un mensaje nuevo del AI
  useEffect(() => {
    if (!autoSpeak) return;
    if (messages.length <= prevCountRef.current) {
      prevCountRef.current = messages.length;
      return;
    }
    prevCountRef.current = messages.length;
    const last = messages[messages.length - 1];
    if (last?.role === "assistant" && last.id !== "init") {
      setSpeaking(true);
      speakText(last.content).finally(() => setSpeaking(false));
    }
  }, [messages, autoSpeak]);

  async function handleSend() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    await sendMessage(text);
    showXP(5);
  }

  function handleScenarioChange(s: typeof SCENARIOS[0]) {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setSelectedScenario(s);
    reset();
  }

  const msgCount = messages.filter((m) => m.id !== "init").length;

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] md:h-[calc(100vh-4rem)] gap-4">

      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">AI Chat</h1>
          {msgCount > 0 && (
            <span className="text-xs text-[var(--color-text-3)] font-mono">{msgCount} msgs</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Toggle auto-speak */}
          <button
            onClick={() => { setAutoSpeak((v) => !v); window.speechSynthesis?.cancel(); setSpeaking(false); }}
            title={autoSpeak ? "Silenciar AI" : "Activar voz AI"}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full border transition-all ${
              autoSpeak
                ? "border-[var(--color-acc)]/50 bg-[var(--color-acc)]/10 text-[var(--color-acc)]"
                : "border-[var(--color-border)] text-[var(--color-text-3)]"
            }`}>
            {speaking ? (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-acc)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-acc)]" />
              </span>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                {autoSpeak
                  ? <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                  : <line x1="23" y1="9" x2="17" y2="15"/>
                }
              </svg>
            )}
            {autoSpeak ? "Voz ON" : "Voz OFF"}
          </button>
          <Button variant="ghost" size="sm" onClick={() => { handleScenarioChange(selectedScenario); }}>
            Limpiar
          </Button>
        </div>
      </div>

      <ScenarioPicker scenarios={SCENARIOS} selected={selectedScenario} onSelect={handleScenarioChange} />

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto space-y-4 py-2 pr-1">
        {messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-[var(--color-acc)]/20 border border-[var(--color-acc)]/30 flex items-center justify-center text-xs text-[var(--color-acc)] shrink-0">AI</div>
            <div className="bg-[var(--color-surface-2)] rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-2)] animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 border-t border-[var(--color-border)] pt-4 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Escribe en inglés..."
          className="flex-1 bg-[var(--color-surface-2)] border border-[var(--color-border-2)] rounded-[var(--radius-md)] px-4 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-3)] focus:outline-none focus:border-[var(--color-acc)]"
        />
        <Button onClick={handleSend} disabled={!input.trim() || isTyping}>Send</Button>
      </div>
    </div>
  );
}
