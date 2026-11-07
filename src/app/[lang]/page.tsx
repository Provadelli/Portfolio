import { Suspense } from "react";
import { Loader, LOADER_SCRIPT } from "@/components/Loader";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { Projects } from "@/components/home/Projects";
import { Services } from "@/components/home/Services";
import { Journey } from "@/components/home/Journey";
import { Faq } from "@/components/home/Faq";
import { Contact } from "@/components/home/Contact";
import { TravelingPhoto } from "@/components/home/TravelingPhoto";
import { getDictionary, type Lang } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { homeGraph } from "@/lib/structured-data";

export async function generateMetadata({ params }: PageProps<"/[lang]">){
  const lang = (await params).lang as Lang;
  const t = getDictionary(lang);
  return {
    ...pageMetadata({ lang, path: "/", title: "Pedro Provadelli | Software Engineer", description: t.meta_desc, ogAlt: t.photo_alt }),
    title: { absolute: "Pedro Provadelli | Software Engineer" }
  };
}

export default async function Home({ params }: PageProps<"/[lang]">){
  const lang = (await params).lang as Lang;
  const t = getDictionary(lang);

  // JSON-LD: < escapado para o conteúdo nunca fechar a tag <script>
  const jsonLd = JSON.stringify(homeGraph(lang)).replace(/</g, "\\u003c");

  return (
    <>
      {/* tela de carregamento só na primeira visita da sessão (roda antes da primeira pintura) */}
      <script dangerouslySetInnerHTML={{ __html: LOADER_SCRIPT }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <Loader />
      <Header />
      {/* overflow-x: clip (e não hidden): corta o brilho da foto que viaja sem quebrar o sticky da Trajetória */}
      <main id="main" className="relative overflow-x-clip">
        <Hero t={t} />
        {/* abaixo da dobra: cada <Suspense> vira um passo de hidratação separado. O HTML vem
            completo do mesmo jeito, mas o navegador pinta o hero antes de hidratar o resto */}
        <Suspense><TravelingPhoto /></Suspense>
        <Suspense><About t={t} /></Suspense>
        <Suspense><Projects t={t} /></Suspense>
        <Suspense><Services t={t} /></Suspense>
        <Suspense><Journey /></Suspense>
        <Suspense><Faq t={t} /></Suspense>
        <Suspense><Contact t={t} /></Suspense>
      </main>
    </>
  );
}
