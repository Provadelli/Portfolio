import { Html } from "@/components/Html";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import type { Dictionary } from "@/lib/i18n";
import { EMAIL, GITHUB, LINKEDIN } from "@/lib/site";

export function Contact({ t }: { t: Dictionary }){
  const rows = [
    ["GitHub", "github.com/Provadelli", GITHUB, true],
    ["LinkedIn", "in/pedroprovadellidev", LINKEDIN, true],
    [t.email_lbl, EMAIL, `mailto:${EMAIL}`, false]
  ] as const;

  return (
    <section className="section contact" id="contato" aria-labelledby="contato-title">
      <div className="wrap">
        <Reveal as="p" className="eyebrow">{t.contact_eyebrow}</Reveal>
        <Reveal as="h2" className="heading mb-14 text-[clamp(30px,5vw,54px)] leading-[1.15]" id="contato-title"><Html html={t.contact_title} /></Reveal>

        <div className="grid items-start gap-11 lg:grid-cols-2 lg:gap-16">
          <Reveal className="border-t border-line">
            {rows.map(([label, value, url, external]) => (
              <a key={url} href={url} className="contact-row" {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                <span>{label}</span><span>{value}</span><span aria-hidden="true">↗</span>
                {external && <span className="sr-only">{t.newtab_b}</span>}
              </a>
            ))}
          </Reveal>

          <Reveal delay={0.1}><ContactForm /></Reveal>
        </div>
      </div>
    </section>
  );
}
