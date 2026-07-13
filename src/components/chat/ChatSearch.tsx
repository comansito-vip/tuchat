"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { normalize } from "@/lib/slug";
import { Flag } from "@/components/ui/Flag";
import { useSearchIndex } from "@/lib/useSearchIndex";

// Búsqueda en cliente: permite que /chat sea una página estática (no lee
// searchParams en el servidor).
export function ChatSearch() {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const { rooms, load } = useSearchIndex();

  // Con ?q= en la URL (enlace compartido desde la home) hay que buscar sin que
  // el usuario llegue a tocar el input.
  useEffect(() => {
    if (params.get("q")) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const query = q.trim();
  const results =
    query && rooms
      ? rooms.filter((r) => normalize(r.n).includes(normalize(query))).slice(0, 60)
      : [];
  const pending = query && !rooms;

  return (
    <div className="max-w-lg">
      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className="flex w-full items-center gap-2 rounded-xl border border-line bg-card p-2 shadow-sm"
      >
        <input
          value={q}
          onFocus={load}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar ciudad, país o temática"
          aria-label="Buscar sala"
          className="w-full bg-transparent px-3 py-2 text-base text-ink outline-none placeholder:text-muted sm:text-sm"
        />
      </form>

      {query && (
        <div aria-live="polite" className="mt-4">
          <p className="text-sm text-muted">
            {pending ? (
              "Buscando…"
            ) : (
              <>
                {results.length === 0
                  ? "Sin resultados para "
                  : `${results.length} ${results.length === 1 ? "resultado" : "resultados"} para `}
                <span className="font-semibold text-ink">«{query}»</span>
                {results.length === 0 && ". Prueba con otro término."}
              </>
            )}
          </p>
          {results.length > 0 && (
            <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {results.map((r) => (
                <li key={r.s}>
                  <Link
                    href={`/chat/${r.s}`}
                    className="flex min-h-[44px] items-center gap-2.5 rounded-xl border border-line bg-card px-3 py-2 transition-colors hover:border-blue"
                  >
                    <Flag emoji={r.i} flagSrc={r.f} name={r.fn} size={20} />
                    <span className="min-w-0 flex-1 truncate font-medium text-ink">{r.n}</span>
                    <span className="shrink-0 text-xs text-muted">
                      {r.u.toLocaleString("es")} online
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
