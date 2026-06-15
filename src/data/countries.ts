import type { Place } from "./types";

export const COUNTRIES: Place[] = [
  {
    slug: "espana",
    name: "España",
    kind: "pais",
    icon: "🇪🇸",
    users: 1240,
    votes: 1980,
    tag: "Popular",
    activity: "Alta",
    channels: ["espana", "internacional", "amistad", "chatzona"],
    related: ["madrid", "barcelona", "valencia", "sevilla", "bilbao", "malaga", "amistad", "amor"],
    intro:
      "La sala más activa de la red: aquí coinciden madrileños que salen del trabajo, valencianos que ya han cenado y canarios que llevan una hora de ventaja. España entera en un solo chat.",
    about:
      "El chat de España es el más grande de la red en español: madrileños que salen del trabajo, valencianos que ya han cenado y canarios que llevan una hora de ventaja se mezclan con españoles en el extranjero que vuelven cada noche a esta sala para hablar sin acento fingido. Se discute de fútbol —Real Madrid, Barça, Atleti— con la misma intensidad que de política, el precio del alquiler o la receta definitiva de la tortilla. Una sala tan diversa como diecisiete comunidades autónomas, con el castellano como único denominador y más de mil usuarios conectados en horas pico.",
  },
  {
    slug: "mexico",
    name: "México",
    kind: "pais",
    icon: "🇲🇽",
    users: 890,
    votes: 1340,
    tag: "Popular",
    activity: "Alta",
    channels: ["mexico", "internacional", "amistad", "chatzona"],
    related: ["ciudad-de-mexico", "colombia", "argentina", "lima", "amistad", "amor", "musica"],
    intro:
      "De Tijuana a Mérida hay miles de kilómetros y cientos de acentos: la sala de México los reúne a todos. Rancheras, reggaeton y debates que no terminan nunca.",
    about:
      "El chat de México reúne a chilangos de la Ciudad de México, regiomontanos de Monterrey, tapatíos de Guadalajara y yucatecos de Mérida en un mismo espacio donde el güey, el carnal y el chido se mezclan con el acento que cada región lleva en la boca. Se habla del Tri en los mundiales con una fe que no aprende de la experiencia, de los tacos al pastor de madrugada, de la CDMX que nunca duerme y de los temblores que cada año recuerdan dónde se está. La sala más activa de México: más de ochocientos usuarios conectados en horas pico.",
  },
  {
    slug: "argentina",
    name: "Argentina",
    kind: "pais",
    icon: "🇦🇷",
    users: 720,
    votes: 1095,
    tag: "Tendencia",
    activity: "Alta",
    channels: ["argentina", "internacional", "amistad", "chatzona"],
    related: ["buenos-aires", "montevideo", "santiago-de-chile", "colombia", "amistad", "amor", "deportes"],
    intro:
      "Donde el voseo reina, el asado es religión de los domingos y el fútbol divide familias. Los argentinos no necesitan mucho para arrancar una conversación que dure hasta las cuatro.",
    about:
      "El chat de Argentina es de los más activos de la red latinoamericana: porteños de Palermo y San Telmo, cordobeses que pronuncian diferente y mendocinos que defienden su malbec sobre cualquier otro vino del mundo se encuentran en una sala donde el voseo es la norma y el lunfardo entra solo. Se debaten el fútbol —Boca versus River, siempre Boca versus River— y la economía con la misma intensidad, porque en Argentina ambos temas tienen la misma volatilidad. La conversación arranca con el mate y puede durar hasta las cuatro de la mañana.",
  },
  {
    slug: "colombia",
    name: "Colombia",
    kind: "pais",
    icon: "🇨🇴",
    users: 610,
    votes: 925,
    activity: "Alta",
    channels: ["colombia", "internacional", "amistad", "chatzona"],
    related: ["bogota", "mexico", "argentina", "lima", "amistad", "amor", "musica"],
    intro:
      "Colombia tiene el don de la amabilidad en el trato y la pasión en la discusión: en esta sala se habla de fútbol, de vallenato, de la economía y de los planes del fin de semana.",
    about:
      "El chat de Colombia tiene la calidez que el país exporta sin esfuerzo: bogotanos de La Candelaria, paisas de Medellín que ponen un -ito a todo, costeños de Barranquilla que no viven sin vallenato y caleños que convierten la salsa en un idioma paralelo al español se encuentran en una sala siempre activa. Se habla del Clásico capitalino, de las arepas y las empanadas como si fueran equipos rivales, y de lo que está pasando en el país con una honestidad que no siempre se encuentra en los medios. El parcero siempre tiene algo que decir.",
  },
  {
    slug: "chile",
    name: "Chile",
    kind: "pais",
    icon: "🇨🇱",
    users: 720,
    votes: 1080,
    tag: "Popular",
    activity: "Alta",
    channels: ["chile", "internacional", "amistad", "chatzona"],
    related: ["santiago-de-chile", "argentina", "peru", "bolivia", "amistad", "amor", "musica"],
    intro:
      "Un país tan largo que el del norte está en pleno desierto mientras el del sur se abriga en la Patagonia. Aquí se habla rápido, se usa el po al final de todo y nadie te perdona si confundes el pisco con el de los vecinos.",
    about:
      "El chat de Chile va desde Arica hasta Punta Arenas con la misma facilidad con que el país atraviesa todo el continente: nortinos del desierto de Atacama, santiaguinos del barrio Italia, sureños de Temuco y chilotes de la isla conectan en una sala donde el po aparece en cada mensaje. Se habla del Superclásico Colo-Colo versus Universidad de Chile con devoción de tribuna, del pisco sour como patrimonio que no se comparte, y de los precios del mercado que suben como la cordillera del fondo. El acento rápido de Chile es inconfundible incluso en el chat.",
  },
  {
    slug: "peru",
    name: "Perú",
    kind: "pais",
    icon: "🇵🇪",
    users: 680,
    votes: 1010,
    activity: "Alta",
    channels: ["peru", "internacional", "amistad", "chatzona"],
    related: ["lima", "chile", "ecuador", "bolivia", "amistad", "cocina", "viajes"],
    intro:
      "Donde el ceviche se discute con la misma pasión que el fútbol y todos defienden que su causa es la mejor. Entre limeños, cusqueños y arequipeños siempre hay tema, casi siempre con sazón.",
    about:
      "El chat de Perú tiene el aroma de un ceviche recién preparado y la intensidad de un debate entre limeños, cusqueños y arequipeños que nunca resuelven cuál ciudad merece la capital sin pelear. Se habla de gastronomía como si fuera deporte nacional —porque casi lo es—, del Alianza Lima versus la Universitaria de Deportes con pasión de generaciones, y de Machu Picchu con un orgullo que no se agota. La sala peruana es una de las más diversas de la red: limeños de costa, serranos y amazónicos comparten un español que lleva quechua prestado.",
  },
  {
    slug: "uruguay",
    name: "Uruguay",
    kind: "pais",
    icon: "🇺🇾",
    users: 320,
    votes: 480,
    activity: "Media",
    channels: ["uruguay", "internacional", "amistad", "chatzona"],
    related: ["montevideo", "argentina", "espana", "amistad", "amor", "futbol"],
    intro:
      "Termo bajo el brazo, mate en la mano y la rambla esperando. Los charrúas se toman su tiempo para todo menos para defender que el primer Mundial fue suyo.",
    about:
      "El chat de Uruguay es más pausado que el Río de la Plata pero igual de profundo: montevideanos de la rambla, gente del interior que no cambia el mate caliente por nada y uruguayos en Buenos Aires o Madrid que siguen fieles a la Celeste conectan en una sala sin prisa. Se habla del Carnaval de Montevideo —el más largo del mundo— con el mismo cariño que del fútbol, y la discusión sobre si el mate va con bombilla nueva o vieja nunca termina. País pequeño con sala intensa.",
  },
  {
    slug: "venezuela",
    name: "Venezuela",
    kind: "pais",
    icon: "🇻🇪",
    users: 610,
    votes: 950,
    tag: "Tendencia",
    activity: "Alta",
    channels: ["venezuela", "internacional", "amistad", "chatzona"],
    related: ["caracas", "colombia", "estados-unidos", "espana", "amistad", "musica", "amor"],
    intro:
      "Mitad de la sala escribe desde Maracaibo y la otra mitad desde Madrid, Bogotá o Santiago, pero todos hablan igual de arepas, gaitas en diciembre y de cuándo se volverán a ver. La nostalgia tiene acento llanero.",
    about:
      "El chat de Venezuela es el punto de encuentro de quienes están en Caracas o Maracaibo con los más de seis millones que salieron y aterrizaron en Lima, Bogotá, Madrid, Santiago o Miami. Se habla de las arepas, de las gaitas en diciembre aunque sea verano en el hemisferio norte, del béisbol de las Grandes Ligas con el orgullo de quien sabe que Venezuela pone allí sus mejores jugadores, y de cuándo se vuelve o si se vuelve. La distancia no puede con un acento tan musical ni con la nostalgia compartida.",
  },
  {
    slug: "ecuador",
    name: "Ecuador",
    kind: "pais",
    icon: "🇪🇨",
    users: 470,
    votes: 700,
    activity: "Media",
    channels: ["ecuador", "internacional", "amistad", "chatzona"],
    related: ["quito", "peru", "colombia", "amistad", "amor", "viajes"],
    intro:
      "Sierra, costa y Amazonía en un país del tamaño justo para cruzarlo en un día. Aquí el chévere se cuela en cada frase y el debate Quito contra Guayaquil nunca se cierra del todo.",
    about:
      "El chat de Ecuador reúne a quiteños que defienden la altitud de su capital, guayaquileños que no cambian su río Guayas por nada, y cuencanos que dicen vivir en la ciudad más bonita de las tres: el debate entre las tres urbes es tan constante como el clima variable de la sierra. Se habla de Barcelona SC versus Emelec con intensidad de clásico eterno, de la comida que va del seco de pollo al ceviche del Pacífico, y del chévere que entra solo en cada frase. Una sala activa a cualquier hora del día.",
  },
  {
    slug: "bolivia",
    name: "Bolivia",
    kind: "pais",
    icon: "🇧🇴",
    users: 380,
    votes: 560,
    activity: "Media",
    channels: ["bolivia", "internacional", "amistad", "chatzona"],
    related: ["la-paz", "peru", "chile", "paraguay", "amistad", "musica"],
    intro:
      "Donde a 3.600 metros respiras distinto y el salar de Uyuni parece otro planeta. Entre el español, el quechua y el aymara, la conversación tiene capas, igual que las polleras.",
    about:
      "El chat de Bolivia mezcla paceños que suben escaleras sin perder el aliento, cambas de Santa Cruz que viven en el llano con otro ritmo, y cochabambinos que reivindican su trono gastronómico. Se habla del Salar de Uyuni —paisaje que no cabe en una foto— de la selección que juega a 3.600 metros para desesperar a los rivales, y de la chicha que no es para paladares tibios. El español lleva quechua y aymara mezclados sin pedir permiso, lo que convierte esta sala en una de las más ricas lingüísticamente de la red.",
  },
  {
    slug: "paraguay",
    name: "Paraguay",
    kind: "pais",
    icon: "🇵🇾",
    users: 290,
    votes: 430,
    activity: "Media",
    channels: ["paraguay", "internacional", "amistad", "chatzona"],
    related: ["asuncion", "argentina", "bolivia", "uruguay", "amistad", "amor"],
    intro:
      "El único sitio donde te saludan en guaraní y siguen en español sin pestañear, con el tereré bien frío para aguantar el calor. País bilingüe de corazón, callado por fuera y cálido por dentro.",
    about:
      "El chat de Paraguay habla en dos idiomas sin pestañear: el español y el guaraní se alternan en la misma frase con la naturalidad de quien lleva siglos con ambos. Asuncenos, norteños y campesinos del interior conectan con paraguayos de la diáspora en Argentina, España y Brasil que no quieren perder el guaraní que llevan dentro. Se habla del tereré bien frío para aguantar el calor, del partido que siempre es tema perenne, y del fútbol con la pasión que un país bilingüe de corazón callado sabe reservar para lo que importa.",
  },
  {
    slug: "republica-dominicana",
    name: "República Dominicana",
    kind: "pais",
    icon: "🇩🇴",
    users: 540,
    votes: 820,
    tag: "Popular",
    activity: "Alta",
    channels: ["republica-dominicana", "internacional", "amistad", "chatzona"],
    related: ["santo-domingo", "cuba", "puerto-rico", "venezuela", "amistad", "musica", "amor"],
    intro:
      "Aquí el merengue y la bachata no son música de fondo, son el idioma. Se habla a mil por hora, se come mangú por la mañana y cualquier excusa sirve para sacar a alguien a bailar.",
    about:
      "El chat de la República Dominicana suena a merengue de Juan Luis Guerra y a bachata de Romeo Santos desde la primera línea: capitalinos del Distrito Nacional, santiagueros y cibaeños, gente de San Pedro y dominicanos en Nueva York, Boston y Madrid comparten una sala donde el acento acelerado no necesita subtítulos. Se habla del béisbol como filosofía de vida —la RD exporta más jugadores de Grandes Ligas por habitante que ningún otro país—, del sancocho del domingo, y de la temperatura que nunca baja tanto como para ponerse abrigo de verdad.",
  },
  {
    slug: "cuba",
    name: "Cuba",
    kind: "pais",
    icon: "🇨🇺",
    users: 430,
    votes: 670,
    tag: "Tendencia",
    activity: "Media",
    channels: ["cuba", "internacional", "amistad", "chatzona"],
    related: ["la-habana", "republica-dominicana", "puerto-rico", "espana", "amistad", "musica", "amor"],
    intro:
      "La isla del son, los almendrones por el Malecón y el café que se comparte aunque escasee. Entre los de allá y los de Miami, la sala mantiene viva una conversación que el estrecho no corta.",
    about:
      "El chat de Cuba mantiene viva una conversación que el Estrecho de Florida no ha podido cortar: habaneros del Vedado y de La Habana Vieja, orientales de Santiago, camagüeyanos y cubanos en Miami, Nueva York y Madrid comparten esta sala con la hospitalidad de quien comparte lo poco que tiene. Se habla de la pelota cubana con orgullo de potencia mundial, del Malecón de noche, del tabaco que se fuma despacio, y de los planes creativos que se hacen a diario con lo disponible. El son sigue siendo el idioma paralelo.",
  },
  {
    slug: "puerto-rico",
    name: "Puerto Rico",
    kind: "pais",
    icon: "🇵🇷",
    users: 410,
    votes: 630,
    activity: "Media",
    channels: ["puerto-rico", "internacional", "amistad", "chatzona"],
    related: ["san-juan", "republica-dominicana", "cuba", "estados-unidos", "amistad", "musica", "amor"],
    intro:
      "La isla del encanto que mezcla el español con el inglés sin pedir permiso y exporta reggaeton al mundo entero. Aquí se dice wepa por todo y el orgullo boricua no cabe en cien por treinta y cinco millas.",
    about:
      "El chat de Puerto Rico es naturalmente bilingüe: el español y el inglés se mezclan en cada mensaje sin pedir permiso ni disculpas, como corresponde a una isla que exporta reggaetón al mundo y recibe turistas que siempre vuelven. Boricuas de Santurce, Bayamón, Ponce y Caguas y la diáspora de Orlando, Nueva York y Hartford comparten el mismo orgullo de isla que ningún huracán ha podido apagar. Se habla del mofongo como plato sagrado, de Roberto Clemente como leyenda eterna, y del wepa que sirve para todo.",
  },
  {
    slug: "guatemala",
    name: "Guatemala",
    kind: "pais",
    icon: "🇬🇹",
    users: 360,
    votes: 540,
    activity: "Media",
    channels: ["guatemala", "internacional", "amistad", "chatzona"],
    related: ["ciudad-de-guatemala", "el-salvador", "honduras", "mexico", "amistad", "amor", "viajes"],
    intro:
      "Tierra de volcanes que humean al fondo y de un maya que sigue vivo en los mercados de Chichicastenango. Aquí todo es bien chilero y el desayuno sin frijoles negros no se entiende.",
    about:
      "El chat de Guatemala tiene la riqueza de un mercado de Chichicastenango: capitalinos de la Zona 1, xelajuenses de la ciudad fría, cobaneros y personas de comunidades mayas que conservan sus idiomas conectan en una sala donde el español comparte historia con el K'iche', Kaqchikel y Mam. Se habla del café guatemalteco —uno de los mejores del mundo— con el orgullo discreto de quien conoce su valor, del Clásico entre Comunicaciones y Municipal, y de los volcanes que humean de fondo de Antigua. El bien chilero sirve para lo bueno, lo bonito y lo que no tiene otra palabra.",
  },
  {
    slug: "costa-rica",
    name: "Costa Rica",
    kind: "pais",
    icon: "🇨🇷",
    users: 340,
    votes: 510,
    activity: "Media",
    channels: ["costa-rica", "internacional", "amistad", "chatzona"],
    related: ["san-jose-costa-rica", "panama", "nicaragua", "amistad", "viajes", "amor"],
    intro:
      "Pura vida no es un eslogan turístico, es cómo saludan, se despiden y resuelven media vida los ticos. Sin ejército desde el 48, con perezosos en los árboles y la calma metida en el ADN.",
    about:
      "El chat de Costa Rica tiene el ritmo del pura vida: no es un eslogan turístico sino la forma real en que los ticos saludan, resuelven problemas y se despiden. Josefinos de San José, heredianos, guanacastecos de la zona seca y limónenses de la costa atlántica comparten una sala donde el mae y el diay aparecen en cada mensaje. Se habla de la biodiversidad que cabe en un país más pequeño que Andalucía, de la selección nacional que siempre sorprende cuando nadie la espera, y de vivir sin ejército desde 1948 como algo completamente normal.",
  },
  {
    slug: "panama",
    name: "Panamá",
    kind: "pais",
    icon: "🇵🇦",
    users: 350,
    votes: 520,
    activity: "Media",
    channels: ["panama", "internacional", "amistad", "chatzona"],
    related: ["ciudad-de-panama", "costa-rica", "colombia", "amistad", "musica", "amor"],
    intro:
      "Donde dos océanos casi se tocan y los barcos hacen cola para cruzar el canal. La capital es un skyline de cristal frente al Casco Viejo, y de fondo siempre suena un buen típico o una salsa.",
    about:
      "El chat de Panamá tiene el pulso de Ciudad de Panamá, donde los rascacielos del banking district se ven desde las callejuelas coloniales del Casco Antiguo. Panameños de la capital, choriceros del interior y descendientes de la ex Zona del Canal comparten una sala tan diversa como el propio país. Se habla del canal que parte el continente en dos y da trabajo a miles de familias, de la cinta costera de noche, del tamborito en las fiestas patrias y de si el béisbol o el fútbol manda esta temporada.",
  },
  {
    slug: "el-salvador",
    name: "El Salvador",
    kind: "pais",
    icon: "🇸🇻",
    users: 330,
    votes: 490,
    activity: "Media",
    channels: ["el-salvador", "internacional", "amistad", "chatzona"],
    related: ["san-salvador", "guatemala", "honduras", "estados-unidos", "amistad", "cocina"],
    intro:
      "El pulgarcito de América, pequeño pero con surf de talla mundial y pupusas que valen un viaje. Aquí se dice cheros a los amigos y la diáspora en EE.UU. nunca pierde el hilo con casa.",
    about:
      "El chat de El Salvador une a salvadoreños en el país con la enorme diáspora en Los Ángeles, Virginia, Houston y Maryland que no pierde el acento ni las ganas de comer pupusas de chicharrón con curtido. Se habla del Clásico entre el Alianza y el FAS con fervor de estadio, de las playas de La Libertad donde surfean algunos de los mejores del mundo, y del café salvadoreño que exporta calidad aunque no siempre se le reconozca fuera. Los cheros se saludan igual desde los dos lados del mundo: la distancia no cambia el lenguaje.",
  },
  {
    slug: "honduras",
    name: "Honduras",
    kind: "pais",
    icon: "🇭🇳",
    users: 320,
    votes: 480,
    activity: "Media",
    channels: ["honduras", "internacional", "amistad", "chatzona"],
    related: ["tegucigalpa", "guatemala", "el-salvador", "nicaragua", "amistad", "futbol"],
    intro:
      "De las ruinas mayas de Copán a los arrecifes de Roatán, con la baleada como bandera comestible. Los catrachos se pintan la cara cada vez que juega la H y el cafecito de altura no falta.",
    about:
      "El chat de Honduras junta a tegucigalpenses y sampedrancos —que tienen su punto de vista propio sobre casi todo— con catrachos en New Orleans, Houston y Miami que mantienen el vínculo. Se habla de la Selección H con fervor nacional, de las baleadas que solucionan cualquier hora del día, de Copán que tiene más historia de la que cabe en un mensaje, y de Roatán que todo el que visita quiere quedarse. El café hondureño de altura es exportación de primera y orgullo de montaña.",
  },
  {
    slug: "nicaragua",
    name: "Nicaragua",
    kind: "pais",
    icon: "🇳🇮",
    users: 300,
    votes: 450,
    activity: "Media",
    channels: ["nicaragua", "internacional", "amistad", "chatzona"],
    related: ["managua", "costa-rica", "honduras", "amistad", "amor", "musica"],
    intro:
      "Tierra de lagos con volcanes en medio y de poetas que recitan a Rubén Darío de memoria. Aquí se dice dale pues a todo y el gallo pinto arranca cualquier mañana.",
    about:
      "El chat de Nicaragua tiene la voz del poeta —Darío todavía se recita de memoria en las escuelas— y la calidez del pueblo que lo parió. Manancianos, granadinos de la ciudad colonial más antigua de Centroamérica, matagalpinos y costeños del Caribe conectan con nicas en San José, Miami y Madrid. Se habla del lago Cocibolca como orgullo geográfico inmenso, del gallo pinto que no puede faltar en ninguna mañana, y de la pipa de agua de coco como solución al calor. Dale pues: la sala tiene gente activa.",
  },
  {
    slug: "estados-unidos",
    name: "Estados Unidos",
    kind: "pais",
    icon: "🇺🇸",
    users: 780,
    votes: 1180,
    tag: "Popular",
    activity: "Alta",
    channels: ["estados-unidos", "internacional", "amistad", "chatzona"],
    related: ["miami", "mexico", "puerto-rico", "venezuela", "amistad", "amor", "musica"],
    intro:
      "Sesenta millones de hispanos repartidos entre el spanglish de Miami, los tacos de Los Ángeles y la bachata del Bronx. Aquí se viene a no perder el español ni la sazón, aunque el trabajo sea en inglés.",
    about:
      "El chat de Estados Unidos es el punto de encuentro de más de sesenta millones de hispanos que no quieren que el inglés les borre el español. Cubanos de Miami, mexicanos de East Los Ángeles, dominicanos del Bronx, salvadoreños de Northern Virginia y colombianos de Queens comparten una sala donde el spanglish es bienvenido pero el español sigue siendo el idioma principal. Se habla del sueño americano con sus claroscuros, de las remesas que van a casa cada mes, de los hijos que crecen entre dos culturas, y de dónde encontrar el restaurante que más se parece a la cocina de mamá.",
  },
  {
    slug: "canada",
    name: "Canadá",
    kind: "pais",
    icon: "🇨🇦",
    users: 280,
    votes: 420,
    activity: "Media",
    channels: ["canada", "internacional", "amistad", "chatzona"],
    related: ["estados-unidos", "mexico", "colombia", "amistad", "viajes", "amor"],
    intro:
      "Latinos que cambiaron el calor por inviernos de menos veinte y aún se juntan a hacer asado bajo la nieve. De Toronto a Montreal, la sala es el rincón donde el frío no llega y el acento vuelve a casa.",
    about:
      "El chat de Canadá reúne a latinos que eligieron Toronto, Montreal, Vancouver o Calgary sabiendo que el invierno sería largo pero apostando por la calidad de vida. Mexicanos en Brampton, colombianos en Mississauga, venezolanos en Calgary y españoles en Montreal comparten la experiencia de aprender inglés o francés mientras intentan no perder el español que llevan dentro. Se habla del frío que nunca decepciona, de los trámites de inmigración que no acaban, del hockey sobre hielo con más curiosidad que pasión, y de dónde encontrar los ingredientes para cocinar de casa un domingo de nieve.",
  },
  {
    slug: "francia",
    name: "Francia",
    kind: "pais",
    icon: "🇫🇷",
    users: 290,
    votes: 430,
    activity: "Media",
    channels: ["francia", "internacional", "amistad", "chatzona"],
    related: ["paris", "espana", "italia", "marruecos", "amistad", "viajes", "amor"],
    intro:
      "Españoles y latinos que estudian en la Sorbona, trabajan en cocinas de París o se mudaron por amor, buscando con quién quejarse en español de que aquí cenan a las siete. La baguette está rica, pero no es lo mismo.",
    about:
      "El chat de Francia es el de quienes viven entre dos mundos: españoles en París que van al mercado en español y trabajan en francés, latinoamericanos en Lyon, Marsella o Burdeos que eligieron Europa con escala aquí. Se habla del metro parisino que no tiene precio comparado con ningún otro, de los museos que cansan pero merecen cada minuto, de lo complicado que es el francés para un hispanohablante, y de la añoranza de una buena barra de bar abierta a las once de la noche. Una sala donde la baguette está muy buena pero no cura la nostalgia.",
  },
  {
    slug: "italia",
    name: "Italia",
    kind: "pais",
    icon: "🇮🇹",
    users: 300,
    votes: 450,
    activity: "Media",
    channels: ["italia", "internacional", "amistad", "chatzona"],
    related: ["espana", "francia", "argentina", "amistad", "cocina", "amor"],
    intro:
      "Hispanos en un país donde la gente gesticula igual que en casa y la sobremesa también es sagrada. Argentinos rastreando bisabuelos, españoles disfrutando del Erasmus y latinos descubriendo que el español y el italiano casi se entienden solos.",
    about:
      "El chat de Italia tiene mucho de argentinos que rastrean los apellidos del bisabuelo en algún pueblo de Calabria o el Véneto, y de españoles erasmus que alargaron la estancia porque la vita è bella de verdad. Se habla de la Serie A —el Calcio se sigue casi con la misma intensidad que LaLiga—, de la pizza napolitana versus la romana como debate sin solución, y de lo fácil que es perderse en Roma aunque se haya estado antes. El italiano y el español se parecen tanto que engañan: hasta que no engañan.",
  },
  {
    slug: "portugal",
    name: "Portugal",
    kind: "pais",
    icon: "🇵🇹",
    users: 270,
    votes: 400,
    activity: "Media",
    channels: ["portugal", "internacional", "amistad", "chatzona"],
    related: ["espana", "francia", "reino-unido", "amistad", "viajes", "amor"],
    intro:
      "El vecino de al lado al que se cruza la frontera por un fin de semana de bacalhau y fado. Españoles que se mudaron a Lisboa y latinos recién llegados comparten ese idioma tan parecido que engaña hasta que no lo es.",
    about:
      "El chat de Portugal tiene la melancolía del fado y la hospitalidad genuina de quien recibe bien. Españoles que cruzaron la frontera por el fin de semana y se quedaron, latinoamericanos que eligieron Lisboa por el clima y los precios, y portugueses hispanohablantes del norte que entienden el castellano de memoria comparten una sala tranquila pero activa. Se habla de Ronaldo y de Eusébio en la misma frase, del pastel de nata como solución universal para cualquier mañana, y de cómo dos idiomas tan parecidos han construido orillas tan distintas del mismo océano.",
  },
  {
    slug: "alemania",
    name: "Alemania",
    kind: "pais",
    icon: "🇩🇪",
    users: 310,
    votes: 470,
    activity: "Media",
    channels: ["alemania", "internacional", "amistad", "chatzona"],
    related: ["berlin", "espana", "reino-unido", "francia", "amistad", "amor", "musica"],
    intro:
      "Ingenieros, sanitarios y estudiantes que pelean con los artículos der, die, das mientras echan de menos el sol y la espontaneidad. La sala es el bar de tapas que Berlín no tiene del todo.",
    about:
      "El chat de Alemania es el rincón en español de quienes trabajan en fábricas de Baviera, hospitales de Berlín, laboratorios de Múnich o despachos de Fráncfort. Españoles que llegaron en los ochenta y noventa, latinos de primera generación y estudiantes recién llegados comparten en esta sala lo que no siempre pueden decir en el trabajo: que el Döner está muy bien pero no es lo mismo que una tortilla de mamá. Se habla de los trámites del Ausländerbehörde, del frío que no avisa y de si el alemán merece la pena aprenderlo más allá del B1.",
  },
  {
    slug: "reino-unido",
    name: "Reino Unido",
    kind: "pais",
    icon: "🇬🇧",
    users: 330,
    votes: 500,
    tag: "Tendencia",
    activity: "Alta",
    channels: ["reino-unido", "internacional", "amistad", "chatzona"],
    related: ["londres", "espana", "francia", "colombia", "amistad", "amor", "musica"],
    intro:
      "Latinos de Elephant and Castle, españoles camareando en Londres y estudiantes peleando con el clima y el inglés de la calle. Aquí se viene a hablar sin acento fingido y a saber dónde venden harina pan.",
    about:
      "El chat del Reino Unido reúne a la comunidad hispana de Londres —una de las más grandes de Europa occidental—, con españoles en Manchester, colombianos en Leeds, venezolanos en Edimburgo y ecuatorianos en Essex. Se habla de Elephant and Castle como barrio de referencia histórica de los hispanohablantes en la ciudad, de los pubs que cierran a las once y decepcionan a quien viene del sur, de los sueldos que en libras parecen buenos hasta que pagas el alquiler, y de cómo el Brexit complicó las cosas para los que llegaron antes.",
  },
  {
    slug: "marruecos",
    name: "Marruecos",
    kind: "pais",
    icon: "🇲🇦",
    users: 240,
    votes: 360,
    activity: "Media",
    channels: ["marruecos", "internacional", "amistad", "chatzona"],
    related: ["espana", "francia", "guinea-ecuatorial", "amistad", "viajes", "amor"],
    intro:
      "A solo catorce kilómetros de España, con un norte donde todavía se habla español de toda la vida y se sigue a LaLiga como si fuera local. Entre el té con menta y los zocos de Tánger, las dos orillas se entienden mejor de lo que parece.",
    about:
      "El chat de Marruecos es el puente entre dos culturas que se ven cada día desde ambas orillas del Estrecho de Gibraltar. Marroquíes hispanohablantes del norte —Tetuán, Alhucemas, Nador— que llevan el español como segunda lengua de toda la vida, y españoles o latinoamericanos en Marruecos por trabajo o estudio, comparten una sala con doble perspectiva. Se habla de LaLiga con la pasión de un aficionado local, del ramadán y la fiesta del Eid, del mercado de especias de Tánger, y de ese cruce inevitable de culturas que la geografía hace permanente.",
  },
  {
    slug: "guinea-ecuatorial",
    name: "Guinea Ecuatorial",
    kind: "pais",
    icon: "🇬🇶",
    users: 180,
    votes: 280,
    tag: "Nueva",
    activity: "Baja",
    channels: ["guinea-ecuatorial", "internacional", "amistad", "chatzona"],
    related: ["espana", "marruecos", "amistad", "amor", "musica", "futbol"],
    intro:
      "El único país de África subsahariana donde el español es lengua oficial, herencia que une Malabo y Bata con Madrid. Aquí se habla castellano con sabor a trópico, entre malanga, makara y un orgullo que no se pierde.",
    about:
      "El chat de Guinea Ecuatorial es único en toda la red: el único espacio de chat en español para el único país de África subsahariana con el castellano como lengua oficial. Ecuatoguineanos de Malabo, Bata y Ebebiyín, junto con los de la diáspora en España —especialmente en Madrid y Barcelona— comparten una sala donde el español convive con el fang, el bubi y el ndowé en el mismo mensaje. Se habla del petróleo que transformó el país, del makara y la malanga, del fútbol africano, y de la relación particular con España que la historia teje con hilos dobles.",
  },
];

export const CONTINENTS: { title: string; places: { name: string; slug: string }[] }[] = [
  { title: "España", places: [{ name: "España", slug: "espana" }] },
  {
    title: "Latinoamérica",
    places: [
      { name: "México", slug: "mexico" },
      { name: "Argentina", slug: "argentina" },
      { name: "Colombia", slug: "colombia" },
      { name: "Chile", slug: "chile" },
      { name: "Perú", slug: "peru" },
      { name: "Venezuela", slug: "venezuela" },
      { name: "Ecuador", slug: "ecuador" },
      { name: "Bolivia", slug: "bolivia" },
      { name: "Paraguay", slug: "paraguay" },
      { name: "Uruguay", slug: "uruguay" },
    ],
  },
  {
    title: "Caribe",
    places: [
      { name: "República Dominicana", slug: "republica-dominicana" },
      { name: "Cuba", slug: "cuba" },
      { name: "Puerto Rico", slug: "puerto-rico" },
    ],
  },
  {
    title: "Centroamérica",
    places: [
      { name: "Guatemala", slug: "guatemala" },
      { name: "El Salvador", slug: "el-salvador" },
      { name: "Honduras", slug: "honduras" },
      { name: "Nicaragua", slug: "nicaragua" },
      { name: "Costa Rica", slug: "costa-rica" },
      { name: "Panamá", slug: "panama" },
    ],
  },
  {
    title: "Norteamérica",
    places: [
      { name: "Estados Unidos", slug: "estados-unidos" },
      { name: "Canadá", slug: "canada" },
    ],
  },
  {
    title: "Europa",
    places: [
      { name: "España", slug: "espana" },
      { name: "Francia", slug: "francia" },
      { name: "Reino Unido", slug: "reino-unido" },
      { name: "Italia", slug: "italia" },
      { name: "Portugal", slug: "portugal" },
      { name: "Alemania", slug: "alemania" },
    ],
  },
  {
    title: "África",
    places: [
      { name: "Marruecos", slug: "marruecos" },
      { name: "Guinea Ecuatorial", slug: "guinea-ecuatorial" },
    ],
  },
  { title: "Mundo", places: [{ name: "Internacional", slug: "internacional" }] },
];
