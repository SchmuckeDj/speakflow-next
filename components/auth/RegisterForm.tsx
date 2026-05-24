"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { apiFetch, saveTokens } from "@/lib/api";

export default function RegisterForm() {
  const router = useRouter();
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) { setError("Completa todos los campos."); return; }
    if (password.length < 6) { setError("Contraseña mínimo 6 caracteres."); return; }
    setError("");
    setLoading(true);

    try {
      const res = await apiFetch("/api/auth/register/", {
        method: "POST",
        body:   JSON.stringify({ username: name, email, password }),
        auth:   false,
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data.email?.[0] ?? data.password?.[0] ?? data.error ?? "Error al registrarse.";
        setError(msg);
        setLoading(false);
        return;
      }

      saveTokens(data.tokens.access, data.tokens.refresh);
      localStorage.setItem("sf_user", JSON.stringify({
        name:  data.user.username,
        email: data.user.email,
        level: null,
        isNew: true,
      }));
      document.cookie = "sf_session=1; path=/; max-age=604800; SameSite=Lax";
      router.push("/onboarding");

    } catch {
      setError("No se pudo conectar al servidor.");
      setLoading(false);
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
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--color-text-2)] font-medium">Nombre</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Anabel"
              className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border-2)] rounded-[var(--radius-md)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-acc)] transition-colors" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--color-text-2)] font-medium">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border-2)] rounded-[var(--radius-md)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-acc)] transition-colors" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--color-text-2)] font-medium">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(e as unknown as React.FormEvent)}
              placeholder="Mínimo 6 caracteres"
              className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border-2)] rounded-[var(--radius-md)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-acc)] transition-colors" />
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-[var(--radius-sm)] px-3 py-2">{error}</p>
        )}

        <Button onClick={handleSubmit} disabled={loading} className="w-full" size="lg">
          {loading ? "Creando cuenta..." : "Crear cuenta gratis"}
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
