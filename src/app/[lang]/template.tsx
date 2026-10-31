"use client";
/* Transição entre páginas: o conteúdo novo entra com um fade curto.
   Só opacidade (sem transform), para não quebrar o cabeçalho fixo.
   Na primeira carga não anima: o HTML já chega pronto. */
import { motion } from "motion/react";
import { useEffect, type ReactNode } from "react";

let firstLoad = true;

export default function Template({ children }: { children: ReactNode }){
  useEffect(() => { firstLoad = false; }, []);
  return (
    <motion.div initial={firstLoad ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}
