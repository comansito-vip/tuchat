import Link from "next/link";
import { cityFlag, getCities } from "@/data";
import { Flag } from "@/components/ui/Flag";

export function CityList() {
  const cities = getCities();
  // Top 40 on mobile (visible above fold equivalent), all on sm+
  const mobileCities = cities.slice(0, 40);

  return (
    <>
      {/* Móvil: grid 2 columnas, top 40 ciudades */}
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

      {/* Desktop: columnas CSS con todas las ciudades */}
      <div className="hidden columns-3 gap-x-6 sm:block lg:columns-4">
        {cities.map((city) => {
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
