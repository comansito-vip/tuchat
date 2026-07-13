// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/data", () => ({
  getPlace: vi.fn(),
}));

vi.mock("@/lib/votes-store", () => ({
  getVoteCounts: vi.fn().mockResolvedValue({}),
  incrementVote: vi.fn().mockResolvedValue(1),
  hasVoted: vi.fn().mockResolvedValue(false),
  markVoted: vi.fn().mockResolvedValue(undefined),
}));

import { GET, POST } from "./route";
import { getPlace } from "@/data";
import { getVoteCounts, hasVoted, incrementVote, markVoted } from "@/lib/votes-store";

const MADRID = {
  slug: "madrid",
  name: "Madrid",
  kind: "ciudad" as const,
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
  vi.mocked(incrementVote).mockReset().mockResolvedValue(1);
  vi.mocked(hasVoted).mockReset().mockResolvedValue(false);
  vi.mocked(markVoted).mockReset().mockResolvedValue(undefined);
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

  it("returns 409 and does not increment when this IP already voted this room", async () => {
    vi.mocked(getPlace).mockReturnValue(MADRID);
    vi.mocked(hasVoted).mockResolvedValue(true);
    vi.mocked(getVoteCounts).mockResolvedValue({ madrid: 7 });
    const req = new Request("http://localhost/api/vote", {
      method: "POST",
      body: JSON.stringify({ slug: "madrid" }),
      headers: { "Content-Type": "application/json", "cf-connecting-ip": "1.2.3.4" },
    });
    const res = await POST(req);
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.votes).toBe(107); // 100 base + 7 stored, sin incrementar
    expect(body.alreadyVoted).toBe(true);
    expect(incrementVote).not.toHaveBeenCalled();
    expect(markVoted).not.toHaveBeenCalled();
  });

  it("marks the IP as voted after a successful vote", async () => {
    vi.mocked(getPlace).mockReturnValue(MADRID);
    const req = new Request("http://localhost/api/vote", {
      method: "POST",
      body: JSON.stringify({ slug: "madrid" }),
      headers: { "Content-Type": "application/json", "cf-connecting-ip": "5.6.7.8" },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(hasVoted).toHaveBeenCalledWith("5.6.7.8", "madrid");
    expect(markVoted).toHaveBeenCalledWith("5.6.7.8", "madrid");
  });

  it("falls back to x-forwarded-for, then to a shared 'unknown' bucket", async () => {
    vi.mocked(getPlace).mockReturnValue(MADRID);
    const reqFwd = new Request("http://localhost/api/vote", {
      method: "POST",
      body: JSON.stringify({ slug: "madrid" }),
      headers: { "Content-Type": "application/json", "x-forwarded-for": "9.9.9.9, 10.0.0.1" },
    });
    await POST(reqFwd);
    expect(hasVoted).toHaveBeenCalledWith("9.9.9.9", "madrid");

    const reqNone = new Request("http://localhost/api/vote", {
      method: "POST",
      body: JSON.stringify({ slug: "madrid" }),
      headers: { "Content-Type": "application/json" },
    });
    await POST(reqNone);
    expect(hasVoted).toHaveBeenCalledWith("unknown", "madrid");
  });
});
