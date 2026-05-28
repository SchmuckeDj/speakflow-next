"use client";

import { useState, useRef } from "react";

const LANGUAGES = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "pt", label: "Português" },
  { code: "de", label: "Deutsch" },
];

export default function TranslatorWidget() {
  const [open, setOpen]           = useState(false);
  const [text, setText]           = useState("");
  const [result, setResult]       = useState("");
  const [from, setFrom]           = useState("es");
  const [to, setTo]               = useState("en");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const debounceRef               = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function translate(input: string) {
    if (!input.trim()) { setResult(""); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(input)}&langpair=${from}|${to}`
      );
      const data = await res.json();
      if (data.responseStatus === 200) {
        setResult(data.responseData.translatedText);
      } else {
        setError("No se pudo traducir.");
      }
    } catch {
      setError("Error de conexión.");
    } finally {
      setLoading(false);
    }
  }

  function handleInput(val: string) {
    setText(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => translate(val), 600);
  }

  function swap() {
    setFrom(to);
    setTo(from);
    setText(result);
    setResult(text);
  }

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        style={{ background: "linear-gradient(135deg, var(--color-acc), var(--color-acc-2))", boxShadow: "0 8px 24px rgba(124,106,255,0.4)" }}
        title="Traductor"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M5 8l6 6"/>
          <path d="M4 14s-1-1 1-3 3-1 3-1"/>
          <path d="M2 5h12"/>
          <path d="M7 2h1"/>
          <path d="M22 22l-5-10-5 10"/>
          <path d="M14 18h6"/>
        </svg>
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-80 rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-2xl overflow-hidden"
          style={{ background: "var(--color-surface)" }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]"
            style={{ background: "var(--color-surface-2)" }}>
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--color-acc)]">
                <path d="M5 8l6 6"/><path d="M4 14s-1-1 1-3 3-1 3-1"/>
                <path d="M2 5h12"/><path d="M7 2h1"/>
                <path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/>
              </svg>
              <span className="text-sm font-medium">Traductor</span>
            </div>
            <button onClick={() => setOpen(false)}
              className="text-[var(--color-text-3)] hover:text-[var(--color-text)] transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Selector de idiomas */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--color-border)]">
            <select value={from} onChange={(e) => setFrom(e.target.value)}
              className="flex-1 text-xs bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-2 py-1.5 focus:outline-none focus:border-[var(--color-acc)]">
              {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>

            <button onClick={swap}
              className="p-1.5 rounded-full border border-[var(--color-border)] hover:border-[var(--color-acc)] hover:text-[var(--color-acc)] transition-all">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 16V4m0 0L3 8m4-4l4 4"/><path d="M17 8v12m0 0l4-4m-4 4l-4-4"/>
              </svg>
            </button>

            <select value={to} onChange={(e) => setTo(e.target.value)}
              className="flex-1 text-xs bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-2 py-1.5 focus:outline-none focus:border-[var(--color-acc)]">
              {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
          </div>

          {/* Input */}
          <div className="p-3 space-y-2">
            <textarea
              value={text}
              onChange={(e) => handleInput(e.target.value)}
              placeholder="Escribe para traducir..."
              rows={3}
              className="w-full text-sm bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2 resize-none focus:outline-none focus:border-[var(--color-acc)] text-[var(--color-text)] placeholder:text-[var(--color-text-3)]"
            />

            {/* Resultado */}
            <div className={`min-h-[60px] rounded-[var(--radius-md)] border px-3 py-2 text-sm ${
              error ? "border-red-500/30 bg-red-500/5 text-red-400" :
              "border-[var(--color-border)] bg-[var(--color-acc)]/5 text-[var(--color-text)]"
            }`}>
              {loading ? (
                <div className="flex items-center gap-2 text-[var(--color-text-3)]">
                  <div className="w-3 h-3 rounded-full border border-[var(--color-acc)] border-t-transparent animate-spin" />
                  <span className="text-xs">Traduciendo...</span>
                </div>
              ) : error ? error : result || (
                <span className="text-[var(--color-text-3)] text-xs">La traducción aparecerá aquí</span>
              )}
            </div>

            {/* Copiar resultado */}
            {result && !error && (
              <button
                onClick={() => navigator.clipboard.writeText(result)}
                className="text-xs text-[var(--color-acc)] hover:underline flex items-center gap-1">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copiar traducción
              </button>
            )}
          </div>

          <div className="px-4 pb-3 text-[10px] text-[var(--color-text-3)] text-center">
            Powered by MyMemory · ES ↔ EN ↔ FR ↔ PT ↔ DE
          </div>
        </div>
      )}
    </>
  );
}
