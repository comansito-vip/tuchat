import type { Metadata } from "next";
import { getPlace } from "@/data";
import { ScaffoldPage } from "@/components/layout/ScaffoldPage";
import { cap } from "@/lib/slug";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ciudad: string }>;
}): Promise<Metadata> {
  const { ciudad } = await params;
  const place = getPlace(ciudad);
  const nombre = place?.name ?? cap(ciudad);
  return {
    title: `El tiempo en ${nombre}`,
    description: `Consulta la previsión meteorológica para ${nombre}. Temperaturas, lluvia y viento actualizados.`,
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

  const crumbs = [
    { name: "Inicio", url: "/" },
    { name: "Tiempo", url: "/tiempo/madrid" },
    { name: nombre, url: `/tiempo/${ciudad}` },
  ];

  return (
    <ScaffoldPage
      title={`El tiempo en ${nombre}`}
      crumbs={crumbs}
      intro={`Consulta la previsión del tiempo para ${nombre}: temperaturas máximas y mínimas, probabilidad de lluvia, viento y condiciones generales para los próximos días.`}
    />
  );
}
