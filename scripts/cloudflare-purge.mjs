/**
 * Purga la caché de Cloudflare de tuchat.org.
 *
 *   CLOUDFLARE_EMAIL=... CLOUDFLARE_API_KEY=... node scripts/cloudflare-purge.mjs
 *
 * Desde el 5 de agosto de 2026 la zona tiene una Cache Rule que cachea el HTML
 * en el borde respetando el `s-maxage=3600` que manda Next (antes Cloudflare no
 * cacheaba HTML en absoluto: todo iba al origen con `cf-cache-status: DYNAMIC`).
 * El efecto secundario es que, tras un deploy, el borde puede seguir sirviendo
 * la versión anterior hasta una hora. Esto la tira de golpe.
 *
 * La autenticación va con la **Global API Key** (`X-Auth-Email` + `X-Auth-Key`),
 * no con `Authorization: Bearer`: el token del conector MCP es de solo lectura
 * para esta cuenta y no puede escribir reglas ni purgar.
 *
 * A PROPÓSITO no se ejecuta desde el VPS ni se guardan ahí las credenciales: la
 * Global API Key da acceso total a la cuenta de Cloudflare, y un checkout de
 * deploy no es sitio para eso. Se lanza a mano tras un cambio que deba verse ya.
 */
const ZONA = "4aaf803a5956835bb1e774eabac451dc"; // tuchat.org
const email = process.env.CLOUDFLARE_EMAIL;
const key = process.env.CLOUDFLARE_API_KEY;

if (!email || !key) {
  console.error("Faltan CLOUDFLARE_EMAIL y/o CLOUDFLARE_API_KEY en el entorno.");
  process.exit(1);
}

const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${ZONA}/purge_cache`, {
  method: "POST",
  headers: {
    "X-Auth-Email": email,
    "X-Auth-Key": key,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ purge_everything: true }),
});

const data = await res.json();
if (!data.success) {
  console.error("No se pudo purgar:", data.errors?.map((e) => e.message).join(" · "));
  process.exit(1);
}
console.log("Caché de Cloudflare purgada. El borde vuelve a pedir al origen en la siguiente visita.");
