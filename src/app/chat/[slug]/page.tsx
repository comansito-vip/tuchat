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
import { RegionGroupedGrid } from "@/components/ui/RegionGroupedGrid";
import { ProvinciaGroupedGrid } from "@/components/ui/ProvinciaGroupedGrid";
import { getRegions, getCitiesByRegion, roomName, roomTitle } from "@/data";
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



export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const place = await getMergedPlace(slug);
  if (!place) return {};
  return {
    // Título absoluto (sin el sufijo "· TuChat" del template): con ~2.000
    // salas, repetir la marca en cada title era redundante — pedido del
    // cliente 2026-07-13. Mismo patrón que los artículos de noticias.
    title: { absolute: roomTitle(place) },
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
  // España: 893 ciudades reales, agrupadas por comunidad autónoma (con su
  // bandera) en vez de una lista plana. El resto de países ya tienen pocas
  // ciudades y no lo necesitan.
  const groupByRegion = place.slug === "espana" && children.some((c) => c.regionSlug);
  // Países grandes sin comunidades (Argentina, Colombia...): si sus ciudades
  // traen provincia/departamento y son demasiadas para una lista plana, se
  // agrupan por provincia igual que las comunidades españolas.
  const groupByProvincia =
    !groupByRegion &&
    children.length > 30 &&
    children.filter((c) => c.provincia).length >= children.length / 2;
  // Página de una comunidad autónoma (topics-regiones.ts): sus ciudades no
  // cuelgan de ella por parentSlug (todas cuelgan de "espana"), así que se
  // buscan aparte y se agrupan por provincia.
  const isRegion = getRegions().some((r) => r.slug === place.slug);
  const regionCities = isRegion ? getCitiesByRegion(place.slug) : [];

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <JsonLd
        data={collectionJsonLd(
          /^chat\b/i.test(place.name) ? roomName(place) : `Chat de ${roomName(place)}`,
          `/chat/${place.slug}`,
        )}
      />
      <JsonLd data={faqJsonLd(faq)} />
      {children.length > 0 && (
        <JsonLd data={itemListJsonLd(children.map((c) => ({ url: `/chat/${c.slug}`, name: `Chat ${c.name}` })))} />
      )}
      {/* Página de comunidad autónoma: las ciudades no cuelgan de ella por
          parentSlug (cuelgan de "espana"), así que su listado —el contenido
          principal de la página— se quedaba sin ItemList. */}
      {isRegion && regionCities.length > 0 && (
        <JsonLd data={itemListJsonLd(regionCities.map((c) => ({ url: `/chat/${c.slug}`, name: `Chat ${c.name}` })))} />
      )}
      {/* Breadcrumbs */}
      <Breadcrumbs crumbs={crumbs} />

      {/* Hero destacado con CTA principal */}
      <RoomHero place={place} h1={roomTitle(place)} />

      {/* Two-column body */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* LEFT column. min-w-0: sin esto, un grid item hereda min-width:auto
            (su max-content), así que una fila flex sin wrap dentro (ej. el
            input+botón de NickInput en el aside) puede ensanchar toda la
            columna más allá del viewport en móvil. */}
        <div className="min-w-0">
          {/* Block 1: Sobre el chat.
              El H2 sale del propio contenido cuando la sala trae `aboutTitle`
              ("El puerto, la sal y las conversaciones de agosto"). El genérico
              "Sobre el chat de X" repetido en 4.900 páginas es la definición de
              plantilla con hueco, que es lo que Google lee como página puerta;
              se conserva solo para las salas antiguas, que no tienen título
              propio todavía. */}
          <SEOTextBlock title={place.aboutTitle ?? `Sobre el chat de ${place.name}`}>
            {/* El texto puede venir en varios párrafos separados por una línea
                en blanco (las salas que redacta el cron los usan). En un solo
                <p> el salto se colapsa y quedaba un muro de 250 palabras. */}
            {aboutText.split(/\n{2,}/).map((parrafo, i) => (
              <p key={i}>{parrafo}</p>
            ))}
            {/* `aboutLead` devuelve null cuando la sala no tiene datos con los
                que decir algo cierto: antes que un párrafo de relleno igual en
                2.000 páginas, ninguno. */}
            {extraLead && <p>{extraLead}</p>}
          </SEOTextBlock>

          {/* Block 2: datos comprobables de la sala (canales reales, salas
              hermanas de su provincia, comunidad). El párrafo introductorio
              genérico que había aquí era uno de tres textos fijos repartidos
              entre las 2.547 salas; se retiró porque no aportaba nada que no
              dijeran ya los propios datos. */}
          <SEOTextBlock title="Qué puedes encontrar en esta sala">
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

          {/* Los dos párrafos de consejos de seguridad que había aquí eran
              idénticos en las 2.547 salas —ni siquiera llevaban el nombre— y
              pesaban tanto como el texto propio de la página. Ahora viven una
              sola vez en /como-funciona, que además puede posicionar por su
              cuenta; la sala solo enlaza. */}
          <p className="mt-8 text-sm text-muted">
            ¿Primera vez en un chat así? En{" "}
            <Link href="/como-funciona" className="font-semibold text-blue hover:underline">
              cómo funciona el chat
            </Link>{" "}
            está explicado cómo entrar sin registro, qué es el nick de invitado y qué precauciones
            conviene tomar al hablar con desconocidos.
          </p>

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
        <aside className="min-w-0 self-start lg:sticky lg:top-20 space-y-4">
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
          {groupByRegion ? (
            <RegionGroupedGrid cities={children} />
          ) : groupByProvincia ? (
            <ProvinciaGroupedGrid cities={children} />
          ) : (
            <RoomGrid places={children} />
          )}
        </section>
      )}

      {/* Ciudades de esta comunidad autónoma, agrupadas por provincia */}
      {isRegion && regionCities.length > 0 && (
        <section className="mt-10">
          <SectionTitle>Ciudades de {place.name}</SectionTitle>
          <ProvinciaGroupedGrid cities={regionCities} />
        </section>
      )}

      {/* FAQ */}
      <FAQBlock items={faq} />
    </main>
  );
}
