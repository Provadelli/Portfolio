# Portfólio — Pedro Provadelli

Site pessoal em HTML + Tailwind CSS v4, empacotado com Vite e publicado na Vercel.

## Comandos

```bash
npm install        # instala as dependências
npm run dev        # servidor de desenvolvimento (http://localhost:5173)
npm run build      # gera a versão de produção em dist/
npm run preview    # serve o dist/ em http://localhost:4173
npm run audit      # Lighthouse em todas as páginas (com o preview rodando)
npm run images     # regenera as imagens WebP a partir dos originais em assets/
```

## Estrutura

```
index.html, privacidade.html, termos.html, acessibilidade.html, 404.html
partials/          trechos de HTML reutilizados (<!-- @include nome -->): cabeçalho,
                   rodapé, logo, Torre de Pisa, bandeira, seletor de idioma
src/styles/        main.css: tokens do Tailwind (@theme), componentes e animações
src/js/            módulos (loader, header, carrossel, formulário, hCaptcha, i18n)
src/js/pages/      ponto de entrada de cada página
src/i18n/          traduções em inglês, separadas por página
src/assets/img/    imagens otimizadas usadas no site (geradas por `npm run images`)
assets/            imagens originais (fonte das versões otimizadas)
public/            arquivos servidos como estão (favicons, robots.txt, sitemap.xml)
```

## Notas

- **Idiomas:** o português fica no HTML (`data-i18n`); o inglês, em `src/i18n/*.en.js`.
- **Formulário:** enviado pelo Web3Forms, com hCaptcha carregado só perto do formulário.
  Cada mensagem leva a versão dos Termos e da Política aceitas, a data/hora e o idioma do aceite.
- **Documentos legais:** ao mudar os Termos ou a Política, atualize a data no topo da página
  e os campos `consent_terms_version` / `consent_privacy_version` em `index.html`.
