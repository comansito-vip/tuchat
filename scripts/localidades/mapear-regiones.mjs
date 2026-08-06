#!/usr/bin/env node
/**
 * Averigua a qué provincia/estado/departamento pertenece cada ciudad americana
 * del catálogo y deja el resultado en `src/data/city-regions.ts`.
 *
 * Hace falta porque 267 de las 272 ciudades mexicanas no tienen `regionSlug`:
 * cuelgan directamente del país. Eso significa que
 *   · no hay página de estado a la que enlazar desde la ciudad, y
 *   · una sala de estado nacería vacía, porque `getCitiesByRegion` no
 *     encontraría ninguna ciudad suya.
 * Es el agujero de enlazado interno que destapó el diagnóstico de indexación:
 * las salas de ciudad solo enlazan hacia arriba al país, que es un salto enorme.
 *
 * El mapa se escribe APARTE y se aplica al cargar el catálogo, en vez de
 * reescribir `cities-world.ts` (2,3 MB de datos escritos a mano, con sus
 * comentarios): así el cambio es de una línea, reversible y no toca el original.
 *
 * Uso: npx tsx scripts/localidades/mapear-regiones.mjs [--check]
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { norm, variantesDe, distanciaKm } from "./duplicados.mjs";

const ORIGEN = "/home/javier/estoeschat/data";
const SALIDA = join(process.cwd(), "src", "data", "city-regions.ts");
const CHECK = process.argv.includes("--check");

const leer = (n) => {
  const ruta = join(ORIGEN, n);
  return existsSync(ruta) ? JSON.parse(readFileSync(ruta, "utf8")) : null;
};

/** Todas las localidades conocidas de los censos, con su división de primer nivel. */
function censoCompleto() {
  const fuentes = [];
  const l15 = leer("latam-15k.json") ?? [];
  for (const l of l15) {
    fuentes.push({
      nombre: l.nombre, slug: l.slug, pais: l.pais_slug,
      region: l.region, coords: l.coords,
    });
  }
  for (const fichero of ["latam-10k-crudo.json", "latam-5k-4paises-crudo.json"]) {
    for (const l of leer(fichero)?.localidades ?? []) {
      fuentes.push({
        nombre: l.nombre ?? l.nombre_wd, slug: l.slug ?? null, pais: l.pais_slug,
        region: l.division, coords: l.coords,
      });
    }
  }
  return fuentes.filter((x) => x.region && x.coords);
}

async function main() {
  // Las listas CRUDAS, no `getCities()`: ese ya aplica el mapa de la ejecución
  // anterior, así que ninguna ciudad parecería necesitarlo y el script se
  // vaciaba a sí mismo en la segunda pasada.
  const { CITIES } = await import("../../src/data/cities.ts");
  const { CITIES_WORLD } = await import("../../src/data/cities-world.ts");
  const { CITIES_GENERADAS } = await import("../../src/data/cities-generadas.ts");
  const { CITY_COORDS } = await import("../../src/data/coords.ts");
  const getCities = () => [...CITIES, ...CITIES_WORLD, ...CITIES_GENERADAS];

  const censo = censoCompleto();
  // Índice por nombre normalizado y país, guardando TODOS los candidatos.
  //
  // Quedarse con el primero parecía suficiente y no lo era: Colombia tiene un
  // Villanueva en La Guajira, otro en Bolívar y otro en Casanare, así que
  // `villanueva-bolivar` y `villanueva-casanare` acabaron los dos etiquetados
  // como La Guajira y emitían el mismo <title>. Lo pilló data.test.ts.
  const porClave = new Map();
  for (const c of censo) {
    for (const v of variantesDe(c.nombre)) {
      const clave = `${c.pais}|${v}`;
      if (!porClave.has(clave)) porClave.set(clave, []);
      porClave.get(clave).push(c);
    }
  }

  /**
   * Elige entre varios homónimos del mismo país. Solo devuelve algo cuando la
   * elección es segura: primero las coordenadas, y si no, el sufijo del slug
   * (`villanueva-bolivar` dice por sí mismo que es el de Bolívar). Ante la duda,
   * null: dejar una ciudad sin provincia es inocuo, ponerle la equivocada no.
   */
  const elegir = (candidatos, slug, coords) => {
    const regiones = new Set(candidatos.map((c) => norm(c.region)));
    if (regiones.size === 1) return candidatos[0];
    if (coords) {
      const cerca = candidatos
        .filter((c) => c.coords && distanciaKm(coords, c.coords) <= 5)
        .sort((a, b) => distanciaKm(coords, a.coords) - distanciaKm(coords, b.coords));
      if (cerca.length) return cerca[0];
    }
    const porSufijo = candidatos.filter((c) => slug.endsWith(`-${norm(c.region)}`));
    if (porSufijo.length === 1) return porSufijo[0];
    return null;
  };

  const mapa = {};
  const sinResolver = [];
  const ambiguas = [];
  let porNombre = 0;
  let porCoords = 0;

  for (const ciudad of getCities()) {
    if (ciudad.regionSlug || ciudad.parentSlug === "espana" || !ciudad.parentSlug) continue;

    const coords = CITY_COORDS[ciudad.slug];
    let hallada = null;
    for (const v of variantesDe(ciudad.name)) {
      const candidatos = porClave.get(`${ciudad.parentSlug}|${v}`);
      if (!candidatos) continue;
      hallada = elegir(candidatos, ciudad.slug, coords);
      if (hallada) break;
      // Homónimos que no se pueden separar: no se prueba con otra variante del
      // nombre, porque daría el mismo empate con menos información.
      ambiguas.push(`${ciudad.slug} (${candidatos.length} homónimos)`);
      break;
    }
    if (hallada) porNombre++;

    // Si el nombre no basta, la posición decide: a menos de 5 km es la misma.
    if (!hallada && coords) {
      let mejor = null;
      for (const c of censo) {
        if (c.pais !== ciudad.parentSlug) continue;
        const km = distanciaKm(coords, c.coords);
        if (km <= 5 && (!mejor || km < mejor.km)) mejor = { ...c, km };
      }
      if (mejor) { hallada = mejor; porCoords++; }
    }

    if (!hallada) { sinResolver.push(`${ciudad.slug} (${ciudad.parentSlug})`); continue; }
    mapa[ciudad.slug] = { provincia: hallada.region, regionSlug: norm(hallada.region) };
  }

  const total = Object.keys(mapa).length;
  console.log(`ciudades americanas sin regionSlug: ${total + sinResolver.length}`);
  console.log(`  resueltas: ${total}  (${porNombre} por nombre, ${porCoords} por coordenadas)`);
  console.log(`  sin resolver: ${sinResolver.length}`);
  console.log(`  descartadas por homónimo ambiguo: ${ambiguas.length}`);
  if (ambiguas.length) console.log(`    ${ambiguas.slice(0, 10).join(", ")}${ambiguas.length > 10 ? "…" : ""}`);
  if (sinResolver.length) console.log(`    ${sinResolver.slice(0, 12).join(", ")}${sinResolver.length > 12 ? "…" : ""}`);

  // Cuántas ciudades por región: las regiones con una sola ciudad no justifican
  // una sala propia todavía, y conviene verlo antes de crear ninguna.
  const porRegion = {};
  for (const v of Object.values(mapa)) porRegion[v.regionSlug] = (porRegion[v.regionSlug] ?? 0) + 1;
  const top = Object.entries(porRegion).sort((a, b) => b[1] - a[1]).slice(0, 15);
  console.log(`\nregiones con más ciudades:`);
  for (const [r, n] of top) console.log(`  ${String(n).padStart(3)}  ${r}`);

  if (CHECK) { console.log("\n--check: no se escribe nada"); return; }

  const entradas = Object.entries(mapa).sort(([a], [b]) => a.localeCompare(b))
    .map(([slug, v]) => `  ${JSON.stringify(slug)}: ${JSON.stringify(v)},`).join("\n");

  writeFileSync(SALIDA, `// Provincia/estado/departamento de cada ciudad americana del catálogo.
//
// GENERADO por scripts/localidades/mapear-regiones.mjs — no editar a mano.
//
// Existe porque las ciudades de cities-world.ts se escribieron colgando solo del
// país: 267 de las 272 mexicanas no sabían en qué estado estaban. Sin esto no
// hay página de estado a la que enlazar y una sala de estado nacería vacía.
//
// Se aplica al cargar el catálogo (src/data/index.ts) en vez de reescribir
// cities-world.ts, que son 2,3 MB de datos escritos a mano.
export const CITY_REGIONS: Record<string, { provincia: string; regionSlug: string }> = {
${entradas}
};
`);
  console.log(`\nescrito ${total} entradas en src/data/city-regions.ts`);
}

main().catch((e) => { console.error(e); process.exit(1); });
