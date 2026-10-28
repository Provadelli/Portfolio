import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = import.meta.dirname;
const PARTIALS = resolve(root, "partials");

/* HTML partials, so shared code is written only once.
   Syntax:  <!-- @include name key="value" -->  ->  contents of partials/name.html,
   with every {{key}} replaced by "value". Partials can include other partials. */
const INCLUDE = /<!--\s*@include\s+([\w-]+)((?:\s+[\w-]+="[^"]*")*)\s*-->/g;
const ATTR = /([\w-]+)="([^"]*)"/g;

function include(html, depth = 0){
  if (depth > 10) throw new Error("partials: inclusão recursiva demais");
  return html.replace(INCLUDE, (_, name, rawAttrs) => {
    const vars = Object.fromEntries([...rawAttrs.matchAll(ATTR)].map(m => [m[1], m[2]]));
    const body = readFileSync(resolve(PARTIALS, `${name}.html`), "utf8")
      .replace(/\{\{(\w+)\}\}/g, (__, k) => vars[k] ?? "");
    return include(body, depth + 1);
  });
}

const partials = () => ({
  name: "html-partials",
  transformIndexHtml: { order: "pre", handler: (html) => include(html) },
  configureServer(server){
    server.watcher.add(PARTIALS);
    server.watcher.on("change", (file) => {
      if (file.startsWith(PARTIALS)) server.ws.send({ type: "full-reload" });
    });
  }
});

// only builds the pages that exist (termos.html is still being created)
const pages = ["index", "privacidade", "termos", "acessibilidade", "404"]
  .filter(p => existsSync(resolve(root, `${p}.html`)));

export default defineConfig({
  plugins: [partials(), tailwindcss()],
  build: {
    rollupOptions: {
      input: Object.fromEntries(pages.map(p => [p, resolve(root, `${p}.html`)]))
    },
    assetsInlineLimit: 2048
  }
});
