import { RoomCard } from "@/components/home/RoomCard";
import type { Place } from "@/data";

const GRID = "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4";

// <details> nativo en vez de un componente cliente: el resto de salas queda
// en el DOM (SEO/crawlers lo ven) pero colapsado hasta que el usuario pide
// ver más, sin coste de hidratación.
export function RoomGrid({ places, initialCount = 12 }: { places: Place[]; initialCount?: number }) {
  const visible = places.slice(0, initialCount);
  const rest = places.slice(initialCount);

  return (
    <>
      <div className={GRID}>
        {visible.map((p) => (
          <RoomCard key={p.slug} place={p} />
        ))}
      </div>
      {rest.length > 0 && (
        <details className="group mt-3">
          <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-sm font-semibold text-blue hover:text-blue-dark">
            Ver todas ({rest.length} más)
            <span className="transition-transform group-open:rotate-180" aria-hidden="true">▼</span>
          </summary>
          <div className={`${GRID} mt-3`}>
            {rest.map((p) => (
              <RoomCard key={p.slug} place={p} />
            ))}
          </div>
        </details>
      )}
    </>
  );
}
