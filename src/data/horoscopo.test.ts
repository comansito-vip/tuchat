import { describe, it, expect } from "vitest";
import { getSigns, getSign } from "@/data/horoscopo";

describe("horoscopo data", () => {
  it("has the 12 zodiac signs", () => {
    expect(getSigns()).toHaveLength(12);
  });
  it("returns Aries with element, planet and personality copy", () => {
    const aries = getSign("aries");
    expect(aries?.name).toBe("Aries");
    expect(aries?.element).toBe("Fuego");
    expect(aries?.planet).toBe("Marte");
    expect(aries?.personality.length).toBeGreaterThan(40);
    expect(aries?.compatible.length).toBeGreaterThanOrEqual(2);
  });
  it("is case-insensitive on lookup", () => {
    expect(getSign("LEO")?.slug).toBe("leo");
  });
  it("has unique slugs and all compatible slugs resolve to real signs", () => {
    const all = getSigns().map((s) => s.slug);
    expect(new Set(all).size).toBe(all.length);
    const set = new Set(all);
    for (const s of getSigns()) {
      for (const c of s.compatible) expect(set.has(c)).toBe(true);
    }
  });
  it("returns undefined for an unknown sign", () => {
    expect(getSign("xyz")).toBeUndefined();
  });
  it("all compatible signs reference each other symmetrically", () => {
    const signs = getSigns();
    const signsMap = new Map(signs.map((s) => [s.slug, s]));
    const asymmetric: string[] = [];
    for (const sign of signs) {
      for (const compat of sign.compatible) {
        const compatSign = signsMap.get(compat);
        if (compatSign && !compatSign.compatible.includes(sign.slug)) {
          asymmetric.push(`${sign.slug} -> ${compat} not reciprocal`);
        }
      }
    }
    expect(asymmetric).toEqual([]);
  });

  it("all signs have personality ≥300 chars and element, planet, dates set", () => {
    const violations = getSigns()
      .filter(
        (s) =>
          s.personality.length < 300 ||
          !s.element ||
          !s.planet ||
          !s.dates
      )
      .map((s) => `${s.slug}: personality=${s.personality.length}ch, element=${s.element}, planet=${s.planet}`);
    expect(violations).toEqual([]);
  });
});
