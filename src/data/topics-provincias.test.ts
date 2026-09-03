import { describe, it, expect } from "vitest";
import { TOPICS_PROVINCIAS } from "./topics-provincias";
import { getPlace, getCountries, getCities, getTopics } from "./index";

const ALL = [...getCountries(), ...getCities(), ...getTopics()];

describe("salas por provincia española", () => {
  it("todas kind tematica y resuelven por getPlace", () => {
    for (const p of TOPICS_PROVINCIAS) {
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
    for (const p of TOPICS_PROVINCIAS) {
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
    for (const p of TOPICS_PROVINCIAS)
      for (const r of p.related)
        expect(getPlace(r), `related roto: ${r} en ${p.slug}`).toBeDefined();
  });

  it("parentSlug resuelve a la comunidad autónoma correspondiente", () => {
    for (const p of TOPICS_PROVINCIAS)
      if (p.parentSlug)
        expect(getPlace(p.parentSlug), `parent roto: ${p.parentSlug} en ${p.slug}`).toBeDefined();
  });

  it("votes > users", () => {
    for (const p of TOPICS_PROVINCIAS)
      expect(p.votes, `${p.slug}`).toBeGreaterThan(p.users);
  });

  it("43 de las 52 provincias: las 9 uniprovinciales no duplican su comunidad", () => {
    expect(TOPICS_PROVINCIAS).toHaveLength(43);
  });

  it("ningún canal se pierde en el saneado (todos son reales)", () => {
    for (const p of TOPICS_PROVINCIAS) {
      const enCatalogo = getPlace(p.slug);
      expect(enCatalogo?.channels.length, `${p.slug} perdió canales en el saneado`).toBe(p.channels.length);
    }
  });
});
