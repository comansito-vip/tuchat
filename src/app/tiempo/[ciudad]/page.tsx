import type { Metadata } from "next";
import { getPlace, getCities, getCountries } from "@/data";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { NickInput } from "@/components/ui/NickInput";
import { FAQBlock } from "@/components/room/FAQBlock";
import { cap } from "@/lib/slug";
import { breadcrumbJsonLd, collectionJsonLd, faqJsonLd, JsonLd } from "@/lib/seo";
import Link from "next/link";

export function generateStaticParams() {
  return [...getCities(), ...getCountries()].map((c) => ({ ciudad: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ciudad: string }>;
}): Promise<Metadata> {
  const { ciudad } = await params;
  const place = getPlace(ciudad);
  const nombre = place?.name ?? cap(ciudad);
  return {
    title: `El tiempo en ${nombre} — Previsión meteorológica`,
    description: `Previsión del tiempo en ${nombre}: temperaturas, lluvia y viento para los próximos días. Consulta el forecast actualizado en TuChat.`,
    alternates: { canonical: `/tiempo/${ciudad}` },
  };
}

export default async function TiempoCiudadPage({
  params,
}: {
  params: Promise<{ ciudad: string }>;
}) {
  const { ciudad } = await params;
  const place = getPlace(ciudad);
  const nombre = place?.name ?? cap(ciudad);
  const intro = place?.about ?? place?.intro ?? `Consulta el tiempo en ${nombre}.`;
  const parentName = place?.parentName;

  const crumbs = [
    { name: "Inicio", url: "/" },
    { name: "Tiempo", url: "/tiempo/madrid" },
    { name: nombre, url: `/tiempo/${ciudad}` },
  ];

  const faq = [
    {
      q: `¿Cuál es el tiempo en ${nombre} hoy?`,
      a: `La previsión del tiempo para ${nombre} se actualiza constantemente con datos meteorológicos recientes. Consulta las temperaturas máximas y mínimas, probabilidad de lluvia y condiciones de viento para planificar tu día.`,
    },
    {
      q: `¿Qué temperatura hace en ${nombre}?`,
      a: `Las temperaturas en ${nombre} varían según la época del año${parentName ? ` y la ubicación dentro de ${parentName}` : ""}. Puedes consultar la previsión detallada por horas y días para obtener la información más precisa.`,
    },
    {
      q: `¿Cuándo es la mejor época para visitar ${nombre}?`,
      a: `La mejor época para visitar ${nombre} depende del tipo de actividades que quieras hacer. Generalmente, la primavera y el otoño ofrecen temperaturas agradables y menos afluencia turística que los meses de verano.`,
    },
    {
      q: `¿Va a llover en ${nombre} esta semana?`,
      a: `La probabilidad de lluvia en ${nombre} varía en función de la temporada. Consulta la previsión semanal para conocer los días con mayor riesgo de precipitaciones y planificar con antelación.`,
    },
  ];

  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={collectionJsonLd(`El tiempo en ${nombre}`, `/tiempo/${ciudad}`)} />
      <JsonLd data={faqJsonLd(faq)} />
      <Breadcrumbs crumbs={crumbs} />

      <h1 className="mt-4 text-3xl font-extrabold text-ink">El tiempo en {nombre}</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Previsión meteorológica para {nombre}: temperaturas, lluvia, viento y condiciones para los
        próximos días.
      </p>

      {/* Weather placeholder card */}
      <div className="mt-6 rounded-2xl border border-line bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="text-5xl" aria-hidden="true">🌤️</div>
          <div>
            <p className="text-sm font-semibold text-muted uppercase tracking-wide">
              Previsión actual
            </p>
            <p className="mt-1 text-lg font-bold text-ink">{nombre}</p>
            <p className="mt-2 text-sm text-muted">
              Los datos meteorológicos en tiempo real para {nombre} se mostrarán aquí. Por ahora
              puedes consultar la previsión a través de servicios como AEMET, Meteored o Weather.com.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href="https://www.aemet.es"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-blue/10 px-4 py-1.5 text-sm font-medium text-blue hover:bg-blue/20 transition-colors"
              >
                AEMET →
              </a>
              <a
                href="https://www.meteored.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-blue/10 px-4 py-1.5 text-sm font-medium text-blue hover:bg-blue/20 transition-colors"
              >
                Meteored →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* About the place */}
      {place && (
        <div className="mt-6 rounded-xl border border-line bg-card p-5">
          <h2 className="font-bold text-ink">Sobre {nombre}</h2>
          <p className="mt-2 text-sm text-muted">{intro}</p>
          <Link
            href={`/chat/${ciudad}`}
            className="mt-3 inline-block text-sm font-semibold text-blue hover:underline"
          >
            Entrar al chat de {nombre} →
          </Link>
        </div>
      )}

      {/* Chat CTA */}
      <section className="mt-8 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-800 p-6 text-white">
        <p className="text-sm font-semibold opacity-80">Comunidad local</p>
        <h2 className="mt-1 text-xl font-extrabold">¿Cómo está el tiempo por {nombre}?</h2>
        <p className="mt-1 text-sm opacity-80">
          Comenta el tiempo con gente de {nombre} en el chat.
        </p>
        <div className="mt-4">
          <NickInput canal={ciudad} variant="onColor" placeholder={`Tu nick para el chat de ${nombre}...`} />
        </div>
      </section>

      {/* FAQ */}
      <div className="mt-8">
        <FAQBlock items={faq} />
      </div>
    </main>
  );
}
