import type { Place } from "./types";

// Salas de ambiente LGTBI por ciudad, con demanda medida en el corpus de la red.
// El detalle del cruce, en docs/superpowers/plans/2026-08-11-siguiente-hueco-salas-gay.md.
//
// EL CANAL, que es donde es fácil equivocarse: no existe ningún #gay{ciudad} en
// la red —los canales LGTBI son diez y ninguno es por ciudad—, así que cada sala
// entra al temático #gay más el canal REAL de su ciudad. Es lo que gay-madrid
// hacía desde siempre con #chueca y #madrid, y a lo que se corrigieron las demás
// en agosto de 2026 (ver canales-saneado.ts).
//
// Las latinoamericanas cuelgan de `gaylatino` y las españolas de `lgtbi`, igual
// que las que ya existían.
export const TOPICS_GAY_CIUDADES: Place[] = [
  {
    slug: "gay-malaga",
    name: "Gay Málaga",
    kind: "tematica",
    icon: "🌴",
    users: 186,
    votes: 274,
    tag: "Nueva",
    activity: "Alta",
    parentSlug: "lgtbi",
    parentName: "LGTBI",
    channels: ["gay", "malaga", "amistad", "chatzona"],
    related: ["lgtbi", "gay", "malaga", "gay-sevilla", "andalucia", "chueca"],
    intro:
      "Entre el Soho malagueño y La Nogalera de Torremolinos, a media hora en cercanías: el ambiente de la Costa del Sol se comenta aquí.",
    aboutTitle: "Del Soho a La Nogalera, media hora de cercanías",
    about:
      "Málaga y Torremolinos funcionan casi como una sola conversación: la capital se ha llenado de museos y terrazas en la última década, pero cuando alguien dice «salir» suele estar pensando en La Nogalera, que lleva desde los setenta siendo el punto de encuentro de toda la Costa del Sol. El tren de cercanías tarda media hora y eso lo cambia todo. En verano la sala se llena de gente de paso —del norte, de Reino Unido, de medio mundo— y en invierno vuelve a ser cosa de malagueños. Se habla del Orgullo de Torremolinos en junio, de qué playa aguanta mejor el levante y de si la ciudad se ha vuelto cara desde que la descubrieron los cruceros. Acento cerrado, mucha guasa y esa mezcla de gente local y recién llegada que define a Málaga desde hace años.",
  },
  {
    slug: "gay-tenerife",
    name: "Gay Tenerife",
    kind: "tematica",
    icon: "🌋",
    users: 172,
    votes: 251,
    tag: "Nueva",
    activity: "Alta",
    parentSlug: "lgtbi",
    parentName: "LGTBI",
    channels: ["gay", "tenerife", "amistad", "chatzona"],
    related: ["lgtbi", "gay", "tenerife", "canarias", "gay-maspalomas", "gay-malaga"],
    intro:
      "El sur turístico y el norte de siempre no se parecen en nada, y el Carnaval de Santa Cruz los junta a todos una vez al año.",
    aboutTitle: "El sur, el norte y la Gala Drag del Carnaval",
    about:
      "La isla se vive de dos maneras y en esta sala se cruzan las dos. En el sur, Las Américas y Costa Adeje viven del turismo durante todo el año y el ambiente es internacional, con gente que llega en febrero y se queda hasta septiembre. En el norte, La Laguna y Santa Cruz van a otro ritmo, más de barrio y menos de temporada. Lo que iguala a todos es el Carnaval de Santa Cruz: la Gala Drag Queen llena un recinto entero y se sigue por televisión en toda España, y durante esas semanas la ciudad no duerme. Se comenta el tiempo con la precisión de quien vive donde cambia cada veinte kilómetros, se discute qué playa merece el viaje y se recibe a quien pregunta desde la península si de verdad se puede vivir aquí todo el año.",
  },
  {
    slug: "gay-medellin",
    name: "Gay Medellín",
    kind: "tematica",
    icon: "🌸",
    users: 195,
    votes: 288,
    tag: "Popular",
    activity: "Alta",
    parentSlug: "gaylatino",
    parentName: "Gay Latino",
    channels: ["gay", "medellin", "amistad", "chatzona"],
    related: ["gaylatino", "gay", "medellin", "gaybogota", "colombia", "gay-cali"],
    intro:
      "El Poblado y el Parque Lleras concentran el ambiente paisa, en la ciudad donde el clima no da excusas para quedarse en casa.",
    aboutTitle: "El Poblado, el Lleras y la eterna primavera",
    about:
      "Medellín tiene fama de ser la ciudad más fácil de Colombia para salir, y buena parte de eso pasa por El Poblado: el Parque Lleras y las calles de alrededor concentran lo que en otras ciudades está repartido. La gente de aquí lo dice sin falsa modestia y luego avisa de que el resto de la ciudad es otra cosa, más de barrio y menos de turista. El clima ayuda: veintitantos grados todo el año significa que no hay temporada baja ni excusa meteorológica. En agosto la Feria de las Flores lo llena todo y el desfile de silleteros para la ciudad entera. Entran paisas, gente de Bogotá que viene el fin de semana y extranjeros que llegaron por unos meses y llevan años. Se habla rápido, con el acento que se reconoce a la primera y con esa amabilidad que aquí es casi deporte.",
  },
  {
    slug: "gay-puebla",
    name: "Gay Puebla",
    kind: "tematica",
    icon: "⛪",
    users: 158,
    votes: 232,
    tag: "Nueva",
    activity: "Media",
    parentSlug: "gaylatino",
    parentName: "Gay Latino",
    channels: ["gay", "puebla", "amistad", "chatzona"],
    related: ["gaylatino", "gay", "puebla", "gay-mexico", "mexico", "gay-monterrey"],
    intro:
      "Una ciudad de fama conservadora con un ambiente que existe y se mueve por el centro, a dos horas de la capital.",
    aboutTitle: "Discreción poblana a dos horas del DF",
    about:
      "Puebla carga con fama de conservadora —tantas iglesias no ayudan— y la sala se pasa media conversación desmintiéndolo a medias: el ambiente existe, se mueve por el centro histórico y por la zona de Los Sapos, pero se lleva con más discreción que en Ciudad de México. Estar a dos horas de la capital marca mucho: hay quien sube el fin de semana a la Zona Rosa y vuelve el domingo, y quien defiende que aquí se está mejor precisamente porque nadie va con prisa. Se habla de los talleres de talavera, del mole que cada familia jura hacer distinto y de si los cholultecas cuentan como poblanos. El volcán se ve desde media ciudad los días claros. Entran estudiantes de las universidades, gente de Cholula y poblanos que se fueron al norte y siguen asomándose.",
  },
  {
    slug: "gay-rosario",
    name: "Gay Rosario",
    kind: "tematica",
    icon: "🌊",
    users: 164,
    votes: 240,
    tag: "Nueva",
    activity: "Media",
    parentSlug: "gaylatino",
    parentName: "Gay Latino",
    channels: ["gay", "rosario", "amistad", "chatzona"],
    related: ["gaylatino", "gay", "rosario", "gay-argentina", "argentina", "gaybogota"],
    intro:
      "Ciudad con fama de abierta, con la costanera del Paraná de fondo y sin las distancias imposibles de Buenos Aires.",
    aboutTitle: "La costanera del Paraná y la fama de abierta",
    about:
      "Rosario presume de ser una ciudad donde nadie mira raro, y quien viene de pueblos de Santa Fe lo confirma en cuanto entra. La costanera del Paraná organiza la vida social en verano: se hace de todo junto al río, desde tomar mate a media tarde hasta cruzar en lancha a los bancos de arena de la otra orilla. Pichincha concentra buena parte de la salida nocturna. Estar a tres horas de Buenos Aires es una ventaja y un fastidio a partes iguales: se va cuando hace falta, pero aquí las distancias son humanas y nadie pierde dos horas en llegar a ningún lado. Se discute de Central y Ñuls con una intensidad que a los de fuera les cuesta entender, se habla de la humedad de enero y del viento del río en julio. Rosarinos, gente de la provincia y quien se mudó desde el interior.",
  },
  {
    slug: "gay-cadiz",
    name: "Gay Cádiz",
    kind: "tematica",
    icon: "🎭",
    users: 152,
    votes: 224,
    tag: "Nueva",
    activity: "Media",
    parentSlug: "lgtbi",
    parentName: "LGTBI",
    channels: ["gay", "cadiz", "amistad", "chatzona"],
    related: ["lgtbi", "gay", "cadiz", "gay-sevilla", "andalucia", "gay-malaga"],
    intro:
      "En febrero manda el Carnaval y el resto del año, La Viña y la playa: el ambiente gaditano cabe andando de punta a punta.",
    aboutTitle: "Febrero es Carnaval y el resto del año, La Viña",
    about:
      "Cádiz es pequeña y eso lo explica casi todo: se cruza andando en media hora, todo el mundo se conoce y la vida pasa en la calle porque las casas del casco son antiguas y estrechas. En febrero la ciudad se convierte en otra cosa: el Carnaval no es un desfile sino chirigotas cantando por las esquinas durante semanas, y la letra que se ríe de alguien importa más que el disfraz. La Viña concentra la salida el resto del año, con la playa de La Caleta al final de la calle. Entran gaditanos, gente de San Fernando y del Puerto que cruza la bahía, y quien se marchó a Madrid o Barcelona buscando trabajo y sigue diciendo que volvería mañana. El humor es el de aquí: rápido, sin maldad y capaz de reírse de lo que sea, empezando por uno mismo.",
  },
  {
    slug: "gay-asturias",
    name: "Gay Asturias",
    kind: "tematica",
    icon: "🍃",
    users: 168,
    votes: 246,
    tag: "Nueva",
    activity: "Media",
    parentSlug: "lgtbi",
    parentName: "LGTBI",
    channels: ["gay", "asturias", "amistad", "chatzona"],
    related: ["lgtbi", "gay", "asturias", "gay-bilbao", "gay-vigo", "chueca"],
    intro:
      "Gijón y Oviedo se reparten el ambiente y no se ponen de acuerdo en nada, que es la conversación asturiana de siempre.",
    aboutTitle: "Gijón y Oviedo repartiéndose el ambiente",
    about:
      "En Asturias el ambiente está repartido entre Gijón y Oviedo, y la sala reproduce esa rivalidad con gusto: los de Gijón dicen que allí se sale de verdad y los de Oviedo que su ciudad es más cómoda para vivir. Cimadevilla concentra la noche gijonesa, con el Cerro asomando al Cantábrico. En Oviedo la cosa va más de casco antiguo y de sidrerías. Precisamente la sidra es el asunto que nunca se agota: dónde se escancia mejor, qué llagar merece el viaje y por qué la de supermercado no cuenta. El clima da conversación todo el año, con esa lluvia fina que aquí no es queja sino paisaje. Entran también de Avilés, de Langreo y de las cuencas, y asturianos que emigraron a Madrid y vuelven cada agosto sin fallar uno.",
  },
  {
    slug: "gay-vigo",
    name: "Gay Vigo",
    kind: "tematica",
    icon: "⚓",
    users: 146,
    votes: 214,
    tag: "Nueva",
    activity: "Media",
    parentSlug: "lgtbi",
    parentName: "LGTBI",
    channels: ["gay", "vigo", "amistad", "chatzona"],
    related: ["lgtbi", "gay", "vigo", "galicia", "gay-asturias", "chueca"],
    intro:
      "El Casco Vello, la ría siempre delante y las Cíes a un barco de distancia: el ambiente vigués se lleva sin ruido.",
    aboutTitle: "Casco Vello, la ría delante y las Cíes enfrente",
    about:
      "Vigo es una ciudad de puerto y se nota en el carácter: práctica, poco dada a presumir y acostumbrada a que la gente venga y se vaya. El Casco Vello concentra buena parte de la salida, con las calles empinadas que bajan hacia la ría. Enfrente están las Cíes, que en verano se llenan y que los vigueses defienden como si fueran patrimonio propio, porque lo son. Se habla gallego a ratos, sin avisar y sin darle importancia. La conversación pasa mucho por el tiempo —aquí llueve de verdad y con ganas— y por la eterna comparación con A Coruña, que nunca se resuelve. Entran vigueses, gente de Pontevedra y del Morrazo, y quien se fue a Madrid o a Suiza y sigue pendiente del Celta como si viviera al lado de Balaídos.",
  },
  {
    slug: "gay-murcia",
    name: "Gay Murcia",
    kind: "tematica",
    icon: "🍋",
    users: 141,
    votes: 208,
    tag: "Nueva",
    activity: "Media",
    parentSlug: "lgtbi",
    parentName: "LGTBI",
    channels: ["gay", "murcia", "amistad", "chatzona"],
    related: ["lgtbi", "gay", "murcia", "gay-malaga", "gay-cadiz", "chueca"],
    intro:
      "Las tardes de terraza en el centro y el mar a media hora: el ambiente murciano es pequeño y se conoce entre sí.",
    aboutTitle: "Terrazas del centro y el Mar Menor a media hora",
    about:
      "Murcia es una ciudad que se vive fuera: nueve meses de buen tiempo hacen que las terrazas del centro sean el sitio donde pasa todo, y la zona de las plazas del casco concentra la salida sin necesidad de coger un coche. El ambiente es pequeño, así que aquí todo el mundo acaba conociéndose, para bien y para mal, cosa que se comenta con resignación y bastante humor. El mar queda a media hora larga: el Mar Menor para quien quiere agua tranquila y las playas de Cartagena para quien prefiere olas. En verano el calor obliga a reorganizar el día entero y nadie sale antes de que se ponga el sol. Se habla de la huerta, de los pimientos y del acento murciano, del que los propios murcianos se ríen antes de que lo haga nadie de fuera.",
  },
  {
    slug: "gay-monterrey",
    name: "Gay Monterrey",
    kind: "tematica",
    icon: "🏔️",
    users: 155,
    votes: 228,
    tag: "Nueva",
    activity: "Media",
    parentSlug: "gaylatino",
    parentName: "Gay Latino",
    channels: ["gay", "monterrey", "amistad", "chatzona"],
    related: ["gaylatino", "gay", "monterrey", "nuevo-leon", "gay-mexico", "gay-puebla"],
    intro:
      "El Barrio Antiguo concentra la noche regia, en una ciudad que trabaja mucho y presume de no perder el tiempo.",
    aboutTitle: "El Barrio Antiguo y el calor que no perdona",
    about:
      "Monterrey es una ciudad de trabajo y eso marca hasta la vida nocturna: se sale menos entre semana que en el centro del país y más fuerte el fin de semana. El Barrio Antiguo concentra lo que en otras ciudades está más repartido, y la zona de San Pedro va por su cuenta, con precios que aquí se comentan con retintín. El calor de junio a septiembre organiza el día entero: nadie propone nada al aire libre antes de que caiga el sol. El Cerro de la Silla se ve desde media ciudad y sirve de referencia para todo. Entran regios, gente de Saltillo y de la frontera, y quienes se mudaron por trabajo desde el sur y todavía se están acostumbrando al acento y a que aquí se vaya al grano sin rodeos.",
  },
  {
    slug: "gay-cali",
    name: "Gay Cali",
    kind: "tematica",
    icon: "💃",
    users: 149,
    votes: 219,
    tag: "Nueva",
    activity: "Media",
    parentSlug: "gaylatino",
    parentName: "Gay Latino",
    channels: ["gay", "cali", "amistad", "chatzona"],
    related: ["gaylatino", "gay", "cali", "gay-medellin", "gaybogota", "colombia"],
    intro:
      "Aquí la salsa no es folclore sino forma de salir, y quien no baila lo aprende a la fuerza o se queda mirando.",
    aboutTitle: "Donde la salsa no se escucha, se baila",
    about:
      "En Cali la salsa no es un adorno: es la manera de salir, y quien llega sin saber bailar lo aprende por pura presión ambiental o se resigna a mirar desde la barra. Granada y el Peñón concentran buena parte de la noche, y en diciembre la Feria de Cali lo ocupa todo durante una semana larga. El calor es constante y espeso, así que la vida se organiza alrededor de la brisa de la tarde. La ciudad tiene fama de directa y de poco protocolo, cosa que agradece quien viene de sitios más cerrados. Se habla del Cali y del América con la misma pasión que de música, y se recibe con curiosidad a quien pregunta desde fuera. Entran caleños, gente del Valle y quienes se fueron a Bogotá o al extranjero y vuelven cada diciembre.",
  },
  {
    slug: "gay-lima",
    name: "Gay Lima",
    kind: "tematica",
    icon: "🌫️",
    users: 160,
    votes: 235,
    tag: "Nueva",
    activity: "Media",
    parentSlug: "gaylatino",
    parentName: "Gay Latino",
    channels: ["gay", "lima", "amistad", "chatzona"],
    related: ["gaylatino", "gay", "lima", "gay-peru", "peru", "gay-cali"],
    intro:
      "Miraflores y Barranco concentran el ambiente limeño, en una ciudad enorme donde cruzarla puede llevar dos horas.",
    aboutTitle: "Miraflores, Barranco y la garúa de junio",
    about:
      "Lima es tan grande que el barrio importa más que la ciudad: quien vive en Miraflores o Barranco hace una vida y quien viene de los conos hace otra, y cruzar de punta a punta puede llevar dos horas de tráfico que aquí se dan por descontadas. El ambiente se concentra en esos dos distritos, con Barranco poniendo la parte bohemia y Miraflores la más comercial. De junio a octubre la garúa lo cubre todo y no se ve el sol en semanas, cosa de la que los limeños se quejan con una constancia admirable. La comida es tema serio y no admite ironías: el ceviche, la causa y dónde se come mejor por poco dinero dan para discusiones largas. Entran limeños, gente de provincias que estudió aquí y peruanos en Santiago, Madrid o Buenos Aires que se asoman a oír a los suyos.",
  },
];
