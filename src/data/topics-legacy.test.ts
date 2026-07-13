import { describe, it, expect } from "vitest";
import { TOPICS_LEGACY } from "./topics-legacy";
import { getPlace, getCountries, getCities, getTopics } from "./index";

const ALL = [...getCountries(), ...getCities(), ...getTopics()];

describe("salas de paridad con el viejo tuchat", () => {
  it("añade 78 salas temáticas nuevas (las 2 ciudades viven en cities.ts)", () => {
    // 77 de la paridad original + canalchat (canal real con 606 usuarios,
    // portal CanalChat.org sobre la red de ChatZona — adición deliberada 2026-07-13).
    expect(TOPICS_LEGACY).toHaveLength(78);
    expect(TOPICS_LEGACY.every((p) => p.kind === "tematica")).toBe(true);
  });

  it("todas resuelven por getPlace (integradas en ALL)", () => {
    for (const p of TOPICS_LEGACY) expect(getPlace(p.slug)?.slug).toBe(p.slug);
  });

  it("slugs únicos globalmente (sin colisión con datos existentes)", () => {
    const slugs = ALL.map((p) => p.slug);
    const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
    expect(dupes).toEqual([]);
  });

  it("cumple constraints SEO: intro ≤160, about ≥400", () => {
    for (const p of TOPICS_LEGACY) {
      expect(p.intro.length, `${p.slug} intro=${p.intro.length}`).toBeLessThanOrEqual(160);
      expect((p.about ?? "").length, `${p.slug} about`).toBeGreaterThanOrEqual(400);
    }
  });

  it("intro y about únicos entre todas las salas del catálogo", () => {
    const intros = ALL.map((p) => p.intro);
    const abouts = ALL.map((p) => p.about).filter(Boolean);
    expect(intros.length - new Set(intros).size, "intros duplicados").toBe(0);
    expect(abouts.length - new Set(abouts).size, "abouts duplicados").toBe(0);
  });

  it("todos los slugs de related existen en el catálogo", () => {
    for (const p of TOPICS_LEGACY)
      for (const r of p.related)
        expect(getPlace(r), `related roto: ${r} en ${p.slug}`).toBeDefined();
  });

  it("channels: 3 canales, el primero es el slug propio (salvo excepciones documentadas)", () => {
    // "badoo" es la única excepción: el cliente pidió explícitamente que ese
    // canal real (con tráfico propio) entre también a #amor/#amigos/#general,
    // no solo a su propio canal — adición deliberada, no una relajación general.
    const EXCEPCIONES = new Set(["badoo"]);
    for (const p of TOPICS_LEGACY) {
      if (EXCEPCIONES.has(p.slug)) continue;
      expect(p.channels.length, `${p.slug} channels`).toBe(3);
      expect(p.channels[0], `${p.slug} primer canal`).toBe(p.slug);
    }
  });

  it("votes > users en todas", () => {
    for (const p of TOPICS_LEGACY)
      expect(p.votes, `${p.slug}`).toBeGreaterThan(p.users);
  });

  it("las ciudades bariloche y chaco-corrientes existen y cuelgan de argentina", () => {
    for (const slug of ["bariloche", "chaco-corrientes"]) {
      const c = getPlace(slug);
      expect(c, slug).toBeDefined();
      expect(c!.kind).toBe("ciudad");
      expect(c!.parentSlug).toBe("argentina");
    }
  });
});
