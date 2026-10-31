"use client";
/* Header flutuante: pílula pequena e centralizada com o logo do "P", navegação,
   idioma e CTA. Some ao descer a página e volta ao subir. Barra de progresso tricolor na base. */
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useI18n } from "@/components/I18nProvider";
import { LogoP } from "@/components/svg/LogoP";
import { href } from "@/lib/i18n";
import { EASE_BRAND } from "@/lib/motion";
import { lockScroll } from "@/lib/scroll";
import { LangSwitch } from "./LangSwitch";

const NAV = [["sobre", "nav_about"], ["projetos", "nav_projects"], ["servicos", "nav_services"], ["tecnologias", "nav_tech"], ["trajetoria", "nav_path"]] as const;

export function Header(){
  const { lang, t } = useI18n();
  const { scrollY, scrollYProgress } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  // esconde ao descer, mostra ao subir (e sempre perto do topo)
  useMotionValueEvent(scrollY, "change", y => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > 240 && y > prev + 2);
    if (y < prev - 2 || y < 240) setHidden(false);
  });

  // seção visível no momento (destaque na navegação)
  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    NAV.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  // menu aberto: trava a rolagem, fecha com Esc e ao passar para desktop
  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape"){ setOpen(false); document.getElementById("burger")?.focus(); } };
    const desktop = window.matchMedia("(min-width: 981px)");
    const onWide = (e: MediaQueryListEvent) => { if (e.matches) setOpen(false); };
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onWide);
    return () => { document.removeEventListener("keydown", onKey); desktop.removeEventListener("change", onWide); lockScroll(false); };
  }, [open]);

  const lit = hover ?? active;

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-4 z-500 flex justify-center px-4">
        <motion.header
          className="pill pointer-events-auto max-lg:w-full max-lg:max-w-[440px] max-lg:justify-between"
          initial={false}
          animate={{ y: hidden && !open ? -110 : 0, opacity: hidden && !open ? 0 : 1 }}
          transition={{ duration: 0.5, ease: EASE_BRAND }}
        >
          <Link href={href(lang)} className="pill-logo" aria-label={t.home_label}>
            <svg viewBox="360 270 560 700" aria-hidden="true" focusable="false"><LogoP /></svg>
          </Link>

          <nav className="hidden items-center lg:flex" aria-label={t.nav_main} onMouseLeave={() => setHover(null)}>
            {NAV.map(([id, key]) => (
              <a key={id} href={`#${id}`} className="pill-link" aria-current={active === id ? "true" : undefined} onMouseEnter={() => setHover(id)}>
                {lit === id && <motion.span layoutId="pill-hl" className="absolute inset-0 -z-1 rounded-full bg-[rgba(246,241,230,.08)]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                {t[key]}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <LangSwitch />
            <a href="#contato" className="btn btn-solid btn-sm hidden lg:inline-flex">{t.nav_cta}</a>
            <button
              type="button" id="burger"
              className="burger flex size-9 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-full lg:hidden"
              aria-label={open ? t.menu_close : t.menu_open} aria-expanded={open} aria-controls="mobileMenu"
              onClick={() => setOpen(o => !o)}
            >
              <span /><span />
            </button>
          </div>

          {/* progresso de leitura */}
          <motion.span aria-hidden="true" className="pointer-events-none absolute inset-x-6 -bottom-px h-px origin-left"
            style={{ scaleX: scrollYProgress, background: "linear-gradient(90deg,#2E7D4F 0 33%,#F4EFE6 33% 66%,#C3343A 66%)" }} />
        </motion.header>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobileMenu"
            className="fixed inset-0 z-400 flex flex-col justify-end bg-[rgba(11,8,6,.96)] px-6 pt-28 backdrop-blur-xl"
            style={{ paddingBottom: "max(32px, env(safe-area-inset-bottom))" }}
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav className="flex w-full flex-col" aria-label={t.nav_mobile}>
              {[...NAV, ["contato", "nav_contact"] as const].map(([id, key], i) => (
                <motion.a
                  key={id} href={`#${id}`} onClick={() => setOpen(false)}
                  className="flex min-h-16 items-baseline gap-4 border-b border-line py-3 font-display text-[clamp(32px,9vw,48px)] font-semibold tracking-[-.04em]"
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE_BRAND, delay: 0.15 + i * 0.05 }}
                >
                  <span className="font-mono text-xs font-normal tracking-normal text-gold-deep">{String(i + 1).padStart(2, "0")}</span>{t[key]}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
