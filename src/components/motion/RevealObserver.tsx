"use client";
/* Um único IntersectionObserver para todos os [data-reveal] da página (Reveal, Stagger, SplitText).
   - espera a tela de carregamento terminar
   - ao entrar na tela: classe .is-in (o CSS faz a transição)
   - terminada a transição, tira o data-reveal: o elemento volta às próprias transições (hover etc.)
   - palavras do SplitText ficam escondidas dentro de uma máscara (overflow: hidden), então o
     que se observa é a máscara, não a palavra */
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { LOADER_DONE } from "@/lib/loader-state";

export function RevealObserver(){
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const timers: number[] = [];
    let io: IntersectionObserver | null = null;

    const show = (el: HTMLElement) => {
      el.classList.add("is-in");
      const delay = parseFloat(el.style.getPropertyValue("--rd")) || 0;
      timers.push(window.setTimeout(() => {
        el.removeAttribute("data-reveal");
        el.classList.remove("is-in");
      }, (delay + 1.3) * 1000));
    };

    const start = () => {
      const targets = new Map<Element, HTMLElement>();
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)").forEach(el => {
        targets.set(el.dataset.reveal === "split" ? el.parentElement ?? el : el, el);
      });
      io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          io!.unobserve(e.target);
          const el = targets.get(e.target);
          if (el) show(el);
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
      targets.forEach((_, target) => io!.observe(target));
    };

    if (root.classList.contains("is-loading")) window.addEventListener(LOADER_DONE, start, { once: true });
    else start();

    return () => {
      window.removeEventListener(LOADER_DONE, start);
      io?.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [pathname]);

  return null;
}
