/**
 * Envío de URLs a IndexNow (Bing, Yandex, Seznam, Naver… vía api.indexnow.org).
 * La clave se sirve como texto plano en https://<host>/<KEY>.txt (fichero en
 * public/, que Next sirve en la raíz del dominio). Un mismo endpoint propaga a
 * todos los buscadores del consorcio; Google no participa (usa su sitemap).
 *
 * Idempotente y tolerante a fallos: NO lanza — devuelve el resultado para que
 * el cron que la use no se rompa si IndexNow está caído.
 */
const KEY = process.env.INDEXNOW_KEY || "d5b2af83b1d77a60df27dc366724ae45";
const HOST = process.env.INDEXNOW_HOST || "www.tuchat.org";
const ENDPOINT = "https://api.indexnow.org/indexnow";
const LOTE_MAX = 10000; // límite del protocolo por request

export const INDEXNOW_KEY = KEY;
export const SITE_ORIGIN = `https://${HOST}`;

/**
 * Envía URLs (del mismo host) a IndexNow, en lotes de hasta 10.000.
 * @param {string[]} urls
 * @param {{log?: (m:string)=>void}} opts
 * @returns {Promise<Array<{ok:boolean,status:number,enviadas:number,error?:string}>>}
 */
export async function submitUrls(urls, { log = () => {} } = {}) {
  const lista = [...new Set((urls || []).filter((u) => typeof u === "string" && u.startsWith("http")))];
  if (!lista.length) {
    log("IndexNow: nada que enviar");
    return [{ ok: true, status: 0, enviadas: 0 }];
  }
  const resultados = [];
  for (let i = 0; i < lista.length; i += LOTE_MAX) {
    const lote = lista.slice(i, i + LOTE_MAX);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          host: HOST,
          key: KEY,
          keyLocation: `${SITE_ORIGIN}/${KEY}.txt`,
          urlList: lote,
        }),
      });
      log(`IndexNow: ${lote.length} URLs -> HTTP ${res.status}`);
      resultados.push({ ok: res.ok, status: res.status, enviadas: lote.length });
    } catch (e) {
      log(`IndexNow ERROR: ${e.message}`);
      resultados.push({ ok: false, status: 0, enviadas: lote.length, error: e.message });
    }
  }
  return resultados;
}
