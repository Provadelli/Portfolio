/* Auditoria de todas as páginas com o Lighthouse (que usa o axe-core para acessibilidade).
   Uso: npm run build && npm run preview  (em outro terminal)  ->  npm run audit
   Falha (exit 1) se Acessibilidade, Boas práticas ou SEO ficarem abaixo de 100. */
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const BASE = process.env.AUDIT_URL || "http://localhost:4173";
const PAGES = ["/", "/privacidade.html", "/termos.html", "/acessibilidade.html", "/404.html"];
const REQUIRED = ["accessibility", "best-practices", "seo"];

const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless=new"] });
let failed = false;
try {
  for (const page of PAGES){
    const { lhr } = await lighthouse(BASE + page, {
      port: chrome.port, output: "json", logLevel: "error",
      onlyCategories: ["performance", ...REQUIRED]
    });
    const scores = Object.values(lhr.categories).map(c => `${c.title}: ${Math.round(c.score * 100)}`).join(" | ");
    console.log(`${page.padEnd(22)} ${scores}`);
    // a 404 tem "noindex" de propósito: não cobra SEO dela
    for (const id of REQUIRED.filter(id => !(page === "/404.html" && id === "seo"))){
      const cat = lhr.categories[id];
      if (cat.score < 1){
        failed = true;
        cat.auditRefs
          .filter(r => r.weight > 0 && lhr.audits[r.id].score !== null && lhr.audits[r.id].score < 1)
          .forEach(r => console.log(`   ✗ [${id}] ${lhr.audits[r.id].title}`));
      }
    }
  }
} finally {
  await chrome.kill();
}
process.exit(failed ? 1 : 0);
