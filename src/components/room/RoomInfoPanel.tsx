import type { Place } from "@/data";
import { Card } from "@/components/ui/Card";
import { VoteButton } from "@/components/room/VoteButton";

function kindLabel(kind: Place["kind"]): string {
  if (kind === "pais") return "País";
  if (kind === "ciudad") return "Ciudad";
  return "Temática";
}

function countryValue(place: Place): string | null {
  if (place.kind === "tematica") return null;
  if (place.kind === "pais") return place.name;
  return place.parentName ?? null;
}

export function RoomInfoPanel({ place }: { place: Place }) {
  const otherChannels = place.channels.filter((ch) => ch !== place.slug);
  const country = countryValue(place);

  return (
    <Card className="p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
        Información de la sala
      </h2>
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted">Sala</dt>
          <dd className="font-medium text-ink">#{place.slug}</dd>
        </div>

        {country && (
          <div className="flex justify-between gap-2">
            <dt className="text-muted">País</dt>
            <dd className="font-medium text-ink">{country}</dd>
          </div>
        )}

        <div className="flex justify-between gap-2">
          <dt className="text-muted">Categoría</dt>
          <dd className="font-medium text-ink">{kindLabel(place.kind)}</dd>
        </div>

        <div className="flex justify-between gap-2">
          <dt className="text-muted">Actividad</dt>
          <dd className="flex items-center gap-1.5 font-medium text-ink">
            <span className="inline-block h-2 w-2 rounded-full bg-active" aria-hidden="true" />
            {place.activity}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-2">
          <dt className="text-muted">Votos</dt>
          <dd>
            <VoteButton slug={place.slug} votes={place.votes} />
          </dd>
        </div>

        {otherChannels.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <dt className="text-muted">También conecta con</dt>
            <dd className="flex flex-wrap gap-1">
              {otherChannels.map((ch) => (
                <span
                  key={ch}
                  className="inline-block rounded bg-bg px-2 py-0.5 text-xs text-muted"
                >
                  #{ch}
                </span>
              ))}
            </dd>
          </div>
        )}
      </dl>
    </Card>
  );
}
