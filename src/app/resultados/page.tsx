import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { LEAGUES, getLeague, getStandings, getFixtures } from "@/lib/sports";

// Datos en vivo: render bajo demanda.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Resultados y clasificaciones de fútbol",
  description:
    "Clasificaciones al día de LaLiga, Premier League, Serie A y Liga MX. Comenta cada jornada en el chat de deportes de TuChat.",
  alternates: { canonical: "/resultados" },
};

export default async function ResultadosPage({
  searchParams,
}: {
  searchParams: Promise<{ liga?: string }>;
}) {
  const { liga } = await searchParams;
  const slug = getLeague(liga ?? "") ? (liga as string) : "laliga";
  const league = getLeague(slug)!;
  const [{ rows, source }, fixtures] = await Promise.all([
    getStandings(slug),
    getFixtures(slug),
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
    { name: "Resultados", url: "/resultados" },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <Breadcrumbs crumbs={crumbs} />
      <h1 className="mt-4 text-3xl font-extrabold text-ink">Resultados y clasificaciones</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Sigue la clasificación al día de las grandes ligas y comenta la jornada en directo con
        otros aficionados.
      </p>

      {/* Selector de liga */}
      <div className="mt-4 flex flex-wrap gap-2">
        {LEAGUES.map((l) => (
          <Link
            key={l.slug}
            href={`/resultados?liga=${l.slug}`}
            className={
              "rounded-full border px-3 py-1.5 text-sm font-medium " +
              (l.slug === slug
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

      <div className="mt-8">
        <Button href="/webchat?canal=futbol">Entrar al chat de fútbol</Button>
      </div>
    </main>
  );
}
