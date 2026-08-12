import { describe, it, expect } from "vitest";
import { TOPICS_TERMINOS } from "./topics-terminos";
import { REAL_CHANNELS } from "./irc-real-channels";
import { channelKey } from "./irc-canal";
import { getPlace } from "@/data";

describe("salas por término de búsqueda", () => {
  it("los related y el padre existen", () => {
    for (const r of TOPICS_TERMINOS) {
      const rotos = r.related.filter((rel) => !getPlace(rel));
      expect(rotos, r.slug).toEqual([]);
      expect(getPlace(r.parentSlug!), r.slug).toBeDefined();
    }
  });

  it("usan canales reales", () => {
    const reales = new Set([...REAL_CHANNELS].map(channelKey));
    for (const r of TOPICS_TERMINOS) {
      expect(r.channels.filter((c) => !reales.has(channelKey(c))), r.slug).toEqual([]);
    }
  });

  /**
   * El contrato de la página de Omegle. Quien busca «omegle» hoy suele no saber
   * que cerró en noviembre de 2023 tras las denuncias por abusos, así que
   * decírselo es lo único útil que se le puede dar. Aprovechar ese tráfico
   * ofreciéndose como «el nuevo Omegle» —callando el cierre y el motivo— es la
   * versión de esta página que no se publica.
   */
  it("la de Omegle dice que cerró, y lo dice pronto", () => {
    const omegle = TOPICS_TERMINOS.find((r) => r.slug === "omegle")!;
    expect(omegle.intro.toLowerCase()).toMatch(/cerr[oó]/);
    expect(omegle.intro).toContain("2023");
    expect(omegle.about!.toLowerCase()).toMatch(/abus/);
    // el aviso va en la primera frase del about, no enterrado al final
    const primera = omegle.about!.split(".")[0].toLowerCase();
    expect(primera).toMatch(/omegle/);
  });

  it("no prometen vídeo con desconocidos, que es lo que no se ofrece", () => {
    for (const r of TOPICS_TERMINOS) {
      const t = `${r.intro} ${r.about}`.toLowerCase();
      expect(/videochat con desconocidos|ruleta de v[ií]deo gratis|c[aá]mara al azar/.test(t), r.slug).toBe(false);
    }
  });

  it("el copy cumple los límites de la SERP", () => {
    for (const r of TOPICS_TERMINOS) {
      expect(r.intro.length, `intro ${r.slug}`).toBeLessThanOrEqual(160);
      expect(r.about!.length, `about ${r.slug}`).toBeGreaterThanOrEqual(400);
      expect(r.aboutTitle!.length, `aboutTitle ${r.slug}`).toBeGreaterThanOrEqual(25);
      expect(r.aboutTitle!.length, `aboutTitle ${r.slug}`).toBeLessThanOrEqual(70);
    }
  });
});
