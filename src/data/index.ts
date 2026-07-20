import { CITIES } from "./cities";
import { CITIES_WORLD } from "./cities-world";
import { COUNTRIES } from "./countries";
import { TOPICS } from "./topics";
import { TOPICS_EXTRA } from "./topics-extra";
import { TOPICS_EDAD } from "./topics-edad";
import { TOPICS_LEGACY } from "./topics-legacy";
import { TOPICS_INTERESES } from "./topics-intereses";
import { TOPICS_REGIONES } from "./topics-regiones";
import { TOPICS_MOTOR } from "./topics-motor";
import { TOPICS_OCIO } from "./topics-ocio";
import { TOPICS_ADULTOS } from "./topics-adultos";
import { TOPICS_LATINCHAT } from "./topics-latinchat";
import { NEWS } from "./news";
import type { Place } from "./types";
import { normalize } from "@/lib/slug";

const ALL_CITIES: Place[] = [...CITIES, ...CITIES_WORLD];
const ALL_TOPICS: Place[] = [
  ...TOPICS,
  ...TOPICS_EXTRA,
  ...TOPICS_EDAD,
  ...TOPICS_LEGACY,
  ...TOPICS_INTERESES,
  ...TOPICS_REGIONES,
  ...TOPICS_MOTOR,
  ...TOPICS_OCIO,
  ...TOPICS_ADULTOS,
  ...TOPICS_LATINCHAT,
];
const ALL: Place[] = [...COUNTRIES, ...ALL_CITIES, ...ALL_TOPICS];

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
      const qualifier =
        QUALIFIER_OVERRIDE[p.slug] ??
        (p.provincia && normalize(p.provincia) !== key ? p.provincia : p.parentName);
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

export function getCities() { return ALL_CITIES; }
export function getCountries() { return COUNTRIES; }
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
// Comunidades autónomas españolas (topics-regiones.ts): para agrupar el listado
// de ciudades de /chat/espana y para las cabeceras de /chat/{comunidad}.
export function getRegions(): Place[] {
  return TOPICS_REGIONES;
}
// Ciudades de una comunidad autónoma española (no usan parentSlug para esto,
// las ciudades cuelgan de "espana"; regionSlug es el vínculo real).
export function getCitiesByRegion(regionSlug: string): Place[] {
  return ALL_CITIES.filter((c) => c.regionSlug === regionSlug);
}
export * from "./types";
export { CONTINENTS } from "./countries";
