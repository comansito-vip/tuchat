#!/usr/bin/env node
/**
 * Construye `latam-4k-mx-ec.json`: el censo de México y Ecuador desde 4.000
 * habitantes, que es el corte que pidió el cliente el 2026-08-18.
 *
 * Junta dos fuentes porque ninguna basta sola:
 *
 *   1. `latam-10k-crudo.json` (ya descargado en estoeschat). Cubre de 10.000
 *      para arriba y es la buena: trae enlace a Wikipedia, web oficial,
 *      coordenadas y la división de primer nivel resuelta.
 *   2. `mx-4k.json` / `ec-4k.json`, la franja de 4.000 a 10.000, que hay que
 *      bajar aparte de Wikidata con `fetch-censo-wikidata.mjs`. Viene pelada:
 *      nombre, población y división, sin extracto ni web. No pasa nada, el cron
 *      de goteo baja la fuente por su cuenta antes de escribir y descarta lo que
 *      no consigue anclar.
 *
 * Si la franja baja no está descargada, el censo se construye igual con lo que
 * haya y lo dice por pantalla. Wikidata se cae a ratos —el 18 de agosto devolvió
 * 500, 502 y 504 durante horas— y no tiene sentido bloquear la cobertura de las
 * 1.700 localidades que sí están por las que no.
 *
 * Aviso de siempre: Wikidata NO es un padrón. Para México el censo real es el
 * del INEGI y para Ecuador el del INEC. Lo que sale de aquí es un suelo de
 * cobertura, no el país entero.
 *
 * Uso: node scripts/localidades/censo-mx-ec.mjs [dir-franja-baja]
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ORIGEN = "/home/javier/estoeschat/data";
const SALIDA = join(ORIGEN, "latam-4k-mx-ec.json");
const FRANJA_BAJA = process.argv[2] ?? ORIGEN;
const UMBRAL = 4000;

const PAISES = {
  mexico: { nombre: "México", fichero: "mx-4k.json" },
  ecuador: { nombre: "Ecuador", fichero: "ec-4k.json" },
};

const leer = (ruta, porDefecto = null) =>
  existsSync(ruta) ? JSON.parse(readFileSync(ruta, "utf8")) : porDefecto;

const crudo = leer(join(ORIGEN, "latam-10k-crudo.json"), null);
if (!crudo) {
  console.error(`falta ${join(ORIGEN, "latam-10k-crudo.json")}`);
  process.exit(1);
}
const listaCruda = Array.isArray(crudo) ? crudo : crudo.localidades ?? [];

// Clave por QID cuando lo hay; si no, nombre + país, que para estos dos países
// no colisiona dentro del mismo censo.
const clave = (x, paisSlug) => x.qid ?? `${paisSlug}:${(x.nombre ?? x.nombre_wd ?? "").toLowerCase()}`;

const porClave = new Map();
let deLaCompleta = 0;

for (const l of listaCruda) {
  const paisSlug = l.pais_slug;
  if (!PAISES[paisSlug]) continue;
  if ((l.poblacion ?? 0) < UMBRAL) continue;
  porClave.set(clave(l, paisSlug), {
    qid: l.qid ?? null,
    pais: l.pais,
    pais_slug: paisSlug,
    nombre: l.nombre ?? l.nombre_wd,
    poblacion: l.poblacion,
    division: l.division ?? null,
    wikipedia_url: l.wikipedia_url ?? null,
    web_oficial: l.web_oficial ?? null,
    coords: l.coords ?? null,
    franja: "10k+",
  });
  deLaCompleta++;
}

const faltan = [];
for (const [paisSlug, { nombre, fichero }] of Object.entries(PAISES)) {
  const baja = leer(join(FRANJA_BAJA, fichero), null);
  if (!baja || !baja.length) {
    faltan.push(`${nombre} (${fichero})`);
    continue;
  }
  for (const l of baja) {
    if ((l.poblacion ?? 0) < UMBRAL) continue;
    const k = clave(l, paisSlug);
    // La entrada rica gana siempre: la franja baja no trae fuente.
    if (porClave.has(k)) continue;
    porClave.set(k, {
      qid: l.qid ?? null,
      pais: nombre,
      pais_slug: paisSlug,
      nombre: l.nombre,
      poblacion: l.poblacion,
      division: l.division ?? null,
      wikipedia_url: null,
      web_oficial: null,
      coords: null,
      franja: "4k-10k",
    });
  }
}

const localidades = [...porClave.values()].sort((a, b) => b.poblacion - a.poblacion);
const porPais = {};
for (const l of localidades) {
  porPais[l.pais] ??= { total: 0, "10k+": 0, "4k-10k": 0, conWikipedia: 0 };
  porPais[l.pais].total++;
  porPais[l.pais][l.franja]++;
  if (l.wikipedia_url) porPais[l.pais].conWikipedia++;
}

writeFileSync(
  SALIDA,
  JSON.stringify(
    {
      umbral: UMBRAL,
      fuente: "Wikidata (no es padrón: para México manda el INEGI y para Ecuador el INEC)",
      fecha: new Date().toISOString().slice(0, 10),
      resumen: Object.entries(porPais).map(([pais, r]) => ({ pais, ...r })),
      incompleto: faltan,
      localidades,
    },
    null,
    1,
  ),
);

console.log(`${localidades.length} localidades escritas en ${SALIDA}`);
console.table(porPais);
if (faltan.length) {
  console.log(`\nFRANJA 4.000-10.000 SIN DESCARGAR: ${faltan.join(", ")}`);
  console.log("Se completa con: node scripts/localidades/fetch-censo-wikidata.mjs Q96 mexico <dir>/mx-4k.json");
  console.log("                 node scripts/localidades/fetch-censo-wikidata.mjs Q736 ecuador <dir>/ec-4k.json");
  console.log("y volviendo a ejecutar este script.");
}
