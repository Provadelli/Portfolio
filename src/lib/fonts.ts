/* Fontes servidas pelo próprio site (next/font): sem requisição ao Google e sem salto de layout.
   Space Grotesk = títulos (tech) · Manrope = texto · JetBrains Mono = rótulos/HUD ·
   Fraunces itálico = palavras de destaque (assinatura italiana).
   Só a Space Grotesk (usada na tela de carregamento) é pré-carregada: as outras só aparecem
   depois dela, então não disputam banda com a foto do hero */
import { Fraunces, JetBrains_Mono, Manrope, Space_Grotesk } from "next/font/google";

export const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });
export const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap", preload: false });
export const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-jetbrains", display: "swap", preload: false });
export const fraunces = Fraunces({ subsets: ["latin"], style: ["italic"], weight: ["400"], variable: "--font-fraunces", display: "swap", preload: false });

export const fontVars = `${grotesk.variable} ${manrope.variable} ${jetbrains.variable} ${fraunces.variable}`;
