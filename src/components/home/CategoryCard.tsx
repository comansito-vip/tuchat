import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { getPrimaryTopics } from "@/data";
import type { Place } from "@/data";

/** Maps a topic slug to its Tailwind 4 accent class pair (bg + text). */
const ACCENT: Record<string, { bg: string; text: string }> = {
  amor:        { bg: "bg-amor/12",      text: "text-amor" },
  amistad:     { bg: "bg-amistad/12",   text: "text-amistad" },
  lgtbi:       { bg: "bg-amor/12",      text: "text-amor" },
  deportes:    { bg: "bg-deportes/12",  text: "text-deportes" },
  musica:      { bg: "bg-musica/12",    text: "text-musica" },
  videojuegos: { bg: "bg-juegos/12",    text: "text-juegos" },
  anime:       { bg: "bg-anime/12",     text: "text-anime" },
  tarot:       { bg: "bg-tarot/12",     text: "text-tarot" },
  horoscopo:   { bg: "bg-tarot/12",     text: "text-tarot" },
  viajes:      { bg: "bg-amistad/12",   text: "text-amistad" },
  noticias:    { bg: "bg-brand/10",     text: "text-brand" },
};

const DEFAULT_ACCENT = { bg: "bg-brand/10", text: "text-brand" };

export function CategoryCard({ place }: { place: Place }) {
  const accent = ACCENT[place.slug] ?? DEFAULT_ACCENT;

  return (
    <Link href={`/chat/${place.slug}`} className="block">
      <Card
        variant="interactive"
        className="flex flex-col items-center gap-2 p-4 text-center"
      >
        <span
          className={`grid h-11 w-11 place-items-center rounded-xl text-xl ${accent.bg} ${accent.text}`}
          aria-hidden="true"
        >
          {place.icon}
        </span>
        <span className="text-sm font-semibold text-ink">{place.name}</span>
      </Card>
    </Link>
  );
}

export function CategoryGrid() {
  const topics = getPrimaryTopics();

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
      {topics.map((place) => (
        <CategoryCard key={place.slug} place={place} />
      ))}
    </div>
  );
}
