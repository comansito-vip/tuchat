import { describe, it, expect } from "vitest";
import { TOPICS_INTERESES } from "./topics-intereses";
import { getPlace, getCountries, getCities, getTopics } from "./index";

const ALL = [...getCountries(), ...getCities(), ...getTopics()];

describe("salas temáticas de intereses", () => {
  it("todas kind tematica y resuelven por getPlace", () => {
    for (const p of TOPICS_INTERESES) {
      expect(p.kind).toBe("tematica");
      expect(getPlace(p.slug)?.slug).toBe(p.slug);
    }
  });

  it("slugs únicos globalmente", () => {
    const slugs = ALL.map((p) => p.slug);
    const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
    expect(dupes).toEqual([]);
  });

  it("intro ≤160 y about ≥400", () => {
    for (const p of TOPICS_INTERESES) {
      expect(p.intro.length, `${p.slug} intro=${p.intro.length}`).toBeLessThanOrEqual(160);
      expect((p.about ?? "").length, `${p.slug} about`).toBeGreaterThanOrEqual(400);
    }
  });

  it("intro y about únicos en todo el catálogo", () => {
    const intros = ALL.map((p) => p.intro);
    const abouts = ALL.map((p) => p.about).filter(Boolean);
    expect(intros.length - new Set(intros).size, "intros duplicados").toBe(0);
    expect(abouts.length - new Set(abouts).size, "abouts duplicados").toBe(0);
  });

  it("related existen en el catálogo", () => {
    for (const p of TOPICS_INTERESES)
      for (const r of p.related)
        expect(getPlace(r), `related roto: ${r} en ${p.slug}`).toBeDefined();
  });

  it("parentSlug, si existe, resuelve a un Place", () => {
    for (const p of TOPICS_INTERESES)
      if (p.parentSlug)
        expect(getPlace(p.parentSlug), `parent roto: ${p.parentSlug} en ${p.slug}`).toBeDefined();
  });

  it("votes > users", () => {
    for (const p of TOPICS_INTERESES)
      expect(p.votes, `${p.slug}`).toBeGreaterThan(p.users);
  });

  it("añade 209 salas de intereses", () => {
    expect(TOPICS_INTERESES).toHaveLength(209);
  });
});
