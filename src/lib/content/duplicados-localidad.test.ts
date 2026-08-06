import { describe, it, expect } from "vitest";
// Módulo .mjs compartido con los scripts de localidades.
import { variantesDe, yaExiste, indexar, distanciaKm } from "../../../scripts/localidades/duplicados.mjs";

// Todos los casos de aquí son reales: aparecieron al cruzar el censo del INE con
// las salas del sitio y habrían acabado en salas duplicadas de la misma ciudad.
describe("variantesDe", () => {
  it("separa los nombres bilingües unidos por barra", () => {
    expect(variantesDe("Pamplona/Iruña")).toContain("pamplona");
    expect(variantesDe("Castelló de la Plana/Castellón de la Plana")).toContain("castello-de-la-plana");
  });

  it("parte los nombres bilingües unidos por guion", () => {
    const v = variantesDe("Vitoria-Gasteiz");
    expect(v).toContain("vitoria");
    expect(v).toContain("gasteiz");
  });

  it("corta por la preposición: Las Palmas de Gran Canaria → Las Palmas", () => {
    expect(variantesDe("Las Palmas de Gran Canaria")).toContain("las-palmas");
  });

  it("recoloca el artículo pospuesto del INE, con y sin apóstrofo", () => {
    expect(variantesDe("Eliana, l'")).toContain("l-eliana");
    expect(variantesDe("Palmas de Gran Canaria, Las")).toContain("las-palmas-de-gran-canaria");
  });
});

describe("yaExiste", () => {
  const salas = [
    { slug: "vitoria", name: "Vitoria" },
    { slug: "las-palmas", name: "Las Palmas" },
    { slug: "ibiza", name: "Ibiza" },
    { slug: "zaragoza", name: "Zaragoza" },
  ];
  const coords = {
    ibiza: { lat: 38.9744, lon: 1.4001 },
    zaragoza: { lat: 41.6488, lon: -0.8891 },
  };
  const indice = indexar(salas, coords);

  it("reconoce el nombre oficial largo del censo", () => {
    expect(yaExiste(indice, { nombre: "Vitoria-Gasteiz" })).toBe("vitoria");
    expect(yaExiste(indice, { nombre: "Las Palmas de Gran Canaria" })).toBe("las-palmas");
  });

  it("reconoce el topónimo en lengua cooficial por la tabla de equivalencias", () => {
    expect(yaExiste(indice, { nombre: "Eivissa" })).toBe("ibiza");
  });

  it("no confunde un municipio vecino con la capital que tiene al lado", () => {
    // Cuarte de Huerva está a ~8,6 km de Zaragoza y es otro municipio: si esto
    // devolviera "zaragoza", el pueblo se quedaría sin sala para siempre.
    const cuarte = { nombre: "Cuarte de Huerva", coords: { lat: 41.5847, lon: -0.9169 } };
    expect(yaExiste(indice, cuarte)).toBeNull();
  });

  it("devuelve null cuando la localidad de verdad no está", () => {
    expect(yaExiste(indice, { nombre: "Lardero" })).toBeNull();
  });
});

describe("distanciaKm", () => {
  it("mide una distancia conocida con error menor al 2%", () => {
    // Madrid–Zaragoza, ~270 km en línea recta.
    const km = distanciaKm({ lat: 40.4165, lon: -3.7026 }, { lat: 41.6488, lon: -0.8891 });
    expect(km).toBeGreaterThan(265);
    expect(km).toBeLessThan(275);
  });
});
