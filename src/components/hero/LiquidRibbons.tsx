"use client";
/* Fundo do hero em WebGL2: ondas vítreas nas laterais, em movimento contínuo.
   - resolução baixa (macio, barato na GPU) e reduz ainda mais sozinho se o FPS cair
   - pausa fora da tela e com a aba oculta
   - com "reduzir movimento": um quadro parado
   - sem WebGL: fica o gradiente CSS (.hero__fallback) por baixo
   - começa depois do carregamento da página (load + requestIdleCallback): o teste de GPU e a
     compilação do shader não disputam CPU com a primeira pintura
   - sem GPU de verdade (renderização por software): nem tenta, fica o fallback
   - botão de pausa (WCAG 2.2.2: movimento automático com mais de 5s precisa poder parar)
   - o tamanho do canvas vem de um ResizeObserver (nada de ler clientWidth a cada quadro,
     o que forçava o navegador a recalcular o layout) */
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/I18nProvider";
import { hasFastGL } from "@/lib/gl";
import { LOADER_DONE } from "@/lib/loader-state";
import { FRAG, VERT } from "./ribbons.glsl";

/* compila sem consultar o status (consultar força o navegador a esperar o driver);
   erros aparecem no link */
function compile(gl: WebGL2RenderingContext, type: number, src: string){
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  return sh;
}

export function LiquidRibbons(){
  const { t } = useI18n();
  const ref = useRef<HTMLCanvasElement>(null);
  const ctl = useRef<{ pause(on: boolean): void } | null>(null);
  const [live, setLive] = useState(false);       // animação rodando de fato (mostra o botão de pausa)
  const [paused, setPaused] = useState(false);

  useEffect(() => { ctl.current?.pause(paused); }, [paused]);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    let dispose: (() => void) | undefined;
    let cancelled = false;
    const init = async () => {
      if (!hasFastGL()){ cv.style.display = "none"; return; }
      const gl = cv.getContext("webgl2", { antialias: false, alpha: false, depth: false, powerPreference: "high-performance" });
      if (!gl){ cv.style.display = "none"; return; }

      let prog: WebGLProgram;
      try {
        prog = gl.createProgram()!;
        const vs = compile(gl, gl.VERTEX_SHADER, VERT), fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);
        // compilação em segundo plano no driver: espera sem travar a página (nada de tarefa longa)
        const par = gl.getExtension("KHR_parallel_shader_compile");
        if (par) while (!gl.getProgramParameter(prog, par.COMPLETION_STATUS_KHR)){
          await new Promise(r => setTimeout(r, 32));
          if (cancelled) return;
        }
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
          throw new Error(gl.getShaderInfoLog(fs) || gl.getShaderInfoLog(vs) || gl.getProgramInfoLog(prog) || "link");
      } catch (err){
        console.warn("[hero] WebGL indisponível, usando o fundo estático", err);
        cv.style.display = "none";
        return;
      }
      gl.useProgram(prog);

      // um triângulo que cobre a tela inteira
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "aPos");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      const u = {
        res: gl.getUniformLocation(prog, "uRes"), time: gl.getUniformLocation(prog, "uTime"),
        mouse: gl.getUniformLocation(prog, "uMouse"), intro: gl.getUniformLocation(prog, "uIntro")
      };

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      /* resolução baixa de propósito: ampliado pelo navegador (bilinear), o desenho fica macio
         como um desfoque leve, sem o custo de um backdrop-filter em tela cheia */
      const SOFT = 0.35;
      let scale = SOFT;
      let raf = 0, visible = true, lost = false, halted = false;
      const t0 = performance.now();
      let introStart = -1;
      const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
      let winStart = t0, winFrames = 0;

      let cssW = cv.clientWidth, cssH = cv.clientHeight;          // atualizados pelo ResizeObserver
      const resize = () => {
        const w = Math.max(1, Math.round(cssW * scale));
        const h = Math.max(1, Math.round(cssH * scale));
        if (cv.width !== w || cv.height !== h){ cv.width = w; cv.height = h; gl.viewport(0, 0, w, h); }
      };

      const draw = (time: number, intro: number) => {
        resize();
        gl.uniform2f(u.res, cv.width, cv.height);
        gl.uniform1f(u.time, time);
        gl.uniform2f(u.mouse, mouse.x, mouse.y);
        gl.uniform1f(u.intro, intro);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      };

      const loaderDone = () => !document.documentElement.classList.contains("is-loading");
      const beginIntro = () => { if (introStart < 0) introStart = performance.now(); };
      if (loaderDone()) beginIntro();
      window.addEventListener(LOADER_DONE, beginIntro);

      /* aparelho sem fôlego para animar: congela num quadro final do próprio shader
         (vira imagem de fundo) e libera o WebGL, para não pesar no resto da página */
      const freeze = () => {
        lost = true;
        scale = SOFT;                                          // um único quadro para a imagem
        draw(6, 1);
        try {
          const fb = cv.previousElementSibling as HTMLElement | null;
          if (fb) fb.style.background = `url(${cv.toDataURL("image/jpeg", 0.85)}) center / cover`;
        } catch { /* sem captura: fica o gradiente CSS */ }
        cv.style.display = "none";
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };

      const frame = (now: number) => {
        raf = 0;
        if (!visible || lost || halted || document.hidden) return;
        // a cada ~1s mede o FPS: entre 5 e 40 reduz a resolução; se já está no mínimo e ainda
        // abaixo de 24, congela num quadro estático. Abaixo de 5 é o navegador segurando a aba
        // (segundo plano, economia de bateria) — isso não diz nada sobre a GPU
        winFrames++;
        if (now - winStart >= 1000){
          const fps = (winFrames * 1000) / (now - winStart);
          winStart = now; winFrames = 0;
          if (fps >= 5 && fps < 40 && scale > 0.2) scale = Math.max(0.18, scale * 0.6);
          else if (fps >= 5 && fps < 24){ freeze(); setLive(false); return; }
        }
        mouse.x += (mouse.tx - mouse.x) * 0.04;
        mouse.y += (mouse.ty - mouse.y) * 0.04;
        const k = introStart < 0 ? 0 : Math.min((now - introStart) / 1800, 1);
        draw((now - t0) / 1000, 1 - Math.pow(1 - k, 3));
        raf = requestAnimationFrame(frame);
      };
      const play = () => { if (!raf && !reduce && !lost && !halted){ winStart = performance.now(); winFrames = 0; raf = requestAnimationFrame(frame); } };

      const ro = new ResizeObserver(([e]) => {
        cssW = e.contentRect.width; cssH = e.contentRect.height;
        if (reduce) draw(6, 1);
      });
      ro.observe(cv);
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) play(); });
      io.observe(cv);
      const onVis = () => { if (!document.hidden) play(); };
      document.addEventListener("visibilitychange", onVis);
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        mouse.tx = e.clientX / window.innerWidth - 0.5;
        mouse.ty = 0.5 - e.clientY / window.innerHeight;
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      const onLost = (e: Event) => { e.preventDefault(); lost = true; cv.style.display = "none"; };
      cv.addEventListener("webglcontextlost", onLost);

      if (reduce) draw(6, 1); else play();
      if (!reduce && !lost){
        ctl.current = { pause: on => { halted = on; if (on){ cancelAnimationFrame(raf); raf = 0; } else play(); } };
        setLive(true);
      }

      dispose = () => {
        ctl.current = null;
        cancelAnimationFrame(raf);
        ro.disconnect(); io.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener(LOADER_DONE, beginIntro);
        cv.removeEventListener("webglcontextlost", onLost);
        // libera os recursos sem "matar" o contexto: no modo dev o React remonta o efeito
        // no mesmo canvas, e um contexto perdido faria o shader falhar na segunda montagem
        if (!lost){ gl.deleteBuffer(buf); gl.deleteProgram(prog); }
      };
    };

    // só depois do load da página, quando o navegador estiver livre
    const idle = typeof window.requestIdleCallback === "function";
    let id = 0;
    const run = () => { init().catch(err => { console.warn("[hero] falha no WebGL", err); cv.style.display = "none"; }); };
    const schedule = () => { id = idle ? window.requestIdleCallback(run, { timeout: 2000 }) : window.setTimeout(run, 300); };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
      if (idle) window.cancelIdleCallback(id); else window.clearTimeout(id);
      dispose?.();
    };
  }, []);

  return (
    <>
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="hero__fallback absolute inset-0" />
        <canvas ref={ref} className="absolute inset-0 size-full" />
      </div>
      {live && (
        <button type="button" className="anim-toggle" aria-pressed={paused} aria-label={paused ? t.anim_play : t.anim_pause} onClick={() => setPaused(v => !v)}>
          {paused
            ? <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" /></svg>
            : <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>}
        </button>
      )}
    </>
  );
}
