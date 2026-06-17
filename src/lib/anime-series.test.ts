import { describe, it, expect } from "vitest";
import { ANIME_SERIES } from "@/lib/anime-series";

describe("ANIME_SERIES", () => {
  it("has at least 8 series", () => {
    expect(ANIME_SERIES.length).toBeGreaterThanOrEqual(8);
  });

  it("each series has name, emoji, blurb, and thumbnail", () => {
    for (const s of ANIME_SERIES) {
      expect(s.name).toBeTruthy();
      expect(s.emoji).toBeTruthy();
      expect(s.blurb.length).toBeGreaterThan(20);
      expect(s.thumbnail).toMatch(/^https:\/\//);
    }
  });
});
