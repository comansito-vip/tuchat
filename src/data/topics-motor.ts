import type { Place } from "./types";

// Vertical Motor: coches, motos, eléctricos y mecánica. Hub propio (no colgaba
// de ningún otro tema) con contenido único por sala.
export const TOPICS_MOTOR: Place[] = [
  {
    slug: "motor", name: "Motor", kind: "tematica", icon: "🏎️",
    users: 300, votes: 540, tag: "Popular", activity: "Alta",
    channels: ["ocio", "motor"],
    related: ["coches", "motos", "vehiculos-electricos", "tesla", "mecanica"],
    intro: "Del ruido de un bicilíndrico al par instantáneo de un eléctrico: chat de motor con gente que sabe de coches, motos, averías y carreras.",
    about: "Aquí cabe quien se pelea con el embrague de un Ibiza de 2004 y también quien acaba de reservar un eléctrico y no tiene claro si podrá poner el cargador en su plaza. El chat de motor hace de punto de encuentro del vertical: dudas de compra —si el diésel aguanta unos años más, si el híbrido enchufable compensa sin enchufe en casa—, ruidos que solo aparecen en frío, presupuestos de taller que asustan, la ITV que llega cuando menos apetece y las quinielas del domingo si hay carrera. Los moteros defienden sus neumáticos y su equipación, los de cuatro ruedas comparan consumo real contra el homologado, y nunca falta alguien contando cómo le fue el viaje de novecientos kilómetros. Eliges nick, entras y sueltas tu pregunta o tu foto. Desde aquí se salta a coches, motos, mecánica, vehículos eléctricos y Tesla según lo que te traiga.",
  },
  {
    slug: "coches", name: "Coches", kind: "tematica", icon: "🚗",
    users: 240, votes: 430, tag: "Popular", activity: "Alta",
    parentSlug: "motor", parentName: "Motor",
    channels: ["ocio", "motor"],
    related: ["motor", "motos", "mecanica", "vehiculos-electricos", "formula-1"],
    intro: "Chat de coches: consumos reales, compras de segunda mano y ese ruido que solo suena en frío. Gente que entiende y no vende humo.",
    about: "Comprar coche se ha vuelto un examen con trampa: la etiqueta ambiental, si el diésel seguirá entrando en tu ciudad dentro de cinco años, si el híbrido enchufable compensa cuando cargas una vez al mes, cuánto pide el concesionario por un usado con noventa mil kilómetros y garantía de doce meses. En el chat de coches se contrastan consumos medidos frente a los del catálogo, se piden informes antes de firmar un segunda mano, se opina del Golf de turno y del SUV que ya tiene medio portal, y salen las historias de siempre: la correa de distribución que tocaba a los ciento veinte mil, el aire acondicionado que murió en pleno julio, la revisión oficial que cuesta el triple que la del taller de la esquina. También hay parte bonita: rutas largas, coches que uno vendió y todavía echa de menos, clásicos que se restauran fin de semana a fin de semana. ¿Tu próximo coche lo tienes ya elegido o sigues dando vueltas?",
  },
  {
    slug: "motos", name: "Motos", kind: "tematica", icon: "🏍️",
    users: 210, votes: 385, activity: "Alta",
    parentSlug: "motor", parentName: "Motor",
    channels: ["ocio", "motor"],
    related: ["motor", "coches", "mecanica", "viajes", "deportes"],
    intro: "El sonido de un bicilíndrico, la primera caída tonta y trescientos kilómetros de curvas: chat de motos para quienes ruedan de verdad.",
    about: "Cualquier motero recuerda su primera salida larga: el casco apretando, el bicilíndrico retumbando en el valle y la sensación de que trescientos kilómetros se han hecho cortos. Ruedan por aquí naked de ciudad, trail que sueñan con cruzar Marruecos, alguna custom de cromo impecable y gente que sacó el A2 hace dos meses y todavía cala en los semáforos. Se comparan neumáticos y cuánto duran de verdad, se discute equipación —el airbag ya no es cosa exclusiva de circuito—, se recomiendan carreteras de curvas y se avisa de la gravilla en ese kilómetro que todos conocemos. Y también se habla de lo menos épico: la caída tonta en el parking, el seguro que sube sin explicación, la cadena que pide tensión y grasa más a menudo de lo que uno querría. Si acabas de estrenar carnet, pregunta sin complejos: aquí todos hemos hecho el ridículo alguna vez con medio barrio mirando.",
  },
  {
    slug: "vehiculos-electricos", name: "Vehículos eléctricos", kind: "tematica", icon: "🔋",
    users: 170, votes: 310, tag: "Tendencia", activity: "Media",
    parentSlug: "motor", parentName: "Motor",
    channels: ["ocio", "motor"],
    related: ["motor", "tesla", "coches", "tecnologia", "ecologia"],
    intro: "¿Autonomía real o folleto? Chat de vehículos eléctricos: cargadores, consumo en invierno, precios y si de verdad compensa dar el salto.",
    about: "La ansiedad de autonomía se cura de dos maneras: con un cargador en casa o hablando con alguien que lleve dos años haciendo tu misma ruta. Se contrastan aquí consumos de verdad, los kWh cada cien kilómetros que marca el coche en enero con la calefacción puesta y a ciento veinte, no los del folleto. Se compara la red de carga rápida en España, se cuentan las horas perdidas en un área con dos postes y uno averiado, y se discute lo que importa: si el híbrido enchufable es un puente razonable o un apaño que pesa mucho y carga poco, cuánto se degrada una batería a los ciento cincuenta mil kilómetros, qué pasa después con el valor de reventa y si las ayudas del plan Moves compensan el papeleo y la espera. Hay entusiastas y hay escépticos con argumentos, y ninguno de los dos manda. Entras sin registro, planteas tu caso concreto y te responde alguien que ya pasó por ahí.",
  },
  {
    slug: "tesla", name: "Tesla", kind: "tematica", icon: "⚡",
    users: 135, votes: 250, activity: "Media",
    parentSlug: "motor", parentName: "Motor",
    channels: ["ocio", "motor", "tecnologia"],
    related: ["motor", "vehiculos-electricos", "coches", "tecnologia", "gadgets"],
    intro: "Chat de Tesla sin bandos cerrados: Model 3 y Model Y, Autopilot, Supercargadores, fallos de ajuste y postventa. Dueños, curiosos y escépticos.",
    about: "Pocas marcas dividen tanto. Un Model 3 acelera como un deportivo, se actualiza de madrugada igual que un móvil y al mes siguiente aparece un chirrido en el salpicadero que nadie sabe de dónde sale. Ese contraste alimenta la conversación: los Supercargadores y el planificador de ruta, que funcionan tan bien como se dice, frente a un servicio postventa con citas eternas y piezas que tardan; el Autopilot y el FSD, lo que promete Musk, lo que hace de verdad en una rotonda española y lo que cobra por ello; la batería LFP y su manía de cargar al cien por cien; el modo centinela vaciando el coche en el aparcamiento del trabajo. Pasan por aquí propietarios que no lo cambiarían por nada, gente que duda entre un Model Y y un ID.4 y escépticos que traen datos en vez de insultos. Se puede criticar la marca sin que te echen y defenderla sin que te llamen fanboy.",
  },
  {
    slug: "mecanica", name: "Mecánica", kind: "tematica", icon: "🔧",
    users: 160, votes: 290, tag: "Nueva", activity: "Media",
    parentSlug: "motor", parentName: "Motor",
    channels: ["ocio", "motor"],
    related: ["motor", "coches", "motos", "vehiculos-electricos", "hobbies"],
    intro: "Chat de mecánica: ruidos raros, códigos de avería, presupuestos del taller y trucos para no dejarte el sueldo. Describe el síntoma y te leemos.",
    about: "Un chasquido metálico al girar en frío puede ser una rótula, un buje o una pastilla mal asentada, y averiguarlo antes de pisar el taller vale dinero. Por eso esto funciona: alguien describe el síntoma, otro pregunta a qué velocidad aparece y si se nota en el volante, y un tercero aporta lo que le pasó con el mismo 1.6 HDi hace dos inviernos. Se leen códigos sacados con un OBD2 de veinte euros, se discute cada cuánto toca de verdad la correa de distribución —lo que dice el fabricante y lo que dicta la experiencia—, si el aceite 5W30 de marca blanca sirve, y se comparan presupuestos: lo que cobra el oficial por unas bujías contra lo que pide el taller de barrio de toda la vida. Entran mecánicos de profesión con mucha paciencia y aficionados con el gato puesto y las manos negras. Nadie vende milagros: hay averías que hay que llevar al taller, y eso también se dice claro.",
  },
];
