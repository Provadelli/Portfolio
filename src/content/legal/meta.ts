/* Título e descrição de cada documento, por idioma */
import type { Lang } from "@/lib/i18n";

type Meta = Record<Lang, { title: string; description: string }>;

export const LEGAL_META: Record<"privacidade" | "termos" | "acessibilidade", Meta> = {
  privacidade: {
    pt: { title: "Política de Privacidade — Pedro Provadelli", description: "Quais dados pessoais este portfólio trata, por que, por quanto tempo e como exercer seus direitos, conforme a LGPD (Lei 13.709/2018)." },
    en: { title: "Privacy Policy — Pedro Provadelli", description: "Which personal data this portfolio processes, why, for how long and how to exercise your rights under the LGPD (Brazilian Law 13,709/2018)." }
  },
  termos: {
    pt: { title: "Termos de Uso — Pedro Provadelli", description: "Regras de uso do portfólio de Pedro Provadelli e do formulário de contato: finalidade, uso permitido, propriedade intelectual, responsabilidades e lei aplicável." },
    en: { title: "Terms of Use — Pedro Provadelli", description: "Rules for using Pedro Provadelli's portfolio and contact form: purpose, permitted use, intellectual property, responsibilities and governing law." }
  },
  acessibilidade: {
    pt: { title: "Acessibilidade — Pedro Provadelli", description: "Declaração de acessibilidade do portfólio de Pedro Provadelli (WCAG 2.2, nível AA)." },
    en: { title: "Accessibility — Pedro Provadelli", description: "Accessibility statement for Pedro Provadelli's portfolio (WCAG 2.2, level AA)." }
  }
};
