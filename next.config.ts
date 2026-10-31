import type { NextConfig } from "next";

const LEGAL = "privacidade|termos|acessibilidade";

const nextConfig: NextConfig = {
  experimental: { globalNotFound: true },
  images: { formats: ["image/avif", "image/webp"], qualities: [75, 85] },
  poweredByHeader: false,

  // português na raiz (/), inglês em /en. Internamente as duas línguas vivem em app/[lang]
  async rewrites(){
    return {
      beforeFiles: [
        { source: "/", destination: "/pt" },
        { source: `/:page(${LEGAL})`, destination: "/pt/:page" }
      ]
    };
  },

  // endereços do site antigo (.html) e o prefixo /pt continuam funcionando
  async redirects(){
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/404.html", destination: "/404", permanent: true },
      { source: `/:page(${LEGAL}).html`, destination: "/:page", permanent: true },
      { source: "/pt", destination: "/", permanent: true },
      { source: "/pt/:path*", destination: "/:path*", permanent: true }
    ];
  },

  async headers(){
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
      ]
    }];
  }
};

export default nextConfig;
