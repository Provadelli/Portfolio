import { LiquidRibbons } from "@/components/hero/LiquidRibbons";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import type { Dictionary } from "@/lib/i18n";
import { IdCard } from "./IdCard";

export function Hero({ t }: { t: Dictionary }){
  const accent = t.hero_l2.replace(/\.$/, "");
  const tags = [t.int1, t.int3, t.int4];

  // sem "isolate" na seção: a foto que viaja (z-2, fora do hero) fica entre as faixas e o texto (z-3)
  return (
    <section className="relative flex min-h-svh items-center overflow-hidden bg-espresso" aria-labelledby="hero-title">
      <LiquidRibbons />
      {/* vinheta extra: escurece as bordas de cima/baixo e o centro, onde fica o conteúdo,
          e desfoca levemente as faixas (backdrop-blur); textos e foto ficam acima, nítidos */}
      <div className="pointer-events-none absolute inset-0 z-1 backdrop-blur-[5px] bg-[radial-gradient(50%_46%_at_50%_50%,rgba(6,4,3,.5),transparent_75%),linear-gradient(180deg,rgba(6,4,3,.55),transparent_20%,transparent_80%,rgba(6,4,3,.85))]" aria-hidden="true" />

      <div className="relative z-3 mx-auto grid w-full max-w-[1040px] items-center gap-14 px-5 pt-28 pb-20 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] lg:gap-16">
        {/* textos à esquerda */}
        <div className="min-w-0">
          <Reveal as="ul" delay={0.3} className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10.5px] tracking-[.24em] text-ink-soft uppercase">
            {tags.map((tag, i) => (
              <li key={tag} className="flex items-center gap-3">
                {i > 0 && <span className="size-1 rounded-full bg-gold-deep" aria-hidden="true" />}{tag}
              </li>
            ))}
          </Reveal>

          <h1 className="hero__title" id="hero-title">
            <SplitText text={t.hero_l1} className="block" delay={0.45} />
            <SplitText text={accent} className="block" wordClass="hero__accent" delay={0.6} after={<span className="hero__dot" aria-hidden="true" />} />
          </h1>

          <Reveal as="p" delay={0.75} className="mt-6 max-w-lg text-[17px] leading-[1.65] text-[rgba(246,241,230,.78)] sm:text-[18px]">{t.hero_lede}</Reveal>

          <Reveal delay={0.85} className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic><a href="#projetos" className="btn btn-glow px-8">{t.hero_cta2}<span className="btn__arrow" aria-hidden="true">↗</span></a></Magnetic>
            <Magnetic><a href="#sobre" className="btn px-7">{t.nav_about}<span className="btn__arrow" aria-hidden="true">↓</span></a></Magnetic>
          </Reveal>
        </div>

        {/* foto à direita: a foto "viajante" (TravelingPhoto) parte daqui e desce até o Sobre */}
        <div className="photo-slot-hero relative w-full max-w-[280px] lg:max-w-none" data-photo-slot="hero">
          <IdCard priority sizes="(min-width: 981px) 360px, 280px" />
        </div>
      </div>

      <Reveal delay={1.1} className="absolute bottom-8 left-1/2 z-3 flex -translate-x-1/2 flex-col items-center gap-3 font-mono text-[10px] tracking-[.3em] text-ink-faint uppercase" aria-hidden="true">
        <span>{t.hero_scroll}</span>
        <span className="scroll-cue" />
      </Reveal>
    </section>
  );
}
