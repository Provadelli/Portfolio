import Link from "next/link";
import { Flag } from "@/components/svg/Flag";
import { href, type Dictionary, type Lang } from "@/lib/i18n";
import { EMAIL, GITHUB, LINKEDIN } from "@/lib/site";

export function Footer({ lang, t }: { lang: Lang; t: Dictionary }){
  const nav = [["sobre", t.nav_about], ["projetos", t.nav_projects], ["servicos", t.nav_services], ["tecnologias", t.nav_tech], ["trajetoria", t.nav_path], ["faq", t.foot_faq], ["contato", t.nav_contact]];
  const legal = [["/termos", t.terms], ["/privacidade", t.privacy], ["/acessibilidade", t.a11y]];

  return (
    <footer className="relative bg-night pt-19.5 pb-8 text-[#E9E1CF]">
      <Flag className="absolute inset-x-0 top-0 h-1.5" />
      <div className="wrap">
        <div className="grid gap-10 border-b border-[rgba(231,214,172,.25)] pb-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1.2fr_1fr]">
          <div>
            <span className="font-display text-2xl text-[#FFFEFB]">Pedro Provadelli</span>
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

        <div className="flex flex-wrap items-center justify-between gap-3.5 pt-7">
          <span className="text-[13px] text-[#CFC6B1]">{t.copy}</span>
          <a href="#top" className="inline-flex min-h-11 items-center text-[13px] font-bold text-gold-light">{t.to_top}</a>
        </div>
      </div>
    </footer>
  );
}
