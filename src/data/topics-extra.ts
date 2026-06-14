import type { Place } from "./types";

// Verticales temáticos (Fase 2 del brief): sub-salas SEO long-tail por anime,
// equipos de fútbol, esoterismo, cultura, LGTBI y comunidad latina. Contenido
// único por sala (regla anti-IA). Se incluyen en /chat, el catálogo y el sitemap,
// pero NO en el carrusel de categorías de la home (ver getPrimaryTopics).
export const TOPICS_EXTRA: Place[] = [
  // ───────────────────────── Anime ─────────────────────────
  {
    slug: "naruto",
    name: "Naruto",
    kind: "tematica",
    icon: "🍥",
    users: 245,
    votes: 380,
    tag: "Tendencia",
    activity: "Alta",
    channels: ["naruto", "anime", "manga", "chatzona"],
    related: ["anime", "dragon-ball", "one-piece", "manga", "videojuegos", "madrid"],
    intro:
      "Del Valle del Fin a la guerra contra Madara: aquí el equipo 7 todavía da para discutir horas.",
    about:
      "La sala donde se reabre el eterno debate Naruto contra Sasuke y si Sakura merecía más protagonismo. Se comenta el salto de calidad de Shippuden, el relleno interminable, la genialidad del arco de Pain y si Boruto está a la altura. Hay quien defiende a Itachi como el verdadero héroe y quien todavía no perdona el final de Kaguya. Fans del rasengan, del Sharingan y de Kakashi sin máscara entran a picarse y a recomendar capítulos.",
  },
  {
    slug: "dragon-ball",
    name: "Dragon Ball",
    kind: "tematica",
    icon: "🐉",
    users: 260,
    votes: 410,
    tag: "Popular",
    activity: "Alta",
    channels: ["dragon-ball", "anime", "manga", "chatzona"],
    related: ["anime", "naruto", "one-piece", "manga", "videojuegos", "barcelona"],
    intro:
      "Desde la búsqueda de las esferas hasta el Ultra Instinto: la saga que nos enganchó a todos sigue dando guerra.",
    about:
      "Aquí se discute si Z fue la cumbre o si Super recuperó el nivel, si Gohan debió ser el protagonista tras Cell y por qué Vegeta se lleva el cariño del fandom. Cell, Freezer, Buu y Jiren reparten nostalgia y polémica a partes iguales. Se habla del torneo del poder, de las transformaciones infinitas, de GT como herejía y del manga de Toyotaro. Siempre hay alguien comparando poderes y otro recordando el doblaje latino contra el castellano.",
  },
  {
    slug: "one-piece",
    name: "One Piece",
    kind: "tematica",
    icon: "🏴‍☠️",
    users: 270,
    votes: 430,
    tag: "Popular",
    activity: "Alta",
    channels: ["one-piece", "anime", "manga", "chatzona"],
    related: ["anime", "naruto", "dragon-ball", "manga", "series", "madrid"],
    intro:
      "Más de mil capítulos buscando el One Piece y la teoría del Gorosei sigue creciendo cada semana.",
    about:
      "El refugio de los que aguantan el ritmo de Oda sin spoilers. Se teoriza sobre el Siglo Vacío, la voluntad de la D y qué es realmente el tesoro de Roger. Wano dividió opiniones por su duración, pero el Gear 5 de Luffy puso a todos de acuerdo. Se debate el mejor arco (Marineford, Enies Lobby, Water 7), se votan a los Sombrero de Paja favoritos y se queja del relleno del anime frente a un manga que no falla.",
  },
  {
    slug: "kimetsu-no-yaiba",
    name: "Kimetsu no Yaiba",
    kind: "tematica",
    icon: "⚔️",
    users: 230,
    votes: 360,
    tag: "Tendencia",
    activity: "Alta",
    channels: ["kimetsu-no-yaiba", "anime", "manga", "chatzona"],
    related: ["anime", "jujutsu-kaisen", "one-piece", "manga", "cine", "barcelona"],
    intro:
      "La animación de Ufotable dejó el listón por las nubes: cada respiración de Tanjiro es un espectáculo.",
    about:
      "Sala para los que se quedaron sin palabras con el arco del tren infinito y la pelea contra Akaza. Se alaba el trabajo bestial de Ufotable, se debate si la historia es sencilla pero efectiva y quién es el Hashira favorito, con Rengoku y Giyu peleándose el puesto. Nezuko, Zenitsu y Inosuke generan memes sin parar. También se comenta el arco final contra Muzan, las muertes que dolieron y si la película batió récords con razón.",
  },
  {
    slug: "jujutsu-kaisen",
    name: "Jujutsu Kaisen",
    kind: "tematica",
    icon: "👁️",
    users: 240,
    votes: 375,
    tag: "Tendencia",
    activity: "Alta",
    channels: ["jujutsu-kaisen", "anime", "manga", "chatzona"],
    related: ["anime", "kimetsu-no-yaiba", "naruto", "manga", "videojuegos", "madrid"],
    intro:
      "Gojo, el infinito y el arco de Shibuya: el manga de Gege Akutami no perdona a nadie.",
    about:
      "Aquí todavía se lloran las muertes de Shibuya y el manga del arco de Sendai. Se discute si Gege es demasiado cruel con sus personajes, lo roto que estaba Sukuna y el famoso debate sobre Gojo encerrado. La técnica de las maldiciones, el dominio expandido y el sistema de poder dan para teorías infinitas. Yuji, Megumi y Nobara reparten escenas memorables, y siempre hay quien compara la animación de MAPPA temporada a temporada y critica el ritmo del anime.",
  },
  {
    slug: "pokemon",
    name: "Pokémon",
    kind: "tematica",
    icon: "⚡",
    users: 255,
    votes: 395,
    tag: "Popular",
    activity: "Alta",
    channels: ["pokemon", "anime", "manga", "chatzona"],
    related: ["anime", "dragon-ball", "naruto", "manga", "videojuegos", "barcelona"],
    intro:
      "De Kanto a Paldea: aquí todavía se discute cuál fue la mejor generación y por qué la primera es intocable.",
    about:
      "Punto de encuentro de los que crecieron con Ash y Pikachu y de los que siguen criando equipos competitivos. Se debaten las generaciones, el eterno odio o amor a las megaevoluciones y los Pokémon dinamax, y si el cierre del viaje de Ash fue digno. Entrenadores hardcore hablan de IVs, naturalezas y tier list de Smogon mientras otros solo quieren recordar Oro y Plata. Los shinies, los starters favoritos y los legendarios injugables dan conversación para rato.",
  },
  {
    slug: "manga",
    name: "Manga",
    kind: "tematica",
    icon: "📖",
    users: 220,
    votes: 340,
    tag: "Tendencia",
    activity: "Alta",
    channels: ["manga", "anime", "chatzona"],
    related: ["anime", "naruto", "one-piece", "jujutsu-kaisen", "series", "madrid"],
    intro:
      "Para los que van un arco por delante del anime y prefieren el blanco y negro del papel.",
    about:
      "La sala de los lectores que no esperan a la adaptación. Se recomiendan seinen como Berserk, Vagabond o Vinland Saga, se debate si el manga siempre supera al anime y se comparten editoriales, scans y ediciones de coleccionista. Hablan del legado de Toriyama, del trazo de Inio Asano y de joyas terminadas como Fullmetal Alchemist. También se quejan de finales apresurados, de mangakas que se eternizan en el hiatus y recomiendan obras de nicho que nunca tendrán anime.",
  },

  // ──────────────────── Deportes · equipos ────────────────────
  {
    slug: "real-madrid",
    name: "Real Madrid",
    kind: "tematica",
    icon: "⚪",
    users: 352,
    votes: 561,
    tag: "Popular",
    activity: "Alta",
    channels: ["real-madrid", "futbol", "deportes", "chatzona"],
    related: ["futbol", "deportes", "fc-barcelona", "atletico-madrid", "madrid", "espana"],
    intro:
      "La sala blanca del Bernabéu: Champions, fichajes galácticos y debate sin tregua.",
    about:
      "Aquí se vive cada noche europea como una final. Los quince Champions, la Quinta del Buitre, Raúl, Zidane, Cristiano y ahora la era Mbappé alimentan discusiones que no acaban nunca. Se repasa el tridente, las decisiones de Ancelotti y el VAR de turno. La rivalidad con el Barça en el Clásico y el pique con el Atleti en los derbis marcan el pulso. Madridismo de Estambul a Lisboa, con el Santiago Bernabéu remodelado de fondo.",
  },
  {
    slug: "fc-barcelona",
    name: "FC Barcelona",
    kind: "tematica",
    icon: "🔵",
    users: 338,
    votes: 529,
    tag: "Popular",
    activity: "Alta",
    channels: ["fc-barcelona", "futbol", "deportes", "chatzona"],
    related: ["futbol", "deportes", "real-madrid", "atletico-madrid", "barcelona", "espana"],
    intro:
      "Culés de todo el mundo: Más que un club, La Masia y el tiki-taka en estado puro.",
    about:
      "El espíritu de Cruyff y Guardiola sigue mandando en esta sala. Se recuerda el sextete de 2009, la magia de Messi, Xavi e Iniesta, y se discute el presente de La Masia con Lamine Yamal y Pedri tirando del carro. La deuda, los fichajes y el regreso al Camp Nou remodelado dan para horas. El Clásico contra el Madrid enciende todo, y el orgullo blaugrana del “més que un club” no se negocia jamás.",
  },
  {
    slug: "atletico-madrid",
    name: "Atlético de Madrid",
    kind: "tematica",
    icon: "🔴",
    users: 296,
    votes: 458,
    activity: "Alta",
    channels: ["atletico-madrid", "futbol", "deportes", "chatzona"],
    related: ["futbol", "deportes", "real-madrid", "fc-barcelona", "madrid", "espana"],
    intro:
      "El Metropolitano ruge: coraje, corazón y el Cholismo como religión rojiblanca.",
    about:
      "Sentimiento colchonero del bueno: sufrir, pelear y no rendirse jamás. Se rememoran las Ligas de Simeone, las dos finales de Champions perdidas ante el Madrid que aún escuecen, y leyendas como Aragonés, el Niño Torres y Koke. La afición del fondo sur, el “partido a partido” y el pique eterno con el vecino blanco mandan en los debates. El Cívitas Metropolitano es la nueva fortaleza desde que dejaron el Calderón.",
  },
  {
    slug: "boca-juniors",
    name: "Boca Juniors",
    kind: "tematica",
    icon: "💙",
    users: 314,
    votes: 502,
    tag: "Popular",
    activity: "Alta",
    channels: ["boca-juniors", "futbol", "deportes", "chatzona"],
    related: ["futbol", "deportes", "river-plate", "america-mexico", "argentina", "espana"],
    intro:
      "La Bombonera no tiembla, late. Sala xeneize para hinchas de la mitad más uno.",
    about:
      "La pasión de La Boca no se explica, se siente. Se habla de las Libertadores ganadas, del Diego idolatrado, de Riquelme tocando de memoria y de Palermo metiéndolas todas. La Bombonera llena un domingo es tema obligado, igual que el Superclásico contra River, que paraliza Argentina. El folclore de La Doce, los refuerzos y la pelea por la próxima Copa mantienen la sala caliente. Boca es sentimiento de barrio, mística y aguante.",
  },
  {
    slug: "river-plate",
    name: "River Plate",
    kind: "tematica",
    icon: "🔴",
    users: 301,
    votes: 471,
    activity: "Alta",
    channels: ["river-plate", "futbol", "deportes", "chatzona"],
    related: ["futbol", "deportes", "boca-juniors", "america-mexico", "argentina", "espana"],
    intro:
      "El Monumental manda: la Banda, Gallardo y la final de Madrid que nunca se olvida.",
    about:
      "Orgullo millonario desde Núñez. Se revive la Libertadores de 2018 ganada a Boca en el Bernabéu, gloria eterna para el hincha de River. La era Gallardo, con su récord de títulos, sigue siendo medida de todo, junto a leyendas como Francescoli y Labruna. El Monumental remodelado, el jugar bien como bandera y el Superclásico que define honores llenan la sala. La Banda no negocia la camiseta ni el estilo ofensivo de la casa.",
  },
  {
    slug: "america-mexico",
    name: "Club América",
    kind: "tematica",
    icon: "🦅",
    users: 287,
    votes: 444,
    activity: "Alta",
    channels: ["america-mexico", "futbol", "deportes", "chatzona"],
    related: ["futbol", "deportes", "boca-juniors", "river-plate", "mexico", "espana"],
    intro:
      "Las Águilas del Azteca: el equipo más ganador de México y el más odiado también.",
    about:
      "Aguilas hasta la muerte. La sala reúne a los del Nido del Azteca para celebrar los récords de Liga MX y los tricampeonatos recientes que reavivan la grandeza americanista. Se recuerda a Cuauhtémoc Blanco, Zague y los refuerzos estrella que siempre llegan. El Clásico Nacional contra Chivas y el Clásico Capitalino frente a Pumas calientan cada jornada. Ser del América es bancar al más odiado y al más ganador, sin pedir perdón a nadie.",
  },
  {
    slug: "formula-1",
    name: "Fórmula 1",
    kind: "tematica",
    icon: "🏎️",
    users: 324,
    votes: 518,
    tag: "Popular",
    activity: "Alta",
    channels: ["formula1", "deportes", "chatzona"],
    related: ["deportes", "tecnologia", "real-madrid", "espana", "mexico", "argentina"],
    intro:
      "Lights out: la parrilla, las estrategias a vuelta rápida y el duelo por el Mundial.",
    about:
      "Adrenalina de domingo a 300 por hora. Se analiza cada Gran Premio vuelta a vuelta: estrategias de neumáticos, paradas en boxes, salidas en mojado y polémicas de comisarios. La era Verstappen-Red Bull, el legado de Hamilton y Alonso peleando con Aston Martin dan tema de sobra para el aficionado hispano. Monza, Mónaco y el regreso de circuitos míticos encienden la sala. Aquí se discute pole, undercut y campeonato como si cada décima valiera oro.",
  },

  // ──────────────────── Esoterismo ────────────────────
  {
    slug: "esoterismo",
    name: "Esoterismo",
    kind: "tematica",
    icon: "🌙",
    users: 175,
    votes: 270,
    activity: "Media",
    channels: ["esoterismo", "tarot", "chatzona"],
    related: ["tarot", "videncia", "astrologia", "magia", "horoscopo", "filosofia"],
    intro:
      "Símbolos, rituales y saberes antiguos para quienes sienten curiosidad por lo oculto.",
    about:
      "En esta sala se cruzan personas que llevan años leyendo sobre tradiciones herméticas y recién llegados que solo sienten curiosidad. Se charla de péndulos, runas, numerología, sueños y limpiezas energéticas, casi siempre desde la experiencia personal más que desde el dogma. Hay debate sano entre quienes lo viven como espiritualidad y quienes lo miran con escepticismo, y nadie promete milagros: se comparten lecturas, libros recomendados y dudas sin que nadie te juzgue por preguntar lo que sea.",
  },
  {
    slug: "videncia",
    name: "Videncia",
    kind: "tematica",
    icon: "🔮",
    users: 160,
    votes: 250,
    activity: "Media",
    channels: ["videncia", "tarot", "esoterismo", "chatzona"],
    related: ["tarot", "esoterismo", "horoscopo", "astrologia", "amor", "madrid"],
    intro:
      "Conversaciones sobre intuición, presentimientos y tiradas para quienes buscan otra mirada.",
    about:
      "Aquí se habla de intuición, corazonadas y esas sensaciones difíciles de explicar que muchos han tenido alguna vez. La gente comparte tiradas de cartas, interpretaciones de sueños y consultas sobre el amor o el trabajo, siempre como apoyo para reflexionar, no como verdad cerrada. Conviven creyentes convencidos, curiosos y escépticos que disfrutan del tema sin tomárselo todo al pie de la letra. Es un espacio para charlar con calma, contrastar puntos de vista y desahogarse cuando uno anda buscando respuestas.",
  },
  {
    slug: "astrologia",
    name: "Astrología",
    kind: "tematica",
    icon: "♒",
    users: 190,
    votes: 295,
    activity: "Alta",
    channels: ["astrologia", "horoscopo", "esoterismo", "chatzona"],
    related: ["horoscopo", "tarot", "esoterismo", "videncia", "amor", "psicologia"],
    intro:
      "Cartas natales, tránsitos y compatibilidades entre signos para conversar sin prisa.",
    about:
      "La sala gira en torno a las cartas natales, los tránsitos y la eterna pregunta de qué signos pegan entre sí. Hay quien sabe calcular ascendentes y casas con soltura y quien apenas conoce su signo solar, y ambos caben perfectamente. Se comentan retrógrados, lunas nuevas y cómo encaja todo esto con el carácter de cada uno. El tono es relajado y algo autocrítico: muchos lo usan más para conocerse y reírse de los tópicos de cada signo que para predecir el futuro.",
  },
  {
    slug: "magia",
    name: "Magia",
    kind: "tematica",
    icon: "✨",
    users: 145,
    votes: 225,
    activity: "Media",
    channels: ["magia", "esoterismo", "chatzona"],
    related: ["esoterismo", "tarot", "videncia", "astrologia", "filosofia", "barcelona"],
    intro:
      "Rituales, hechizos, velas y tradiciones mágicas explicadas desde la experiencia.",
    about:
      "Espacio para quienes sienten atracción por la magia en sus muchas formas: velas, hierbas, protección del hogar, fases lunares o tradiciones populares heredadas de las abuelas. Se comparten rituales sencillos, dudas sobre cómo empezar y experiencias personales, siempre con respeto y sin presumir de poderes. Hay practicantes de distintos caminos, curiosos y gente que solo busca entender de dónde vienen estas costumbres. Más que recetas mágicas, lo que circula son charlas honestas sobre intención, simbolismo y la cultura que rodea cada práctica.",
  },

  // ──────────────────── Cultura ────────────────────
  {
    slug: "cultura",
    name: "Cultura",
    kind: "tematica",
    icon: "🎭",
    users: 200,
    votes: 310,
    activity: "Alta",
    channels: ["cultura", "filosofia", "chatzona"],
    related: ["filosofia", "literatura", "historia", "cine", "debate", "espana"],
    intro:
      "Cine, arte, libros y tendencias: el rincón para hablar de todo lo que nos define.",
    about:
      "Un punto de encuentro para gente con inquietudes amplias: exposiciones que merecen la pena, series que dan que pensar, museos, música y esas tradiciones que cambian de un pueblo a otro. La conversación salta del arte clásico a lo más actual sin complejos, y siempre hay alguien dispuesto a recomendar algo nuevo. No hace falta ser experto en nada: aquí se valora la curiosidad por encima del título. Es habitual terminar con una lista de pelis, libros o planes apuntados para el fin de semana.",
  },
  {
    slug: "literatura",
    name: "Literatura",
    kind: "tematica",
    icon: "📚",
    users: 170,
    votes: 265,
    activity: "Media",
    channels: ["literatura", "cultura", "chatzona"],
    related: ["cultura", "filosofia", "historia", "cine", "debate", "psicologia"],
    intro:
      "Lecturas compartidas, autores favoritos y recomendaciones para devoradores de libros.",
    about:
      "Sala para lectores de todo tipo, desde quien devora novela negra hasta quien prefiere poesía o ensayo. Se comentan lecturas recientes, clásicos que siguen vigentes y esos libros que a uno le cambiaron algo por dentro. Hay recomendaciones constantes, debates sobre finales que dividieron a media sala y consejos para salir de un bache lector. Conviven aficionados a la fantasía, fans de los premios literarios y gente que escribe sus propias cosas. El ambiente es tranquilo, ideal para descubrir tu próxima lectura sin spoilers gratuitos.",
  },
  {
    slug: "debate",
    name: "Debate",
    kind: "tematica",
    icon: "💬",
    users: 185,
    votes: 285,
    activity: "Alta",
    channels: ["debate", "cultura", "chatzona"],
    related: ["cultura", "filosofia", "politica", "historia", "psicologia", "tecnologia"],
    intro:
      "Argumentos, ideas enfrentadas y respeto: aquí se discute para pensar, no para ganar.",
    about:
      "El sitio para quienes disfrutan poniendo ideas sobre la mesa y defendiéndolas con argumentos. Se tratan temas de actualidad, dilemas éticos, ciencia, sociedad y todo lo que admita más de un punto de vista. La norma no escrita es discrepar sin faltar: aquí se viene a entender al de enfrente, no a tener razón a toda costa. Hay gente muy formada y gente que solo quiere aprender escuchando, y de esa mezcla salen conversaciones largas que a menudo te hacen replantearte lo que dabas por seguro.",
  },
  {
    slug: "historia",
    name: "Historia",
    kind: "tematica",
    icon: "🏛️",
    users: 165,
    votes: 255,
    activity: "Media",
    channels: ["historia", "cultura", "chatzona"],
    related: ["cultura", "filosofia", "literatura", "debate", "politica", "espana"],
    intro:
      "Del mundo antiguo al siglo XX: curiosidades, batallas y vidas que marcaron una época.",
    about:
      "Rincón para apasionados del pasado, desde la Antigua Roma hasta la Guerra Fría. Se comparten curiosidades poco conocidas, recomendaciones de libros y documentales, y debates sobre cómo se cuenta la historia según quién la escriba. Conviven licenciados, divulgadores aficionados y curiosos que llegaron por una serie o un videojuego ambientado en otra época. Se habla de personajes, mitos que conviene desmontar y esos pequeños detalles cotidianos que hacían distinta la vida hace siglos. Ideal para resolver dudas y descubrir épocas que apenas te sonaban.",
  },

  // ──────────────────── Chueca · Gay · LGTBI ────────────────────
  {
    slug: "chueca",
    name: "Chueca",
    kind: "tematica",
    icon: "🏳️‍🌈",
    users: 284,
    votes: 451,
    tag: "Popular",
    activity: "Alta",
    channels: ["chueca", "gay", "lgtbi", "chatzona"],
    related: ["lgtbi", "gay", "gay-madrid", "amistad", "amor", "madrid"],
    intro:
      "El barrio madrileño hecho chat: orgullo, terraceo y gente con ganas de hablar.",
    about:
      "Chueca es el punto de encuentro online inspirado en el barrio más visible del Madrid LGTBI. Aquí se habla de fiestas, terrazas de la plaza, planes de fin de semana, locales de ambiente y, sobre todo, de gente. Entran chicos y chicas de toda España buscando charla relajada, hacer amistades o ligar sin postureo. Un espacio abierto y respetuoso donde el Orgullo dura todo el año y siempre hay alguien con quien compartir un café o una noche larga.",
  },
  {
    slug: "gay",
    name: "Gay",
    kind: "tematica",
    icon: "🌈",
    users: 296,
    votes: 472,
    tag: "Popular",
    activity: "Alta",
    channels: ["gay", "lgtbi", "chatzona"],
    related: ["lgtbi", "chueca", "bisexuales", "gay-madrid", "amistad", "ligar"],
    intro:
      "Chat gay sin etiquetas: conversación abierta, amistad y mucha química.",
    about:
      "Sala pensada para hombres que buscan hablar con naturalidad de su día a día, sus relaciones y sus ganas de conocer gente. Hay quien entra a hacer amigos, quien busca pareja y quien solo quiere reírse un rato después del trabajo. Se comparten planes por ciudades, recomendaciones de locales, series y experiencias personales en un ambiente cercano y sin juicios. Un lugar donde sentirte cómodo siendo quien eres y encontrar conversación de verdad a cualquier hora.",
  },
  {
    slug: "bisexuales",
    name: "Bisexuales",
    kind: "tematica",
    icon: "💗",
    users: 178,
    votes: 263,
    tag: "Tendencia",
    activity: "Media",
    channels: ["bisex", "lgtbi", "chatzona"],
    related: ["lgtbi", "gay", "lesbianas", "amor", "amistad", "ligar"],
    intro:
      "Espacio bi sin tener que explicarte: aquí la atracción no cabe en una casilla.",
    about:
      "Un chat para personas bisexuales y curiosas donde nadie te pide que elijas ni te cuestiona. Se charla con libertad sobre relaciones, descubrimiento personal, parejas abiertas y la vida cotidiana, además de planes para conocer gente afín. Conviven hombres y mujeres de distintas edades y ciudades que comparten dudas, vivencias y buen humor. Un ambiente comprensivo y abierto donde la bisexualidad se vive con orgullo y sin estereotipos, ideal para hacer amistades o encontrar algo más.",
  },
  {
    slug: "trans",
    name: "Trans",
    kind: "tematica",
    icon: "🏳️‍⚧️",
    users: 162,
    votes: 241,
    activity: "Media",
    channels: ["trans", "lgtbi", "chatzona"],
    related: ["lgtbi", "gay", "bisexuales", "amistad", "amor", "ligar"],
    intro:
      "Comunidad trans y aliada: hablar, acompañarse y conocer gente con respeto.",
    about:
      "Sala segura para personas trans, no binarias y quienes las acompañan. Aquí se comparten experiencias de transición, recursos, dudas y también muchas conversaciones cotidianas sobre trabajo, ocio o amor. La idea es sumar gente que escucha, sin morbo ni prejuicios, y que entiende lo que significa construir tu propia identidad. Entran personas de toda España y Latinoamérica buscando apoyo, amistad sincera o una relación. Un rincón cuidado donde sentirte vista, respetada y libre para ser tú.",
  },
  {
    slug: "gay-madrid",
    name: "Gay Madrid",
    kind: "tematica",
    icon: "🐻",
    users: 224,
    votes: 358,
    tag: "Popular",
    activity: "Alta",
    channels: ["gay", "chueca", "madrid", "chatzona"],
    related: ["gay", "chueca", "lgtbi", "madrid", "amistad", "ligar"],
    intro:
      "El ambiente gay de Madrid en una sala: planes, locales y gente de la ciudad.",
    about:
      "Punto de encuentro para chicos gais de Madrid y alrededores que quieren quedar, hacer amigos o ligar cerca de casa. Se habla de Chueca, terrazas, fiestas, gimnasios y los mejores planes de la capital, además de coordinar quedadas reales entre semana y fin de semana. Conviven veinteañeros, treintañeros y gente más madura, todos con ganas de conocer a alguien de su zona. Un chat local, vivo y cercano donde Madrid se siente mucho más pequeño y acogedor.",
  },
  {
    slug: "gay-barcelona",
    name: "Gay Barcelona",
    kind: "tematica",
    icon: "🌊",
    users: 211,
    votes: 339,
    tag: "Tendencia",
    activity: "Alta",
    channels: ["gay", "barcelona", "lgtbi", "chatzona"],
    related: ["gay", "lgtbi", "chueca", "barcelona", "amistad", "ligar"],
    intro:
      "Chat gay de Barcelona: del Gaixample a la playa, gente con ganas de quedar.",
    about:
      "Sala para la comunidad gay de Barcelona y su área metropolitana. Aquí se comparten planes por el Eixample, tardes de playa en la Barceloneta, fiestas, conciertos y rincones con encanto para una primera cita. Entran chicos de la ciudad y visitantes que buscan amistad, compañía o ligar mientras descubren el ambiente catalán. El tono es abierto, mediterráneo y relajado, perfecto para coordinar quedadas reales o simplemente charlar con alguien que conoce y vive Barcelona.",
  },

  // ──────────────────── LatinChat ────────────────────
  {
    slug: "latinos",
    name: "Latinos",
    kind: "tematica",
    icon: "🌎",
    users: 298,
    votes: 478,
    tag: "Popular",
    activity: "Alta",
    channels: ["latinos", "latinchat", "amistad", "chatzona"],
    related: ["latinas", "latinoamerica", "hispanos", "amistad", "amor", "musica"],
    intro:
      "El sabor latino en un solo chat: música, acentos y gente de todo el continente.",
    about:
      "El clásico chat latino donde se juntan personas de México, Colombia, Argentina, Perú, Venezuela y todo el continente, además de quienes viven fuera y echan de menos su tierra. Se habla de música, fútbol, comida, novelas y, sobre todo, se hacen amistades que cruzan fronteras. Hay flirteo, risas y largas charlas nocturnas con acentos de aquí y de allá. Un ambiente alegre y abierto, ideal para reconectar con tu cultura y conocer gente cálida de habla hispana.",
  },
  {
    slug: "latinas",
    name: "Latinas",
    kind: "tematica",
    icon: "💃",
    users: 256,
    votes: 412,
    tag: "Tendencia",
    activity: "Alta",
    channels: ["latinas", "latinos", "amistad", "chatzona"],
    related: ["latinos", "latinoamerica", "hispanos", "amistad", "amor", "musica"],
    intro:
      "Charla con mujeres latinas: conversación con carácter, calidez y buena vibra.",
    about:
      "Espacio donde las mujeres latinas llevan la voz cantante y donde se charla de todo con cercanía y respeto. Se comparten experiencias de vida, planes, música, cultura y también ganas de conocer gente nueva para amistad o algo más. Participan chicas de Latinoamérica y latinas que viven en España o Estados Unidos, junto a quienes disfrutan de su compañía y su acento. Un ambiente cuidado, divertido y cálido, sin faltas de respeto, donde siempre hay conversación interesante esperándote.",
  },
  {
    slug: "latinoamerica",
    name: "Latinoamérica",
    kind: "tematica",
    icon: "🌐",
    users: 232,
    votes: 367,
    activity: "Media",
    channels: ["latinoamerica", "latinos", "amistad", "chatzona"],
    related: ["latinos", "latinas", "hispanos", "amistad", "musica", "mexico"],
    intro:
      "Un puente entre países: de México a Argentina, todo el continente conversa.",
    about:
      "Sala que reúne a todo el continente en una misma conversación, desde México hasta la Patagonia. Aquí se intercambian costumbres, modismos, recetas, música y miradas sobre la actualidad de cada país, con el plus de descubrir cómo se vive a un par de fronteras de distancia. Entran personas que buscan amistad, debate sano o simplemente practicar el arte de la charla larga. Un punto de encuentro diverso y respetuoso donde se celebra la riqueza cultural latinoamericana y se tienden puentes entre naciones hermanas.",
  },
  {
    slug: "hispanos",
    name: "Hispanos",
    kind: "tematica",
    icon: "🗣️",
    users: 207,
    votes: 321,
    activity: "Media",
    channels: ["hispanos", "latinos", "amistad", "chatzona"],
    related: ["latinos", "latinoamerica", "espana", "estados-unidos", "amistad", "musica"],
    intro:
      "El español como casa común: gente hispana de ambos lados del Atlántico.",
    about:
      "Chat que une a la comunidad hispana de todo el mundo, especialmente a quienes viven en Estados Unidos, España y Latinoamérica y comparten el idioma como hogar. Se habla de la vida lejos del país de origen, oportunidades, cultura, música y los pequeños detalles que nos identifican como hispanohablantes. Es un lugar para hacer amistades, sentirse acompañado y mantener vivas las raíces estés donde estés. Ambiente cercano, plural y respetuoso, donde el español nos junta por encima de cualquier frontera.",
  },
];
