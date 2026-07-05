"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { normalize } from "@/lib/slug";
import { Flag } from "@/components/ui/Flag";

export interface SearchRoom {
  slug: string;
  name: string;
  icon: string;
  users: number;
}

// Búsqueda en cliente: permite que /chat sea una página estática (no lee
// searchParams en el servidor). El término inicial se toma de la URL (?q=) para
// soportar enlaces compartibles desde el buscador de la home, y se sincroniza de
// vuelta con replace() para que la URL siga reflejando la búsqueda activa.
export function ChatSearch({ rooms }: { rooms: SearchRoom[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

  const query = q.trim();
  const results = query
    ? rooms.filter((r) => normalize(r.name).includes(normalize(query))).slice(0, 60)
    : [];

  function update(value: string) {
    setQ(value);
    const next = value.trim();
    router.replace(next ? `/chat?q=${encodeURIComponent(next)}` : "/chat", { scroll: false });
  }

  return (
    <div className="max-w-lg">
      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className="flex w-full items-center gap-2 rounded-xl border border-line bg-card p-2 shadow-sm"
      >
        <input
          value={q}
          onChange={(e) => update(e.target.value)}
          placeholder="Buscar ciudad, país o temática"
          aria-label="Buscar sala"
          className="w-full bg-transparent px-3 py-1.5 text-sm text-ink outline-none placeholder:text-muted"
        />
      </form>

      {query && (
        <div aria-live="polite" className="mt-4">
          <p className="text-sm text-muted">
            {results.length === 0
              ? "Sin resultados para "
              : `${results.length} ${results.length === 1 ? "resultado" : "resultados"} para `}
            <span className="font-semibold text-ink">«{query}»</span>
            {results.length === 0 && ". Prueba con otro término."}
          </p>
          {results.length > 0 && (
            <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {results.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/chat/${r.slug}`}
                    className="flex items-center gap-2.5 rounded-xl border border-line bg-card px-3 py-2 transition-colors hover:border-blue"
                  >
                    <Flag emoji={r.icon} name={r.name} size={20} />
                    <span className="min-w-0 flex-1 truncate font-medium text-ink">{r.name}</span>
                    <span className="shrink-0 text-xs text-muted">
                      {r.users.toLocaleString("es")} online
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
