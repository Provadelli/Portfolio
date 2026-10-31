# Portfólio — Pedro Provadelli

Site pessoal em **Next.js 16 (App Router) + React 19 + TypeScript**, com **Motion** para as animações
e **Tailwind CSS v4** para o estilo. Todas as páginas são geradas estaticamente e publicadas na Vercel.

## Comandos

```bash
npm install        # instala as dependências
npm run dev        # servidor de desenvolvimento (http://localhost:3000)
npm run build      # gera a versão de produção
npm run preview    # serve o build em http://localhost:4173
npm run lint       # ESLint (regras do Next + React Hooks)
npm run typecheck  # checagem de tipos
npm run audit      # Lighthouse em todas as páginas (com o preview rodando)
npm run images     # regenera as imagens WebP a partir dos originais em assets/
```

## Estrutura

```
src/app/[lang]/        páginas por idioma: / (português) e /en (inglês)
  layout.tsx           <html>, fontes, provedores, rodapé
  page.tsx             página inicial
  template.tsx         transição entre páginas
  privacidade/ termos/ acessibilidade/
src/app/global-not-found.tsx   404
src/app/sitemap.ts, robots.ts  gerados a partir do código
src/proxy.ts           1ª visita: redireciona para /en quem prefere inglês
src/components/
  home/                seções da página inicial (Hero, Sobre, Projetos/Carrossel, ...)
  layout/              cabeçalho, rodapé, seletor de idioma
  contact/             formulário, hCaptcha
  motion/              primitivas de animação (Reveal, Stagger, Magnetic)
  svg/                 logo, Torre de Pisa, bandeira, ícones
src/content/
  dictionaries/        textos da interface (pt.ts é a referência; en.ts é tipado contra ele)
  legal/               conteúdo das páginas legais nos dois idiomas
src/lib/               i18n, SEO, fontes, constantes do site
src/styles/globals.css tokens do Tailwind (@theme), componentes e animações em CSS
src/assets/img/        imagens otimizadas (geradas por `npm run images`)
assets/                imagens originais
public/                arquivos servidos como estão (favicons, imagem de compartilhamento)
```

## Design e animações

- **Visual:** base preto-café com dourado/âmbar, seções claras com grade técnica, tricolor italiano em detalhes.
  Fontes: Space Grotesk (títulos), Manrope (texto), JetBrains Mono (rótulos) e Fraunces itálico nos destaques.
- **Hero:** fundo WebGL2 próprio (`src/components/hero`) com ondas vítreas nas laterais. Ajusta a resolução ao
  custo medido na GPU, pausa fora da tela e congela num quadro estático em aparelhos fracos ou com "reduzir movimento".
- **Header:** pílula flutuante com o logo, some ao descer e volta ao subir. Rolagem suave com Lenis.
- **Projetos:** carrossel-lupa em WebGL (`LensCarousel.tsx` + `lens.glsl.ts`): faixa contínua plana no centro que se curva e estica ao passar pelas bordas da lente, com refração. Sem WebGL, vira lista rolável.
- **Serviços:** cards largos; com mouse, um painel com visual animado (SVG) segue o cursor.
- **Trajetória:** seção presa com rolagem horizontal e Torre de Pisa que endireita com o progresso.
- Primitivas em `src/components/motion` (Reveal, Stagger, SplitText, Magnetic, Spotlight, SmoothScroll).
  Tudo respeita "reduzir movimento" e, sem JavaScript, o conteúdo aparece completo.

## Notas

- **Idiomas:** português em `/`, inglês em `/en`. Para adicionar um texto, crie a chave em
  `src/content/dictionaries/pt.ts`; o TypeScript acusa se faltar em `en.ts`.
- **Endereços antigos** (`/privacidade.html`, etc.) redirecionam para os novos (`next.config.ts`).
- **Formulário:** enviado pelo Web3Forms, com hCaptcha carregado só perto do formulário.
  Cada mensagem leva a versão dos Termos e da Política aceitas, a data/hora e o idioma do aceite.
- **Documentos legais:** ao mudar os Termos ou a Política, atualize o texto em `src/content/legal/`
  e as versões `TERMS_VERSION` / `PRIVACY_VERSION` em `src/lib/site.ts`.
