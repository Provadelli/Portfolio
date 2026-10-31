"use client";
/* Título do hero: cada linha sobe e desfoca para nítido; depois o traço dourado se desenha */
import { motion } from "motion/react";
import { useLoaderDone } from "@/lib/loader-state";
import { EASE_BRAND } from "@/lib/motion";

export function HeroTitle({ l1, l2 }: { l1: string; l2: string }){
  const ready = useLoaderDone();
  const line = (i: number) => ({
    "data-reveal": "",
    initial: { opacity: 0, y: "0.45em", filter: "blur(10px)" },
    animate: ready ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined,
    transition: { duration: 1.1, ease: EASE_BRAND, delay: 0.1 + i * 0.14 }
  });

  return (
    <h1 className="m-0 mb-5 flex flex-col font-display text-[clamp(40px,5.4vw,82px)] leading-[1.02] font-medium tracking-[-.025em]" id="hero-title">
      <motion.span className="block" {...line(0)}>{l1}</motion.span>
      <motion.span className="hero__last" {...line(1)}>
        <span>{l2}</span>
        <svg className="absolute -bottom-[.08em] left-0 h-[.16em] w-full overflow-visible text-gold-btn" viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <motion.path
            d="M3 15 C 30 3, 52 3, 78 13 S 130 23, 158 11 S 214 3, 240 13 S 280 18, 297 8"
            fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round"
            data-reveal=""
            initial={{ pathLength: 0, opacity: 0 }}
            animate={ready ? { pathLength: 1, opacity: 1 } : undefined}
            transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1], delay: 0.75 }}
          />
        </svg>
      </motion.span>
    </h1>
  );
}
