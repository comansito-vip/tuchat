import muestra from "../../data/irc-muestra.json";
import type { Place } from "@/data/types";

/**
 * Gente conectada de verdad, medida en la red IRC.
 *
 * Hasta septiembre de 2026 todos los contadores de la web ("N hablando ahora",
 * "usuarios conectados") sumaban el campo `users` de cada ficha, un número
 * escrito a mano que no medía nada. `scripts/irc-muestra.mjs` pide LIST a la
 * red y guarda usuarios por canal y usuarios totales en `data/irc-muestra.json`;
 * lo lanza el cron de salas del VPS cada noche, así que la foto es de esa
 * madrugada y se enseña con su hora. `users` sigue existiendo solo como peso
 * editorial para ordenar listados.
 */
type Muestra = {
  tomada: string;
  servidor: string;
  usuariosRed: number | null;
  canales: Record<string, number>;
};

const MUESTRA = muestra as Muestra;

// Canal de toda la red: va en casi todas las salas como último recurso y no
// dice nada de esa sala en concreto.
const CANAL_RED = "chatzona";

function claves(canal: string): string[] {
  const base = canal.toLowerCase().replace(/^#/, "");
  const sinTilde = base.normalize("NFD").replace(/[̀-ͯ]/g, "");
  // El canal real es #españa; algunas fichas lo escriben "espana" (y al revés).
  return [...new Set([base, sinTilde, base.replace(/n/g, "ñ")])].map((c) => `#${c}`);
}

/** Usuarios en un canal según la última muestra, o null si no aparece en ella. */
export function usuariosEnCanal(canal: string): number | null {
  for (const k of claves(canal)) {
    const n = MUESTRA.canales[k];
    if (typeof n === "number") return n;
  }
  return null;
}

/**
 * Conectados en la sala: la gente del primer canal propio de la ficha que
 * aparezca en la muestra (el canal de red solo cuenta si es el único).
 */
export function conectados(place: Pick<Place, "channels">): number | null {
  const propios = place.channels.filter((c) => c.toLowerCase() !== CANAL_RED);
  for (const c of propios) {
    const n = usuariosEnCanal(c);
    if (n !== null) return n;
  }
  if (propios.length === 0 && place.channels.length > 0) return usuariosEnCanal(place.channels[0]);
  return null;
}

/** Usuarios totales en la red en la última muestra. */
export function usuariosRed(): number | null {
  return MUESTRA.usuariosRed;
}

/** Hora española de la muestra, "HH:MM". */
export function horaMuestra(): string {
  return new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Madrid",
  }).format(new Date(MUESTRA.tomada));
}

/** Fecha ISO de la muestra, por si hay que enseñar que es de otro día. */
export function fechaMuestra(): string {
  return MUESTRA.tomada;
}

// Punto de millar a mano: en CLDR el español no agrupa los números de cuatro
// cifras y toLocaleString("es") da "6477".
export function miles(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+$)/g, ".");
}
