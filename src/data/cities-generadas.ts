import type { Place } from "./types";

// Salas de localidad publicadas por el cron scripts/cron/salas-geo.mjs, a razón
// de una docena al día. NO EDITAR A MANO: este fichero se reescribe entero a
// partir de data/localidades/generadas.json, que es la fuente de verdad y
// guarda además la fuente consultada de cada localidad.
//
// Cada ficha se redactó contra el extracto de Wikipedia y la portada de la web
// del ayuntamiento de esa localidad, y la verificó un modelo distinto del que
// la escribió.
export const CITIES_GENERADAS: Place[] = [
  {
    "slug": "apodaca",
    "name": "Apodaca",
    "kind": "ciudad",
    "icon": "💬",
    "users": 131,
    "votes": 215,
    "activity": "Alta",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Nuevo León",
    "regionSlug": "nuevo-leon",
    "channels": [
      "nuevo_leon",
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "guadalupe-nuevo-leon",
      "monterrey",
      "allende",
      "saltillo",
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "Apodaca, segunda ciudad más poblada de Nuevo León con 536 436 habitantes en 2020, forma parte de la zona metropolitana de Monterrey.",
    "about": "Apodaca, oficialmente Ciudad Apodaca, es una urbe mexicana situada en el estado de Nuevo León y constituye la cabecera del municipio homónimo. Con 536 436 habitantes según el INEGI en 2020, es la segunda ciudad más poblada del estado, detrás de Monterrey, y la 32.ª a nivel nacional. Forma parte de la zona metropolitana de Monterrey, ubicándose en el extremo oriental de la conurbación.\n\nLos orígenes del asentamiento se remontan al siglo XVI. El 16 de agosto de 1585 Diego de Montemayor reclamó las tierras de las Mercedes y, en 1610, José de Treviño Quintanilla adquirió la hacienda San Francisco por cuatro mil pesos. A lo largo de los siglos la zona se dividió en varias haciendas, entre ellas Aguafría, Encarnación y Huinalá. En 1845 José María Flores fue elegido alcalde, marcando el inicio de la vida política local. Hoy Apodaca combina su legado histórico con una economía vinculada al sector industrial y comercial de la gran área de Monterrey.",
    "aboutTitle": "Apodaca: la segunda ciudad más poblada de Nuevo León"
  },
  {
    "slug": "piedras-negras",
    "name": "Piedras Negras",
    "kind": "ciudad",
    "icon": "💬",
    "users": 137,
    "votes": 229,
    "activity": "Media",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Coahuila de Zaragoza",
    "regionSlug": "coahuila-de-zaragoza",
    "channels": [
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "Piedras Negras, ciudad fronteriza del noreste de México, en el estado de Coahuila, a orillas del río Bravo, con una rica historia y economía regional.",
    "about": "Piedras Negras es una ciudad fronteriza del noreste de México, en el estado de Coahuila, ubicada frente a la ciudad de Eagle Pass, Texas, Estados Unidos, a orillas del río Bravo. Fue fundada el 15 de junio de 1850 por 34 hombres comandados por Andrés Zapata, Gaspar Salazar y Antonio Ramírez, y se estableció como colonia militar y luego como población civil. En 1881, se descubrieron grandes yacimientos de carbón en la región, lo que ayudó al desarrollo de la economía regional.\n\nLa ciudad cuenta con diversos lugares de esparcimiento, como la Plaza de las Culturas, inaugurada en noviembre de 2005, que cuenta con réplicas a menor escala de las pirámides de Teotihuacán, Chichen Itzá y la pirámide de los 365 nichos, además de un planetario, una biblioteca y varios bares y restaurantes.",
    "aboutTitle": "Piedras Negras, ciudad fronteriza del río Bravo"
  },
  {
    "slug": "los-mochis",
    "name": "Los Mochis",
    "kind": "ciudad",
    "icon": "💬",
    "users": 131,
    "votes": 231,
    "activity": "Alta",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Sinaloa",
    "regionSlug": "sinaloa",
    "channels": [
      "sinaloa",
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "Los Mochis, ciudad sinaloense fundada el 20 de abril de 1903, lleva un nombre cahíta que significa 'tortuga terrestre' y creció gracias a la caña de azúcar.",
    "about": "Los Mochis es una ciudad del noroeste de México, capital del municipio de Ahome en el estado de Sinaloa. El nombre proviene del cahíta mochim, plural de mochic, que se traduce como ‘tortuga de tierra’, aludiendo a la planta Boerhavia coccinea que cubría el valle antes de la urbanización. En septiembre de 1872 el ingeniero civil estadounidense Albert K. Owen llegó a la bahía de Ohuira y visualizó la creación de una población; más tarde, colonos socialistas utópicos construyeron los primeros canales e irrigaron el valle, fundando los poblados El Público y El Plat. El 20 de abril de 1903 se funda por decreto la alcaldía de Los Mochis y el 1 de junio del mismo año el poblado de El Plat pasa a llamarse Los Mochis. A finales del siglo XIX Benjamin Francis Johnston impulsó la industria azucarera, estableciendo el ingenio que se convirtió en una de las fábricas más importantes del noroeste mexicano, lo que favoreció el crecimiento demográfico. En la historia local destaca la ejecución el 24 de octubre de 1916 del líder revolucionario indígena Felipe Bachomo.",
    "aboutTitle": "Historia azucarera y origen del nombre de Los Mochis"
  },
  {
    "slug": "puente-alto",
    "name": "Puente Alto",
    "kind": "ciudad",
    "icon": "💬",
    "users": 152,
    "votes": 252,
    "activity": "Alta",
    "parentName": "Chile",
    "parentSlug": "chile",
    "provincia": "Región Metropolitana de Santiago",
    "regionSlug": "region-metropolitana-de-santiago",
    "channels": [
      "chile",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "chile",
      "santiago-de-chile",
      "rancagua",
      "san-antonio-chile",
      "quillota",
      "amistad",
      "amor"
    ],
    "intro": "Puente Alto, la comuna más poblada de Chile con 568.086 habitantes (censo 2024), destaca por su ubicación en el Valle del Maipo Alto y su red de Metro Línea 4.",
    "about": "Puente Alto es una comuna chilena, capital de la provincia de Cordillera en la Región Metropolitana de Santiago. Está situada en el Valle del Maipo Alto, parte de la subregión Valle del Maipo, dentro del Valle Central de Chile. Según el censo de 2024 del Instituto Nacional de Estadísticas, la ciudad cuenta con 568.086 habitantes, lo que la convierte en la comuna más poblada del país. Limita al norte con La Florida (provincia de Santiago), al sur con Pirque, al este con San José de Maipo y al oeste con La Pintana y San Bernardo. La zona se caracteriza por la cuenca altoandina del río Maipo, clima templado mediterráneo y geografía de piedemonte andino, con laderas, cerros y suelos aluviales propicios para la viticultura.\n\nPuente Alto dispone de conectividad troncal mediante el Camino Regional (Ruta G-25) y está servida por la Línea 4 del Metro de Santiago, que une Plaza de Puente Alto con Tobalaba, Providencia y Las Condes. En el ámbito cultural, la comuna es reconocida como \"La Capital del Mosaico en Latinoamérica\" por la Ruta del Mosaico, una serie de obras pictóricas que retratan la ciudad. En el eje Tobalaba‑Portales se encuentra el monumento nacional Puente Colonial, un acueducto histórico que canalizaba las aguas del río Maipo para las misiones jesuitas.",
    "aboutTitle": "Puente Alto: capital de Cordillera y la Capital del Mosaico"
  },
  {
    "slug": "catia-la-mar",
    "name": "Catia La Mar",
    "kind": "ciudad",
    "icon": "💬",
    "users": 132,
    "votes": 214,
    "activity": "Alta",
    "parentName": "Venezuela",
    "parentSlug": "venezuela",
    "provincia": "Estado La Guaira",
    "regionSlug": "estado-la-guaira",
    "channels": [
      "venezuela",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "venezuela",
      "caracas",
      "los-teques",
      "guarenas",
      "maracay",
      "amistad",
      "amor"
    ],
    "intro": "Catia La Mar, parroquia de Vargas en La Guaira, sufrió el fuerte terremoto del 24 de junio de 2026, que dejó derrumbes y graves daños en la zona costera.",
    "about": "Catia La Mar es una parroquia del municipio Vargas, situada en la región capital del estado La Guaira, frente al Mar Caribe. Con una superficie aproximada de 38 kilómetros cuadrados, alberga urbanizaciones como La Esperanza, El Piache y Marapa Marina, y playas conocidas como Costa Dorada, Playa La Zorra y Puerto Viejo. El clima es árido, con escasas lluvias y temperaturas calurosas suavizadas por las brisas marinas.\n\nFundada oficialmente en 1874 bajo el nombre de Olivares, la localidad fue rebautizada el 26 de enero de 1966 por el Concejo Municipal del Distrito Federal, renombrándola como Catia La Mar. Según el censo de 2011, la parroquia contaba con 85.054 habitantes, cifra que ascendió a 112.444 en estimaciones de 2023. Su economía se basa en el comercio, el turismo y el transporte, destacando el puerto pesquero La Zorra, que comercializa el 30% de la producción piscícola del estado, y una zona industrial con fábricas de pasta, harinas y cemento. El 24 de junio de 2026, la zona sufrió uno de los impactos más dramáticos del terremoto, con derrumbes en complejos residenciales y una grave escasez de recursos de rescate.",
    "aboutTitle": "Puerto pesquero La Zorra y la industria de pasta de Catia La Mar"
  },
  {
    "slug": "vitarte",
    "name": "Vitarte",
    "kind": "ciudad",
    "icon": "💬",
    "users": 145,
    "votes": 232,
    "activity": "Alta",
    "parentName": "Perú",
    "parentSlug": "peru",
    "provincia": "Provincia de Lima",
    "regionSlug": "provincia-de-lima",
    "channels": [
      "peru",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "peru",
      "lima",
      "callao",
      "amistad",
      "amor"
    ],
    "intro": "Vitarte, capital del distrito de Ate en la ciudad de Lima, Perú, es un barrio obrero y Patrimonio Cultural de la Nación desde 1990.",
    "about": "Vitarte es una localidad, capital y casco histórico del distrito de Ate, en la ciudad de Lima, capital del Perú. La zona es famosa por ser un barrio obrero y ser la capital del distrito de Ate. En 1871, se construye la Fábrica Textil de Vitarte por Carlos López Aldana.​ En 1896, se realizó la primera huelga de obreros en el Perú.​​​​​ El 13 de febrero de 1951, la capital del distrito pasó del pueblo de Ate al pueblo de Vitarte, lo que dio origen a que el distrito sea llamado «Ate Vitarte». La localidad cuenta con varios lugares de interés, como la Plaza de armas de Vitarte, la Municipalidad distrital de Ate, el Centro Cultural de Ate y el Parque 26 de Mayo. También es conocida por su Centro educativo emblemático, el Colegio Edelmira del Pando, fundada en 1961.\n\n La zona es Patrimonio Cultural de la Nación desde el 15 de marzo de 1990, lo que refleja su importancia histórica y cultural en el país.",
    "aboutTitle": "Vitarte, un barrio obrero en el corazón de Lima"
  },
  {
    "slug": "comas",
    "name": "Comas",
    "kind": "ciudad",
    "icon": "💬",
    "users": 134,
    "votes": 220,
    "activity": "Alta",
    "parentName": "Perú",
    "parentSlug": "peru",
    "provincia": "Provincia de Lima",
    "regionSlug": "provincia-de-lima",
    "channels": [
      "peru",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "peru",
      "lima",
      "callao",
      "vitarte",
      "huacho",
      "amistad",
      "amor"
    ],
    "intro": "Comas, distrito limeño que limita al norte con Carabayllo y al este con San Juan de Lurigancho, destaca por su ubicación en el valle del río Chillón.",
    "about": "Comas es uno de los cuarenta y tres distritos que conforman la provincia de Lima, en el departamento homónimo del Perú. El distrito se sitúa en el valle de Carabayllo, en la parte baja del río Chillón. Limita al norte con el distrito de Carabayllo; al este con el distrito de San Juan de Lurigancho; al sur con el distrito de Independencia; y al oeste con los distritos de Los Olivos y Puente Piedra. Su posición geográfica lo convierte en una zona de transición entre la zona costera y la sierra.\n\nEn la época prehispánica el territorio formó parte del extenso señorío llamado Culli, Colli o Collec, más tarde castellanizado como Collique. Según Fray Domingo de Santo Tomás, el término colliruna significa “diligente”, y Diego González Holguín lo describe como “mucho brío y esfuerzo por el trabajo, diligente e incansable”. En el cerro Choquen y el cerro Collique se ubicaron dos fuertes militares que defendían el señorío, que contaba con extensos campos de cultivo y manantiales de agua. El señorío de Colli comprendía desde el litoral hasta la actual Santa Rosa de Quives, y sus habitantes rechazaban los ataques enemigos gracias a sus fortalezas. La presencia de la cultura Huari a partir del año 600 también dejó huellas en la zona, aunque en el valle del Chillón no se ha encontrado un centro administrativo y religioso de la magnitud de Cajamarquilla, lo que sugiere un control indirecto del valle.",
    "aboutTitle": "Comas y el valle del río Chillón: historia y límites"
  },
  {
    "slug": "villa-el-salvador",
    "name": "Villa El Salvador",
    "kind": "ciudad",
    "icon": "💬",
    "users": 141,
    "votes": 226,
    "activity": "Alta",
    "parentName": "Perú",
    "parentSlug": "peru",
    "provincia": "Provincia de Lima",
    "regionSlug": "provincia-de-lima",
    "channels": [
      "peru",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "peru",
      "lima",
      "vitarte",
      "callao",
      "comas",
      "amistad",
      "amor"
    ],
    "intro": "Villa El Salvador, un distrito de Lima Sur con una superficie de 35,46 km², es el tercer distrito con menor extensión en la zona.",
    "about": "Villa El Salvador es un distrito ubicado en la provincia de Lima, en el Perú. Limita al norte con el distrito de San Juan de Miraflores, al este con el distrito de Villa María del Triunfo, al sur con el distrito de Lurín y al oeste con el océano Pacífico y el distrito de Chorrillos. El nombre del distrito fue propuesto por el monseñor Luis Bambarén, quien tomó el nombre de 'Villa' por ser un lugar poblado y distinguido de otros lugares, y 'El Salvador' en homenaje a Jesucristo.\n\nEl distrito nació como un asentamiento humano en mayo de 1971, cuando un grupo de pobladores invadió unos terrenos erizados ubicados en Pamplona, distrito de San Juan de Miraflores. Luego de varios días de negociaciones con el gobierno revolucionario, los pobladores fueron reubicados en unos arenales situados a 25 kilómetros al sur de Lima, denominándose 'Pueblo Joven Villa El Salvador'.",
    "aboutTitle": "Historia y creación de Villa El Salvador"
  },
  {
    "slug": "limon-costa-rica",
    "name": "Limón",
    "kind": "ciudad",
    "icon": "💬",
    "users": 137,
    "votes": 226,
    "activity": "Media",
    "parentName": "Costa Rica",
    "parentSlug": "costa-rica",
    "provincia": "Provincia de Limón",
    "regionSlug": "provincia-de-limon",
    "channels": [
      "costa_rica",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "cartago",
      "costa-rica",
      "san-jose",
      "heredia",
      "bocas-del-toro",
      "amistad",
      "amor"
    ],
    "intro": "El limón es el nombre de tres frutas cítricas de sabor ácido que destacan por su contenido de 501,6 mg/l de vitamina C y sus diversos usos culinarios.",
    "about": "El término limón se refiere a tres frutas cítricas ácidas y fragantes obtenidas de los árboles Citrus × aurantifolia, Citrus × limon y Citrus × latifolia. Este fruto destaca por su aporte de 501,6 mg/l de vitamina C y 49,88 g/l de ácido cítrico, además de contener ácidos orgánicos y flavonoides. Su jugo se emplea habitualmente en la gastronomía como condimento e ingrediente, ayudando también a mejorar la absorción del hierro de origen vegetal. En el ámbito culinario, se utiliza para elaborar dulces como el limón relleno de cocada en México, el Taralli en Italia o la tarta de limón. También es un ingrediente común en bebidas como la limonada y la leche merengada, y sus rodajas sirven para decorar cócteles y refrescos. En la preparación de licores, destaca el limoncello italiano, elaborado mediante la maceración de su cáscara en alcohol. Asimismo, el jugo de este cítrico se usa en salsas, aliños, vinagretas y en platos como el ceviche latinoamericano, donde se marina la carne de pescado o marisco, además de servir como acompañamiento para caldos y carnes en diversas culturas.",
    "aboutTitle": "El cítrico que da nombre a Limón, Costa Rica"
  },
  {
    "slug": "chorrillos",
    "name": "Chorrillos",
    "kind": "ciudad",
    "icon": "💬",
    "users": 121,
    "votes": 209,
    "activity": "Alta",
    "parentName": "Perú",
    "parentSlug": "peru",
    "provincia": "Provincia de Lima",
    "regionSlug": "provincia-de-lima",
    "channels": [
      "peru",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "villa-el-salvador",
      "peru",
      "lima",
      "vitarte",
      "callao",
      "amistad",
      "amor"
    ],
    "intro": "Chorrillos es un distrito de la provincia de Lima que debe su nombre a los chorrillos de agua dulce que fluían de sus acantilados hacia la playa.",
    "about": "Este distrito de la provincia de Lima, en Perú, limita al norte con Barranco y Santiago de Surco, al este con San Juan de Miraflores y Villa El Salvador, y por el sur y el oeste con el océano Pacífico. Su denominación oficial de San Pedro de los Chorrillos proviene de los flujos de agua dulce subterránea que corrían por sus acantilados hacia la playa Agua Dulce, además de su origen como un asentamiento de pescadores.\n\nLa historia local registra que en 1679 el virrey Pedro Antonio Fernández de Castro, Conde de Lemos, visitó el lugar atraído por sus baños y su clima. Posteriormente, en 1688, se establecieron pobladores indígenas dedicados a la pesca en Surco sobre tierras donadas por el alférez Francisco Carranza, un crecimiento que continuó gracias a las donaciones de Francisco Pérez Cormenante. Durante la época republicana, el sitio sirvió como puerto para los patriotas ante la resistencia española en la Fortaleza del Real Felipe, convirtiéndose luego en un concurrido lugar de recreo. Bajo el mandato de Agustín Gamarra las viviendas de caña y totora pasaron a ser de adobe, y en el gobierno de Ramón Castilla se iniciaron las obras del antiguo malecón entablado.",
    "aboutTitle": "San Pedro de los Chorrillos y sus antiguos acantilados de agua dulce"
  },
  {
    "slug": "general-escobedo",
    "name": "General Escobedo",
    "kind": "ciudad",
    "icon": "💬",
    "users": 154,
    "votes": 265,
    "activity": "Alta",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Nuevo León",
    "regionSlug": "nuevo-leon",
    "channels": [
      "nuevo_leon",
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "monterrey",
      "apodaca",
      "guadalupe-nuevo-leon",
      "allende",
      "saltillo",
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "General Escobedo es una ciudad industrial de Nuevo León fundada sobre las tierras que el capitán José de Treviño recibió en el año 1604.",
    "about": "General Escobedo es una ciudad industrial situada en el estado de Nuevo León, integrada en la zona metropolitana de Monterrey, al noreste de México. Su nombre rinde homenaje al general Mariano Escobedo, destacado por vencer en la segunda intervención del Imperio francés. El origen de la localidad se remonta al 25 de abril de 1604, fecha en la que el gobernador Diego de Montemayor otorgó una merced de tierras al capitán José de Treviño, considerado el fundador de la población. Posteriormente, su hijo José de Ayala se convirtió en el poblador definitivo al establecer la Hacienda del Topo de San Nicolás Tolentino, conocida también como Topo de los Ayala o Topo Grande.\n\nEsta hacienda dependió de la jurisdicción de Monterrey hasta 1830, año en que pasó a formar parte de San Nicolás de los Garza. Tras manifestar sus habitantes el deseo de separarse de dicho territorio en 1867, el gobernador Jerónimo Treviño firmó el decreto número 15 el 24 de febrero de 1868, estableciendo oficialmente la Villa de General Escobedo. En el aspecto geográfico, el municipio destaca por elevaciones como el cerro del Topo Chico y la sierra del Fraile, cuyas formaciones de calizas y lutitas pertenecen a la era mesozoica, dentro de la subprovincia de la Llanura Costera del Golfo Norte.",
    "aboutTitle": "La fundación de General Escobedo y el cerro del Topo Chico"
  },
  {
    "slug": "hidalgo-michoacan",
    "name": "Hidalgo",
    "kind": "ciudad",
    "icon": "💬",
    "users": 113,
    "votes": 187,
    "activity": "Media",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Michoacán",
    "regionSlug": "michoacan",
    "channels": [
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "morelia",
      "valle-de-bravo",
      "atlacomulco-de-fabela",
      "san-francisco-tlalcilalcalpan",
      "san-antonio-acahualco",
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "Chat de Hidalgo, municipio de Michoacán situado en el Eje Neovolcánico que cuenta con la zona geotérmica de Los Azufres y el volcán San Andrés.",
    "about": "Hidalgo es uno de los ciento trece municipios que conforman el estado mexicano de Michoacán, situado en la región socioeconómica Oriente, al noreste del estado. Su cabecera municipal es Ciudad Hidalgo y limita con los términos de Zinapécuaro, Maravatío, Irimbo, Tuxpan, Jungapeo, Tuzantla, Tzitzio y Queréndaro. El territorio está atravesado por el Eje Neovolcánico, donde destaca la zona geotérmica de Los Azufres, un atractivo turístico que alberga el volcán San Andrés. Asimismo, el municipio cuenta con parte del Parque nacional Cerro de Garnica y zonas cársticas como las Grutas de Tziranda. La hidrografía de Hidalgo pertenece a la cuenca del río Balsas, siendo los ríos Taximaroa, Agostitlán y Turundeo sus corrientes principales. Al sureste de la cabecera municipal, el relieve es montañoso y alberga poblaciones como El Caracol, San Antonio, Huajumbaro, Sabaneta, Mata de Pinos y Pucuato, esta última con su presa. En el aspecto demográfico, el municipio registró una población de 125.712 habitantes en el año 2020, frente a los 117.620 habitantes censados en 2010. La densidad de población era de 109,9 habitantes por kilómetro cuadrado, bajo un clima templado subhúmedo de montaña con invierno seco y verano suave.",
    "aboutTitle": "La geografía de Hidalgo entre Los Azufres y el río Taximaroa"
  },
  {
    "slug": "palermo-colombia",
    "name": "Palermo",
    "kind": "ciudad",
    "icon": "💬",
    "users": 153,
    "votes": 259,
    "activity": "Alta",
    "parentName": "Colombia",
    "parentSlug": "colombia",
    "provincia": "Huila",
    "regionSlug": "huila",
    "channels": [
      "colombia",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "neiva",
      "campoalegre",
      "la-plata-huila",
      "garzon",
      "chaparral",
      "colombia",
      "amistad",
      "amor"
    ],
    "intro": "Chat de Palermo, municipio del Huila con 917 km² de territorio y clima de 27 °C, espacio para conversar sobre su vida y entorno.",
    "aboutTitle": "Palermo: 917 km² en el alto del valle del Magdalena",
    "about": "Palermo es un municipio colombiano situado en el noroccidente del departamento del Huila, dentro de la región andina y del SubNorte del departamento. Ocupa 917 km² en el alto del valle del Magdalena, a una altitud de 690 metros sobre el nivel del mar, y su temperatura promedio ronda los 27 °C. La ubicación geográfica le brinda una mezcla de paisajes de montaña y llanura, y su entorno natural forma parte de la cordillera Central.\\n\\nEn la sala de chat de Palermo los habitantes y visitantes intercambian información sobre la cotidianidad del municipio: actividades locales, clima, agricultura, eventos comunitarios y cualquier tema de interés para la gente de la zona. La conversación está abierta a residentes, emigrantes y a quien quiera conocer más sobre este punto del Huila, fomentando un espacio de diálogo cercano y directo."
  },
  {
    "slug": "abasto",
    "name": "Abasto",
    "kind": "ciudad",
    "icon": "💬",
    "users": 158,
    "votes": 263,
    "activity": "Alta",
    "parentName": "Argentina",
    "parentSlug": "argentina",
    "provincia": "Provincia de Buenos Aires",
    "regionSlug": "provincia-de-buenos-aires",
    "channels": [
      "argentina",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "la-plata",
      "brandsen",
      "san-vicente-misiones",
      "quilmes",
      "lomas-de-zamora",
      "argentina",
      "amistad",
      "amor"
    ],
    "intro": "Chat de Abasto, la sala de conversación para residentes y visitantes de la zona del km 55 de la Autovía 2, en el partido de La Plata, Buenos Aires.",
    "aboutTitle": "Conversaciones en el km 55 de la Autovía 2 de Abasto",
    "about": "Abasto es una zona del partido de La Plata, en la provincia de Buenos Aires, situada a la altura del kilómetro 55 de la Autovía 2. La zona se encuentra en el sector este‑sur del partido, y su ubicación permite el acceso mediante dos rutas principales. Desde el este, la avenida 520 conecta con la Ruta Provincial 36, ofreciendo una vía de ingreso directa. Desde el sur, la avenida 208 enlaza con la avenida 44 en la localidad de Lisandro Olmos, proporcionando otra alternativa de acceso. Ambas avenidas convergen en la proximidad de la Autovía 2, lo que sitúa a Abasto en una posición estratégica para el tránsito vehicular. La zona forma parte del entramado urbano del Gran La Plata y está incluida dentro de la jurisdicción del municipio de La Plata. Estas características geográficas son las que definen la forma de llegar a Abasto. El trazado de estas vías responde a la planificación urbana del área, garantizando una circulación fluida entre los distintos puntos del partido."
  },
  {
    "slug": "ate",
    "name": "Ate",
    "kind": "ciudad",
    "icon": "💬",
    "users": 157,
    "votes": 261,
    "activity": "Alta",
    "parentName": "Perú",
    "parentSlug": "peru",
    "provincia": "Provincia de Lima",
    "regionSlug": "provincia-de-lima",
    "channels": [
      "peru",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "peru",
      "lima",
      "callao",
      "amistad",
      "amor"
    ],
    "intro": "Ate, también conocido como Ate Vitarte, es un distrito de la provincia de Lima fundado por el general José de San Martín el 4 de agosto de 1821.",
    "aboutTitle": "La historia de Ate y el traslado de su capital a Vitarte",
    "about": "El distrito de Ate, también conocido como Ate Vitarte, es uno de los cuarenta y tres distritos que conforman la provincia de Lima, en el Perú. Fue fundado mediante una ley expresa el 4 de agosto de 1821 por el general José de San Martín, a los pocos días de declararse la independencia del país. Esta norma legal creó la provincia de Lima y estableció sus primeros distritos, entre los que se encontraban Ancón, Carabayllo, Lurigancho-Chosica, Pachacámac, Chorrillos, Lima y el propio Ate, donde además existen diversos sitios arqueológicos que evidencian una ocupación humana anterior.\n\nEste territorio de gran extensión en Lima Este limita con múltiples distritos como Lurigancho-Chosica, Chaclacayo, Cieneguilla, Pachacámac, La Molina, Santiago de Surco, San Borja, San Luis, El Agustino y Santa Anita. La ciudad de Ate funcionó como la capital del distrito hasta el 13 de febrero de 1951, fecha en la que el Congreso de la República dispuso por ley que la capitalidad pasara a la ciudad de Vitarte. El origen del término Ate proviene según historiadores de la expresión aimara Late, de una posible civilización preincaica, o del quechua Atiq, que significa ganador. Por su parte, el nombre de Vitarte deriva del apellido de la familia española Ubitarte, antiguos propietarios de la hacienda del mismo nombre que ocupaba gran parte del distrito actual."
  },
  {
    "slug": "heroica-matamoros",
    "name": "Heroica Matamoros",
    "kind": "ciudad",
    "icon": "💬",
    "users": 129,
    "votes": 213,
    "activity": "Alta",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Tamaulipas",
    "regionSlug": "tamaulipas",
    "channels": [
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "reynosa",
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "Heroica Matamoros se ubica al sur de la boca del río Bravo y cuenta con una población de 510.739 habitantes en el estado mexicano de Tamaulipas.",
    "aboutTitle": "Una ciudad industrial e histórica junto al río Bravo",
    "about": "Heroica Matamoros es una ciudad mexicana del estado de Tamaulipas, situada al sur de la boca del río Bravo, justo en la frontera con la ciudad estadounidense de Brownsville, Texas. Según el censo del año 2020, cuenta con una población de 510.739 habitantes, lo que la convierte en la segunda localidad más poblada de este estado. Su economía se sostiene principalmente en el comercio internacional con los Estados Unidos y en un sólido sector industrial impulsado por empresas maquiladoras. Además, alberga plantas de grandes corporaciones de la industria automotriz como Chrysler, Ford y General Motors, y destaca en el sector agrícola al poseer las mayores zonas de irrigación del norte del país.\n\nEsta localidad posee una gran relevancia histórica en México, habiendo sido escenario de diversos combates y acontecimientos durante la Independencia, la Revolución mexicana, la Revolución Texana, la Guerra Civil estadounidense, la Invasión de Estados Unidos y la Intervención francesa. Debido a estos sucesos, la ciudad ostenta los títulos de Heroica, Invicta y Leal. En el ámbito energético, el puerto local fue objeto de un proyecto de la compañía estatal Pemex que finalmente se canceló en 2017, abriendo el paso a la inversión privada extranjera."
  },
  {
    "slug": "maipu-chile",
    "name": "Maipú",
    "kind": "ciudad",
    "icon": "💬",
    "users": 127,
    "votes": 213,
    "activity": "Alta",
    "parentName": "Chile",
    "parentSlug": "chile",
    "provincia": "Región Metropolitana de Santiago",
    "regionSlug": "region-metropolitana-de-santiago",
    "channels": [
      "chile",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "chile",
      "santiago-de-chile",
      "rancagua",
      "san-antonio-chile",
      "quillota",
      "amistad",
      "amor"
    ],
    "intro": "Maipú, segunda comuna más poblada de Chile, con 503.635 habitantes según el censo de 2024, ubicada en el sector surponiente de la ciudad de Santiago.",
    "aboutTitle": "Maipú, la cuna de la independencia chilena",
    "about": "Maipú es una comuna ubicada en la provincia de Santiago, dentro de la región Metropolitana de Santiago. El nombre de la comuna proviene de una derivación de la palabra «Maipo» (del mapudungun: maypun, lugar arado). En 1891, con la Ley de Comuna Autónoma, las tierras fueron llamadas «Maipú» y se llevó a cabo la creación de la Municipalidad de Maipú. La comuna es conocida por ser el lugar de la batalla de Maipú, el 5 de abril de 1818, considerada un momento clave en la consolidación de la independencia de Chile. La Capilla de la Victoria, iniciada en 1818 y finalizada en 1892, y posteriormente reconstruida después de un terremoto en 1906, es otro de sus puntos destacados. En 1942, se decidió construir un grandioso santuario en Maipú para honrar a la Virgen del Carmen."
  },
  {
    "slug": "florencio-varela-argentina",
    "name": "Florencio Varela",
    "kind": "ciudad",
    "icon": "💬",
    "users": 129,
    "votes": 207,
    "activity": "Alta",
    "parentName": "Argentina",
    "parentSlug": "argentina",
    "provincia": "Provincia de Buenos Aires",
    "regionSlug": "provincia-de-buenos-aires",
    "channels": [
      "argentina",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "quilmes",
      "lomas-de-zamora",
      "lanus",
      "argentina",
      "buenos-aires",
      "amistad",
      "amor"
    ],
    "intro": "Chat de Florencio Varela, partido de la provincia de Buenos Aires; su cabecera es la Ciudad de Florencio Varela, oficialmente San Juan Bautista.",
    "aboutTitle": "Polideportivo La Patriada y la Ciudad de San Juan Bautista en Varela",
    "about": "Florencio Varela es uno de los 135 partidos de la provincia de Buenos Aires. Su cabecera lleva el mismo nombre y está oficialmente denominada San Juan Bautista. En el municipio destacan equipamientos como el Polideportivo La Patriada, el Polideportivo Néstor Kirchner y el Parque Thevenet, además de un Mercado Municipal activo y una agenda de actividades gratuitas. La comunidad también cuenta con proyectos de desarrollo social, como el programa de tramitación gratuita de documentación que benefició a 200 vecinos recientemente. El servicio de radio en vivo y la plataforma Meteovarela ofrecen información meteorológica y de actualidad. El portal de empleo y el mercado municipal facilitan la búsqueda de trabajo y la compra de productos locales. Las redes municipales difunden noticias y eventos mediante hashtags como #ViviendasSociales y #Seguridad."
  },
  {
    "slug": "corrientes-provincia-de-corrientes",
    "name": "Corrientes",
    "kind": "ciudad",
    "icon": "💬",
    "users": 132,
    "votes": 212,
    "activity": "Alta",
    "parentName": "Argentina",
    "parentSlug": "argentina",
    "provincia": "Provincia de Corrientes",
    "regionSlug": "provincia-de-corrientes",
    "channels": [
      "argentina",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "resistencia",
      "san-luis-del-palmar",
      "saladas",
      "bella-vista",
      "general-jose-de-san-martin",
      "argentina",
      "amistad",
      "amor"
    ],
    "intro": "Corrientes, la ciudad más antigua del Nordeste argentino, destaca por sus fiestas de carnaval y su ubicación a orillas del río Paraná.",
    "aboutTitle": "Corrientes y la Fiesta Nacional del Chamamé",
    "about": "Corrientes es la capital y el principal centro administrativo, social y económico de su provincia homónima, en Argentina. Fundada el 3 de abril de 1588 por Juan Torres de Vera y Aragón bajo el nombre de Ciudad de Vera, destaca como la localidad más antigua de la región del Nordeste argentino. Su ubicación geográfica se sitúa a orillas de un recodo del río Paraná, a unos 50 kilómetros aguas abajo de su confluencia con el río Paraguay y aproximadamente a 1.150 kilómetros de la desembocadura en el Río de la Plata. El municipio comprende también un conjunto de islas, entre las que se encuentran Pelón, Talar, Meza, Hernández, Noguera, Platero, Cabral, de la Palomera, Latorre y Pindó. El nombre original de Siete Corrientes alude a las siete penínsulas de su costa que generan fuertes corrientes de agua.\n\nLa administración pública constituye su actividad principal, complementada por su rol como centro universitario y de salud. El puente General Manuel Belgrano conecta la ciudad con Barranqueras y Resistencia, en la provincia del Chaco, facilitando el tránsito diario de miles de personas. La comunicación terrestre se realiza principalmente a través de la Ruta Nacional 12, disponiendo además de un puerto y del aeropuerto con código CNQ. En el aspecto cultural, la ciudad es reconocida por sus fiestas de carnaval y por la Fiesta Nacional del Chamamé, un evento que se celebra con éxito a mediados de enero desde la década de 1980."
  },
  {
    "slug": "simon-bolivar-anzoategui",
    "name": "Simón Bolívar",
    "kind": "ciudad",
    "icon": "💬",
    "users": 155,
    "votes": 266,
    "activity": "Alta",
    "parentName": "Venezuela",
    "parentSlug": "venezuela",
    "provincia": "Anzoátegui",
    "regionSlug": "anzoategui",
    "channels": [
      "venezuela",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "barcelona-venezuela",
      "puerto-la-cruz",
      "cumana",
      "venezuela",
      "amistad",
      "amor"
    ],
    "intro": "Sala de chat de Simón Bolívar, municipio más poblado de Anzoátegui y sede de Barcelona, capital del estado, punto de encuentro para residentes y visitantes.",
    "aboutTitle": "Barcelona y el municipio más poblado de Anzoátegui",
    "about": "Simón Bolívar es el municipio más poblado del Estado Anzoátegui, en el noreste de Venezuela. Su capital es Barcelona, la ciudad más grande de la región, y abarca una superficie de 1.706 km². Con una población de 520.122 habitantes, incluye zonas urbanas y menos densas. La diversidad de su territorio y su importancia en la región atraen a personas de distintos intereses y orígenes. En el Chat de Simón Bolívar se reúnen vecinos, estudiantes y personas vinculadas a la zona para hablar de la vida local, eventos en Barcelona, temas de la región y asuntos cotidianos. Es un espacio para quienes conocen el municipio o quieren informarse sobre él. En la sala, es común encontrar conversaciones sobre la historia y el desarrollo de la zona, así como discusiones sobre temas de actualidad y eventos culturales en Barcelona. También se comparten experiencias y consejos sobre la vida en el municipio, lo que la convierte en un punto de encuentro valioso para los interesados en Simón Bolívar."
  },
  {
    "slug": "la-florida",
    "name": "La Florida",
    "kind": "ciudad",
    "icon": "💬",
    "users": 146,
    "votes": 254,
    "activity": "Alta",
    "parentName": "Chile",
    "parentSlug": "chile",
    "provincia": "Región Metropolitana de Santiago",
    "regionSlug": "region-metropolitana-de-santiago",
    "channels": [
      "chile",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "chile",
      "santiago-de-chile",
      "maipu-chile",
      "rancagua",
      "san-antonio-chile",
      "amistad",
      "amor"
    ],
    "intro": "Conecta con la gente de La Florida, comuna del sector suroriente de Santiago de Chile que cuenta con una población de 374.863 habitantes.",
    "aboutTitle": "Una comuna de Santiago nacida entre las tierras de Lo Cañas",
    "about": "La Florida es una comuna residencial ubicada en el sector suroriente de la ciudad de Santiago, la capital de Chile. Limita al norte con Macul y Peñalolén, al este con San José de Maipo, al sur con Puente Alto y al oeste con San Joaquín, La Granja y La Pintana. Actualmente cuenta con 374.863 habitantes, lo que la posiciona como la quinta comuna más poblada del país, por detrás de Antofagasta, Puente Alto, Santiago y Maipú. Anteriormente, durante la década de 1980 y parte de los años 1990, ostentó el registro de ser la comuna con mayor población de todo Chile.\n\nHistóricamente, durante el siglo XIX, este territorio precordillerano estuvo habitado por campesinos y medieros dedicados al cultivo de la tierra en diversas haciendas, entre las cuales la más conocida era la Hacienda de Lo Cañas. Este sector fue el escenario de la masacre de Lo Cañas durante la Guerra Civil de 1891. Tras el Decreto de Creación de Municipalidades de diciembre de ese mismo año, se estableció la Municipalidad de Lo Cañas, que posteriormente fue suprimida en 1892 para dar paso a las municipalidades de Puente Alto y La Granja. En la actualidad, esta comuna compuesta principalmente por familias de nivel socioeconómico medio destaca en el duodécimo puesto nacional en términos de Índice de Desarrollo Humano."
  },
  {
    "slug": "santo-domingo-oeste",
    "name": "Santo Domingo Oeste",
    "kind": "ciudad",
    "icon": "💬",
    "users": 140,
    "votes": 237,
    "activity": "Alta",
    "parentName": "República Dominicana",
    "parentSlug": "republica-dominicana",
    "provincia": "Provincia Santo Domingo",
    "regionSlug": "provincia-santo-domingo",
    "channels": [
      "republica_dominicana",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "san-cristobal-rd",
      "santo-domingo-este",
      "bani",
      "san-pedro-de-macorris",
      "republica-dominicana",
      "amistad",
      "amor"
    ],
    "intro": "Santo Domingo Oeste es un municipio dominicano con 410.578 habitantes creado en 2001 tras la división del antiguo Distrito Nacional.",
    "aboutTitle": "Santo Domingo Oeste y la actividad económica de Herrera",
    "about": "Santo Domingo Oeste es un municipio perteneciente a la provincia de Santo Domingo, en la República Dominicana. Su creación se remonta al 16 de octubre de 2001 bajo la Ley 163-01, como consecuencia de la división del antiguo Distrito Nacional. Este territorio abarca una extensión aproximada de 54 kilómetros cuadrados en la parte occidental del Gran Santo Domingo. Limita al norte con la autopista Duarte, al este con el Distrito Nacional, al oeste con los municipios de Los Alcarrizos y San Cristóbal, y al sur con el Distrito Nacional y el mar Caribe. Según las estimaciones del censo de 2022, el municipio tiene una población de 410.578 habitantes, posicionándose como una de las demarcaciones más densamente pobladas del territorio dominicano.\n\nDesde su fundación, este municipio ha experimentado un crecimiento acelerado en población e infraestructura, impulsado por la expansión urbana de la capital y por la migración interna desde el sur del país. Su territorio integra zonas residenciales, comerciales e industriales que reciben constantes inversiones. Entre sus sectores más destacados se encuentran Herrera, Manoguayabo, Hato Nuevo, Las Caobas, El Café, Bayona, Engombe, Bienvenido, Buenos Aires de Herrera, Villa Aura, Las Palmas, La Altagracia, Olimpo y El Libertador. El sector de Herrera destaca especialmente como uno de los polos económicos más activos de la zona, gracias a su ubicación estratégica cerca de vías principales y a su importante zona industrial."
  },
  {
    "slug": "ventanilla",
    "name": "Ventanilla",
    "kind": "ciudad",
    "icon": "💬",
    "users": 152,
    "votes": 246,
    "activity": "Alta",
    "parentName": "Perú",
    "parentSlug": "peru",
    "channels": [
      "peru",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "peru",
      "lima",
      "callao",
      "ate",
      "huacho",
      "amistad",
      "amor"
    ],
    "intro": "Ventanilla, distrito costero del Callao, Perú, con una rica historia y paisajes naturales únicos que atraen a muchos visitantes y residentes.",
    "aboutTitle": "Ventanilla, un distrito costero con historia",
    "about": "Ventanilla es un distrito ubicado en la provincia constitucional del Callao, en el Perú. Es el distrito más extenso y el segundo más poblado de la provincia. Limita al norte con el distrito de Santa Rosa y el distrito de Ancón; al este con el distrito de Mi Perú y el distrito de Puente Piedra; al Sur con el río Chillón, el distrito de San Martín de Porres y el distrito del Callao; y al oeste con el océano Pacífico. La historia de Ventanilla se remonta a la época de los corsarios y piratas que navegaban por el mar del Callao. La creación de Ventanilla como distrito se dio en 1969, teniendo como antecedente inmediato la ocupación de la Ciudad satélite que estaba en los arenales del oeste. La zona es conocida por sus paisajes naturales y su rica historia, que atraen a muchos visitantes y residentes."
  },
  {
    "slug": "santa-catarina",
    "name": "Santa Catarina",
    "kind": "ciudad",
    "icon": "💬",
    "users": 157,
    "votes": 259,
    "activity": "Alta",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Nuevo León",
    "regionSlug": "nuevo-leon",
    "channels": [
      "nuevo_leon",
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "monterrey",
      "guadalupe-nuevo-leon",
      "saltillo",
      "allende",
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "Chat de Santa Catarina: la sala de conversación para residentes de la Ciudad Santa Catarina, cabecera del municipio y la zona metropolitana de Monterrey.",
    "aboutTitle": "Ciudad Santa Catarina, cabecera del municipio en Monterrey",
    "about": "Santa Catarina, cuyo nombre completo es Ciudad Santa Catarina, es una ciudad mexicana situada en el estado de Nuevo León. Es la cabecera del municipio de Santa Catarina y forma parte de la Zona Metropolitana de Monterrey, lo que la sitúa en un importante eje urbano del norte del país. La localidad combina la vida urbana con la cercanía a áreas industriales y comerciales de la gran metrópolis, ofreciendo a sus habitantes acceso a servicios y a una red de transporte que la conecta con el resto de la región. \n\nEn la sala de chat de Santa Catarina se comentan temas de interés local: noticias municipales, eventos culturales, actividades deportivas y la vida cotidiana de los residentes. Participan vecinos, jóvenes y adultos que buscan intercambiar opiniones, organizar encuentros y mantenerse informados sobre lo que ocurre en su comunidad. La conversación se mantiene en tono respetuoso y centrado en la realidad de la ciudad, fomentando la participación ciudadana y el sentido de pertenencia."
  },
  {
    "slug": "san-juan-sacatepequez",
    "name": "San Juan Sacatepéquez",
    "kind": "ciudad",
    "icon": "💬",
    "users": 129,
    "votes": 218,
    "activity": "Alta",
    "parentName": "Guatemala",
    "parentSlug": "guatemala",
    "provincia": "Departamento de Guatemala",
    "regionSlug": "departamento-de-guatemala",
    "channels": [
      "guatemala",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "mixco",
      "guatemala",
      "ciudad-de-guatemala",
      "antigua-guatemala",
      "villa-nueva",
      "amistad",
      "amor"
    ],
    "intro": "San Juan Sacatepéquez es un municipio del departamento de Guatemala con 242 km² de superficie y 218 156 habitantes según Censo 2018.",
    "aboutTitle": "El nacimiento del río Motagua en San Juan Sacatepéquez",
    "about": "San Juan Sacatepéquez es un municipio del departamento de Guatemala de la región metropolitana de la República de Guatemala. Su nombre proviene del náhuatl y significa «en el cerro cubierto de hierba», en honor a su santo patrono Juan el Bautista. El nacimiento del río Motagua se encuentra en la cuenca ubicada en el límite entre San Juan Sacatepéquez, y los departamentos de Baja Verapaz y Quiché.\n\nEl municipio celebra su fiesta patronal el 24 de junio y es uno de los municipios más grandes del departamento de Guatemala. Con un total de 206 lugares poblados, San Juan Sacatepéquez se posiciona como el quinto municipio más poblado de Guatemala."
  },
  {
    "slug": "carabayllo",
    "name": "Carabayllo",
    "kind": "ciudad",
    "icon": "💬",
    "users": 140,
    "votes": 241,
    "activity": "Alta",
    "parentName": "Perú",
    "parentSlug": "peru",
    "provincia": "Provincia de Lima",
    "regionSlug": "provincia-de-lima",
    "channels": [
      "peru",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "peru",
      "lima",
      "callao",
      "huacho",
      "amistad",
      "amor"
    ],
    "intro": "Carabayllo es el distrito más extenso de la provincia de Lima y se ubica a ambas márgenes del río Chillón, abasteciendo con sus productos agropecuarios.",
    "aboutTitle": "El distrito más extenso de Lima y el río Chillón",
    "about": "Carabayllo es uno de los cuarenta y tres distritos que conforman la provincia de Lima, en el departamento homónimo en el Perú. Se trata del distrito más extenso de la provincia de Lima y se ubica en ambas márgenes del río Chillón, el cual nace en la cordillera de La Viuda, en Canta. Sus productos agropecuarios son clave, ya que abastecen los mercados de Lima Metropolitana. En el aspecto eclesiástico, pertenece a la diócesis de Carabayllo. Limita con distritos como Santa Rosa de Quives al norte y noreste, San Antonio de Chaclla al este, San Juan de Lurigancho al sureste, Comas al sur, y Puente Piedra y Ancón al oeste.\n\nEl origen de su nombre cuenta con varias interpretaciones. Una de ellas sugiere que deriva de la voz quechua qarwayllu, que significa nubes anaranjadas o arreboles costeños. Otra teoría señala que el término proviene de Karhuaruna, que se traduce como el descolorido rostro, y ayllu, que significa linaje o parentesco. Históricamente, tras la derrota de las huestes del Colli Cápac por las tropas de Túpac Yupanqui, los varones adultos del lugar fueron reemplazados por mitmaqs aymaras que se establecieron en el ayllu Cararua. Además, su nombre oficial destaca por ser uno de los pocos topónimos en español que puede escribirse con tilde en la letra y, quedando como Carabaýllo."
  },
  {
    "slug": "lurigancho-chosica",
    "name": "Lurigancho-Chosica",
    "kind": "ciudad",
    "icon": "💬",
    "users": 140,
    "votes": 245,
    "activity": "Alta",
    "parentName": "Perú",
    "parentSlug": "peru",
    "provincia": "Provincia de Lima",
    "regionSlug": "provincia-de-lima",
    "channels": [
      "peru",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "carabayllo",
      "peru",
      "lima",
      "callao",
      "amistad",
      "amor"
    ],
    "intro": "Lurigancho-Chosica, situado en la cuenca media del río Rímac, registró una población de 303.966 habitantes en 2023 dentro de la provincia de Lima.",
    "aboutTitle": "Historia y geografía de Lurigancho-Chosica en el río Rímac",
    "about": "Lurigancho-Chosica, conocido habitualmente como Chosica, es uno de los cuarenta y tres distritos que integran la provincia de Lima, en el departamento homónimo de Perú. Geográficamente, se sitúa en la zona este de Lima, ocupando la cuenca media del río Rímac. En el año 2023, el distrito registró una población de 303.966 habitantes. Sus límites geográficos comprenden el distrito de San Antonio de Chaclla por el norte; Santa Eulalia y Ricardo Palma por el este; Antioquía por el sureste; Chaclacayo, Ate y El Agustino por el sur; y San Juan de Lurigancho por el oeste.\n\nEl origen de su nombre cuenta con diversas explicaciones. Por un lado, puede provenir del término aimara Chosecc, cuyo significado es cueva donde habitan lechuzas. Por otro lado, se asocia al diminutivo castellano chocica, vocablo empleado en los siglos XV y XVI para designar a las pequeñas casetas o capillas de carretera donde se veneraban imágenes. Como elemento de interés en el jirón Chiclayo, se encuentran figuras representativas de lechuzas en los árboles del Paseo del Huarango. En el plano histórico, los antecedentes de este territorio se remontan al virreinato, y su creación política quedó formalizada durante la época republicana el 4 de agosto de 1821 por el general José."
  },
  {
    "slug": "escobar",
    "name": "Escobar",
    "kind": "ciudad",
    "icon": "💬",
    "users": 125,
    "votes": 202,
    "activity": "Alta",
    "parentName": "Argentina",
    "parentSlug": "argentina",
    "provincia": "Provincia de Buenos Aires",
    "regionSlug": "provincia-de-buenos-aires",
    "channels": [
      "argentina",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "jose-c-paz",
      "tigre",
      "san-isidro",
      "merlo",
      "moron",
      "argentina",
      "amistad",
      "amor"
    ],
    "intro": "Chat de Escobar: conecta con vecinos del norte del Gran Buenos Aires, donde el municipio alcanzó 70% de efectividad contra microbasurales (7 agosto 2026).",
    "aboutTitle": "Escobar y la herramienta digital Escobar 360 para trámites",
    "about": "Escobar es un partido de la provincia de Buenos Aires, cuya cabecera es la localidad de Belén de Escobar. Está en el borde norte del Gran Buenos Aires y forma parte del conurbano bonaerense, limitando con los partidos de Campana, Pilar, Malvinas Argentinas y Tigre. Con una población considerable, es una de las áreas con mayor crecimiento demográfico de la zona.\n\nEn la sala de chat de Escobar los vecinos intercambian información sobre los servicios municipales, como la plataforma Escobar 360 que centraliza trámites y permite participar en el programa de Presupuesto Participativo. También se comenta la agenda cultural, por ejemplo el concierto de Teresa Parodi y la feria Kamogelo anunciados para el 7 agosto 2026, y se comparte la noticia de que el municipio superó el 70 % de efectividad en la erradicación de microbasurales el mismo día. La conversación se centra en temas cotidianos, iniciativas de sostenibilidad y eventos locales, atrayendo a residentes de Belén de Escobar y de los barrios colindantes."
  },
  {
    "slug": "turmero",
    "name": "Turmero",
    "kind": "ciudad",
    "icon": "💬",
    "users": 143,
    "votes": 246,
    "activity": "Alta",
    "parentName": "Venezuela",
    "parentSlug": "venezuela",
    "provincia": "Aragua",
    "regionSlug": "aragua",
    "channels": [
      "venezuela",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "maracay",
      "san-juan-de-los-morros",
      "los-teques",
      "valencia-venezuela",
      "puerto-cabello",
      "venezuela",
      "amistad",
      "amor"
    ],
    "intro": "Turmero, capital de Santiago Mariño en Aragua, alberga la Iglesia Nuestra Señora de La Candelaria (1620) y el sendero a Chuao por el Topo Buena Vista.",
    "aboutTitle": "Turmero y el sendero a Chuao por el Topo Buena Vista",
    "about": "Turmero es la capital del municipio Santiago Mariño, en el estado Aragua, Venezuela. Pertenece al Área metropolitana de Maracay y se sitúa a 102 km de Caracas. Según el censo de 2011, su población alcanza los 211.010 habitantes. Fundada como parroquia eclesiástica el 27 de noviembre de 1620, su origen está ligado a la construcción de la Iglesia Nuestra Señora de La Candelaria, ordenada por el rey Felipe II de España. Aunque se menciona a Pedro Villacastín como fundador, no hay documentos que lo respalden.\n\nEl clima es cálido durante todo el año. Entre sus puntos de interés destacan el Pico El Cenizo, el Cerro El Picacho y el balneario Pozo El Indio en la zona agraria de Guayabita. También se encuentra el sendero Turmero-Chuao, que parte de Pedregal hacia las faldas del Topo Buena Vista, y el zoológico Leslie Pantin de Paya. La ciudad cuenta con emisoras como Radio Estrella (98.7 FM) y medios digitales como Aragua Press."
  },
  {
    "slug": "gregorio-de-laferrere",
    "name": "Gregorio de Laferrere",
    "kind": "ciudad",
    "icon": "💬",
    "users": 137,
    "votes": 227,
    "activity": "Media",
    "parentName": "Argentina",
    "parentSlug": "argentina",
    "provincia": "Provincia de Buenos Aires",
    "regionSlug": "provincia-de-buenos-aires",
    "channels": [
      "argentina",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "moron",
      "merlo",
      "lomas-de-zamora",
      "lanus",
      "argentina",
      "amistad",
      "amor"
    ],
    "intro": "Chat de Gregorio de Laferrere, localidad del partido La Matanza a 13 km del acceso a la Ciudad Autónoma de Buenos Aires, para compartir noticias y charlar.",
    "aboutTitle": "A 13 km del acceso a la Ciudad de Buenos Aires, en La Matanza",
    "about": "Gregorio de Laferrere es una localidad del partido de La Matanza, en la provincia de Buenos Aires, que forma parte del aglomerado urbano del Gran Buenos Aires (AMBA). Se encuentra ubicada a 13 km de su acceso más cercano a la Ciudad Autónoma de Buenos Aires, accediendo vía la Autopista Teniente General Pablo Ricchieri. La zona combina la vida residencial típica de la zona sur del conurbano con la cercanía a la capital, lo que le confiere una dinámica propia dentro del conurbado porteño.\n\nEn la sala de chat de Gregorio de Laferrere se discuten asuntos cotidianos de la comunidad: eventos locales, transporte, comercio, deportes y temas de interés general. Participan residentes, estudiantes, trabajadores que se desplazan a la capital y cualquier persona que busque información o compañía relacionada con la vida en esta zona del AMBA. El tono es informal y cercano, facilitando el intercambio de experiencias y la organización de encuentros entre los vecinos."
  },
  {
    "slug": "monclova",
    "name": "Monclova",
    "kind": "ciudad",
    "icon": "💬",
    "users": 154,
    "votes": 262,
    "activity": "Media",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Coahuila de Zaragoza",
    "regionSlug": "coahuila-de-zaragoza",
    "channels": [
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "Accede al Chat de Monclova, la destacada Capital del Acero en Coahuila, una ciudad del norte de México que llegó a registrar 237.169 habitantes en 2020.",
    "aboutTitle": "Monclova, la Capital del Acero en el estado de Coahuila",
    "about": "Monclova es una ciudad situada en la región central del estado de Coahuila, en el norte de México, a una altitud de 600 metros sobre el nivel del mar. En el año 2020, su población urbana alcanzaba alrededor de 237.169 habitantes, cifra que se eleva a cerca de 374.247 personas al sumar los municipios de Frontera, Castaños y San Buenaventura, que configuran su zona metropolitana.\n\nEsta localidad destaca históricamente por haber sido la capital de Coahuila y Texas. Con el paso del tiempo, la antigua región agrícola se transformó en un polo de desarrollo industrial. Su relevancia en la producción metalúrgica le otorgó el sobrenombre de La Capital del Acero, al registrar la mayor producción de este material en todo México y Latinoamérica. En la actualidad, figura entre las cinco urbes con mayor desarrollo comercial, industrial y financiero del país, además de poseer la mayor productividad laboral a nivel nacional.\n\nEl origen de su nombre se remonta a la expansión del imperio romano, en alusión al general romano Clovio, quien combatió a las tropas de Viriato en el siglo II a. C. en la actual provincia de Sevilla, España. Posteriormente, el 20 de septiembre de 1617, el rey Felipe III emitió un decreto relacionado con esta denominación que evoca el término de origen latino para referirse a la región de Clovio."
  },
  {
    "slug": "carlos-manuel-de-cespedes",
    "name": "Carlos Manuel de Céspedes",
    "kind": "ciudad",
    "icon": "💬",
    "users": 127,
    "votes": 211,
    "activity": "Media",
    "parentName": "Cuba",
    "parentSlug": "cuba",
    "provincia": "Provincia de Camagüey",
    "regionSlug": "provincia-de-camaguey",
    "channels": [
      "cuba",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "camaguey",
      "ciego-de-avila",
      "cuba",
      "amistad",
      "amor"
    ],
    "intro": "Carlos Manuel de Céspedes, considerado el Padre de la Patria en Cuba, lideró el inicio de la Guerra de los Diez Años contra el Gobierno español en 1868.",
    "aboutTitle": "Orígenes y legado del Padre de la Patria en Camagüey",
    "about": "Carlos Manuel de Céspedes fue un abogado, hacendado y líder secesionista nacido en Bayamo el 18 de abril de 1819. Su madre, Francisca de Borja López del Castillo y Ramírez de Aguilar, era originaria de Puerto Príncipe, la actual Camagüey. Durante su juventud en Bayamo, recibió clases de gramática y latín con los frailes del Convento de Nuestro Seráfico Padre, y posteriormente cursó Lógica y Ética en el Convento de Santo Domingo. Céspedes es recordado históricamente como el Padre de la Patria en Cuba por haber iniciado la Guerra de los Diez Años al levantarse en armas contra el Gobierno español el 10 de octubre de 1868. Fue el primer presidente de la República de Cuba en Armas y mayor general del Ejército Libertador. Tras ser destituido de su cargo presidencial en 1873, se instaló en San Lorenzo, en la Sierra Maestra, donde cayó el 27 de febrero de 1874 en un desigual combate contra las tropas españolas."
  },
  {
    "slug": "jose-c-paz",
    "name": "José C. Paz",
    "kind": "ciudad",
    "icon": "💬",
    "users": 119,
    "votes": 190,
    "activity": "Media",
    "parentName": "Argentina",
    "parentSlug": "argentina",
    "provincia": "Provincia de Buenos Aires",
    "regionSlug": "provincia-de-buenos-aires",
    "channels": [
      "argentina",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "merlo",
      "escobar",
      "tigre",
      "moron",
      "argentina",
      "amistad",
      "amor"
    ],
    "intro": "Ubicada en el oeste del Gran Buenos Aires, José C. Paz es una ciudad y cabecera del partido homónimo en la provincia de Buenos Aires, Argentina.",
    "aboutTitle": "La ciudad del oeste del Gran Buenos Aires",
    "about": "José C. Paz es una ciudad y cabecera del partido homónimo, ubicada en el oeste del Gran Buenos Aires, en la provincia de Buenos Aires, Argentina, a aproximadamente 40 km de la Ciudad Autónoma de Buenos Aires. A diferencia de otros partidos de la provincia de Buenos Aires, el partido de José C. Paz no se encuentra subdividido en localidades, por lo que la ciudad homónima comprende la totalidad del municipio y su organización territorial se estructura en barrios.\n\nLa localidad constituye el principal centro administrativo, educativo y de transporte del partido, concentrando un importante flujo diario de población. En su territorio se localiza la estación José C. Paz del Ferrocarril General San Martín, además de terminales de ómnibus y nodos de transporte urbano e interurbano. Asimismo, alberga las principales dependencias municipales, oficinas de organismos públicos y entidades bancarias."
  },
  {
    "slug": "warnes",
    "name": "Warnes",
    "kind": "ciudad",
    "icon": "💬",
    "users": 140,
    "votes": 241,
    "activity": "Media",
    "parentName": "Bolivia",
    "parentSlug": "bolivia",
    "provincia": "Departamento de Santa Cruz",
    "regionSlug": "departamento-de-santa-cruz",
    "channels": [
      "bolivia",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "montero",
      "santa-cruz-de-la-sierra",
      "bolivia",
      "amistad",
      "amor"
    ],
    "intro": "Warnes, ciudad del departamento de Santa Cruz en Bolivia, está a 30 km al norte de Santa Cruz de la Sierra y registró habitantes en 2020.",
    "aboutTitle": "Industria láctea y cementera de Warnes",
    "about": "Warnes es la capital de la provincia homónima en el departamento de Santa Cruz, Bolivia. Situada a 340 m sobre el nivel del mar, la ciudad se ubica a 30 km al norte de Santa Cruz de la Sierra. En 1891 la población adoptó el nombre de Warnes en homenaje al coronel argentino Ignacio Warnes, héroe de la independencia. El clima de Warnes se clasifica como tropical de sabana (Aw) según Köppen. La economía local combina industria y turismo; destacan la planta procesadora de lácteos IPILCRUZ, la fábrica de cemento Warnes, el centro de acopio de la fábrica de aceite FINO, y otras empresas como Sobolma, Industrias Venado y la fábrica de medicamentos ABD. La Ruta Nacional 4 atraviesa el municipio, y muy pronto contará con un parque eólico. Según el censo de 2024, el municipio cuenta con 151.241 habitantes. Warnes forma parte del área metropolitana de Santa Cruz de la Sierra."
  },
  {
    "slug": "marino",
    "name": "Mariño",
    "kind": "ciudad",
    "icon": "💬",
    "users": 153,
    "votes": 253,
    "activity": "Media",
    "parentName": "Venezuela",
    "parentSlug": "venezuela",
    "provincia": "Aragua",
    "regionSlug": "aragua",
    "channels": [
      "venezuela",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "turmero",
      "maracay",
      "los-teques",
      "san-juan-de-los-morros",
      "puerto-cabello",
      "venezuela",
      "amistad",
      "amor"
    ],
    "intro": "Conecta en el chat de Mariño, el segundo municipio más poblado del estado Aragua con una población de 224.880 habitantes según el censo de 2023.",
    "aboutTitle": "Turmero y la historia del municipio de Santiago Mariño",
    "about": "Santiago Mariño es uno de los 18 municipios que integran el estado Aragua, en el norte de Venezuela. Con una extensión territorial de 497 kilómetros cuadrados, este municipio registra una población de 224.880 habitantes de acuerdo con los datos del censo de 2023, lo que lo sitúa como el segundo municipio más poblado de Aragua. Su capital se encuentra en la ciudad de Turmero. Geográficamente, limita por el norte con el mar Caribe, mientras que por el sur colinda con los municipios de Sucre, José Ángel Lamas y Francisco Linares Alcántara. Al este limita con Tovar y Bolívar, y por el oeste limita con el municipio Girardot.\n\nLa evolución histórica de este territorio comenzó hacia 1650 bajo la figura de la Parroquia de La Candelaria, bajo jurisdicción de Valencia. En 1812, Turmero se incorporó al Departamento de Los Valles de Aragua como Cantón. Tras la separación de Aragua de la provincia de Caracas en 1848, el cantón de Turmero quedó conformado por las parroquias de Turmero y San Mateo. Posteriormente, el 3 de enero de 1891, se decretó la división territorial que dio origen al Distrito Mariño, estableciendo su cabecera en Turmero. Tras varias modificaciones territoriales en 1936 y la posterior separación de los municipios de Santa Cruz y Cagua en 1943 para dar origen al Distrito Sucre, el territorio consolidó su estructura."
  },
  {
    "slug": "mara",
    "name": "Mara",
    "kind": "ciudad",
    "icon": "💬",
    "users": 138,
    "votes": 235,
    "activity": "Media",
    "parentName": "Venezuela",
    "parentSlug": "venezuela",
    "provincia": "Zulia",
    "regionSlug": "zulia",
    "channels": [
      "zulia",
      "venezuela",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "maracaibo",
      "maicao",
      "cabimas",
      "albania",
      "barrancas",
      "venezuela",
      "amistad",
      "amor"
    ],
    "intro": "Mara es un municipio del estado Zulia que forma parte del Área metropolitana de Maracaibo y tiene su capital en San Rafael del El Moján.",
    "aboutTitle": "Historia de Mara y sus orígenes junto al río Limón",
    "about": "Mara es uno de los 21 municipios que integran el estado Zulia, en Venezuela, y forma parte del Área metropolitana de Maracaibo junto a las localidades de Maracaibo, San Francisco y Jesús Enrique Lossada. Su capital es San Rafael del El Moján. Los primeros habitantes de este territorio fueron las etnias wayú, asentadas en las llanuras desérticas, y añú, quienes construían sus viviendas sobre palafitos en la salida del río Limón.\n\nLa historia administrativa de la zona registra que la Guajira se integró a la Provincia de Maracaibo en 1792. Tras pertenecer a los cantones de Maracaibo y Perijá en 1856, y constituirse como Departamento San Rafael en 1874, la región experimentó varios cambios territoriales. El 12 de enero de 1887 se creó finalmente el distrito Mara, integrado por los municipios de San Rafael y Ricaurte. Esta creación fue posible por las gestiones de don F. Ignacio Chacín y el diputado Jesús María Portillo. Aunque el gobernador de la sección Zulia, Gregorio Fidel Méndez, decretó su erección oficial para el 6 de febrero, la instalación formal del concejo municipal ocurrió el 7 de febrero de 1887 a las 7:00 p. m., bajo la presidencia de Sixto de Vicente."
  },
  {
    "slug": "arroyo-naranjo",
    "name": "Arroyo Naranjo",
    "kind": "ciudad",
    "icon": "💬",
    "users": 131,
    "votes": 220,
    "activity": "Media",
    "parentName": "Cuba",
    "parentSlug": "cuba",
    "provincia": "provincia de La Habana",
    "regionSlug": "provincia-de-la-habana",
    "channels": [
      "cuba",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "cuba",
      "la-habana",
      "matanzas",
      "cardenas",
      "amistad",
      "amor"
    ],
    "intro": "Arroyo Naranjo, municipio de la provincia de La Habana con 204.434 habitantes, alberga Expocuba, el recinto ferial más grande de Cuba.",
    "aboutTitle": "El municipio de las canteras de San Miguel y el recinto de Expocuba",
    "about": "Arroyo Naranjo representa el 11 % del territorio de la provincia de La Habana, en Cuba. Con una extensión de 83 kilómetros cuadrados, cuenta con 8.225 hectáreas de tierra, de las cuales destina el 36 % al uso agrícola, mientras que un 7 % está ocupado por agua. Su población estimada en el año 2017 alcanzaba los 204.434 habitantes, con una densidad poblacional de 2.300 habitantes por kilómetro cuadrado, de los cuales el 52 % son mujeres.\n\nFundado en 1845, se convirtió pronto en un pueblo de tránsito de mercancías y pasajeros entre La Habana y Santiago de las Vegas. Su historia destaca por las aguas medicinales de El Cacahual y por sus canteras de piedra de San Miguel, fundamentales para la expansión constructiva de La Habana. En el ámbito cultural, cuenta con la Biblioteca Municipal Manuel Cofiño, tres Casas de la Cultura y la Galería José Cecilio Hernández Cárdenas. Además, dispone de seis cines y tres salas de video. En su territorio se localiza Expocuba, el recinto ferial más grande de la isla, que funciona como sede permanente de exposiciones del desarrollo económico y social."
  },
  {
    "slug": "boyeros",
    "name": "Boyeros",
    "kind": "ciudad",
    "icon": "💬",
    "users": 139,
    "votes": 238,
    "activity": "Media",
    "parentName": "Cuba",
    "parentSlug": "cuba",
    "provincia": "provincia de La Habana",
    "regionSlug": "provincia-de-la-habana",
    "channels": [
      "cuba",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "arroyo-naranjo",
      "cuba",
      "la-habana",
      "matanzas",
      "amistad",
      "amor"
    ],
    "intro": "Boyeros es un municipio de La Habana que alberga el Aeropuerto Internacional José Martí y cuenta con una población de 188.712 habitantes.",
    "aboutTitle": "Municipio de Boyeros y el Aeropuerto Internacional José Martí",
    "about": "Boyeros es uno de los 15 municipios de la provincia de La Habana, en Cuba, establecido en el año 1976 tras fusionarse con el pueblo de Santiago de Las Vegas. Este territorio de 134,2 kilómetros cuadrados está situado al suroeste de la ciudad y limita con los municipios de Cerro, Arroyo Naranjo, La Lisa, Marianao y Bejucal. Actualmente cuenta con una población de 188.712 habitantes y se organiza en siete consejos populares: Santiago de las Vegas, Nuevo Santiago, Boyeros, Calabazar, Wajay, Altahabana y Armada.\n\nEl origen de sus asentamientos estables se remonta a mediados del siglo XVII en Santiago de las Vegas, que originalmente se conoció como Las Vegas hasta 1694. Hoy en día, el municipio es reconocido por albergar en sus terrenos el Aeropuerto Internacional José Martí, lo que define su identidad y su fuerte sector de servicios aeroportuarios.\n\nSu economía también destaca por una diversa producción industrial. En Boyeros se elaboran los helados Coppelia, las pastas de La Pasiega, pinturas Vitral y vehículos eléctricos en las instalaciones de VEDCA. Además, el municipio cuenta con industrias destinadas a la producción de medicamentos, reactivos de LABIOFAM, cartón, tejidos, hilazas y materiales de construcción como cerámica roja y refractaria."
  },
  {
    "slug": "cabo-san-lucas",
    "name": "Cabo San Lucas",
    "kind": "ciudad",
    "icon": "💬",
    "users": 125,
    "votes": 218,
    "activity": "Media",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Baja California Sur",
    "regionSlug": "baja-california-sur",
    "channels": [
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "Cabo San Lucas, ciudad turística en el extremo sur de Baja California, donde se unen el golfo de California y el océano Pacífico.",
    "aboutTitle": "Cabo San Lucas, ciudad turística en Baja California Sur",
    "about": "Cabo San Lucas es una ciudad turística de México ubicada en el extremo sur de la península de Baja California, siendo una delegación del municipio de Los Cabos en el estado de Baja California Sur. Su ubicación geográfica es: norte 23°40′, sur 22°52′, este 109°24′, oeste 110°7′. Frente a sus costas se unen las aguas del golfo de California y del océano Pacífico. La ciudad se encuentra aledaña al Área de Protección de Flora y Fauna Cabo San Lucas. El nombre original del puerto era Yenecamú, topónimo de origen pericú. Posterior a la llegada de los colonizadores españoles, el sitio tuvo varios nombres, pero el que tuvo mayor impacto fue el de Cabo San Lucas, nombre puesto el 18 de octubre de 1541 por el soldado español Francisco de Bolaños."
  },
  {
    "slug": "guacara",
    "name": "Guacara",
    "kind": "ciudad",
    "icon": "💬",
    "users": 122,
    "votes": 215,
    "activity": "Media",
    "parentName": "Venezuela",
    "parentSlug": "venezuela",
    "provincia": "Carabobo",
    "regionSlug": "carabobo",
    "channels": [
      "carabobo",
      "venezuela",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "valencia-venezuela",
      "maracay",
      "puerto-cabello",
      "san-juan-de-los-morros",
      "los-teques",
      "venezuela",
      "amistad",
      "amor"
    ],
    "intro": "Chat de Guacara: conversa con residentes de la ciudad fundada en 1624 como San Agustín de Guacara, capital del municipio homónimo en Carabobo.",
    "aboutTitle": "Industria y historia de Guacara, capital del municipio",
    "about": "Guacara es una ciudad venezolana situada en el estado Carabobo, en la Región Central del país. Es la capital del Municipio Guacara y forma parte de una conurbación que alberga algunas de las zonas industriales más relevantes de Venezuela. La localidad se originó en 1624 bajo el nombre de San Agustín de Guacara, cuando fue establecida como un pueblo indígena. Las zonas industriales de Guacara se consideran entre las más importantes de Venezuela. Su ubicación estratégica favorece el desarrollo de actividades manufactureras y logísticas, y la comunidad conserva tradiciones culturales vinculadas a su origen colonial.\n\nEn la sala de chat de Guacara los usuarios comparten información sobre la vida cotidiana, consultas sobre servicios municipales y comentarios acerca de la actividad industrial local. Participan residentes, comerciantes y personas interesadas en la evolución urbana de la ciudad. El espacio permite intercambiar opiniones, coordinar encuentros y mantenerse al día con cualquier novedad que surja en la zona. En el chat se tratan también asuntos de educación, salud y cultura local, ofreciendo un espacio de apoyo mutuo."
  },
  {
    "slug": "tocuyito",
    "name": "Tocuyito",
    "kind": "ciudad",
    "icon": "💬",
    "users": 131,
    "votes": 224,
    "activity": "Media",
    "parentName": "Venezuela",
    "parentSlug": "venezuela",
    "provincia": "Carabobo",
    "regionSlug": "carabobo",
    "channels": [
      "carabobo",
      "venezuela",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "valencia-venezuela",
      "guacara",
      "puerto-cabello",
      "maracay",
      "san-felipe",
      "venezuela",
      "amistad",
      "amor"
    ],
    "intro": "Tocuyito es la capital del Municipio Libertador en Carabobo, una localidad de 201.614 habitantes que fue fundada oficialmente el 1 de agosto de 1783.",
    "aboutTitle": "Las Sabanas de Carabobo y el origen de Tocuyito",
    "about": "Tocuyito es una ciudad venezolana que ejerce como capital del Municipio Libertador, en el Estado Carabobo, dentro de la Región Central del país. Esta localidad se conecta a través de la Autopista Circunvalación Sur por la vía de los Llanos del Estado Cojedes y por la Carretera Panamericana en dirección a Barquisimeto. Según el censo realizado en el año 2023, cuenta con una población de 201.614 habitantes. Geográficamente, se emplaza en las Sabanas de Carabobo, a una altitud de 451 metros sobre el nivel del mar, y registra una temperatura promedio anual de 26 °C.\n\nLa historia de este territorio comenzó a documentarse en 1547, cuando el teniente conquistador español Juan de Villegas avistó la zona. El nombre original de Tocuyo, de procedencia indígena y con el significado de agua de yuca, derivó en el diminutivo Tocuyito debido a los viajeros que transitaban la ruta entre Borburata y el occidente. Tras pertenecer inicialmente a la Nueva Valencia del Rey, el obispo provincial Mariano Martí ordenó en 1782 la creación de la parroquia eclesiástica de San Pablo del Tocuyito en la Sabana de San Pablo. Su fundación formal se concretó el 1 de agosto de 1783. Décadas más tarde, debido a su posición estratégica, el lugar sirvió de escenario para dos batallas de la Guerra de Independencia."
  },
  {
    "slug": "cuautla",
    "name": "Cuautla de Morelos",
    "kind": "ciudad",
    "icon": "💬",
    "users": 134,
    "votes": 236,
    "activity": "Media",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Morelos",
    "regionSlug": "morelos",
    "channels": [
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "emiliano-zapata-edomex",
      "ozumba-de-alzate",
      "juchitepec",
      "cuernavaca",
      "amecameca",
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "Chat de Cuautla de Morelos, la segunda ciudad más importante del estado, conecta a residentes y visitantes en una sala de conversación local.",
    "aboutTitle": "Cuautla de Morelos: cabecera del municipio y segunda ciudad del estado",
    "about": "Cuautla de Morelos, oficialmente denominada Heroica e Histórica Ciudad de Cuautla de Morelos, es una ciudad mexicana que funciona como cabecera del municipio de Cuautla y como núcleo central de la zona metropolitana del mismo nombre. Se reconoce como la segunda ciudad más importante del estado de Morelos. En la sala de chat de TuChat.org los usuarios pueden intercambiar información sobre la vida cotidiana, eventos locales y temas de interés general. Participan residentes, estudiantes y personas vinculadas a la región que buscan compartir noticias, preguntar sobre servicios municipales o simplemente conversar. La conversación suele abordar la agenda cultural, el tráfico, el comercio y los aspectos cotidianos de la ciudad, ofreciendo un espacio de interacción directa para la comunidad. Los participantes pueden organizar encuentros virtuales, proponer actividades locales y colaborar en la difusión de iniciativas culturales. La plataforma permite el intercambio de opiniones sobre servicios públicos, recomendaciones de comercios y la coordinación de proyectos vecinales, fortaleciendo el vínculo entre los habitantes de Cuautla y sus alrededores."
  },
  {
    "slug": "la-pintana",
    "name": "La Pintana",
    "kind": "ciudad",
    "icon": "💬",
    "users": 146,
    "votes": 239,
    "activity": "Media",
    "parentName": "Chile",
    "parentSlug": "chile",
    "provincia": "Región Metropolitana de Santiago",
    "regionSlug": "region-metropolitana-de-santiago",
    "channels": [
      "chile",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "chile",
      "santiago-de-chile",
      "rancagua",
      "san-antonio-chile",
      "quillota",
      "amistad",
      "amor"
    ],
    "intro": "Conecta con otros usuarios en el Chat de La Pintana, comuna del sector sur del Gran Santiago surgida de los antiguos terrenos agrícolas de la familia Pinto.",
    "aboutTitle": "De los huertos obreros de la familia Pinto al sector San Rafael",
    "about": "La Pintana es una comuna ubicada en el sector sur de la ciudad de Santiago de Chile, integrada en el Gran Santiago. Sus primeros habitantes fueron los picunches, un subgrupo mapuche. Posteriormente, estas tierras fueron entregadas al Gobernador de Chile y Virrey del Perú, Ambrosio O'Higgins. Su hijo Bernardo O'Higgins las subdividió entre colaboradores de la Independencia, quienes construyeron canales de regadío y transformaron la zona en un área agrícola dedicada a viñedos, frutales y crianza de ganado.\n\nEl poblamiento urbano comenzó en la segunda mitad del siglo XX. En 1942, la Caja de la Habitación Popular adquirió el fundo La Pintana, que pertenecía a la familia del presidente Aníbal Pinto, de donde proviene el nombre de la comuna. Allí se instalaron los primeros Huertos Obreros y Familiares para la Sociedad Cooperativa José Maza, creada en 1937, dando origen a las actuales villas La Pintana, Las Rosas y Mapuhue. En la década de 1940 se consolidó el casco urbano en el sector San Rafael, donde hoy se ubican la Plaza de Armas, el Edificio Consistorial y la Tercera Compañía de Bomberos, la institución más antigua de la comuna con más de 50 años de historia."
  },
  {
    "slug": "ciudad-valles",
    "name": "Valles",
    "kind": "ciudad",
    "icon": "💬",
    "users": 129,
    "votes": 220,
    "activity": "Media",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "San Luis Potosí",
    "regionSlug": "san-luis-potosi",
    "channels": [
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "panuco",
      "tantoyuca",
      "san-luis-potosi",
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "Conéctate a Valles, ciudad de la Huasteca Potosina fundada el 25 de julio de 1533 a orillas del río Valles y destacada por su industria azucarera.",
    "aboutTitle": "El tercer núcleo urbano de San Luis Potosí a orillas del río Valles",
    "about": "Ciudad Valles se localiza en el oriente del estado de San Luis Potosí, dentro de la región de la Huasteca Potosina. Esta localidad se sitúa a orillas del río Valles, el cual es afluente del río Tampaón, y representa el tercer núcleo urbano más grande, poblado e importante del estado. Su fundación se remonta al 25 de julio de 1533 bajo el nombre de Santiago de los Valles de Oxitipa, en honor al Santo Santiago Apóstol. En esta región conviven el idioma español y la lengua huasteca.\n\nLa economía de la zona destaca por ser un relevante centro comercial, agrícola, ganadero y turístico. Cuenta con importantes industrias de azúcar y cemento instaladas en su territorio, donde la producción azucarera mediante ingenios constituye un fuerte incremento económico regional. Su cercanía con la Sierra del Abra y los demás municipios de la Huasteca la convierte en un punto de paso obligado gracias a su infraestructura hotelera y de servicios. En sus alrededores se practica habitualmente el turismo ecológico y deportes extremos como el kayak y el rápel. Su escudo municipal refleja esta riqueza e historia, mostrando elementos como el dios del maíz Dhipaak, el jeroglífico de Oxitipa que representa un cerro con una vasija de chapopote, y alusiones a la ganadería y la industria del azúcar."
  },
  {
    "slug": "lujan-de-cuyo",
    "name": "Luján de Cuyo",
    "kind": "ciudad",
    "icon": "💬",
    "users": 124,
    "votes": 201,
    "activity": "Media",
    "parentName": "Argentina",
    "parentSlug": "argentina",
    "provincia": "Provincia de Mendoza",
    "regionSlug": "provincia-de-mendoza",
    "channels": [
      "argentina",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "laboulaye",
      "rufino",
      "venado-tuerto",
      "bell-ville",
      "marcos-juarez",
      "argentina",
      "amistad",
      "amor"
    ],
    "intro": "Luján de Cuyo es una ciudad de Mendoza que destaca por sus bodegas de renombre mundial y el Dique Potrerillos, rodeado por las villas del Cordón del Plata.",
    "aboutTitle": "Viñedos y las cumbres del Cordón del Plata en Mendoza",
    "about": "Luján de Cuyo, cabecera del departamento homónimo en la provincia de Mendoza, forma parte del Gran Mendoza. Declarada ciudad en 1949 y renombrada con su denominación actual en 1964, tiene como eje principal la Avenida San Martín. Esta vía conecta al norte con el departamento Godoy Cruz y aloja al club departamental Luján Sport Club. Hacia el sur, tras cruzar el puente sobre el Río Mendoza, la avenida se convierte en la Ruta Provincial 15, atravesando distritos como Perdriel, Agrelo y Ugarteche.\n\nLa zona cuenta con un gran atractivo turístico gracias a sus viñedos, fincas, sitios históricos y bodegas de renombre mundial. Al oeste, en el distrito de Potrerillos, se ubica el Dique Potrerillos. En esta misma área de montaña se encuentran villas pintorescas como Las Vegas, El Salto o Piedras Blancas, cercanas al Cordón del Plata. Asimismo, la localidad de Vallecitos alberga la pista de esquí más antigua de la provincia y sirve de acceso a importantes cerros de la cordillera como El Plata, Rincón, Franke y San Bernardo."
  },
  {
    "slug": "la-guaira",
    "name": "La Guaira",
    "kind": "ciudad",
    "icon": "💬",
    "users": 137,
    "votes": 235,
    "activity": "Media",
    "parentName": "Venezuela",
    "parentSlug": "venezuela",
    "provincia": "Estado La Guaira",
    "regionSlug": "estado-la-guaira",
    "channels": [
      "venezuela",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "venezuela",
      "caracas",
      "los-teques",
      "guarenas",
      "maracay",
      "amistad",
      "amor"
    ],
    "intro": "La Guaira es una ciudad y puerto marítimo de Venezuela, capital del estado homónimo, situada a solo 30 kilómetros de distancia de Caracas.",
    "aboutTitle": "El histórico puerto de San Pedro de La Guaira",
    "about": "La Guaira es una ciudad y puerto marítimo de Venezuela, capital del municipio Vargas y del estado La Guaira. Esta localidad se sitúa en la Región Capital, a una distancia de 30 kilómetros de Caracas. Los orígenes de su territorio se remontan a los aborígenes arauacos y posteriormente a los caribes, quienes se asentaron en estas costas del litoral central. Antes de la colonización, la zona conformó la nación Tarma, extendida entre Puerto Maya y los Valles del Tuy.\n\nAntiguamente conocida como Huaira, su fundación formal bajo el nombre de San Pedro de La Guaira se sitúa el 29 de junio de 1589, en el día de San Pedro y San Pablo. El acto fue realizado por el gobernador Diego Osorio y su secretario Simón Bolívar, ancestro de Simón Bolívar, aunque ya en 1580 el contador Diego Ruiz de Vallejo mencionaba el puerto en una carta al rey Felipe II. Poco después de su fundación, la población sufrió la toma de piratas neerlandeses, un conflicto en el que el cacique Guaicamacuto también intervino atacando por sorpresa a corsarios ingleses."
  },
  {
    "slug": "paez-venezuela",
    "name": "Páez",
    "kind": "ciudad",
    "icon": "💬",
    "users": 134,
    "votes": 220,
    "activity": "Media",
    "parentName": "Venezuela",
    "parentSlug": "venezuela",
    "provincia": "Portuguesa",
    "regionSlug": "portuguesa",
    "channels": [
      "venezuela",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "acarigua",
      "barquisimeto",
      "guanare",
      "san-felipe",
      "venezuela",
      "amistad",
      "amor"
    ],
    "intro": "Páez es un municipio del norte de Portuguesa, en Venezuela, que cuenta con una población de 202.232 habitantes y tiene su capital en Acarigua.",
    "aboutTitle": "El municipio de Páez y sus parroquias en Portuguesa",
    "about": "Páez es un municipio ubicado en la parte norte del Estado Portuguesa, en los límites con el estado Cojedes, dentro de Venezuela. Debe su nombre al militar y político venezolano José Antonio Páez y abarca una superficie de 425 kilómetros cuadrados. Su capital es Acarigua, y el territorio se organiza administrativamente en cuatro parroquias: Acarigua, Payara, Pimpinela y Ramón Peraza.\n\nSegún los datos del censo de población y vivienda de 2021, este municipio cuenta con 202.232 habitantes, lo que equivale al 20,21 % de la población total del estado Portuguesa. El municipio registra una densidad poblacional de 475,84 habitantes por kilómetro cuadrado, con una distribución demográfica compuesta por un 49,64 % de hombres y un 51,36 % de mujeres. En cuanto a las viviendas, existen 49.497 unidades habitacionales en el territorio, que albergan a 45.373 núcleos familiares, de los cuales 18.510 tienen a una mujer como cabeza de familia. En el ámbito de los servicios y las telecomunicaciones, más del 95 % de los hogares cuenta con al menos un aparato de televisión, más de la mitad dispone de aire acondicionado, un 17 % tiene acceso a internet y una cuarta parte posee una computadora. El municipio cuenta además con el canal regional de televisión Urbano Televisión."
  },
  {
    "slug": "anaco",
    "name": "Anaco",
    "kind": "ciudad",
    "icon": "💬",
    "users": 130,
    "votes": 210,
    "activity": "Media",
    "parentName": "Venezuela",
    "parentSlug": "venezuela",
    "provincia": "Anzoátegui",
    "regionSlug": "anzoategui",
    "channels": [
      "venezuela",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "el-tigre",
      "barcelona-venezuela",
      "puerto-la-cruz",
      "cumana",
      "venezuela",
      "amistad",
      "amor"
    ],
    "intro": "Chat de Anaco, la sala para quienes viven o se interesan en la ciudad venezolana a 220 m de altitud, capital del municipio y cabecera de la Red Nacional de Gas.",
    "aboutTitle": "Anaco, capital del municipio y cabecera de la Red Nacional de Gas",
    "about": "Anaco es la capital del municipio homónimo en el estado Anzoátegui, Venezuela, situada a 220 m de altitud sobre una mesa que se extiende por los Llanos altos orientales. La ciudad constituye un punto nodal de la carretera que la enlaza con Barcelona, El Tigre, Ciudad Bolívar, Maturín y Aragua de Barcelona, y desde 1942 se ha beneficiado por la explotación petrolera, apoyada por una industria de suministros, servicios y comercio. Es también centro de distribución de petróleo y gas natural, siendo cabecera de la Nueva Red Nacional de Gas, y en su zona de influencia destacan la producción de maíz, sorgo y la ganadería bovina."
  },
  {
    "slug": "ciudad-acuna",
    "name": "Acuña",
    "kind": "ciudad",
    "icon": "💬",
    "users": 130,
    "votes": 215,
    "activity": "Media",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Coahuila de Zaragoza",
    "regionSlug": "coahuila-de-zaragoza",
    "channels": [
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "Chat de Acuña, la sala donde conversamos sobre la ciudad a 280 m de altitud, su historia y la XIII edición del Mitote Folklórico 2026.",
    "aboutTitle": "Mitote Folklórico 2026, la fiesta cultural de Acuña",
    "about": "Ciudad Acuña se sitúa en el estado de Coahuila, a una altitud de 280 m s.n.m., y lleva el nombre del escritor Manuel Acuña. La ciudad celebra la XIII edición del Mitote Folklórico y Festival Internacional del Folklor Acuña 2026, que se extenderá del 29 de agosto al 15 de septiembre, reuniendo a más de 300 artistas en una serie de 30 eventos. Además, el municipio cuenta con una sede municipal en el Libramiento Emilio Mendoza 1690, Colonia Aeropuerto, donde opera la autoridad local.\n\nEn la sala de chat de Acuña los usuarios discuten sobre la vida cotidiana, la cultura local y los eventos como el Mitote Folklórico, comparten información sobre servicios municipales y comentan la historia de la ciudad. Participan residentes, visitantes y personas interesadas en la zona, creando un espacio de conversación centrado en Acuña y sus particularidades. Los participantes también intercambian datos sobre servicios, horarios y eventos municipales."
  },
  {
    "slug": "ezeiza",
    "name": "Ezeiza",
    "kind": "ciudad",
    "icon": "💬",
    "users": 124,
    "votes": 199,
    "activity": "Media",
    "parentName": "Argentina",
    "parentSlug": "argentina",
    "provincia": "Provincia de Buenos Aires",
    "regionSlug": "provincia-de-buenos-aires",
    "channels": [
      "argentina",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "lomas-de-zamora",
      "lanus",
      "moron",
      "san-vicente-misiones",
      "merlo",
      "argentina",
      "amistad",
      "amor"
    ],
    "intro": "Chat de Ezeiza, ciudad del Gran Buenos Aires, Argentina, con una población aproximada de más de 100.000 habitantes.",
    "aboutTitle": "Historia y crecimiento de Ezeiza",
    "about": "José María Ezeiza es una ciudad administrativa del Gran Buenos Aires, Argentina, y cabecera del partido homónimo en la provincia de Buenos Aires. Se encuentra situada en el centro-norte del partido. La zona fue habitada por distintas tribus de querandíes dedicadas a la caza y a la pesca desde el año 1500. Con el paso del tiempo, la zona se fue desarrollando y creciendo, especialmente con la llegada del ferrocarril en el siglo XIX. La ciudad albergaba en el censo INDEC 2001 alrededor de 93.246 habitantes, y actualmente supera los 100.000 habitantes aproximadamente. El partido al cual pertenece la ciudad registro un incremento del 37,80% en su población según el censo INDEC 2010. La ciudad forma parte del área metropolitana de Buenos Aires y es un importante centro comercial y de servicios."
  },
  {
    "slug": "bonao",
    "name": "Bonao",
    "kind": "ciudad",
    "icon": "💬",
    "users": 121,
    "votes": 195,
    "activity": "Media",
    "parentName": "República Dominicana",
    "parentSlug": "republica-dominicana",
    "provincia": "Monseñor Nouel",
    "regionSlug": "monsenor-nouel",
    "channels": [
      "republica_dominicana",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "republica-dominicana",
      "santo-domingo",
      "la-vega",
      "san-francisco-de-macoris",
      "moca",
      "amistad",
      "amor"
    ],
    "intro": "Bonao, municipio de Monseñor Nouel conocido como la Villa de las Hortensias, es uno de los asentamientos más antiguos de la República Dominicana.",
    "aboutTitle": "Bonao y el legado histórico de la Villa de las Hortensias",
    "about": "Bonao se sitúa en la región Norte o Cibao de la República Dominicana, dentro de la provincia de Monseñor Nouel. Este municipio es popularmente conocido bajo el nombre de Villa de las Hortensias por la abundancia de su flora regional, y destaca por ser una de las localizaciones con mayor antigüedad en todo el país. Su denominación rinde homenaje al cacique taíno que gobernaba estas tierras cuando los colonizadores españoles llegaron a la isla de Santo Domingo.\n\nDebido a su ubicación geográfica en el centro de la isla, la ocupación de esta zona ocurrió de manera tardía en comparación con las áreas costeras. Los primeros pobladores de los que se tiene constancia ingresaron a este territorio alrededor del año 1000 antes de Cristo. Estos grupos primitivos, denominados barreroides, subsistían como recolectores y no desarrollaron actividades agrícolas.\n\nDurante la época colonial, el territorio formaba parte del cacicazgo de Maguá. En el año 1495, Bartolomé Colón ordenó levantar una fortaleza en Sonador para hacer frente a la resistencia de los nativos dirigidos por el Nitaíno Bonao. El primer fuerte establecido en la zona recibió nombres como Bonao Abajo, La Colonia o La Entrada, y posteriormente fue ocupado por los hombres de Francisco Roldán, mientras que la población indígena se retiró hacia las cuevas de Último Cielo."
  },
  {
    "slug": "milpa-alta",
    "name": "Milpa Alta",
    "kind": "ciudad",
    "icon": "💬",
    "users": 137,
    "votes": 230,
    "activity": "Media",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Ciudad de México",
    "regionSlug": "ciudad-de-mexico",
    "channels": [
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "san-mateo-huitzilzingo",
      "xico",
      "xico-veracruz",
      "chalco",
      "san-isidro-edomex",
      "ciudad-de-mexico",
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "Milpa Alta, situada al sur de la Ciudad de México, produce el 80% del nopal que se consume en el país y cuenta con un importante patrimonio histórico.",
    "aboutTitle": "El cultivo del nopal y la historia revolucionaria de Milpa Alta",
    "about": "Milpa Alta es una de las dieciséis demarcaciones de la Ciudad de México, situada en el extremo sudoriental, en las estribaciones de la sierra de Ajusco-Chichinauhtzin. Con una superficie de 228 kilómetros cuadrados, representa la segunda demarcación más grande de la capital y funciona como una destacada reserva ambiental. Su origen se compone de doce pueblos que se remontan a la época prehispánica, cuando los chichimecas fundaron Malacachtépec Momoxco. Tras la conquista española en 1529, la localidad recibió el nombre de La Asunción de Milpa Alta. Durante la Revolución mexicana, este territorio destacó como un bastión del Ejército Libertador del Sur de Emiliano Zapata.\n\nEn la actualidad, la economía local se sostiene principalmente gracias al cultivo del nopal, introducido de forma masiva en la década de los setenta. Este lugar provee el 80% del nopal que se consume en todo México, sirviendo además como centro de distribución y procesamiento para elaborar desde dulces hasta jabones. Asimismo, se ha recuperado el cultivo del amaranto, que estuvo prohibido durante la época colonial. Entre su patrimonio arquitectónico e histórico sobresalen el templo de Nuestra Señora de la Asunción de Villa Milpa Alta, el Cuartel Zapatista y la Iglesia de San Pablo Apóstol en San Pablo Oztotepec. En sus pueblos se celebran eventos tradicionales como la Feria Nacional del Mole y el Festival de los Globos de Papel."
  },
  {
    "slug": "nacajuca",
    "name": "Nacajuca",
    "kind": "ciudad",
    "icon": "💬",
    "users": 120,
    "votes": 210,
    "activity": "Media",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Tabasco",
    "regionSlug": "tabasco",
    "channels": [
      "tabasco",
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "villahermosa",
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "Chat de Nacajuca, municipio de Tabasco en la región del río Grijalva, con 14 ejidos, para conversar sobre la vida local.",
    "aboutTitle": "El entorno del río Grijalva y los 14 ejidos de Nacajuca",
    "about": "Nacajuca es un municipio del estado de Tabasco, localizado en la región del río Grijalva y en la subregión del Centro. Su cabecera municipal es la ciudad de Nacajuca. El territorio se organiza en 14 ejidos, 28 rancherías, 11 poblados, 3 congregaciones y 3 fraccionamientos rurales. En la sala de chat los vecinos y visitantes pueden intercambiar información sobre asuntos municipales, actividades culturales y el comercio local. Se comentan las fiestas tradicionales, la gastronomía típica, los atractivos turísticos y los artesanos de la zona, como la Casa Muriel de alfarería. También se tratan temas de trámites municipales, iniciativas de reciclaje y oportunidades de empleo. En la conversación también se comparten datos del Plan Municipal de Desarrollo y de los informes de actividades del ayuntamiento, así como información de las distintas direcciones, como la de Educación, Cultura y Recreación, la de Obras, Ordenamiento Territorial y Servicios Municipales, y la de Fomento Económico y Turismo. La comunidad aprovecha el chat para difundir convocatorias, oportunidades de empleo y proyectos de reciclaje, manteniendo viva la tradición y la participación ciudadana."
  },
  {
    "slug": "ocumare-del-tuy",
    "name": "Ocumare del Tuy",
    "kind": "ciudad",
    "icon": "💬",
    "users": 116,
    "votes": 203,
    "activity": "Media",
    "parentName": "Venezuela",
    "parentSlug": "venezuela",
    "provincia": "Miranda",
    "regionSlug": "miranda",
    "channels": [
      "miranda",
      "venezuela",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "los-teques",
      "venezuela",
      "caracas",
      "guarenas",
      "la-guaira",
      "miranda",
      "amistad",
      "amor"
    ],
    "intro": "Entra al chat de Ocumare del Tuy, la capital del municipio Tomás Lander en Miranda con 174.947 habitantes y una de las zonas industriales más importantes.",
    "aboutTitle": "Chat de la tierra del Ron Pampero y los Valles del Tuy",
    "about": "Ocumare del Tuy es la ciudad capital del Municipio Tomás Lander, en el Estado Miranda de Venezuela. Situada en la región de los Valles del Tuy, cuenta con una población de 174.947 habitantes y forma parte del área metropolitana junto a Charallave y Cúa. Esta localidad destaca por albergar una de las zonas industriales más importantes del país, donde se producen el Ron Pampero y la salsa de tomate del mismo nombre. En su territorio también se ubican infraestructuras clave como el Hospital General de los Valles del Tuy y el Aeropuerto Metropolitano, que recibe vuelos privados, conectándose con el resto del país mediante la autopista hacia Charallave."
  },
  {
    "slug": "talcahuano",
    "name": "Talcahuano",
    "kind": "ciudad",
    "icon": "💬",
    "users": 130,
    "votes": 218,
    "activity": "Media",
    "parentName": "Chile",
    "parentSlug": "chile",
    "provincia": "Región del Biobío",
    "regionSlug": "region-del-biobio",
    "channels": [
      "chile",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "concepcion",
      "chillan",
      "los-angeles-chile",
      "chile",
      "amistad",
      "amor"
    ],
    "intro": "Talcahuano, ciudad portuaria de la Región del Biobío, Chile, con un importante papel en el desarrollo económico, naval y pesquero del país.",
    "aboutTitle": "Talcahuano, puerto estratégico del Biobío",
    "about": "Talcahuano es una comuna y ciudad de la zona central de Chile, ubicada en la provincia de Concepción, Región del Biobío. Es uno de los puertos más importantes de Chile y ha desempeñado un papel estratégico en el desarrollo económico, naval y pesquero del país. Su ubicación en la bahía de Concepción le ha permitido consolidarse como centro industrial y marítimo, albergando importantes instalaciones de la Armada de Chile y del ASMAR, así como uno de los terminales pesqueros más relevantes del océano Pacífico sur.\n\nLa ciudad forma parte de la conurbación del Gran Concepción, una de las urbes más pobladas del país, y se encuentra en el sector noroeste de ésta. El nombre de Talcahuano proviene del guerrero que habitaba en la península de Tumbes: Talcahueñu, que en mapudungun significa «trueno en el cielo» o «cielo tronador»."
  },
  {
    "slug": "unare",
    "name": "Unare",
    "kind": "ciudad",
    "icon": "💬",
    "users": 141,
    "votes": 231,
    "activity": "Media",
    "parentName": "Venezuela",
    "parentSlug": "venezuela",
    "provincia": "Bolívar",
    "regionSlug": "bolivar",
    "channels": [
      "venezuela",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "ciudad-guayana",
      "ciudad-bolivar",
      "venezuela",
      "amistad",
      "amor"
    ],
    "intro": "Chat de Unare, la sala de encuentro para conversar sobre esta zona de Venezuela, donde el río Unare separa las lagunas de Unare y Píritu.",
    "aboutTitle": "El río Unare y sus lagunas: tema central en el chat",
    "about": "La sala de chat de Unare es un espacio de comunicación para usuarios interesados en esta región vinculada al río Unare, una corriente fluvial de la cuenca hidrográfica de la parte central de Venezuela. Este río recorre parte de los estados de Anzoátegui y Guárico, y destaca por incluir dos lagunas de gran importancia en su entorno: la laguna de Unare y la laguna de Píritu, las cuales se encuentran separadas por el propio cauce del río. En este canal de conversación, los participantes comparten opiniones, intercambian experiencias y conversan sobre la vida diaria en los territorios que atraviesa este río. Los usuarios de diferentes localidades de Anzoátegui y Guárico, así como visitantes o personas interesadas en la geografía de la zona, utilizan la sala para hablar sobre temas cotidianos, resolver dudas sobre el acceso a estas áreas naturales y mantener el contacto con otros miembros. El chat ofrece un entorno directo y sencillo para conversar de forma abierta y compartir información de utilidad sobre este sector de la geografía venezolana, facilitando la comunicación entre quienes valoran la región del río y sus lagunas."
  },
  {
    "slug": "jutiapa-guatemala",
    "name": "Jutiapa",
    "kind": "ciudad",
    "icon": "💬",
    "users": 146,
    "votes": 234,
    "activity": "Media",
    "parentName": "Guatemala",
    "parentSlug": "guatemala",
    "provincia": "Departamento de Jutiapa",
    "regionSlug": "departamento-de-jutiapa",
    "channels": [
      "guatemala",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "ahuachapan",
      "santa-ana",
      "sonsonate",
      "chiquimula",
      "guatemala",
      "amistad",
      "amor"
    ],
    "intro": "Jutiapa, cabecera de este departamento de Guatemala, destaca por su Feria Ganadera Nacional en noviembre y por albergar a más de 50.000 xincas.",
    "aboutTitle": "La Feria Ganadera Nacional y la mayor comunidad xinca de Guatemala",
    "about": "Jutiapa es la cabecera del departamento homónimo en Guatemala, situada a 125 km de la Ciudad de Guatemala en la región sur-oriente del país. Con una extensión de 620 km², es el municipio más poblado de su departamento, con alrededor de 167.049 habitantes en 2022. Su clima varía entre templado en invierno y cálido en verano, y cuenta con cinco carreteras que la conectan con otros municipios y departamentos. La ciudad comenzó como una villa en 1847 y se convirtió en cabecera departamental en 1852, recibiendo el título de ciudad el 15 de septiembre de 1878. Jutiapa es conocida por sus fiestas titulares: del 22 al 24 de julio en honor a San Cristóbal y, especialmente, la Feria Ganadera Nacional, que se celebra del 10 al 16 de noviembre. Su población es mayoritariamente ladina (63,95%), pero destaca por ser el municipio con la mayor concentración de xincas en Guatemala, con 50.320 personas que se identifican como parte de esta etnia, además de otras comunidades indígenas y garífunas."
  },
  {
    "slug": "naguanagua",
    "name": "Naguanagua",
    "kind": "ciudad",
    "icon": "💬",
    "users": 116,
    "votes": 188,
    "activity": "Media",
    "parentName": "Venezuela",
    "parentSlug": "venezuela",
    "provincia": "Carabobo",
    "regionSlug": "carabobo",
    "channels": [
      "carabobo",
      "venezuela",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "valencia-venezuela",
      "puerto-cabello",
      "maracay",
      "san-felipe",
      "san-juan-de-los-morros",
      "venezuela",
      "amistad",
      "amor"
    ],
    "intro": "Sala de chat de Naguanagua, la capital del Municipio Naguanagua en el Estado Carabobo, con una amplia área económica y comercial.",
    "aboutTitle": "Naguanagua, sede de la Universidad de Carabobo",
    "about": "Naguanagua es una localidad venezolana capital del Municipio Naguanagua, Estado Carabobo, en la Región Central de Venezuela. Es reconocida por su amplia área económica y comercial y por ser sede de una de las principales universidades de Venezuela, la reconocida Universidad de Carabobo.\n\nEn la sala de chat de Naguanagua, se habla sobre la vida en la localidad, la economía y la educación. Los usuarios pueden compartir sus experiencias y opiniones sobre la Universidad de Carabobo y otros temas de interés local. La sala es un espacio para que los habitantes de Naguanagua y personas interesadas en la localidad se conecten y compartan información."
  },
  {
    "slug": "villa-alemana",
    "name": "Villa Alemana",
    "kind": "ciudad",
    "icon": "💬",
    "users": 120,
    "votes": 199,
    "activity": "Media",
    "parentName": "Chile",
    "parentSlug": "chile",
    "provincia": "Región de Valparaíso",
    "regionSlug": "region-de-valparaiso",
    "channels": [
      "chile",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "vina-del-mar",
      "quillota",
      "valparaiso",
      "san-antonio-chile",
      "chile",
      "amistad",
      "amor"
    ],
    "intro": "Villa Alemana es una comuna y ciudad de la provincia de Marga Marga, en la Región de Valparaíso, conocida como la Ciudad de la Eterna Juventud.",
    "aboutTitle": "La Ciudad de la Eterna Juventud",
    "about": "Villa Alemana es una comuna y ciudad ubicada en la provincia de Marga Marga, dentro de la Región de Valparaíso, en la zona central de Chile. Junto con otras comunas de la zona, integra el área metropolitana del Gran Valparaíso. La fundación de la ciudad tuvo lugar el 4 de noviembre de 1894, mientras que la actual comuna fue creada posteriormente en el año 1933. Esta localidad es ampliamente conocida bajo el nombre de la Ciudad de la Eterna Juventud debido a su clima benigno, y también recibe el apelativo de la Ciudad de los Molinos por la gran cantidad de casas quintas que históricamente necesitaban extraer agua subterránea mediante molinos de viento. Por otra parte, la ciudad se encuentra oficialmente hermanada con la ciudad palestina de Belén desde el año 2006. El origen del nombre de Villa Alemana se debe directamente a la promesa que realizó su fundador, don Buenaventura Joglar Amandi, quien se comprometió a nombrar al lugar según la nacionalidad de los primeros compradores de los sitios, que resultaron ser alemanes."
  },
  {
    "slug": "momostenango",
    "name": "Momostenango",
    "kind": "ciudad",
    "icon": "💬",
    "users": 138,
    "votes": 232,
    "activity": "Media",
    "parentName": "Guatemala",
    "parentSlug": "guatemala",
    "provincia": "Departamento de Totonicapán",
    "regionSlug": "departamento-de-totonicapan",
    "channels": [
      "guatemala",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "quetzaltenango",
      "huehuetenango",
      "solola",
      "san-marcos-guatemala",
      "mazatenango",
      "guatemala",
      "amistad",
      "amor"
    ],
    "intro": "Momostenango, en el altiplano guatemalteco a 2204 m, es la «muralla de ídolos» por su nombre náhuatl y su origen en Ojer Tinamit, a 8 km del centro actual.",
    "aboutTitle": "Momostenango y su origen en Ojer Tinamit, a 8 km del centro",
    "about": "Momostenango es un municipio del departamento de Totonicapán, en el altiplano occidental de Guatemala. Su cabecera municipal se encuentra a 2204 metros sobre el nivel del mar. El nombre proviene del náhuatl y significa «muralla de ídolos». Originalmente, el poblado estaba en Ojer Tinamit («Pueblo Viejo»), a ocho kilómetros de su ubicación actual, donde se fundó a mediados del siglo XVI. En 1590 se estableció el convento de Santiago Momostenango, parte de la Provincia del Santísimo Nombre de Jesús.\n\nTras la Independencia de Centroamérica en 1821, fue uno de los municipios originales del departamento Sololá/Suchitepéquez. En 1838 formó parte del efímero Estado de Los Altos, un intento secesionista de los criollos liberales del occidente guatemalteco que fue aplastado en 1840 por el general Rafael Carrera. En 1872 se creó el departamento de Quiché a partir de territorios de Sololá/Suchitepéquez y Totonicapán/Huehuetenango."
  },
  {
    "slug": "carupano",
    "name": "Carúpano",
    "kind": "ciudad",
    "icon": "💬",
    "users": 129,
    "votes": 226,
    "activity": "Media",
    "parentName": "Venezuela",
    "parentSlug": "venezuela",
    "provincia": "Sucre",
    "regionSlug": "sucre",
    "channels": [
      "venezuela",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "maturin",
      "cumana",
      "sucre",
      "venezuela",
      "amistad",
      "amor"
    ],
    "intro": "Carúpano es una ciudad del estado Sucre que cuenta con 138.798 habitantes y destaca como un importante centro pesquero con un puerto histórico.",
    "aboutTitle": "El histórico puerto y la pesca en Carúpano",
    "about": "Carúpano es la segunda ciudad más grande del estado Sucre, en Venezuela, y se sitúa en la costa noreste de la región. Se localiza a 120 kilómetros de la capital, Cumaná, y a unos 500 kilómetros de Caracas. Según el censo de 2011, cuenta con una población de 138.798 habitantes. Geográficamente, el municipio se compone de cinco parroquias, destacando Santa Catalina y Santa Rosa en el área urbana. Esta localidad destaca como un relevante centro de pesca nacional y albergó en su día uno de los puertos más antiguos de toda América Latina.\n\nLa fundación de este asentamiento se remonta al 23 de diciembre de 1647, cuando el obispo fray Damián López de Haro erigió una capilla bajo la advocación de Santa Cruz en el núcleo de Carúpano-Arriba, dentro de la provincia de Nueva Andalucía. El nombre de la ciudad proviene del término indígena Karú-Pana, que se traduce como casa de tierra o tierra que tiene casa en el lenguaje de los uainimanes. En la actualidad, la economía local se apoya en sus funciones como centro administrativo, educativo y de salud, así como en la comercialización de productos agrícolas y pesqueros del municipio Bermúdez."
  },
  {
    "slug": "chichicastenango",
    "name": "Chichicastenango",
    "kind": "ciudad",
    "icon": "💬",
    "users": 123,
    "votes": 203,
    "activity": "Media",
    "parentName": "Guatemala",
    "parentSlug": "guatemala",
    "provincia": "Departamento de Quiché",
    "regionSlug": "departamento-de-quiche",
    "channels": [
      "guatemala",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "solola",
      "quetzaltenango",
      "huehuetenango",
      "antigua-guatemala",
      "mazatenango",
      "guatemala",
      "amistad",
      "amor"
    ],
    "intro": "Chichicastenango, municipio de Quiché en Guatemala, es el lugar de origen del Popol vuh, el libro sagrado de los mayas quiché sobre la humanidad.",
    "aboutTitle": "El municipio de Quiché donde se encontró el sagrado Popol vuh",
    "about": "Santo Tomás Chichicastenango, cuyo nombre en náhuatl significa muralla de ortigas y que honra a su santo patrono Tomás Apóstol, es un municipio situado al sur del departamento de Quiché, en Guatemala. Se localiza a 18 kilómetros de la cabecera departamental y a 145 kilómetros de la ciudad de Guatemala. La mayor parte de sus habitantes pertenece a la etnia indígena quiché. La localidad destaca a nivel internacional por su mercado local, que la convierte en un reconocido centro turístico.\n\nHistóricamente, este lugar posee una gran relevancia cultural ya que en él se encontró y redactó el Popol vuh, el libro sagrado de los mayas quiché que narra el origen de la humanidad. Esta obra, declarada Libro Nacional de Guatemala y Patrimonio Cultural Intangible de la Nación, se celebra cada 30 de mayo y fue traducida al castellano por el fraile Francisco Ximénez cuando el municipio era una doctrina de la orden de los dominicos. Durante su pasado administrativo, perteneció a Sololá y al efímero Estado de Los Altos, hasta que en 1872 se integró en el recién creado departamento de Quiché. Además, en 1935 sus paisajes sirvieron como escenario para la filmación de escenas de la película de Hollywood Las Nuevas Aventuras de Tarzán."
  },
  {
    "slug": "quilpue",
    "name": "Quilpué",
    "kind": "ciudad",
    "icon": "💬",
    "users": 142,
    "votes": 236,
    "activity": "Media",
    "parentName": "Chile",
    "parentSlug": "chile",
    "provincia": "Región de Valparaíso",
    "regionSlug": "region-de-valparaiso",
    "channels": [
      "chile",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "vina-del-mar",
      "valparaiso",
      "quillota",
      "san-antonio-chile",
      "chile",
      "amistad",
      "amor"
    ],
    "intro": "Quilpué, ciudad chilena de la Región de Valparaíso, es conocida como la «Ciudad del Sol» por su clima benigno y prodigioso.",
    "aboutTitle": "La Ciudad del Sol en la Región de Valparaíso",
    "about": "Quilpué es una comuna y ciudad chilena perteneciente a la Región de Valparaíso, capital de la Provincia de Marga Marga. Junto a las comunas de Valparaíso, Viña del Mar, Concón y Villa Alemana, integra el área metropolitana del Gran Valparaíso. Geográficamente está asentada sobre las cuencas de los esteros Quilpué, Marga Marga y Puangue, y pertenecen a ella subterritorios como El Belloto, en el área urbana, o Colliguay, en la zona rural.\n\nLa ciudad es conocida como la «Ciudad del Sol» por su clima benigno y prodigioso. Su nombre tiene varias teorías sobre su origen y significado, aunque la traducción oficial es «donde abundan especialmente las tórtolas». La ciudad es el tercer municipio más poblado de la región, por detrás de las comunas de Viña del Mar y Valparaíso, y sus principales actividades económicas son la industria manufacturera, el comercio, el rubro inmobiliario y la enseñanza."
  },
  {
    "slug": "colina-chile",
    "name": "Colina",
    "kind": "ciudad",
    "icon": "💬",
    "users": 136,
    "votes": 239,
    "activity": "Media",
    "parentName": "Chile",
    "parentSlug": "chile",
    "provincia": "Región Metropolitana de Santiago",
    "regionSlug": "region-metropolitana-de-santiago",
    "channels": [
      "chile",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "chile",
      "santiago-de-chile",
      "quillota",
      "quilpue",
      "vina-del-mar",
      "amistad",
      "amor"
    ],
    "intro": "Chat de Colina, la sala de chat de la comuna y ciudad chilena ubicada al norte de la Región Metropolitana de Santiago.",
    "aboutTitle": "La vida en la comuna de Chacabuco",
    "about": "Colina es una comuna y ciudad chilena ubicada al norte de la Región Metropolitana de Santiago, en la zona central de Chile. Es la capital de la provincia de Chacabuco. Dentro de la comuna se encuentran localidades como la ciudad de Colina, Chicureo, Chamisero, Peldehue, Las Canteras, Casas de Chacabuco y Esmeralda.\n\nEn la sala de chat de Colina, los usuarios pueden discutir sobre temas relacionados con la comuna, como su historia, sus lugares de interés y su cultura. También pueden compartir información sobre eventos y actividades que se llevan a cabo en la zona. Los usuarios que se unen a esta sala pueden ser residentes de Colina, visitantes o personas interesadas en conocer más sobre esta ciudad chilena."
  },
  {
    "slug": "boca-chica",
    "name": "Boca Chica",
    "kind": "ciudad",
    "icon": "💬",
    "users": 126,
    "votes": 219,
    "activity": "Media",
    "parentName": "República Dominicana",
    "parentSlug": "republica-dominicana",
    "provincia": "Provincia Santo Domingo",
    "regionSlug": "provincia-santo-domingo",
    "channels": [
      "republica_dominicana",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "santo-domingo-este",
      "san-pedro-de-macorris",
      "san-cristobal-rd",
      "la-romana",
      "bani",
      "republica-dominicana",
      "amistad",
      "amor"
    ],
    "intro": "Boca Chica, un municipio de la provincia Santo Domingo en la República Dominicana, con una playa que lleva su mismo nombre y un puerto importante en la región.",
    "aboutTitle": "Boca Chica, un importante puerto en la región del Gran Santo Domingo",
    "about": "Boca Chica es un municipio de la provincia Santo Domingo en la República Dominicana. La comunidad de Boca Chica fue fundada en el año 1779 durante el gobierno del Brigadier Don Isidro Peralta y Rojas con el nombre de San José de los Llanos. Boca Chica fue desarrollado originalmente por el estado dominicano a través del Ingenio Boca Chica, fundado en 1916, y luego en el decenio de 1920 por Juan Bautista Vicini Burgos, quien estableció plantaciones de azúcar. \n\nLa época dorada de Boca Chica inicia en 1949, cuando el dictador Rafael Leónidas Trujillo ordenó la construcción de un moderno hotel llamado Hotel Hamaca, que posteriormente se convirtió en emblema del lugar. El Estado construye el Hotel Hamaca con 28 habitaciones y una Suite Presidencial y Boca Chica comienza entonces a proyectarse internacionalmente y a atraer políticos, diplomáticos, hombres de negocios, artistas y otras personalidades de la jet-set, atraídos por el rumor de la paradisíacas bellezas del lugar."
  },
  {
    "slug": "villa-madero",
    "name": "Villa Madero",
    "kind": "ciudad",
    "icon": "💬",
    "users": 114,
    "votes": 193,
    "activity": "Media",
    "parentName": "Argentina",
    "parentSlug": "argentina",
    "provincia": "Provincia de Buenos Aires",
    "regionSlug": "provincia-de-buenos-aires",
    "channels": [
      "argentina",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "lanus",
      "moron",
      "lomas-de-zamora",
      "argentina",
      "buenos-aires",
      "amistad",
      "amor"
    ],
    "intro": "El Chat de Villa Madero te conecta con esta localidad de La Matanza, en Buenos Aires, que tiene 132.905 habitantes y limita con la Capital Federal.",
    "aboutTitle": "Historia de Villa Madero y los Tapiales de Altolaguirre",
    "about": "Villa Madero, también llamada Ciudad Madero, es una localidad ubicada en el partido de La Matanza, en la provincia de Buenos Aires, Argentina. Está situada en el Gran Buenos Aires y limita con la Ciudad Autónoma de Buenos Aires, así como con Tapiales, La Tablada y Ciudad Celina. Según el censo de 2010, cuenta con una población de 132.905 habitantes, lo que la convierte en la novena localidad más poblada de su partido. Para comunicarse con la capital y otras zonas, dispone de accesos como la Avenida General Paz, la Autopista Riccheri, la Avenida Boulogne Sur Mer, la Avenida San Martín, la Avenida Intendente Esteban Crovara y la Línea Belgrano Sur.\n\nEl territorio estuvo habitado originalmente por los querandíes, un pueblo seminómada que permaneció en la zona hasta la llegada de los españoles. En 1615, Hernando Arias de Saavedra otorgó las tierras al conquistador Pedro Gutiérrez. Más tarde, en 1775, la chacra pasó a Martín José de Altolaguirre, quien mandó construir tapias de tierra y plantas de cactus para dividir el campo, dando origen al nombre de los Tapiales de Altolaguirre. En octubre de 1808, la propiedad fue vendida a Francisco Ramos Mejía y María Antonia Segurola."
  },
  {
    "slug": "apatzingan-de-la-constitucion",
    "name": "Apatzingán de la Constitución",
    "kind": "ciudad",
    "icon": "💬",
    "users": 120,
    "votes": 194,
    "activity": "Media",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Michoacán",
    "regionSlug": "michoacan",
    "channels": [
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "uruapan",
      "los-cabos",
      "tamazula-de-gordiano",
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "Apatzingán de la Constitución, ciudad mexicana ubicada en el estado de Michoacán de Ocampo, con una población de 102.362 habitantes.",
    "aboutTitle": "La ciudad de la Constitución en la Tierra Caliente",
    "about": "Apatzingán de la Constitución es una ciudad mexicana ubicada en el estado de Michoacán de Ocampo. Fue fundada en 1617 por monjes franciscanos y agustinos, y permaneció como un pueblo hasta 1883, fecha en que oficialmente se le concedió el rango de ciudad. La región de Apatzingán produce grandes cantidades de limón, papaya, toronja, carambolo, etc., algunos de los cuales se exportan al extranjero. El clima de la ciudad es semiseco muy cálido y cálido.\n\nLa ciudad tiene un significado histórico importante, ya que en ella se firmó la primera constitución mexicana el 22 de octubre de 1814, por José María Morelos y Pavón. El nombre de la ciudad proviene del purépecha y significa 'donde está levantado el templo del dios Apahtzï' o por extensión, 'donde está levantado el templo del dios de la muerte'."
  },
  {
    "slug": "palo-negro",
    "name": "Palo Negro",
    "kind": "ciudad",
    "icon": "💬",
    "users": 122,
    "votes": 215,
    "activity": "Media",
    "parentName": "Venezuela",
    "parentSlug": "venezuela",
    "provincia": "Aragua",
    "regionSlug": "aragua",
    "channels": [
      "venezuela",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "maracay",
      "san-juan-de-los-morros",
      "valencia-venezuela",
      "los-teques",
      "puerto-cabello",
      "venezuela",
      "amistad",
      "amor"
    ],
    "intro": "Chat de Palo Negro, la sala para conversar sobre la ciudad capital del municipio Libertador, situada a unos 12 km al sur de Maracay, en el estado Aragua.",
    "aboutTitle": "Industria y lago de Valencia: Palo Negro en el corazón de Aragua",
    "about": "Palo Negro es una ciudad venezolana, capital del municipio Libertador, en el estado Aragua. Está ubicada a unos 12 km al sur de Maracay y se asienta en las riberas del lago de Valencia, formando parte del área metropolitana de Maracay. Su principal actividad económica gira en torno al sector industrial, con presencia de fábricas y pequeñas empresas manufactureras. Tenía una población para 2023 de 123 706 habitantes, lo que refleja su crecimiento como centro productivo. La cercanía al lago de Valencia influye en actividades recreativas y en la calidad de vida de sus habitantes. El municipio Libertador administra los servicios locales y fomenta el desarrollo de pequeñas empresas."
  },
  {
    "slug": "la-lisa",
    "name": "La Lisa",
    "kind": "ciudad",
    "icon": "💬",
    "users": 121,
    "votes": 202,
    "activity": "Media",
    "parentName": "Cuba",
    "parentSlug": "cuba",
    "provincia": "provincia de La Habana",
    "regionSlug": "provincia-de-la-habana",
    "channels": [
      "cuba",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "cuba",
      "la-habana",
      "matanzas",
      "amistad",
      "amor"
    ],
    "intro": "Chat de La Lisa, municipio de la Provincia de La Habana, surgido en 1976. Conecta con personas de La Lisa y otros lugares de la región.",
    "aboutTitle": "La Lisa, un municipio de la Provincia de La Habana",
    "about": "La Lisa es un municipio de la Provincia de La Habana, ubicado en la periferia oeste de la capital. Limita al norte con el Municipio Playa, al este con Marianao, al sur-sureste con Boyeros y al oeste con el Municipio Bauta de la vecina provincia de Artemisa. En este entorno, el chat de La Lisa se convierte en un espacio de encuentro para personas de la localidad y otros lugares que buscan compartir experiencias y discutir temas variados. Los usuarios pueden hablar sobre la vida diaria en el municipio, intereses personales, eventos locales y más. Es un lugar donde las personas pueden conectarse y establecer relaciones con otros que comparten intereses y experiencias similares. El chat de La Lisa es un espacio abierto para que todos puedan participar y compartir sus pensamientos y opiniones."
  },
  {
    "slug": "yaritagua",
    "name": "Yaritagua",
    "kind": "ciudad",
    "icon": "💬",
    "users": 139,
    "votes": 224,
    "activity": "Media",
    "parentName": "Venezuela",
    "parentSlug": "venezuela",
    "provincia": "Yaracuy",
    "regionSlug": "yaracuy",
    "channels": [
      "venezuela",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "barquisimeto",
      "san-felipe",
      "acarigua",
      "venezuela",
      "amistad",
      "amor"
    ],
    "intro": "Sala de chat de Yaritagua, ciudad venezolana capital del Municipio Peña en el Estado Yaracuy, con 136 081 habitantes según censo de 2015.",
    "aboutTitle": "Capital del Municipio Peña en Yaracuy",
    "about": "Yaritagua es una ciudad venezolana ubicada en la Región Centroccidental de Venezuela, capital del Municipio Peña en el Estado Yaracuy. Cuenta con una superficie de 510 km² y forma parte de la zona metropolitana de Barquisimeto.\n\nEn esta sala de chat los usuarios tienen la posibilidad de conversar libremente sobre cualquier aspecto relacionado con la ciudad y su entorno. Se comparten experiencias personales, recuerdos de la vida cotidiana, opiniones sobre la historia local y la cultura, y se intercambian anécdotas sobre los lugares más conocidos. La comunidad está formada por residentes, personas originarias que viven en otras regiones y visitantes que sienten curiosidad por Yaritagua. Todos pueden participar sin restricciones, plantear preguntas, comentar sobre eventos o simplemente charlar para conocer a otros con intereses similares. El espacio está abierto a quien desee conectar, intercambiar ideas y mantener viva la conversación sobre Yaritagua y sus alrededores, fomentando un ambiente de respeto y camaradería."
  },
  {
    "slug": "santa-lucia-cotzumalguapa",
    "name": "Santa Lucía Cotzumalguapa",
    "kind": "ciudad",
    "icon": "💬",
    "users": 145,
    "votes": 242,
    "activity": "Media",
    "parentName": "Guatemala",
    "parentSlug": "guatemala",
    "provincia": "Departamento de Escuintla",
    "regionSlug": "departamento-de-escuintla",
    "channels": [
      "guatemala",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "escuintla",
      "antigua-guatemala",
      "villa-nueva",
      "solola",
      "mixco",
      "guatemala",
      "amistad",
      "amor"
    ],
    "intro": "Santa Lucía Cotzumalguapa, en Escuintla, alberga la zona arqueológica Cotzumalhuapa con vestigios mayas en 432 km² y altitudes de 380 a 2.770 pies.",
    "aboutTitle": "Cotzumalhuapa: azúcar, arqueología y el río de las comadrejas",
    "about": "Santa Lucía Cotzumalguapa es un municipio del departamento de Escuintla, en la región sur de Guatemala. Ocupa una superficie de 432 km² y su terreno varía entre los 380 y los 2.770 pies sobre el nivel del mar. Se sitúa a 34 km de la cabecera departamental, Escuintla, y a 90 km de la Ciudad de Guatemala. El nombre del municipio combina el de su patrona, Santa Lucía de Siracusa, con el término náhuatl Cotzumalguapa, que significa «río de las comadrejas» o «río del arcoíris». Durante el período colonial, fue un convento y doctrina franciscana, y en 1754 pasó a ser curato secular. Su economía se basa en la agricultura, destacando la producción de azúcar, café, hule y frutas tropicales como el banano. Además, es un centro educativo importante en la zona, con presencia de sedes universitarias y centros de formación técnica."
  },
  {
    "slug": "quininde",
    "name": "Quinindé",
    "kind": "ciudad",
    "icon": "💬",
    "users": 117,
    "votes": 206,
    "activity": "Media",
    "parentName": "Ecuador",
    "parentSlug": "ecuador",
    "provincia": "Provincia de Esmeraldas",
    "regionSlug": "provincia-de-esmeraldas",
    "channels": [
      "ecuador",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "esmeraldas",
      "santo-domingo-ecuador",
      "ecuador",
      "amistad",
      "amor"
    ],
    "intro": "Quinindé, ciudad ecuatoriana en la provincia de Esmeraldas, con una población de 31.120 habitantes según el censo de 2022.",
    "aboutTitle": "Quinindé, ciudad en la confluencia de los ríos Blanco y Quinindé",
    "about": "Quinindé, también conocida como Rosa Zárate, es una ciudad ecuatoriana ubicada en la provincia de Esmeraldas, en la Región Litoral de Ecuador. Se encuentra asentada sobre una extensa llanura, en la confluencia de los ríos Blanco y Quinindé, a una altitud de 85 m s. n. m. La ciudad tiene un clima lluvioso tropical con una temperatura promedio de 27 °C.\n\nLa ciudad de Quinindé es un importante centro administrativo, económico, financiero y comercial de la provincia de Esmeraldas. Sus actividades principales son la agricultura, la ganadería y el comercio. La palma africana se introdujo en la región en 1953, y desde entonces ha sido un cultivo importante en la zona."
  },
  {
    "slug": "almoloya-de-juarez",
    "name": "Almoloya de Juárez",
    "kind": "ciudad",
    "icon": "💬",
    "users": 142,
    "votes": 235,
    "activity": "Media",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Estado de México",
    "regionSlug": "estado-de-mexico",
    "channels": [
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "san-francisco-tlalcilalcalpan",
      "san-antonio-acahualco",
      "zinacantepec",
      "san-pablo-autopan",
      "san-andres-cuexcontitlan",
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "Chat de Almoloya de Juárez, municipio del Estado de México conocido por el Centro Federal de Readaptación Social Número 1",
    "aboutTitle": "El Penal de 'El Altiplano' y más en Almoloya de Juárez",
    "about": "Almoloya de Juárez es un municipio ubicado en el valle de Toluca, en el Estado de México. Es conocido nacional e internacionalmente por albergar el Centro Federal de Readaptación Social Número 1, también conocido como Penal de 'El Altiplano'. La sala de chat de Almoloya de Juárez es un espacio para que los habitantes y visitantes del municipio se conecten y compartan sus experiencias. En esta sala, podrás encontrar a personas de diversas edades y intereses, todos unidos por su conexión con Almoloya de Juárez. Puedes hablar sobre la vida en el municipio, compartir recomendaciones de lugares para visitar o simplemente conocer a nuevos amigos."
  },
  {
    "slug": "machiques",
    "name": "Machiques",
    "kind": "ciudad",
    "icon": "💬",
    "users": 117,
    "votes": 193,
    "activity": "Media",
    "parentName": "Venezuela",
    "parentSlug": "venezuela",
    "provincia": "Zulia",
    "regionSlug": "zulia",
    "channels": [
      "zulia",
      "venezuela",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "agustin-codazzi",
      "villanueva",
      "la-paz-cesar",
      "becerril",
      "valledupar",
      "zulia",
      "venezuela",
      "amistad",
      "amor"
    ],
    "intro": "Machiques, ciudad venezolana con una industria láctea destacada y una población de 132.734 habitantes en el estado Zulia.",
    "aboutTitle": "Machiques, centro de la industria láctea en Zulia",
    "about": "Machiques es una ciudad venezolana ubicada en el occidente del país, capital del municipio Machiques de Perijá, estado Zulia. La ciudad se ubica en el piedemonte de la sierra de Perijá a 101 m s. n. m., cercana a la frontera con Colombia y registra una temperatura promedio de 27 °C con lluvias que van desde abril hasta diciembre. La principal actividad económica de la ciudad se basa en la industria láctea, siendo el centro de esta dentro del estado, dando como resultado la masiva producción de leche, y en menor medida queso y mantequilla. La ciudad fue fundada originalmente en 1750 por los españoles, aunque su fecha fundacional se considera el 18 de noviembre de 1841, cuando fue elevada a parroquia civil. La ciudad ha mantenido su importancia económica en la región gracias a su industria láctea."
  },
  {
    "slug": "navojoa",
    "name": "Navojoa",
    "kind": "ciudad",
    "icon": "💬",
    "users": 122,
    "votes": 210,
    "activity": "Media",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Sonora",
    "regionSlug": "sonora",
    "channels": [
      "sonora",
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "ciudad-obregon",
      "sonora",
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "Chat de Navojoa, ciudad mexicana ubicada en el sur del estado de Sonora, cabecera del municipio homónimo, con una historia ligada a los indígenas mayos.",
    "aboutTitle": "Navojoa, ciudad de los mayos",
    "about": "Navojoa es una ciudad mexicana ubicada en el sur del estado de Sonora, cabecera del municipio homónimo. El territorio que actualmente ocupa el municipio estuvo ocupado desde los tiempos prehispánicos por indígenas mayos, cuya historia está íntimamente ligada al valle y al río del mismo nombre. El nombre de Navojoa proviene de la lengua mayo de las raíces 'navo', nopal y 'jova' casa; significa por lo tanto 'lugar, pueblo o casa de nopal'.\n\nLa región mayo se localiza en la parte sur de Sonora, y los mayos tienen un tronco común con los yaquis, porque su lengua es parte de la familia taracahita del tronco uta azteca, con semejanzas dialectales notables con la lengua yaqui y la lengua guarijío. Los mayos fueron receptores dócilmente de las enseñanzas evangelizadoras españolas, adquiriendo al mismo tiempo conocimientos respecto de la agricultura y la crianza de animales domésticos."
  },
  {
    "slug": "porlamar",
    "name": "Porlamar",
    "kind": "ciudad",
    "icon": "💬",
    "users": 120,
    "votes": 205,
    "activity": "Media",
    "parentName": "Venezuela",
    "parentSlug": "venezuela",
    "provincia": "Nueva Esparta",
    "regionSlug": "nueva-esparta",
    "channels": [
      "venezuela",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "cumana",
      "puerto-la-cruz",
      "venezuela",
      "amistad",
      "amor"
    ],
    "intro": "Sala de chat de Porlamar, ciudad ubicada en la Isla de Margarita, Venezuela, donde usuarios comparten opiniones sobre vida diaria y tradiciones locales.",
    "aboutTitle": "La vida en el principal centro urbano de la Isla de Margarita",
    "about": "Porlamar es una ciudad ubicada en Venezuela, capital del municipio Mariño en el estado Nueva Esparta. Es el principal centro urbano y económico de la Isla de Margarita. En la sala de chat de Porlamar, los usuarios comparten experiencias y opiniones sobre la ciudad y su entorno, abordando temas como la vida diaria, la cultura y las tradiciones de la región. Los usuarios que entran en la sala son personas de diferentes edades y intereses, que buscan conectarse con otros y compartir ideas y pensamientos. También se discuten oportunidades de turismo, atractivos naturales y rutas que recorren la isla. Los participantes comparten recuerdos y anécdotas del día a día, manteniendo una atmósfera cordial y colaborativa que fomenta la amistad entre los usuarios."
  },
  {
    "slug": "chilapa-de-alvarez",
    "name": "Chilapa de Álvarez",
    "kind": "ciudad",
    "icon": "💬",
    "users": 134,
    "votes": 231,
    "activity": "Media",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Guerrero",
    "regionSlug": "guerrero",
    "channels": [
      "guerrero",
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "chilpancingo",
      "acapulco",
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "Chilapa de Álvarez, ciudad mexicana en el estado de Guerrero, es la séptima ciudad más poblada del estado con 33.783 habitantes en 2020.",
    "aboutTitle": "Chilapa de Álvarez, una ciudad en la región Centro de Guerrero",
    "about": "Chilapa de Álvarez es una ciudad mexicana ubicada en la zona centro-este del estado de Guerrero, a 54 kilómetros de la ciudad capital Chilpancingo. La ciudad es la cabecera del municipio homónimo y forma parte de la región Centro. El territorio que comprende Chilapa fue habitado desde épocas tempranas por tribus nómadas en búsqueda de alimentación y climas benignos. La ciudad tiene una superficie constituida por pequeños valles donde se localizan los principales asentamientos humanos, cubriendo el 10% aproximadamente del total del territorio. La hidrografía del municipio es atravesada por el río Xiloxuchicán, San Ángel y el río Atzacoaloya-Acatlán. Estos elementos geográficos han influido en la forma en que se ha desarrollado la ciudad a lo largo de la historia."
  },
  {
    "slug": "majes",
    "name": "Majes",
    "kind": "ciudad",
    "icon": "💬",
    "users": 144,
    "votes": 246,
    "activity": "Media",
    "parentName": "Perú",
    "parentSlug": "peru",
    "provincia": "Departamento de Arequipa",
    "regionSlug": "departamento-de-arequipa",
    "channels": [
      "peru",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "arequipa",
      "peru",
      "amistad",
      "amor"
    ],
    "intro": "Majes, distrito de Caylloma en Arequipa (Perú), creado en 1999. Su capital, El Pedregal, surgió tras irrigar la pampa desértica que ocupaba la zona hasta 1981.",
    "aboutTitle": "Majes, un distrito en crecimiento",
    "about": "Majes es un distrito de la provincia de Caylloma, en el departamento de Arequipa, al sur del Perú. Fue creado el 21 de diciembre de 1999 durante el gobierno de Alberto Fujimori, y su capital es el centro poblado El Pedregal. Hasta 1981, la zona era un desierto, pero la irrigación de la pampa alta permitió el asentamiento humano y el desarrollo de actividades como la agricultura y la ganadería. El distrito alberga el Estadio Almirante Miguel Grau, sede de la Liga Distrital de Fútbol de Majes. Caylloma, una de las ocho provincias de Arequipa, limita con otras como Castilla y Condesuyos. La transformación de la pampa desértica en tierras productivas marcó el crecimiento de la zona."
  },
  {
    "slug": "guasdualito",
    "name": "Guasdualito",
    "kind": "ciudad",
    "icon": "💬",
    "users": 117,
    "votes": 194,
    "activity": "Media",
    "parentName": "Venezuela",
    "parentSlug": "venezuela",
    "provincia": "Apure",
    "regionSlug": "apure",
    "channels": [
      "venezuela",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "arauca",
      "arauquita",
      "venezuela",
      "amistad",
      "amor"
    ],
    "intro": "Guasdualito, ciudad fronteriza entre Venezuela y Colombia, es un importante centro petrolero en el estado Apure, con una población de 71.661 habitantes en 2023.",
    "aboutTitle": "Guasdualito, centro petrolero y fronterizo",
    "about": "Guasdualito es una ciudad del estado Apure, Venezuela, ubicada en la frontera con Colombia. Es un importante punto fronterizo para el intercambio comercial y se ha convertido en el más grande centro petrolero de la región. La ciudad tiene una población de 71.661 habitantes, según el censo de 2023.\n\nEl nombre de Guasdualito se origina de una tribu de indios achaguas y deriva de una especie de gramíneas o bambú, conocida popularmente como guadua, guasdua o «guafa», que se encuentra en la región. La ciudad tiene una rica historia que se remonta al año 1750, cuando aparece en la historia un hato en los alrededores de Guasdualito. Para el año 1765, se considera un centro poblado y fue refundado por Don José Ignacio del Pumar y Traspuesto en 1771 y 1772."
  },
  {
    "slug": "cagua",
    "name": "Cagua",
    "kind": "ciudad",
    "icon": "💬",
    "users": 139,
    "votes": 226,
    "activity": "Media",
    "parentName": "Venezuela",
    "parentSlug": "venezuela",
    "provincia": "Aragua",
    "regionSlug": "aragua",
    "channels": [
      "venezuela",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "maracay",
      "san-juan-de-los-morros",
      "los-teques",
      "valencia-venezuela",
      "puerto-cabello",
      "venezuela",
      "amistad",
      "amor"
    ],
    "intro": "Cagua, capital del municipio Sucre en el estado Aragua, Venezuela, es una ciudad con un importante parque industrial y un rico pasado histórico.",
    "aboutTitle": "Cagua, ciudad industrial en el valle del río Aragua",
    "about": "Cagua es una ciudad de Venezuela, capital del municipio Sucre, situada a 458 m s. n. m. en el valle del río Aragua. Está atravesada de norte a sur por la Carretera Nacional Cagua - La Villa, importante arteria vial que comunica los Valles de Aragua con los Llanos centrales. La ciudad se estructuró en el 29 de noviembre de 1620 como pueblo de originarios denominado «Cagua La Vieja» por el teniente gobernador Pedro José Gutiérrez de Lugo y el vicario general Presbítero Gabriel de Mendoza. Su nombre proviene del dialecto indígena «Caguacao», que significa «La Villa del Caracol». El caracol es un símbolo de la ciudad."
  },
  {
    "slug": "palma-soriano",
    "name": "Palma Soriano",
    "kind": "ciudad",
    "icon": "💬",
    "users": 120,
    "votes": 194,
    "activity": "Media",
    "parentName": "Cuba",
    "parentSlug": "cuba",
    "provincia": "Provincia de Santiago de Cuba",
    "regionSlug": "provincia-de-santiago-de-cuba",
    "channels": [
      "cuba",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "santiago-de-cuba",
      "bayamo",
      "holguin",
      "guantanamo",
      "manzanillo",
      "cuba",
      "amistad",
      "amor"
    ],
    "intro": "Palma Soriano, ciudad ubicada en la provincia de Santiago de Cuba, con una población de más de 120 mil habitantes en 2020.",
    "aboutTitle": "Palma Soriano, ciudad en las orillas del río Cauto",
    "about": "Palma Soriano es un municipio-ciudad del sureste de Cuba, situada en la provincia de Santiago de Cuba. Ocupa 845 km², mientras que el municipio se extiende por 1872 km². La ciudad se encuentra ubicada en las orillas del río Cauto.\n\nFue fundada en el año 1775, mediante la donación que realizara a la Iglesia católica la señora De los Llamos y Rizo, quien ofreció para su fundación los terrenos de la hacienda Cauto Garzón. El desarrollo de Palma fue incrementándose con la llegada de poderosos hacendados a mediados de 1800, y entre ellos se destacaron el Marqués de la Candelaria de Yarayabo, poseedor de enormes extensiones de tierra, al igual que familias acomodadas, que residían en la ciudad y mantenían prósperos cultivos de caña y café, centrales azucareros, comercios, acueductos, etc."
  },
  {
    "slug": "totonicapan",
    "name": "Totonicapán",
    "kind": "ciudad",
    "icon": "💬",
    "users": 117,
    "votes": 191,
    "activity": "Media",
    "parentName": "Guatemala",
    "parentSlug": "guatemala",
    "provincia": "Departamento de Totonicapán",
    "regionSlug": "departamento-de-totonicapan",
    "channels": [
      "guatemala",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "quetzaltenango",
      "solola",
      "mazatenango",
      "san-marcos-guatemala",
      "huehuetenango",
      "guatemala",
      "amistad",
      "amor"
    ],
    "intro": "Totonicapán, departamento guatemalteco en la región sur-occidental, con raíces quichés y legado colonial como segunda provincia del señorío Quiché.",
    "aboutTitle": "Totonicapán, un departamento con una rica historia",
    "about": "Totonicapán es un departamento de Guatemala situado en la región sur-occidental del país. Su nombre, de origen náhuatl, combina «totonilco» (agua caliente) y «pan» (arriba), que se interpreta como «arriba en el agua caliente». Durante la época precolombina, el territorio fue la segunda provincia en importancia del señorío Quiché.\n\nEn el período colonial, formó parte del corregimiento de Totonicapán. En 1820, la revuelta indígena liderada por Atanasio Tzul contra autoridades peninsulares y criollas fue sofocada por milicianos ladinos. Tras la Independencia de Centroamérica en 1821, el departamento quedó integrado en la división Totonicapán/Huehuetenango. En 1838, la ciudad de Totonicapán tuvo un papel clave en la creación del Estado de Los Altos, reconocido por el Congreso de la República Federal de Centro América."
  },
  {
    "slug": "charallave",
    "name": "Charallave",
    "kind": "ciudad",
    "icon": "💬",
    "users": 122,
    "votes": 211,
    "activity": "Media",
    "parentName": "Venezuela",
    "parentSlug": "venezuela",
    "provincia": "Miranda",
    "regionSlug": "miranda",
    "channels": [
      "miranda",
      "venezuela",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "los-teques",
      "venezuela",
      "caracas",
      "guarenas",
      "san-juan-de-los-morros",
      "miranda",
      "amistad",
      "amor"
    ],
    "intro": "Chat de Charallave: charla en la ciudad venezolana capital del Municipio Cristóbal Rojas, con una población de 157.409 habitantes según el censo 2023.",
    "aboutTitle": "Estaciones de tren y historia de Charallave",
    "about": "Charallave es una ciudad del estado Miranda, Venezuela, capital del municipio Cristóbal Rojas, uno de los 21 municipios de la entidad. Fue fundada en 1681 por el Padre Cirilo de Otoniente bajo el nombre de Santa Rosa de Lima, con el objetivo de crear un punto comercial entre Caracas y los Valles de Aragua. Según el censo de 2023 cuenta con 157.409 habitantes. La localidad forma parte de la subregión de los Valles del Tuy y destaca por su infraestructura ferroviaria, que incluye la Estación Charallave Norte, la Estación Generalísimo Francisco de Miranda y la Estación Charallave Sur Simón Rodríguez, lo que la sitúa como un nodo productivo y financiero de la zona. Gracias a su proximidad a la capital, Charallave se ha convertido en un centro poblado estrechamente relacionado con Caracas, donde se concentran centros económicos, comerciales e industriales, así como fábricas, empresas y puestos comerciales. Este conjunto de actividades ha generado un impacto positivo en el ámbito socioeconómico de la subregión, reforzando su papel como uno de los municipios más productivos de los Valles del Tuy."
  },
  {
    "slug": "uribia",
    "name": "Uribia",
    "kind": "ciudad",
    "icon": "💬",
    "users": 126,
    "votes": 208,
    "activity": "Media",
    "parentName": "Colombia",
    "parentSlug": "colombia",
    "provincia": "La Guajira",
    "regionSlug": "la-guajira",
    "channels": [
      "colombia",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "maicao",
      "albania",
      "riohacha",
      "barrancas",
      "fonseca",
      "colombia",
      "amistad",
      "amor"
    ],
    "intro": "Uribia, municipio wayúu en La Guajira colombiana, es la «capital indígena de Colombia» desde 1935 y puerta al Cabo de La Vela y Punta Gallinas.",
    "aboutTitle": "Uribia y el resguardo wayúu de la Alta Guajira",
    "about": "Uribia es el municipio más septentrional de Colombia, ubicado en la península de La Guajira. Refundado el 1 de marzo de 1935 como parte de un plan de integración nacional, su nombre rinde homenaje al líder liberal Rafael Uribe Uribe. La localidad es reconocida como la «capital indígena de Colombia» por ser el centro administrativo del gran resguardo wayúu, que abarca la Alta y Media Guajira y donde esta etnia ha vivido desde tiempos precolombinos.\n\nEl territorio, marcado por el desierto guajiro, alberga dos de los paisajes más representativos de la región: el Cabo de La Vela y Punta Gallinas. Cada año, Uribia celebra el Festival de la Cultura Wayúu, uno de los eventos culturales más destacados de La Guajira, junto a las fiestas patronales de la Inmaculada Concepción de María y el aniversario de su fundación, que se conmemora el 1 de marzo."
  },
  {
    "slug": "coronel",
    "name": "Coronel",
    "kind": "ciudad",
    "icon": "💬",
    "users": 119,
    "votes": 210,
    "activity": "Media",
    "parentName": "Chile",
    "parentSlug": "chile",
    "provincia": "Región del Biobío",
    "regionSlug": "region-del-biobio",
    "channels": [
      "chile",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "concepcion",
      "los-angeles-chile",
      "chillan",
      "chile",
      "amistad",
      "amor"
    ],
    "intro": "Coronel, comuna de la Región del Biobío, ubicada exactamente en el Centro Geográfico de Chile Continental, a 30 km al sur del centro de Concepción.",
    "aboutTitle": "Coronel, centro geográfico de Chile Continental",
    "about": "Coronel es una comuna de la zona sur de Chile, perteneciente a la provincia de Concepción, Región del Biobío. La comuna limita al norte con las comunas de San Pedro de la Paz, Chiguayante y Hualqui; al sur con las comunas de Lota y Santa Juana; al este con la comuna de Hualqui, y al oeste con el océano Pacífico.\n\nLa isla Santa María forma parte de la comuna, que es representada en ella por un delegado municipal. La zona geográfica actualmente delimitada como Coronel poseía tierras arenosas, llanuras con ciénagas cercadas por redes montañosas, y una vegetación y bosques que la cubrían hasta llegar muy cerca de la costa."
  },
  {
    "slug": "comitan-de-dominguez",
    "name": "Comitán de Domínguez",
    "kind": "ciudad",
    "icon": "💬",
    "users": 111,
    "votes": 198,
    "activity": "Media",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Chiapas",
    "regionSlug": "chiapas",
    "channels": [
      "chiapas",
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "queretaro",
      "chiapas",
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "Comitán de Domínguez es una ciudad mexicana situada en el estado de Chiapas, cabecera del municipio homónimo y cuna de personajes de relevancia histórica.",
    "aboutTitle": "La ciudad de Comitán de las Flores",
    "about": "Comitán de Domínguez es una ciudad mexicana situada en el estado de Chiapas, cabecera del municipio homónimo. Tradicionalmente es conocida como Comitán de las Flores, pero ostenta el apellido Domínguez en honor a Belisario Domínguez Palencia, mártir de la Libre Expresión, originario de esta ciudad. Etimológicamente, Comitán viene del náhuatl Komitl-tlan, que significa lugar de alfareros, cuyo término fue castellanizado luego de la conquista. También ostentó el nombre maya Balún Canán, que significa lugar de las nueve estrellas e inspiró la novela homónima de Rosario Castellanos. La ciudad se caracteriza por su variedad de estilos arquitectónicos como son el neoclásico, barroco y el neogótico. Es reconocida históricamente por ser el sitio donde se inició la independencia de Chiapas y Centroamérica. Su población es predominantemente ladina e indígena, pertenecientes a las etnias tojolabal y tseltal, y cuenta con una rica historia y tradiciones mayenses, preservadas por las comunidades nativas de la región."
  },
  {
    "slug": "iguala",
    "name": "Iguala de la Independencia",
    "kind": "ciudad",
    "icon": "💬",
    "users": 143,
    "votes": 247,
    "activity": "Media",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Guerrero",
    "regionSlug": "guerrero",
    "channels": [
      "guerrero",
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "ixtapan-de-la-sal",
      "emiliano-zapata-edomex",
      "cuernavaca",
      "tenango-de-arista",
      "chilpancingo",
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "Iguala de la Independencia, en Guerrero, es la única ciudad citada en el Himno Nacional Mexicano y donde se confeccionó la primera Bandera de México en 1821.",
    "aboutTitle": "Iguala, cuna de la Bandera de México y citada en el Himno Nacional",
    "about": "Iguala de la Independencia es una ciudad del norte del estado de Guerrero, a 190 kilómetros de la Ciudad de México. Se ubica en un valle rodeado por nueve montañas y es la tercera localidad más poblada de la entidad, con 132.854 habitantes según el censo de 2020. Su nombre proviene del náhuatl *yohualcehuatl*, que significa 'donde serena la noche'.\n\nEl 24 de febrero de 1821, Agustín de Iturbide proclamó aquí el Plan de Iguala, que reconoció la independencia de México y unió a los ejércitos insurgente y realista en el Ejército Trigarante. Ese mismo día, el sastre José Magdaleno Ocampo confeccionó la primera Bandera de México, cuyos colores —blanco, verde y rojo— simbolizan religión, independencia y unión. Por este hecho, Iguala es considerada la cuna del lábaro patrio y alberga el Museo del Lábaro Patrio, con una colección de banderas históricas. Además, es la única ciudad mencionada en el Himno Nacional Mexicano y fue la primera capital de Guerrero en 1849."
  },
  {
    "slug": "pochuta",
    "name": "Pochuta",
    "kind": "ciudad",
    "icon": "💬",
    "users": 140,
    "votes": 238,
    "activity": "Media",
    "parentName": "Guatemala",
    "parentSlug": "guatemala",
    "provincia": "Departamento de Chimaltenango",
    "regionSlug": "departamento-de-chimaltenango",
    "channels": [
      "guatemala",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "solola",
      "antigua-guatemala",
      "escuintla",
      "mazatenango",
      "mixco",
      "guatemala",
      "amistad",
      "amor"
    ],
    "intro": "Chat de Pochuta, municipio del departamento de Chimaltenango en Guatemala con una población de 10.764 habitantes según censo oficial de 2018.",
    "aboutTitle": "Pochuta, un municipio del departamento de Chimaltenango",
    "about": "Pochuta, o San Miguel Pochuta, es un municipio del departamento de Chimaltenango, en la República de Guatemala. Según censo oficial de 2018, tenía una población de 10.764 habitantes. La localidad obtuvo la categoría de municipalidad en 1921. Las fiestas patronales son celebradas en el mes de septiembre en honor a San Miguel Arcángel.\n\n San Miguel Pochuta es uno de los dieciséis municipios que conforman el departamento de Chimaltenango, ubicado en la parte sur del departamento. Su territorio lo constituyen 170 kilómetros cuadrados, que en la parte norte es montañosa, formando un gran cañón por el que desciende el río Nicán (afluente del río Coyolate), uno de los seis que bañan las fértiles tierras, que se hacen más accesibles en las partes media y baja del municipio."
  },
  {
    "slug": "quibor",
    "name": "Quíbor",
    "kind": "ciudad",
    "icon": "💬",
    "users": 128,
    "votes": 226,
    "activity": "Media",
    "parentName": "Venezuela",
    "parentSlug": "venezuela",
    "provincia": "Lara",
    "regionSlug": "lara",
    "channels": [
      "venezuela",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "barquisimeto",
      "acarigua",
      "guanare",
      "san-felipe",
      "trujillo-venezuela",
      "venezuela",
      "amistad",
      "amor"
    ],
    "intro": "Quíbor, ciudad venezolana en el estado Lara, con 110.536 habitantes y conocida como Ciudad Artesanal de Venezuela.",
    "aboutTitle": "Quíbor, Ciudad Artesanal de Venezuela",
    "about": "Quíbor es una ciudad venezolana, capital del municipio Jiménez en el estado Lara. Es considerada Ciudad Artesanal de Venezuela, por su artesanía. Tiene 110.536 habitantes, la mitad de la población del municipio. Quíbor es también la capital de la parroquia Juan Bautista Rodríguez. Forma parte de la Gran Barquisimeto.\n\nQuíbor se ha convertido por sus yacimientos arqueológicos en uno de los lugares más relevantes en Venezuela. En el Museo Antropológico Francisco Tamayo de Quíbor se guardan las piezas halladas en dichos yacimientos. La organización social de los indígenas habitantes del valle de Quíbor era el cacicazgo. La agricultura estaba desarrollada y la metalurgia aún se limitaba al tratamiento de metal para objetos decorativos."
  },
  {
    "slug": "tinaquillo",
    "name": "Tinaquillo",
    "kind": "ciudad",
    "icon": "💬",
    "users": 147,
    "votes": 249,
    "activity": "Media",
    "parentName": "Venezuela",
    "parentSlug": "venezuela",
    "provincia": "Cojedes",
    "regionSlug": "cojedes",
    "channels": [
      "venezuela",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "valencia-venezuela",
      "san-felipe",
      "puerto-cabello",
      "maracay",
      "san-juan-de-los-morros",
      "venezuela",
      "amistad",
      "amor"
    ],
    "intro": "Chat de Tinaquillo, la sala de conversación para residentes y visitantes de la ciudad situada a 420 m s.n.m. a orillas del río Tamanaco, con 124.919 habitantes.",
    "aboutTitle": "Río Tamanaco y la altiplanicie de Tinaquillo",
    "about": "Tinaquillo es la capital del Municipio Tinaquillo, en el estado Cojedes, Venezuela. Fue fundada bajo el nombre de Nuestra Señora del Socorro de Tinaquillo; la fecha exacta de su fundación sigue siendo objeto de debate entre los historiadores, aunque el llamado a “Recogimiento a Pueblo” se registró el 25 de abril de 1760. La ciudad cuenta con 124.919 habitantes y se sitúa en una altiplanicie a 420 metros sobre el nivel del mar, a orillas del río Tamanaco. La Troncal 005 la enlaza con Valencia y Tinaco, facilitando el tránsito de personas y mercancías y contribuyendo al desarrollo local. En la sala de chat de Tinaquillo los usuarios pueden conversar sobre la historia, la geografía y la vida cotidiana del municipio, intercambiando información y manteniéndose al día con los temas de interés local. Los participantes pueden compartir experiencias, plantear dudas y conocer opiniones de otros habitantes y visitantes. El espacio está abierto a quien desee conocer más sobre la identidad y el desarrollo de Tinaquillo."
  },
  {
    "slug": "huaral",
    "name": "Huaral",
    "kind": "ciudad",
    "icon": "💬",
    "users": 136,
    "votes": 227,
    "activity": "Media",
    "parentName": "Perú",
    "parentSlug": "peru",
    "provincia": "Departamento de Lima",
    "regionSlug": "departamento-de-lima",
    "channels": [
      "peru",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "huacho",
      "callao",
      "peru",
      "lima",
      "amistad",
      "amor"
    ],
    "intro": "Chat de Distrito de Huaral: conecta con vecinos que limitan al oeste con Chancay, al este con Ihuarí y Sumbilca, al norte con Huaura y al sur con Aucallama.",
    "aboutTitle": "Límites de Huaral con Chancay, Ihuarí y Sumbilca",
    "about": "El distrito de Huaral es uno de los doce que forman la provincia homónima, situada en el departamento de Lima, Perú. Limita al oeste con el distrito de Chancay, al este con los distritos de Ihuarí y Sumbilca, al norte con la provincia de Huaura y al sur con el distrito de Aucallama. En la sala de chat de Distrito de Huaral los residentes y personas interesadas pueden intercambiar información sobre temas locales: eventos comunitarios, servicios municipales, actividades del mercado y cuestiones de seguridad. Participan vecinos, comerciantes y visitantes que buscan compartir experiencias cotidianas, resolver dudas y mantenerse informados sobre la vida en el distrito. La conversación también abarca temas como educación, salud, transporte y cultura local, permitiendo a los participantes estar al día de las iniciativas y proyectos que se desarrollan en el distrito. Además, la sala facilita la coordinación entre vecinos para la organización de actividades vecinales y el apoyo mutuo en situaciones cotidianas."
  },
  {
    "slug": "moran",
    "name": "Morán",
    "kind": "ciudad",
    "icon": "💬",
    "users": 116,
    "votes": 188,
    "activity": "Media",
    "parentName": "Venezuela",
    "parentSlug": "venezuela",
    "provincia": "Lara",
    "regionSlug": "lara",
    "channels": [
      "venezuela",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "barquisimeto",
      "trujillo-venezuela",
      "acarigua",
      "guanare",
      "valera",
      "venezuela",
      "amistad",
      "amor"
    ],
    "intro": "Chat de Morán, la sala para conversar sobre el municipio del sur de Lara, que limita con Torres al norte y cubre una superficie de 2 231 km².",
    "aboutTitle": "Morán: municipio de 2 231 km² en el sur de Lara",
    "about": "Morán es un municipio situado al sur del estado Lara, en Venezuela. Limita al norte con el municipio Torres, al sur con el estado Portuguesa, al este con los municipios Andrés Eloy Blanco y Jiménez y al oeste con el estado Trujillo. Con una superficie de 2 231 km², su capital es la ciudad de El Tocuyo. Según el último censo, el municipio alberga 167 876 habitantes.\n\nEn la sala de chat de Morán los residentes, estudiantes y personas vinculadas a la zona comparten información sobre la vida cotidiana, eventos locales, la actividad del mercado y cuestiones relacionadas con la geografía y la historia del municipio. Se discuten temas como la agricultura, la cultura local y la movilidad entre los municipios limítrofes, y participan tanto habitantes de El Tocuyo como de los pueblos circundantes. También se tratan temas de educación, salud y transporte, esenciales para la comunidad local. Los participantes intercambian experiencias y opiniones sobre la vida cotidiana."
  },
  {
    "slug": "catacamas",
    "name": "Catacamas",
    "kind": "ciudad",
    "icon": "💬",
    "users": 130,
    "votes": 217,
    "activity": "Media",
    "parentName": "Honduras",
    "parentSlug": "honduras",
    "provincia": "Departamento de Olancho",
    "regionSlug": "departamento-de-olancho",
    "channels": [
      "honduras",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "juticalpa",
      "danli",
      "honduras",
      "amistad",
      "amor"
    ],
    "intro": "Chat de Catacamas, la sala para conversar sobre el municipio del departamento de Olancho, Honduras, donde se comparten temas locales y cotidianos.",
    "aboutTitle": "Catacamas: municipio de Olancho y su mercado local",
    "about": "Catacamas es un municipio del departamento de Olancho, en la República de Honduras. En la página web oficial del municipio aparece el título “Tierra de cielos abiertos”, que forma parte de la presentación institucional. El directorio municipal enumera una amplia gama de comercios y servicios, entre los que se incluyen mercados, centros de salud, colegios, agencias de viajes, tiendas de alimentos, talleres mecánicos, instituciones financieras y establecimientos de ocio. La actividad económica del municipio está ligada al sector agrícola y a la oferta de servicios para la población local. En la sala de chat de Catacamas los usuarios intercambian información sobre eventos, oportunidades laborales, servicios municipales y cuestiones cotidianas. Participan residentes, comerciantes y visitantes que buscan consultar datos, compartir opiniones o mantenerse al día con las novedades del municipio. El espacio permite mantener el contacto con la comunidad y conocer de primera mano los cambios y actividades que se desarrollan en la zona."
  },
  {
    "slug": "socopo",
    "name": "Socopó",
    "kind": "ciudad",
    "icon": "💬",
    "users": 141,
    "votes": 246,
    "activity": "Media",
    "parentName": "Venezuela",
    "parentSlug": "venezuela",
    "provincia": "Estado Barinas",
    "regionSlug": "estado-barinas",
    "channels": [
      "venezuela",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "merida-venezuela",
      "barinas",
      "el-vigia",
      "venezuela",
      "amistad",
      "amor"
    ],
    "intro": "Socopó, un importante centro financiero y económico en Venezuela, nació ilegalmente en 1954 en el estado Barinas.",
    "aboutTitle": "Socopó, un centro financiero y económico en Barinas",
    "about": "Socopó es una ciudad ubicada en el estado Barinas, Venezuela, y es considerada un importante centro financiero y económico en la región. La ciudad nació ilegalmente en 1954, cuando un grupo de personas lideradas por el valenciano Ronny Raciny y su socio Stiben Corro decidieron establecerse en la zona.\n\nLa ciudad se encuentra ubicada en el piedemonte andino-llanero, cerca del Parque Nacional, y su nombre se debe a un cacique indígena llamado Socopó, perteneciente a la tribu de arahuacos que habitaba en la zona. A lo largo de su historia, Socopó ha enfrentado desafíos, incluyendo la quema de chozas y ranchos por parte de los Organismos de Seguridad del Estado, pero ha logrado crecer y convertirse en un importante centro económico."
  },
  {
    "slug": "ixcan",
    "name": "Ixcán",
    "kind": "ciudad",
    "icon": "💬",
    "users": 111,
    "votes": 185,
    "activity": "Media",
    "parentName": "Guatemala",
    "parentSlug": "guatemala",
    "provincia": "Departamento de Quiché",
    "regionSlug": "departamento-de-quiche",
    "channels": [
      "guatemala",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "coban",
      "huehuetenango",
      "guatemala",
      "amistad",
      "amor"
    ],
    "intro": "Chat de Ixcán, municipio de 1.575 km² en la Franja Transversal del Norte de Guatemala, con sede en Playa Grande. Conecta con su comunidad.",
    "aboutTitle": "Ixcán, municipio de la Franja Transversal del Norte",
    "about": "Ixcán es un municipio del norte del Departamento de Quiché, en la República de Guatemala. Se ubica dentro de la zona petrolera conocida como la Franja Transversal del Norte y ocupa una superficie de 1.575 kilómetros cuadrados. Su cabecera municipal es Playa Grande, y la mayor parte de su población pertenece a grupos étnicos indígenas que se asentaron tras la creación de la Franja Transversal del Norte en 1970. Antes de esa fecha la zona era considerada inhóspita; durante el establecimiento de los límites con México entre 1882 y 1896 se registraron cientos de muertes entre los trabajadores de la Comisión Guatemalteca de Límites, reflejo de las duras condiciones de vida."
  },
  {
    "slug": "melipilla",
    "name": "Melipilla",
    "kind": "ciudad",
    "icon": "💬",
    "users": 130,
    "votes": 211,
    "activity": "Media",
    "parentName": "Chile",
    "parentSlug": "chile",
    "provincia": "Región Metropolitana de Santiago",
    "regionSlug": "region-metropolitana-de-santiago",
    "channels": [
      "chile",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "san-antonio-chile",
      "chile",
      "santiago-de-chile",
      "rancagua",
      "vina-del-mar",
      "amistad",
      "amor"
    ],
    "intro": "Melipilla, capital provincial en la Región Metropolitana de Santiago, se ubica entre la Cordillera de la Costa y cuenta con 150.466 habitantes.",
    "aboutTitle": "Melipilla, la capital provincial de los cuatro pillanes",
    "about": "Melipilla es una de las 52 comunas de la Región Metropolitana de Santiago, en Chile, y ejerce como la ciudad capital de la provincia homónima. Su nombre proviene del mapudungun meli pillañ, que significa cuatro pillanes. Situada al suroeste de Santiago de Chile, entre la Cordillera de la Costa, constituye una de las ciudades satélite de mayor importancia para el Gran Santiago. El territorio comunal abarca una superficie de 1.338 kilómetros cuadrados y limita con otras diez comunas, entre las que se encuentran María Pinto, Curacaví, San Pedro, Alhué, Isla de Maipo, El Monte, Peñaflor, Padre Hurtado, Paine y San Antonio. Para el año 2025, la comuna central registra una población de 150.466 habitantes, calculada a partir de los 123.627 habitantes registrados en el censo de 2017.\n\nLa presencia humana en esta zona se remonta a la última glaciación, aproximadamente en el año 11.000 a. C., con la llegada de cazadores y recolectores del Periodo Arcaico de América. Posteriormente se asentaron grupos de las culturas Bato y Llolleo durante el periodo agroalfarero temprano. En el siglo XV, el territorio entró en contacto con el Imperio Inca, que estableció un asentamiento en Talagante bajo el mando del príncipe Tala Canta Ilabe. Con la posterior llegada de los españoles, denominados wingka por los nativos, los indígenas locales, conocidos como picones o promaucaes, vieron alterada su organización. El centro de los picones se situaba en el pago de Pico, cerca de Melipilla, donde setenta indígenas fueron encomendados al obispo Rodrigo González Marmolejo por Valdivia."
  },
  {
    "slug": "samana-rd",
    "name": "Samaná",
    "kind": "ciudad",
    "icon": "💬",
    "users": 139,
    "votes": 232,
    "activity": "Media",
    "parentName": "República Dominicana",
    "parentSlug": "republica-dominicana",
    "provincia": "Samaná",
    "regionSlug": "samana",
    "channels": [
      "republica_dominicana",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "san-pedro-de-macorris",
      "higuey",
      "la-romana",
      "santo-domingo-este",
      "san-francisco-de-macoris",
      "republica-dominicana",
      "amistad",
      "amor"
    ],
    "intro": "Chat de Samaná: conecta con usuarios del municipio dominicano Santa Bárbara de Samaná, situado en la provincia de Samaná.",
    "aboutTitle": "Municipio de Santa Bárbara de Samaná en la provincia homónima",
    "about": "Santa Bárbara de Samaná, conocido simplemente como Samaná, es un municipio de la República Dominicana situado en la provincia de Samaná. La sala de chat de Samaná permite a residentes, visitantes y personas interesadas intercambiar opiniones y experiencias vinculadas a la zona. En el espacio se discuten temas cotidianos, actividades locales, cuestiones de turismo, pesca, cultura y cualquier asunto relevante para la comunidad. Los participantes utilizan español neutro y evitan frases promocionales o imperativos, manteniendo un tono directo y concreto. La conversación se centra en datos verificables y en vivencias propias de quienes conocen la localidad. La comunidad virtual refleja la diversidad de sus miembros, ofreciendo un lugar donde se comparten información, se hacen preguntas y se debate sobre la realidad de Samaná. El intercambio es abierto y respetuoso, sin ánimo comercial. Se comparten noticias locales, eventos y opiniones sobre la vida en la zona, siempre con claridad y precisión."
  },
  {
    "slug": "la-union-norte",
    "name": "La Unión Norte",
    "kind": "ciudad",
    "icon": "💬",
    "users": 129,
    "votes": 221,
    "activity": "Media",
    "parentName": "El Salvador",
    "parentSlug": "el-salvador",
    "provincia": "Departamento de La Unión",
    "regionSlug": "departamento-de-la-union",
    "channels": [
      "el_salvador",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "san-miguel",
      "usulutan",
      "choluteca",
      "honduras",
      "tegucigalpa",
      "el-salvador",
      "amistad",
      "amor"
    ],
    "intro": "La Unión Norte, municipio del Departamento de La Unión en El Salvador, limita al norte y este con Honduras por el Río Goascorán y tiene 10 distritos.",
    "aboutTitle": "La Unión Norte, un municipio en la frontera con Honduras",
    "about": "La Unión Norte es uno de los 44 municipios de El Salvador ubicado en la región norte del Departamento de La Unión. Fue creado el 13 de junio de 2023 y está conformado por 10 distritos, entre ellos Lislique, Nueva Esparta, Polorós y Concepción de Oriente. La Unión Norte tiene una población de 107.540 habitantes, lo que lo convierte en el municipio número 22 a nivel nacional en términos de población. Su nombre actual fue declarado oficial en 1954. La creación de La Unión Norte como municipio es un paso importante en la organización territorial del país y refleja la evolución de la región a lo largo de los años."
  },
  {
    "slug": "paita",
    "name": "Paita",
    "kind": "ciudad",
    "icon": "💬",
    "users": 122,
    "votes": 201,
    "activity": "Media",
    "parentName": "Perú",
    "parentSlug": "peru",
    "provincia": "Departamento de Piura",
    "regionSlug": "departamento-de-piura",
    "channels": [
      "peru",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "piura",
      "sullana",
      "talara",
      "peru",
      "amistad",
      "amor"
    ],
    "intro": "Paita, ciudad peruana ubicada a orillas del océano Pacífico, es la capital del distrito y de la provincia homónimos en el departamento de Piura.",
    "aboutTitle": "Paita, ciudad portuaria del norte peruano",
    "about": "Paita es una ciudad peruana que se encuentra a 57 km de la ciudad de Piura, en el departamento de Piura. Es la capital del distrito y de la provincia homónimos. La ciudad posee el segundo puerto más importante del país después del Callao y es la 19.ª ciudad más poblada del país, con 145 309 habitantes según el censo de 2017. Debido a su situación geográfica, Paita posee un clima cálido y húmedo durante todo el año, con una temperatura promedia anual de 25 °C.\n\nLa ciudad fue fundada el 30 de abril de 1532 con el nombre de San Francisco de Paita de la Buena Esperanza por el conquistador Francisco Pizarro. Conserva el estilo colonial en sus viejas casonas e iglesias, y el turismo es un importante sector de su economía. El nombre de Paita proviene del vocablo quechua tayta, que significa 'padre', 'amo' o 'señor'."
  },
  {
    "slug": "lo-barnechea",
    "name": "Lo Barnechea",
    "kind": "ciudad",
    "icon": "💬",
    "users": 124,
    "votes": 208,
    "activity": "Media",
    "parentName": "Chile",
    "parentSlug": "chile",
    "provincia": "Región Metropolitana de Santiago",
    "regionSlug": "region-metropolitana-de-santiago",
    "channels": [
      "chile",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "chile",
      "santiago-de-chile",
      "melipilla",
      "quillota",
      "rancagua",
      "amistad",
      "amor"
    ],
    "intro": "Lo Barnechea, comuna del nororiente de Santiago, ocupa el 48% de la provincia con zonas residenciales y el histórico Pueblo de Lo Barnechea desde el siglo XIX.",
    "aboutTitle": "Lo Barnechea: el pueblo que resiste a la conurbación de Santiago",
    "about": "Lo Barnechea es una comuna de la Región Metropolitana de Santiago, ubicada en el sector nororiente de la provincia. Limita al norte con Los Andes, al oeste con Colina, al suroeste con Vitacura y Huechuraba, al sur con Las Condes y al este con San José de Maipo. Su territorio abarca casi la mitad de la superficie provincial, combinando áreas urbanas con paisajes naturales.\n\nSu historia se remonta a miles de años, con ocupación de culturas prehispánicas como la Llolleo, Bato y Aconcagua. Los habitantes originarios, llamados huaicoches, vivían en zonas propensas a huaicos o aluviones, fenómenos comunes en la región. El Pueblo de Lo Barnechea, fundado en el siglo XIX, ha resistido la expansión urbana del Gran Santiago. Hoy, la comuna alberga sectores de ingresos altos como La Dehesa y Los Trapenses, junto a áreas de menores recursos como el Cerro 18 y La Ermita."
  },
  {
    "slug": "ahome",
    "name": "Ahome",
    "kind": "ciudad",
    "icon": "💬",
    "users": 154,
    "votes": 246,
    "activity": "Alta",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Sinaloa",
    "regionSlug": "sinaloa",
    "channels": [
      "sinaloa",
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "sinaloa",
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "Ahome, en el estado de Sinaloa, México, con una población de 459.310 habitantes según el censo de 2020, es un municipio diversificado con una rica economía.",
    "aboutTitle": "Ahome, puente comercial con el noroeste de México",
    "about": "El municipio de Ahome es uno de los 20 municipios del estado de Sinaloa, en México. Su cabecera es la ciudad de Los Mochis, y es el tercer municipio en importancia en el estado de Sinaloa. Está situado en la llanura costera del Pacífico, a la entrada del Golfo de California y en el corazón de una rica región agrícola, el Valle del Fuerte. La economía del municipio es diversificada, con industrias como la azucarera, la pesca y la agricultura. El escudo del municipio refleja la importancia de estas industrias, con elementos como el faro, el ingenio azucarero, el océano y un pez, y las manos del hombre del campo. La tierra surcada también es un elemento importante en el escudo, ya que la riqueza principal del valle del Fuerte es el generador que nutre la economía. El Valle del Fuerte es una región agrícola rica, lo que ha permitido el desarrollo de la agricultura en la zona. Esto ha llevado a que la economía del municipio sea próspera y diversificada."
  },
  {
    "slug": "cajeme",
    "name": "Cajeme",
    "kind": "ciudad",
    "icon": "💬",
    "users": 156,
    "votes": 263,
    "activity": "Alta",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Sonora",
    "regionSlug": "sonora",
    "channels": [
      "sonora",
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "ciudad-obregon",
      "sonora",
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "Cajeme, municipio de Sonora con 436.484 habitantes, se constituyó el 29 de noviembre de 1927 y es el segundo más poblado del estado.",
    "aboutTitle": "Cajeme: corazón del Valle del Yaqui y Ciudad Obregón",
    "about": "Cajeme es uno de los 72 municipios que forman el estado de Sonora, situado en el sur de la entidad dentro del valle del Yaqui. Su nombre rinde homenaje al caudillo yaqui José María Leyva Pérez, apodado «Cajeme», que significa “el que no bebe”. El municipio fue declarado como tal el 29 de noviembre de 1927 y, según el Censo de 2020, cuenta con 436.484 habitantes, lo que lo convierte en el segundo más poblado del estado. La cabecera municipal es Ciudad Obregón, la segunda ciudad más grande de Sonora, y concentra la mayor parte de la población y la actividad económica. Su producto interno bruto per cápita es de USD 10.940 y su índice de desarrollo humano (IDH) alcanza 0,8636. Limita al norte con Suaqui Grande, al noreste con Ónavas, al este con Rosario y Quiriego, al sureste con Navojoa, Etchojoa y Benito Juárez, al oeste y suroeste con Bácum, al noroeste con Guaymas y al sur con el Mar de Cortés."
  },
  {
    "slug": "municipio-de-la-paz",
    "name": "Municipio de La Paz",
    "kind": "ciudad",
    "icon": "💬",
    "users": 135,
    "votes": 219,
    "activity": "Alta",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Baja California Sur",
    "regionSlug": "baja-california-sur",
    "channels": [
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "la-paz-mexico",
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "Municipio de La Paz, capital de Baja California Sur, abarca 20.274,98 km² y alberga islas como San José y Espíritu Santo, ofreciendo una geografía única.",
    "aboutTitle": "Extensión y relieve del Municipio de La Paz",
    "about": "Municipio Libre de La Paz es uno de los cinco municipios de Baja California Sur y su cabecera, la ciudad de La Paz, es la capital del estado. El territorio se sitúa en la zona sur de la península de Baja California y cubre 20.274,98 kilómetros cuadrados, lo que representa el 27,51 % de la superficie estatal y lo convierte en el segundo municipio más extenso de la entidad, después de Mulegé, y el cuarto a nivel nacional. Dentro de sus límites se incluyen varias islas del Golfo de California, como San José, Partida, Espíritu Santo y Jacques Cousteau (Cerralvo), así como la porción sur de la Isla Santa Margarita en el Pacífico.\n\nLa orografía está dominada por la Sierra de la Giganta, que atraviesa la península, aunque en el municipio su altitud se reduce a unos 250 metros. Al sureste se encuentran la Sierra de La Pintada y la Sierra de La Laguna, siendo esta última la mayor elevación del estado con 2.080 metros sobre el nivel del mar, junto al Cerro el Puerto y el Cerro el Mechudo. Estas características geográficas influyen en la escasez de precipitaciones y en la complejidad hidrológica del área."
  },
  {
    "slug": "coatepeque",
    "name": "Coatepeque",
    "kind": "ciudad",
    "icon": "💬",
    "users": 118,
    "votes": 199,
    "activity": "Media",
    "parentName": "Guatemala",
    "parentSlug": "guatemala",
    "provincia": "Departamento de Quetzaltenango",
    "regionSlug": "departamento-de-quetzaltenango",
    "channels": [
      "guatemala",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "san-marcos-guatemala",
      "quetzaltenango",
      "mazatenango",
      "tapachula",
      "solola",
      "guatemala",
      "amistad",
      "amor"
    ],
    "intro": "Coatepeque, un municipio guatemalteco con una población de 120 737 habitantes, situado a 60 km de Quetzaltenango y 221 km de la ciudad de Guatemala.",
    "aboutTitle": "Un centro comercial en el suroccidente de Guatemala",
    "about": "Coatepeque es un municipio situado en el departamento de Quetzaltenango, Guatemala. Según el censo de 2018, tiene una población proyectada de 120 737 habitantes en 2022. Está localizado a 60 km de la ciudad de Quetzaltenango y a 221 km de la ciudad de Guatemala, en la región sur-occidente de la República de Guatemala. El municipio es uno de los centros de actividades comerciales del suroccidente de Guatemala, y sus principales cultivos son maíz, fríjol, arroz y frutas tropicales. Algunas personas también se dedican a la ganadería, construcción y agroindustria a pequeña escala. Coatepeque tiene una rica historia, habiendo sido fundado durante la colonia española en el lugar en que existió un asentamiento prehispánico alrededor de 1300 d. C."
  },
  {
    "slug": "cotoca",
    "name": "Cotoca",
    "kind": "ciudad",
    "icon": "💬",
    "users": 117,
    "votes": 208,
    "activity": "Media",
    "parentName": "Bolivia",
    "parentSlug": "bolivia",
    "provincia": "Departamento de Santa Cruz",
    "regionSlug": "departamento-de-santa-cruz",
    "channels": [
      "bolivia",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "santa-cruz-de-la-sierra",
      "montero",
      "bolivia",
      "amistad",
      "amor"
    ],
    "intro": "Chat de Cotoca, ciudad y municipio de Bolivia en el departamento de Santa Cruz, capital de la provincia de Andrés Ibáñez.",
    "aboutTitle": "Cotoca, capital de la provincia de Andrés Ibáñez",
    "about": "Cotoca es una pequeña ciudad y municipio de Bolivia, capital de la provincia de Andrés Ibáñez en el departamento de Santa Cruz. El municipio tiene una superficie de 606 km² y cuenta con una población de 106.603 habitantes. La localidad se ubica a 17 km al este de la capital departamental y por tanto forma parte del área metropolitana de Santa Cruz de la Sierra. Esta proximidad a la capital departamental ha influido en el crecimiento y desarrollo de Cotoca, que se ha convertido en un importante centro urbano en la región. La ciudad ofrece una variedad de servicios y oportunidades para sus habitantes, y su ubicación estratégica la convierte en un lugar atractivo para visitantes y residentes."
  },
  {
    "slug": "piedad",
    "name": "Piedad",
    "kind": "ciudad",
    "icon": "💬",
    "users": 115,
    "votes": 184,
    "activity": "Media",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Michoacán",
    "regionSlug": "michoacan",
    "channels": [
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "la-barca",
      "arandas",
      "atotonilco-el-alto",
      "jamay",
      "ocotlan",
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "Chat de Piedad, municipio de Michoacán que encabeza la Zona Metropolitana Pénjamo-La Piedad, con 261.450 habitantes en 2020 y una extensión de 271 km².",
    "aboutTitle": "La Piedad, un municipio con riqueza histórica y cultural",
    "about": "El municipio de La Piedad es uno de los 113 municipios que conforman el estado de Michoacán de Ocampo, situado al noroeste, en los límites con Jalisco y Guanajuato, y su cabecera municipal es La Piedad de Cabadas. Cuenta con una extensión de 271 km², temperatura media anual de 17 °C y clima templado, veranos calurosos y lluvias de junio a septiembre, con una estación invernal poco definida. Limita al noroeste con Degollado (Jalisco), al norte con Pénjamo (Guanajuato), al oriente con Numarán, al sur con Zináparo, Churintzio y Ecuandureo, y al occidente con Yurécuaro. En el centro destaca la plaza principal con un kiosco de cantería y el Santuario del Señor de La Piedad; también se encuentran el puente Cavadas de piedra del siglo XIX, el templo de San Francisco, el Santuario de Guadalupe y el templo de la Purísima Concepción, el más antiguo, de finales del siglo XVII, que originalmente albergó al santo patrón San Sebastián y hoy forma parte del barrio La Purísima, donde está la Escuela de Artes, antes hospital civil. A 17 km se ubica la cascada El Salto, de 21 m de altura y 130 m de ancho, en el cauce del río Lerma, y a similar distancia la reserva Cerro Grande."
  },
  {
    "slug": "cabos",
    "name": "Cabos",
    "kind": "ciudad",
    "icon": "💬",
    "users": 140,
    "votes": 240,
    "activity": "Alta",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Baja California Sur",
    "regionSlug": "baja-california-sur",
    "channels": [
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "la-paz-mexico",
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "Chat de Cabos, un destino turístico en la península de Baja California, México, con 351,111 habitantes y 3,750.90 km2 de expansión territorial.",
    "aboutTitle": "Un destino turístico en la península de Baja California",
    "about": "Cabos es un municipio ubicado en el extremo sur del estado mexicano de Baja California Sur. La cabecera municipal es San José del Cabo y la ciudad más importante es Cabo San Lucas, a 32 km de la cabecera. La ubicación geográfica del municipio es: norte 23° 40', sur 22° 52'; este 109° 24', oeste 110° 07'. Se localiza en el extremo sur de la península de Baja California, a 220 km al sur de La Paz. El clima es desértico semiseco, caluroso en verano y templado en invierno; con una temperatura promedio anual de 26 °C. Aunque la precipitación pluvial es escasa, oficialmente la temporada de lluvias se extiende a partir del mes de junio y concluye en octubre; sin embargo, las lluvias tienden a concentrarse durante agosto y septiembre."
  },
  {
    "slug": "othon-p-blanco",
    "name": "Othón P. Blanco",
    "kind": "ciudad",
    "icon": "💬",
    "users": 148,
    "votes": 251,
    "activity": "Media",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Quintana Roo",
    "regionSlug": "quintana-roo",
    "channels": [
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "chetumal",
      "orange-walk",
      "belize-city",
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "Othón P. Blanco, municipio de Quintana Roo con 18.760 km² de extensión territorial y frontera internacional con Belice.",
    "aboutTitle": "El municipio de Othón P. Blanco en Quintana Roo",
    "about": "Othón P. Blanco es un municipio ubicado en el estado de Quintana Roo, México, y es el más extenso del estado, representando el 36.9% del territorio estatal. Ocupa toda la zona sur del estado y limita al norte con el municipio de Bacalar, al oeste con el municipio de Calakmul del estado de Campeche y al sur con Belice. El municipio es conocido por ser el lugar donde se encuentra el Banco Chinchorro, un atolón formado por cayos y arrecifes ubicado en el mar Caribe frente a las costas de Mahahual, y que es famoso como destino turístico de buceo. El nombre del municipio es en honor a Othón Pompeyo Blanco Núñez de Cáceres, colonizador de la región y fundador de Payo Obispo. La ubicación geográfica del municipio lo hace atractivo para los turistas que buscan disfrutar de la belleza natural de la región."
  },
  {
    "slug": "jalapa",
    "name": "Jalapa",
    "kind": "ciudad",
    "icon": "💬",
    "users": 133,
    "votes": 218,
    "activity": "Media",
    "parentName": "Guatemala",
    "parentSlug": "guatemala",
    "provincia": "Departamento de Jalapa",
    "regionSlug": "departamento-de-jalapa",
    "channels": [
      "guatemala",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "chiquimula",
      "guatemala",
      "ciudad-de-guatemala",
      "villa-nueva",
      "mixco",
      "amistad",
      "amor"
    ],
    "intro": "Jalapa, cabecera departamental del Departamento de Jalapa en Guatemala, es una ciudad con una rica historia y un clima templado.",
    "aboutTitle": "La Morena Climatológica de Oriente",
    "about": "Jalapa es una ciudad ubicada a 100 km de la Veracruz, en el valle que rodea el volcán Jumay. El clima es templado, sin frío extremo ni calor excesivo durante todo el año, por lo que se le conoce como «La Morena Climatológica de Oriente». La ciudad es sede de la Gobernación departamental y del Centro Universitario de Sur-Oriente de la Universidad de San Carlos, fundado en enero de 1978. Jalapa fue uno de los municipios originales del Estado de Guatemala después de la Independencia en 1821 y posteriormente se convirtió en la cabecera del Departamento de Jalapa, creado el 24 de noviembre de 1873. La ciudad tiene una rica historia, ya que fue parte del distrito de Chiquimula y luego se convirtió en la sede del circuito homónimo en el distrito N.º4 Chiquimula para la impartición de justicia por medio del sistema de juicios de jurados. La ciudad es un importante centro político y educativo en la región."
  },
  {
    "slug": "lurin-provincia-de-lima",
    "name": "Lurín",
    "kind": "ciudad",
    "icon": "💬",
    "users": 135,
    "votes": 230,
    "activity": "Media",
    "parentName": "Perú",
    "parentSlug": "peru",
    "provincia": "Provincia de Lima",
    "regionSlug": "provincia-de-lima",
    "channels": [
      "peru",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "peru",
      "lima",
      "callao",
      "amistad",
      "amor"
    ],
    "intro": "Lurín es un distrito de la provincia de Lima, en el Perú, con una rica historia que se remonta a los paleolíticos superiores.",
    "aboutTitle": "Historia y ubicación de Lurín",
    "about": "El distrito de Lurín es uno de los cuarenta y tres distritos que conforman la provincia de Lima, ubicada en el departamento homónimo, en el Perú. Limita al norte con los distritos de Villa El Salvador, Villa María del Triunfo y Pachacámac; al este, también con el distrito de Pachacámac; al sur, con el distrito de Punta Hermosa; y al oeste, con el océano Pacífico.\n\nEn este valle, que hoy lo conocemos como valle de Lurín, se encontraba el templo del dios creador, como lo denominaron las culturas preincas, que luego fue conquistado por el Imperio incaico que anexo su dominio al imperio Incaico, respetando sus creencias y mejorando el templo que hoy lo conocemos como restos o sitio arqueológico de Pachacámac, en el distrito de Lurín."
  },
  {
    "slug": "joyabaj",
    "name": "Joyabaj",
    "kind": "ciudad",
    "icon": "💬",
    "users": 112,
    "votes": 196,
    "activity": "Media",
    "parentName": "Guatemala",
    "parentSlug": "guatemala",
    "provincia": "Departamento de Quiché",
    "regionSlug": "departamento-de-quiche",
    "channels": [
      "guatemala",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "mixco",
      "solola",
      "antigua-guatemala",
      "guatemala",
      "ciudad-de-guatemala",
      "amistad",
      "amor"
    ],
    "intro": "Joyabaj es un municipio del departamento de Quiché en Guatemala, fundado en el siglo XVI, específicamente alrededor de 1549.",
    "aboutTitle": "Historia y cultura en el municipio de Quiché",
    "about": "Joyabaj es un municipio del departamento de Quiché, en la República de Guatemala. Fue fundado alrededor del año 1549 como una de las reducciones o «pueblos de indios», por los frailes dominicos del convento de Sacapulas. Esta fundación fue parte de un proceso de reorganización territorial y religiosa llevado a cabo por la colonización española en la región. Los frailes dominicos desempeñaron un papel crucial en la creación de estas reducciones, que tenían como objetivo reagrupar a la población indígena en asentamientos más grandes y organizados, facilitando así la evangelización y la administración colonial. La ubicación de Joyabaj en el departamento de Quiché la convierte en un punto de interés histórico y cultural, reflejando la compleja interacción entre la cultura maya prehispánica y la influencia española en la región."
  },
  {
    "slug": "morales-guatemala",
    "name": "Morales",
    "kind": "ciudad",
    "icon": "💬",
    "users": 137,
    "votes": 232,
    "activity": "Media",
    "parentName": "Guatemala",
    "parentSlug": "guatemala",
    "provincia": "Departamento de Izabal",
    "regionSlug": "departamento-de-izabal",
    "channels": [
      "guatemala",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "puerto-barrios",
      "santa-rosa-de-copan",
      "san-pedro-sula",
      "villanueva-honduras",
      "choloma",
      "guatemala",
      "amistad",
      "amor"
    ],
    "intro": "Morales, en Izabal, Guatemala, está a 55 km de Puerto Barrios y marcó la inauguración del tramo Zacapa‑Puerto Barrios del Ferrocarril del Norte el 22‑nov‑1896.",
    "aboutTitle": "Morales y su legado ferroviario y bananero en Izabal",
    "about": "Morales es un municipio del departamento de Izabal, situado en la región nor‑oriente de Guatemala. Se localiza a 55 km de Puerto Barrios y a 244 km de la Ciudad de Guatemala. Limita al norte con el lago de Izabal, al oeste con Los Amates, al este con Puerto Barrios y al sur con la República de Honduras. Con una superficie de 1.295 km², el municipio agrupa nueve aldeas y cincuenta y seis caseríos.\n\nEl municipio lleva el nombre de Próspero Morales, exministro de Guerra y Fomento. El 22 de noviembre de 1896 se inauguró el tramo de Zacapa a Puerto Barrios del Ferrocarril del Norte, impulsando la explotación industrial y comercial de la zona. En 1920 el presidente Carlos Herrera creó el municipio tras el desarrollo generado por la United Fruit Company, que recibió una amplia concesión territorial y estableció plantaciones bananeras tanto en Morales como en Los Amates. La cabecera municipal se divide en los sectores de Morales y Bananera, este último fue el centro operacional de la compañía bananera."
  },
  {
    "slug": "bahia-de-banderas",
    "name": "Bahía de Banderas",
    "kind": "ciudad",
    "icon": "💬",
    "users": 121,
    "votes": 215,
    "activity": "Media",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Nayarit",
    "regionSlug": "nayarit",
    "channels": [
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "puerto-vallarta",
      "tepic",
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "Bahía de Banderas, un importante punto turístico en la Región Costa Sur de Nayarit, México, conocido por su belleza natural y su rica historia.",
    "aboutTitle": "La bahía de Banderas, un destino turístico en Nayarit",
    "about": "El municipio de Bahía de Banderas es uno de los 20 municipios en que se subdivide el estado de Nayarit, México. Se localiza en la Región Costa Sur del estado y es uno de los lugares más visitados del país. Es un importante punto turístico tanto a nivel nacional como internacional, ya que recibe anualmente millones de turistas nacionales y de origen extranjero. La bahía de Banderas, que baña la costa sur del municipio, es dividida políticamente entre los estados de Jalisco y de Nayarit, y en ella desemboca el río Ameca. El territorio que ocupa actualmente el municipio de Bahía de Banderas estuvo habitado durante la época precolonial por pueblos o tribus pertenecientes a la monarquía o Hueytlahtonazgo de Xalisco, el cual se extendía hacia el sur, fuera de los límites de lo que actualmente es el estado de Nayarit. La historia y la cultura de la región son ricas y variadas, y la bahía de Banderas es un lugar donde se pueden apreciar la belleza natural y la riqueza cultural de la zona."
  },
  {
    "slug": "silao-de-la-victoria",
    "name": "Silao de la Victoria",
    "kind": "ciudad",
    "icon": "💬",
    "users": 127,
    "votes": 221,
    "activity": "Media",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Guanajuato",
    "regionSlug": "guanajuato",
    "channels": [
      "guanajuato",
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "guanajuato",
      "irapuato",
      "lagos-de-moreno",
      "celaya",
      "san-juan-de-los-lagos",
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "Silao de la Victoria, un municipio del estado mexicano de Guanajuato con una población de 173.024 habitantes y un área de 538.72 km.",
    "aboutTitle": "Silao de la Victoria, un municipio en el corazón de Guanajuato",
    "about": "El Municipio de Silao de la Victoria se encuentra en la región noroeste del estado de Guanajuato, situado a los 100°25′59″ de longitud al oeste del meridiano de Greenwich y a los 20°56′24″ de latitud norte. Su territorio es casi plano formado por la parte llamada El Bajío, con una altura media sobre el nivel del mar de 1,780 metros. El río Silao cruza la mayor parte del territorio municipal y a su paso va alimentándose de los arroyos Magueyes, Pascuales, Hondo y El Tigre, así como del río Gigante, que es su principal afluente.\n\nLa cabecera municipal es la ciudad de Silao, la cual tiene 74.242 habitantes, siendo la quinta localidad más poblada del estado de Guanajuato. El nombre completo del municipio es Silao de la Victoria, donde Silao proviene del purépecha Tzinacua, que significa ‘lugar de humaredas’, que hace alusión a las aguas termales que se encuentran en las zonas circundantes de la ciudad. Mientras que de la Victoria hace alusión a la victoria liberal en la Batalla de Silao durante la guerra de Reforma."
  },
  {
    "slug": "ixtlahuaca",
    "name": "Ixtlahuaca",
    "kind": "ciudad",
    "icon": "💬",
    "users": 118,
    "votes": 193,
    "activity": "Media",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Estado de México",
    "regionSlug": "estado-de-mexico",
    "channels": [
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "atlacomulco-de-fabela",
      "san-pablo-autopan",
      "san-andres-cuexcontitlan",
      "xonacatlan",
      "san-francisco-tlalcilalcalpan",
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "Ixtlahuaca, conocida como 'La puerta al norte' del Estado de México, cuenta con una población de 153.184 habitantes y una superficie de 33.71 km².",
    "aboutTitle": "La puerta al norte del Estado de México",
    "about": "El municipio de Ixtlahuaca se localiza en la parte norte del estado en la región Otomi del estado, a una altitud promedio de 2.540 metros sobre el nivel del mar. Limita al norte con el municipio de Jocotitlán, al sur con el municipio de Almoloya de Juárez, al este con Jocotitlán, Jiquipilco y Temoaya, y al oeste con Almoloya de Juárez y San Felipe del Progreso.\n\nIxtlahuaca ha sido lugar de sucesos históricos como La Batalla de Ixtlahuaca, episodio de la guerra mexicana de Reforma, entre fuerzas del ejército liberal y del ejército conservador, que tuvo lugar el 18 de septiembre de 1858 en este municipio. También es conocido por poseer la Hacienda 'La Purísima', cuyo dueño fue el actor y comediante Mario Moreno 'Cantinflas'."
  },
  {
    "slug": "pachacamac-provincia-de-lima",
    "name": "Pachacámac",
    "kind": "ciudad",
    "icon": "💬",
    "users": 136,
    "votes": 240,
    "activity": "Media",
    "parentName": "Perú",
    "parentSlug": "peru",
    "provincia": "Provincia de Lima",
    "regionSlug": "provincia-de-lima",
    "channels": [
      "peru",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "peru",
      "lima",
      "callao",
      "amistad",
      "amor"
    ],
    "intro": "Pachacámac, un distrito en la provincia de Lima, Perú, con una rica historia que se remonta a la época prehispánica y un valle conocido como Ichma.",
    "aboutTitle": "Pachacámac, un distrito en la provincia de Lima",
    "about": "El distrito de Pachacámac es uno de los cuarenta y tres distritos que conforman la provincia de Lima, ubicada en el departamento homónimo, en el Perú. Limita al norte, con el distrito de Ate; al este, con el distrito de Cieneguilla; al sureste, con los distritos de Antioquía y Santo Domingo de los Olleros, ambos pertenecientes a la provincia de Huarochirí, y el distrito de Punta Hermosa; al sur, con el distrito de Lurín; al oeste, con el distrito de Villa María del Triunfo; y al noroeste, con el distrito de La Molina.\n\nEl valle de Pachacámac, conocido en épocas preincaicas con el nombre de Ichma, tiene una cuenca de 1237 km² y fue famoso por su oráculo, al que llegaron en peregrinación gente principal de toda la costa para consultarle y tributarle. En 1800 a. C., se fundaron las primeras civilizaciones que cuentan con metalurgia en toda América, que dejaron como vestigios 7 templos con forma de 'U', designados como cultura Manchay."
  },
  {
    "slug": "rio-bravo",
    "name": "Río Bravo",
    "kind": "ciudad",
    "icon": "💬",
    "users": 119,
    "votes": 206,
    "activity": "Media",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Tamaulipas",
    "regionSlug": "tamaulipas",
    "channels": [
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "reynosa",
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "Río Bravo es un municipio de Tamaulipas con 132.484 habitantes según el Censo de Población y Vivienda de 2020.",
    "aboutTitle": "Río Bravo, un municipio fronterizo de Tamaulipas",
    "about": "El municipio de Río Bravo es uno de los cuarenta y tres municipios en que se encuentra dividido el estado de Tamaulipas en el noreste de México. Su cabecera es Ciudad Río Bravo. El municipio limita al norte con los Estados Unidos en particular con el condado de Hidalgo y al sur con el municipio de San Fernando y al oeste con el municipio de Reynosa y al este con el municipio de Matamoros y al noreste con el municipio de Valle Hermoso y finalmente al suroeste con el municipio de Méndez. De acuerdo al censo del año 2020 el municipio tiene un total de 132.484 habitantes, 66.121 hombres y 66.363 mujeres. El municipio de Río Bravo contaba con 352 localidades en el censo de 2020."
  },
  {
    "slug": "chamula",
    "name": "Chamula",
    "kind": "ciudad",
    "icon": "💬",
    "users": 142,
    "votes": 235,
    "activity": "Media",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Chiapas",
    "regionSlug": "chiapas",
    "channels": [
      "chiapas",
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "queretaro",
      "chiapas",
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "Chamula, municipio de Chiapas con 101.967 habitantes y 344.34 km², se encuentra en el centro-norte del estado.",
    "aboutTitle": "Chamula, un municipio de Chiapas con diversidad étnica y cultural",
    "about": "El municipio de Chamula se encuentra en la región socioeconómica V Altos Tsotsil Tseltal. Su cabecera es el pueblo de San Juan Chamula. El nombre Chamula se interpreta como 'agua espesa, como de adobe'. La población total del municipio es de 101.967 habitantes, con una densidad de 295,9 hab/km². La diversidad étnica y cultural es destacada, con una población prácticamente indígena. Según el Censo de Población y Vivienda de 2020, la población se distribuye en una superficie de 344.34 km², lo que hace que la densidad de población sea significativa en la región. La composición por género es similar en toda la entidad, con una ligera mayoría de mujeres. La ubicación geográfica y la diversidad cultural hacen que Chamula sea un municipio interesante en Chiapas, con una rica herencia cultural y una historia única."
  },
  {
    "slug": "costa",
    "name": "Costa",
    "kind": "ciudad",
    "icon": "💬",
    "users": 122,
    "votes": 213,
    "activity": "Media",
    "parentName": "Argentina",
    "parentSlug": "argentina",
    "provincia": "Provincia de Buenos Aires",
    "regionSlug": "provincia-de-buenos-aires",
    "channels": [
      "argentina",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "san-clemente-del-tuyu",
      "pinamar-divisadero",
      "general-juan-madariaga",
      "villa-gesell",
      "dolores",
      "argentina",
      "amistad",
      "amor"
    ],
    "intro": "Costa, municipio costero de la provincia de Buenos Aires, conocido por ser el municipio más oriental de la provincia",
    "aboutTitle": "Costa, municipio costero en la provincia de Buenos Aires",
    "about": "La Costa es uno de los 135 partidos que componen la provincia argentina de Buenos Aires. Limita al norte con la Bahía de Samborombón, al sur con el partido de Pinamar, al oeste con el partido de General Lavalle y al este con el mar Argentino. Es el municipio más oriental de la provincia de Buenos Aires. Por esta razón, es el sitio elegido para el amarre de cables submarinos de telecomunicaciones. La cabecera del municipio es la localidad de Mar del Tuyú, que cuenta con servicios estándares para el turista. La ciudad de San Bernardo del Tuyu es la urbe más importante del municipio en cuanto a desarrollo edilicio, urbanístico y comercial. Ambas localidades ofrecen una variedad de opciones para visitantes y residentes."
  },
  {
    "slug": "puente-piedra-provincia-de-lima",
    "name": "Puente Piedra",
    "kind": "ciudad",
    "icon": "💬",
    "users": 127,
    "votes": 220,
    "activity": "Alta",
    "parentName": "Perú",
    "parentSlug": "peru",
    "provincia": "Provincia de Lima",
    "regionSlug": "provincia-de-lima",
    "channels": [
      "peru",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "peru",
      "lima",
      "callao",
      "huacho",
      "amistad",
      "amor"
    ],
    "intro": "Puente Piedra, distrito de la provincia de Lima, con una historia que se remonta al Imperio Incaico, donde se pueden encontrar vestigios de la época preincaica.",
    "aboutTitle": "Historia y geografía de Puente Piedra",
    "about": "El distrito de Puente Piedra es uno de los cuarenta y tres distritos que conforman la provincia de Lima, ubicada en el departamento de Lima, en el Perú. Se sitúa en la zona norte de la provincia y forma parte del área metropolitana limeña. Limita al norte con el distrito de Ancón; al este con Carabayllo; al sureste con los distritos de Comas y Los Olivos; al sur con San Martín de Porres; y al oeste con Ventanilla y Mi Perú, ambos pertenecientes a la provincia constitucional del Callao. Estas fronteras lo convierten en un punto de enlace entre la capital y la zona costera del Callao. Entre 1471 y 1493, el inca Túpac Yupanqui mandó construir puentes y caminos en el territorio, con el objetivo de facilitar el paso del Ejército Imperial y reforzar la expansión del Tahuantinsuyo, nombre quechua del Imperio Inca. Aquellas obras de infraestructura dejaron huellas que todavía se pueden observar en la zona, testimonio de la importancia estratégica que tuvo el área durante la época precolombina."
  },
  {
    "slug": "zarate-provincia-de-buenos-aires",
    "name": "Zárate",
    "kind": "ciudad",
    "icon": "💬",
    "users": 133,
    "votes": 230,
    "activity": "Media",
    "parentName": "Argentina",
    "parentSlug": "argentina",
    "provincia": "Provincia de Buenos Aires",
    "regionSlug": "provincia-de-buenos-aires",
    "channels": [
      "argentina",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "san-antonio-de-areco",
      "tigre",
      "san-andres-de-giles",
      "baradero",
      "san-isidro",
      "argentina",
      "amistad",
      "amor"
    ],
    "intro": "Zárate es un partido de la provincia de Buenos Aires con 132.221 habitantes, ubicado a orillas del río Paraná de las Palmas en Argentina.",
    "aboutTitle": "Zárate, capital provincial del tango y nacional de la colombofilia",
    "about": "Zárate es uno de los 135 partidos de la provincia argentina de Buenos Aires y ocupa una superficie de 1.185 km². Su cabecera es la ciudad de Zárate, que cuenta con 109.443 habitantes, seguida por las localidades de Lima con 17.368 y Escalada con 5.410 personas. El partido limita con los partidos de Campana, Baradero, San Antonio de Areco y Exaltación de la Cruz, además del Departamento Islas del Ibicuy en la Provincia de Entre Ríos.\n\nLa ciudad cabecera es reconocida como la capital provincial del tango debido a los trabajos de Armando Pontier y los hermanos Virgilio y Homero Expósito, y es también la capital nacional de la colombofilia. Entre el 24 de junio de 1932 y el 21 de junio de 1946, la localidad llevó el nombre de José Félix Uriburu. En cuanto a su sismicidad, la región presenta una actividad baja vinculada a las subfallas del río de la Plata y del río Paraná, así como a la falla de Punta del Este. El último evento registrado fue el terremoto del Río de la Plata el 5 de junio de 1888, con una magnitud aproximada de 5,0 en la escala de Richter."
  },
  {
    "slug": "ciudad-hidalgo",
    "name": "Ciudad Hidalgo",
    "kind": "ciudad",
    "icon": "💬",
    "users": 113,
    "votes": 187,
    "activity": "Media",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Michoacán",
    "regionSlug": "michoacan",
    "channels": [
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "morelia",
      "valle-de-bravo",
      "atlacomulco-de-fabela",
      "san-francisco-tlalcilalcalpan",
      "san-antonio-acahualco",
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "Ciudad Hidalgo, en el estado de Michoacán, México, es una ciudad con una rica historia y economía basada en la silvicultura y la fabricación de muebles.",
    "aboutTitle": "La historia y economía de Ciudad Hidalgo",
    "about": "Ciudad Hidalgo es una ciudad y cabecera del municipio de Hidalgo en el extremo noreste del estado de Michoacán, México. Está situada en una zona rural y montañosa. La ciudad tiene una rica historia, ya que antiguamente se llamaba Taximaroa y era la parte del Imperio purépecha más cercana al Imperio azteca. Su principal monumento es la iglesia y antiguo monasterio de San José, del siglo XVI. Aunque la mayor parte de la ciudad está formada por edificios modernos, su economía se basa en la silvicultura y la fabricación de muebles, aunque la deforestación está obligando a la zona a buscar alternativas como el turismo para aprovechar sus recursos naturales y sitios culturales."
  },
  {
    "slug": "campana-argentina",
    "name": "Campana",
    "kind": "ciudad",
    "icon": "💬",
    "users": 121,
    "votes": 199,
    "activity": "Media",
    "parentName": "Argentina",
    "parentSlug": "argentina",
    "provincia": "Provincia de Buenos Aires",
    "regionSlug": "provincia-de-buenos-aires",
    "channels": [
      "argentina",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "zarate-provincia-de-buenos-aires",
      "tigre",
      "san-isidro",
      "san-antonio-de-areco",
      "merlo",
      "argentina",
      "amistad",
      "amor"
    ],
    "intro": "Campana, partido de la provincia de Buenos Aires, está en la margen derecha del río Paraná de las Palmas y celebra la Fiesta del Primer Automóvil Argentino.",
    "aboutTitle": "Campana: puerto del Paraná y sede de la Fiesta del Primer Automóvil",
    "about": "Campana es uno de los 135 partidos de la provincia de Buenos Aires, situado en la margen derecha del río Paraná de las Palmas. Con una superficie de 982 km² y una densidad de 72,7 hab./km², alberga a 107.976 habitantes según el censo de 2022. El tejido productivo de Campana está dominado por industrias de gran envergadura, destacando la presencia de Techint. La ciudad es un referente nacional e internacional gracias a su actividad industrial. Se celebran eventos como la Fiesta Nacional del Asado de Tira y La Noche de la Gastronomía. La municipalidad ofrece espacios como la Biblioteca Municipal, el Teatro Pedro Barbero y el Mercadito, que complementan la vida social de la comunidad. Campana limita al norte con el Departamento Islas del Ibicuy, al oeste con Zárate, al sur con Exaltación de la Cruz y al este con los partidos de Pilar, Escobar y con las islas de San Fernando."
  },
  {
    "slug": "san-juan-bautista-tuxtepec",
    "name": "San Juan Bautista Tuxtepec",
    "kind": "ciudad",
    "icon": "💬",
    "users": 119,
    "votes": 207,
    "activity": "Media",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Estado de Oaxaca",
    "regionSlug": "estado-de-oaxaca",
    "channels": [
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "tres-valles",
      "cosamaloapan",
      "tierra-blanca",
      "carlos-a-carrillo",
      "la-isla",
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "Chat de San Juan Bautista Tuxtepec, ciudad ubicada en el estado de Oaxaca, México, con una población de 103.609 habitantes.",
    "aboutTitle": "San Juan Bautista Tuxtepec, corazón de la Región Papaloapan",
    "about": "San Juan Bautista Tuxtepec es una ciudad del estado de Oaxaca y es la cabecera del municipio homónimo. Se ubica como la segunda entre las ciudades más pobladas del estado de Oaxaca, en México. La ciudad posee una gran actividad agrícola, industrial ganadera y comercial, convirtiéndose en un punto de convergencia de las actividades de los estados de Oaxaca, Veracruz y Puebla.\n\nLa ciudad fue fundada en el año de 1811 y fue decretada como municipio por la Cámara de Comercio Local el día 15 de marzo del año de 1825. El nombre de Tuxtepec proviene del náhuatl Tōchtepēc, que significa 'en el cerro del conejo'."
  },
  {
    "slug": "azua",
    "name": "Azua",
    "kind": "ciudad",
    "icon": "💬",
    "users": 119,
    "votes": 196,
    "activity": "Media",
    "parentName": "República Dominicana",
    "parentSlug": "republica-dominicana",
    "provincia": "Provincia de Azua",
    "regionSlug": "provincia-de-azua",
    "channels": [
      "republica_dominicana",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "barahona",
      "bani",
      "republica-dominicana",
      "santo-domingo",
      "san-cristobal-rd",
      "amistad",
      "amor"
    ],
    "intro": "Azua, capital de la provincia de Azua, en la costa sur de la República Dominicana, con 103.276 habitantes según el censo de 2022.",
    "aboutTitle": "La capital de la provincia de Azua",
    "about": "Azua es un municipio de la República Dominicana, que está situado en la provincia de Azua, de la que es la capital. Se encuentra a 97 kilómetros al suroeste de Santo Domingo en la región administrativa El Valle. Es una ciudad calurosa y seca, con una temperatura media de 26 °C y una precipitación anual de 630 mm.\n\nEl actual territorio municipal era parte de un nitainato que, a su vez pertenecía al cacicazgo de Maguana, una de las 5 provincias de Quisqueya. Un acontecimiento poco conocido en la historia de Azua es que en uno de los últimos viajes, Colón encontró grandes dificultades en la zona."
  },
  {
    "slug": "mejia",
    "name": "Mejía",
    "kind": "ciudad",
    "icon": "💬",
    "users": 143,
    "votes": 233,
    "activity": "Media",
    "parentName": "Ecuador",
    "parentSlug": "ecuador",
    "provincia": "Pichincha",
    "regionSlug": "pichincha",
    "channels": [
      "ecuador",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "sangolqui",
      "ecuador",
      "quito",
      "latacunga",
      "santo-domingo-ecuador",
      "amistad",
      "amor"
    ],
    "intro": "Mejía, un cantón ecuatoriano ubicado en la provincia de Pichincha, conocido por su producción agrícola y ganadera.",
    "aboutTitle": "El Valle de los 9 Volcanes",
    "about": "Mejía es un cantón ecuatoriano ubicado al sur de la provincia de Pichincha. Su cabecera cantonal es la ciudad de Machachi, lugar donde se agrupa gran parte de su población total. El cantón lleva su nombre en honor al ilustre quiteño José Mejía Lequerica, catedrático y político criollo. Mejía se constituyó como cantón el 23 de julio de 1883, mediante Decreto Supremo.\n\nLa economía de Mejía se basa en la producción agrícola y ganadera. El cantón produce tubérculos, hortalizas y legumbres, como papa, zanahoria, lechuga, acelga, coliflor, col, brócoli, alcachofa, cebada, maíz, trigo, quinua, chocho, haba y choclo. También es conocido por su producción de leche, con 700 mil litros diarios que se comercializan y emplean en la producción de quesos, yogur y otros derivados."
  },
  {
    "slug": "senahu",
    "name": "Senahú",
    "kind": "ciudad",
    "icon": "💬",
    "users": 134,
    "votes": 224,
    "activity": "Media",
    "parentName": "Guatemala",
    "parentSlug": "guatemala",
    "provincia": "Departamento de Alta Verapaz",
    "regionSlug": "departamento-de-alta-verapaz",
    "channels": [
      "guatemala",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "coban",
      "chiquimula",
      "guatemala",
      "ciudad-de-guatemala",
      "amistad",
      "amor"
    ],
    "intro": "Senahú, municipio de Alta Verapaz en Guatemala, es parte de la Franja Transversal del Norte, una región clave en el país.",
    "aboutTitle": "Senahú en la Franja Transversal del Norte",
    "about": "Senahú es un municipio del departamento de Alta Verapaz, en la República de Guatemala. Originalmente era llamado «San Antonio Senahú». Pertenece a la región comercial e industrial conocida como Franja Transversal del Norte, que desempeña un papel importante en la economía del país. La Franja Transversal del Norte es una región estratégica que conecta diferentes partes del país y facilita el comercio y la industria. Senahú, como parte de esta región, participa activamente en el desarrollo económico de Guatemala. Su ubicación geográfica y su pertenencia a la Franja Transversal del Norte lo convierten en un municipio importante en el contexto nacional."
  },
  {
    "slug": "san-juan-opico",
    "name": "San Juan Opico",
    "kind": "ciudad",
    "icon": "💬",
    "users": 121,
    "votes": 206,
    "activity": "Media",
    "parentName": "El Salvador",
    "parentSlug": "el-salvador",
    "provincia": "Departamento de La Libertad",
    "regionSlug": "departamento-de-la-libertad",
    "channels": [
      "el_salvador",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "apopa",
      "santa-tecla",
      "santa-ana",
      "mejicanos",
      "el-salvador",
      "amistad",
      "amor"
    ],
    "intro": "San Juan Opico, un distrito de El Salvador ubicado a 42 kilómetros de San Salvador, capital de la república, en la región central del país.",
    "aboutTitle": "Ubicación y contexto de San Juan Opico",
    "about": "San Juan Opico es un distrito de El Salvador, perteneciente al municipio de La Libertad Centro, del departamento de La Libertad. Se encuentra ubicado en la región central del país, a 42 kilómetros de San Salvador, capital de la república de El Salvador. Su ubicación geográfica lo sitúa en un lugar estratégico, lo que ha permitido su crecimiento y desarrollo a lo largo de los años. San Juan Opico forma parte de la historia y la cultura de El Salvador, y su gente es conocida por su hospitalidad y tradiciones. La región central del país es rica en historia y cultura, y San Juan Opico no es la excepción. Su proximidad a la capital, San Salvador, también lo convierte en un lugar atractivo para aquellos que buscan una combinación de vida rural y urbana."
  },
  {
    "slug": "guaymas",
    "name": "Guaymas",
    "kind": "ciudad",
    "icon": "💬",
    "users": 134,
    "votes": 217,
    "activity": "Media",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Sonora",
    "regionSlug": "sonora",
    "channels": [
      "sonora",
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "ciudad-obregon",
      "hermosillo",
      "sonora",
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "Guaymas, un municipio sonorense con 156.863 habitantes y una rica historia en la costa del golfo de California.",
    "aboutTitle": "Heroica Guaymas, un municipio sonorense con una rica historia",
    "about": "Guaymas es un municipio ubicado en el sur del estado de Sonora, en la costa del golfo de California. Fue nombrado municipio por primera vez el 31 de octubre de 1825 y su cabecera y localidad más habitada es la ciudad y puerto de Heroica Guaymas. El municipio tiene una superficie de 7.945,6 km² y un producto interno bruto per cápita de USD 11.808. La ciudad de Guaymas tiene un título de Heroica, concedido en 1935 por la acción de armas del 13 de julio de 1854, en la defensa del puerto frente a la invasión francesa. La ciudad también es conocida por su historia, que incluye la batalla de Guaymas en 1854, donde el ejército mexicano derrotó a los soldados franceses comandados por el conde Gaston de Raousset-Boulbon.\n\nGuaymas es un importante centro económico y turístico en la región, con una variedad de industrias y actividades que atraen a visitantes y residentes. La ciudad también cuenta con una rica cultura y una historia rica, que se refleja en sus monumentos y edificios históricos."
  },
  {
    "slug": "el-mante",
    "name": "El Mante",
    "kind": "ciudad",
    "icon": "💬",
    "users": 130,
    "votes": 218,
    "activity": "Media",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Tamaulipas",
    "regionSlug": "tamaulipas",
    "channels": [
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "panuco",
      "tampico",
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "El Mante, municipio de Tamaulipas, México, con una rica historia y evolución desde sus humildes comienzos en la sierra de Cucharas.",
    "aboutTitle": "El Mante, un municipio con historia en Tamaulipas",
    "about": "El municipio de El Mante es uno de los cuarenta y tres municipios que conforman las divisiones administrativas del estado de Tamaulipas, ubicado en el noreste de México. Se encuentra en la parte sur del estado, y su cabecera municipal, así como su localidad más grande, es Ciudad Mante. Esta ciudad no solo es el centro administrativo del municipio, sino también el corazón de su vida económica y social. La congregación de Palcuay, situada en la sierra de Cucharas, perteneció en tiempos del Nuevo Santander a la entonces ciudad de Horcasitas, pero en 1821, con el nacimiento de la villa de Morelos, pasó a pertenecer a esa municipalidad, junto con el resto de las antiguas porciones del Abra. La evolución de El Mante desde sus humildes comienzos hasta convertirse en un municipio formal es un testimonio de la capacidad de adaptación y resiliencia de sus habitantes. La historia y el desarrollo del municipio están estrechamente ligados a la de su cabecera, Ciudad Mante."
  },
  {
    "slug": "usulutan-norte",
    "name": "Usulután Norte",
    "kind": "ciudad",
    "icon": "💬",
    "users": 113,
    "votes": 190,
    "activity": "Media",
    "parentName": "El Salvador",
    "parentSlug": "el-salvador",
    "provincia": "Departamento de Usulután",
    "regionSlug": "departamento-de-usulutan",
    "channels": [
      "el_salvador",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "usulutan",
      "san-miguel",
      "san-vicente",
      "soyapango",
      "el-salvador",
      "amistad",
      "amor"
    ],
    "intro": "Usulután Norte es un municipio de El Salvador ubicado en la región norte del Departamento de Usulután, con una población estimada de 108.523 habitantes.",
    "aboutTitle": "El municipio de Usulután Norte",
    "about": "Usulután Norte es uno de los 44 municipios de El Salvador. Se encuentra ubicado en la región norte del Departamento de Usulután. El municipio tiene una extensión de 551.69 km² y se organiza en nueve distritos: Alegría, Berlín, El Triunfo, Estanzuelas, Jucuapa, Mercedes Umaña, Nueva Granada, San Buenaventura y Santiago de María. Estos distritos ofrecen una variedad de paisajes y comunidades, lo que contribuye a la riqueza cultural y geográfica del municipio. La ubicación de Usulután Norte en la región norte del departamento le proporciona una conexión estratégica con otras áreas del país, lo que facilita el intercambio de bienes y servicios."
  },
  {
    "slug": "tocumen",
    "name": "Tocumen",
    "kind": "ciudad",
    "icon": "💬",
    "users": 131,
    "votes": 232,
    "activity": "Media",
    "parentName": "Panamá",
    "parentSlug": "panama",
    "provincia": "Provincia de Panamá",
    "regionSlug": "provincia-de-panama",
    "channels": [
      "panama",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "san-miguelito",
      "panama",
      "ciudad-de-panama",
      "arraijan",
      "la-chorrera",
      "amistad",
      "amor"
    ],
    "intro": "Tocumen es un corregimiento perteneciente al distrito de Panamá, situado específicamente en la zona este del área metropolitana de la Ciudad de Panamá.",
    "aboutTitle": "Tocumen en el área metropolitana de Panamá",
    "about": "Tocumen es un corregimiento del distrito de Panamá, en Panamá. Esta demarcación se encuentra ubicada en la zona este del área metropolitana de la Ciudad de Panamá. Su posición geográfica lo sitúa como una pieza clave dentro de la organización territorial del distrito de Panamá, extendiéndose por la zona este de la capital. Al formar parte del área metropolitana de la Ciudad de Panamá, este corregimiento comparte la dinámica urbana y administrativa de la región este. La ubicación de Tocumen en el distrito de Panamá define su relación con el resto de los corregimientos que integran la zona este de la metrópoli. Esta zona este del área metropolitana de la Ciudad de Panamá alberga a Tocumen como uno de sus sectores principales dentro de la estructura del distrito de Panamá. La configuración de este corregimiento en la zona este permite que se integre plenamente en el desarrollo del distrito de Panamá y en el crecimiento general del área metropolitana de la Ciudad de Panamá, manteniendo siempre su identidad como corregimiento panameño situado en el oriente de la capital."
  },
  {
    "slug": "sayaxche",
    "name": "Sayaxché",
    "kind": "ciudad",
    "icon": "💬",
    "users": 145,
    "votes": 245,
    "activity": "Media",
    "parentName": "Guatemala",
    "parentSlug": "guatemala",
    "provincia": "Departamento de Petén",
    "regionSlug": "departamento-de-peten",
    "channels": [
      "guatemala",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "flores",
      "coban",
      "guatemala",
      "amistad",
      "amor"
    ],
    "intro": "Sayaxché es un municipio del departamento de Petén en Guatemala con una población de 99.787 habitantes y una superficie de 3.904 kilómetros cuadrados.",
    "aboutTitle": "Sayaxché y los vestigios de Ceibal y Aguateca",
    "about": "Sayaxché, cuyo nombre en q'ek'chi significa horqueta de ceiba, es un municipio situado en el departamento de Petén, Guatemala. Fue creado el 4 de diciembre de 1929 por decreto del general Lázaro Chacón, dejando de ser una aldea de La Libertad para ser ascendido a municipio el 30 de diciembre del mismo año. La cabecera municipal posee un clima tropical según la clasificación de Köppen.\n\nEl territorio ocupa el 10,89% del departamento de Petén y cuenta con una organización política compuesta por ocho aldeas, ciento cuarenta caseríos, cuatro fincas, cuatro asentamientos y cinco cooperativas. Entre sus aldeas destacan Rancho Alegre, El Pato y Tierra Blanca. El municipio alberga vestigios arqueológicos como Ceibal, Aguateca, Dos Pilas y Cancuén, además de atractivos naturales como el parque nacional El Rosario, San Juan Acul y la laguna Petexbatún."
  },
  {
    "slug": "olanchito",
    "name": "Olanchito",
    "kind": "ciudad",
    "icon": "💬",
    "users": 120,
    "votes": 197,
    "activity": "Media",
    "parentName": "Honduras",
    "parentSlug": "honduras",
    "provincia": "Departamento de Yoro",
    "regionSlug": "departamento-de-yoro",
    "channels": [
      "honduras",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "la-ceiba",
      "roatan",
      "juticalpa",
      "honduras",
      "amistad",
      "amor"
    ],
    "intro": "Olanchito, en el departamento de Yoro: la Ciudad Cívica de Honduras, cuna de escritores, dramaturgos y pintores.",
    "aboutTitle": "La Ciudad Cívica de la República de Honduras",
    "about": "Olanchito es una ciudad y municipio del departamento de Yoro, en Honduras, conocida en el país como la Ciudad Cívica de la República. Ese nombre se lo puso el profesor Max Sorto Batres, y se sostiene sobre todo por la tradición de Olanchito como cuna de escritores, dramaturgos y pintores hondureños a lo largo de su historia. Esa vinculación con la cultura y las letras es lo que más se asocia a Olanchito dentro del departamento de Yoro, por encima de otros rasgos de la ciudad, y es también el origen del título con el que se la conoce en el resto del país."
  },
  {
    "slug": "mayari",
    "name": "Mayarí",
    "kind": "ciudad",
    "icon": "💬",
    "users": 122,
    "votes": 199,
    "activity": "Media",
    "parentName": "Cuba",
    "parentSlug": "cuba",
    "provincia": "Provincia de Holguín",
    "regionSlug": "provincia-de-holguin",
    "channels": [
      "cuba",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "holguin",
      "santiago-de-cuba",
      "guantanamo",
      "bayamo",
      "cuba",
      "amistad",
      "amor"
    ],
    "intro": "Mayarí, municipio de Holguín (Cuba): montañas, el río Mayarí y el salto de agua más alto del país, situado en un valle del nororiente cubano.",
    "aboutTitle": "El salto de agua más alto de Cuba",
    "about": "Mayarí es un municipio y ciudad situada en la provincia de Holguín, en la zona nororiental de Cuba. La cabecera municipal se encuentra asentada en un valle rodeado de montañas, lo que confiere al entorno un relieve predominantemente accidentado. El territorio municipal se caracteriza por una densa red hidrográfica: el río Mayarí atraviesa la zona, alimentando las bahías de Nipe y Levisa que se encuentran en sus proximidades. Dentro de este marco natural destaca el salto de agua más alto de la isla, ubicado en el mismo municipio y reconocido por su altura. La combinación de valle, cordilleras y corrientes fluviales ha condicionado tanto la actividad agrícola como la forma de asentamiento de la población local. La población del municipio se distribuye principalmente en la zona urbana de la ciudad y en pequeñas poblaciones dispersas en los valles y laderas. Este contexto geográfico e histórico convierte a Mayarí en un punto de referencia dentro de la provincia de Holguín por su paisaje montañoso y sus recursos hídricos."
  },
  {
    "slug": "upata",
    "name": "Upata",
    "kind": "ciudad",
    "icon": "💬",
    "users": 112,
    "votes": 197,
    "activity": "Media",
    "parentName": "Venezuela",
    "parentSlug": "venezuela",
    "provincia": "Bolívar",
    "regionSlug": "bolivar",
    "channels": [
      "venezuela",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "ciudad-guayana",
      "venezuela",
      "amistad",
      "amor"
    ],
    "intro": "Upata, capital del municipio Piar, en el interior del estado Bolívar: la tercera ciudad de la región de Guayana por población.",
    "aboutTitle": "La tercera ciudad del estado Bolívar en población",
    "about": "Upata es una ciudad venezolana situada en el interior del estado Bolívar. Es la capital del municipio Piar y ocupa el tercer puesto en número de habitantes de todo el estado, y de la región de Guayana en conjunto, por detrás únicamente de las dos ciudades más grandes de la zona. Esa posición —tercera en población de todo un estado y de toda una región— es la que mejor sitúa a Upata dentro de Bolívar: ni es la capital estatal ni la segunda ciudad, pero tampoco es una cabecera municipal más, sino la tercera fuerza demográfica de una región tan extensa como Guayana."
  },
  {
    "slug": "la-grita",
    "name": "La Grita",
    "kind": "ciudad",
    "icon": "💬",
    "users": 129,
    "votes": 221,
    "activity": "Media",
    "parentName": "Venezuela",
    "parentSlug": "venezuela",
    "provincia": "Táchira",
    "regionSlug": "tachira",
    "channels": [
      "venezuela",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "san-cristobal",
      "cucuta",
      "villa-del-rosario",
      "el-vigia",
      "los-patios",
      "venezuela",
      "amistad",
      "amor"
    ],
    "intro": "La Grita, capital del municipio Jáuregui en el estado Táchira: a orillas del río Grita, en el Valle del Espíritu Santo andino.",
    "aboutTitle": "A orillas del río Grita, en los Andes venezolanos",
    "about": "La Grita es una ciudad venezolana, capital del municipio Jáuregui, en el estado Táchira, con 88.450 habitantes sobre los 454 kilómetros cuadrados que ocupa el municipio en su conjunto. Está situada a orillas del río Grita, del que toma directamente el nombre, dentro de un valle andino conocido como Valle del Espíritu Santo. Ese valle, y el propio río que lo recorre y le presta su nombre, son los dos rasgos geográficos que más se asocian a La Grita como capital del municipio Jáuregui, dentro de un estado, Táchira, que se identifica sobre todo con su paisaje de montaña andina, muy marcado en toda esta zona."
  },
  {
    "slug": "yautepec",
    "name": "Yautepec",
    "kind": "ciudad",
    "icon": "💬",
    "users": 145,
    "votes": 235,
    "activity": "Media",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Morelos",
    "regionSlug": "morelos",
    "channels": [
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "emiliano-zapata-edomex",
      "cuernavaca",
      "juchitepec",
      "ozumba-de-alzate",
      "amecameca",
      "morelos",
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "Yautepec, municipio de Morelos con 105.780 habitantes, destaca por su arquitectura virreinal y ruinas prehispánicas en la región Tierra Grande.",
    "aboutTitle": "Arquitectura virreinal y ruinas prehispánicas de Yautepec",
    "about": "Yautepec es uno de los 36 municipios que integran el estado de Morelos, México, y forma parte de la región Tierra Grande. Con una población de cerca de 105.780 habitantes, se sitúa en la zona norte del estado. Limita al norte con los municipios de Tepoztlán, Tlayacapan y Atlatlahucan, al sur con Tlaltizapán y Ayala, al oriente con Cuautla y al poniente con Jiutepec y Emiliano Zapata. El nombre proviene de los vocablos náhuatl yautli, la planta de pericón, y tepe‑tl, cerro, lo que significa “el cerro del pericón”. Aunque el cerro del Tenayo está cerca del centro, el nombre se refiere al cerro situado al poniente, donde abundan las flores de pericón.\n\nEl municipio es un importante destino turístico gracias a sus construcciones del periodo virreinal y a las ruinas arqueológicas del periodo prehispánico, como los hallazgos en el cerro de Atlihuayán y las nueve pirámides del juego de pelota descubiertas en Itzamatitlán. La historia local incluye la presencia de pobladores de origen olmeca y la participación en conflictos prehispánicos, como el ataque de 1389 contra los Tlahuicas. Durante la conquista, el señor de México sometió Yautepec y, al llegar los españoles, la región estaba bajo el liderazgo de Tizapapalotzin, quien ofreció resistencia."
  },
  {
    "slug": "tarimbaro",
    "name": "Tarímbaro",
    "kind": "ciudad",
    "icon": "💬",
    "users": 135,
    "votes": 230,
    "activity": "Media",
    "parentName": "México",
    "parentSlug": "mexico",
    "provincia": "Michoacán",
    "regionSlug": "michoacan",
    "channels": [
      "mexico",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "morelia",
      "celaya",
      "irapuato",
      "uruapan",
      "mexico",
      "amistad",
      "amor"
    ],
    "intro": "Tarímbaro, en Michoacán, se destaca por su nombre purépecha que significa “lugar de sauces”, y está a 12 km de la capital del estado.",
    "aboutTitle": "Tarímbaro: origen purépecha y su historia colonial",
    "about": "Tarímbaro es la cabecera del municipio homónimo, situada en Michoacán, México. Se ubica a 19°47′38″N 101°10′37″O, a 1.870 metros sobre el nivel del mar, a 12 km de Morelia, la capital del estado. Su nombre proviene del purépecha y significa “lugar de sauces”. El vocablo Tarhímu se traduce como «sauce». En la época prehispánica el valle perteneció a la princesa tarasca Doña Beatriz de Castilleja Inaguatzín (1535‑1594), hija de Francisco de Castilleja y María Inaguitzin, hermana de Don Antoni Huitziméngari. Tras la conquista, Carlos V confirmó la propiedad en 1545. Los primeros pobladores llegaron bajo la guía de Doña Beatriz desde el cerro de San Miguel, hoy llamado cerro de Quinceo. Los franciscanos fundaron un templo donde se venera una imagen de la Virgen de la Escalera, promovida por Fray Juan Reina en 1757. Tarímbaro obtuvo la categoría de municipio el 10 de diciembre de 1831, perdió y recuperó su condición en 1894 y el 26 de febrero de 1930."
  },
  {
    "slug": "lago-agrio",
    "name": "Lago Agrio",
    "kind": "ciudad",
    "icon": "💬",
    "users": 111,
    "votes": 181,
    "activity": "Media",
    "parentName": "Ecuador",
    "parentSlug": "ecuador",
    "provincia": "Sucumbíos",
    "regionSlug": "sucumbios",
    "channels": [
      "ecuador",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "valle-del-guamuez",
      "puerto-asis",
      "orito",
      "villagarzon",
      "ipiales",
      "ecuador",
      "amistad",
      "amor"
    ],
    "intro": "Lago Agrio, cantón ubicado en la provincia de Sucumbíos, Ecuador, con una superficie de 3128 km² y una población de 105.044 habitantes según el censo del 2022.",
    "aboutTitle": "Lago Agrio, un cantón en la Amazonia ecuatoriana",
    "about": "Lago Agrio es un cantón ubicado en la provincia de Sucumbíos, Ecuador. Su cabecera cantonal es la ciudad de Nueva Loja, lugar donde se agrupa gran parte de su población total. El cantón tiene una superficie de 3128 km² y una altura de 300 m s. n. m. Limita al norte con Colombia, al sur con la provincia de Orellana, al este con el cantón Cuyabeno y al oeste con el cantón Cascales.\n\nEl cantón tiene un clima tropical (húmedo) con temperaturas que oscilan entre los 37 a 39 grados celsius y máximas precipitaciones en verano. La hidrografía del cantón se caracteriza por la presencia de innumerables ríos, entre los que se destacan el río Aguarico, El Eno, El Conejo, El Dureno y El Teteye."
  },
  {
    "slug": "autonomo-atures",
    "name": "Autónomo Atures",
    "kind": "ciudad",
    "icon": "💬",
    "users": 146,
    "votes": 249,
    "activity": "Media",
    "parentName": "Venezuela",
    "parentSlug": "venezuela",
    "provincia": "Amazonas",
    "regionSlug": "amazonas",
    "channels": [
      "venezuela",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "puerto-carreno",
      "venezuela",
      "amistad",
      "amor"
    ],
    "intro": "Autónomo Atures, municipio del estado Amazonas en Venezuela, con una superficie de 4500 km² y una población de 135.000 habitantes.",
    "aboutTitle": "El río Orinoco y la historia de Autónomo Atures",
    "about": "El Municipio Autónomo Atures es uno de los 7 municipios que conforman el estado Amazonas en Venezuela. Su capital es Puerto Ayacucho, la cual también es la capital del estado y sede de los poderes públicos del estado. El nombre de Autónomo Atures proviene de los primeros pobladores de la región y de los rápidos del río Orinoco que interrumpen la navegación en esa zona, conocidos como 'raudales de Atures'. La historia de Autónomo Atures se remonta a 1748, cuando el padre jesuita Francisco González fundó la misión de Juan Nepomuceno de Atures en el sitio llamado El Raudal. En ese momento, la misión tenía 520 indios de diferentes etnias, como Piaroas, Macos, Cuacas, Maipures, Abanes, Parenes, Guaipuinabes y Yavaranas."
  },
  {
    "slug": "presidente-peron",
    "name": "Presidente Perón",
    "kind": "ciudad",
    "icon": "💬",
    "users": 133,
    "votes": 222,
    "activity": "Media",
    "parentName": "Argentina",
    "parentSlug": "argentina",
    "provincia": "Provincia de Buenos Aires",
    "regionSlug": "provincia-de-buenos-aires",
    "channels": [
      "argentina",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "san-vicente-misiones",
      "lomas-de-zamora",
      "lanus",
      "quilmes",
      "brandsen",
      "argentina",
      "amistad",
      "amor"
    ],
    "intro": "Presidente Perón, partido bonaerense creado en 1993 con cabecera en Guernica, limita con San Vicente y Florencio Varela a 37 km de Buenos Aires por la Ruta 16.",
    "aboutTitle": "Guernica, cabecera del partido creado en 1993 por ley 11.480",
    "about": "Presidente Perón es uno de los 135 partidos de la provincia de Buenos Aires. Su territorio fue desmembrado en 1993 de San Vicente, Florencio Varela y Esteban Echeverría, y tiene como única ciudad cabecera a Guernica, donde se ubica el Palacio Municipal en la calle Crisólogo Larralde 241. El partido lleva el nombre del expresidente Juan Domingo Perón, fallecido en 1974, y forma parte del aglomerado urbano del Gran Buenos Aires.\n\nSe encuentra a 37 km de la Ciudad Autónoma de Buenos Aires, conectado a través de las rutas provinciales 16, 58 y 210. En cuanto a su geografía, registra baja sismicidad, habiéndose registrado el último movimiento significativo en 1888, y está atravesada por las subfallas de los ríos Paraná y de la Plata. El partido incluye barrios como Panamérica, Parque Las Naciones, La Yaya y Santa Rosa de Lima. Cuenta con áreas de gestión municipal dedicadas a salud, desarrollo social y medio ambiente, las cuales operan centros de atención primaria y programas de prevención contra enfermedades como el dengue, zika y chikungunya."
  },
  {
    "slug": "pena",
    "name": "Peña",
    "kind": "ciudad",
    "icon": "💬",
    "users": 128,
    "votes": 211,
    "activity": "Media",
    "parentName": "Venezuela",
    "parentSlug": "venezuela",
    "provincia": "Yaracuy",
    "regionSlug": "yaracuy",
    "channels": [
      "venezuela",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "barquisimeto",
      "san-felipe",
      "acarigua",
      "venezuela",
      "amistad",
      "amor"
    ],
    "intro": "Peña, municipio del suroeste de Yaracuy (Venezuela), cuenta con 140.256 habitantes y una extensión de 510 km² repartidos en San Andrés y Yaritagua.",
    "aboutTitle": "Peña, un municipio venezolano con economía agrícola",
    "about": "Peña es uno de los 14 municipios que integran el estado Yaracuy, situado en la zona suroeste de Venezuela. Este territorio ocupa una superficie total de 510 km², los cuales se encuentran organizados administrativamente en dos parroquias: San Andrés y Yaritagua. En cuanto a su actividad económica, el municipio presenta un modelo mixto que combina el sector comercial con la agricultura. Entre los cultivos que destacan en la producción local se encuentran el maíz, el pimentón, la caña de azúcar y el tomate. A pesar de que su ubicación geográfica sugiere un potencial favorable para el desarrollo regional, el crecimiento industrial de Peña se ha visto limitado. Este estancamiento es consecuencia directa de la crisis económica que atraviesa Venezuela, así como de la escasez de oportunidades laborales y educativas para su población de 140.256 habitantes."
  },
  {
    "slug": "la-costa",
    "name": "La Costa",
    "kind": "ciudad",
    "icon": "💬",
    "users": 122,
    "votes": 213,
    "activity": "Media",
    "parentName": "Argentina",
    "parentSlug": "argentina",
    "provincia": "Provincia de Buenos Aires",
    "regionSlug": "provincia-de-buenos-aires",
    "channels": [
      "argentina",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "san-clemente-del-tuyu",
      "pinamar-divisadero",
      "general-juan-madariaga",
      "villa-gesell",
      "dolores",
      "argentina",
      "amistad",
      "amor"
    ],
    "intro": "La Costa, un partido costero de la provincia de Buenos Aires, Argentina, ubicado en la quinta sección electoral de la provincia.",
    "aboutTitle": "La Costa, un municipio costero en la provincia de Buenos Aires",
    "about": "La Costa es uno de los 135 partidos que componen la provincia argentina de Buenos Aires. Forma parte de la quinta sección electoral de la provincia de Buenos Aires y se encuentra ubicado en la costa atlántica. El partido cubre todo el borde oriental del cabo San Antonio, limita al norte con la Bahía de Samborombón; al sur, con el partido de Pinamar; al oeste, con el partido de General Lavalle y al este, con el mar Argentino. La cabecera del municipio es la localidad de Mar del Tuyú, que cuenta con servicios estándares para el turista y es virtualmente una localidad satélite de la vecina Santa Teresita. La ciudad de San Bernardo del Tuyu es la urbe más importante de todo el municipio en cuanto a desarrollo edilicio, urbanístico y comercial."
  },
  {
    "slug": "el-seibo",
    "name": "El Seibo",
    "kind": "ciudad",
    "icon": "💬",
    "users": 129,
    "votes": 221,
    "activity": "Media",
    "parentName": "República Dominicana",
    "parentSlug": "republica-dominicana",
    "provincia": "El Seibo",
    "regionSlug": "el-seibo",
    "channels": [
      "republica_dominicana",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "higuey",
      "la-romana",
      "san-pedro-de-macorris",
      "punta-cana",
      "santo-domingo-este",
      "republica-dominicana",
      "amistad",
      "amor"
    ],
    "intro": "El Seibo, municipio fundado en 1502 en la provincia homónima, es una de las primeras ciudades de República Dominicana. Su nombre proviene del jefe taíno Seebo.",
    "aboutTitle": "El Seibo, una ciudad con historia y producción de cacao",
    "about": "El Seibo es un municipio de República Dominicana ubicado en la provincia del mismo nombre, una de las primeras del país. Fundado en 1502 por el conquistador español Juan de Esquivel, su origen se remonta a la época colonial. La economía local gira en torno al cacao, siendo la segunda provincia productora nacional con unos 132.000 quintales anuales. Además, en la zona se elabora el mabí, una bebida refrescante hecha con tallos de bejuco indio y azúcar de caña. El nombre de la ciudad proviene de Seebo, un jefe taíno que gobernaba como subcacique bajo la autoridad del cacique Cayacoha, de la cercana Higuey."
  },
  {
    "slug": "buin",
    "name": "Buin",
    "kind": "ciudad",
    "icon": "💬",
    "users": 117,
    "votes": 201,
    "activity": "Media",
    "parentName": "Chile",
    "parentSlug": "chile",
    "provincia": "Región Metropolitana de Santiago",
    "regionSlug": "region-metropolitana-de-santiago",
    "channels": [
      "chile",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "chile",
      "santiago-de-chile",
      "rancagua",
      "san-antonio-chile",
      "quillota",
      "amistad",
      "amor"
    ],
    "intro": "Buin, comuna y ciudad de la Región Metropolitana a 35 km al sur de Santiago por la Ruta Panamericana, fundada en 1844 bajo el gobierno de Manuel Bulnes Prieto.",
    "aboutTitle": "La batalla de los puentes de Buin y su fundación en 1844",
    "about": "Buin es una comuna y ciudad de la Región Metropolitana de Santiago, situada a 35 km al sur de la capital. Se accede por la Ruta Panamericana o la Autopista del Maipo y pertenece a la provincia de Maipo. Forma parte del Distrito Electoral N° 30 junto a Calera de Tango, Paine y San Bernardo. Fundada oficialmente el 14 de febrero de 1844 durante el gobierno de Manuel Bulnes Prieto, su creación incluyó la donación de terrenos para una plaza, una iglesia y la casa consistorial. El origen de su nombre es incierto: algunas teorías lo vinculan al río Buin en Perú, mientras que otras lo relacionan con el mapudungun *huimn* ('hallarse en un lugar'). Limita al norte con San Bernardo, al este con Pirque, al sur con Paine y al oeste con Isla de Maipo. Actualmente, Buin forma parte del área metropolitana de Santiago, integrada en la conurbación del sector sur de la región."
  },
  {
    "slug": "nahuala",
    "name": "Nahualá",
    "kind": "ciudad",
    "icon": "💬",
    "users": 114,
    "votes": 182,
    "activity": "Media",
    "parentName": "Guatemala",
    "parentSlug": "guatemala",
    "provincia": "Departamento de Sololá",
    "regionSlug": "departamento-de-solola",
    "channels": [
      "guatemala",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "solola",
      "quetzaltenango",
      "mazatenango",
      "san-marcos-guatemala",
      "huehuetenango",
      "guatemala",
      "amistad",
      "amor"
    ],
    "intro": "Nahualá, municipio de Sololá (Guatemala), abarca 4.518 km² y su nombre en quiché evoca 'aguas encantadas' o 'agua de los espíritus'.",
    "aboutTitle": "Nahualá y el significado de sus 'aguas encantadas'",
    "about": "Nahualá es un municipio del departamento de Sololá, en la región occidental de Guatemala. Su nombre, de origen quiché, se traduce localmente como 'aguas encantadas' o 'agua de los espíritus', aunque los académicos lo vinculan a raíces náhuatl y mayas: *nawal* ('mago' o 'espíritu') y *ja’* ('agua'). Los residentes rechazan interpretaciones como 'agua de los brujos'. Se ubica a 29 km de la cabecera departamental, Sololá, y su territorio ocupa 4.518 km².\n\nEn 1872, tras la creación del departamento de Quiché durante la Revolución Liberal, Nahualá pasó a depender administrativamente de Totonicapán. La zona estuvo habitada desde el período Preclásico, según estudios arqueológicos realizados en los años 70. Limita con otros municipios del altiplano guatemalteco, dentro de una comarca marcada por su herencia cultural y paisajes montañosos."
  },
  {
    "slug": "evita",
    "name": "Evita",
    "kind": "ciudad",
    "icon": "💬",
    "users": 122,
    "votes": 209,
    "activity": "Media",
    "parentName": "Argentina",
    "parentSlug": "argentina",
    "provincia": "Provincia de Buenos Aires",
    "regionSlug": "provincia-de-buenos-aires",
    "channels": [
      "argentina",
      "latinoamerica",
      "chatzona"
    ],
    "related": [
      "moron",
      "lomas-de-zamora",
      "lanus",
      "argentina",
      "buenos-aires",
      "amistad",
      "amor"
    ],
    "intro": "María Eva Duarte de Perón, conocida como Evita, fue actriz y política argentina, primera dama entre 1946 y 1952.",
    "aboutTitle": "Evita y el legado de la abanderada de los humildes",
    "about": "María Eva Duarte de Perón, apodada Evita, fue actriz y política argentina. Ejerció como primera dama desde 1946 hasta su muerte en 1952, durante los mandatos de su esposo, el presidente Juan Domingo Perón. Figura destacada del peronismo en las décadas de 1940 y 1950, impulsó la lucha contra la pobreza, la desigualdad económica y la oligarquía de los grandes terratenientes. Defendió los derechos de trabajadores, mujeres, niños, ancianos y sectores vulnerables. Su dedicación al servicio público le valió el apelativo de «la abanderada de los humildes». Tras los gobiernos peronistas, los golpes militares prohibieron su mención durante veinte años, generando controversias que persisten."
  }
];
