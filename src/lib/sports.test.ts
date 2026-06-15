import { describe, it, expect } from "vitest";
import { LEAGUES, getLeague } from "@/lib/sports";

describe("sports data", () => {
  it("has exactly 8 leagues with unique slugs", () => {
    expect(LEAGUES).toHaveLength(8);
    const slugs = LEAGUES.map((l) => l.slug);
    expect(new Set(slugs).size).toBe(8);
  });

  it("all leagues have a name, fallback rows and a theSportsDB id", () => {
    const violations = LEAGUES.filter(
      (l) => !l.name || !l.theSportsDB || l.fallback.length === 0
    ).map((l) => l.slug);
    expect(violations).toEqual([]);
  });

  it("all fallback rows have rank, team and points", () => {
    const violations = LEAGUES.flatMap((l) =>
      l.fallback
        .filter((r) => !r.team || r.rank <= 0 || r.points < 0)
        .map((r) => `${l.slug}: rank=${r.rank}, team="${r.team}", pts=${r.points}`)
    );
    expect(violations).toEqual([]);
  });

  it("getLeague returns the correct league for known slugs", () => {
    expect(getLeague("laliga")?.name).toBe("LaLiga");
    expect(getLeague("premier")?.name).toBe("Premier League");
    expect(getLeague("ligamx")?.name).toBe("Liga MX");
  });

  it("getLeague returns undefined for unknown slug", () => {
    expect(getLeague("xyz")).toBeUndefined();
    expect(getLeague("")).toBeUndefined();
  });

  it("laliga fallback top 2 are Real Madrid and FC Barcelona", () => {
    const laliga = getLeague("laliga")!;
    expect(laliga.fallback[0].team).toBe("Real Madrid");
    expect(laliga.fallback[1].team).toBe("FC Barcelona");
  });
});
