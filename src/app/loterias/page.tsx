import type { Metadata } from "next";
import Link from "next/link";
import { getCountries, cityFlag } from "@/data";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SEOTextBlock } from "@/components/room/SEOTextBlock";
import { FAQBlock } from "@/components/room/FAQBlock";
import { Flag } from "@/components/ui/Flag";
import { LOTERIA_INFO } from "@/lib/lottery-info";
import { collectionJsonLd, faqJsonLd, itemListJsonLd, JsonLd, OG_BASE } from "@/lib/seo";

/**
 * Índice de la sección de loterías.
 *
 * Igual que pasaba con /tiempo, existían las hojas `/loterias/{pais}` y no la
 * rama: ningún hub las reunía ni competía por la consulta genérica. Aquí se
 * listan los países con sorteos verificados y, en cada uno, los sorteos que de
 * verdad cubre su página — que es la información que busca quien llega.
 */

export const metadata: Metadata = {
  title: "Loterías y sorteos por país: resultados",
  description:
    "Resultados de las loterías de España y América Latina: Primitiva, Euromillones, Melate, Quini 6, Baloto y los sorteos de cada país.",
  alternates: { canonical: "/loterias" },
  openGraph: { ...OG_BASE, url: "/loterias" },
};

const crumbs = [
  { name: "Inicio", url: "/" },
  { name: "Loterías", url: "/loterias" },
];

const FAQ = [
  {
    q: "¿Qué países tienen resultados?",
    a: "Los que aparecen listados en esta página. Solo se publica la de un país cuando su lista de sorteos está verificada: para el resto no hay página, porque rellenarla con nombres genéricos sería inventarse los sorteos de un país.",
  },
  {
    q: "¿Los resultados están actualizados?",
    a: "Los de España se leen del servicio oficial de Loterías y Apuestas del Estado y se refrescan solos. En el resto de países la página recoge los sorteos que se juegan y sus calendarios; conviene contrastar el número premiado con la fuente oficial de cada operador antes de dar nada por bueno.",
  },
  {
    q: "¿Se puede jugar desde aquí?",
    a: "No. TuChat no vende décimos ni participaciones ni gestiona premios: solo publica resultados y calendarios. Para jugar hay que ir a un punto de venta autorizado o a la web oficial del operador de cada país.",
  },
];

export default function LoteriasIndexPage() {
  const paises = getCountries()
    .filter((c) => c.slug in LOTERIA_INFO)
    .map((c) => ({ place: c, info: LOTERIA_INFO[c.slug] }))
    .sort((a, b) => b.info.loterías.length - a.info.loterías.length);

  const totalSorteos = paises.reduce((n, p) => n + p.info.loterías.length, 0);

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <JsonLd data={collectionJsonLd("Loterías y sorteos", "/loterias")} />
      <JsonLd data={faqJsonLd(FAQ)} />
      <JsonLd
        data={itemListJsonLd(
          paises.map((p) => ({ url: `/loterias/${p.place.slug}`, name: `Loterías de ${p.place.name}` })),
        )}
      />
      <Breadcrumbs crumbs={crumbs} />

      <h1 className="mt-4 text-3xl font-extrabold text-ink">Loterías y sorteos por país</h1>
      <p className="mt-2 max-w-3xl text-muted">
        {totalSorteos} sorteos de {paises.length} países, cada uno con su página de resultados. En
        España los números premiados se leen del servicio oficial de Loterías y Apuestas del Estado;
        en el resto se recogen los sorteos que se juegan y cuándo se celebran.
      </p>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        {paises.map(({ place, info }) => {
          const flag = cityFlag(place);
          return (
            <Link
              key={place.slug}
              href={`/loterias/${place.slug}`}
              className="group rounded-xl border border-line bg-card p-4 transition-colors hover:border-blue"
            >
              <div className="flex items-center gap-2.5">
                <Flag emoji={flag.icon} flagSrc={flag.flagSrc} name={flag.name} size={24} />
                <h2 className="font-bold text-ink group-hover:text-blue">{place.name}</h2>
                <span className="ml-auto text-xs text-muted">{info.loterías.length} sorteos</span>
              </div>
              <p className="mt-2 text-sm text-muted">{info.loterías.join(" · ")}</p>
            </Link>
          );
        })}
      </section>

      <SEOTextBlock title="Cómo se comprueba un número premiado">
        <p>
          Conviene contrastar siempre con la fuente oficial del operador y guardar el resguardo
          hasta haber cobrado: en la mayoría de países el décimo o el boleto al portador es el único
          justificante válido, y sin él no hay reclamación posible aunque el número sea correcto.
          Los plazos de cobro son limitados —suelen ir de uno a tres meses según el país y el
          sorteo— y un premio no reclamado a tiempo caduca.
        </p>
        <p>
          Ojo también con los avisos de premio que llegan por mensaje o por chat. Ninguna lotería
          legítima comunica un premio por privado ni pide un pago por adelantado para liberarlo: si
          alguien lo hace, es una estafa. En{" "}
          <Link href="/como-funciona" className="font-semibold text-blue hover:underline">
            cómo funciona el chat
          </Link>{" "}
          están las precauciones que conviene tomar con este tipo de mensajes.
        </p>
      </SEOTextBlock>

      <div className="mt-8">
        <FAQBlock items={FAQ} />
      </div>
    </main>
  );
}
