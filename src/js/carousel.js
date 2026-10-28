/* CARROSSEL DE PROJETOS
   faixa contínua e lenta (rolagem por rAF) que pode ser arrastada com o mouse,
   deslizada no toque ou navegada pelos botões e pelas setas do teclado */
import { reduceMotion, onVisible } from "./utils.js";

const SPEED = 60;          // px por segundo (calmo, porém fluido)
const RESUME_MS = 2200;    // retoma após interação de toque/roda
const SWAP_MS = 3800;      // troca de imagem dentro de cada card

export function initCarousel(){
  const track = document.getElementById("carouselTrack");
  const carousel = document.getElementById("carousel");
  if (!track || !carousel) return;
  const btnToggle = document.getElementById("carToggle");
  const originals = Array.from(track.children);

  // laço sem começo nem fim: [cópias][originais][cópias].
  // As cópias saem do foco e da leitura, mas continuam clicáveis
  const makeClone = (li) => {
    const clone = li.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.querySelectorAll("a, button").forEach(el => el.setAttribute("tabindex", "-1"));
    clone.querySelectorAll("[id]").forEach(el => el.removeAttribute("id"));
    clone.querySelectorAll("[aria-labelledby]").forEach(el => el.removeAttribute("aria-labelledby"));
    return clone;
  };
  originals.forEach(li => track.insertBefore(makeClone(li), originals[0]));
  originals.forEach(li => track.appendChild(makeClone(li)));

  let pos = 0, userPaused = reduceMotion;
  let hovering = false, focusing = false, dragging = false, pressing = false, onScreen = false;
  let lastUser = 0, velocity = 0, lastFrame = 0, programmatic = 0;
  let glide = null;          // deslize de um card (botões/teclado), animado pelo próprio laço

  // largura de um ciclo completo; a posição vive sempre em [w, 2w)
  const loopWidth = () => {
    const after = track.children[originals.length * 2];
    return after ? after.offsetLeft - originals[0].offsetLeft : 0;
  };
  const wrap = (x) => {
    const w = loopWidth();
    if (!w) return x;
    while (x >= 2 * w) x -= w;
    while (x < w) x += w;
    return x;
  };
  const setPos = (x) => { pos = wrap(x); track.scrollLeft = pos; };
  const touched = () => { lastUser = performance.now(); };

  // mantém `pos` em sincronia quando o usuário rola (toque, roda, teclado)
  track.addEventListener("scroll", () => {
    if (performance.now() < programmatic) return;
    pos = track.scrollLeft;
    const w = loopWidth();
    if (w && (pos >= 2 * w || pos < w)) setPos(pos);
  }, { passive: true });
  ["touchstart", "touchmove", "touchend", "wheel"].forEach(ev => track.addEventListener(ev, touched, { passive: true }));

  /* ---- arrastar com o mouse ---- */
  let startX = 0, lastX = 0, lastT = 0, suppressClick = false;
  track.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    pressing = true; dragging = false; velocity = 0; glide = null;
    startX = lastX = e.clientX; lastT = e.timeStamp;
  });
  track.addEventListener("pointermove", (e) => {
    if (!pressing) return;
    if (!dragging){
      if (Math.abs(e.clientX - startX) < 6) return;
      dragging = true;
      track.classList.add("is-dragging");
      try { track.setPointerCapture(e.pointerId); } catch { /* ignora */ }
    }
    const d = lastX - e.clientX;
    velocity = d / Math.max(e.timeStamp - lastT, 1) * 1000;   // px/s
    lastX = e.clientX; lastT = e.timeStamp;
    programmatic = performance.now() + 50;
    setPos(pos + d);
  });
  function endDrag(e){
    if (!pressing) return;
    pressing = false;
    if (!dragging) return;
    dragging = false;
    suppressClick = true;
    setTimeout(() => { suppressClick = false; }, 0);
    try { track.releasePointerCapture(e.pointerId); } catch { /* ignora */ }
    track.classList.remove("is-dragging");
    if (performance.now() - lastT > 90) velocity = 0;
  }
  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", endDrag);
  track.addEventListener("click", (e) => { if (suppressClick){ e.preventDefault(); e.stopPropagation(); } }, true);
  track.addEventListener("dragstart", (e) => e.preventDefault());

  /* ---- avança um card (botões e teclado) ----
     a animação é feita pelo laço abaixo (por tempo), sem depender do
     scroll suave do navegador, que é interrompido por outras rolagens */
  function step(dir){
    const card = originals[0].offsetWidth + parseFloat(getComputedStyle(track).columnGap || 0);
    touched();
    velocity = 0;
    const from = glide ? glide.to : pos;
    if (reduceMotion){ programmatic = performance.now() + 50; setPos(from + dir * card); return; }
    glide = { from: pos, to: from + dir * card, t0: performance.now(), dur: 650 };
  }
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight"){ e.preventDefault(); step(1); }
    else if (e.key === "ArrowLeft"){ e.preventDefault(); step(-1); }
  });
  document.getElementById("carPrev")?.addEventListener("click", () => step(-1));
  document.getElementById("carNext")?.addEventListener("click", () => step(1));

  /* ---- pausa: o rótulo é fixo e o estado vai em aria-pressed (o ícone troca via CSS) ---- */
  btnToggle?.setAttribute("aria-pressed", String(userPaused));
  btnToggle?.addEventListener("click", () => {
    userPaused = !userPaused;
    btnToggle.setAttribute("aria-pressed", String(userPaused));
  });

  /* ---- laço de animação ---- */
  const canPlay = () => !userPaused && !hovering && !focusing && !dragging && onScreen && !document.hidden
    && performance.now() - lastUser > RESUME_MS;

  function frame(now){
    const dt = Math.min((now - (lastFrame || now)) / 1000, 0.25);
    lastFrame = now;
    if (glide && !dragging){
      const k = Math.min((now - glide.t0) / glide.dur, 1);
      const e = 1 - Math.pow(1 - k, 3);                // desacelera no fim
      programmatic = performance.now() + 50;
      setPos(glide.from + (glide.to - glide.from) * e);
      if (k === 1) glide = null;
      touched();
    } else if (!dragging && Math.abs(velocity) > 8){
      velocity *= Math.pow(0.0035, dt);              // inércia após soltar
      programmatic = performance.now() + 50;
      setPos(pos + velocity * dt);
    } else if (!dragging && canPlay()){
      velocity = 0;
      programmatic = performance.now() + 50;
      setPos(pos + SPEED * dt);
    }
    requestAnimationFrame(frame);
  }

  carousel.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") hovering = true; });
  carousel.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") hovering = false; });
  carousel.addEventListener("focusin", () => { focusing = true; });
  carousel.addEventListener("focusout", () => { focusing = false; });
  onVisible(carousel, (entry) => { onScreen = entry.isIntersecting; }, { once: false, threshold: 0.2 });

  /* ---- troca de imagens dentro de cada card ---- */
  const fades = Array.from(track.querySelectorAll(".project__media"))
    .map(m => ({ imgs: Array.from(m.querySelectorAll("img")), cur: 0 }))
    .filter(f => f.imgs.length > 1);
  if (fades.length && !reduceMotion){
    setInterval(() => {
      if (!onScreen || document.hidden) return;
      fades.forEach(f => {
        f.imgs[f.cur].classList.remove("is-on");
        f.cur = (f.cur + 1) % f.imgs.length;
        f.imgs[f.cur].classList.add("is-on");
      });
    }, SWAP_MS);
  }

  // começa no meio do laço, com margem de sobra dos dois lados
  const start = () => { programmatic = performance.now() + 50; setPos(loopWidth()); };
  start();
  window.addEventListener("load", start);
  new ResizeObserver(() => { const w = loopWidth(); if (w) setPos(pos < w ? w : pos); }).observe(track);

  if (!reduceMotion) requestAnimationFrame(frame);
}
