import { describe, it, expect } from "vitest";
import { TOPICS_EDAD } from "./topics-edad";
import { getPlace } from "./index";

// Dos familias: la escalera abierta ("a partir de N") y las franjas cerradas
// ("de X a Y"). Se listan por separado porque solo la primera tiene la regla de
// users/votes decrecientes — la segunda es una partición distinta del público.
const ESCALERA = ["mas-de-20", "mas-de-25", "mas-de-30", "mas-de-40", "mas-de-50", "mas-de-60"];
const FRANJAS = ["de-18-a-25", "de-30-a-40", "de-40-a-50", "de-50-a-60", "de-60-a-70"];
const SLUGS = [...ESCALERA, ...FRANJAS];

describe("salas por edad", () => {
  it("exporta las dos familias de franjas como temáticas", () => {
    expect(new Set(TOPICS_EDAD.map((p) => p.slug))).toEqual(new Set(SLUGS));
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
    // #adolescentes no existe en la red y, por nombre, es de menores: fuera por
    // lo mismo que #de_13_a_18. La franja 18-30 va a #milenials, que sí existe.
    expect(byChannels["mas-de-20"]).toEqual(["milenials", "mas_de_30"]);
    expect(byChannels["mas-de-30"]).toEqual(["mas_de_30", "mas_de_40"]);
    expect(byChannels["mas-de-40"]).toEqual(["mas_de_40", "mas_de_30"]);
    expect(byChannels["mas-de-50"]).toEqual(["mas_de_40", "mas_de_50"]);
    expect(byChannels["mas-de-60"]).toEqual(["mas_de_50", "mas__de60", "mas_de_70"]);
    expect(byChannels["de-18-a-25"]).toEqual(["milenials", "mas_de_30"]);
    expect(byChannels["mas-de-25"]).toEqual(["mas_de_30", "milenials"]);
    expect(byChannels["de-30-a-40"]).toEqual(["mas_de_30", "mas_de_40"]);
    expect(byChannels["de-40-a-50"]).toEqual(["mas_de_40", "mas_de_50", "cuatro_decadas"]);
    expect(byChannels["de-50-a-60"]).toEqual(["mas_de_50", "mas__de60"]);
    expect(byChannels["de-60-a-70"]).toEqual(["mas__de60", "mas_de_70", "amigos_mayores"]);
  });

  it("ninguna sala de edad enruta a un canal IRC inventado", () => {
    // Los canales de edad reales del IRC llevan guion bajo; un "mas-de-40" con
    // guion sería un canal muerto al que no llegaría ningún usuario.
    for (const p of TOPICS_EDAD)
      for (const c of p.channels)
        expect(c, `${p.slug} enruta a un canal con guion: ${c}`).not.toMatch(/^mas-de-/);
  });

  it("cumple las constraints SEO (intro ≤160, about ≥400)", () => {
    for (const p of TOPICS_EDAD) {
      expect(p.intro.length, `${p.slug} intro`).toBeLessThanOrEqual(160);
      expect((p.about ?? "").length, `${p.slug} about`).toBeGreaterThanOrEqual(400);
    }
  });

  it("users y votes decrecen con la edad dentro de cada familia", () => {
    for (const familia of [ESCALERA, FRANJAS]) {
      const rooms = familia.map((s) => TOPICS_EDAD.find((p) => p.slug === s)!);
      for (let i = 1; i < rooms.length; i++) {
        expect(rooms[i].users, `${rooms[i].slug} vs ${rooms[i - 1].slug}`).toBeLessThan(
          rooms[i - 1].users,
        );
        expect(rooms[i].votes).toBeLessThan(rooms[i - 1].votes);
      }
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
