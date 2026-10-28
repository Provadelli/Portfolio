/* FORMULÁRIO DE CONTATO: validação, registro do consentimento e envio (Web3Forms) */
import { t, getLang } from "./i18n.js";
import { initCaptcha } from "./captcha.js";

const MAIL = "pedroprovadelli@gmail.com";

const rules = {
  name: v => v.trim().length >= 2 ? "" : t("err_name", "Informe seu nome."),
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : t("err_email", "Informe um e-mail válido."),
  message: v => v.trim().length >= 10 ? "" : t("err_msg", "Escreva uma mensagem com pelo menos 10 caracteres."),
  consent: (_, el) => el.checked ? "" : t("err_consent", "É necessário concordar para enviar a mensagem.")
};

/* mostra/limpa o erro de um campo e o associa ao campo (aria-invalid + aria-describedby) */
function setError(wrap, input, msg){
  wrap.querySelector(".field__error").textContent = msg;
  wrap.dataset.invalid = msg ? "true" : "false";
  input?.setAttribute("aria-invalid", msg ? "true" : "false");
  return !msg;
}

export function initForm(){
  const form = document.getElementById("contactForm");
  if (!form) return;
  const status = document.getElementById("formStatus");
  const submit = document.getElementById("formSubmit");
  const dialog = document.getElementById("confirmDialog");
  const captchaBox = document.getElementById("captchaBox");
  const fields = Array.from(form.querySelectorAll("#f-nome, #f-email, #f-msg, #f-lgpd"));

  const captcha = initCaptcha({ onSolved: () => setError(captchaBox, null, "") });
  const validate = (el) => setError(el.closest(".field"), el, rules[el.name](el.value, el));
  fields.forEach(f => f.addEventListener(f.type === "checkbox" ? "change" : "blur", () => validate(f)));

  document.getElementById("confirmClose")?.addEventListener("click", () => dialog.close());
  dialog?.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });

  const say = (state, msg) => { status.dataset.state = state; status.textContent = msg; };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    say("", "");

    // valida todos os campos de uma vez (mostra todos os erros) e foca o primeiro inválido
    const firstBad = fields.map(f => validate(f) ? null : f).find(Boolean);
    if (firstBad){ say("error", t("err_form", "Corrija os campos destacados.")); firstBad.focus(); return; }
    if (form.botcheck?.checked) return;   // robô preencheu o campo invisível

    if (captcha && !captcha.response()){
      setError(captchaBox, null, t("err_captcha", "Confirme que você não é um robô."));
      say("error", t("err_captcha", "Confirme que você não é um robô."));
      captchaBox.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }

    // registro do consentimento: quando e em qual idioma a pessoa aceitou os termos
    form.querySelector("#consentAt").value = new Date().toISOString();
    form.querySelector("#consentLang").value = getLang() === "en" ? "en" : "pt-BR";

    submit.disabled = true;
    say("", t("form_sending", "Enviando..."));
    try {
      const res = await fetch(form.action, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Falha no envio");
      say("ok", t("form_ok", "Mensagem enviada! Responderei em breve."));
      form.reset();
      fields.forEach(f => { f.removeAttribute("aria-invalid"); f.closest(".field").dataset.invalid = "false"; });
      captcha?.reset();
      dialog?.showModal?.();
    } catch {
      say("error", t("form_fail", `Não foi possível enviar. Tente novamente ou escreva para ${MAIL}.`));
    } finally {
      submit.disabled = false;
    }
  });
}
