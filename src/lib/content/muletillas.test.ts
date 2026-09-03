import { describe, it, expect } from "vitest";
import { detectarIdiomaAjeno, detectarMuletillas } from "./muletillas";

// Caso real: "plutôt" se coló en varias noticias publicadas porque nada
// comprobaba el idioma, solo longitud y muletillas.
describe("detectarIdiomaAjeno", () => {
  it("detecta el diacrítico francés que el español no usa", () => {
    expect(detectarIdiomaAjeno("un estímulo positivo plutôt que una fuente de frustración")).toContain("plutôt");
  });

  it("detecta un conector francés/inglés delator aunque no lleve diacrítico", () => {
    expect(detectarIdiomaAjeno("El proyecto avanza bien; néanmoins, falta revisión.").length).toBeGreaterThan(0);
    expect(detectarIdiomaAjeno("El proyecto avanza bien; however, falta revisión.").length).toBeGreaterThan(0);
  });

  it("no marca nombres propios extranjeros con esos mismos diacríticos", () => {
    expect(detectarIdiomaAjeno("François Mitterrand visitó la ciudad en 1988.")).toEqual([]);
    expect(detectarIdiomaAjeno("La biografía de Söderström se tradujo al español.")).toEqual([]);
  });

  it("no marca español corriente, con o sin préstamos con tilde", () => {
    expect(detectarIdiomaAjeno("Las salas de chat reúnen cada noche a cientos de personas.")).toEqual([]);
    expect(detectarIdiomaAjeno("Tomar un café mientras se charla es parte de la élite del ocio.")).toEqual([]);
  });

  it("acepta apóstrofo recto o tipográfico en las expresiones delatoras", () => {
    expect(detectarIdiomaAjeno("Aujourd'hui el debate sigue abierto.").length).toBeGreaterThan(0);
    expect(detectarIdiomaAjeno("Aujourd’hui el debate sigue abierto.").length).toBeGreaterThan(0);
  });
});

// La huella de idioma vive junto a la de muletillas (mismo fichero, mismo
// propósito: filtrar antes de publicar), pero son señales independientes.
describe("detectarMuletillas sigue intacta", () => {
  it("no cambia con la incorporación del detector de idioma", () => {
    expect(detectarMuletillas("Sumérgete en el mundo del chat online.").length).toBeGreaterThan(0);
    expect(detectarMuletillas("Las salas de chat reúnen cada noche a cientos de personas.")).toEqual([]);
  });
});
