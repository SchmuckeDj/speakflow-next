"use client";

import { useState, useRef, useEffect } from "react";
import { useGame, LEVELS } from "@/lib/hooks/useGame";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

function playSound(path: string, volume = 1) {
  try { const a = new Audio(path); a.volume = volume; a.play().catch(() => {}); } catch (_) {}
}

function playExplosion(isBoss = false) {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const dur = isBoss ? 0.6 : 0.25;
    const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, isBoss ? 1.5 : 2);
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(isBoss ? 0.6 : 0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    src.connect(gain); gain.connect(ctx.destination); src.start();
    setTimeout(() => ctx.close(), (dur + 0.1) * 1000);
  } catch (_) {}
}

let ambientCtx: AudioContext | null = null;
function startAmbient() {
  try {
    if (ambientCtx) return;
    ambientCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ambientCtx.createOscillator();
    const gain = ambientCtx.createGain();
    osc.type = "sine"; osc.frequency.value = 60; gain.gain.value = 0.05;
    osc.connect(gain); gain.connect(ambientCtx.destination); osc.start();
  } catch (_) {}
}
function stopAmbient() {
  try { ambientCtx?.close(); } catch (_) {}
  ambientCtx = null;
}

function rockImg(id: string, isBoss: boolean) {
  if (isBoss) return "/assets/img/rock1.jpg";
  const sum = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return ["/assets/img/rock1.jpg", "/assets/img/rock2.jpg", "/assets/img/rock3.jpg"][sum % 3];
}

const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  left: `${(i * 37 + 13) % 100}%`,
  top:  `${(i * 53 + 7)  % 100}%`,
  size: i % 7 === 0 ? 2 : 1,
  dur:  `${1.5 + (i % 4) * 0.7}s`,
  delay:`${(i % 10) * 0.3}s`,
}));

export default function GameScreen() {
  const {
    words, score, lives, running, gameOver,
    currentLevel, bossActive, wordsDestroyed,
    start, typeWord,
    CANVAS_W, CANVAS_H, WORDS_TO_NEXT_LEVEL, MAX_LIVES,
  } = useGame();

  const { showXP, showToast } = useToast();
  const [input, setInput]           = useState("");
  const [exploding, setExploding]   = useState<Set<string>>(new Set());
  const [levelUpFlash, setLevelUpFlash] = useState(false);
  const [arenaH, setArenaH]         = useState<number | null>(null);
  const inputRef  = useRef<HTMLInputElement>(null);
  const prevLevel = useRef(0);
  const prevBoss  = useRef(false);

  // ── Ajustar altura arena al viewport visual (teclado móvil) ──
  useEffect(() => {
    function updateHeight() {
      const vv = window.visualViewport;
      if (!vv) return;
      // Espacio disponible = altura viewport visual - header (~56px) - input (~56px) - progress (~28px) - gaps (~24px)
      const available = vv.height - 56 - 56 - 28 - 24;
      setArenaH(Math.max(180, available));
    }

    updateHeight();
    window.visualViewport?.addEventListener("resize", updateHeight);
    window.visualViewport?.addEventListener("scroll", updateHeight);
    window.addEventListener("resize", updateHeight);
    return () => {
      window.visualViewport?.removeEventListener("resize", updateHeight);
      window.visualViewport?.removeEventListener("scroll", updateHeight);
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  useEffect(() => () => stopAmbient(), []);

  useEffect(() => {
    if (bossActive && !prevBoss.current) {
      playSound("/assets/sounds/tindeck_1.mp3", 0.7);
      showToast("☄️ Boss meteorito — escribe la frase completa", "info");
    }
    prevBoss.current = bossActive;
  }, [bossActive, showToast]);

  useEffect(() => {
    if (currentLevel > prevLevel.current) {
      playSound("/assets/sounds/yeah-boiii-i-i-i.mp3", 0.8);
      setLevelUpFlash(true);
      setTimeout(() => setLevelUpFlash(false), 1200);
      showXP(50);
      showToast(`Nivel ${currentLevel + 1} — ${LEVELS[currentLevel].label}`, "success");
    }
    prevLevel.current = currentLevel;
  }, [currentLevel, showXP, showToast]);

  useEffect(() => {
    if (gameOver) { stopAmbient(); playSound("/assets/sounds/risas-de-ardilla.mp3", 0.9); }
  }, [gameOver]);

  function handleType(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setInput(val);
    const match = words.find((w) => w.text.toLowerCase() === val.trim().toLowerCase());
    if (match) {
      playExplosion(match.isBoss);
      setExploding((prev) => new Set(prev).add(match.id));
      const xp = match.isBoss ? 50 : 10;
      showXP(xp);
      setTimeout(() => {
        typeWord(val.trim());
        setExploding((prev) => { const s = new Set(prev); s.delete(match.id); return s; });
      }, 300);
      setInput("");
    }
  }

  function handleStart() {
    startAmbient();
    start();
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  const lvlData  = LEVELS[currentLevel];
  const progress = Math.min(wordsDestroyed / WORDS_TO_NEXT_LEVEL, 1);
  const hearts   = Array.from({ length: MAX_LIVES }, (_, i) => i < lives ? "❤️" : "🖤");

  // Altura de la arena: en desktop usa flex-1, en móvil usa arenaH calculado
  const arenaStyle: React.CSSProperties = arenaH !== null
    ? { height: arenaH }
    : { flex: 1, minHeight: 0 };

  return (
    <div className="flex flex-col gap-2" style={{ height: "calc(100dvh - 5rem)" }}>

      <style>{`
        @keyframes spacescroll {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; }
          50%       { opacity: 0.9; }
        }
        @keyframes rockrotate {
          from { transform: translateX(-50%) rotate(0deg); }
          to   { transform: translateX(-50%) rotate(360deg); }
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between shrink-0 gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <h1 className="text-base font-semibold whitespace-nowrap">Word Attack</h1>
          {running && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-acc)]/20 text-[var(--color-acc)] font-medium whitespace-nowrap hidden sm:inline">
              {lvlData.label}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0 text-sm">
          <span className="tracking-wide text-xs sm:text-sm">{hearts.join("")}</span>
          <span className="font-mono text-[var(--color-acc)] font-medium text-xs sm:text-sm">⚡ {score}</span>
        </div>
      </div>

      {/* Barra progreso */}
      {running && (
        <div className="shrink-0 space-y-0.5">
          <div className="flex justify-between text-[10px] text-[var(--color-text-3)]">
            <span className="truncate">{bossActive ? "☄️ BOSS" : `Nv ${currentLevel + 1}/${LEVELS.length}`}</span>
            <span>{bossActive ? "" : `${wordsDestroyed}/${WORDS_TO_NEXT_LEVEL}`}</span>
          </div>
          <div className="h-1 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${bossActive ? "bg-orange-400 w-full animate-pulse" : "bg-[var(--color-acc)]"}`}
              style={!bossActive ? { width: `${progress * 100}%` } : undefined}
            />
          </div>
        </div>
      )}

      {/* Arena */}
      <div
        className="relative rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden shrink-0"
        style={arenaStyle}
      >
        <div className="absolute inset-0"
          style={{ backgroundImage: "url(/assets/img/backg.avif)", backgroundSize: "cover", animation: running ? "spacescroll 18s linear infinite" : "none" }}
        />
        <div className={`absolute inset-0 transition-colors duration-500 ${levelUpFlash ? "bg-[var(--color-acc)]/20" : "bg-black/40"}`} />

        <div className="absolute inset-0 pointer-events-none">
          {STARS.map((s) => (
            <div key={s.id} className="absolute rounded-full bg-white"
              style={{ left: s.left, top: s.top, width: s.size, height: s.size, animation: `twinkle ${s.dur} ease-in-out ${s.delay} infinite` }}
            />
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-red-500/30 to-transparent pointer-events-none z-10" />

        {words.map((w) => {
          const pctX      = (w.x / CANVAS_W) * 100;
          const pctY      = (w.y / CANVAS_H) * 100;
          const isExploding = exploding.has(w.id);
          const isBoss    = w.isBoss;
          // Rocas más pequeñas en móvil
          const rockSize  = isBoss ? 56 : 34;

          return (
            <div key={w.id} className="absolute flex flex-col items-center gap-0.5 z-20"
              style={{
                left: `${pctX}%`, top: `${pctY}%`,
                transform: "translateX(-50%)",
                opacity: isExploding ? 0 : 1,
                scale: isExploding ? (isBoss ? "3" : "2") : "1",
                transition: "scale 0.3s ease, opacity 0.3s ease",
              }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={rockImg(w.id, !!isBoss)} alt="" className="rounded-full object-cover border-2"
                style={{
                  width: rockSize, height: rockSize,
                  borderColor: isBoss ? "rgba(255,120,0,0.6)" : "rgba(255,255,255,0.2)",
                  filter: isBoss ? "brightness(0.9) saturate(1.2) sepia(0.3)" : "brightness(0.8) saturate(0.7)",
                  boxShadow: isBoss ? "0 0 16px rgba(255,100,0,0.5)" : "none",
                  animation: `rockrotate ${isBoss ? 4 : 6}s linear infinite`,
                }}
              />
              <span className="font-mono font-bold text-white bg-black/75 backdrop-blur-sm px-1.5 py-0.5 rounded-full border whitespace-nowrap"
                style={{
                  fontSize: isBoss ? "9px" : "8px",
                  borderColor: isBoss ? "rgba(255,120,0,0.5)" : "rgba(255,255,255,0.2)",
                  maxWidth: isBoss ? 180 : 110,
                  textAlign: "center", lineHeight: 1.3,
                }}>
                {w.text}
              </span>
            </div>
          );
        })}

        {levelUpFlash && (
          <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
            <p className="text-2xl font-bold text-[var(--color-acc)] drop-shadow-lg animate-bounce">
              ⬆ LEVEL {currentLevel + 1}
            </p>
          </div>
        )}

        {!running && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-black/75 backdrop-blur-sm p-4">
            {gameOver ? (
              <>
                <p className="text-2xl font-semibold">💥 Game Over</p>
                <p className="text-sm text-[var(--color-text-2)] text-center">Nivel {currentLevel + 1} · Score: {score}</p>
              </>
            ) : (
              <>
                <p className="text-xl font-bold text-white">Word Attack</p>
                <div className="text-center space-y-1 text-xs text-white/60 max-w-xs">
                  <p>Escribe las palabras para destruir las rocas.</p>
                  <p>A1 → C2 · Boss meteor por nivel.</p>
                </div>
              </>
            )}
            <Button onClick={handleStart} size="md">{gameOver ? "Jugar de nuevo" : "Empezar"}</Button>
          </div>
        )}
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleType}
        disabled={!running}
        enterKeyHint="send"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        placeholder={running ? (bossActive ? "Escribe la frase..." : "Escribe la palabra...") : "Inicia el juego primero"}
        className="shrink-0 w-full bg-[var(--color-surface)] border rounded-[var(--radius-md)] px-4 py-3 text-sm font-mono text-[var(--color-text)] placeholder:text-[var(--color-text-3)] focus:outline-none disabled:opacity-50 transition-colors"
        style={{ borderColor: bossActive && running ? "rgba(255,120,0,0.6)" : "var(--color-border-2)" }}
      />
    </div>
  );
}
