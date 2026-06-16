import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { Place } from "@/data/types";
import * as store from "@/lib/admin-store";

// El store en fichero usa fs; forzamos runtime Node y sin cache.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function str(v: unknown): string {
  if (typeof v !== "string" || !v.trim()) throw new Error("falta un campo de texto requerido");
  return v;
}

// GET /api/admin → estado actual del panel (para la UI).
export async function GET() {
  return NextResponse.json(await store.getAdminState());
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
      case "regenNews":
        return NextResponse.json(
          { error: "regeneración de noticias no soportada en este entorno" },
          { status: 501 }
        );
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
