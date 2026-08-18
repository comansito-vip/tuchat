#!/usr/bin/env npx tsx
/**
 * Cron de goteo: publica salas de TÉRMINO, no de localidad, despacio.
 *
 * Diferencia con `salas-geo.mjs`, que es el motivo de que sean dos scripts: allí
 * el contenido lo redacta un LLM contra una fuente real por localidad (extracto
 * de Wikipedia + web del ayuntamiento) y luego lo verifica otro modelo. Aquí no
 * hay fuente equivalente —no existe la Wikipedia de «chat caliente»—, así que la
 * ficha va **escrita a mano** en `data/terminos/pendientes.json` y este script no
 * redacta nada: solo controla y publica.
 *
 * Lo que sí hace igual que el otro es no publicar lo que no pasa los controles:
 *   · `revisarFicha` (muletillas, apertura de folleto, intro de 110-160 que es la
 *     meta description, aboutTitle propio de 25-70, about de 100-320 palabras),
 *   · canales dentro de REAL_CHANNELS y el primero poblado, nunca un sembrado,
 *   · slug libre en las 2.700 salas del catálogo,
 *   · fraseo calcado contra TODO lo ya publicado, no solo contra el lote.
 * Lo que falla se queda en la cola con su motivo en el log y se reintenta.
 *
 * `related` se recalcula en CADA regeneración y no en el momento de publicar: así
 * dos salas hermanas de la misma cola —`bdsm-espana` y `bdsm-madrid`— acaban
 * enlazadas aunque salgan con días de diferencia, en vez de perder el enlace por
 * haber salido la primera cuando la segunda todavía no existía.
 *
 * Uso:
 *   npx tsx scripts/cron/salas-termino.mjs              # 3 salas
 *   npx tsx scripts/cron/salas-termino.mjs --lote 5
 *   npx tsx scripts/cron/salas-termino.mjs --seco       # no escribe nada
 */
import { readFileSync, writeFileSync, existsSync, appendFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import {
  revisarFicha, parrafosDuplicados, camposDuplicados,
  indiceDeShingles, fraseoCalcado,
} from "../lib/calidad.mjs";
import { getTopics, getCities, getCountries, getPlace } from "../../src/data/index.ts";
import { REAL_CHANNELS, SEEDED_CHANNELS } from "../../src/data/irc-real-channels.ts";
import { esCanalReal } from "../../src/data/canales-saneado.ts";

const RAIZ = process.cwd();
const DIR = join(RAIZ, "data", "terminos");
const COLA = join(DIR, "pendientes.json");
const PROGRESO = join(DIR, "progreso.json");
const PUBLICADAS = join(DIR, "publicadas.json");
const SALIDA_TS = join(RAIZ, "src", "data", "topics-goteo.ts");
const LOG = join(DIR, "cron.log");

const arg = (n, d) => {
  const i = process.argv.indexOf(`--${n}`);
  return i === -1 ? d : process.argv[i + 1];
};
const LOTE = Number(arg("lote", 3));
const SECO = process.argv.includes("--seco");

const leerJSON = (ruta, porDefecto) =>
  existsSync(ruta) ? JSON.parse(readFileSync(ruta, "utf8")) : porDefecto;

const sembrados = new Set(SEEDED_CHANNELS);

/** Los campos de `Place`, en orden y sin los metadatos de la cola. */
function aPlace(f) {
  return {
    slug: f.slug,
    name: f.name,
    kind: f.kind,
    icon: f.icon,
    users: f.users,
    votes: f.votes,
    ...(f.tag ? { tag: f.tag } : {}),
    activity: f.activity,
    ...(f.parentName ? { parentName: f.parentName } : {}),
    ...(f.parentSlug ? { parentSlug: f.parentSlug } : {}),
    channels: f.channels,
    related: f.related,
    intro: f.intro.trim(),
    aboutTitle: f.aboutTitle.trim(),
    about: f.about.trim(),
  };
}

/**
 * Motivos por los que esta ficha NO se publica. Vacío = publicable.
 *
 * `catalogo` es el índice de slugs ya ocupados y `indice` el de shingles de todo
 * lo publicado: los dos se pasan hechos porque se reusan para las tres del lote.
 */
function problemasDe(ficha, catalogo, indice) {
  const problemas = revisarFicha(ficha);

  if (catalogo.has(ficha.slug)) problemas.push(`el slug ${ficha.slug} ya existe en el catálogo`);

  if (ficha.parentSlug && !catalogo.has(ficha.parentSlug)) {
    problemas.push(`padre inexistente: ${ficha.parentSlug}`);
  }

  const fantasmas = (ficha.channels ?? []).filter((c) => !esCanalReal(c));
  if (fantasmas.length) problemas.push(`canales que no existen: ${fantasmas.map((c) => "#" + c).join(", ")}`);

  // El primer canal es al que de verdad entra el usuario. Si fuera un sembrado,
  // la red lo crearía vacío y aterrizaría solo: la regla del informe de marcas.
  const primero = ficha.channels?.[0];
  if (!primero) problemas.push("sin canales");
  else if (sembrados.has(primero)) problemas.push(`#${primero} es un canal sembrado y va en cabeza`);
  else if (!REAL_CHANNELS.has(primero)) problemas.push(`#${primero} no es un canal poblado`);

  const calcado = fraseoCalcado(ficha, indice);
  if (calcado) {
    problemas.push(`fraseo calcado de ${calcado.slug} (${calcado.veces} cadenas): «${calcado.frase}»`);
  }

  return problemas;
}

/** Emite el módulo TS a partir del JSON, que es la fuente de verdad. */
function emitirTS(registros, existe) {
  // Los related se resuelven AQUÍ, contra el catálogo del momento: una hermana
  // que todavía estaba en la cola cuando salió esta ficha queda enlazada en
  // cuanto se publique, sin tener que tocar nada a mano.
  const cuerpo = registros
    .map((r) => ({ ...r, related: r.related.filter((s) => existe(s)) }))
    .map((r) => "  " + JSON.stringify(r, null, 2).split("\n").join("\n  "))
    .join(",\n");
  return `import type { Place } from "./types";

// Salas de TÉRMINO publicadas por el cron scripts/cron/salas-termino.mjs, a
// razón de tres al día. NO EDITAR A MANO: este fichero se reescribe entero a
// partir de data/terminos/publicadas.json, que es la fuente de verdad y guarda
// además la demanda medida que justificó cada sala.
//
// Cada ficha está escrita a mano (aquí no hay fuente por entidad que un LLM
// pueda resumir) y pasa por los mismos controles que el goteo de localidades:
// muletillas, apertura de folleto, longitudes, canales reales y fraseo calcado
// contra todo el catálogo.
export const TOPICS_GOTEO: Place[] = [
${cuerpo}
];
`;
}

function main() {
  const cola = leerJSON(COLA, []);
  const progreso = leerJSON(PROGRESO, { hechas: [], descartadas: {} });
  const publicadas = leerJSON(PUBLICADAS, []);

  const hechas = new Set(progreso.hechas);
  const pendientes = cola
    .filter((f) => !hechas.has(f.slug))
    .sort((a, b) => a.orden - b.orden);

  if (!pendientes.length) {
    console.log("Cola vacía: las", cola.length, "salas de término ya están publicadas.");
    return;
  }

  // El catálogo se lee del módulo de datos, así que ya incluye lo publicado por
  // este mismo cron: topics-goteo.ts entra en ALL_TOPICS.
  const catalogo = [...getCountries(), ...getCities(), ...getTopics()];
  const existe = (slug) => Boolean(getPlace(slug));
  const ocupado = { has: (s) => Boolean(getPlace(s)) };

  // El fraseo se compara contra TODO el catálogo, que es donde está el riesgo
  // real: una ficha nueva que repita la costura de una sala de 2026 es tan
  // plantilla como si repitiera la de su propio lote.
  const indice = indiceDeShingles(catalogo);

  const lote = pendientes.slice(0, LOTE);
  const nuevas = [];
  const rechazadas = [];

  const enLote = new Set();
  for (const ficha of lote) {
    const yaOcupado = { has: (s) => ocupado.has(s) || enLote.has(s) };
    const problemas = problemasDe(ficha, yaOcupado, indice);
    if (problemas.length) {
      rechazadas.push({ slug: ficha.slug, problemas });
      continue;
    }
    nuevas.push(aPlace(ficha));
    enLote.add(ficha.slug);
    // La ficha recién aceptada entra en el índice para que la siguiente del
    // lote se compare también contra ella, no solo contra lo ya publicado.
    for (const [s, duena] of indiceDeShingles([ficha])) if (!indice.has(s)) indice.set(s, duena);
  }

  // Duplicados DENTRO del lote y contra lo publicado: intro (que es la meta
  // description) y párrafos enteros del about.
  const todas = [...publicadas, ...nuevas];
  const chocanIntro = camposDuplicados(todas, "intro");
  const chocanAbout = camposDuplicados(todas, "about");
  const chocanParrafos = parrafosDuplicados(todas.map((f) => ({ slug: f.slug, cuerpo: f.about })));
  const choques = [...chocanIntro, ...chocanAbout, ...chocanParrafos];
  if (choques.length) {
    for (const c of choques) rechazadas.push({ slug: c.b, problemas: [`duplica contenido de ${c.a}`] });
    const malos = new Set(choques.map((c) => c.b));
    for (let i = nuevas.length - 1; i >= 0; i--) if (malos.has(nuevas[i].slug)) nuevas.splice(i, 1);
  }

  const lineas = [
    `[${new Date().toISOString()}] lote=${LOTE} publicadas=${nuevas.length} rechazadas=${rechazadas.length}`,
    ...nuevas.map((f) => `  + ${f.slug} (#${f.channels.join(" #")})`),
    ...rechazadas.map((r) => `  ! ${r.slug}: ${r.problemas.join(" · ")}`),
  ];
  console.log(lineas.join("\n"));

  if (SECO) {
    console.log("\n(--seco: no se ha escrito nada)");
    return;
  }

  mkdirSync(dirname(LOG), { recursive: true });
  appendFileSync(LOG, lineas.join("\n") + "\n");

  for (const r of rechazadas) progreso.descartadas[r.slug] = r.problemas;
  if (!nuevas.length) {
    writeFileSync(PROGRESO, JSON.stringify(progreso, null, 1));
    return;
  }

  const finales = [...publicadas, ...nuevas];
  progreso.hechas = [...progreso.hechas, ...nuevas.map((f) => f.slug)];
  for (const f of nuevas) delete progreso.descartadas[f.slug];

  writeFileSync(PUBLICADAS, JSON.stringify(finales, null, 1));
  const publicado = new Set(finales.map((f) => f.slug));
  writeFileSync(SALIDA_TS, emitirTS(finales, (s) => publicado.has(s) || existe(s)));
  writeFileSync(PROGRESO, JSON.stringify(progreso, null, 1));
  console.log(`\nQuedan ${pendientes.length - nuevas.length} salas en la cola.`);
}

main();
