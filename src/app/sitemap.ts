import type { MetadataRoute } from "next";
import { href } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

const PAGES = [
  { path: "/", priority: 1, changeFrequency: "monthly" },
  { path: "/privacidade", priority: 0.3, changeFrequency: "yearly" },
  { path: "/termos", priority: 0.3, changeFrequency: "yearly" },
  { path: "/acessibilidade", priority: 0.3, changeFrequency: "yearly" }
] as const;

/* cada página em português e inglês, com os pares hreflang */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-10-30");
  return PAGES.flatMap(({ path, priority, changeFrequency }) => {
    const languages = { "pt-BR": SITE_URL + href("pt", path), en: SITE_URL + href("en", path) };
    return [
      { url: languages["pt-BR"], lastModified, priority, changeFrequency, alternates: { languages } },
      { url: languages.en, lastModified, priority: priority * 0.9, changeFrequency, alternates: { languages } }
    ];
  });
}
