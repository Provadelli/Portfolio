"use client";
/* Trajetória: a linha dourada cresce com a rolagem e cada marco acende ao aparecer */
import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { useI18n } from "@/components/I18nProvider";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHead } from "./SectionHead";

export function Journey(){
  const { t } = useI18n();
  const line = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: line, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const items = [["FAETEC", t.t1], [t.t2_t, t.t2], [t.t3_t, t.t3], ["FIAP", t.t4]];

  return (
    <section className="section theme-mid" id="trajetoria" aria-labelledby="traj-title">
      <div className="wrap">
        <SectionHead id="traj-title" eyebrow={t.path_eyebrow} title={t.path_title} />

        <div className="timeline relative max-w-160 pl-6 sm:pl-10" ref={line}>
          {/* trilho apagado + traço que se preenche */}
          <span className="absolute top-2 bottom-2 left-1 w-0.5 bg-gold/25" aria-hidden="true" />
          <motion.span className="absolute top-2 bottom-2 left-1 w-0.5 origin-top bg-gold" style={{ scaleY }} aria-hidden="true" />
          {items.map(([title, text]) => (
            <Reveal key={title} className="timeline__item" visibleClass="is-visible">
              <span className="timeline__dot" aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
