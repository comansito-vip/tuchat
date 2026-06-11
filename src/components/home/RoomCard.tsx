import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Place } from "@/data";

export function RoomCard({ place }: { place: Place }) {
  return (
    <Card className="flex flex-col gap-3 p-4">
      {/* Top row: icon + name + optional badge */}
      <div className="flex items-center gap-2">
        <span className="text-2xl" aria-hidden="true">{place.icon}</span>
        <Link
          href={`/chat/${place.slug}`}
          className="font-semibold text-ink hover:text-blue transition-colors"
        >
          {place.name}
        </Link>
        {place.tag && (
          <span className="ml-auto">
            <Badge tag={place.tag} />
          </span>
        )}
      </div>

      {/* Activity line */}
      <div className="flex items-center gap-1.5 text-sm text-muted">
        <span className="inline-block h-2 w-2 rounded-full bg-active" aria-hidden="true" />
        <span>
          {place.users.toLocaleString("es")} hablando ahora
          {" · "}
          {place.votes.toLocaleString("es")} votos
        </span>
      </div>

      {/* Enter button */}
      <Button href={`/webchat?canal=${place.slug}`} variant="primary" className="w-full">
        Entrar
      </Button>
    </Card>
  );
}
