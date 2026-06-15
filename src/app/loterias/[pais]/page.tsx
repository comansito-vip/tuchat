import type { Metadata } from "next";
import { getPlace, getCountries } from "@/data";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { NickInput } from "@/components/ui/NickInput";
import { FAQBlock } from "@/components/room/FAQBlock";
import { cap } from "@/lib/slug";
import { breadcrumbJsonLd, faqJsonLd, collectionJsonLd, JsonLd } from "@/lib/seo";
import Link from "next/link";

export function generateStaticParams() {
  return getCountries().map((c) => ({ pais: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  const place = getPlace(pais);
  const nombre = place?.name ?? cap(pais);
  return {
    title: `Loterías y sorteos en ${nombre} — Resultados de hoy`,
    description: `Resultados de las loterías y sorteos más populares de ${nombre}. Comprueba los números premiados, fechas de los próximos sorteos y premios actualizados.`,
    alternates: { canonical: `/loterias/${pais}` },
  };
}

const LOTERIA_INFO: Record<string, { nombre: string; loterías: string[] }> = {
  espana: {
    nombre: "España",
    loterías: ["Lotería Nacional", "Primitiva", "Bonoloto", "El Gordo de la Primitiva", "Euromillones", "ONCE"],
  },
  mexico: {
    nombre: "México",
    loterías: ["Lotería Nacional de México", "Melate", "Melate Retro", "Tris", "Chispazo"],
  },
  argentina: {
    nombre: "Argentina",
    loterías: ["Quini 6", "Lotería de la Ciudad", "Telekino", "Raspadita", "Brinco"],
  },
  colombia: {
    nombre: "Colombia",
    loterías: ["Lotería de Bogotá", "Lotería de Medellín", "Baloto", "Kino", "Lotería del Valle"],
  },
  chile: {
    nombre: "Chile",
    loterías: ["Loto de Chile", "Clasico", "Kino", "Súper Kino", "Raspe Feliz"],
  },
  peru: {
    nombre: "Perú",
    loterías: ["Tinka", "Kabala", "La Tinka Plus", "Lotería de la ONN", "Raspadita"],
  },
  venezuela: {
    nombre: "Venezuela",
    loterías: ["Loterías del Táchira", "Triple Caracas", "Animalitos", "Chance", "Lotería de Margarita"],
  },
  ecuador: {
    nombre: "Ecuador",
    loterías: ["Lotería Nacional del Ecuador", "Loto de la Benéfica", "Quini Ecuador", "La Madrugada"],
  },
  bolivia: {
    nombre: "Bolivia",
    loterías: ["Lotería Nacional de Bolivia", "Raspadito Boliviano", "Bingo Bolivia", "Línea"],
  },
  uruguay: {
    nombre: "Uruguay",
    loterías: ["Quiniela del Uruguay", "Rasca", "Lotería del Uruguay", "Tómbola Matutina"],
  },
  paraguay: {
    nombre: "Paraguay",
    loterías: ["Tómbola Paraguaya", "Quiniela Paraguaya", "Raspa y Gana"],
  },
  cuba: { nombre: "Cuba", loterías: ["Lotería Nacional de Cuba", "Bolita"] },
  "republica-dominicana": {
    nombre: "República Dominicana",
    loterías: ["Lotería Nacional Dominicana", "Leidsa", "Anguila", "Quiniela Pale"],
  },
  "puerto-rico": {
    nombre: "Puerto Rico",
    loterías: ["Lotería de Puerto Rico", "Pega 4", "Pega 3", "Loto de Puerto Rico", "MatchPlay"],
  },
  guatemala: {
    nombre: "Guatemala",
    loterías: ["Lotería Santa Lucía", "Quiniela Tradicional", "Loto Quina", "Raspadita"],
  },
  "costa-rica": {
    nombre: "Costa Rica",
    loterías: ["Lotería Nacional de Costa Rica", "Chances", "Lucky", "Tiempos"],
  },
  honduras: {
    nombre: "Honduras",
    loterías: ["Lotería Nacional de Honduras", "Loto Honduras", "Números Plus"],
  },
  "el-salvador": {
    nombre: "El Salvador",
    loterías: ["Lotería Nacional de El Salvador", "Superloto", "Lucky Strike"],
  },
  nicaragua: {
    nombre: "Nicaragua",
    loterías: ["Lotería Nacional de Nicaragua", "Tómbola Nocturna", "Lotto"],
  },
  panama: {
    nombre: "Panamá",
    loterías: ["Lotería Nacional de Beneficencia de Panamá", "Mida", "La Diaria"],
  },
  "estados-unidos": {
    nombre: "Estados Unidos",
    loterías: ["Powerball", "Mega Millions", "Pick 3", "Pick 4", "Lucky for Life"],
  },
  portugal: {
    nombre: "Portugal",
    loterías: ["Lotaria Nacional", "Euromilhões", "Totoloto", "Joker", "Raspadinha"],
  },
  "reino-unido": {
    nombre: "Reino Unido",
    loterías: ["National Lottery", "EuroMillions", "Thunderball", "Lotto HotPicks", "Set For Life"],
  },
  italia: {
    nombre: "Italia",
    loterías: ["Lotto", "SuperEnalotto", "EuroJackpot", "Win for Life", "Gratta e Vinci"],
  },
  alemania: {
    nombre: "Alemania",
    loterías: ["Lotto 6aus49", "EuroJackpot", "Glücksspirale", "GoldCard", "Keno"],
  },
  francia: {
    nombre: "Francia",
    loterías: ["Loto de la FDJ", "EuroMillions", "Keno", "Amigo", "Astro"],
  },
  canada: {
    nombre: "Canadá",
    loterías: ["Lotto 6/49", "Lotto Max", "Daily Grand", "Encore", "Ontario 49"],
  },
  marruecos: {
    nombre: "Marruecos",
    loterías: ["Loterie Nationale du Maroc", "Quinte+", "Tiercé", "Multi"],
  },
  "guinea-ecuatorial": {
    nombre: "Guinea Ecuatorial",
    loterías: ["Lotería Nacional de Guinea Ecuatorial"],
  },
};

export default async function LoteriasPage({
  params,
}: {
  params: Promise<{ pais: string }>;
}) {
  const { pais } = await params;
  const place = getPlace(pais);
  const nombre = place?.name ?? cap(pais);
  const info = LOTERIA_INFO[pais];
  const loterias = info?.loterías ?? ["Lotería Nacional", "Quiniela", "Raspadita"];

  const crumbs = [
    { name: "Inicio", url: "/" },
    { name: "Loterías", url: "/loterias/espana" },
    { name: nombre, url: `/loterias/${pais}` },
  ];

  const faq = [
    {
      q: `¿Cuáles son las loterías más populares de ${nombre}?`,
      a: `Las principales loterías de ${nombre} son: ${loterias.join(", ")}. Cada una tiene sus propias reglas, frecuencia de sorteos y premios máximos.`,
    },
    {
      q: `¿Cómo puedo comprobar si mi número ha sido premiado en ${nombre}?`,
      a: `Para comprobar los resultados de las loterías de ${nombre}, puedes consultar el sitio web oficial de cada lotería, los principales periódicos del país o plataformas especializadas en resultados de sorteos.`,
    },
    {
      q: `¿Con qué frecuencia se realizan los sorteos de lotería en ${nombre}?`,
      a: `La frecuencia varía según la lotería: algunas realizan sorteos diarios, otras semanales y otras en fechas especiales. Las loterías de ${nombre} incluyen sorteos con diferente periodicidad para adaptarse a distintos jugadores.`,
    },
    {
      q: `¿Se puede jugar a las loterías de ${nombre} online?`,
      a: `Muchas loterías de ${nombre} ofrecen la posibilidad de jugar online a través de su sitio web oficial o aplicaciones móviles autorizadas. Es importante jugar siempre a través de canales oficiales para garantizar la validez del billete.`,
    },
  ];

  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={faqJsonLd(faq)} />
      <JsonLd data={collectionJsonLd(`Loterías de ${nombre}`, `/loterias/${pais}`)} />
      <Breadcrumbs crumbs={crumbs} />

      <h1 className="mt-4 text-3xl font-extrabold text-ink">
        Loterías y sorteos en {nombre}
      </h1>
      <p className="mt-2 max-w-2xl text-muted">
        Resultados y fechas de las loterías y sorteos más populares de {nombre}. Comprueba los
        números premiados y consulta los próximos sorteos.
      </p>

      {/* Lottery list */}
      <div className="mt-6 rounded-2xl border border-line bg-card p-6">
        <h2 className="font-bold text-ink">Loterías de {nombre}</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {loterias.map((l) => (
            <li
              key={l}
              className="flex items-center gap-3 rounded-xl border border-line bg-bg p-3"
            >
              <span className="text-2xl" aria-hidden="true">🎰</span>
              <div>
                <p className="font-semibold text-ink text-sm">{l}</p>
                <p className="text-xs text-muted">Resultados y premios</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* About the country */}
      {place && (
        <div className="mt-6 rounded-xl border border-line bg-card p-5">
          <h2 className="font-bold text-ink">Sobre {nombre}</h2>
          <p className="mt-2 text-sm text-muted">{place.about ?? place.intro}</p>
          <Link
            href={`/chat/${pais}`}
            className="mt-3 inline-block text-sm font-semibold text-blue hover:underline"
          >
            Entrar al chat de {nombre} →
          </Link>
        </div>
      )}

      {/* Chat CTA */}
      <section className="mt-8 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-800 p-6 text-white">
        <p className="text-sm font-semibold opacity-80">Comunidad de {nombre}</p>
        <h2 className="mt-1 text-xl font-extrabold">¿Tienes el número premiado?</h2>
        <p className="mt-1 text-sm opacity-80">
          Comparte tu suerte con la comunidad en el chat de {nombre}.
        </p>
        <div className="mt-4">
          <NickInput canal={pais} variant="onColor" placeholder={`Tu nick para el chat de ${nombre}...`} />
        </div>
      </section>

      {/* FAQ */}
      <div className="mt-8">
        <FAQBlock items={faq} />
      </div>
    </main>
  );
}
