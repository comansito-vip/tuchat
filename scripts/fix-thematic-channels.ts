/**
 * Ordena los canales de las salas TEMÁTICAS para que ninguna aterrice sola.
 *
 * El problema: 324 salas temáticas entraban PRIMERO a un canal que la red no
 * tiene (#cine, #salud, #hobbies, #real-madrid…). Un canal inexistente se crea
 * vacío al entrar, así que el usuario se quedaba solo mirando una sala muerta.
 *
 * El criterio del cliente NO es borrar esos canales: es que la sala entre antes
 * a un canal real con gente (#ocio, #futbol, #gay, #sexo…) y después al suyo,
 * que así se va llenando poco a poco (#cine, #marruecos…). Orden final:
 *
 *   [canal real de la vertical, …otros canales reales, …canal propio de la sala]
 *
 * Solo se descartan dos cosas: las variantes mal escritas de un canal que YA
 * existe (#cataluna vs #cataluña, #cybersexo vs #cibersexo) —mantenerlas parte
 * a la gente en dos canales gemelos— y los vetados por el cliente (#de_13_a_18,
 * los canales de DJ y radio).
 *
 * /anime queda fuera a propósito: el cliente decidió que las series (#naruto,
 * #one-piece…) no se abren por ahora, así que sus salas van solo a #anime +
 * #ocio (ver channels.test.ts).
 *
 * Ejecutar: npx tsx scripts/fix-thematic-channels.ts
 */
import fs from "node:fs";
import { REAL_CHANNELS } from "../src/data/irc-real-channels";
import { getTopics } from "../src/data";

/**
 * Canal propio de la sala -> canales REALES a los que entra antes que al suyo.
 * Es el canal de su vertical: donde ya hay gente hablando de lo mismo.
 */
const HUB: Record<string, string[]> = {
  // Verticales sin canal propio en la red: el genérico #ocio es su sitio
  cine: ["ocio"], series: ["ocio"], tv: ["ocio"], bolsa: ["ocio"],
  viajes: ["ocio"], cocina: ["ocio"], salud: ["ocio"], hobbies: ["ocio"],
  empleo: ["ocio"], motor: ["ocio"], mascotas: ["ocio"], tecnologia: ["ocio"],
  fans: ["ocio"], "mama-luna": ["ocio"],
  // Verticales que sí tienen un canal real donde cae la gente
  videojuegos: ["juegos"], poker: ["juegos"], "age-of-empires": ["juegos"],
  aoc: ["juegos"], "the-conquerors": ["juegos"],
  politica: ["debates"], debate: ["debates"],
  historia: ["cultura"], literatura: ["biblioteca"],
  psicologos: ["psicologia"], desahogarse: ["psicologia"],
  videncia: ["tarot", "esoterismo"], astrologia: ["tarot", "esoterismo"],
  euskaraz: ["euskadi"],
  iglesia: ["religion"],
  "cristiano-evangelico": ["cristianos"], "cristiano-gitano": ["cristianos"],
  // Deportes: la red solo tiene #futbol, #mundial y #real-madrid-c-f
  formula1: ["ocio"], nba: ["ocio"], tenis: ["ocio"], boxeo: ["ocio"], ufc: ["ocio"],
  laliga: ["futbol"], champions: ["futbol"],
  mundial2026: ["mundial"], seleccionargentina: ["mundial"], seleccionespanola: ["mundial"],
  "real-madrid": ["real-madrid-c-f", "futbol"],
  // Trivial y concurso
  quizfight: ["trivial"], trivisabios: ["trivial"], el_mejor_trivial: ["trivial"],
  "trivial-futbol": ["trivial"], scrabble: ["trivial"],
  pasapalabra: ["ocio"], "gran-hermano": ["ocio"], fama: ["ocio"], goya: ["ocio"],
  "el-pacto": ["ocio"],
  // LGTBI
  lgtbi: ["de_ambiente"], bisex: ["de_ambiente"], "comunidad-lgbt": ["de_ambiente"],
  trans: ["personas_trans"],
  // Adultos
  adultos: ["sexo"], "adultos-latinos": ["sexo"], erotico: ["sexo"],
  "cuarto-oscuro": ["sexo"], hot: ["sexo"], intimos: ["sexo"],
  mazmorra_hispano: ["mazmorra"],
  infieles: ["sexo_casadas", "cornudos"], casadas: ["sexo_casadas"],
  "casados-infieles": ["casados"], cornudas: ["cornudos"],
  // Ligue y encuentros
  encuentros: ["ligar", "citas"], "encuentros-latinos": ["ligar"],
  "ligar-con-chicas": ["ligar"], "ligar-con-chicos": ["ligar"], ligoteo: ["ligar"],
  amantes: ["citas"], romance: ["ligar"], sapio: ["ligar"], chica: ["ligar"],
  badoo: ["ligar"], "badoo-espana": ["ligar"], jswipe: ["ligar"], ligue: ["ligar"],
  icq: ["citas"], ozu: ["citas"], lycos: ["citas"], azar: ["citas"],
  avenue: ["citas"], anonimo: ["citas"],
  // Sociales legacy (ya llevan #amistad, que tiene gente de sobra)
  colegas: ["amigos"], solos: ["solteros"],
  mujer: ["mujeres"], chicas: ["mujeres"], "de-chicas": ["mujeres"],
  amas: ["mujeres"], afrofeminas: ["mujeres"],
  cafe: ["ocio"], "sin-registro": ["chat"], whisper: ["ocio"], interactivo: ["ocio"],
  camara: ["ocio"], "con-camara": ["ocio"], foto: ["ocio"], hispachat: ["chat"],
  messenger: ["chat"], laguna2000: ["ocio"], frikinternet: ["ocio"],
  animalear: ["ocio"], camioneros: ["ocio"], spanish: ["chat"],
  revolucionario: ["debates"], "sendero-del-peje": ["debates"],
  bandoleros: ["amigos"], babel: ["amigos"],
  // Música: los canales de DJ están vetados; la gente está en #musica y #radio
  "dj-online": ["musica", "radio"],
  // Geo legacy: al canal real de su país o ciudad
  argentinos: ["argentina"], "arriba-argentina": ["argentina"], argentinos40: ["argentina"],
  mexicanos: ["mexico"], gdl: ["guadalajara"],
  paraguayos: ["paraguay"], desdeparaguay: ["paraguay"], yagua: ["paraguay"],
  "encuentros-de-colombia": ["colombia"], colchat: ["colombia"],
  "cantv-con-camara": ["venezuela"],
  latin: ["latinos"], "latinchat-amigos": ["latinchat"],
  latinas: ["latinos"], hispanos: ["latinos"],
  rebelion: ["chile"], bar_del_zorro: ["chile"], planeta_mix: ["chile"],
  norte_chile: ["chile"], sur_chile: ["chile"],
  // El Magreb no tiene canal en la red: #internacional es donde cae esa gente
  arabe: ["internacional"], marruecos: ["internacional"],
  // Gay: legacy con sala propia; todos pasan antes por #gay
  gays: ["gay"], gayamigos: ["gay"], "de-gays": ["gay"], homosexual: ["gay"],
  gayfrikinternet: ["gay"], "gay-maduros": ["gay"], gaysm: ["gay"], gaycachas: ["gay"],
  "joven-busca-maduro": ["gay"], gaylatino: ["gay"], gaybogota: ["gay"],
  gaychilenos: ["gay"], "gay-argentina": ["gay"], "gay-mexico": ["gay"],
  "gay-peru": ["gay"], "gay-venezuela": ["gay"], "gay-uruguay": ["gay"],
  gaybarcelona: ["chueca_barcelona", "gay"], gaygranada: ["gay"],
  "gay-sevilla": ["gay"], "gay-valencia": ["gay"], "gay-bilbao": ["gay"],
  "gay-sitges": ["gay"], "gay-maspalomas": ["gay"], "gay-ibiza": ["gay"],
  // Lesbianas: legacy con sala propia; todas pasan antes por #lesbianas
  les: ["lesbianas"], "lesbianas-terra": ["lesbianas"], "de-lesbianas": ["lesbianas"],
  lesbico: ["lesbianas"], lesbis: ["lesbianas"], "el-rincon-lesbico": ["el_rincon_les", "lesbianas"],
  lesbianas_spain: ["lesbianas"], lesbianas_mexicanas: ["lesbianas"],
};

/**
 * Canales que NO se conservan, ni siquiera al final:
 *  - Variantes mal escritas de un canal que ya existe. Dejarlas vivas parte a la
 *    gente entre dos canales gemelos, justo lo contrario de lo que buscamos.
 *  - Vetados por el cliente: #de_13_a_18 (menores) y los canales de DJ/radio.
 */
const DESCARTADOS: Record<string, string> = {
  real_madrid_c_f: "duplicado de #real-madrid-c-f",
  cataluna: "variante sin ñ de #cataluña",
  "buenos-aires": "variante con guion de #buenos_aires",
  cybersexo: "variante de #cibersexo",
  de_18_a_26: "variante de #milenials",
  mas_de_60: "variante de #mas__de60",
  rioja: "variante de #la_rioja",
  adolescentes: "sala de menores: vetada, como #de_13_a_18",
  mexico_vip: "canal VIP inexistente",
  onda_latina: "canal de radio/DJ: vetado",
  onda_sideral: "canal de radio/DJ: vetado",
  radio_corazon: "canal de radio/DJ: vetado",
  ultrasonix_djs: "canal de radio/DJ: vetado",
  el_jardin_musical: "canal de radio/DJ: vetado",
};

/** Sustituto real de cada canal descartado. */
const SUSTITUTO: Record<string, string[]> = {
  real_madrid_c_f: ["real-madrid-c-f"],
  cataluna: ["cataluña"],
  "buenos-aires": ["buenos_aires"],
  cybersexo: ["cibersexo"],
  de_18_a_26: ["milenials"],
  mas_de_60: ["mas__de60"],
  rioja: ["la_rioja"],
  adolescentes: ["milenials"],
  mexico_vip: ["mexico"],
  onda_latina: [], onda_sideral: [], radio_corazon: [],
  ultrasonix_djs: [], el_jardin_musical: [],
};

/** #deportes no existe: en fútbol la gente está en #futbol; el resto, a #ocio. */
function hubDe(canal: string, slug: string, parent?: string): string[] | undefined {
  if (canal === "deportes") {
    const esFutbol = slug === "deportes" || parent === "deportes" || parent === "futbol";
    return esFutbol ? ["futbol"] : ["ocio"];
  }
  // El hub /lgtbi abre también #gay, que es el canal LGTBI con gente. Las salas
  // de dentro (trans, bisexuales, queer) no se meten ahí de rebote.
  if (canal === "lgtbi" && slug === "lgtbi") return ["de_ambiente", "gay"];
  // Los equipos de fútbol no tienen canal: entran a #futbol antes que al suyo.
  if (parent === "futbol") return ["futbol"];
  return HUB[canal];
}

const topics = getTopics() as { slug: string; parentSlug?: string; channels: string[] }[];
const nuevos = new Map<string, string[]>();
const sinHub: string[] = [];

for (const p of topics) {
  const propios = (p.channels ?? []).filter((c) => !REAL_CHANNELS.has(c));
  if (!propios.length) continue;

  const reales: string[] = [];
  const cola: string[] = [];
  for (const c of p.channels) {
    if (REAL_CHANNELS.has(c)) { reales.push(c); continue; }
    if (c in DESCARTADOS) { reales.push(...SUSTITUTO[c]); continue; }
    const hub = hubDe(c, p.slug, p.parentSlug);
    if (!hub) { sinHub.push(`${p.slug}: #${c}`); continue; }
    reales.push(...hub);   // el canal real de la vertical va DELANTE
    cola.push(c);          // el canal propio de la sala, al final
  }
  const final = [...new Set([...reales, ...cola])];
  if (JSON.stringify(final) !== JSON.stringify(p.channels)) nuevos.set(p.slug, final);
}

if (sinHub.length) {
  console.error("Canales sin vertical asignada (abortado):");
  for (const s of sinHub) console.error("  " + s);
  process.exit(1);
}

// Reescribe el array `channels` de cada sala en su fichero: se busca el bloque
// que arranca en su `slug:` y termina donde empieza el de la sala siguiente.
const FILES = fs
  .readdirSync("src/data")
  .filter((f) => f.startsWith("topics") && f.endsWith(".ts") && !f.includes(".test."));
let tocadas = 0;
for (const file of FILES) {
  const path = `src/data/${file}`;
  let src = fs.readFileSync(path, "utf8");
  const marks: { slug: string; at: number }[] = [];
  for (const m of src.matchAll(/"?slug"?:\s*"([\w-]+)"/g)) marks.push({ slug: m[1], at: m.index! });
  // De atrás hacia delante: así los índices ya calculados siguen siendo válidos.
  for (let i = marks.length - 1; i >= 0; i--) {
    const nuevo = nuevos.get(marks[i].slug);
    if (!nuevo) continue;
    const desde = marks[i].at;
    const hasta = i + 1 < marks.length ? marks[i + 1].at : src.length;
    const bloque = src.slice(desde, hasta);
    const chRe = /("?channels"?:\s*)\[[^\]]*\]/;
    if (!chRe.test(bloque)) continue;
    const lista = nuevo.map((c) => `"${c}"`).join(", ");
    src = src.slice(0, desde) + bloque.replace(chRe, `$1[${lista}]`) + src.slice(hasta);
    tocadas++;
  }
  fs.writeFileSync(path, src);
}
console.log(`salas actualizadas: ${tocadas} (esperadas: ${nuevos.size})`);
