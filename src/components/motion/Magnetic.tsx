"use client";
/* Puxa levemente o filho na direção do ponteiro (só mouse/trackpad; desligado com movimento reduzido) */
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { PointerEvent, ReactNode } from "react";

export function Magnetic({ children, strength = 0.28, className }: { children: ReactNode; strength?: number; className?: string }){
  const reduce = useReducedMotion();
  const mx = useMotionValue(0), my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.4 });

  const move = (e: PointerEvent<HTMLSpanElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * strength);
    my.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => { mx.set(0); my.set(0); };

  return (
    <motion.span className={`inline-flex ${className ?? ""}`} style={{ x, y }} onPointerMove={move} onPointerLeave={reset}>
      {children}
    </motion.span>
  );
}
