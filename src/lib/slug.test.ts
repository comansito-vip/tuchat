import { describe, it, expect } from "vitest";
import { slugify, cap, normalize } from "@/lib/slug";

describe("slugify", () => {
  it("lowercases and removes accents", () => {
    expect(slugify("España")).toBe("espana");
    expect(slugify("Málaga")).toBe("malaga");
    expect(slugify("Bogotá")).toBe("bogota");
  });

  it("replaces spaces with hyphens", () => {
    expect(slugify("Buenos Aires")).toBe("buenos-aires");
    expect(slugify("Las Palmas de Gran Canaria")).toBe("las-palmas-de-gran-canaria");
  });

  it("handles multi-accent strings", () => {
    expect(slugify("São Paulo")).toBe("sao-paulo");
    expect(slugify("Zürich")).toBe("zurich");
  });
});

describe("cap", () => {
  it("capitalizes the first letter", () => {
    expect(cap("amor")).toBe("Amor");
    expect(cap("espana")).toBe("Espana");
  });

  it("replaces hyphens with spaces", () => {
    expect(cap("buenos-aires")).toBe("Buenos aires");
    expect(cap("las-palmas-de-gran-canaria")).toBe("Las palmas de gran canaria");
  });
});

describe("normalize", () => {
  it("strips accents and lowercases without touching spaces", () => {
    expect(normalize("España")).toBe("espana");
    expect(normalize("Córdoba")).toBe("cordoba");
    expect(normalize("México")).toBe("mexico");
    expect(normalize("Buenos Aires")).toBe("buenos aires");
  });
  it("allows accent-insensitive search matching", () => {
    expect(normalize("España").includes(normalize("espana"))).toBe(true);
    expect(normalize("Ñoño").includes(normalize("nono"))).toBe(true);
  });
});

describe("slugify round-trips", () => {
  it("slugify of already-slug is idempotent", () => {
    expect(slugify("buenos-aires")).toBe("buenos-aires");
    expect(slugify("espana")).toBe("espana");
  });
  it("slugify handles mixed case and accent", () => {
    expect(slugify("Córdoba")).toBe("cordoba");
    expect(slugify("SEVILLA")).toBe("sevilla");
  });
});
