"use client";

import { useState, useRef, useEffect } from "react";
import { SCENARIOS } from "@/lib/data/scenarios";
import { useChat } from "@/lib/hooks/useChat";
import { useToast } from "@/components/ui/Toast";
import { useLimits } from "@/lib/hooks/useLimits";
import ChatMessage from "./ChatMessage";
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
  const [showScenarios, setShowScenarios] = useState(false);
  const { messages, isTyping, sendMessage, reset } = useChat(selectedScenario);
  const { limits, refresh: refreshLimits }         = useLimits();
  const { showXP } = useToast();
  const bottomRef    = useRef<HTMLDivElement>(null);
  const inputRef     = useRef<HTMLInputElement>(null);
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
    if (!text || isExhausted) return;
    setInput("");
    inputRef.current?.focus();
    await sendMessage(text);
    showXP(5);
    refreshLimits();
  }

  function handleScenarioChange(s: typeof SCENARIOS[0]) {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setSelectedScenario(s);
    setShowScenarios(false);
    reset();
  }

  const chatLimit  = limits.chat;
  const isExhausted = chatLimit.exhausted;
  const msgCount   = messages.filter((m) => m.id !== "init").length;

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] md:h-[calc(100vh-4rem)]">

      {/* ── Header estilo app de chat ── */}
      <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface)]"
        style={{ borderRadius: "var(--radius-lg) var(--radius-lg) 0 0" }}>

        {/* Avatar del escenario */}
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 relative"
          style={{ background: "linear-gradient(135deg, var(--color-acc)/20, var(--color-acc-2)/20)", border: "1.5px solid var(--color-acc)" }}>
          {selectedScenario.icon}
          {/* Online indicator */}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2"
            style={{ borderColor: "var(--color-surface)" }} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-[var(--color-text)] truncate">{selectedScenario.title}</p>
          <p className="text-xs text-[var(--color-text-3)] truncate">{selectedScenario.subtitle}</p>
        </div>

        {/* Acciones del header */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Contador de mensajes restantes */}
          {!limits.is_premium && (
            <span className={`text-xs px-2 py-1 rounded-full font-mono ${
              isExhausted ? "bg-amber-500/20 text-amber-400" :
              chatLimit.remaining <= 2 ? "bg-amber-500/10 text-amber-300" :
              "bg-[var(--color-surface-2)] text-[var(--color-text-3)]"
            }`}>
              {chatLimit.remaining}/{chatLimit.limit}
            </span>
          )}

          {/* Toggle voz */}
          <button onClick={() => { setAutoSpeak((v) => !v); window.speechSynthesis?.cancel(); setSpeaking(false); }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              autoSpeak ? "bg-[var(--color-acc)]/15 text-[var(--color-acc)]" : "text-[var(--color-text-3)]"
            }`}
            title={autoSpeak ? "Silenciar" : "Activar voz"}>
            {speaking ? (
              <span className="flex gap-0.5 items-end h-3">
                {[0,1,2].map((i) => (
                  <span key={i} className="w-0.5 rounded-full animate-bounce"
                    style={{ height: `${5+i*2}px`, background: "var(--color-acc)", animationDelay: `${i*0.1}s` }} />
                ))}
              </span>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                {autoSpeak ? <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/> : <line x1="23" y1="9" x2="17" y2="15"/>}
              </svg>
            )}
          </button>

          {/* Cambiar escenario */}
          <button onClick={() => setShowScenarios((v) => !v)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-text-3)] hover:text-[var(--color-text)] transition-all hover:bg-[var(--color-surface-2)]"
            title="Cambiar escenario">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
            </svg>
          </button>

          {/* Limpiar chat */}
          <button onClick={() => { window.speechSynthesis?.cancel(); setSpeaking(false); reset(); }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-text-3)] hover:text-[var(--color-text)] transition-all hover:bg-[var(--color-surface-2)]"
            title="Nueva conversación">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Selector de escenarios (dropdown) ── */}
      {showScenarios && (
        <div className="shrink-0 grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
          {SCENARIOS.map((s) => (
            <button key={s.id} onClick={() => handleScenarioChange(s)}
              className={`flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] text-xs font-medium text-left transition-all border ${
                selectedScenario.id === s.id
                  ? "border-[var(--color-acc)] bg-[var(--color-acc)]/10 text-[var(--color-acc)]"
                  : "border-[var(--color-border)] text-[var(--color-text-2)] hover:border-[var(--color-acc)]/40"
              }`}>
              <span className="text-base">{s.icon}</span>
              <div className="min-w-0">
                <p className="font-semibold truncate">{s.title}</p>
                <p className="text-[var(--color-text-3)] truncate">{s.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ── Banner límite ── */}
      {isExhausted && (
        <div className="shrink-0 px-4 pt-3">
          <LimitBanner feature="chat" used={chatLimit.used} limit={chatLimit.limit}
            onWatchAd={() => alert("Próximamente: ver anuncio para ganar más mensajes 🎯")} />
        </div>
      )}

      {/* ── Mensajes ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Mensaje de inicio estilo sistema */}
        <div className="flex justify-center">
          <span className="text-xs text-[var(--color-text-3)] bg-[var(--color-surface-2)] px-3 py-1 rounded-full border border-[var(--color-border)]">
            {selectedScenario.icon} {selectedScenario.title} · {msgCount > 0 ? `${msgCount} mensajes` : "Nueva conversación"}
          </span>
        </div>

        {messages.filter((m) => m.id !== "init").map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isTyping && (
          <div className="flex gap-2 items-end">
            <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-sm"
              style={{ background: "linear-gradient(135deg, var(--color-acc)/20, var(--color-acc-2)/20)", border: "1px solid var(--color-acc)/30" }}>
              {selectedScenario.icon}
            </div>
            <div className="bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
              {[0,1,2].map((i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-2)] animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div className="shrink-0 px-4 py-3 border-t border-[var(--color-border)] bg-[var(--color-surface)]"
        style={{ borderRadius: "0 0 var(--radius-lg) var(--radius-lg)" }}>
        <div className="flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text" value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={isExhausted ? "Límite diario alcanzado" : `Message ${selectedScenario.title}...`}
            disabled={isExhausted}
            className="flex-1 rounded-full px-4 py-2.5 text-sm focus:outline-none disabled:opacity-50 transition-all"
            style={{
              background: "var(--color-surface-2)",
              border: "1.5px solid var(--color-border-2)",
              color: "var(--color-text)",
            }}
          />
          <button onClick={handleSend}
            disabled={!input.trim() || isTyping || isExhausted}
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, var(--color-acc), var(--color-acc-2))" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
