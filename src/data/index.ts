import { CITIES } from "./cities";
import { CITIES_WORLD } from "./cities-world";
import { CITIES_GENERADAS } from "./cities-generadas";
import { CITY_REGIONS } from "./city-regions";
import { slugRegion } from "./region-alias";
import { canalesReales } from "./canales-saneado";
import { ABOUT_TITLES } from "./about-titles";
import { COUNTRIES } from "./countries";
import { TOPICS } from "./topics";
import { TOPICS_EXTRA } from "./topics-extra";
import { TOPICS_EDAD } from "./topics-edad";
import { TOPICS_LEGACY } from "./topics-legacy";
import { TOPICS_INTERESES } from "./topics-intereses";
import { TOPICS_REGIONES } from "./topics-regiones";
import { TOPICS_REGIONES_AM } from "./topics-regiones-am";
import { TOPICS_MOTOR } from "./topics-motor";
import { TOPICS_OCIO } from "./topics-ocio";
import { TOPICS_ADULTOS } from "./topics-adultos";
import { TOPICS_LATINCHAT } from "./topics-latinchat";
import { NEWS } from "./news";
import type { Place } from "./types";
import { normalize } from "@/lib/slug";

// Las ciudades americanas de cities-world.ts se escribieron colgando solo del
// país: 267 de las 272 mexicanas no sabían en qué estado estaban, así que no
// tenían página de estado a la que enlazar y una sala de estado habría nacido
// vacía. `CITY_REGIONS` (generado) les pone su provincia sin tocar los 2,3 MB de
// datos escritos a mano; lo que ya trae regionSlug se respeta.
// El regionSlug se normaliza aquí, al cargar, y no en el generador: lo escriben
// tres sitios distintos (mapear-regiones.mjs, los datos a mano y el cron de
// goteo que llena cities-generadas.ts), así que este es el único punto por el
// que pasan todos. Ver region-alias.ts.
const conRegion = (p: Place): Place => {
  const base = p.regionSlug || !CITY_REGIONS[p.slug] ? p : { ...p, ...CITY_REGIONS[p.slug] };
  if (!base.regionSlug) return base;
  const alias = slugRegion(base.regionSlug);
  return alias === base.regionSlug ? base : { ...base, regionSlug: alias };
};

// Fuera los canales que no existen en la red. El panel de la sala los publica
// como «También conecta con #…», así que nombrar uno inventado es afirmar algo
// falso. Ver canales-saneado.ts.
const conCanalesReales = (p: Place): Place => {
  const limpios = canalesReales(p.channels);
  return limpios.length === p.channels.length && limpios.every((c, i) => c === p.channels[i])
    ? p
    : { ...p, channels: limpios };
};

// El H2 propio de las salas anteriores al generador de localidades (ver
// about-titles.ts). Gana siempre el de la ficha: el cron de goteo escribe el
// suyo al publicar y no tiene por qué saber de este mapa.
const conAboutTitle = (p: Place): Place =>
  p.aboutTitle || !ABOUT_TITLES[p.slug] ? p : { ...p, aboutTitle: ABOUT_TITLES[p.slug] };

const ALL_CITIES: Place[] = [...CITIES, ...CITIES_WORLD, ...CITIES_GENERADAS]
  .map(conRegion)
  .map(conAboutTitle)
  .map(conCanalesReales);
const ALL_TOPICS: Place[] = [
  ...TOPICS,
  ...TOPICS_EXTRA,
  ...TOPICS_EDAD,
  ...TOPICS_LEGACY,
  ...TOPICS_INTERESES,
  ...TOPICS_REGIONES,
  ...TOPICS_REGIONES_AM,
  ...TOPICS_MOTOR,
  ...TOPICS_OCIO,
  ...TOPICS_ADULTOS,
  ...TOPICS_LATINCHAT,
].map(conAboutTitle).map(conCanalesReales);
const ALL_COUNTRIES: Place[] = COUNTRIES.map(conAboutTitle).map(conCanalesReales);
const ALL: Place[] = [...ALL_COUNTRIES, ...ALL_CITIES, ...ALL_TOPICS];

// Índice por slug: getPlace se llama una vez por sala al prerenderizar 460+
// páginas, así que un Map evita el escaneo lineal repetido sobre todo el catálogo.
const BY_SLUG: Map<string, Place> = new Map(ALL.map((p) => [p.slug, p]));

export function getPlace(slug: string): Place | undefined {
  return BY_SLUG.get(slug);
}
// Las salas de ciudad muestran una bandera (no un icono temático): con 660+
// ciudades, la bandera permite identificar la procedencia geográfica de un
// vistazo en listados; países y temáticas conservan su icono propio.
// Prioridad para una ciudad:
//  1. Bandera de su comunidad autónoma (regionSlug → Galicia, Andalucía…), más
//     específica y propia del territorio que la del país.
//  2. Su propia bandera, si la trae (Ceuta y Melilla son ciudades autónomas:
//     no cuelgan de ninguna comunidad, pero tienen bandera propia, más suya
//     que la de España).
//  3. Bandera de su país padre (Vigo → 🇪🇸, Bogotá → 🇨🇴).
//  4. Su propio icono/bandera.
export function cityFlag(place: Place): { icon: string; flagSrc?: string; name: string } {
  if (place.kind === "ciudad") {
    if (place.regionSlug) {
      const region = BY_SLUG.get(place.regionSlug);
      if (region?.flagSrc) return { icon: region.icon, flagSrc: region.flagSrc, name: region.name };
    }
    if (place.flagSrc) return { icon: place.icon, flagSrc: place.flagSrc, name: place.name };
    if (place.parentSlug) {
      const parent = BY_SLUG.get(place.parentSlug);
      if (parent) return { icon: parent.icon, flagSrc: parent.flagSrc, name: parent.name };
    }
  }
  return { icon: place.icon, flagSrc: place.flagSrc, name: place.name };
}
// 63 nombres se repiten en el catálogo: el Madrid de España y el de
// Cundinamarca, tres Méridas, cuatro Villanuevas... Todos emitían el mismo
// <title> ("Chat Madrid gratis"), así que 141 páginas competían entre sí por la
// misma búsqueda en vez de sumar. La sala cuyo slug es el nombre a secas
// conserva el título limpio —es la que debe ganar la búsqueda genérica— y las
// demás se cualifican con su provincia real, o con su país si no la tienen.
// La Rioja española es una comunidad autónoma, no una ciudad: no tiene provincia
// ni país padre de los que tirar para distinguirla de La Rioja argentina.
const QUALIFIER_OVERRIDE: Record<string, string> = {
  "la-rioja-comunidad": "comunidad autónoma",
};

const HOMONYM_QUALIFIER: Map<string, string> = (() => {
  const byName = new Map<string, Place[]>();
  for (const p of ALL) {
    const key = normalize(p.name);
    byName.set(key, [...(byName.get(key) ?? []), p]);
  }
  const out = new Map<string, string>();
  for (const [key, places] of byName) {
    if (places.length < 2) continue;
    for (const p of places) {
      if (p.slug === key.replace(/\s+/g, "-")) continue; // el canónico se queda el título limpio
      // Córdoba es la capital de la provincia de Córdoba: ahí la provincia no
      // distingue nada y hay que subir al país.
      const porProvincia = p.provincia && normalize(p.provincia) !== key ? p.provincia : null;
      const porPais = p.parentName && normalize(p.parentName) !== key ? p.parentName : null;
      // Entre dos cualificadores que distinguen igual de bien, gana el que cabe
      // en la SERP: "Tiempo en Santo Domingo (Santo Domingo de los Tsáchilas)"
      // se pasaba de 60 caracteres, y "(Ecuador)" dice lo mismo en menos sitio.
      const cabe = (q: string) =>
        `Tiempo en ${p.name} (${q})`.length + " · TuChat".length <= 60;
      const qualifier =
        QUALIFIER_OVERRIDE[p.slug] ??
        (porProvincia && (cabe(porProvincia) || !porPais) ? porProvincia : porPais ?? porProvincia);
      if (qualifier && normalize(qualifier) !== key) out.set(p.slug, qualifier);
    }
  }
  return out;
})();

// Los hubs cuya landing hermana se llama igual ("Gay" y "Chat Gay"): sin un
// título propio de cola larga, las dos páginas pelean por la misma búsqueda.
const ROOM_TITLES: Record<string, string> = {
  amor: "Chat para buscar pareja y conocer gente gratis",
  amistad: "Chat para hacer amigos gratis sin registro",
  ligar: "Chat para ligar gratis en español sin registro",
  adultos: "Chat de adultos gratis sin registro",
  encuentros: "Chat de encuentros gratis sin registro",
  gay: "Chat gay gratis para conocer chicos sin registro",
  lesbianas: "Chat de lesbianas gratis para conocer chicas",
};

/** Nombre de la sala, cualificado si comparte nombre con otra ("Madrid (Cundinamarca)"). */
export function roomName(place: Place): string {
  const qualifier = HOMONYM_QUALIFIER.get(place.slug);
  return qualifier ? `${place.name} (${qualifier})` : place.name;
}

/**
 * El <title> y el H1 de una sala. Las salas heredadas ya se llaman "Chat Terra"
 * o "Chat estilo Badoo": anteponer "Chat" otra vez daría "Chat Chat Terra".
 */
export function roomTitle(place: Place): string {
  const custom = ROOM_TITLES[place.slug];
  if (custom) return custom;
  const name = roomName(place);
  return /^chat\b/i.test(name) ? `${name} gratis` : `Chat ${name} gratis`;
}

/**
 * Las salas donde la demanda medida NO da "gratis" como forma ganadora.
 *
 * Sale del corpus de la red (/home/javier/red-seo, 26 M de impresiones en
 * consultas que empiezan por "chat"): de las 173 salas con demanda suficiente en
 * formas con sufijo, en 167 gana "gratis". Estas son las excepciones reales
 * —Portugal acumula 2.424 impresiones en "chat portugal online" frente a 490 en
 * "gratis"—, así que su complemento es el suyo y no el genérico.
 */
const COMPLEMENTO_MEDIDO: Record<string, string> = {
  portugal: "online",
  arg: "online",
  nudismo: "online",
};

/** El complemento por defecto: la fórmula natural del sector cuando no hay dato propio. */
const COMPLEMENTO = "sin registro";

/**
 * El <title> de la página de sala. Es el H1 más un complemento.
 *
 * POR QUÉ AÑADE EN VEZ DE ROTAR: el H1 y el <title> eran el mismo texto en 2.940
 * páginas, y ese texto medía 21 caracteres de mediana cuando Google muestra unos
 * 60 —sobraban cuarenta sin usar—. La tentación es rotar el sufijo ("gratis" en
 * unas, "sin registro" en otras) para que no se parezcan tanto, pero el corpus
 * dice que en las consultas de sala "gratis" vale el 11,6% de las impresiones y
 * "sin registro" el 0,3%: sustituir uno por otro sería cambiar demanda real por
 * demanda marginal. Añadiendo, la página cubre las dos formulaciones y el H1 se
 * queda con la corta, que es la que se lee bien dentro de la página.
 *
 * El complemento se omite —no se recorta a la mitad— si no cabe en los 60
 * caracteres, y no se duplica en las salas cuyo título propio ya lo dice.
 */
export function roomMetaTitle(place: Place): string {
  const base = roomTitle(place);
  const complemento = COMPLEMENTO_MEDIDO[place.slug] ?? COMPLEMENTO;
  if (new RegExp(`\\b${complemento}\\b`, "i").test(base)) return base;
  const conComplemento = `${base} ${complemento}`;
  return conComplemento.length <= 60 ? conComplemento : base;
}

export function getCities() { return ALL_CITIES; }
export function getCountries() { return ALL_COUNTRIES; }
export function getTopics() { return ALL_TOPICS; }
// Solo los temas principales (para el carrusel de categorías de la home).
export function getPrimaryTopics() { return TOPICS; }
export function getNews() { return [...NEWS].sort((a, b) => b.date.localeCompare(a.date)); }
export function getRooms(): Place[] {
  return [...ALL].sort((a, b) => b.users - a.users).slice(0, 12);
}
export function getRanking(): Place[] {
  return [...ALL].sort((a, b) => b.votes - a.votes).slice(0, 10);
}
export function getRelated(slugs: string[]): Place[] {
  return slugs.map(getPlace).filter((p): p is Place => Boolean(p));
}
// Estadísticas agregadas para el panel de control.
export function getStats() {
  const all = ALL;
  return {
    countries: COUNTRIES.length,
    cities: ALL_CITIES.length,
    topics: ALL_TOPICS.length,
    rooms: all.length,
    news: NEWS.length,
    totalVotes: all.reduce((s, p) => s + p.votes, 0),
    totalUsers: all.reduce((s, p) => s + p.users, 0),
  };
}
// Salas hijas de un lugar (ciudades de un país, sub-salas de una temática).
export function getChildren(slug: string): Place[] {
  return ALL.filter((p) => p.parentSlug === slug);
}
// Salas por franja de edad (topics-edad.ts): /chat las agrupa bajo "Por edades".
export function getAgeTopics(): Place[] {
  return TOPICS_EDAD;
}
// Regiones con sala propia: comunidades autónomas españolas (topics-regiones.ts)
// y estados americanos (topics-regiones-am.ts). Sirve para agrupar el listado de
// ciudades de su país y para las cabeceras de /chat/{region}. Las españolas
// tienen bandera real en /flags/regiones/; las americanas no, y caen en su icono.
export function getRegions(): Place[] {
  return [...TOPICS_REGIONES, ...TOPICS_REGIONES_AM];
}
// Regiones con sala de un país concreto, para que su tarjeta en /chat se navegue
// por ellas. Las comunidades españolas no llevan `parentSlug` —se escribieron
// cuando España era el único país con regiones— así que se resuelven por
// descarte; las americanas sí lo traen. La asimetría se encapsula aquí para que
// ninguna página tenga que conocerla.
export function getRegionsOfCountry(countrySlug: string): Place[] {
  return getRegions().filter((r) =>
    r.parentSlug ? r.parentSlug === countrySlug : countrySlug === "espana",
  );
}
// Ciudades de una comunidad autónoma española (no usan parentSlug para esto,
// las ciudades cuelgan de "espana"; regionSlug es el vínculo real).
export function getCitiesByRegion(regionSlug: string): Place[] {
  return ALL_CITIES.filter((c) => c.regionSlug === regionSlug);
}

// Ciudades hermanas dentro de la misma provincia/departamento. El copy de cada
// sala las usa para escribir con un dato real ("otras 12 salas de Pontevedra")
// en vez de una frase de relleno, así que se consulta una vez por cada una de
// las ~2.500 páginas prerenderizadas: un índice evita 2.500 × 1.996 filtrados.
const BY_PROVINCIA: Map<string, Place[]> = (() => {
  const m = new Map<string, Place[]>();
  for (const c of ALL_CITIES) {
    if (!c.provincia) continue;
    // La provincia se agrupa junto al país: hay homónimas entre países
    // (Córdoba está en España y en Argentina, León en España y en México).
    const k = `${c.parentSlug ?? ""}|${c.provincia}`;
    (m.get(k) ?? m.set(k, []).get(k)!).push(c);
  }
  return m;
})();

export function getCitiesByProvincia(place: Place): Place[] {
  if (!place.provincia) return [];
  const hermanas = BY_PROVINCIA.get(`${place.parentSlug ?? ""}|${place.provincia}`) ?? [];
  return hermanas.filter((c) => c.slug !== place.slug);
}
export * from "./types";
export { CONTINENTS } from "./countries";
