import Link from "next/link";
import { RoomGrid } from "@/components/ui/RoomGrid";
import { Flag } from "@/components/ui/Flag";
import { provinciaAnchor } from "@/components/ui/ProvinciaGroupedGrid";
import { getRegions, type Place } from "@/data";

// /chat/espana volcaba sus 893 ciudades en una única lista plana con "ver
// más". Agrupado por comunidad autónoma (con su bandera real) es como
// realmente se organiza el país; bajo cada comunidad, chips de sus
// provincias que enlazan al listado por provincia de /chat/{comunidad}.
export function RegionGroupedGrid({ cities, initialPerRegion = 8 }: { cities: Place[]; initialPerRegion?: number }) {
  const regionMap = new Map(getRegions().map((r) => [r.slug, r]));
  const groups = new Map<string, Place[]>();
  for (const c of cities) {
    const key = c.regionSlug ?? "otras";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(c);
  }
  const sorted = [...groups.entries()].sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="space-y-8">
      {sorted.map(([regionSlug, list]) => {
        const region = regionMap.get(regionSlug);
        // Provincias de esta comunidad, ordenadas por número de ciudades.
        const provincias = [...new Set(list.map((c) => c.provincia).filter((p): p is string => Boolean(p)))];
        provincias.sort((a, b) => list.filter((c) => c.provincia === b).length - list.filter((c) => c.provincia === a).length);
        return (
          <section key={regionSlug}>
            {/* h3 de verdad, no un enlace con pinta de título: son los únicos
                puntos de aterrizaje del rotor de encabezados en una página con
                893 ciudades (ProvinciaGroupedGrid ya lo hacía así). */}
            <h3 className="mb-3 flex items-baseline gap-2">
              {region ? (
                <Link
                  href={`/chat/${region.slug}`}
                  className="inline-flex items-center gap-2 font-display text-lg font-bold text-ink hover:text-blue"
                >
                  <Flag emoji={region.icon} flagSrc={region.flagSrc} name={region.name} size={24} />
                  {region.name}
                </Link>
              ) : (
                <span className="font-display text-lg font-bold text-ink">Otras ciudades</span>
              )}
              <span className="text-sm font-normal text-muted">· {list.length} {list.length === 1 ? "ciudad" : "ciudades"}</span>
            </h3>
            {region && provincias.length > 1 && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {provincias.map((p) => (
                  <Link
                    key={p}
                    href={`/chat/${region.slug}#${provinciaAnchor(p)}`}
                    className="inline-flex items-center rounded-full border border-line bg-bg px-2.5 py-1 text-xs text-ink transition-colors hover:border-blue hover:text-blue"
                  >
                    {p}
                  </Link>
                ))}
              </div>
            )}
            <RoomGrid places={list} initialCount={initialPerRegion} />
          </section>
        );
      })}
    </div>
  );
}
