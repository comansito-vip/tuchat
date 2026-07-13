import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Flag } from "@/components/ui/Flag";
import { CONTINENTS, cityFlag, getChildren, getPlace } from "@/data";

// La ciudad con más usuarios de cada país: el chip de país no queda solo
// (antes España aparecía sin ninguna ciudad al lado, a diferencia de /chat).
function topCity(countrySlug: string) {
  const cities = getChildren(countrySlug).filter((c) => c.kind === "ciudad");
  if (cities.length === 0) return null;
  return [...cities].sort((a, b) => b.users - a.users)[0];
}

export function CountryGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {CONTINENTS.map((continent) => (
        <Card key={continent.title} className="p-4">
          <h3 className="mb-3 font-bold text-ink">{continent.title}</h3>
          <div className="flex flex-wrap gap-1.5">
            {continent.places.map((place) => {
              const icon = getPlace(place.slug)?.icon ?? "";
              const city = topCity(place.slug);
              return (
                <span key={place.slug} className="inline-flex items-center">
                  <Link
                    href={`/chat/${place.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-muted transition-colors hover:bg-brand/6 hover:text-ink"
                  >
                    <Flag emoji={icon} size={17} />
                    {place.name}
                  </Link>
                  {city && (
                    <Link
                      href={`/chat/${city.slug}`}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-muted transition-colors hover:bg-brand/6 hover:text-ink"
                    >
                      <Flag emoji={cityFlag(city).icon} flagSrc={cityFlag(city).flagSrc} size={13} />
                      {city.name}
                    </Link>
                  )}
                </span>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}
