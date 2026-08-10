/**
 * Backfill del H2 propio ("aboutTitle") de las salas anteriores al generador
 * de localidades.
 *
 *   node scripts/content/backfill-about-titles.mjs            # todas las que falten
 *   node scripts/content/backfill-about-titles.mjs --lote 40  # solo 40 (prueba)
 *
 * POR QUÉ: hasta agosto de 2026, 2.559 de las 2.561 salas encabezaban su bloque
 * principal con "Sobre el chat de {nombre}". Un encabezado idéntico salvo el
 * nombre repetido en miles de páginas es la definición de plantilla con hueco,
 * que es lo que Google lee como página puerta. El generador de localidades ya
 * escribe uno propio para cada sala nueva, pero a 12 salas al día tardaría siete
 * meses en cubrir el catálogo.
 *
 * DE DÓNDE SALE EL TÍTULO: del `about` que cada sala ya tiene escrito y
 * verificado contra su fuente. El modelo no recibe ninguna otra información, así
 * que el título no puede introducir un dato que no estuviera ya en la página —el
 * riesgo habitual de estos backfills, inventar un río o un castillo, no existe
 * aquí porque no hay de dónde sacarlo—.
 *
 * Y AUN ASÍ SE VERIFICA, mecánicamente y sala a sala (`verificar`): todo nombre
 * propio y toda cifra del título tienen que aparecer en el about. Un modelo que
 * "recuerda" que Alicante tiene un castillo lo escribiría igual aunque el about
 * no lo mencione; ese título se rechaza y se reintenta. La verificación es
 * determinista a propósito: para comprobar si una palabra está en un texto no
 * hace falta un segundo LLM, y uno introduciría su propio criterio errático.
 *
 * Reanudable: guarda cada lote aceptado en data/about-titles-progreso.json, así
 * que si se corta se relanza y sigue por donde iba.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { cargarEnvLocal, completar, extraeJSON } from "../lib/llm.mjs";
import { MULETILLAS } from "../lib/calidad.mjs";

cargarEnvLocal();

const PROGRESO = "data/about-titles-progreso.json";
const DESTINO = "src/data/about-titles.ts";
const POR_LOTE = 8;
const CONCURRENCIA = 6;
/** Cuántas salas pueden compartir molde antes de que el molde sea plantilla. */
const MAX_POR_MOLDE = 10;

const args = process.argv.slice(2);
const limite = args.includes("--lote") ? Number(args[args.indexOf("--lote") + 1]) : Infinity;

// ── Catálogo: se lee de los propios ficheros de datos con tsx ────────────────
const { execSync } = await import("node:child_process");
const catalogo = JSON.parse(
  execSync(
    `npx tsx -e "import {getCities,getCountries,getTopics} from './src/data/index.ts';` +
      `const all=[...getCountries(),...getCities(),...getTopics()];` +
      `console.log(JSON.stringify(all.map(p=>({slug:p.slug,name:p.name,parentName:p.parentName,provincia:p.provincia,about:p.about,aboutTitle:p.aboutTitle}))))"`,
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
  ).trim(),
);

/**
 * Lo ya resuelto sale de dos sitios: el fichero de progreso (que no se
 * commitea) y el propio destino. Leer también el destino es lo que permite
 * relanzar el backfill en una máquina limpia sin regenerar de cero los títulos
 * que ya están publicados —y, sobre todo, evita que una pasada nueva escriba un
 * fichero con solo lo generado en esa pasada, borrando el resto—.
 */
const previos = { ...titulosDelDestino(), ...(existsSync(PROGRESO) ? JSON.parse(readFileSync(PROGRESO, "utf8")) : {}) };

function titulosDelDestino() {
  if (!existsSync(DESTINO)) return {};
  const cuerpo = readFileSync(DESTINO, "utf8").split("export const ABOUT_TITLES")[1] ?? "";
  const out = {};
  for (const m of cuerpo.matchAll(/^\s*"([^"]+)":\s*("(?:[^"\\]|\\.)*"),$/gm)) out[m[1]] = JSON.parse(m[2]);
  return out;
}
const pendientes = catalogo
  .filter((p) => p.about && !p.aboutTitle && !previos[p.slug])
  .slice(0, limite);

console.log(
  `${catalogo.length} salas · ${Object.keys(previos).length} ya resueltas · ${pendientes.length} pendientes`,
);
if (!pendientes.length) {
  escribirDestino();
  process.exit(0);
}

// ── Prompts ─────────────────────────────────────────────────────────────────

const SISTEMA = `Titulas secciones de texto para TuChat.org, un portal español de salas de chat. Te dan el texto ya escrito de una sala y devuelves su encabezado.

REGLA INNEGOCIABLE: el título solo puede hablar de lo que dice el texto que te dan. No añadas ni un dato, ni un nombre, ni una cifra que no estén ahí, aunque creas saberlo de ese lugar. Si el texto no menciona ningún río, no escribas un río.

UN BUEN TÍTULO:
- Toma lo más concreto y propio que diga el texto (una industria, un accidente geográfico, una fiesta, un oficio, un rasgo del sitio) y lo pone en el encabezado.
- Suena a titular de revista, no a etiqueta de formulario: "El puerto, la sal y las conversaciones de agosto", "Entre viñedos y la carretera de Burgos".
- Entre 25 y 70 caracteres. Sin punto final. Sin comillas.

PROHIBIDO:
- "Sobre el chat de X", "Acerca de X", "Qué es X", "Información de X", "Bienvenido a X": son los encabezados de plantilla que estamos quitando.
- Nombres de alcaldes, intendentes o cargos: caducan en las siguientes elecciones.
- Muletillas de folleto: ${MULETILLAS.slice(0, 12).join(", ")}.
- Empezar por un imperativo (Descubre, Conoce, Explora, Vive, Disfruta).
- Poner el nombre del lugar a secas como título.`;

const promptLote = (salas, notas = new Map()) => `Escribe el encabezado de cada una de estas ${salas.length} secciones.

${salas
  .map(
    (p, i) => `━━━ SALA ${i + 1} · id "${p.slug}" · ${p.name}${p.provincia ? ` (${p.provincia})` : ""}
TEXTO DE LA SECCIÓN (única fuente permitida para el título ${i + 1}):
"""
${p.about}
"""${notas.has(p.slug) ? `\nEL INTENTO ANTERIOR SE RECHAZÓ: ${notas.get(p.slug)}. Corrige exactamente eso sin inventar nada nuevo; si era corto, alárgalo con otro detalle que YA esté en el texto.` : ""}`,
  )
  .join("\n\n")}

Cada título tiene que salir del texto de SU sala, no del de las otras.

Devuelve SOLO este JSON, sin texto alrededor:
{"titulos": [${salas.map((p) => `{"id": "${p.slug}", "titulo": "..."}`).join(", ")}]}`;

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Verificación mecánica ───────────────────────────────────────────────────

const norm = (s) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

const VACIAS = new Set(
  ("el la los las un una unos unas de del al a en y o u con por para sin sobre entre hasta desde " +
    "que se su sus lo le les como donde cuando mas muy ya no ni tras cada todo toda este esta ese esa")
    .split(" "),
);

/**
 * Devuelve los motivos por los que un título no vale, o [] si vale.
 *
 * La comprobación que importa es la primera: los nombres propios y las cifras
 * del título tienen que estar en el about. Es donde se cuela la invención —el
 * modelo reconoce la ciudad y añade de memoria el monumento por el que es
 * conocida, aunque el texto no lo nombre—.
 */
function verificar(titulo, sala) {
  const problemas = [];
  const t = (titulo ?? "").trim();

  if (t.length < 25 || t.length > 70) problemas.push(`${t.length} caracteres`);
  if (/^(sobre|acerca|qu[ée]|informaci[óo]n|bienvenid)/i.test(t)) problemas.push("genérico");
  if (/^(descubre|conoce|explora|vive|disfruta)/i.test(t)) problemas.push("imperativo de folleto");
  if (/\b(alcald|intendent|gobernador|president|ayuntamiento de)\b/i.test(t)) problemas.push("cargo");
  if (/[.]$/.test(t)) problemas.push("acaba en punto");
  for (const m of MULETILLAS) if (norm(t).includes(norm(m))) problemas.push(`muletilla "${m}"`);

  const about = norm(sala.about);
  const propios = t.match(/(?<!^)(?<![.:¿?¡!]\s)\b[A-ZÁÉÍÓÚÑ][a-záéíóúñü]{2,}/g) ?? [];
  const cifras = t.match(/\d[\d.,]*/g) ?? [];
  for (const p of [...propios, ...cifras]) {
    const esElLugar = [sala.name, sala.provincia, sala.parentName]
      .filter(Boolean)
      .some((n) => norm(n).includes(norm(p)));
    if (!esElLugar && !about.includes(norm(p))) problemas.push(`"${p}" no está en el texto`);
  }

  // Basta una palabra de contenido compartida con el about: exigir dos tumbaba
  // títulos perfectos y cortos ("Cuna del mariachi", donde "cuna" tiene cuatro
  // letras y queda fuera del filtro). Lo que impide inventar es la comprobación
  // de nombres propios de arriba, no esta.
  const ancladas = norm(t)
    .split(/[^a-z0-9ñ]+/)
    .filter((w) => w.length > 4 && !VACIAS.has(w))
    .filter((w) => about.includes(w));
  if (!ancladas.length) problemas.push("no se apoya en el texto");

  return problemas;
}

/** Molde del título con el nombre del lugar sustituido, para detectar plantilla. */
const moldeDe = (titulo, sala) => {
  let m = titulo;
  for (const v of [sala.name, sala.parentName, sala.provincia].filter(Boolean)) m = m.split(v).join("«X»");
  return norm(m);
};

// ── Ejecución por lotes ─────────────────────────────────────────────────────

const aceptados = { ...previos };
const moldes = new Map();
for (const [slug, titulo] of Object.entries(aceptados)) {
  const sala = catalogo.find((p) => p.slug === slug);
  if (!sala) continue;
  const m = moldeDe(titulo, sala);
  moldes.set(m, (moldes.get(m) ?? 0) + 1);
}
const usados = new Set(Object.values(aceptados).map(norm));

const lotes = [];
for (let i = 0; i < pendientes.length; i += POR_LOTE) lotes.push(pendientes.slice(i, i + POR_LOTE));

let hechos = 0;
let rechazados = 0;
const fallidos = [];

async function procesarLote(salas, intento = 1, notas = new Map()) {
  let respuesta;
  try {
    // 4.000 y no 1.200: varios de los modelos de la cadena (gpt-oss-120b) gastan
    // tokens razonando antes de escribir, y con el límite justo devolvían el JSON
    // cortado a media llave —2.000 salas se perdieron así en la primera pasada—.
    const { texto } = await completar(SISTEMA, promptLote(salas, notas), { maxTokens: 4000 });
    respuesta = extraeJSON(texto);
  } catch (err) {
    // Los proveedores gratuitos limitan por minuto, no por día: cuando la
    // cadena entera devuelve 429 no es que se haya agotado la cuota, es que
    // vamos demasiado rápido. Sin esta espera se perdieron 1.784 salas de una
    // tacada, y al reintentarlas medio minuto después entraron todas.
    if (intento < 4) {
      if (/429|Todos los proveedores/.test(err.message)) await esperar(15_000 * intento);
      return procesarLote(salas, intento + 1, notas);
    }
    fallidos.push(...salas.map((s) => `${s.slug}: ${err.message.slice(0, 80)}`));
    return;
  }

  const porId = new Map((respuesta?.titulos ?? []).map((t) => [t.id, (t.titulo ?? "").trim()]));
  const reintentar = [];

  for (const sala of salas) {
    const titulo = porId.get(sala.slug);
    if (!titulo) {
      reintentar.push(sala);
      continue;
    }
    const problemas = verificar(titulo, sala);
    // Un título correcto pero calcado de otros diez es plantilla igualmente: se
    // trata como un rechazo más para que el reintento pida otro enfoque.
    const molde = moldeDe(titulo, sala);
    if (usados.has(norm(titulo))) problemas.push("título ya usado en otra sala");
    if ((moldes.get(molde) ?? 0) >= MAX_POR_MOLDE) problemas.push("molde repetido");

    if (problemas.length) {
      rechazados++;
      reintentar.push(sala);
      // El reintento sin decir qué falló repetía el mismo error: 24 salas se
      // quedaron atascadas devolviendo títulos de 17-24 caracteres una y otra vez.
      notas.set(sala.slug, `"${titulo}" → ${problemas.join(", ")}`);
      if (rechazados <= 20) console.log(`   ✗ ${sala.slug}: "${titulo}" → ${problemas.join(", ")}`);
      continue;
    }
    aceptados[sala.slug] = titulo;
    usados.add(norm(titulo));
    moldes.set(molde, (moldes.get(molde) ?? 0) + 1);
    hechos++;
  }

  if (reintentar.length && intento < 3) return procesarLote(reintentar, intento + 1, notas);
  fallidos.push(...reintentar.map((s) => `${s.slug}: no pasó la verificación en 3 intentos`));
}

console.log(`\n${lotes.length} lotes de ${POR_LOTE}, concurrencia ${CONCURRENCIA}\n`);

const cola = [...lotes];
let guardadoPendiente = 0;
await Promise.all(
  Array.from({ length: CONCURRENCIA }, async () => {
    while (cola.length) {
      const lote = cola.shift();
      await procesarLote(lote);
      if (++guardadoPendiente % 10 === 0) {
        guardar();
        console.log(`   ${hechos} títulos · ${cola.length} lotes en cola`);
      }
    }
  }),
);

guardar();
escribirDestino();

console.log(`\n✅ ${hechos} títulos nuevos · ${rechazados} rechazados por la verificación`);
if (fallidos.length) {
  console.log(`\n⚠️  ${fallidos.length} sin título (se reintentan en la próxima pasada):`);
  for (const f of fallidos.slice(0, 15)) console.log(`   ${f}`);
}

function guardar() {
  mkdirSync("data", { recursive: true });
  writeFileSync(PROGRESO, JSON.stringify(aceptados, null, 1));
}

function escribirDestino() {
  const cabecera = readFileSync(DESTINO, "utf8").split("export const ABOUT_TITLES")[0];
  const entradas = Object.keys(aceptados)
    .sort()
    .map((slug) => `  ${JSON.stringify(slug)}: ${JSON.stringify(aceptados[slug])},`)
    .join("\n");
  writeFileSync(DESTINO, `${cabecera}export const ABOUT_TITLES: Record<string, string> = {\n${entradas}\n};\n`);
  console.log(`\n${DESTINO}: ${Object.keys(aceptados).length} títulos`);
}
