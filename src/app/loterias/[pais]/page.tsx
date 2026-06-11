import type { Metadata } from "next";
import { getPlace } from "@/data";
import { ScaffoldPage } from "@/components/layout/ScaffoldPage";
import { cap } from "@/lib/slug";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pais: string }>;
}): Promise<Metadata> {
  const { pais } = await params;
  const place = getPlace(pais);
  const nombre = place?.name ?? cap(pais);
  return {
    title: `Loterías y sorteos en ${nombre}`,
    description: `Resultados de loterías y sorteos en ${nombre}. Comprueba los números premiados de hoy y de los últimos sorteos.`,
    alternates: { canonical: `/loterias/${pais}` },
  };
}

export default async function LoteriasPage({
  params,
}: {
  params: Promise<{ pais: string }>;
}) {
  const { pais } = await params;
  const place = getPlace(pais);
  const nombre = place?.name ?? cap(pais);

  const crumbs = [
    { name: "Inicio", url: "/" },
    { name: "Loterías", url: "/loterias/espana" },
    { name: nombre, url: `/loterias/${pais}` },
  ];

  return (
    <ScaffoldPage
      title={`Loterías y sorteos en ${nombre}`}
      crumbs={crumbs}
      intro={`Consulta los resultados de las loterías y sorteos más populares de ${nombre}. Números premiados, premios y fechas de los próximos sorteos, actualizados al instante.`}
    />
  );
}
