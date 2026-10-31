/* Texto do dicionário que contém marcação simples (<em>, <br>, <strong>, <a>).
   O conteúdo vem só dos dicionários do próprio projeto, nunca de quem visita. */
import type { ElementType, ComponentPropsWithoutRef } from "react";

type Props<T extends ElementType> = { as?: T; html: string } & Omit<ComponentPropsWithoutRef<T>, "children" | "dangerouslySetInnerHTML">;

export function Html<T extends ElementType = "span">({ as, html, ...rest }: Props<T>){
  const Tag = (as ?? "span") as ElementType;
  return <Tag {...rest} dangerouslySetInnerHTML={{ __html: html }} />;
}
