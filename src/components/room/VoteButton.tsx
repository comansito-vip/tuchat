"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "tuchat_votes";
const EVENT = "tuchat_votes_change";

function readVoted(): Record<string, true> {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVENT, cb);
  };
}

/**
 * Botón de voto de una sala. El conteo base (`votes`) es estático/servidor; el
 * voto del usuario se guarda en localStorage (sin backend) y se suma de forma
 * optimista. Usa useSyncExternalStore para una lectura segura en hidratación:
 * en servidor y primer render devuelve `false`, luego sincroniza con el store.
 */
export function VoteButton({ slug, votes }: { slug: string; votes: number }) {
  const getSnapshot = useCallback(() => Boolean(readVoted()[slug]), [slug]);
  const voted = useSyncExternalStore(subscribe, getSnapshot, () => false);

  const toggle = useCallback(() => {
    const store = readVoted();
    if (store[slug]) delete store[slug];
    else store[slug] = true;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch {
      /* almacenamiento no disponible: el voto vive solo hasta recargar */
    }
    window.dispatchEvent(new Event(EVENT));
  }, [slug]);

  const count = votes + (voted ? 1 : 0);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={voted}
      title={voted ? "Quitar mi voto" : "Votar esta sala"}
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
