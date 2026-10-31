"use client";
/* Lista cujos itens entram em cascata quando a lista aparece na tela */
import { motion, useInView } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useLoaderDone } from "@/lib/loader-state";
import { EASE_SOFT } from "@/lib/motion";

type Item = { key: string; className?: string; content: ReactNode };

export function Stagger({ items, className, itemClassName, step = 0.07, y = 22, ...aria }: {
  items: Item[]; className?: string; itemClassName?: string; step?: number; y?: number; "aria-label"?: string;
}){
  const ref = useRef<HTMLUListElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1, margin: "0px 0px -60px 0px" });
  const ready = useLoaderDone();
  const show = inView && ready;

  return (
    <ul ref={ref} className={className} {...aria}>
      {items.map((it, i) => (
        <motion.li
          key={it.key}
          data-reveal=""
          className={[itemClassName, it.className].filter(Boolean).join(" ") || undefined}
          initial={{ opacity: 0, y }}
          animate={show ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, ease: EASE_SOFT, delay: i * step }}
        >
          {it.content}
        </motion.li>
      ))}
    </ul>
  );
}
