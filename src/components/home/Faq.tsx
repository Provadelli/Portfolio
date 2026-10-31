import { Html } from "@/components/Html";
import { Reveal } from "@/components/motion/Reveal";
import type { Dictionary } from "@/lib/i18n";
import { SectionHead } from "./SectionHead";

/* <details> nativo: funciona sem JavaScript e com leitores de tela.
   A abertura animada vem do CSS (::details-content + interpolate-size). */
export function Faq({ t }: { t: Dictionary }){
  const qa = [[t.q1, t.a1], [t.q2, t.a2], [t.q3, t.a3], [t.q4, t.a4], [t.q5, t.a5], [t.q6, t.a6]];

  return (
    <section className="section theme-white" id="faq" aria-labelledby="faq-title">
      <div className="wrap max-w-215">
        <SectionHead id="faq-title" eyebrow={t.faq_eyebrow} title={t.faq_title} />
        <Reveal className="faq prose-links">
          {qa.map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <Html as="p" html={a} />
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
