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

  it("each team has a name, badge URL and a slug", () => {
    for (const league of getLeagues()) {
      for (const team of league.teams) {
        expect(team.name).toBeTruthy();
        expect(team.badge).toMatch(/^https:\/\//);
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
