import { useSyncExternalStore } from "react";

const KEY = "tuchat_nick";
const listeners = new Set<() => void>();

// Recuerda el nick entre componentes de la misma página (y entre páginas):
// si el usuario ya lo escribió en el buscador principal, los botones "Entrar"
// de las tarjetas deben usarlo también en vez de entrar como invitado.
export function getSavedNick(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveNick(nick: string): void {
  if (typeof window === "undefined") return;
  try {
    if (nick) localStorage.setItem(KEY, nick);
    else localStorage.removeItem(KEY);
  } catch {
    // localStorage puede fallar en modo privado; degrada sin romper la UI.
  }
  listeners.forEach((listener) => listener());
}

// Para useSyncExternalStore: notifica a otros NickInput/EnterButton de la
// misma página cuando el nick cambia, sin pasar por un useEffect+setState.
export function subscribeNick(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

function getServerSnapshot(): string {
  return "";
}

// Lee el nick guardado sin useEffect+setState (evita el warning de React de
// "setState síncrono en un efecto" y el rerender extra que eso provoca).
export function useSavedNick(): string {
  return useSyncExternalStore(subscribeNick, getSavedNick, getServerSnapshot);
}
