import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { NickInput } from "@/components/ui/NickInput";
import { RoomCard } from "./RoomCard";
import { getCountries, getCities, getRooms } from "@/data";

const QUICK_LINKS = [
  { label: "España", slug: "espana" },
  { label: "México", slug: "mexico" },
  { label: "Argentina", slug: "argentina" },
  { label: "Madrid", slug: "madrid" },
  { label: "Barcelona", slug: "barcelona" },
  { label: "Gay", slug: "gay" },
  { label: "Anime", slug: "anime" },
];

export function HeroSearch() {
  const countries = getCountries();
  const cities = getCities();
  const rooms = getRooms();

  const totalUsers = rooms.reduce((sum, r) => sum + r.users, 0);

  const stats = [
    { value: countries.length + "+", label: "Países" },
    { value: cities.length + "+", label: "Ciudades" },
    { value: totalUsers.toLocaleString("es"), label: "Usuarios conectados" },
    { value: "Top 10", label: "Ranking diario" },
  ];

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1.1fr_.9fr] lg:py-16">
      {/* LEFT column */}
      <div>
        <h1 className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
          Chat gratis en español
        </h1>
        <p className="mt-3 max-w-xl text-muted">
          Chatear online gratis y sin registro en salas de chat por países, ciudades y temáticas.
          Conoce gente nueva, haz amigos o liga con miles de usuarios de habla hispana.
        </p>

        {/* NickInput primero */}
        <div className="mt-5" data-testid="nick-input">
          <NickInput canal="espana" placeholder="Tu nick para entrar al chat..." />
        </div>

        {/* Quick-links chips */}
        <nav aria-label="Salas populares" className="mt-3 flex flex-wrap gap-2">
          {QUICK_LINKS.map((ql) => (
            <Link
              key={ql.slug}
              href={`/chat/${ql.slug}`}
              className="inline-flex items-center rounded-full border border-line bg-card px-4 py-2 text-sm font-medium text-ink hover:border-blue hover:text-blue transition-colors"
            >
              {ql.label}
            </Link>
          ))}
        </nav>

        {/* SearchInput después */}
        <div className="mt-4" data-testid="search-input">
          <SearchInput size="lg" />
        </div>

        <div className="mt-3">
          <Button href="#salas" variant="secondary" size="sm">
            Ver salas populares →
          </Button>
        </div>

        <dl className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="text-xs text-muted">{s.label}</dt>
              <dd className="text-xl font-bold text-ink">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* RIGHT column */}
      <div className="hidden flex-col gap-3 lg:flex">
        {rooms.slice(0, 3).map((place) => (
          <RoomCard key={place.slug} place={place} />
        ))}
      </div>
    </section>
  );
}
