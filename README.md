<div align="center">

<img src="public/og-pedro.jpg" alt="Portfólio de Pedro Provadelli" width="720" />

# Portfólio — Pedro Provadelli

**Engenheiro de software full stack com IA.** Sites, sistemas e automações que funcionam no mundo real.

[![Site no ar](https://img.shields.io/badge/site-no%20ar-E0BE72?style=for-the-badge&logo=vercel&logoColor=black)](https://pedroprovadelli.com.br)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

[**Ver o site**](https://pedroprovadelli.com.br) · [LinkedIn](https://linkedin.com/in/pedroprovadellidev/) · [GitHub](https://github.com/Provadelli)

</div>

---

## Sobre o projeto

Site pessoal bilíngue (português e inglês) em **Next.js 16 (App Router)**, com todas as páginas geradas estaticamente e publicadas na Vercel. O visual é preto-café com dourado e âmbar, com toques do tricolor italiano, e as animações respeitam quem prefere menos movimento.

## Destaques

| | |
|---|---|
| **Hero em WebGL2** | Fundo próprio com faixas de vidro nas laterais. Segue a densidade de pixels da tela, mede o custo na GPU, pausa fora da tela e congela num quadro estático em aparelhos fracos. |
| **Carrossel-lupa de projetos** | Faixa contínua em WebGL que fica plana no centro e se curva ao passar pelas bordas, com refração. Sem WebGL, vira uma lista rolável. |
| **Carregamento rápido** | Tela de abertura minimalista (cerca de 1 s) exibida só na primeira visita da sessão. |
| **Trajetória interativa** | Seção presa com rolagem horizontal e uma Torre de Pisa que endireita conforme o progresso. |
| **Acessibilidade (WCAG 2.2)** | Botão de pausa para animações, foco visível, contraste revisado e conteúdo completo mesmo sem JavaScript. |
| **Descoberta por buscadores e IA** | Dados estruturados (JSON-LD), sitemap, `robots.txt`, `llms.txt` e `llms-full.txt` gerados a partir dos mesmos dados dos projetos. |

## Projetos em destaque

Os projetos mostrados no carrossel ficam em [`src/content/projects.ts`](src/content/projects.ts), que também alimenta os dados estruturados e o `llms.txt`.

- [**Pelé Next Gen**](https://pelenextgen.vercel.app/) — plataforma esportiva que conecta atletas, clubes e oportunidades.
- [**Atelier Residences**](https://imobiliaria-atelier.vercel.app/) — site de um empreendimento imobiliário de alto padrão.
- [**Shinatal**](https://shinatal.shinerio.com) — experiência digital que transforma contratos em recompensa para a equipe.
- [**Viela Tech**](https://viela-tech-three.vercel.app/) — plataforma de saúde civil para a Rocinha, com triagem de tosse, sensor nas vielas e mapa de tuberculose.
- [**Orto Fortino**](https://ortofortino.vercel.app/) — sistema de gestão para oficina de órteses funcionais (acesso restrito à equipe).

## Stack

| Camada | Tecnologias |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), React 19 |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS v4 (tokens em `@theme`) |
| Animação | Motion, Lenis (rolagem suave), WebGL2 com GLSL próprio |
| Imagens | `sharp` (WebP otimizado a partir dos originais) |
| Qualidade | ESLint, `tsc`, Lighthouse |
| Formulário | Web3Forms com hCaptcha carregado só perto do formulário |
| Hospedagem | Vercel |

## Começando

Requer **Node.js 20.9 ou superior**.

```bash
git clone https://github.com/Provadelli/Portfolio.git
cd Portfolio
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Comandos

```bash
npm run dev        # servidor de desenvolvimento
npm run build      # versão de produção
npm run preview    # serve o build em http://localhost:4173
npm run lint       # ESLint (regras do Next + React Hooks)
npm run typecheck  # checagem de tipos
npm run audit      # Lighthouse em todas as páginas (com o preview rodando)
npm run images     # regenera os WebP a partir dos originais em assets/
```

## Estrutura

```
src/
├── app/
│   ├── [lang]/              páginas por idioma: / (português) e /en (inglês)
│   │   └── privacidade/ termos/ acessibilidade/
│   ├── global-not-found.tsx 404
│   ├── sitemap.ts · robots.ts · llms.txt · llms-full.txt
├── proxy.ts                 1ª visita: redireciona para /en quem prefere inglês
├── components/
│   ├── home/                seções da página inicial (Hero, Sobre, Projetos, Serviços, ...)
│   ├── hero/                fundo WebGL2 do hero
│   ├── layout/              cabeçalho, rodapé, seletor de idioma
│   ├── contact/             formulário e hCaptcha
│   ├── motion/              primitivas de animação (Reveal, Stagger, Magnetic, ...)
│   └── svg/                 logo, Torre de Pisa, bandeira, ícones
├── content/
│   ├── dictionaries/        textos da interface (pt.ts é a referência; en.ts é tipado contra ele)
│   ├── legal/               páginas legais nos dois idiomas
│   └── projects.ts          fonte única dos projetos
├── lib/                     i18n, SEO, fontes, constantes do site
├── styles/globals.css       tokens, componentes e animações
└── assets/img/              imagens otimizadas (geradas por `npm run images`)
assets/                      imagens originais
public/                      favicons e imagem de compartilhamento
```

## Como adicionar um projeto

1. Salve os prints em `assets/` e adicione-os à lista de `scripts/optimize-images.mjs`.
2. Rode `npm run images` para gerar os WebP em `src/assets/img/`.
3. Crie as chaves de texto em `src/content/dictionaries/pt.ts` (o TypeScript acusa se faltar em `en.ts`).
4. Inclua o projeto em `src/content/projects.ts`. O carrossel, o JSON-LD, o sitemap e o `llms.txt` se atualizam sozinhos.

## Notas

- **Idiomas:** português em `/`, inglês em `/en`.
- **Endereços antigos** (`/privacidade.html`, etc.) redirecionam para os novos em `next.config.ts`.
- **Formulário:** cada mensagem leva a versão dos Termos e da Política aceitas, a data/hora e o idioma do aceite.
- **Documentos legais:** ao mudar os Termos ou a Política, atualize `src/content/legal/` e as versões `TERMS_VERSION` / `PRIVACY_VERSION` em `src/lib/site.ts`.

## Contato

**Pedro Lucas Provadelli** · Engenharia de Software na FIAP

[LinkedIn](https://linkedin.com/in/pedroprovadellidev/) · [GitHub](https://github.com/Provadelli) · [Site](https://pedroprovadelli.com.br)
