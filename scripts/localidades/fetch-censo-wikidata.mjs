#!/usr/bin/env node
/**
 * Censo de asentamientos de un país por tramos de población, desde Wikidata.
 *
 * Consulta MÍNIMA a propósito: sin los OPTIONAL de web oficial, coordenadas y
 * enlace a Wikipedia, que son los joins que hacían que WDQS devolviera 504 con
 * México entero. El enriquecido va en otra pasada, contra la API REST de
 * Wikipedia, que es otro servicio y aguanta bien.
 *
 * Y cuando un tramo falla, se PARTE EN DOS y se reintenta cada mitad. Un 504 de
 * WDQS quiere decir «esta consulta no me cabe en el minuto que te doy», no «no
 * hay nada»: con los tramos fijos, la tanda del 18 de agosto devolvía 74 filas
 * en 4.000-5.000 y cero en el siguiente, y ese cero se habría leído como que
 * México no tiene pueblos de 5.000 a 6.500 habitantes. Partiendo, cada mitad
 * cabe y los datos aparecen.
 *
 * Uso: node fetch-min.mjs <QID_pais> <slug_pais> <salida.json>
 */
import fs from "node:fs";

const [qid, slugPais, salida] = process.argv.slice(2);
const TRAMOS = [
  [4000, 5000], [5000, 6500], [6500, 8500], [8500, 12000],
  [12000, 20000], [20000, 40000], [40000, 100000], [100000, 500000], [500000, 1e9],
];
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

/** Rangos de población tan estrechos que ya no tiene sentido partirlos más. */
const ANCHO_MINIMO = 250;

async function pide(min, max, intento = 1) {
  const query = `SELECT ?item ?nombre ?pob ?admNombre WHERE {
  ?item wdt:P17 wd:${qid} ; wdt:P31/wdt:P279* wd:Q486972 ; wdt:P1082 ?pob .
  FILTER(?pob >= ${min} && ?pob < ${max})
  OPTIONAL { ?item wdt:P131 ?adm . ?adm rdfs:label ?admNombre . FILTER(LANG(?admNombre)="es") }
  ?item rdfs:label ?nombre . FILTER(LANG(?nombre)="es") }`;
  try {
    const res = await fetch(
      "https://query.wikidata.org/sparql?format=json&query=" + encodeURIComponent(query),
      {
        headers: {
          "User-Agent": "tuchat.org/1.0 (comansito@gmail.com)",
          Accept: "application/sparql-results+json",
        },
        signal: AbortSignal.timeout(120000),
      },
    );
    if (!res.ok) throw new Error("HTTP " + res.status);
    return (await res.json()).results.bindings;
  } catch (e) {
    if (intento < 3) {
      console.error(`  · ${min}-${max} intento ${intento}: ${e.message}`);
      await dormir(10000 * intento);
      return pide(min, max, intento + 1);
    }
    // Tres fallos seguidos: el tramo es demasiado grande para el servicio. Se
    // parte por la mitad y se piden las dos mitades por separado.
    if (max - min > ANCHO_MINIMO) {
      const medio = Math.round((min + max) / 2);
      console.error(`  ÷ ${min}-${max} no entra: se parte en ${min}-${medio} y ${medio}-${max}`);
      await dormir(5000);
      const izquierda = await pide(min, medio);
      await dormir(2000);
      const derecha = await pide(medio, max);
      return [...izquierda, ...derecha];
    }
    console.error(`  ! ${min}-${max} abandonado: ${e.message}`);
    return [];
  }
}

const porItem = new Map();
for (const [min, max] of TRAMOS) {
  const filas = await pide(min, max);
  for (const b of filas) {
    const it = b.item.value;
    const pob = Number(b.pob.value);
    const prev = porItem.get(it);
    if (prev && prev.poblacion >= pob) continue;
    porItem.set(it, {
      qid: it.split("/").pop(),
      nombre: b.nombre.value,
      poblacion: pob,
      division: b.admNombre?.value || null,
    });
  }
  console.error(`  ${min}-${max}: ${filas.length} filas · total ${porItem.size}`);
  await dormir(1500);
}

const filas = [...porItem.values()].sort((a, b) => b.poblacion - a.poblacion);
console.error(`${slugPais}: ${filas.length} asentamientos >= 4.000 hab`);
fs.writeFileSync(salida, JSON.stringify(filas, null, 1));
