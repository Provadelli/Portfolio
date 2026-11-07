/* /llms.txt e /llms-full.txt (https://llmstxt.org): o site em Markdown, para assistentes de IA
   (ChatGPT, Gemini, Claude, Perplexity...) lerem sem JavaScript, animações ou WebGL.
   Tudo vem dos dicionários e da lista de projetos: muda o site, muda o arquivo. */
import { getProjects } from "@/content/projects";
import { getDictionary, href, type Lang } from "./i18n";
import { CV_URL, EMAIL, GITHUB, LINKEDIN, SITE_URL } from "./site";
import { plain } from "./structured-data";

const abs = (lang: Lang, path = "/") => SITE_URL + href(lang, path);

function profile(lang: Lang){
  const t = getDictionary(lang);
  const en = lang === "en";
  const services = ([1, 2, 3, 4] as const).map(i => {
    const k = `s${i}` as const;
    return `- **${plain(t[`${k}_t`])}**: ${plain(t[`${k}_d`])} (${plain(t[`${k}_x`]).split(" · ").join(", ")})`;
  });
  const journey = ([1, 2, 3, 4] as const).map(i => `- ${plain(t[`t${i}`])}`);
  const projects = getProjects(t).map(p => `- [${p.title}](${p.url}): ${p.desc}`);
  const faq = ([1, 2, 3, 4, 5, 6] as const).map(i => `### ${plain(t[`q${i}`])}\n\n${plain(t[`a${i}`])}`);

  return [
    `## ${en ? "About" : "Sobre"}`, "", plain(t.about_p1), "", plain(t.about_p2), "",
    `## ${en ? "Education" : "Formação"}`, "", `- ${t.edu1_title} (${t.edu1_label})`, `- ${t.edu2_title} (${t.edu2_label})`, "",
    `## ${en ? "Services" : "Serviços"}`, "", ...services, "",
    `## ${en ? "Projects" : "Projetos"}`, "", ...projects, "",
    `## ${en ? "Journey" : "Trajetória"}`, "", ...journey, "",
    `## ${en ? "Frequently asked questions" : "Perguntas frequentes"}`, "", ...faq.flatMap(f => [f, ""]),
    `## ${en ? "Contact" : "Contato"}`, "",
    `- E-mail: ${EMAIL}`, `- LinkedIn: ${LINKEDIN}`, `- GitHub: ${GITHUB}`,
    `- ${en ? "Contact form" : "Formulário de contato"}: ${abs(lang, "/#contato")}`,
    `- ${en ? "Résumé (PDF, Portuguese)" : "Currículo (PDF)"}: ${SITE_URL}${CV_URL}`
  ].join("\n");
}

const header = () => {
  const pt = getDictionary("pt"), en = getDictionary("en");
  return [
    "# Pedro Provadelli",
    "",
    `> ${plain(en.meta_desc)}`,
    "",
    `${plain(en.a1)} ${plain(en.hero_status)}.`,
    "",
    `(Português) ${plain(pt.meta_desc)}`
  ].join("\n");
};

/* versão curta: quem é + mapa de links */
export function llmsTxt(){
  const t = getDictionary("en");
  const projects = getProjects(t).map(p => `- [${p.title}](${p.url}): ${p.desc}`);
  return [
    header(), "",
    "## Site", "",
    `- [Portfolio (Português)](${abs("pt")}): ${plain(getDictionary("pt").hero_lede)}`,
    `- [Portfolio (English)](${abs("en")}): ${plain(t.hero_lede)}`,
    `- [Full content in Markdown](${SITE_URL}/llms-full.txt): about, services, projects, journey, FAQ and contact (PT + EN)`,
    `- [Résumé (PDF)](${SITE_URL}${CV_URL})`, "",
    "## Projects", "", ...projects, "",
    "## Contact", "", `- E-mail: ${EMAIL}`, `- [LinkedIn](${LINKEDIN})`, `- [GitHub](${GITHUB})`, "",
    "## Optional", "",
    `- [Privacy Policy](${abs("en", "/privacidade")})`,
    `- [Terms of Use](${abs("en", "/termos")})`,
    `- [Accessibility Statement](${abs("en", "/acessibilidade")})`,
    ""
  ].join("\n");
}

/* versão completa: o conteúdo inteiro do site nos dois idiomas */
export function llmsFullTxt(){
  return [
    header(), "",
    `# English — ${abs("en")}`, "", profile("en"), "",
    `# Português — ${abs("pt")}`, "", profile("pt"), ""
  ].join("\n");
}

export const textResponse = (body: string) =>
  new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8", "X-Robots-Tag": "noindex" } });
