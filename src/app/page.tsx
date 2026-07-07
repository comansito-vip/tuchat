import type { Metadata } from "next";
import { HeroSearch } from "@/components/home/HeroSearch";
import { RoomCard } from "@/components/home/RoomCard";
import { CountryGrid } from "@/components/home/CountryGrid";
import { CityList } from "@/components/home/CityList";
import { CategoryGrid } from "@/components/home/CategoryCard";
import { TrendingBlock } from "@/components/home/TrendingBlock";
import { NewsGrid } from "@/components/home/NewsGrid";
import { RankingTable } from "@/components/home/RankingTable";
import { Sidebar } from "@/components/home/Sidebar";
import { FAQBlock } from "@/components/room/FAQBlock";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";
import { FireIcon, SparkIcon } from "@/components/ui/icons";
import { faqJsonLd, JsonLd, OG_BASE } from "@/lib/seo";
import Link from "next/link";
import { getMergedAll } from "@/data/merged";

// ISR: la home es estática y se revalida cada hora; los overrides del panel admin
// se reflejan al revalidar (revalidatePath tras cada escritura).
export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { ...OG_BASE, url: "/" },
};

const HUBS = [
  { href: "/deportes", icon: "⚽", title: "Deportes", desc: "Resultados y salas por equipo" },
  { href: "/resultados/laliga", icon: "🏆", title: "Resultados", desc: "Clasificaciones en vivo" },
  { href: "/tarot", icon: "🔮", title: "Tarot", desc: "Carta del día y tiradas" },
  { href: "/anime", icon: "🎌", title: "Anime", desc: "Salas por serie y comunidad" },
];

const FAQ = [
  {
    q: "¿Cómo entro al chat gratis sin registro?",
    a: "Solo tienes que elegir una sala, escribir un nick de invitado y pulsar «Entrar al chat». No hay registro, correo ni contraseña: el acceso es inmediato y funciona desde el móvil y el ordenador.",
  },
  {
    q: "¿Cuántas salas de chat hay disponibles?",
    a: "TuChat tiene más de 650 salas: por países (España, México, Argentina y 29 países en total), por ciudades (Madrid, Barcelona, Buenos Aires, Ciudad de México y más de 270 ciudades), y por temáticas (amor, amistad, ligar, deportes, música, anime y más).",
  },
  {
    q: "¿Es seguro chatear en TuChat?",
    a: "Sí. No pedimos datos personales para acceder. Recomendamos usar un nick en lugar del nombre real y no compartir información privada. Si detectas comportamientos abusivos, puedes reportarlos desde el chat para que los moderadores actúen.",
  },
  {
    q: "¿TuChat tiene aplicación móvil?",
    a: "No es necesaria ninguna app. TuChat funciona directamente en el navegador del móvil, tablet u ordenador sin instalar nada. Entra desde Safari, Chrome o cualquier otro navegador y empieza a chatear.",
  },
  {
    q: "¿Puedo chatear con gente de Latinoamérica?",
    a: "Sí. TuChat tiene salas específicas para más de 20 países latinoamericanos y decenas de ciudades como Buenos Aires, Bogotá, Lima, Santiago, Ciudad de México y muchas más. También hay una sala internacional para hablar con hispanohablantes de todo el mundo.",
  },
];

export default async function HomePage() {
  const allRooms = await getMergedAll();
  const rooms = [...allRooms].sort((a, b) => b.users - a.users).slice(0, 12);
  const hotRooms = rooms.filter((r) => r.tag === "Popular").slice(0, 4);

  return (
    <main>
      <JsonLd data={faqJsonLd(FAQ)} />
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

          {/* FAQ */}
          <FAQBlock items={FAQ} />

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
