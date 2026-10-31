"use client";
/* Fundo do hero em WebGL2: ondas vítreas nas laterais, em movimento contínuo.
   - nítido (até 2x de densidade) e reduz a resolução sozinho se o FPS cair
   - pausa fora da tela e com a aba oculta
   - com "reduzir movimento": um quadro parado
   - sem WebGL: fica o gradiente CSS (.hero__fallback) por baixo */
import { useEffect, useRef } from "react";
import { LOADER_DONE } from "@/lib/loader-state";
import { FRAG, VERT } from "./ribbons.glsl";

function compile(gl: WebGL2RenderingContext, type: number, src: string){
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) ?? "shader");
  return sh;
}

export function LiquidRibbons(){
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const gl = cv.getContext("webgl2", { antialias: false, alpha: false, depth: false, powerPreference: "high-performance" });
    if (!gl){ cv.style.display = "none"; return; }

    let prog: WebGLProgram;
    try {
      prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? "link");
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
    let scale = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0, visible = true, lost = false;
    const t0 = performance.now();
    let introStart = -1;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let winStart = t0, winFrames = 0;

    const resize = () => {
      const w = Math.max(1, Math.round(cv.clientWidth * scale));
      const h = Math.max(1, Math.round(cv.clientHeight * scale));
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
      scale = Math.min(window.devicePixelRatio || 1, 1.5);   // um único quadro nítido para a imagem
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
      if (!visible || lost || document.hidden) return;
      // a cada ~1s mede o FPS: entre 5 e 40 reduz a resolução. Abaixo de 5 é o navegador
      // segurando a aba (segundo plano, economia de bateria) — isso não diz nada sobre a GPU
      winFrames++;
      if (now - winStart >= 1000){
        const fps = (winFrames * 1000) / (now - winStart);
        winStart = now; winFrames = 0;
        if (fps >= 5 && fps < 40 && scale > 0.45) scale = Math.max(0.4, scale * 0.6);
      }
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      const k = introStart < 0 ? 0 : Math.min((now - introStart) / 1800, 1);
      draw((now - t0) / 1000, 1 - Math.pow(1 - k, 3));
      raf = requestAnimationFrame(frame);
    };
    const play = () => { if (!raf && !reduce && !lost){ winStart = performance.now(); winFrames = 0; raf = requestAnimationFrame(frame); } };

    const ro = new ResizeObserver(() => { if (reduce) draw(6, 1); });
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

    /* custo real de um quadro na GPU (gl.finish espera a GPU terminar), medido ao abrir,
       com a tela ainda preta (intro = 0). Reduz a resolução até caber em ~20ms;
       se nem na mínima couber, congela num quadro estático. */
    const probe = () => {
      const costs = [0, 1, 2].map(i => { const a = performance.now(); draw(i * 0.1, 0); gl.finish(); return performance.now() - a; });
      return costs.sort((a, b) => a - b)[1];
    };
    if (!reduce){
      probe();                                    // aquecimento (compilação do shader no driver)
      while (probe() > 20 && scale > 0.45) scale = Math.max(0.4, scale * 0.6);
      if (probe() > 20){ freeze(); }
    }

    if (reduce) draw(6, 1); else play();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener(LOADER_DONE, beginIntro);
      cv.removeEventListener("webglcontextlost", onLost);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="hero__fallback absolute inset-0" />
      <canvas ref={ref} className="absolute inset-0 size-full" />
    </div>
  );
}
