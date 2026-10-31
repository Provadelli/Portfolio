import type { Dictionary } from "@/lib/i18n";
import pele1 from "@/assets/img/pelenextgen.webp";
import pele2 from "@/assets/img/pelenextgen-2.webp";
import atelier1 from "@/assets/img/atelier.webp";
import atelier2 from "@/assets/img/atelier-2.webp";
import shin1 from "@/assets/img/shinatal.webp";
import shin2 from "@/assets/img/shinatal-2.webp";
import np1 from "@/assets/img/npcode.webp";
import np2 from "@/assets/img/npcode-2.webp";
import circuito from "@/assets/img/circuito.webp";
import { Carousel, type Project } from "./Carousel";
import { SectionHead } from "./SectionHead";

export function Projects({ t }: { t: Dictionary }){
  const projects: Project[] = [
    { id: "proj-1", title: "Pelé Next Gen", host: "pelenextgen.vercel.app", url: "https://pelenextgen.vercel.app/", desc: t.pele_desc, cta: t.access_system,
      imgs: [{ src: pele1, alt: t.pele_alt1 }, { src: pele2, alt: t.pele_alt2 }] },
    { id: "proj-2", title: "Atelier Residences", host: "imobiliaria-atelier.vercel.app", url: "https://imobiliaria-atelier.vercel.app/", desc: t.atelier_desc, cta: t.access_system,
      imgs: [{ src: atelier1, alt: t.atelier_alt1 }, { src: atelier2, alt: t.atelier_alt2 }] },
    { id: "proj-3", title: "Shinatal", host: "shinatal.shinerio.com", url: "https://shinatal.shinerio.com", desc: t.shin_desc, cta: t.access_system,
      imgs: [{ src: shin1, alt: t.shin_alt1 }, { src: shin2, alt: t.shin_alt2 }] },
    { id: "proj-4", title: "NP Code Solutions", host: "npcodesolutions.com.br", url: "https://www.npcodesolutions.com.br/", desc: t.np_desc, cta: t.access_system,
      imgs: [{ src: np1, alt: t.np_alt1 }, { src: np2, alt: t.np_alt2 }] },
    { id: "proj-5", title: "Space Guardian", host: "github.com/Provadelli", url: "https://github.com/Provadelli/GS--Sistema-de-Autonomia-de-Bordo", desc: t.space_desc, cta: t.see_repo,
      imgs: [{ src: circuito, alt: t.space_alt }] }
  ];

  return (
    <section className="section theme-stage" id="projetos" aria-labelledby="projetos-title">
      <SectionHead id="projetos-title" className="wrap section-head" eyebrow={t.proj_eyebrow} title={t.proj_title} />
      <Carousel projects={projects} />
    </section>
  );
}
