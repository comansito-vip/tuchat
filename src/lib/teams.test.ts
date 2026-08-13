import { describe, it, expect } from "vitest";
import { getLeagues } from "@/lib/teams";

describe("teams data", () => {
  it("returns 6 leagues", () => {
    expect(getLeagues()).toHaveLength(6);
  });

  it("each league has a non-empty slug, name, and 5 teams", () => {
    for (const league of getLeagues()) {
      expect(league.slug).toBeTruthy();
      expect(league.name).toBeTruthy();
      expect(league.teams).toHaveLength(5);
    }
  });

  it("cada equipo tiene nombre, escudo propio y slug", () => {
    for (const league of getLeagues()) {
      for (const team of league.teams) {
        expect(team.name).toBeTruthy();
        // El escudo se sirve desde tuchat.org. Cuando era un enlace a
        // upload.wikimedia.org, doce de los treinta daban 404 y este test lo
        // daba por bueno igual: comprobaba la forma de la URL, no la imagen.
        expect(team.badge, team.name).toMatch(/^\/img\/escudos\/[a-z0-9-]+\.(svg|png)$/);
        expect(typeof team.slug).toBe("string");
      }
    }
  });

  it("includes LaLiga with Real Madrid as first team", () => {
    const laliga = getLeagues().find((l) => l.slug === "laliga");
    expect(laliga).toBeDefined();
    expect(laliga!.teams[0].name).toBe("Real Madrid");
  });
});
