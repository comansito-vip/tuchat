import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPlace, getCountries, getCities, getTopics, getChildren } from "@/data";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { RoomCard } from "@/components/home/RoomCard";
import { RoomInfoPanel } from "@/components/room/RoomInfoPanel";
import { LeagueStandings } from "@/components/room/LeagueStandings";
import { TEAM_LEAGUE, getLeague } from "@/lib/sports";
import { SEOTextBlock } from "@/components/room/SEOTextBlock";
import { RelatedRooms } from "@/components/room/RelatedRooms";
import { FAQBlock } from "@/components/room/FAQBlock";
import { buildRoomCrumbs, buildFaq, aboutLead, roomBullets } from "./copy";

export function generateStaticParams() {
  return [...getCountries(), ...getCities(), ...getTopics()].map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const place = getPlace(slug);
  if (!place) return {};
  return {
    title: `Chat ${place.name} gratis`,
    description: place.intro,
    alternates: { canonical: `/chat/${place.slug}` },
  };
}

export default async function ChatRoomPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const place = getPlace(slug);
  if (!place) notFound();

  const crumbs = buildRoomCrumbs(place);
  const faq = buildFaq(place);
  const bullets = roomBullets(place);
  const aboutText = place.about ?? place.intro;
  const extraLead = aboutLead(place);
  const children = getChildren(place.slug);
  const childrenTitle =
    place.kind === "pais" ? `Ciudades de ${place.name}` : `Más salas de ${place.name}`;

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      {/* Breadcrumbs */}
      <Breadcrumbs crumbs={crumbs} />

      {/* Hero */}
      <h1 className="mt-4 text-3xl font-extrabold text-ink">
        Chat {place.name} gratis
      </h1>
      <p className="mt-2 max-w-2xl text-muted">{place.intro}</p>
      <div className="mt-4">
        <Button href={"/webchat?canal=" + place.slug}>
          Entrar al chat de {place.name}
        </Button>
      </div>

      {/* Two-column body */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* LEFT column */}
        <div>
          {/* Block 1: Sobre el chat */}
          <SEOTextBlock title={`Sobre el chat de ${place.name}`}>
            <p>{aboutText}</p>
            <p>{extraLead}</p>
          </SEOTextBlock>

          {/* Block 2: Qué puedes encontrar */}
          <SEOTextBlock title="Qué puedes encontrar en esta sala">
            <p>
              {place.kind === "ciudad" &&
                `Más que una sala de chat, es el punto de encuentro digital de ${place.name}. Aquí la gente no viene solo a pasar el rato: viene a conectar con alguien cercano.`}
              {place.kind === "pais" &&
                `Una sala con la diversidad y el volumen de un país entero. La conversación nunca para porque siempre hay alguien en una franja horaria diferente dispuesto a charlar.`}
              {place.kind === "tematica" &&
                `Una sala centrada en lo que importa: el tema. Sin ruido de fondo, sin conversaciones que se van por las ramas, solo gente con el mismo interés que tú.`}
            </p>
            <ul className="list-inside list-disc space-y-1">
              {bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </SEOTextBlock>

          {/* Block 3: Consejos de seguridad (same across rooms, genuinely useful) */}
          <SEOTextBlock title="Consejos para chatear con seguridad">
            <p>
              Chatear es sencillo y seguro si sigues unas normas básicas. Usa siempre tu nick de
              invitado en lugar de tu nombre real, y nunca compartas datos personales como dirección,
              teléfono o contraseñas con alguien que acabas de conocer.
            </p>
            <p>
              Desconfía de enlaces que lleguen por chat, especialmente si te los envía alguien que
              no conoces: pueden redirigirte a páginas maliciosas. Si ves comportamientos abusivos o
              acoso, usa el botón de reporte para que los moderadores puedan actuar.
            </p>
          </SEOTextBlock>

          {/* News and weather teasers */}
          <section className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-line bg-card p-4">
              <h3 className="font-semibold text-ink">Noticias de {place.name}</h3>
              <p className="mt-1 text-sm text-muted">
                Mantente al día con las últimas noticias relacionadas con {place.name}.
              </p>
              <Link
                href="/noticias"
                className="mt-2 inline-block text-sm font-medium text-blue hover:underline"
              >
                Ver noticias →
              </Link>
            </div>
            <div className="rounded-xl border border-line bg-card p-4">
              <h3 className="font-semibold text-ink">Tiempo en {place.name}</h3>
              <p className="mt-1 text-sm text-muted">
                Consulta la previsión del tiempo para planificar tu día en {place.name}.
              </p>
              <Link
                href={`/tiempo/${place.slug}`}
                className="mt-2 inline-block text-sm font-medium text-blue hover:underline"
              >
                Ver el tiempo →
              </Link>
            </div>
          </section>
        </div>

        {/* RIGHT column — info panel (sticky on lg) */}
        <aside className="self-start lg:sticky lg:top-20 space-y-4">
          <RoomInfoPanel place={place} />
          {TEAM_LEAGUE[place.slug] && (
            <LeagueStandings
              liga={TEAM_LEAGUE[place.slug]}
              leagueName={getLeague(TEAM_LEAGUE[place.slug])?.name ?? ""}
            />
          )}
        </aside>
      </div>

      {/* Child rooms (cities of a country / sub-rooms of a topic) */}
      {children.length > 0 && (
        <section className="mt-10">
          <SectionTitle>{childrenTitle}</SectionTitle>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {children.map((c) => (
              <RoomCard key={c.slug} place={c} />
            ))}
          </div>
        </section>
      )}

      {/* Related rooms */}
      <section className="mt-10">
        <SectionTitle>Salas relacionadas</SectionTitle>
        <RelatedRooms slugs={place.related} />
      </section>

      {/* FAQ */}
      <FAQBlock items={faq} />
    </main>
  );
}
