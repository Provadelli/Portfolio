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
import { LensCarousel, type Project } from "./LensCarousel";
import { SectionHead } from "./SectionHead";

export function Projects({ t }: { t: Dictionary }){
  const projects: Project[] = [
    { id: "proj-1", title: "Pelé Next Gen", host: "pelenextgen.vercel.app", url: "https://pelenextgen.vercel.app/", desc: t.pele_desc, cta: t.access_system, imgs: [{ src: pele, alt: t.pele_alt1 }, { src: pele2, alt: t.pele_alt2 }] },
    { id: "proj-2", title: "Atelier Residences", host: "imobiliaria-atelier.vercel.app", url: "https://imobiliaria-atelier.vercel.app/", desc: t.atelier_desc, cta: t.access_system, imgs: [{ src: atelier, alt: t.atelier_alt1 }, { src: atelier2, alt: t.atelier_alt2 }] },
    { id: "proj-3", title: "Shinatal", host: "shinatal.shinerio.com", url: "https://shinatal.shinerio.com", desc: t.shin_desc, cta: t.access_system, imgs: [{ src: shin, alt: t.shin_alt1 }, { src: shin2, alt: t.shin_alt2 }] },
    { id: "proj-4", title: "NP Code Solutions", host: "npcodesolutions.com.br", url: "https://www.npcodesolutions.com.br/", desc: t.np_desc, cta: t.access_system, imgs: [{ src: np, alt: t.np_alt1 }, { src: np2, alt: t.np_alt2 }] },
    { id: "proj-5", title: "Space Guardian", host: "github.com/Provadelli", url: "https://github.com/Provadelli/GS--Sistema-de-Autonomia-de-Bordo", desc: t.space_desc, cta: t.see_repo, imgs: [{ src: circuito, alt: t.space_alt }] }
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
