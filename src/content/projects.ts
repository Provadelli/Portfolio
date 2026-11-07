/* Projetos do portfólio: fonte única para o carrossel, os dados estruturados (JSON-LD) e o /llms.txt */
import type { StaticImageData } from "next/image";
import type { Dictionary } from "@/lib/i18n";
import pele from "@/assets/img/pelenextgen.webp";
import pele2 from "@/assets/img/pelenextgen-2.webp";
import atelier from "@/assets/img/atelier.webp";
import atelier2 from "@/assets/img/atelier-2.webp";
import shin from "@/assets/img/shinatal.webp";
import shin2 from "@/assets/img/shinatal-2.webp";
import np from "@/assets/img/npcode.webp";
import np2 from "@/assets/img/npcode-2.webp";
import circuito from "@/assets/img/circuito.webp";

export type Project = {
  id: string;
  title: string;
  host: string;
  url: string;
  desc: string;
  cta: string;
  /** site publicado (true) ou repositório de código (false) */
  live: boolean;
  imgs: { src: StaticImageData; alt: string }[];
};

export function getProjects(t: Dictionary): Project[] {
  return [
    { id: "proj-1", title: "Pelé Next Gen", host: "pelenextgen.vercel.app", url: "https://pelenextgen.vercel.app/", desc: t.pele_desc, cta: t.access_system, live: true, imgs: [{ src: pele, alt: t.pele_alt1 }, { src: pele2, alt: t.pele_alt2 }] },
    { id: "proj-2", title: "Atelier Residences", host: "imobiliaria-atelier.vercel.app", url: "https://imobiliaria-atelier.vercel.app/", desc: t.atelier_desc, cta: t.access_system, live: true, imgs: [{ src: atelier, alt: t.atelier_alt1 }, { src: atelier2, alt: t.atelier_alt2 }] },
    { id: "proj-3", title: "Shinatal", host: "shinatal.shinerio.com", url: "https://shinatal.shinerio.com", desc: t.shin_desc, cta: t.access_system, live: true, imgs: [{ src: shin, alt: t.shin_alt1 }, { src: shin2, alt: t.shin_alt2 }] },
    { id: "proj-4", title: "NP Code Solutions", host: "npcodesolutions.com.br", url: "https://www.npcodesolutions.com.br/", desc: t.np_desc, cta: t.access_system, live: true, imgs: [{ src: np, alt: t.np_alt1 }, { src: np2, alt: t.np_alt2 }] },
    { id: "proj-5", title: "Space Guardian", host: "github.com/Provadelli", url: "https://github.com/Provadelli/GS--Sistema-de-Autonomia-de-Bordo", desc: t.space_desc, cta: t.see_repo, live: false, imgs: [{ src: circuito, alt: t.space_alt }] }
  ];
}
