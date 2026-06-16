import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { NickInput } from "@/components/ui/NickInput";
import { RoomCard } from "./RoomCard";
import { getCountries, getCities, getRooms } from "@/data";


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

        <div className="mt-5">
          <SearchInput size="lg" />
        </div>

        <div className="mt-4">
          <NickInput canal="espana" placeholder="Tu nick para entrar al chat..." />
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

      {/* RIGHT column — top 3 rooms, visible only on lg+ */}
      <div className="hidden flex-col gap-3 lg:flex">
        {rooms.slice(0, 3).map((place) => (
          <RoomCard key={place.slug} place={place} />
        ))}
      </div>
    </section>
  );
}
