import { Html } from "@/components/Html";
import { Reveal } from "@/components/motion/Reveal";
import type { Dictionary } from "@/lib/i18n";

/* <details> nativo: funciona sem JavaScript e com leitores de tela.
   A abertura animada vem do CSS (::details-content + interpolate-size). */
export function Faq({ t }: { t: Dictionary }){
  const qa = [[t.q1, t.a1], [t.q2, t.a2], [t.q3, t.a3], [t.q4, t.a4], [t.q5, t.a5], [t.q6, t.a6]];

  return (
    <section className="section theme-light grid-bg" id="faq" aria-labelledby="faq-title">
      <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal as="p" className="eyebrow">{t.faq_eyebrow}</Reveal>
          <Reveal as="h2" className="heading" id="faq-title"><Html html={t.faq_title} /></Reveal>
          <Reveal as="p" className="lede">{t.faq_side}</Reveal>
          <Reveal className="mt-8"><a href="#contato" className="btn">{t.nav_cta}<span className="btn__arrow" aria-hidden="true">↗</span></a></Reveal>
        </div>
        <Reveal className="faq prose-links">
          {qa.map(([q, a], i) => (
            <details key={q}>
              <summary><span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><span>{q}</span></summary>
              <Html as="p" html={a} />
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
