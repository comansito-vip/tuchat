import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { NickInput } from "@/components/ui/NickInput";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { faqJsonLd, collectionJsonLd, itemListJsonLd, JsonLd, OG_BASE } from "@/lib/seo";
import { RoomGrid } from "@/components/ui/RoomGrid";
import { FAQBlock } from "@/components/room/FAQBlock";
import { getChildren, getPlace } from "@/data";
import { getLeagues } from "@/lib/teams";
import { TeamCard } from "@/components/deportes/TeamCard";

export const metadata: Metadata = {
  title: "Chat de deportes y fútbol: salas por equipo",
  description:
    "Vive el fútbol en el chat de deportes: salas del Real Madrid, FC Barcelona, Boca, River, Club América y más. Entra gratis y debate con otros aficionados.",
  alternates: { canonical: "/deportes" },
  openGraph: { ...OG_BASE, url: "/deportes" },
};

const crumbs = [
  { name: "Inicio", url: "/" },
  { name: "Deportes", url: "/deportes" },
];

const FAQ = [
  {
    q: "¿Qué salas de deportes puedo encontrar?",
    a: "Una sala general de deportes y de fútbol, salas por equipo (Real Madrid, FC Barcelona, Atlético, Boca Juniors, River Plate, Club América) y una sala dedicada a la Fórmula 1.",
  },
  {
    q: "¿Se comentan los partidos en directo?",
    a: "Sí. Las salas se animan especialmente durante los partidos y grandes premios: se comentan jugadas, polémicas del VAR y resultados al minuto.",
  },
  {
    q: "¿Puedo entrar siendo de cualquier equipo?",
    a: "Por supuesto. Hay pique sano entre aficiones, pero se viene a debatir con respeto. Elige tu sala y entra gratis sin registro.",
  },
  {
    q: "¿Hay clasificaciones de ligas en TuChat?",
    a: "Sí. La sección de resultados de TuChat muestra clasificaciones actualizadas de LaLiga, Premier League, Serie A, Bundesliga, Liga MX, Ligue 1 y más. Puedes consultarlas en la sección de resultados deportivos.",
  },
];

export default function DeportesPage() {
  const slugs = ["deportes", "futbol", "formula-1"];
  const equipos = getChildren("futbol");
  const salas = [...slugs.map(getPlace), ...equipos].filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  );
  // Dedup por slug y ordena por votos.
  const seen = new Set<string>();
  const ranking = salas
    .filter((p) => (seen.has(p.slug) ? false : seen.add(p.slug)))
    .sort((a, b) => b.votes - a.votes);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <JsonLd data={faqJsonLd(FAQ)} />
      <JsonLd data={collectionJsonLd("Deportes", "/deportes")} />
      <JsonLd data={itemListJsonLd(ranking.map((p) => ({ url: `/chat/${p.slug}`, name: `Chat ${p.name}` })))} />
      <Breadcrumbs crumbs={crumbs} />

      {/* Hero deportes */}
      <div className="relative mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-900 p-8 text-white">
        <span
          className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 select-none text-[8rem] opacity-10 sm:block"
          aria-hidden="true"
        >
          ⚽
        </span>
        <h1 className="text-3xl font-extrabold">Chat de deportes y fútbol</h1>
        <p className="mt-2 max-w-xl opacity-90">
          Liga, Champions, Libertadores, Fórmula 1 y mucho más. Comenta cada jornada en directo y
          defiende a tu equipo.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <div className="max-w-sm flex-1">
            <NickInput canal="deportes" placeholder="Tu nick para el chat de deportes..." variant="onColor" />
          </div>
          <Button href="/resultados/laliga" variant="secondary">Ver resultados →</Button>
        </div>
      </div>

      {/* Salas de chat deportivas */}
      <section className="mt-10">
        <SectionTitle>Salas por equipo y categoría</SectionTitle>
        <RoomGrid places={ranking} />
      </section>

      {/* Equipos por liga */}
      <section className="mt-10">
        <SectionTitle>Equipos por liga</SectionTitle>
        <div className="mt-4 space-y-3">
          {getLeagues().map((league) => (
            <details key={league.slug} className="group rounded-xl border border-line bg-card">
              <summary className="flex cursor-pointer items-center justify-between px-5 py-3 font-semibold text-ink hover:text-blue">
                {league.name}
                <span className="ml-2 text-muted group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="grid grid-cols-2 gap-2 px-4 pb-4 pt-2 sm:grid-cols-3 lg:grid-cols-5">
                {league.teams.map((team) => (
                  <TeamCard key={team.name} team={team} />
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>

      <FAQBlock items={FAQ} />
    </main>
  );
}
