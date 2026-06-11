import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { getTopics } from "@/data";
import type { Place } from "@/data";

export function CategoryCard({ place }: { place: Place }) {
  return (
    <Link href={`/chat/${place.slug}`} className="block">
      <Card className="p-4 text-center transition-colors hover:border-blue">
        <div className="text-2xl" aria-hidden="true">{place.icon}</div>
        <div className="mt-1 font-semibold text-ink">{place.name}</div>
      </Card>
    </Link>
  );
}

export function CategoryGrid() {
  const topics = getTopics();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {topics.map((place) => (
        <CategoryCard key={place.slug} place={place} />
      ))}
    </div>
  );
}
