import { REAL_CHANNELS } from "./irc-real-channels";
import { channelKey, canon } from "./irc-canal";

/**
 * Deja en `channels` solo canales que existan de verdad en la red.
 *
 * El panel de la sala publica «También conecta con #salud, #hobbies…» y el FAQ
 * lo repite en texto. De las 2.622 salas, **306 nombraban ahí algún canal que no
 * existe**: los temáticos que nadie creó (#salud, #empleo, #deportes, #cine…) y
 * uno propio por cada sala de equipo de fútbol (#real-madrid, #psg…). Nadie
 * aterrizaba solo —el primer canal sí es real en todas, y eso ya lo vigila
 * `channels.test.ts`—, pero la página afirmaba algo falso, y la regla de este
 * repo es que cada frase se apoye en un dato real o no se emita.
 *
 * Se aplica al cargar el catálogo, como `conRegion`: los canales están
 * repartidos entre los ficheros de datos escritos a mano y lo que publica el
 * cron, y este es el único punto por el que pasan todos.
 */

/**
 * Canal inventado → canal real equivalente.
 *
 * Las salas gay de ciudad nombraban un `#gay-sevilla` que no existe, teniendo al
 * lado `#sevilla`, que sí y con gente dentro. `gay-madrid` ya lo hacía bien
 * (`#gay`, `#chueca`, `#madrid`) y es el patrón que siguen ahora las demás.
 */
export const ALIAS_CANAL: Record<string, string> = {
  "gay-sevilla": "sevilla",
  "gaygranada": "granada",
  "gay-valencia": "valencia",
  "gay-bilbao": "bilbao",
  "gaybarcelona": "barcelona",
  "gaybogota": "bogota",
  "gayamigos": "amigos",
  "gay-argentina": "argentina",
  "gay-mexico": "mexico",
  "gay-peru": "peru",
  "gay-venezuela": "venezuela",
  "gay-uruguay": "uruguay",
};

/**
 * Canales reales de una sala, en su orden original y sin repetidos.
 *
 * Nunca devuelve una lista vacía: el primer canal de toda sala del catálogo ya
 * es real —hay un test que lo fija— así que siempre sobrevive al menos uno.
 */
export function canalesReales(channels: string[]): string[] {
  const salida: string[] = [];
  for (const c of channels) {
    const candidato = ALIAS_CANAL[c] ?? c;
    // `canon` devuelve el canal tal y como lo escribe la red ("cataluna" →
    // "cataluña"), así que de paso se corrigen las variantes sin acento.
    const real = canon(candidato);
    if (!real) continue;
    if (!salida.some((s) => channelKey(s) === channelKey(real))) salida.push(real);
  }
  return salida;
}

/** Para tests y scripts: ¿existe este canal en la red? */
export const esCanalReal = (c: string): boolean =>
  REAL_CHANNELS.has(c) || canon(c) !== null;
