import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { RankingTable } from "@/components/home/RankingTable";

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

export default function RankingPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <Breadcrumbs crumbs={crumbs} />
      <h1 className="mt-4 text-3xl font-extrabold text-ink">Ranking de salas</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Las salas más votadas por la comunidad. El ranking se actualiza en tiempo real según la
        actividad y los votos de los usuarios.
      </p>
      <div className="mt-6">
        <RankingTable />
      </div>
    </main>
  );
}
