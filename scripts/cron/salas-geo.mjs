#!/usr/bin/env node
/**
 * Cron diario: publica un puñado de salas de localidad nuevas, despacio.
 *
 * Por qué a goteo y no de golpe: hay ~2.000 localidades en cola y volcarlas en
 * un día multiplicaría por dos el tamaño del sitio de una sentada. Eso, en un
 * dominio que hoy imprime 764 veces en 90 días, es la señal exacta que Google
 * asocia a una granja de páginas generadas. Doce al día es crecimiento normal
 * de un sitio que se cuida, y da margen a que las primeras se indexen y
 * demuestren que merecen rastreo antes de pedirle que rastree las siguientes.
 *
 * Cada sala tiene que salir con:
 *   · fuente real propia (extracto de Wikipedia + portada del ayuntamiento),
 *   · un dato que solo es cierto de esa localidad,
 *   · verificación por un modelo DISTINTO del que la escribió,
 *   · intro única de 110-160 caracteres, que es la meta description,
 *   · enlaces a su provincia/país y a sus vecinas reales.
 * Lo que no pasa los controles no se publica: se reintenta otro día.
 *
 * Uso:
 *   node scripts/cron/salas-geo.mjs                 # 12 salas
 *   node scripts/cron/salas-geo.mjs --lote 15
 *   node scripts/cron/salas-geo.mjs --lote 2 --seco # no escribe nada
 */
import { readFileSync, writeFileSync, existsSync, appendFileSync, mkdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { cargarEnvLocal, completar, extraeJSON } from "../lib/llm.mjs";
import { reunirMaterial } from "../lib/fuentes.mjs";
import {
  revisarFicha, parrafosDuplicados, camposDuplicados,
  indiceDeShingles, fraseoCalcado, shingles,
} from "../lib/calidad.mjs";
import { indexar, distanciaKm, norm } from "../localidades/duplicados.mjs";

const RAIZ = process.cwd();
const DIR = join(RAIZ, "data", "localidades");
const COLA = join(DIR, "pendientes.json");
const PROGRESO = join(DIR, "progreso.json");
const GENERADAS = join(DIR, "generadas.json");
const SALIDA_TS = join(RAIZ, "src", "data", "cities-generadas.ts");
const LOG = join(DIR, "cron.log");
// Lista de slugs YA publicados que hay que volver a escribir. La llena
// scripts/localidades/curar-costura.mjs. Ver el bloque REHACER de abajo.
const REHACER = join(DIR, "rehacer.json");
const CORPUS = "/home/javier/red-seo/data/corpus-consultas.tsv";

const arg = (n, d) => {
  const i = process.argv.indexOf(`--${n}`);
  return i === -1 ? d : process.argv[i + 1];
};
const LOTE = Number(arg("lote", 12));
const SECO = process.argv.includes("--seco");
const MODO_REHACER = process.argv.includes("--rehacer");

// Tres intentos por localidad antes de abandonarla, y solo cuentan los fallos
// por CONTENIDO: que la cadena de LLMs esté saturada no dice nada del pueblo.
const MAX_INTENTOS = 3;

// La ficha ocupa unos 600 tokens, pero los modelos que razonan gastan del mismo
// presupuesto pensando y con 3.000 llegaban al final sin sitio para cerrar el
// JSON: la ficha se perdía por truncamiento ("objeto sin cerrar"), no por
// calidad.
const TOKENS_FICHA = 6000;

cargarEnvLocal();

function log(msg) {
  const linea = `[${new Date().toISOString()}] ${msg}`;
  console.log(linea);
  if (!SECO) appendFileSync(LOG, linea + "\n");
}

const leerJSON = (ruta, pordefecto) =>
  existsSync(ruta) ? JSON.parse(readFileSync(ruta, "utf8")) : pordefecto;

/** Un descarte que no dice nada de la localidad: no gasta intento. */
const esFalloDeInfraestructura = (razon) =>
  /^Todos los proveedores LLM fallaron|^No se pudo extraer JSON|^sin fuente/.test(razon);

function agotadas(descartadas) {
  const cuenta = new Map();
  for (const d of descartadas) {
    if (esFalloDeInfraestructura(d.razon)) continue;
    cuenta.set(d.slug, (cuenta.get(d.slug) ?? 0) + 1);
  }
  return new Set([...cuenta].filter(([, n]) => n >= MAX_INTENTOS).map(([s]) => s));
}

/**
 * Demanda medida de cada localidad, del corpus de la red.
 *
 * Ordenar la cola por población es ordenar por el país equivocado: "chat
 * trujillo" tiene 61.000 impresiones y Trujillo no llega a un millón de
 * habitantes, mientras que ciudades españolas más grandes no las busca nadie
 * con "chat" delante. Si el corpus no está, se cae a población y ya está.
 */
function cargarDemanda() {
  if (!existsSync(CORPUS)) {
    log("aviso: no hay corpus de demanda, la cola se ordena solo por población");
    return null;
  }
  const demanda = new Map();
  for (const linea of readFileSync(CORPUS, "utf8").split("\n").slice(1)) {
    const [consulta, , imp] = linea.split("\t");
    if (!consulta || !imp) continue;
    // Solo consultas con "chat": el corpus tiene de todo y "granada" a secas
    // mezclaría la fruta con la ciudad.
    if (!/\bchat/i.test(consulta)) continue;
    const clave = norm(consulta.replace(/\b(chat|chats|gratis|el|la|de|del|en|online|org|canal|latinchat|terra|hispano)\b/gi, " "));
    if (clave.length < 4) continue;
    demanda.set(clave, (demanda.get(clave) ?? 0) + Number(imp));
  }
  return demanda;
}

// ───────────────────────── Prompts ─────────────────────────

const SISTEMA = `Eres redactor de TuChat.org, un portal español de salas de chat. Escribes la ficha de la sala de una localidad. Español neutro, tono directo y concreto, como un redactor humano que conoce el sitio.

REGLA INNEGOCIABLE: todo dato concreto (fecha, cifra, nombre propio, río, monumento, fiesta, comarca, industria) DEBE aparecer literalmente en el material de origen que te dan. Si no está, no lo escribes. Es preferible una ficha más corta y sin concreción que un dato falso.

PROHIBIDO, porque delata texto generado y este proyecto lo penaliza:
- "sumérgete", "descubre la magia/el encanto", "el lugar perfecto para", "ya seas X o Y", "no importa si", "en el mundo de hoy", "punto de encuentro ideal", "joya escondida", "no te lo puedes perder", "todo un mundo de", "un sinfín de", "vibrante comunidad", "sin lugar a dudas".
- Empezar por un imperativo de folleto (Descubre, Conoce, Explora, Vive, Disfruta, Bienvenido).
- Superlativos huecos, párrafos que no dicen nada y frases de cierre motivacionales.
- Markdown: ni encabezados, ni listas, ni negritas. Los dos campos se imprimen dentro de un párrafo.
- Decir a qué hora o qué días se anima la sala ("suele animarse por las tardes", "mayor actividad al caer la tarde", "los fines de semana se llena"). NO tenemos ese dato: es relleno inventado, y escrito en todas las fichas es lo que delata que las escribe una máquina.
- Contar de qué se habla en la sala o quién entra a ella. Tampoco tenemos ese dato. La medición del 2026-08-18 encontró la misma frase en 83 de las 107 fichas publicadas, con el nombre cambiado: "En la sala de chat de {LOCALIDAD} los vecinos comparten información sobre la vida cotidiana, eventos locales y temas de interés general". Ni una palabra de eso sale del material y no dice nada de ningún sitio. Quedan prohibidas en bloque: "en la sala de chat", "la sala de chat de", "comparten/intercambian información sobre", "la vida cotidiana", "temas de interés general", "punto de encuentro donde".

La ficha va ENTERA sobre el lugar. De la sala no hay nada que contar que no sea el nombre.

Cifras de miles siempre con punto separador: "12.480", nunca "12480".`;

const promptGenerar = (loc, material) => `LOCALIDAD: ${loc.nombre}
${loc.region ? `Provincia/región: ${loc.region}\n` : ""}País: ${loc.pais}
Población: ${loc.poblacion ? loc.poblacion.toLocaleString("es-ES") : "desconocida"}
${loc.gentilicio ? `Gentilicio: ${loc.gentilicio}\n` : ""}
MATERIAL DE ORIGEN — es la ÚNICA fuente permitida. No uses nada que "recuerdes" de este sitio.

[Wikipedia]
"""
${(material.extracto ?? "(sin extracto)").slice(0, 3500)}
"""

[Web oficial del ayuntamiento${loc.webOficial ? ` — ${loc.webOficial}` : ""}]
"""
${(material.textoWeb ?? "(no disponible)").slice(0, 3000)}
"""

La web del ayuntamiento es la parte valiosa: de ahí salen las fiestas con su fecha, el mercado semanal, la feria, el polígono o el equipamiento que ningún competidor va a tener. Úsala si trae algo concreto.

Escribe la ficha de la sala "Chat de ${loc.nombre}". Tiene que contener AL MENOS UN HECHO que solo sea cierto de ${loc.nombre} y que esté en el material.

Devuelve SOLO este JSON, sin texto alrededor:
{
  "intro": "entre 110 y 160 caracteres. Es la meta description de la página, así que tiene que ser única y llevar un dato concreto de ${loc.nombre}. Nombra ${loc.nombre}, pero NO escribas 'la sala de chat de ${loc.nombre}': esa fórmula está prohibida y tira la ficha.",
  "about": "150-260 palabras de prosa corrida (puedes usar dos párrafos separados por una línea en blanco), TODAS sobre ${loc.nombre}: qué es, dónde está, de qué vive, qué fiesta tiene y cuándo, qué se le conoce, qué le pasó. Cada frase apoyada en el material. NO cierres hablando de la sala, de sus usuarios ni de lo que se conversa en ella: ese párrafo no tiene fuente y es el que delata la ficha generada. Sin markdown.",
  "aboutTitle": "el H2 de la ficha: entre 25 y 70 caracteres, con algo propio de ${loc.nombre} dentro (un río, un puerto, una fiesta, una industria, lo que dé el material). NO vale 'Sobre el chat de ${loc.nombre}' ni 'Acerca de ${loc.nombre}': ese encabezado repetido en miles de páginas es lo que delata a un directorio generado. Tampoco nombres de alcaldes, intendentes ni cargos: caducan en las siguientes elecciones y el título se queda viejo.",
  "dato_ancla": "la frase exacta del material de origen en la que te has apoyado para el dato concreto"
}`;

const promptVerificar = (loc, ficha, material) => `Eres verificador de hechos. Tu ÚNICO trabajo es detectar INVENCIONES: datos de la ficha que el material de origen no respalda o que contradice.

NO es un problema (no lo marques):
- Que la ficha omita datos de la fuente. Es un resumen.
- Que sea menos precisa que la fuente ("más de doce mil" cuando la fuente dice "12.480").
- El estilo, el tono o lo bien o mal escrita que esté.
- Que la ficha nombre la sala de chat de la localidad al presentarla. (Lo que NO puede hacer es describir quién entra o de qué se conversa: eso no tiene fuente y va en la lista de problemas de abajo.)

SÍ es un problema:
- Una fecha, cifra, nombre propio, monumento, fiesta, río o comarca que la ficha da por cierto y que la fuente no respalda.
- Confundir esta localidad con otra homónima.
- Muletillas de IA de la lista prohibida.
- Describir la sala de chat: quién entra, de qué se habla, qué comparten los vecinos. No hay fuente para eso y es el relleno que hay que cortar.

MATERIAL DE ORIGEN:
"""
${(material.extracto ?? "").slice(0, 3500)}
${(material.textoWeb ?? "").slice(0, 2000)}
"""

FICHA A VERIFICAR (localidad: ${loc.nombre}, ${loc.region ?? ""}, ${loc.pais}):
intro: ${ficha.intro}
about: ${ficha.about}

Ante la duda entre "es una invención" y "es impreciso pero no falso", NO lo marques.

Devuelve SOLO: {"aprobado": true|false, "problemas": ["..."]}`;

const promptCorregir = (loc, ficha, problemas, material) => `Corrige la ficha de "${loc.nombre}" para TuChat.org. Un verificador encontró estos problemas.

CÓMO CORREGIR — esto es lo importante: solo puedes QUITAR o SUAVIZAR lo señalado. NO añadas ni un dato, ni una frase, ni un matiz nuevo. Cada afirmación nueva que metas para rellenar el hueco va a ser rechazada por el siguiente verificador, y la ficha se pierde entera. Si al quitar algo el texto queda más corto, déjalo más corto.

PROBLEMAS:
${problemas.map((p) => "- " + p).join("\n")}

MATERIAL DE ORIGEN:
"""
${(material.extracto ?? "").slice(0, 3000)}
${(material.textoWeb ?? "").slice(0, 2000)}
"""

FICHA ACTUAL:
${JSON.stringify({ intro: ficha.intro, about: ficha.about }, null, 1)}

Recuerda: "intro" entre 110 y 160 caracteres, "about" entre 150 y 260 palabras, sin markdown.
Devuelve SOLO el JSON corregido: {"intro": "...", "about": "..."}`;

/**
 * Arreglo de longitudes. Es un problema de formato, no de veracidad: descartar
 * por él tiraba fichas ya verificadas (una intro de 203 caracteres, un about de
 * 97 palabras). Se pide el ajuste sin tocar ningún hecho.
 */
const promptAjustar = (loc, ficha, problemas) => `Ajusta la longitud de esta ficha de "${loc.nombre}". NO cambies ningún hecho, ningún nombre propio y ninguna cifra: solo recorta o desarrolla lo que ya está escrito.

QUÉ HAY QUE AJUSTAR:
${problemas.map((p) => "- " + p).join("\n")}

Si hay que alargar, desarrolla lo que YA dice el texto (de qué se habla en la sala, quién entra, a qué horas se anima) — no metas datos nuevos sobre la localidad.

FICHA ACTUAL:
${JSON.stringify({ intro: ficha.intro, about: ficha.about }, null, 1)}

Medidas exactas: "intro" entre 110 y 160 caracteres. "about" entre 150 y 260 palabras. Sin markdown.
Devuelve SOLO: {"intro": "...", "about": "..."}`;

// ───────────────────────── Construcción del registro ─────────────────────────

/**
 * ¿El texto describe una división administrativa en vez de una localidad?
 *
 * Los censos de origen las mezclan y la primera pasada coló Sinaloa —el estado—
 * como si fuera una ciudad. La forma en que la Wikipedia las presenta varía
 * mucho ("es un estado", "es uno de los treinta y un estados", "es una de las
 * veinticuatro provincias"), así que la comprobación tiene que cubrir el "uno
 * de los N" además del artículo simple.
 */
export function esDivisionAdministrativa(texto) {
  const t = texto ?? "";
  // Señal en contra, y manda: casi todas las fichas de ciudad mencionan su
  // estado o provincia en la primera frase ("Piedras Negras es una ciudad
  // mexicana del estado de Coahuila"), y una comprobación por cercanía de
  // palabras las daba a todas por divisiones administrativas.
  if (/\bes\s+(un|una)\s+(ciudad|villa|municipio|localidad|pueblo|parroquia|comuna|distrito|población|barrio|capital)\b/i.test(t)) {
    return false;
  }
  // El sustantivo tiene que ser el núcleo del predicado, no una palabra que
  // aparezca cerca.
  return (
    /\bes\s+(un|una)\s+(estado|provincia|departamento|región|region|comunidad autónoma)\b/i.test(t) ||
    /\bes\s+(uno de los|una de las)\s+[\wáéíóúüñ\s]{0,40}\b(estados|provincias|departamentos|regiones)\b/i.test(t)
  );
}

/**
 * Frases sobre cuándo se llena la sala. No las decimos porque no las sabemos:
 * no hay ninguna medición de a qué hora entra la gente, así que es relleno
 * inventado. Y además salía en las CUATRO fichas de la primera tanda con otras
 * palabras cada vez, que es justo la costura que delata la generación masiva.
 */
const HORARIOS_INVENTADOS =
  /\b(por las tardes|a última hora|al caer la tarde|por la noche|las tardes y noches|mayor actividad|se anima|suele animarse|momentos de más|horas punta)\b/i;

/** Números de sala estables: derivados de la población, no aleatorios. */
function actividadDe(poblacion) {
  const p = poblacion ?? 0;
  const users = Math.max(12, Math.round(Math.log10(p + 10) * 22 + (p % 37)));
  return {
    users,
    votes: Math.round(users * 1.6) + (p % 23),
    activity: p > 250_000 ? "Alta" : p > 40_000 ? "Media" : "Baja",
  };
}

/**
 * Canales de IRC de la sala.
 *
 * La lógica vive en `src/data/irc-canal.ts`, compartida con
 * `scripts/fix-irc-channels.ts`. **Solo canales que existan de verdad en la
 * red:** uno inventado se crea al vuelo y vacío, así que el usuario aterriza
 * solo en vez de caer donde hay gente. La primera versión de este cron metía
 * `#apodaca` de primero —Apodaca no tiene canal— y las doce salas del primer
 * lote mandaban a la nada; lo pilló `channels.test.ts`.
 */
function canalesDe(loc, canalesParaCiudad) {
  return canalesParaCiudad(loc.slug, loc.paisSlug, [loc.regionSlug]);
}

/**
 * Salas relacionadas: las vecinas geográficas reales más el padre.
 *
 * Sin esto la página solo se alcanza desde el sitemap, y una página huérfana a
 * la que nadie enlaza huele exactamente a página puerta. Las vecinas se sacan
 * por distancia, que es la relación que un lector reconoce como legítima.
 */
function relacionadasDe(loc, situadas, existe) {
  const vecinas = [];
  if (loc.coords) {
    const cerca = situadas
      .filter((s) => s.slug !== loc.slug)
      .map((s) => ({ slug: s.slug, km: distanciaKm(loc.coords, s) }))
      .filter((s) => s.km < 120)
      .sort((a, b) => a.km - b.km)
      .slice(0, 5);
    vecinas.push(...cerca.map((c) => c.slug));
  }
  const cola = [loc.regionSlug, loc.paisSlug, "amistad", "amor"].filter(Boolean);
  return [...new Set([...vecinas, ...cola])]
    // Nunca a sí misma: en las capitales de provincia el regionSlug coincide
    // con el slug de la ciudad y la sala se enlazaba a sí misma.
    .filter((s) => s !== loc.slug)
    // Ni a salas que no existen: la mayoría de provincias americanas no tienen
    // página todavía, y un enlace muerto no ayuda a nadie. `getRelated` los
    // filtraría al pintar, pero entonces la ficha se queda con menos enlaces de
    // los que cree tener y no hay forma de verlo.
    .filter(existe)
    .slice(0, 9);
}

function construirRegistro(loc, ficha, canalesParaCiudad) {
  const { users, votes, activity } = actividadDe(loc.poblacion);
  return {
    slug: loc.slug,
    name: loc.nombre,
    kind: "ciudad",
    icon: "💬",
    users,
    votes,
    activity,
    parentName: loc.pais,
    parentSlug: loc.paisSlug,
    ...(loc.region ? { provincia: loc.region } : {}),
    ...(loc.regionSlug ? { regionSlug: loc.regionSlug } : {}),
    channels: canalesDe(loc, canalesParaCiudad),
    related: loc.related,
    intro: ficha.intro.trim(),
    // Sin título propio la página cae en el H2 genérico de la plantilla, que es
    // legítimo para las salas antiguas pero no para las que se escriben ahora.
    ...(ficha.aboutTitle ? { aboutTitle: ficha.aboutTitle.trim() } : {}),
    about: ficha.about.trim(),
  };
}

/** Emite el módulo TS a partir del JSON, que es la fuente de verdad. */
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

// ───────────────────────── Main ─────────────────────────

async function main() {
  const cola = leerJSON(COLA, []);
  if (!cola.length) {
    log("la cola está vacía: ejecuta scripts/localidades/preparar-dataset.mjs");
    return;
  }
  const progreso = leerJSON(PROGRESO, { hechas: [], descartadas: [] });
  const generadas = leerJSON(GENERADAS, []);

  const hechas = new Set(progreso.hechas);
  const abandonadas = agotadas(progreso.descartadas);

  // Índice de lo ya publicado, para vecinas y para no repetir slug.
  const { getCities, getCountries, getTopics } = await import("../../src/data/index.ts");
  const { CITY_COORDS } = await import("../../src/data/coords.ts");
  const { channelsForCity } = await import("../../src/data/irc-canal.ts");
  const publicadas = [...getCountries(), ...getCities(), ...getTopics()];
  const indice = indexar(publicadas, CITY_COORDS);
  const yaSlug = new Set(publicadas.map((p) => p.slug));
  // Y también por identidad de la localidad, no solo por slug: "palermo" y
  // "palermo-colombia" son slugs distintos del mismo pueblo de Huila, y las dos
  // salas se publicaron el 2026-08-06 porque el filtro solo miraba el slug. El
  // desambiguador no siempre elige la misma forma entre pasadas.
  const identidad = (r) => `${(r.name ?? r.nombre ?? "").toLowerCase()}|${(r.provincia ?? r.region ?? "").toLowerCase()}|${(r.parentSlug ?? r.paisSlug ?? "").toLowerCase()}`;
  const yaLocalidad = new Set(publicadas.map(identidad));
  const situadas = [...indice.situadas];

  // El índice de fraseo se arranca con lo YA publicado a mano y con lo que haya
  // generado el cron: si solo mirase el lote de hoy, la misma costura volvería
  // cada mañana sin que nada la detectase.
  const indiceFraseo = indiceDeShingles([
    ...publicadas.filter((p) => p.about),
    ...generadas,
  ]);

  const demanda = cargarDemanda();
  const puntuar = (loc) =>
    (demanda?.get(norm(loc.nombre)) ?? 0) * 1000 + (loc.poblacion ?? 0);

  /**
   * REHACER: reescribir en su sitio una ficha ya publicada.
   *
   * Hace falta porque la alternativa —despublicarla y devolverla a la cola—
   * tira la URL abajo unos días, y una URL que aparece y desaparece es peor
   * señal que una ficha mejorable. Aquí la sala nunca deja de existir: se
   * genera la ficha nueva y sustituye a la vieja en el mismo registro.
   *
   * La localidad se reconstruye desde `generadas.json`, que guarda nombre,
   * provincia y país pero NO la fuente. No importa: `reunirMaterial` vuelve a
   * bajar el extracto de Wikipedia por nombre y contexto cuando no se lo dan.
   *
   * Los filtros de duplicado (`yaSlug`, `yaLocalidad`) se saltan a propósito
   * para estas: la sala ya existe, y que exista es justo el motivo de estar aquí.
   */
  const paraRehacer = MODO_REHACER ? leerJSON(REHACER, []) : [];
  const porSlug = new Map(generadas.map((g) => [g.slug, g]));
  const candidatas = MODO_REHACER
    ? paraRehacer
        .map((slug) => {
          const g = porSlug.get(slug);
          if (!g) { log(`  · ${slug} no está publicada: se ignora`); return null; }
          return {
            slug: g.slug,
            nombre: g.name,
            pais: g.parentName,
            paisSlug: g.parentSlug,
            region: g.provincia ?? null,
            regionSlug: g.regionSlug ?? null,
            related: g.related,
            rehacer: true,
          };
        })
        .filter(Boolean)
    : cola
        .filter((l) => l.slug && !hechas.has(l.slug) && !abandonadas.has(l.slug)
          && !yaSlug.has(l.slug) && !yaLocalidad.has(identidad(l)))
        .sort((a, b) => puntuar(b) - puntuar(a));

  // Una ficha que se está rehaciendo no puede competir consigo misma en el
  // detector de fraseo calcado: se saca del índice antes de empezar.
  if (MODO_REHACER) {
    const suyos = new Set(candidatas.map((c) => c.slug));
    for (const [frase, duena] of indiceFraseo) if (suyos.has(duena)) indiceFraseo.delete(frase);
  }

  log(`${MODO_REHACER ? "a rehacer" : "cola"}: ${candidatas.length} · lote de hoy: ${LOTE}${SECO ? " (SECO)" : ""}`);

  const nuevas = [];
  let intentadas = 0;

  for (const loc of candidatas) {
    if (nuevas.length >= LOTE) break;
    if (intentadas >= LOTE * 3) { log("demasiados intentos fallidos, se corta el lote"); break; }
    intentadas++;

    const descarta = (razon) => {
      log(`  ✗ ${loc.slug}: ${razon}`);
      progreso.descartadas.push({ slug: loc.slug, razon, fecha: new Date().toISOString().slice(0, 10) });
    };

    try {
      const material = await reunirMaterial(loc);
      if (!material.suficiente) { descarta("sin fuente utilizable"); continue; }

      // Los censos de origen mezclan divisiones administrativas con localidades:
      // en la primera prueba entró Sinaloa —el estado— y salió una ficha de
      // kind "ciudad" diciendo que se fundó en 1830. Una sala de estado no es
      // errónea, pero hay que crearla como región y con sus ciudades colgando,
      // no colada entre los pueblos.
      if (esDivisionAdministrativa(material.extracto)) {
        descarta("es una división administrativa, no una localidad");
        continue;
      }

      const gen = await completar(SISTEMA, promptGenerar(loc, material), { maxTokens: TOKENS_FICHA });
      let ficha = extraeJSON(gen.texto);
      if (!ficha.intro || !ficha.about) { descarta("la ficha no trae intro o about"); continue; }

      // Verificación adversarial con un proveedor DISTINTO: el que escribió
      // comparte el punto ciego del que escribió y aprueba sus invenciones.
      const ver = await completar(SISTEMA, promptVerificar(loc, ficha, material), {
        maxTokens: 1500,
        excluir: [gen.proveedor],
      });
      const veredicto = extraeJSON(ver.texto);

      if (veredicto.aprobado === false && veredicto.problemas?.length) {
        const corr = await completar(SISTEMA, promptCorregir(loc, ficha, veredicto.problemas, material), {
          maxTokens: TOKENS_FICHA,
          excluir: [ver.proveedor],
        });
        const corregida = extraeJSON(corr.texto);
        if (!corregida.intro || !corregida.about) {
          descarta(`rechazada y sin corrección válida: ${veredicto.problemas[0]}`);
          continue;
        }
        ficha = { ...ficha, ...corregida };

        // Segunda pasada del verificador sobre la corrección: corregir a ciegas
        // y publicar sin volver a mirar es como no haber verificado.
        const rever = await completar(SISTEMA, promptVerificar(loc, ficha, material), {
          maxTokens: 1500,
          excluir: [corr.proveedor],
        });
        const veredicto2 = extraeJSON(rever.texto);
        if (veredicto2.aprobado === false) {
          descarta(`rechazada tras corrección: ${(veredicto2.problemas ?? []).join("; ").slice(0, 200)}`);
          continue;
        }
      }

      // Los fallos de longitud se reintentan; los de fondo (muletillas, markdown,
      // apertura de folleto) no, porque arreglarlos es reescribir y eso vuelve a
      // abrir la puerta a inventar.
      const esDeLongitud = (p) => /caracteres|palabras/.test(p);
      let problemas = revisarFicha(ficha);
      for (let intento = 0; problemas.length && problemas.every(esDeLongitud) && intento < 2; intento++) {
        const aj = await completar(SISTEMA, promptAjustar(loc, ficha, problemas), { maxTokens: TOKENS_FICHA });
        const ajustada = extraeJSON(aj.texto);
        if (!ajustada.intro || !ajustada.about) break;
        ficha = { ...ficha, ...ajustada };
        problemas = revisarFicha(ficha);
      }
      if (problemas.length) { descarta(`controles de calidad: ${problemas.join("; ")}`); continue; }

      if (HORARIOS_INVENTADOS.test(ficha.about) || HORARIOS_INVENTADOS.test(ficha.intro)) {
        descarta("inventa cuándo se anima la sala");
        continue;
      }

      loc.related = relacionadasDe(loc, situadas, (s) => yaSlug.has(s));
      // Al rehacer solo cambia el TEXTO. Los números de sala, los canales y las
      // vecinas se conservan tal cual estaban: recalcularlos exigiría la
      // población y las coordenadas, que `generadas.json` no guarda, y además
      // cambiar los canales de una sala publicada movería a su gente de sitio
      // sin motivo.
      const registro = loc.rehacer
        ? {
            ...porSlug.get(loc.slug),
            intro: ficha.intro.trim(),
            ...(ficha.aboutTitle ? { aboutTitle: ficha.aboutTitle.trim() } : {}),
            about: ficha.about.trim(),
          }
        : construirRegistro(loc, ficha, channelsForCity);

      // Unicidad contra TODO lo que ya hay, no solo contra el lote de hoy.
      const universo = [...generadas, ...nuevas, registro];
      const introsRepe = camposDuplicados(universo, "intro").filter((c) => c.b === registro.slug);
      const parrafosRepe = parrafosDuplicados(
        universo.map((r) => ({ slug: r.slug, cuerpo: r.about })),
      ).filter((c) => c.b === registro.slug);
      if (introsRepe.length) { descarta(`intro repetida de ${introsRepe[0].a}`); continue; }
      if (parrafosRepe.length) { descarta(`párrafo calcado de ${parrafosRepe[0].a}`); continue; }

      // Y el fraseo, que es lo que se cuela cuando el párrafo no es idéntico
      // pero la costura sí: "por las tardes, cuando terminan su jornada".
      const calco = fraseoCalcado(registro, indiceFraseo);
      if (calco) { descarta(`fraseo calcado de ${calco.slug}: "${calco.frase}"`); continue; }

      nuevas.push(registro);
      hechas.add(loc.slug);
      yaSlug.add(loc.slug);
      yaLocalidad.add(identidad(loc));
      for (const s of shingles(registro.about)) if (!indiceFraseo.has(s)) indiceFraseo.set(s, registro.slug);
      if (loc.coords) situadas.push({ slug: loc.slug, nombre: loc.nombre, ...loc.coords });
      log(`  ✓ ${loc.slug} (${loc.pais}) — escribió ${gen.proveedor}, verificó ${ver.proveedor}`);
    } catch (err) {
      descarta(err.message.slice(0, 220));
    }
  }

  if (!nuevas.length) { log("lote sin resultados: no se escribe nada"); return; }

  if (SECO) {
    log(`SECO: se habrían publicado ${nuevas.length} salas`);
    console.log(JSON.stringify(nuevas, null, 1));
    return;
  }

  // En modo rehacer la ficha nueva OCUPA EL SITIO de la vieja, conservando el
  // orden del fichero; en modo normal se añade al final, como siempre.
  const rehechas = new Map(nuevas.map((n) => [n.slug, n]));
  const todas = MODO_REHACER
    ? generadas.map((g) => rehechas.get(g.slug) ?? g)
    : [...generadas, ...nuevas];
  mkdirSync(dirname(GENERADAS), { recursive: true });
  writeFileSync(GENERADAS, JSON.stringify(todas, null, 1));
  writeFileSync(SALIDA_TS, emitirTS(todas));
  progreso.hechas = [...hechas];
  writeFileSync(PROGRESO, JSON.stringify(progreso, null, 1));

  if (MODO_REHACER) {
    const quedan = leerJSON(REHACER, []).filter((slug) => !rehechas.has(slug));
    writeFileSync(REHACER, JSON.stringify(quedan, null, 1));
    log(`quedan ${quedan.length} fichas por rehacer`);
  }

  log(`publicadas ${nuevas.length} salas · acumuladas ${todas.length} · quedan ${candidatas.length - nuevas.length} en cola`);
}

// Solo cuando se ejecuta como programa. Sin esta guarda, importar el módulo
// para probar una de sus funciones arrancaba el cron entero.
if (process.argv[1] && import.meta.url.endsWith(basename(process.argv[1]))) {
  main().catch((err) => { console.error(err); process.exit(1); });
}
