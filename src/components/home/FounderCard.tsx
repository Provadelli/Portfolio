"use client";
/* Cartão do fundador (selo postal): no desktop, sai do hero (direita) e desce até o
   Sobre (esquerda) conforme a rolagem. Fica no fluxo normal no celular e com movimento reduzido. */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useI18n } from "@/components/I18nProvider";

export function FounderCard({ children }: { children: ReactNode }){
  const { lang } = useI18n();
  const card = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [floating, setFloating] = useState(false);
  const { scrollY } = useScroll();

  const slots = () => [document.getElementById("heroSlot"), document.getElementById("aboutSlot")] as const;

  function layout(){
    const el = card.current, [a, b] = slots();
    if (!floating || !el || !a || !b) return;
    const p = Math.min(Math.max(window.scrollY / (window.innerHeight * 0.85), 0), 1);
    const e = p * p * (3 - 2 * p);   // smoothstep
    const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    el.style.transform = `translate3d(${ra.left + (rb.left - ra.left) * e}px, ${ra.top + (rb.top - ra.top) * e}px, 0)`;
  }
  useMotionValueEvent(scrollY, "change", layout);

  // liga/desliga o modo flutuante conforme a largura da tela
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 981px)");
    const evaluate = () => setFloating(desktop.matches && !reduce);
    evaluate();
    desktop.addEventListener("change", evaluate);
    return () => desktop.removeEventListener("change", evaluate);
  }, [reduce]);

  // mede o cartão no fluxo normal para reservar o mesmo espaço nos dois lugares
  useEffect(() => {
    const el = card.current, [a, b] = slots();
    if (!el || !a || !b) return;
    document.documentElement.classList.toggle("float-on", floating);
    if (!floating) el.style.transform = "";

    const measure = () => {
      el.classList.remove("is-float");
      a.style.minHeight = b.style.minHeight = el.offsetHeight + "px";
      if (floating) el.classList.add("is-float");
      layout();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("load", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("load", measure);
      document.documentElement.classList.remove("float-on");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [floating, lang]);

  return (
    <figure ref={card} className={`founder mx-auto ${floating ? "is-float" : ""}`} id="founder">
      {children}
    </figure>
  );
}
