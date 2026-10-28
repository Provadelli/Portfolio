/* Cartão do fundador: sai do hero (direita) e desce até o Sobre (esquerda) */
import { reduceMotion, onScroll } from "./utils.js";

export function initFounder(){
  const card = document.getElementById("founder");
  const heroSlot = document.getElementById("heroSlot");
  const aboutSlot = document.getElementById("aboutSlot");
  if (!card || !heroSlot || !aboutSlot) return;

  const desktop = window.matchMedia("(min-width: 981px)");
  let floating = false;

  // mede o cartão no fluxo normal para reservar o espaço nos dois lugares
  function measure(){
    const was = card.classList.contains("is-float");
    card.classList.remove("is-float");
    heroSlot.style.minHeight = aboutSlot.style.minHeight = card.offsetHeight + "px";
    if (was) card.classList.add("is-float");
  }

  function layout(){
    if (!floating) return;
    const p = Math.min(Math.max(window.scrollY / (window.innerHeight * 0.85), 0), 1);
    const e = p * p * (3 - 2 * p);
    const a = heroSlot.getBoundingClientRect();
    const b = aboutSlot.getBoundingClientRect();
    card.style.transform = `translate3d(${a.left + (b.left - a.left) * e}px, ${a.top + (b.top - a.top) * e}px, 0)`;
  }

  function setFloat(on){
    floating = on;
    measure();
    document.documentElement.classList.toggle("float-on", on);
    card.classList.toggle("is-float", on);
    if (!on) card.style.transform = "";
    layout();
  }

  const remeasure = () => { measure(); layout(); };
  onScroll(layout);
  window.addEventListener("resize", remeasure);
  window.addEventListener("load", remeasure);
  document.addEventListener("langchange", remeasure);
  const evaluate = () => setFloat(desktop.matches && !reduceMotion);
  desktop.addEventListener("change", evaluate);
  evaluate();
}
