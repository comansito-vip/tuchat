import type { Place } from "./types";

// Estados mexicanos y venezolanos con demanda medida en el corpus de la red y
// canal IRC propio. El detalle del cruce, en
// docs/superpowers/specs/2026-08-11-regiones-americanas-design.md.
//
// Van aparte de TOPICS_REGIONES, que está acotado a las comunidades autónomas
// españolas y cuyo contrato incluye tener bandera real en /flags/regiones/.
// Aquí no hay flagSrc a propósito: no existen esas banderas dibujadas y una
// inventada se nota. El campo es opcional y el componente cae en el icono.
//
// Los estados cuya capital se llama igual (Puebla, Chihuahua, Querétaro,
// Veracruz, Aguascalientes, Durango, Colima, Oaxaca, Guanajuato) NO están:
// su sala de ciudad ya se lleva la consulta y una segunda competiría con ella.
export const TOPICS_REGIONES_AM: Place[] = [
  {
    slug: "nuevo-leon",
    name: "Nuevo León",
    kind: "tematica",
    icon: "🏔️",
    users: 210,
    votes: 305,
    tag: "Popular",
    activity: "Alta",
    parentName: "México",
    parentSlug: "mexico",
    channels: ["nuevo_leon", "mexico", "chatzona"],
    related: ["monterrey", "guadalupe-nuevo-leon", "mexico", "jalisco", "coahuila"],
    intro:
      "Monterrey al pie del Cerro de la Silla, el calor que no perdona y esa fama de directos que los regios llevan a mucha honra.",
    aboutTitle: "El asador, el Cerro de la Silla y el clásico regio",
    about:
      "Aquí se junta gente de Monterrey, de Guadalupe, de San Nicolás y de los municipios que se comieron la mancha urbana hasta volverla una sola ciudad. Se discute de carne asada con la seriedad con que en otros lados se discute de política: el corte, la leña, quién la pone y a quién no se le vuelve a confiar el asador. Rayados y Tigres parten la conversación por la mitad cada clásico regio, y el resto del año sirven de excusa. El calor de junio se lleva con humor negro y aire acondicionado, y en cuanto afloja alguien propone subir a Chipinque o meterse a la Huasteca. La fama de tacaños que les cuelgan desde el resto del país se responde con un chiste antes de que lo cuente el de fuera. Entra quien trabaja en la industria, estudiantes del Tec y de la UANL, y regios que emigraron y siguen sosteniendo que el cabrito solo sabe bien en casa.",
  },
  {
    slug: "jalisco",
    name: "Jalisco",
    kind: "tematica",
    icon: "🎺",
    users: 195,
    votes: 288,
    tag: "Popular",
    activity: "Alta",
    parentName: "México",
    parentSlug: "mexico",
    channels: ["jalisco", "mexico", "chatzona"],
    related: ["guadalajara", "zapopan", "puerto-vallarta", "tlaquepaque", "mexico"],
    intro:
      "Tequila, mariachi y charrería salieron de aquí antes de volverse postal de México: Jalisco entra al chat con Guadalajara al frente.",
    aboutTitle: "Donde el mariachi no es folclore, sino vecindario",
    about:
      "Guadalajara marca el paso, pero en esta sala también entran de Zapopan, Tlaquepaque, Tonalá y de los pueblos de Los Altos, que hablan cantadito y lo saben. Se defiende la torta ahogada con fe de converso, y con la birria de por medio la discusión sube de tono enseguida. Se pelea por si el mejor tequila sale del pueblo de Tequila, de Amatitán o de Arandas, sabiendo de antemano que cada quien jurará por el de su tierra. El mariachi y la charrería nacieron por acá y eso se recuerda seguido, sin demasiada modestia. Chivas y Atlas dividen la sala cada clásico tapatío. Hay quien se escapa a Chapala el fin de semana, quien vive de lo que deja Puerto Vallarta y quien lleva años en Guadalajara sin ser de allí y ya se le pegó el 'pos'. Tapatíos de nacimiento y de adopción, convencidos todos de que su ciudad es la mejor del país.",
  },
  {
    slug: "yucatan",
    name: "Yucatán",
    kind: "tematica",
    icon: "🌾",
    users: 160,
    votes: 240,
    activity: "Alta",
    parentName: "México",
    parentSlug: "mexico",
    channels: ["yucatan", "mexico", "chatzona"],
    related: ["merida-mexico", "mexico", "chiapas", "tabasco"],
    intro:
      "Mérida, los cenotes y una manera de hablar que se reconoce a la primera: Yucatán entra al chat con su maya de diario.",
    aboutTitle: "La península que se siente aparte, y lo dice",
    about:
      "La península se siente aparte del resto de México y en esta sala se nota: se dice 'lo bueno' a cada rato y se cuelan palabras mayas sin avisar, que quien no es de acá tarda en cazar. Meridanos, gente de Valladolid, de Progreso y de Tizimín discuten de cochinita los domingos y de si los papadzules se hacen bien o no se hacen. El calor de abril se sobrelleva decidiendo a qué cenote irse, que hay para escoger y cada quien defiende el suyo como si fuera secreto de familia. Chichén Itzá y Uxmal salen cuando entra alguien de fuera preguntando qué ver, y siempre hay quien responde que mejor vaya a uno menos concurrido. La trova suena las noches de Santa Lucía. Se presume, con razón, de ser de los lugares más tranquilos del país, y de que aquí la gente todavía saluda al entrar.",
  },
  {
    slug: "sonora",
    name: "Sonora",
    kind: "tematica",
    icon: "🌵",
    users: 145,
    votes: 215,
    activity: "Media",
    parentName: "México",
    parentSlug: "mexico",
    channels: ["sonora", "mexico", "chatzona"],
    related: ["hermosillo", "ciudad-obregon", "mexico", "sinaloa"],
    intro:
      "Desierto, tortillas sobaqueras y una carne asada que no admite discusión: Sonora entra al chat con 45 grados a la sombra.",
    aboutTitle: "Cuarenta y cinco grados y liga del Pacífico",
    about:
      "El calor aquí no es tema de conversación sino forma de vida: en Hermosillo el día se organiza alrededor de la hora a la que se puede salir, y en junio eso no se discute. Entran de Ciudad Obregón, de Navojoa, de Guaymas y de Nogales, con esa mezcla de norteño y frontera que suena distinta al resto del país. La carne asada no se negocia y la tortilla de harina sobaquera tampoco: quien llegue defendiendo la de maíz que se vaya preparando. Se habla de Naranjeros y Yaquis en cuanto arranca la liga del Pacífico, que por acá se vive con más devoción que el fútbol. Puerto Peñasco sale cada vez que alguien menciona vacaciones, y el mar de Cortés se defiende frente a cualquier playa del Caribe. Hay orgullo yaqui y seri en la sala, y sonorenses en Phoenix o Tucson que se asoman para no perder el hilo de casa.",
  },
  {
    slug: "coahuila",
    name: "Coahuila",
    kind: "tematica",
    icon: "🦖",
    users: 130,
    votes: 195,
    activity: "Media",
    parentName: "México",
    parentSlug: "mexico",
    channels: ["coahuila", "mexico", "chatzona"],
    related: ["saltillo", "torreon", "monterrey", "mexico", "nuevo-leon"],
    intro:
      "Saltillo, Torreón y el desierto en medio: Coahuila entra al chat con su sarape, su vino de Parras y dinosaurios de verdad.",
    aboutTitle: "Sarape, vino de 1597 y desierto con fósiles",
    about:
      "Coahuila es grande y en la sala se nota: los de Saltillo y los de Torreón no se parecen tanto, y La Laguna hace vida propia a caballo entre dos estados. Se presume del sarape saltillense, del pan de pulque y de que en Parras sigue en pie Casa Madero, fundada en 1597 y la vinícola más antigua de América, cosa que se recuerda cada vez que alguien habla del vino mexicano como si fuera invento reciente. El desierto se defiende de quien lo llama vacío: están las pozas de Cuatro Ciénegas y fósiles suficientes para llenar el Museo del Desierto, que es de los buenos del país. El Santos junta a los de Torreón cada jornada. Aprieta el calor en verano y las noches de invierno bajan de cero, que es de las pocas cosas en que todo el estado coincide. Entra gente de Monclova, de Piedras Negras y de Acuña, con la frontera a la vista.",
  },
  {
    slug: "sinaloa",
    name: "Sinaloa",
    kind: "tematica",
    icon: "🥁",
    users: 120,
    votes: 178,
    activity: "Media",
    parentName: "México",
    parentSlug: "mexico",
    channels: ["sinaloa", "mexico", "chatzona"],
    related: ["culiacan", "mazatlan", "mexico", "sonora"],
    intro:
      "Mazatlán con su malecón y su carnaval, Culiacán con su calor: Sinaloa entra al chat con la tambora sonando de fondo.",
    aboutTitle: "La tambora no se pide, se impone",
    about:
      "En esta sala se junta la gente de Culiacán con la de Mazatlán, que es como juntar dos formas distintas de ser sinaloense: la capital trabaja y el puerto presume de playa. El carnaval de Mazatlán aparece cada febrero y se defiende como uno de los más antiguos y multitudinarios de México, con la seguridad de quien no piensa entrar a discutirlo. La banda suena acá de otra manera, porque la tambora no se pide, se impone, y hay quien la defiende contra el mundo entero. El aguachile se come picoso y a quien lo pida suave le caen burlas amables. Se habla más de béisbol que de fútbol: Tomateros y Venados parten la sala en temporada. El estado le da de comer a medio país con su tomate y su maíz, y eso se dice con orgullo en cuanto alguien reduce Sinaloa a lo de siempre.",
  },
  {
    slug: "zulia",
    name: "Zulia",
    kind: "tematica",
    icon: "⚡",
    users: 115,
    votes: 170,
    activity: "Media",
    parentName: "Venezuela",
    parentSlug: "venezuela",
    channels: ["zulia", "venezuela", "chatzona"],
    related: ["maracaibo", "cabimas", "venezuela", "carabobo"],
    intro:
      "Maracaibo, el lago, el puente y un calor que los maracuchos llevan con orgullo: Zulia entra al chat hablando de vos.",
    aboutTitle: "El lago, la gaita y el voseo maracucho",
    about:
      "Acá se habla distinto y se sabe: el voseo maracucho se oye a leguas y en esta sala nadie lo disimula. Entran de Maracaibo, de Cabimas, de Ciudad Ojeda y de toda la Costa Oriental del Lago, con ese volumen que en el resto de Venezuela les critican y que aquí se defiende como carácter. El calor de Maracaibo es tema recurrente y chiste fijo, y se mide en si se puede o no salir al mediodía. El puente sobre el lago sale en cuanto alguien nombra la ciudad, y el relámpago del Catatumbo, que descarga sobre el sur del lago casi todas las noches del año, se le cuenta a los de fuera como quien enseña algo propio. En diciembre la gaita se apodera de todo y no hay conversación que se salve. El patacón se defiende frente a cualquier arepa. Hay zulianos por medio mundo asomándose a la sala para oír a los suyos.",
  },
  {
    slug: "chiapas",
    name: "Chiapas",
    kind: "tematica",
    icon: "☕",
    users: 105,
    votes: 158,
    activity: "Media",
    parentName: "México",
    parentSlug: "mexico",
    channels: ["chiapas", "mexico", "chatzona"],
    related: ["tuxtla-gutierrez", "tapachula", "mexico", "yucatan", "tabasco"],
    intro:
      "Tuxtla, San Cristóbal y el Cañón del Sumidero: Chiapas entra al chat con su café, sus lenguas propias y la selva a mano.",
    aboutTitle: "Tuxtla hierve, San Cristóbal se abriga",
    about:
      "Chiapas cabe mal en una sola conversación: Tuxtla Gutiérrez es calor y ciudad, y San Cristóbal de las Casas es frío, niebla y otra manera de andar por la calle. En esta sala coinciden los dos, más los de Tapachula, que están tan cerca de Guatemala que cruzar la frontera no tiene ninguna épica. Se hablan tzotzil y tzeltal en buena parte del estado y aquí se cuela alguna palabra sin traducir. El café chiapaneco se defiende contra el de donde sea, y a quien lo tome con azúcar le cae algún comentario. El Cañón del Sumidero sale cada vez que entra alguien de fuera, y Palenque también, aunque los de acá recomiendan Yaxchilán o Bonampak para librarse de las excursiones. Agua Azul y El Chiflón para el calor. Hay orgullo de tierra y algo de recelo con quien habla del estado sin haber pisado más que el aeropuerto.",
  },
  {
    slug: "carabobo",
    name: "Carabobo",
    kind: "tematica",
    icon: "⚓",
    users: 95,
    votes: 142,
    activity: "Baja",
    parentName: "Venezuela",
    parentSlug: "venezuela",
    channels: ["carabobo", "venezuela", "chatzona"],
    related: ["valencia-venezuela", "puerto-cabello", "venezuela", "zulia"],
    intro:
      "Valencia con su industria y Puerto Cabello con su puerto: Carabobo entra al chat donde se selló la independencia.",
    aboutTitle: "El puerto, la industria y el campo de 1821",
    about:
      "Valencia manda en la sala por tamaño, pero Puerto Cabello se hace notar: el puerto más importante del país tiene su gente y su propio acento. Se habla de la industria que hizo grande a Valencia y de lo que ha quedado de ella, que es conversación seria y con opiniones encontradas. El Campo de Carabobo sale cada 24 de junio y no como dato de libro: allí se libró en 1821 la batalla que aseguró la independencia de Venezuela, y eso pesa en el orgullo local más de lo que un forastero supone. El Carabobo FC junta a los que siguen fútbol y el resto se pasa al béisbol sin remordimiento. Patanemo y Quizandal aparecen cada fin de semana, y el Parque Nacional San Esteban para quien prefiere monte a playa. Hay carabobeños fuera del país preguntando cómo está aquello y quien se quedó y lo cuenta sin adornos.",
  },
  {
    slug: "tabasco",
    name: "Tabasco",
    kind: "tematica",
    icon: "🍫",
    users: 85,
    votes: 128,
    activity: "Baja",
    parentName: "México",
    parentSlug: "mexico",
    channels: ["tabasco", "mexico", "chatzona"],
    related: ["villahermosa", "mexico", "chiapas", "yucatan"],
    intro:
      "Villahermosa, los ríos y un calor húmedo que no da tregua: Tabasco entra al chat donde el cacao lleva milenios.",
    aboutTitle: "Tierra de cacao, ríos y calor sin tregua",
    about:
      "En Tabasco llueve de verdad y hace un calor húmedo que los de fuera no aguantan, y eso se cuenta en la sala con cierto gusto. Villahermosa concentra a casi todos, pero también entran de Cárdenas, de Comalcalco y de Tenosique, con el Grijalva y el Usumacinta atravesándolo todo. El cacao es el orgullo mayor: se cultiva por acá desde hace milenios y en Comalcalco quedan haciendas que lo siguen trabajando, así que cuando alguien saca el chocolate suizo la sala responde. El pejelagarto asado se defiende ante quien pone cara al verlo servido. Los olmecas dejaron las cabezas colosales que hoy se ven en el parque La Venta, y salen cada vez que se discute quién llegó primero a Mesoamérica. Se habla de pesca, de inundaciones cuando toca, y de los Olmecas en temporada de béisbol.",
  },
];
