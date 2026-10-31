/* Metadados por página: título, descrição, canonical, idiomas alternativos e Open Graph */
import type { Metadata } from "next";
import { href, ogLocale, type Lang } from "./i18n";
import { SITE_URL } from "./site";

const OG_IMAGE = { url: "/og-pedro.jpg", width: 1200, height: 630 };

export function pageMetadata({ lang, path, title, description, ogAlt }: {
  lang: Lang; path: string; title: string; description: string; ogAlt?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: href(lang, path),
      languages: { "pt-BR": href("pt", path), en: href("en", path), "x-default": href("pt", path) }
    },
    openGraph: {
      type: "website",
      url: href(lang, path),
      title,
      description,
      locale: ogLocale(lang),
      alternateLocale: ogLocale(lang === "en" ? "pt" : "en"),
      siteName: "Pedro Provadelli",
      images: [{ ...OG_IMAGE, alt: ogAlt ?? title }]
    },
    twitter: { card: "summary_large_image", images: [OG_IMAGE.url] }
  };
}

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon-32.png", type: "image/png", sizes: "32x32" }],
    apple: "/apple-touch-icon.png"
  },
  verification: { google: "8B7v2AZ4nAn4hYupG0ftbxG3kS5an6nL5yj6rCqhlgE" }
};
