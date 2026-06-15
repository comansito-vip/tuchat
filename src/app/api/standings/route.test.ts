// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/sports", () => ({
  getLeague: vi.fn(),
  getStandings: vi.fn(),
}));

import { GET } from "./route";
import { getLeague, getStandings } from "@/lib/sports";

const FAKE_LEAGUE = { slug: "laliga", name: "LaLiga", theSportsDB: "4335", fallback: [] };
const FAKE_RESULT = {
  source: "fallback" as const,
  rows: [{ rank: 1, team: "Real Madrid", played: 38, won: 28, drawn: 5, lost: 5, gf: 90, ga: 40, gd: 50, points: 89 }],
};

beforeEach(() => {
  vi.mocked(getLeague).mockReset();
  vi.mocked(getStandings).mockReset();
});

describe("GET /api/standings", () => {
  it("returns standings for a valid liga", async () => {
    vi.mocked(getLeague).mockReturnValue(FAKE_LEAGUE as never);
    vi.mocked(getStandings).mockResolvedValue(FAKE_RESULT);
    const req = new Request("http://localhost/api/standings?liga=laliga");
    const res = await GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.rows).toHaveLength(1);
    expect(body.rows[0].team).toBe("Real Madrid");
  });

  it("returns 404 for an unknown liga", async () => {
    vi.mocked(getLeague).mockReturnValue(undefined);
    const req = new Request("http://localhost/api/standings?liga=xyz");
    const res = await GET(req);
    expect(res.status).toBe(404);
  });

  it("returns 404 when no liga param is provided", async () => {
    vi.mocked(getLeague).mockReturnValue(undefined);
    const req = new Request("http://localhost/api/standings");
    const res = await GET(req);
    expect(res.status).toBe(404);
  });

  it("passes the source field through from getStandings", async () => {
    vi.mocked(getLeague).mockReturnValue(FAKE_LEAGUE as never);
    vi.mocked(getStandings).mockResolvedValue({ source: "live", rows: [] });
    const req = new Request("http://localhost/api/standings?liga=laliga");
    const res = await GET(req);
    const body = await res.json();
    expect(body.source).toBe("live");
  });
});
