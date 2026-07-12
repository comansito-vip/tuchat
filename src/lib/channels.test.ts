import { describe, it, expect } from "vitest";
import { resolveChannels, channelString } from "@/lib/channels";
import { getCities } from "@/data";

describe("resolveChannels", () => {
  it("uses the place's defined channels for Madrid", () => {
    // El canal real del IRC lleva tilde (#españa, no #espana) aunque el slug/URL no la lleve.
    expect(resolveChannels("madrid")).toEqual(["madrid", "españa", "amistad", "chatzona"]);
  });
  it("uses México's channels", () => {
    expect(resolveChannels("mexico")).toEqual(["mexico", "amistad", "chatzona"]);
  });
  it("no mete a los países hispanohablantes en #internacional", () => {
    for (const slug of ["espana", "mexico", "argentina", "colombia", "cuba", "guinea-ecuatorial"]) {
      expect(resolveChannels(slug)).not.toContain("internacional");
    }
  });
  it("mantiene #internacional en los países no hispanohablantes", () => {
    expect(resolveChannels("francia")).toContain("internacional");
  });
  it("todas las salas de Estados Unidos entran al canal real #usa", () => {
    for (const slug of ["estados-unidos", "miami", "nueva-york", "los-angeles", "houston"]) {
      expect(resolveChannels(slug)).toContain("usa");
    }
    // Miami además tiene su propio canal real.
    expect(resolveChannels("miami")).toContain("miami");
  });
  it("horóscopo y astrología entran a #tarot/#esoterismo, no a #horoscopo (no existe)", () => {
    for (const slug of ["horoscopo", "astrologia"]) {
      const ch = resolveChannels(slug);
      expect(ch, slug).not.toContain("horoscopo");
      expect(ch, slug).toContain("tarot");
      expect(ch, slug).toContain("esoterismo");
    }
  });
  it("el canal real de España lleva tilde en TODAS las salas españolas", () => {
    // Bug real 2026-07-13: el slug ("espana", para la URL) se había colado tal
    // cual dentro del array de channels también, así que el iframe pedía
    // #espana en vez de #españa (el canal real del IRC) — casi 900 salas
    // españolas conectaban al canal equivocado. Recorre las 893 ciudades
    // reales vía getCities(), no una lista fija, para que no vuelva a colarse.
    const esp = getCities().filter((c) => c.parentSlug === "espana");
    expect(esp.length).toBeGreaterThan(800);
    for (const c of esp) {
      expect(c.channels, c.slug).toContain("españa");
      expect(c.channels, c.slug).not.toContain("espana");
    }
  });
  it("A Coruña entra al canal real #coruña, no #a-coruna ni #coruna", () => {
    expect(resolveChannels("a-coruna")).toContain("coruña");
  });
  it("falls back for an unknown slug to itself + amistad + chatzona", () => {
    expect(resolveChannels("xyz")).toEqual(["xyz", "amistad", "chatzona"]);
  });
  it("formats as #-prefixed comma list", () => {
    expect(channelString(["madrid", "espana"])).toBe("#madrid,#espana");
  });
  it("uses first channel as room channel", () => {
    const ch = resolveChannels("madrid");
    expect(ch[0]).toBe("madrid");
  });
  it("fallback always adds amistad and chatzona at the end", () => {
    const ch = resolveChannels("unknown-slug-xyz");
    expect(ch).toContain("amistad");
    expect(ch).toContain("chatzona");
    expect(ch[ch.length - 1]).toBe("chatzona");
  });
});
