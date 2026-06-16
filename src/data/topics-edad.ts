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
    channels: ["mas_de_50", "mas_de_60"],
    related: ["mas-de-50", "amistad", "amor", "salud"],
    intro:
      "Chat para mayores de 60 sin registro: compañía, charla y amistad para quien tiene tiempo y ganas de conversar sin complicaciones.",
    about:
      "La sala de los sesenta es para tomarse las cosas con calma. Aquí coinciden jubilados, abuelos que presumen de nietos y gente que valora una buena conversación por encima de todo. Se habla de recuerdos, de huertos y recetas, de los achaques con humor y de planes que ahora por fin hay tiempo de cumplir. Para muchos es también compañía en las horas tranquilas del día. Un chat amable, sin prisas y sin necesidad de saber de tecnología: basta entrar y hablar.",
  },
];
