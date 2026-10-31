/* Páginas de texto (Termos, Privacidade, Acessibilidade): cabeçalho simples + documento */
import { HeaderSimple } from "@/components/layout/HeaderSimple";
import type { Dictionary, Lang } from "@/lib/i18n";

export function LegalPage({ lang, t, html }: { lang: Lang; t: Dictionary; html: string }){
  return (
    <>
      <HeaderSimple lang={lang} t={t} />
      {/* conteúdo estático do próprio projeto (src/content/legal) */}
      <main id="main" className="doc prose-links mx-auto max-w-190 px-5.5 pt-30 pb-20 sm:px-8 sm:pt-35 sm:pb-25" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
