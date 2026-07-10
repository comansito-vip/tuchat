import Link from "next/link";
import { clsx } from "clsx";
import { cityFlag, getRooms, getRanking } from "@/data";
import { LiveDot, TrophyIcon, WeatherIcon, StarIcon, ChevronIcon } from "@/components/ui/icons";
import { Flag } from "@/components/ui/Flag";
import { Card } from "@/components/ui/Card";

function Widget({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <Card className={clsx("p-4", className)}>{children}</Card>;
}

function WidgetLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 text-[11px] font-bold uppercase tracking-widest text-muted">
      {children}
    </div>
  );
}

export function Sidebar() {
  const rooms = getRooms();
  const ranking = getRanking().slice(0, 5);
  const totalOnline = rooms.reduce((sum, r) => sum + r.users, 0);

  return (
    <div className="space-y-4">
      {/* Online ahora */}
      <Widget className="flex items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-live/10 text-live">
          <LiveDot />
        </span>
        <div>
          <div className="font-extrabold text-ink">
            {totalOnline.toLocaleString("es")}
          </div>
          <div className="text-xs text-muted">personas online ahora</div>
        </div>
      </Widget>

      {/* Top ranking */}
      <Widget>
        <WidgetLabel>
          <span className="inline-flex items-center gap-1">
            <TrophyIcon width={12} height={12} />
            Ranking de salas
          </span>
        </WidgetLabel>
        <ol className="space-y-2.5">
          {ranking.map((room, i) => {
            const flag = cityFlag(room);
            return (
              <li key={room.slug}>
                <Link
                  href={`/chat/${room.slug}`}
                  className="flex items-center gap-2.5 rounded-lg px-1 py-0.5 transition-colors hover:bg-brand/5"
                >
                  <span className="w-4 shrink-0 text-center text-xs font-bold text-muted">
                    {i + 1}
                  </span>
                  <Flag emoji={flag.icon} flagSrc={flag.flagSrc} size={18} />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">
                    {room.name}
                  </span>
                  <span className="shrink-0 text-xs text-muted">
                    {room.users.toLocaleString("es")}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
        <Link
          href="/ranking"
          className="mt-3 flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-dark"
        >
          Ver ranking completo
          <ChevronIcon width={12} height={12} />
        </Link>
      </Widget>

      {/* Horóscopo */}
      <Link href="/horoscopo" className="block">
        <Widget className="transition-all hover:-translate-y-0.5 hover:border-tarot/40 hover:shadow-card-hover">
          <WidgetLabel>
            <span className="inline-flex items-center gap-1">
              <StarIcon width={12} height={12} />
              Horóscopo del día
            </span>
          </WidgetLabel>
          <div className="flex items-center gap-3">
            <span className="text-3xl" aria-hidden="true">✨</span>
            <div>
              <div className="text-sm font-semibold text-ink">Tu carta del día</div>
              <div className="text-xs text-muted">Consulta tu horóscopo →</div>
            </div>
          </div>
        </Widget>
      </Link>

      {/* El tiempo */}
      <Link href="/tiempo/madrid" className="block">
        <Widget className="transition-all hover:-translate-y-0.5 hover:border-amistad/40 hover:shadow-card-hover">
          <WidgetLabel>
            <span className="inline-flex items-center gap-1">
              <WeatherIcon width={12} height={12} />
              El tiempo
            </span>
          </WidgetLabel>
          <div className="flex items-center gap-3">
            <span className="text-3xl" aria-hidden="true">🌤️</span>
            <div>
              <div className="text-sm font-semibold text-ink">Previsión para hoy</div>
              <div className="text-xs text-muted">Madrid y toda España →</div>
            </div>
          </div>
        </Widget>
      </Link>

      {/* Herramientas */}
      <Widget>
        <WidgetLabel>Herramientas</WidgetLabel>
        <ul className="space-y-1">
          {[
            { label: "Loterías de España", href: "/loterias/espana", emoji: "🎰" },
            { label: "Tarot gratis", href: "/tarot", emoji: "🔮" },
            { label: "Chat de deportes", href: "/deportes", emoji: "⚽" },
            { label: "Resultados de fútbol", href: "/resultados/laliga", emoji: "🏆" },
            { label: "Chat de anime", href: "/anime", emoji: "🎌" },
            { label: "Noticias en español", href: "/noticias", emoji: "📰" },
          ].map((tool) => (
            <li key={tool.href}>
              <Link
                href={tool.href}
                className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-muted transition-colors hover:bg-brand/5 hover:text-ink"
              >
                <span aria-hidden="true" className="w-5 text-center text-base">
                  {tool.emoji}
                </span>
                {tool.label}
              </Link>
            </li>
          ))}
        </ul>
      </Widget>
    </div>
  );
}
