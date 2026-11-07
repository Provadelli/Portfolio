/* Surge ao entrar na tela. HTML puro + transição CSS ([data-reveal] em globals.css):
   nada para hidratar. Quem marca o elemento como visível (.is-in) é o RevealObserver,
   um único IntersectionObserver para a página toda, que espera a tela de carregamento.
   - com movimento reduzido, só aparece (sem deslocamento)
   - sem JavaScript, o CSS em <noscript> mostra tudo */
import type { ComponentPropsWithoutRef, CSSProperties } from "react";

const tags = ["div", "p", "h2", "h3", "ul", "li", "dl", "a"] as const;
type Tag = (typeof tags)[number];

type Props = {
  as?: Tag;
  /** atraso em segundos */
  delay?: number;
  /** distância inicial em px */
  y?: number;
} & ComponentPropsWithoutRef<"div"> & { href?: string };

/* variáveis lidas pelo CSS: atraso e deslocamento */
export const revealVars = (delay = 0, y = 26) => ({ "--rd": `${delay}s`, "--ry": `${y}px` }) as CSSProperties;

export function Reveal({ as: Comp = "div", delay = 0, y = 26, style, children, ...rest }: Props){
  return (
    <Comp data-reveal="" style={{ ...revealVars(delay, y), ...style }} {...(rest as object)}>
      {children}
    </Comp>
  );
}
