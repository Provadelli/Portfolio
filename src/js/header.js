/* Cabeçalho (fundo ao rolar), barra de progresso, Torre de Pisa que
   endireita conforme a rolagem e menu móvel */
import { onScroll } from "./utils.js";
import { t, getLang } from "./i18n.js";

const TILT = 3.97;

export function initHeader(){
  const header = document.getElementById("header");
  const fill = document.getElementById("progressFill");
  const tower = document.getElementById("pisaTower");
  const angle = document.getElementById("pisaAngle");
  if (!header) return;

  onScroll(() => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 40);
    if (fill){
      const max = document.documentElement.scrollHeight - window.innerHeight;
      fill.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    }
    if (tower){
      const a = TILT * (1 - Math.min(y / (window.innerHeight * 0.75), 1));
      tower.setAttribute("transform", `rotate(${a.toFixed(3)} 100 392)`);
      if (angle) angle.textContent = a.toFixed(2).replace(".", getLang() === "en" ? "." : ",") + "°";
    }
  });
}

export function initMenu(){
  const burger = document.getElementById("burger");
  const menu = document.getElementById("mobileMenu");
  if (!burger || !menu) return;

  const isOpen = () => menu.classList.contains("is-open");
  function setMenu(open){
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", String(!open));
    menu.toggleAttribute("inert", !open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? t("menu_close", "Fechar menu") : t("menu_open", "Abrir menu"));
    document.body.style.overflow = open ? "hidden" : "";
  }

  burger.addEventListener("click", () => setMenu(!isOpen()));
  menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));
  window.matchMedia("(min-width: 981px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()){ setMenu(false); burger.focus(); }
  });
  document.addEventListener("langchange", () => setMenu(isOpen()));
}
