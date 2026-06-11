import { describe, it, expect } from "vitest";
import { getPlace, getRooms, getCities, getTopics, getNews } from "@/data";

describe("data getters", () => {
  it("returns the Madrid model room with channels and related", () => {
    const madrid = getPlace("madrid");
    expect(madrid?.name).toBe("Madrid");
    expect(madrid?.kind).toBe("ciudad");
    expect(madrid?.channels).toEqual(["madrid", "espana", "amistad", "chatzona"]);
    expect(madrid?.related).toContain("barcelona");
    expect(madrid?.intro.length).toBeGreaterThan(40);
  });
  it("lists active rooms, cities, topics and news", () => {
    expect(getRooms().length).toBeGreaterThanOrEqual(6);
    expect(getCities().some((c) => c.slug === "barcelona")).toBe(true);
    expect(getTopics().some((t) => t.slug === "amor")).toBe(true);
    expect(getNews().some((n) => n.featured)).toBe(true);
  });
});
