"use client";
/* Configuração global das animações: respeita "reduzir movimento" do sistema */
import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

export function MotionProvider({ children }: { children: ReactNode }){
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
