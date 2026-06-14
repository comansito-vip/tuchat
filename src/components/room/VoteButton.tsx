"use client";

import { useCallback, useEffect, useState } from "react";

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
      if (res.ok) {
        const data = await res.json();
        setCount(data.votes); // conteo autoritativo del servidor
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
      disabled={voted || busy}
      aria-pressed={voted}
      title={voted ? "Ya has votado esta sala" : "Votar esta sala"}
      className={
        "flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-colors " +
        (voted
          ? "border-blue bg-blue text-white"
          : "border-line bg-card text-blue-dark hover:border-blue")
      }
    >
      <span aria-hidden="true">{voted ? "★" : "☆"}</span>
      <span className="tabular-nums">{count.toLocaleString("es-ES")}</span>
      <span className="sr-only">votos</span>
    </button>
  );
}
