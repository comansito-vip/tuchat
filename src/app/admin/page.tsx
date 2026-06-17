import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { RankingTable } from "@/components/home/RankingTable";
import { RedirectsManager } from "@/components/admin/RedirectsManager";
import { VisibilityManager } from "@/components/admin/VisibilityManager";
import { RoomManager } from "@/components/admin/RoomManager";
import { CONTINENTS, getChildren, getStats, getNews } from "@/data";

// Panel interno: no indexar.
export const metadata: Metadata = {
  title: "Panel de control · TuChat",
  robots: { index: false, follow: false },
};

const crumbs = [
  { name: "Inicio", url: "/" },
  { name: "Panel", url: "/admin" },
];

function Kpi({ label, value }: { label: string; value: number | string }) {
  return (
    <Card className="p-4">
      <div className="text-2xl font-extrabold text-ink">{value}</div>
      <div className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">{label}</div>
    </Card>
  );
}

export default function AdminPage() {
  const s = getStats();
  const news = getNews();
  const fmt = (n: number) => n.toLocaleString("es-ES");

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <Breadcrumbs crumbs={crumbs} />
      <h1 className="mt-4 text-3xl font-extrabold text-ink">Panel de control</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Vista interna de estadísticas, rankings e inventario de contenido. Solo lectura: las
        acciones de edición requieren backend con autenticación (ver más abajo).
      </p>

      {/* KPIs */}
      <section className="mt-8">
        <SectionTitle>Resumen</SectionTitle>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Kpi label="Salas totales" value={fmt(s.rooms)} />
          <Kpi label="Países" value={fmt(s.countries)} />
          <Kpi label="Ciudades" value={fmt(s.cities)} />
          <Kpi label="Temáticas" value={fmt(s.topics)} />
          <Kpi label="Noticias" value={fmt(s.news)} />
          <Kpi label="Votos totales" value={fmt(s.totalVotes)} />
        </div>
      </section>

      {/* Ranking */}
      <section className="mt-10">
        <SectionTitle>Top salas por votos</SectionTitle>
        <RankingTable />
      </section>

      {/* Inventario por continente */}
      <section className="mt-10">
        <SectionTitle>Países y ciudades por región</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CONTINENTS.map((cont) => (
            <Card key={cont.title} className="p-4">
              <h3 className="font-semibold text-ink">{cont.title}</h3>
              <ul className="mt-2 space-y-1 text-sm">
                {cont.places.map((p) => {
                  const cities = getChildren(p.slug).length;
                  return (
                    <li key={p.slug} className="flex justify-between gap-2">
                      <Link href={`/pais/${p.slug}`} className="text-blue-dark hover:underline">
                        {p.name}
                      </Link>
                      <span className="text-muted">{cities} ciudades</span>
                    </li>
                  );
                })}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      {/* Noticias recientes */}
      <section className="mt-10">
        <SectionTitle>Últimas noticias</SectionTitle>
        <Card className="divide-y divide-line">
          {news.slice(0, 8).map((n) => (
            <div key={n.slug} className="flex items-start justify-between gap-4 p-4">
              <div>
                <div className="font-medium text-ink">{n.title}</div>
                <div className="mt-0.5 text-xs text-muted">
                  {n.category} · {n.date}
                  {n.featured && " · destacada"}
                </div>
              </div>
            </div>
          ))}
        </Card>
      </section>

      {/* Redirecciones 301 (URLs antiguas → salas) */}
      <section className="mt-10">
        <SectionTitle>Redirecciones 301</SectionTitle>
        <Card className="p-5">
          <p className="mb-4 text-sm text-muted">
            Redirige slugs antiguos del viejo tuchat hacia su sala equivalente. Se aplican como 301
            permanentes en <code>/chat/&lt;slug&gt;</code>.
          </p>
          <RedirectsManager />
        </Card>
      </section>

      {/* Visibilidad e indexación */}
      <section className="mt-10">
        <SectionTitle>Visibilidad e indexación</SectionTitle>
        <Card className="p-5">
          <p className="mb-5 text-sm text-muted">
            Controla qué salas aparecen en el directorio y cuáles indexan los buscadores. Los
            cambios se aplican en tiempo real sin redeploy.
          </p>
          <VisibilityManager />
        </Card>
      </section>

      {/* Editar / crear salas */}
      <section className="mt-10">
        <SectionTitle>Editar y crear salas</SectionTitle>
        <Card className="p-5">
          <p className="mb-5 text-sm text-muted">
            Sobreescribe campos de salas existentes (override en runtime) o crea landings nuevas.
            Las salas base de los ficheros TS nunca se modifican.
          </p>
          <RoomManager />
        </Card>
      </section>

      {/* Acciones aún pendientes */}
      <section className="mt-10">
        <SectionTitle>Próximas fases</SectionTitle>
        <Card className="p-5 text-sm text-muted">
          <ul className="list-inside list-disc space-y-1">
            <li>Regeneración de noticias desde el panel (fase D)</li>
          </ul>
          <p className="mt-3">
            La regeneración de noticias ya está disponible vía <code>npm run generate:news</code>{" "}
            (pipeline multi-LLM con fallback).
          </p>
        </Card>
      </section>
    </main>
  );
}
