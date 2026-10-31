"use client";
/* Trajetória. No desktop, a seção fica presa na tela e os marcos correm na horizontal
   conforme a rolagem; a Torre de Pisa ao fundo endireita com o progresso.
   No celular (e com "reduzir movimento"), vira uma lista vertical comum. */
import { motion, useMotionValue, useScroll, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { useI18n } from "@/components/I18nProvider";
import { Reveal } from "@/components/motion/Reveal";
import { PisaTower } from "@/components/svg/PisaTower";
import { useMedia } from "@/lib/useMedia";
import { SectionHead } from "./SectionHead";

export function Journey(){
  const { t } = useI18n();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const pinned = useMedia("(min-width: 981px) and (prefers-reduced-motion: no-preference)");
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const dist = useMotionValue(0);
  const x = useTransform(() => (pinned ? -scrollYProgress.get() * dist.get() : 0));
  const tilt = useTransform(scrollYProgress, [0, 1], [3.97, 0]);
  const angle = useTransform(tilt, a => `${a.toFixed(2).replace(".", ",")}°`);

  // distância que a faixa precisa andar = largura dela - largura da tela
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(() => dist.set(Math.max(0, el.scrollWidth - window.innerWidth + 64)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [dist]);

  const items = [
    ["FAETEC", t.t1, t.t1_k],
    [t.t2_t, t.t2, t.t2_k],
    [t.t3_t, t.t3, t.t3_k],
    ["FIAP", t.t4, t.t4_k]
  ];

  return (
    <section ref={section} className={`relative bg-bg text-ink ${pinned ? "h-[340vh]" : ""}`} id="trajetoria" aria-labelledby="traj-title">
      <div className={pinned ? "sticky top-0 flex h-svh flex-col justify-center overflow-hidden" : "py-24 sm:py-28"}>
        {/* torre ao fundo */}
        <svg className="pointer-events-none absolute right-[4%] bottom-0 h-[78%] max-h-[640px] opacity-80 max-lg:hidden" viewBox="-40 20 300 400" aria-hidden="true" focusable="false">
          <path className="pisa-line" d="M-30 392H240" />
          <motion.g style={{ rotate: tilt, originX: 0.5, originY: 1, transformBox: "fill-box" }}><PisaTower c="pisa-line" /></motion.g>
          <motion.text x="104" y="30" className="font-mono" fontSize="9" fill="rgba(224,190,114,.6)">{angle}</motion.text>
        </svg>

        <div className="wrap relative">
          <SectionHead id="traj-title" eyebrow={t.path_eyebrow} title={t.path_title} className={pinned ? "mb-10" : "section-head"} />
          {pinned && (
            <div className="relative mb-12 h-px w-full max-w-md bg-line" aria-hidden="true">
              <motion.span className="absolute inset-0 origin-left" style={{ scaleX: scrollYProgress, background: "linear-gradient(90deg,#2E7D4F 0 33%,#F4EFE6 33% 66%,#C3343A 66%)" }} />
            </div>
          )}
        </div>

        <motion.div ref={track} style={{ x }} className={pinned ? "flex w-max gap-6 pl-[max(32px,calc((100vw-var(--container-site))/2+32px))] pr-16" : "wrap grid gap-5"}>
          {items.map(([title, text, tag], i) => (
            <Reveal key={title} className={`relative flex flex-col justify-between rounded-[26px] border border-line bg-surface p-7 sm:p-9 ${pinned ? "h-[340px] w-[min(520px,42vw)]" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <span className="font-mono text-[11px] tracking-[.18em] text-gold-deep uppercase">{tag}</span>
                <span className="milestone__num -mt-4 -mr-2 text-[clamp(64px,8vw,120px)]!" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div>
                <h3 className="m-0 mb-3 font-display text-[clamp(24px,2.6vw,34px)] font-semibold tracking-[-.03em]">{title}</h3>
                <p className="m-0 max-w-md text-[15px] leading-[1.7] text-ink-soft">{text}</p>
              </div>
            </Reveal>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
