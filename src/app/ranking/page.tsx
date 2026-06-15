import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { RankingTable } from "@/components/home/RankingTable";
import { NickInput } from "@/components/ui/NickInput";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getGlobalRanking, getRankingByKind } from "@/lib/ranking";

// Refleja los votos de la comunidad; se regenera cada 5 min (prerenderizable
// e indexable en el sitemap, a diferencia de force-dynamic).
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Ranking de salas de chat",
  description:
    "Las salas de chat más votadas y activas del momento. Descubre qué canales tienen más gente conectada ahora mismo.",
  alternates: { canonical: "/ranking" },
};

const crumbs = [
  { name: "Inicio", url: "/" },
  { name: "Ranking", url: "/ranking" },
];

export default async function RankingPage() {
  const [general, paises, ciudades, tematicas] = await Promise.all([
    getGlobalRanking(10),
    getRankingByKind("pais", 10),
    getRankingByKind("ciudad", 10),
    getRankingByKind("tematica", 10),
  ]);
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <Breadcrumbs crumbs={crumbs} />
      <h1 className="mt-4 text-3xl font-extrabold text-ink">Ranking de salas</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Las salas más votadas por la comunidad. El ranking se actualiza en tiempo real según la
        actividad y los votos de los usuarios.
      </p>
      <div className="mt-4 max-w-sm">
        <NickInput canal="espana" placeholder="Tu nick para entrar al chat..." />
      </div>

      <section className="mt-8">
        <SectionTitle>General</SectionTitle>
        <RankingTable ranking={general} />
      </section>
      <section className="mt-10">
        <SectionTitle>Por temática</SectionTitle>
        <RankingTable ranking={tematicas} />
      </section>
      <section className="mt-10">
        <SectionTitle>Por país</SectionTitle>
        <RankingTable ranking={paises} />
      </section>
      <section className="mt-10">
        <SectionTitle>Por ciudad</SectionTitle>
        <RankingTable ranking={ciudades} />
      </section>
    </main>
  );
}
