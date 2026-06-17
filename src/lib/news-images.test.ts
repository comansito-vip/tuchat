import { describe, it, expect } from "vitest";
import { getNewsImage } from "@/lib/news-images";

describe("getNewsImage", () => {
  it("returns a non-empty string for known categories", () => {
    const categories = [
      "Actualidad", "Deportes", "Tecnología", "IA",
      "Cultura", "Viajes", "Salud", "Economía", "Entretenimiento",
    ];
    for (const cat of categories) {
      const url = getNewsImage(cat, "test-slug");
      expect(url).toMatch(/^https:\/\/images\.unsplash\.com\//);
    }
  });

  it("returns fallback image for unknown category", () => {
    const url = getNewsImage("XYZ", "some-slug");
    expect(url).toMatch(/^https:\/\/images\.unsplash\.com\//);
  });

  it("is deterministic — same slug always returns same URL", () => {
    const a = getNewsImage("Deportes", "real-madrid-champions-2026");
    const b = getNewsImage("Deportes", "real-madrid-champions-2026");
    expect(a).toBe(b);
  });

  it("same category but different slugs may return different images", () => {
    const a = getNewsImage("Deportes", "futbol-slug-1");
    const b = getNewsImage("Deportes", "futbol-slug-2");
    // No assertion on equality — just that both are valid URLs.
    expect(a).toMatch(/^https:\/\/images\.unsplash\.com\//);
    expect(b).toMatch(/^https:\/\/images\.unsplash\.com\//);
  });
});
