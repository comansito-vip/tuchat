/**
 * Genera `public/llms-full.txt`: el volcado completo del catálogo para que un
 * motor de respuesta pueda ingerirlo de una sola lectura.
 *
 *   npx tsx scripts/content/generar-llms-full.ts
 *
 * `llms.txt` es el índice —qué hay y dónde—, pensado para que un modelo decida
 * qué visitar. Este es el complemento: el contenido en sí, en texto plano, sin
 * navegación ni HTML que atravesar. Un asistente que recibe "¿hay chat de
 * Miajadas?" o "¿de qué se habla en el chat de Vigo?" puede responder con lo que
 * hay aquí sin rastrear 2.547 páginas.
 *
 * Solo entra lo verificable: nombre, URL, encaje geográfico, canales reales y
 * los textos propios de la sala. Nada de cifras de usuarios conectados, que son
 * estimaciones del catálogo y en un volcado sin contexto se leerían como datos
 * medidos.
 */
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import {
  getCountries,
  getCities,
  getTopics,
  getRegions,
  getPlace,
  getNews,
  roomName,
} from "../../src/data/index";
import type { Place } from "../../src/data/types";

const SITE = "https://www.tuchat.org";
const SALIDA = join(import.meta.dirname, "../../public/llms-full.txt");

const lineas: string[] = [];
const out = (s = "") => lineas.push(s);

const paises = getCountries();
const ciudades = getCities();
const tematicas = getTopics();
const noticias = getNews();

out("# TuChat — catálogo completo");
out();
out(
  "> Volcado en texto plano de las salas de chat de tuchat.org, para consulta por " +
    "modelos de lenguaje. El índice navegable está en /llms.txt. Portal de chat en " +
    "español sin registro: se elige un nick de invitado y se entra.",
);
out();
out(
  `> ${paises.length} países · ${ciudades.length} ciudades · ${tematicas.length} temáticas · ` +
    `${noticias.length} artículos. Cada sala vive en ${SITE}/chat/{slug}.`,
);
out();
out("## Cómo leer cada ficha");
out();
out("- `Sala`: nombre y URL.");
out("- `Dónde`: encaje real (provincia, comunidad autónoma, país) cuando existe en el dataset.");
out("- `Canales`: canales del servidor IRC a los que conecta la sala. El primero es el principal.");
out("  Muchos municipios pequeños no tienen canal propio y comparten el de su zona: es deliberado,");
out("  para no repartir a cuatro personas entre cuatro canales vacíos.");
out("- `Sobre`: descripción propia de esa sala, redactada a partir de datos verificados de la localidad.");
out();

function ficha(p: Place): void {
  const partes: string[] = [];
  if (p.provincia) partes.push(p.provincia);
  const region = p.regionSlug ? getPlace(p.regionSlug) : null;
  if (region) partes.push(region.name);
  if (p.parentName) partes.push(p.parentName);

  out(`### ${roomName(p)}`);
  out(`Sala: ${SITE}/chat/${p.slug}`);
  if (partes.length) out(`Dónde: ${partes.join(", ")}`);
  out(`Canales: ${p.channels.map((c) => `#${c}`).join(", ")}`);
  out(`Resumen: ${p.intro}`);
  if (p.about) out(`Sobre: ${p.about}`);
  out();
}

out("## Salas por país");
out();
for (const p of [...paises].sort((a, b) => a.name.localeCompare(b.name, "es"))) ficha(p);

out("## Salas por ciudad");
out();
// Agrupadas por país y, dentro, alfabéticas: así un modelo que busca "ciudades
// de Colombia" encuentra el bloque entero seguido en vez de disperso.
const porPais = new Map<string, Place[]>();
for (const c of ciudades) {
  const k = c.parentName ?? "Otras";
  (porPais.get(k) ?? porPais.set(k, []).get(k)!).push(c);
}
for (const [pais, lista] of [...porPais].sort((a, b) => a[0].localeCompare(b[0], "es"))) {
  out(`### — ${pais} (${lista.length} ciudades) —`);
  out();
  for (const c of [...lista].sort((a, b) => a.name.localeCompare(b.name, "es"))) ficha(c);
}

out("## Comunidades autónomas de España");
out();
for (const r of getRegions()) ficha(r);

out("## Salas temáticas");
out();
const regionSlugs = new Set(getRegions().map((r) => r.slug));
for (const t of [...tematicas]
  .filter((t) => !regionSlugs.has(t.slug))
  .sort((a, b) => a.name.localeCompare(b.name, "es"))) {
  ficha(t);
}

out("## Otras secciones");
out();
out(`- Índice de salas: ${SITE}/chat`);
out(`- Cómo funciona el chat (sin registro, nick de invitado, seguridad): ${SITE}/como-funciona`);
out(`- El tiempo por ciudades: ${SITE}/tiempo`);
out(`- Loterías y sorteos por país: ${SITE}/loterias`);
out(`- Noticias: ${SITE}/noticias`);
out(`- Ranking de salas más votadas: ${SITE}/ranking`);
out(`- Horóscopo: ${SITE}/horoscopo · Tarot: ${SITE}/tarot`);
out(`- Deportes y resultados: ${SITE}/deportes`);
out(`- Anime: ${SITE}/anime`);
out(`- Contacto: ${SITE}/contacto`);
out();

const texto = lineas.join("\n");
writeFileSync(SALIDA, texto, "utf-8");

const salas = paises.length + ciudades.length + tematicas.length;
console.log(
  `llms-full.txt generado: ${salas} salas · ${(texto.length / 1024 / 1024).toFixed(2)} MB · ${lineas.length} líneas`,
);

/**
 * Refresca las cifras de `public/llms.txt`.
 *
 * Ese fichero es el índice que lee un modelo antes de decidir qué visitar, y su
 * prosa está escrita a mano y merece la pena conservarla. Lo que se pudre son
 * los números: el 2026-08-19 anunciaba «2547 salas · ~4900 páginas» cuando eran
 * 2.721 y 3.311, y «337 columnas» de noticias cuando había 497. Un índice que
 * miente sobre su propio tamaño es justo lo que no se le quiere dar a un motor
 * de respuesta.
 *
 * Se sustituyen SOLO los números, anclados a las palabras que los rodean, para
 * no tocar una coma del texto. Lo que no encaje se deja como está y se avisa.
 */
const INDICE = join(process.cwd(), "public", "llms.txt");
if (existsSync(INDICE)) {
  const sitemap = join(process.cwd(), "public", "sitemap-0.xml");
  const urls = existsSync(sitemap)
    ? (readFileSync(sitemap, "utf-8").match(/<loc>/g) ?? []).length
    : null;

  const sustituciones: Array<[RegExp, string]> = [
    [/\d[\d.]* salas propias/g, `${salas} salas propias`],
    [/las \d[\d.]* salas/g, `las ${salas} salas`],
    [/\(\d[\d.]* ciudades:/g, `(${ciudades.length} ciudades:`],
    [/\d[\d.]* columnas de divulgación/g, `${getNews().length} columnas de divulgación`],
    [/Última actualización: \d{4}-\d{2}/g, `Última actualización: ${new Date().toISOString().slice(0, 7)}`],
  ];
  if (urls) sustituciones.push([/~[\d.]* páginas en el sitemap/g, `${urls} páginas en el sitemap`]);

  let indice = readFileSync(INDICE, "utf-8");
  const sinTocar: string[] = [];
  for (const [busca, pone] of sustituciones) {
    if (!busca.test(indice)) { sinTocar.push(String(busca)); continue; }
    indice = indice.replace(busca, pone);
  }
  writeFileSync(INDICE, indice, "utf-8");
  console.log(
    `llms.txt actualizado: ${salas} salas · ${ciudades.length} ciudades · ${getNews().length} noticias` +
    (urls ? ` · ${urls} URLs en el sitemap` : " · sitemap no encontrado, esa cifra se deja"),
  );
  if (sinTocar.length) console.log(`  aviso: no encajaron ${sinTocar.length} patrón(es), revisar public/llms.txt`);
}
