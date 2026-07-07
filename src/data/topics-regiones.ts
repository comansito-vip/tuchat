import type { Place } from "./types";

// Comunidades autónomas españolas: canales IRC reales con tráfico propio
// (andalucia, galicia, asturias, canarias, cataluña, castilla, extremadura,
// navarra, aragon, baleares, vizcaya/guipuzcoa/euskadi, cantabria) sin sala
// dedicada hasta ahora — identidad regional distinta a la de su ciudad capital.
export const TOPICS_REGIONES: Place[] = [
  {
    slug: "andalucia",
    name: "Andalucía",
    kind: "tematica",
    icon: "🪭",
    users: 240,
    votes: 350,
    tag: "Popular",
    activity: "Alta",
    channels: ["andalucia", "amistad", "chatzona"],
    related: ["sevilla", "malaga", "granada", "cordoba", "cadiz", "musica"],
    intro:
      "Ocho provincias y un acento que se reconoce al primer 'illo': Andalucía entra al chat con flamenco, feria y esa gracia que no se enseña en ningún sitio.",
    about:
      "Sevilla, Málaga, Granada, Córdoba, Cádiz, Almería, Huelva y Jaén caben en esta sala aunque cada una jure que la suya es la de verdad. Se discute con pasión de ferias de abril, de si el mejor pescaíto frito sale en Cádiz o en Huelva, y de flamenco con el mismo fervor que de fútbol entre béticos y sevillistas. El acento cambia de una provincia a otra pero la gracia y la retranca son las mismas: aquí nadie se toma nada demasiado en serio, ni siquiera el calor de julio que aprieta de Écija a Almería. Entran andaluces de fuera que llevan la tierra hasta en el nombre de usuario, gente que defiende su pueblo frente a la capital de provincia y quien simplemente quiere reírse un rato con acento cantado. Salero, cachondeo y ese orgullo que se nota en cuanto alguien dice 'illo'.",
  },
  {
    slug: "galicia",
    name: "Galicia",
    kind: "tematica",
    icon: "🌊",
    users: 158,
    votes: 232,
    activity: "Media",
    channels: ["galicia", "amistad", "chatzona"],
    related: ["a-coruna", "vigo", "lugo", "pontevedra", "viajes", "musica"],
    intro:
      "Rías, morriña y un gallego que se cuela entre frase y frase: Galicia entra al chat con su lluvia fina y su humor de retranca.",
    about:
      "La morriña no se traduce bien a otros idiomas, y quien es de Galicia lo sabe apenas se aleja de las rías. Aquí se cruzan coruñeses, vigueses, lucenses, ourensanos y pontevedreses discutiendo con cariño sobre cuál pulpo á feira es el mejor y si el gallego se habla más cerrado en el interior o en la costa. La gaita suena en las fiestas patronales de cualquier pueblo, el marisco se defiende como seña de identidad y la lluvia constante se lleva con humor, no con queja. Hay quien emigró a Madrid, Barcelona o Latinoamérica y sigue asomándose a esta sala para no perder el acento, y quien nunca se fue y presume de vivir donde otros solo van de vacaciones. Retranca fina, cariño discreto y esa manera gallega de responder a una pregunta con otra pregunta.",
  },
  {
    slug: "asturias",
    name: "Asturias",
    kind: "tematica",
    icon: "🍏",
    users: 109,
    votes: 160,
    activity: "Media",
    channels: ["asturias", "amistad", "chatzona"],
    related: ["oviedo", "gijon", "viajes", "naturaleza", "musica"],
    intro:
      "\"Asturias, patria querida\": sidra escanciada, Picos de Europa de fondo y un orgullo regional que no necesita explicar por qué canta ese himno con lágrimas.",
    about:
      "Aquí la sidra no se bebe, se escancia, y quien no sabe tirarla desde arriba se gana la broma de toda la sala. Se discute con cariño la rivalidad entre Oviedo y Gijón, se presumen los Picos de Europa y la Ruta del Cares como si fueran patio trasero, y se defiende el asturiano —o bable— frente a quien lo confunde con un acento más del castellano. El paraíso natural que anuncian los carteles de carretera no es solo turismo: aquí se vive entre verde, niebla y mar Cantábrico todo el año, con una gastronomía de fabada y cachopo que no pide perdón por ser contundente. Entran asturianos de la cuenca minera, de la costa y de quienes se fueron a currar fuera pero cantan el himno regional con el mismo nudo en la garganta. Orgullo tranquilo, hospitalidad de sidrería y ese 'ye lo que hay' que lo resume todo.",
  },
  {
    slug: "canarias",
    name: "Canarias",
    kind: "tematica",
    icon: "🌴",
    users: 110,
    votes: 162,
    activity: "Media",
    channels: ["canarias", "amistad", "chatzona"],
    related: ["las-palmas", "tenerife", "viajes", "playas", "musica"],
    intro:
      "Ocho islas, una hora menos que la península y un acento que suena más a Caribe que a Madrid: Canarias entra al chat con su calma isleña.",
    about:
      "Vivir con una hora de diferencia respecto a la península moldea el carácter: aquí no se corre, y quien llega de fuera lo nota enseguida. Tinerfeños y grancanarios mantienen su rivalidad de toda la vida —hasta para elegir qué isla tiene mejor playa o mejor carnaval— mientras palmeros, majoreros, conejeros y herreños recuerdan que el archipiélago tiene ocho islas, no dos. El clima de eterna primavera, los volcanes del Teide y Timanfaya, y un acento que arrastra la ese como en el Caribe hacen que muchos peninsulares tarden en ubicar de dónde es cada uno. El plátano de Canarias se defiende como el único de verdad, el gofio aparece en cualquier conversación de comida, y las papas arrugadas con mojo son ley. En esta sala se juntan isleños de las ocho islas, emigrantes que volvieron y gente que sueña con mudarse al archipiélago para siempre. Calma canaria, cachondeo suave y ese 'qué lento vas' que aquí es un cumplido.",
  },
  {
    slug: "cataluna",
    name: "Cataluña",
    kind: "tematica",
    icon: "🎨",
    users: 80,
    votes: 118,
    activity: "Media",
    channels: ["cataluna", "cataluña", "amistad", "chatzona"],
    related: ["barcelona", "girona", "tarragona", "lleida", "cultura", "musica"],
    intro:
      "Barcelona, Girona, Tarragona y Lleida en una sola sala: Cataluña entra al chat con modernisme, castellers y bilingüismo de nacimiento.",
    about:
      "El catalán y el castellano se mezclan en la misma frase sin que nadie lo note, y esta sala funciona igual: se habla en los dos idiomas según a quién le toque escribir. Se discuten los castells que se levantan en cada Festa Major, la arquitectura de Gaudí que ya forma parte del paisaje mental de cualquier catalán, y el Barça con la misma intensidad en Lleida que en el Camp Nou. Girona presume su casco antiguo medieval, Tarragona sus ruinas romanas y Lleida su interior agrícola menos fotografiado pero igual de propio. El Sant Jordi de abril, con su rosa y su libro, se vive como fiesta mayor del calendario sentimental catalán. Aquí entran catalanes de las cuatro provincias, catalanohablantes de fuera de Cataluña y gente que solo quiere entender mejor una cultura que se explica mal desde fuera. Conversación directa, orgullo de identidad propia y ganas de que se hable de Cataluña sin que sea siempre por política.",
  },
  {
    slug: "castilla",
    name: "Castilla",
    kind: "tematica",
    icon: "🌾",
    users: 54,
    votes: 78,
    activity: "Baja",
    channels: ["castilla", "amistad", "chatzona"],
    related: ["valladolid", "burgos", "salamanca", "toledo", "historia", "viajes"],
    intro:
      "La meseta de los campos de Antonio Machado, castillos en cada cerro y un castellano que aquí se presume el más limpio de España: Castilla entra al chat.",
    about:
      "\"Estos campos de Castilla\" que escribió Machado se ven todavía iguales desde la ventanilla de cualquier tren que cruce la meseta: trigo hasta el horizonte, algún castillo en lo alto de un cerro y pueblos que se vacían de gente joven cada año un poco más. Aquí se reúnen castellanos y leoneses de Valladolid, Burgos, Salamanca, León, Palencia, Soria, Ávila y Zamora junto a los de Castilla-La Mancha —Toledo, Ciudad Real, Cuenca, Guadalajara y Albacete—, con el eterno debate de fondo sobre dónde empieza una Castilla y termina la otra. El castellano que se habla aquí se presume, con razón o sin ella, el más neutro y limpio de toda España, sin acento marcado que lo delate. El frío seco de invierno y el calor también seco de agosto son parte de la identidad, igual que el vino de Ribera o de La Mancha, el lechazo y el cordero asado. Trato serio a la primera, generoso después, con ese silencio de meseta que no es frialdad sino calma.",
  },
  {
    slug: "extremadura",
    name: "Extremadura",
    kind: "tematica",
    icon: "🦅",
    users: 26,
    votes: 38,
    activity: "Baja",
    channels: ["extremadura", "amistad", "chatzona"],
    related: ["badajoz", "caceres", "cocina", "naturaleza", "viajes"],
    intro:
      "Dehesas con encinas centenarias, jamón ibérico de bellota y un cielo tan limpio que la UNESCO lo declaró reserva starlight: Extremadura entra al chat.",
    about:
      "Extremadura tiene más dehesa que casi cualquier otra región de España, y de ahí sale el jamón ibérico de bellota que aquí se defiende como el mejor del país sin necesidad de discutirlo con nadie. Cáceres y Badajoz se disputan el protagonismo de la comunidad con el mismo cariño con el que comparten el orgullo de sus cascos históricos patrimonio de la Humanidad. El Parque Nacional de Monfragüe, refugio de buitres negros y águilas imperiales, y las noches sin contaminación lumínica de la Reserva Starlight de Extremadura son motivo de orgullo tranquilo, no de postureo turístico. La torta del Casar, el queso de La Serena y la caldereta de cordero se comen despacio, igual que se vive aquí: sin prisa, con calor de verano que aprieta de verdad y con una despoblación que duele pero no apaga las ganas de quedarse. En esta sala se juntan extremeños de dentro, emigrados que vuelven en vacaciones y gente que descubrió la región tarde y ya no la suelta. Trato campechano, orgullo silencioso y ese cariño por la tierra que no necesita gritarse.",
  },
  {
    slug: "navarra",
    name: "Navarra",
    kind: "tematica",
    icon: "🐂",
    users: 23,
    votes: 34,
    activity: "Baja",
    channels: ["navarra", "amistad", "chatzona"],
    related: ["pamplona", "viajes", "musica", "cultura", "esoterismo"],
    intro:
      "San Fermín, encierros y un Pirineo que se vuelve valle verde hacia el norte: Navarra entra al chat con su doble cara, taurina y montañera.",
    about:
      "San Fermín es la postal que todo el mundo conoce, con el encierro corriendo delante de los toros por la Estafeta cada julio, pero Navarra es mucho más que esa semana de julio. Al norte, los valles pirenaicos como Roncal, Salazar o Baztán guardan pueblos de piedra y una tradición ganadera que poco tiene que ver con la Ribera del sur, más seca y vinícola, donde el Camino de Santiago cruza Puente la Reina antes de seguir hacia La Rioja. El euskera se habla en algunas zonas del norte y prácticamente nada en el sur, una diversidad interna que los propios navarros discuten con gusto. El pacharán, licor de endrinas casi oficial de la región, y las verduras de la huerta —espárragos, alcachofas, pimientos del piquillo— se defienden con el mismo orgullo que el encierro. En esta sala se cruzan pamploneses, gente de los valles del norte y ribereños del sur, todos navarros pero con acentos y costumbres que cambian según se suba o baje el mapa. Carácter fuerte, fiesta cuando toca y trabajo serio el resto del año.",
  },
  {
    slug: "aragon",
    name: "Aragón",
    kind: "tematica",
    icon: "🥁",
    users: 21,
    votes: 30,
    activity: "Baja",
    channels: ["aragon", "amistad", "chatzona"],
    related: ["zaragoza", "huesca", "teruel", "viajes", "historia"],
    intro:
      "\"Ya estamos otra vez con los tambores de Semana Santa\": Aragón entra al chat con el Pilar, el Pirineo oscense y la despoblación de Teruel de fondo.",
    about:
      "El Pilar de Zaragoza reúne cada octubre a toda la comunidad en torno a las ofrendas de flores, pero Aragón se extiende mucho más allá de la capital: Huesca guarda el Pirineo con estaciones de esquí y valles como Ordesa que dejan sin palabras a quien los pisa por primera vez, y Teruel carga con el peso simbólico de la España vaciada, hasta el punto de que 'Teruel existe' se volvió lema de protesta nacional. La Semana Santa aragonesa se vive a golpe de tambor y bombo, con rompidas de la hora que dejan los brazos molidos y el oído zumbando durante días. El jamón de Teruel, el ternasco asado y los caracoles a la aragonesa se defienden con el mismo carácter recio que tiene fama de tener el aragonés medio: gente de pocas palabras pero de palabra firme. En esta sala se juntan zaragozanos, oscenses del Pirineo y turolenses orgullosos de una tierra que se despuebla pero no se rinde. Carácter fuerte, jota de fondo y ese 'de eso ni hablamos' cuando algo ya está decidido.",
  },
  {
    slug: "baleares",
    name: "Baleares",
    kind: "tematica",
    icon: "🐚",
    users: 27,
    votes: 40,
    activity: "Baja",
    channels: ["baleares", "amistad", "chatzona"],
    related: ["palma", "viajes", "playas", "musica"],
    intro:
      "Mallorca, Menorca, Ibiza y Formentera en un mismo chat: Baleares entra con calas turquesa, mallorquín cerrado y la eterna rivalidad entre islas.",
    about:
      "Cada isla del archipiélago balear jura tener las mejores calas, y esta sala es el punto donde mallorquines, menorquines, ibicencos y formenterenses discuten esa rivalidad con más cariño que enfado. El catalán que se habla aquí tiene variantes propias en cada isla —el mallorquín, el menorquín, el eivissenc— que un catalanoparlante de Barcelona reconoce pero no siempre entiende del todo. Mallorca carga con la fama turística de masas en Platja de Palma, pero el interior de la isla, con pueblos como Valldemossa o Deià, guarda una calma que poco tiene que ver con esa imagen. Menorca presume su Camí de Cavalls y su Biosfera declarada por la UNESCO, mientras Ibiza vive entre el clubbing internacional y un lado rural, hippy desde los sesenta, que muchos turistas ni conocen. La ensaimada, la sobrasada y el vino de Binissalem se comparten sin importar de qué isla venga cada uno. Trato isleño, orgullo de identidad propia frente a la península y esa calma de quien vive rodeado de mar todo el año.",
  },
  {
    slug: "euskadi",
    name: "País Vasco",
    kind: "tematica",
    icon: "🧢",
    users: 45,
    votes: 66,
    activity: "Media",
    channels: ["euskadi", "vizcaya", "guipuzcoa", "euskaraz", "amistad", "chatzona"],
    related: ["bilbao", "san-sebastian", "vitoria", "cocina", "musica"],
    intro:
      "Pintxos de barra, euskera que resiste generación tras generación y tres provincias que se pican entre sí: el País Vasco entra al chat.",
    about:
      "Bilbao, San Sebastián y Vitoria son las tres capitales de un territorio pequeño pero con una identidad que se nota en cuanto alguien pide un pintxo en vez de una tapa. El euskera, uno de los idiomas más antiguos de Europa y sin parientes conocidos en ninguna otra lengua, se enseña en la ikastola desde niños y aquí se mezcla con el castellano sin que nadie lo traduzca. La Parte Vieja donostiarra y sus barras de pintxos, el Botxo bilbaíno con el Guggenheim ya integrado en el paisaje, y Vitoria con su casco medieval y su Almendra Medieval completan un triángulo que cualquier vasco defiende con orgullo tranquilo. La gastronomía se toma en serio de verdad: txuletón, marmitako, bacalao al pil-pil, y sociedades gastronómicas donde cocinar entre amigos es casi ritual. Entran bilbaínos, donostiarras, alaveses y vascos de fuera del territorio histórico que no quieren perder la lengua ni la costumbre. Carácter directo, sin rodeos, y un cariño por lo propio que no necesita explicarse a quien no es de aquí.",
  },
  {
    slug: "cantabria",
    name: "Cantabria",
    kind: "tematica",
    icon: "🐄",
    users: 28,
    votes: 41,
    activity: "Baja",
    channels: ["cantabria", "amistad", "chatzona"],
    related: ["santander", "viajes", "naturaleza", "playas"],
    intro:
      "Mar Cantábrico a un lado, Picos de Europa al otro y un verde que no se apaga ni en agosto: Cantabria entra al chat con calma norteña.",
    about:
      "Cantabria cabe entera en un mapa pequeño pero mete dentro playa, montaña y ciudad sin que nadie tenga que viajar mucho para encontrar las tres cosas el mismo día. Santander concentra a media región entre El Sardinero y la bahía, pero los pueblos del interior como Santillana del Mar o Potes, ya casi pegado a los Picos de Europa, guardan un ritmo de vida completamente distinto al de la capital. La sobaos, el cocido montañés y el queso picón de Tresviso se defienden con el mismo cariño con el que se presume el mar Cantábrico, más frío y menos fotogénico que el Mediterráneo pero con un carácter que sus habitantes no cambiarían por nada. La lluvia frecuente y el verde constante son marca de la casa, no motivo de queja, y el acento cántabro —cercano al asturiano en algunas zonas— se distingue enseguida de un castellano de meseta. En esta sala se cruzan santanderinos, gente de los valles del interior y cántabros que emigraron pero siguen defendiendo su tierra como la mejor combinación de mar y montaña de España. Trato tranquilo, hospitalidad discreta y ese orgullo norteño que no hace falta subrayar.",
  },
];
