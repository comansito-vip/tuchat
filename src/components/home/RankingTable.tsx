import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { getRanking } from "@/data";

const kindLabel: Record<string, string> = {
  pais: "País",
  ciudad: "Ciudad",
  tematica: "Temática",
};

function PositionBadge({ pos }: { pos: number }) {
  if (pos <= 3) {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
        {pos}
      </span>
    );
  }
  return <span className="text-muted text-sm">{pos}</span>;
}

export function RankingTable() {
  const ranking = getRanking();

  return (
    <Card className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs font-semibold uppercase text-muted">
            <th className="px-4 py-3">Posición</th>
            <th className="px-4 py-3">Sala</th>
            <th className="px-4 py-3">País/Tema</th>
            <th className="px-4 py-3">Actividad</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {ranking.map((place, i) => (
            <tr key={place.slug} className="border-t border-line">
              <td className="px-4 py-3 text-center">
                <PositionBadge pos={i + 1} />
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/chat/${place.slug}`}
                  className="inline-flex items-center gap-2 font-semibold text-ink hover:text-blue transition-colors"
                >
                  <span aria-hidden="true">{place.icon}</span>
                  {place.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-muted">
                {place.kind === "ciudad" && place.parentName
                  ? place.parentName
                  : kindLabel[place.kind]}
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-1.5 text-muted">
                  <span className="inline-block h-2 w-2 rounded-full bg-active" aria-hidden="true" />
                  {place.activity}
                </span>
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/webchat?canal=${place.slug}`}
                  className="font-semibold text-blue hover:underline"
                >
                  Entrar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
