/* ============================================================
   LYNUS TECH — Build do site
   - Landing (index.html): junta os .jsx do site num único app.bundle.js
   - Demos (crm.html, pcm.html...): cada <demo>.jsx vira <demo>.bundle.js
   Tudo já compilado e minificado, com o React de produção embutido
   (sem Babel no navegador). Rode após editar qualquer .jsx:  npm run bundle
   (não use "build": a Vercel roda esse nome sozinha e o deploy quebra)
   ============================================================ */
import { build } from "esbuild";
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";

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

/* ---- Pré-renderização da landing ----
   Gera o HTML da página no build e grava dentro do <div id="root"> do
   index.html, para Google, IAs e redes sociais lerem o conteúdo sem rodar
   JavaScript. No navegador, o app.bundle.js substitui esse HTML normalmente. */
const MOUNT = 'ReactDOM.createRoot(document.getElementById("root")).render(<App />);';
const appSrc = readFileSync("app.jsx", "utf8");
if (!appSrc.includes(MOUNT)) throw new Error("prerender: linha de montagem do app.jsx mudou");

const prerenderSrc = [
  PRELUDE,
  'import { renderToString } from "react-dom/server";',
  ...FILES.map((f) => {
    const code = readFileSync(f, "utf8");
    return f === "app.jsx"
      ? `{\n${code.replace(MOUNT, "globalThis.__html = renderToString(<App />);")}\n}`
      : code;
  }),
].join("\n");

const tmp = join(tmpdir(), `lynus-prerender-${Date.now()}.cjs`);
await build({
  ...OPTIONS,
  minify: false,
  platform: "node",
  format: "cjs",
  logLevel: "warning",
  stdin: entry(prerenderSrc, "lynus-prerender.jsx"),
  outfile: tmp,
});

// O código do site espera um navegador; no Node só precisa de stubs mínimos.
const noop = () => {};
globalThis.window = globalThis;
Object.assign(globalThis, {
  addEventListener: noop,
  removeEventListener: noop,
  innerWidth: 1280,
  innerHeight: 800,
  document: {
    documentElement: { style: { setProperty: noop }, clientHeight: 800 },
    body: { style: {}, classList: { add: noop, remove: noop }, setAttribute: noop },
    getElementById: () => null,
    querySelectorAll: () => [],
  },
});
createRequire(import.meta.url)(tmp);
rmSync(tmp, { force: true });

const ROOT = /<div id="root">[\s\S]*?<!--\/prerender--><\/div>|<div id="root"><\/div>/;
const index = readFileSync("index.html", "utf8");
if (!ROOT.test(index)) throw new Error('prerender: <div id="root"> não encontrado no index.html');
writeFileSync(
  "index.html",
  index.replace(ROOT, () => `<div id="root">${globalThis.__html}<!--/prerender--></div>`)
);
console.log(`\n  index.html pré-renderizado (${(globalThis.__html.length / 1024).toFixed(1)} KB de HTML)`);
