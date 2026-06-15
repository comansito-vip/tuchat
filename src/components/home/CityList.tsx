import Link from "next/link";
import { getCities } from "@/data";

export function CityList() {
  const cities = getCities();
  // Top 40 on mobile (visible above fold equivalent), all on sm+
  const mobileCities = cities.slice(0, 40);

  return (
    <>
      {/* Móvil: grid 2 columnas, top 40 ciudades */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-1 sm:hidden">
        {mobileCities.map((city) => (
          <Link
            key={city.slug}
            href={`/chat/${city.slug}`}
            className="block py-1 text-sm text-muted transition-colors hover:text-blue"
          >
            {city.name}
          </Link>
        ))}
      </div>

      {/* Desktop: columnas CSS con todas las ciudades */}
      <div className="hidden columns-3 gap-x-6 sm:block lg:columns-4">
        {cities.map((city) => (
          <Link
            key={city.slug}
            href={`/chat/${city.slug}`}
            className="block break-inside-avoid py-1 text-sm text-muted transition-colors hover:text-blue"
          >
            {city.name}
          </Link>
        ))}
      </div>
    </>
  );
}
