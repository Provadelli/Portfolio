/* Header das páginas internas (documentos legais, 404): a mesma pílula, com "voltar" */
import Link from "next/link";
import { LogoP } from "@/components/svg/LogoP";
import { href, type Dictionary, type Lang } from "@/lib/i18n";
import { LangSwitch } from "./LangSwitch";

export function HeaderSimple({ lang, t }: { lang: Lang; t: Dictionary }){
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-500 flex justify-center px-4">
      <header className="pill pointer-events-auto">
        <Link href={href(lang)} className="pill-logo" aria-label={t.home_label}>
          <svg viewBox="360 270 560 700" aria-hidden="true" focusable="false"><LogoP /></svg>
        </Link>
        <Link href={href(lang)} className="pill-link">{t.back}</Link>
        <LangSwitch />
      </header>
    </div>
  );
}
