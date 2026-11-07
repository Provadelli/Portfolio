/* Lista cujos itens entram em cascata quando aparecem na tela (mesmo mecanismo do Reveal) */
import type { ReactNode } from "react";
import { revealVars } from "./Reveal";

type Item = { key: string; className?: string; content: ReactNode };

export function Stagger({ items, className, itemClassName, step = 0.07, y = 22, ...aria }: {
  items: Item[]; className?: string; itemClassName?: string; step?: number; y?: number; "aria-label"?: string;
}){
  return (
    <ul className={className} {...aria}>
      {items.map((it, i) => (
        <li
          key={it.key}
          data-reveal=""
          style={revealVars(i * step, y)}
          className={[itemClassName, it.className].filter(Boolean).join(" ") || undefined}
        >
          {it.content}
        </li>
      ))}
    </ul>
  );
}
