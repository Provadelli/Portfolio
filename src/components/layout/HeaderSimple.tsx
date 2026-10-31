/* Cabeçalho das páginas internas (documentos legais, 404) */
import Link from "next/link";
import { href, type Dictionary, type Lang } from "@/lib/i18n";
import { BrandMark } from "./BrandMark";
import { LangSwitch } from "./LangSwitch";

export function HeaderSimple({ lang, t }: { lang: Lang; t: Dictionary }){
  return (
    <header className="header is-scrolled">
      <div className="wrap flex items-center justify-between gap-4">
        <BrandMark lang={lang} t={t} />
        <Link href={href(lang)} className="nav-link">{t.back}</Link>
        <LangSwitch />
      </div>
    </header>
  );
}
