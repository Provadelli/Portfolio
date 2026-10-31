/* 404 para qualquer endereço que não existe (fora do layout por idioma) */
import type { Metadata, Viewport } from "next";
import { NotFoundView } from "@/components/NotFoundView";
import { fontVars } from "@/lib/fonts";
import { baseMetadata } from "@/lib/seo";
import "@/styles/globals.css";

export const metadata: Metadata = {
  ...baseMetadata,
  title: "Página não encontrada — Pedro Provadelli",
  description: "Esta página não existe no portfólio de Pedro Provadelli. Volte ao início, veja os projetos ou entre em contato.",
  robots: { index: false }
};
export const viewport: Viewport = { themeColor: "#0B0806", colorScheme: "dark light" };

export default function GlobalNotFound(){
  return (
    <html lang="pt-BR" className={fontVars} suppressHydrationWarning>
      <body>
        <span id="top" />
        <NotFoundView />
      </body>
    </html>
  );
}
