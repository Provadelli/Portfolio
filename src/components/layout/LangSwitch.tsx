"use client";
/* PT | EN: leva ao mesmo endereço no outro idioma, sem voltar ao topo, e guarda a escolha
   num cookie (lido pelo proxy.ts na próxima visita à página inicial) */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/components/I18nProvider";
import { LANGS, switchPath, htmlLang } from "@/lib/i18n";

export function LangSwitch(){
  const { lang, t } = useI18n();
  const pathname = usePathname();

  return (
    <div className="lang" role="group" aria-label={t.lang_group}>
      {LANGS.map(l => (
        <Link
          key={l}
          href={switchPath(pathname, l)}
          onClick={() => { document.cookie = `lang=${l}; path=/; max-age=31536000; samesite=lax`; }}
          className="lang__btn inline-flex items-center justify-center"
          aria-current={l === lang ? "true" : undefined}
          hrefLang={htmlLang(l)}
          lang={htmlLang(l)}
          scroll={false}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
