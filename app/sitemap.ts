import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://speakflow.app";
  const now  = new Date();

  return [
    { url: base,                  lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/register`,    lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/login`,       lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/dashboard`,   lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/chat`,        lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/vocabulary`,  lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/verbs`,       lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/challenge`,   lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${base}/game`,        lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/pronunciation`,lastModified: now, changeFrequency: "monthly",priority: 0.7 },
  ];
}
