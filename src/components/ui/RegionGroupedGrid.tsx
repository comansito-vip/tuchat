import Link from "next/link";
import { RoomGrid } from "@/components/ui/RoomGrid";
import { Flag } from "@/components/ui/Flag";
import { getRegions, type Place } from "@/data";

// /chat/espana volcaba sus 893 ciudades en una única lista plana con "ver
// más". Agrupado por comunidad autónoma (con su bandera real) es como
// realmente se organiza el país, y cada grupo enlaza a /chat/{comunidad}
// donde vive el listado completo de esa comunidad.
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
        return (
          <section key={regionSlug}>
            <div className="mb-3 flex items-baseline gap-2">
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
              <span className="text-sm text-muted">· {list.length} {list.length === 1 ? "ciudad" : "ciudades"}</span>
            </div>
            <RoomGrid places={list} initialCount={initialPerRegion} />
          </section>
        );
      })}
    </div>
  );
}
