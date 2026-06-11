import Link from "next/link";
import { getCities } from "@/data";

export function CityList() {
  const cities = getCities();

  return (
    <div className="columns-2 gap-x-6 sm:columns-3 lg:columns-4">
      {cities.map((city) => (
        <Link
          key={city.slug}
          href={`/chat/${city.slug}`}
          className="block break-inside-avoid py-1 text-sm text-muted hover:text-blue transition-colors"
        >
          {city.name}
        </Link>
      ))}
    </div>
  );
}
