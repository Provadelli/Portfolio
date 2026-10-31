"use client";
/* Entrega o idioma e o dicionário aos componentes de cliente */
import { createContext, useContext, type ReactNode } from "react";
import type { Dictionary, Lang } from "@/lib/i18n";

type I18n = { lang: Lang; t: Dictionary };
const Ctx = createContext<I18n | null>(null);

export function I18nProvider({ lang, t, children }: I18n & { children: ReactNode }){
  return <Ctx.Provider value={{ lang, t }}>{children}</Ctx.Provider>;
}

export function useI18n(){
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n precisa estar dentro de <I18nProvider>");
  return v;
}
