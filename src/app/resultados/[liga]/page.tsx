import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { NickInput } from "@/components/ui/NickInput";
import { LEAGUES, getLeague, getStandings, getFixtures } from "@/lib/sports";
import { collectionJsonLd, faqJsonLd, JsonLd, OG_BASE } from "@/lib/seo";
import { FAQBlock } from "@/components/room/FAQBlock";

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
    title: `${league.name} — clasificación y tabla`,
    description: `Clasificación actualizada de ${league.name}. Sigue la jornada en directo y comenta los resultados en el chat de deportes de TuChat.`,
    alternates: { canonical: `/resultados/${liga}` },
    openGraph: { ...OG_BASE, url: `/resultados/${liga}` },
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
    { name: "Resultados", url: "/resultados" },
    { name: league.name, url: `/resultados/${liga}` },
  ];

  const faq = [
    {
      q: `¿Cuándo se actualiza la clasificación de ${league.name}?`,
      a: `La clasificación de ${league.name} se actualiza automáticamente con cada jornada disputada. Los datos en vivo se obtienen de fuentes oficiales y se reflejan en la tabla tan pronto como finaliza cada partido.`,
    },
    {
      q: `¿Dónde puedo comentar los partidos de ${league.name}?`,
      a: `En TuChat puedes comentar los partidos de ${league.name} en el chat de deportes y en las salas de equipos específicos. El acceso es gratuito y sin registro.`,
    },
    {
      q: `¿Qué ligas además de ${league.name} están disponibles?`,
      a: `TuChat cubre ${LEAGUES.map((l) => l.name).join(", ")}. Puedes cambiar de liga usando los botones de selección en la parte superior de la página.`,
    },
    {
      q: `¿Hay salas de chat para los equipos de ${league.name}?`,
      a: `Sí. TuChat tiene salas dedicadas a los principales clubs: Real Madrid, FC Barcelona, Atlético de Madrid, Boca Juniors, River Plate y más. Puedes entrar gratis desde la sección de deportes.`,
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <JsonLd data={collectionJsonLd(league.name, `/resultados/${liga}`)} />
      <JsonLd data={faqJsonLd(faq)} />
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
            ? "Clasificación de referencia de la última jornada disputada; en cuanto el proveedor de datos responde se actualiza sola."
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

      <section className="mt-8 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-900 p-6 text-white">
        <p className="text-sm font-semibold opacity-80">Debate en directo</p>
        <h2 className="mt-1 text-xl font-extrabold">¿Cómo va el partido?</h2>
        <p className="mt-1 text-sm opacity-80">
          Comenta la jornada de {league.name} con otros aficionados en tiempo real.
        </p>
        <div className="mt-4 max-w-sm">
          <NickInput canal="deportes" variant="onColor" placeholder="Tu nick para el chat de deportes..." />
        </div>
      </section>

      <FAQBlock items={faq} />
    </main>
  );
}
