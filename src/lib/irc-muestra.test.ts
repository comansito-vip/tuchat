import { describe, expect, it } from "vitest";
import { conectados, horaMuestra, miles, usuariosEnCanal, usuariosRed } from "./irc-muestra";
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

  it("hora en formato HH:MM y miles con punto", () => {
    expect(horaMuestra()).toMatch(/^\d{2}:\d{2}$/);
    expect(miles(6477)).toBe("6.477");
    expect(miles(812)).toBe("812");
  });
});
