/* Troca de idioma PT/EN.
   O português vem do próprio HTML (data-i18n / data-i18n-attr); cada página
   passa só o dicionário em inglês de que precisa. */

const KEY = "lang";
let EN = {};
const pt = {};
const attrs = [];

export const getLang = () => document.documentElement.dataset.lang || "pt";

/* texto traduzido de uma chave; `fallback` é o português usado no JS */
export function t(key, fallback){
  if (getLang() === "en" && EN[key] != null) return EN[key];
  return pt[key] ?? pt["@" + key] ?? fallback ?? key;
}

function read(){
  document.querySelectorAll("[data-i18n]").forEach(el => { pt[el.dataset.i18n] ??= el.innerHTML; });
  document.querySelectorAll("[data-i18n-attr]").forEach(el => {
    el.dataset.i18nAttr.split(";").forEach(pair => {
      const [attr, key] = pair.split(":");
      pt["@" + key] ??= el.getAttribute(attr);
      attrs.push([el, attr, key]);
    });
  });
}

function apply(lang){
  const en = lang === "en";
  const root = document.documentElement;
  root.dataset.lang = lang;
  root.lang = en ? "en" : "pt-BR";
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const k = el.dataset.i18n;
    el.innerHTML = en && EN[k] != null ? EN[k] : pt[k];
  });
  attrs.forEach(([el, attr, key]) => {
    const v = en && EN[key] != null ? EN[key] : pt["@" + key];
    if (v != null) el.setAttribute(attr, v);
  });
  document.querySelectorAll(".lang__btn").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
  document.querySelector('meta[property="og:locale"]')?.setAttribute("content", en ? "en_US" : "pt_BR");
  document.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
}

export function setLang(lang){
  try { localStorage.setItem(KEY, lang); } catch { /* sem armazenamento */ }
  apply(lang);
}

export function initI18n(dictionary){
  EN = dictionary;
  read();
  document.querySelectorAll(".lang__btn").forEach(b => b.addEventListener("click", () => setLang(b.dataset.lang)));

  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch { /* ignora */ }
  const initial = saved || ((navigator.language || "pt").toLowerCase().startsWith("pt") ? "pt" : "en");
  document.documentElement.dataset.lang = "pt";
  if (initial === "en") apply("en");
}
