// Monta dist/index.html: o template src/index.html com os lugares embutidos.
// As fotos (public/img) são publicadas junto, como arquivos do artifact.
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const places = JSON.parse(await readFile(new URL("data/places.json", root), "utf8"));
const missing = places.filter((p) => !existsSync(new URL(`public/img/${p.id}.jpg`, root)));
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
console.log(`dist/index.html: ${data.length} lugares, ${(html.length / 1024).toFixed(0)} KB`);
