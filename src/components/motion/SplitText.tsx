/* Palavras que sobem de dentro de uma máscara, uma após a outra (CSS: [data-reveal="split"]).
   O texto continua legível para leitores de tela (as palavras são texto comum). */
import { Fragment, type ReactNode } from "react";
import { revealVars } from "./Reveal";

export function SplitText({ text, delay = 0, step = 0.07, className, wordClass, after }: {
  text: string; delay?: number; step?: number; className?: string; wordClass?: string; after?: ReactNode;
}){
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="inline-block overflow-hidden pb-[.08em] align-bottom">
            <span className={`inline-block ${wordClass ?? ""}`} data-reveal="split" style={revealVars(delay + i * step)}>
              {w}{i === words.length - 1 ? after : null}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
