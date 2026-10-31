"use client";
/* Palavras que sobem de dentro de uma máscara, uma após a outra.
   O texto continua legível para leitores de tela (as palavras são texto comum). */
import { motion } from "motion/react";
import { Fragment, type ReactNode } from "react";
import { useLoaderDone } from "@/lib/loader-state";
import { EASE_BRAND } from "@/lib/motion";

export function SplitText({ text, delay = 0, step = 0.07, className, wordClass, after }: {
  text: string; delay?: number; step?: number; className?: string; wordClass?: string; after?: ReactNode;
}){
  const ready = useLoaderDone();
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <Fragment key={i}>
        <span className="inline-block overflow-hidden pb-[.08em] align-bottom">
          <motion.span
            className={`inline-block ${wordClass ?? ""}`}
            data-reveal=""
            initial={{ y: "110%" }}
            animate={ready ? { y: "0%" } : undefined}
            transition={{ duration: 1.1, ease: EASE_BRAND, delay: delay + i * step }}
          >
            {w}{i === words.length - 1 ? after : null}
          </motion.span>
        </span>
        {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
