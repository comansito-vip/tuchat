import { NextResponse } from "next/server";
import { getPlace } from "@/data";
import { getVoteCounts, incrementVote } from "@/lib/votes-store";

// El store en fichero usa fs; forzamos runtime Node y sin cache.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/vote?slug=madrid → conteo actual (base + votos persistidos).
export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug");
  const place = slug ? getPlace(slug) : undefined;
  if (!place) return NextResponse.json({ error: "sala no encontrada" }, { status: 404 });

  const counts = await getVoteCounts();
  return NextResponse.json({ slug: place.slug, votes: place.votes + (counts[place.slug] ?? 0) });
}

// POST { slug } → suma un voto y devuelve el nuevo conteo.
export async function POST(req: Request) {
  let slug: unknown;
  try {
    ({ slug } = await req.json());
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const place = typeof slug === "string" ? getPlace(slug) : undefined;
  if (!place) return NextResponse.json({ error: "sala no encontrada" }, { status: 404 });

  const inc = await incrementVote(place.slug);
  return NextResponse.json({ slug: place.slug, votes: place.votes + inc });
}
