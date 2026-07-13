"use client";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useId } from "react";
import Link from "next/link";
import { normalize } from "@/lib/slug";
import { Flag } from "@/components/ui/Flag";
import type { SearchRoom } from "@/components/chat/ChatSearch";

export function SearchInput({
  size = "lg",
  rooms = [],
}: {
  size?: "lg" | "md";
  /** Salas para sugerir en vivo mientras se escribe. Sin esto, cae al submit clásico a /chat?q=. */
  rooms?: SearchRoom[];
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const listId = useId();
  const router = useRouter();
  const boxRef = useRef<HTMLDivElement>(null);

  const query = q.trim();
  const results = query
    ? rooms.filter((r) => normalize(r.name).includes(normalize(query))).slice(0, 8)
    : [];

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={boxRef} className="relative">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (results.length > 0) {
            router.push(`/chat/${results[0].slug}`);
          } else if (query) {
            router.push(`/chat?q=${encodeURIComponent(query)}`);
          }
        }}
        className="flex w-full items-center gap-2 rounded-xl border border-line bg-card p-2 shadow-sm"
      >
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Buscar ciudad, país o temática"
          aria-label="Buscar salas por ciudad, país o temática"
          role="combobox"
          aria-expanded={open && results.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          className={`min-h-[44px] w-full bg-transparent px-3 text-ink outline-none placeholder:text-muted ${
            size === "lg" ? "py-2.5 text-base" : "py-1.5 text-base sm:text-sm"
          }`}
        />
        <button
          type="submit"
          className="inline-flex min-h-[44px] shrink-0 items-center rounded-lg bg-cta px-4 text-sm font-semibold text-white hover:bg-cta-dark transition-colors"
        >
          Buscar
        </button>
      </form>

      {open && query && results.length > 0 && (
        <ul id={listId} className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-line bg-card shadow-lg">
          {results.map((r) => (
            <li key={r.slug}>
              <Link
                href={`/chat/${r.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 transition-colors hover:bg-bg"
              >
                <Flag emoji={r.icon} flagSrc={r.flagSrc} name={r.flagName} size={18} />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{r.name}</span>
                <span className="shrink-0 text-xs text-muted">{r.users.toLocaleString("es")} online</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {open && query && results.length === 0 && (
        <div className="absolute z-20 mt-1.5 w-full rounded-xl border border-line bg-card px-4 py-3 text-sm text-muted shadow-lg">
          Sin resultados para «{query}»
        </div>
      )}
    </div>
  );
}
