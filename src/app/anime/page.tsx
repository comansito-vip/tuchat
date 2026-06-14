import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { RoomCard } from "@/components/home/RoomCard";
import { FAQBlock } from "@/components/room/FAQBlock";
import { getChildren, getPlace } from "@/data";
import { breadcrumbJsonLd, JsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Chat de anime y manga: salas por serie y personajes",
  description:
    "El punto de encuentro otaku en español: salas de Naruto, Dragon Ball, One Piece y más. Debate sagas, personajes y estrenos y entra gratis al chat de anime.",
  alternates: { canonical: "/anime" },
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
];

export default function AnimePage() {
  const salas = [getPlace("anime"), ...getChildren("anime")].filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  );
  const ranking = [...salas].sort((a, b) => b.votes - a.votes);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <Breadcrumbs crumbs={crumbs} />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <h1 className="mt-4 text-3xl font-extrabold text-ink">Chat de anime y manga</h1>
      <p className="mt-2 max-w-2xl text-muted">
        El rincón otaku de TuChat: debate sobre tus series favoritas, teoriza sobre el último
        capítulo y conoce gente con el mismo gusto. Salas por anime, por personaje y para
        lectores de manga que van un arco por delante.
      </p>
      <div className="mt-4">
        <Button href="/webchat?canal=anime">Entrar al chat de anime</Button>
      </div>

      <section className="mt-8">
        <SectionTitle>Salas de anime más populares</SectionTitle>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {ranking.map((p) => (
            <RoomCard key={p.slug} place={p} />
          ))}
        </div>
      </section>

      <FAQBlock items={FAQ} />
    </main>
  );
}
