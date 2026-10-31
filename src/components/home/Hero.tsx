import { LiquidRibbons } from "@/components/hero/LiquidRibbons";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { Flag } from "@/components/svg/Flag";
import type { Dictionary } from "@/lib/i18n";

export function Hero({ t }: { t: Dictionary }){
  const accent = t.hero_l2.replace(/\.$/, "");
  const tags = [t.int1, t.int3, t.int4];

  return (
    <section className="relative isolate flex min-h-svh items-center overflow-hidden bg-espresso" aria-labelledby="hero-title">
      <LiquidRibbons />
      {/* vinheta extra: escurece as bordas de cima/baixo e o centro, onde fica o texto */}
      <div className="pointer-events-none absolute inset-0 z-1 bg-[radial-gradient(55%_50%_at_50%_50%,rgba(6,4,3,.55),transparent_75%),linear-gradient(180deg,rgba(6,4,3,.6),transparent_22%,transparent_78%,rgba(6,4,3,.85))]" aria-hidden="true" />

      {/* detalhes laterais tipo HUD */}
      <Reveal as="ul" delay={0.9} className="absolute top-1/2 left-8 z-2 hidden -translate-y-1/2 flex-col gap-3 font-mono text-[11px] tracking-[.24em] text-ink-soft uppercase xl:flex">
        {tags.map(tag => <li key={tag}>{tag}</li>)}
      </Reveal>
      <Reveal delay={1} className="absolute top-1/2 right-8 z-2 hidden -translate-y-1/2 flex-col items-end gap-2 font-mono text-[11px] tracking-[.18em] text-ink-soft xl:flex" aria-hidden="true">
        <Flag className="h-1 w-8 rounded-xs" />
        <span>43.7230° N</span><span>10.3966° E</span><span>IT / BR</span>
      </Reveal>

      <div className="relative z-2 mx-auto w-full max-w-5xl px-5 pt-32 pb-24 text-center sm:px-8">
        <Reveal as="p" delay={0.05} className="mx-auto mb-8 inline-flex items-center gap-2.5 rounded-full border border-[rgba(246,241,230,.14)] bg-[rgba(11,8,6,.45)] px-4 py-2 font-mono text-[11px] tracking-[.14em] text-ink-soft uppercase backdrop-blur-md">
          <span className="status-dot" aria-hidden="true" />{t.hero_status}
        </Reveal>

        <h1 className="hero__title" id="hero-title">
          <SplitText text={t.hero_l1} className="block" delay={0.1} />
          <SplitText text={accent} className="block" wordClass="hero__accent" delay={0.28} after={<span className="hero__dot" aria-hidden="true" />} />
        </h1>

        <Reveal as="p" delay={0.6} className="mx-auto mt-8 max-w-lg text-[18px] leading-[1.65] text-[rgba(246,241,230,.82)] sm:text-[19px]">{t.hero_lede}</Reveal>

        <Reveal delay={0.72} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Magnetic><a href="#projetos" className="btn btn-solid px-7">{t.hero_cta2}<span className="btn__arrow" aria-hidden="true">↗</span></a></Magnetic>
          <Magnetic><a href="#sobre" className="btn px-7">{t.nav_about}<span className="btn__arrow" aria-hidden="true">↓</span></a></Magnetic>
        </Reveal>
      </div>

      <Reveal delay={1.1} className="absolute bottom-8 left-1/2 z-2 flex -translate-x-1/2 flex-col items-center gap-3 font-mono text-[10px] tracking-[.3em] text-ink-faint uppercase" aria-hidden="true">
        <span>{t.hero_scroll}</span>
        <span className="scroll-cue" />
      </Reveal>
    </section>
  );
}
