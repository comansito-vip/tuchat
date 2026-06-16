import type { Place } from "./types";

export const TOPICS: Place[] = [
  {
    slug: "amor",
    name: "Amor",
    kind: "tematica",
    icon: "❤️",
    users: 640,
    votes: 980,
    tag: "Popular",
    activity: "Alta",
    channels: ["amor", "amistad", "citas"],
    related: ["amistad", "lgtbi", "horoscopo", "tarot", "madrid", "barcelona", "mas-de-40"],
    intro:
      "Chat para buscar pareja y conocer gente gratis sin registro. Aquí se habla de primeras citas, rupturas y a veces surge algo especial con alguien del chat.",
    about:
      "La sala de amor es una de las más activas del chat en español: aquí se busca pareja, se habla de primeras citas que fueron bien y de segundas que nunca llegaron, de relaciones a distancia que se alimentan en estas conversaciones y de rupturas que necesitan un oído exterior. No hace falta tener el corazón roto para entrar: muchos vienen a conocer a alguien, con sinceridad y sin las poses de las redes sociales. El chat de amor funciona: hay parejas que se conocieron aquí y siguen hablando.",
  },
  {
    slug: "amistad",
    name: "Amistad",
    kind: "tematica",
    icon: "🤝",
    users: 580,
    votes: 870,
    tag: "Popular",
    activity: "Alta",
    channels: ["amistad", "amigos", "ocio"],
    related: ["amor", "lgtbi", "viajes", "madrid", "barcelona", "espana", "mas-de-30"],
    intro:
      "Chat para hacer amigos gratis sin registro. Busca amigos para chatear, conoce gente nueva y forma grupos de habla hispana. Entra y empieza a hablar ahora mismo.",
    about:
      "La sala de amistad es para los que buscan conversación de verdad, no likes. Se entra para conocer gente nueva, compartir el día, hablar de lo que no cabe en Twitter y encontrar ese tipo de conexión que no da ningún feed de redes sociales. Hay grupos que se forman, planes que se proponen y personas que llevan años saludándose en esta sala sin haberse visto en persona. El chat de amistad gratis sin registro: la sala más hospitalaria de la red en español.",
  },
  {
    slug: "lgtbi",
    name: "LGTBI",
    kind: "tematica",
    icon: "🏳️‍🌈",
    users: 320,
    votes: 510,
    tag: "Tendencia",
    activity: "Alta",
    channels: ["lgtbi", "amistad", "chatzona"],
    related: ["amor", "amistad", "madrid", "barcelona", "musica", "viajes"],
    intro:
      "Un espacio de conversación abierto y respetuoso para la comunidad LGTBI y sus aliados: desde el orgullo y la visibilidad hasta el día a día.",
    about:
      "La sala LGTBI es un espacio propio para la comunidad: sin necesidad de contextualizarse, explicar quién se es ni tolerar comentarios fuera de lugar. Se habla del Orgullo de Madrid o Buenos Aires, de series y referentes culturales, de relaciones, de coming out y de vivir la identidad de formas muy distintas según el país. También es un punto de encuentro para aliados que quieren escuchar. Un chat abierto, respetuoso y con actividad constante a cualquier hora del día.",
  },
  {
    slug: "deportes",
    name: "Deportes",
    kind: "tematica",
    icon: "⚽",
    users: 490,
    votes: 755,
    tag: "Popular",
    activity: "Alta",
    channels: ["deportes", "amistad", "chatzona"],
    related: ["musica", "videojuegos", "madrid", "barcelona", "espana", "argentina"],
    intro:
      "Fútbol, baloncesto, tenis, MMA: se debate con pasión y algo de parcialidad. Si no aguantas que te rebatan, mejor busca otra sala.",
    about:
      "La sala de deportes es la más intensa del chat en las noches de partido: cuando juega la selección o hay Champions, el contador de usuarios se dispara y los mensajes no paran. Se habla de fútbol, baloncesto —la NBA y la Liga Endesa—, tenis, Fórmula 1, MMA y cualquier deporte que tenga aficionados apasionados. Las discusiones son directas, la parcialidad es bienvenida y el que no tiene opinión propia aprende rápido que aquí hay que tenerla.",
  },
  {
    slug: "musica",
    name: "Música",
    kind: "tematica",
    icon: "🎵",
    users: 415,
    votes: 635,
    tag: "Tendencia",
    activity: "Alta",
    channels: ["musica", "amistad", "chatzona"],
    related: ["cine", "videojuegos", "deportes", "lgtbi", "amor", "madrid"],
    intro:
      "De los clásicos del rock español a los últimos lanzamientos urbanos: se comparten listas, se discuten letras y se descubren artistas que no salen en Spotify.",
    about:
      "La sala de música es donde se comparten descubrimientos que no salen en los algoritmos: artistas en directo que merece la pena ver, álbumes que aún no están en playlists de moda, y debates sobre si el reggaetón es música o si Rosalía ha vendido su flamenco. De Los Planetas a Bad Bunny, de Calle 13 a Camarón: el rango es amplio y la discusión siempre tiene nivel. También es el sitio donde alguien siempre pide recomendaciones y alguien siempre tiene cinco para dar.",
  },
  {
    slug: "cine",
    name: "Cine",
    kind: "tematica",
    icon: "🎬",
    users: 295,
    votes: 455,
    activity: "Media",
    channels: ["cine", "amistad", "chatzona"],
    related: ["musica", "videojuegos", "tecnologia", "filosofia", "madrid", "barcelona"],
    intro:
      "Últimas recomendaciones, discusiones sobre finales de temporada y debates que terminan siempre en si Kubrick o Tarkovski. Trae palomitas.",
    about:
      "La sala de cine es el cinefórum permanente del chat: se habla de los últimos estrenos con spoilers libremente avisados, de clásicos que no envejecen, de directores latinoamericanos que merecen más reconocimiento y de por qué la última de Almodóvar era mejor o peor que la anterior. También hay quien recomienda cine independiente que no llegó a los multicines, documentales que cambian la perspectiva y series que empiezan a las once y terminan cuando ya no hay hora. Trae palomitas y criterio propio.",
  },
  {
    slug: "videojuegos",
    name: "Videojuegos",
    kind: "tematica",
    icon: "🎮",
    users: 375,
    votes: 590,
    tag: "Tendencia",
    activity: "Alta",
    channels: ["videojuegos", "amistad", "chatzona"],
    related: ["tecnologia", "cine", "musica", "deportes", "madrid", "barcelona"],
    intro:
      "Partidas en curso, noticias del sector, builds imposibles y ese compañero que desaparece en el momento más crítico: todo tiene cabida en la sala de videojuegos.",
    about:
      "La sala de videojuegos reúne a jugadores de PC, consola y móvil sin guerras de plataforma: lo que importa es la partida, no el soporte. Se habla de builds imposibles de Path of Exile, del lore de FromSouls que nadie termina de entender del todo, de los últimos anuncios del Nintendo Direct y del compañero que desaparece justo antes del boss final. También hay quien recluta para su clan, quien busca consejo antes de comprar, y quien quiere saber qué vale la pena en el catálogo de este mes.",
  },
  {
    slug: "filosofia",
    name: "Filosofía",
    kind: "tematica",
    icon: "🦉",
    users: 145,
    votes: 230,
    activity: "Baja",
    channels: ["filosofia", "amistad", "chatzona"],
    related: ["tecnologia", "cine", "tarot", "horoscopo", "amor", "espana"],
    intro:
      "Libre albedrío, nihilismo, si el lenguaje construye la realidad o si Nietzsche te cambió la vida a los dieciocho: la sala más lenta y más interesante de la red.",
    about:
      "La sala de filosofía es la más lenta del chat, pero también la más interesante: no hay prisa porque los temas no tienen respuesta rápida. Se habla de libre albedrío, de si el lenguaje construye la realidad o la describe, de nihilismo, de estoicismo aplicado al día a día y de ese Nietzsche que a los dieciséis años lo cambia todo. También hay debates sobre ética tecnológica, transhumanismo y lo que la inteligencia artificial significa para la conciencia humana. Una sala para quien prefiere las preguntas a las respuestas.",
  },
  {
    slug: "tecnologia",
    name: "Tecnología",
    kind: "tematica",
    icon: "💻",
    users: 340,
    votes: 530,
    activity: "Media",
    channels: ["tecnologia", "amistad", "chatzona"],
    related: ["videojuegos", "bolsa", "filosofia", "cine", "madrid", "barcelona"],
    intro:
      "IA, startups, ciberseguridad y el eterno debate Linux vs Windows: si tienes criterio propio sobre el sector, aquí no te vas a aburrir.",
    about:
      "La sala de tecnología es donde se mezclan desarrolladores que debaten arquitectura de software, emprendedores que preguntan por herramientas de productividad, y curiosos que quieren entender qué está pasando con la inteligencia artificial. Se habla de Linux versus Windows sin que nadie gane del todo, de los últimos modelos de lenguaje y si van a quitar empleos, de startups que arrancan y de ciberseguridad que cada día importa más. Si tienes criterio propio sobre el sector tecnológico, aquí hay interlocutores que van a hacerte pensar.",
  },
  {
    slug: "bolsa",
    name: "Bolsa",
    kind: "tematica",
    icon: "📈",
    users: 215,
    votes: 340,
    tag: "Nueva",
    activity: "Media",
    channels: ["bolsa", "amistad", "chatzona"],
    related: ["tecnologia", "viajes", "salud", "espana", "mexico", "argentina"],
    intro:
      "Análisis técnico, noticias macroeconómicas y el clásico que compró en el pico y ahora espera: una sala sin consejos de inversión pero con mucha opinión.",
    about:
      "La sala de bolsa y economía es para quienes siguen los mercados con interés real: se comparten análisis técnicos, noticias macroeconómicas y opiniones sobre empresas del Ibex 35, la Bolsa Mexicana o el S&P 500. No hay consejos de inversión porque nadie aquí tiene licencia para darlos, pero hay muchas perspectivas, algunos errores honestos compartidos y ese usuario que compró en el pico y ahora tiene un horizonte de inversión muy largo. También se habla de criptomonedas con escepticismo sano.",
  },
  {
    slug: "viajes",
    name: "Viajes",
    kind: "tematica",
    icon: "✈️",
    users: 380,
    votes: 595,
    tag: "Tendencia",
    activity: "Alta",
    channels: ["viajes", "amistad", "chatzona"],
    related: ["cocina", "amistad", "amor", "madrid", "barcelona", "malaga"],
    intro:
      "Rutas que nadie cuenta en los influencers, alojamientos donde no te roban y el eterno dilema de viajar solo o en grupo. Comparte tu próximo destino.",
    about:
      "La sala de viajes es el mapa que los algoritmos no construyen: rutas que no salen en los primeros resultados de Google, alojamientos que no están en Airbnb, fronteras que se pasan mejor en autobús nocturno y presupuestos reales para destinos soñados. Se comparten experiencias de primera mano —Latinoamérica, el sur de España, el Sudeste Asiático— y se responden preguntas que las guías de viajes responden mal. También hay debate sobre si viajar solo o en grupo tiene más sentido, y la respuesta siempre es que depende.",
  },
  {
    slug: "cocina",
    name: "Cocina",
    kind: "tematica",
    icon: "🍳",
    users: 260,
    votes: 405,
    activity: "Media",
    channels: ["cocina", "amistad", "chatzona"],
    related: ["viajes", "salud", "amor", "espana", "mexico", "lima"],
    intro:
      "Recetas de la abuela, experimentos fallidos y la guerra entre los que sofríen el ajo primero y los que lo echan al final. La cocina de España y Latinoamérica.",
    about:
      "La sala de cocina es el libro de recetas colectivo del chat: se comparten las de la abuela que nadie anotó a tiempo, trucos que cambian un plato para siempre, y experimentos que funcionaron o no, con la misma honestidad. Se discute si el ajo va primero o al final, si la paella lleva cebolla o es un sacrilegio, si el ceviche es peruano o mexicano, y si hay algo en el mundo que la tortilla de patata no pueda solucionar. La diversidad culinaria de España y Latinoamérica cabe entera en esta sala.",
  },
  {
    slug: "salud",
    name: "Salud",
    kind: "tematica",
    icon: "🏃",
    users: 195,
    votes: 305,
    activity: "Media",
    channels: ["salud", "amistad", "chatzona"],
    related: ["cocina", "deportes", "viajes", "filosofia", "amor", "espana"],
    intro:
      "Hábitos, entrenamiento, salud mental y nutrición sin dogmatismos: experiencias reales, no posts de Instagram con cuerpos de catálogo.",
    about:
      "La sala de salud es el espacio para hablar de lo que importa sin filtros de Instagram: hábitos reales, entrenamientos que funcionan para personas normales, nutrición sin dogmatismos de moda, y salud mental en un momento en que el tema ya no da vergüenza. Se comparten experiencias con la ansiedad, el estrés laboral y los terapeutas que ayudaron o no. No hay diagnósticos ni consejos médicos, pero hay escucha genuina y más información útil que en muchos blogs de bienestar.",
  },
  {
    slug: "tarot",
    name: "Tarot",
    kind: "tematica",
    icon: "🔮",
    users: 175,
    votes: 275,
    tag: "Nueva",
    activity: "Baja",
    channels: ["esoterismo", "tarot", "ocio"],
    related: ["horoscopo", "esoterismo", "videncia", "astrologia", "magia", "amor"],
    intro:
      "La Sota de Copas, el Ermitaño al revés y qué significa soñar con agua: aquí se leen tiradas, se debaten significados y nadie juzga si crees o no crees.",
    about:
      "La sala de tarot y esoterismo es el espacio donde se leen tiradas, se explican las cartas del Tarot de Marsella o el Rider-Waite, y se debaten los simbolismos del Ermitaño al revés o la Torre. No importa si se cree o no del todo: aquí se entra con la mente abierta y se sale con algo en qué pensar. También se habla de sueños y su interpretación, de la luna en cada signo, y de ese momento en que el inconsciente habla más alto que la razón. Una sala donde nadie juzga lo que se cree.",
  },
  {
    slug: "horoscopo",
    name: "Horóscopo",
    kind: "tematica",
    icon: "⭐",
    users: 210,
    votes: 330,
    activity: "Media",
    channels: ["horoscopo", "amistad", "chatzona"],
    related: ["tarot", "amor", "amistad", "lgtbi", "madrid", "barcelona"],
    intro:
      "Escorpio que no encaja con Géminis, ascendente en Virgo que lo explica todo y el Mercurio retrógrado de turno: se habla con rigor y con humor en igual medida.",
    about:
      "La sala del horóscopo es para quien lee el signo en el periódico aunque diga que no cree, y para quien tiene el tema muy estudiado. Escorpio que no encaja con Géminis, ascendente en Virgo que explica esa tendencia al perfeccionismo, y el Mercurio retrógrado que justifica la semana rara: se habla con rigor astrológico y con bastante humor en igual medida. También hay quien comparte la carta natal completa y quien pide que le expliquen la diferencia entre sol, luna y ascendente por primera vez.",
  },
  {
    slug: "anime",
    name: "Anime",
    kind: "tematica",
    icon: "🎌",
    users: 310,
    votes: 490,
    tag: "Tendencia",
    activity: "Alta",
    channels: ["anime", "amistad", "chatzona"],
    related: ["videojuegos", "cine", "musica", "tecnologia", "madrid", "barcelona"],
    intro:
      "De Shonen Jump a los últimos estrenos de la temporada: se habla de sagas, se debaten finales y siempre hay alguien que lleva el manga un arco por delante.",
    about:
      "La sala de anime es para todos los niveles: quienes acaban de ver su primer shonen y quienes llevan veinte años siguiendo Weekly Shōnen Jump. Se debaten finales de temporada —con spoilers libremente avisados—, se comparan adaptaciones con el manga original, y siempre hay alguien que lleva el arco por delante y tiene mucho autocontrol para no contarlo. Se habla de Attack on Titan, One Piece, Chainsaw Man, Jujutsu Kaisen y de los clásicos de Studio Ghibli que no envejecen. Sala con actividad constante en temporada.",
  },
  {
    slug: "series",
    name: "Series",
    kind: "tematica",
    icon: "📺",
    users: 430,
    votes: 670,
    tag: "Popular",
    activity: "Alta",
    channels: ["series", "amistad", "chatzona"],
    related: ["cine", "musica", "videojuegos", "amor", "madrid", "barcelona"],
    intro:
      "Gran Hermano, Netflix, HBO, Telecinco — la plataforma da igual: aquí se habla de series con spoilers avisados y debates que duran hasta el siguiente episodio.",
    about:
      "La sala de series es el espacio donde se comenta en tiempo real lo que se está viendo: el último capítulo de House of the Dragon, el estreno de Netflix del viernes, la telenovela latinoamericana que todos dicen no ver pero todos ven. Los spoilers se avisan o se ignoran según el estado de ánimo, y siempre hay alguien que ya ha terminado la temporada y tiene muchísima contención. Se recomiendan series que los algoritmos no suelen proponer y se descubren títulos que llevan años esperando en el catálogo.",
  },
  {
    slug: "futbol",
    name: "Fútbol",
    kind: "tematica",
    icon: "⚽",
    users: 520,
    votes: 810,
    tag: "Popular",
    activity: "Alta",
    channels: ["futbol", "deportes", "chatzona"],
    related: ["deportes", "musica", "madrid", "barcelona", "espana", "argentina"],
    intro:
      "Liga, Champions, mundiales y ese gol que el árbitro no debería haber anulado: la sala más acalorada del chat. Si eres del Madrid o del Barça, trae argumentos.",
    about:
      "La sala de fútbol es la más acalorada del chat cuando hay partido: durante la Champions y los mundiales el contador de usuarios se multiplica y los mensajes van a ritmo de gol. Se habla de LaLiga, la Premier, la Serie A, la Copa Libertadores y todo el fútbol en español con el nivel de análisis de quien lo sigue de verdad. Real Madrid versus Barça no necesita presentación, pero también hay debates sobre Millonarios, Peñarol, Boca, River y los equipos que no salen en los grandes medios pero tienen hinchadas de verdad.",
  },
  {
    slug: "politica",
    name: "Política",
    kind: "tematica",
    icon: "🗳️",
    users: 280,
    votes: 445,
    activity: "Media",
    channels: ["politica", "amistad", "chatzona"],
    related: ["filosofia", "tecnologia", "espana", "mexico", "argentina", "colombia"],
    intro:
      "Debates sobre actualidad, partidos, elecciones y todo lo que pasa en España y Latinoamérica. Se puede discrepar sin insultar, aunque no siempre se logra.",
    about:
      "La sala de política es para debatir la actualidad de España y Latinoamérica con más argumentos y menos insultos de lo que se ve en redes. Se habla de elecciones, de economía, de migración, de los gobiernos de turno en cada país y de lo que pasa en el continente con una perspectiva que los medios locales no siempre tienen. Las discusiones son directas —a veces demasiado— y la sala no es apta para quien no tolera que le rebatan, pero tampoco para quien no tiene nada que decir. Entra con argumentos.",
  },
  {
    slug: "ligar",
    name: "Ligar",
    kind: "tematica",
    icon: "💘",
    users: 590,
    votes: 920,
    tag: "Popular",
    activity: "Alta",
    channels: ["ligar", "amor", "citas"],
    related: ["amor", "amistad", "lgtbi", "madrid", "barcelona", "espana"],
    intro:
      "Chat para ligar gratis sin registro: la sala más activa para conocer gente y buscar pareja online. Presentaciones y más de 500 usuarios conectados ahora mismo.",
    about:
      "La sala de ligar es una de las más activas del chat: aquí se viene directamente a conocer gente, sin rodeos ni perfiles de Instagram que revisar antes. Más de quinientos usuarios conectados en horas pico, presentaciones que salen bien, conversaciones que empiezan aquí y continúan en otro sitio. No hay algoritmos que filtren ni suscripciones que pagar: funciona con el mismo mecanismo que siempre ha funcionado, que es hablar con alguien que también tiene ganas de hablar.",
  },
  {
    slug: "psicologia",
    name: "Psicología",
    kind: "tematica",
    icon: "🧠",
    users: 160,
    votes: 255,
    activity: "Media",
    channels: ["psicologia", "amistad", "chatzona"],
    related: ["filosofia", "salud", "amor", "tarot", "madrid", "barcelona"],
    intro:
      "Ansiedad, relaciones, autoconocimiento y debate terapia vs. medicación: una sala sin diagnósticos, pero con mucha escucha y bastante introspección compartida.",
    about:
      "La sala de psicología es el espacio donde se habla de lo que cuesta hablar en otros sitios: ansiedad, relaciones tóxicas, autoestima, procrastinación, el duelo que no termina de cerrar. No hay psicólogos licenciados dando diagnósticos, pero hay personas que han pasado por lo mismo o algo parecido y tienen algo que decir. También se debate sobre terapia —cognitivo-conductual, sistémica, online— y sobre medicación con una honestidad que no siempre se encuentra. Una sala de escucha sin juicios.",
  },
  {
    slug: "adultos",
    name: "Adultos",
    kind: "tematica",
    icon: "🔞",
    users: 480,
    votes: 750,
    tag: "Popular",
    activity: "Alta",
    channels: ["adultos", "adultos-latinos", "maduritos", "mas-de-30", "mas-de-40", "chatzona"],
    related: ["erotico", "infieles", "encuentros", "ligar", "lgtbi", "lesbianas"],
    intro:
      "Espacio para mayores de edad sin filtros: conversaciones de adultos, contactos y todo lo que no cabe en las salas generales. Sólo para mayores de 18.",
    about:
      "La sala de adultos es el espacio libre de filtros para mayores de dieciocho años: conversaciones que no caben en las salas generales, contactos directos entre adultos, y todo lo que queda fuera del chat convencional. Activa las veinticuatro horas con cientos de usuarios, sin registro previo ni verificaciones que ralenticen el acceso. La sala más grande de la categoría adultos de la red en español. No hace falta perfil ni foto: el anonimato forma parte del atractivo, y la posibilidad de hablar sin que nadie sepa quién eres lo hace más libre.",
  },
  {
    slug: "erotico",
    name: "Erótico",
    kind: "tematica",
    icon: "🔥",
    users: 390,
    votes: 615,
    tag: "Popular",
    activity: "Alta",
    channels: ["erotico", "cibersexo", "cuarto-oscuro", "hot", "intimos", "mazmorra", "chatzona"],
    related: ["adultos", "infieles", "encuentros", "erotico", "ligar", "lesbianas"],
    intro:
      "La sala más directa del sitio. Fantasías, conversaciones hot y todo lo que la imaginación permite: sin tabúes y entre mayores de edad.",
    about:
      "La sala erótica es el espacio más directo del chat: fantasías, conversaciones hot, rol erótico y todo lo que la imaginación permite entre adultos. Sin tabúes, sin juzgar lo que se busca, con cientos de usuarios activos a cualquier hora. Una de las salas con mayor actividad constante de toda la red en español: más de trescientos usuarios conectados de media durante el día. Se habla de rol, de fetiches, de encuentros imaginarios y de experiencias reales que se comparten con quien sepa escuchar. La libertad de expresión que no encuentras en otras redes o chats más restrictivos.",
  },
  {
    slug: "infieles",
    name: "Infieles",
    kind: "tematica",
    icon: "💋",
    users: 355,
    votes: 560,
    tag: "Tendencia",
    activity: "Alta",
    channels: ["infieles", "casadas", "casados", "casados-infieles", "cornudas", "cornudos", "chatzona"],
    related: ["adultos", "erotico", "encuentros", "amor", "ligar", "madrid"],
    intro:
      "Una de las salas más activas del chat: casados que buscan algo fuera, aventuras discretas y confesiones que nunca llegarían a la pareja. Sin juicios.",
    about:
      "La sala de infieles es una de las más activas del chat: casados que buscan algo fuera, aventuras discretas que no quieren drama, confesiones que alivian y contactos que entienden la situación sin necesidad de explicarla. No hay juicios sobre lo que cada uno decide, solo personas que comparten algo parecido. Una sala con ritmo constante de actividad y discreción entendida. Aquí se habla de lo que no se puede contar en casa: la necesidad de algo diferente, el aburrimiento que lleva a buscar fuera o simplemente el deseo de conectar con alguien nuevo sin consecuencias.",
  },
  {
    slug: "encuentros",
    name: "Encuentros",
    kind: "tematica",
    icon: "🤫",
    users: 415,
    votes: 650,
    tag: "Popular",
    activity: "Alta",
    channels: ["encuentros", "citas", "encuentros-latinos", "ligar-con-chicas", "ligoteo", "amantes", "chatzona"],
    related: ["adultos", "erotico", "infieles", "ligar", "amor", "madrid"],
    intro:
      "Para los que buscan algo más que chatear: citas, encuentros puntuales y contactos sin complicaciones. La sala donde el chat acaba en quedada.",
    about:
      "La sala de encuentros es para quien busca que el chat acabe en algo real: citas, encuentros puntuales, contactos sin complicaciones en la misma ciudad o en la ciudad a la que se viaja. Se utilizan las salas de geolocalización y de ciudad para coordinar, y esta sala como punto de partida. Activa durante todo el día con personas de España y Latinoamérica que buscan lo mismo y lo dicen sin rodeos. El filtro de ciudad ayuda a centrar la búsqueda: quien busca en Madrid encuentra madrileños, quien viaja a Barcelona puede preparar el encuentro antes de llegar.",
  },
  {
    slug: "lesbianas",
    name: "Lesbianas",
    kind: "tematica",
    icon: "🏳️‍🌈",
    users: 220,
    votes: 345,
    activity: "Media",
    channels: ["lesbianas", "de-lesbianas", "el-rincon-lesbico", "lesbico", "lesbis", "lescontactos", "chatzona"],
    related: ["lgtbi", "adultos", "erotico", "encuentros", "amor", "madrid"],
    intro:
      "Espacio propio para mujeres que buscan mujeres: amistad, contactos, relaciones y conversación entre lesbianas y bisexuales sin necesidad de explicar nada.",
    about:
      "La sala de lesbianas es el espacio propio de mujeres que buscan mujeres: amistad, contactos, relaciones estables o algo sin etiqueta, conversación entre lesbianas y bisexuales sin necesidad de explicar nada. No hace falta presentación ni contexto: quien entra sabe dónde está. También hay espacio para hablar de visibilidad lésbica, de referentes culturales y de todo lo que comparte una comunidad que tiene sus propias conversaciones.",
  },
];
