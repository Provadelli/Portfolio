"use client";
/* Cabeçalho da página inicial: fundo ao rolar, barra de progresso tricolor e menu móvel */
import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useI18n } from "@/components/I18nProvider";
import { IconGithub } from "@/components/svg/IconGithub";
import { GITHUB } from "@/lib/site";
import { EASE_BRAND } from "@/lib/motion";
import { BrandMark } from "./BrandMark";
import { LangSwitch } from "./LangSwitch";

const NAV = [["sobre", "nav_about"], ["projetos", "nav_projects"], ["servicos", "nav_services"], ["tecnologias", "nav_tech"], ["trajetoria", "nav_path"], ["contato", "nav_contact"]] as const;

export function Header(){
  const { lang, t } = useI18n();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useTransform(scrollYProgress, v => `${v * 100}%`);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", y => setScrolled(y > 40));

  // menu aberto: trava a rolagem, fecha com Esc e ao passar para desktop
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape"){ setOpen(false); document.getElementById("burger")?.focus(); }
    };
    const desktop = window.matchMedia("(min-width: 981px)");
    const onWide = (e: MediaQueryListEvent) => { if (e.matches) setOpen(false); };
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onWide);
    return () => { document.removeEventListener("keydown", onKey); desktop.removeEventListener("change", onWide); };
  }, [open]);

  return (
    <>
      <div className="progress" aria-hidden="true"><motion.span style={{ width: progress }} /></div>

      <header className={`header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="wrap flex items-center justify-between gap-4">
          <BrandMark lang={lang} t={t} />

          <nav className="hidden items-center gap-8.5 lg:flex" aria-label={t.nav_main}>
            {NAV.map(([id, key], i) => (
              <a key={id} href={`#${id}`} className="nav-link"><span>{String(i + 1).padStart(2, "0")}</span><b className="font-semibold">{t[key]}</b></a>
            ))}
            <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="flex size-10 items-center justify-center rounded-full border border-ink-faint text-ink transition hover:rotate-8 hover:border-gold-deep hover:text-gold-deep" aria-label={t.gh_label}><IconGithub /></a>
          </nav>

          <div className="flex items-center gap-1.5 lg:gap-3.5">
            <LangSwitch />
            <button
              type="button" id="burger"
              className="burger flex size-11 cursor-pointer flex-col justify-center gap-1.25 px-2.5 lg:hidden"
              aria-label={open ? t.menu_close : t.menu_open} aria-expanded={open} aria-controls="mobileMenu"
              onClick={() => setOpen(o => !o)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${open ? "is-open" : ""}`} id="mobileMenu" aria-hidden={!open} inert={!open}>
        <nav className="my-auto flex w-full max-w-130 flex-col" aria-label={t.nav_mobile}>
          {NAV.map(([id, key], i) => (
            <motion.a
              key={id} href={`#${id}`} onClick={() => setOpen(false)}
              initial={false}
              animate={open ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
              transition={{ duration: 0.5, ease: EASE_BRAND, delay: open ? 0.12 + i * 0.05 : 0 }}
            >
              {t[key]}
            </motion.a>
          ))}
          <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="text-gold-deep! italic" onClick={() => setOpen(false)}>GitHub ↗<span className="sr-only">{t.newtab_p}</span></a>
        </nav>
      </div>
    </>
  );
}
