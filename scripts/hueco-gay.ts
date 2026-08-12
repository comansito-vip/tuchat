/**
 * Temporal (2026-08-12): qué queda del hueco «chat gay de {lugar}».
 * Cruza el corpus de la red con el catálogo real para no fiarse del doc.
 */
import { readFileSync } from "node:fs";
import { getCities, getCountries, getTopics } from "@/data";

const CORPUS = "/home/javier/red-seo/data/corpus-consultas.tsv";

const canon = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const rooms = [...getCountries(), ...getCities(), ...getTopics()];
const slugs = new Set(rooms.map((r) => canon(r.slug)));
if (slugs.size < 2000) throw new Error(`catálogo incompleto: ${slugs.size} salas`);

function tieneSalaGay(lugar: string): string | null {
  const l = canon(lugar).replace(/-/g, "");
  for (const s of slugs) {
    const plano = s.replace(/-/g, "");
    if (plano === `gay${l}` || plano === `${l}gay` || plano === `ambiente${l}`)
      return s;
  }
  return null;
}

const RE =
  /^chat\s+(?:de\s+)?(?:gays?|ambiente|lesbianas?|lgtbi?)\s*(?:de\s+|en\s+|para\s+)?(.+)$/;

const RUIDO = new Set([
  "gratis", "sin registro", "gratis sin registro", "online", "en linea",
  "espanol", "en espanol", "chat", "gay", "gays", "ambiente", "hombres",
  "chicos", "jovenes", "maduros", "osos", "activos", "pasivos", "web",
  "movil", "irc", "salas", "sala", "de-ambiente", "libre", "gay-gratis",
]);

type Fila = { lugar: string; imp: number; clics: number; consultas: string[] };
const porLugar = new Map<string, Fila>();

const lineas = readFileSync(CORPUS, "utf8").split("\n").slice(1);
for (const linea of lineas) {
  if (!linea.trim()) continue;
  const [consulta, clics, imp] = linea.split("\t");
  const m = RE.exec(consulta.trim());
  if (!m) continue;
  const cola = m[1]
    .trim()
    .replace(/\s+(gratis|sin registro|online|en espanol|espanol)$/g, "");
  const key = canon(cola);
  if (!key || RUIDO.has(key)) continue;
  if (cola.split(/\s+/).length > 3) continue;
  const f = porLugar.get(key) ?? { lugar: cola, imp: 0, clics: 0, consultas: [] };
  f.imp += Number(imp) || 0;
  f.clics += Number(clics) || 0;
  f.consultas.push(consulta.trim());
  porLugar.set(key, f);
}

const filas = [...porLugar.entries()]
  .map(([key, f]) => ({ key, ...f, sala: tieneSalaGay(key) }))
  .sort((a, b) => b.imp - a.imp);

const sinSala = filas.filter((f) => !f.sala);
const conSala = filas.filter((f) => f.sala);
const suma = (fs: typeof filas) => fs.reduce((s, f) => s + f.imp, 0);

console.log(`Lugares con demanda gay/ambiente medida: ${filas.length}`);
console.log(`  con sala: ${conSala.length} (${suma(conSala).toLocaleString("es")} imp)`);
console.log(`  SIN sala: ${sinSala.length} (${suma(sinSala).toLocaleString("es")} imp)`);
console.log("\nlugar\timpresiones\tclics\tejemplo");
for (const f of sinSala.slice(0, 45)) {
  console.log(`${f.lugar}\t${f.imp}\t${f.clics}\t${f.consultas[0]}`);
}
