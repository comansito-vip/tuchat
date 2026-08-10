import { getCountries, getCities, getTopics, type Place } from "@/data";
import { getVoteCounts } from "@/lib/votes-store";

function rank(places: Place[], counts: Record<string, number>, limit: number): Place[] {
  const score = (p: Place) => p.votes + (counts[p.slug] ?? 0);
  return [...places].sort((a, b) => score(b) - score(a)).slice(0, limit);
}

/** Ranking global fusionando votos base estáticos + incrementos persistidos. */
export async function getGlobalRanking(limit = 10): Promise<Place[]> {
  const counts = await getVoteCounts();
  return rank([...getCountries(), ...getCities(), ...getTopics()], counts, limit);
}

/** Ranking filtrado por tipo de sala (país, ciudad o temática). */
export async function getRankingByKind(kind: Place["kind"], limit = 10): Promise<Place[]> {
  const counts = await getVoteCounts();
  const source =
    kind === "pais" ? getCountries() : kind === "ciudad" ? getCities() : getTopics();
  return rank(source, counts, limit);
}

/** Ranking de las ciudades de un país concreto (para /ranking/{pais}). */
export async function getRankingByCountry(countrySlug: string, limit = 20): Promise<Place[]> {
  const counts = await getVoteCounts();
  const cities = getCities().filter((c) => c.parentSlug === countrySlug);
  return rank(cities, counts, limit);
}

/**
 * Los países completos, ordenados por votos. Alimenta los enlaces a
 * /ranking/{país} de la página /ranking: hay página generada para los 30, así
 * que enlazar solo el top 10 dejaba 20 huérfanas —en el sitemap y sin un solo
 * enlace entrante en todo el sitio—. La tabla numérica sigue usando
 * getRankingByKind("pais", 10); esto es solo para el enlazado.
 */
export async function getRankedCountries(): Promise<Place[]> {
  const counts = await getVoteCounts();
  return rank(getCountries(), counts, getCountries().length);
}

/** Puesto (1-based) de un país dentro del ranking global de países. */
export async function getCountryRankPosition(countrySlug: string): Promise<number> {
  const counts = await getVoteCounts();
  const ranked = rank(getCountries(), counts, getCountries().length);
  const idx = ranked.findIndex((p) => p.slug === countrySlug);
  return idx === -1 ? ranked.length : idx + 1;
}
