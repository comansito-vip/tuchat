import { REAL_CHANNELS, ES_CHANNELS, LATAM_CHANNELS } from "./irc-real-channels";

/**
 * Traducción de nuestros slugs a los nombres de canal que usa DE VERDAD la red.
 *
 * Vivía dentro de `scripts/fix-irc-channels.ts`, que es un script de
 * mantenimiento de un solo uso. Se sacó aquí cuando el cron de salas
 * (`scripts/cron/salas-geo.mjs`) necesitó las mismas reglas: tener dos copias de
 * una tabla que debe estar sincronizada es una fábrica de fallos, y el fallo ya
 * ocurrió — el cron publicó doce salas mandando a `#apodaca`, `#vitarte`,
 * `#chorrillos`… que no existen, así que el usuario habría aterrizado solo en un
 * canal vacío.
 */

export const NETWORK_CHANNEL = "chatzona";
export const LATAM_FALLBACK = "latinoamerica";
export const WORLD_FALLBACK = ["internacional", "ocio"];

/** Canal de país tal y como lo escribe la red. La clave es nuestro slug. */
export const COUNTRY_CHANNEL: Record<string, string[]> = {
  espana: ["españa"],
  mexico: ["mexico", LATAM_FALLBACK],
  argentina: ["argentina", LATAM_FALLBACK],
  colombia: ["colombia", LATAM_FALLBACK],
  chile: ["chile", LATAM_FALLBACK],
  peru: ["peru", LATAM_FALLBACK],
  uruguay: ["uruguay", LATAM_FALLBACK],
  venezuela: ["venezuela", LATAM_FALLBACK],
  ecuador: ["ecuador", LATAM_FALLBACK],
  bolivia: ["bolivia", LATAM_FALLBACK],
  paraguay: ["paraguay", LATAM_FALLBACK],
  cuba: ["cuba", LATAM_FALLBACK],
  guatemala: ["guatemala", LATAM_FALLBACK],
  honduras: ["honduras", LATAM_FALLBACK],
  nicaragua: ["nicaragua", LATAM_FALLBACK],
  panama: ["panama", LATAM_FALLBACK],
  "costa-rica": ["costa_rica", LATAM_FALLBACK],
  "el-salvador": ["el_salvador", LATAM_FALLBACK],
  "republica-dominicana": ["republica_dominicana", LATAM_FALLBACK],
  "puerto-rico": ["puerto_rico", LATAM_FALLBACK],
  // Hispanos en EE. UU.: la red los tiene en #usa, no en un #estados-unidos
  // que no existe.
  "estados-unidos": ["usa", "internacional"],
  belice: WORLD_FALLBACK,
  canada: WORLD_FALLBACK,
  francia: WORLD_FALLBACK,
  italia: WORLD_FALLBACK,
  portugal: WORLD_FALLBACK,
  alemania: WORLD_FALLBACK,
  "reino-unido": WORLD_FALLBACK,
  marruecos: WORLD_FALLBACK,
  "guinea-ecuatorial": WORLD_FALLBACK,
};

/** Clave de comparación: sin acentos y con guion/guion bajo unificados. */
export const channelKey = (c: string): string =>
  c.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[-_]/g, "");

// key → nombre tal cual lo escribe la red ("cataluna" → "cataluña").
const CANON = new Map<string, string>();
for (const n of REAL_CHANNELS) if (!CANON.has(channelKey(n))) CANON.set(channelKey(n), n);

/** Nombre real del canal, o null si la red no lo tiene. */
export const canon = (c: string): string | null => CANON.get(channelKey(c)) ?? null;

// Solo se le devuelve a una ciudad su canal propio si es geográfico: así un
// pueblo llamado "Trivial" o "Amor" no acaba en el canal temático homónimo.
const GEO = new Set<string>([...ES_CHANNELS, ...LATAM_CHANNELS]);

/** Canal geográfico real con ese nombre, o null. */
export const geoCanon = (c: string): string | null => {
  const real = canon(c);
  return real && GEO.has(real) ? real : null;
};

/**
 * Canales de una sala de ciudad: los suyos geográficos que existan de verdad
 * (ciudad, provincia, región), los de su país, y `#chatzona` al final.
 *
 * Nunca inventa el canal propio de la localidad: si `#apodaca` no existe, no se
 * pone y el usuario cae en `#mexico`, donde hay gente.
 */
export function channelsForCity(
  citySlug: string,
  countrySlug: string,
  extras: (string | null | undefined)[] = [],
): string[] {
  const salida: string[] = [];
  const push = (c: string | null) => {
    if (c && !salida.includes(c)) salida.push(c);
  };

  push(geoCanon(citySlug));
  for (const e of extras) if (e) push(geoCanon(e));
  for (const c of COUNTRY_CHANNEL[countrySlug] ?? [LATAM_FALLBACK]) push(canon(c));
  push(NETWORK_CHANNEL);
  return salida;
}
