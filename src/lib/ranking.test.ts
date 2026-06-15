import { describe, it, expect, vi, beforeEach } from "vitest";
import { getGlobalRanking, getRankingByKind } from "@/lib/ranking";

vi.mock("@/lib/votes-store", () => ({
  getVoteCounts: vi.fn().mockResolvedValue({}),
}));

import { getVoteCounts } from "@/lib/votes-store";

beforeEach(() => {
  vi.mocked(getVoteCounts).mockResolvedValue({});
});

describe("ranking", () => {
  it("getGlobalRanking returns at most 10 places by default", async () => {
    const results = await getGlobalRanking();
    expect(results.length).toBeLessThanOrEqual(10);
    expect(results.length).toBeGreaterThan(0);
  });

  it("getGlobalRanking respects custom limit", async () => {
    const results = await getGlobalRanking(5);
    expect(results.length).toBeLessThanOrEqual(5);
  });

  it("getGlobalRanking sorts by votes descending (no increments)", async () => {
    const results = await getGlobalRanking(10);
    for (let i = 1; i < results.length; i++) {
      expect(results[i].votes).toBeLessThanOrEqual(results[i - 1].votes);
    }
  });

  it("getGlobalRanking applies stored increments when ranking", async () => {
    vi.mocked(getVoteCounts).mockResolvedValue({ amor: 99999 });
    const results = await getGlobalRanking(1);
    expect(results[0].slug).toBe("amor");
  });

  it("getRankingByKind(pais) returns only countries", async () => {
    const results = await getRankingByKind("pais");
    expect(results.every((p) => p.kind === "pais")).toBe(true);
  });

  it("getRankingByKind(ciudad) returns only cities", async () => {
    const results = await getRankingByKind("ciudad");
    expect(results.every((p) => p.kind === "ciudad")).toBe(true);
  });

  it("getRankingByKind(tematica) returns only topics", async () => {
    const results = await getRankingByKind("tematica");
    expect(results.every((p) => p.kind === "tematica")).toBe(true);
  });

  it("getRankingByKind respects custom limit", async () => {
    const results = await getRankingByKind("ciudad", 3);
    expect(results.length).toBeLessThanOrEqual(3);
  });
});
