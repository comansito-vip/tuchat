import { RoomGrid } from "@/components/ui/RoomGrid";
import { slugify } from "@/lib/slug";
import type { Place } from "@/data";

// Ancla estable por provincia, para poder enlazar /chat/{comunidad}#prov-sevilla
// desde los chips de provincia de RegionGroupedGrid.
export function provinciaAnchor(provincia: string): string {
  return `prov-${slugify(provincia).replace(/\//g, "-")}`;
}

// Segundo nivel de agrupado, dentro de la página de una comunidad autónoma
// (/chat/andalucia, /chat/cataluna...): sus ciudades agrupadas por provincia.
export function ProvinciaGroupedGrid({ cities, initialPerProvincia = 8 }: { cities: Place[]; initialPerProvincia?: number }) {
  const groups = new Map<string, Place[]>();
  for (const c of cities) {
    const key = c.provincia ?? "Otras";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(c);
  }
  const sorted = [...groups.entries()].sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="space-y-8">
      {sorted.map(([provincia, list]) => (
        <section key={provincia} id={provinciaAnchor(provincia)} className="scroll-mt-20">
          <div className="mb-3 flex items-baseline gap-2">
            <h3 className="font-display text-lg font-bold text-ink">{provincia}</h3>
            <span className="text-sm text-muted">· {list.length} {list.length === 1 ? "ciudad" : "ciudades"}</span>
          </div>
          <RoomGrid places={list} initialCount={initialPerProvincia} />
        </section>
      ))}
    </div>
  );
}
