import { describe, it, expect, vi, beforeEach } from "vitest";
import type { AdminState } from "@/lib/admin-store";
import type { Place } from "@/data/types";

// Mock completo del store — los tests no tocan disco ni Redis.
vi.mock("@/lib/admin-store", () => ({
  getAdminState: vi.fn(),
}));

// Importamos el mock tipado para poder sobreescribir el retorno en cada test.
import { getAdminState } from "@/lib/admin-store";
const mockGetAdminState = vi.mocked(getAdminState);

import {
  getMergedAll,
  getMergedPlace,
  getMergedCountries,
  getMergedCities,
  getMergedTopics,
  getMergedChildren,
  getRedirectTarget,
  isNoindex,
} from "./merged";

function emptyState(): AdminState {
  return { redirects: {}, hidden: [], noindex: [], overrides: {}, newRooms: [] };
}

beforeEach(() => {
  mockGetAdminState.mockResolvedValue(emptyState());
});

describe("getMergedAll", () => {
  it("devuelve el catálogo completo cuando no hay overrides ni hidden", async () => {
    const all = await getMergedAll();
    expect(all.length).toBeGreaterThan(100);
  });

  it("excluye salas marcadas como hidden", async () => {
    mockGetAdminState.mockResolvedValue({ ...emptyState(), hidden: ["madrid"] });
    const all = await getMergedAll();
    expect(all.find((p) => p.slug === "madrid")).toBeUndefined();
  });

  it("incluye salas no ocultas aunque otras estén hidden", async () => {
    mockGetAdminState.mockResolvedValue({ ...emptyState(), hidden: ["madrid"] });
    const all = await getMergedAll();
    expect(all.find((p) => p.slug === "barcelona")).toBeDefined();
  });

  it("aplica overrides sobre el lugar base", async () => {
    mockGetAdminState.mockResolvedValue({
      ...emptyState(),
      overrides: { madrid: { intro: "intro modificada" } },
    });
    const all = await getMergedAll();
    const m = all.find((p) => p.slug === "madrid");
    expect(m?.intro).toBe("intro modificada");
    expect(m?.name).toBe("Madrid"); // campo no sobreescrito se preserva
  });

  it("concatena newRooms al catálogo", async () => {
    const nueva: Place = {
      slug: "sala-nueva",
      name: "Sala Nueva",
      kind: "tematica",
      icon: "🆕",
      users: 5,
      votes: 0,
      activity: "Baja",
      channels: ["sala-nueva"],
      related: [],
      intro: "sala de prueba",
    };
    mockGetAdminState.mockResolvedValue({ ...emptyState(), newRooms: [nueva] });
    const all = await getMergedAll();
    expect(all.find((p) => p.slug === "sala-nueva")).toMatchObject({ name: "Sala Nueva" });
  });
});

describe("getMergedPlace", () => {
  it("devuelve el lugar base cuando no hay overrides", async () => {
    const place = await getMergedPlace("espana");
    expect(place?.slug).toBe("espana");
  });

  it("aplica overrides al lugar", async () => {
    mockGetAdminState.mockResolvedValue({
      ...emptyState(),
      overrides: { espana: { users: 9999 } },
    });
    const place = await getMergedPlace("espana");
    expect(place?.users).toBe(9999);
    expect(place?.name).toBe("España");
  });

  it("devuelve undefined para slugs inexistentes", async () => {
    expect(await getMergedPlace("sala-que-no-existe")).toBeUndefined();
  });

  it("devuelve newRooms si el slug no está en la base", async () => {
    const nueva: Place = {
      slug: "sala-creada",
      name: "Sala Creada",
      kind: "tematica",
      icon: "✨",
      users: 1,
      votes: 0,
      activity: "Baja",
      channels: ["sala-creada"],
      related: [],
      intro: "creada desde el panel",
    };
    mockGetAdminState.mockResolvedValue({ ...emptyState(), newRooms: [nueva] });
    const place = await getMergedPlace("sala-creada");
    expect(place?.name).toBe("Sala Creada");
  });
});

describe("getMergedCountries / getCities / getTopics", () => {
  it("getMergedCountries excluye países hidden", async () => {
    mockGetAdminState.mockResolvedValue({ ...emptyState(), hidden: ["espana"] });
    const countries = await getMergedCountries();
    expect(countries.find((c) => c.slug === "espana")).toBeUndefined();
    expect(countries.find((c) => c.slug === "mexico")).toBeDefined();
  });

  it("getMergedCities excluye ciudades hidden", async () => {
    mockGetAdminState.mockResolvedValue({ ...emptyState(), hidden: ["madrid"] });
    const cities = await getMergedCities();
    expect(cities.find((c) => c.slug === "madrid")).toBeUndefined();
  });

  it("getMergedTopics excluye temáticas hidden", async () => {
    mockGetAdminState.mockResolvedValue({ ...emptyState(), hidden: ["amistad"] });
    const topics = await getMergedTopics();
    expect(topics.find((t) => t.slug === "amistad")).toBeUndefined();
  });
});

describe("getMergedChildren", () => {
  it("devuelve hijos de un lugar padre", async () => {
    const children = await getMergedChildren("espana");
    expect(children.length).toBeGreaterThan(0);
  });

  it("excluye hijos hidden", async () => {
    const allChildren = await getMergedChildren("espana");
    const firstChild = allChildren[0];
    mockGetAdminState.mockResolvedValue({ ...emptyState(), hidden: [firstChild.slug] });
    const filtered = await getMergedChildren("espana");
    expect(filtered.find((c) => c.slug === firstChild.slug)).toBeUndefined();
  });
});

describe("getRedirectTarget", () => {
  it("devuelve undefined cuando no hay redirección", async () => {
    expect(await getRedirectTarget("madrid")).toBeUndefined();
  });

  it("devuelve el slug canónico cuando hay redirección", async () => {
    mockGetAdminState.mockResolvedValue({
      ...emptyState(),
      redirects: { mexicanos: "mexico" },
    });
    expect(await getRedirectTarget("mexicanos")).toBe("mexico");
  });
});

describe("isNoindex", () => {
  it("devuelve false por defecto", async () => {
    expect(await isNoindex("erotico")).toBe(false);
  });

  it("devuelve true si el slug está en noindex", async () => {
    mockGetAdminState.mockResolvedValue({ ...emptyState(), noindex: ["erotico"] });
    expect(await isNoindex("erotico")).toBe(true);
  });
});
