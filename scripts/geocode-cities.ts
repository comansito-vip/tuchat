/**
 * Geocodifica todas las salas de ciudad/país contra la API de geocoding de
 * Open-Meteo (gratuita, sin clave) y escribe `src/data/coords.ts`.
 *
 * Se ejecuta a mano cuando se añaden ciudades nuevas — NO en cada build: el
 * resultado se commitea, así el build no depende de una API externa.
 *
 *   npx tsx scripts/geocode-cities.ts
 *
 * Desambiguación: Open-Meteo devuelve homónimos de todo el mundo (hay un
 * "Abrera" en India). Se filtra por código de país y, cuando hay varios
 * candidatos dentro del país, gana el que coincide en provincia; en su defecto,
 * el más poblado. Los que no resuelven se listan al final y simplemente no
 * entran en el fichero (su página cae al fallback, como hasta ahora).
 */
import { writeFileSync } from "node:fs";
import { getCities, getCountries } from "../src/data";

// Código ISO de país por slug de país del catálogo.
const COUNTRY_CODE: Record<string, string> = {
  espana: "ES",
  mexico: "MX",
  argentina: "AR",
  colombia: "CO",
  chile: "CL",
  peru: "PE",
  uruguay: "UY",
  venezuela: "VE",
  ecuador: "EC",
  bolivia: "BO",
  paraguay: "PY",
  "republica-dominicana": "DO",
  cuba: "CU",
  "puerto-rico": "PR",
  guatemala: "GT",
  "costa-rica": "CR",
  panama: "PA",
  "el-salvador": "SV",
  honduras: "HN",
  nicaragua: "NI",
  belice: "BZ",
  "estados-unidos": "US",
  canada: "CA",
  francia: "FR",
  italia: "IT",
  portugal: "PT",
  alemania: "DE",
  "reino-unido": "GB",
  marruecos: "MA",
  "guinea-ecuatorial": "GQ",
};

interface GeoResult {
  name: string;
  latitude: number;
  longitude: number;
  country_code: string;
  timezone: string;
  population?: number;
  admin1?: string;
  admin2?: string;
}

interface Coord {
  lat: number;
  lon: number;
  tz: string;
}

// Compara provincia del catálogo con admin1/admin2 de Open-Meteo, que vienen con
// prefijos ("Provincia de Barcelona") y a veces bilingües ("Valencia/València").
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z ]/g, " ")
    .replace(/\b(provincia|de|del|la|el|comunidad|autonoma|region|departamento|estado)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function provinceMatches(provincia: string | undefined, r: GeoResult): boolean {
  if (!provincia) return false;
  // "Valencia/València" → cualquiera de las dos formas vale.
  const wanted = provincia.split("/").map(normalize).filter(Boolean);
  const got = [r.admin1, r.admin2].filter(Boolean).map((a) => normalize(a!));
  return wanted.some((w) => got.some((g) => g === w || g.includes(w) || w.includes(g)));
}

async function geocode(
  name: string,
  code: string,
  provincia: string | undefined,
): Promise<Coord | null> {
  const url =
    `https://geocoding-api.open-meteo.com/v1/search` +
    `?name=${encodeURIComponent(name)}&count=20&language=es&format=json`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = (await res.json()) as { results?: GeoResult[] };
  const inCountry = (data.results ?? []).filter((r) => r.country_code === code);
  if (!inCountry.length) return null;

  // Sin timezone no se puede pedir la previsión con horas locales correctas: se
  // descarta el candidato (los resultados a nivel país no la traen).
  const usable = inCountry.filter((r) => !!r.timezone);
  if (!usable.length) return null;

  const byProvince = usable.filter((r) => provinceMatches(provincia, r));
  const pool = byProvince.length ? byProvince : usable;
  const best = pool.reduce((a, b) => ((b.population ?? 0) > (a.population ?? 0) ? b : a));

  return { lat: +best.latitude.toFixed(4), lon: +best.longitude.toFixed(4), tz: best.timezone };
}

// Los países también tienen página de tiempo. Buscarlos por su nombre devuelve
// el CENTROIDE del país (España → un campo al sur de Madrid; Canadá → la tundra
// ártica) y además sin timezone. Se geocodifican por su capital, que es lo que
// cualquier servicio meteorológico entiende por "el tiempo en X".
const CAPITAL: Record<string, string> = {
  espana: "Madrid",
  mexico: "Ciudad de México",
  argentina: "Buenos Aires",
  colombia: "Bogotá",
  chile: "Santiago",
  peru: "Lima",
  uruguay: "Montevideo",
  venezuela: "Caracas",
  ecuador: "Quito",
  bolivia: "La Paz",
  paraguay: "Asunción",
  "republica-dominicana": "Santo Domingo",
  cuba: "La Habana",
  "puerto-rico": "San Juan",
  guatemala: "Ciudad de Guatemala",
  "costa-rica": "San José",
  panama: "Ciudad de Panamá",
  "el-salvador": "San Salvador",
  honduras: "Tegucigalpa",
  nicaragua: "Managua",
  belice: "Belmopan",
  "estados-unidos": "Washington",
  canada: "Ottawa",
  francia: "París",
  italia: "Roma",
  portugal: "Lisboa",
  alemania: "Berlín",
  "reino-unido": "Londres",
  marruecos: "Rabat",
  "guinea-ecuatorial": "Malabo",
};

async function main() {
  const targets: Array<{ slug: string; name: string; code: string; provincia?: string }> = [];

  for (const c of getCountries()) {
    const code = COUNTRY_CODE[c.slug];
    if (code) targets.push({ slug: c.slug, name: CAPITAL[c.slug] ?? c.name, code });
  }
  for (const c of getCities()) {
    const code = COUNTRY_CODE[c.parentSlug ?? ""];
    if (code) targets.push({ slug: c.slug, name: c.name, code, provincia: c.provincia });
  }

  const coords: Record<string, Coord> = {};
  const failed: string[] = [];

  // Secuencial con una pausa corta: la API es gratis y sin clave, no conviene
  // martillearla en paralelo.
  for (let i = 0; i < targets.length; i++) {
    const t = targets[i];
    try {
      const c = await geocode(t.name, t.code, t.provincia);
      if (c) coords[t.slug] = c;
      else failed.push(`${t.slug} (${t.name}, ${t.code})`);
    } catch (e) {
      failed.push(`${t.slug} (${t.name}, ${t.code}) — ${(e as Error).message}`);
    }
    if (i % 50 === 0) console.log(`  ${i}/${targets.length}…`);
    await new Promise((r) => setTimeout(r, 120));
  }

  const entries = Object.entries(coords).sort(([a], [b]) => a.localeCompare(b));
  const body = entries
    .map(([slug, c]) => `  ${JSON.stringify(slug)}: { lat: ${c.lat}, lon: ${c.lon}, tz: ${JSON.stringify(c.tz)} },`)
    .join("\n");

  writeFileSync(
    "src/data/coords.ts",
    `// Generado por scripts/geocode-cities.ts (Open-Meteo Geocoding API, sin clave).\n` +
      `// No editar a mano: reejecutar el script al añadir ciudades.\n` +
      `// ${entries.length} localidades geocodificadas.\n\n` +
      `export interface CityCoord {\n  lat: number;\n  lon: number;\n  tz: string;\n}\n\n` +
      `export const CITY_COORDS: Record<string, CityCoord> = {\n${body}\n};\n`,
  );

  console.log(`\n✓ ${entries.length} geocodificadas → src/data/coords.ts`);
  console.log(`✗ ${failed.length} sin resolver`);
  if (failed.length) console.log(failed.slice(0, 60).join("\n"));
}

main();
