"use client";
/* TELA DE CARREGAMENTO
   Aparece só na primeira visita da sessão: um script inline (LOADER_SCRIPT) coloca
   "is-loading" no <html> antes da pintura. O progresso (carregamento real, mín. 1.2s,
   máx. 5s) preenche o "P" e acende as linhas de boot; no fim, uma cortina sobe e revela o hero. */
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useI18n } from "@/components/I18nProvider";
import { LogoP } from "@/components/svg/LogoP";
import { Flag } from "@/components/svg/Flag";
import { LOADER_DONE } from "@/lib/loader-state";
import type { Dictionary } from "@/lib/i18n";

export const LOADER_SCRIPT = `(function(r){var s=false;try{s=sessionStorage.getItem("loaderSeen")==="1"}catch(e){}r.classList.add(s?"no-loader":"is-loading")})(document.documentElement);`;

const STEPS: [number, keyof Dictionary][] = [[0, "ld_init"], [30, "ld_assets"], [65, "ld_build"], [100, "ld_ready"]];
const NAME = "Pedro Provadelli".split("");

export function Loader(){
  const { t } = useI18n();
  const el = useRef<HTMLDivElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const boot = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(true);
  const [sr, setSr] = useState("");

  useEffect(() => {
    const root = document.documentElement;
    const node = el.current;
    const done = () => { root.classList.remove("is-loading"); window.dispatchEvent(new Event(LOADER_DONE)); };
    // já visto nesta sessão (ou navegação dentro do site): some sem animar
    if (!node || !root.classList.contains("is-loading")){ done(); setActive(false); return; }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const MIN = reduce ? 300 : 1200, MAX = 5000;
    const behind = document.querySelectorAll("header, main, footer, .skip-link");
    behind.forEach(n => n.setAttribute("inert", ""));
    setSr(t.ld_sr);

    const t0 = performance.now();
    let loaded = document.readyState === "complete", shown = 0, finished = false, last = t0, raf = 0;
    const timers: number[] = [];
    const onLoad = () => { loaded = true; };
    window.addEventListener("load", onLoad);

    function render(v: number){
      const n = Math.round(v);
      if (pct.current) pct.current.textContent = String(n).padStart(3, "0");
      node!.style.setProperty("--p", v.toFixed(2));
      boot.current?.querySelectorAll("li").forEach((li, i) => li.classList.toggle("is-on", n >= STEPS[i][0] && (i < 3 || n >= 100)));
    }

    function finish(){
      if (finished) return;
      finished = true;
      try { sessionStorage.setItem("loaderSeen", "1"); } catch { /* sem armazenamento */ }
      render(100);
      timers.push(window.setTimeout(() => {
        root.classList.add("loader-out");
        node!.classList.add("is-done");                  // a cortina sobe
        timers.push(window.setTimeout(() => {
          done();
          behind.forEach(n => n.removeAttribute("inert"));
          setSr("");
        }, reduce ? 0 : 350));
        timers.push(window.setTimeout(() => { root.classList.remove("loader-out"); setActive(false); }, 1200));
      }, reduce ? 0 : 380));
    }

    function frame(now: number){
      if (finished) return;
      const elapsed = now - t0;
      const steps = Math.min((now - last) / 16.67, 30); last = now;
      const target = loaded && elapsed >= MIN ? 100 : Math.min(88, (elapsed / MIN) * 88);
      shown += (target - shown) * (1 - Math.pow(1 - (loaded ? 0.12 : 0.08), steps));
      if ((target === 100 && shown > 99.4) || elapsed > MAX) return finish();
      render(shown);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    timers.push(window.setTimeout(finish, MAX + 800));   // segurança: o rAF pausa em abas em segundo plano

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      window.removeEventListener("load", onLoad);
    };
  }, [t]);

  if (!active) return null;

  return (
    <>
      <div className="loader" ref={el} aria-hidden="true">
        <span className="loader__grid" />
        <div className="loader__hud top-5 left-5 sm:left-8"><span>SYS://PROVADELLI</span><span>v2026.11</span></div>
        <div className="loader__hud top-5 right-5 sm:right-8"><Flag className="inline-flex h-2 w-5 rounded-xs" /><span>IT / BR</span></div>
        <div className="loader__hud bottom-5 left-5 sm:left-8"><span>43.7230° N · 10.3966° E</span></div>

        <div className="relative z-2 flex w-[min(340px,calc(100vw-48px))] flex-col items-center">
          <span className="loader__letter mb-7">
            <svg className="lp--ghost" viewBox="360 270 560 700" focusable="false"><LogoP /></svg>
            <span className="loader__fill"><svg className="lp--fill" viewBox="360 270 560 700" focusable="false"><LogoP /></svg></span>
          </span>
          <p className="loader__name">
            {NAME.map((c, i) => <span key={i} style={{ "--d": i } as CSSProperties} className={c === " " ? "w-[.3em]" : undefined}>{c}</span>)}
          </p>
          <p className="mt-1 mb-8 font-mono text-[11px] tracking-[.3em] text-gold uppercase">Software Engineer</p>

          <div className="w-full">
            <ol className="boot mb-4" ref={boot}>
              {STEPS.map(([, key]) => <li key={key}>&gt; {t[key]}</li>)}
            </ol>
            <div className="mb-2 flex justify-between font-mono text-[11px] text-[#8C7A64]"><span>boot</span><span className="text-gold-light tabular-nums"><span ref={pct}>000</span>%</span></div>
            <span className="loader__bar"><span /></span>
          </div>
        </div>
      </div>
      <p className="sr-only" role="status">{sr}</p>
    </>
  );
}
