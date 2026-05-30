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
  const [open, setOpen]       = useState(false);
  const [text, setText]       = useState("");
  const [result, setResult]   = useState("");
  const [from, setFrom]       = useState("es");
  const [to, setTo]           = useState("en");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const debounceRef           = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function translate(input: string) {
    if (!input.trim()) { setResult(""); return; }
    setLoading(true); setError("");
    try {
      const res  = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(input)}&langpair=${from}|${to}`
      );
      const data = await res.json();
      if (data.responseStatus === 200) setResult(data.responseData.translatedText);
      else setError("No se pudo traducir.");
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
    setFrom(to); setTo(from);
    setText(result); setResult(text);
  }

  return (
    <>
      {/* Botón flotante — subido más en móvil */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-28 right-4 md:bottom-6 md:right-6 z-50 w-11 h-11 md:w-12 md:h-12 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        style={{ background: "linear-gradient(135deg, var(--color-acc), var(--color-acc-2))", boxShadow: "0 8px 24px rgba(124,106,255,0.4)" }}
        title="Traductor"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M5 8l6 6"/><path d="M4 14s-1-1 1-3 3-1 3-1"/>
          <path d="M2 5h12"/><path d="M7 2h1"/>
          <path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/>
        </svg>
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-40 right-4 md:bottom-20 md:right-6 z-50 w-72 md:w-80 rounded-[var(--radius-xl)] shadow-2xl overflow-hidden"
          style={{ background: "#ffffff", border: "1px solid #e2e8f0" }}>

          <div className="flex items-center justify-between px-4 py-3"
            style={{ background: "#f1f5f9", borderBottom: "1px solid #e2e8f0" }}>
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c6aff" strokeWidth="2">
                <path d="M5 8l6 6"/><path d="M4 14s-1-1 1-3 3-1 3-1"/>
                <path d="M2 5h12"/><path d="M7 2h1"/>
                <path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/>
              </svg>
              <span className="text-sm font-semibold text-gray-700">Traductor</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2 px-4 py-2" style={{ borderBottom: "1px solid #e2e8f0" }}>
            <select value={from} onChange={(e) => setFrom(e.target.value)}
              className="flex-1 text-xs rounded-lg px-2 py-1.5 focus:outline-none"
              style={{ background: "#f8fafc", border: "1px solid #cbd5e1", color: "#374151" }}>
              {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
            <button onClick={swap} className="p-1.5 rounded-full transition-all hover:scale-110"
              style={{ background: "#ede9fe", color: "#7c6aff" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M7 16V4m0 0L3 8m4-4l4 4"/><path d="M17 8v12m0 0l4-4m-4 4l-4-4"/>
              </svg>
            </button>
            <select value={to} onChange={(e) => setTo(e.target.value)}
              className="flex-1 text-xs rounded-lg px-2 py-1.5 focus:outline-none"
              style={{ background: "#f8fafc", border: "1px solid #cbd5e1", color: "#374151" }}>
              {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
          </div>

          <div className="p-3 space-y-2">
            <textarea value={text} onChange={(e) => handleInput(e.target.value)}
              placeholder="Escribe para traducir..." rows={3}
              className="w-full text-sm rounded-lg px-3 py-2 resize-none focus:outline-none"
              style={{ background: "#f8fafc", border: "1px solid #cbd5e1", color: "#1e293b" }} />

            <div className="min-h-[56px] rounded-lg px-3 py-2 text-sm"
              style={{
                background: error ? "#fef2f2" : "#f0fdf4",
                border: `1px solid ${error ? "#fca5a5" : "#bbf7d0"}`,
                color: error ? "#dc2626" : "#166534",
              }}>
              {loading ? (
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="w-3 h-3 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
                  <span className="text-xs">Traduciendo...</span>
                </div>
              ) : error ? error : result || (
                <span className="text-gray-400 text-xs">La traducción aparecerá aquí</span>
              )}
            </div>

            {result && !error && (
              <button onClick={() => navigator.clipboard.writeText(result)}
                className="text-xs flex items-center gap-1" style={{ color: "#7c6aff" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copiar
              </button>
            )}
          </div>

          <div className="px-4 pb-2 text-[10px] text-center" style={{ color: "#94a3b8" }}>
            MyMemory · ES ↔ EN ↔ FR ↔ PT ↔ DE
          </div>
        </div>
      )}
    </>
  );
}
