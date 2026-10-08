/* ============================================================
   LYNUS TECH — Build do site
   - Landing (index.html): junta os .jsx do site num único app.bundle.js
   - Demos (crm.html, pcm.html...): cada <demo>.jsx vira <demo>.bundle.js
   Tudo já compilado e minificado, com o React de produção embutido
   (sem Babel no navegador). Rode após editar qualquer .jsx:  npm run bundle
   (não use "build": a Vercel roda esse nome sozinha e o deploy quebra)
   ============================================================ */
import { build } from "esbuild";
import { readFileSync } from "node:fs";

// Mesma ordem em que o index.html carregava os scripts.
const FILES = ["data.jsx", "dashboard.jsx", "sections.jsx", "app.jsx"];

// Páginas de demonstração: <nome>.html carrega <nome>.bundle.js
const DEMOS = ["compras", "crm", "estoque", "faturamento", "financeiro", "fintech", "fundflow", "pcm", "rh"];

// Os .jsx usam React/ReactDOM como globais (eram carregados por CDN).
const PRELUDE = [
  'import * as React from "react";',
  'import * as ReactDOM from "react-dom/client";',
  "window.React = React;",
].join("\n");

const OPTIONS = {
  bundle: true,
  minify: true,
  format: "iife",
  target: ["es2018"],
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "info",
};

const entry = (contents, sourcefile) => ({ contents, loader: "jsx", resolveDir: process.cwd(), sourcefile });

const landing = [
  PRELUDE,
  // app.jsx vai num bloco próprio: ele redeclara nomes que o sections.jsx
  // já define (no navegador eram scripts separados).
  ...FILES.map((f) => {
    const code = readFileSync(f, "utf8");
    return `\n/* ---- ${f} ---- */\n` + (f === "app.jsx" ? `{\n${code}\n}` : code);
  }),
].join("\n");

await Promise.all([
  build({ ...OPTIONS, stdin: entry(landing, "lynus-entry.jsx"), outfile: "app.bundle.js" }),
  ...DEMOS.map((d) =>
    build({
      ...OPTIONS,
      stdin: entry(`${PRELUDE}\n${readFileSync(`${d}.jsx`, "utf8")}`, `${d}.jsx`),
      outfile: `${d}.bundle.js`,
    })
  ),
]);
