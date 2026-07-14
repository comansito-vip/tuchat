"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Row {
  rank: number;
  team: string;
  points: number;
}

/**
 * Clasificación compacta de una liga, cargada en cliente desde /api/standings.
 * Permite que las salas de equipo (/chat/real-madrid…) sigan siendo estáticas
 * mientras muestran datos en vivo.
 */
export function LeagueStandings({ liga, leagueName }: { liga: string; leagueName: string }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/standings?liga=${encodeURIComponent(liga)}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (!cancelled) setRows((data.rows as Row[]).slice(0, 6));
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [liga]);

  if (failed) return null;

  return (
    <div className="rounded-xl border border-line bg-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold text-ink">Clasificación · {leagueName}</h3>
        <Link href={`/resultados/${liga}`} className="text-sm font-medium text-blue hover:underline">
          Ver tabla →
        </Link>
      </div>
      {/* La clasificación llega por fetch: sin aria-live el lector anuncia
          "Cargando…" y ya no vuelve a decir nada cuando aparece la tabla. */}
      <div aria-live="polite" aria-busy={rows === null}>
      {rows === null ? (
        <p className="text-sm text-muted">Cargando clasificación…</p>
      ) : (
        <ol className="space-y-1 text-sm">
          {rows.map((r) => (
            <li key={`${r.rank}-${r.team}`} className="flex justify-between gap-2">
              <span className="text-ink">
                <span className="text-muted">{r.rank}.</span> {r.team}
              </span>
              <span className="font-semibold text-ink">{r.points}</span>
            </li>
          ))}
        </ol>
      )}
      </div>
    </div>
  );
}
