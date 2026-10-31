import type { Dictionary } from "@/lib/i18n";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHead } from "./SectionHead";
import { ServiceCards } from "./ServiceCards";

export function Services({ t }: { t: Dictionary }){
  const split = (s: string) => s.split(" · ");
  const items = [
    { title: t.s1_t, desc: t.s1_d, more: split(t.s1_x) },
    { title: t.s2_t, desc: t.s2_d, more: split(t.s2_x) },
    { title: t.s3_t, desc: t.s3_d, more: split(t.s3_x) },
    { title: t.s4_t, desc: t.s4_d, more: split(t.s4_x) }
  ];

  return (
    <section className="section theme-light grid-bg" id="servicos" aria-labelledby="serv-title">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead id="serv-title" eyebrow={t.serv_eyebrow} title={t.serv_title} lede={t.serv_lede} />
          <Reveal className="mb-16 max-sm:hidden"><a href="#contato" className="btn">{t.start_project}<span className="btn__arrow" aria-hidden="true">↗</span></a></Reveal>
        </div>
        <ServiceCards items={items} cta={t.start_project} />
      </div>
    </section>
  );
}
