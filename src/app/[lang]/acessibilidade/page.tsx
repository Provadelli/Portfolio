import { LegalPage } from "@/components/LegalPage";
import content from "@/content/legal/acessibilidade";
import { LEGAL_META } from "@/content/legal/meta";
import { getDictionary, type Lang } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/acessibilidade">){
  const lang = (await params).lang as Lang;
  return pageMetadata({ lang, path: "/acessibilidade", ...LEGAL_META.acessibilidade[lang] });
}

export default async function Page({ params }: PageProps<"/[lang]/acessibilidade">){
  const lang = (await params).lang as Lang;
  return <LegalPage lang={lang} t={getDictionary(lang)} html={content[lang]} />;
}
