import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { getMergedCountries, getMergedCities, getMergedTopics } from "@/data/merged";
import { cityFlag, getAgeTopics, getPrimaryTopics, getRegions } from "@/data";
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

const FAQ = [
  {
    q: "¿Cómo puedo chatear gratis sin registro?",
    a: "Entra en cualquier sala, escribe un nick de invitado y pulsa 'Entrar'. No necesitas email, contraseña ni descargar ninguna aplicación. El acceso es gratuito e instantáneo.",
  },
  {
    q: "¿Cuántas salas de chat hay disponibles?",
    a: "TuChat tiene más de 2.500 salas: por país (España, México, Argentina…), por ciudad (Madrid, Barcelona, Buenos Aires… y casi 2.000 ciudades en total, incluidos los 893 municipios españoles de más de 8.000 habitantes) y por temática (amor, ligar, deportes, música, anime…). Cada sala conecta con canales IRC activos.",
  },
  {
    q: "¿El chat funciona en el móvil?",
    a: "Sí. El chat funciona directamente en el navegador del móvil, tablet u ordenador. Sin descargas ni aplicaciones adicionales.",
  },
  {
    q: "¿Hay moderación en las salas de chat?",
    a: "Sí. Todas las salas cuentan con operadores que aplican las normas de convivencia. Puedes reportar cualquier abuso desde la propia sala o escribiéndonos a hola@tuchat.org.",
  },
];

export default async function ChatIndexPage() {
  const [countries, cities, topics] = await Promise.all([
    getMergedCountries(),
    getMergedCities(),
    getMergedTopics(),
  ]);

  const all = [...countries, ...cities, ...topics];
  const topRooms = [...all].sort((a, b) => b.users - a.users).slice(0, 20);
  // El catálogo para el buscador ya NO viaja en el HTML: ChatSearch lo pide a
  // /api/search-index al enfocar el input. Serializarlo aquí metía ~858 KB de
  // payload en cada visita a /chat, se usara el buscador o no.

  // Temáticas: destacar las principales como tarjetas y agrupar el resto por
  // su categoría padre (fútbol, salud, hobbies...) en vez de una única nube
  // de 423 chips sin clasificar, donde era imposible encontrar nada.
  const primarySet = new Set(getPrimaryTopics().map((t) => t.slug));
  // Las comunidades autónomas ya se navegan desde la tarjeta de España en
  // "Países y ciudades": repetirlas aquí como temáticas solo añade ruido.
  const regionSet = new Set(getRegions().map((r) => r.slug));
  const ageSet = new Set(getAgeTopics().map((t) => t.slug));
  // Las salas cuyo padre es un PAÍS (argentinos→argentina, rebelión→chile…) no
  // son una categoría temática: su grupo duplicaba en "Más salas temáticas" un
  // país que ya encabeza su propia tarjeta arriba. Se cuelgan de esa tarjeta.
  const countrySet = new Set(countries.map((c) => c.slug));
  const primaryTopics = topics.filter((t) => primarySet.has(t.slug));
  const restTopics = topics.filter((t) => !primarySet.has(t.slug) && !regionSet.has(t.slug));
  const grouped = new Map<string, { name: string; slug?: string; items: typeof restTopics }>();
  const topicsByCountry = new Map<string, typeof restTopics>();
  const conPadre = restTopics.filter((t) => t.parentSlug);
  const sinPadre = restTopics.filter((t) => !t.parentSlug);
  for (const t of conPadre) {
    const key = t.parentSlug!;
    if (countrySet.has(key)) {
      if (!topicsByCountry.has(key)) topicsByCountry.set(key, []);
      topicsByCountry.get(key)!.push(t);
      continue;
    }
    if (!grouped.has(key)) grouped.set(key, { name: t.parentName ?? key, slug: key, items: [] });
    grouped.get(key)!.items.push(t);
  }
  // Dedupe: una temática que ya encabeza su propio grupo (Latinchat con sus 23
  // salas, Gay Latino con las suyas…) no debe repetirse como chip suelto dentro
  // de su grupo padre —salía dos veces en la misma sección, una como chip y
  // otra como cabecera de grupo justo debajo—. Se queda solo como grupo.
  const groupKeys = new Set(grouped.keys());
  for (const g of grouped.values()) {
    g.items = g.items.filter((t) => !groupKeys.has(t.slug));
  }
  // Huérfanas: las salas de edad forman su propio grupo; los hubs de categoría
  // (religión, hobbies...) ya encabezan su grupo con enlace, no van a "Otras".
  const edad: typeof restTopics = [];
  const huerfanas: typeof restTopics = [];
  for (const t of sinPadre) {
    if (ageSet.has(t.slug)) edad.push(t);
    else if (!grouped.has(t.slug)) huerfanas.push(t);
  }
  if (edad.length) grouped.set("edades", { name: "Por edades", items: edad });
  // Por gente conectada, no por número de salas: ordenar por cardinalidad subía
  // Fútbol (73 equipos) y Erótico y hundía Amor, Ligar o Amistad, que son la
  // intención dominante de quien llega aquí.
  const usersOf = (g: { items: typeof restTopics }) =>
    g.items.reduce((sum, t) => sum + t.users, 0);
  const topicGroups = [...grouped.values()].sort((a, b) => usersOf(b) - usersOf(a));
  if (huerfanas.length) topicGroups.push({ name: "Otras temáticas", items: huerfanas });

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

      {/* Países y ciudades — visibles sin clics */}
      <section className="mt-10">
        <SectionTitle>Países y ciudades</SectionTitle>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {countries.map((country) => {
            const citiesOfCountry = cities.filter((c) => c.parentSlug === country.slug);
            // España se navega por comunidades autónomas (con su bandera), no
            // por una muestra de 8 ciudades entre 893: es su organización real.
            const regionsOfCountry = country.slug === "espana" ? getRegions() : [];
            const preview = citiesOfCountry.slice(0, 8);
            const rest = citiesOfCountry.length - preview.length;
            return (
              <div key={country.slug} className="rounded-xl border border-line bg-card p-4">
                <div className="flex items-center gap-2">
                  {/* Flag y no el emoji crudo: en Windows los emoji-bandera no se
                      renderizan y salían las letras del país ("ES"). */}
                  {/* Sin name: el nombre del país va en el enlace de al lado y el
                      lector lo repetía ("Bandera de España. España"). */}
                  <Flag emoji={country.icon} flagSrc={country.flagSrc} size={22} />
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
                  {regionsOfCountry.length > 0
                    ? regionsOfCountry.map((r) => (
                        <Link
                          key={r.slug}
                          href={`/chat/${r.slug}`}
                          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-line bg-bg px-3 py-2 text-sm text-ink transition-colors hover:border-blue hover:text-blue"
                        >
                          <Flag emoji={r.icon} flagSrc={r.flagSrc} size={14} />
                          {r.name}
                        </Link>
                      ))
                    : preview.map((c) => {
                        const flag = cityFlag(c);
                        return (
                          <Link
                            key={c.slug}
                            href={`/chat/${c.slug}`}
                            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-line bg-bg px-3 py-2 text-sm text-ink transition-colors hover:border-blue hover:text-blue"
                          >
                            <Flag emoji={flag.icon} flagSrc={flag.flagSrc} size={14} />
                            {c.name}
                          </Link>
                        );
                      })}
                  {/* Salas propias del país (argentinos, rebelión…): antes formaban
                      un grupo suelto en "Más salas temáticas" que duplicaba al país. */}
                  {(topicsByCountry.get(country.slug) ?? []).map((t) => (
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

      {/* Más salas temáticas, agrupadas por categoría (fútbol, salud, hobbies...) */}
      {topicGroups.length > 0 && (
        <section className="mt-10">
          <SectionTitle>Más salas temáticas</SectionTitle>
          <div className="mt-4 space-y-3">
            {topicGroups.map((g, i) => (
              <details
                key={g.slug ?? g.name}
                // Los 4 primeros (los de más gente conectada) abiertos: con los 50
                // grupos colapsados, llegar a una sala costaba un clic de más y en
                // móvil obligaba a re-scrollear tras cada despliegue.
                open={i < 4}
                className="group rounded-xl border border-line bg-card"
              >
                <summary className="flex min-h-[48px] cursor-pointer items-center justify-between gap-3 px-5 py-3 font-semibold text-ink hover:text-blue">
                  <h3 className="text-base font-semibold">
                    {g.name}
                    <span className="ml-2 font-normal text-muted">· {g.items.length}</span>
                  </h3>
                  <span className="text-muted transition-transform group-open:rotate-180" aria-hidden="true">▼</span>
                </summary>
                <div className="flex flex-wrap gap-2 px-4 pb-4 pt-2">
                  {/* El enlace al hub sale del <summary>: dentro, tocar el nombre
                      navegaba y tocar 3px al lado desplegaba — ambiguo en táctil. */}
                  {g.slug && (
                    <Link
                      href={`/chat/${g.slug}`}
                      className="inline-flex min-h-[40px] items-center rounded-full bg-blue/10 px-3 py-2 text-sm font-semibold text-blue transition-colors hover:bg-blue/20"
                    >
                      Ver {g.name} →
                    </Link>
                  )}
                  {g.items.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/chat/${p.slug}`}
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-line bg-bg px-3 py-2 text-sm text-ink transition-colors hover:border-blue hover:text-blue"
                    >
                      <span aria-hidden="true">{p.icon}</span>
                      {p.name}
                    </Link>
                  ))}
                </div>
              </details>
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
