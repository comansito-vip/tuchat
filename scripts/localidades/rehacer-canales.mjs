#!/usr/bin/env node
/**
 * Recalcula los canales de IRC de las salas que publicó el cron, sin volver a
 * pasar por el LLM.
 *
 * Hizo falta porque la primera versión de `salas-geo.mjs` metía el slug de la
 * localidad como primer canal sin comprobar que existiera en la red: las doce
 * salas del primer lote mandaban a `#apodaca`, `#vitarte`, `#chorrillos`… que
 * no existen, así que el usuario habría aterrizado solo en un canal vacío.
 * `channels.test.ts` lo detectó. El texto de las fichas estaba bien, así que se
 * arreglan los canales y se deja el contenido como está.
 *
 * Uso: npx tsx scripts/localidades/rehacer-canales.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const RAIZ = process.cwd();
const GENERADAS = join(RAIZ, "data", "localidades", "generadas.json");
const SALIDA_TS = join(RAIZ, "src", "data", "cities-generadas.ts");

// Las reglas están en src/data/irc-canal.ts, compartidas con el cron y con
// scripts/fix-irc-channels.ts. Aquí no se decide nada.
const { channelsForCity } = await import("../../src/data/irc-canal.ts");
const canales = (r) => channelsForCity(r.slug, r.parentSlug, [r.regionSlug]);

function emitirTS(registros) {
  const cuerpo = registros
    .map((r) => "  " + JSON.stringify(r, null, 2).split("\n").join("\n  "))
    .join(",\n");
  return `import type { Place } from "./types";

// Salas de localidad publicadas por el cron scripts/cron/salas-geo.mjs, a razón
// de una docena al día. NO EDITAR A MANO: este fichero se reescribe entero a
// partir de data/localidades/generadas.json, que es la fuente de verdad y
// guarda además la fuente consultada de cada localidad.
//
// Cada ficha se redactó contra el extracto de Wikipedia y la portada de la web
// del ayuntamiento de esa localidad, y la verificó un modelo distinto del que
// la escribió.
export const CITIES_GENERADAS: Place[] = [
${cuerpo}
];
`;
}

const registros = JSON.parse(readFileSync(GENERADAS, "utf8"));
let cambiadas = 0;
for (const r of registros) {
  const nuevos = canales(r);
  if (JSON.stringify(nuevos) !== JSON.stringify(r.channels)) {
    console.log(`  ${r.slug}: ${r.channels.join(",")} → ${nuevos.join(",")}`);
    r.channels = nuevos;
    cambiadas++;
  }
}
writeFileSync(GENERADAS, JSON.stringify(registros, null, 1));
writeFileSync(SALIDA_TS, emitirTS(registros));
console.log(`\n${cambiadas} de ${registros.length} salas con canales corregidos`);
