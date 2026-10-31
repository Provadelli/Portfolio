"use client";
/* FORMULÁRIO DE CONTATO: validação, registro do consentimento e envio (Web3Forms) */
import { useCallback, useRef, useState, type FormEvent, type SyntheticEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useI18n } from "@/components/I18nProvider";
import { Html } from "@/components/Html";
import { PRIVACY_VERSION, TERMS_VERSION } from "@/lib/site";
import type { Dictionary } from "@/lib/i18n";
import { Captcha, type CaptchaHandle } from "./Captcha";

const ACCESS_KEY = "1a7666bd-79d0-4d7a-b03a-b0717e991a75";
const ENDPOINT = "https://api.web3forms.com/submit";

type Field = "name" | "email" | "message" | "consent";
type Errors = Partial<Record<Field | "captcha", string>>;

function check(field: Field, el: HTMLInputElement | HTMLTextAreaElement, t: Dictionary){
  const v = el.value.trim();
  switch (field){
    case "name": return v.length >= 2 ? "" : t.err_name;
    case "email": return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : t.err_email;
    case "message": return v.length >= 10 ? "" : t.err_msg;
    case "consent": return (el as HTMLInputElement).checked ? "" : t.err_consent;
  }
}

export function ContactForm(){
  const { lang, t } = useI18n();
  const form = useRef<HTMLFormElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const captcha = useRef<CaptchaHandle>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<{ state: "" | "ok" | "error"; msg: string }>({ state: "", msg: "" });
  const [sending, setSending] = useState(false);

  const fields: Field[] = ["name", "email", "message", "consent"];
  type Input = HTMLInputElement | HTMLTextAreaElement;
  const validate = (f: Field, node: Input) => {
    const msg = check(f, node, t);
    setErrors(e => ({ ...e, [f]: msg }));
    return !msg;
  };
  // valida o campo ao sair dele (ou ao marcar, no caso da caixa de consentimento)
  const onField = (e: SyntheticEvent<Input>) => {
    const node = e.currentTarget;
    validate(node.name as Field, node);
  };
  const clearCaptcha = useCallback(() => setErrors(e => ({ ...e, captcha: "" })), []);

  // props comuns de acessibilidade de cada campo
  const a11y = (f: Field, id: string) => ({
    name: f, "aria-describedby": id,
    "aria-invalid": errors[f] === undefined ? undefined : errors[f] ? true : false,
    ...(f === "consent" ? { onChange: onField } : { onBlur: onField })
  });

  async function submit(e: FormEvent<HTMLFormElement>){
    e.preventDefault();
    const f = form.current!;
    const el = (x: Field) => f.elements.namedItem(x) as Input;
    setStatus({ state: "", msg: "" });

    // valida todos os campos de uma vez (mostra todos os erros) e foca o primeiro inválido
    const bad = fields.filter(x => !validate(x, el(x)));
    if (bad.length){ setStatus({ state: "error", msg: t.err_form }); el(bad[0]).focus(); return; }
    if ((f.elements.namedItem("botcheck") as HTMLInputElement).checked) return;   // robô preencheu o campo invisível

    if (!captcha.current?.response()){
      setErrors(x => ({ ...x, captcha: t.err_captcha }));
      setStatus({ state: "error", msg: t.err_captcha });
      captcha.current?.focus();
      return;
    }

    // registro do consentimento: quando e em qual idioma a pessoa aceitou os termos
    const data = new FormData(f);
    data.set("consent_at", new Date().toISOString());
    data.set("consent_language", lang === "en" ? "en" : "pt-BR");

    setSending(true);
    setStatus({ state: "", msg: t.form_sending });
    try {
      const res = await fetch(ENDPOINT, { method: "POST", headers: { Accept: "application/json" }, body: data });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Falha no envio");
      setStatus({ state: "ok", msg: t.form_ok });
      f.reset();
      setErrors({});
      captcha.current?.reset();
      dialog.current?.showModal();
    } catch {
      setStatus({ state: "error", msg: t.form_fail });
    } finally {
      setSending(false);
    }
  }

  const error = (f: Field | "captcha", id: string) => (
    <p className="field__error" id={id}>
      <AnimatePresence initial={false}>
        {errors[f] && <motion.span className="block" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{errors[f]}</motion.span>}
      </AnimatePresence>
    </p>
  );
  const inv = (f: Field) => (errors[f] ? "true" : "false");

  return (
    <>
      <form className="glass p-6 sm:p-10" ref={form} action={ENDPOINT} method="POST" noValidate aria-labelledby="form-title" onSubmit={submit}>
        <h3 className="mb-8 font-display text-[28px] font-semibold tracking-[-.03em]" id="form-title">{t.form_title}</h3>
        <input type="hidden" name="access_key" value={ACCESS_KEY} />
        <input type="hidden" name="subject" value="Contato pelo portfólio" />
        {/* registro do consentimento, enviado junto com a mensagem (LGPD, art. 8º) */}
        <input type="hidden" name="consent_terms_version" value={TERMS_VERSION} />
        <input type="hidden" name="consent_privacy_version" value={PRIVACY_VERSION} />
        <div className="honeypot" aria-hidden="true"><label htmlFor="f-bot">Não preencha este campo</label><input id="f-bot" type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" /></div>

        <div className="field" data-invalid={inv("name")}>
          <label htmlFor="f-nome"><span>{t.f_name}</span> <span aria-hidden="true">*</span></label>
          <input className="input" id="f-nome" type="text" autoComplete="name" required {...a11y("name", "e-nome")} />
          {error("name", "e-nome")}
        </div>
        <div className="field" data-invalid={inv("email")}>
          <label htmlFor="f-email"><span>{t.email_lbl}</span> <span aria-hidden="true">*</span></label>
          <input className="input" id="f-email" type="email" autoComplete="email" required {...a11y("email", "e-email")} />
          {error("email", "e-email")}
        </div>
        <div className="field" data-invalid={inv("message")}>
          <label htmlFor="f-msg"><span>{t.f_msg}</span> <span aria-hidden="true">*</span></label>
          <textarea className="input min-h-32.5 resize-y" id="f-msg" rows={5} required minLength={10} {...a11y("message", "e-msg")} />
          {error("message", "e-msg")}
        </div>

        <div className="field check" data-invalid={inv("consent")}>
          <input id="f-lgpd" type="checkbox" value="sim" required {...a11y("consent", "e-lgpd")} />
          <Html as="label" htmlFor="f-lgpd" className="prose-links" html={t.f_consent} />
          {error("consent", "e-lgpd")}
        </div>

        <Captcha ref={captcha} error={errors.captcha ?? ""} onSolved={clearCaptcha} />

        <button type="submit" className="btn btn-solid mt-1.5" disabled={sending}><span>{t.f_send}</span></button>
        <p className="mt-4 text-sm font-bold empty:hidden data-[state=error]:text-danger data-[state=ok]:text-success" data-state={status.state || undefined} role="status">{status.msg}</p>
        <Html as="p" className="prose-links mt-2.5 text-xs leading-normal text-ink-soft" html={t.f_note} />
      </form>

      <dialog className="confirm" ref={dialog} aria-labelledby="confirm-title" aria-describedby="confirm-text" onClick={e => { if (e.target === dialog.current) dialog.current?.close(); }}>
        <div className="mx-auto mb-4.5 grid size-16 place-items-center rounded-full bg-gold-fill text-[32px] font-extrabold text-espresso" aria-hidden="true">✓</div>
        <h3 className="mb-2.5 font-display text-[26px] font-medium" id="confirm-title">{t.cf_title}</h3>
        <p className="mb-3 text-[15px] leading-[1.6] text-ink-soft" id="confirm-text">{t.cf_text}</p>
        <Html as="p" className="prose-links mb-6 text-[13px] leading-[1.6] text-ink-soft" html={t.cf_rights} />
        <button type="button" className="btn btn-solid" onClick={() => dialog.current?.close()}><span>{t.cf_close}</span></button>
      </dialog>
    </>
  );
}
