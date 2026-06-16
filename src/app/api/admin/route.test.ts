import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { promises as fs } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

// next/cache necesita contexto de Next en runtime; lo simulamos.
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { GET, POST } from "./route";
import { getAdminState } from "@/lib/admin-store";

const FILE = join(tmpdir(), `tuchat-admin-route-${process.pid}.json`);

beforeEach(() => {
  process.env.ADMIN_STORE_FILE = FILE;
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

  it("regenNews no soportado → 501", async () => {
    const res = await POST(post({ action: "regenNews" }));
    expect(res.status).toBe(501);
  });

  it("GET devuelve el estado actual", async () => {
    await POST(post({ action: "setRedirect", from: "terra", to: "amistad" }));
    const res = await GET();
    expect((await res.json()).redirects.terra).toBe("amistad");
  });
});
