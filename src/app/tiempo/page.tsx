import type { Metadata } from "next";
import Link from "next/link";
import { getCities, getCountries, getPlace, roomName } from "@/data";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SEOTextBlock } from "@/components/room/SEOTextBlock";
import { FAQBlock } from "@/components/room/FAQBlock";
import { Flag } from "@/components/ui/Flag";
import { cityFlag } from "@/data";
import { hasWeather } from "@/lib/weather";
import { collectionJsonLd, faqJsonLd, itemListJsonLd, JsonLd, OG_BASE } from "@/lib/seo";

/**
 * Índice de la sección del tiempo.
 *
 * No existía: había 1.965 páginas `/tiempo/{ciudad}` —el 40% del sitemap— y
 * ningún hub que las reuniera. Cada una recibía un enlace desde la sala de su
 * ciudad y nada más, así que para Google eran hojas colgando de un árbol sin
 * rama. Esta página es esa rama: agrupa la cobertura por país, da un punto de
 * entrada para las consultas genéricas ("el tiempo", "previsión por ciudades")
 * y reparte enlazado interno hacia las hojas.
 */

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "El tiempo por ciudades: previsión a 5 días",
  description:
    "Previsión meteorológica de más de 1.900 ciudades de España y América Latina: temperatura, lluvia y viento a 5 días, con datos actualizados cada hora.",
  alternates: { canonical: "/tiempo" },
  openGraph: { ...OG_BASE, url: "/tiempo" },
};

const crumbs = [
  { name: "Inicio", url: "/" },
  { name: "El tiempo", url: "/tiempo" },
];

const FAQ = [
  {
    q: "¿De dónde salen los datos de la previsión?",
    a: "De Open-Meteo, que agrega los modelos de los servicios meteorológicos nacionales. Se consultan las coordenadas reales de cada municipio y la previsión se refresca cada hora.",
  },
  {
    q: "¿Por qué mi pueblo no aparece?",
    a: "Solo se publica la página de las localidades para las que hay previsión con coordenadas verificadas. Publicar una página titulada «El tiempo en X» que por dentro dijera «sin datos» sería prometer un servicio que no se presta, así que esas localidades no tienen página de tiempo (pero sí sala de chat).",
  },
  {
    q: "¿A cuántos días llega la previsión?",
    a: "A cinco días, con máxima, mínima, probabilidad de lluvia y viento por jornada, además de la observación de la hora en curso.",
  },
];

export default function TiempoIndexPage() {
  const conTiempo = [...getCities(), ...getCountries()].filter((c) => hasWeather(c.slug));

  // Agrupación por país: es la única jerarquía que tienen en común ciudades de
  // 30 países, y deja grupos navegables en vez de una lista de 1.965 enlaces.
  const porPais = new Map<string, typeof conTiempo>();
  for (const c of conTiempo) {
    const clave = c.kind === "pais" ? c.name : c.parentName ?? "Otras";
    (porPais.get(clave) ?? porPais.set(clave, []).get(clave)!).push(c);
  }
  const grupos = [...porPais.entries()]
    .map(([pais, ciudades]) => ({
      pais,
      ciudades: [...ciudades].sort((a, b) => b.users - a.users),
    }))
    .sort((a, b) => b.ciudades.length - a.ciudades.length);

  // Las más buscadas, para que la parte alta de la página tenga enlaces útiles
  // sin obligar a desplegar un grupo.
  const destacadas = [...conTiempo]
    .filter((c) => c.kind === "ciudad")
    .sort((a, b) => b.users - a.users)
    .slice(0, 12);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <JsonLd data={collectionJsonLd("El tiempo por ciudades", "/tiempo")} />
      <JsonLd data={faqJsonLd(FAQ)} />
      <JsonLd
        data={itemListJsonLd(
          destacadas.map((c) => ({ url: `/tiempo/${c.slug}`, name: `El tiempo en ${c.name}` })),
        )}
      />
      <Breadcrumbs crumbs={crumbs} />

      <h1 className="mt-4 text-3xl font-extrabold text-ink">El tiempo por ciudades</h1>
      <p className="mt-2 max-w-3xl text-muted">
        Previsión a cinco días para {conTiempo.length.toLocaleString("es")} localidades de España y
        América Latina, con la temperatura de la hora en curso, la máxima y la mínima del día, la
        probabilidad de lluvia y el viento. Los datos vienen de las coordenadas reales de cada
        municipio y se actualizan cada hora.
      </p>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-bold text-ink">Las más consultadas</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {destacadas.map((c) => {
            const flag = cityFlag(c);
            return (
              <Link
                key={c.slug}
                href={`/tiempo/${c.slug}`}
                className="flex items-center gap-2.5 rounded-xl border border-line bg-card p-3 transition-colors hover:border-blue"
              >
                <Flag emoji={flag.icon} flagSrc={flag.flagSrc} name={flag.name} size={22} />
                <span className="min-w-0 truncate font-medium text-ink">{c.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-bold text-ink">Cobertura por país</h2>
        <div className="space-y-2">
          {grupos.map((g) => {
            const pais = getPlace(
              g.ciudades.find((c) => c.parentSlug)?.parentSlug ?? "",
            );
            return (
              <details key={g.pais} className="rounded-xl border border-line bg-card">
                <summary className="cursor-pointer px-4 py-3 font-semibold text-ink">
                  {g.pais}{" "}
                  <span className="font-normal text-muted">({g.ciudades.length})</span>
                </summary>
                <div className="flex flex-wrap gap-x-3 gap-y-1.5 border-t border-line px-4 py-3 text-sm">
                  {g.ciudades.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/tiempo/${c.slug}`}
                      className="text-muted hover:text-blue hover:underline"
                    >
                      {roomName(c)}
                    </Link>
                  ))}
                </div>
                {pais && (
                  <p className="border-t border-line px-4 py-2 text-xs text-muted">
                    ¿Buscas conversación?{" "}
                    <Link href={`/chat/${pais.slug}`} className="font-semibold text-blue hover:underline">
                      Chat de {pais.name}
                    </Link>
                  </p>
                )}
              </details>
            );
          })}
        </div>
      </section>

      <SEOTextBlock title="Cómo leer la previsión">
        <p>
          El bloque superior de cada ciudad muestra la observación de la hora en curso —temperatura,
          estado del cielo, viento y precipitación acumulada— y debajo va la tira de cinco días con
          máxima, mínima e iconos de estado. La probabilidad de lluvia no dice cuánta agua caerá,
          sino qué posibilidades hay de que llueva en ese punto: un 30% en un día de verano suele
          ser una tormenta breve por la tarde, no una jornada pasada por agua.
        </p>
        <p>
          En zonas de montaña y en la costa conviene tomarse las cifras con margen. Los modelos
          trabajan sobre una malla de varios kilómetros y no ven el valle concreto ni la brisa que
          entra a media tarde, así que en sitios como el Pirineo, los Andes o las Rías Baixas la
          previsión acierta la tendencia mejor que el grado exacto.
        </p>
      </SEOTextBlock>

      <div className="mt-8">
        <FAQBlock items={FAQ} />
      </div>
    </main>
  );
}
