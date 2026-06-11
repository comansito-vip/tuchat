import { HeroSearch } from "@/components/home/HeroSearch";
import { RoomCard } from "@/components/home/RoomCard";
import { CountryGrid } from "@/components/home/CountryGrid";
import { CityList } from "@/components/home/CityList";
import { CategoryGrid } from "@/components/home/CategoryCard";
import { TrendingBlock } from "@/components/home/TrendingBlock";
import { NewsGrid } from "@/components/home/NewsGrid";
import { RankingTable } from "@/components/home/RankingTable";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getRooms } from "@/data";

export default function HomePage() {
  const rooms = getRooms();
  return (
    <main>
      <HeroSearch />

      <section id="salas" className="mx-auto max-w-6xl px-4 py-10">
        <SectionTitle href="/chat" cta="Ver todas">
          Salas más activas
        </SectionTitle>
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-4">
          {rooms.map((p) => (
            <div key={p.slug} className="min-w-[160px] shrink-0 snap-start sm:min-w-0">
              <RoomCard place={p} />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <SectionTitle>Explora por país</SectionTitle>
        <CountryGrid />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <SectionTitle>Ciudades populares</SectionTitle>
        <CityList />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <SectionTitle>Temáticas</SectionTitle>
        <CategoryGrid />
      </section>

      <TrendingBlock />

      <section className="mx-auto max-w-6xl px-4 py-10">
        <SectionTitle href="/noticias">Noticias y contenidos</SectionTitle>
        <NewsGrid />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <SectionTitle href="/ranking">Ranking de salas</SectionTitle>
        <RankingTable />
      </section>
    </main>
  );
}
