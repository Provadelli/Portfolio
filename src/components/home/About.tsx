import { Html } from "@/components/Html";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import type { Dictionary } from "@/lib/i18n";
import { EMAIL } from "@/lib/site";
import { IdCard } from "./IdCard";

export function About({ t }: { t: Dictionary }){
  const edu = [[t.edu1_label, t.edu1_title], [t.edu2_label, t.edu2_title]];
  const chips = ["HTML", "CSS", "JavaScript", "TypeScript", "Python", "C++", t.int2, t.int3, t.int4];
  const facts = [[t.f1_t, t.f1_d], [t.f2_t, t.f2_d], [t.f3_t, t.f3_d], [t.f4_t, t.f4_d]];

  return (
    <section className="section grid-bg overflow-hidden" id="sobre" aria-labelledby="sobre-title">
      <div className="wrap grid items-center gap-14 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-20">
        <Reveal y={40}><IdCard /></Reveal>

        <div className="min-w-0">
          <Reveal as="p" className="eyebrow">{t.about_eyebrow}</Reveal>
          <Reveal as="h2" className="heading" id="sobre-title"><Html html={t.about_title} /></Reveal>

          <Reveal className="mt-7 max-w-text space-y-4 text-[17px] leading-[1.8] text-ink-soft [&_strong]:font-semibold [&_strong]:text-ink">
            <Html as="p" html={t.about_p1} />
            <Html as="p" html={t.about_p2} />
          </Reveal>

          <Stagger
            className="mt-9 grid max-w-text gap-3 sm:grid-cols-2"
            itemClassName="rounded-2xl border border-line bg-surface px-5 py-4"
            items={edu.map(([label, title]) => ({
              key: title,
              content: <><span className="label mb-1.5 block">{label}</span><span className="block font-display text-lg font-semibold tracking-[-.02em]">{title}</span></>
            }))}
          />

          <Stagger className="mt-6 flex max-w-text flex-wrap gap-2" itemClassName="chip" step={0.04} y={12} items={chips.map(c => ({ key: c, content: c }))} />

          <Reveal className="terminal mt-9 max-w-text">
            <div className="terminal__bar" aria-hidden="true">
              <i className="bg-it-green" /><i className="bg-it-white" /><i className="bg-it-red" />
              <span className="ml-2">~/provadelli/{t.term_file}</span>
            </div>
            <dl aria-label={t.lbl_facts}>
              {facts.map(([dt, dd]) => <div key={dt}><dt>{dt.toLowerCase()}</dt><dd>{dd}</dd></div>)}
              <div><dt>{t.f5_t.toLowerCase()}</dt><dd><a href={`mailto:${EMAIL}`} className="link [overflow-wrap:anywhere]">{EMAIL}</a><span className="blink ml-1 text-gold-deep" aria-hidden="true">▍</span></dd></div>
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
