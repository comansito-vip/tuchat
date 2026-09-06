import { describe, expect, it } from "vitest";
import { getTopicCatalog } from "./topic-groups";
import { getMergedTopics } from "@/data/merged";
import { getRegions } from "@/data";

describe("getTopicCatalog", () => {
  it("reparte cada temática en un solo sitio: principal, grupo, país o apodo", async () => {
    const { primaryTopics, groups, propiasDelPais, apodosDelPais } = await getTopicCatalog();
    const vistos = new Map<string, number>();
    const cuenta = (slug: string) => vistos.set(slug, (vistos.get(slug) ?? 0) + 1);
    primaryTopics.forEach((t) => cuenta(t.slug));
    groups.forEach((g) => g.items.forEach((t) => cuenta(t.slug)));
    [...propiasDelPais.values(), ...apodosDelPais.values()].flat().forEach((t) => cuenta(t.slug));
    const repetidos = [...vistos].filter(([, n]) => n > 1).map(([s]) => s);
    expect(repetidos).toEqual([]);
  });

  it("no pierde ninguna temática salvo las comunidades autónomas y los hubs que encabezan su grupo", async () => {
    const { primaryTopics, groups, propiasDelPais, apodosDelPais } = await getTopicCatalog();
    const topics = await getMergedTopics();
    const regiones = new Set(getRegions().map((r) => r.slug));
    const hubs = new Set(groups.map((g) => g.slug).filter(Boolean));
    const colocados = new Set([
      ...primaryTopics.map((t) => t.slug),
      ...groups.flatMap((g) => g.items.map((t) => t.slug)),
      ...[...propiasDelPais.values(), ...apodosDelPais.values()].flat().map((t) => t.slug),
    ]);
    const perdidos = topics
      .map((t) => t.slug)
      .filter((s) => !colocados.has(s) && !regiones.has(s) && !hubs.has(s));
    expect(perdidos).toEqual([]);
  });

  it("ordena los grupos por gente conectada y da a cada uno un ancla única", async () => {
    const { groups } = await getTopicCatalog();
    expect(groups.length).toBeGreaterThan(10);
    const sinOtras = groups.filter((g) => g.name !== "Otras temáticas");
    for (let i = 1; i < sinOtras.length; i++) {
      expect(sinOtras[i - 1].users).toBeGreaterThanOrEqual(sinOtras[i].users);
    }
    const anclas = groups.map((g) => g.anchor);
    expect(new Set(anclas).size).toBe(anclas.length);
    for (const a of anclas) expect(a).toMatch(/^[a-z0-9-]+$/);
    expect(anclas).toContain("edades");
  });
});
