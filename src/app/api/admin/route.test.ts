import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { promises as fs } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

// next/cache necesita contexto de Next en runtime; lo simulamos.
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock de child_process: spawnSync en named export Y en default (CJS interop).
vi.mock("node:child_process", () => {
  const spawnSyncMock = vi.fn();
  return {
    default: { spawnSync: spawnSyncMock },
    spawnSync: spawnSyncMock,
  };
});

import { GET, POST } from "./route";
import { getAdminState } from "@/lib/admin-store";
import { spawnSync } from "node:child_process";

const mockSpawn = vi.mocked(spawnSync);

const FILE = join(tmpdir(), `tuchat-admin-route-${process.pid}.json`);

beforeEach(() => {
  process.env.ADMIN_STORE_FILE = FILE;
  mockSpawn.mockReset();
});
afterEach(async () => {
  delete process.env.ADMIN_STORE_FILE;
  await fs.rm(FILE, { force: true });
});

function post(body: unknown): Request {
  return new Request("http://x/api/admin", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

describe("POST /api/admin", () => {
  it("setRedirect muta el store y responde ok", async () => {
    const res = await POST(post({ action: "setRedirect", from: "usa", to: "estados-unidos" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect((await getAdminState()).redirects.usa).toBe("estados-unidos");
  });

  it("toggleHidden muta el store", async () => {
    await POST(post({ action: "toggleHidden", slug: "madrid" }));
    expect((await getAdminState()).hidden).toContain("madrid");
  });

  it("acción desconocida → 400", async () => {
    const res = await POST(post({ action: "nope" }));
    expect(res.status).toBe(400);
  });

  it("payload sin campo requerido → 400", async () => {
    const res = await POST(post({ action: "setRedirect", from: "usa" }));
    expect(res.status).toBe(400);
  });

  it("JSON inválido → 400", async () => {
    const res = await POST(
      new Request("http://x/api/admin", { method: "POST", body: "{nojson" })
    );
    expect(res.status).toBe(400);
  });

  it("GET devuelve el estado actual", async () => {
    await POST(post({ action: "setRedirect", from: "terra", to: "amistad" }));
    const res = await GET();
    expect((await res.json()).redirects.terra).toBe("amistad");
  });
});

describe("regenNews", () => {
  it("exitCode 0 → 200 ok con duration", async () => {
    mockSpawn.mockReturnValue({ status: 0, stdout: "", stderr: "", pid: 1, output: [], signal: null, error: undefined });
    const res = await POST(post({ action: "regenNews" }));
    expect(res.status).toBe(200);
    const data = await res.json() as { ok: boolean; duration: number };
    expect(data.ok).toBe(true);
    expect(typeof data.duration).toBe("number");
  });

  it("exitCode 1 → 500 con error del stderr", async () => {
    mockSpawn.mockReturnValue({ status: 1, stdout: "", stderr: "API key missing", pid: 1, output: [], signal: null, error: undefined });
    const res = await POST(post({ action: "regenNews" }));
    expect(res.status).toBe(500);
    const data = await res.json() as { error: string };
    expect(data.error).toContain("API key missing");
  });

  it("error de spawn (p.ej. timeout) → 500", async () => {
    mockSpawn.mockReturnValue({ status: null, stdout: "", stderr: "", pid: 1, output: [], signal: null, error: new Error("ETIMEDOUT") });
    const res = await POST(post({ action: "regenNews" }));
    expect(res.status).toBe(500);
  });

  it("GET incluye lastRegen tras ejecutar", async () => {
    mockSpawn.mockReturnValue({ status: 0, stdout: "", stderr: "", pid: 1, output: [], signal: null, error: undefined });
    await POST(post({ action: "regenNews" }));
    const res = await GET();
    const data = await res.json() as { lastRegen: { status: string } };
    expect(data.lastRegen?.status).toBe("ok");
  });
});
