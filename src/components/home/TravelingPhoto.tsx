"use client";
/* FOTO QUE VIAJA: nasce na coluna da direita do hero e, conforme a página rola, desce
   (e cresce um pouco) até encaixar no card do Sobre, também à direita. É um único elemento posicionado dentro do <main>; os dois
   lugares ([data-photo-slot]) guardam fotos estáticas: no topo da página quem aparece é a do
   hero (vem no HTML, é o LCP e pinta cedo); ao começar a rolar, esta assume exatamente no mesmo
   ponto. Sem JavaScript ou com "reduzir movimento", nada viaja. */
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { IdCard } from "./IdCard";

type Geo = { ax: number; ay: number; aw: number; bx: number; by: number; bw: number; end: number };

// suave nas duas pontas: a foto quase não sai do lugar na tela enquanto a página rola, e pousa com calma
const ease = (v: number) => v * v * (3 - 2 * v);
const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

export function TravelingPhoto(){
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const geo = useRef<Geo | null>(null);
  const x = useMotionValue(0), y = useMotionValue(0), scale = useMotionValue(1), halo = useMotionValue(1), shown = useMotionValue("hidden");
  const [width, setWidth] = useState(400);

  // posição atual a partir da rolagem
  const update = (sy: number) => {
    const g = geo.current;
    if (!g) return;
    const e = ease(clamp01(sy / g.end));
    x.set(g.ax + (g.bx - g.ax) * e);
    y.set(g.ay + (g.by - g.ay) * e);
    scale.set(g.aw / g.bw + (1 - g.aw / g.bw) * e);
    halo.set(1 - e);                                           // o brilho dourado fica no hero
    // parada no topo: a foto estática do hero aparece; rolando, esta assume
    const moving = sy > 1;
    shown.set(moving ? "visible" : "hidden");               // visibility: some também para leitores de tela
    document.documentElement.classList.toggle("photo-travel", moving);
  };
  useMotionValueEvent(scrollY, "change", update);

  // mede os dois lugares (em coordenadas do <main>) e o ponto de chegada
  useEffect(() => {
    if (reduce) return;
    const main = document.getElementById("main");
    const heroSlot = document.querySelector<HTMLElement>('[data-photo-slot="hero"]');
    const aboutSlot = document.querySelector<HTMLElement>('[data-photo-slot="about"]');
    if (!main || !heroSlot || !aboutSlot) return;

    const measure = () => {
      const m = main.getBoundingClientRect(), a = heroSlot.getBoundingClientRect(), b = aboutSlot.getBoundingClientRect();
      if (!a.width || !b.width) return;
      const by = b.top - m.top;
      const docTop = m.top + window.scrollY;
      // chega quando o card do Sobre está centralizado na tela (ou a 96px do topo, se for alto)
      const end = Math.max(docTop + by - Math.max((window.innerHeight - b.height) / 2, 96), 1);
      geo.current = { ax: a.left - m.left, ay: a.top - m.top, aw: a.width, bx: b.left - m.left, by, bw: b.width, end };
      setWidth(b.width);
      update(window.scrollY);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(main); ro.observe(heroSlot); ro.observe(aboutSlot);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      document.documentElement.classList.remove("photo-travel");
    };
    // update só usa refs e motion values estáveis
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  if (reduce) return null;

  return (
    <motion.div
      className="pointer-events-auto absolute top-0 left-0 z-2 origin-top-left will-change-transform"
      style={{ x, y, scale, width, visibility: shown }}
    >
      {/* brilho dourado atrás da foto, que some quando ela chega ao Sobre */}
      <motion.span className="pointer-events-none absolute -inset-10 -z-1 rounded-[48px] bg-[radial-gradient(closest-side,rgba(242,169,59,.28),transparent)]" style={{ opacity: halo }} aria-hidden="true" />
      <IdCard />
    </motion.div>
  );
}
