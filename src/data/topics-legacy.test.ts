import { describe, it, expect } from "vitest";
import { TOPICS_LEGACY } from "./topics-legacy";
import { getPlace, getCountries, getCities, getTopics } from "./index";
import { REAL_CHANNELS } from "./irc-real-channels";

const ALL = [...getCountries(), ...getCities(), ...getTopics()];

describe("salas de paridad con el viejo tuchat", () => {
  it("añade 107 salas temáticas nuevas (las 2 ciudades viven en cities.ts)", () => {
    // 77 de la paridad original + canalchat (canal real con 606 usuarios,
    // portal CanalChat.org sobre la red de ChatZona — adición deliberada 2026-07-13)
    // + 15 salas gay/LGTBI (ciudades España, países LATAM, perfiles/intereses)
    // para completar la reorg. al estilo chatzona.com/chueca — 2026-07-13 noche.
    // + 14 portales y redes de chat clásicos bajo el hub Argentina — 2026-07-14.
    // (Latinchat Argentina se mudó a topics-latinchat.ts con sus 22 hermanas.)
    expect(TOPICS_LEGACY).toHaveLength(107);
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

  it("channels: entra primero a un canal real y el suyo va detrás", () => {
    // Antes el primer canal era el slug de la sala (#colegas, #gays, #laguna2000).
    // Ninguno existe en la red: entrar el primero los creaba vacíos y el usuario
    // se quedaba solo. Ahora la sala pasa antes por el canal real de su vertical
    // (#amigos, #gay, #ocio…) y el suyo queda al final, para que se vaya llenando.
    for (const p of TOPICS_LEGACY) {
      expect(REAL_CHANNELS.has(p.channels[0]), `${p.slug} primer canal: #${p.channels[0]}`).toBe(true);
      expect(p.channels, `${p.slug}`).toContain("chatzona");
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
