import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { ChatIcon, LiveDot } from "@/components/ui/icons";
import { Flag } from "@/components/ui/Flag";
import { cityFlag, type Place } from "@/data";
import { conectados, cuandoMuestra, miles } from "@/lib/irc-muestra";

const TILE_BG: Record<string, string> = {
  amor: "bg-amor/12", amistad: "bg-amistad/12", lgtbi: "bg-amor/12",
  deportes: "bg-deportes/12", musica: "bg-musica/12", videojuegos: "bg-juegos/12",
  anime: "bg-anime/12", tarot: "bg-tarot/12", horoscopo: "bg-tarot/12",
  esoterismo: "bg-tarot/12", videncia: "bg-tarot/12", astrologia: "bg-tarot/12",
  magia: "bg-tarot/12", cine: "bg-musica/12", tecnologia: "bg-amistad/12",
  viajes: "bg-amistad/12", cocina: "bg-deportes/12",
};

export function RoomCard({ place }: { place: Place }) {
  const tileBg = TILE_BG[place.slug] ?? "bg-blue/8";
  const flag = cityFlag(place);
  // Medida real del canal, no el campo `users` de la ficha (ver lib/irc-muestra).
  const gente = conectados(place);

  return (
    <Card className="flex h-full flex-col gap-3 p-4 transition-all hover:border-blue hover:shadow-md hover:shadow-blue/10">
      {/* Top row: icon tile + name (siempre a ancho completo, nunca se trunca a 0) */}
      <div className="flex items-center gap-2.5">
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tileBg}`}>
          <Flag emoji={flag.icon} flagSrc={flag.flagSrc} name={flag.name} size={24} />
        </span>
        <Link
          href={`/chat/${place.slug}`}
          className="min-w-0 flex-1 truncate font-semibold text-ink transition-colors hover:text-blue"
        >
          {place.name}
        </Link>
      </div>

      {/* Activity line + badge (aquí compiten por espacio, no con el nombre) */}
      <div className="flex items-center gap-1.5 text-sm text-muted">
        <span className="text-active">
          <LiveDot />
        </span>
        <span className="min-w-0 flex-1 truncate">
          {gente !== null ? `${miles(gente)} en el canal ${cuandoMuestra()}` : "Canal compartido con su zona"}
        </span>
        {place.tag && (
          <span className="shrink-0">
            <Badge tag={place.tag} />
          </span>
        )}
      </div>

      {/* Va a la página de la sala (no directo al webchat): ahí el visitante
          ve info/FAQ y decide entrar desde el CTA de esa página. */}
      {/* El nombre de la sala va en el enlace, no solo en el texto visible: si
          no, el rotor de VoiceOver lista cientos de enlaces "Entrar" idénticos
          e indistinguibles (en /chat/espana son 893). */}
      <Link
        href={`/chat/${place.slug}`}
        aria-label={`Entrar al chat de ${place.name}`}
        className={buttonClasses("cta", "md", "mt-auto w-full")}
      >
        <ChatIcon />
        <span aria-hidden="true">Entrar</span>
      </Link>
    </Card>
  );
}
