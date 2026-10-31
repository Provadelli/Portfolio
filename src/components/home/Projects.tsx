import type { Dictionary } from "@/lib/i18n";
import pele from "@/assets/img/pelenextgen.webp";
import atelier from "@/assets/img/atelier.webp";
import shin from "@/assets/img/shinatal.webp";
import np from "@/assets/img/npcode.webp";
import circuito from "@/assets/img/circuito.webp";
import { LensCarousel, type Project } from "./LensCarousel";
import { SectionHead } from "./SectionHead";

export function Projects({ t }: { t: Dictionary }){
  const projects: Project[] = [
    { id: "proj-1", title: "Pelé Next Gen", host: "pelenextgen.vercel.app", url: "https://pelenextgen.vercel.app/", desc: t.pele_desc, cta: t.access_system, img: { src: pele, alt: t.pele_alt1 } },
    { id: "proj-2", title: "Atelier Residences", host: "imobiliaria-atelier.vercel.app", url: "https://imobiliaria-atelier.vercel.app/", desc: t.atelier_desc, cta: t.access_system, img: { src: atelier, alt: t.atelier_alt1 } },
    { id: "proj-3", title: "Shinatal", host: "shinatal.shinerio.com", url: "https://shinatal.shinerio.com", desc: t.shin_desc, cta: t.access_system, img: { src: shin, alt: t.shin_alt1 } },
    { id: "proj-4", title: "NP Code Solutions", host: "npcodesolutions.com.br", url: "https://www.npcodesolutions.com.br/", desc: t.np_desc, cta: t.access_system, img: { src: np, alt: t.np_alt1 } },
    { id: "proj-5", title: "Space Guardian", host: "github.com/Provadelli", url: "https://github.com/Provadelli/GS--Sistema-de-Autonomia-de-Bordo", desc: t.space_desc, cta: t.see_repo, img: { src: circuito, alt: t.space_alt } }
  ];

  return (
    <section className="section overflow-hidden bg-night" id="projetos" aria-labelledby="projetos-title">
      <div className="wrap flex flex-wrap items-end justify-between gap-6">
        <SectionHead id="projetos-title" className="section-head mb-0!" eyebrow={t.proj_eyebrow} title={t.proj_title} />
        <p className="mb-2 max-w-xs font-mono text-xs leading-relaxed text-ink-faint">{t.proj_note}</p>
      </div>
      <div className="mt-10 sm:mt-14"><LensCarousel projects={projects} /></div>
    </section>
  );
}
