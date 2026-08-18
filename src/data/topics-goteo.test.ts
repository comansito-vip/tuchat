import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { TOPICS_GOTEO } from "./topics-goteo";
import { getPlace } from "./index";
import { REAL_CHANNELS, SEEDED_CHANNELS } from "./irc-real-channels";
import { detectarMuletillas } from "@/lib/content/muletillas";

/**
 * Las salas de término publicadas por scripts/cron/salas-termino.mjs.
 *
 * El cron ya comprueba todo esto antes de publicar, pero el cron corre en el VPS
 * y el fichero se puede editar a mano por error (dice "no editar", que es
 * exactamente lo que la gente edita). Estos tests son la red debajo: si alguien
 * toca topics-goteo.ts y rompe un canal o repite una intro, falla `npm test` y no
 * llega al build.
 *
 * Se validan las publicadas Y la cola entera, porque una ficha con un canal
 * inventado esperando en pendientes.json es un fallo que conviene ver hoy y no
 * el día que le toque salir.
 */
const COLA: Array<Record<string, unknown>> = JSON.parse(
  readFileSync(join(process.cwd(), "data", "terminos", "pendientes.json"), "utf8"),
);

// Una ficha publicada NO se borra de pendientes.json (la cola es el original y
// progreso.json lleva la cuenta), así que aquí se descuenta o cada publicada se
// contaría dos veces y los tests de unicidad fallarían contra sí mismos.
const publicadas = new Set(TOPICS_GOTEO.map((p) => p.slug));
const enCola = (COLA as unknown as typeof TOPICS_GOTEO).filter((f) => !publicadas.has(f.slug));
const fichas = [...TOPICS_GOTEO, ...enCola];
const sembrados = new Set<string>(SEEDED_CHANNELS);

describe("salas de término (publicadas y en cola)", () => {
  it("lo que sigue en cola no choca con ninguna sala del catálogo", () => {
    for (const f of enCola) {
      expect(getPlace(f.slug), `${f.slug} ya existe en el catálogo`).toBeUndefined();
    }
  });

  it("los slugs no se repiten entre sí", () => {
    const slugs = fichas.map((f) => f.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("todos los canales existen en la red", () => {
    const fantasmas = fichas.flatMap((f) =>
      f.channels.filter((c) => !REAL_CHANNELS.has(c)).map((c) => `${f.slug}: #${c}`),
    );
    expect(fantasmas).toEqual([]);
  });

  it("el primer canal está poblado: nunca uno sembrado", () => {
    for (const f of fichas) {
      expect(sembrados.has(f.channels[0]), `${f.slug}: #${f.channels[0]}`).toBe(false);
    }
  });

  it("la intro cabe como meta description (110-160)", () => {
    for (const f of fichas) {
      expect(f.intro.length, `${f.slug}: ${f.intro.length} caracteres`).toBeGreaterThanOrEqual(110);
      expect(f.intro.length, `${f.slug}: ${f.intro.length} caracteres`).toBeLessThanOrEqual(160);
    }
  });

  it("cada sala trae su H2 propio, ni genérico ni kilométrico", () => {
    for (const f of fichas) {
      const t = f.aboutTitle ?? "";
      expect(t.length, `${f.slug}: "${t}"`).toBeGreaterThanOrEqual(25);
      expect(t.length, `${f.slug}: "${t}"`).toBeLessThanOrEqual(70);
      expect(/^(sobre|acerca|qu[ée]|informaci[óo]n|bienvenid)/i.test(t), f.slug).toBe(false);
    }
  });

  it("el about tiene cuerpo pero no se va (100-320 palabras)", () => {
    for (const f of fichas) {
      const palabras = (f.about ?? "").trim().split(/\s+/).filter(Boolean).length;
      expect(palabras, `${f.slug}: ${palabras} palabras`).toBeGreaterThanOrEqual(100);
      expect(palabras, `${f.slug}: ${palabras} palabras`).toBeLessThanOrEqual(320);
    }
  });

  it("no hay muletillas de IA en intro ni en about", () => {
    const sucias = fichas.flatMap((f) => {
      const hits = [...detectarMuletillas(f.intro), ...detectarMuletillas(f.about ?? "")];
      return hits.length ? [`${f.slug}: ${[...new Set(hits)].join(", ")}`] : [];
    });
    expect(sucias).toEqual([]);
  });

  it("ninguna intro se repite: son metas distintas", () => {
    const intros = fichas.map((f) => f.intro.toLowerCase().trim());
    expect(new Set(intros).size).toBe(intros.length);
  });

  it("el padre declarado existe o está en la cola", () => {
    const enCola = new Set(fichas.map((f) => f.slug));
    for (const f of fichas) {
      if (!f.parentSlug) continue;
      expect(Boolean(getPlace(f.parentSlug)) || enCola.has(f.parentSlug), `${f.slug} -> ${f.parentSlug}`).toBe(true);
    }
  });

  it("los related de las publicadas apuntan a salas que existen", () => {
    const rotos = TOPICS_GOTEO.flatMap((f) =>
      f.related.filter((r) => !getPlace(r)).map((r) => `${f.slug} -> ${r}`),
    );
    expect(rotos).toEqual([]);
  });

  it("la cola conserva la demanda que justificó cada sala", () => {
    for (const f of COLA) {
      expect(f.demanda, String(f.slug)).toBeDefined();
      expect(typeof (f.demanda as { impresiones: number }).impresiones, String(f.slug)).toBe("number");
    }
  });
});
