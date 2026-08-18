import { describe, it, expect } from "vitest";
import { TOPICS_REGIONES_AM } from "./topics-regiones-am";
import { REAL_CHANNELS } from "./irc-real-channels";
import { channelKey } from "./irc-canal";

describe("salas de región americana", () => {
  it("son las 11 que la demanda medida sostiene", () => {
    expect(TOPICS_REGIONES_AM.map((r) => r.slug).sort()).toEqual([
      "carabobo", "chiapas", "coahuila", "jalisco", "morelos", "nuevo-leon",
      "sinaloa", "sonora", "tabasco", "yucatan", "zulia",
    ]);
  });

  it("todos sus canales existen de verdad en la red", () => {
    const reales = new Set([...REAL_CHANNELS].map(channelKey));
    const fuera = TOPICS_REGIONES_AM.flatMap((r) =>
      r.channels.filter((c) => !reales.has(channelKey(c))).map((c) => `${r.slug}: ${c}`)
    );
    expect(fuera).toEqual([]);
  });

  it("cada sala cuelga de un país real y es temática", () => {
    for (const r of TOPICS_REGIONES_AM) {
      expect(r.kind, r.slug).toBe("tematica");
      expect(["mexico", "venezuela"], r.slug).toContain(r.parentSlug);
    }
  });

  it("el copy cumple los límites de la SERP", () => {
    for (const r of TOPICS_REGIONES_AM) {
      expect(r.intro.length, `intro ${r.slug}`).toBeLessThanOrEqual(160);
      expect(r.about!.length, `about ${r.slug}`).toBeGreaterThanOrEqual(400);
    }
  });

  it("ningún about es plantilla: no comparten frases largas entre sí", () => {
    // Dos salas que comparten una frase de 40+ caracteres es la firma del copy
    // generado con hueco para el nombre.
    const frases = (t: string) =>
      t.split(/[.;]/).map((f) => f.trim()).filter((f) => f.length >= 40);
    const vistas = new Map<string, string>();
    const repes: string[] = [];
    for (const r of TOPICS_REGIONES_AM) {
      for (const f of frases(r.about!)) {
        if (vistas.has(f)) repes.push(`${vistas.get(f)} / ${r.slug}: "${f}"`);
        else vistas.set(f, r.slug);
      }
    }
    expect(repes).toEqual([]);
  });
});
