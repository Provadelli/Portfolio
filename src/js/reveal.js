/* Elementos que surgem ao entrar na tela (.reveal) */
import { reduceMotion, onVisible } from "./utils.js";

export function initReveal(){
  const els = document.querySelectorAll(".reveal");
  if (reduceMotion){ els.forEach(el => el.classList.add("is-visible")); return; }
  els.forEach(el => onVisible(el, () => el.classList.add("is-visible"), { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }));
}
