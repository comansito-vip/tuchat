import type { Metadata } from "next";
import { getPlace, getCountries } from "@/data";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { NickInput } from "@/components/ui/NickInput";
import { FAQBlock } from "@/components/room/FAQBlock";
import { cap } from "@/lib/slug";
import { faqJsonLd, collectionJsonLd, JsonLd, OG_BASE } from "@/lib/seo";
import { getSpainLotteryResults } from "@/lib/lottery";
import { LotteryBall } from "@/components/ui/LotteryBall";
import Link from "next/link";

export const dynamicParams = false;
// Solo España trae resultados reales (getSpainLotteryResults); el resto de
// países no hace fetch y esto no les afecta, pero next exige un único valor
// de revalidate por segmento de ruta.
// OJO: este export de configuración de ruta lo analiza Next.js de forma
// estática en build — tiene que ser un literal, no una referencia a una
// constante importada (rompe el build con "Invalid segment configuration
// export"). Debe coincidir con LOTTERY_REVALIDATE_SECONDS en src/lib/lottery.ts.
export const revalidate = 21600;

// Solo los países cuyo listado de sorteos está verificado en LOTERIA_INFO. Antes
// se generaba para los 30 y los que faltaban (Belice) caían en un fallback
// genérico —"Lotería Nacional, Quiniela, Raspadita"— que la FAQ y el JSON-LD
// afirmaban como hecho. Inventar sorteos de un país es peor que no tener página.
export function generateStaticParams() {
  return getCountries()
    .filter((c) => c.slug in LOTERIA_INFO)
    .map((c) => ({ pais: c.slug }));
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
    title: `Loterías de ${nombre} — resultados`,
    description: `Resultados de las loterías y sorteos más populares de ${nombre}: números premiados, fechas de próximos sorteos y premios actualizados en TuChat.`,
    alternates: { canonical: `/loterias/${pais}` },
    openGraph: { ...OG_BASE, url: `/loterias/${pais}` },
  };
}

const LOTERIA_INFO: Record<string, { nombre: string; loterías: string[] }> = {
  espana: {
    nombre: "España",
    loterías: [
      "Lotería Nacional",
      "Primitiva",
      "Bonoloto",
      "El Gordo de la Primitiva",
      "Euromillones",
      "EuroDreams",
      "ONCE",
    ],
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
  const draws = pais === "espana" ? await getSpainLotteryResults() : [];
  const drawByName = new Map(draws.map((d) => [d.name, d]));

  // Sin migaja intermedia "Loterías": no existe un índice /loterias real
  // (solo /loterias/{pais}), así que un crumb fijo a /loterias/espana
  // duplicaba la URL de esta misma página en /loterias/espana y era
  // simplemente incorrecto en cualquier otro país.
  const crumbs = [
    { name: "Inicio", url: "/" },
    { name: nombre, url: `/loterias/${pais}` },
  ];

  const faq = [
    {
      q: `¿Cuáles son las loterías más populares de ${nombre}?`,
      a: `En ${nombre} se juegan ${loterias.length} loterías principales: ${loterias.join(", ")}. Cada una tiene sus propias reglas, frecuencia de sorteos y premios máximos.`,
    },
    {
      q: `¿Cuál es la lotería más conocida de ${nombre}?`,
      a: `La lotería de referencia en ${nombre} es ${loterias[0]}${loterias.length > 1 ? `, seguida de opciones populares como ${loterias.slice(1, 3).join(" y ")}` : ""}. Son las que concentran la mayor parte de jugadores y los botes más altos.`,
    },
    {
      q: `¿Cómo puedo comprobar si mi número ha sido premiado en ${nombre}?`,
      a: `Para comprobar los resultados de ${loterias[0]} y demás sorteos de ${nombre}, consulta siempre el sitio web oficial de cada lotería o canales autorizados. En el chat de ${nombre} también puedes comentar los resultados con otros jugadores en tiempo real.`,
    },
    {
      q: `¿Necesito registrarme para chatear sobre loterías de ${nombre}?`,
      a: `No. El chat de ${nombre} es gratuito y sin registro: eliges un nick y entras al instante para compartir números, participaciones y comentar los sorteos con la comunidad.`,
    },
  ];

  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
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
          {loterias.map((l) => {
            const draw = drawByName.get(l);
            return (
              <li
                key={l}
                className="flex items-center gap-3 rounded-xl border border-line bg-bg p-3"
              >
                <span className="text-2xl" aria-hidden="true">🎰</span>
                <div>
                  <p className="font-semibold text-ink text-sm">{l}</p>
                  {draw ? (
                    <>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1">
                        {draw.numbers.map((n, i) => (
                          <LotteryBall key={i} n={n} />
                        ))}
                        {draw.stars?.map((n, i) => (
                          <LotteryBall key={`star-${i}`} n={n} variant="star" />
                        ))}
                        {draw.complementary !== undefined && (
                          <LotteryBall n={draw.complementary} variant="complementary" />
                        )}
                        {draw.reintegro !== undefined && (
                          <LotteryBall n={draw.reintegro} variant="reintegro" />
                        )}
                      </div>
                      <p className="mt-1.5 text-xs text-muted">
                        Sorteo del {new Date(draw.date).toLocaleDateString("es-ES")}
                        {draw.jackpot && ` · Bote: ${draw.jackpot}`}
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-muted">Resultados y premios</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Contexto de loterías (sin reciclar el 'about' del chat) */}
      {place && (
        <div className="mt-6 rounded-xl border border-line bg-card p-5">
          <h2 className="font-bold text-ink">Jugar a la lotería en {nombre}</h2>
          <p className="mt-2 text-sm text-muted">
            {nombre} cuenta con {loterias.length} sorteos principales, encabezados por{" "}
            {loterias[0]}{loterias.length > 1 ? ` y ${loterias[1]}` : ""}. Comparte tus números,
            participaciones y la suerte de cada sorteo con otros jugadores en el chat de {nombre}.
          </p>
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
