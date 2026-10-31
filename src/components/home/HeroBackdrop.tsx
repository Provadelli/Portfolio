"use client";
/* Fundo do hero: grade e orbes de luz com leve parallax seguindo o mouse */
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";

export function HeroBackdrop(){
  const reduce = useReducedMotion();
  const px = useMotionValue(0), py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 40, damping: 18 }), sy = useSpring(py, { stiffness: 40, damping: 18 });
  const near = { x: useTransform(sx, v => v * 36), y: useTransform(sy, v => v * 28) };
  const far = { x: useTransform(sx, v => v * -22), y: useTransform(sy, v => v * -16) };
  const mid = { x: useTransform(sx, v => v * 14), y: useTransform(sy, v => v * 12) };

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      if (window.scrollY > window.innerHeight) return;   // fora do hero, nada a fazer
      px.set(e.clientX / window.innerWidth - 0.5);
      py.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduce, px, py]);

  return (
    <div className="hero__bg pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <span className="hero__grid" />
      <motion.span className="absolute inset-0" style={near}><span className="hero__orb hero__orb--1" /></motion.span>
      <motion.span className="absolute inset-0 max-sm:hidden" style={far}><span className="hero__orb hero__orb--2" /></motion.span>
      <motion.span className="absolute inset-0 max-lg:hidden" style={mid}><span className="hero__orb hero__orb--3" /></motion.span>
    </div>
  );
}
