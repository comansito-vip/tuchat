import type { Metadata } from "next";
import { getPlace, getCities, getCountries } from "@/data";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { RoomCard } from "@/components/home/RoomCard";
import { ScaffoldPage } from "@/components/layout/ScaffoldPage";
import { cap } from "@/lib/slug";

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
      title: `Chat de ${place.name}`,
      description: place.intro,
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

    return (
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Breadcrumbs crumbs={crumbs} />
        <h1 className="mt-4 text-3xl font-extrabold text-ink">Chat de {place.name}</h1>
        <p className="mt-2 max-w-2xl text-muted">{place.intro}</p>
        <div className="mt-4">
          <Button href={`/webchat?canal=${pais}`} variant="primary">
            Entrar al chat de {place.name}
          </Button>
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
