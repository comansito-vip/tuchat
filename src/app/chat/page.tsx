import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { getMergedCountries, getMergedCities, getMergedTopics } from "@/data/merged";
import { cityFlag, getPrimaryTopics } from "@/data";
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
    a: "TuChat tiene más de 1.200 salas: por país (España, México, Argentina…), por ciudad (Madrid, Barcelona, Buenos Aires…) y por temática (amor, ligar, deportes, música, anime…). Cada sala conecta con canales IRC activos.",
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
  // Lista ligera para la búsqueda en cliente (sin intro/about: no inflar el bundle).
  const searchRooms = all.map((p) => {
    const flag = cityFlag(p);
    return {
      slug: p.slug,
      name: p.name,
      icon: flag.icon,
      flagSrc: flag.flagSrc,
      flagName: flag.name,
      users: p.users,
    };
  });

  // Temáticas: destacar las principales como tarjetas y el resto como chips.
  const primarySet = new Set(getPrimaryTopics().map((t) => t.slug));
  const primaryTopics = topics.filter((t) => primarySet.has(t.slug));
  const restTopics = topics.filter((t) => !primarySet.has(t.slug));

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
          <ChatSearch rooms={searchRooms} />
        </Suspense>
      </div>

      {/* Países y ciudades — visibles sin clics */}
      <section className="mt-10">
        <SectionTitle>Países y ciudades</SectionTitle>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {countries.map((country) => {
            const citiesOfCountry = cities.filter((c) => c.parentSlug === country.slug);
            const preview = citiesOfCountry.slice(0, 8);
            const rest = citiesOfCountry.length - preview.length;
            return (
              <div key={country.slug} className="rounded-xl border border-line bg-card p-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl" aria-hidden="true">{country.icon}</span>
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
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {preview.map((c) => {
                    const flag = cityFlag(c);
                    return (
                      <Link
                        key={c.slug}
                        href={`/chat/${c.slug}`}
                        className="inline-flex items-center gap-1 rounded-full border border-line bg-bg px-2.5 py-1 text-xs text-ink transition-colors hover:border-blue hover:text-blue"
                      >
                        <Flag emoji={flag.icon} flagSrc={flag.flagSrc} size={13} />
                        {c.name}
                      </Link>
                    );
                  })}
                  {rest > 0 && (
                    <Link
                      href={`/chat/${country.slug}`}
                      className="rounded-full bg-blue/10 px-2.5 py-1 text-xs font-semibold text-blue transition-colors hover:bg-blue/20"
                    >
                      Ver todas (+{rest}) →
                    </Link>
                  )}
                  {citiesOfCountry.length === 0 && (
                    <Link
                      href={`/chat/${country.slug}`}
                      className="rounded-full bg-blue/10 px-2.5 py-1 text-xs font-semibold text-blue transition-colors hover:bg-blue/20"
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

      {/* Todas las temáticas (chips) */}
      {restTopics.length > 0 && (
        <section className="mt-10">
          <SectionTitle>Más salas temáticas</SectionTitle>
          <div className="mt-4 flex flex-wrap gap-2">
            {restTopics.map((p) => (
              <Link
                key={p.slug}
                href={`/chat/${p.slug}`}
                className="inline-flex items-center gap-1 rounded-full border border-line bg-card px-3 py-1.5 text-sm text-ink transition-colors hover:border-blue hover:text-blue"
              >
                <span aria-hidden="true">{p.icon}</span>
                {p.name}
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
