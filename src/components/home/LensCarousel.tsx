"use client";
/* CARROSSEL-LUPA DE PROJETOS
   Faixa contínua de imagens desenhada em WebGL (shader em lens.glsl.ts): plana no centro,
   comprimida e esticada nas bordas como através de uma lente — a imagem se curva enquanto
   atravessa o desnível. Laço infinito, rotação lenta, arrastar (mouse e toque) com inércia,
   setas, teclado ← →, pausa; hover e foco pausam. Clique num card abre o projeto.
   Sem WebGL, GPU fraca ou "reduzir movimento": lista de cards com rolagem horizontal. */
import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useI18n } from "@/components/I18nProvider";
import { EASE_BRAND } from "@/lib/motion";
import { LENS_FRAG, LENS_VERT } from "./lens.glsl";

export type Project = {
  id: string;
  title: string;
  host: string;
  url: string;
  desc: string;
  cta: string;
  imgs: { src: StaticImageData; alt: string }[];
};

const SPEED = 34;            // px/s na rotação automática
const RESUME_MS = 2600;      // retoma depois de uma interação
const FLAT = 0.56;           // parte plana (fração da meia-largura)
const BEND = 1.6;            // compressão nas bordas
const TEX_W = 720, TEX_H = 950;

/* suporte a WebGL2 (memorizado) */
let glSupport: boolean | null = null;
const hasGL = () => {
  if (glSupport === null){
    try { glSupport = !!document.createElement("canvas").getContext("webgl2"); } catch { glSupport = false; }
  }
  return glSupport;
};
const noop = () => () => {};

/* tamanho do card conforme a largura da tela */
const cardSize = (vw: number) => {
  const w = Math.round(Math.min(330, Math.max(210, vw < 621 ? vw * 0.62 : vw * 0.21)));
  return { w, h: Math.round(w * 1.32), gap: Math.round(w * 0.085) };
};

/* lente em JS (mesma fórmula do shader) para saber o que está sob o ponteiro */
function lens(d: number){
  const ad = Math.abs(d);
  if (ad <= FLAT) return { u: d, t: 0 };
  const t = (ad - FLAT) / (1 - FLAT);
  return { u: Math.sign(d) * (FLAT + (1 - FLAT) * (t + BEND * t * t)), t };
}

/* compõe a textura de um card: prints empilhados + nome e endereço */
async function paintCard(p: Project, fonts: { display: string; mono: string }){
  const cv = document.createElement("canvas");
  cv.width = TEX_W; cv.height = TEX_H;
  const ctx = cv.getContext("2d")!;
  ctx.fillStyle = "#141009"; ctx.fillRect(0, 0, TEX_W, TEX_H);
  const imgs = await Promise.all(p.imgs.map(i => new Promise<HTMLImageElement>((res, rej) => {
    const im = new window.Image(); im.decoding = "async"; im.src = i.src.src;
    im.onload = () => res(im); im.onerror = rej;
  })));
  const area = TEX_H - 190;
  const cover = (im: HTMLImageElement, y: number, h: number) => {
    const s = Math.max(TEX_W / im.width, h / im.height);
    const sw = TEX_W / s, sh = h / s;
    ctx.drawImage(im, 0, 0, sw, sh, 0, y, TEX_W, h);   // ancorado no topo-esquerda (a parte importante do print)
  };
  if (imgs.length > 1){
    const h = Math.round((area - 10) / 2);
    cover(imgs[0], 0, h);
    cover(imgs[1], h + 10, area - h - 10);
  } else cover(imgs[0], 0, area);
  const g = ctx.createLinearGradient(0, area - 60, 0, area);
  g.addColorStop(0, "rgba(20,16,9,0)"); g.addColorStop(1, "rgba(20,16,9,1)");
  ctx.fillStyle = g; ctx.fillRect(0, area - 60, TEX_W, 60);
  ctx.fillStyle = "#F6F1E6"; ctx.font = `600 50px ${fonts.display}`;
  ctx.fillText(p.title, 40, area + 80, TEX_W - 80);
  ctx.fillStyle = "#E0BE72"; ctx.font = `400 24px ${fonts.mono}`;
  ctx.fillText(p.host, 40, area + 130, TEX_W - 80);
  ctx.fillStyle = "#F2A93B"; ctx.fillRect(40, area + 158, 48, 3);
  return cv;
}

function compile(gl: WebGL2RenderingContext, type: number, src: string){
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src); gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) ?? "shader");
  return sh;
}

/* modo simples (fallback): cards DOM roláveis */
function FlatList({ projects }: { projects: Project[] }){
  const { t } = useI18n();
  return (
    <ul className="wrap flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4" aria-label={t.proj_list}>
      {projects.map(p => (
        <li key={p.id} className="w-[min(78vw,320px)] shrink-0 snap-center">
          <article className="pcard" aria-labelledby={p.id}>
            <div className="pcard__media"><Image src={p.imgs[0].src} alt={p.imgs[0].alt} sizes="320px" /></div>
            <div className="pcard__body">
              <h3 className="pcard__title" id={p.id}>{p.title}</h3>
              <span className="pcard__host">{p.host}</span>
              <p className="pcard__desc">{p.desc}</p>
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="pcard__cta">{p.cta} <span aria-hidden="true">↗</span><span className="sr-only"> {p.title}{t.newtab_p}</span></a>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}

export function LensCarousel({ projects }: { projects: Project[] }){
  const { t } = useI18n();
  const reduce = useReducedMotion() ?? false;
  const glOk = useSyncExternalStore(noop, hasGL, () => true);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [center, setCenter] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const api = useRef<{ step(dir: number): void } | null>(null);
  const pausedRef = useRef(false);
  const n = projects.length;
  const mode = !reduce && glOk && !failed ? "gl" : "dom";

  useEffect(() => { pausedRef.current = paused; }, [paused]);

  useEffect(() => {
    if (mode !== "gl") return;
    const st = stage.current, cv = canvas.current;
    if (!st || !cv) return;
    const gl = cv.getContext("webgl2", { antialias: false, premultipliedAlpha: true, alpha: true });
    if (!gl){ queueMicrotask(() => setFailed(true)); return; }

    let prog: WebGLProgram;
    try {
      prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, LENS_VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, LENS_FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? "link");
    } catch (err){
      console.warn("[projetos] WebGL indisponível, usando a lista simples", err);
      queueMicrotask(() => setFailed(true));
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (k: string) => gl.getUniformLocation(prog, k);
    const u = { view: U("uView"), px: U("uPx"), pos: U("uPos"), card: U("uCard"), gap: U("uGap"), count: U("uCount"), flat: U("uFlat"), bend: U("uBend"), tex: U("uTex") };

    let size = cardSize(window.innerWidth);
    let step = size.w + size.gap;
    let scale = Math.min(window.devicePixelRatio || 1, 2);
    let pos = size.w / 2, velocity = 0, lastUser = -Infinity, lastFrame = 0, raf = 0;
    let hovering = false, focusing = false, onScreen = false, dragging = false, pressing = false, ready = false, alive = true;
    let glide: { from: number; to: number; t0: number; dur: number } | null = null;
    let shownCenter = -1;
    const touched = () => { lastUser = performance.now(); };

    const resize = () => {
      size = cardSize(window.innerWidth);
      step = size.w + size.gap;
      st.style.height = `${Math.round(size.h * 1.34 + 24)}px`;
      const w = Math.max(1, Math.round(cv.clientWidth * scale)), h = Math.max(1, Math.round(cv.clientHeight * scale));
      if (cv.width !== w || cv.height !== h){ cv.width = w; cv.height = h; gl.viewport(0, 0, w, h); }
    };

    function draw(){
      if (!ready) return;
      resize();
      gl!.clearColor(0, 0, 0, 0); gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.uniform2f(u.view, cv!.clientWidth, cv!.clientHeight);
      gl!.uniform1f(u.px, cv!.width / Math.max(cv!.clientWidth, 1));
      gl!.uniform1f(u.pos, pos);
      gl!.uniform2f(u.card, size.w, size.h);
      gl!.uniform1f(u.gap, size.gap);
      gl!.uniform1f(u.count, n);
      gl!.uniform1f(u.flat, FLAT);
      gl!.uniform1f(u.bend, BEND);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      // projeto no centro (atualiza o bloco de texto só quando muda)
      const c = ((Math.round((pos - size.w / 2) / step) % n) + n) % n;
      if (c !== shownCenter){ shownCenter = c; setCenter(c); }
    }

    const snap = (p: number) => Math.round((p - size.w / 2) / step) * step + size.w / 2;
    function glideTo(to: number, dur = 750){ glide = { from: pos, to, t0: performance.now(), dur }; kick(); }
    function stepBy(dir: number){ touched(); velocity = 0; glideTo((glide ? glide.to : snap(pos)) + dir * step); }
    api.current = { step: stepBy };

    const canPlay = () => !pausedRef.current && !hovering && !focusing && !dragging && performance.now() - lastUser > RESUME_MS;

    function frame(now: number){
      raf = 0;
      const dt = Math.min((now - (lastFrame || now)) / 1000, 0.05);
      lastFrame = now;
      if (glide && !dragging){
        const k = Math.min((now - glide.t0) / glide.dur, 1);
        pos = glide.from + (glide.to - glide.from) * (1 - Math.pow(1 - k, 4));
        if (k === 1) glide = null;
      } else if (!dragging && Math.abs(velocity) > 6){
        pos += velocity * dt;
        velocity *= Math.pow(0.004, dt);                    // inércia
        if (Math.abs(velocity) <= 6){ velocity = 0; glideTo(snap(pos), 550); }
      } else if (canPlay()){
        pos += SPEED * dt;
      }
      draw();
      if (onScreen && !document.hidden) raf = requestAnimationFrame(frame);
    }
    function kick(){ if (!raf && onScreen){ lastFrame = 0; raf = requestAnimationFrame(frame); } }

    /* o que está sob o ponteiro: índice do projeto ou -1 */
    const hit = (clientX: number, clientY: number) => {
      const r = cv.getBoundingClientRect();
      const half = r.width / 2;
      const { u: uu, t: tt } = lens((clientX - r.left - half) / half);
      const sy = 1 + 0.3 * (tt * tt * (3 - 2 * tt));
      const yy = (r.top + r.height / 2 - clientY) / sy;
      if (Math.abs(yy) > size.h / 2 || Math.abs((clientX - r.left - half) / half) > 0.9) return -1;
      const s = pos + uu * half;
      const k = Math.floor(s / step);
      if (s - k * step > size.w) return -1;
      return ((k % n) + n) % n;
    };

    /* ---- arrastar (mouse e toque; a rolagem vertical da página continua livre) ---- */
    let sx = 0, sy0 = 0, lx = 0, lt = 0, moved = false;
    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      pressing = true; dragging = false; moved = false; glide = null; velocity = 0;
      sx = lx = e.clientX; sy0 = e.clientY; lt = e.timeStamp;
    };
    const move = (e: PointerEvent) => {
      if (!pressing){
        if (e.pointerType === "mouse") st.style.cursor = hit(e.clientX, e.clientY) >= 0 ? "pointer" : "grab";
        return;
      }
      if (!dragging){
        const dx = e.clientX - sx, dy = e.clientY - sy0;
        if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(dy)) return;
        dragging = true; moved = true;
        st.style.cursor = "grabbing";
        try { st.setPointerCapture(e.pointerId); } catch { /* ignora */ }
        kick();
      }
      const d = e.clientX - lx;
      velocity = -d / Math.max(e.timeStamp - lt, 1) * 1000;
      lx = e.clientX; lt = e.timeStamp;
      pos -= d; touched();
    };
    const up = (e: PointerEvent) => {
      if (!pressing) return;
      pressing = false;
      if (dragging){
        dragging = false;
        st.style.cursor = "grab";
        try { st.releasePointerCapture(e.pointerId); } catch { /* ignora */ }
        if (performance.now() - lt > 90 || Math.abs(velocity) < 60){ velocity = 0; glideTo(snap(pos), 550); }
        touched(); kick();
        return;
      }
      // toque/clique sem arrasto: abre o projeto sob o ponteiro
      if (!moved){
        const i = hit(e.clientX, e.clientY);
        if (i >= 0) window.open(projects[i].url, "_blank", "noopener,noreferrer");
      }
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight"){ e.preventDefault(); stepBy(1); }
      else if (e.key === "ArrowLeft"){ e.preventDefault(); stepBy(-1); }
    };
    const region = st.closest<HTMLElement>("[data-lens]") ?? st;
    const fin = () => { focusing = true; };
    const fout = () => { focusing = false; kick(); };
    const enter = (e: PointerEvent) => { if (e.pointerType === "mouse") hovering = true; };
    const leave = (e: PointerEvent) => { if (e.pointerType === "mouse"){ hovering = false; kick(); } };

    st.addEventListener("pointerdown", down);
    st.addEventListener("pointermove", move);
    st.addEventListener("pointerup", up);
    st.addEventListener("pointercancel", up);
    st.addEventListener("keydown", key);
    st.addEventListener("pointerenter", enter);
    st.addEventListener("pointerleave", leave);
    region.addEventListener("focusin", fin);
    region.addEventListener("focusout", fout);

    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; if (onScreen) kick(); }, { rootMargin: "200px 0px" });
    io.observe(st);
    const ro = new ResizeObserver(() => { if (ready) draw(); });
    ro.observe(st);
    const onVis = () => { if (!document.hidden) kick(); };
    document.addEventListener("visibilitychange", onVis);
    resize();

    /* texturas: carregadas quando a seção se aproxima da tela */
    const load = async () => {
      const css = getComputedStyle(document.documentElement);
      const fonts = { display: css.getPropertyValue("--font-grotesk").trim() || "sans-serif", mono: css.getPropertyValue("--font-jetbrains").trim() || "monospace" };
      try { await document.fonts.ready; } catch { /* segue */ }
      const layers = await Promise.all(projects.map(p => paintCard(p, fonts)));
      if (!alive) return;
      const tex = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D_ARRAY, tex);
      gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.RGBA8, TEX_W, TEX_H, layers.length, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      layers.forEach((c, i) => gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, i, TEX_W, TEX_H, 1, gl.RGBA, gl.UNSIGNED_BYTE, c));
      gl.generateMipmap(gl.TEXTURE_2D_ARRAY);
      gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.uniform1i(u.tex, 0);
      ready = true;

      // custo real de um quadro na GPU: reduz a resolução; se nem assim couber, volta para a lista simples
      const probe = () => { const a = performance.now(); draw(); gl.finish(); return performance.now() - a; };
      probe();
      while (probe() > 16 && scale > 0.6) scale = Math.max(0.55, scale * 0.7);
      if (probe() > 22){ setFailed(true); return; }
      cv.style.opacity = "1";
      kick();
    };
    const near = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      near.disconnect();
      load().catch(err => { console.warn("[projetos] falha ao montar as texturas", err); setFailed(true); });
    }, { rootMargin: "600px 0px" });
    near.observe(st);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      io.disconnect(); ro.disconnect(); near.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      st.removeEventListener("pointerdown", down);
      st.removeEventListener("pointermove", move);
      st.removeEventListener("pointerup", up);
      st.removeEventListener("pointercancel", up);
      st.removeEventListener("keydown", key);
      st.removeEventListener("pointerenter", enter);
      st.removeEventListener("pointerleave", leave);
      region.removeEventListener("focusin", fin);
      region.removeEventListener("focusout", fout);
      api.current = null;
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [mode, n, projects]);

  if (mode === "dom") return <FlatList projects={projects} />;

  const p = projects[center];
  return (
    <div data-lens="" role="region" aria-roledescription={t.carousel_word} aria-label={t.proj_region}>
      <div ref={stage} className="relative w-full cursor-grab touch-pan-y select-none outline-offset-[-4px]" style={{ height: "calc(min(330px, max(210px, 21vw)) * 1.32 * 1.34 + 24px)" }} tabIndex={0} role="group" aria-label={t.car_hint}>
        <canvas ref={canvas} className="absolute inset-0 size-full opacity-0 transition-opacity duration-700" aria-hidden="true" />
      </div>

      {/* leitores de tela: todos os projetos, com link */}
      <ul className="sr-only" aria-label={t.proj_list}>
        {projects.map(pr => (
          <li key={pr.id}><a href={pr.url} target="_blank" rel="noopener noreferrer" tabIndex={-1}>{pr.title} — {pr.desc}{t.newtab_p}</a></li>
        ))}
      </ul>

      <div className="wrap mt-6 grid items-center gap-6 sm:grid-cols-[auto_1fr_auto]">
        <button type="button" className="icon-btn max-sm:hidden" aria-label={t.car_prev} onClick={() => api.current?.step(-1)}>
          <svg className="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
        </button>

        <div className="relative min-h-36 text-center" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: EASE_BRAND }}>
              <p className="m-0 font-mono text-[11px] tracking-[.2em] text-gold-deep uppercase">{String(center + 1).padStart(2, "0")} / {String(n).padStart(2, "0")} · {p.host}</p>
              <h3 className="mt-2 mb-2 font-display text-[clamp(24px,2.6vw,34px)] font-semibold tracking-[-.03em]">{p.title}</h3>
              <p className="mx-auto mt-0 mb-4 max-w-xl text-[15px] leading-[1.6] text-ink-soft">{p.desc}</p>
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm">{p.cta}<span className="btn__arrow" aria-hidden="true">↗</span><span className="sr-only"> {p.title}{t.newtab_p}</span></a>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-2 sm:justify-end">
          <button type="button" className="icon-btn sm:hidden" aria-label={t.car_prev} onClick={() => api.current?.step(-1)}>
            <svg className="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
          </button>
          <button type="button" className="icon-btn size-10!" aria-label={t.car_pause} aria-pressed={paused} onClick={() => setPaused(v => !v)}>
            {paused
              ? <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" /></svg>
              : <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>}
          </button>
          <button type="button" className="icon-btn" aria-label={t.car_next} onClick={() => api.current?.step(1)}>
            <svg className="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
