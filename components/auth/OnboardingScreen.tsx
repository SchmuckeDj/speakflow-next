"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import type { CEFRLevel } from "@/lib/types";

const LEVELS: { level: CEFRLevel; label: string; desc: string; examples: string[] }[] = [
  { level: "A1", label: "Principiante",    desc: "Conozco palabras básicas como hello, yes, no.",                      examples: ["Hello, my name is...", "I am from...", "I like food"] },
  { level: "A2", label: "Básico",          desc: "Puedo hablar de temas cotidianos simples.",                           examples: ["I go to school every day", "She works in an office", "Do you like coffee"] },
  { level: "B1", label: "Intermedio",      desc: "Me defiendo en conversaciones sobre temas familiares.",               examples: ["I have been working here for two years", "If I had more time", "She suggested trying a new approach"] },
  { level: "B2", label: "Intermedio alto", desc: "Puedo conversar con fluidez con hablantes nativos.",                  examples: ["The implications are significant", "She articulated her point clearly", "We need to leverage our strengths"] },
  { level: "C1", label: "Avanzado",        desc: "Me expreso con precisión en contextos profesionales.",                examples: ["A nuanced perspective on this matter", "The ambiguous requirements led to...", "Establishing coherent priorities"] },
  { level: "C2", label: "Maestro",         desc: "Domino el inglés casi como nativo.",                                  examples: ["An inextricable paradigm shift", "The ubiquitous nature of...", "Simultaneously compelling and ephemeral"] },
];

const GOALS = [
  { id: "work",     icon: "💼", label: "Trabajo remoto" },
  { id: "travel",   icon: "✈️", label: "Viajes" },
  { id: "academic", icon: "🎓", label: "Examen / Academia" },
  { id: "general",  icon: "💬", label: "Conversación general" },
  { id: "tech",     icon: "💻", label: "Inglés técnico" },
  { id: "gaming",   icon: "🎮", label: "Gaming" },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep]                   = useState<"level" | "goal">("level");
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | null>(null);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [saving, setSaving]               = useState(false);

  function toggleGoal(id: string) {
    setSelectedGoals((prev) => prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]);
  }

  async function finish() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    const existing = JSON.parse(localStorage.getItem("sf_user") || "{}");
    localStorage.setItem("sf_user", JSON.stringify({ ...existing, level: selectedLevel, goals: selectedGoals, isNew: false }));
    document.cookie = "sf_session=1; path=/; max-age=604800; SameSite=Lax";
    router.push("/dashboard");
  }

  return (
    <div className="w-full max-w-lg space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-acc)] shadow-[0_0_12px_var(--color-acc)]" />
          <span className="font-semibold text-lg tracking-tight">SpeakFlow</span>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {(["level", "goal"] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full text-xs font-medium flex items-center justify-center transition-colors ${
                step === s
                  ? "bg-[var(--color-acc)] text-white"
                  : step === "goal" && s === "level"
                    ? "bg-[var(--color-acc)]/30 text-[var(--color-acc)]"
                    : "bg-[var(--color-surface-2)] text-[var(--color-text-3)]"
              }`}>{i + 1}</div>
              {i < 1 && <div className="w-8 h-px bg-[var(--color-border)]" />}
            </div>
          ))}
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">
          {step === "level" ? "¿Cuál es tu nivel de inglés?" : "¿Para qué quieres aprender?"}
        </h1>
        <p className="text-sm text-[var(--color-text-2)]">
          {step === "level" ? "Selecciona el que mejor te describe" : "Puedes elegir más de uno"}
        </p>
      </div>

      {/* Step 1 — Nivel */}
      {step === "level" && (
        <div className="space-y-2">
          {LEVELS.map(({ level, label, desc, examples }) => (
            <button key={level} onClick={() => setSelectedLevel(level)}
              className={`w-full text-left rounded-[var(--radius-lg)] border p-4 transition-all duration-150 ${
                selectedLevel === level
                  ? "border-[var(--color-acc)] bg-[var(--color-acc)]/10"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-2)]"
              }`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    selectedLevel === level ? "bg-[var(--color-acc)] text-white" : "bg-[var(--color-surface-2)] text-[var(--color-text-2)]"
                  }`}>{level}</span>
                  <span className="font-medium text-sm">{label}</span>
                </div>
                {selectedLevel === level && <span className="text-[var(--color-acc)]">✓</span>}
              </div>
              <p className="text-xs text-[var(--color-text-2)] mb-2">{desc}</p>
              <div className="flex flex-wrap gap-1">
                {examples.map((ex) => (
                  <span key={ex} className="text-[10px] font-mono text-[var(--color-text-3)] bg-[var(--color-surface-2)] px-2 py-0.5 rounded-full border border-[var(--color-border)]">
                    "{ex}"
                  </span>
                ))}
              </div>
            </button>
          ))}
          <Button className="w-full mt-2" size="lg" disabled={!selectedLevel} onClick={() => setStep("goal")}>
            Continuar →
          </Button>
        </div>
      )}

      {/* Step 2 — Objetivo */}
      {step === "goal" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {GOALS.map(({ id, icon, label }) => (
              <button key={id} onClick={() => toggleGoal(id)}
                className={`flex items-center gap-3 p-4 rounded-[var(--radius-lg)] border text-left transition-all duration-150 ${
                  selectedGoals.includes(id)
                    ? "border-[var(--color-acc)] bg-[var(--color-acc)]/10"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-2)]"
                }`}>
                <span className="text-2xl">{icon}</span>
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  {selectedGoals.includes(id) && <p className="text-[10px] text-[var(--color-acc)]">Seleccionado ✓</p>}
                </div>
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setStep("level")} size="lg" className="flex-1">← Atrás</Button>
            <Button className="flex-1" size="lg" disabled={selectedGoals.length === 0 || saving} onClick={finish}>
              {saving ? "Guardando..." : "Empezar a aprender 🚀"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
