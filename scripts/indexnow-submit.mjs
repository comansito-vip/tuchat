/**
 * Envío MASIVO a IndexNow de todas las URLs de los sitemaps del sitio.
 * Recorre el índice /sitemap.xml, entra en cada sub-sitemap (los <loc> que
 * terminan en .xml) y manda todos los <loc> de página (deduplicados).
 *
 * Uso:  node scripts/indexnow-submit.mjs [https://www.tuchat.org]
 * Pensado para correr a diario por cron, después de los crons de contenido.
 */
import { submitUrls, SITE_ORIGIN } from "./indexnow.mjs";

const BASE = (process.argv[2] || SITE_ORIGIN).replace(/\/$/, "");

async function locs(url) {
  const res = await fetch(url, { headers: { "User-Agent": "tuchat-indexnow/1.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function main() {
  const indice = await locs(`${BASE}/sitemap.xml`);
  // Los <loc> que apuntan a otro .xml son sub-sitemaps; el resto ya son páginas.
  const subs = indice.filter((u) => u.endsWith(".xml"));
  const paginas = indice.filter((u) => !u.endsWith(".xml"));
  const urls = [...paginas];
  for (const s of subs) {
    try {
      const u = await locs(s);
      urls.push(...u);
      console.log(`${s} -> ${u.length}`);
    } catch (e) {
      console.log(`${s} ERROR ${e.message}`);
    }
  }
  const unicas = [...new Set(urls)];
  console.log(`Total URLs únicas: ${unicas.length}`);
  const r = await submitUrls(unicas, { log: (m) => console.log(m) });
  console.log("Resultado:", JSON.stringify(r));
}

main().catch((e) => {
  console.error("ERROR FATAL:", e);
  process.exit(1);
});
