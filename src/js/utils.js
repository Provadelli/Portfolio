/* Utilitários compartilhados pelos módulos da página */

export const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Um único listener de rolagem/redimensionamento para o site inteiro:
   cada módulo se inscreve e todos rodam juntos no mesmo quadro (rAF). */
const subscribers = new Set();
let queued = false;
function flush(){ queued = false; subscribers.forEach(fn => fn()); }
function queue(){ if (!queued){ queued = true; requestAnimationFrame(flush); } }
window.addEventListener("scroll", queue, { passive: true });
window.addEventListener("resize", queue);

export function onScroll(fn, { immediate = true } = {}){
  subscribers.add(fn);
  if (immediate) fn();
  return () => subscribers.delete(fn);
}

/* Chama `cb(entry)` quando o elemento entra na tela.
   once: para de observar na primeira vez (padrão). */
export function onVisible(el, cb, { once = true, threshold = 0, rootMargin = "0px" } = {}){
  if (!("IntersectionObserver" in window)){ cb({ isIntersecting: true, target: el }); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (once && !entry.isIntersecting) return;
      cb(entry);
      if (once) io.unobserve(entry.target);
    });
  }, { threshold, rootMargin });
  io.observe(el);
  return io;
}

/* Carrega um script externo uma única vez */
const loaded = new Map();
export function loadScript(src){
  if (!loaded.has(src)){
    loaded.set(src, new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src; s.async = true;
      s.onload = resolve; s.onerror = () => reject(new Error(`Falha ao carregar ${src}`));
      document.head.appendChild(s);
    }));
  }
  return loaded.get(src);
}
