"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { apiFetch, saveTokens } from "@/lib/api";

function waitForGoogle(timeout = 5000): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.google?.accounts?.oauth2) { resolve(true); return; }
    const interval = setInterval(() => {
      if (window.google?.accounts?.oauth2) { clearInterval(interval); resolve(true); }
    }, 100);
    setTimeout(() => { clearInterval(interval); resolve(false); }, timeout);
  });
}

export default function RegisterForm() {
  const router = useRouter();
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [error,    setError]    = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) { setError("Completa todos los campos."); return; }
    if (password.length < 8) { setError("Contraseña mínimo 8 caracteres."); return; }
    setError(""); setLoading(true);
    try {
      const res  = await apiFetch("/api/auth/register/", {
        method: "POST", body: JSON.stringify({ username: name, email, password }), auth: false,
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data.email?.[0] ?? data.password?.[0] ?? data.error ?? "Error al registrarse.";
        setError(msg); setLoading(false); return;
      }
      saveTokens(data.tokens.access, data.tokens.refresh);
      localStorage.setItem("sf_user", JSON.stringify({ name: data.user.username, email: data.user.email, level: null, isNew: true }));
      document.cookie = "sf_session=1; path=/; max-age=604800; SameSite=Lax";
      router.push("/onboarding");
    } catch {
      setError("No se pudo conectar al servidor."); setLoading(false);
    }
  }

  async function handleGoogle() {
    setGLoading(true); setError("");
    try {
      const ready = await waitForGoogle();
      if (!ready) {
        setError("Google no cargó. Recarga la página e intenta de nuevo.");
        setGLoading(false); return;
      }

      const client = window.google!.accounts!.oauth2!.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        scope: "email profile",
        callback: async (response) => {
          if (response.error || !response.access_token) {
            setError("Error con Google. Intenta de nuevo."); setGLoading(false); return;
          }
          try {
            const res  = await apiFetch("/api/auth/google/", {
              method: "POST", body: JSON.stringify({ access_token: response.access_token }), auth: false,
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error ?? "Error con Google."); setGLoading(false); return; }
            saveTokens(data.tokens.access, data.tokens.refresh);
            localStorage.setItem("sf_user", JSON.stringify({ name: data.user.username, email: data.user.email, level: data.user.level || "" }));
            document.cookie = "sf_session=1; path=/; max-age=604800; SameSite=Lax";
            router.push(data.created || !data.user.level ? "/onboarding" : "/dashboard");
          } catch {
            setError("Error conectando con el servidor."); setGLoading(false);
          }
        },
      });
      client?.requestAccessToken();
    } catch {
      setError("Error iniciando Google. Intenta de nuevo."); setGLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-acc)] shadow-[0_0_12px_var(--color-acc)]" />
          <span className="font-semibold text-lg tracking-tight">SpeakFlow</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Crea tu cuenta</h1>
        <p className="text-sm text-[var(--color-text-2)]">Empieza a hablar inglés con IA hoy mismo</p>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6 space-y-4">

        <Button variant="ghost" className="w-full" size="md" onClick={handleGoogle} disabled={gLoading}>
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {gLoading ? "Conectando..." : "Continuar con Google"}
        </Button>

        <div className="relative flex items-center gap-3">
          <div className="flex-1 h-px bg-[var(--color-border)]" />
          <span className="text-xs text-[var(--color-text-3)]">o</span>
          <div className="flex-1 h-px bg-[var(--color-border)]" />
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--color-text-2)] font-medium">Nombre</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Anabel"
              className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border-2)] rounded-[var(--radius-md)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-acc)] transition-colors" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--color-text-2)] font-medium">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com"
              className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border-2)] rounded-[var(--radius-md)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-acc)] transition-colors" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--color-text-2)] font-medium">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(e as unknown as React.FormEvent)}
              placeholder="Mínimo 8 caracteres"
              className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border-2)] rounded-[var(--radius-md)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-acc)] transition-colors" />
          </div>
        </div>

        {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-[var(--radius-sm)] px-3 py-2">{error}</p>}

        <Button onClick={handleSubmit} disabled={loading} className="w-full" size="lg">
          {loading ? "Creando cuenta..." : "Crear cuenta con email"}
        </Button>

        <p className="text-xs text-center text-[var(--color-text-3)]">Al registrarte aceptas nuestros términos de uso.</p>
      </div>

      <p className="text-center text-sm text-[var(--color-text-2)]">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-[var(--color-acc)] hover:underline font-medium">Iniciar sesión</Link>
      </p>
    </div>
  );
}
