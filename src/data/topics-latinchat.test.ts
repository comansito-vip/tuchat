import { describe, it, expect } from "vitest";
import { TOPICS_LATINCHAT } from "./topics-latinchat";
import { getPlace, getCountries, getCities, getTopics, roomTitle } from "./index";
import { REAL_CHANNELS } from "./irc-real-channels";

const ALL = [...getCountries(), ...getCities(), ...getTopics()];

describe("salas de Latinchat", () => {
  it("son las 23 del listado del cliente y cuelgan todas del hub latinchat", () => {
    // 16 países + Madrid + Barcelona + Países + Manga y Anime + 3 franjas de edad.
    expect(TOPICS_LATINCHAT).toHaveLength(23);
    const hub = getPlace("latinchat");
    expect(hub?.name).toBe("Latinchat");
    for (const p of TOPICS_LATINCHAT) {
      expect(p.kind, p.slug).toBe("tematica");
      expect(p.parentSlug, p.slug).toBe("latinchat");
    }
  });

  it("entran primero al canal real de su país o franja, y después a #latinchat", () => {
    // El primer canal es donde aterriza el usuario: si no existe en la red, la
    // red lo crea vacío y la sala se ve muerta. #latinchat va detrás para que
    // además coincida con el resto de la comunidad del viejo portal.
    for (const p of TOPICS_LATINCHAT) {
      for (const c of p.channels) {
        expect(REAL_CHANNELS.has(c), `${p.slug}: #${c} no existe en la red`).toBe(true);
        expect(c, `${p.slug}: #${c}`).toBe(c.toLowerCase());
      }
      // La sala de anime es la excepción pactada: la sección entera va a #anime + #ocio.
      if (p.slug !== "latinchat-anime") expect(p.channels, p.slug).toContain("latinchat");
    }
  });

  it("usa los canales reales, no las variantes que parten a la gente en dos", () => {
    // El canal de los sesenta lleva doble guion bajo en la red (errata suya, pero
    // es donde está la gente); #mexico_vip sí existe y es propio, no una variante.
    expect(getPlace("latinchat-mas-de-60")!.channels[0]).toBe("mas__de60");
    expect(getPlace("latinchat-mexico")!.channels).toContain("mexico_vip");
    for (const p of TOPICS_LATINCHAT) {
      expect(p.channels, p.slug).not.toContain("mas_de_60");
      expect(p.channels, p.slug).not.toContain("españa-latinchat");
    }
  });

  it("cumple las constraints SEO y no repite texto ni título con ninguna otra sala", () => {
    for (const p of TOPICS_LATINCHAT) {
      expect(p.intro.length, `${p.slug} intro`).toBeLessThanOrEqual(160);
      expect((p.about ?? "").length, `${p.slug} about`).toBeGreaterThanOrEqual(400);
      expect(p.votes, p.slug).toBeGreaterThan(p.users);
    }
    const intros = ALL.map((p) => p.intro);
    const abouts = ALL.map((p) => p.about).filter(Boolean);
    const titles = ALL.map((p) => roomTitle(p));
    expect(intros.length - new Set(intros).size, "intros duplicados").toBe(0);
    expect(abouts.length - new Set(abouts).size, "abouts duplicados").toBe(0);
    expect(titles.length - new Set(titles).size, "títulos duplicados").toBe(0);
  });

  it("sin las plantillas de texto ya prohibidas en el proyecto", () => {
    for (const p of TOPICS_LATINCHAT) {
      const about = p.about ?? "";
      expect(about, p.slug).not.toMatch(/^Un espacio (para|donde)/);
      expect(about, p.slug).not.toMatch(/^La sala de .{1,30} es/);
      expect(about, p.slug).not.toMatch(/Conviven .+?, .+? y .+? que/);
      expect(about, p.slug).not.toMatch(/punto de encuentro/i);
    }
  });

  it("todos los slugs de related existen en el catálogo", () => {
    for (const p of TOPICS_LATINCHAT)
      for (const r of p.related)
        expect(getPlace(r), `related roto: ${r} en ${p.slug}`).toBeDefined();
  });
});
