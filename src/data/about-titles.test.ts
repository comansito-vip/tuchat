import { describe, it, expect } from "vitest";
import { getCities, getCountries, getTopics, getPlace } from "@/data";
import { ABOUT_TITLES } from "@/data/about-titles";

/**
 * El H2 del bloque "Sobre el chat" es el encabezado que lleva el peso semántico
 * de la página de sala. Hasta agosto de 2026 era `Sobre el chat de {nombre}` en
 * 2.559 de las 2.561 salas: una plantilla con hueco repetida a escala, que es
 * justo lo que Google lee como página puerta —y coincidía con tener 3 URLs
 * indexadas de 4.997—.
 *
 * El generador de localidades ya escribe un `aboutTitle` propio para cada sala
 * nueva, pero a 12 salas al día tardaría siete meses en cubrir el catálogo, así
 * que las anteriores se rellenan con un backfill (scripts/content/backfill-about-titles.mjs)
 * cuyo material de origen es el `about` que cada sala ya tiene escrito y
 * verificado. Estos tests son el contrato de ese backfill.
 */
const TODAS = [...getCountries(), ...getCities(), ...getTopics()];

describe("el H2 de cada sala es propio, no una plantilla con hueco", () => {
  it("toda sala con about tiene su propio aboutTitle", () => {
    const sin = TODAS.filter((p) => p.about && !p.aboutTitle).map((p) => p.slug);
    expect(sin).toEqual([]);
  });

  it("ningún aboutTitle es un encabezado genérico", () => {
    const genericos = TODAS.filter(
      (p) => p.aboutTitle && /^(sobre|acerca|qu[ée]|informaci[óo]n|bienvenid)/i.test(p.aboutTitle),
    ).map((p) => p.aboutTitle);
    expect(genericos).toEqual([]);
  });

  it("todos miden entre 25 y 70 caracteres", () => {
    const fuera = TODAS.filter(
      (p) => p.aboutTitle && (p.aboutTitle.length < 25 || p.aboutTitle.length > 70),
    ).map((p) => `${p.slug}: ${p.aboutTitle!.length}`);
    expect(fuera).toEqual([]);
  });

  it("no hay dos salas con el mismo aboutTitle", () => {
    const vistos = new Map<string, string>();
    const repes: string[] = [];
    for (const p of TODAS) {
      if (!p.aboutTitle) continue;
      const previo = vistos.get(p.aboutTitle);
      if (previo) repes.push(`${previo} = ${p.slug}: "${p.aboutTitle}"`);
      else vistos.set(p.aboutTitle, p.slug);
    }
    expect(repes).toEqual([]);
  });

  /**
   * La comprobación que de verdad importa: dos títulos pueden ser distintos
   * ("El puerto de Vigo", "El puerto de Cádiz") y seguir siendo el mismo molde.
   * Se sustituye el nombre del lugar por un marcador y se cuenta cuántas salas
   * comparten el resultado.
   */
  it("ningún molde se repite en más de 10 salas", () => {
    const moldes = new Map<string, string[]>();
    for (const p of TODAS) {
      if (!p.aboutTitle) continue;
      let molde = p.aboutTitle;
      for (const v of [p.name, p.parentName, p.provincia].filter(Boolean) as string[]) {
        molde = molde.split(v).join("«X»");
      }
      molde = molde.toLowerCase();
      if (!moldes.has(molde)) moldes.set(molde, []);
      moldes.get(molde)!.push(p.slug);
    }
    const abusivos = [...moldes.entries()]
      .filter(([, slugs]) => slugs.length > 10)
      .map(([molde, slugs]) => `${slugs.length}× "${molde}" (${slugs.slice(0, 3).join(", ")})`);
    expect(abusivos).toEqual([]);
  });
});

describe("resolución del aboutTitle", () => {
  it("el título de la propia ficha gana sobre el del backfill", () => {
    // Las salas que ya publicó el cron traen su aboutTitle escrito en la ficha;
    // el backfill no debe pisarlo aunque tenga entrada para ese slug.
    const propias = [...getCities(), ...getTopics()].filter(
      (p) => p.aboutTitle && !(p.slug in ABOUT_TITLES),
    );
    expect(propias.length).toBeGreaterThan(0);
  });

  it("el backfill no inventa slugs que no existan en el catálogo", () => {
    const huerfanos = Object.keys(ABOUT_TITLES).filter((slug) => !getPlace(slug));
    expect(huerfanos).toEqual([]);
  });
});
