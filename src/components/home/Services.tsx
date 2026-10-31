import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import type { Dictionary } from "@/lib/i18n";
import { SectionHead } from "./SectionHead";

export function Services({ t }: { t: Dictionary }){
  const items = [[t.s1_t, t.s1_d], [t.s2_t, t.s2_d], [t.s3_t, t.s3_d], [t.s4_t, t.s4_d]];

  return (
    <section className="section theme-white" id="servicos" aria-labelledby="serv-title">
      <div className="wrap">
        <SectionHead id="serv-title" eyebrow={t.serv_eyebrow} title={t.serv_title} lede={t.serv_lede} />
        <Stagger
          className="grid gap-4.5 sm:grid-cols-2 xl:grid-cols-4" itemClassName="service" step={0.1} y={30}
          items={items.map(([title, desc], i) => ({
            key: title,
            content: <><span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{desc}</p></>
          }))}
        />
        <Reveal as="a" href="#contato" className="btn btn-gold mt-10 px-10 py-4.25 text-sm"><span>{t.start_project}</span></Reveal>
      </div>
    </section>
  );
}
