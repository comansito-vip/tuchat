import Link from "next/link";
import { RoomCard } from "@/components/home/RoomCard";
import { roomName, type Place } from "@/data";

const GRID = "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4";

/**
 * A partir de este número, el resto de salas se listan como enlaces de texto en
 * vez de como tarjetas.
 *
 * Cada `RoomCard` lleva icono, insignia, contador de gente y botón, y entre el
 * HTML y el payload de React sale por unos 4 KB. En /chat/espana, que agrupa las
 * 893 ciudades del país, eso hacía una página de 3,96 MB — la más pesada del
 * sitio con diferencia, y encima detrás de un `<details>` cerrado que casi nadie
 * abre. Los enlaces siguen todos en el DOM, que es lo que importa para el
 * rastreo; lo que se retira es el envoltorio visual de las que no se ven.
 */
const MAX_TARJETAS_OCULTAS = 24;

export function RoomGrid({ places, initialCount = 12 }: { places: Place[]; initialCount?: number }) {
  const visible = places.slice(0, initialCount);
  const rest = places.slice(initialCount);
  const comoLista = rest.length > MAX_TARJETAS_OCULTAS;

  return (
    <>
      <div className={GRID}>
        {visible.map((p) => (
          <RoomCard key={p.slug} place={p} />
        ))}
      </div>
      {rest.length > 0 && (
        // <details> nativo en vez de un componente cliente: el resto de salas
        // queda en el DOM (SEO/crawlers lo ven) pero colapsado hasta que el
        // usuario pide ver más, sin coste de hidratación.
        <details className="group mt-3">
          <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-sm font-semibold text-blue hover:text-blue-dark">
            Ver todas ({rest.length} más)
            <span className="transition-transform group-open:rotate-180" aria-hidden="true">▼</span>
          </summary>
          {comoLista ? (
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-sm">
              {rest.map((p) => (
                <Link
                  key={p.slug}
                  href={`/chat/${p.slug}`}
                  className="text-muted transition-colors hover:text-blue hover:underline"
                >
                  {roomName(p)}
                </Link>
              ))}
            </div>
          ) : (
            <div className={`${GRID} mt-3`}>
              {rest.map((p) => (
                <RoomCard key={p.slug} place={p} />
              ))}
            </div>
          )}
        </details>
      )}
    </>
  );
}
