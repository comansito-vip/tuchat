import { CITIES } from "./cities";
import { CITIES_WORLD } from "./cities-world";
import { COUNTRIES } from "./countries";
import { TOPICS } from "./topics";
import { TOPICS_EXTRA } from "./topics-extra";
import { TOPICS_EDAD } from "./topics-edad";
import { TOPICS_LEGACY } from "./topics-legacy";
import { TOPICS_INTERESES } from "./topics-intereses";
import { TOPICS_REGIONES } from "./topics-regiones";
import { NEWS } from "./news";
import type { Place } from "./types";

const ALL_CITIES: Place[] = [...CITIES, ...CITIES_WORLD];
const ALL_TOPICS: Place[] = [
  ...TOPICS,
  ...TOPICS_EXTRA,
  ...TOPICS_EDAD,
  ...TOPICS_LEGACY,
  ...TOPICS_INTERESES,
  ...TOPICS_REGIONES,
];
const ALL: Place[] = [...COUNTRIES, ...ALL_CITIES, ...ALL_TOPICS];

// Índice por slug: getPlace se llama una vez por sala al prerenderizar 460+
// páginas, así que un Map evita el escaneo lineal repetido sobre todo el catálogo.
const BY_SLUG: Map<string, Place> = new Map(ALL.map((p) => [p.slug, p]));

export function getPlace(slug: string): Place | undefined {
  return BY_SLUG.get(slug);
}
// Las salas de ciudad muestran la bandera de su país (no un icono temático):
// con 660+ ciudades, la bandera permite identificar la procedencia geográfica
// de un vistazo en listados; países y temáticas conservan su icono propio.
export function cityFlag(place: Place): { icon: string; flagSrc?: string; name: string } {
  if (place.kind === "ciudad" && place.parentSlug) {
    const parent = BY_SLUG.get(place.parentSlug);
    if (parent) return { icon: parent.icon, flagSrc: parent.flagSrc, name: parent.name };
  }
  return { icon: place.icon, flagSrc: place.flagSrc, name: place.name };
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
export * from "./types";
export { CONTINENTS } from "./countries";
