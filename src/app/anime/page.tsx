import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { NickInput } from "@/components/ui/NickInput";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { RoomCard } from "@/components/home/RoomCard";
import { FAQBlock } from "@/components/room/FAQBlock";
import { breadcrumbJsonLd, faqJsonLd, collectionJsonLd, itemListJsonLd, JsonLd } from "@/lib/seo";
import { getChildren, getPlace } from "@/data";
import { ANIME_SERIES } from "@/lib/anime-series";

export const metadata: Metadata = {
  title: "Chat de anime y manga: salas por serie y personajes",
  description:
    "El punto de encuentro otaku en español: salas de Naruto, Dragon Ball, One Piece y más. Debate sagas, personajes y estrenos y entra gratis al chat de anime.",
  alternates: { canonical: "/anime" },
  openGraph: { url: "/anime" },
};

const crumbs = [
  { name: "Inicio", url: "/" },
  { name: "Anime", url: "/anime" },
];

const FAQ = [
  {
    q: "¿Qué salas de anime hay disponibles?",
    a: "Tienes una sala general de anime y salas dedicadas a series concretas como Naruto, Dragon Ball, One Piece, Kimetsu no Yaiba, Jujutsu Kaisen y Pokémon, además de una sala de manga.",
  },
  {
    q: "¿Se puede hablar de spoilers?",
    a: "Cada sala tiene su ritmo. En las salas por serie es habitual comentar arcos recientes, así que avisa antes de soltar un spoiler gordo por respeto a quien va más atrasado.",
  },
  {
    q: "¿Hay que registrarse para entrar?",
    a: "No. Eliges un nick de invitado y entras al momento, desde el móvil o el ordenador, totalmente gratis.",
  },
  {
    q: "¿TuChat cubre anime clásico y también los estrenos actuales?",
    a: "Sí. Hay salas para las grandes series de los 90 y 2000 —Dragon Ball Z, Naruto, One Piece— y también para los estrenos recientes como Jujutsu Kaisen, Kimetsu no Yaiba o Chainsaw Man. La comunidad opina de todo.",
  },
];

function AnimeSeriesCard({ serie }: { serie: (typeof ANIME_SERIES)[number] }) {
  return (
    <div className="flex gap-4 rounded-xl border border-line bg-card overflow-hidden hover:border-blue transition-colors">
      <div className="w-20 shrink-0 overflow-hidden bg-gradient-to-b from-fuchsia-900 to-indigo-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={serie.thumbnail}
          alt={`Portada de ${serie.name}`}
          width={80}
          height={112}
          loading="lazy"
          className="h-full w-full object-cover opacity-90"
        />
      </div>
      <div className="flex flex-col justify-center p-3">
        <p className="font-bold text-ink leading-tight">
          <span className="mr-1" aria-hidden="true">{serie.emoji}</span>
          {serie.name}
        </p>
        <p className="mt-1 text-sm text-muted line-clamp-3">{serie.blurb}</p>
      </div>
    </div>
  );
}

export default function AnimePage() {
  const salas = [getPlace("anime"), ...getChildren("anime")].filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  );
  const ranking = [...salas].sort((a, b) => b.votes - a.votes);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={faqJsonLd(FAQ)} />
      <JsonLd data={collectionJsonLd("Chat de anime y manga", "/anime")} />
      <JsonLd data={itemListJsonLd(ranking.map((p) => ({ url: `/chat/${p.slug}`, name: `Chat ${p.name}` })))} />
      <Breadcrumbs crumbs={crumbs} />

      {/* Hero anime */}
      <div className="relative mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-fuchsia-900 to-purple-900 p-8 text-white">
        {/* Caracteres japoneses decorativos (CSS puro) */}
        <span
          className="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 select-none text-[7rem] font-bold leading-none tracking-widest opacity-10 sm:block"
          aria-hidden="true"
          style={{ fontFamily: "serif" }}
        >
          アニメ
        </span>
        <p className="text-sm font-semibold uppercase tracking-widest opacity-75">TuChat · Mundo Otaku</p>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">
          Chat de anime y manga
        </h1>
        <p className="mt-2 max-w-lg opacity-90">
          El rincón otaku de TuChat: debate sobre tus series favoritas, teoriza sobre el último
          capítulo y conoce gente con el mismo gusto.
        </p>
        <div className="mt-5 max-w-sm">
          <NickInput canal="anime" variant="onColor" placeholder="Tu nick para entrar al anime..." />
        </div>
      </div>

      {/* Salas populares */}
      <section className="mt-10">
        <SectionTitle>Salas de anime más populares</SectionTitle>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {ranking.map((p) => (
            <RoomCard key={p.slug} place={p} />
          ))}
        </div>
      </section>

      {/* Series con thumbnails */}
      <section className="mt-10">
        <SectionTitle>Guía de series</SectionTitle>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {ANIME_SERIES.map((serie) => (
            <AnimeSeriesCard key={serie.name} serie={serie} />
          ))}
        </div>
      </section>

      {/* Editorial "Esta temporada" */}
      <section className="mt-10 rounded-2xl bg-gradient-to-br from-indigo-50 to-fuchsia-50 p-6">
        <h2 className="text-xl font-extrabold text-ink">Esta temporada en el chat de anime</h2>
        <div className="mt-4 space-y-4 text-muted">
          <p>
            El verano de 2026 está siendo una temporada de transición para el anime de temporada,
            pero los usuarios del chat de TuChat no paran. Chainsaw Man sigue dominando las
            conversaciones semanas después de que concluyera su segundo arco, con debates sobre si
            Fujimoto superó o no las expectativas que había generado el final de la primera parte.
          </p>
          <p>
            One Piece mantiene su pulso habitual: la saga del Nuevo Mundo avanza sin prisa pero
            sin pausa, y cada capítulo semanal genera una oleada de teorías en el canal. El ritmo
            lento es precisamente uno de los temas más debatidos: hay quien lo defiende como parte
            del estilo de Oda y quien lleva meses pidiendo un cierre para varios arcos abiertos.
          </p>
          <p>
            Para los que buscan algo nuevo, el canal general de anime está recibiendo
            recomendaciones cada semana. Dungeon Meshi (Delicious in Dungeon), Frieren y el regreso
            de algunos clásicos en plataformas están trayendo a un público nuevo que nunca había
            entrado al chat. Si buscas recomendación personalizada, pregunta en la sala de anime y
            alguien te responderá en minutos.
          </p>
        </div>
      </section>

      <FAQBlock items={FAQ} />
    </main>
  );
}
