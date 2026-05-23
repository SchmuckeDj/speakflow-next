import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/chat", "/vocabulary", "/verbs", "/challenge", "/game", "/pronunciation", "/profile", "/onboarding"],
      },
    ],
    sitemap: "https://speakflow.app/sitemap.xml",
  };
}
