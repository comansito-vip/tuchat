import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCountries, getPlace } from "@/data";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { RankingTable } from "@/components/home/RankingTable";
import { NickInput } from "@/components/ui/NickInput";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FAQBlock } from "@/components/room/FAQBlock";
import { getRankingByCountry, getCountryRankPosition } from "@/lib/ranking";
import { collectionJsonLd, faqJsonLd, itemListJsonLd, JsonLd, OG_BASE } from "@/lib/seo";

// Ranking por país: superficie SEO para búsquedas tipo "ranking de chat de
// México" / "mejores salas de chat en Argentina" que /ranking (genérico) no
// captura. Reutiliza getVoteCounts, así que refleja los mismos votos.
export const revalidate = 300;

export function generateStaticParams() {
  return getCountries().map((c) => ({ pais: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  const place = getPlace(pais);
  if (!place || place.kind !== "pais") return {};

  // Con las salas que de verdad encabezan el ranking del país. La frase
  // anterior era idéntica en los 30 países salvo el nombre y no adelantaba nada
  // de lo que hay dentro.
  const top = (await getRankingByCountry(pais)).slice(0, 4).map((p) => p.name);
  const descripcionRanking = top.length
    ? `Las salas de chat más votadas de ${place.name}: ${top.join(", ")} y el resto del ranking, con los votos de la comunidad.`
    : `Las salas de chat más votadas de ${place.name}: ciudades con más gente conectada y más votos de la comunidad, actualizado en tiempo real.`;

  return {
    // Sin el "· Mejores salas" del final: sumado al sufijo "· TuChat" de la
    // plantilla, los países de nombre largo (República Dominicana, Guinea
    // Ecuatorial) se pasaban de los 60 caracteres que muestra Google.
    title: `Ranking: mejores chats de ${place.name}`,
    description: descripcionRanking,
    alternates: { canonical: `/ranking/${pais}` },
    openGraph: { ...OG_BASE, url: `/ranking/${pais}` },
  };
}

export default async function RankingCountryPage({
  params,
}: {
  params: Promise<{ pais: string }>;
}) {
  const { pais } = await params;
  const place = getPlace(pais);
  if (!place || place.kind !== "pais") notFound();

  const [ranking, position] = await Promise.all([
    getRankingByCountry(pais, 20),
    getCountryRankPosition(pais),
  ]);

  const crumbs = [
    { name: "Inicio", url: "/" },
    { name: "Ranking", url: "/ranking" },
    { name: place.name, url: `/ranking/${pais}` },
  ];

  const faq = [
    {
      q: `¿Cuál es la sala de chat más votada de ${place.name}?`,
      a:
        ranking.length > 0
          ? `Ahora mismo ${ranking[0].name} encabeza el ranking de ${place.name}, con ${ranking[0].votes.toLocaleString("es")} votos de la comunidad.`
          : `El chat general de ${place.name} es el punto de partida; sus ciudades todavía no tienen suficientes votos para un ranking propio.`,
    },
    {
      q: `¿Cómo se calcula este ranking de ${place.name}?`,
      a: `Se suman los votos que la comunidad da a cada sala de ${place.name} (uno por IP) más su actividad reciente. Se actualiza cada cinco minutos.`,
    },
    {
      q: `¿Qué puesto ocupa ${place.name} en el ranking general de países?`,
      a: `${place.name} está en el puesto ${position} del ranking general de países de TuChat por votos totales.`,
    },
    {
      q: `¿Puedo votar por una sala de ${place.name}?`,
      a: `Sí, desde la página de cualquier sala de ${place.name}. El voto es gratuito, sin registro, y cuenta uno por IP para evitar manipular el ranking.`,
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <JsonLd data={collectionJsonLd(`Ranking de chat de ${place.name}`, `/ranking/${pais}`)} />
      <JsonLd data={faqJsonLd(faq)} />
      <JsonLd data={itemListJsonLd(ranking.map((r) => ({ url: `/chat/${r.slug}`, name: `Chat ${r.name}` })))} />
      <Breadcrumbs crumbs={crumbs} />

      <h1 className="mt-4 text-3xl font-extrabold text-ink">
        Ranking de chat de {place.name}
      </h1>
      <p className="mt-2 max-w-2xl text-muted">
        Las salas de {place.name} más votadas por la comunidad, ordenadas por actividad y
        votos en tiempo real. {place.name} ocupa el puesto {position} del ranking general de
        países.
      </p>
      <div className="mt-4 max-w-sm">
        <NickInput canal={pais} placeholder={`Tu nick para el chat de ${place.name}...`} />
      </div>

      <section className="mt-8">
        <SectionTitle>Ciudades de {place.name} más votadas</SectionTitle>
        {ranking.length > 0 ? (
          <RankingTable ranking={ranking} />
        ) : (
          <p className="mt-4 text-sm text-muted">
            Todavía no hay suficientes votos entre las ciudades de {place.name} para un
            ranking propio.{" "}
            <Link href={`/chat/${pais}`} className="font-semibold text-blue hover:underline">
              Entra al chat de {place.name} →
            </Link>
          </p>
        )}
      </section>

      <p className="mt-8 text-sm text-muted">
        <Link href="/ranking" className="font-semibold text-blue hover:underline">
          ← Ver el ranking general de todas las salas
        </Link>
      </p>

      <FAQBlock items={faq} />
    </main>
  );
}
