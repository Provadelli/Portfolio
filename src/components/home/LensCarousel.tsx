"use client";
/* CARROSSEL-LUPA DE PROJETOS
   Os cards do meio ficam planos; nas bordas eles se curvam para trás e se alongam,
   como vistos através de uma lente (_/‾\_). Duas "lentes" de vidro com aro luminoso
   ficam fixas nas laterais. Laço infinito, rotação lenta, arrastar (mouse e toque)
   com inércia, setas, teclado ← →, pausa; hover e foco pausam a rotação. */
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
  img: { src: StaticImageData; alt: string };
};

const SPEED = 38;          // px por segundo na rotação automática
const RESUME_MS = 2600;    // retoma depois de uma interação
const smooth = (a: number, b: number, x: number) => { const t = Math.min(Math.max((x - a) / (b - a), 0), 1); return t * t * (3 - 2 * t); };

function Card({ p, clone }: { p: Project; clone: boolean }){
  const { t } = useI18n();
  return (
    <article className="pcard" aria-labelledby={clone ? undefined : p.id}>
      <div className="pcard__media">
        <Image src={p.img.src} alt={clone ? "" : p.img.alt} sizes="340px" draggable={false} />
      </div>
      <div className="pcard__body">
        <h3 className="pcard__title" id={clone ? undefined : p.id}>{p.title}</h3>
        <span className="pcard__host">{p.host}</span>
        <p className="pcard__desc">{p.desc}</p>
        <a href={p.url} target="_blank" rel="noopener noreferrer" className="pcard__cta" tabIndex={clone ? -1 : undefined} draggable={false}>
          {p.cta} <span aria-hidden="true">↗</span><span className="sr-only"> {p.title}{t.newtab_p}</span>
        </a>
      </div>
    </article>
  );
}

export function LensCarousel({ projects }: { projects: Project[] }){
  const { t } = useI18n();
  const reduce = useReducedMotion() ?? false;
  const region = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const api = useRef<{ step(dir: number): void } | null>(null);
  const pausedRef = useRef(false);
  const [paused, setPaused] = useState(false);
  const n = projects.length;
  const items = [...projects, ...projects];   // 2ª volta = cópias (fora do foco e da leitura)

  useEffect(() => { pausedRef.current = paused || reduce; }, [paused, reduce]);

  useEffect(() => {
    const st = stage.current, reg = region.current;
    if (!st || !reg) return;
    const cards = Array.from(st.querySelectorAll<HTMLElement>(".lens__card"));
    const flat = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 300, step = 330, L = step * cards.length;
    const measure = () => {
      W = cards[0].offsetWidth;
      step = W + (window.innerWidth < 621 ? 16 : 28);
      L = step * cards.length;
    };

    let pos = 0, velocity = 0, lastUser = -Infinity, lastFrame = 0, raf = 0;
    let hovering = false, focusing = false, onScreen = false, dragging = false, pressing = false;
    let glide: { from: number; to: number; t0: number; dur: number } | null = null;
    const touched = () => { lastUser = performance.now(); };

    function layout(){
      const half = st!.clientWidth / 2;
      const curve = !flat();
      let nearest = 0, best = Infinity;
      cards.forEach((el, i) => {
        let x = i * step - pos;
        x = ((x % L) + L) % L;
        if (x > L / 2) x -= L;
        const d = x / half, a = Math.abs(d), sgn = Math.sign(d);
        const k = curve ? smooth(0.24, 0.98, Math.min(a, 1.25)) : 0;
        const tx = x - sgn * k * W * 0.42;
        const op = a > 1.2 ? Math.max(0, 1 - (a - 1.2) / 0.25) : 1;
        el.style.transform = `translate(-50%,-50%) translate3d(${tx.toFixed(1)}px,0,${(-k * 190).toFixed(1)}px) rotateY(${(sgn * k * 68).toFixed(2)}deg) scaleY(${(1 + k * 0.3).toFixed(3)})`;
        el.style.opacity = op.toFixed(3);
        el.style.zIndex = String(200 - Math.round(a * 100));
        if (a < best){ best = a; nearest = i % n; }
      });
      if (counter.current) counter.current.textContent = `${String(nearest + 1).padStart(2, "0")} / ${String(n).padStart(2, "0")}`;
    }

    const snapTarget = (from: number) => Math.round(from / step) * step;
    function glideTo(to: number, dur = 700){
      if (flat()){ pos = to; glide = null; layout(); return; }
      glide = { from: pos, to, t0: performance.now(), dur };
      kick();
    }
    function stepBy(dir: number){
      touched(); velocity = 0;
      const base = glide ? glide.to : snapTarget(pos);
      glideTo(base + dir * step);
    }
    api.current = { step: stepBy };

    const canPlay = () => !pausedRef.current && !hovering && !focusing && !dragging && !flat()
      && performance.now() - lastUser > RESUME_MS;

    function frame(now: number){
      raf = 0;
      const dt = Math.min((now - (lastFrame || now)) / 1000, 0.05);
      lastFrame = now;
      let moving = false;
      if (glide && !dragging){
        const k = Math.min((now - glide.t0) / glide.dur, 1);
        pos = glide.from + (glide.to - glide.from) * (1 - Math.pow(1 - k, 4));
        if (k === 1) glide = null;
        moving = true;
      } else if (!dragging && Math.abs(velocity) > 6){
        pos += velocity * dt;
        velocity *= Math.pow(0.004, dt);                 // inércia
        if (Math.abs(velocity) <= 6){ velocity = 0; glideTo(snapTarget(pos), 500); }
        moving = true;
      } else if (canPlay()){
        pos += SPEED * dt;
        moving = true;
      }
      if (moving || dragging) layout();
      if (onScreen && !document.hidden) raf = requestAnimationFrame(frame);
    }
    function kick(){ if (!raf){ lastFrame = 0; raf = requestAnimationFrame(frame); } }

    /* ---- arrastar (mouse e toque; a rolagem vertical da página continua livre) ---- */
    let sx = 0, sy = 0, lx = 0, lt = 0, suppress = false;
    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      pressing = true; dragging = false; glide = null; velocity = 0;
      sx = lx = e.clientX; sy = e.clientY; lt = e.timeStamp;
    };
    const move = (e: PointerEvent) => {
      if (!pressing) return;
      if (!dragging){
        const dx = e.clientX - sx, dy = e.clientY - sy;
        if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(dy)) return;
        dragging = true;
        st.classList.add("cursor-grabbing");
        try { st.setPointerCapture(e.pointerId); } catch { /* ignora */ }
        kick();
      }
      const d = e.clientX - lx;
      velocity = -d / Math.max(e.timeStamp - lt, 1) * 1000;
      lx = e.clientX; lt = e.timeStamp;
      pos -= d; touched(); layout();
    };
    const up = (e: PointerEvent) => {
      if (!pressing) return;
      pressing = false;
      if (!dragging) return;
      dragging = false; suppress = true;
      setTimeout(() => { suppress = false; }, 0);
      st.classList.remove("cursor-grabbing");
      try { st.releasePointerCapture(e.pointerId); } catch { /* ignora */ }
      if (performance.now() - lt > 90 || Math.abs(velocity) < 60){ velocity = 0; glideTo(snapTarget(pos), 500); }
      touched(); kick();
    };
    const click = (e: MouseEvent) => { if (suppress){ e.preventDefault(); e.stopPropagation(); } };
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight"){ e.preventDefault(); stepBy(1); }
      else if (e.key === "ArrowLeft"){ e.preventDefault(); stepBy(-1); }
    };
    // foco de teclado num card: traz o card para o centro
    const focusIn = (e: FocusEvent) => {
      focusing = true;
      const card = (e.target as HTMLElement).closest<HTMLElement>(".lens__card");
      if (!card || e.target === st) return;
      const i = cards.indexOf(card);
      let x = i * step - pos; x = ((x % L) + L) % L; if (x > L / 2) x -= L;
      touched(); glideTo(pos + x);
    };
    const focusOut = () => { focusing = false; kick(); };
    const enter = (e: PointerEvent) => { if (e.pointerType === "mouse") hovering = true; };
    const leave = (e: PointerEvent) => { if (e.pointerType === "mouse"){ hovering = false; kick(); } };

    st.addEventListener("pointerdown", down);
    st.addEventListener("pointermove", move);
    st.addEventListener("pointerup", up);
    st.addEventListener("pointercancel", up);
    st.addEventListener("click", click, true);
    st.addEventListener("keydown", key);
    reg.addEventListener("focusin", focusIn);
    reg.addEventListener("focusout", focusOut);
    reg.addEventListener("pointerenter", enter);
    reg.addEventListener("pointerleave", leave);

    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; if (onScreen) kick(); }, { threshold: 0.05 });
    io.observe(st);
    const ro = new ResizeObserver(() => { measure(); layout(); });
    ro.observe(st);
    const onVis = () => { if (!document.hidden) kick(); };
    document.addEventListener("visibilitychange", onVis);

    measure(); layout();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect(); ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      st.removeEventListener("pointerdown", down);
      st.removeEventListener("pointermove", move);
      st.removeEventListener("pointerup", up);
      st.removeEventListener("pointercancel", up);
      st.removeEventListener("click", click, true);
      st.removeEventListener("keydown", key);
      reg.removeEventListener("focusin", focusIn);
      reg.removeEventListener("focusout", focusOut);
      reg.removeEventListener("pointerenter", enter);
      reg.removeEventListener("pointerleave", leave);
      api.current = null;
    };
  }, [n]);

  return (
    <div className="lens" ref={region} role="region" aria-roledescription={t.carousel_word} aria-label={t.proj_region}>
      <div
        ref={stage}
        className="lens__stage cursor-grab"
        style={{ "--cw": "min(72vw, 330px)", height: "calc(min(72vw, 330px) * 1.3 * 1.36)" } as React.CSSProperties}
        tabIndex={0}
        aria-label={t.proj_list}
        role="list"
      >
        {items.map((p, i) => {
          const clone = i >= n;
          // posição aproximada antes da hidratação (evita os cards empilhados no 1º quadro)
          let x = i * 358;
          if (x > (items.length * 358) / 2) x -= items.length * 358;
          return (
            <div key={`${i}-${p.id}`} role="listitem" className="lens__card w-(--cw) h-[calc(var(--cw)*1.3)]" aria-hidden={clone || undefined}
              style={{ transform: `translate(-50%,-50%) translateX(${x}px)` }}>
              <Card p={p} clone={clone} />
            </div>
          );
        })}
        <span className="lens__glass lens__glass--l" aria-hidden="true" />
        <span className="lens__glass lens__glass--r" aria-hidden="true" />
        <span className="lens__rim lens__rim--l" aria-hidden="true" />
        <span className="lens__rim lens__rim--r" aria-hidden="true" />
      </div>

      <div className="wrap mt-6 flex flex-wrap items-center justify-between gap-4">
        <button type="button" className="icon-btn" aria-label={t.car_prev} onClick={() => api.current?.step(-1)}>
          <svg className="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
        </button>
        <div className="flex flex-1 flex-col items-center gap-2 text-center max-sm:order-last max-sm:basis-full">
          <span ref={counter} className="font-mono text-xs tracking-[.2em] text-gold-deep" aria-hidden="true">01 / {String(n).padStart(2, "0")}</span>
          <p className="m-0 flex items-center gap-3 text-xs text-ink-faint">
            {t.car_hint}
            <button type="button" className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-gold" aria-label={t.car_pause} aria-pressed={paused || reduce} onClick={() => setPaused(v => !(v || reduce))}>
              {paused || reduce
                ? <svg className="size-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" /></svg>
                : <svg className="size-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>}
            </button>
          </p>
        </div>
        <button type="button" className="icon-btn" aria-label={t.car_next} onClick={() => api.current?.step(1)}>
          <svg className="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </button>
      </div>
    </div>
  );
}
