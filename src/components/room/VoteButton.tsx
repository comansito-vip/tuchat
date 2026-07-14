"use client";

import { useCallback, useEffect, useState } from "react";
import { StarIcon } from "@/components/ui/icons";

const STORAGE_KEY = "tuchat_votes";

function readVoted(): Record<string, true> {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

/**
 * Botón de voto de una sala. Persiste el voto en el servidor (/api/vote) y
 * refleja el conteo global. localStorage evita votar dos veces desde el mismo
 * navegador. Si el backend no responde, degrada a un incremento optimista local.
 */
export function VoteButton({ slug, votes }: { slug: string; votes: number }) {
  const [count, setCount] = useState(votes);
  const [voted, setVoted] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const alreadyVoted = Boolean(readVoted()[slug]);
      try {
        const res = await fetch(`/api/vote?slug=${encodeURIComponent(slug)}`, {
          cache: "no-store",
        });
        if (res.ok && !cancelled) {
          const data = await res.json();
          setCount(data.votes);
        }
      } catch {
        /* sin backend: mantenemos el conteo base */
      }
      if (!cancelled) setVoted(alreadyVoted);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const vote = useCallback(async () => {
    if (voted || busy) return;
    setBusy(true);
    // Optimista
    setVoted(true);
    setCount((c) => c + 1);
    try {
      const store = readVoted();
      store[slug] = true;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch {
      /* almacenamiento no disponible */
    }
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      // 200 (voto nuevo) o 409 (esta IP ya había votado, otro navegador/incógnito):
      // en ambos casos el cuerpo trae el conteo autoritativo del servidor.
      if (res.ok || res.status === 409) {
        const data = await res.json();
        setCount(data.votes);
      }
    } catch {
      /* el voto queda al menos reflejado de forma optimista */
    } finally {
      setBusy(false);
    }
  }, [slug, voted, busy]);

  return (
    <button
      type="button"
      onClick={vote}
      // aria-disabled y no disabled: al deshabilitarse en el mismo tick que el
      // clic, el navegador saca el botón del orden de foco y quien vota con
      // teclado acaba en el <body>, perdiendo su sitio. vote() ya corta solo
      // (early return de la línea 50).
      aria-disabled={voted || busy}
      aria-pressed={voted}
      className={
        "flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-colors " +
        (voted
          ? "border-blue bg-blue text-white"
          : "border-line bg-card text-blue-dark hover:border-blue")
      }
    >
      <StarIcon size={14} className={voted ? "opacity-100" : "opacity-40"} />
      {/* Sin aria-label: el nombre accesible sustituiría al contenido y el
          recuento no llegaría a anunciarse nunca (y rompería 2.5.3). */}
      <span className="tabular-nums">{count.toLocaleString("es-ES")}</span>
      <span className="sr-only"> votos. {voted ? "Ya has votado." : "Pulsa para votar esta sala."}</span>
    </button>
  );
}
