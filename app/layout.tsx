import type { Metadata } from "next";
import "@/styles/globals.css";
import { ToastProvider } from "@/components/ui/Toast";

const BASE_URL = "https://speakflow.app"; // cambiar al dominio real

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "SpeakFlow — Aprende inglés con IA | A1 hasta C2",
    template: "%s | SpeakFlow",
  },
  description:
    "Aprende inglés hablando con inteligencia artificial. Practica conversaciones reales, entrena tu pronunciación y sube de nivel A1 a C2. Gratis, sin vergüenza, desde República Dominicana.",
  keywords: [
    "aprender inglés con IA",
    "aprender inglés online gratis",
    "practicar inglés conversación",
    "app inglés hispanohablantes",
    "inglés para trabajo remoto",
    "pronunciación inglés",
    "verbos irregulares inglés",
    "nivel CEFR inglés",
    "speakflow",
    "inglés República Dominicana",
    "curso inglés inteligencia artificial",
  ],
  authors: [{ name: "SpeakFlow", url: BASE_URL }],
  creator: "SpeakFlow",
  publisher: "SpeakFlow",
  category: "education",
  applicationName: "SpeakFlow",
  alternates: {
    canonical: BASE_URL,
    languages: { "es": BASE_URL },
  },
  openGraph: {
    type: "website",
    locale: "es_DO",
    url: BASE_URL,
    siteName: "SpeakFlow",
    title: "SpeakFlow — Aprende inglés con IA | A1 hasta C2",
    description:
      "Conversaciones reales con IA, corrección instantánea, pronunciación y juegos. El camino más rápido de A1 a C2 para hispanohablantes.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "SpeakFlow — Aprende inglés con IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SpeakFlow — Aprende inglés con IA",
    description:
      "Practica inglés real con IA. Conversaciones, pronunciación y juegos. Gratis.",
    images: [`${BASE_URL}/og-image.png`],
    creator: "@speakflow_app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.json",
  verification: {
    google: "REEMPLAZAR_CON_GOOGLE_SEARCH_CONSOLE_CODE",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
