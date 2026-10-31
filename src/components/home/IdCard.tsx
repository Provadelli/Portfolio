"use client";
/* Card "ID" da foto (reinterpretação do selo postal): duotone café/dourado, cantos de mira,
   carimbo girando, varredura no hover e inclinação 3D suave seguindo o mouse. */
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { PointerEvent } from "react";
import { useI18n } from "@/components/I18nProvider";
import { Flag } from "@/components/svg/Flag";
import pedro from "@/assets/img/pedro.webp";

const STAMP = "ENGENHARIA DE SOFTWARE ✦ FIAP ✦ ELETRÔNICA ✦ FAETEC ✦ ";

export function IdCard(){
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const px = useMotionValue(0), py = useMotionValue(0);
  const rx = useSpring(useTransform(py, v => v * -8), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(px, v => v * 10), { stiffness: 150, damping: 18 });

  const move = (e: PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => { px.set(0); py.set(0); };

  const corner = "idcard__corner";
  return (
    <div style={{ perspective: 1000 }}>
      <motion.figure className="idcard m-0" style={{ rotateX: rx, rotateY: ry }} onPointerMove={move} onPointerLeave={reset}>
        <span className={`${corner} -top-1 -left-1 rounded-tl-xl border-t border-l`} aria-hidden="true" />
        <span className={`${corner} -top-1 -right-1 rounded-tr-xl border-t border-r`} aria-hidden="true" />
        <span className={`${corner} -bottom-1 -left-1 rounded-bl-xl border-b border-l`} aria-hidden="true" />
        <span className={`${corner} -right-1 -bottom-1 rounded-br-xl border-r border-b`} aria-hidden="true" />

        <div className="mb-3 flex items-center justify-between px-2 pt-1 font-mono text-[10px] tracking-[.2em] text-ink-faint uppercase" aria-hidden="true">
          <span>ID · 001 / PLP</span>
          <span className="flex items-center gap-2"><Flag className="h-1.5 w-4 rounded-xs" />IT·BR</span>
        </div>

        <div className="idcard__photo">
          <Image src={pedro} alt={t.photo_alt} sizes="(min-width: 981px) 420px, 90vw" quality={85} className="size-full object-cover object-top" />
          <span className="idcard__scan" aria-hidden="true" />
          <svg className="idcard__stamp" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
            <defs><path id="stampPath" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1 -76 0" /></defs>
            <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth=".6" />
            <text fill="currentColor" fontSize="7.4" letterSpacing="1.1" className="font-mono"><textPath href="#stampPath">{STAMP}</textPath></text>
            <circle cx="50" cy="50" r="3" fill="#F2A93B" />
          </svg>
          <div className="absolute inset-x-0 bottom-0 z-3 p-5">
            <strong className="block font-display text-2xl font-semibold tracking-[-.03em] text-cream">Pedro Provadelli</strong>
            <span className="mt-1 block font-mono text-[11px] tracking-[.14em] text-gold-light uppercase">{t.founder_sub}</span>
          </div>
        </div>

        <div className="flex items-center justify-between px-2 pt-3 pb-1 font-mono text-[10px] tracking-[.16em] text-ink-faint" aria-hidden="true">
          <span>43.7230° N · 10.3966° E</span>
          <span className="text-gold-deep">● ONLINE</span>
        </div>
        <Flag className="mx-2 mb-1 h-0.5 rounded-xs" />
      </motion.figure>
    </div>
  );
}
