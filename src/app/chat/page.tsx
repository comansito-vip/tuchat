import type { Metadata } from "next";
import { getCountries, getCities, getTopics } from "@/data";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { RoomCard } from "@/components/home/RoomCard";
import { SearchInput } from "@/components/ui/SearchInput";
import { FAQBlock } from "@/components/room/FAQBlock";
import { breadcrumbJsonLd, collectionJsonLd, faqJsonLd, itemListJsonLd, JsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Salas de chat gratis sin registro en español",
  description:
    "Más de 260 salas de chat gratis sin registro: por países, ciudades y temáticas. Chatear online con gente, hacer amigos y ligar en español. Acceso instantáneo.",
  alternates: { canonical: "/chat" },
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
    a: "TuChat tiene más de 260 salas: por país (España, México, Argentina…), por ciudad (Madrid, Barcelona, Buenos Aires…) y por temática (amor, ligar, deportes, música, anime…). Cada sala conecta con canales IRC activos.",
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

  const all = [...getCountries(), ...getCities(), ...getTopics()];
  const filtered = q
    ? all.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))
    : all;

  const topRooms = [...all].sort((a, b) => b.users - a.users).slice(0, 20);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={collectionJsonLd("Salas de chat", "/chat")} />
      <JsonLd data={faqJsonLd(FAQ)} />
      <JsonLd data={itemListJsonLd(topRooms.map((p) => ({ url: `/chat/${p.slug}`, name: `Chat ${p.name}` })))} />
      <Breadcrumbs crumbs={crumbs} />
      <h1 className="mt-4 text-3xl font-extrabold text-ink">Salas de chat gratis sin registro</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Más de 260 salas de chat online para chatear con gente, hacer amigos y ligar en español.
        Acceso gratis, sin registro y sin descargas.
      </p>

      <div className="mt-5 max-w-lg">
        <SearchInput size="md" />
      </div>

      {q && (
        <p className="mt-4 text-sm text-muted">
          Resultados para: <span className="font-semibold text-ink">«{q}»</span>
        </p>
      )}

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

      {!q && (
        <div className="mt-12">
          <FAQBlock items={FAQ} />
        </div>
      )}
    </main>
  );
}
