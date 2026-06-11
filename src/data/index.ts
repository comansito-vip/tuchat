import { CITIES } from "./cities";
import { COUNTRIES } from "./countries";
import { TOPICS } from "./topics";
import { NEWS } from "./news";
import type { Place } from "./types";

const ALL: Place[] = [...COUNTRIES, ...CITIES, ...TOPICS];

export function getPlace(slug: string): Place | undefined {
  return ALL.find((p) => p.slug === slug);
}
export function getCities() { return CITIES; }
export function getCountries() { return COUNTRIES; }
export function getTopics() { return TOPICS; }
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
export * from "./types";
export { CONTINENTS } from "./countries";
