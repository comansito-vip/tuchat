import { describe, it, expect } from "vitest";
import { TOPICS_EDAD } from "./topics-edad";
import { getPlace } from "./index";

const SLUGS = ["mas-de-20", "mas-de-30", "mas-de-40", "mas-de-50", "mas-de-60"];

describe("salas por edad", () => {
  it("exporta exactamente las 5 franjas como temáticas", () => {
    expect(TOPICS_EDAD.map((p) => p.slug)).toEqual(SLUGS);
    expect(TOPICS_EDAD.every((p) => p.kind === "tematica")).toBe(true);
  });

  it("cada sala resuelve por getPlace (integrada en ALL)", () => {
    for (const s of SLUGS) expect(getPlace(s)?.slug).toBe(s);
  });

  it("about único y de longitud razonable (40-90 palabras)", () => {
    const abouts = TOPICS_EDAD.map((p) => p.about ?? "");
    expect(new Set(abouts).size).toBe(SLUGS.length);
    for (const a of abouts) {
      const words = a.trim().split(/\s+/).length;
      expect(words).toBeGreaterThanOrEqual(40);
      expect(words).toBeLessThanOrEqual(95);
    }
  });

  it("intro único por sala", () => {
    const intros = TOPICS_EDAD.map((p) => p.intro);
    expect(new Set(intros).size).toBe(SLUGS.length);
  });

  it("todos los slugs de related existen en el catálogo", () => {
    for (const p of TOPICS_EDAD)
      for (const r of p.related)
        expect(getPlace(r), `related roto: ${r} en ${p.slug}`).toBeDefined();
  });

  it("mapeo de canales IRC correcto", () => {
    const byChannels = Object.fromEntries(
      TOPICS_EDAD.map((p) => [p.slug, p.channels])
    );
    expect(byChannels["mas-de-20"]).toEqual(["adolescentes", "mas_de_30"]);
    expect(byChannels["mas-de-30"]).toEqual(["mas_de_30", "mas_de_40"]);
    expect(byChannels["mas-de-40"]).toEqual(["mas_de_40", "mas_de_30"]);
    expect(byChannels["mas-de-50"]).toEqual(["mas_de_40", "mas_de_50"]);
    expect(byChannels["mas-de-60"]).toEqual(["mas_de_50", "mas_de_60"]);
  });

  it("cumple las constraints SEO (intro ≤160, about ≥400)", () => {
    for (const p of TOPICS_EDAD) {
      expect(p.intro.length, `${p.slug} intro`).toBeLessThanOrEqual(160);
      expect((p.about ?? "").length, `${p.slug} about`).toBeGreaterThanOrEqual(400);
    }
  });

  it("users y votes decrecen con la edad", () => {
    const users = TOPICS_EDAD.map((p) => p.users);
    const votes = TOPICS_EDAD.map((p) => p.votes);
    for (let i = 1; i < users.length; i++) {
      expect(users[i]).toBeLessThan(users[i - 1]);
      expect(votes[i]).toBeLessThan(votes[i - 1]);
    }
  });

  it("amistad y amor enlazan al menos una sala de edad", () => {
    const ageSlugs = new Set(SLUGS);
    for (const social of ["amistad", "amor"]) {
      const place = getPlace(social);
      expect(place).toBeDefined();
      const hasAge = place!.related.some((r) => ageSlugs.has(r));
      expect(hasAge, `${social} debe enlazar una sala de edad`).toBe(true);
    }
  });
});
