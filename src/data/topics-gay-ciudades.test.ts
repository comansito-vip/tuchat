import { describe, it, expect } from "vitest";
import { TOPICS_GAY_CIUDADES } from "./topics-gay-ciudades";
import { REAL_CHANNELS } from "./irc-real-channels";
import { channelKey } from "./irc-canal";
import { getPlace } from "@/data";

describe("salas de ambiente por ciudad", () => {
  it("son las 12 que la demanda medida sostiene", () => {
    expect(TOPICS_GAY_CIUDADES.map((r) => r.slug).sort()).toEqual([
      "gay-asturias", "gay-cadiz", "gay-cali", "gay-lima", "gay-malaga",
      "gay-medellin", "gay-monterrey", "gay-murcia", "gay-puebla",
      "gay-rosario", "gay-tenerife", "gay-vigo",
    ]);
  });

  it("entran al canal real de su ciudad, nunca a un #gay{ciudad} inventado", () => {
    // La red no tiene ningún canal LGTBI por ciudad: son diez y ninguno lo es.
    // El patrón correcto es #gay + el canal geográfico, como gay-madrid.
    const reales = new Set([...REAL_CHANNELS].map(channelKey));
    for (const r of TOPICS_GAY_CIUDADES) {
      const fuera = r.channels.filter((c) => !reales.has(channelKey(c)));
      expect(fuera, r.slug).toEqual([]);
      expect(r.channels[0], r.slug).toBe("gay");
      // el segundo es siempre el canal de la ciudad, que da el vínculo local
      const ciudad = r.slug.replace(/^gay-/, "");
      expect(r.channels[1], r.slug).toBe(ciudad);
    }
  });

  it("cuelgan del hub que les corresponde", () => {
    for (const r of TOPICS_GAY_CIUDADES) {
      expect(["lgtbi", "gaylatino"], r.slug).toContain(r.parentSlug);
      expect(getPlace(r.parentSlug!), r.slug).toBeDefined();
    }
  });

  it("la sala de la ciudad existe y está enlazada", () => {
    for (const r of TOPICS_GAY_CIUDADES) {
      const ciudad = r.slug.replace(/^gay-/, "");
      expect(getPlace(ciudad), `sala de ${ciudad}`).toBeDefined();
      expect(r.related, r.slug).toContain(ciudad);
    }
  });

  it("el copy cumple los límites de la SERP y lleva H2 propio", () => {
    for (const r of TOPICS_GAY_CIUDADES) {
      expect(r.intro.length, `intro ${r.slug}`).toBeLessThanOrEqual(160);
      expect(r.about!.length, `about ${r.slug}`).toBeGreaterThanOrEqual(400);
      expect(r.aboutTitle!.length, `aboutTitle ${r.slug}`).toBeGreaterThanOrEqual(25);
      expect(r.aboutTitle!.length, `aboutTitle ${r.slug}`).toBeLessThanOrEqual(70);
    }
  });

  it("ningún about es plantilla: no comparten frases largas entre sí", () => {
    const frases = (t: string) =>
      t.split(/[.;]/).map((f) => f.trim()).filter((f) => f.length >= 40);
    const vistas = new Map<string, string>();
    const repes: string[] = [];
    for (const r of TOPICS_GAY_CIUDADES) {
      for (const f of frases(r.about!)) {
        if (vistas.has(f)) repes.push(`${vistas.get(f)} / ${r.slug}: "${f}"`);
        else vistas.set(f, r.slug);
      }
    }
    expect(repes).toEqual([]);
  });
});
