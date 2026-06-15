// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Import after env is set up
const makeReq = (auth?: string) => ({
  headers: { get: (k: string) => (k === "authorization" ? auth ?? null : null) },
}) as never;

describe("admin middleware", () => {
  const OLD_ENV = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    process.env = { ...OLD_ENV };
  });

  it("passes through when ADMIN_PASS is not set", async () => {
    delete process.env.ADMIN_PASS;
    const { middleware } = await import("./middleware");
    const res = middleware(makeReq());
    // NextResponse.next() has status 200
    expect(res.status).toBe(200);
  });

  it("returns 401 when ADMIN_PASS is set and no auth header", async () => {
    process.env.ADMIN_PASS = "secret";
    process.env.ADMIN_USER = "admin";
    const { middleware } = await import("./middleware");
    const res = middleware(makeReq());
    expect(res.status).toBe(401);
    expect(res.headers.get("WWW-Authenticate")).toContain("Basic");
  });

  it("returns 401 with wrong credentials", async () => {
    process.env.ADMIN_PASS = "secret";
    process.env.ADMIN_USER = "admin";
    const { middleware } = await import("./middleware");
    const wrongAuth = "Basic " + btoa("admin:wrong");
    const res = middleware(makeReq(wrongAuth));
    expect(res.status).toBe(401);
  });

  it("passes through with correct credentials", async () => {
    process.env.ADMIN_PASS = "secret";
    process.env.ADMIN_USER = "admin";
    const { middleware } = await import("./middleware");
    const goodAuth = "Basic " + btoa("admin:secret");
    const res = middleware(makeReq(goodAuth));
    expect(res.status).toBe(200);
  });

  it("returns 401 with malformed base64", async () => {
    process.env.ADMIN_PASS = "secret";
    const { middleware } = await import("./middleware");
    const res = middleware(makeReq("Basic !!!notbase64!!!"));
    expect(res.status).toBe(401);
  });
});
