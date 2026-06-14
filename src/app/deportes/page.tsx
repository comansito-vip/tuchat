import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { RoomCard } from "@/components/home/RoomCard";
import { FAQBlock } from "@/components/room/FAQBlock";
import { getChildren, getPlace } from "@/data";
import { breadcrumbJsonLd, JsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Chat de deportes y fútbol: salas por equipo",
  description:
    "Vive cada partido en el chat de deportes: salas del Real Madrid, FC Barcelona, Boca, River, Club América, Fórmula 1 y más. Entra gratis y debate con otros aficionados.",
  alternates: { canonical: "/deportes" },
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
      <Breadcrumbs crumbs={crumbs} />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <h1 className="mt-4 text-3xl font-extrabold text-ink">Chat de deportes y fútbol</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Liga, Champions, Libertadores, Fórmula 1 y mucho más. Comenta cada jornada en directo,
        defiende a tu equipo y conoce gente que vive el deporte con la misma pasión que tú.
      </p>
      <div className="mt-4">
        <Button href="/webchat?canal=deportes">Entrar al chat de deportes</Button>
      </div>

      <section className="mt-8">
        <SectionTitle>Salas por equipo y categoría</SectionTitle>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {ranking.map((p) => (
            <RoomCard key={p.slug} place={p} />
          ))}
        </div>
      </section>

      <FAQBlock items={FAQ} />
    </main>
  );
}
