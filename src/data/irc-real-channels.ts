/**
 * Canales que existen DE VERDAD en la red ChatZona, agrupados por categoría.
 *
 * Fuente: estadísticas de canales del propio IRC (máximo de usuarios), que el
 * cliente confirmó. Es más completa que un `/LIST` puntual: un canal sin gente
 * en ese instante no sale en el listado, pero existe (#panama, #nicaragua).
 *
 * Para qué sirve: una sala solo debe entrar a canales de esta lista. Mandarla a
 * uno inventado (#estados-unidos, #cataluna sin ñ, #costa-rica con guion) crea
 * un canal vacío al vuelo y el usuario aterriza solo, en vez de caer donde ya
 * hay gente (#usa, #cataluña, #costa_rica). Lo verifica channels.test.ts sobre
 * las 2.027 salas geográficas.
 *
 * NO ENTRAN AQUÍ (decisión del cliente, no reañadir aunque existan en la red):
 *   - Explícitos de bajo valor y residual: #putitas, #putitasx, #tetonaslesbis,
 *     #morena_sexy, #sexoconsergi y similares.
 *   - #de_13_a_18: sala de menores. Fuera, sin excepción.
 *   - Bots, scripts y salas de gestión: #eggdrop, #scripting, #bot_cita,
 *     #admin_explosion, #closed.
 *   - Radios y sus canales de DJ: #dj-*, #*_djs, #radio_*. (#radio, el temático
 *     genérico de música, sí se queda.)
 */

/** España: comunidades, provincias y ciudades. */
export const ES_CHANNELS = [
  "españa",
  "andalucia", "aragon", "asturias", "baleares", "canarias", "cantabria",
  "castilla", "cataluña", "catalunya", "euskadi", "extremadura", "galicia",
  "la_rioja", "murcia", "navarra",
  "albacete", "alicante", "almeria", "badajoz", "barcelona", "bilbao", "burgos",
  "caceres", "cadiz", "cartagena", "castellon", "cordoba", "coruña", "girona",
  "granada", "guipuzcoa", "huelva", "jaen", "las_palmas", "leon", "lleida",
  "lugo", "madrid", "malaga", "mallorca", "ourense", "oviedo", "palencia",
  "pontevedra", "salamanca", "sevilla", "tarragona", "tenerife", "toledo",
  "valencia", "valladolid", "vigo", "vizcaya", "zaragoza",
] as const;

/** Latinoamérica y EE. UU.: países, estados mexicanos y ciudades. */
export const LATAM_CHANNELS = [
  "latinoamerica", "latinos", "zonalatina", "chatlatinos", "internacional",
  // Países
  "mexico", "colombia", "venezuela", "peru", "chile", "argentina", "uruguay",
  "bolivia", "ecuador", "paraguay", "cuba", "guatemala", "honduras",
  "nicaragua", "panama", "costa_rica", "el_salvador", "republica_dominicana",
  "puerto_rico", "usa", "brasil",
  // México: estados y ciudades
  "aguascalientes", "chiapas", "chihuahua", "coahuila", "colima", "durango",
  "guanajuato", "guerrero", "jalisco", "nuevo_leon", "oaxaca", "puebla",
  "queretaro", "sinaloa", "sonora", "tabasco", "veracruz", "yucatan",
  "zacatecas", "mexico_vip", "acapulco", "cancun", "cuernavaca", "guadalajara", "mazatlan",
  "mochis", "monterrey", "morelia", "naucalpan", "tijuana", "toluca",
  // Sudamérica y Caribe: ciudades
  "arequipa", "asuncion", "barinas", "barquisimeto", "barranquilla", "bogota",
  "buenos_aires", "cali", "caracas", "carabobo", "chiclayo", "cochabamba",
  "concepcion", "duran", "guayaquil", "iquique", "jujuy", "lima", "maracaibo",
  "maracay", "medellin", "mendoza", "merida", "miranda", "montevideo",
  "pacasmayo", "paysandu", "quito", "rosario", "santodomingo", "trujillo",
  "tucuman", "zulia", "antigua_guatemala", "miami",
] as const;

/** Temáticos: intereses, ocio y charla general. */
export const TOPIC_CHANNELS = [
  "chat", "general", "chatea", "chatear", "chatgratis", "ocio", "cultura",
  "debates", "filosofia", "psicologia", "biblioteca", "poesia", "dulcepoesia",
  "musica", "nuestra-musica", "radio", "podcast", "anime", "juegos", "trivial",
  "trivias", "trivial-pursuit", "futbol", "real-madrid-c-f", "mundial",
  "inteligencia_artificial", "magia", "esoterismo", "tarot", "oraculo",
  "parapsicologia", "religion", "cristiano", "cristianos", "labiblia",
  "multiverso", "uniendo-paises", "punto-de-encuentro",
] as const;

/** Amistad, ligue y relaciones. */
export const SOCIAL_CHANNELS = [
  "amistad", "amigos", "amigas", "amor", "ligar", "ligame", "citas",
  "conocer-gente", "parejas", "solteros", "hombres", "mujeres", "chachipen",
] as const;

/** Por edad. */
export const AGE_CHANNELS = [
  "mas_de_30", "mas_de_40", "mas_de_50", "mas__de60", "mas_de_70",
  "amigos_mayores", "maduritos", "cuatro_decadas", "milenials",
] as const;

/** LGTBI. */
export const LGTBI_CHANNELS = [
  "gay", "lesbianas", "bisexuales", "de_ambiente", "travestis", "personas_trans",
  "chueca", "chueca_madrid", "chueca_barcelona", "el_rincon_les",
] as const;

/** Adultos (+18). Solo se asignan a las salas de la sección para adultos. */
export const ADULT_CHANNELS = [
  "sexo", "canalsexo", "cibersexo", "porno", "relatos-eroticos", "sexo_casadas",
  "sumisas", "cornudos", "bdsm", "trio", "nudismo", "liberales", "casados",
  "mazmorra", "lescontactos", "sexomadrid",
] as const;

/** Red y portales hermanos. */
export const NETWORK_CHANNELS = [
  "chatzona", "canalchat", "chateagratis.net", "gentechat.net",
  "chatamigos.org", "portalchat.es", "alicantechat.es", "chatvenezuela.net",
  "latinchat", "mundochat", "terra", "mipunto", "zonafriends",
] as const;

/**
 * Canales de marca que la red AÚN NO TIENE y que se crean a propósito.
 *
 * Los seis nombres de arriba —#terra, #latinchat, #canalchat…— existen porque en
 * su día alguien entró. Estos otros seis no existen todavía, y el cliente pidió
 * el 2026-08-17 que se creen: en IRC un canal nace en cuanto entra el primero,
 * así que la forma de crearlos es exactamente esta, mandarles gente.
 *
 * **Van SIEMPRE detrás del canal poblado de su sala, nunca los primeros.** Es la
 * misma regla que ya rige para los canales propios de cada sala: si la sala
 * entrase aquí primero, la red lo crearía vacío y el usuario aterrizaría solo en
 * vez de caer donde hay gente. Con el canal poblado por delante, el usuario cae
 * acompañado y de paso siembra este otro, que se irá llenando solo.
 *
 * Cuando uno de estos coja gente de verdad, se mueve a NETWORK_CHANNELS y se
 * borra de aquí; la lista debe quedarse vacía algún día.
 */
export const SEEDED_CHANNELS = [
  "hispano", "ozu", "chatealo", "chatsfriends", "dalechat", "icq",
] as const;

/**
 * Todos los canales que una sala puede nombrar: los que existen de verdad más
 * los sembrados a propósito. Sigue sirviendo para lo de siempre —que nadie entre
 * a un canal inventado por descuido—, porque para entrar a uno nuevo hay que
 * añadirlo arriba de forma deliberada.
 */
export const REAL_CHANNELS: ReadonlySet<string> = new Set<string>([
  ...ES_CHANNELS,
  ...LATAM_CHANNELS,
  ...TOPIC_CHANNELS,
  ...SOCIAL_CHANNELS,
  ...AGE_CHANNELS,
  ...LGTBI_CHANNELS,
  ...ADULT_CHANNELS,
  ...NETWORK_CHANNELS,
  ...SEEDED_CHANNELS,
]);
