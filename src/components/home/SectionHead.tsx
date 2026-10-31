import { Html } from "@/components/Html";
import { Reveal } from "@/components/motion/Reveal";

/* Sobretítulo + título (+ texto de apoio) de cada seção */
export function SectionHead({ id, eyebrow, title, lede, className = "section-head" }: {
  id: string; eyebrow: string; title: string; lede?: string; className?: string;
}){
  return (
    <div className={className}>
      <Reveal as="p" className="eyebrow">{eyebrow}</Reveal>
      <Reveal as="h2" className="heading" id={id}><Html html={title} /></Reveal>
      {lede && <Reveal as="p" className="lede">{lede}</Reveal>}
    </div>
  );
}
