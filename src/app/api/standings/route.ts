import { NextResponse } from "next/server";
import { getLeague, getStandings } from "@/lib/sports";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/standings?liga=laliga → clasificación (proveedor con fallback).
export async function GET(req: Request) {
  const liga = new URL(req.url).searchParams.get("liga") ?? "";
  if (!getLeague(liga)) {
    return NextResponse.json({ error: "liga desconocida" }, { status: 404 });
  }
  const result = await getStandings(liga);
  return NextResponse.json(result);
}
