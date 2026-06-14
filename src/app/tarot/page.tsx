import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FAQBlock } from "@/components/room/FAQBlock";
import { ARCANOS_MAYORES, cartaDelDia } from "@/data/tarot";

// Refresca la carta del día una vez al día.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Tarot online gratis: carta del día y significado de las cartas",
  description:
    "Consulta la carta del tarot de hoy y el significado de los 22 Arcanos Mayores. Entra gratis al chat de tarot y comparte tus tiradas con otros aficionados.",
  alternates: { canonical: "/tarot" },
};

const crumbs = [
  { name: "Inicio", url: "/" },
  { name: "Tarot", url: "/tarot" },
];

const FAQ = [
  {
    q: "¿La carta del día es la misma para todos?",
    a: "Sí. La carta del día se calcula según la fecha, así que todos los visitantes ven el mismo Arcano Mayor durante la jornada. Cambia automáticamente cada día.",
  },
  {
    q: "¿El tarot predice el futuro?",
    a: "El tarot es una herramienta de reflexión e introspección, no una ciencia exacta. Sirve para mirar una situación desde otra perspectiva, no para predecir hechos con certeza.",
  },
  {
    q: "¿Puedo hablar de mis tiradas con alguien?",
    a: "Claro. En el chat de tarot hay gente que lee cartas, comparte significados y resuelve dudas sin juzgar si crees o no crees. Entra gratis y sin registro.",
  },
];

export default function TarotPage() {
  const carta = cartaDelDia(new Date());

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <Breadcrumbs crumbs={crumbs} />

      <h1 className="mt-4 text-3xl font-extrabold text-ink">Tarot online gratis</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Descubre la carta del tarot de hoy, consulta el significado de los Arcanos Mayores y
        comparte tus tiradas en el chat de tarot con gente que disfruta del tema tanto como tú.
      </p>
      <div className="mt-4">
        <Button href="/webchat?canal=tarot">Entrar al chat de tarot</Button>
      </div>

      {/* Carta del día */}
      <section className="mt-8">
        <SectionTitle>La carta del día</SectionTitle>
        <div className="flex flex-col items-start gap-4 rounded-xl border border-line bg-card p-6 sm:flex-row sm:items-center">
          <div className="text-6xl" aria-hidden="true">{carta.icon}</div>
          <div>
            <h3 className="text-xl font-bold text-ink">{carta.name}</h3>
            <p className="mt-1 text-muted">{carta.meaning}</p>
          </div>
        </div>
      </section>

      {/* Significado de los Arcanos Mayores */}
      <section className="mt-10">
        <SectionTitle>Significado de los Arcanos Mayores</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          {ARCANOS_MAYORES.map((a) => (
            <div key={a.num} className="rounded-xl border border-line bg-card p-4">
              <h3 className="font-semibold text-ink">
                <span aria-hidden="true">{a.icon}</span> {a.name}
              </h3>
              <p className="mt-1 text-sm text-muted">{a.meaning}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Salas relacionadas */}
      <section className="mt-10">
        <SectionTitle>Salas de esoterismo y videncia</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {["tarot", "esoterismo", "videncia", "astrologia", "magia", "horoscopo"].map((slug) => (
            <Link
              key={slug}
              href={`/chat/${slug}`}
              className="rounded-full border border-line bg-card px-3 py-1.5 text-sm text-blue-dark hover:border-blue"
            >
              {slug}
            </Link>
          ))}
        </div>
      </section>

      <FAQBlock items={FAQ} />
    </main>
  );
}
