import type { Metadata } from "next";
import Link from "next/link";
import { getSigns, type Element } from "@/data/horoscopo";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { NickInput } from "@/components/ui/NickInput";
import { FAQBlock } from "@/components/room/FAQBlock";
import { breadcrumbJsonLd, collectionJsonLd, faqJsonLd, JsonLd } from "@/lib/seo";

const ELEMENT_DOT: Record<Element, string> = {
  Fuego: "bg-red-500",
  Tierra: "bg-emerald-500",
  Aire: "bg-sky-500",
  Agua: "bg-blue-500",
};

export const metadata: Metadata = {
  title: "Horóscopo de hoy: los 12 signos del zodiaco",
  description:
    "Horóscopo de los 12 signos del zodiaco: amor, trabajo, salud, personalidad y compatibilidad de Aries a Piscis. Consulta tu signo en TuChat.",
  alternates: { canonical: "/horoscopo" },
};

const FAQ = [
  {
    q: "¿Cuál es el horóscopo de hoy?",
    a: "Cada signo tiene su propia predicción diaria de amor, trabajo y salud. Elige tu signo en la lista y consulta qué dice el horóscopo para ti hoy.",
  },
  {
    q: "¿Qué signos son más compatibles?",
    a: "La compatibilidad astrológica depende del signo solar, el ascendente y el signo lunar. En general, los signos del mismo elemento (Fuego, Tierra, Aire, Agua) tienen más afinidad, aunque el horóscopo completo da una imagen más precisa.",
  },
  {
    q: "¿Puedo comentar el horóscopo con otras personas?",
    a: "Sí. TuChat tiene una sala de horóscopo y astrología donde puedes debatir las predicciones, preguntar por compatibilidades y compartir tu carta natal con la comunidad. Acceso gratis sin registro.",
  },
  {
    q: "¿El horóscopo de TuChat se actualiza a diario?",
    a: "Las predicciones de cada signo se revisan regularmente para reflejar los tránsitos astrológicos más relevantes: Mercurio retrógrado, luna llena, cambios de estación y otros eventos del calendario astrológico.",
  },
];

export default function HoroscopoIndexPage() {
  const crumbs = [
    { name: "Inicio", url: "/" },
    { name: "Horóscopo", url: "/horoscopo" },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={collectionJsonLd("Horóscopo", "/horoscopo")} />
      <JsonLd data={faqJsonLd(FAQ)} />
      <Breadcrumbs crumbs={crumbs} />
      <h1 className="mt-4 text-3xl font-extrabold text-ink">Horóscopo de los 12 signos</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Elige tu signo del zodiaco y descubre su horóscopo: predicciones de amor, trabajo y salud,
        rasgos de personalidad y compatibilidad con el resto de signos.
      </p>
      <div className="mt-4 max-w-sm">
        <NickInput canal="horoscopo" placeholder="Tu nick para el chat de horóscopo..." />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {getSigns().map((s) => (
          <Link key={s.slug} href={`/horoscopo/${s.slug}`}>
            <Card className="flex h-full items-center gap-3 p-4 transition-colors hover:border-blue">
              <span className="text-3xl" aria-hidden>
                {s.symbol}
              </span>
              <div>
                <p className="font-bold text-ink">{s.name}</p>
                <p className="text-xs text-muted">{s.dates}</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                  <span className={`inline-block h-2 w-2 rounded-full ${ELEMENT_DOT[s.element]}`} aria-hidden />
                  {s.element}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <FAQBlock items={FAQ} />
    </main>
  );
}
