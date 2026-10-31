import { Html } from "@/components/Html";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import type { Dictionary } from "@/lib/i18n";
import { EMAIL } from "@/lib/site";

const capIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10 12 5 2 10l10 5 10-5z" /><path d="M6 12v5c3 2.5 9 2.5 12 0v-5" />
  </svg>
);
const chipIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
  </svg>
);

export function About({ t }: { t: Dictionary }){
  const edu = [[capIcon, t.edu1_label, t.edu1_title], [chipIcon, t.edu2_label, t.edu2_title]] as const;
  const techs = ["HTML", "CSS", "JavaScript", "Python", "C++"];
  const interests = [t.int1, t.int2, t.int3, t.int4, t.int5];
  const facts = [[t.f1_t, t.f1_d], [t.f2_t, t.f2_d], [t.f3_t, t.f3_d], [t.f4_t, t.f4_d]];

  return (
    <section className="section theme-light" id="sobre" aria-labelledby="sobre-title">
      <div className="wrap about grid items-start gap-12">
        <div className="about__aside" aria-hidden="true"><div className="w-[min(340px,100%)]" id="aboutSlot" /></div>

        <div className="min-w-0">
          <Reveal as="p" className="eyebrow">{t.about_eyebrow}</Reveal>
          <Reveal as="h2" className="heading mb-6 text-[clamp(38px,5.4vw,70px)] leading-none [&_em]:not-italic" id="sobre-title">
            <Html html={t.about_title} />
          </Reveal>

          <Reveal className="max-w-text text-[17px] leading-[1.8] text-ink-soft [&_p]:mb-4.5 [&_strong]:text-ink">
            <Html as="p" html={t.about_p1} />
            <Html as="p" html={t.about_p2} />
          </Reveal>

          <Stagger
            className="mt-8.5 grid max-w-text gap-3.5 sm:grid-cols-2"
            itemClassName="surface flex items-center gap-3.5 rounded-2xl px-4.5 py-4"
            items={edu.map(([icon, label, title]) => ({
              key: title,
              content: <>
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-line text-gold-deep" aria-hidden="true">{icon}</span>
                <span><span className="label mb-1 block text-[11px]">{label}</span><span className="block text-base font-bold">{title}</span></span>
              </>
            }))}
          />

          <Reveal as="h3" className="label mt-9 mb-3.5 tracking-[.16em]">{t.lbl_tech}</Reveal>
          <Stagger className="flex max-w-text flex-wrap gap-2.5" itemClassName="chip" step={0.05} y={14} items={techs.map(x => ({ key: x, content: x }))} />

          <Reveal as="h3" className="label mt-9 mb-3.5 tracking-[.16em]">{t.lbl_interests}</Reveal>
          <Stagger className="flex max-w-text flex-wrap gap-2.5" itemClassName="chip" step={0.05} y={14} items={interests.map(x => ({ key: x, content: x }))} />

          <Reveal as="h3" className="label mt-9 mb-3.5 tracking-[.16em]">{t.lbl_facts}</Reveal>
          <Reveal as="dl" className="facts">
            {facts.map(([dt, dd]) => <div key={dt}><dt>{dt}</dt><dd>{dd}</dd></div>)}
            <div><dt>{t.f5_t}</dt><dd><a href={`mailto:${EMAIL}`} className="link [overflow-wrap:anywhere]">{EMAIL}</a></dd></div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
