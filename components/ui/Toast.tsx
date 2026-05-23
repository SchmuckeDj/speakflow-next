"use client";

import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import clsx from "clsx";

type ToastType = "xp" | "success" | "error" | "info";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  visible: boolean;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
  showXP: (amount: number) => void;
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
  showXP: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

const ICONS: Record<ToastType, string> = {
  xp:      "⚡",
  success: "✓",
  error:   "✕",
  info:    "◎",
};

const STYLES: Record<ToastType, string> = {
  xp:      "border-[var(--color-acc)] bg-[var(--color-acc)]/10 text-[var(--color-acc)]",
  success: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400",
  error:   "border-red-500/50 bg-red-500/10 text-red-400",
  info:    "border-[var(--color-border-2)] bg-[var(--color-surface-2)] text-[var(--color-text-2)]",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timerRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const remove = useCallback((id: string) => {
    // Primero animar salida, luego eliminar
    setToasts((prev) => prev.map((t) => t.id === id ? { ...t, visible: false } : t));
    clearTimeout(timerRef.current[id]);
    delete timerRef.current[id];
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 300);
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev.slice(-3), { id, message, type, visible: false }]);
    // Forzar visible en siguiente frame para que CSS transition arranque
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setToasts((prev) => prev.map((t) => t.id === id ? { ...t, visible: true } : t));
      });
    });
    timerRef.current[id] = setTimeout(() => remove(id), 3000);
  }, [remove]);

  const showXP = useCallback((amount: number) => {
    showToast(`+${amount} XP`, "xp");
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, showXP }}>
      {children}
      <div className="fixed bottom-6 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            onClick={() => remove(t.id)}
            className={clsx(
              "flex items-center gap-2.5 px-4 py-2.5 rounded-[var(--radius-lg)] border text-sm font-medium shadow-lg pointer-events-auto cursor-pointer",
              "transition-all duration-300",
              STYLES[t.type],
              t.visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            )}
          >
            <span className="text-base leading-none">{ICONS[t.type]}</span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
