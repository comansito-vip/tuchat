import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { promises as fs } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import type { Place } from "@/data/types";
import {
  getAdminState,
  emptyState,
  setRedirect,
  removeRedirect,
  toggleHidden,
  toggleNoindex,
  saveOverride,
  createRoom,
  deleteRoom,
} from "./admin-store";

const FILE = join(tmpdir(), `tuchat-admin-test-${process.pid}.json`);

beforeEach(() => {
  process.env.ADMIN_STORE_FILE = FILE;
});

afterEach(async () => {
  delete process.env.ADMIN_STORE_FILE;
  await fs.rm(FILE, { force: true });
});

const sampleRoom: Place = {
  slug: "sala-test",
  name: "Sala Test",
  kind: "tematica",
  icon: "🧪",
  users: 10,
  votes: 20,
  activity: "Baja",
  channels: ["sala-test", "amistad", "chatzona"],
  related: ["amistad"],
  intro: "intro de prueba",
};

describe("admin-store (backend JSON)", () => {
  it("estado vacío por defecto cuando no hay fichero", async () => {
    expect(await getAdminState()).toEqual(emptyState());
  });

  it("setRedirect / removeRedirect persisten", async () => {
    await setRedirect("mexicanos", "mexico");
    expect((await getAdminState()).redirects).toEqual({ mexicanos: "mexico" });
    await setRedirect("usa", "estados-unidos");
    expect((await getAdminState()).redirects.usa).toBe("estados-unidos");
    await removeRedirect("mexicanos");
    expect((await getAdminState()).redirects).toEqual({ usa: "estados-unidos" });
  });

  it("toggleHidden y toggleNoindex alternan", async () => {
    await toggleHidden("madrid");
    expect((await getAdminState()).hidden).toEqual(["madrid"]);
    await toggleHidden("madrid");
    expect((await getAdminState()).hidden).toEqual([]);
    await toggleNoindex("erotico");
    expect((await getAdminState()).noindex).toEqual(["erotico"]);
  });

  it("saveOverride hace merge incremental del parche", async () => {
    await saveOverride("madrid", { intro: "nueva intro" });
    await saveOverride("madrid", { users: 999 });
    expect((await getAdminState()).overrides.madrid).toEqual({ intro: "nueva intro", users: 999 });
  });

  it("createRoom añade y rechaza slug duplicado", async () => {
    await createRoom(sampleRoom);
    expect((await getAdminState()).newRooms).toHaveLength(1);
    await expect(createRoom(sampleRoom)).rejects.toThrow(/ya existe/);
  });

  it("deleteRoom elimina una sala creada", async () => {
    await createRoom(sampleRoom);
    await deleteRoom("sala-test");
    expect((await getAdminState()).newRooms).toEqual([]);
  });

  it("la escritura sobrevive a una relectura completa (round-trip)", async () => {
    await setRedirect("terra", "amistad");
    await toggleHidden("poker");
    await createRoom(sampleRoom);
    const state = await getAdminState();
    expect(state.redirects.terra).toBe("amistad");
    expect(state.hidden).toContain("poker");
    expect(state.newRooms[0].slug).toBe("sala-test");
  });
});
