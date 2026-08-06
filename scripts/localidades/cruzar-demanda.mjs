#!/usr/bin/env node
/**
 * Cruza la demanda real del nicho (volcado de Search Console de canalchat.org,
 * el dominio de la red con histórico) contra las salas que tuchat ya tiene.
 *
 * Sirve para dos cosas distintas:
 *   1. Ordenar la expansión geográfica por demanda medida, no por población.
 *      "chat trujillo" tiene 21.523 impresiones: vale más que muchas capitales
 *      de provincia europeas.
 *   2. Encontrar canales temáticos con demanda y sin sala (mazmorra, chachipen,
 *      dikelame, cornudos, esoterismo…), que es de donde sale el tráfico que
 *      luego se manda al canal de IRC que interese.
 *
 * Uso: node scripts/localidades/cruzar-demanda.mjs [--min 1000]
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { norm, variantesDe } from "./duplicados.mjs";

const FUENTE = join(process.cwd(), "data", "gsc", "canalchat-consultas-90d.tsv");
const MIN = Number(process.argv[process.argv.indexOf("--min") + 1]) || 1000;

/**
 * Palabras que envuelven a la entidad buscada sin ser parte de ella. Quitándolas
 * de la consulta queda el término al que habría que responder con una sala:
 * "chat gratis trujillo" y "canal chat trujillo" son la misma intención.
 */
const RELLENO = new Set([
  "chat", "chats", "chatear", "chatea", "canal", "canales", "sala", "salas",
  "gratis", "el", "la", "los", "las", "de", "del", "en", "para", "con", "y",
  "org", "com", "net", "online", "linea", "línea", "sin", "registro", "java",
  "latinchat", "latin", "canalchat", "terra", "terrachat", "hispano", "irc",
  "webchat", "gente", "chateagratis", "chatgratis", "es", "un", "una", "por",
]);

const limpiar = (q) =>
  q.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9ñ\s]/g, " ")
    .split(/\s+/)
    .filter((p) => p && !RELLENO.has(p))
    .join(" ")
    .trim();

function leerConsultas() {
  const filas = [];
  for (const linea of readFileSync(FUENTE, "utf8").split("\n")) {
    if (!linea.trim() || linea.startsWith(">")) continue;
    const [consulta, clics, imp] = linea.split("\t");
    if (!consulta || !imp) continue;
    filas.push({ consulta, clics: Number(clics), imp: Number(imp) });
  }
  return filas;
}

async function main() {
  // El catálogo completo (países + ciudades + las diez listas de temáticas) sale
  // de src/data/index.ts. Importar solo cities/cities-world dejaba fuera países
  // y temáticas, y entonces "chat peru" o "chat gay" salían como hueco cuando
  // llevan sala desde el principio.
  const { getCities, getCountries, getTopics } = await import("../../src/data/index.ts");

  // Índice de todo lo que ya tiene página: slug, nombre y variantes del nombre.
  const tiene = new Set();
  for (const s of [...getCountries(), ...getCities(), ...getTopics()]) {
    tiene.add(s.slug);
    for (const v of variantesDe(s.name)) tiene.add(v);
  }

  // Se agrupa por entidad: todas las variantes de la misma búsqueda suman.
  // "chat trujillo" + "chat gratis trujillo" + "canal chat trujillo" son la
  // misma demanda partida en tres, y por separado ninguna parece gran cosa.
  const grupos = new Map();
  for (const fila of leerConsultas()) {
    const clave = limpiar(fila.consulta);
    if (!clave) continue;
    const g = grupos.get(clave) ?? { clave, imp: 0, clics: 0, consultas: [] };
    g.imp += fila.imp;
    g.clics += fila.clics;
    g.consultas.push(fila.consulta);
    grupos.set(clave, g);
  }

  // Los artículos se van con el relleno ("chat las palmas" → "palmas"), así que
  // hay que devolverlos antes de dar por hueco lo que sí tiene sala: las-palmas,
  // a-coruna, la-plata. Sin esto, tres de los diez mayores "huecos" eran falsos.
  const ARTICULOS = ["", "la-", "las-", "el-", "los-", "a-", "o-"];

  const cubierta = (clave) => {
    const slug = norm(clave);
    for (const art of ARTICULOS) if (tiene.has(art + slug)) return true;
    // "trujillo peru" → prueba también con la primera palabra sola.
    const primera = norm(clave.split(" ")[0]);
    if (primera.length <= 3) return false;
    return ARTICULOS.some((art) => tiene.has(art + primera));
  };

  const huecos = [...grupos.values()]
    .filter((g) => g.imp >= MIN && !cubierta(g.clave))
    .sort((a, b) => b.imp - a.imp);

  const cubiertos = [...grupos.values()]
    .filter((g) => g.imp >= MIN && cubierta(g.clave))
    .sort((a, b) => b.imp - a.imp);

  const suma = (l) => l.reduce((t, g) => t + g.imp, 0);
  console.log(`entidades con >=${MIN} impresiones: ${huecos.length + cubiertos.length}`);
  console.log(`  con sala:  ${String(cubiertos.length).padStart(4)}  (${suma(cubiertos).toLocaleString("es")} imp)`);
  console.log(`  SIN sala:  ${String(huecos.length).padStart(4)}  (${suma(huecos).toLocaleString("es")} imp)`);

  console.log(`\n===== DEMANDA SIN SALA, por impresiones =====`);
  for (const g of huecos) {
    console.log(
      `${String(g.imp).padStart(9)} imp ${String(g.clics).padStart(7)} clics  ${g.clave.padEnd(30)}` +
      `  ← ${g.consultas.slice(0, 3).join(" | ")}`,
    );
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
