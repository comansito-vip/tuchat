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
