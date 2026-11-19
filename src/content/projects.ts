/* Projetos do portfólio: fonte única para o carrossel, os dados estruturados (JSON-LD) e o /llms.txt */
import type { StaticImageData } from "next/image";
import type { Dictionary } from "@/lib/i18n";
import pele from "@/assets/img/pelenextgen.webp";
import pele2 from "@/assets/img/pelenextgen-2.webp";
import atelier from "@/assets/img/atelier.webp";
import atelier2 from "@/assets/img/atelier-2.webp";
import shin from "@/assets/img/shinatal.webp";
import shin2 from "@/assets/img/shinatal-2.webp";
import viela from "@/assets/img/vielatech.webp";
import viela2 from "@/assets/img/vielatech-2.webp";
import orto from "@/assets/img/ortofortino.webp";

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
    { id: "proj-4", title: "Viela Tech", host: "viela-tech-three.vercel.app", url: "https://viela-tech-three.vercel.app/", desc: t.viela_desc, cta: t.access_system, live: true, imgs: [{ src: viela, alt: t.viela_alt1 }, { src: viela2, alt: t.viela_alt2 }] },
    { id: "proj-5", title: "Orto Fortino", host: "ortofortino.vercel.app", url: "https://ortofortino.vercel.app/", desc: t.orto_desc, cta: t.access_system, live: true, imgs: [{ src: orto, alt: t.orto_alt }] }
  ];
}
