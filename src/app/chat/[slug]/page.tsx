import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import {
  getMergedPlace,
  getMergedChildren,
  getMergedRelated,
  getMergedCountries,
  getMergedCities,
  getMergedTopics,
  getRedirectTarget,
  isNoindex,
} from "@/data/merged";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { RoomCard } from "@/components/home/RoomCard";
import { RoomGrid } from "@/components/ui/RoomGrid";
import { RoomHero } from "@/components/room/RoomHero";
import { RoomInfoPanel } from "@/components/room/RoomInfoPanel";
import { LeagueStandings } from "@/components/room/LeagueStandings";
import { TEAM_LEAGUE, getLeague } from "@/lib/sports";
import { SEOTextBlock } from "@/components/room/SEOTextBlock";
import { FAQBlock } from "@/components/room/FAQBlock";
import { buildRoomCrumbs, buildFaq, aboutLead, roomBullets } from "./copy";
import { collectionJsonLd, faqJsonLd, itemListJsonLd, JsonLd, OG_BASE } from "@/lib/seo";

// ISR: el contenido base es estático; las redirecciones/overrides del panel se
// reflejan al revalidar (revalidatePath tras cada escritura del admin).
export const revalidate = 3600;

export async function generateStaticParams() {
  const [countries, cities, topics] = await Promise.all([
    getMergedCountries(),
    getMergedCities(),
    getMergedTopics(),
  ]);
  return [...countries, ...cities, ...topics].map((p) => ({ slug: p.slug }));
}

const ROOM_TITLES: Record<string, string> = {
  amor: "Chat para buscar pareja y conocer gente gratis",
  amistad: "Chat para hacer amigos gratis sin registro",
  ligar: "Chat para ligar gratis en español sin registro",
  adultos: "Chat de adultos gratis sin registro",
  encuentros: "Chat de encuentros gratis sin registro",
};

// Salas heredadas ya se llaman "Chat Terra", "Chat estilo Badoo"...: anteponer
// "Chat" de nuevo duplicaría el prefijo ("Chat Chat Terra gratis").
function withChatPrefix(name: string): string {
  return /^chat\b/i.test(name) ? `${name} gratis` : `Chat ${name} gratis`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const place = await getMergedPlace(slug);
  if (!place) return {};
  return {
    title: ROOM_TITLES[slug] ?? withChatPrefix(place.name),
    description: place.intro,
    alternates: { canonical: `/chat/${place.slug}` },
    openGraph: { ...OG_BASE, url: `/chat/${place.slug}` },
    ...((await isNoindex(slug)) ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function ChatRoomPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const target = await getRedirectTarget(slug);
  if (target) permanentRedirect(`/chat/${target}`);
  const place = await getMergedPlace(slug);
  if (!place) notFound();

  const crumbs = buildRoomCrumbs(place);
  const faq = buildFaq(place);
  const bullets = roomBullets(place);
  const aboutText = place.about ?? place.intro;
  const extraLead = aboutLead(place);
  const [children, related] = await Promise.all([
    getMergedChildren(place.slug),
    getMergedRelated(place.related),
  ]);
  const childrenTitle =
    place.kind === "pais" ? `Ciudades de ${place.name}` : `Más salas de ${place.name}`;

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <JsonLd
        data={collectionJsonLd(
          /^chat\b/i.test(place.name) ? place.name : `Chat de ${place.name}`,
          `/chat/${place.slug}`,
        )}
      />
      <JsonLd data={faqJsonLd(faq)} />
      {children.length > 0 && (
        <JsonLd data={itemListJsonLd(children.map((c) => ({ url: `/chat/${c.slug}`, name: `Chat ${c.name}` })))} />
      )}
      {/* Breadcrumbs */}
      <Breadcrumbs crumbs={crumbs} />

      {/* Hero destacado con CTA principal */}
      <RoomHero place={place} h1={ROOM_TITLES[slug]} />

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
            <ul className="space-y-2">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5">
                  <span
                    className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue/10 text-[11px] font-bold text-blue"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <span>{b}</span>
                </li>
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

          {/* Salas relacionadas (encima de noticias) */}
          {related.length > 0 && (
            <section id="relacionadas" className="mt-8">
              <SectionTitle>Otras salas que te pueden gustar</SectionTitle>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {related.slice(0, 6).map((r) => (
                  <RoomCard key={r.slug} place={r} />
                ))}
              </div>
            </section>
          )}

          {/* News, weather and services teasers */}
          <section className="mt-8">
            <SectionTitle>Más sobre {place.name}</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-line bg-card p-4 transition-colors hover:border-blue">
              <div className="text-2xl" aria-hidden="true">📰</div>
              <h3 className="mt-1 font-semibold text-ink">Noticias de {place.name}</h3>
              <p className="mt-1 text-sm text-muted">
                Mantente al día con las últimas noticias relacionadas con {place.name}.
              </p>
              <Link
                href="/noticias"
                className="mt-2 inline-block text-sm font-semibold text-blue hover:underline"
              >
                Ver noticias →
              </Link>
            </div>
            {place.kind !== "tematica" && (
              <div className="rounded-xl border border-line bg-card p-4 transition-colors hover:border-blue">
                <div className="text-2xl" aria-hidden="true">🌤️</div>
                <h3 className="mt-1 font-semibold text-ink">Tiempo en {place.name}</h3>
                <p className="mt-1 text-sm text-muted">
                  Consulta la previsión del tiempo para planificar tu día en {place.name}.
                </p>
                <Link
                  href={`/tiempo/${place.slug}`}
                  className="mt-2 inline-block text-sm font-semibold text-blue hover:underline"
                >
                  Ver el tiempo →
                </Link>
              </div>
            )}
            {place.kind === "pais" && (
              <div className="rounded-xl border border-line bg-card p-4 transition-colors hover:border-blue">
                <div className="text-2xl" aria-hidden="true">🎰</div>
                <h3 className="mt-1 font-semibold text-ink">Loterías de {place.name}</h3>
                <p className="mt-1 text-sm text-muted">
                  Resultados y fechas de los sorteos más populares de {place.name}.
                </p>
                <Link
                  href={`/loterias/${place.slug}`}
                  className="mt-2 inline-block text-sm font-semibold text-blue hover:underline"
                >
                  Ver loterías →
                </Link>
              </div>
            )}
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
          <RoomGrid places={children} />
        </section>
      )}

      {/* FAQ */}
      <FAQBlock items={faq} />
    </main>
  );
}
