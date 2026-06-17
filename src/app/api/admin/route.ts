import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { spawnSync } from "node:child_process";
import type { Place } from "@/data/types";
import * as store from "@/lib/admin-store";

// El store en fichero usa fs; forzamos runtime Node y sin cache.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Estado del último intento de regeneración (en memoria; se pierde en restart).
export interface RegenStatus {
  startedAt: string;
  finishedAt?: string;
  status: "ok" | "error";
  duration?: number;
  error?: string;
}
let lastRegen: RegenStatus | null = null;

function str(v: unknown): string {
  if (typeof v !== "string" || !v.trim()) throw new Error("falta un campo de texto requerido");
  return v;
}

// GET /api/admin → estado actual del panel (para la UI).
export async function GET() {
  return NextResponse.json({ ...(await store.getAdminState()), lastRegen });
}

// POST { action, ...payload } → muta el estado y revalida.
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const action = body.action;
  try {
    switch (action) {
      case "setRedirect":
        await store.setRedirect(str(body.from), str(body.to));
        break;
      case "removeRedirect":
        await store.removeRedirect(str(body.from));
        break;
      case "toggleHidden":
        await store.toggleHidden(str(body.slug));
        break;
      case "toggleNoindex":
        await store.toggleNoindex(str(body.slug));
        break;
      case "saveRoom":
        await store.saveOverride(str(body.slug), (body.patch ?? {}) as Partial<Place>);
        break;
      case "createRoom":
        await store.createRoom(body.room as Place);
        break;
      case "deleteRoom":
        await store.deleteRoom(str(body.slug));
        break;
      case "regenNews": {
        const startedAt = new Date().toISOString();
        const t0 = Date.now();

        const result = spawnSync("npx", ["tsx", "scripts/generate-news.ts"], {
          cwd: process.cwd(),
          timeout: 180_000,
          encoding: "utf8",
        });

        const duration = Math.round((Date.now() - t0) / 1000);
        const finishedAt = new Date().toISOString();

        if (result.status === 0) {
          lastRegen = { startedAt, finishedAt, status: "ok", duration };
          return NextResponse.json({ ok: true, duration, lastRegen });
        }

        const errMsg =
          (result.stderr as string)?.trim() ||
          result.error?.message ||
          "proceso terminó con error";
        lastRegen = { startedAt, finishedAt, status: "error", duration, error: errMsg };
        return NextResponse.json({ error: errMsg, lastRegen }, { status: 500 });
      }
      default:
        return NextResponse.json({ error: `acción desconocida: ${String(action)}` }, { status: 400 });
    }
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }

  // Reconstruye las páginas afectadas con el nuevo estado.
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
