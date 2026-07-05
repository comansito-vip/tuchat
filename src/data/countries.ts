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
      "La sala más activa de la red: madrileños que salen del trabajo, valencianos que ya han cenado y canarios con una hora de ventaja. España entera en un chat.",
    about:
      "Diecisiete comunidades autónomas caben en esta sala, la más grande de la red en español: madrileños que salen del trabajo, valencianos que ya han cenado y canarios con una hora de ventaja se cruzan con españoles emigrados que vuelven cada noche para hablar sin acento fingido. Se discute de fútbol —Real Madrid, Barça, Atleti— con la misma intensidad que de política, del precio del alquiler o de la receta definitiva de la tortilla, con o sin cebolla. El castellano es el único denominador común, y en horas punta se juntan más de mil personas a la vez.",
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
      "Aquí el güey, el carnal y el chido se mezclan con el acento que cada región lleva en la boca: chilangos de la Ciudad de México, regiomontanos de Monterrey, tapatíos de Guadalajara y yucatecos de Mérida comparten un mismo espacio. Se habla del Tri en los mundiales con una fe que no aprende de la experiencia, de los tacos al pastor de madrugada, de la CDMX que nunca duerme y de los temblores que cada año recuerdan dónde se está parado. Es la sala más activa del país, con más de ochocientas personas conectadas en horas punta.",
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
      "Donde el voseo reina, el asado es religión y el fútbol divide familias. Los argentinos arrancan conversación y la dejan ir hasta las cuatro de la madrugada.",
    about:
      "Acá el voseo es la norma y el lunfardo entra solo: porteños de Palermo y San Telmo, cordobeses que tonadean distinto y mendocinos que defienden su malbec por encima de cualquier vino del mundo se encuentran en una de las salas más activas de la red latinoamericana. Se debaten el fútbol —Boca contra River, siempre Boca contra River— y la economía con idéntica intensidad, porque en Argentina ambos temas tienen la misma volatilidad. La charla arranca con el mate de la tarde y puede estirarse hasta las cuatro de la madrugada.",
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
      "Colombia: amabilidad en el trato y pasión en la discusión. Aquí se habla de fútbol, vallenato, economía y planes del fin de semana. Chévere que hayas llegado.",
    about:
      "Bogotanos de La Candelaria, paisas de Medellín que le ponen un -ito a todo, costeños de Barranquilla que no viven sin vallenato y caleños que convierten la salsa en un idioma paralelo al español: la calidez que el país exporta sin esfuerzo se nota desde el primer mensaje de esta sala siempre activa. Se habla del Clásico capitalino, de las arepas y las empanadas como si fueran equipos rivales, y de lo que pasa en el país con una honestidad que no siempre cabe en los medios. El parcero siempre tiene algo que decir, chévere que hayas llegado.",
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
      "Un país tan largo que el norte es desierto y el sur, Patagonia. Aquí se habla rápido, todo termina en po y el pisco no se negocia con los vecinos.",
    about:
      "De Arica a Punta Arenas, un país tan largo que apenas cabe en el mapa: nortinos del desierto de Atacama, santiaguinos del barrio Italia, sureños de Temuco y chilotes de la isla conectan en una sala donde el po aparece al final de cada mensaje. Se habla del Superclásico Colo-Colo contra Universidad de Chile con devoción de tribuna, del pisco sour como patrimonio que no se comparte con nadie, y de los precios que suben como la cordillera del fondo. El acento rápido y cantadito es inconfundible incluso por escrito.",
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
      "Donde el ceviche se discute con la misma pasión que el fútbol. Entre limeños, cusqueños y arequipeños siempre hay tema y siempre hay sazón.",
    about:
      "Huele a ceviche recién preparado y suena a debate entre limeños, cusqueños y arequipeños que nunca se ponen de acuerdo sobre cuál ciudad pesa más sin terminar picados. Se habla de gastronomía como si fuera deporte nacional —porque casi lo es—, del Alianza Lima contra la Universitaria de Deportes con pasión de generaciones, y de Machu Picchu con un orgullo que no se gasta. Es una de las salas más diversas de la red: gente de la costa, de la sierra y de la Amazonía comparte un español que lleva quechua prestado.",
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
      "Termo bajo el brazo y la rambla de fondo: montevideanos sin apuro, gente del interior que no cambia el mate caliente por nada y uruguayos en Buenos Aires o Madrid que siguen fieles a la Celeste conectan en una sala más pausada que el Río de la Plata pero igual de honda. Se habla del Carnaval de Montevideo —el más largo del mundo— con el mismo cariño que del fútbol, y la discusión sobre si el mate va con bombilla nueva o vieja no la resuelve nadie. País chico, sala intensa, charla sin reloj.",
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
      "Mitad escribe desde Maracaibo; la otra mitad desde Madrid, Bogotá o Santiago. Todos hablan de arepas, gaitas en diciembre y de cuándo se volverán a ver.",
    about:
      "Una mitad escribe desde Caracas o Maracaibo; la otra, desde los más de seis millones que salieron y aterrizaron en Lima, Bogotá, Madrid, Santiago o Miami. Se habla de las arepas, de las gaitas que suenan en diciembre aunque afuera sea invierno, del béisbol de las Grandes Ligas con el orgullo de quien sabe que el país pone allí a sus mejores peloteros, y de cuándo se vuelve o si se vuelve. La distancia no puede contra un acento tan musical ni contra la nostalgia que todos comparten en esta sala.",
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
      "Sierra, costa y Amazonía cruzables en un día. El chévere se cuela en cada frase y el debate Quito contra Guayaquil nunca se cierra del todo.",
    about:
      "Quiteños que defienden la altitud de su capital, guayaquileños que no cambian el río Guayas por nada y cuencanos convencidos de vivir en la más bonita de las tres: el pique entre las ciudades es tan constante como el clima cambiante de la sierra. Se habla del Barcelona SC contra Emelec con intensidad de clásico eterno, de una comida que va del seco de pollo al ceviche del Pacífico, y del chévere que se cuela solo en cada frase. Sierra, costa y Amazonía caben en un día de viaje y en una sala activa a cualquier hora.",
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
      "A 3.600 metros respiras distinto y el salar de Uyuni parece otro planeta. Entre español, quechua y aymara, la conversación tiene capas como las polleras.",
    about:
      "A 3.600 metros se respira distinto, y aquí el español lleva quechua y aymara mezclados sin pedir permiso: paceños que suben escaleras sin perder el aliento, cambas de Santa Cruz con el ritmo del llano y cochabambinos que reivindican su trono gastronómico comparten una de las salas más ricas lingüísticamente de la red. Se habla del Salar de Uyuni —paisaje que no cabe en una foto—, de la selección que juega en la altura para desesperar a cualquier rival, y de la chicha, que no es para paladares tibios. La conversación tiene capas, como las polleras.",
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
      "El único sitio donde te saludan en guaraní y siguen en español, con el tereré bien frío. País bilingüe de corazón, callado por fuera y cálido por dentro.",
    about:
      "Te saludan en guaraní y siguen en español sin pestañear: ambos idiomas se alternan en la misma frase con la naturalidad de quien lleva siglos con los dos. Asuncenos, norteños y campesinos del interior conectan con la diáspora en Argentina, España y Brasil que no quiere perder el guaraní que lleva dentro. Se habla del tereré bien frío para aguantar el calor, del partido que nunca deja de ser tema, y del fútbol con la pasión que un país bilingüe, callado por fuera y cálido por dentro, sabe reservar para lo que de verdad importa.",
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
      "Aquí el merengue y la bachata son el idioma. Se habla a mil por hora, se come mangú por la mañana y cualquier excusa sirve para sacar a alguien a bailar.",
    about:
      "Suena a merengue de Juan Luis Guerra y a bachata de Romeo Santos desde la primera línea, y se escribe a mil por hora: capitalinos del Distrito Nacional, santiagueros y cibaeños, gente de San Pedro y dominicanos en Nueva York, Boston y Madrid comparten una sala donde el acento acelerado no necesita subtítulos. Se habla del béisbol como filosofía de vida —el país exporta más peloteros de Grandes Ligas por habitante que ningún otro—, del mangú de la mañana y el sancocho del domingo, y de una temperatura que nunca baja tanto como para sacar un abrigo de verdad.",
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
      "La isla del son y los almendrones por el Malecón. Entre los de allá y los de Miami, la sala mantiene viva una conversación que el estrecho no corta.",
    about:
      "Almendrones rodando por el Malecón y el son sonando de fondo: la isla mantiene viva una conversación que el Estrecho de Florida no ha logrado cortar. Habaneros del Vedado y de La Habana Vieja, orientales de Santiago, camagüeyanos y cubanos en Miami, Nueva York y Madrid comparten esta sala con la hospitalidad de quien reparte lo poco que tiene. Se habla de la pelota con orgullo de potencia mundial, del Malecón de noche, del tabaco que se fuma despacio, y de los inventos creativos que se hacen a diario con lo que hay a mano.",
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
      "La isla del encanto que mezcla español e inglés sin permiso y exporta reggaeton al mundo. Aquí se dice wepa por todo y el orgullo boricua es infinito.",
    about:
      "Aquí se dice wepa por todo y el español y el inglés se mezclan en cada mensaje sin pedir permiso ni disculpas, como corresponde a la isla del encanto que exporta reggaetón al mundo y recibe turistas que siempre vuelven. Boricuas de Santurce, Bayamón, Ponce y Caguas y la diáspora de Orlando, Nueva York y Hartford comparten un orgullo que ningún huracán ha podido apagar. Se habla del mofongo como plato sagrado, de Roberto Clemente como leyenda eterna y del béisbol que la isla lleva en la sangre desde siempre.",
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
      "Tierra de volcanes y de un maya vivo en los mercados de Chichicastenango. Aquí todo es bien chilero y el desayuno sin frijoles negros no se entiende.",
    about:
      "Tierra de volcanes y de un maya bien vivo en los mercados de Chichicastenango: capitalinos de la Zona 1, xelajuenses de la ciudad fría, cobaneros y gente de comunidades mayas que conservan sus idiomas conectan en una sala donde el español comparte historia con el K'iche', el Kaqchikel y el Mam. Se habla del café guatemalteco —uno de los mejores del mundo— con el orgullo discreto de quien conoce su valor, del Clásico entre Comunicaciones y Municipal, y del desayuno que sin frijoles negros no se entiende. El bien chilero sirve para lo bueno, lo bonito y lo que no tiene otra palabra.",
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
      "Pura vida no es un eslogan: es cómo saludan y resuelven media vida los ticos. Sin ejército desde el 48, con perezosos en los árboles y la calma en el ADN.",
    about:
      "Pura vida no es un eslogan turístico: es la forma real en que los ticos saludan, resuelven medio problema y se despiden. Josefinos de San José, heredianos, guanacastecos de la zona seca y limonenses de la costa atlántica comparten una sala donde el mae y el diay aparecen en cada mensaje. Se habla de una biodiversidad que cabe en un país más pequeño que Andalucía, de los perezosos colgados en los árboles, de la selección que siempre sorprende cuando nadie la espera, y de vivir sin ejército desde 1948 como si fuera lo más normal del mundo.",
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
      "Donde dos océanos casi se tocan y los barcos hacen cola para cruzar el canal. Un skyline de cristal frente al Casco Viejo y siempre un típico de fondo.",
    about:
      "Dos océanos casi se tocan y los barcos hacen cola para cruzar el canal: este chat tiene el pulso de Ciudad de Panamá, donde los rascacielos de cristal del distrito financiero se ven desde las callejuelas coloniales del Casco Viejo. Panameños de la capital, gente del interior y descendientes de la antigua Zona del Canal comparten una sala tan diversa como el propio país. Se habla del canal que parte el continente en dos y da trabajo a miles de familias, de la cinta costera de noche, del tamborito en las fiestas patrias y de si esta temporada manda el béisbol o el fútbol.",
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
      "El pulgarcito de América: surf de talla mundial y pupusas que valen un viaje. Se dice cheros a los amigos y la diáspora en EE.UU. nunca pierde el hilo.",
    about:
      "Los cheros se saludan igual desde los dos lados del mundo: el pulgarcito de América junta a los salvadoreños del país con la enorme diáspora en Los Ángeles, Virginia, Houston y Maryland, que no pierde el acento ni las ganas de pupusas de chicharrón con curtido. Se habla del Clásico entre Alianza y FAS con fervor de estadio, de las playas de La Libertad donde surfean algunos de los mejores del mundo, y del café salvadoreño que exporta calidad aunque no siempre se le reconozca fuera. Aquí la distancia no cambia el lenguaje ni el hilo de la conversación.",
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
      "De las ruinas de Copán a los arrecifes de Roatán, con la baleada como bandera comestible. Los catrachos se pintan la cara cuando juega la H y el café no falta.",
    about:
      "De las ruinas de Copán a los arrecifes de Roatán, con la baleada como bandera comestible: tegucigalpenses y sampedranos —que tienen opinión propia sobre casi todo— se juntan con catrachos en Nueva Orleans, Houston y Miami que mantienen el vínculo intacto. Se habla de la Selección H con fervor nacional y la cara pintada, de las baleadas que arreglan cualquier hora del día, de Copán y su historia milenaria, y de Roatán, que todo el que visita quiere no marcharse. El café hondureño de altura es exportación de primera y orgullo de montaña.",
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
      "Tierra de lagos con volcanes en medio y de poetas que recitan a Rubén Darío de memoria: managüenses, granadinos de una de las ciudades coloniales más antiguas de Centroamérica, matagalpinos y costeños del Caribe conectan con nicas en San José, Miami y Madrid. Se habla del lago Cocibolca como orgullo geográfico inmenso, del gallo pinto que no falta en ninguna mañana, y de la pipa de agua de coco como remedio contra el calor. El dale pues sirve para casi todo, y a cualquier hora hay gente activa en la sala.",
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
      "Sesenta millones de hispanos entre el spanglish de Miami, los tacos de Los Ángeles y la bachata del Bronx. Aquí se viene a no perder el español ni la sazón.",
    about:
      "Más de sesenta millones de hispanos que no dejan que el inglés les borre el español se dan cita aquí. Cubanos de Miami, mexicanos del este de Los Ángeles, dominicanos del Bronx, salvadoreños del norte de Virginia y colombianos de Queens comparten una sala donde el spanglish es bienvenido pero el español sigue mandando. Se habla del sueño americano con todos sus claroscuros, de las remesas que viajan a casa cada mes, de los hijos que crecen entre dos culturas, y de dónde encontrar el restaurante que más se acerca a la cocina de mamá. Aquí se viene a no perder ni el idioma ni la sazón.",
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
      "Latinos que cambiaron el sol por −20° y aún hacen asado bajo la nieve. La sala es el rincón donde el frío no llega y el acento vuelve a casa.",
    about:
      "Latinos que cambiaron el sol por veinte grados bajo cero y aún así hacen asado sobre la nieve: eligieron Toronto, Montreal, Vancouver o Calgary sabiendo que el invierno sería largo, pero apostando por la calidad de vida. Mexicanos en Brampton, colombianos en Mississauga, venezolanos en Calgary y españoles en Montreal comparten la experiencia de aprender inglés o francés sin perder el español que llevan dentro. Se habla del frío que nunca decepciona, de los trámites de inmigración que no terminan nunca, del hockey con más curiosidad que pasión, y de dónde conseguir los ingredientes para cocinar como en casa un domingo de nevada.",
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
      "Españoles y latinos que trabajan en París o se mudaron por amor, buscando con quién quejarse en español de que cenan a las siete. La baguette no lo compensa.",
    about:
      "Gente que vive entre dos mundos: españoles en París que hacen la compra en español y trabajan en francés, latinoamericanos en Lyon, Marsella o Burdeos que eligieron Europa con escala aquí. Se habla del metro parisino que no se parece a ningún otro, de los museos que cansan pero merecen cada minuto, de lo peleado que es el francés para un hispanohablante, y de la añoranza de una buena barra de bar abierta a las once de la noche. La baguette está buenísima, pero no cura el cenar a las siete ni la nostalgia de los de casa.",
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
      "Hispanos en un país que gesticula como en casa: argentinos rastreando bisabuelos, españoles de Erasmus y latinos que descubren que el italiano casi se entiende.",
    about:
      "Aquí gesticulan como en casa: hay mucho argentino rastreando los apellidos del bisabuelo en algún pueblo de Calabria o el Véneto, y muchos españoles de Erasmus que alargaron la estancia porque la vita è bella de verdad. Se habla de la Serie A —el Calcio se sigue casi con la misma intensidad que LaLiga—, de la pizza napolitana contra la romana como debate sin solución, y de lo fácil que es perderse en Roma por mucho que se haya estado antes. El italiano y el español se parecen tanto que casi se entienden: casi, hasta que dejan de entenderse.",
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
      "El vecino al que se cruza la frontera por un fin de semana de bacalhau y fado. Españoles en Lisboa y latinos compartiendo un idioma tan parecido que engaña.",
    about:
      "El vecino al que se le cruza la frontera por un fin de semana de bacalhau y fado: hay españoles que vinieron a pasar dos días y se quedaron, latinoamericanos que eligieron Lisboa por el clima y los precios, y portugueses del norte que entienden el castellano de memoria. Comparten una sala tranquila pero activa, con la melancolía del fado y la hospitalidad genuina de quien recibe bien. Se habla de Ronaldo y de Eusébio en la misma frase, del pastel de nata como solución universal para cualquier mañana, y de cómo dos idiomas tan parecidos construyeron orillas tan distintas del mismo océano.",
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
      "Ingenieros, sanitarios y estudiantes que pelean con der, die, das mientras echan de menos el sol. La sala es el bar de tapas que Berlín no tiene del todo.",
    about:
      "Ingenieros, sanitarios y estudiantes que pelean con der, die, das mientras echan de menos el sol: este es su rincón en español, el de quienes trabajan en fábricas de Baviera, hospitales de Berlín, laboratorios de Múnich o despachos de Fráncfort. Españoles que llegaron en los ochenta y noventa, latinos de primera generación y recién aterrizados comparten lo que no siempre se dice en el trabajo: que el Döner está muy bien, pero no es lo mismo que una tortilla de mamá. Se habla de los trámites del Ausländerbehörde, del frío que no avisa y de si el alemán merece la pena más allá del B1.",
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
      "Latinos de Elephant and Castle, españoles camareando en Londres y estudiantes peleando con el clima y el inglés. Aquí se viene a hablar sin acento fingido.",
    about:
      "Latinos de Elephant and Castle, españoles camareando en Londres y estudiantes peleando con el clima y el inglés: aquí late una de las comunidades hispanas más grandes de Europa occidental, junto con españoles en Manchester, colombianos en Leeds, venezolanos en Edimburgo y ecuatorianos en Essex. Se habla de Elephant and Castle como barrio histórico de referencia, de los pubs que cierran a las once y decepcionan a quien viene del sur, de los sueldos en libras que parecen buenos hasta que pagas el alquiler, y de cómo el Brexit complicó las cosas a los que llegaron antes. Aquí se habla sin acento fingido.",
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
      "A catorce kilómetros de España, con un norte donde se habla español y LaLiga es local. Entre el té con menta y los zocos de Tánger, las orillas se entienden.",
    about:
      "A catorce kilómetros de España, donde el norte habla español y LaLiga se vive como local: marroquíes hispanohablantes de Tetuán, Alhucemas y Nador, que llevan el castellano como segunda lengua de toda la vida, y españoles o latinoamericanos instalados aquí por trabajo o estudio comparten una sala con doble mirada. Se habla de LaLiga con la pasión de un aficionado de barrio, del ramadán y la fiesta del Eid, del té con menta y de los zocos de Tánger. Es el puente entre dos orillas que se ven cada día y, aun así, siempre tienen algo nuevo que contarse.",
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
      "El único país de África con español como lengua oficial. Castellano con sabor a trópico, entre malanga, makara y un orgullo que une Malabo y Bata con Madrid.",
    about:
      "El único país de África subsahariana con el castellano como lengua oficial tiene aquí su único espacio de chat en español. Ecuatoguineanos de Malabo, Bata y Ebebiyín se juntan con la diáspora en España —sobre todo en Madrid y Barcelona— en una sala donde el español convive con el fang, el bubi y el ndowé dentro del mismo mensaje. Se habla del petróleo que transformó el país, del makara y la malanga, del fútbol africano, y de esa relación particular con España que la historia teje con hilos dobles. Castellano con sabor a trópico, único en toda la red.",
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
];
