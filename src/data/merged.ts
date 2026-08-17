/**
 * Capa de datos fusionada: datos estáticos TS + overrides del panel admin.
 *
 * Reglas de fusión:
 *  - hidden   → excluidos de todos los listados (no del lookup para redirects)
 *  - overrides → { ...base, ...patch } aplicado al lugar
 *  - newRooms  → concatenados al final
 *
 * Usa getAdminState() de admin-store (backend JSON o Upstash según entorno).
 * Los getters síncronos de @/data se mantienen para build inicial y partes que
 * no requieren overrides en tiempo de ejecución.
 */
import { getAdminState } from "@/lib/admin-store";
import {
  getCountries,
  getCities,
  getTopics,
  getChildren as baseChildren,
  getPlace,
  getRelated as baseRelated,
  conCanalesReales,
} from "@/data";
import type { Place } from "@/data/types";

/**
 * Aplica el override del panel y vuelve a pasar la sala por el saneado.
 *
 * El catálogo estático ya sale derivado de `@/data` (canales que existen de
 * verdad, `#chueca` en las salas de ambiente), pero los overrides se aplicaban
 * encima y **el resultado no volvía a pasar por ahí**: cambiar `channels` desde
 * /admin dejaba a la sala con lo que se hubiera tecleado, canales inventados
 * incluidos. Solo se re-deriva lo que el panel toca; el resto ya viene hecho y
 * esto corre en cada petición de /chat.
 */
function applyPatch(p: Place, overrides: Record<string, Partial<Place>>): Place {
  const patch = overrides[p.slug];
  return patch ? conCanalesReales({ ...p, ...patch }) : p;
}

/** Las salas creadas desde el panel no han pasado nunca por el saneado. */
const saneadas = (rooms: Place[]): Place[] => rooms.map(conCanalesReales);

/** Todos los lugares: base − hidden + overrides aplicados + newRooms. */
export async function getMergedAll(): Promise<Place[]> {
  const { hidden, overrides, newRooms } = await getAdminState();
  const base = [...getCountries(), ...getCities(), ...getTopics()];
  return [
    ...base.filter((p) => !hidden.includes(p.slug)).map((p) => applyPatch(p, overrides)),
    ...saneadas(newRooms),
  ];
}

/** Un lugar concreto con overrides aplicados (busca también en newRooms). */
export async function getMergedPlace(slug: string): Promise<Place | undefined> {
  const { overrides, newRooms } = await getAdminState();
  const base = getPlace(slug);
  if (base) return applyPatch(base, overrides);
  const nueva = newRooms.find((r) => r.slug === slug);
  return nueva && conCanalesReales(nueva);
}

export async function getMergedCountries(): Promise<Place[]> {
  const { hidden, overrides } = await getAdminState();
  return getCountries()
    .filter((p) => !hidden.includes(p.slug))
    .map((p) => applyPatch(p, overrides));
}

export async function getMergedCities(): Promise<Place[]> {
  const { hidden, overrides } = await getAdminState();
  return getCities()
    .filter((p) => !hidden.includes(p.slug))
    .map((p) => applyPatch(p, overrides));
}

export async function getMergedTopics(): Promise<Place[]> {
  const { hidden, overrides } = await getAdminState();
  return getTopics()
    .filter((p) => !hidden.includes(p.slug))
    .map((p) => applyPatch(p, overrides));
}

/** Hijos de un lugar (ciudades de un país, sub-salas de una temática), sin hidden. */
export async function getMergedChildren(slug: string): Promise<Place[]> {
  const { hidden, overrides } = await getAdminState();
  return baseChildren(slug)
    .filter((p) => !hidden.includes(p.slug))
    .map((p) => applyPatch(p, overrides));
}

/** Salas relacionadas filtradas por hidden y con overrides aplicados. */
export async function getMergedRelated(slugs: string[]): Promise<Place[]> {
  const { hidden, overrides } = await getAdminState();
  return baseRelated(slugs)
    .filter((p) => !hidden.includes(p.slug))
    .map((p) => applyPatch(p, overrides));
}

/** Slug canónico al que redirige `slug`, o undefined si no hay redirección. */
export async function getRedirectTarget(slug: string): Promise<string | undefined> {
  const { redirects } = await getAdminState();
  return redirects[slug];
}

/** True si la sala está marcada noindex en el panel. */
export async function isNoindex(slug: string): Promise<boolean> {
  const { noindex } = await getAdminState();
  return noindex.includes(slug);
}
