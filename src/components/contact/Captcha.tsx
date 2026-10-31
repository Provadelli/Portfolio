"use client";
/* hCaptcha ("não sou um robô") do Web3Forms.
   Carregado só quando o formulário se aproxima da tela e renderizado manualmente,
   para controlar tema escuro, tamanho e idioma. */
import { useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";
import { useI18n } from "@/components/I18nProvider";
import { Html } from "@/components/Html";

const SITEKEY = "50b2fe65-b00b-4b9e-ad62-3ba471098be2";   // chave pública que o Web3Forms valida
const API = "https://js.hcaptcha.com/1/api.js?render=explicit&recaptchacompat=off&onload=__hcaptchaReady";

type HCaptcha = {
  render(el: HTMLElement, opts: Record<string, unknown>): string;
  remove(id: string): void;
  reset(id: string): void;
  getResponse(id: string): string;
};
declare global { interface Window { hcaptcha?: HCaptcha; __hcaptchaReady?: () => void } }

export type CaptchaHandle = { response(): string; reset(): void; focus(): void };

let apiPromise: Promise<void> | null = null;
function loadApi(){
  apiPromise ??= new Promise<void>((resolve, reject) => {
    window.__hcaptchaReady = resolve;
    const s = document.createElement("script");
    s.src = API; s.async = true;
    s.onerror = () => { apiPromise = null; reject(new Error("hCaptcha")); };
    document.head.appendChild(s);
  });
  return apiPromise;
}

export function Captcha({ error, onSolved, ref }: { error: string; onSolved(): void; ref: Ref<CaptchaHandle> }){
  const { lang, t } = useI18n();
  const box = useRef<HTMLDivElement>(null);
  const slot = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [near, setNear] = useState(false);
  const solved = useRef(onSolved);
  useEffect(() => { solved.current = onSolved; }, [onSolved]);

  useImperativeHandle(ref, () => ({
    response: () => (widget.current !== null && window.hcaptcha ? window.hcaptcha.getResponse(widget.current) : ""),
    reset: () => { if (widget.current !== null) window.hcaptcha?.reset(widget.current); },
    focus: () => box.current?.scrollIntoView({ block: "center", behavior: "smooth" })
  }), []);

  // só baixa o script quando o formulário estiver a ~400px da tela
  useEffect(() => {
    const el = slot.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting){ setNear(true); io.disconnect(); } }, { rootMargin: "400px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // renderiza (e re-renderiza ao trocar idioma ou largura da tela)
  useEffect(() => {
    if (!near) return;
    const compact = window.matchMedia("(max-width: 380px)");
    let alive = true;

    function render(){
      const hc = window.hcaptcha, el = slot.current;
      if (!hc || !el || !alive) return;
      if (widget.current !== null){ try { hc.remove(widget.current); } catch { /* já removido */ } }
      el.replaceChildren();
      setState("loading");
      widget.current = hc.render(el, {
        sitekey: SITEKEY,
        theme: "dark",
        size: compact.matches ? "compact" : "normal",
        hl: lang === "en" ? "en" : "pt",
        callback: () => solved.current(),
        "error-callback": () => setState("error")
      });
      // o iframe aparece um instante depois; até lá fica o texto "carregando"
      const iframe = el.querySelector("iframe");
      if (iframe) iframe.addEventListener("load", () => alive && setState("ready"), { once: true });
      else setState("ready");
    }

    loadApi().then(render, () => setState("error"));
    compact.addEventListener("change", render);
    return () => { alive = false; compact.removeEventListener("change", render); };
  }, [near, lang]);

  return (
    <div className="field captcha-box" ref={box} data-invalid={error ? "true" : "false"} role="group" aria-labelledby="captcha-label" aria-describedby="captcha-help">
      <p className="mb-1 text-[13px] font-bold" id="captcha-label">{t.cap_label}</p>
      <Html as="p" className="prose-links mb-3 text-xs leading-normal text-ink-soft" id="captcha-help" html={t.cap_help} />
      <div className="captcha-slot" ref={slot} data-state={state === "idle" ? undefined : state} data-loading={state === "error" ? t.cap_fail : t.cap_loading} />
      <p className="field__error text-center" id="e-captcha">{error}</p>
    </div>
  );
}
