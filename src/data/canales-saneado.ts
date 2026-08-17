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
  // Estas cinco se quedaban sin ningún canal de su sitio: la red no tiene
  // #sitges, #ibiza ni #maspalomas, así que el canal inventado se caía y la sala
  // aterrizaba solo en #gay. Van al canal real que les corresponde por zona, que
  // es donde está la gente de la que hablan sus propios textos.
  "gay-sitges": "barcelona",
  "gay-ibiza": "baleares",
  "gay-maspalomas": "las_palmas",
  "gaychilenos": "chile",
  "gaylatino": "latinoamerica",
};

/**
 * Canales por los que se reconoce una sala de la familia LGTBI.
 *
 * No vale mirar el slug: `queer`, `les`, `comunidad-lgbt` o `de-gays` no lo
 * llevan, y en cambio `santa-rosa-de-osos` sí contiene "osos" sin tener nada que
 * ver. El canal al que entra la sala sí lo dice sin ambigüedad.
 */
const CANALES_FAMILIA = ["gay", "de_ambiente"];
const PADRES_FAMILIA = ["gay", "lgtbi", "gaylatino"];

/** Canal del barrio. Es el que faltaba en 75 de las 82 salas de la familia. */
export const CANAL_CHUECA = "chueca";

/**
 * Genéricos que una sala de ambiente NO arrastra.
 *
 * `#amistad` y `#chatzona` son los dos canales-cajón de la red: el primero es
 * temático de conocer gente y el segundo el general de toda la casa. Los llevaba
 * casi cualquier sala por herencia, y en las de ambiente no aportan nada —quien
 * entra por «chat gay Euskadi» busca a los suyos, no la sala general— y además
 * reparten al recién llegado entre cinco pestañas en vez de dos o tres. Decisión
 * del cliente, 2026-08-13.
 */
const GENERICOS_FUERA = ["amistad", "chatzona"];

/**
 * Canales de una sala de ambiente: `#chueca` dentro, genéricos fuera.
 *
 * Chueca es la marca del ambiente en la red y `#chueca` su canal: quien busca
 * «chat gay Euskadi» tiene que aterrizar en `#chueca` **y** en `#euskadi`, no
 * solo en el temático `#gay`. `gay-madrid` lo hacía desde siempre (`#gay`,
 * `#chueca`, `#madrid`), y el saneado de agosto de 2026 lo dejó escrito como el
 * patrón a seguir, pero al cambiar los `#gay{ciudad}` inventados por el canal
 * real de cada sitio se olvidó de la otra mitad: 75 de las 82 salas de ambiente
 * entraban a `#gay` y a su ciudad, y a `#chueca` no.
 *
 * `#chueca` va después del canal principal para respetar ese orden: primero el
 * temático de la sala, luego el barrio, luego el sitio. Los genéricos se quitan
 * DESPUÉS de decidir si la sala es de la familia, para que quitarlos no cambie
 * quién entra en la regla.
 *
 * Las salas de lesbianas quedan fuera a propósito: tienen sus propios canales
 * (`#lesbianas`, `#el_rincon_les`, `#lescontactos`) y no entran a `#gay` ni a
 * `#de_ambiente`, así que no las alcanza esta regla.
 */
export function conCanalChueca(channels: string[], parentSlug?: string): string[] {
  const key = (c: string) => channelKey(c);
  const esFamilia =
    channels.some(
      (c) => CANALES_FAMILIA.includes(c) || key(c).startsWith(key(CANAL_CHUECA)),
    ) || (parentSlug !== undefined && PADRES_FAMILIA.includes(parentSlug));
  if (!esFamilia) return channels;

  const propios = channels.filter((c) => !GENERICOS_FUERA.includes(c));
  if (propios.some((c) => key(c) === key(CANAL_CHUECA))) return propios;
  // Sin canal propio no puede quedarse: se entra al barrio y punto.
  if (propios.length === 0) return [CANAL_CHUECA];
  return [propios[0], CANAL_CHUECA, ...propios.slice(1)];
}

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
