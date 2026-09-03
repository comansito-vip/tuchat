import type { Place } from "./types";

// Salas por provincia española (43 de las 52: las 9 restantes —Asturias,
// Cantabria, Madrid, Murcia, Navarra, La Rioja, Baleares, Ceuta y Melilla—
// son uniprovinciales y ya tienen sala como comunidad autónoma o como
// ciudad; una sala de "provincia" ahí duplicaría exactamente el mismo
// territorio, así que no se crean. Cada ficha está anclada en su extracto
// real de Wikipedia (provincias-extractos.json, sesión 2026-09-02/03), sin
// ningún dato que no esté en la fuente.
export const TOPICS_PROVINCIAS: Place[] = [
  {
    "slug": "almeria-provincia",
    "name": "Almería",
    "kind": "tematica",
    "icon": "🏖️",
    "users": 41,
    "votes": 78,
    "activity": "Media",
    "parentSlug": "andalucia",
    "parentName": "Andalucía",
    "channels": [
      "almeria",
      "andalucia",
      "chatzona"
    ],
    "related": [
      "almeria",
      "andalucia"
    ],
    "aboutTitle": "La única provincia transcontinental de España",
    "intro": "Almería, la única provincia transcontinental de España: la isla de Alborán está más cerca de África que de la Península.",
    "about": "Almería es una provincia de Andalucía, en el sureste de la Península Ibérica, con capital en la ciudad de Almería, situada en el centro de la bahía que lleva su nombre. Limita con Granada al oeste y noroeste, con Murcia al norte y noreste, y con el mar Mediterráneo al este y al sur. Es la única provincia transcontinental de España: aunque casi todo su territorio está en Europa, le pertenece la isla de Alborán, que geográficamente está más cerca de África que de la Península. El gobierno de sus intereses provinciales corresponde a la Diputación Provincial de Almería."
  },
  {
    "slug": "cadiz-provincia",
    "name": "Cádiz",
    "kind": "tematica",
    "icon": "🏖️",
    "users": 40,
    "votes": 76,
    "activity": "Media",
    "parentSlug": "andalucia",
    "parentName": "Andalucía",
    "channels": [
      "cadiz",
      "andalucia",
      "chatzona"
    ],
    "related": [
      "cadiz",
      "andalucia"
    ],
    "aboutTitle": "45 municipios, con Jerez y Algeciras sobre la capital",
    "intro": "Cádiz, con 45 municipios: Jerez de la Frontera y Algeciras superan en población a la propia capital.",
    "about": "Cádiz es una provincia andaluza situada en el sur de España, con capital en la ciudad de Cádiz, que es en realidad la tercera más poblada de la provincia, por detrás de Jerez de la Frontera y de Algeciras. Está dividida en 45 municipios, entre los que también destacan San Fernando, El Puerto de Santa María, Chiclana de la Frontera, Conil de la Frontera, Sanlúcar de Barrameda y La Línea de la Concepción. Que la capital administrativa no sea la ciudad más poblada es uno de los rasgos que mejor explican el reparto de peso entre los municipios gaditanos."
  },
  {
    "slug": "cordoba-provincia",
    "name": "Córdoba",
    "kind": "tematica",
    "icon": "🗺️",
    "users": 84,
    "votes": 146,
    "activity": "Alta",
    "parentSlug": "andalucia",
    "parentName": "Andalucía",
    "channels": [
      "cordoba",
      "andalucia",
      "chatzona"
    ],
    "related": [
      "cordoba",
      "andalucia"
    ],
    "aboutTitle": "Frontera con seis provincias distintas",
    "intro": "Córdoba, en el centro-norte de Andalucía: frontera con seis provincias, de Sevilla a Granada.",
    "about": "Córdoba es una provincia del sur de España, situada en la parte norte-central de Andalucía. Limita nada menos que con seis provincias distintas: Sevilla, Badajoz, Málaga, Ciudad Real, Jaén y Granada, lo que la sitúa en un cruce de caminos entre varias comunidades autónomas. Su capital es la ciudad de Córdoba, que da nombre a toda la provincia. Ese número de fronteras provinciales, poco habitual, es uno de los datos más concretos con los que se puede describir la posición geográfica de Córdoba dentro de Andalucía."
  },
  {
    "slug": "granada-provincia",
    "name": "Granada",
    "kind": "tematica",
    "icon": "⛰️",
    "users": 83,
    "votes": 145,
    "activity": "Alta",
    "parentSlug": "andalucia",
    "parentName": "Andalucía",
    "channels": [
      "granada",
      "andalucia",
      "chatzona"
    ],
    "related": [
      "granada",
      "andalucia"
    ],
    "aboutTitle": "Costa mediterránea y alta montaña en un mismo territorio",
    "intro": "Granada, en plena cordillera Penibética: provincia andaluza a orillas del Mediterráneo, en el sureste peninsular.",
    "about": "Granada es una provincia andaluza situada en el sureste de la Península Ibérica, a orillas del mar Mediterráneo y dentro de la cordillera Penibética, una de las cadenas montañosas más altas de España. Su capital es la ciudad de Granada, que da nombre al conjunto de la provincia. Esa combinación de costa mediterránea y alta montaña dentro de un mismo territorio es uno de los rasgos geográficos que más distinguen a la provincia de Granada frente a otras provincias andaluzas, la mayoría con un relieve más uniforme."
  },
  {
    "slug": "huelva-provincia",
    "name": "Huelva",
    "kind": "tematica",
    "icon": "🏖️",
    "users": 82,
    "votes": 143,
    "activity": "Alta",
    "parentSlug": "andalucia",
    "parentName": "Andalucía",
    "channels": [
      "huelva",
      "andalucia",
      "chatzona"
    ],
    "related": [
      "huelva",
      "andalucia"
    ],
    "aboutTitle": "La provincia menos poblada de toda Andalucía",
    "intro": "Huelva, al oeste de Andalucía: la provincia menos poblada de la comunidad, con 538.789 habitantes en 2025.",
    "about": "Huelva es una provincia situada al oeste de Andalucía, con capital en la ciudad que lleva su mismo nombre. Con una población de 538.789 habitantes en 2025, ocupa el puesto 29 en población entre todas las provincias españolas, y es además la provincia menos poblada de toda Andalucía. Ese dato demográfico, que la sitúa por detrás de las otras siete provincias andaluzas en número de habitantes, es uno de los rasgos que mejor definen a Huelva dentro del conjunto de la comunidad autónoma a la que pertenece."
  },
  {
    "slug": "jaen-provincia",
    "name": "Jaén",
    "kind": "tematica",
    "icon": "🗺️",
    "users": 81,
    "votes": 142,
    "activity": "Alta",
    "parentSlug": "andalucia",
    "parentName": "Andalucía",
    "channels": [
      "jaen",
      "andalucia",
      "chatzona"
    ],
    "related": [
      "jaen",
      "andalucia"
    ],
    "aboutTitle": "Uno de los históricos Cuatro reinos de Andalucía",
    "intro": "Jaén, uno de los históricos «Cuatro reinos de Andalucía»: al noreste de la comunidad, frontera con Ciudad Real y Albacete.",
    "about": "Jaén es una provincia situada al noreste de Andalucía, en el sur de la Península Ibérica, y se cuenta entre los históricos «Cuatro reinos de Andalucía». Limita por el oeste con Córdoba, por el norte con Ciudad Real, por el este con Albacete y por el sur con Granada, lo que la conecta directamente con Castilla-La Mancha además de con el resto de Andalucía. Su capital es la ciudad de Jaén. Esa condición de frontera entre dos comunidades autónomas distintas es uno de los rasgos que mejor sitúan a la provincia de Jaén dentro del mapa de España."
  },
  {
    "slug": "malaga-provincia",
    "name": "Málaga",
    "kind": "tematica",
    "icon": "🏖️",
    "users": 80,
    "votes": 140,
    "activity": "Alta",
    "parentSlug": "andalucia",
    "parentName": "Andalucía",
    "channels": [
      "malaga",
      "andalucia",
      "chatzona"
    ],
    "related": [
      "malaga",
      "andalucia"
    ],
    "aboutTitle": "La Costa del Sol, tercera zona turística de la Península",
    "intro": "Málaga y su Costa del Sol: tercera provincia española en turismo, con Marbella como su segunda ciudad.",
    "about": "Málaga es una de las ocho provincias andaluzas, situada al sur de la Península Ibérica, en la costa mediterránea, entre Granada al este y Cádiz al oeste, con Córdoba y Sevilla al norte. Su capital es la ciudad de Málaga. Todo su litoral es conocido mundialmente como la Costa del Sol, que goza del privilegio de ser la tercera zona de la Península Ibérica en volumen de turismo. Allí se encuentra también la segunda ciudad más importante de la provincia, Marbella, un peso turístico que distingue a Málaga del resto de provincias andaluzas del interior."
  },
  {
    "slug": "sevilla-provincia",
    "name": "Sevilla",
    "kind": "tematica",
    "icon": "🗺️",
    "users": 79,
    "votes": 138,
    "activity": "Alta",
    "parentSlug": "andalucia",
    "parentName": "Andalucía",
    "channels": [
      "sevilla",
      "andalucia",
      "chatzona"
    ],
    "related": [
      "sevilla",
      "andalucia"
    ],
    "aboutTitle": "Capital provincial y capital de Andalucía a la vez",
    "intro": "Sevilla, capital de Andalucía: la quinta provincia de España por número de habitantes.",
    "about": "Sevilla es una provincia andaluza que limita con Málaga y Cádiz al sur, Huelva al oeste, Badajoz al norte y Córdoba al este, lo que la sitúa en el centro de la comunidad autónoma. Es la quinta provincia de toda España en número de habitantes, y su capital, la ciudad de Sevilla, es a la vez la capital de toda Andalucía. Esa doble condición —capital provincial y capital autonómica al mismo tiempo— es uno de los rasgos que distinguen a Sevilla del resto de provincias andaluzas, ninguna de las cuales acumula ese doble papel administrativo."
  },
  {
    "slug": "coruna-provincia",
    "name": "A Coruña",
    "kind": "tematica",
    "icon": "🌊",
    "users": 78,
    "votes": 137,
    "activity": "Alta",
    "parentSlug": "galicia",
    "parentName": "Galicia",
    "channels": [
      "coruña",
      "galicia",
      "chatzona"
    ],
    "related": [
      "a-coruna",
      "galicia"
    ],
    "aboutTitle": "La provincia más poblada de toda Galicia",
    "intro": "A Coruña, en el extremo noroeste de la Península: la provincia más poblada de toda Galicia.",
    "about": "A Coruña es una provincia situada en el extremo noroeste de la Península Ibérica, dentro de la comunidad autónoma de Galicia. Su capital es la ciudad de A Coruña, que da nombre al conjunto de la provincia. Es, además, la provincia más poblada de toda Galicia, por delante de las otras tres que forman la comunidad. Esa posición demográfica, la primera de las cuatro provincias gallegas, es el dato que mejor resume el peso de A Coruña dentro del mapa de Galicia."
  },
  {
    "slug": "lugo-provincia",
    "name": "Lugo",
    "kind": "tematica",
    "icon": "🌊",
    "users": 77,
    "votes": 135,
    "activity": "Alta",
    "parentSlug": "galicia",
    "parentName": "Galicia",
    "channels": [
      "lugo",
      "galicia",
      "chatzona"
    ],
    "related": [
      "lugo",
      "galicia"
    ],
    "aboutTitle": "Frontera con el Cantábrico, Asturias y León",
    "intro": "Lugo, entre el Cantábrico y Asturias: una de las cuatro provincias gallegas, frontera con León.",
    "about": "Lugo es una de las cuatro provincias que forman la comunidad autónoma de Galicia. Limita al norte con el mar Cantábrico, al oeste con la provincia de A Coruña, al suroeste con la de Pontevedra, al sur con la de Ourense y al este con el Principado de Asturias y con la provincia de León. Esa posición fronteriza, tocando tanto el mar como otra comunidad autónoma entera —Asturias— y una provincia de Castilla y León —León—, es uno de los rasgos geográficos más concretos de Lugo dentro de Galicia."
  },
  {
    "slug": "ourense-provincia",
    "name": "Ourense",
    "kind": "tematica",
    "icon": "🗺️",
    "users": 76,
    "votes": 134,
    "activity": "Alta",
    "parentSlug": "galicia",
    "parentName": "Galicia",
    "channels": [
      "ourense",
      "galicia",
      "chatzona"
    ],
    "related": [
      "ourense",
      "galicia"
    ],
    "aboutTitle": "La única provincia gallega sin salida al mar",
    "intro": "Ourense, la única provincia gallega sin costa: frontera con Portugal al sur.",
    "about": "Ourense es una provincia del noroeste de España, situada en la parte sureste de la comunidad autónoma de Galicia. Limita con las provincias de Pontevedra al oeste, Lugo al norte, León y Zamora al este, y con Portugal al sur, siendo así la única de las cuatro provincias gallegas sin salida al mar. Su capital es la ciudad de Ourense. Esa ausencia de costa, poco habitual dentro de una comunidad tan marcada por su litoral atlántico, es uno de los rasgos que más distinguen a Ourense del resto de Galicia."
  },
  {
    "slug": "pontevedra-provincia",
    "name": "Pontevedra",
    "kind": "tematica",
    "icon": "🌊",
    "users": 75,
    "votes": 132,
    "activity": "Alta",
    "parentSlug": "galicia",
    "parentName": "Galicia",
    "channels": [
      "pontevedra",
      "galicia",
      "chatzona"
    ],
    "related": [
      "pontevedra",
      "galicia"
    ],
    "aboutTitle": "Frontera con Portugal y con el océano Atlántico",
    "intro": "Pontevedra, frontera con Portugal y con el océano Atlántico: una de las cuatro provincias de Galicia.",
    "about": "La provincia de Pontevedra forma parte de la comunidad autónoma de Galicia, en el noroeste de España. Limita con las provincias de A Coruña al norte, Lugo al nordeste y Ourense al este, con el distrito portugués de Viana do Castelo al sur y con el océano Atlántico al oeste. Su capital es la ciudad de Pontevedra. Esa doble frontera, con Portugal por tierra y con el Atlántico por mar, es uno de los rasgos geográficos que más definen a esta provincia dentro del conjunto gallego."
  },
  {
    "slug": "las-palmas-provincia",
    "name": "Las Palmas",
    "kind": "tematica",
    "icon": "🏖️",
    "users": 74,
    "votes": 130,
    "activity": "Alta",
    "parentSlug": "canarias",
    "parentName": "Canarias",
    "channels": [
      "las_palmas",
      "canarias",
      "chatzona"
    ],
    "related": [
      "las-palmas",
      "canarias"
    ],
    "aboutTitle": "La provincia más poblada de todo el archipiélago canario",
    "intro": "Las Palmas, la provincia oriental de Canarias: Fuerteventura, Gran Canaria, Lanzarote y La Graciosa, con 1.129.395 habitantes.",
    "about": "Las Palmas es la provincia que abarca la parte oriental de la comunidad autónoma de Canarias. A ella se adscriben las islas de Fuerteventura, Gran Canaria, Lanzarote y La Graciosa, junto con los islotes deshabitados de Lobos, Alegranza, Montaña Clara, Roque del Este y Roque del Oeste. Tiene 4.066 kilómetros cuadrados de superficie y, con 1.129.395 habitantes en 2022, es la provincia más poblada de todo el archipiélago canario y la decimotercera de España entera. Esa cifra de población, muy por encima de la otra provincia canaria, es el dato que mejor sitúa a Las Palmas dentro del archipiélago."
  },
  {
    "slug": "santa-cruz-de-tenerife-provincia",
    "name": "Santa Cruz de Tenerife",
    "kind": "tematica",
    "icon": "🌋",
    "users": 73,
    "votes": 129,
    "activity": "Alta",
    "parentSlug": "canarias",
    "parentName": "Canarias",
    "channels": [
      "tenerife",
      "canarias",
      "chatzona"
    ],
    "related": [
      "santa-cruz-de-tenerife",
      "canarias"
    ],
    "aboutTitle": "La provincia con la mayor altitud de toda España",
    "intro": "Santa Cruz de Tenerife, hogar del Teide: la provincia más occidental y meridional de España.",
    "about": "La provincia de Santa Cruz de Tenerife abarca la parte occidental de la comunidad autónoma de Canarias, con las islas de El Hierro, La Gomera, La Palma y Tenerife, además de varios roques adyacentes. Es la provincia española más occidental y meridional de todas, la tercera más montañosa por desnivel de terreno, y la primera en altitud máxima del país: en ella se encuentra el pico del Teide, el punto más alto de toda España. Esa combinación de récords geográficos —el más al oeste, el más al sur y el más alto— es lo que mejor distingue a esta provincia del resto del territorio nacional."
  },
  {
    "slug": "barcelona-provincia",
    "name": "Barcelona",
    "kind": "tematica",
    "icon": "🏖️",
    "users": 72,
    "votes": 127,
    "activity": "Alta",
    "parentSlug": "cataluna",
    "parentName": "Cataluña",
    "channels": [
      "barcelona",
      "cataluña",
      "chatzona"
    ],
    "related": [
      "barcelona",
      "cataluna"
    ],
    "aboutTitle": "La segunda provincia más poblada de España",
    "intro": "Barcelona, la segunda provincia más poblada de España: 5.959.941 habitantes, solo por detrás de Madrid.",
    "about": "Barcelona es una provincia del nordeste de España, dentro de la comunidad autónoma de Cataluña. Limita con Tarragona por el sudoeste, con Lérida por el noroeste, con Gerona por el nordeste y con el mar Mediterráneo por el sudeste. Cuenta con 5.959.941 habitantes, lo que la convierte en la segunda provincia más poblada de todo el país, solo superada por la de Madrid. Su capital, Barcelona, concentra casi el 29% de toda la población provincial, en una extensión total de 7.726 kilómetros cuadrados. Esa concentración de casi un tercio de la población en la capital es uno de los datos más llamativos de la provincia."
  },
  {
    "slug": "girona-provincia",
    "name": "Girona",
    "kind": "tematica",
    "icon": "🌊",
    "users": 71,
    "votes": 126,
    "activity": "Alta",
    "parentSlug": "cataluna",
    "parentName": "Cataluña",
    "channels": [
      "girona",
      "cataluña",
      "chatzona"
    ],
    "related": [
      "girona",
      "cataluna"
    ],
    "aboutTitle": "La única frontera catalana con Francia",
    "intro": "Girona, frontera con Francia en los Pirineos Orientales: 821.108 habitantes, el 13% en la propia capital.",
    "about": "Girona es una provincia situada al nordeste de Cataluña, que limita al norte con el departamento francés de Pirineos Orientales, cerca de Perpiñán, al oeste con Lérida y al sur con Barcelona. Tiene una población de 821.108 habitantes, de los que un 12,97% vive en su capital, la ciudad de Girona. Esa proporción, algo más de una octava parte del total provincial concentrada en la capital, deja el resto de la población repartida entre el resto de municipios de una provincia que es, además, la única catalana con frontera terrestre directa con Francia."
  },
  {
    "slug": "lleida-provincia",
    "name": "Lleida",
    "kind": "tematica",
    "icon": "⛰️",
    "users": 70,
    "votes": 124,
    "activity": "Media",
    "parentSlug": "cataluna",
    "parentName": "Cataluña",
    "channels": [
      "lleida",
      "cataluña",
      "chatzona"
    ],
    "related": [
      "lleida",
      "cataluna"
    ],
    "aboutTitle": "La única provincia catalana sin salida al mar",
    "intro": "Lleida, frontera con Andorra: la única provincia catalana sin salida al mar.",
    "about": "Lleida es una provincia de la comunidad autónoma de Cataluña, con capital en la ciudad que lleva su mismo nombre. Limita al norte con Andorra y con los departamentos franceses de Ariège y Alto Garona, al occidente con Huesca y Zaragoza, ya en Aragón, y al oriente con el resto de Cataluña. Es, por tanto, la única de las cuatro provincias catalanas sin salida al mar Mediterráneo, y la que más fronteras internacionales tiene de todas ellas: con Andorra y con dos departamentos franceses distintos al mismo tiempo."
  },
  {
    "slug": "tarragona-provincia",
    "name": "Tarragona",
    "kind": "tematica",
    "icon": "🏖️",
    "users": 69,
    "votes": 122,
    "activity": "Media",
    "parentSlug": "cataluna",
    "parentName": "Cataluña",
    "channels": [
      "tarragona",
      "cataluña",
      "chatzona"
    ],
    "related": [
      "tarragona",
      "cataluna"
    ],
    "aboutTitle": "184 municipios entre las Tierras del Ebro y el Camp",
    "intro": "Tarragona, dividida en Tierras del Ebro y Campo de Tarragona: 184 municipios, el 16,4% en la capital.",
    "about": "Tarragona es una provincia situada en el sur de Cataluña, con una población de 875.530 habitantes, de los que el 16,4% vive en la capital provincial. Está compuesta por 184 municipios repartidos en diez comarcas, agrupadas en dos grandes ámbitos funcionales: las Tierras del Ebro y el Campo de Tarragona. Sus municipios más extensos, Tortosa y Tivisa, superan cada uno los 200 kilómetros cuadrados. Limita con las provincias de Castellón, Teruel, Zaragoza, Lérida y Barcelona, además del mar Mediterráneo, lo que la convierte en la provincia catalana con más fronteras provinciales distintas."
  },
  {
    "slug": "avila-provincia",
    "name": "Ávila",
    "kind": "tematica",
    "icon": "⛰️",
    "users": 68,
    "votes": 121,
    "activity": "Media",
    "parentSlug": "castilla",
    "parentName": "Castilla",
    "channels": [
      "castilla",
      "chatzona"
    ],
    "related": [
      "avila",
      "castilla"
    ],
    "aboutTitle": "Dividida en dos por el sistema Central",
    "intro": "Ávila, dividida por el sistema Central: 248 municipios y una de las provincias menos pobladas de España.",
    "about": "Ávila es una provincia del centro de España, en la comunidad autónoma de Castilla y León, con capital en la ciudad que lleva su mismo nombre y formada por 248 municipios. Su relieve está marcado por la presencia, al sur, del sistema Central, que divide el territorio abulense en dos zonas: la mayor parte se ubica en la submeseta norte, aunque incluye también una franja al sur de la sierra de Gredos. Limita con las provincias de Valladolid, Salamanca, Cáceres, Toledo, Madrid y Segovia —seis en total— y es una de las provincias menos pobladas del país, con 160.738 habitantes."
  },
  {
    "slug": "burgos-provincia",
    "name": "Burgos",
    "kind": "tematica",
    "icon": "🗺️",
    "users": 67,
    "votes": 119,
    "activity": "Media",
    "parentSlug": "castilla",
    "parentName": "Castilla",
    "channels": [
      "burgos",
      "castilla",
      "chatzona"
    ],
    "related": [
      "burgos",
      "castilla"
    ],
    "aboutTitle": "Frontera con ocho provincias y comunidades distintas",
    "intro": "Burgos, junto a Zaragoza la provincia con más fronteras de España: ocho provincias y comunidades distintas.",
    "about": "Burgos es una provincia del norte de la Península Ibérica, dentro de Castilla y León, con capital en la ciudad homónima. Limita al norte con Cantabria, al este con el País Vasco, La Rioja y la provincia de Soria, al sur con la provincia de Segovia y al oeste con las provincias de Valladolid y Palencia. Junto con Zaragoza, es la provincia española que limita con más territorios distintos, un total de ocho. Tiene una extensión de 14.292 kilómetros cuadrados y, en 2024, contaba con 362.663 habitantes."
  },
  {
    "slug": "leon-provincia",
    "name": "León",
    "kind": "tematica",
    "icon": "⛰️",
    "users": 66,
    "votes": 118,
    "activity": "Media",
    "parentSlug": "castilla",
    "parentName": "Castilla",
    "channels": [
      "leon",
      "castilla",
      "chatzona"
    ],
    "related": [
      "leon",
      "castilla"
    ],
    "aboutTitle": "15.581 km² en el noroeste de Castilla y León",
    "intro": "León, en el noroeste de Castilla y León: 15.581 km² y 448.030 habitantes en 2025.",
    "about": "León es una provincia situada en el noroeste de la comunidad autónoma de Castilla y León, con capital en la ciudad que lleva su mismo nombre. Limita al norte con Asturias y Cantabria, al este con la provincia de Palencia, al sur con las provincias de Zamora y Valladolid, y al oeste con Galicia, en concreto con las provincias de Ourense y Lugo. Tiene una extensión de 15.581 kilómetros cuadrados y, en 2025, contaba con 448.030 habitantes, cifras que la sitúan entre las provincias más extensas y pobladas de toda la comunidad castellanoleonesa."
  },
  {
    "slug": "palencia-provincia",
    "name": "Palencia",
    "kind": "tematica",
    "icon": "🗺️",
    "users": 65,
    "votes": 116,
    "activity": "Media",
    "parentSlug": "castilla",
    "parentName": "Castilla",
    "channels": [
      "palencia",
      "castilla",
      "chatzona"
    ],
    "related": [
      "palencia",
      "castilla"
    ],
    "aboutTitle": "8.052 km² en el noroeste de la Península",
    "intro": "Palencia, en el noroeste de la Península: 158.702 habitantes en 8.052 km² dentro de Castilla y León.",
    "about": "Palencia es una provincia de Castilla y León situada en el noroeste de la Península Ibérica. Tiene 158.702 habitantes repartidos en una extensión de 8.052 kilómetros cuadrados, lo que la sitúa entre las provincias menos pobladas de la comunidad. Su capital es la ciudad de Palencia, que da nombre al conjunto provincial. Con estos datos de superficie y población, Palencia es una de las nueve provincias que forman Castilla y León, la comunidad autónoma española con más provincias."
  },
  {
    "slug": "salamanca-provincia",
    "name": "Salamanca",
    "kind": "tematica",
    "icon": "🗺️",
    "users": 64,
    "votes": 114,
    "activity": "Media",
    "parentSlug": "castilla",
    "parentName": "Castilla",
    "channels": [
      "salamanca",
      "castilla",
      "chatzona"
    ],
    "related": [
      "salamanca",
      "castilla"
    ],
    "aboutTitle": "Frontera con Portugal, al sudoeste de Castilla y León",
    "intro": "Salamanca, frontera con Portugal: 327.552 habitantes en 12.349 km², al sudoeste de Castilla y León.",
    "about": "Salamanca es una provincia situada en el sudoeste de Castilla y León, con capital en la ciudad que lleva su mismo nombre. Limita con la provincia de Zamora al norte, con la de Valladolid al noreste, con la de Ávila al este, con la de Cáceres al sur y con Portugal al oeste. Tiene una superficie de 12.349,06 kilómetros cuadrados y, en 2024, contaba con 327.552 habitantes. Esa frontera directa con Portugal, además de con otras cuatro provincias españolas, es uno de los rasgos que mejor sitúan a Salamanca dentro del mapa de Castilla y León."
  },
  {
    "slug": "segovia-provincia",
    "name": "Segovia",
    "kind": "tematica",
    "icon": "⛰️",
    "users": 63,
    "votes": 113,
    "activity": "Media",
    "parentSlug": "castilla",
    "parentName": "Castilla",
    "channels": [
      "castilla",
      "chatzona"
    ],
    "related": [
      "segovia",
      "castilla"
    ],
    "aboutTitle": "La provincia más pequeña de Castilla y León",
    "intro": "Segovia, al norte del sistema Central: la provincia de menor extensión de toda Castilla y León.",
    "about": "Segovia es una provincia de Castilla y León situada al norte del sistema Central, la cordillera que divide en dos la altiplanicie del centro de la Península Ibérica. Su capital es la ciudad de Segovia. Tiene una superficie de 6.920,65 kilómetros cuadrados, la más pequeña de las nueve provincias que forman Castilla y León, y cuenta con una población de 158.470 habitantes. Ser la provincia más pequeña en superficie de toda la comunidad, pese a no ser la menos poblada, es el dato que más distingue a Segovia dentro de Castilla y León."
  },
  {
    "slug": "soria-provincia",
    "name": "Soria",
    "kind": "tematica",
    "icon": "🗺️",
    "users": 62,
    "votes": 111,
    "activity": "Media",
    "parentSlug": "castilla",
    "parentName": "Castilla",
    "channels": [
      "castilla",
      "chatzona"
    ],
    "related": [
      "soria",
      "castilla"
    ],
    "aboutTitle": "En el extremo oriental de Castilla y León",
    "intro": "Soria, en el extremo oriental de Castilla y León: una de las provincias menos pobladas de España.",
    "about": "Soria es una provincia del norte de España, ubicada en el extremo oriental de la comunidad autónoma de Castilla y León. Es, junto con Teruel, una de las provincias españolas asociadas con más frecuencia a la baja densidad de población del interior peninsular, aunque el dato exacto de habitantes no está entre lo poco que la fuente disponible confirma sobre ella. Lo que sí se puede afirmar con certeza es su posición: en el extremo este de Castilla y León, la comunidad autónoma con más provincias de toda España, fronteriza con La Rioja, Zaragoza, Guadalajara y Burgos."
  },
  {
    "slug": "valladolid-provincia",
    "name": "Valladolid",
    "kind": "tematica",
    "icon": "🗺️",
    "users": 61,
    "votes": 110,
    "activity": "Media",
    "parentSlug": "castilla",
    "parentName": "Castilla",
    "channels": [
      "valladolid",
      "castilla",
      "chatzona"
    ],
    "related": [
      "valladolid",
      "castilla"
    ],
    "aboutTitle": "225 municipios en plena Meseta Norte",
    "intro": "Valladolid, en la Meseta Norte: 528.644 habitantes en 225 municipios, dentro de la cuenca del Duero.",
    "about": "Valladolid es una provincia de Castilla y León situada al noroeste de la Península Ibérica, en la Meseta Norte, dentro de la cuenca del río Duero. Su capital es la ciudad de Valladolid, que en 2025 encabezaba una provincia con 528.644 habitantes repartidos en 225 municipios distintos. Tiene una superficie de 8.111 kilómetros cuadrados y una densidad de población de 65,17 habitantes por kilómetro cuadrado, una de las más altas de toda la comunidad castellanoleonesa gracias al peso de la capital sobre el conjunto provincial."
  },
  {
    "slug": "zamora-provincia",
    "name": "Zamora",
    "kind": "tematica",
    "icon": "🗺️",
    "users": 60,
    "votes": 108,
    "activity": "Media",
    "parentSlug": "castilla",
    "parentName": "Castilla",
    "channels": [
      "castilla",
      "chatzona"
    ],
    "related": [
      "zamora",
      "castilla"
    ],
    "aboutTitle": "La capital es también su municipio más poblado",
    "intro": "Zamora, en el noroeste de Castilla y León: la ciudad de Zamora es también su municipio más poblado.",
    "about": "Zamora es una provincia española del noroeste de la comunidad autónoma de Castilla y León. Su capital es la ciudad de Zamora, que es a la vez el municipio más poblado de toda la provincia. Limita, entre otras, con las provincias de León, Salamanca y Ourense, situándose en el punto donde Castilla y León se acerca más a Galicia. Esa doble condición de capital administrativa y núcleo de población principal, coincidentes en la misma ciudad, es uno de los pocos datos concretos y verificables con los que se puede presentar hoy a la provincia de Zamora."
  },
  {
    "slug": "albacete-provincia",
    "name": "Albacete",
    "kind": "tematica",
    "icon": "🗺️",
    "users": 59,
    "votes": 106,
    "activity": "Media",
    "parentSlug": "castilla",
    "parentName": "Castilla",
    "channels": [
      "albacete",
      "castilla",
      "chatzona"
    ],
    "related": [
      "albacete",
      "castilla"
    ],
    "aboutTitle": "Frontera con seis provincias del sureste peninsular",
    "intro": "Albacete, en el sureste peninsular: más de la mitad de sus 390.751 habitantes vive en el área metropolitana de la capital.",
    "about": "Albacete es una provincia situada en el sureste de la Península Ibérica, dentro de la comunidad autónoma de Castilla-La Mancha, con capital en la ciudad que lleva su mismo nombre. Con una superficie de 14.926 kilómetros cuadrados, limita al este con Valencia y Alicante, al sur con Murcia y Granada, al oeste con Ciudad Real y Jaén, y al norte con Cuenca —seis provincias distintas en total—. Cuenta con una población de 390.751 habitantes en 2025, de los que más de la mitad se concentra en el área metropolitana de la capital."
  },
  {
    "slug": "ciudad-real-provincia",
    "name": "Ciudad Real",
    "kind": "tematica",
    "icon": "🗺️",
    "users": 58,
    "votes": 105,
    "activity": "Media",
    "parentSlug": "castilla",
    "parentName": "Castilla",
    "channels": [
      "castilla",
      "chatzona"
    ],
    "related": [
      "ciudad-real",
      "castilla"
    ],
    "aboutTitle": "Entre los montes de Toledo y Sierra Morena",
    "intro": "Ciudad Real, cruzada por el río Guadiana: 494.848 habitantes en 102 municipios de la llanura manchega.",
    "about": "Ciudad Real es una provincia de Castilla-La Mancha con capital en la ciudad homónima. Tiene una población de 494.848 habitantes, repartidos en 102 municipios. En el noroeste se alzan los montes de Toledo, mientras que al sur, en la frontera con Andalucía, se levanta Sierra Morena. La zona central y oriental de la provincia, atravesada por el río Guadiana, está ocupada por la llanura manchega, el paisaje que más se asocia a esta provincia dentro del centro de España."
  },
  {
    "slug": "cuenca-provincia",
    "name": "Cuenca",
    "kind": "tematica",
    "icon": "⛰️",
    "users": 57,
    "votes": 103,
    "activity": "Media",
    "parentSlug": "castilla",
    "parentName": "Castilla",
    "channels": [
      "castilla",
      "chatzona"
    ],
    "related": [
      "cuenca",
      "castilla"
    ],
    "aboutTitle": "La quinta provincia más extensa de España",
    "intro": "Cuenca, Patrimonio de la Humanidad: 238 municipios repartidos entre la Serranía, la Alcarria, la Mancha y la Manchuela.",
    "about": "Cuenca es una provincia de Castilla-La Mancha con capital en la ciudad homónima, declarada Patrimonio de la Humanidad y hogar de casi el 25% de toda la población conquense. Cuenta con 199.859 habitantes, de los que alrededor de un 26,95% vive en la propia capital. La zona noreste está dominada por el sistema Ibérico, mientras que al suroeste se extiende la llanura manchega. Con 238 municipios y 17.141 kilómetros cuadrados, es la quinta provincia más extensa de España, y puede dividirse a grandes rasgos en cuatro áreas: la Serranía, la Alcarria, la Mancha y la Manchuela."
  },
  {
    "slug": "guadalajara-provincia",
    "name": "Guadalajara",
    "kind": "tematica",
    "icon": "🗺️",
    "users": 56,
    "votes": 102,
    "activity": "Media",
    "parentSlug": "castilla",
    "parentName": "Castilla",
    "channels": [
      "castilla",
      "chatzona"
    ],
    "related": [
      "guadalajara",
      "castilla"
    ],
    "aboutTitle": "Comparte nombre con la Guadalajara mexicana",
    "intro": "Guadalajara, en Castilla-La Mancha: la ciudad homónima es la capital de la provincia.",
    "about": "Guadalajara es una provincia española perteneciente a la comunidad autónoma de Castilla-La Mancha, cuya capital es la ciudad que lleva el mismo nombre. Comparte nombre con la ciudad mexicana de Guadalajara, en Jalisco, aunque son dos lugares completamente distintos a ambos lados del Atlántico. Dentro de Castilla-La Mancha, forma parte del conjunto de cinco provincias que componen la comunidad autónoma, junto a Albacete, Ciudad Real, Cuenca y Toledo, todas ellas en el centro de la Península Ibérica."
  },
  {
    "slug": "toledo-provincia",
    "name": "Toledo",
    "kind": "tematica",
    "icon": "🗺️",
    "users": 55,
    "votes": 100,
    "activity": "Media",
    "parentSlug": "castilla",
    "parentName": "Castilla",
    "channels": [
      "toledo",
      "castilla",
      "chatzona"
    ],
    "related": [
      "toledo",
      "castilla"
    ],
    "aboutTitle": "Cruzada por el río Tajo de este a oeste",
    "intro": "Toledo, cruzada por el Tajo de este a oeste: 755.081 habitantes en 204 municipios de Castilla-La Mancha.",
    "about": "Toledo es una provincia de Castilla-La Mancha con capital en la ciudad homónima. Cuenta con 755.081 habitantes repartidos en 204 municipios. El río Tajo, que pasa por las ciudades de Toledo y Talavera de la Reina, cruza la provincia de este a oeste, abriendo a su paso un ancho valle que deja al norte la sierra de San Vicente y al sur los montes de Toledo. En el sureste se extiende la llanura manchega. Toledo limita al norte con Ávila y Madrid, al este con Cuenca, al sur con Ciudad Real, al suroeste con Badajoz y al oeste con Cáceres: seis provincias distintas."
  },
  {
    "slug": "badajoz-provincia",
    "name": "Badajoz",
    "kind": "tematica",
    "icon": "🗺️",
    "users": 54,
    "votes": 98,
    "activity": "Media",
    "parentSlug": "extremadura",
    "parentName": "Extremadura",
    "channels": [
      "badajoz",
      "extremadura",
      "chatzona"
    ],
    "related": [
      "badajoz",
      "extremadura"
    ],
    "aboutTitle": "La provincia más extensa de Extremadura",
    "intro": "Badajoz, en el suroeste peninsular: Mérida, Don Benito y Almendralejo, entre sus municipios más poblados.",
    "about": "Badajoz es una provincia de Extremadura con capital en la ciudad homónima, ubicada en el oeste de España y en la submeseta sur. Tiene una población de 665.155 habitantes, y sus municipios más poblados, además de la propia capital, son Mérida, Don Benito y Almendralejo. Situada en el suroeste de la Península Ibérica, es la provincia más extensa de las dos que forman Extremadura junto a Cáceres, y una de las que más peso demográfico aporta al conjunto de la comunidad autónoma."
  },
  {
    "slug": "caceres-provincia",
    "name": "Cáceres",
    "kind": "tematica",
    "icon": "⛰️",
    "users": 53,
    "votes": 97,
    "activity": "Media",
    "parentSlug": "extremadura",
    "parentName": "Extremadura",
    "channels": [
      "caceres",
      "extremadura",
      "chatzona"
    ],
    "related": [
      "caceres",
      "extremadura"
    ],
    "aboutTitle": "La segunda provincia más extensa de España",
    "intro": "Cáceres, la segunda provincia más extensa de España tras Badajoz: frontera con Portugal, Castilla y León y Castilla-La Mancha.",
    "about": "Cáceres es una provincia de Extremadura con capital en la ciudad homónima. Tiene 388.190 habitantes, y sus municipios más poblados, tras la capital, son Plasencia, Navalmoral de la Mata y Coria. La zona norte está dominada por el sector occidental del sistema Central, mientras que al sur y al este se alzan estribaciones de los montes de Toledo. Sus ríos vierten sobre todo al Tajo, aunque también al Guadiana y al Duero. Es la segunda provincia más extensa de España tras Badajoz, y limita con Castilla y León por Salamanca y Ávila, con Castilla-La Mancha por Toledo, con Badajoz al sur y con Portugal al oeste."
  },
  {
    "slug": "huesca-provincia",
    "name": "Huesca",
    "kind": "tematica",
    "icon": "⛰️",
    "users": 52,
    "votes": 95,
    "activity": "Media",
    "parentSlug": "aragon",
    "parentName": "Aragón",
    "channels": [
      "aragon",
      "chatzona"
    ],
    "related": [
      "huesca",
      "aragon"
    ],
    "aboutTitle": "Frontera internacional directa con Francia",
    "intro": "Huesca, frontera con Francia: una cuarta parte de su población vive en la capital.",
    "about": "Huesca es una de las tres provincias de Aragón, con capital en la ciudad homónima, donde se concentra la cuarta parte de toda la población provincial. Limita al norte con Francia, al este con Lérida, al sur y al oeste con Zaragoza y al noroeste con Navarra. Esa frontera internacional directa con Francia, además de con otras dos comunidades autónomas distintas —Cataluña por Lérida y Navarra—, es uno de los rasgos geográficos que más distinguen a Huesca del resto de provincias aragonesas."
  },
  {
    "slug": "teruel-provincia",
    "name": "Teruel",
    "kind": "tematica",
    "icon": "⛰️",
    "users": 51,
    "votes": 94,
    "activity": "Media",
    "parentSlug": "aragon",
    "parentName": "Aragón",
    "channels": [
      "aragon",
      "chatzona"
    ],
    "related": [
      "teruel",
      "aragon"
    ],
    "aboutTitle": "Una de las densidades de población más bajas de España",
    "intro": "Teruel, una de las provincias con menos densidad de población de España: 9,19 habitantes por km².",
    "about": "Teruel es una provincia de Aragón con capital en la ciudad homónima, situada en su mayor parte en el área meridional del sistema Ibérico, aunque una parte del noreste provincial, en el llamado Bajo Aragón, pertenece ya al valle del río Ebro. Su superficie es de 14.809 kilómetros cuadrados y su población asciende a 136.091 habitantes, de los cuales más de una cuarta parte vive en la capital. Eso deja una densidad de 9,19 habitantes por kilómetro cuadrado, una de las más bajas de toda España. En cuanto al PIB per cápita, alcanzó la posición 19 de las cincuenta provincias españolas en 2022."
  },
  {
    "slug": "zaragoza-provincia",
    "name": "Zaragoza",
    "kind": "tematica",
    "icon": "🗺️",
    "users": 50,
    "votes": 92,
    "activity": "Media",
    "parentSlug": "aragon",
    "parentName": "Aragón",
    "channels": [
      "zaragoza",
      "aragon",
      "chatzona"
    ],
    "related": [
      "zaragoza",
      "aragon"
    ],
    "aboutTitle": "La cuarta provincia más grande de todo el país",
    "intro": "Zaragoza, la cuarta provincia más grande de España: junto a Burgos, la que limita con más territorios.",
    "about": "Zaragoza es una de las cincuenta provincias de España, con capital en la ciudad homónima. Con una superficie de 17.274 kilómetros cuadrados, es la cuarta provincia más grande de todo el país. Dentro de Aragón, limita al norte con Navarra y Huesca, al este con Lérida y Tarragona, al sur con Teruel, al suroeste con Guadalajara y al oeste con Soria y La Rioja. Junto con Burgos, es la provincia española que limita con más territorios distintos: un total de ocho, repartidos entre cinco comunidades autónomas diferentes."
  },
  {
    "slug": "alava-provincia",
    "name": "Álava",
    "kind": "tematica",
    "icon": "🗺️",
    "users": 49,
    "votes": 90,
    "activity": "Media",
    "parentSlug": "euskadi",
    "parentName": "País Vasco",
    "channels": [
      "euskadi",
      "chatzona"
    ],
    "related": [
      "vitoria",
      "euskadi"
    ],
    "aboutTitle": "Territorio foral, la más extensa de las tres vascas",
    "intro": "Álava, territorio histórico y foral: la más extensa de las tres provincias vascas, con capital en Vitoria.",
    "about": "Álava es un territorio histórico español y una de las tres provincias que forman el País Vasco. Su capital y ciudad más poblada es Vitoria, que es también sede de las instituciones de toda la comunidad autónoma vasca. Tiene una superficie de 3.037 kilómetros cuadrados, la más extensa de las tres provincias vascas, y en 2025 contaba con 341.961 habitantes, ocupando el puesto 37 entre las provincias españolas y el último lugar entre las tres del País Vasco. Su diputación es una de las que tienen régimen foral, con mayores competencias e instituciones políticas propias que el resto de diputaciones españolas: Álava es un territorio aforado."
  },
  {
    "slug": "guipuzcoa-provincia",
    "name": "Guipúzcoa",
    "kind": "tematica",
    "icon": "🌊",
    "users": 48,
    "votes": 89,
    "activity": "Media",
    "parentSlug": "euskadi",
    "parentName": "País Vasco",
    "channels": [
      "guipuzcoa",
      "euskadi",
      "chatzona"
    ],
    "related": [
      "san-sebastian",
      "euskadi"
    ],
    "aboutTitle": "Frontera con Francia y con el golfo de Vizcaya",
    "intro": "Guipúzcoa, entre el Cantábrico y los Pirineos Atlánticos franceses: capital en San Sebastián.",
    "about": "Guipúzcoa es un territorio histórico español y una de las tres provincias que forman el País Vasco. Su capital y ciudad más poblada es San Sebastián. Se halla en el extremo este del mar Cantábrico y limita con el departamento francés de Pirineos Atlánticos al noreste, con Navarra al sur y al sureste, con Vizcaya al oeste, con Álava al suroeste y con el golfo de Vizcaya al norte. Esa combinación de frontera francesa, costa cantábrica y vecindad con las otras dos provincias vascas es lo que mejor sitúa a Guipúzcoa dentro del mapa del País Vasco."
  },
  {
    "slug": "vizcaya-provincia",
    "name": "Vizcaya",
    "kind": "tematica",
    "icon": "⛰️",
    "users": 47,
    "votes": 87,
    "activity": "Media",
    "parentSlug": "euskadi",
    "parentName": "País Vasco",
    "channels": [
      "vizcaya",
      "euskadi",
      "chatzona"
    ],
    "related": [
      "bilbao",
      "euskadi"
    ],
    "aboutTitle": "La provincia vasca más montañosa y poblada",
    "intro": "Vizcaya, la provincia más montañosa y poblada del País Vasco: capital en Bilbao.",
    "about": "Vizcaya es un territorio histórico español y una de las tres provincias que forman el País Vasco. Su capital y ciudad más poblada es Bilbao. Está situada en el norte de la Península Ibérica y limita al norte con el mar Cantábrico, al este con Guipúzcoa, al sur con Álava y con Burgos, y al oeste con Cantabria. Es una provincia montañosa, con una alta densidad de población y un clima oceánico marcado por precipitaciones abundantes y temperaturas suaves, un rasgo climático que comparte con buena parte de la cornisa cantábrica."
  },
  {
    "slug": "alicante-provincia",
    "name": "Alicante",
    "kind": "tematica",
    "icon": "🏖️",
    "users": 46,
    "votes": 86,
    "activity": "Media",
    "parentSlug": "comunidad-valenciana",
    "parentName": "Comunitat Valenciana",
    "channels": [
      "alicante",
      "valencia",
      "chatzona"
    ],
    "related": [
      "alicante",
      "comunidad-valenciana"
    ],
    "aboutTitle": "La cuarta provincia más poblada de España",
    "intro": "Alicante, la cuarta provincia más poblada de España: 2.030.037 habitantes y 26 municipios de más de 20.000.",
    "about": "Alicante es una provincia situada en el sureste de la Península Ibérica, en el Levante español, y es la provincia más meridional y menos extensa de la Comunidad Valenciana. Pese a su tamaño, es la cuarta provincia más poblada de todo el país, con 2.030.037 habitantes a 1 de enero de 2025, la quinta en densidad de población y la más densamente poblada de toda la Comunidad Valenciana. Su capital es la ciudad de Alicante, y cuenta con 26 municipios de más de 20.000 habitantes, lo que la convierte en una de las provincias con mayor grado de urbanización de España."
  },
  {
    "slug": "castellon-provincia",
    "name": "Castellón",
    "kind": "tematica",
    "icon": "🏖️",
    "users": 45,
    "votes": 84,
    "activity": "Media",
    "parentSlug": "comunidad-valenciana",
    "parentName": "Comunitat Valenciana",
    "channels": [
      "castellon",
      "valencia",
      "chatzona"
    ],
    "related": [
      "castellon",
      "comunidad-valenciana"
    ],
    "aboutTitle": "La provincia valenciana más al norte",
    "intro": "Castellón, en el norte de la Comunidad Valenciana: 640.598 habitantes en 135 municipios.",
    "about": "Castellón es una provincia del este de España, situada en la parte más septentrional de la Comunidad Valenciana, con capital en Castellón de la Plana. Tiene una población de 640.598 habitantes repartidos en un total de 135 municipios. Es, de las tres provincias que forman la Comunidad Valenciana, la que ocupa la posición más al norte, lo que la sitúa como frontera directa entre esta comunidad autónoma y Cataluña por el norte, y Aragón por el interior."
  },
  {
    "slug": "valencia-provincia",
    "name": "Valencia",
    "kind": "tematica",
    "icon": "🏖️",
    "users": 44,
    "votes": 82,
    "activity": "Media",
    "parentSlug": "comunidad-valenciana",
    "parentName": "Comunitat Valenciana",
    "channels": [
      "valencia",
      "chatzona"
    ],
    "related": [
      "valencia",
      "comunidad-valenciana"
    ],
    "aboutTitle": "La tercera provincia más poblada de España",
    "intro": "Valencia, la tercera provincia más poblada de España: 2.763.996 habitantes en 266 municipios.",
    "about": "Valencia es una provincia del este de España, situada en el centro de la Comunidad Valenciana, con capital en la ciudad que lleva su mismo nombre. Tiene una extensión de 10.763 kilómetros cuadrados y una población de 2.763.996 habitantes repartidos en 266 municipios, lo que la convierte en la tercera provincia más poblada de todo el país, solo por detrás de Madrid y Barcelona. Esa posición en el podio nacional de población es el dato que mejor resume el peso de Valencia dentro del mapa provincial español."
  }
];
