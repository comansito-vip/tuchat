#!/usr/bin/env node
/**
 * Construye la cola de localidades que le faltan a tuchat, con la fuente real de
 * cada una ya adjunta.
 *
 * Objetivo de cobertura:
 *   · España   — todos los municipios de más de 8.000 habitantes (INE 2025, 942)
 *   · América  — todas las localidades hispanohablantes de más de 20.000 (3.278)
 *
 * Los datasets vienen de estoeschat, que ya los descargó y verificó: el del INE
 * es padrón oficial (Wikidata se queda en 671 municipios de los ~942 reales, así
 * que no sirve de censo) y el de América es Wikidata con extracto de Wikipedia y
 * web del ayuntamiento por localidad.
 *
 * Aquí NO se redacta nada. Este script solo decide qué falta y deja el material
 * de origen listo, porque la regla es que sin fuente por entidad no se escribe:
 * una localidad sin extracto ni web oficial se queda fuera de la cola en lugar de
 * generarse a ciegas.
 *
 * Uso: node scripts/localidades/preparar-dataset.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { indexar, yaExiste, vecinaMasCercana, variantesDe, norm } from "./duplicados.mjs";

const ORIGEN = "/home/javier/estoeschat/data";
const DESTINO = join(process.cwd(), "data", "localidades");
const UMBRAL_AMERICA = 20000;

// Lo que ya existe se lee del build de datos, no de un volcado aparte, para que
// la cola no se desincronice del sitio cuando se añaden salas a mano.
async function salasExistentes() {
  const { CITIES } = await import("../../src/data/cities.ts");
  const { CITIES_WORLD } = await import("../../src/data/cities-world.ts");
  const { CITY_COORDS } = await import("../../src/data/coords.ts");
  return indexar([...CITIES, ...CITIES_WORLD], CITY_COORDS);
}

function leer(nombre) {
  const ruta = join(ORIGEN, nombre);
  if (!existsSync(ruta)) throw new Error(`falta el dataset de origen: ${ruta}`);
  return JSON.parse(readFileSync(ruta, "utf8"));
}

/** Una entrada solo entra en la cola si trae con qué anclarla en algo real. */
const tieneFuente = (x) =>
  (x.extracto && x.extracto.length > 120) || Boolean(x.webOficial);

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Rescata de Wikipedia las que se quedaron sin fuente en los datasets de origen.
 * La API REST de resúmenes es abierta y no pide clave; se va despacio (200 ms
 * entre peticiones) porque es un servicio gratuito y no hay ninguna prisa: esto
 * se ejecuta una vez para preparar la cola, no en cada lote.
 */
async function rescatarDeWikipedia(entrada) {
  const titulo = encodeURIComponent(entrada.nombre.replace(/ /g, "_"));
  try {
    const res = await fetch(`https://es.wikipedia.org/api/rest_v1/page/summary/${titulo}`, {
      headers: { "User-Agent": "tuchat.org/1.0 (contacto@tuchat.org)" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return false;
    const data = await res.json();
    // Las páginas de desambiguación no describen ninguna localidad concreta.
    if (data.type === "disambiguation" || !data.extract) return false;
    // Y un resumen que no menciona ni el país ni la región casi siempre es de
    // otro homónimo (hay decenas de "San Miguel" repartidos por el continente).
    const contexto = `${entrada.region ?? ""} ${entrada.pais}`.toLowerCase();
    const texto = `${data.extract} ${data.description ?? ""}`.toLowerCase();
    const pistas = contexto.split(/\s+/).filter((p) => p.length > 3);
    if (pistas.length && !pistas.some((p) => texto.includes(p))) return false;

    entrada.extracto = data.extract;
    entrada.wikipedia = data.content_urls?.desktop?.page ?? null;
    return true;
  } catch {
    return false;
  } finally {
    await dormir(200);
  }
}

async function main() {
  const yaEstan = await salasExistentes();
  mkdirSync(DESTINO, { recursive: true });

  // ── España ─────────────────────────────────────────────────────────────────
  const censoEs = leer("es-municipios-8k.json");
  const fuenteEs = new Map(leer("es-nuevos-8k-con-fuente.json").map((x) => [String(x.ine), x]));

  // Para España hay un desempate exacto que América no tiene: el código INE.
  // Cada sala existente se mapea a su municipio y, si el código ya está cubierto,
  // la candidata es la misma localidad. Esto evita apartar por cercanía a
  // municipios legítimos y distintos —Cuarte de Huerva está a 8,6 km de Zaragoza
  // y es otro municipio— sin dejar pasar duplicados con nombre en otra lengua.
  const inePorClave = new Map();
  for (const m of censoEs) {
    for (const v of variantesDe(m.nombre_oficial ?? m.nombre)) inePorClave.set(v, String(m.ine));
    for (const v of variantesDe(m.nombre)) inePorClave.set(v, String(m.ine));
  }
  const ineCubiertos = new Set();
  for (const clave of yaEstan.claves) {
    const ine = inePorClave.get(clave);
    if (ine) ineCubiertos.add(ine);
  }

  const pendientesEs = [];
  const sinFuenteEs = [];
  for (const m of censoEs) {
    const f = fuenteEs.get(String(m.ine)) ?? {};
    if (ineCubiertos.has(String(m.ine))) continue;
    if (yaExiste(yaEstan, { nombre: m.nombre_oficial ?? m.nombre, coords: f.coords })) continue;
    if (yaExiste(yaEstan, { nombre: m.nombre, coords: f.coords })) continue;
    const entrada = {
      pais: "España",
      paisSlug: "espana",
      nombre: m.nombre,
      slug: f.slug ?? norm(m.nombre),
      poblacion: m.poblacion,
      region: m.provincia,
      regionSlug: m.provincia_slug,
      comunidad: m.comunidad,
      wikipedia: f.wikipedia_url ?? null,
      extracto: f.wiki_extracto ?? null,
      webOficial: f.web_oficial ?? null,
      gentilicio: f.gentilicio ?? null,
      comarca: f.comarca ?? null,
      coords: f.coords ?? null,
    };
    (tieneFuente(entrada) ? pendientesEs : sinFuenteEs).push(entrada);
  }

  // ── América hispanohablante ────────────────────────────────────────────────
  const censoAm = leer("latam-15k.json").filter((x) => (x.poblacion ?? 0) >= UMBRAL_AMERICA);
  const fuenteAm = new Map(leer("latam-nuevos-15k.json").map((x) => [x.qid ?? x.slug, x]));

  const pendientesAm = [];
  const sinFuenteAm = [];
  for (const l of censoAm) {
    if (yaExiste(yaEstan, { nombre: l.nombre, slug: l.slug, coords: l.coords })) continue;
    // El censo de América ya trae extracto y web oficial en cada registro; el
    // fichero de "nuevas" solo aporta el slug desambiguado, así que se combinan
    // con el censo teniendo prioridad.
    const fuente = fuenteAm.get(l.qid ?? l.slug) ?? {};
    const f = { ...fuente, ...l };
    const entrada = {
      pais: l.pais,
      paisSlug: l.pais_slug,
      nombre: l.nombre,
      // El slug bueno es el del fichero de "nuevas": ahí ya viene resuelto el
      // homónimo entre países (san-juan-argentina, avellaneda-argentina),
      // mientras que el del censo es el crudo y colisionaría.
      //
      // Ojo: `slug_desambiguado` es un BOOLEANO que dice si hizo falta
      // desambiguar, NO el slug. Usarlo como slug dejó 1.376 de las 1.389
      // localidades de la cola con `slug: true` o `slug: false`, y con ellas
      // el cron no podía ni nombrar la página.
      slug: fuente.slug ?? l.slug ?? norm(l.nombre),
      poblacion: l.poblacion,
      region: l.region ?? null,
      regionSlug: l.region_slug ?? null,
      wikipedia: f.wikipedia_url ?? null,
      extracto: f.wiki_extracto ?? null,
      webOficial: f.web_oficial ?? null,
      gentilicio: f.gentilicio ?? null,
      coords: f.coords ?? null,
    };
    (tieneFuente(entrada) ? pendientesAm : sinFuenteAm).push(entrada);
  }

  // Segunda oportunidad para las que se quedaron sin fuente: muchas la tienen en
  // Wikipedia aunque no estuvieran en los datasets de origen, que se armaron para
  // otro sitio y con otro corte.
  const rescatables = [...sinFuenteEs, ...sinFuenteAm];
  if (rescatables.length) {
    console.log(`buscando fuente en Wikipedia para ${rescatables.length} localidades…`);
    let rescatadas = 0;
    for (const entrada of rescatables) {
      if (await rescatarDeWikipedia(entrada)) {
        (entrada.paisSlug === "espana" ? pendientesEs : pendientesAm).push(entrada);
        entrada.rescatada = true;
        rescatadas++;
      }
    }
    console.log(`  recuperadas ${rescatadas} de ${rescatables.length}`);
  }
  const quedanSinFuente = rescatables.filter((x) => !x.rescatada);

  // Las grandes primero: son las que más se buscan y las que antes justifican
  // ante Google que el sitio merece que le rastreen lo demás.
  const porPoblacion = (a, b) => (b.poblacion ?? 0) - (a.poblacion ?? 0);
  pendientesEs.sort(porPoblacion);
  pendientesAm.sort(porPoblacion);

  // Última criba: las que tienen una sala a menos de 10 km se apartan para
  // mirarlas a mano. No se descartan (podrían ser municipios vecinos legítimos)
  // ni se generan (podrían ser la misma localidad con otro nombre): el generador
  // solo trabaja sobre lo que no admite duda.
  const dudosas = [];
  const criba = (lista) => lista.filter((x) => {
    const vecina = vecinaMasCercana(yaEstan, x);
    if (!vecina) return true;
    dudosas.push({ ...x, posibleDuplicadoDe: vecina.slug, km: vecina.km });
    return false;
  });
  // España no pasa por la criba de cercanía: su código INE ya decidió, y apartar
  // por proximidad solo dejaría fuera municipios legítimos del área metropolitana.
  const cola = [...pendientesEs, ...criba(pendientesAm)];
  writeFileSync(join(DESTINO, "revisar.json"), JSON.stringify(dudosas, null, 1));
  writeFileSync(join(DESTINO, "pendientes.json"), JSON.stringify(cola, null, 1));
  writeFileSync(join(DESTINO, "sin-fuente.json"), JSON.stringify(quedanSinFuente, null, 1));

  // Se cuentan sobre la cola final: los rescatados cambiaron de lista, así que
  // sumar las de antes del rescate los contaría dos veces.
  const conWeb = cola.filter((x) => x.webOficial).length;
  const faltanEs = cola.filter((x) => x.paisSlug === "espana").length
    + quedanSinFuente.filter((x) => x.paisSlug === "espana").length;
  const faltanAm = cola.length + quedanSinFuente.length - faltanEs;
  console.log(`ESPAÑA   (>8.000 hab)   objetivo ${censoEs.length} · faltan ${faltanEs} · cubierto ${Math.round((censoEs.length - faltanEs) / censoEs.length * 100)}%`);
  console.log(`AMÉRICA  (>${UMBRAL_AMERICA} hab)  objetivo ${censoAm.length} · faltan ${faltanAm} · cubierto ${Math.round((censoAm.length - faltanAm) / censoAm.length * 100)}%`);
  console.log("");
  console.log(`cola con fuente:  ${cola.length}  (${conWeb} con web del ayuntamiento)`);
  console.log(`fuera por no tener fuente: ${quedanSinFuente.length}`);
  console.log(`apartadas para revisar (sala a <10 km): ${dudosas.length}`);
  console.log(`\nescrito en data/localidades/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
