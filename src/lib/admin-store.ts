/**
 * Estado editable del panel admin. Capa conectable, gemela de votes-store:
 *
 *  - Si hay UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN → Upstash Redis
 *    (clave JSON "tuchat:admin"), durable y serverless.
 *  - En caso contrario → fichero JSON (.data/admin.json por defecto, override con
 *    ADMIN_STORE_FILE para tests). Escritura atómica vía temporal + rename.
 *
 * El documento se fusiona sobre los arrays estáticos en src/data/merged.ts; la
 * fuente TS nunca se modifica. Una sola verdad en runtime.
 */
import { promises as fs } from "node:fs";
import { dirname, join } from "node:path";
import type { Place } from "@/data/types";

export interface AdminState {
  redirects: Record<string, string>; // oldSlug -> slug canónico
  hidden: string[]; // slugs ocultos de listados
  noindex: string[]; // slugs marcados noindex
  overrides: Record<string, Partial<Place>>; // ediciones de salas existentes
  newRooms: Place[]; // salas creadas desde el panel
}

export function emptyState(): AdminState {
  return { redirects: {}, hidden: [], noindex: [], overrides: {}, newRooms: [] };
}

interface Backend {
  read(): Promise<AdminState>;
  write(state: AdminState): Promise<void>;
}

// Normaliza un documento parcial/antiguo a la forma completa.
function normalize(raw: Partial<AdminState> | null | undefined): AdminState {
  const base = emptyState();
  if (!raw || typeof raw !== "object") return base;
  return {
    redirects: raw.redirects ?? base.redirects,
    hidden: raw.hidden ?? base.hidden,
    noindex: raw.noindex ?? base.noindex,
    overrides: raw.overrides ?? base.overrides,
    newRooms: raw.newRooms ?? base.newRooms,
  };
}

// ───────────────────────── Upstash Redis (REST) ─────────────────────────

const REDIS_KEY = "tuchat:admin";

function upstashEnabled(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

async function upstashCommand(command: (string | number)[]): Promise<unknown> {
  const res = await fetch(process.env.UPSTASH_REDIS_REST_URL as string, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Upstash ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { result: unknown };
  return data.result;
}

const redisBackend: Backend = {
  async read() {
    const raw = (await upstashCommand(["GET", REDIS_KEY])) as string | null;
    return normalize(raw ? (JSON.parse(raw) as Partial<AdminState>) : null);
  },
  async write(state) {
    await upstashCommand(["SET", REDIS_KEY, JSON.stringify(state)]);
  },
};

// ───────────────────────── Fichero local ─────────────────────────

function filePath(): string {
  return process.env.ADMIN_STORE_FILE || join(process.cwd(), ".data", "admin.json");
}

const fileBackend: Backend = {
  async read() {
    try {
      return normalize(JSON.parse(await fs.readFile(filePath(), "utf8")) as Partial<AdminState>);
    } catch {
      return emptyState();
    }
  },
  async write(state) {
    const file = filePath();
    await fs.mkdir(dirname(file), { recursive: true });
    const tmp = `${file}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(state, null, 2));
    await fs.rename(tmp, file);
  },
};

function backend(): Backend {
  return upstashEnabled() ? redisBackend : fileBackend;
}

// ───────────────────────── API pública ─────────────────────────

export function getAdminState(): Promise<AdminState> {
  return backend().read();
}

// Lee, aplica el mutador y persiste el documento completo.
async function mutate(fn: (s: AdminState) => void): Promise<AdminState> {
  const b = backend();
  const state = await b.read();
  fn(state);
  await b.write(state);
  return state;
}

export function setRedirect(from: string, to: string): Promise<AdminState> {
  return mutate((s) => {
    s.redirects[from] = to;
  });
}

export function removeRedirect(from: string): Promise<AdminState> {
  return mutate((s) => {
    delete s.redirects[from];
  });
}

function toggle(list: string[], slug: string): string[] {
  return list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
}

export function toggleHidden(slug: string): Promise<AdminState> {
  return mutate((s) => {
    s.hidden = toggle(s.hidden, slug);
  });
}

export function toggleNoindex(slug: string): Promise<AdminState> {
  return mutate((s) => {
    s.noindex = toggle(s.noindex, slug);
  });
}

export function saveOverride(slug: string, patch: Partial<Place>): Promise<AdminState> {
  return mutate((s) => {
    s.overrides[slug] = { ...s.overrides[slug], ...patch };
  });
}

export function createRoom(place: Place): Promise<AdminState> {
  return mutate((s) => {
    if (s.newRooms.some((r) => r.slug === place.slug)) {
      throw new Error(`La sala "${place.slug}" ya existe en newRooms`);
    }
    s.newRooms.push(place);
  });
}

export function deleteRoom(slug: string): Promise<AdminState> {
  return mutate((s) => {
    s.newRooms = s.newRooms.filter((r) => r.slug !== slug);
  });
}
