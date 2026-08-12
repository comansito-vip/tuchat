import { describe, it, expect } from "vitest";
import { TOPICS_APODOS } from "./topics-apodos";
import { REAL_CHANNELS } from "./irc-real-channels";
import { channelKey } from "./irc-canal";
import { getPlace } from "@/data";

/**
 * La sala del apodo existe para captar «chat bcn» y «chat mty», así que lo que
 * hay que proteger es justo eso: que el apodo esté escrito en la página. Y que
 * no se convierta en un duplicado de la sala real, que sería lo cómodo y lo que
 * Google penaliza.
 */
const SALA_REAL: Record<string, string> = {
  bcn: "barcelona",
  mty: "monterrey",
  cdmx: "ciudad-de-mexico",
  cba: "cordoba-argentina",
};

describe("salas por apodo de ciudad", () => {
  it("son cuatro y su slug es el apodo", () => {
    expect(TOPICS_APODOS).toHaveLength(4);
    expect(TOPICS_APODOS.map((r) => r.slug).sort()).toEqual(["bcn", "cba", "cdmx", "mty"]);
  });

  it("el apodo aparece en el nombre y en el texto, que es para lo que existen", () => {
    for (const r of TOPICS_APODOS) {
      const apodo = r.slug.toUpperCase();
      expect(r.name, r.slug).toContain(apodo);
      const texto = `${r.intro} ${r.about} ${r.aboutTitle}`;
      expect(new RegExp(`\\b${apodo}\\b`).test(texto), `${r.slug}: el apodo no está en el texto`).toBe(true);
    }
  });

  it("enlazan a la sala de siempre, que sigue siendo la principal", () => {
    for (const r of TOPICS_APODOS) {
      const real = SALA_REAL[r.slug];
      expect(getPlace(real), `sala real ${real}`).toBeDefined();
      expect(r.related, r.slug).toContain(real);
    }
  });

  it("no repiten el texto de la sala real: no son un duplicado", () => {
    for (const r of TOPICS_APODOS) {
      const real = getPlace(SALA_REAL[r.slug])!;
      expect(r.about, r.slug).not.toBe(real.about);
      expect(r.intro, r.slug).not.toBe(real.intro);
      // Ninguna frase larga en común, que es como se cuela un duplicado.
      const frases = (t: string) =>
        t.split(/[.;]/).map((f) => f.trim()).filter((f) => f.length >= 40);
      const suyas = new Set(frases(real.about ?? ""));
      const repes = frases(r.about!).filter((f) => suyas.has(f));
      expect(repes, r.slug).toEqual([]);
    }
  });

  it("usan canales reales, nunca un #bcn inventado", () => {
    const reales = new Set([...REAL_CHANNELS].map(channelKey));
    for (const r of TOPICS_APODOS) {
      const fuera = r.channels.filter((c) => !reales.has(channelKey(c)));
      expect(fuera, r.slug).toEqual([]);
      // el primero es el canal geográfico de verdad, no el apodo
      expect(r.channels[0], r.slug).not.toBe(r.slug);
    }
  });

  it("el copy cumple los límites de la SERP", () => {
    for (const r of TOPICS_APODOS) {
      expect(r.intro.length, `intro ${r.slug}`).toBeLessThanOrEqual(160);
      expect(r.about!.length, `about ${r.slug}`).toBeGreaterThanOrEqual(400);
      expect(r.aboutTitle!.length, `aboutTitle ${r.slug}`).toBeGreaterThanOrEqual(25);
      expect(r.aboutTitle!.length, `aboutTitle ${r.slug}`).toBeLessThanOrEqual(70);
    }
  });
});
