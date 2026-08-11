/**
 * Nombre corto de una región cuando el censo la escribe con el nombre largo.
 *
 * El censo dice "Coahuila de Zaragoza" y "Estado de Jalisco"; nuestras salas se
 * llaman `coahuila` y `jalisco`, que es como se busca. Sin traducir, esas
 * ciudades cuelgan de un regionSlug que no corresponde a ninguna sala y el
 * listado por estado nace vacío.
 *
 * Vive aquí y no dentro de `mapear-regiones.mjs` porque hay TRES sitios que
 * escriben `regionSlug` —ese generador, los datos a mano de `cities.ts` y
 * `cities-world.ts`, y el cron de goteo que va llenando `cities-generadas.ts`—.
 * Con la tabla en el generador, las salas que publica el cron seguirían
 * entrando con el nombre largo. Es el mismo motivo por el que las reglas de
 * canal viven en `irc-canal.ts` y no en el script que las estrenó.
 */
export const ALIAS_REGION: Record<string, string> = {
  "coahuila-de-zaragoza": "coahuila",
  "estado-de-jalisco": "jalisco",
};

/** Slug de región ya normalizado. Idempotente: aplicarlo dos veces no cambia nada. */
export const slugRegion = (slug: string): string => ALIAS_REGION[slug] ?? slug;
