"use client";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useId } from "react";
import { normalize } from "@/lib/slug";
import { Flag } from "@/components/ui/Flag";
import { useSearchIndex } from "@/lib/useSearchIndex";

export function SearchInput({ size = "lg" }: { size?: "lg" | "md" }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  // Opción resaltada con las flechas. -1 = ninguna: al enviar sin elegir se va a
  // la primera coincidencia, como antes.
  const [active, setActive] = useState(-1);
  const listId = useId();
  const optionId = (i: number) => `${listId}-opt-${i}`;
  const router = useRouter();
  const boxRef = useRef<HTMLDivElement>(null);
  const { rooms, load } = useSearchIndex();

  const query = q.trim();
  const results =
    query && rooms
      ? rooms.filter((r) => normalize(r.n).includes(normalize(query))).slice(0, 8)
      : [];
  const expanded = open && results.length > 0;

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const go = (i: number) => {
    const room = results[i] ?? results[0];
    if (room) router.push(`/chat/${room.s}`);
    else if (query) router.push(`/chat?q=${encodeURIComponent(query)}`);
  };

  // Un role="combobox" sin teclado es una trampa: el lector de pantalla anuncia
  // que hay opciones y las flechas no hacen nada. Aquí sí navegan, y el input
  // apunta con aria-activedescendant a la opción resaltada.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!expanded) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }
  };

  return (
    <div ref={boxRef} className="relative">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          go(active);
        }}
        className="flex w-full items-center gap-2 rounded-xl border border-line bg-card p-2 shadow-sm"
      >
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(-1); }}
          onFocus={() => { load(); setOpen(true); }}
          onKeyDown={onKeyDown}
          placeholder="Buscar ciudad, país o temática"
          aria-label="Buscar salas por ciudad, país o temática"
          role="combobox"
          aria-expanded={expanded}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? optionId(active) : undefined}
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

      {/* Fuera del desplegable y siempre montada: una región live que aparece ya
          rellena en el mismo commit de React no la anuncia iOS. */}
      <p aria-live="polite" className="sr-only">
        {query && rooms
          ? results.length === 0
            ? `Sin resultados para ${query}`
            : `${results.length} ${results.length === 1 ? "sala" : "salas"} para ${query}`
          : ""}
      </p>

      <ul
        id={listId}
        role="listbox"
        aria-label="Salas sugeridas"
        hidden={!expanded}
        className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-line bg-card shadow-lg"
      >
        {/* La opción no lleva dentro un <a>: un role="option" con un elemento
            interactivo dentro rompe el contrato del patrón combobox (el enlace y
            la opción compiten en el árbol de accesibilidad). Se navega con
            go(i), igual que ya hacía el teclado. */}
        {results.map((r, i) => (
          <li
            key={r.s}
            id={optionId(i)}
            role="option"
            aria-selected={i === active}
            onClick={() => {
              setOpen(false);
              go(i);
            }}
            onMouseEnter={() => setActive(i)}
            className={`flex cursor-pointer items-center gap-2.5 px-4 py-2.5 transition-colors ${
              i === active ? "bg-bg" : "hover:bg-bg"
            }`}
          >
            <Flag emoji={r.i} flagSrc={r.f} name={r.fn} size={18} />
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{r.n}</span>
            <span className="shrink-0 text-xs text-muted">{r.u.toLocaleString("es")} online</span>
          </li>
        ))}
      </ul>

      {open && query && rooms && results.length === 0 && (
        <div className="absolute z-20 mt-1.5 w-full rounded-xl border border-line bg-card px-4 py-3 text-sm text-muted shadow-lg">
          Sin resultados para «{query}»
        </div>
      )}
    </div>
  );
}
