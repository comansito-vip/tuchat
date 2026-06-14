import { CITIES } from "./cities";
import { CITIES_WORLD } from "./cities-world";
import { COUNTRIES } from "./countries";
import { TOPICS } from "./topics";
import { TOPICS_EXTRA } from "./topics-extra";
import { NEWS } from "./news";
import type { Place } from "./types";

const ALL_CITIES: Place[] = [...CITIES, ...CITIES_WORLD];
const ALL_TOPICS: Place[] = [...TOPICS, ...TOPICS_EXTRA];
const ALL: Place[] = [...COUNTRIES, ...ALL_CITIES, ...ALL_TOPICS];

export function getPlace(slug: string): Place | undefined {
  return ALL.find((p) => p.slug === slug);
}
export function getCities() { return ALL_CITIES; }
export function getCountries() { return COUNTRIES; }
export function getTopics() { return ALL_TOPICS; }
// Solo los temas principales (para el carrusel de categorías de la home).
export function getPrimaryTopics() { return TOPICS; }
export function getNews() { return NEWS; }
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
