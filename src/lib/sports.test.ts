import { describe, it, expect, vi } from "vitest";
import { LEAGUES, TEAM_LEAGUE, getLeague, getStandings } from "@/lib/sports";

describe("sports data", () => {
  it("has exactly 10 leagues with unique slugs", () => {
    expect(LEAGUES).toHaveLength(10);
    const slugs = LEAGUES.map((l) => l.slug);
    expect(new Set(slugs).size).toBe(10);
  });

  // Lo que importa es que toda liga sepa resolver su clasificación: nombre,
  // tabla de reserva y al menos un proveedor. NO se exige theSportsDB: la liga
  // saudí se quedó sin id a propósito (el que había, 4955, era la Linafoot de RD
  // Congo y servía equipos congoleños bajo el titular "Saudi Pro League"), y
  // volver a exigirlo empujaría a inventarse otro id sin verificar.
  it("all leagues have a name, fallback rows and at least one provider id", () => {
    const violations = LEAGUES.filter(
      (l) =>
        !l.name ||
        l.fallback.length === 0 ||
        !(l.theSportsDB || l.apiFootball || l.footballData),
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

  it("all TEAM_LEAGUE values reference a valid league slug", () => {
    const leagueSlugs = new Set(LEAGUES.map((l) => l.slug));
    const violations = Object.entries(TEAM_LEAGUE)
      .filter(([, liga]) => !leagueSlugs.has(liga))
      .map(([team, liga]) => `${team} -> ${liga}`);
    expect(violations).toEqual([]);
  });
});

describe("getStandings", () => {
  it("throws for an unknown liga", async () => {
    await expect(getStandings("unknown-liga")).rejects.toThrow("liga desconocida");
  });

  it("falls back to static data when all providers fail", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network error"));
    const result = await getStandings("laliga");
    expect(result.source).toBe("reserva");
    expect(result.rows.length).toBeGreaterThan(0);
    expect(result.rows[0].team).toBe("Real Madrid");
  });
});
