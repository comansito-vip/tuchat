#!/usr/bin/env node
/**
 * Mide qué le falta a tuchat contra los objetivos de cobertura, sin escribir nada.
 *
 *   · España                    — todos los municipios de más de 8.000 hab
 *   · América hispanohablante   — todas las localidades de más de 20.000 hab
 *   · Colombia, Perú, Uruguay
 *     y Argentina               — todas las de más de 5.000 hab
 *
 * El recuento se hace con el mismo matcher que usa el generador (variantes de
 * nombre + proximidad geográfica), porque comparar slugs a pelo da falsos
 * huecos: "Vitoria-Gasteiz" contra "vitoria", "Eivissa" contra "ibiza".
 *
 * Uso: node scripts/localidades/auditar-cobertura.mjs [--detalle]
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { indexar, yaExiste } from "./duplicados.mjs";

const ORIGEN = "/home/javier/estoeschat/data";
const PAISES_5K = ["Colombia", "Perú", "Uruguay", "Argentina"];
const detalle = process.argv.includes("--detalle");

const leer = (n) => {
  const ruta = join(ORIGEN, n);
  if (!existsSync(ruta)) return null;
  return JSON.parse(readFileSync(ruta, "utf8"));
};

async function salasExistentes() {
  const { CITIES } = await import("../../src/data/cities.ts");
  const { CITIES_WORLD } = await import("../../src/data/cities-world.ts");
  const { CITY_COORDS } = await import("../../src/data/coords.ts");
  return {
    indice: indexar([...CITIES, ...CITIES_WORLD], CITY_COORDS),
    total: CITIES.length + CITIES_WORLD.length,
  };
}

/** Reparte un censo en cubiertas / faltantes contra las salas ya publicadas. */
function medir(indice, censo, aEntrada) {
  const faltan = [];
  let cubiertas = 0;
  for (const registro of censo) {
    const e = aEntrada(registro);
    if (yaExiste(indice, e)) cubiertas++;
    else faltan.push(e);
  }
  return { objetivo: censo.length, cubiertas, faltan };
}

const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

function informe(titulo, r) {
  console.log(
    `${titulo.padEnd(34)} objetivo ${String(r.objetivo).padStart(5)}` +
    ` · tiene ${String(r.cubiertas).padStart(5)}` +
    ` · faltan ${String(r.faltan.length).padStart(5)}` +
    ` · ${String(pct(r.cubiertas, r.objetivo)).padStart(3)}%`,
  );
}

/** Desglose por país de una lista de faltantes, de mayor hueco a menor. */
function porPais(faltan) {
  const cuenta = {};
  for (const x of faltan) cuenta[x.pais] = (cuenta[x.pais] ?? 0) + 1;
  return Object.entries(cuenta).sort((a, b) => b[1] - a[1]);
}

async function main() {
  const { indice, total } = await salasExistentes();
  console.log(`salas de localidad publicadas ahora mismo: ${total}\n`);

  // ── España >8.000 (padrón INE, no Wikidata: Wikidata solo ve 671 de 942) ────
  const censoEs = leer("es-municipios-8k.json");
  const es = medir(indice, censoEs, (m) => ({
    pais: "España",
    nombre: m.nombre,
    slug: m.slug ?? null,
    poblacion: m.poblacion,
    region: m.provincia,
    coords: m.coords ?? null,
  }));
  informe("ESPAÑA >8.000 hab", es);

  // ── América hispanohablante >20.000 ────────────────────────────────────────
  const censoAm = leer("latam-15k.json").filter((x) => (x.poblacion ?? 0) >= 20000);
  const am = medir(indice, censoAm, (l) => ({
    pais: l.pais,
    nombre: l.nombre,
    slug: l.slug,
    poblacion: l.poblacion,
    region: l.region,
    coords: l.coords ?? null,
  }));
  informe("AMÉRICA hispana >20.000 hab", am);

  // ── Los cuatro países con corte propio en 5.000 ────────────────────────────
  // Censo descargado a propósito con UMBRAL=5000 (fetch-latam-15k.mjs). Aviso
  // importante: sale de Wikidata, que NO es un padrón. En España devolvía 671
  // municipios de más de 8.000 cuando el INE da 942, así que estas cifras son un
  // suelo: para cobertura real hay que contrastar con DANE, INEI, INE-UY e INDEC.
  const censo5k = leer("latam-5k-4paises-crudo.json")?.localidades
    ?? leer("latam-10k-crudo.json")?.localidades ?? [];
  console.log("");
  for (const pais of PAISES_5K) {
    const delPais = censo5k.filter((x) => x.pais === pais && (x.poblacion ?? 0) >= 5000);
    if (!delPais.length) continue;
    const r = medir(indice, delPais, (l) => ({
      pais: l.pais,
      nombre: l.nombre ?? l.nombre_wd,
      slug: l.slug ?? null,
      poblacion: l.poblacion,
      region: l.division,
      coords: l.coords ?? null,
    }));
    informe(`${pais} >5.000 hab`, r);
  }

  console.log("\nhuecos por país (América >20.000):");
  for (const [pais, n] of porPais(am.faltan)) {
    console.log(`  ${pais.padEnd(22)} ${String(n).padStart(4)}`);
  }

  if (detalle) {
    console.log("\n--- 40 mayores huecos de España ---");
    for (const x of es.faltan.sort((a, b) => b.poblacion - a.poblacion).slice(0, 40)) {
      console.log(`  ${String(x.poblacion).padStart(7)}  ${x.nombre} (${x.region})`);
    }
    console.log("\n--- 40 mayores huecos de América ---");
    for (const x of am.faltan.sort((a, b) => b.poblacion - a.poblacion).slice(0, 40)) {
      console.log(`  ${String(x.poblacion).padStart(7)}  ${x.nombre} (${x.pais})`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
