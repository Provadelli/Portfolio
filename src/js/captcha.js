/* hCaptcha ("não sou um robô") do Web3Forms.
   Carregado só quando o formulário se aproxima da tela e renderizado
   manualmente, para controlar tema escuro, tamanho e idioma. */
import { onVisible, loadScript } from "./utils.js";
import { getLang, t } from "./i18n.js";

const SITEKEY = "50b2fe65-b00b-4b9e-ad62-3ba471098be2";   // chave pública que o Web3Forms valida
const API = "https://js.hcaptcha.com/1/api.js?render=explicit&recaptchacompat=off";
const compact = window.matchMedia("(max-width: 380px)");

export function initCaptcha({ onSolved } = {}){
  const slot = document.getElementById("captchaSlot");
  const box = document.getElementById("captchaBox");
  if (!slot) return null;
  let widget = null;

  function fail(){
    slot.dataset.state = "error";
    slot.dataset.loading = t("cap_fail", "Não foi possível carregar a verificação. Recarregue a página.");
  }

  function render(){
    const hc = window.hcaptcha;
    if (!hc) return;
    if (widget !== null){ try { hc.remove(widget); } catch { /* já removido */ } }
    slot.replaceChildren();
    slot.dataset.state = "loading";
    widget = hc.render(slot, {
      sitekey: SITEKEY,
      theme: "dark",
      size: compact.matches ? "compact" : "normal",
      hl: getLang() === "en" ? "en" : "pt",
      callback: () => { box.dataset.invalid = "false"; onSolved?.(); },
      "expired-callback": () => { box.dataset.invalid = "false"; },
      "error-callback": fail
    });
    // o iframe aparece um instante depois; até lá fica o texto "carregando"
    const iframe = slot.querySelector("iframe");
    iframe ? iframe.addEventListener("load", () => { slot.dataset.state = "ready"; }, { once: true }) : (slot.dataset.state = "ready");
  }

  // a API avisa pelo callback "onload" quando está pronta para renderizar
  onVisible(slot, () => {
    new Promise(resolve => { window.__hcaptchaReady = resolve; loadScript(API + "&onload=__hcaptchaReady").catch(fail); }).then(render);
  }, { rootMargin: "400px 0px" });

  document.addEventListener("langchange", render);
  compact.addEventListener("change", render);

  return {
    response: () => (widget !== null && window.hcaptcha ? window.hcaptcha.getResponse(widget) : ""),
    reset: () => { if (widget !== null && window.hcaptcha) window.hcaptcha.reset(widget); }
  };
}
