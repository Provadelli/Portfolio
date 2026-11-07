import type { MetadataRoute } from "next";
import { getProjects } from "@/content/projects";
import { getDictionary, href } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

const PAGES = [
  { path: "/", priority: 1, changeFrequency: "monthly" },
  { path: "/privacidade", priority: 0.3, changeFrequency: "yearly" },
  { path: "/termos", priority: 0.3, changeFrequency: "yearly" },
  { path: "/acessibilidade", priority: 0.3, changeFrequency: "yearly" }
] as const;

/* cada página em português e inglês, com os pares hreflang */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-11-07");
  return PAGES.flatMap(({ path, priority, changeFrequency }) => {
    const languages = { "pt-BR": SITE_URL + href("pt", path), en: SITE_URL + href("en", path) };
    // imagens da página inicial (Google Imagens): foto e capturas dos projetos
    const images = path === "/" ? [`${SITE_URL}/og-pedro.jpg`, ...getProjects(getDictionary("pt")).map(p => SITE_URL + p.imgs[0].src.src)] : undefined;
    return [
      { url: languages["pt-BR"], lastModified, priority, changeFrequency, alternates: { languages }, images },
      { url: languages.en, lastModified, priority: priority * 0.9, changeFrequency, alternates: { languages }, images }
    ];
  });
}
