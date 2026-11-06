import { Html } from "@/components/Html";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import type { Dictionary } from "@/lib/i18n";
import { IdCard } from "./IdCard";

export function About({ t }: { t: Dictionary }){
  const edu = [[t.edu1_label, t.edu1_title], [t.edu2_label, t.edu2_title]];
  const chips = ["HTML", "CSS", "JavaScript", "TypeScript", "Python", "C++", t.int2, t.int3, t.int4];

  return (
    <section className="section grid-bg overflow-hidden" id="sobre" aria-labelledby="sobre-title">
      <div className="wrap grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:gap-24">
        <div className="min-w-0">
          <Reveal as="p" className="eyebrow">{t.about_eyebrow}</Reveal>
          <Reveal as="h2" className="heading" id="sobre-title"><Html html={t.about_title} /></Reveal>

          <Reveal className="mt-7 max-w-text space-y-4 text-[17px] leading-[1.8] text-ink-soft [&_strong]:font-semibold [&_strong]:text-ink">
            <Html as="p" html={t.about_p1} />
            <Html as="p" html={t.about_p2} />
          </Reveal>

          <Stagger
            className="mt-10 grid max-w-text gap-3 sm:grid-cols-2"
            itemClassName="edu-card"
            items={edu.map(([label, title]) => ({
              key: title,
              content: <><span className="label mb-2 block text-gold-deep!">{label}</span><span className="block font-display text-xl font-semibold tracking-[-.02em]">{title}</span></>
            }))}
          />

          <Stagger className="mt-6 flex max-w-text flex-wrap gap-2" itemClassName="chip" step={0.04} y={12} items={chips.map(c => ({ key: c, content: c }))} />
        </div>

        {/* lugar da foto no Sobre: destino da foto que desce do hero */}
        <div className="mx-auto w-full max-w-[400px] max-lg:order-first" data-photo-slot="about"><IdCard decorative /></div>
      </div>
    </section>
  );
}
