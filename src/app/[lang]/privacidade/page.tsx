import { LegalPage } from "@/components/LegalPage";
import content from "@/content/legal/privacidade";
import { LEGAL_META } from "@/content/legal/meta";
import { getDictionary, type Lang } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacidade">){
  const lang = (await params).lang as Lang;
  return pageMetadata({ lang, path: "/privacidade", ...LEGAL_META.privacidade[lang] });
}

export default async function Page({ params }: PageProps<"/[lang]/privacidade">){
  const lang = (await params).lang as Lang;
  return <LegalPage lang={lang} t={getDictionary(lang)} html={content[lang]} />;
}
