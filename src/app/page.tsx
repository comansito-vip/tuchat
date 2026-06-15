import { HeroSearch } from "@/components/home/HeroSearch";
import { RoomCard } from "@/components/home/RoomCard";
import { CountryGrid } from "@/components/home/CountryGrid";
import { CityList } from "@/components/home/CityList";
import { CategoryGrid } from "@/components/home/CategoryCard";
import { TrendingBlock } from "@/components/home/TrendingBlock";
import { NewsGrid } from "@/components/home/NewsGrid";
import { RankingTable } from "@/components/home/RankingTable";
import { Sidebar } from "@/components/home/Sidebar";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";
import { FireIcon, SparkIcon } from "@/components/ui/icons";
import Link from "next/link";
import { getRooms } from "@/data";

const HUBS = [
  { href: "/deportes", icon: "⚽", title: "Deportes", desc: "Resultados y salas por equipo" },
  { href: "/resultados/laliga", icon: "🏆", title: "Resultados", desc: "Clasificaciones en vivo" },
  { href: "/tarot", icon: "🔮", title: "Tarot", desc: "Carta del día y tiradas" },
  { href: "/anime", icon: "🎌", title: "Anime", desc: "Salas por serie y comunidad" },
];

export default function HomePage() {
  const rooms = getRooms();
  const hotRooms = rooms.filter((r) => r.tag === "Popular").slice(0, 4);

  return (
    <main>
      <HeroSearch />

      {/* 2-column body: main content + sticky sidebar */}
      <div className="mx-auto max-w-6xl px-4 pb-16 lg:grid lg:grid-cols-[1fr_300px] lg:items-start lg:gap-10">

        {/* ── MAIN COLUMN ── */}
        <div className="min-w-0 space-y-12 pt-10">

          {/* Salas destacadas — HOT */}
          {hotRooms.length > 0 && (
            <section id="salas">
              <SectionTitle
                href="/chat"
                cta="Ver todas"
                icon={<FireIcon width={20} height={20} />}
                eyebrow="En vivo"
              >
                Salas más activas
              </SectionTitle>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
                {hotRooms.map((p) => (
                  <RoomCard key={p.slug} place={p} />
                ))}
              </div>
            </section>
          )}

          {/* Todas las salas top */}
          <section>
            <SectionTitle href="/chat" cta="Ver todas">
              Todas las salas
            </SectionTitle>
            <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 no-scrollbar sm:grid sm:grid-cols-3 sm:overflow-visible">
              {rooms.map((p) => (
                <div key={p.slug} className="min-w-[160px] shrink-0 snap-start sm:min-w-0">
                  <RoomCard place={p} />
                </div>
              ))}
            </div>
          </section>

          {/* Países */}
          <section>
            <SectionTitle>Explora por país</SectionTitle>
            <CountryGrid />
          </section>

          {/* Ciudades */}
          <section>
            <SectionTitle>Ciudades populares</SectionTitle>
            <CityList />
          </section>

          {/* Temáticas */}
          <section>
            <SectionTitle
              icon={<SparkIcon width={20} height={20} />}
              description="Salas por interés: amor, deportes, música y más."
            >
              Temáticas
            </SectionTitle>
            <CategoryGrid />
          </section>

          {/* Secciones destacadas (hubs) */}
          <section>
            <SectionTitle>Secciones destacadas</SectionTitle>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {HUBS.map((h) => (
                <Link key={h.href} href={h.href} className="block">
                  <Card
                    variant="interactive"
                    className="h-full p-4"
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/8 text-xl" aria-hidden="true">
                      {h.icon}
                    </div>
                    <div className="mt-2 font-semibold text-ink">{h.title}</div>
                    <p className="mt-0.5 text-xs text-muted">{h.desc}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          <TrendingBlock />

          {/* Noticias */}
          <section>
            <SectionTitle href="/noticias">Noticias y contenidos</SectionTitle>
            <NewsGrid />
          </section>

          {/* Ranking */}
          <section>
            <SectionTitle href="/ranking" icon={<FireIcon width={20} height={20} />}>
              Ranking de salas
            </SectionTitle>
            <RankingTable />
          </section>

          {/* SEO text block */}
          <section className="prose prose-sm max-w-none text-muted">
            <h2 className="text-base font-bold text-ink">Chat gratis sin registro en español</h2>
            <p>
              TuChat es un portal de <strong>salas de chat gratis</strong> para hablar con gente en
              español. Entra <strong>sin registro</strong> y sin descargas: solo elige un nick y
              empieza a chatear online ahora mismo. Tenemos salas por países, ciudades y temáticas
              para que encuentres la conversación que buscas.
            </p>
            <p>
              ¿Quieres <strong>ligar gratis</strong>? La sala{" "}
              <Link href="/chat/ligar" className="text-blue hover:underline">
                Chat para ligar
              </Link>{" "}
              reúne a miles de usuarios que buscan conocer gente y <strong>buscar pareja online</strong>.
              ¿Prefieres <strong>hacer amigos</strong>? En{" "}
              <Link href="/chat/amistad" className="text-blue hover:underline">
                Sala de amistad
              </Link>{" "}
              encontrarás personas para chatear sin pretensiones, formar grupos y quedar.
            </p>
            <p>
              También puedes entrar al{" "}
              <Link href="/chat/espana" className="text-blue hover:underline">
                chat de España
              </Link>
              ,{" "}
              <Link href="/chat/mexico" className="text-blue hover:underline">
                chat de México
              </Link>{" "}
              o{" "}
              <Link href="/chat/argentina" className="text-blue hover:underline">
                chat de Argentina
              </Link>{" "}
              y conectar con gente de tu país. Alternativa gratuita a plataformas como latinchat,
              chatzona y terra chat: sin publicidad invasiva y sin registro obligatorio.
            </p>
          </section>
        </div>

        {/* ── SIDEBAR ── */}
        <div className="mt-10 lg:sticky lg:top-20 lg:mt-10">
          <Sidebar />
        </div>
      </div>
    </main>
  );
}
