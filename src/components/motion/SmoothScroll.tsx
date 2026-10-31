"use client";
/* Rolagem suave (Lenis). Desligada com "reduzir movimento".
   Fica parada enquanto a tela de carregamento estiver aberta. */
import Lenis from "lenis";
import { useEffect } from "react";
import { LOADER_DONE } from "@/lib/loader-state";
import { setLenis } from "@/lib/scroll";

export function SmoothScroll(){
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -88 }, autoRaf: true });
    setLenis(lenis);
    const root = document.documentElement;
    if (root.classList.contains("is-loading")) lenis.stop();
    const start = () => lenis.start();
    window.addEventListener(LOADER_DONE, start);
    return () => { window.removeEventListener(LOADER_DONE, start); lenis.destroy(); setLenis(null); };
  }, []);
  return null;
}
