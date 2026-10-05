/* ============================================================
   LYNUS TECH — Build da landing page (index.html)
   Junta os .jsx do site num único app.bundle.js já compilado e
   minificado, com o React de produção embutido. Rode após editar
   qualquer .jsx abaixo:  npm run build
   ============================================================ */
import { build } from "esbuild";
import { readFileSync } from "node:fs";

// Mesma ordem em que o index.html carregava os scripts.
const FILES = ["data.jsx", "dashboard.jsx", "sections.jsx", "app.jsx"];

const source = [
  'import * as React from "react";',
  'import * as ReactDOM from "react-dom/client";',
  "window.React = React;",
  // app.jsx vai num bloco próprio: ele redeclara nomes que o sections.jsx
  // já define (no navegador eram scripts separados).
  ...FILES.map((f) => {
    const code = readFileSync(f, "utf8");
    return `\n/* ---- ${f} ---- */\n` + (f === "app.jsx" ? `{\n${code}\n}` : code);
  }),
].join("\n");

await build({
  stdin: { contents: source, loader: "jsx", resolveDir: process.cwd(), sourcefile: "lynus-entry.jsx" },
  bundle: true,
  minify: true,
  format: "iife",
  target: ["es2018"],
  define: { "process.env.NODE_ENV": '"production"' },
  outfile: "app.bundle.js",
  logLevel: "info",
});
