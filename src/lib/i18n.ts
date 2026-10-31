/* Idiomas: português na raiz (/), inglês em /en */
import pt, { type Dictionary } from "@/content/dictionaries/pt";
import en from "@/content/dictionaries/en";

export const LANGS = ["pt", "en"] as const;
export type Lang = (typeof LANGS)[number];
export type { Dictionary };

export const isLang = (v: string): v is Lang => (LANGS as readonly string[]).includes(v);
export const getDictionary = (lang: Lang): Dictionary => (lang === "en" ? en : pt);

/* atributos e formatos por idioma */
export const htmlLang = (lang: Lang) => (lang === "en" ? "en" : "pt-BR");
export const ogLocale = (lang: Lang) => (lang === "en" ? "en_US" : "pt_BR");

/* caminho interno no idioma certo: href("en", "/termos") -> "/en/termos" */
export function href(lang: Lang, path = "/"){
  if (lang === "pt") return path;
  if (path === "/" ) return "/en";
  return path.startsWith("/#") ? "/en" + path.slice(1) : "/en" + path;
}

/* mesmo endereço no outro idioma (seletor de idioma) */
export function switchPath(pathname: string, to: Lang){
  const bare = pathname.replace(/^\/(en|pt)(?=\/|$)/, "") || "/";
  return href(to, bare);
}
