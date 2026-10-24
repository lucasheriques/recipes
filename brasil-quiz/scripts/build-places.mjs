// Resolve a foto de cada lugar via API da Wikipédia/Wikimedia Commons
// e gera src/places.gen.json (consumido pelo Worker).
//
// Uso: node scripts/build-places.mjs [--thumbs <dir>]
//   --thumbs baixa miniaturas pra conferir as fotos visualmente.

import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { places } from "../data/places.mjs";

const UA = "BrasilQuiz/1.0 (jogo de adivinhar lugares; https://github.com/lucasheriques/recipes)";
const WIDTH = 1600;
const thumbsDir = process.argv.includes("--thumbs")
  ? process.argv[process.argv.indexOf("--thumbs") + 1]
  : null;

async function getJSON(url) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url, { headers: { "user-agent": UA } });
    if (res.ok) return res.json();
    await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
  }
  throw new Error(`falhou: ${url}`);
}

function stripHtml(s = "") {
  return s.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

async function leadImageFile(title) {
  const u = new URL("https://pt.wikipedia.org/w/api.php");
  u.search = new URLSearchParams({
    action: "query", format: "json", redirects: "1",
    prop: "pageimages", piprop: "name", titles: title,
  });
  const data = await getJSON(u);
  const page = Object.values(data.query.pages)[0];
  if (page.missing !== undefined) throw new Error(`artigo não existe: ${title}`);
  if (!page.pageimage) throw new Error(`artigo sem imagem: ${title}`);
  return page.pageimage;
}

async function commonsInfo(file) {
  const u = new URL("https://commons.wikimedia.org/w/api.php");
  u.search = new URLSearchParams({
    action: "query", format: "json", titles: `File:${file}`,
    prop: "imageinfo", iiprop: "url|extmetadata|size", iiurlwidth: String(WIDTH),
  });
  const data = await getJSON(u);
  const page = Object.values(data.query.pages)[0];
  const info = page.imageinfo?.[0];
  if (!info) throw new Error(`arquivo não encontrado no Commons: ${file}`);
  const meta = info.extmetadata ?? {};
  return {
    url: info.thumburl ?? info.url,
    width: info.thumbwidth ?? info.width,
    height: info.thumbheight ?? info.height,
    page: info.descriptionurl,
    author: stripHtml(meta.Artist?.value).slice(0, 80) || "desconhecido",
    license: stripHtml(meta.LicenseShortName?.value) || "",
  };
}

const out = [];
const problems = [];
for (const p of places) {
  await new Promise((r) => setTimeout(r, 700));
  try {
    const file = p.file ?? (await leadImageFile(p.wiki));
    const info = await commonsInfo(file);
    const id = createHash("sha256").update(`brasil-quiz:${p.name}`).digest("hex").slice(0, 12);
    out.push({ id, where: p.where, uf: p.uf, name: p.name, state: p.state, type: p.type, diff: p.diff, fact: p.fact, file, image: info });
    console.log(`ok   ${p.name.padEnd(36)} ${file} (${info.width}x${info.height})`);
    if (thumbsDir) {
      await mkdir(thumbsDir, { recursive: true });
      const res = await fetch(info.url.replace(`/${WIDTH}px-`, "/330px-"), { headers: { "user-agent": UA } });
      await writeFile(`${thumbsDir}/${String(out.length).padStart(3, "0")}.jpg`, Buffer.from(await res.arrayBuffer()));
    }
  } catch (e) {
    problems.push(`${p.name}: ${e.message}`);
    console.log(`ERRO ${p.name}: ${e.message}`);
  }
}

const names = new Set();
for (const p of out) {
  if (names.has(p.name)) problems.push(`nome duplicado: ${p.name}`);
  names.add(p.name);
}

await writeFile(new URL("./places.json", new URL("../data/", import.meta.url)), JSON.stringify(out, null, 2) + "\n");
console.log(`\n${out.length} lugares gravados.`);
if (problems.length) {
  console.log(`\nProblemas:\n- ${problems.join("\n- ")}`);
  process.exitCode = 1;
}
