import type { Metadata } from "next";
import LandingPage from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "SpeakFlow — Aprende inglés con IA | Gratis desde A1 hasta C2",
  description:
    "La app para aprender inglés hablando con inteligencia artificial. Chat con IA, pronunciación, vocabulario A1-C2, verbos irregulares y juegos. Ideal para trabajo remoto y viajes. Gratis.",
  alternates: { canonical: "https://speakflow.app" },
  openGraph: {
    title: "SpeakFlow — Aprende inglés con IA | Gratis desde A1 hasta C2",
    description:
      "La app para aprender inglés hablando con inteligencia artificial.",
    url: "https://speakflow.app",
  },
};

export default function RootPage() {
  return <LandingPage />;
}
