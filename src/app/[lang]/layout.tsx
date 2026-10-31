/* Layout raiz: um por idioma (/ = português, /en = inglês), todos gerados estaticamente */
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { I18nProvider } from "@/components/I18nProvider";
import { SkipLink } from "@/components/layout/SkipLink";
import { Footer } from "@/components/layout/Footer";
import { fontVars } from "@/lib/fonts";
import { getDictionary, htmlLang, isLang, LANGS } from "@/lib/i18n";
import { baseMetadata } from "@/lib/seo";
import "@/styles/globals.css";

export const dynamicParams = false;
export const generateStaticParams = () => LANGS.map(lang => ({ lang }));

export const metadata: Metadata = baseMetadata;
export const viewport: Viewport = { themeColor: "#0B0806", colorScheme: "dark light" };

/* sem JavaScript: tudo o que anima na entrada já aparece pronto */
const NOSCRIPT_CSS = "[data-reveal]{opacity:1!important;transform:none!important;filter:none!important}.loader{display:none!important}";

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">){
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <html lang={htmlLang(lang)} className={fontVars} suppressHydrationWarning>
      <head>
        <noscript><style>{NOSCRIPT_CSS}</style></noscript>
      </head>
      <body>
        <span id="top" />
        <I18nProvider lang={lang} t={t}>
          <MotionProvider>
            <SmoothScroll />
            <SkipLink t={t} />
            {children}
            <Footer lang={lang} t={t} />
          </MotionProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
