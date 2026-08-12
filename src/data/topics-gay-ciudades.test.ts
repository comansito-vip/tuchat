import { describe, it, expect } from "vitest";
import { TOPICS_GAY_CIUDADES } from "./topics-gay-ciudades";
import { REAL_CHANNELS } from "./irc-real-channels";
import { channelKey } from "./irc-canal";
import { getPlace } from "@/data";

/**
 * La regla general es que el slug manda: `gay-{x}` entra al canal `#{x}` y
 * enlaza a la sala `{x}`. Vale para 42 de las 46, y las otras cuatro no son un
 * descuido sino sitios donde la red escribe otra cosa, así que se declaran una
 * a una en vez de relajar la comprobación —que es justo la que en agosto de
 * 2026 destapó que 306 salas publicaban canales inventados—.
 */
const EXCEPCIONES: Record<string, { canal: string; sala: string | null }> = {
  // El canal lleva eñe y la sala del catálogo es `a-coruna`.
  "gay-coruna": { canal: "coruña", sala: "a-coruna" },
  // No hay #manizales ni #bucaramanga en la red: entran por el canal del país.
  "gay-manizales": { canal: "colombia", sala: "manizales" },
  "gay-bucaramanga": { canal: "colombia", sala: "bucaramanga" },
  // #la_rioja va con guion bajo, y La Rioja no tiene sala propia en el catálogo.
  "gay-la-rioja": { canal: "la_rioja", sala: null },
};

describe("salas de ambiente por ciudad", () => {
  it("son 46, todas con demanda medida y slug libre", () => {
    expect(TOPICS_GAY_CIUDADES).toHaveLength(46);
    const slugs = TOPICS_GAY_CIUDADES.map((r) => r.slug);
    expect(new Set(slugs).size, "sin duplicados").toBe(slugs.length);
    for (const s of slugs) expect(s, s).toMatch(/^gay-[a-z-]+$/);
  });

  it("los related apuntan a salas que existen de verdad", () => {
    // gay-granada no existe: la sala se llama gaygranada, sin guion. Y la de
    // Zulia es `zulia` a secas, que es una sala de estado.
    const rotos = TOPICS_GAY_CIUDADES.flatMap((r) =>
      r.related.filter((rel) => !getPlace(rel)).map((rel) => `${r.slug} -> ${rel}`),
    );
    expect(rotos).toEqual([]);
  });

  it("entran al canal real de su ciudad, nunca a un #gay{ciudad} inventado", () => {
    // La red no tiene ningún canal LGTBI por ciudad: son diez y ninguno lo es.
    // El patrón correcto es #gay + el canal geográfico, como gay-madrid.
    const reales = new Set([...REAL_CHANNELS].map(channelKey));
    for (const r of TOPICS_GAY_CIUDADES) {
      const fuera = r.channels.filter((c) => !reales.has(channelKey(c)));
      expect(fuera, r.slug).toEqual([]);
      expect(r.channels[0], r.slug).toBe("gay");
      // el segundo es siempre el canal de la ciudad, que da el vínculo local.
      // Se compara con canon() porque la red no siempre escribe el canal igual
      // que nuestro slug: Las Palmas es #las_palmas, con guion bajo.
      const ciudad = r.slug.replace(/^gay-/, "");
      const esperado = EXCEPCIONES[r.slug]?.canal ?? ciudad;
      expect(channelKey(r.channels[1]), r.slug).toBe(channelKey(esperado));
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
      const declarada = r.slug in EXCEPCIONES ? EXCEPCIONES[r.slug].sala : r.slug.replace(/^gay-/, "");
      // La Rioja es la única sin sala propia en el catálogo; se comprueba aparte
      // que al menos tenga anclaje geográfico, para que no quede colgando.
      if (declarada === null) {
        expect(r.related.some((rel) => getPlace(rel)?.kind !== "tematica"), r.slug).toBe(true);
        continue;
      }
      expect(getPlace(declarada), `sala de ${declarada}`).toBeDefined();
      expect(r.related, r.slug).toContain(declarada);
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
