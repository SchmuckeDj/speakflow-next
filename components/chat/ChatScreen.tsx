"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { SCENARIOS } from "@/lib/data/scenarios";
import { useChat } from "@/lib/hooks/useChat";
import { useToast } from "@/components/ui/Toast";
import { useLimits } from "@/lib/hooks/useLimits";
import ChatMessage from "./ChatMessage";
import ScenarioPicker from "./ScenarioPicker";
import Button from "@/components/ui/Button";
import LimitBanner from "@/components/ui/LimitBanner";
import { apiFetch } from "@/lib/api";

async function speakText(text: string): Promise<void> {
  const clean = text.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1").replace(/`(.*?)`/g, "$1").trim();
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
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(clean.slice(0, 300));
    utt.lang = "en-US"; utt.rate = 0.9;
    window.speechSynthesis.speak(utt);
  }
}

export default function ChatScreen() {
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0]);
  const [input, setInput]         = useState("");
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [speaking, setSpeaking]   = useState(false);
  const { messages, isTyping, sendMessage, reset } = useChat(selectedScenario);
  const { limits, refresh: refreshLimits }         = useLimits();
  const { showXP } = useToast();
  const bottomRef  = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(messages.length);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!autoSpeak) return;
    if (messages.length <= prevCountRef.current) { prevCountRef.current = messages.length; return; }
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
    refreshLimits();
  }

  function handleScenarioChange(s: typeof SCENARIOS[0]) {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setSelectedScenario(s);
    reset();
  }

  const chatLimit  = limits.chat;
  const msgCount   = messages.filter((m) => m.id !== "init").length;
  const isExhausted = chatLimit.exhausted;

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] md:h-[calc(100vh-4rem)] gap-4">
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">AI Chat</h1>
          {msgCount > 0 && <span className="text-xs text-[var(--color-text-3)] font-mono">{msgCount} msgs</span>}
        </div>
        <div className="flex items-center gap-2">
          {/* Contador de límite */}
          {!limits.is_premium && (
            <span className={`text-xs px-2 py-1 rounded-full border font-mono ${
              isExhausted
                ? "border-amber-500/50 bg-amber-500/10 text-amber-400"
                : chatLimit.remaining <= 2
                  ? "border-amber-500/30 bg-amber-500/5 text-amber-300"
                  : "border-[var(--color-border)] text-[var(--color-text-3)]"
            }`}>
              💬 {chatLimit.remaining}/{chatLimit.limit}
            </span>
          )}
          <button
            onClick={() => { setAutoSpeak((v) => !v); window.speechSynthesis?.cancel(); setSpeaking(false); }}
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
                {autoSpeak ? <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/> : <line x1="23" y1="9" x2="17" y2="15"/>}
              </svg>
            )}
            {autoSpeak ? "Voz ON" : "Voz OFF"}
          </button>
          <Button variant="ghost" size="sm" onClick={() => { handleScenarioChange(selectedScenario); }}>Limpiar</Button>
        </div>
      </div>

      <ScenarioPicker scenarios={SCENARIOS} selected={selectedScenario} onSelect={handleScenarioChange} />

      {/* Banner de límite agotado */}
      {isExhausted && (
        <LimitBanner
          feature="chat"
          used={chatLimit.used}
          limit={chatLimit.limit}
          onWatchAd={() => {
            // TODO: integrar red de anuncios
            alert("Próximamente: ver anuncio para ganar más mensajes 🎯");
          }}
        />
      )}

      <div className="flex-1 overflow-y-auto space-y-4 py-2 pr-1">
        {messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-[var(--color-acc)]/20 border border-[var(--color-acc)]/30 flex items-center justify-center text-xs text-[var(--color-acc)] shrink-0">AI</div>
            <div className="bg-[var(--color-surface-2)] rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
              {[0,1,2].map((i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-2)] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 border-t border-[var(--color-border)] pt-4 shrink-0">
        <input
          type="text" value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && !isExhausted && handleSend()}
          placeholder={isExhausted ? "Límite diario alcanzado — vuelve mañana" : "Escribe en inglés..."}
          disabled={isExhausted}
          className="flex-1 bg-[var(--color-surface-2)] border border-[var(--color-border-2)] rounded-[var(--radius-md)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-acc)] disabled:opacity-50"
        />
        <Button onClick={handleSend} disabled={!input.trim() || isTyping || isExhausted}>Send</Button>
      </div>
    </div>
  );
}
