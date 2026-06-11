import Link from "next/link";
import { getRelated } from "@/data";

export function RelatedRooms({ slugs }: { slugs: string[] }) {
  const places = getRelated(slugs);

  return (
    <div className="flex flex-wrap gap-2">
      {places.map((place) => (
        <Link
          key={place.slug}
          href={`/chat/${place.slug}`}
          className="rounded-full border border-line bg-card px-3 py-1.5 text-sm text-blue-dark hover:border-blue"
        >
          {place.icon} {place.name}
        </Link>
      ))}
    </div>
  );
}
