import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { getMergedCountries, getMergedCities } from "@/data/merged";
import { cityFlag, getRegionsOfCountry } from "@/data";
import { getTopicCatalog } from "@/lib/topic-groups";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { RoomCard } from "@/components/home/RoomCard";
import { ChatSearch } from "@/components/chat/ChatSearch";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FAQBlock } from "@/components/room/FAQBlock";
import { Flag } from "@/components/ui/Flag";
import { collectionJsonLd, faqJsonLd, itemListJsonLd, JsonLd, OG_BASE } from "@/lib/seo";

// Página estática: la búsqueda vive en el cliente (ChatSearch), por lo que no se
// lee searchParams en el servidor y /chat se prerenderiza como SSG.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Salas de chat gratis sin registro en español",
  description:
    "Cientos de salas de chat gratis sin registro en español: por países, ciudades y temáticas. Chatea, conoce gente y liga en tiempo real. Acceso instantáneo.",
  alternates: { canonical: "/chat" },
  openGraph: { ...OG_BASE, url: "/chat" },
};

const crumbs = [
  { name: "Inicio", url: "/" },
  { name: "Chat", url: "/chat" },
];

// Redondeo a la centena por debajo: "más de 2.800" sigue siendo verdad cuando
// el goteo diario añade salas, y no hay que retocar el texto en cada build.
// Punto de millar a mano: en CLDR el español no agrupa los números de cuatro
// cifras, así que toLocaleString("es") daba "2800" junto al "8.000" del resto
// del texto.
function centenas(n: number) {
  return String(Math.floor(n / 100) * 100).replace(/\B(?=(\d{3})+$)/g, ".");
}

// Las cifras salen del catálogo, no de un literal: la respuesta decía "más de
// 2.500 salas" y "casi 2.000 ciudades" cuando había 2.831 y 2.156 —un índice
// que se queda corto sobre su propio tamaño es justo lo que no se le quiere
// dar ni a Google ni a un motor de respuestas.
function construirFaq(salas: number, ciudades: number, paises: number) {
  return [
  {
    q: "¿Cómo puedo chatear gratis sin registro?",
    a: "Entra en cualquier sala, escribe un nick de invitado y pulsa 'Entrar'. No necesitas email, contraseña ni descargar ninguna aplicación. El acceso es gratuito e instantáneo.",
  },
  {
    q: "¿Cuántas salas de chat hay disponibles?",
    a: `TuChat tiene más de ${centenas(salas)} salas: por país (España, México, Argentina… ${paises} países), por ciudad (Madrid, Barcelona, Buenos Aires… más de ${centenas(ciudades)} ciudades en total, incluidos los 893 municipios españoles de más de 8.000 habitantes) y por temática (amor, ligar, deportes, música, anime…). Cada sala conecta con canales IRC activos.`,
  },
  {
    q: "¿El chat funciona en el móvil?",
    a: "Sí. El chat funciona directamente en el navegador del móvil, tablet u ordenador. Sin descargas ni aplicaciones adicionales.",
  },
  {
    q: "¿Hay moderación en las salas de chat?",
    a: "Sí. Todas las salas cuentan con operadores que aplican las normas de convivencia. Puedes reportar cualquier abuso desde la propia sala o escribiéndonos a info@chatzona.org.",
  },
  ];
}

export default async function ChatIndexPage() {
  const [countries, cities, catalogo] = await Promise.all([
    getMergedCountries(),
    getMergedCities(),
    getTopicCatalog(),
  ]);
  const { primaryTopics, groups, propiasDelPais, apodosDelPais, totalEnGrupos } = catalogo;

  const all = [...countries, ...cities, ...primaryTopics, ...groups.flatMap((g) => g.items)];
  const FAQ = construirFaq(all.length, cities.length, countries.length);
  const topRooms = [...all].sort((a, b) => b.users - a.users).slice(0, 20);
  // El catálogo para el buscador ya NO viaja en el HTML: ChatSearch lo pide a
  // /api/search-index al enfocar el input. Serializarlo aquí metía ~858 KB de
  // payload en cada visita a /chat, se usara el buscador o no.
  //
  // Y las 645 salas temáticas tampoco: esta página pesaba 861 KB con 979
  // enlaces y tardaba 5,7 s en ser interactiva en móvil. Aquí va un chip por
  // categoría; el listado completo vive en /chat/temas.

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <JsonLd data={collectionJsonLd("Salas de chat", "/chat")} />
      <JsonLd data={faqJsonLd(FAQ)} />
      <JsonLd data={itemListJsonLd(topRooms.map((p) => ({ url: `/chat/${p.slug}`, name: `Chat ${p.name}` })))} />
      <Breadcrumbs crumbs={crumbs} />
      <h1 className="mt-4 text-3xl font-extrabold text-ink">Salas de chat gratis sin registro</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Cientos de salas de chat online para chatear con gente, hacer amigos y ligar en español.
        Acceso gratis, sin registro y sin descargas.
      </p>
      <div className="mt-5">
        <Suspense fallback={null}>
          <ChatSearch />
        </Suspense>
      </div>

      {/* Países y ciudades — visibles sin clics. El id es el destino del
          enlace "Países" de las tres navegaciones. */}
      <section id="paises" className="mt-10 scroll-mt-20">
        <SectionTitle>Países y ciudades</SectionTitle>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {countries.map((country) => {
            const citiesOfCountry = cities.filter((c) => c.parentSlug === country.slug);
            // Un país con salas de región se navega por ellas —España por sus
            // comunidades, México por sus estados— en vez de por una muestra de
            // 8 ciudades entre cientos: es su organización real.
            const regionsOfCountry = getRegionsOfCountry(country.slug);
            // …pero solo si esas regiones cubren de verdad el país. Las 17
            // comunidades se llevan 891 de las 893 ciudades españolas; los 8
            // estados mexicanos con sala, 64 de 292, así que enseñar únicamente
            // sus chips escondería Ciudad de México o Monterrey. Cuando no
            // cubren, se enseñan las dos cosas.
            const cubiertas = citiesOfCountry.filter(
              (c) => c.regionSlug && regionsOfCountry.some((r) => r.slug === c.regionSlug),
            ).length;
            const soloRegiones =
              regionsOfCountry.length > 0 && cubiertas >= citiesOfCountry.length / 2;
            const preview = soloRegiones ? [] : citiesOfCountry.slice(0, 8);
            const rest = citiesOfCountry.length - preview.length;
            return (
              <div key={country.slug} className="rounded-xl border border-line bg-card p-4">
                <div className="flex items-center gap-2">
                  {/* Flag y no el emoji crudo: en Windows los emoji-bandera no se
                      renderizan y salían las letras del país ("ES"). */}
                  <Flag emoji={country.icon} flagSrc={country.flagSrc} name={country.name} size={22} />
                  <Link
                    href={`/chat/${country.slug}`}
                    className="font-semibold text-ink hover:text-blue"
                  >
                    {country.name}
                  </Link>
                  {citiesOfCountry.length > 0 && (
                    <span className="text-xs text-muted">· {citiesOfCountry.length} ciudades</span>
                  )}
                  <span className="ml-auto shrink-0 text-xs text-muted">
                    {country.users.toLocaleString("es")} online
                  </span>
                </div>
                {/* min-h-[40px]: los chips eran de 26px de alto, muy por debajo de
                    los 44px que pide la guía táctil de Apple, y son la vía de
                    entrada a las 893 ciudades españolas. */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {regionsOfCountry.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/chat/${r.slug}`}
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-line bg-bg px-3 py-2 text-sm text-ink transition-colors hover:border-blue hover:text-blue"
                    >
                      <Flag emoji={r.icon} flagSrc={r.flagSrc} name={r.name} size={14} />
                      {r.name}
                    </Link>
                  ))}
                  {preview.map((c) => {
                    const flag = cityFlag(c);
                    return (
                      <Link
                        key={c.slug}
                        href={`/chat/${c.slug}`}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-line bg-bg px-3 py-2 text-sm text-ink transition-colors hover:border-blue hover:text-blue"
                      >
                        <Flag emoji={flag.icon} flagSrc={flag.flagSrc} name={flag.name} size={14} />
                        {c.name}
                      </Link>
                    );
                  })}
                  {/* Salas propias del país (argentinos, rebelión…): antes formaban
                      un grupo suelto en "Más salas temáticas" que duplicaba al país.
                      Las que son otro nombre de una sala que ya está arriba salen
                      aparte, más abajo: mezcladas aquí se leían como duplicados. */}
                  {(propiasDelPais.get(country.slug) ?? []).map((t) => (
                    <Link
                      key={t.slug}
                      href={`/chat/${t.slug}`}
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-line bg-bg px-3 py-2 text-sm text-ink transition-colors hover:border-blue hover:text-blue"
                    >
                      <span aria-hidden="true">{t.icon}</span>
                      {t.name}
                    </Link>
                  ))}
                  {rest > 0 && (
                    <Link
                      href={`/chat/${country.slug}`}
                      className="inline-flex min-h-[40px] items-center rounded-full bg-blue/10 px-3 py-2 text-sm font-semibold text-blue transition-colors hover:bg-blue/20"
                    >
                      Ver todas (+{rest}) →
                    </Link>
                  )}
                  {citiesOfCountry.length === 0 && (
                    <Link
                      href={`/chat/${country.slug}`}
                      className="inline-flex min-h-[40px] items-center rounded-full bg-blue/10 px-3 py-2 text-sm font-semibold text-blue transition-colors hover:bg-blue/20"
                    >
                      Entrar al chat →
                    </Link>
                  )}
                </div>
                {(apodosDelPais.get(country.slug) ?? []).length > 0 && (
                  <p className="mt-2 text-xs text-muted">
                    También por su otro nombre:{" "}
                    {(apodosDelPais.get(country.slug) ?? []).map((t, i) => (
                      <span key={t.slug}>
                        {i > 0 && " · "}
                        {/* Subrayado fijo: dentro de un párrafo, el color solo no distingue el
                            enlace (aviso link-in-text-block de Lighthouse en móvil). */}
                        <Link href={`/chat/${t.slug}`} className="text-blue underline decoration-blue/40 underline-offset-2 hover:decoration-blue">
                          {t.name}
                        </Link>
                      </span>
                    ))}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Temáticas populares (tarjetas) */}
      <section className="mt-10">
        <SectionTitle>Temáticas populares</SectionTitle>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {primaryTopics.map((p) => (
            <RoomCard key={p.slug} place={p} />
          ))}
        </div>
      </section>

      {/* Más salas temáticas: un chip por categoría con su recuento; cada uno
          lleva a su bloque dentro de /chat/temas, donde están las 645 salas. */}
      {groups.length > 0 && (
        <section className="mt-10">
          <SectionTitle
            href="/chat/temas"
            cta="Ver todas"
            description={`${totalEnGrupos} salas más, repartidas en ${groups.length} categorías: fútbol por equipos, salud, hobbies, religión, edades…`}
          >
            Más salas temáticas
          </SectionTitle>
          <div className="mt-4 flex flex-wrap gap-2">
            {groups.map((g) => (
              <Link
                key={g.anchor}
                href={`/chat/temas#${g.anchor}`}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-line bg-card px-3 py-2 text-sm text-ink transition-colors hover:border-blue hover:text-blue"
              >
                {g.name}
                <span className="text-muted">· {g.items.length}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-12">
        <FAQBlock items={FAQ} />
      </div>
    </main>
  );
}
