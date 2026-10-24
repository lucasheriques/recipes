// Monta o jogo a partir de src/index.html com os lugares embutidos:
// - dist/index.html: versão Claude Artifact (o Artifact põe o <html>/<head> em volta)
// - ../public/onde-e-isso/index.html: página do site (Netlify), com polling em /api/onde-e-isso
// As fotos ficam em ../public/onde-e-isso/img (no artifact, publicadas como arquivos img/*.jpg).
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const places = JSON.parse(await readFile(new URL("data/places.json", root), "utf8"));
const imgDir = new URL("../public/onde-e-isso/img/", root);
const missing = places.filter((p) => !existsSync(new URL(`${p.id}.jpg`, imgDir)));
if (missing.length) console.warn(`sem foto (ficam de fora): ${missing.map((p) => p.name).join(", ")}`);

const data = places
  .filter((p) => !missing.includes(p))
  .map((p) => ({
    id: p.id, w: p.where, uf: p.uf, n: p.name, t: p.type, d: p.diff, f: p.fact,
    cr: `${p.image.author}${p.image.license ? ` (${p.image.license})` : ""}`, src: p.image.page,
  }));

const tpl = await readFile(new URL("src/index.html", root), "utf8");
const html = tpl.replace("/*__PLACES__*/[]", JSON.stringify(data).replace(/</g, "\\u003c"));
await mkdir(new URL("dist/", root), { recursive: true });
await writeFile(new URL("dist/index.html", root), html);

// Página do site: tudo antes do #app vai pro <head>.
const split = html.indexOf('<div id="app">');
const site = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<base href="/onde-e-isso/">
<meta name="theme-color" content="#0e2a2b">
<meta name="description" content="Aparece uma foto do Brasil e cada um chuta a cidade no próprio celular. Quem acerta mais rápido leva mais ponto.">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📍</text></svg>">
<style>[hidden]{display:none!important}body{margin:0}img{max-width:100%}</style>
${html.slice(0, split)}
</head>
<body>
${html.slice(split)}
</body>
</html>
`;
await writeFile(new URL("../public/onde-e-isso/index.html", root), site);
console.log(`${data.length} lugares · artifact ${(html.length / 1024).toFixed(0)} KB · site ${(site.length / 1024).toFixed(0)} KB`);
