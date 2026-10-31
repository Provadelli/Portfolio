import { Loader, LOADER_SCRIPT } from "@/components/Loader";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { Projects } from "@/components/home/Projects";
import { Services } from "@/components/home/Services";
import { Tech } from "@/components/home/Tech";
import { Journey } from "@/components/home/Journey";
import { Faq } from "@/components/home/Faq";
import { Contact } from "@/components/home/Contact";
import { getDictionary, href, type Lang } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { EMAIL, GITHUB, LINKEDIN, SITE_URL } from "@/lib/site";

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

  const person = {
    "@context": "https://schema.org", "@type": "Person",
    name: "Pedro Lucas Provadelli",
    url: SITE_URL + href(lang),
    image: `${SITE_URL}/og-pedro.jpg`,
    jobTitle: lang === "en" ? "Software developer" : "Desenvolvedor de software",
    email: `mailto:${EMAIL}`,
    alumniOf: [{ "@type": "CollegeOrUniversity", name: "FIAP" }, { "@type": "EducationalOrganization", name: "FAETEC" }],
    sameAs: [GITHUB, LINKEDIN]
  };

  return (
    <>
      {/* tela de carregamento só na primeira visita da sessão (roda antes da primeira pintura) */}
      <script dangerouslySetInnerHTML={{ __html: LOADER_SCRIPT }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      <Loader />
      <Header />
      <main id="main">
        <Hero t={t} />
        <About t={t} />
        <Projects t={t} />
        <Services t={t} />
        <Tech t={t} />
        <Journey />
        <Faq t={t} />
        <Contact t={t} />
      </main>
    </>
  );
}
