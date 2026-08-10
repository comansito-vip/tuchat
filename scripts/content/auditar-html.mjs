/**
 * Auditoría de SEO, estructura y accesibilidad sobre el HTML YA GENERADO.
 *
 *   npm run build && node scripts/content/auditar-html.mjs
 *
 * Complementa a `auditar-contenido.ts`, que mira los datos de origen: esta mira
 * lo que de verdad sale al navegador, que es donde aparecen los fallos que los
 * datos no pueden delatar —un footer con <h3> que rompe la jerarquía en las
 * páginas sin h2, una meta description que se pasa de largo tras un cambio de
 * plantilla, un canonical repetido entre dos rutas—.
 *
 * Recorre las ~4.950 páginas prerenderizadas sin tocar la red, así que es
 * barata de repetir. Comprueba por página: <title> y meta description (presencia
 * y longitud), canonical, un solo <h1>, al menos un <h2>, jerarquía de
 * encabezados sin saltos, encabezados vacíos, <img> sin alt, enlaces sin nombre
 * accesible, JSON-LD parseable y con @type, texto roto (undefined/NaN/[object
 * Object]) y peso. Y sobre el conjunto: títulos, H1, descripciones y canonical
 * duplicados a escala, más el grafo de enlaces internos —enlaces a páginas que
 * no existen y páginas huérfanas—.
 *
 * Lo del grafo se añadió después de la auditoría del 2026-08-10, que encontró
 * 76 enlaces a 404 y 20 huérfanas con todo lo demás en verde: son fallos que no
 * se ven mirando una página aislada, por buena que esté.
 *
 * FALSOS POSITIVOS CONOCIDOS, no son fallos:
 *   - /resultados y /admin salen sin canonical, sin h1 y compartiendo metadatos:
 *     el primero es un `permanentRedirect` (responde 308) y el segundo un 401.
 *     Next genera igualmente un HTML stub para ambos y es ese stub el que se
 *     audita. Ninguno está en el sitemap.
 *   - Los títulos de /noticias/articulo/* pasan de 65 caracteres a propósito:
 *     son titulares y el proyecto decidió no truncarlos (data.test.ts los admite
 *     hasta 110).
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const RAIZ = ".next/server/app";
const archivos = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else if (e.endsWith(".html")) archivos.push(p);
  }
})(RAIZ);

/**
 * Rutas que Next prerenderiza como stub aunque nunca sirvan ese HTML: la de
 * redirección responde 308 y la de admin 401. Ninguna está en el sitemap, así
 * que sus metadatos "ausentes" no son un fallo. Se excluyen para que el informe
 * pueda quedar en cero y sirva de puerta de calidad: uno que siempre marca los
 * mismos cinco avisos inevitables acaba sin que nadie lo lea.
 */
const STUBS = ["/admin", "/resultados", "/_not-found", "/_global-error"];

/**
 * Rutas que existen y responden 200 pero que Next NO prerenderiza, así que no
 * dejan .html en disco: /webchat depende de searchParams y las de resultados
 * declaran `dynamic = "force-dynamic"` porque piden la clasificación en vivo.
 * Sin esta lista, el grafo de enlaces las daría por rotas en las 4.991 páginas.
 */
const DINAMICAS = new Set([
  "/webchat",
  "/chat",
  ...["laliga", "premier", "seriea", "ligamx", "bundesliga", "ligue1", "argentina", "brasileirao", "mls", "saudi"].map(
    (l) => `/resultados/${l}`,
  ),
]);

/** Los titulares de noticias pasan de 65 a propósito (data.test.ts admite 110). */
const esArticulo = (u) => u.startsWith("/noticias/articulo/");

const problemas = [];
const add = (u, sev, msg) => problemas.push({ u, sev, msg });

// Grafo de enlaces internos. Es lo que destapó, en la auditoría del 2026-08-10,
// 76 enlaces a páginas que respondían 404 y 20 páginas huérfanas: ninguna de las
// dos cosas se ve mirando una página aislada, que es como mira todo lo demás de
// este fichero.
const h1s = new Map();
const salientes = new Map();
const entrantes = new Map();
const urls = new Set();

const titles = new Map();
const descs = new Map();
const canons = new Map();
let pesoMax = { u: "", n: 0 };
let sumaPeso = 0;

for (const f of archivos) {
  const url = "/" + relative(RAIZ, f).replace(/\.html$/, "").replace(/^index$/, "");
  if (STUBS.includes(url)) continue;
  const html = readFileSync(f, "utf8");
  sumaPeso += html.length;
  if (html.length > pesoMax.n) pesoMax = { u: url, n: html.length };

  const v = html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "");
  const esError = /_not-found|_global-error/.test(url);

  // title
  const title = (v.match(/<title>([\s\S]*?)<\/title>/i) ?? [])[1]?.trim();
  if (!title) add(url, "ALTO", "sin <title>");
  else {
    const maxTitulo = esArticulo(url) ? 110 : 65;
    if (title.length > maxTitulo) add(url, "MEDIO", `title ${title.length} chars`);
    (titles.get(title) ?? titles.set(title, []).get(title)).push(url);
  }

  // description
  const dTag = (v.match(/<meta name="description"[^>]*>/i) ?? [])[0];
  const desc = dTag && (dTag.match(/content="([^"]*)"/i) ?? [])[1];
  if (!desc) { if (!esError) add(url, "ALTO", "sin meta description"); }
  else {
    if (desc.length > 170) add(url, "MEDIO", `description ${desc.length} chars`);
    if (desc.length < 70) add(url, "BAJO", `description ${desc.length} chars`);
    (descs.get(desc) ?? descs.set(desc, []).get(desc)).push(url);
  }

  // canonical
  const cTag = (v.match(/<link rel="canonical"[^>]*>/i) ?? [])[0];
  const canon = cTag && (cTag.match(/href="([^"]*)"/i) ?? [])[1];
  if (!esError && !canon) add(url, "ALTO", "sin canonical");
  else if (canon) (canons.get(canon) ?? canons.set(canon, []).get(canon)).push(url);

  // h1 y jerarquía
  const heads = [...v.matchAll(/<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi)].map((m) => ({
    n: Number(m[1][1]),
    t: m[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(),
  }));
  const h1 = heads.filter((h) => h.n === 1);
  if (h1.length === 0) add(url, "ALTO", "sin <h1>");
  else if (h1.length > 1) add(url, "ALTO", `${h1.length} <h1>`);
  else (h1s.get(h1[0].t) ?? h1s.set(h1[0].t, []).get(h1[0].t)).push(url);
  if (heads.filter((h) => h.n === 2).length === 0) add(url, "MEDIO", "sin ningún <h2>");
  for (let i = 1; i < heads.length; i++)
    if (heads[i].n > heads[i - 1].n + 1)
      add(url, "MEDIO", `salto h${heads[i - 1].n}→h${heads[i].n} ("${heads[i].t.slice(0, 30)}")`);
  if (heads.some((h) => !h.t)) add(url, "MEDIO", "encabezado vacío");

  // imgs sin alt
  const imgs = [...v.matchAll(/<img[^>]*>/gi)].map((m) => m[0]);
  const sinAlt = imgs.filter((i) => !/\salt=/i.test(i));
  if (sinAlt.length) add(url, "ALTO", `${sinAlt.length} <img> sin alt`);

  // enlaces internos, para el grafo
  urls.add(url);
  const destinos = new Set();
  for (const m of v.matchAll(/href="(\/[^"#?]*)"/g)) {
    const d = m[1].length > 1 && m[1].endsWith("/") ? m[1].slice(0, -1) : m[1];
    if (/\.(png|jpg|jpeg|svg|xml|txt|ico|webmanifest|json|js|css|woff2?)$/i.test(d)) continue;
    if (d.startsWith("/_next") || d.startsWith("/api")) continue;
    destinos.add(d);
  }
  salientes.set(url, destinos);

  // enlaces sin texto accesible
  const mudos = [...v.matchAll(/<a\s[^>]*href[^>]*>([\s\S]*?)<\/a>/gi)].filter((m) => {
    const dentro = m[1].replace(/<[^>]+>/g, "").trim();
    return !dentro && !/aria-label=|title=/i.test(m[0]);
  });
  if (mudos.length) add(url, "ALTO", `${mudos.length} enlaces sin nombre accesible`);

  // JSON-LD válido, y sin repetir el mismo bloque dos veces en la misma página.
  // Los tipos que sí pueden aparecer varias veces con contenido distinto
  // (ItemList: uno por listado de la página) se comparan por su JSON completo,
  // así que solo salta cuando el bloque es literalmente el mismo. Lo destapó
  // /como-funciona, que emitía su BreadcrumbList a mano además del que ya pinta
  // el componente Breadcrumbs.
  const bloques = new Map();
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const d = JSON.parse(m[1]);
      if (!d["@type"]) add(url, "MEDIO", "JSON-LD sin @type");
      bloques.set(m[1], (bloques.get(m[1]) ?? 0) + 1);
    } catch { add(url, "ALTO", "JSON-LD no parseable"); }
  }
  for (const [bloque, n] of bloques)
    if (n > 1) {
      const tipo = (JSON.parse(bloque)["@type"]) ?? "?";
      add(url, "MEDIO", `JSON-LD ${tipo} repetido ${n} veces en la misma página`);
    }

  // texto roto
  if (/\bundefined\b|\bNaN\b|\[object Object\]|\bnull\b/.test(v))
    add(url, "ALTO", "texto roto visible");

  // peso
  if (html.length > 1_500_000) add(url, "MEDIO", `pesa ${(html.length / 1e6).toFixed(2)} MB`);
}

// ── Grafo de enlaces internos ───────────────────────────────────────────────
// Un enlace a 404 desde una página indexable gasta rastreo y no lleva a ningún
// sitio; una página que solo conoce el sitemap es, para Google, una página a la
// que su propio autor no considera digna de enlazar.
const rotos = new Map();
for (const [origen, destinos] of salientes) {
  for (const d of destinos) {
    if (!urls.has(d) && !DINAMICAS.has(d) && !STUBS.includes(d)) {
      (rotos.get(d) ?? rotos.set(d, []).get(d)).push(origen);
      continue;
    }
    if (d === origen) continue;
    (entrantes.get(d) ?? entrantes.set(d, new Set()).get(d)).add(origen);
  }
}
for (const [d, origenes] of [...rotos].sort((a, b) => b[1].length - a[1].length))
  add(origenes[0], "ALTO", `enlaza a ${d}, que no existe (desde ${origenes.length} pág.)`);

for (const u of urls)
  if (u !== "/" && !STUBS.includes(u) && !entrantes.has(u))
    add(u, "MEDIO", "huérfana: ninguna página del sitio la enlaza");

// duplicados a escala
for (const [t, us] of h1s) if (us.length > 1) add(us[0], "ALTO", `<h1> repetido en ${us.length}: "${t.slice(0, 50)}" → ${us.slice(0, 4).join(", ")}`);
for (const [t, us] of titles) if (us.length > 1) add(us[0], "ALTO", `<title> repetido en ${us.length}: "${t.slice(0, 50)}" → ${us.slice(0, 4).join(", ")}`);
for (const [d, us] of descs) if (us.length > 1) add(us[0], "ALTO", `description repetida en ${us.length}: "${d.slice(0, 45)}" → ${us.slice(0, 4).join(", ")}`);
for (const [c, us] of canons) if (us.length > 1) add(us[0], "ALTO", `canonical repetido en ${us.length}: ${c} → ${us.slice(0, 4).join(", ")}`);

const orden = { ALTO: 0, MEDIO: 1, BAJO: 2 };
problemas.sort((a, b) => orden[a.sev] - orden[b.sev]);

console.log(`\n${archivos.length} páginas · peso medio ${(sumaPeso / archivos.length / 1024).toFixed(0)} KB · mayor ${pesoMax.u} (${(pesoMax.n / 1e6).toFixed(2)} MB)`);
const resumen = {};
for (const p of problemas) resumen[p.sev] = (resumen[p.sev] ?? 0) + 1;
console.log(`incidencias:`, Object.keys(resumen).length ? resumen : "ninguna", `\n`);
for (const p of problemas.slice(0, 45)) console.log(`[${p.sev.padEnd(5)}] ${p.u.slice(0, 46).padEnd(46)} ${p.msg}`);
if (problemas.length > 45) console.log(`… y ${problemas.length - 45} más`);

process.exit(problemas.some((p) => p.sev === "ALTO") ? 1 : 0);
