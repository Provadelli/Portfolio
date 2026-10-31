import Link from "next/link";
import { Flag } from "@/components/svg/Flag";
import { href, type Dictionary, type Lang } from "@/lib/i18n";
import { EMAIL, GITHUB, LINKEDIN } from "@/lib/site";

export function Footer({ lang, t }: { lang: Lang; t: Dictionary }){
  const nav = [["sobre", t.nav_about], ["projetos", t.nav_projects], ["servicos", t.nav_services], ["tecnologias", t.nav_tech], ["trajetoria", t.nav_path], ["faq", t.foot_faq], ["contato", t.nav_contact]];
  const legal = [["/termos", t.terms], ["/privacidade", t.privacy], ["/acessibilidade", t.a11y]];

  return (
    <footer className="relative overflow-hidden bg-night pt-20 text-[#E9E1CF]">
      <Flag className="absolute inset-x-0 top-0 h-px" />
      <div className="wrap">
        <div className="grid gap-10 pb-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1.2fr_1fr]">
          <div>
            <span className="font-display text-2xl font-semibold tracking-[-.03em] text-[#FFFEFB]">Pedro Provadelli</span>
            <p className="mt-3 max-w-85 text-sm leading-[1.7] text-[#CFC6B1]">{t.foot_bio}</p>
          </div>

          <nav className="footer-col" aria-label={t.foot_nav_l}>
            <h2>{t.foot_nav}</h2>
            {nav.map(([id, label]) => <Link key={id} href={href(lang, `/#${id}`)}>{label}</Link>)}
          </nav>

          <div className="footer-col">
            <h2>{t.nav_contact}</h2>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <a href={GITHUB} target="_blank" rel="noopener noreferrer">GitHub<span className="sr-only">{t.newtab_p}</span></a>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn<span className="sr-only">{t.newtab_p}</span></a>
          </div>

          <nav className="footer-col" aria-label={t.foot_legal_l}>
            <h2>{t.foot_legal}</h2>
            {legal.map(([path, label]) => <Link key={path} href={href(lang, path)}>{label}</Link>)}
          </nav>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3.5 border-t border-[rgba(231,214,172,.14)] py-6 font-mono text-xs text-[#B9AE98]">
          <span>{t.copy}</span>
          <a href="#top" className="inline-flex min-h-11 items-center font-bold text-gold-light">{t.to_top}</a>
        </div>
      </div>
      <div className="px-4 pb-6 sm:pb-10"><span className="wordmark" aria-hidden="true">PROVADELLI</span></div>
    </footer>
  );
}
