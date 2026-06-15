import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Flag } from "@/components/ui/Flag";
import { CONTINENTS, getPlace } from "@/data";

export function CountryGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {CONTINENTS.map((continent) => (
        <Card key={continent.title} className="p-4">
          <h3 className="mb-3 font-bold text-ink">{continent.title}</h3>
          <div className="flex flex-wrap gap-1.5">
            {continent.places.map((place) => {
              const icon = getPlace(place.slug)?.icon ?? "";
              return (
                <Link
                  key={place.slug}
                  href={`/pais/${place.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-muted transition-colors hover:bg-brand/6 hover:text-ink"
                >
                  <Flag emoji={icon} name={place.name} size={17} />
                  {place.name}
                </Link>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}
