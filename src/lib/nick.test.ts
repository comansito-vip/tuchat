import { describe, it, expect } from "vitest";
import { generateNick } from "@/lib/nick";

describe("generateNick", () => {
  it("produces Invitado-#### with 4 digits", () => {
    expect(generateNick()).toMatch(/^Invitado-\d{4}$/);
  });
  it("varies between calls", () => {
    const set = new Set(Array.from({ length: 20 }, () => generateNick()));
    expect(set.size).toBeGreaterThan(1);
  });
});
