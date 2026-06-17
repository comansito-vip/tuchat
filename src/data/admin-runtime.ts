/**
 * Re-exporta getRedirectTarget e isNoindex desde merged.ts.
 * Mantiene compatibilidad con los imports existentes de /chat/[slug]/page.tsx.
 */
export { getRedirectTarget, isNoindex } from "./merged";
