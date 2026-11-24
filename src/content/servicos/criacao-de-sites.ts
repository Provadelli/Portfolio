/* Página de serviço /criacao-de-sites (Fase 3 do plano de SEO).
   Só fatos já presentes no site: sem preço, prazo ou promessa de posição no Google.
   Região: Rio de Janeiro (decidido em 24/11/2026), com atendimento online em todo o Brasil. */
import type { Lang } from "@/lib/i18n";

export type ServiceContent = {
  metaTitle: string;
  metaDesc: string;
  eyebrow: string;
  title: string; // pode ter <em>
  lede: string;
  cta: string;
  breadcrumb: string;
  includedTitle: string;
  included: { t: string; d: string }[];
  forWhoTitle: string;
  forWho: string[];
  whereTitle: string;
  where: string;
  stepsTitle: string;
  steps: { t: string; d: string }[];
  proofTitle: string;
  proofLede: string;
  faqTitle: string;
  faq: [string, string][];
  endTitle: string;
  endLede: string;
};

const pt: ServiceContent = {
  metaTitle: "Criação de Sites no Rio de Janeiro | Pedro Provadelli",
  metaDesc: "Criação de sites profissionais e landing pages no Rio de Janeiro e em todo o Brasil, online. Rápidos no celular, com SEO e feitos para trazer clientes.",
  eyebrow: "Serviço · Criação de sites",
  title: "Criação de sites que <em>trazem clientes.</em>",
  lede: "Sou Pedro Lucas Souza Provadelli, criador de sites freelancer e desenvolvedor web. Crio sites profissionais e landing pages para pequenos negócios e profissionais do Rio de Janeiro e de todo o Brasil, com atendimento online, do briefing ao site no ar.",
  cta: "Pedir orçamento",
  breadcrumb: "Criação de sites",
  includedTitle: "O que está incluído",
  included: [
    { t: "Design sob medida", d: "Layout pensado para a sua marca e para o seu cliente, sem modelo pronto." },
    { t: "Rápido no celular", d: "Páginas leves e responsivas, que abrem bem em qualquer tela." },
    { t: "Pronto para o Google", d: "SEO técnico: título, descrição, dados estruturados, sitemap e robots.txt." },
    { t: "Acessibilidade", d: "Boas práticas da WCAG: contraste, navegação por teclado e textos alternativos." },
    { t: "Formulário de contato", d: "Mensagens chegando no seu e-mail, com consentimento conforme a LGPD." },
    { t: "Publicação", d: "Site no ar com HTTPS, e evolução depois da entrega." }
  ],
  forWhoTitle: "Para quem é",
  forWho: [
    "Pequenos negócios que ainda não têm site, ou têm um site lento e desatualizado",
    "Profissionais autônomos e liberais que querem ser encontrados no Google",
    "Empresas que precisam de uma landing page para uma campanha ou lançamento",
    "Projetos que precisam de mais que um site: área restrita, cadastro e sistema web"
  ],
  whereTitle: "Onde eu atendo",
  where: "Atendo o Rio de Janeiro e todo o Brasil, online: conversa, aprovação e entrega são feitas pela internet, sem você precisar sair do seu negócio.",
  stepsTitle: "Como funciona",
  steps: [
    { t: "Conversa", d: "Você conta o que precisa pelo formulário ou por e-mail." },
    { t: "Orçamento", d: "Respondo com um orçamento e os próximos passos." },
    { t: "Design e desenvolvimento", d: "Desenho e programo o site, com você acompanhando." },
    { t: "Publicação", d: "Coloco o site no ar e deixo tudo pronto para o Google." },
    { t: "Evolução", d: "Depois da entrega, o site pode continuar crescendo com você." }
  ],
  proofTitle: "Sites e sistemas no ar",
  proofLede: "Projetos reais, de setores diferentes: imobiliária, saúde, esporte e empresas.",
  faqTitle: "Perguntas sobre <em>criação de sites</em>",
  faq: [
    ["Quanto custa para criar um site?", "Depende do tamanho do site e do que ele precisa ter. Conte o que você precisa pelo formulário e eu respondo com um orçamento e os próximos passos."],
    ["Você atende no Rio de Janeiro?", "Sim. Atendo o Rio de Janeiro e todo o Brasil, online."],
    ["O site vai aparecer no Google?", "O site sai pronto para o Google, com SEO técnico (título, descrição, dados estruturados e sitemap). A posição na busca depende da concorrência e do tempo, então não prometo primeiro lugar: prometo um site bem feito para ser encontrado."],
    ["Por que contratar um freelancer de sites em vez de uma agência?", "Com um freelancer você fala direto com quem desenvolve o site, do briefing à publicação, sem intermediários. Cada ajuste passa pela mesma pessoa que conhece o projeto inteiro."],
    ["Você faz landing page?", "Sim. Landing pages para campanhas, lançamentos e captação de clientes, com o mesmo cuidado de velocidade e SEO."],
    ["E se eu precisar de mais que um site?", "Também desenvolvo aplicações e sistemas web, como área restrita, cadastro e painel. Veja o Shinatal e o Orto Fortino nos projetos."]
  ],
  endTitle: "Seu negócio merece <em>ser encontrado.</em>",
  endLede: "Me conte sua ideia e eu respondo com um orçamento e os próximos passos."
};

const en: ServiceContent = {
  metaTitle: "Website Creation in Rio de Janeiro | Pedro Provadelli",
  metaDesc: "Professional websites and landing pages in Rio de Janeiro and across Brazil, online. Fast on mobile, search-ready and built to bring in clients.",
  eyebrow: "Service · Website creation",
  title: "Websites that <em>bring in clients.</em>",
  lede: "I'm Pedro Lucas Souza Provadelli, a freelance website creator and web developer. I build professional websites and landing pages for small businesses and professionals in Rio de Janeiro and across Brazil, online, from brief to launch.",
  cta: "Request a quote",
  breadcrumb: "Website creation",
  includedTitle: "What's included",
  included: [
    { t: "Custom design", d: "A layout made for your brand and your clients, not a template." },
    { t: "Fast on mobile", d: "Light, responsive pages that load well on any screen." },
    { t: "Search-ready", d: "Technical SEO: title, description, structured data, sitemap and robots.txt." },
    { t: "Accessibility", d: "WCAG best practices: contrast, keyboard navigation and alt text." },
    { t: "Contact form", d: "Messages delivered to your inbox, with LGPD-compliant consent." },
    { t: "Launch", d: "Your site live over HTTPS, and room to grow after delivery." }
  ],
  forWhoTitle: "Who it's for",
  forWho: [
    "Small businesses with no website, or a slow and outdated one",
    "Freelancers and professionals who want to be found on Google",
    "Companies that need a landing page for a campaign or launch",
    "Projects that need more than a website: members area, sign-up and web systems"
  ],
  whereTitle: "Where I work",
  where: "I serve Rio de Janeiro and all of Brazil, online: briefing, approvals and delivery all happen over the internet.",
  stepsTitle: "How it works",
  steps: [
    { t: "Conversation", d: "Tell me what you need through the form or by e-mail." },
    { t: "Quote", d: "I reply with a quote and the next steps." },
    { t: "Design and development", d: "I design and build the site while you follow along." },
    { t: "Launch", d: "I put the site live, ready for Google." },
    { t: "Growth", d: "After delivery, the site can keep growing with you." }
  ],
  proofTitle: "Websites and systems live",
  proofLede: "Real projects from different fields: real estate, health, sports and business.",
  faqTitle: "Questions about <em>website creation</em>",
  faq: [
    ["How much does a website cost?", "It depends on the size of the site and what it needs. Tell me what you need through the form and I'll reply with a quote and the next steps."],
    ["Do you work in Rio de Janeiro?", "Yes. I serve Rio de Janeiro and all of Brazil, online."],
    ["Will my website show up on Google?", "The site launches search-ready, with technical SEO (title, description, structured data and sitemap). Ranking depends on competition and time, so I don't promise first place: I promise a site built to be found."],
    ["Do you build landing pages?", "Yes. Landing pages for campaigns, launches and lead capture, with the same care for speed and SEO."],
    ["What if I need more than a website?", "I also build web applications and systems, such as members areas, sign-up and dashboards. See Shinatal and Orto Fortino in the projects."]
  ],
  endTitle: "Your business deserves <em>to be found.</em>",
  endLede: "Tell me your idea and I'll reply with a quote and the next steps."
};

export const criacaoDeSites: Record<Lang, ServiceContent> = { pt, en };
