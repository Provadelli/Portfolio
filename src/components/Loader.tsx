"use client";
/* TELA DE CARREGAMENTO
   Aparece só na primeira visita da sessão: um script inline (LOADER_SCRIPT) coloca
   "is-loading" no <html> antes da pintura. O progresso (carregamento real, mín. 0.6s,
   máx. 5s) preenche o "P"; no fim, uma cortina rápida sobe e revela o hero. */
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/I18nProvider";
import { LogoP } from "@/components/svg/LogoP";
import { LOADER_DONE } from "@/lib/loader-state";

export const LOADER_SCRIPT = `(function(r){var s=false;try{s=sessionStorage.getItem("loaderSeen")==="1"}catch(e){}r.classList.add(s?"no-loader":"is-loading")})(document.documentElement);`;

export function Loader(){
  const { t } = useI18n();
  const el = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const [sr, setSr] = useState("");

  useEffect(() => {
    const root = document.documentElement;
    const node = el.current;
    const done = () => { root.classList.remove("is-loading"); window.dispatchEvent(new Event(LOADER_DONE)); };
    // já visto nesta sessão (ou navegação dentro do site): some sem animar
    if (!node || !root.classList.contains("is-loading")){ done(); setActive(false); return; }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const MIN = reduce ? 200 : 600, MAX = 4000;
    const behind = document.querySelectorAll("header, main, footer, .skip-link");
    behind.forEach(n => n.setAttribute("inert", ""));
    setSr(t.ld_sr);

    const t0 = performance.now();
    let loaded = document.readyState === "complete", shown = 0, finished = false, last = t0, raf = 0;
    const timers: number[] = [];
    const onLoad = () => { loaded = true; };
    window.addEventListener("load", onLoad);

    const render = (v: number) => node.style.setProperty("--p", v.toFixed(2));

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
        }, reduce ? 0 : 200));
        timers.push(window.setTimeout(() => { root.classList.remove("loader-out"); setActive(false); }, 800));
      }, reduce ? 0 : 140));
    }

    function frame(now: number){
      if (finished) return;
      const elapsed = now - t0;
      const steps = Math.min((now - last) / 16.67, 30); last = now;
      const target = loaded && elapsed >= MIN ? 100 : Math.min(88, (elapsed / MIN) * 88);
      shown += (target - shown) * (1 - Math.pow(1 - (loaded ? 0.2 : 0.1), steps));
      if ((target === 100 && shown > 99) || elapsed > MAX) return finish();
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
        <div className="relative z-2 flex w-[min(200px,calc(100vw-48px))] flex-col items-center">
          <span className="loader__letter mb-8">
            <svg className="lp--ghost" viewBox="360 270 560 700" focusable="false"><LogoP /></svg>
            <span className="loader__fill"><svg className="lp--fill" viewBox="360 270 560 700" focusable="false"><LogoP /></svg></span>
          </span>
          <span className="loader__bar"><span /></span>
        </div>
      </div>
      <p className="sr-only" role="status">{sr}</p>
    </>
  );
}
