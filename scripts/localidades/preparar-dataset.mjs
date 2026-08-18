#!/usr/bin/env node
/**
 * Construye la cola de localidades que le faltan a tuchat, con la fuente real de
 * cada una ya adjunta.
 *
 * Objetivo de cobertura:
 *   · España   — municipios de más de 8.000 habitantes (INE 2025, 942), y de más
 *                de 4.000 en las nueve comunidades que pidió el cliente el
 *                2026-08-18 (Galicia, C. Valenciana, Asturias, País Vasco,
 *                Castilla y León, Extremadura, Canarias, Baleares y Cataluña).
 *   · América  — todas las localidades hispanohablantes de más de 20.000 (3.278)
 *   · CO/PE/UY/AR — corte propio en 5.000
 *   · MX/EC    — corte propio en 4.000 (mismo encargo del 2026-08-18)
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

/**
 * Las nueve comunidades con corte en 4.000 en vez de en 8.000.
 *
 * El resto de España se queda en 8.000: bajar el listón en todas de golpe
 * duplicaría la cola sin que nadie lo haya pedido, y la cobertura que ya hay no
 * se toca. Los nombres son los de la columna `comunidad` de es-municipios-3k.json
 * y se comparan tal cual, así que si el dataset cambia de nomenclatura este mapa
 * deja de encontrarlas y el resumen lo cantará (contaría 0 nuevas).
 */
const COMUNIDADES_4K = new Set([
  "Galicia", "Comunidad Valenciana", "Asturias", "País Vasco",
  "Castilla y León", "Extremadura", "Canarias", "Islas Baleares", "Cataluña",
]);
const UMBRAL_ES_BAJO = 4000;
const UMBRAL_ES_ALTO = 8000;
const umbralDe = (comunidad) => (COMUNIDADES_4K.has(comunidad) ? UMBRAL_ES_BAJO : UMBRAL_ES_ALTO);

/** México y Ecuador, con su censo propio bajado de Wikidata por tramos. */
const UMBRAL_MX_EC = 4000;

// Lo que ya existe se lee del build de datos, no de un volcado aparte, para que
// la cola no se desincronice del sitio cuando se añaden salas a mano.
async function salasExistentes() {
  const { CITIES } = await import("../../src/data/cities.ts");
  const { CITIES_WORLD } = await import("../../src/data/cities-world.ts");
  // Las que va publicando el cron cuentan como existentes: sin esto volvían a la
  // cola y se habrían generado por segunda vez, que es contenido duplicado
  // servido desde dos URLs del mismo sitio.
  const { CITIES_GENERADAS } = await import("../../src/data/cities-generadas.ts");
  const { CITY_COORDS } = await import("../../src/data/coords.ts");
  return indexar([...CITIES, ...CITIES_WORLD, ...CITIES_GENERADAS], CITY_COORDS);
}

function leer(nombre) {
  const ruta = join(ORIGEN, nombre);
  if (!existsSync(ruta)) throw new Error(`falta el dataset de origen: ${ruta}`);
  return JSON.parse(readFileSync(ruta, "utf8"));
}

/**
 * Quita el prefijo administrativo del nombre que da Wikidata.
 *
 * Wikidata llama a muchos municipios por su envoltorio legal —«Partido de
 * Tandil», «Distrito de Paita», «Área Metropolitana de Piura»— y ese nombre se
 * colaba tal cual hasta el título de la sala. El 2026-08-18 había once
 * publicadas así: `/chat/partido-de-tandil` en vez de `/chat/tandil`. Nadie
 * busca «chat partido de tandil»; se busca «chat tandil», que además ya podía
 * existir como sala, con lo que la nueva era un duplicado con nombre feo.
 *
 * Limpiando el prefijo ANTES de comprobar duplicados, el que ya existe se
 * detecta y la entrada se descarta sola; y el que no, entra con su nombre.
 *
 * `variantesDe` no sirve para esto: corta por la preposición y de «Distrito de
 * Carabayllo» saca «Distrito», que no es el pueblo.
 */
// La preposición es OBLIGATORIA salvo en "Cantón X", que es como se nombran los
// ecuatorianos. Sin esa exigencia, "Gran Canaria" se quedaba en "Canaria" y
// "Distrito Federal" en "Federal": ahí la palabra no envuelve al nombre, forma
// parte de él.
const PREFIJO_ADMIN =
  /^(?:(?:distritos?|partidos?|municipios?|provincia|departamento|comuna|regi[óo]n|[áa]rea metropolitana|zona metropolitana|aglomerado)\s+(?:de\s+la\s+|de\s+los\s+|de\s+las\s+|del\s+|de\s+)|cant[óo]n\s+)/i;
const sinPrefijoAdministrativo = (nombre) => {
  const limpio = String(nombre ?? "").replace(PREFIJO_ADMIN, "").trim();
  return limpio.length > 3 ? limpio : String(nombre ?? "");
};

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
  // El censo de 3.000 contiene al de 8.000: filtrando por el umbral de cada
  // comunidad se obtienen a la vez las de siempre y las nuevas, sin dos listas.
  const censoEs = leer("es-municipios-3k.json").filter((m) => m.poblacion >= umbralDe(m.comunidad));
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
      origen: m.poblacion >= UMBRAL_ES_ALTO ? "es8k" : "es4k",
      pais: "España",
      paisSlug: "espana",
      nombre: m.nombre,
      slug: f.slug ?? norm(m.nombre),
      poblacion: m.poblacion,
      region: m.provincia,
      regionSlug: m.provincia_slug,
      comunidad: m.comunidad,
      // Los municipios de 4.000 a 8.000 no estaban en es-nuevos-8k-con-fuente
      // (se armó para el corte anterior), así que la fuente sale del propio
      // censo de 3.000, que trae Wikipedia, web del ayuntamiento y coordenadas.
      wikipedia: f.wikipedia_url ?? m.wikipedia_url ?? null,
      extracto: f.wiki_extracto ?? null,
      webOficial: f.web_oficial ?? m.web_oficial ?? null,
      gentilicio: f.gentilicio ?? null,
      comarca: f.comarca ?? null,
      coords: f.coords ?? m.coords ?? null,
    };
    (tieneFuente(entrada) ? pendientesEs : sinFuenteEs).push(entrada);
  }

  // ── América hispanohablante ────────────────────────────────────────────────
  const censoAm = leer("latam-15k.json").filter((x) => (x.poblacion ?? 0) >= UMBRAL_AMERICA);
  const fuenteAm = new Map(leer("latam-nuevos-15k.json").map((x) => [x.qid ?? x.slug, x]));

  const pendientesAm = [];
  const sinFuenteAm = [];
  for (const l of censoAm) {
    const nombreAm = sinPrefijoAdministrativo(l.nombre);
    if (yaExiste(yaEstan, { nombre: nombreAm, slug: l.slug, coords: l.coords })) continue;
    if (nombreAm !== l.nombre && yaExiste(yaEstan, { nombre: l.nombre, coords: l.coords })) continue;
    // El censo de América ya trae extracto y web oficial en cada registro; el
    // fichero de "nuevas" solo aporta el slug desambiguado, así que se combinan
    // con el censo teniendo prioridad.
    const fuente = fuenteAm.get(l.qid ?? l.slug) ?? {};
    const f = { ...fuente, ...l };
    const entrada = {
      origen: "am20k",
      pais: l.pais,
      paisSlug: l.pais_slug,
      nombre: nombreAm,
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

  // ── Colombia, Perú, Uruguay y Argentina, con corte propio en 5.000 ─────────
  // Estos cuatro llevan un umbral más bajo por decisión del cliente. El censo se
  // descargó aparte (UMBRAL=5000) y viene crudo: trae URL de Wikipedia y web del
  // ayuntamiento, pero NO el extracto. No pasa nada — el cron baja el extracto y
  // la portada del ayuntamiento por su cuenta antes de escribir, y descarta la
  // localidad si no consigue ninguna de las dos.
  //
  // Aviso que hay que repetir cada vez: esto sale de Wikidata, que no es un
  // padrón. En España devolvía 671 municipios de más de 8.000 cuando el INE da
  // 942. Estas cifras son un suelo; para cobertura real hay que contrastar con
  // DANE, INEI, INE-UY e INDEC.
  const censo5k = leer("latam-5k-4paises-crudo.json")?.localidades ?? [];
  const pendientes5k = [];
  // Los slugs se desambiguan aquí porque el censo crudo no trae ninguno y hay
  // homónimos a puñados: "San Martín" sale doce veces solo en Argentina.
  const slugsUsados = new Set([...yaEstan.claves, ...pendientesEs.map((x) => x.slug), ...pendientesAm.map((x) => x.slug)]);
  for (const l of censo5k) {
    const nombre = sinPrefijoAdministrativo(l.nombre ?? l.nombre_wd);
    if ((l.poblacion ?? 0) < 5000) continue;
    if (yaExiste(yaEstan, { nombre, coords: l.coords })) continue;

    // Base → con la división → con el país. El primero libre se queda.
    let slug = norm(nombre);
    for (const sufijo of ["", `-${norm(l.division ?? "")}`, `-${l.pais_slug}`]) {
      const intento = norm(nombre) + sufijo;
      if (!slugsUsados.has(intento)) { slug = intento; break; }
      slug = intento;   // si todos chocan, se queda el más específico y la criba lo aparta
    }
    if (slugsUsados.has(slug)) continue;   // homónimo irresoluble: fuera, no duplicar
    slugsUsados.add(slug);

    pendientes5k.push({
      origen: "pais5k",
      pais: l.pais,
      paisSlug: l.pais_slug,
      nombre,
      slug,
      poblacion: l.poblacion,
      region: l.division ?? null,
      regionSlug: l.division ? norm(l.division) : null,
      wikipedia: l.wikipedia_url ?? null,
      extracto: null,
      webOficial: l.web_oficial ?? null,
      gentilicio: l.gentilicio ?? null,
      coords: l.coords ?? null,
    });
  }

  // ── México y Ecuador, con corte propio en 4.000 ───────────────────────────
  // Encargo del cliente del 2026-08-18, junto con las nueve comunidades
  // españolas. El censo se bajó de Wikidata por tramos de población (la consulta
  // del país entero devolvía 504) y viene igual de crudo que el de los cuatro
  // anteriores: nombre, población y división de primer nivel, sin extracto. El
  // cron baja la fuente por su cuenta antes de escribir y descarta lo que no
  // consiga anclar.
  //
  // Vale aquí el mismo aviso: Wikidata no es un padrón. Para México el censo
  // real es el del INEGI y para Ecuador el del INEC; estas cifras son un suelo,
  // no la cobertura completa del país.
  // Opcional a propósito: el censo de MX/EC se baja aparte y puede tardar días
  // en estar (Wikidata se cae a ratos). Sin él, el resto de la cola se prepara
  // igual en vez de romper la ejecución entera.
  const censo4k = existsSync(join(ORIGEN, "latam-4k-mx-ec.json"))
    ? (leer("latam-4k-mx-ec.json")?.localidades ?? [])
    : [];
  if (!censo4k.length) console.log("aviso: falta latam-4k-mx-ec.json — México y Ecuador no entran en esta pasada");
  const pendientes4k = [];
  for (const l of censo4k) {
    const nombre = sinPrefijoAdministrativo(l.nombre ?? l.nombre_wd);
    if ((l.poblacion ?? 0) < UMBRAL_MX_EC) continue;
    if (yaExiste(yaEstan, { nombre, coords: l.coords })) continue;

    let slug = norm(nombre);
    for (const sufijo of ["", `-${norm(l.division ?? "")}`, `-${l.pais_slug}`]) {
      const intento = norm(nombre) + sufijo;
      if (!slugsUsados.has(intento)) { slug = intento; break; }
      slug = intento;
    }
    if (slugsUsados.has(slug)) continue;
    slugsUsados.add(slug);

    pendientes4k.push({
      origen: "pais4k",
      pais: l.pais,
      paisSlug: l.pais_slug,
      nombre,
      slug,
      poblacion: l.poblacion,
      region: l.division ?? null,
      regionSlug: l.division ? norm(l.division) : null,
      wikipedia: l.wikipedia_url ?? null,
      extracto: null,
      webOficial: l.web_oficial ?? null,
      gentilicio: null,
      coords: l.coords ?? null,
    });
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
  pendientes5k.sort(porPoblacion);
  pendientes4k.sort(porPoblacion);

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
  // Las de 5.000 van al final de la cola a propósito: son las más pequeñas y las
  // que menos se buscan, así que entran cuando ya estén las grandes. El cron las
  // reordena por demanda medida de todas formas.
  const cola = [...pendientesEs, ...criba(pendientesAm), ...criba(pendientes5k), ...criba(pendientes4k)];
  writeFileSync(join(DESTINO, "revisar.json"), JSON.stringify(dudosas, null, 1));
  writeFileSync(join(DESTINO, "pendientes.json"), JSON.stringify(cola, null, 1));
  writeFileSync(join(DESTINO, "sin-fuente.json"), JSON.stringify(quedanSinFuente, null, 1));

  // Se cuentan sobre la cola final: los rescatados cambiaron de lista, así que
  // sumar las de antes del rescate los contaría dos veces.
  const conWeb = cola.filter((x) => x.webOficial).length;
  // Se cuenta por `origen`, no por país: sumar "todo lo que no es España" metía
  // las 1.882 localidades del bloque de 5.000 en el hueco de América y el
  // resumen pasó a decir "América 1% cubierto" cuando es el 40%.
  const deOrigen = (o) => cola.filter((x) => x.origen === o).length
    + quedanSinFuente.filter((x) => x.origen === o).length;
  const faltanEs = deOrigen("es8k") + deOrigen("es4k");
  const faltanAm = deOrigen("am20k");
  // `censoEs` ya viene filtrado con el umbral de cada comunidad (8.000 en
  // general, 4.000 en las nueve pedidas), así que el objetivo es el conjunto de
  // los dos cortes y no solo el de 8.000.
  console.log(`ESPAÑA   (umbral mixto)  objetivo ${censoEs.length} · faltan ${faltanEs} · cubierto ${Math.round((censoEs.length - faltanEs) / censoEs.length * 100)}%`);
  console.log(`AMÉRICA  (>${UMBRAL_AMERICA} hab)  objetivo ${censoAm.length} · faltan ${faltanAm} · cubierto ${Math.round((censoAm.length - faltanAm) / censoAm.length * 100)}%`);
  console.log(`   · de 8.000 arriba, todas las comunidades: faltan ${deOrigen("es8k")}`);
  console.log(`   · de 4.000 a 8.000, solo las nueve pedidas: faltan ${deOrigen("es4k")}`);
  console.log(`5.000+  (CO/PE/UY/AR)   añadidas a la cola ${pendientes5k.length} de ${censo5k.length} del censo`);
  console.log(`4.000+  (MX/EC)         añadidas a la cola ${pendientes4k.length} de ${censo4k.length} del censo`);
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
