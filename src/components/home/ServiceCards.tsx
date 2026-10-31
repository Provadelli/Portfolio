"use client";
/* Cards largos de serviço. Com mouse, um painel escuro segue o cursor (mola) mostrando
   um visual animado e os entregáveis do serviço. Em toque, os entregáveis aparecem no card. */
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useState, type PointerEvent } from "react";
import { EASE_BRAND } from "@/lib/motion";
import { VISUALS } from "./ServiceVisuals";

export type Service = { title: string; desc: string; more: string[] };

const ICONS = [
  <path key="w" d="M4 6h16v12H4zM4 9h16M8 13h5" />,
  <path key="a" d="M5 19V9M10 19V5M15 19v-7M20 19v-4" />,
  <path key="t" d="M4 6l5 5-5 5M11 17h9" />,
  <path key="e" d="M8 8h8v8H8zM10 4v4M14 4v4M10 16v4M14 16v4M4 10h4M4 14h4M16 10h4M16 14h4" />
];

export function ServiceCards({ items, cta }: { items: Service[]; cta: string }){
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 26, mass: 0.6 });
  const y = useSpring(my, { stiffness: 260, damping: 26, mass: 0.6 });

  const track = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    mx.set(e.clientX + 24); my.set(e.clientY - 120);
  };
  const enter = (i: number) => (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    if (active === null){ x.jump(e.clientX + 24); y.jump(e.clientY - 120); }
    setActive(i);
  };

  const Visual = active !== null ? VISUALS[active] : null;

  return (
    <>
      <ul className="grid gap-5 lg:grid-cols-2" onPointerMove={track} onPointerLeave={() => setActive(null)}>
        {items.map((s, i) => (
          <motion.li
            key={s.title}
            data-reveal=""
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -60px 0px" }}
            transition={{ duration: 0.9, ease: EASE_BRAND, delay: (i % 2) * 0.1 }}
          >
            <a href="#contato" className="service group" onPointerEnter={enter(i)} aria-describedby={`svc-more-${i}`}>
              <div className="flex items-start justify-between gap-6">
                <span className="font-mono text-xs font-bold tracking-[.16em]">{String(i + 1).padStart(2, "0")}</span>
                <svg className="size-14 text-[rgba(11,8,6,.75)] sm:size-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[i]}</svg>
              </div>
              <div className="mt-10 flex items-end justify-between gap-6">
                <div>
                  <h3 className="m-0 font-display text-[clamp(22px,2.4vw,30px)] leading-tight font-semibold tracking-[-.03em]">{s.title}</h3>
                  <p className="mt-2 mb-0 max-w-md text-[14.5px] leading-[1.6] text-[#3B2C1C]">{s.desc}</p>
                  <p className="service__more" id={`svc-more-${i}`}>{s.more.join(" · ")}</p>
                </div>
                <span className="service__arrow shrink-0" aria-hidden="true">↗</span>
              </div>
              <span className="sr-only">{cta}</span>
            </a>
          </motion.li>
        ))}
      </ul>

      {/* painel que segue o cursor (só mouse; decorativo — o texto também está no card) */}
      {!reduce && (
        <AnimatePresence>
          {Visual && active !== null && (
            <motion.div
              className="svc-panel max-lg:hidden" aria-hidden="true"
              style={{ x, y }}
              initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, ease: EASE_BRAND }}
            >
              <AnimatePresence mode="wait">
                <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
                  <Visual />
                  <ul className="m-0 grid list-none gap-1.5 border-t border-[rgba(224,190,114,.2)] px-5 py-4 font-mono text-[11px] text-[#CBBBA4]">
                    {items[active].more.map(m => <li key={m}><span className="text-[#F2A93B]">›</span> {m}</li>)}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}
