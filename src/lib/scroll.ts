/* Acesso à instância do Lenis (rolagem suave) para travar/destravar a rolagem */
import type Lenis from "lenis";

let instance: Lenis | null = null;
export const setLenis = (l: Lenis | null) => { instance = l; };

/* trava a rolagem da página (menu móvel aberto, por exemplo) */
export function lockScroll(lock: boolean){
  document.body.style.overflow = lock ? "hidden" : "";
  if (lock) instance?.stop(); else instance?.start();
}

/* volta ao topo da página (suave com o Lenis; sem ele, rolagem nativa) */
export function scrollToTop(){
  if (instance) instance.scrollTo(0, { force: true });
  else window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}
