#!/usr/bin/env npx tsx
/**
 * Repara las salas de localidad que salieron con la costura del generador.
 *
 * QUÉ PASÓ (medido el 2026-08-18 sobre las 107 salas publicadas por el cron):
 * casi todas cerraban con un párrafo entero sobre la propia sala de chat, con
 * el nombre del pueblo cambiado y nada más:
 *
 *   «En la sala de chat de {LOCALIDAD} los vecinos comparten información sobre
 *    la vida cotidiana, eventos locales y temas de interés general.»
 *
 * Ni una palabra de eso sale del material de origen, y el párrafo es la mitad
 * de la ficha: al quitarlo, solo 16 de las 107 conservan las 100 palabras
 * mínimas. Es el mismo molde que costó la reescritura de
 * `src/app/chat/[slug]/copy.ts`, esta vez dentro del texto que escribe el LLM.
 *
 * La causa estaba en el prompt, que pedía «de qué se habla en su sala y quién
 * entra» —un dato que no existe— y en el verificador, que tenía orden expresa
 * de no marcarlo. Las dos cosas ya están corregidas en `salas-geo.mjs`. Esto
 * limpia lo que se publicó antes de la corrección.
 *
 * QUÉ HACE, por casos:
 *
 *   1. DUPLICADAS (6). `Partido de Tandil` es Tandil, que YA tenía sala. Dos
 *      URLs para el mismo pueblo. Se borran y se redirigen a la buena.
 *   2. MAL NOMBRADAS (6). `Distrito de Paita` es Paita y no había otra: se
 *      renombran, se les cambia el slug y se apuntan para rehacer el texto.
 *      También entra aquí `ventanilla-`, con un guion suelto en el slug.
 *   3. SALVABLES (las que aguantan 100 palabras sin el párrafo inventado): se
 *      les quita y se quedan como están, publicadas.
 *   4. EL RESTO: se apuntan en `rehacer.json` y **siguen publicadas** mientras
 *      tanto. `salas-geo.mjs --rehacer` las reescribe en su sitio con el prompt
 *      ya corregido. Ninguna URL se cae: una página que aparece y desaparece es
 *      peor señal que una ficha mejorable.
 *
 * Los renombrados y los borrados hay que añadirlos a mano al mapa `renamed` de
 * `next.config.ts` — el script los imprime listos para copiar.
 *
 *   npx tsx scripts/localidades/curar-costura.mjs           (simulación)
 *   npx tsx scripts/localidades/curar-costura.mjs --write    (aplica)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const WRITE = process.argv.includes("--write");
const RAIZ = process.cwd();
const GENERADAS = join(RAIZ, "data", "localidades", "generadas.json");
const REHACER = join(RAIZ, "data", "localidades", "rehacer.json");
const SALIDA_TS = join(RAIZ, "src", "data", "cities-generadas.ts");

const MINIMO_PALABRAS = 100;

/**
 * Señales de que un párrafo habla de LA SALA y no del lugar.
 *
 * Va más allá de la lista de muletillas a propósito: quitar solo la frase
 * marcada dejaba en pie el resto del párrafo («La conversación suele girar en
 * torno a la movilidad urbana, la oferta educativa y la seguridad del barrio»),
 * que es el mismo invento con otras palabras. O se va el párrafo entero o no
 * sirve de nada.
 */
const DE_LA_SALA =
  /(sala de chat|los usuarios|la conversaci[óo]n|se comentan|se conversa|se discuten|los participantes|quienes? entran?|se habla sobre|intercambian|comparten (informaci[óo]n|experiencias)|punto de encuentro|espacio para)/i;

const palabras = (t) => String(t ?? "").trim().split(/\s+/).filter(Boolean).length;

/** Los párrafos tal y como los guarda el JSON: con \n\n reales o escapados. */
const enParrafos = (texto) =>
  String(texto ?? "").split(/\\n\\n|\n\n/).map((p) => p.trim()).filter(Boolean);

const slugDe = (nombre) =>
  nombre
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * Las once salas con el envoltorio administrativo en el nombre y la del slug
 * roto, resueltas a mano contra el catálogo. `duplicadaDe` quiere decir que el
 * pueblo YA tiene sala con su nombre y esta sobra: se borra y se redirige.
 *
 * Hay que comprobarlo con el slug REAL y no con uno derivado del nombre: al
 * hacerlo con un normalizador propio, "José C. Paz" salió como `jose-c.-paz`
 * —con el punto dentro— y dio por libre un slug que estaba ocupado. Lo cazó
 * `data.test.ts` al aplicar.
 */
const RENOMBRAR = {
  "partido-de-tandil": { nombre: "Tandil", duplicadaDe: "tandil" },
  "partido-de-olavarria": { nombre: "Olavarría", duplicadaDe: "olavarria" },
  "partido-de-san-miguel": { nombre: "San Miguel", duplicadaDe: "san-miguel" },
  "partido-de-san-martin": { nombre: "San Martín", duplicadaDe: "san-martin" },
  "area-metropolitana-de-piura": { nombre: "Piura", duplicadaDe: "piura" },
  "distrito-de-paita": { nombre: "Paita" },
  "distrito-de-huaral": { nombre: "Huaral" },
  "distrito-de-majes": { nombre: "Majes" },
  "distrito-de-lurigancho-chosica": { nombre: "Lurigancho-Chosica" },
  "distrito-de-carabayllo": { nombre: "Carabayllo" },
  "partido-de-jose-c-paz": { nombre: "José C. Paz", duplicadaDe: "jose-c-paz" },
  "ventanilla-": { nombre: "Ventanilla" },
};

const generadas = JSON.parse(readFileSync(GENERADAS, "utf8"));

const borradas = [];
const renombradas = [];
const operadas = [];
const aRehacer = [];
const intactas = [];

const salida = [];

for (const f of generadas) {
  const orden = RENOMBRAR[f.slug];

  if (orden?.duplicadaDe) {
    borradas.push({ ...f, haciaSlug: orden.duplicadaDe });
    continue;
  }

  const registro = { ...f };
  if (orden) {
    registro.name = orden.nombre;
    registro.slug = slugDe(orden.nombre);
    renombradas.push({ de: f.slug, a: registro.slug, nombre: orden.nombre });
    aRehacer.push(registro.slug);
    salida.push(registro);
    continue;
  }

  const parrafos = enParrafos(f.about);
  const delLugar = parrafos.filter((p) => !DE_LA_SALA.test(p));

  if (delLugar.length === parrafos.length) {
    intactas.push(f);
    salida.push(registro);
    continue;
  }

  const limpio = delLugar.join("\n\n");
  if (palabras(limpio) >= MINIMO_PALABRAS && !DE_LA_SALA.test(f.intro)) {
    registro.about = limpio;
    operadas.push({ slug: f.slug, antes: palabras(f.about), despues: palabras(limpio) });
    salida.push(registro);
    continue;
  }

  // No se toca el texto: se deja publicada y se apunta para rehacer.
  aRehacer.push(f.slug);
  salida.push(registro);
}

// Los `related` de las demás fichas apuntaban a las que se borran y a las que
// cambian de slug: sin arreglarlos, quedan enlaces a páginas que ya no existen
// y `data.test.ts` lo caza. Se remapean al destino real y se cae lo que no
// tenga ninguno.
const remapa = new Map([
  ...borradas.map((b) => [b.slug, b.haciaSlug]),
  ...renombradas.map((r) => [r.de, r.a]),
]);
let enlacesArreglados = 0;
for (const f of salida) {
  if (!Array.isArray(f.related)) continue;
  const antes = f.related.join("|");
  f.related = [...new Set(f.related.map((r) => remapa.get(r) ?? r))].filter((r) => r !== f.slug);
  if (f.related.join("|") !== antes) enlacesArreglados++;
}

console.log(`salas generadas: ${generadas.length}`);
console.log(`  fichas con enlaces remapeados:   ${enlacesArreglados}`);
console.log(`  intactas, sin párrafo inventado: ${intactas.length}`);
console.log(`  operadas (párrafo fuera):        ${operadas.length}`);
console.log(`  borradas por duplicadas:         ${borradas.length}`);
console.log(`  renombradas:                     ${renombradas.length}`);
console.log(`  apuntadas para rehacer:          ${aRehacer.length}`);

if (borradas.length) {
  console.log("\nBORRADAS (el pueblo ya tenía sala con su nombre):");
  for (const b of borradas) console.log(`  ✗ ${b.slug.padEnd(32)} → ${b.haciaSlug}`);
}
if (renombradas.length) {
  console.log("\nRENOMBRADAS:");
  for (const r of renombradas) console.log(`  → ${r.de.padEnd(32)} → ${r.a}  ("${r.nombre}")`);
}

console.log("\nPara el mapa `renamed` de next.config.ts:");
for (const b of borradas) console.log(`      "${b.slug}": "${b.haciaSlug}",`);
for (const r of renombradas) console.log(`      "${r.de}": "${r.a}",`);

/** Mismo formato que emite scripts/cron/salas-geo.mjs: este fichero es suyo. */
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

if (!WRITE) {
  console.log("\n(simulación: no se ha escrito nada — pasa --write para aplicar)");
  process.exit(0);
}

const yaApuntadas = (() => {
  try { return JSON.parse(readFileSync(REHACER, "utf8")); } catch { return []; }
})();
const cola = [...new Set([...yaApuntadas, ...aRehacer])];

writeFileSync(GENERADAS, JSON.stringify(salida, null, 1));
writeFileSync(SALIDA_TS, emitirTS(salida));
writeFileSync(REHACER, JSON.stringify(cola, null, 1));

console.log(`\nescrito: ${salida.length} salas publicadas · ${cola.length} en rehacer.json`);
console.log("siguiente paso: npx tsx scripts/cron/salas-geo.mjs --rehacer --lote 50");
