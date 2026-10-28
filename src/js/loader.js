/* TELA DE CARREGAMENTO
   aparece só na primeira visita da sessão (sessionStorage);
   o progresso (carregamento real, mín. 1.2s, máx. 5s) preenche o P
   de baixo para cima; em 100% ele brilha e dá zoom, abrindo o site */
import { reduceMotion } from "./utils.js";
import { t } from "./i18n.js";

const STEPS = [[0, "ld_init", "inicializando portfólio"], [30, "ld_assets", "carregando assets"], [65, "ld_build", "compilando interface"], [100, "ld_ready", "pronto"]];
const MIN = reduceMotion ? 300 : 1200, MAX = 5000;

export function initLoader(){
  const root = document.documentElement;
  const el = document.getElementById("loader");
  const srStatus = document.getElementById("loaderStatus");
  if (!el || root.classList.contains("no-loader")){
    el?.remove(); srStatus?.remove();
    root.classList.remove("is-loading");
    return;
  }

  // enquanto carrega, o conteúdo por trás não recebe foco do teclado
  const behind = document.querySelectorAll("body > header, body > main, body > footer, .skip-link");
  behind.forEach(n => n.setAttribute("inert", ""));
  srStatus.textContent = t("ld_sr", "Carregando portfólio");

  const pctEl = document.getElementById("loaderPct");
  const msg = document.getElementById("loaderMsg");
  const t0 = performance.now();
  let loaded = document.readyState === "complete", shown = 0, finished = false, last = t0;
  window.addEventListener("load", () => { loaded = true; });

  function render(v){
    const n = Math.round(v);
    pctEl.textContent = String(n).padStart(2, "0") + "%";
    el.style.setProperty("--p", v.toFixed(2));
    const step = STEPS.filter(s => n >= s[0]).pop();
    msg.textContent = t(step[1], step[2]);
  }

  function finish(){
    if (finished) return;
    finished = true;
    try { sessionStorage.setItem("loaderSeen", "1"); } catch { /* sem armazenamento */ }
    render(100);
    el.classList.add("is-full");
    setTimeout(() => {
      el.classList.add("is-done");
      // o hero entra enquanto o P atravessa a tela
      setTimeout(() => {
        root.classList.remove("is-loading");
        behind.forEach(n => n.removeAttribute("inert"));
        srStatus.remove();
      }, reduceMotion ? 0 : 450);
      setTimeout(() => el.remove(), 1600);
    }, reduceMotion ? 0 : 420);
  }

  function frame(now){
    if (finished) return;
    const elapsed = now - t0;
    // suavização por tempo (não por quadro): mesma duração a 30, 60 ou 120 fps
    const steps = Math.min((now - last) / 16.67, 30); last = now;
    const target = loaded && elapsed >= MIN ? 100 : Math.min(88, (elapsed / MIN) * 88);
    shown += (target - shown) * (1 - Math.pow(1 - (loaded ? 0.12 : 0.08), steps));
    if ((target === 100 && shown > 99.4) || elapsed > MAX) return finish();
    render(shown);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  setTimeout(finish, MAX + 800);   // segurança: o rAF pausa em abas em segundo plano
}
