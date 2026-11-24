import Link from "next/link";
import { href, type Dictionary, type Lang } from "@/lib/i18n";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHead } from "./SectionHead";
import { ServiceCards } from "./ServiceCards";

export function Services({ t, lang }: { t: Dictionary; lang: Lang }){
  const split = (s: string) => s.split(" · ");
  const items = [
    { title: t.s1_t, desc: t.s1_d, more: split(t.s1_x) },
    { title: t.s2_t, desc: t.s2_d, more: split(t.s2_x) },
    { title: t.s3_t, desc: t.s3_d, more: split(t.s3_x) },
    { title: t.s4_t, desc: t.s4_d, more: split(t.s4_x) }
  ];

  return (
    <section className="section theme-light grid-bg" id="servicos" aria-labelledby="serv-title">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead id="serv-title" eyebrow={t.serv_eyebrow} title={t.serv_title} lede={t.serv_lede} />
          <Reveal className="mb-16 max-lg:hidden"><a href="#contato" className="btn">{t.start_project}<span className="btn__arrow" aria-hidden="true">↗</span></a></Reveal>
        </div>
        <ServiceCards items={items} cta={t.start_project} />
        {/* link interno para a página de serviço (ajuda o Google a achar e valorizar a página) */}
        <Reveal as="p" className="mt-10">
          <Link href={href(lang, "/criacao-de-sites")} className="inline-flex min-h-11 items-center gap-2 font-display text-lg font-semibold text-ink underline decoration-gold-deep decoration-2 underline-offset-6 hover:text-gold-deep">
            {t.serv_more}<span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
