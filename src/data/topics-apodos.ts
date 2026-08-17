import type { Place } from "./types";

/**
 * Salas por el apodo de la ciudad: BCN, MTY, CDMX, CBA.
 *
 * No son duplicados de la sala real ni redirecciones. La gente busca «chat bcn»
 * 49.537 veces y «chat mty» 19.607 —el corpus de la red suma 131.477
 * impresiones entre los cuatro— y en ninguna de esas consultas aparece
 * tuchat.org. Para que Google asocie el apodo hace falta que el término esté en
 * la página, así que cada una entra por ahí: de qué habla la ciudad cuando se
 * llama a sí misma por sus tres letras.
 *
 * El patrón lo fijó `gdl` («Guadalajara (GDL)», en topics-legacy.ts) y aquí se
 * repite: nombre con el apodo entre paréntesis, canal REAL de la ciudad —nunca
 * un #bcn inventado, que es justo lo que el saneado le quitó a gdl— y enlace a
 * la sala de siempre, que sigue siendo la principal.
 */
export const TOPICS_APODOS: Place[] = [
  {
    slug: "bcn",
    name: "Barcelona (BCN)",
    kind: "tematica",
    icon: "🌇",
    users: 264,
    votes: 338,
    tag: "Nueva",
    activity: "Alta",
    parentSlug: "espana",
    parentName: "España",
    channels: ["barcelona", "cataluña", "amistad", "chatzona"],
    related: ["barcelona", "cataluna", "espana", "gaybarcelona", "amistad", "madrid"],
    intro:
      "Tres letras que se leen en las camisetas, en el aeropuerto y en medio país: aquí se habla de la ciudad como la llaman los de dentro.",
    aboutTitle: "Las tres letras que salieron del código del aeropuerto",
    about:
      "BCN empezó siendo el código del aeropuerto y acabó en las camisetas, en los grupos de WhatsApp y en la manera en que la ciudad se nombra a sí misma cuando tiene prisa. Esta sala es la de la Barcelona de diario, la que discute si el Eixample se ha vuelto invivible, si Gràcia sigue siendo un pueblo dentro de la ciudad y por qué nadie del barrio pisa ya las Ramblas. La ciudad ronda el millón setecientos mil habitantes y su área metropolitana pasa de los cinco millones y medio, la más densa de la Unión Europea, lo que explica bastante de las conversaciones sobre pisos que aparecen aquí cada semana. Se cambia de catalán a castellano a media frase sin que nadie lo señale, que es como se habla de verdad. Entra gente de Badalona, Hospitalet y Sant Cugat que trabaja en Barcelona y no vive en ella, y también quien llegó hace dos años y todavía está decidiendo si se queda. Del turismo se habla con una mezcla de resignación y sorna que hay que oír para entender.",
  },
  {
    slug: "mty",
    name: "Monterrey (MTY)",
    kind: "tematica",
    icon: "⛰️",
    users: 238,
    votes: 302,
    tag: "Nueva",
    activity: "Alta",
    parentSlug: "mexico",
    parentName: "México",
    channels: ["monterrey", "nuevo_leon", "amistad", "chatzona"],
    related: ["monterrey", "nuevo-leon", "mexico", "gay-monterrey", "amistad", "latinos"],
    intro:
      "Sala de regios: el Cerro de la Silla al fondo, la carne asada del sábado y ese acento del norte que se reconoce a la primera.",
    aboutTitle: "El Cerro de la Silla, la carne asada y el acento norteño",
    about:
      "MTY es como se firma aquí, y de regio no se presume: se es. La ciudad está en las faldas de la Sierra Madre Oriental, con el Cerro de la Silla saliendo en todas las fotos, y su zona metropolitana está considerada la más rica de América Latina, con San Pedro Garza García en la cabeza del país por PIB por habitante. Ese contraste entre San Pedro y el resto del área es tema recurrente y no siempre amable. Se platica de la carne asada del sábado, que aquí es institución antes que comida, del calor que en verano no deja salir hasta que cae el sol, de Rayados y Tigres con el clásico dividiendo familias enteras, y del ritmo de una ciudad donde media conversación acaba hablando de trabajo. El acento norteño, directo y con sus modismos propios, se nota en cuanto alguien escribe dos líneas. También entra gente que llegó de otros estados a trabajar y cuenta cómo le pegó el cambio.",
  },
  {
    slug: "cdmx",
    name: "Ciudad de México (CDMX)",
    kind: "tematica",
    icon: "🏙️",
    users: 286,
    votes: 372,
    tag: "Popular",
    activity: "Alta",
    parentSlug: "mexico",
    parentName: "México",
    channels: ["mexico", "amistad", "chatzona"],
    related: ["ciudad-de-mexico", "mexico", "toluca", "amistad", "latinos", "musica"],
    intro:
      "Las siglas son de 2016, cuando el Distrito Federal dejó de serlo: aquí siguen conviviendo el DF de toda la vida y la CDMX oficial.",
    aboutTitle: "De DF a CDMX, un cambio de 2016 que no todos usan",
    about:
      "El nombre tiene fecha: la reforma política que convirtió al Distrito Federal en Ciudad de México se promulgó el 29 de enero de 2016 y entró en vigor días después, cuando se publicó en el Diario Oficial. La entidad pasó a ser la número 32, las delegaciones se volvieron demarcaciones con su alcalde, y a la ciudad le tocó unas siglas nuevas. Diez años después medio mundo sigue diciendo DF, y esa convivencia entre las dos maneras de nombrarla se cuela en la sala más de lo que parece: por lo general, quien dice DF lleva más años aquí. Se habla de lo que se habla en una ciudad de esta escala: el tráfico y las horas que se van en él, el Metro y sus líneas eternas, los tacos de la esquina defendidos con una seriedad admirable, los temblores y esa memoria compartida de septiembre. Chilangos de nacimiento y gente llegada de todos los estados, que aquí son mayoría y lo saben.",
  },
  {
    slug: "cba",
    name: "Córdoba (CBA)",
    kind: "tematica",
    icon: "🎶",
    users: 212,
    votes: 284,
    tag: "Nueva",
    activity: "Alta",
    parentSlug: "argentina",
    parentName: "Argentina",
    channels: ["cordoba", "argentina", "amistad", "chatzona"],
    related: ["cordoba-argentina", "argentina", "rosario", "amistad", "musica", "latinos"],
    intro:
      "CBA es la argentina, la de la tonada y el cuarteto, no la andaluza: sala de cordobeses con la Universidad más vieja del país al lado.",
    aboutTitle: "La Docta, la tonada y el cuarteto de los sábados",
    about:
      "Conviene aclararlo en la primera línea porque las dos Córdobas se cruzan siempre: esta es la argentina. Le dicen La Docta porque durante más de dos siglos tuvo la única universidad del país —la Nacional de Córdoba se fundó en 1613 y sigue siendo la más antigua de Argentina—, y esa herencia de ciudad de estudiantes se nota en quién anda por el centro en marzo. Lo otro que la define es la tonada, ese cantito cordobés que en el resto del país se imita mal y con cariño, y del que aquí se hacen los primeros chistes. Y el cuarteto, que nació con cuatro instrumentos y terminó siendo la música de los sábados de toda una provincia. Se habla de eso, de las sierras a una hora para escaparse el fin de semana, del calor de enero y de Belgrano y Talleres, que dan para discutir sin fin. Entra gente de Villa María, Río Cuarto y Carlos Paz, y bastantes que estudiaron acá y se volvieron a su pueblo.",
  },
];

/**
 * Salas que son OTRO NOMBRE de una sala que ya existe.
 *
 * Los cuatro apodos de arriba, más `gdl` (que fijó el patrón, en topics-legacy.ts)
 * y `illes-balears` (el nombre oficial en catalán de Baleares, en
 * topics-terminos.ts). No son duplicados ni redirecciones: cada una tiene su
 * propio texto y gana su propia búsqueda —«chat bcn» son 49.537 impresiones en
 * el corpus de la red— y por eso se quedan.
 *
 * Existe esta lista porque en la tarjeta de su país se pintaban en la misma fila
 * que su gemela: «Baleares» al lado de «Illes Balears», «Guadalajara» al lado de
 * «Guadalajara (GDL)». Cada chip lleva a una sala distinta, pero el usuario lee
 * un listado con duplicados. Van en su propia línea, rotulada, sin perder el
 * enlace: ver src/app/chat/page.tsx.
 */
export const SLUGS_APODO: readonly string[] = [
  "bcn", "mty", "cdmx", "cba", "gdl", "illes-balears",
];
