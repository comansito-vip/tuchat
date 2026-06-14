import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { getPrimaryTopics } from "@/data";
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
  const topics = getPrimaryTopics();

  return (
    <div className="flex snap-x gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-5">
      {topics.map((place) => (
        <div key={place.slug} className="min-w-[140px] shrink-0 snap-start sm:min-w-0">
          <CategoryCard place={place} />
        </div>
      ))}
    </div>
  );
}
