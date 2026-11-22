/* Dados estruturados (schema.org, JSON-LD) da página inicial.
   Um único @graph ligado por @id: o Google, o Bing e os buscadores de IA (ChatGPT, Gemini,
   Perplexity, Claude) entendem quem é a pessoa, o que faz, onde estudou, os projetos e o FAQ. */
import { getProjects } from "@/content/projects";
import { getDictionary, href, htmlLang, type Lang } from "./i18n";
import { EMAIL, GITHUB, LINKEDIN, SITE_URL } from "./site";

export const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/* texto puro a partir das frases do dicionário (que têm <em>, <br>, <a>...) */
export const plain = (html: string) => html.replace(/<br\s*\/?>/g, " ").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

export function homeGraph(lang: Lang){
  const t = getDictionary(lang);
  const url = SITE_URL + href(lang);
  const inLanguage = htmlLang(lang);
  const projects = getProjects(t);
  const services = ([1, 2, 3, 4] as const).map(i => ({ name: plain(t[`s${i}_t`]), description: plain(t[`s${i}_d`]) }));
  const faq = [[t.q1, t.a1], [t.q2, t.a2], [t.q3, t.a3], [t.q4, t.a4], [t.q5, t.a5], [t.q6, t.a6]];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: "Pedro Provadelli",
        description: t.meta_desc,
        inLanguage: ["pt-BR", "en"],
        publisher: { "@id": PERSON_ID }
      },
      {
        "@type": "ProfilePage",
        "@id": `${url}#profile`,
        url,
        name: t.meta_title,
        description: t.meta_desc,
        inLanguage,
        isPartOf: { "@id": WEBSITE_ID },
        mainEntity: { "@id": PERSON_ID },
        about: { "@id": PERSON_ID },
        primaryImageOfPage: `${SITE_URL}/og-pedro.jpg`
      },
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: "Pedro Lucas Souza Provadelli",
        alternateName: ["Pedro Provadelli", "Pedro Lucas Provadelli"],
        givenName: "Pedro Lucas",
        familyName: "Souza Provadelli",
        url: SITE_URL,
        image: { "@type": "ImageObject", url: `${SITE_URL}/og-pedro.jpg`, width: 1200, height: 630, caption: t.photo_alt },
        jobTitle: lang === "en" ? "Website Creator and Web Developer" : "Criador de Sites e Desenvolvedor Web",
        description: plain(t.a1),
        email: `mailto:${EMAIL}`,
        knowsLanguage: ["pt-BR", "en"],
        knowsAbout: ["Website Creation", "Criação de sites", "Landing Pages", "SEO", "Software Engineering", "Web Development", "HTML", "CSS", "JavaScript", "TypeScript", "Python", "C++", "Arduino", "Embedded Systems", "Automation", "Artificial Intelligence", "Electronics"],
        alumniOf: [
          { "@type": "CollegeOrUniversity", name: "FIAP", alternateName: "Faculdade de Informática e Administração Paulista", url: "https://www.fiap.com.br" },
          { "@type": "EducationalOrganization", name: "FAETEC", alternateName: "Fundação de Apoio à Escola Técnica" }
        ],
        sameAs: [GITHUB, LINKEDIN],
        /* os quatro serviços da seção Serviços, como ofertas da pessoa (autônomo, sem empresa) */
        makesOffer: services.map(s => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: s.name, description: s.description, provider: { "@id": PERSON_ID } }
        }))
      },
      {
        "@type": "ItemList",
        "@id": `${url}#projects`,
        name: plain(t.proj_title),
        numberOfItems: projects.length,
        itemListElement: projects.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": p.live ? "WebSite" : "SoftwareSourceCode",
            name: p.title,
            url: p.url,
            description: p.desc,
            image: SITE_URL + p.imgs[0].src.src,
            creator: { "@id": PERSON_ID }
          }
        }))
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        inLanguage,
        isPartOf: { "@id": `${url}#profile` },
        mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: plain(a) } }))
      }
    ]
  };
}
