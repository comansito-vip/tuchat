import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { CONTINENTS } from "@/data";

export function CountryGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {CONTINENTS.map((continent) => (
        <Card key={continent.title} className="p-4">
          <h3 className="mb-2 font-bold text-ink">{continent.title}</h3>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {continent.places.map((place) => (
              <Link
                key={place.slug}
                href={`/pais/${place.slug}`}
                className="text-sm text-muted hover:text-blue transition-colors"
              >
                {place.name}
              </Link>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
