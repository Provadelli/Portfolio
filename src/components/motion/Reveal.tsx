"use client";
/* Surge ao entrar na tela (substitui o antigo .reveal).
   - espera a tela de carregamento terminar
   - com movimento reduzido, só aparece (sem deslocamento), via <MotionConfig reducedMotion="user">
   - sem JavaScript, o CSS em <noscript> mostra tudo ([data-reveal]) */
import { motion, useInView, type HTMLMotionProps } from "motion/react";
import { useRef } from "react";
import { useLoaderDone } from "@/lib/loader-state";
import { EASE_SOFT } from "@/lib/motion";

const tags = {
  div: motion.div, p: motion.p, h2: motion.h2, h3: motion.h3,
  ul: motion.ul, li: motion.li, dl: motion.dl, a: motion.a
} as const;

type Props = {
  as?: keyof typeof tags;
  /** atraso em segundos */
  delay?: number;
  /** distância inicial em px */
  y?: number;
  /** classe aplicada quando estiver visível (ex.: "is-visible" na linha do tempo) */
  visibleClass?: string;
  href?: string;
} & Omit<HTMLMotionProps<"div">, "initial" | "animate" | "transition" | "ref">;

export function Reveal({ as = "div", delay = 0, y = 26, visibleClass, className, children, ...rest }: Props){
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15, margin: "0px 0px -60px 0px" });
  const ready = useLoaderDone();
  const show = inView && ready;
  const Comp = tags[as] as typeof motion.div;

  return (
    <Comp
      ref={ref as React.Ref<HTMLDivElement>}
      data-reveal=""
      initial={{ opacity: 0, y }}
      animate={show ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.9, ease: EASE_SOFT, delay }}
      className={[className, show && visibleClass].filter(Boolean).join(" ") || undefined}
      {...rest}
    >
      {children}
    </Comp>
  );
}
