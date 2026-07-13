import { NextResponse } from "next/server";
import { getPlace } from "@/data";
import { getVoteCounts, hasVoted, incrementVote, markVoted } from "@/lib/votes-store";

// El store en fichero usa fs; forzamos runtime Node y sin cache.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Cloudflare (proxied, ver project_production_deploy) inyecta la IP real del
// visitante en CF-Connecting-IP; sin eso, x-forwarded-for (primer salto) de
// nginx. "unknown" agrupa a quien no traiga ninguna (un solo voto compartido,
// caso raro sin proxy delante).
function clientIp(req: Request): string {
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf;
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return "unknown";
}

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

  const ip = clientIp(req);
  if (await hasVoted(ip, place.slug)) {
    const counts = await getVoteCounts();
    return NextResponse.json(
      { slug: place.slug, votes: place.votes + (counts[place.slug] ?? 0), alreadyVoted: true },
      { status: 409 },
    );
  }

  const inc = await incrementVote(place.slug);
  await markVoted(ip, place.slug);
  return NextResponse.json({ slug: place.slug, votes: place.votes + inc });
}
