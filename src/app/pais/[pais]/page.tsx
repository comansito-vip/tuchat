import type { Metadata } from "next";
import { getPlace, getCities, getCountries } from "@/data";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { NickInput } from "@/components/ui/NickInput";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { RoomCard } from "@/components/home/RoomCard";
import { FAQBlock } from "@/components/room/FAQBlock";
import { ScaffoldPage } from "@/components/layout/ScaffoldPage";
import { cap } from "@/lib/slug";
import { breadcrumbJsonLd, collectionJsonLd, faqJsonLd, JsonLd } from "@/lib/seo";

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
  if (place) {
    return {
      title: `Salas de chat de ${place.name}`,
      description: `Directorio de salas de chat de ${place.name}: explora por ciudades y temáticas y entra gratis a conocer gente de ${place.name}.`,
      alternates: { canonical: `/pais/${pais}` },
    };
  }
  return {
    title: `Chat de ${cap(pais)}`,
    description: `Únete al chat de ${cap(pais)} y conecta con personas de habla hispana de todo el mundo.`,
    alternates: { canonical: `/pais/${pais}` },
  };
}

export default async function PaisPage({
  params,
}: {
  params: Promise<{ pais: string }>;
}) {
  const { pais } = await params;
  const place = getPlace(pais);

  if (place && place.kind === "pais") {
    const cities = getCities().filter((c) => c.parentSlug === pais);
    const crumbs = [
      { name: "Inicio", url: "/" },
      { name: place.name, url: `/pais/${pais}` },
    ];

    const nombre = place.name;
    const faq = [
      {
        q: `¿Cómo entro al chat de ${nombre} gratis?`,
        a: `Para entrar al chat de ${nombre} gratis solo tienes que elegir un nick y pulsar «Entrar al chat». No hace falta registro ni correo electrónico: el acceso es instantáneo y funciona desde el móvil y el ordenador.`,
      },
      {
        q: `¿Qué salas de ${nombre} hay disponibles?`,
        a: `Hay salas por ciudades y por temáticas. ${cities.length > 0 ? `En ${nombre} puedes chatear en ${cities.slice(0, 3).map((c) => c.name).join(", ")}${cities.length > 3 ? " y más ciudades" : ""}.` : ""} También hay salas de amor, amistad, deportes y muchas otras temáticas abiertas a personas de ${nombre}.`,
      },
      {
        q: `¿Necesito instalar algo para usar el chat de ${nombre}?`,
        a: `No. El chat de ${nombre} funciona directamente en el navegador, sin descargas ni aplicaciones. Es compatible con cualquier dispositivo: móvil, tablet u ordenador.`,
      },
      {
        q: `¿El chat de ${nombre} es seguro?`,
        a: `Sí. No pedimos datos personales para acceder. Recomendamos usar un nick en lugar de tu nombre real y no compartir información privada con desconocidos. Si encuentras comportamientos abusivos, puedes reportarlos desde el chat.`,
      },
    ];

    return (
      <main className="mx-auto max-w-6xl px-4 py-6">
        <JsonLd data={breadcrumbJsonLd(crumbs)} />
        <JsonLd data={collectionJsonLd(`Chat de ${nombre}`, `/pais/${pais}`)} />
        <JsonLd data={faqJsonLd(faq)} />
        <Breadcrumbs crumbs={crumbs} />
        <h1 className="mt-4 text-3xl font-extrabold text-ink">Chat de {nombre}</h1>
        <p className="mt-2 max-w-2xl text-muted">{place.intro}</p>
        <div className="mt-4 max-w-sm">
          <NickInput canal={pais} placeholder={`Tu nick para entrar a ${nombre}...`} />
        </div>

        <section className="mt-8">
          <SectionTitle>Ciudades y salas</SectionTitle>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <RoomCard place={place} />
            {cities.map((c) => (
              <RoomCard key={c.slug} place={c} />
            ))}
          </div>
        </section>

        <FAQBlock items={faq} />
      </main>
    );
  }

  // Not found or non-country place
  const nombre = place?.name ?? cap(pais);
  const crumbs = [
    { name: "Inicio", url: "/" },
    { name: "Países", url: "/chat" },
    { name: nombre, url: `/pais/${pais}` },
  ];

  return (
    <ScaffoldPage
      title={`Chat de ${nombre}`}
      crumbs={crumbs}
      intro={`Próximamente podrás unirte al chat de ${nombre} y conectar con personas de habla hispana de este país. Estamos preparando la sala para ti.`}
    />
  );
}
