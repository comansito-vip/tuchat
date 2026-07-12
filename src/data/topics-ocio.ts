import type { Place } from "./types";

// Vertical Ocio: humor, memes y juegos de sobremesa. El hub enruta al canal IRC
// real #ocio, el de entretenimiento general del chat.
export const TOPICS_OCIO: Place[] = [
  {
    slug: "ocio", name: "Ocio", kind: "tematica", icon: "🎪",
    users: 300, votes: 545, tag: "Popular", activity: "Alta",
    channels: ["ocio", "amistad"],
    related: ["humor", "memes", "chistes", "encuestas", "adivinanzas"],
    intro: "El canal de entretenimiento general: humor, memes, encuestas y ganas de matar el rato. Se entra sin registro, solo hace falta un nick.",
    about: "Ocio es el patio de recreo del chat: se entra sin buscar nada concreto y se acaba pasando dos horas. La conversación salta del chiste malo al debate sobre si esa serie aguanta ocho temporadas, de una encuesta tonta a un pique de adivinanzas que no resuelve nadie. Funciona como sala madre de humor, memes, chistes, encuestas y adivinanzas, así que aquí encaja lo que no cabe en ninguna otra parte: la anécdota absurda del trabajo, el vídeo que lleva toda la semana circulando, la pregunta idiota de las tres de la mañana. Es de las salas con más movimiento a cualquier hora, y de las pocas donde nadie te va a pedir que justifiques por qué estás ahí. Se elige nick y se entra, sin más trámite.",
  },
  {
    slug: "humor", name: "Humor", kind: "tematica", icon: "😂",
    users: 215, votes: 395, tag: "Popular", activity: "Alta",
    parentSlug: "ocio", parentName: "Ocio",
    channels: ["ocio", "amistad"],
    related: ["ocio", "memes", "chistes", "amistad", "juegos"],
    intro: "Reírse de todo, empezando por uno mismo. Humor absurdo, negro, ironía fina y el chiste que solo pillan tres. Elige nick y entra a la sala.",
    about: "Hay quien tiene el gatillo fácil para el sarcasmo y quien necesita que le expliquen el remate; los dos acaban en esta sala y ahí está media gracia. El debate sobre dónde está la línea del humor negro se reabre cada pocos días y jamás se cierra, porque nunca hubo consenso ni lo va a haber. Cae ironía tan seca que alguien la toma en serio y se ofende, absurdo sin pies ni cabeza, el retruécano tonto que se celebra más de lo que merece. Lo único imperdonable es explicar el chiste: eso lo mata en el acto. Se entra sin registro, con el nick que se quiera, y en cinco minutos ya estás discutiendo si aquel cómico se pasó de frenada o simplemente no tenía gracia. El nivel sube cuando alguien se atreve a reírse de lo suyo propio.",
  },
  {
    slug: "memes", name: "Memes", kind: "tematica", icon: "🤣",
    users: 190, votes: 355, tag: "Tendencia", activity: "Alta",
    parentSlug: "ocio", parentName: "Ocio",
    channels: ["ocio", "amistad"],
    related: ["ocio", "humor", "chistes", "tecnologia", "juegos"],
    intro: "Un meme nace, arrasa y caduca en tres días. Aquí se comparte mientras aún vale: formatos nuevos, ediciones cutres y plantillas resucitadas.",
    about: "Un meme tiene la esperanza de vida de una mosca: nace un martes, satura los grupos el jueves y para el domingo ya da vergüenza usarlo delante de nadie. Por eso esta sala corre: se comparte mientras todavía está caliente, con la gente que lo vio primero y con la que llega tarde preguntando de dónde ha salido eso. Se rescatan formatos viejos que aguantan el tipo, se comenta la edición cutre hecha en el móvil a las tres de la mañana y se señala sin piedad a quien reenvía uno de 2016 convencido de que es novedad. Al final siempre queda la duda de por qué lo mismo hace muchísima gracia a las once de la noche y ninguna al día siguiente.",
  },
  {
    slug: "chistes", name: "Chistes", kind: "tematica", icon: "🃏",
    users: 170, votes: 315, activity: "Media",
    parentSlug: "ocio", parentName: "Ocio",
    channels: ["ocio", "amistad"],
    related: ["ocio", "humor", "memes", "amistad", "retos"],
    intro: "Chistes buenos, malos y de esos que se cuentan solo por ver la cara del otro. Clásicos de patio, cuñadismo puro y absurdo. Suelta el tuyo.",
    about: "Contar un chiste bien es un arte menor y muy poco reconocido: manda el ritmo, la pausa justo antes del remate y saber callarse a tiempo en lugar de estirarlo. Caen de todos los tipos, del clásico de patio de colegio al que solo funciona escrito, pasando por el chiste malo de cuñado que se celebra precisamente por lo malo que es. Hay gente que lo borda y gente que destroza el final y aun así arranca risas por pura torpeza. De vez en cuando alguien desentierra uno que llevaba veinte años olvidado y funciona igual de bien que entonces. La norma no escrita es simple: si lo cuentas, aguanta el silencio cuando no hace gracia. Y prueba con otro.",
  },
  {
    slug: "encuestas", name: "Encuestas", kind: "tematica", icon: "🧾",
    users: 160, votes: 290, activity: "Media",
    parentSlug: "ocio", parentName: "Ocio",
    channels: ["ocio", "amistad", "trivial"],
    related: ["ocio", "adivinanzas", "quiz", "humor", "amistad"],
    intro: "Preguntas tontas con respuestas muy serias: tortilla con cebolla, playa o montaña, piña en la pizza. Vota en un minuto y luego defiéndelo.",
    about: "Una pregunta que parecía inocente, tortilla con o sin cebolla, termina en dos horas de discusión con gente enfadada de verdad. Pasa cada semana y es medio motivo de que esta sala exista. La mecánica es sencilla: alguien lanza el dilema, se vota en un minuto y entonces llega lo bueno, que es el pique, el que cambia de bando a mitad de camino y el que resiste solo contra veinte sin ceder un palmo. Circulan preferencias absurdas, comparaciones injustas entre cosas que no se pueden comparar y algún tema serio que se cuela sin avisar y sube el tono. El resultado no le importa a nadie; engancha comprobar que siempre hay alguien capaz de defender lo indefendible con argumentos sólidos. Entrar cuesta un nick y cero registros; salir con la misma opinión con la que entraste, bastante más.",
  },
  {
    slug: "adivinanzas", name: "Adivinanzas", kind: "tematica", icon: "🧩",
    users: 145, votes: 265, tag: "Nueva", activity: "Baja",
    parentSlug: "ocio", parentName: "Ocio",
    channels: ["ocio", "amistad", "trivial"],
    related: ["ocio", "encuestas", "preguntados", "culturageneral", "quiz"],
    intro: "Oro parece, plata no es. Adivinanzas de toda la vida y acertijos de lógica que se resisten media hora. No cantes la respuesta tan pronto.",
    about: "Oro parece, plata no es: la adivinanza clásica sigue funcionando cincuenta años después porque la aprendimos de una abuela y ya no se olvida. Caben tanto esas, con su rima y su trampa, como los acertijos de lógica que piden papel y boli, los del río, la barca y el que siempre miente. La gracia está en el rato muerto entre la pregunta y el instante en que a alguien se le enciende la bombilla y lo suelta demasiado rápido, arruinándoselo a los demás. De ahí la costumbre más firme de la sala: pistas sí, solución directa no, al menos hasta que dos o tres se rindan. Quien traiga acertijo propio es bienvenido, siempre que tenga la respuesta preparada y no se la invente sobre la marcha cuando ve que nadie acierta.",
  },
];
