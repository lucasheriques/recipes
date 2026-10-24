// Sala única do jogo "Onde é isso?" (/onde-e-isso).
// Cada aba manda a própria "presença" (nome, resposta, e, pra quem comanda, o estado
// do jogo) e recebe a de todo mundo. O navegador faz polling a cada ~0,5s.
import { getStore } from "@netlify/blobs";

const STALE_MS = 15000; // some da sala quem não dá sinal há 15s
const MAX_PRESENCE = 8000;

export default async (req) => {
  if (req.method !== "POST") return new Response("use POST", { status: 405 });
  const body = await req.json().catch(() => null);
  const peer = body?.peer;
  if (typeof peer !== "string" || !/^[a-z0-9]{6,16}$/.test(peer)) {
    return new Response("peer inválido", { status: 400 });
  }

  const store = getStore({ name: "onde-e-isso", consistency: "strong" });
  const now = Date.now();

  if (body.presence && typeof body.presence === "object") {
    if (JSON.stringify(body.presence).length > MAX_PRESENCE) return new Response("presença grande demais", { status: 413 });
    await store.setJSON(`peers/${peer}`, { presence: body.presence, updatedAt: now });
  }

  const { blobs } = await store.list({ prefix: "peers/" });
  const peers = [];
  await Promise.all(
    blobs.map(async ({ key }) => {
      const entry = await store.get(key, { type: "json" });
      if (!entry) return;
      if (now - entry.updatedAt > STALE_MS) {
        await store.delete(key);
        return;
      }
      peers.push({ peer: key.slice("peers/".length), presence: entry.presence, updatedAt: entry.updatedAt });
    }),
  );

  return Response.json({ peers }, { headers: { "cache-control": "no-store" } });
};

export const config = { path: "/api/onde-e-isso" };
