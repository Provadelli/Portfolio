import { Html } from "@/components/Html";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import type { Dictionary } from "@/lib/i18n";
import { CV_URL, EMAIL, GITHUB, LINKEDIN } from "@/lib/site";

export function Contact({ t }: { t: Dictionary }){
  const rows = [
    ["GitHub", "github.com/Provadelli", GITHUB, true],
    ["LinkedIn", "in/pedroprovadellidev", LINKEDIN, true],
    [t.email_lbl, EMAIL, `mailto:${EMAIL}`, false]
  ] as const;

  return (
    <section className="section relative overflow-hidden" id="contato" aria-labelledby="contato-title">
      <div className="pointer-events-none absolute -top-40 right-[-10%] size-[60vmax] rounded-full bg-[radial-gradient(circle,rgba(242,169,59,.16),transparent_62%)]" aria-hidden="true" />
      <div className="wrap relative">
        <Reveal as="p" className="eyebrow">{t.contact_eyebrow}</Reveal>
        <Reveal as="h2" className="heading mb-14 max-w-4xl text-[clamp(40px,6.4vw,96px)]! leading-[.98]!" id="contato-title"><Html html={t.contact_title} /></Reveal>

        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:gap-20">
          <Reveal className="border-t border-line lg:sticky lg:top-28">
            {rows.map(([label, value, url, external]) => (
              <a key={url} href={url} className="contact-row" {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                <span>{label}</span><span>{value}</span><span aria-hidden="true">↗</span>
                {external && <span className="sr-only">{t.newtab_b}</span>}
              </a>
            ))}
            {/* currículo em PDF */}
            <a href={CV_URL} download className="contact-row">
              <span>CV</span><span>{t.cv_dl}</span><span aria-hidden="true" style={{ rotate: "none" }}>↓</span>
              <span className="sr-only"> {t.cv_file}</span>
            </a>
            <p className="mt-8 flex items-center gap-3 font-mono text-xs text-ink-faint"><span className="status-dot" aria-hidden="true" />{t.hero_status}</p>
          </Reveal>

          <Reveal delay={0.1}><ContactForm /></Reveal>
        </div>
      </div>
    </section>
  );
}
