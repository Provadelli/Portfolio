/* Fontes servidas pelo próprio site (next/font): sem requisição ao Google e sem salto de layout */
import { Fraunces, JetBrains_Mono, Manrope } from "next/font/google";

export const fraunces = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], axes: ["opsz"], variable: "--font-fraunces", display: "swap" });
export const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
export const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-jetbrains", display: "swap" });

export const fontVars = `${fraunces.variable} ${manrope.variable} ${jetbrains.variable}`;
