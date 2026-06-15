// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/data", () => ({
  getPlace: vi.fn(),
}));

vi.mock("@/lib/votes-store", () => ({
  getVoteCounts: vi.fn().mockResolvedValue({}),
  incrementVote: vi.fn().mockResolvedValue(1),
}));

import { GET, POST } from "./route";
import { getPlace } from "@/data";
import { getVoteCounts, incrementVote } from "@/lib/votes-store";

const MADRID = {
  slug: "madrid",
  name: "Madrid",
  kind: "ciudad",
  votes: 100,
  users: 50,
  intro: "...",
  about: "...",
  channels: ["madrid"],
  related: [],
  icon: "🏙️",
  activity: "Alta" as const,
};

beforeEach(() => {
  vi.mocked(getPlace).mockReset();
  vi.mocked(getVoteCounts).mockResolvedValue({});
  vi.mocked(incrementVote).mockResolvedValue(1);
});

describe("GET /api/vote", () => {
  it("returns vote count for a valid slug", async () => {
    vi.mocked(getPlace).mockReturnValue(MADRID);
    vi.mocked(getVoteCounts).mockResolvedValue({ madrid: 5 });
    const req = new Request("http://localhost/api/vote?slug=madrid");
    const res = await GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.slug).toBe("madrid");
    expect(body.votes).toBe(105); // 100 base + 5 stored
  });

  it("returns 404 for an unknown slug", async () => {
    vi.mocked(getPlace).mockReturnValue(undefined);
    const req = new Request("http://localhost/api/vote?slug=nowhere");
    const res = await GET(req);
    expect(res.status).toBe(404);
  });

  it("returns 404 when no slug provided", async () => {
    vi.mocked(getPlace).mockReturnValue(undefined);
    const req = new Request("http://localhost/api/vote");
    const res = await GET(req);
    expect(res.status).toBe(404);
  });
});

describe("POST /api/vote", () => {
  it("increments vote and returns updated count", async () => {
    vi.mocked(getPlace).mockReturnValue(MADRID);
    vi.mocked(incrementVote).mockResolvedValue(3);
    const req = new Request("http://localhost/api/vote", {
      method: "POST",
      body: JSON.stringify({ slug: "madrid" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.slug).toBe("madrid");
    expect(body.votes).toBe(103); // 100 base + 3 increment
  });

  it("returns 404 for unknown slug", async () => {
    vi.mocked(getPlace).mockReturnValue(undefined);
    const req = new Request("http://localhost/api/vote", {
      method: "POST",
      body: JSON.stringify({ slug: "nowhere" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(404);
  });

  it("returns 400 for invalid JSON body", async () => {
    const req = new Request("http://localhost/api/vote", {
      method: "POST",
      body: "not-json",
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
