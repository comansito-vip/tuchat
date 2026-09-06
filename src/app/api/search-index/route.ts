import { NextResponse } from "next/server";
import { getMergedCountries, getMergedCities, getMergedTopics } from "@/data/merged";
import { cityFlag } from "@/data";
import { conectados } from "@/lib/irc-muestra";

export const runtime = "nodejs";
// Estático: el índice se hornea en build y se sirve como un fichero más. Antes
// las 2.511 salas viajaban serializadas en el HTML de /chat (~858 KB de payload
// RSC en cada visita, se escribiera o no en el buscador). Ahora /chat pesa lo
// que ocupa su propio contenido y esto solo se descarga al usar la búsqueda.
export const dynamic = "force-static";
export const revalidate = 3600;

// GET /api/search-index → [{s: slug, n: nombre, i: icono, f: bandera, u: usuarios}]
// Claves de una letra: con 2.511 salas, los nombres largos de campo por sí solos
// sumaban decenas de KB.
export async function GET() {
  const [countries, cities, topics] = await Promise.all([
    getMergedCountries(),
    getMergedCities(),
    getMergedTopics(),
  ]);

  const rooms = [...countries, ...cities, ...topics].map((p) => {
    const flag = cityFlag(p);
    return {
      s: p.slug,
      n: p.name,
      i: flag.icon,
      // Omitido cuando no hay bandera: era "$undefined" en casi todas las filas.
      ...(flag.flagSrc ? { f: flag.flagSrc, fn: flag.name } : {}),
      // Conectados reales del canal en la última muestra; se omite si no hay.
      ...(conectados(p) !== null ? { u: conectados(p)! } : {}),
    };
  });

  return NextResponse.json(rooms);
}
