import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Flag } from "@/components/ui/Flag";
import { EnterButton } from "@/components/ui/EnterButton";
import { getRanking, type Place } from "@/data";

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

export function RankingTable({ ranking }: { ranking?: Place[] }) {
  const rows = ranking ?? getRanking();

  return (
    <Card className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs font-semibold uppercase text-muted">
            <th scope="col" className="px-2 py-3 sm:px-4">Posición</th>
            <th scope="col" className="px-2 py-3 sm:px-4">Sala</th>
            <th scope="col" className="hidden px-4 py-3 sm:table-cell">País/Tema</th>
            <th scope="col" className="hidden px-4 py-3 sm:table-cell">Actividad</th>
            <th scope="col" className="px-2 py-3 sm:px-4"><span className="sr-only">Acción</span></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((place, i) => (
            <tr key={place.slug} className="border-t border-line">
              <td className="px-2 py-3 text-center sm:px-4">
                <PositionBadge pos={i + 1} />
              </td>
              <td className="px-2 py-3 sm:px-4">
                <Link
                  href={`/chat/${place.slug}`}
                  className="inline-flex items-center gap-2 font-semibold text-ink hover:text-blue transition-colors"
                >
                  <Flag emoji={place.icon} size={18} />
                  {place.name}
                </Link>
              </td>
              <td className="hidden px-4 py-3 text-muted sm:table-cell">
                {place.kind === "ciudad" && place.parentName
                  ? place.parentName
                  : kindLabel[place.kind]}
              </td>
              <td className="hidden px-4 py-3 sm:table-cell">
                <span className="inline-flex items-center gap-1.5 text-muted">
                  <span className="inline-block h-2 w-2 rounded-full bg-active" aria-hidden="true" />
                  {place.activity}
                </span>
              </td>
              <td className="px-2 py-3 text-right sm:px-4 sm:text-left">
                <EnterButton
                  canal={place.slug}
                  className="font-semibold text-blue hover:underline"
                >
                  Entrar
                </EnterButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
