/**
 * Almacenamiento de votos de salas (Fase 3). Capa conectable:
 *
 *  - Si hay UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN → Upstash Redis
 *    (serverless, durable, recomendado en producción).
 *  - En caso contrario → fichero JSON en .data/votes.json (funciona en local y
 *    en `next start` con disco persistente; NO durable en serverless efímero).
 *
 * Los votos guardados son INCREMENTOS sobre el conteo base estático de cada sala.
 * El conteo mostrado = place.votes (base) + incremento almacenado.
 */
import { promises as fs } from "node:fs";
import { join } from "node:path";

export type VoteCounts = Record<string, number>;

interface VotesStore {
  increment(slug: string): Promise<number>;
  getAll(): Promise<VoteCounts>;
}

// ───────────────────────── Upstash Redis (REST) ─────────────────────────

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

const redisStore: VotesStore = {
  async increment(slug) {
    return Number(await upstashCommand(["HINCRBY", "tuchat:votes", slug, 1]));
  },
  async getAll() {
    // HGETALL devuelve [campo1, valor1, campo2, valor2, ...]
    const flat = (await upstashCommand(["HGETALL", "tuchat:votes"])) as string[] | null;
    const counts: VoteCounts = {};
    if (Array.isArray(flat)) {
      for (let i = 0; i < flat.length; i += 2) counts[flat[i]] = Number(flat[i + 1]);
    }
    return counts;
  },
};

// ───────────────────────── Fichero local ─────────────────────────

const FILE = join(process.cwd(), ".data", "votes.json");

async function readFileCounts(): Promise<VoteCounts> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as VoteCounts;
  } catch {
    return {};
  }
}

const fileStore: VotesStore = {
  async increment(slug) {
    const counts = await readFileCounts();
    counts[slug] = (counts[slug] ?? 0) + 1;
    await fs.mkdir(join(process.cwd(), ".data"), { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(counts));
    return counts[slug];
  },
  async getAll() {
    return readFileCounts();
  },
};

// ───────────────────────── Selección ─────────────────────────

function store(): VotesStore {
  return upstashEnabled() ? redisStore : fileStore;
}

/** Suma un voto a la sala y devuelve su nuevo incremento. */
export function incrementVote(slug: string): Promise<number> {
  return store().increment(slug);
}

/** Devuelve los incrementos de voto por slug. */
export function getVoteCounts(): Promise<VoteCounts> {
  return store().getAll();
}
