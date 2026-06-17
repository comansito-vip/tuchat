import type { Metadata } from "next";
import { getMergedCountries, getMergedCities, getMergedTopics } from "@/data/merged";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { RoomCard } from "@/components/home/RoomCard";
import { SearchInput } from "@/components/ui/SearchInput";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FAQBlock } from "@/components/room/FAQBlock";
import { breadcrumbJsonLd, collectionJsonLd, faqJsonLd, itemListJsonLd, JsonLd } from "@/lib/seo";
import { normalize } from "@/lib/slug";

export const metadata: Metadata = {
  title: "Salas de chat gratis sin registro en español",
  description:
    "Más de 200 salas de chat gratis sin registro en español: por países, ciudades y temáticas. Chatea, conoce gente y liga en tiempo real. Acceso instantáneo.",
  alternates: { canonical: "/chat" },
  openGraph: { url: "/chat" },
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
    a: "TuChat tiene más de 200 salas: por país (España, México, Argentina…), por ciudad (Madrid, Barcelona, Buenos Aires…) y por temática (amor, ligar, deportes, música, anime…). Cada sala conecta con canales IRC activos.",
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

export default async function ChatIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const [countries, cities, topics] = await Promise.all([
    getMergedCountries(),
    getMergedCities(),
    getMergedTopics(),
  ]);

  const all = [...countries, ...cities, ...topics];
  const topRooms = [...all].sort((a, b) => b.users - a.users).slice(0, 20);

  // Búsqueda: mostrar resultados planos
  if (q) {
    const filtered = all.filter((p) => normalize(p.name).includes(normalize(q)));
    return (
      <main className="mx-auto max-w-6xl px-4 py-6">
        <JsonLd data={breadcrumbJsonLd(crumbs)} />
        <JsonLd data={collectionJsonLd("Salas de chat", "/chat")} />
        <JsonLd data={itemListJsonLd(topRooms.map((p) => ({ url: `/chat/${p.slug}`, name: `Chat ${p.name}` })))} />
        <Breadcrumbs crumbs={crumbs} />
        <h1 className="mt-4 text-3xl font-extrabold text-ink">Salas de chat gratis sin registro</h1>
        <div className="mt-5 max-w-lg">
          <SearchInput size="md" />
        </div>
        <p className="mt-4 text-sm text-muted">
          Resultados para: <span className="font-semibold text-ink">«{q}»</span>
        </p>
        {filtered.length === 0 ? (
          <p className="mt-8 text-muted">
            No encontramos salas para{" "}
            <span className="font-semibold text-ink">«{q}»</span>. Prueba con otro término.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => (
              <RoomCard key={p.slug} place={p} />
            ))}
          </div>
        )}
      </main>
    );
  }

  // Vista jerárquica (sin búsqueda)
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={collectionJsonLd("Salas de chat", "/chat")} />
      <JsonLd data={faqJsonLd(FAQ)} />
      <JsonLd data={itemListJsonLd(topRooms.map((p) => ({ url: `/chat/${p.slug}`, name: `Chat ${p.name}` })))} />
      <Breadcrumbs crumbs={crumbs} />
      <h1 className="mt-4 text-3xl font-extrabold text-ink">Salas de chat gratis sin registro</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Más de 200 salas de chat online para chatear con gente, hacer amigos y ligar en español.
        Acceso gratis, sin registro y sin descargas.
      </p>
      <div className="mt-5 max-w-lg">
        <SearchInput size="md" />
      </div>

      {/* Países */}
      <section className="mt-10">
        <SectionTitle>Países</SectionTitle>
        <div className="mt-4 space-y-3">
          {countries.map((country) => {
            const citiesOfCountry = cities.filter((c) => c.parentSlug === country.slug);
            return (
              <details key={country.slug} className="group rounded-xl border border-line bg-card">
                <summary className="flex cursor-pointer items-center gap-3 px-5 py-3 hover:text-blue">
                  <span className="text-xl">{country.icon}</span>
                  <span className="font-semibold text-ink group-hover:text-blue">
                    {country.name}
                  </span>
                  {citiesOfCountry.length > 0 && (
                    <span className="ml-1 text-xs text-muted">
                      ({citiesOfCountry.length} salas)
                    </span>
                  )}
                  <span className="ml-auto text-muted group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="grid grid-cols-2 gap-3 px-4 pb-4 pt-2 sm:grid-cols-3 lg:grid-cols-4">
                  <RoomCard place={country} />
                  {citiesOfCountry.map((c) => (
                    <RoomCard key={c.slug} place={c} />
                  ))}
                </div>
              </details>
            );
          })}
        </div>
      </section>

      {/* Temáticas */}
      <section className="mt-10">
        <SectionTitle>Temáticas</SectionTitle>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {topics.map((p) => (
            <RoomCard key={p.slug} place={p} />
          ))}
        </div>
      </section>

      <div className="mt-12">
        <FAQBlock items={FAQ} />
      </div>
    </main>
  );
}
