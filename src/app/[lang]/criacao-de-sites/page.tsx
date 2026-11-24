import { ServicePage } from "@/components/ServicePage";
import { criacaoDeSites } from "@/content/servicos/criacao-de-sites";
import { getDictionary, type Lang } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { serviceGraph } from "@/lib/structured-data";

const PATH = "/criacao-de-sites";

export async function generateMetadata({ params }: PageProps<"/[lang]/criacao-de-sites">){
  const lang = (await params).lang as Lang;
  const c = criacaoDeSites[lang];
  return {
    ...pageMetadata({ lang, path: PATH, title: c.metaTitle, description: c.metaDesc }),
    title: { absolute: c.metaTitle }
  };
}

export default async function Page({ params }: PageProps<"/[lang]/criacao-de-sites">){
  const lang = (await params).lang as Lang;
  const c = criacaoDeSites[lang];
  // JSON-LD: < escapado para o conteúdo nunca fechar a tag <script>
  const jsonLd = JSON.stringify(serviceGraph(lang, PATH, c)).replace(/</g, "\u003c");
  return <ServicePage lang={lang} t={getDictionary(lang)} c={c} jsonLd={jsonLd} />;
}
