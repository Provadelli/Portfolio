"use client";
/* TELA DE CARREGAMENTO
   Aparece só na primeira visita da sessão: um script inline (LOADER_SCRIPT) coloca
   "is-loading" no <html> antes da pintura. O progresso (carregamento real, mín. 1.2s,
   máx. 5s) preenche o P de baixo para cima; em 100% ele brilha e dá zoom, abrindo o site. */
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useI18n } from "@/components/I18nProvider";
import { PisaTower } from "@/components/svg/PisaTower";
import { LogoP } from "@/components/svg/LogoP";
import { Flag } from "@/components/svg/Flag";
import { LOADER_DONE } from "@/lib/loader-state";
import type { Dictionary } from "@/lib/i18n";

export const LOADER_SCRIPT = `(function(r){var s=false;try{s=sessionStorage.getItem("loaderSeen")==="1"}catch(e){}r.classList.add(s?"no-loader":"is-loading")})(document.documentElement);`;

const STEPS: [number, keyof Dictionary][] = [[0, "ld_init"], [30, "ld_assets"], [65, "ld_build"], [100, "ld_ready"]];
const NAME = "PEDRO PROVADELLI".split("");

export function Loader(){
  const { t } = useI18n();
  const el = useRef<HTMLDivElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const msg = useRef<HTMLSpanElement>(null);
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
    const behind = document.querySelectorAll("body > header, body > main, body > footer, .skip-link");
    behind.forEach(n => n.setAttribute("inert", ""));
    setSr(t.ld_sr);

    const t0 = performance.now();
    let loaded = document.readyState === "complete", shown = 0, finished = false, last = t0, raf = 0;
    const timers: number[] = [];
    const onLoad = () => { loaded = true; };
    window.addEventListener("load", onLoad);

    function render(v: number){
      const n = Math.round(v);
      if (pct.current) pct.current.textContent = String(n).padStart(2, "0") + "%";
      node!.style.setProperty("--p", v.toFixed(2));
      const step = STEPS.filter(s => n >= s[0]).pop()!;
      if (msg.current) msg.current.textContent = t[step[1]];
    }

    function finish(){
      if (finished) return;
      finished = true;
      try { sessionStorage.setItem("loaderSeen", "1"); } catch { /* sem armazenamento */ }
      render(100);
      node!.classList.add("is-full");
      timers.push(window.setTimeout(() => {
        root.classList.add("loader-out");
        node!.classList.add("is-done");
        // o hero entra enquanto o P atravessa a tela
        timers.push(window.setTimeout(() => {
          done();
          behind.forEach(n => n.removeAttribute("inert"));
          setSr("");
        }, reduce ? 0 : 450));
        timers.push(window.setTimeout(() => { root.classList.remove("loader-out"); setActive(false); }, 1600));
      }, reduce ? 0 : 420));
    }

    function frame(now: number){
      if (finished) return;
      const elapsed = now - t0;
      // suavização por tempo (não por quadro): mesma duração a 30, 60 ou 120 fps
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
        <span className="loader__scan" />
        <div className="loader__art">
          <svg className="size-full overflow-visible" viewBox="-40 0 300 420" focusable="false">
            <path className="pz pz--ground" style={{ "--i": 24 } as CSSProperties} d="M-30 392H240" pathLength={1} />
            <path className="pz pz--dash" style={{ "--i": 25 } as CSSProperties} d="M-10 400H20M40 400H70M130 400H160M180 400H210" pathLength={1} />
            <path className="pz pz--plumb" style={{ "--i": 26 } as CSSProperties} d="M100 392V41" pathLength={1} />
            <g transform="rotate(4 100 392)"><PisaTower c="pz" /></g>
            <path className="pz pz--anno" style={{ "--i": 27 } as CSSProperties} d="M196 392V60M190 392H202M190 60H202" pathLength={1} />
            <text className="pz-t" x="204" y="230">56,67 m</text>
            <text className="pz-t" x="114" y="44">3,97°</text>
            <text className="pz-t pz-t--lg" x="-30" y="414">TORRE DI PISA</text>
            <text className="pz-t" x="120" y="414">43.7230° N  10.3966° E</text>
          </svg>
        </div>
        <div className="loader__hud left-4.5 sm:left-7"><span>SYS://PROVADELLI</span><span>v2026.10</span></div>
        <div className="loader__hud right-4.5 sm:right-7"><Flag className="inline-flex h-2.5 w-5.25 rounded-xs" /><span>IT / BR</span></div>
        <div className="loader__core relative z-2 flex w-[min(320px,calc(100vw-40px))] flex-col items-center">
          <div className="loader__mark relative mb-6.5 grid size-42.5 place-items-center sm:size-50">
            <svg className="loader__ring" viewBox="0 0 200 200" focusable="false">
              <circle className="loader__ring-track" cx="100" cy="100" r="94" />
              <circle className="loader__ring-line" cx="100" cy="100" r="94" pathLength={100} />
            </svg>
            <span className="loader__glow" />
            <span className="loader__letter">
              <svg className="lp--ghost" viewBox="360 270 560 700" focusable="false"><LogoP /></svg>
              <span className="loader__fill"><svg className="lp--fill" viewBox="360 270 560 700" focusable="false"><LogoP /></svg></span>
              <span className="loader__scanline" />
            </span>
          </div>
          <p className="loader__name">
            {NAME.map((c, i) => <span key={i} style={{ "--d": i } as CSSProperties} className={c === " " ? "w-[.5em]" : undefined}>{c}</span>)}
          </p>
          <p className="loader__fade mt-2 mb-6.5 font-mono text-[11px] tracking-[.32em] text-gold uppercase" style={{ "--fd": "1.1s" } as CSSProperties}>Software Engineer</p>
          <div className="loader__fade mb-2.5 flex w-full justify-between gap-3 font-mono text-xs text-[#B6A28B]">
            <span><b className="text-gold">$</b> <span ref={msg}>{t.ld_init}</span></span>
            <span className="text-gold-light tabular-nums" ref={pct}>00%</span>
          </div>
          <span className="loader__fade block h-0.5 w-full overflow-hidden rounded-xs bg-[rgba(201,149,47,.18)]"><span className="loader__bar-fill" /></span>
        </div>
      </div>
      <p className="sr-only" role="status">{sr}</p>
    </>
  );
}
