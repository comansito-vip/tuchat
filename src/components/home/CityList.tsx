import Link from "next/link";
import { cityFlag, getCities } from "@/data";
import { Flag } from "@/components/ui/Flag";

// Curada por popularidad real (campo users), no el índice completo: la
// cobertura SEO de las 807 ciudades ya vive en /chat (jerarquía país→ciudades).
const DESKTOP_COUNT = 48;
const MOBILE_COUNT = 24;

export function CityList() {
  const cities = [...getCities()].sort((a, b) => b.users - a.users);
  const mobileCities = cities.slice(0, MOBILE_COUNT);
  const desktopCities = cities.slice(0, DESKTOP_COUNT);

  return (
    <>
      {/* Móvil: grid 2 columnas, top ciudades por popularidad */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-1 sm:hidden">
        {mobileCities.map((city) => {
          const flag = cityFlag(city);
          return (
            <Link
              key={city.slug}
              href={`/chat/${city.slug}`}
              className="flex items-center gap-1.5 py-1 text-sm text-muted transition-colors hover:text-blue"
            >
              <Flag emoji={flag.icon} flagSrc={flag.flagSrc} size={14} />
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
              className="flex items-center gap-1.5 break-inside-avoid py-1 text-sm text-muted transition-colors hover:text-blue"
            >
              <Flag emoji={flag.icon} flagSrc={flag.flagSrc} size={14} />
              <span className="min-w-0 flex-1 truncate">{city.name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
