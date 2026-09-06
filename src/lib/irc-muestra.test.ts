import { describe, expect, it } from "vitest";
import { conectados, cuandoMuestra, fechaMuestra, horaMuestra, miles, usuariosEnCanal, usuariosRed } from "./irc-muestra";
import { getPlace } from "@/data";

describe("muestra IRC", () => {
  it("la muestra guardada tiene usuarios de red y canales con gente", () => {
    expect(usuariosRed()).toBeGreaterThan(100);
    expect(usuariosEnCanal("amistad")).toBeGreaterThan(10);
    expect(usuariosEnCanal("#Amistad")).toBe(usuariosEnCanal("amistad"));
  });

  it("encuentra #españa aunque la ficha escriba espana", () => {
    expect(usuariosEnCanal("espana")).toBe(usuariosEnCanal("españa"));
    expect(usuariosEnCanal("espana")).toBeGreaterThan(10);
  });

  it("un canal que no existe en la muestra da null, no cero", () => {
    expect(usuariosEnCanal("canal-que-no-existe-xyz")).toBeNull();
  });

  it("conectados usa el primer canal propio de la sala, nunca el de red si hay otro", () => {
    expect(conectados(getPlace("madrid")!)).toBe(usuariosEnCanal("madrid"));
    expect(conectados({ channels: ["chatzona"] })).toBe(usuariosEnCanal("chatzona"));
    expect(conectados({ channels: ["canal-inexistente-xyz", "chatzona"] })).toBeNull();
  });

  it("cuándo: solo la hora si la muestra es de hoy, con fecha si es de otro día", () => {
    const tomada = new Date(fechaMuestra());
    expect(cuandoMuestra(tomada)).toBe(`a las ${horaMuestra()}`);
    const tresDiasDespues = new Date(tomada.getTime() + 3 * 86_400_000);
    expect(cuandoMuestra(tresDiasDespues)).toMatch(/^el \d{1,2} [a-z]{3,4} a las \d{2}:\d{2}$/);
  });

  it("hora en formato HH:MM y miles con punto", () => {
    expect(horaMuestra()).toMatch(/^\d{2}:\d{2}$/);
    expect(miles(6477)).toBe("6.477");
    expect(miles(812)).toBe("812");
  });
});
