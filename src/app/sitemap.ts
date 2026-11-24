import type { MetadataRoute } from "next";
import { getProjects } from "@/content/projects";
import { getDictionary, href } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

/* `updated`: data real da última mudança de conteúdo de cada página.
   Atualize ao mudar o texto: o Google usa o lastmod para decidir quando voltar a rastrear. */
const PAGES = [
  { path: "/", priority: 1, changeFrequency: "monthly", updated: "2026-11-21" },
  { path: "/privacidade", priority: 0.3, changeFrequency: "yearly", updated: "2026-11-07" },
  { path: "/termos", priority: 0.3, changeFrequency: "yearly", updated: "2026-11-07" },
  { path: "/acessibilidade", priority: 0.3, changeFrequency: "yearly", updated: "2026-11-07" }
] as const;

/* cada página em português e inglês, com os pares hreflang */
export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap(({ path, priority, changeFrequency, updated }) => {
    const lastModified = new Date(updated);
    const languages = { "pt-BR": SITE_URL + href("pt", path), en: SITE_URL + href("en", path) };
    // imagens da página inicial (Google Imagens): foto e capturas dos projetos
    const images = path === "/" ? [`${SITE_URL}/og-pedro.jpg`, ...getProjects(getDictionary("pt")).map(p => SITE_URL + p.imgs[0].src.src)] : undefined;
    return [
      { url: languages["pt-BR"], lastModified, priority, changeFrequency, alternates: { languages }, images },
      { url: languages.en, lastModified, priority: priority * 0.9, changeFrequency, alternates: { languages }, images }
    ];
  });
}
