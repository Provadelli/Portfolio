"use client";
/* Card da foto, minimalista: foto em cores naturais, borda fina e nome sobre um gradiente escuro.
   - caption: opacidade do nome (a foto que viaja do hero até o Sobre mostra o nome só ao pousar)
   - decorative: imagem repetida, escondida de leitores de tela
   - priority: foto do hero (LCP): pré-carregada e com prioridade alta de download */
import Image from "next/image";
import { motion, type MotionValue } from "motion/react";
import { useI18n } from "@/components/I18nProvider";
import pedro from "@/assets/img/pedro.webp";

/* mesmo "sizes" nos três lugares da foto (hero, foto que viaja e Sobre): um único download */
const PHOTO_SIZES = "(min-width: 981px) 400px, min(400px, 90vw)";

type Props = { caption?: MotionValue<number>; decorative?: boolean; priority?: boolean; sizes?: string };

export function IdCard({ caption, decorative = false, priority = false, sizes = PHOTO_SIZES }: Props){
  const { t } = useI18n();
  return (
    <figure className="idcard m-0" aria-hidden={decorative || undefined}>
      <div className="idcard__photo">
        <Image src={pedro} alt={decorative ? "" : t.photo_alt} sizes={sizes} quality={85} preload={priority} fetchPriority={priority ? "high" : undefined} className="size-full object-cover object-top" />
        <motion.figcaption className="absolute inset-x-0 bottom-0 z-3 p-6" style={caption ? { opacity: caption } : undefined}>
          <strong className="block font-display text-2xl font-semibold tracking-[-.03em] text-cream">Pedro Provadelli</strong>
          <span className="mt-1 block font-mono text-[11px] tracking-[.14em] text-gold-light uppercase">{t.founder_sub}</span>
        </motion.figcaption>
      </div>
    </figure>
  );
}
