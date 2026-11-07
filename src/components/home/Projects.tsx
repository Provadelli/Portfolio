import { getProjects } from "@/content/projects";
import type { Dictionary } from "@/lib/i18n";
import { LensCarousel } from "./LensCarousel";
import { SectionHead } from "./SectionHead";

export function Projects({ t }: { t: Dictionary }){
  const projects = getProjects(t);

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
