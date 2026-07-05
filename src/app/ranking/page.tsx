import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { RankingTable } from "@/components/home/RankingTable";
import { NickInput } from "@/components/ui/NickInput";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getGlobalRanking, getRankingByKind } from "@/lib/ranking";
import { FAQBlock } from "@/components/room/FAQBlock";
import { collectionJsonLd, faqJsonLd, itemListJsonLd, JsonLd, OG_BASE } from "@/lib/seo";

// Refleja los votos de la comunidad; se regenera cada 5 min (prerenderizable
// e indexable en el sitemap, a diferencia de force-dynamic).
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Ranking de salas de chat",
  description:
    "Las salas de chat más votadas y activas de TuChat: ranking general, por país, por ciudad y temática. Descubre cuáles tienen más gente conectada ahora mismo.",
  alternates: { canonical: "/ranking" },
  openGraph: { ...OG_BASE, url: "/ranking" },
};

const crumbs = [
  { name: "Inicio", url: "/" },
  { name: "Ranking", url: "/ranking" },
];

const FAQ = [
  {
    q: "¿Cómo se calcula el ranking de salas de chat?",
    a: "El ranking combina los votos de la comunidad con el número de usuarios conectados en tiempo real. Las salas con más actividad y más votos acumulados aparecen más arriba en la lista.",
  },
  {
    q: "¿Con qué frecuencia se actualiza el ranking?",
    a: "El ranking se regenera cada cinco minutos para reflejar los cambios de actividad. En eventos especiales —partidos de fútbol, debates de actualidad, estrenos— algunas salas pueden subir rápidamente.",
  },
  {
    q: "¿Puedo votar por mi sala favorita?",
    a: "Sí. Desde la página de cualquier sala puedes emitir tu voto y contribuir a subir su posición en el ranking. Los votos son anónimos y no requieren registro previo.",
  },
  {
    q: "¿Qué sala tiene más usuarios en este momento?",
    a: "Las salas de España, México, Argentina y las temáticas de ligar y fútbol suelen liderar el ranking general. El ranking en tiempo real muestra la posición exacta de cada sala ahora mismo.",
  },
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
      <JsonLd data={collectionJsonLd("Ranking de salas", "/ranking")} />
      <JsonLd data={faqJsonLd(FAQ)} />
      <JsonLd data={itemListJsonLd(general.map((r) => ({ url: `/chat/${r.slug}`, name: `Chat ${r.name}` })))} />
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

      <FAQBlock items={FAQ} />
    </main>
  );
}
