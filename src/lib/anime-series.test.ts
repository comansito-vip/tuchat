import { describe, it, expect } from "vitest";
import { ANIME_SERIES } from "@/lib/anime-series";

describe("ANIME_SERIES", () => {
  it("has at least 8 series", () => {
    expect(ANIME_SERIES.length).toBeGreaterThanOrEqual(8);
  });

  it("each series has name, japanese title, emoji, blurb, and gradient colors", () => {
    for (const s of ANIME_SERIES) {
      expect(s.name).toBeTruthy();
      expect(s.jp).toBeTruthy();
      expect(s.emoji).toBeTruthy();
      expect(s.blurb.length).toBeGreaterThan(20);
      expect(s.c1).toMatch(/^#[0-9a-f]{6}$/i);
      expect(s.c2).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});
