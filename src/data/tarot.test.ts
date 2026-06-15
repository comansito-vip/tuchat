import { describe, it, expect } from "vitest";
import { ARCANOS_MAYORES, cartaDelDia } from "@/data/tarot";

describe("tarot data", () => {
  it("has exactly 22 Arcanos Mayores numbered 0-21", () => {
    expect(ARCANOS_MAYORES).toHaveLength(22);
    for (let i = 0; i <= 21; i++) {
      expect(ARCANOS_MAYORES[i].num).toBe(i);
    }
  });

  it("all arcanos have name, icon and meaning", () => {
    const violations = ARCANOS_MAYORES.filter(
      (a) => !a.name || !a.icon || a.meaning.length < 40
    ).map((a) => a.name);
    expect(violations).toEqual([]);
  });

  it("cartaDelDia returns a valid arcano for today", () => {
    const carta = cartaDelDia(new Date("2026-06-15"));
    expect(ARCANOS_MAYORES).toContain(carta);
  });

  it("cartaDelDia is deterministic — same date, same card", () => {
    const d = new Date("2026-06-15");
    expect(cartaDelDia(d)).toBe(cartaDelDia(d));
  });

  it("cartaDelDia cycles through all 22 cards in 22 consecutive days", () => {
    const seen = new Set<number>();
    for (let i = 0; i < 22; i++) {
      const d = new Date("2026-01-01");
      d.setDate(d.getDate() + i);
      seen.add(cartaDelDia(d).num);
    }
    expect(seen.size).toBe(22);
  });
});
