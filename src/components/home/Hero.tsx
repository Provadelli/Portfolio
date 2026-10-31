import Image from "next/image";
import { Flag } from "@/components/svg/Flag";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import type { Dictionary } from "@/lib/i18n";
import pedro from "@/assets/img/pedro.webp";
import { HeroBackdrop } from "./HeroBackdrop";
import { HeroPisa } from "./HeroPisa";
import { HeroTitle } from "./HeroTitle";
import { FounderCard } from "./FounderCard";

export function Hero({ t }: { t: Dictionary }){
  return (
    <div className="hero-wrap">
      <HeroBackdrop />
      <section className="relative z-1 mx-auto grid max-w-site items-center gap-11 px-5 pt-30 pb-16 sm:px-6 lg:min-h-svh lg:grid-cols-[1.05fr_.95fr] lg:gap-14 lg:px-8 lg:pt-35 lg:pb-20" aria-labelledby="hero-title">
        <div className="min-w-0">
          <HeroTitle l1={t.hero_l1} l2={t.hero_l2} />

          <Reveal as="p" delay={0.42} className="mt-8.5 mb-9 max-w-115 text-lg leading-[1.7] text-ink-soft">{t.hero_lede}</Reveal>

          <Reveal delay={0.52} className="flex flex-wrap gap-3.5">
            <Magnetic className="max-sm:flex-[1_1_100%]"><a href="#contato" className="btn btn-gold w-full"><span>{t.hero_cta1}</span></a></Magnetic>
            <Magnetic className="max-sm:flex-[1_1_100%]"><a href="#projetos" className="btn btn-ghost w-full"><span>{t.hero_cta2}</span></a></Magnetic>
          </Reveal>

          <Reveal as="p" delay={0.6} className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-[rgba(212,175,90,.4)] bg-[rgba(26,18,12,.5)] px-4 py-2 text-[13px] font-bold text-ink-soft">
            <span className="status-dot" aria-hidden="true" /><span>{t.hero_status}</span>
          </Reveal>
        </div>

        <div className="relative flex items-center justify-center lg:min-h-130">
          <HeroPisa />
          <div className="relative z-2 w-[min(340px,100%)]" id="heroSlot">
            <FounderCard>
              <div className="founder__photo">
                <Image src={pedro} alt={t.photo_alt} preload sizes="340px" quality={85} className="size-full object-cover object-top sepia-[.12]" />
                <svg className="postmark" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
                  <defs><path id="pmCircle" d="M100 100m-74 0a74 74 0 1 1 148 0a74 74 0 1 1 -148 0" /></defs>
                  <circle cx="100" cy="100" r="88" /><circle cx="100" cy="100" r="58" />
                  <text><textPath href="#pmCircle">ENGENHARIA DE SOFTWARE ✦ FIAP ✦ ELETRÔNICA ✦ FAETEC ✦</textPath></text>
                  <text className="postmark__mid" x="100" y="96" textAnchor="middle">BRASIL</text>
                  <text className="postmark__mid" x="100" y="120" textAnchor="middle">2026</text>
                  <path d="M-90 70c14-8 28 8 42 0s28 8 42 0M-90 100c14-8 28 8 42 0s28 8 42 0M-90 130c14-8 28 8 42 0s28 8 42 0" />
                </svg>
              </div>
              <figcaption className="founder__info">
                <strong className="block font-display text-[22px] font-medium text-cream">Pedro Provadelli</strong>
                <span className="mt-1 mb-3.5 block text-[11px] font-bold tracking-[.14em] text-[#E2BC63] uppercase">{t.founder_sub}</span>
                <ul className="founder__stack flex flex-wrap gap-2 border-t border-[#4A3626] pt-3.5" aria-label={t.stack_label}>
                  <li>Web</li><li>Python</li><li>C++</li><li>IoT</li>
                </ul>
                <Flag className="mt-4 h-1 rounded-xs" />
              </figcaption>
            </FounderCard>
          </div>
        </div>
      </section>
    </div>
  );
}
