import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { NickInput } from "@/components/ui/NickInput";
import { LEAGUES, getLeague, getStandings, getFixtures } from "@/lib/sports";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ liga: string }>;
}): Promise<Metadata> {
  const { liga } = await params;
  const league = getLeague(liga);
  if (!league) return {};
  return {
    title: `Clasificación ${league.name} — resultados en vivo`,
    description: `Clasificación actualizada de ${league.name}. Sigue la jornada en directo y comenta los resultados en el chat de deportes de TuChat.`,
    alternates: { canonical: `/resultados/${liga}` },
  };
}

export default async function ResultadosLigaPage({
  params,
}: {
  params: Promise<{ liga: string }>;
}) {
  const { liga } = await params;
  const league = getLeague(liga);
  if (!league) notFound();

  const [{ rows, source }, fixtures] = await Promise.all([
    getStandings(liga),
    getFixtures(liga),
  ]);

  const dateFmt = new Intl.DateTimeFormat("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const crumbs = [
    { name: "Inicio", url: "/" },
    { name: "Deportes", url: "/deportes" },
    { name: "Resultados", url: "/resultados/laliga" },
    { name: league.name, url: `/resultados/${liga}` },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <Breadcrumbs crumbs={crumbs} />
      <h1 className="mt-4 text-3xl font-extrabold text-ink">
        Clasificación {league.name}
      </h1>
      <p className="mt-2 max-w-2xl text-muted">
        Sigue la clasificación al día y comenta la jornada en directo con otros aficionados.
      </p>

      {/* Selector de liga */}
      <div className="mt-4 flex flex-wrap gap-2">
        {LEAGUES.map((l) => (
          <Link
            key={l.slug}
            href={`/resultados/${l.slug}`}
            className={
              "rounded-full border px-3 py-1.5 text-sm font-medium " +
              (l.slug === liga
                ? "border-blue bg-blue text-white"
                : "border-line bg-card text-blue-dark hover:border-blue")
            }
          >
            {l.name}
          </Link>
        ))}
      </div>

      <section className="mt-6">
        <SectionTitle>{league.name}</SectionTitle>
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase text-muted">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Equipo</th>
                <th className="px-4 py-3 text-center">PJ</th>
                <th className="px-4 py-3 text-center">G</th>
                <th className="px-4 py-3 text-center">E</th>
                <th className="px-4 py-3 text-center">P</th>
                <th className="px-4 py-3 text-center font-bold">Pts</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={`${r.rank}-${r.team}`} className="border-t border-line">
                  <td className="px-4 py-3 text-center text-muted">{r.rank}</td>
                  <td className="px-4 py-3 font-medium text-ink">{r.team}</td>
                  <td className="px-4 py-3 text-center text-muted">{r.played}</td>
                  <td className="px-4 py-3 text-center text-muted">{r.won}</td>
                  <td className="px-4 py-3 text-center text-muted">{r.drawn}</td>
                  <td className="px-4 py-3 text-center text-muted">{r.lost}</td>
                  <td className="px-4 py-3 text-center font-bold text-ink">{r.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <p className="mt-2 text-xs text-muted">
          {source === "reserva"
            ? "Mostrando datos de reserva. Configura una API deportiva para datos en vivo."
            : `Datos en vivo vía ${source}.`}
        </p>
      </section>

      {fixtures.length > 0 && (
        <section className="mt-10">
          <SectionTitle>Próximos partidos</SectionTitle>
          <Card className="divide-y divide-line">
            {fixtures.map((f, i) => (
              <div key={i} className="flex items-center justify-between gap-4 p-4 text-sm">
                <span className="font-medium text-ink">
                  {f.home} <span className="text-muted">vs</span> {f.away}
                </span>
                <span className="shrink-0 text-muted">
                  {(() => {
                    const d = new Date(f.date);
                    return isNaN(d.getTime()) ? "" : dateFmt.format(d);
                  })()}
                </span>
              </div>
            ))}
          </Card>
        </section>
      )}

      <div className="mt-8 max-w-sm">
        <NickInput canal="futbol" placeholder="Tu nick para el chat de fútbol..." />
      </div>
    </main>
  );
}
