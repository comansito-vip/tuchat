/**
 * Auditoría anti-IA y anti-duplicado del contenido del sitio.
 *
 *   npx tsx scripts/content/auditar-contenido.ts [--verbose] [--max N]
 *
 * No modifica nada: mide y reporta. Sale con código 1 si encuentra avisos, para
 * que el cron de curación pueda usarlo como puerta de calidad.
 *
 * Qué mira, y por qué cada cosa importa para SEO:
 *
 *  1. DUPLICADOS EXACTOS de intro/about entre salas. Dos landings con el mismo
 *     párrafo son la misma página para Google: elige una y descarta la otra.
 *  2. APERTURAS REPETIDAS (las primeras palabras). Aunque el resto cambie, un
 *     arranque idéntico en 20 páginas delata la plantilla.
 *  3. MULETILLAS de texto generado ("sumérgete", "el lugar perfecto para"…).
 *  4. PLANTILLA CON HUECO: bloques de copy que solo varían en el nombre de la
 *     sala. Es la definición de página puerta; se mide sustituyendo el nombre
 *     propio por un marcador y contando cuántas salas comparten el molde.
 *  5. COBERTURA: salas sin `about`, o con textos demasiado cortos para
 *     sostener una landing.
 *  6. ENLAZADO: `related` que apunta a slugs inexistentes y salas huérfanas (a
 *     las que no enlaza ninguna otra), que solo se alcanzan por el sitemap.
 *  7. METADATOS: los `<title>` y las `meta description` que salen de verdad al
 *     HTML, comprobando unicidad y longitud.
 *  8. NOTICIAS: títulos, extractos y aperturas de cuerpo repetidos.
 */
import { getCities, getCountries, getTopics, roomTitle, getNews } from "../../src/data/index";
import { buildFaq, roomBullets, aboutLead } from "../../src/app/chat/[slug]/copy";
import type { Place } from "../../src/data/types";
import { detectarMuletillas, aperturaNormalizada } from "../../src/lib/content/muletillas";

const VERBOSE = process.argv.includes("--verbose");
const MAX = (() => {
  const i = process.argv.indexOf("--max");
  return i >= 0 ? parseInt(process.argv[i + 1], 10) : 6;
})();

let avisos = 0;
const aviso = (msg: string) => {
  avisos++;
  console.log(`   ✗ ${msg}`);
};
const ok = (msg: string) => console.log(`   ✓ ${msg}`);

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9ñ ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Agrupa valores por clave y devuelve solo los grupos con más de un miembro. */
function colisiones<T>(items: T[], clave: (x: T) => string | null): Map<string, T[]> {
  const m = new Map<string, T[]>();
  for (const it of items) {
    const k = clave(it);
    if (!k) continue;
    (m.get(k) ?? m.set(k, []).get(k)!).push(it);
  }
  return new Map([...m].filter(([, v]) => v.length > 1));
}

function listar(grupos: Map<string, unknown[]>, etiqueta: (x: never) => string): void {
  const orden = [...grupos].sort((a, b) => b[1].length - a[1].length);
  for (const [clave, miembros] of orden.slice(0, VERBOSE ? orden.length : MAX)) {
    const nombres = (miembros as never[]).map(etiqueta);
    const muestra = nombres.slice(0, 6).join(", ");
    const resto = nombres.length > 6 ? `, +${nombres.length - 6} más` : "";
    aviso(`×${miembros.length} — "${clave.slice(0, 70)}…" → ${muestra}${resto}`);
  }
  if (!VERBOSE && orden.length > MAX) {
    console.log(`     (… y ${orden.length - MAX} grupos más; usa --verbose para verlos todos)`);
  }
}

// ─────────────────────────── Muletillas ───────────────────────────

function buscarMuletillas(textos: { id: string; texto: string }[]): void {
  const hits = new Map<string, string[]>();
  for (const { id, texto } of textos) {
    for (const m of detectarMuletillas(texto)) {
      (hits.get(m) ?? hits.set(m, []).get(m)!).push(id);
    }
  }
  if (!hits.size) return ok("sin muletillas de IA");
  for (const [m, ids] of [...hits].sort((a, b) => b[1].length - a[1].length)) {
    aviso(`muletilla "${m}" en ${ids.length}: ${ids.slice(0, 8).join(", ")}${ids.length > 8 ? "…" : ""}`);
  }
}

// ─────────────── Plantilla con hueco (páginas puerta) ───────────────

/**
 * Sustituye el nombre de la sala (y sus variantes) por un marcador. Si tras
 * hacerlo dos textos coinciden, es que solo se diferenciaban en el nombre: una
 * plantilla rellenada, no contenido propio.
 */
function despersonalizar(texto: string, place: Place): string {
  const variantes = [place.name, place.parentName, place.provincia].filter(Boolean) as string[];
  let out = norm(texto);
  for (const v of variantes.sort((a, b) => b.length - a.length)) {
    out = out.split(norm(v)).join("«X»");
  }
  return out;
}

/**
 * Umbral a partir del cual un molde compartido deja de ser una coincidencia y
 * pasa a ser una plantilla. Dos ciudades de la misma provincia citan a las
 * mismas vecinas y acaban con frases iguales: eso es correcto y no hay que
 * "arreglarlo". Lo que hunde un dominio es el molde que abarca cientos de
 * páginas, así que lo que se vigila es el TAMAÑO DEL MOLDE MAYOR, no el
 * porcentaje de salas que coinciden con alguna otra.
 */
const UMBRAL_MOLDE = 10;

function auditarPlantilla(
  rooms: Place[],
  nombre: string,
  render: (p: Place) => string,
): void {
  const grupos = colisiones(rooms, (p) => despersonalizar(render(p), p) || null);
  const orden = [...grupos].sort((a, b) => b[1].length - a[1].length);
  const mayor = orden[0]?.[1].length ?? 1;

  if (mayor < UMBRAL_MOLDE) {
    return ok(
      `${nombre}: sin plantilla (molde mayor ×${mayor}, por debajo del umbral de ${UMBRAL_MOLDE})`,
    );
  }

  const grandes = orden.filter(([, g]) => g.length >= UMBRAL_MOLDE);
  const afectadas = grandes.reduce((n, [, g]) => n + g.length, 0);
  aviso(
    `${nombre}: ${afectadas} salas repartidas en ${grandes.length} molde(s) de ${UMBRAL_MOLDE}+ ` +
      `— texto idéntico salvo el nombre de la sala`,
  );
  for (const [molde, miembros] of grandes.slice(0, 3)) {
    const ejemplos = (miembros as Place[]).slice(0, 4).map((p) => p.slug).join(", ");
    console.log(`     molde ×${miembros.length} (${ejemplos}…): "${molde.slice(0, 80)}…"`);
  }
}

// ─────────────────────────── Pasadas ───────────────────────────

// El catálogo completo, no `getRooms()` (que son solo las 12 destacadas de la home).
const rooms = [...getCountries(), ...getCities(), ...getTopics()];
const news = getNews();

console.log(`\n══ AUDITORÍA DE CONTENIDO · ${rooms.length} salas · ${news.length} noticias ══`);

console.log("\n## 1. Duplicados exactos entre salas");
{
  const dupIntro = colisiones(rooms, (p) => norm(p.intro) || null);
  if (dupIntro.size) {
    aviso(`intro duplicada en ${dupIntro.size} grupo(s)`);
    listar(dupIntro, (p: Place) => p.slug);
  } else ok("intro única en todas las salas");

  const dupAbout = colisiones(rooms, (p) => (p.about ? norm(p.about) : null));
  if (dupAbout.size) {
    aviso(`about duplicado en ${dupAbout.size} grupo(s)`);
    listar(dupAbout, (p: Place) => p.slug);
  } else ok("about único en todas las salas");
}

console.log("\n## 2. Aperturas repetidas (primeras 8 palabras)");
{
  const cabeza = (s: string) => norm(s).split(" ").slice(0, 8).join(" ");
  for (const [campo, get] of [
    ["intro", (p: Place) => p.intro],
    ["about", (p: Place) => p.about],
  ] as const) {
    const g = colisiones(rooms, (p) => {
      const t = get(p);
      return t ? cabeza(t) : null;
    });
    // Dos salas hermanas pueden empezar parecido sin ser plantilla; el umbral
    // de 3 evita el ruido y sigue delatando el molde real.
    const reales = new Map([...g].filter(([, v]) => v.length >= 3));
    if (reales.size) {
      aviso(`${campo}: ${reales.size} apertura(s) compartida(s) por 3+ salas`);
      listar(reales, (p: Place) => p.slug);
    } else ok(`${campo}: sin aperturas repetidas`);
  }
}

console.log("\n## 3. Muletillas de IA");
buscarMuletillas([
  ...rooms.flatMap((p) => [
    { id: p.slug, texto: p.intro },
    ...(p.about ? [{ id: p.slug, texto: p.about }] : []),
  ]),
  ...news.map((n) => ({ id: `noticia:${n.slug}`, texto: `${n.excerpt} ${n.body ?? ""}` })),
]);

console.log("\n## 4. Plantilla con hueco (lo que ve Google como página puerta)");
{
  auditarPlantilla(rooms, "FAQ (buildFaq)", (p) =>
    buildFaq(p)
      .map((f) => `${f.q} ${f.a}`)
      .join(" "),
  );
  auditarPlantilla(rooms, "bullets (roomBullets)", (p) => roomBullets(p).join(" "));
  auditarPlantilla(rooms, "aboutLead", (p) => aboutLead(p) ?? "");
  auditarPlantilla(rooms, "intro", (p) => p.intro);
  auditarPlantilla(rooms, "about", (p) => p.about ?? "");
}

console.log("\n## 5. Cobertura de contenido");
{
  const sinAbout = rooms.filter((p) => !p.about);
  const introCorta = rooms.filter((p) => p.intro.split(/\s+/).length < 15);
  const aboutCorto = rooms.filter((p) => p.about && p.about.split(/\s+/).length < 60);
  if (sinAbout.length)
    aviso(`${sinAbout.length} salas sin \`about\` (solo intro): ${sinAbout.slice(0, 8).map((p) => p.slug).join(", ")}${sinAbout.length > 8 ? "…" : ""}`);
  else ok("todas las salas tienen about");
  if (introCorta.length)
    aviso(`${introCorta.length} intros de menos de 15 palabras: ${introCorta.slice(0, 8).map((p) => p.slug).join(", ")}`);
  else ok("ninguna intro por debajo de 15 palabras");
  if (aboutCorto.length)
    aviso(`${aboutCorto.length} about de menos de 60 palabras: ${aboutCorto.slice(0, 8).map((p) => p.slug).join(", ")}`);
  else ok("ningún about por debajo de 60 palabras");
}

console.log("\n## 6. Enlazado interno");
{
  const slugs = new Set(rooms.map((p) => p.slug));
  const rotos = rooms.flatMap((p) =>
    p.related.filter((r) => !slugs.has(r)).map((r) => `${p.slug}→${r}`),
  );
  if (rotos.length) aviso(`${rotos.length} enlaces \`related\` a slugs inexistentes: ${rotos.slice(0, 10).join(", ")}${rotos.length > 10 ? "…" : ""}`);
  else ok("todos los `related` apuntan a salas existentes");

  // Una sala es alcanzable si otra la enlaza en `related` o si cuelga de un
  // padre (las ciudades se listan en la página de su país/región).
  const entrantes = new Set<string>();
  for (const p of rooms) {
    for (const r of p.related) entrantes.add(r);
    if (p.parentSlug) entrantes.add(p.slug);
  }
  const huerfanas = rooms.filter((p) => !entrantes.has(p.slug));
  if (huerfanas.length)
    aviso(`${huerfanas.length} salas huérfanas (sin enlaces entrantes, solo sitemap): ${huerfanas.slice(0, 12).map((p) => p.slug).join(", ")}${huerfanas.length > 12 ? "…" : ""}`);
  else ok("ninguna sala huérfana");
}

console.log("\n## 7. Metadatos que llegan al HTML");
{
  const titles = colisiones(rooms, (p) => roomTitle(p));
  if (titles.size) {
    aviso(`${titles.size} \`<title>\` repetidos entre salas`);
    listar(titles, (p: Place) => p.slug);
  } else ok("`<title>` único en todas las salas");

  // La description de /chat/[slug] es place.intro tal cual.
  const largos = rooms.filter((p) => p.intro.length > 165);
  const cortos = rooms.filter((p) => p.intro.length < 70);
  if (largos.length) aviso(`${largos.length} meta descriptions de más de 165 caracteres (Google las corta): ${largos.slice(0, 6).map((p) => p.slug).join(", ")}`);
  else ok("ninguna meta description pasa de 165 caracteres");
  if (cortos.length) aviso(`${cortos.length} meta descriptions de menos de 70 caracteres: ${cortos.slice(0, 6).map((p) => p.slug).join(", ")}`);
  else ok("ninguna meta description baja de 70 caracteres");

  const tLargos = rooms.filter((p) => roomTitle(p).length > 60);
  if (tLargos.length) aviso(`${tLargos.length} títulos de más de 60 caracteres: ${tLargos.slice(0, 6).map((p) => p.slug).join(", ")}`);
  else ok("ningún título pasa de 60 caracteres");
}

console.log("\n## 8. Noticias");
{
  const dupT = colisiones(news, (n) => norm(n.title));
  const dupE = colisiones(news, (n) => norm(n.excerpt));
  // Mismo criterio de apertura que usa el dedup del generador, para que lo que
  // la auditoría señala sea exactamente lo que el cron sabe evitar.
  const dupA = colisiones(news, (n) => (n.body ? aperturaNormalizada(n.body) : null));
  if (dupT.size) { aviso(`${dupT.size} títulos de noticia repetidos`); listar(dupT, (n: { slug: string }) => n.slug); } else ok("títulos únicos");
  if (dupE.size) { aviso(`${dupE.size} extractos repetidos`); listar(dupE, (n: { slug: string }) => n.slug); } else ok("extractos únicos");
  if (dupA.size) { aviso(`${dupA.size} aperturas de cuerpo repetidas`); listar(dupA, (n: { slug: string }) => n.slug); } else ok("aperturas de cuerpo únicas");

  const sinCuerpo = news.filter((n) => !n.body || n.body.split(/\s+/).length < 150);
  if (sinCuerpo.length) aviso(`${sinCuerpo.length} noticias con menos de 150 palabras de cuerpo: ${sinCuerpo.slice(0, 6).map((n) => n.slug).join(", ")}`);
  else ok("todas las noticias pasan de 150 palabras");
}

console.log(`\n══ ${avisos} aviso(s) ══\n`);
process.exit(avisos ? 1 : 0);
