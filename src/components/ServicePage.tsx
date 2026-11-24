/* Página de serviço (ex.: /criacao-de-sites): mesma identidade da home, em HTML estático.
   Cada seção responde uma dúvida de quem pesquisa antes de contratar: o que é, o que inclui,
   para quem, onde atende, como funciona, prova (projetos no ar) e FAQ. */
import Image from "next/image";
import { HeaderSimple } from "@/components/layout/HeaderSimple";
import { Html } from "@/components/Html";
import { Reveal } from "@/components/motion/Reveal";
import { getProjects } from "@/content/projects";
import type { ServiceContent } from "@/content/servicos/criacao-de-sites";
import { href, type Dictionary, type Lang } from "@/lib/i18n";

const Cta = ({ href: to, label }: { href: string; label: string }) => (
  <a href={to} className="btn">{label}<span className="btn__arrow" aria-hidden="true">↗</span></a>
);

export function ServicePage({ lang, t, c, jsonLd }: { lang: Lang; t: Dictionary; c: ServiceContent; jsonLd: string }){
  const contact = href(lang, "/#contato");
  const projects = getProjects(t);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <HeaderSimple lang={lang} t={t} />
      <main id="main">
        {/* topo: H1 com a busca principal */}
        <section className="section grid-bg pt-36 sm:pt-44">
          <div className="wrap max-w-250">
            <nav aria-label="Breadcrumb" className="mb-8 font-mono text-xs text-ink-faint">
              <a href={href(lang)} className="underline-offset-4 hover:underline">Pedro Provadelli</a>
              <span aria-hidden="true"> / </span>
              <span aria-current="page">{c.breadcrumb}</span>
            </nav>
            <p className="eyebrow">{c.eyebrow}</p>
            <Html as="h1" className="heading" html={c.title} />
            <p className="lede max-w-170">{c.lede}</p>
            <div className="mt-9"><Cta href={contact} label={c.cta} /></div>
          </div>
        </section>

        {/* o que está incluído */}
        <section className="section theme-light grid-bg" aria-labelledby="svc-inc">
          <div className="wrap">
            <h2 id="svc-inc" className="heading">{c.includedTitle}</h2>
            <ul className="mt-12 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {c.included.map((it, i) => (
                <Reveal as="li" key={it.t} delay={i * 0.05} className="surface rounded-2xl px-6 py-6">
                  <h3 className="font-display text-xl font-semibold tracking-[-.02em] text-ink">{it.t}</h3>
                  <p className="mt-2 text-[15px] leading-[1.7] text-ink-soft">{it.d}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* para quem e onde atende */}
        <section className="section" aria-labelledby="svc-who">
          <div className="wrap grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 id="svc-who" className="heading">{c.forWhoTitle}</h2>
              <ul className="mt-8 grid gap-4 pl-0">
                {c.forWho.map(item => (
                  <li key={item} className="flex gap-3 text-[17px] leading-[1.6] text-ink-soft">
                    <span aria-hidden="true" className="mt-1 text-gold-deep">✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="heading">{c.whereTitle}</h2>
              <p className="lede">{c.where}</p>
            </div>
          </div>
        </section>

        {/* como funciona */}
        <section className="section theme-light grid-bg" aria-labelledby="svc-steps">
          <div className="wrap">
            <h2 id="svc-steps" className="heading">{c.stepsTitle}</h2>
            <ol className="mt-12 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-5">
              {c.steps.map((s, i) => (
                <Reveal as="li" key={s.t} delay={i * 0.06} className="surface rounded-2xl px-5 py-6">
                  <span className="font-mono text-xs font-bold text-gold-deep">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 font-display text-lg font-semibold text-ink">{s.t}</h3>
                  <p className="mt-2 text-[15px] leading-[1.65] text-ink-soft">{s.d}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* prova: projetos no ar */}
        <section className="section" aria-labelledby="svc-proof">
          <div className="wrap">
            <h2 id="svc-proof" className="heading">{c.proofTitle}</h2>
            <p className="lede">{c.proofLede}</p>
            <ul className="mt-12 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map(p => (
                <li key={p.id} className="surface overflow-hidden rounded-2xl">
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="group block">
                    <Image src={p.imgs[0].src} alt={p.imgs[0].alt} sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" className="aspect-16/9 w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" />
                    <div className="px-5 py-5">
                      <h3 className="font-display text-lg font-semibold text-ink">{p.title}<span className="sr-only">{t.newtab_p}</span></h3>
                      <p className="mt-1.5 text-sm leading-[1.6] text-ink-soft">{p.desc}</p>
                      <p className="mt-3 font-mono text-xs text-gold-deep">{p.host} ↗</p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ: <details> nativo, legível sem JavaScript (e pelas IAs) */}
        <section className="section theme-light grid-bg" aria-labelledby="svc-faq">
          <div className="wrap max-w-250">
            <Html as="h2" id="svc-faq" className="heading" html={c.faqTitle} />
            <div className="faq mt-10">
              {c.faq.map(([q, a], i) => (
                <details key={q}>
                  <summary><span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><span>{q}</span></summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* chamada final */}
        <section className="section grid-bg text-center" aria-labelledby="svc-end">
          <div className="wrap max-w-200">
            <Html as="h2" id="svc-end" className="heading" html={c.endTitle} />
            <p className="lede mx-auto">{c.endLede}</p>
            <div className="mt-9"><Cta href={contact} label={c.cta} /></div>
          </div>
        </section>
      </main>
    </>
  );
}
