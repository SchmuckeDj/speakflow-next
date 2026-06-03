"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { clearTokens } from "@/lib/api";
import { useTheme } from "@/lib/hooks/useTheme";

const XP_TO_UNLOCK: Record<string, number> = {
  A1: 3000, A2: 6000, B1: 10000, B2: 15000, C1: 25000,
};

const NAV_ITEMS = [
  { href: "/dashboard",  label: "Dashboard",   icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { href: "/chat",       label: "AI Chat",     icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
  { href: "/vocabulary", label: "Vocabulario", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> },
  { href: "/challenge",  label: "Challenge",   icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
  { href: "/verbs",      label: "Verbos",      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg> },
  { href: "/game",       label: "Word Attack", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg> },
  { href: "/profile",    label: "Perfil",      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
];

export default function Nav() {
  const pathname = usePathname();
  const router   = useRouter();
  const { theme, toggle } = useTheme();
  const [examReady, setExamReady] = useState(false);

  useEffect(() => {
    try {
      const user   = JSON.parse(localStorage.getItem("sf_user") || "{}");
      const prog   = JSON.parse(localStorage.getItem("sf_progress") || "{}");
      const lvl    = user.level || "A1";
      const xp     = prog.xp || 0;
      const needed = XP_TO_UNLOCK[lvl] ?? 99999;
      setExamReady(xp >= needed && lvl !== "C2");
    } catch {}
  }, [pathname]);

  async function handleLogout() {
    await clearTokens();
    router.push("/login");
  }

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 h-screen sticky top-0 border-r border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-6">
      <Link href="/dashboard" className="flex items-center gap-2.5 px-2 mb-8">
        <span className="w-2 h-2 rounded-full bg-[var(--color-acc)] shadow-[0_0_8px_var(--color-acc)]" />
        <span className="font-semibold tracking-tight">SpeakFlow</span>
      </Link>

      <nav className="flex flex-col gap-0.5 flex-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm transition-all duration-150",
                active
                  ? "bg-[var(--color-acc)]/15 text-[var(--color-acc)] font-medium"
                  : "text-[var(--color-text-2)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)]"
              )}>
              <span className="shrink-0">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}

        {examReady && (
          <Link href="/next-level"
            className={clsx(
              "flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm transition-all mt-1 border",
              pathname === "/next-level"
                ? "bg-amber-500/20 text-amber-400 border-amber-500/40 font-medium"
                : "border-amber-500/30 text-amber-400 hover:bg-amber-500/10 animate-pulse"
            )}>
            <span>🎓</span>
            Subir de nivel
          </Link>
        )}
      </nav>

      <div className="px-2 pt-4 border-t border-[var(--color-border)] space-y-3">
        {/* Toggle tema */}
        <button onClick={toggle}
          className="w-full flex items-center justify-between px-3 py-2 rounded-[var(--radius-md)] text-xs text-[var(--color-text-2)] hover:bg-[var(--color-surface-2)] transition-all">
          <span className="flex items-center gap-2">
            {theme === "dark" ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            )}
            {theme === "dark" ? "Modo oscuro" : "Modo claro"}
          </span>
          <div className={`w-8 h-4 rounded-full relative transition-all ${theme === "light" ? "bg-[var(--color-acc)]" : "bg-[var(--color-surface-2)]"}`}
            style={{ border: "1px solid var(--color-border-2)" }}>
            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all duration-300 ${theme === "light" ? "left-4" : "left-0.5"}`} />
          </div>
        </button>

        <p className="text-xs text-[var(--color-text-3)] px-1">SpeakFlow · Beta</p>
        <button onClick={handleLogout}
          className="flex items-center gap-2 text-xs text-[var(--color-text-3)] hover:text-[var(--color-acc-3)] transition-colors w-full px-1">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
