import Link from "next/link";
import { cityFlag, getCities } from "@/data";
import { Flag } from "@/components/ui/Flag";

// Curada por popularidad real (campo users), no el índice completo: la
// cobertura SEO de las 807 ciudades ya vive en /chat (jerarquía país→ciudades).
const DESKTOP_COUNT = 48;
const MOBILE_COUNT = 24;

// Si dos ciudades homónimas entran en el top (Barcelona ES/VE, Mérida…), el
// lector de pantalla necesita distinguir los links. El aria-label va siempre:
// la bandera lleva alt ("Bandera de Comunidad de Madrid") y sin él el nombre
// accesible del enlace sería "Bandera de Comunidad de Madrid Madrid".
function dupNames(cities: ReturnType<typeof getCities>) {
  const count: Record<string, number> = {};
  for (const c of cities) count[c.name] = (count[c.name] ?? 0) + 1;
  return new Set(Object.keys(count).filter((n) => count[n] > 1));
}

export function CityList() {
  const cities = [...getCities()].sort((a, b) => b.users - a.users);
  const mobileCities = cities.slice(0, MOBILE_COUNT);
  const desktopCities = cities.slice(0, DESKTOP_COUNT);
  const dupes = dupNames(desktopCities);
  const label = (city: (typeof cities)[number]) =>
    dupes.has(city.name) && city.parentName
      ? `${city.name} (${city.parentName})`
      : city.name;

  return (
    <>
      {/* Móvil: grid 2 columnas, top ciudades por popularidad */}
      <div className="grid grid-cols-2 gap-x-6 sm:hidden">
        {mobileCities.map((city) => {
          const flag = cityFlag(city);
          return (
            <Link
              key={city.slug}
              href={`/chat/${city.slug}`}
              aria-label={label(city)}
              className="flex items-center gap-1.5 py-2 text-sm text-muted transition-colors hover:text-blue"
            >
              <Flag emoji={flag.icon} flagSrc={flag.flagSrc} name={flag.name} size={14} />
              <span className="min-w-0 flex-1 truncate">{city.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Desktop: columnas CSS con las ciudades más populares */}
      <div className="hidden columns-3 gap-x-6 sm:block lg:columns-4">
        {desktopCities.map((city) => {
          const flag = cityFlag(city);
          return (
            <Link
              key={city.slug}
              href={`/chat/${city.slug}`}
              aria-label={label(city)}
              className="flex items-center gap-1.5 break-inside-avoid py-1 text-sm text-muted transition-colors hover:text-blue"
            >
              <Flag emoji={flag.icon} flagSrc={flag.flagSrc} name={flag.name} size={14} />
              <span className="min-w-0 flex-1 truncate">{city.name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
