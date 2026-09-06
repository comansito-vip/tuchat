"use client";

import { useRef, useState } from "react";

// Forma compacta del índice servido por /api/search-index (claves de una letra:
// con ~2.500 salas, los nombres de campo largos por sí solos sumaban decenas de KB).
export interface IndexRoom {
  /** slug */
  s: string;
  /** nombre */
  n: string;
  /** icono (emoji) */
  i: string;
  /** bandera (src) */
  f?: string;
  /** nombre de la bandera */
  fn?: string;
  /** usuarios online */
  u?: number;
}

/**
 * Catálogo de salas para los buscadores, descargado bajo demanda.
 *
 * El índice NO viaja en el HTML: pasarlo como prop desde el servidor metía las
 * ~2.500 salas en el payload RSC de cada visita a la home y a /chat, se buscara
 * o no. Aquí se pide la primera vez que el usuario toca el buscador, así quien
 * no busca (la mayoría, y casi siempre en móvil) no paga nada.
 */
export function useSearchIndex() {
  const [rooms, setRooms] = useState<IndexRoom[] | null>(null);
  const requested = useRef(false);

  const load = () => {
    if (requested.current) return;
    requested.current = true;
    fetch("/api/search-index")
      .then((r) => r.json())
      .then(setRooms)
      .catch(() => {
        // Sin índice no hay sugerencias, pero el sitio sigue siendo navegable por
        // sus listados: permitir reintentar en el siguiente foco.
        requested.current = false;
      });
  };

  return { rooms, load };
}
