import type { Place } from "./types";

// Salas sociales por franja de edad. Paridad con los canales del viejo
// tuchat.org (mas-de-20..50). kind "tematica": entran en /chat y el sitemap,
// pero NO en el carrusel de la home (ver getPrimaryTopics).
export const TOPICS_EDAD: Place[] = [
  {
    slug: "mas-de-20",
    name: "Mayores de 20",
    kind: "tematica",
    icon: "🌱",
    users: 520,
    votes: 760,
    tag: "Popular",
    activity: "Alta",
    channels: ["adolescentes", "mas_de_30"],
    related: ["mas-de-30", "amistad", "amor", "madrid", "barcelona"],
    intro:
      "Chat para veinteañeros gratis y sin registro: gente de tu edad para hacer amigos, ligar o desahogarse de la carrera, el primer curro y el piso compartido.",
    about:
      "La sala de los veinte es ruido del bueno: aquí coinciden los que acaban la universidad, los que pelean su primer contrato y los que todavía no saben qué quieren ser de mayores. Se habla de pisos compartidos, de sueldos que no llegan a fin de mes, de ligues que duran un verano y de esa sensación de que todo el mundo va más rápido que tú. Sin postureo de redes: solo gente de tu edad, con las mismas dudas y las mismas ganas de que llegue el finde.",
  },
  {
    slug: "mas-de-30",
    name: "Mayores de 30",
    kind: "tematica",
    icon: "☕",
    users: 480,
    votes: 700,
    tag: "Popular",
    activity: "Alta",
    channels: ["mas_de_30", "mas_de_40"],
    related: ["mas-de-20", "mas-de-40", "amistad", "amor", "madrid"],
    intro:
      "Chat de mayores de 30 gratis sin registro: conversación de adultos sin dramas, para hacer amigos, reconectar o conocer a alguien con la cabeza en su sitio.",
    about:
      "Los treinta son la edad en que uno ya sabe lo que no quiere. En esta sala se junta gente con trabajo estable y agenda apretada, parejas que se consolidan y solteros que ya no tienen prisa pero sí ganas. Se charla de hipotecas y de viajes, de amistades que se van espaciando y de lo que cuesta hacer amigos nuevos pasada cierta edad. Un chat tranquilo, con conversación de verdad y sin el caos de las salas más jóvenes.",
  },
  {
    slug: "mas-de-40",
    name: "Mayores de 40",
    kind: "tematica",
    icon: "🍷",
    users: 360,
    votes: 540,
    activity: "Alta",
    channels: ["mas_de_40", "mas_de_30"],
    related: ["mas-de-30", "mas-de-50", "amistad", "amor", "buenos-aires"],
    intro:
      "Chat para mayores de 40 sin registro: un espacio sereno para charlar, hacer amigos o buscar pareja entre gente que ya tiene historia que contar.",
    about:
      "A los cuarenta se vuelve con ganas: hijos que ya no dependen tanto, una carrera asentada y, a veces, la necesidad de empezar de cero. La sala reúne a quien busca segundas oportunidades, reconectar con su vida social o simplemente hablar sin tener que explicarlo todo. Se comentan series, planes de fin de semana, divorcios ya digeridos y proyectos nuevos. Un ambiente maduro y cercano, donde la conversación pesa mucho más que la foto de perfil.",
  },
  {
    slug: "mas-de-50",
    name: "Mayores de 50",
    kind: "tematica",
    icon: "🌳",
    users: 240,
    votes: 380,
    tag: "Tendencia",
    activity: "Media",
    channels: ["mas_de_40", "mas_de_50"],
    related: ["mas-de-40", "mas-de-60", "amistad", "amor", "salud"],
    intro:
      "Chat de mayores de 50 gratis y sin registro: gente de tu generación para conversar con calma, hacer amistades y compartir el día a día.",
    about:
      "Los cincuenta traen perspectiva. En esta sala se encuentran quienes ya criaron a los hijos, quienes piensan en una jubilación cercana y quienes redescubren tiempo para sí mismos. Se habla de salud y de viajes pendientes, de la música de siempre, de reencontrarse con viejas aficiones y de lo difícil que es hacer amigos a esta edad. Conversación pausada, con respeto y buen humor, lejos del ritmo frenético de otras salas. Aquí nadie tiene prisa por nada.",
  },
  {
    slug: "mas-de-60",
    name: "Mayores de 60",
    kind: "tematica",
    icon: "🌅",
    users: 150,
    votes: 240,
    tag: "Nueva",
    activity: "Baja",
    channels: ["mas_de_50", "mas_de_60", "mas_de_70"],
    related: ["mas-de-50", "amistad", "amor", "salud"],
    intro:
      "Chat para mayores de 60 sin registro: compañía, charla y amistad para quien tiene tiempo y ganas de conversar sin complicaciones.",
    about:
      "La sala de los sesenta es para tomarse las cosas con calma. Aquí coinciden jubilados, abuelos que presumen de nietos y gente que valora una buena conversación por encima de todo. Se habla de recuerdos, de huertos y recetas, de los achaques con humor y de planes que ahora por fin hay tiempo de cumplir. Para muchos es también compañía en las horas tranquilas del día. Un chat amable, sin prisas y sin necesidad de saber de tecnología: basta entrar y hablar.",
  },

  // ── Franjas cerradas (de X a Y) ──
  // Complementan la escalera "Mayores de N": quien busca su década exacta y no
  // un "a partir de". Enrutan a los mismos canales IRC reales, más los propios
  // (#de_18_a_26, #cuatro_decadas, #amigos_mayores) que sí existen en el IRC.
  {
    slug: "de-18-a-25",
    name: "De 18 a 25",
    kind: "tematica",
    icon: "🎧",
    users: 610,
    votes: 880,
    tag: "Popular",
    activity: "Alta",
    channels: ["de_18_a_26", "adolescentes", "mas_de_30"],
    related: ["mas-de-20", "mas-de-25", "amistad", "amor", "ligar"],
    intro:
      "Chat de 18 a 25 años gratis y sin registro: la franja más movida del sitio, con gente recién estrenada en eso de vivir por su cuenta.",
    about:
      "Entre los dieciocho y los veinticinco pasa casi todo por primera vez: la mudanza, el examen que decide un curso entero, el trabajo de verano que se alarga, la relación que empieza fuerte y se apaga en octubre. Esta sala va a ese ritmo, con conversaciones que saltan de la última serie a una crisis existencial de madrugada sin avisar. Nadie viene a impresionar a nadie. Es el sitio para hablar con quien está exactamente en el mismo punto que tú, y descubrir que tus dudas no son tan raras.",
  },
  {
    slug: "mas-de-25",
    name: "Mayores de 25",
    kind: "tematica",
    icon: "🚀",
    users: 495,
    votes: 720,
    tag: "Tendencia",
    activity: "Alta",
    channels: ["mas_de_30", "adolescentes"],
    related: ["mas-de-20", "de-18-a-25", "de-30-a-40", "amistad", "amor"],
    intro:
      "Chat para mayores de 25 sin registro: ya no eres el más joven de la oficina, pero tampoco tienes ganas de sentar la cabeza todavía.",
    about:
      "Los veinticinco son tierra de nadie: demasiado mayor para el desmadre de la facultad, demasiado joven para las conversaciones de hipotecas. La sala reúne a quien está montando su vida a base de prueba y error, cambiando de trabajo, de ciudad o de pareja, y a veces las tres cosas el mismo año. Hay quien llega buscando ligar y quien llega solo por hablar con alguien que entienda de qué va esto. Ambas cosas caben, y las dos funcionan.",
  },
  {
    slug: "de-30-a-40",
    name: "De 30 a 40",
    kind: "tematica",
    icon: "🧭",
    users: 430,
    votes: 640,
    activity: "Alta",
    channels: ["mas_de_30", "mas_de_40"],
    related: ["mas-de-30", "mas-de-25", "de-40-a-50", "amistad", "amor"],
    intro:
      "Chat de 30 a 40 años gratis y sin registro: la década en que la agenda manda y encontrar rato para charlar es medio milagro.",
    about:
      "La treintena tiene una particularidad: todo el mundo está ocupadísimo y, aun así, medio solo. Amigos que se casan y desaparecen, otros que se mudan por trabajo, y una vida social que hay que reconstruir casi desde cero. Aquí se cruzan padres primerizos que escriben mientras el niño duerme, gente con proyectos propios y quien acaba de salir de una relación larga. Conversación de adultos, con humor negro incluido, entre personas que ya saben distinguir lo importante de lo urgente.",
  },
  {
    slug: "de-40-a-50",
    name: "De 40 a 50",
    kind: "tematica",
    icon: "🎸",
    users: 340,
    votes: 500,
    activity: "Alta",
    channels: ["mas_de_40", "mas_de_50", "cuatro_decadas"],
    related: ["mas-de-40", "de-30-a-40", "de-50-a-60", "amistad", "amor"],
    intro:
      "Chat de 40 a 50 años sin registro: la edad en que uno deja de disculparse por lo que le gusta y empieza a disfrutarlo en serio.",
    about:
      "Cumplir cuarenta no es lo que contaban. Muchos llegan a esta sala con la casa hecha y la cabeza pidiendo otra cosa: retomar la guitarra que lleva veinte años en el armario, viajar sin planificar, empezar de nuevo tras una separación. También hay quien está en su mejor momento y solo quiere charla decente sin la histeria de otras salas. Los cuarenta son la década de la sinceridad: aquí nadie finge una vida perfecta, y se agradece.",
  },
  {
    slug: "de-50-a-60",
    name: "De 50 a 60",
    kind: "tematica",
    icon: "⛵",
    users: 225,
    votes: 350,
    tag: "Nueva",
    activity: "Media",
    channels: ["mas_de_50", "mas_de_60"],
    related: ["mas-de-50", "de-40-a-50", "de-60-a-70", "amistad", "salud"],
    intro:
      "Chat de 50 a 60 años gratis y sin registro: conversación reposada entre gente de la misma quinta, con tiempo y ganas de hablar.",
    about:
      "En los cincuenta el reloj cambia de ritmo. Los hijos vuelan del nido, la jubilación asoma en el horizonte y aparece un tiempo libre que hace décadas no existía. Los que entran aquí lo hacen para llenarlo bien: recuperar amistades, planear ese viaje siempre aplazado o simplemente charlar sin que nadie mire el móvil a media frase. Se cuentan cosas con calma, se escucha de verdad y las conversaciones duran lo que tengan que durar. Un ritmo que en otras salas ya se perdió.",
  },
  {
    slug: "de-60-a-70",
    name: "De 60 a 70",
    kind: "tematica",
    icon: "🪴",
    users: 140,
    votes: 215,
    tag: "Nueva",
    activity: "Baja",
    channels: ["mas_de_60", "mas_de_70", "amigos_mayores"],
    related: ["mas-de-60", "de-50-a-60", "amistad", "salud"],
    intro:
      "Chat de 60 a 70 años sin registro: compañía y charla para quien ya no tiene jefe, ni prisa, ni ganas de complicarse.",
    about:
      "Entre los sesenta y los setenta hay una vida entera por contar y, por fin, tiempo para contarla. En esta sala coinciden recién jubilados que aún no saben en qué ocupar la mañana, abuelos con la agenda llena de nietos y gente que simplemente prefiere teclear un rato antes que dejar la casa en silencio. Recetas, huerto, memoria de otros tiempos y bastante retranca. Entrar es sencillo: se escribe un nick y ya se está dentro, sin registros ni contraseñas que recordar.",
  },
];
