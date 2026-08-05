import type { Metadata } from "next";
import { getPlace, getCities, getCountries, roomName } from "@/data";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { NickInput } from "@/components/ui/NickInput";
import { FAQBlock } from "@/components/room/FAQBlock";
import { cap } from "@/lib/slug";
import { collectionJsonLd, faqJsonLd, JsonLd, OG_BASE } from "@/lib/seo";
import Link from "next/link";
import { fetchWeather, wmoText, rainyDays, hasWeather } from "@/lib/weather";
import { WeatherWidget } from "@/components/tiempo/WeatherWidget";

export const revalidate = 3600;
export const dynamicParams = false;

// Solo se publica la página de las localidades para las que hay previsión real.
// Publicar una landing titulada "Previsión del tiempo en X" que por dentro dice
// "sin datos disponibles" es contenido fino: promete un servicio que no presta,
// y en volumen (eran 1.970 páginas) arrastra la calidad de todo el dominio.
export function generateStaticParams() {
  return [...getCities(), ...getCountries()]
    .filter((c) => hasWeather(c.slug))
    .map((c) => ({ ciudad: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ciudad: string }>;
}): Promise<Metadata> {
  const { ciudad } = await params;
  const place = getPlace(ciudad);
  const nombre = place?.name ?? cap(ciudad);
  // Hay 63 nombres de ciudad repetidos en el catálogo (Madrid de España y el de
  // Cundinamarca, tres Méridas...): sin cualificar, sus páginas de tiempo
  // emitían el mismo <title> y competían entre sí, igual que pasaba en /chat.
  const nombreSEO = place ? roomName(place) : nombre;

  // La descripción sale de la previsión real, no de una plantilla. Antes las
  // 1.965 páginas de /tiempo emitían la MISMA frase salvo el nombre, y son el
  // 40% del sitemap: es exactamente el patrón que tenía /chat y que Google
  // saldaba dejando las páginas en "Descubierta: actualmente sin indexar".
  // El fetch no añade coste: `fetchWeather` usa `fetch` con revalidate 3600 y
  // Next deduplica la misma petición que hace el cuerpo de la página.
  const w = await fetchWeather(ciudad);
  // "Madrid (Madrid)" no aporta nada: se omite el cualificador cuando repite el
  // nombre de la ciudad, que pasa en toda capital de provincia homónima.
  const candidato = place?.provincia ?? place?.parentName;
  const ubicacion = candidato && candidato !== place?.name ? candidato : undefined;
  const description = w
    ? `${nombreSEO}${ubicacion ? ` (${ubicacion})` : ""}: ${Math.round(w.current.temp)}°C y ${wmoText(
        w.current.weatherCode,
      ).toLowerCase()} ahora, máxima de ${w.maxTemp}° y mínima de ${w.minTemp}°. Previsión a ${
        w.forecast.length
      } días con lluvia y viento.`
    : `Previsión del tiempo en ${nombreSEO}: temperaturas, lluvia y viento para los próximos días. Consulta el forecast actualizado en TuChat.`;

  return {
    // "Tiempo en X" y no "Previsión del tiempo en X": con el cualificador
    // detrás, el título largo se pasaba de los 60 caracteres que muestra Google.
    title: `Tiempo en ${nombreSEO}`,
    description,
    alternates: { canonical: `/tiempo/${ciudad}` },
    openGraph: { ...OG_BASE, url: `/tiempo/${ciudad}` },
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
  // Cualificado solo donde identifica la página (H1, migas, JSON-LD): repetir
  // "Madrid (Cundinamarca)" en cada frase de las FAQ se leería fatal.
  const nombreSEO = place ? roomName(place) : nombre;
  const parentName = place?.parentName;

  const weatherData = await fetchWeather(ciudad);

  // Sin migaja intermedia "El tiempo": no existe un índice /tiempo real (solo
  // /tiempo/{ciudad}), así que un crumb fijo a /tiempo/madrid duplicaba la URL
  // de esta misma página en /tiempo/madrid y era simplemente incorrecto en
  // cualquier otra ciudad.
  const crumbs = [
    { name: "Inicio", url: "/" },
    { name: nombreSEO, url: `/tiempo/${ciudad}` },
  ];

  // FAQ con datos meteorológicos reales por ciudad (cuando hay forecast) en lugar
  // de respuestas plantilla idénticas. Si no hay datos, cae a texto genérico.
  const w = weatherData;
  const lluvia = w ? rainyDays(w) : 0;
  const faq = w
    ? [
        {
          q: `¿Cuál es el tiempo en ${nombre} hoy?`,
          a: `Ahora mismo en ${nombre} hay ${Math.round(w.current.temp)}°C con ${wmoText(w.current.weatherCode)}. Para hoy se prevé una máxima de ${w.maxTemp}° y una mínima de ${w.minTemp}°, con viento de unos ${w.current.windSpeed} km/h${w.current.precipitation > 0 ? ` y ${w.current.precipitation} mm de precipitación` : ""}.`,
        },
        {
          q: `¿Qué temperatura hace en ${nombre}?`,
          a: `La temperatura en ${nombre} oscila hoy entre los ${w.minTemp}° de mínima y los ${w.maxTemp}° de máxima${parentName ? ` (${parentName})` : ""}. Los datos se actualizan cada hora desde estaciones meteorológicas reales.`,
        },
        {
          q: `¿Va a llover en ${nombre} esta semana?`,
          a:
            lluvia > 0
              ? `Según la previsión a 5 días, se esperan precipitaciones en ${lluvia} de los próximos ${w.forecast.length} días en ${nombre}. Revisa el detalle día a día arriba para planificar.`
              : `La previsión a 5 días no anticipa lluvias significativas en ${nombre}: predominan los días estables. Consulta el detalle por jornada más arriba.`,
        },
        {
          q: `¿Necesito registrarme para ver el tiempo o chatear sobre ${nombre}?`,
          a: `No. La previsión de ${nombre} es de acceso libre y el chat de la ciudad funciona sin registro: eliges un nick y entras al instante desde el móvil o el ordenador.`,
        },
      ]
    : [
        {
          q: `¿Cómo consulto el tiempo en ${nombre}?`,
          a: `Estamos ampliando la cobertura meteorológica a ${nombre}. Mientras tanto, puedes entrar al chat de ${nombre} y preguntar a la comunidad local cómo está el tiempo en directo.`,
        },
        {
          q: `¿Necesito registrarme para chatear sobre ${nombre}?`,
          a: `No. El chat de ${nombre} funciona sin registro ni descargas: eliges un nick y entras al instante desde cualquier dispositivo.`,
        },
      ];

  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      <JsonLd data={collectionJsonLd(`El tiempo en ${nombreSEO}`, `/tiempo/${ciudad}`)} />
      <JsonLd data={faqJsonLd(faq)} />
      <Breadcrumbs crumbs={crumbs} />

      <h1 className="mt-4 text-3xl font-extrabold text-ink">El tiempo en {nombreSEO}</h1>
      {/* Entradilla con la observación real, no la misma frase en 1.965 páginas. */}
      <p className="mt-2 max-w-2xl text-muted">
        {w
          ? `Ahora mismo ${Math.round(w.current.temp)}°C y ${wmoText(w.current.weatherCode).toLowerCase()} en ${nombre}${
              parentName ? ` (${parentName})` : ""
            }. Previsión a ${w.forecast.length} días con temperaturas, lluvia y viento, actualizada cada hora.`
          : `Previsión meteorológica para ${nombre}: temperaturas, lluvia, viento y condiciones para los próximos días.`}
      </p>

      <WeatherWidget data={weatherData} nombre={nombre} />

      {/* Resumen meteorológico con datos reales (sin reciclar el 'about' del chat) */}
      {place && (
        <div className="mt-6 rounded-xl border border-line bg-card p-5">
          <h2 className="font-bold text-ink">El tiempo en {nombre} de un vistazo</h2>
          <p className="mt-2 text-sm text-muted">
            {w
              ? `Hoy en ${nombre} se registran ${Math.round(w.current.temp)}°C con ${wmoText(w.current.weatherCode)}, máxima de ${w.maxTemp}° y mínima de ${w.minTemp}°. ${lluvia > 0 ? `Se esperan precipitaciones en ${lluvia} de los próximos ${w.forecast.length} días.` : "No se prevén lluvias destacadas en los próximos días."} Datos actualizados cada hora.`
              : `Estamos ampliando la previsión meteorológica para ${nombre}. Mientras tanto, entra al chat y comenta el tiempo con la comunidad local.`}
          </p>
          <Link
            href={`/chat/${ciudad}`}
            className="mt-3 inline-block text-sm font-semibold text-blue hover:underline"
          >
            Entrar al chat de {nombre} →
          </Link>
        </div>
      )}

      {/* Chat CTA */}
      <section className="mt-8 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-900 p-6 text-white">
        <p className="text-sm font-semibold text-white/90">Comunidad local</p>
        <h2 className="mt-1 text-xl font-extrabold">¿Cómo está el tiempo por {nombre}?</h2>
        <p className="mt-1 text-sm text-white/90">
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
