import { describe, it, expect } from "vitest";
import { TOPICS_MOTOR } from "./topics-motor";
import { TOPICS_OCIO } from "./topics-ocio";
import { getPlace } from "./index";

const VERTICALES = [
  { nombre: "Motor", hub: "motor", salas: TOPICS_MOTOR, n: 6 },
  { nombre: "Ocio", hub: "ocio", salas: TOPICS_OCIO, n: 6 },
];

describe.each(VERTICALES)("vertical $nombre", ({ hub, salas, n }) => {
  it("tiene su hub raíz y el resto cuelga de él", () => {
    expect(salas).toHaveLength(n);
    const raiz = salas.filter((p) => !p.parentSlug);
    expect(raiz.map((p) => p.slug)).toEqual([hub]);
    for (const p of salas.filter((x) => x.parentSlug)) expect(p.parentSlug).toBe(hub);
  });

  it("todas resuelven por getPlace (integradas en el catálogo)", () => {
    for (const p of salas) expect(getPlace(p.slug)?.slug).toBe(p.slug);
  });

  it("related apuntan a salas que existen", () => {
    for (const p of salas)
      for (const r of p.related)
        expect(getPlace(r), `related roto: ${r} en ${p.slug}`).toBeDefined();
  });

  it("cumple las constraints SEO (intro ≤160, about ≥400) y no duplica texto", () => {
    for (const p of salas) {
      expect(p.intro.length, `${p.slug} intro`).toBeLessThanOrEqual(160);
      expect((p.about ?? "").length, `${p.slug} about`).toBeGreaterThanOrEqual(400);
    }
    expect(new Set(salas.map((p) => p.about)).size).toBe(n);
    expect(new Set(salas.map((p) => p.intro)).size).toBe(n);
    expect(new Set(salas.map((p) => p.icon)).size).toBe(n);
  });

  it("enruta al canal IRC real del vertical", () => {
    for (const p of salas) expect(p.channels).toContain(hub === "motor" ? "motor" : "ocio");
  });

  it("sin las plantillas de texto ya prohibidas en el proyecto", () => {
    for (const p of salas) {
      const about = p.about ?? "";
      expect(about, p.slug).not.toMatch(/^Un espacio (para|donde)/);
      expect(about, p.slug).not.toMatch(/^La sala de .{1,30} es/);
      expect(about, p.slug).not.toMatch(/Conviven .+?, .+? y .+? que/);
    }
  });
});
