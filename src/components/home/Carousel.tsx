"use client";
/* CARROSSEL DE PROJETOS
   Faixa contínua e lenta que pode ser arrastada com o mouse, deslizada no toque ou
   navegada pelos botões e pelas setas do teclado. Laço sem começo nem fim:
   [cópias][originais][cópias] — as cópias ficam fora do foco e da leitura de tela. */
import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useI18n } from "@/components/I18nProvider";

export type Project = {
  id: string;
  title: string;
  host: string;
  url: string;
  desc: string;
  cta: string;
  imgs: { src: StaticImageData; alt: string }[];
};

const SPEED = 60;          // px por segundo (calmo, porém fluido)
const RESUME_MS = 2200;    // retoma após interação de toque/roda
const SWAP_MS = 3800;      // troca de imagem dentro de cada card

function Card({ p, tick, clone }: { p: Project; tick: number; clone: boolean }){
  const { t } = useI18n();
  const on = tick % p.imgs.length;
  return (
    <li className="flex flex-[0_0_min(88vw,680px)]" aria-hidden={clone || undefined}>
      <article className="project" aria-labelledby={clone ? undefined : p.id}>
        <div className="project__media">
          {p.imgs.map((img, i) => (
            <Image key={i} src={img.src} alt={img.alt} className={i === on ? "is-on" : undefined} sizes="(min-width: 621px) 680px, 88vw" draggable={false} />
          ))}
        </div>
        <div className="project__body">
          <div className="project__head"><h3 className="project__title" id={clone ? undefined : p.id}>{p.title}</h3><span className="project__host">{p.host}</span></div>
          <p className="project__desc">{p.desc}</p>
          <a href={p.url} target="_blank" rel="noopener noreferrer" className="project__cta" tabIndex={clone ? -1 : undefined}>
            <span>{p.cta}</span> <span aria-hidden="true">↗</span><span className="sr-only"> {p.title}{t.newtab_p}</span>
          </a>
        </div>
      </article>
    </li>
  );
}

export function Carousel({ projects }: { projects: Project[] }){
  const { t } = useI18n();
  const reduce = useReducedMotion() ?? false;
  const region = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0);
  const pausedRef = useRef(false);
  const api = useRef<{ step(dir: number): void } | null>(null);

  useEffect(() => { pausedRef.current = paused || reduce; }, [paused, reduce]);

  useEffect(() => {
    const tr = track.current, car = region.current;
    if (!tr || !car) return;
    const n = projects.length;
    const first = () => tr.children[n] as HTMLElement;   // primeiro original

    let pos = 0, hovering = false, focusing = false, dragging = false, pressing = false, onScreen = false;
    let lastUser = 0, velocity = 0, lastFrame = 0, programmatic = 0, raf = 0;
    let glide: { from: number; to: number; t0: number; dur: number } | null = null;

    // largura de um ciclo completo; a posição vive sempre em [w, 2w)
    const loopWidth = () => {
      const after = tr.children[n * 2] as HTMLElement | undefined;
      return after ? after.offsetLeft - first().offsetLeft : 0;
    };
    const wrap = (x: number) => {
      const w = loopWidth();
      if (!w) return x;
      while (x >= 2 * w) x -= w;
      while (x < w) x += w;
      return x;
    };
    const setPos = (x: number) => { pos = wrap(x); tr.scrollLeft = pos; };
    const touched = () => { lastUser = performance.now(); };

    // mantém `pos` em sincronia quando o usuário rola (toque, roda, teclado)
    const onScroll = () => {
      if (performance.now() < programmatic) return;
      pos = tr.scrollLeft;
      const w = loopWidth();
      if (w && (pos >= 2 * w || pos < w)) setPos(pos);
    };

    /* ---- arrastar com o mouse ---- */
    let startX = 0, lastX = 0, lastT = 0, suppressClick = false;
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      pressing = true; dragging = false; velocity = 0; glide = null;
      startX = lastX = e.clientX; lastT = e.timeStamp;
    };
    const move = (e: PointerEvent) => {
      if (!pressing) return;
      if (!dragging){
        if (Math.abs(e.clientX - startX) < 6) return;
        dragging = true;
        tr.classList.add("is-dragging");
        try { tr.setPointerCapture(e.pointerId); } catch { /* ignora */ }
      }
      const d = lastX - e.clientX;
      velocity = d / Math.max(e.timeStamp - lastT, 1) * 1000;   // px/s
      lastX = e.clientX; lastT = e.timeStamp;
      programmatic = performance.now() + 50;
      setPos(pos + d);
    };
    const up = (e: PointerEvent) => {
      if (!pressing) return;
      pressing = false;
      if (!dragging) return;
      dragging = false;
      suppressClick = true;
      setTimeout(() => { suppressClick = false; }, 0);
      try { tr.releasePointerCapture(e.pointerId); } catch { /* ignora */ }
      tr.classList.remove("is-dragging");
      if (performance.now() - lastT > 90) velocity = 0;
    };
    const click = (e: MouseEvent) => { if (suppressClick){ e.preventDefault(); e.stopPropagation(); } };
    const noDrag = (e: DragEvent) => e.preventDefault();

    /* ---- avança um card (botões e teclado), animado pelo próprio laço ---- */
    function step(dir: number){
      const card = first().offsetWidth + parseFloat(getComputedStyle(tr!).columnGap || "0");
      touched();
      velocity = 0;
      const from = glide ? glide.to : pos;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches){ programmatic = performance.now() + 50; setPos(from + dir * card); return; }
      glide = { from: pos, to: from + dir * card, t0: performance.now(), dur: 650 };
      if (!raf) raf = requestAnimationFrame(frame);
    }
    api.current = { step };
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight"){ e.preventDefault(); step(1); }
      else if (e.key === "ArrowLeft"){ e.preventDefault(); step(-1); }
    };

    /* ---- laço de animação ---- */
    const canPlay = () => !pausedRef.current && !hovering && !focusing && !dragging && onScreen && !document.hidden
      && performance.now() - lastUser > RESUME_MS;

    function frame(now: number){
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
      raf = requestAnimationFrame(frame);
    }

    const enter = (e: PointerEvent) => { if (e.pointerType === "mouse") hovering = true; };
    const leave = (e: PointerEvent) => { if (e.pointerType === "mouse") hovering = false; };
    const fin = () => { focusing = true; };
    const fout = () => { focusing = false; };
    const io = new IntersectionObserver(([en]) => { onScreen = en.isIntersecting; }, { threshold: 0.2 });
    io.observe(car);

    const touchOpts = { passive: true } as const;
    tr.addEventListener("scroll", onScroll, touchOpts);
    (["touchstart", "touchmove", "touchend", "wheel"] as const).forEach(ev => tr.addEventListener(ev, touched, touchOpts));
    tr.addEventListener("pointerdown", down);
    tr.addEventListener("pointermove", move);
    tr.addEventListener("pointerup", up);
    tr.addEventListener("pointercancel", up);
    tr.addEventListener("click", click, true);
    tr.addEventListener("dragstart", noDrag);
    tr.addEventListener("keydown", key);
    car.addEventListener("pointerenter", enter);
    car.addEventListener("pointerleave", leave);
    car.addEventListener("focusin", fin);
    car.addEventListener("focusout", fout);

    // começa no meio do laço, com margem de sobra dos dois lados
    const start = () => { programmatic = performance.now() + 50; setPos(loopWidth()); };
    start();
    window.addEventListener("load", start);
    const ro = new ResizeObserver(() => { const w = loopWidth(); if (w) setPos(pos < w ? w : pos); });
    ro.observe(tr);

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) raf = requestAnimationFrame(frame);

    /* ---- troca de imagens dentro de cada card ---- */
    const swap = window.setInterval(() => {
      if (onScreen && !document.hidden && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) setTick(x => x + 1);
    }, SWAP_MS);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(swap);
      io.disconnect(); ro.disconnect();
      window.removeEventListener("load", start);
      tr.removeEventListener("scroll", onScroll);
      (["touchstart", "touchmove", "touchend", "wheel"] as const).forEach(ev => tr.removeEventListener(ev, touched));
      tr.removeEventListener("pointerdown", down);
      tr.removeEventListener("pointermove", move);
      tr.removeEventListener("pointerup", up);
      tr.removeEventListener("pointercancel", up);
      tr.removeEventListener("click", click, true);
      tr.removeEventListener("dragstart", noDrag);
      tr.removeEventListener("keydown", key);
      car.removeEventListener("pointerenter", enter);
      car.removeEventListener("pointerleave", leave);
      car.removeEventListener("focusin", fin);
      car.removeEventListener("focusout", fout);
      api.current = null;
    };
  }, [projects.length]);

  const sets = [true, false, true];   // [cópias][originais][cópias]

  return (
    <div className="carousel relative" ref={region} role="region" aria-roledescription={t.carousel_word} aria-label={t.proj_region}>
      <ul className="carousel__track" ref={track} tabIndex={0} aria-label={t.proj_list}>
        {sets.map((clone, s) => projects.map(p => <Card key={`${s}-${p.id}`} p={p} tick={tick} clone={clone} />))}
      </ul>

      <div className="wrap flex flex-wrap items-center gap-2.5">
        <button type="button" className="icon-btn" aria-label={t.car_prev} onClick={() => api.current?.step(-1)}>
          <svg className="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        {/* rótulo fixo; o estado vai em aria-pressed (o ícone troca via CSS) */}
        <button type="button" className="icon-btn group" aria-label={t.car_pause} aria-pressed={paused || reduce} onClick={() => setPaused(v => !(v || reduce))}>
          <svg className="size-4.5 group-aria-pressed:hidden" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
          <svg className="hidden size-4.5 group-aria-pressed:block" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" /></svg>
        </button>
        <button type="button" className="icon-btn" aria-label={t.car_next} onClick={() => api.current?.step(1)}>
          <svg className="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M9 18l6-6-6-6" /></svg>
        </button>
        <p className="m-0 text-xs tracking-[.04em] text-ink-faint max-sm:basis-full sm:ml-2.5">{t.car_hint}</p>
      </div>
    </div>
  );
}
