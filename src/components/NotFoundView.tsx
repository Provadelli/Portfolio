"use client";
/* Página 404. Endereços em /en/... mostram a versão em inglês. */
import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { I18nProvider } from "@/components/I18nProvider";
import { HeaderSimple } from "@/components/layout/HeaderSimple";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/layout/SkipLink";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { getDictionary, href, htmlLang, type Lang } from "@/lib/i18n";
import { EASE_BRAND } from "@/lib/motion";

export function NotFoundView(){
  const lang = useSyncExternalStore<Lang>(
    () => () => {},
    () => (/^\/en(\/|$)/.test(window.location.pathname) ? "en" : "pt"),
    () => "pt"
  );
  useEffect(() => {
    document.documentElement.lang = htmlLang(lang);
    if (lang === "en") document.title = "Page not found — Pedro Provadelli";
  }, [lang]);
  const t = getDictionary(lang);
  const digit = (d: string, i: number, em = false) => (
    <motion.span
      key={i} className="inline-block" data-reveal=""
      initial={{ opacity: 0, y: "0.3em", rotate: em ? -8 : 0 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.9, ease: EASE_BRAND, delay: 0.1 + i * 0.1 }}
    >
      {em ? <em>{d}</em> : d}
    </motion.span>
  );

  return (
    <I18nProvider lang={lang} t={t}>
      <MotionProvider>
        <SkipLink t={t} />
        <HeaderSimple lang={lang} t={t} />
        <main id="main" className="flex min-h-svh items-center px-5 pt-30 pb-20 sm:px-8">
          <div className="mx-auto w-full max-w-190">
            <p className="mb-7 font-mono text-sm text-ink-soft"><b className="text-gold-deep">HTTP</b> 404 · <span>{t.nf_code}</span></p>
            <p className="m-0 font-display text-[clamp(110px,24vw,260px)] leading-[.85] font-medium tracking-[-.04em] [&_em]:font-serif [&_em]:font-normal [&_em]:text-gold-deep" aria-hidden="true">
              {digit("4", 0)}{digit("0", 1, true)}{digit("4", 2)}
            </p>
            <h1 className="mt-8 mb-3.5 font-display text-[clamp(28px,4vw,44px)] leading-[1.15] font-medium">{t.nf_title}</h1>
            <p className="mb-9 max-w-135 text-lg leading-[1.7] text-ink-soft">{t.nf_text}</p>
            <div className="flex flex-wrap gap-3.5">
              <Link href={href(lang)} className="btn btn-solid"><span>{t.nf_home}</span></Link>
              <Link href={href(lang, "/#projetos")} className="btn"><span>{t.nf_projects}</span></Link>
              <Link href={href(lang, "/#contato")} className="btn"><span>{t.nf_contact}</span></Link>
            </div>
          </div>
        </main>
        <Footer lang={lang} t={t} />
      </MotionProvider>
    </I18nProvider>
  );
}
