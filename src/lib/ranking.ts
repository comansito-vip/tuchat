import { getCountries, getCities, getTopics, type Place } from "@/data";
import { getVoteCounts } from "@/lib/votes-store";

/** Ranking global fusionando votos base estáticos + incrementos persistidos. */
export async function getGlobalRanking(limit = 10): Promise<Place[]> {
  const counts = await getVoteCounts();
  const all = [...getCountries(), ...getCities(), ...getTopics()];
  const score = (p: Place) => p.votes + (counts[p.slug] ?? 0);
  return [...all].sort((a, b) => score(b) - score(a)).slice(0, limit);
}
