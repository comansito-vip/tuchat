import Link from "next/link";
import { Flag } from "@/components/ui/Flag";
import { getRelated } from "@/data";

export function RelatedRooms({ slugs }: { slugs: string[] }) {
  const places = getRelated(slugs);

  return (
    <div className="flex flex-wrap gap-2">
      {places.map((place) => (
        <Link
          key={place.slug}
          href={`/chat/${place.slug}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 text-sm text-blue-dark hover:border-blue"
        >
          <Flag emoji={place.icon} size={16} /> {place.name}
        </Link>
      ))}
    </div>
  );
}
