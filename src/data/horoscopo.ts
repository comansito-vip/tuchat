export type Element = "Fuego" | "Tierra" | "Aire" | "Agua";
export type Quality = "Cardinal" | "Fijo" | "Mutable";

export interface Sign {
  slug: string;
  name: string;
  symbol: string; // astrological glyph
  emoji: string; // decorative
  dates: string; // "21 mar – 19 abr"
  element: Element;
  planet: string;
  quality: Quality;
  traits: string[];
  compatible: string[]; // slugs of compatible signs
  intro: string; // hero subtitle (1-2 frases)
  personality: string; // párrafo de personalidad
  amor: string;
  trabajo: string;
  salud: string;
}

export const SIGNS: Sign[] = [
  {
    slug: "aries",
    name: "Aries",
    symbol: "♈",
    emoji: "🐏",
    dates: "21 mar – 19 abr",
    element: "Fuego",
    planet: "Marte",
    quality: "Cardinal",
    traits: ["Valiente", "Impulsivo", "Líder", "Competitivo", "Sincero"],
    compatible: ["leo", "sagitario", "geminis", "acuario"],
    intro:
      "Primero del zodiaco, Aries arranca cualquier proyecto con un empuje que pocos signos igualan.",
    personality:
      "Aries es puro arranque: donde otros dudan, el carnero ya ha echado a andar. Regido por Marte, vive con la energía a tope, dice lo que piensa sin filtros y se aburre con la rutina. Su impaciencia es legendaria, pero también su valentía para empezar de cero las veces que haga falta. Detrás de la coraza hay alguien leal y de risa fácil.",
    amor:
      "En el amor, Aries conquista con descaro y necesita una relación con chispa, sin medias tintas. Le va la pasión del primer momento, aunque le cuesta la paciencia del día a día. Funciona mejor con quien le sigue el ritmo y no teme plantarle cara.",
    trabajo:
      "Brilla liderando y abriendo camino, pero se desinfla con el papeleo y las esperas largas. Es el que lanza la idea y enciende al equipo. Su reto: terminar lo que empieza antes de saltar a lo siguiente.",
    salud:
      "Mucha energía que conviene canalizar con deporte intenso. Tiende a la tensión en cabeza y mandíbula cuando acumula prisa; le sienta bien parar y respirar antes de estallar.",
  },
  {
    slug: "tauro",
    name: "Tauro",
    symbol: "♉",
    emoji: "🐂",
    dates: "20 abr – 20 may",
    element: "Tierra",
    planet: "Venus",
    quality: "Fijo",
    traits: ["Constante", "Sensual", "Tozudo", "Leal", "Práctico"],
    compatible: ["virgo", "capricornio", "cancer", "piscis"],
    intro:
      "Signo de tierra regido por Venus, Tauro busca la estabilidad y disfruta de los placeres con calma.",
    personality:
      "Tauro va a su ritmo y no hay quien lo apure. Le gusta lo seguro, lo que se toca y se disfruta: buena comida, una casa cómoda, planes sin sobresaltos. Es de una lealtad de hierro y de una terquedad a juego; cuando decide algo, cambiarle la idea es tarea imposible. Bajo su aparente lentitud hay una determinación que rara vez se rinde.",
    amor:
      "Tauro ama despacio pero para quedarse. Detesta los juegos y los altibajos; quiere a alguien fiable con quien construir algo sólido. Es muy físico y detallista, aunque sus celos pueden asomar si siente que pisan su terreno.",
    trabajo:
      "Trabajador incansable y de fiar, prefiere la perseverancia al golpe de efecto. Maneja bien el dinero y las cosas a largo plazo. Le cuesta adaptarse a los cambios bruscos, pero lo que toca lo deja terminado.",
    salud:
      "Tiende a la comodidad y a darse caprichos en la mesa, así que le conviene moverse más de lo que le pide el cuerpo. Cuida especialmente garganta y cuello. La naturaleza le recarga las pilas.",
  },
  {
    slug: "geminis",
    name: "Géminis",
    symbol: "♊",
    emoji: "👯",
    dates: "21 may – 20 jun",
    element: "Aire",
    planet: "Mercurio",
    quality: "Mutable",
    traits: ["Curioso", "Comunicativo", "Versátil", "Inquieto", "Ingenioso"],
    compatible: ["libra", "acuario", "aries", "leo"],
    intro:
      "Signo de aire y de doble cara, Géminis necesita estímulo mental y conversación a todas horas.",
    personality:
      "Géminis tiene mil intereses y poca paciencia para el aburrimiento. Regido por Mercurio, habla, pregunta y conecta ideas a una velocidad que marea. Es sociable, ingenioso y se adapta a cualquier ambiente, aunque su famosa dualidad lo hace difícil de descifrar: hoy te abraza la idea y mañana la contraria. Vive de la curiosidad y de la palabra.",
    amor:
      "En pareja, Géminis se enamora primero del cerebro. Necesita charla, humor y libertad para no agobiarse. Le cuesta la rutina sentimental; con quien le sorprenda y le siga el juego mental, se queda enganchado.",
    trabajo:
      "Multitarea por naturaleza, destaca en todo lo que sea comunicar, vender, escribir o conectar gente. Se dispersa con facilidad y deja flecos. Rinde al máximo cuando puede cambiar de tarea sin que le aten a una sola cosa.",
    salud:
      "Su mente no para, y ahí está el riesgo: insomnio y nervios cuando se sobrecarga. Le va bien desconectar del móvil, respirar y cuidar las vías respiratorias y las manos.",
  },
  {
    slug: "cancer",
    name: "Cáncer",
    symbol: "♋",
    emoji: "🦀",
    dates: "21 jun – 22 jul",
    element: "Agua",
    planet: "Luna",
    quality: "Cardinal",
    traits: ["Sensible", "Protector", "Intuitivo", "Hogareño", "Tenaz"],
    compatible: ["escorpio", "piscis", "tauro", "virgo"],
    intro:
      "Regido por la Luna, Cáncer siente todo a flor de piel y protege a los suyos como nadie.",
    personality:
      "Cáncer lleva el corazón por delante y una coraza por fuera para protegerlo. La familia y el hogar son su centro de gravedad; cuida, recuerda fechas, cocina para los demás y guarda cada detalle. Su intuición es asombrosa: capta el ambiente de una sala al entrar. Cuando se siente herido, se mete en su caparazón hasta que se le pasa.",
    amor:
      "Profundamente romántico y entregado, Cáncer busca seguridad emocional y a alguien con quien hacer nido. Da mucho y necesita sentirse correspondido. Su lado tierno es enorme; su lado susceptible, también.",
    trabajo:
      "Trabaja mejor en ambientes de confianza, cuidando de un equipo o de un proyecto como si fuera suyo. Tiene buena memoria e instinto para lo que la gente necesita. Le afecta la tensión y los jefes fríos.",
    salud:
      "Sus emociones se le van directas al estómago. Le conviene gestionar el estrés y no cargar con los problemas de todo el mundo. El agua, en cualquier forma, lo calma.",
  },
  {
    slug: "leo",
    name: "Leo",
    symbol: "♌",
    emoji: "🦁",
    dates: "23 jul – 22 ago",
    element: "Fuego",
    planet: "Sol",
    quality: "Fijo",
    traits: ["Generoso", "Orgulloso", "Carismático", "Leal", "Teatral"],
    compatible: ["aries", "sagitario", "geminis", "libra"],
    intro:
      "Regido por el Sol, Leo nació para brillar y contagiar su calor a quien tiene alrededor.",
    personality:
      "Leo entra en una habitación y se nota. Tiene magnetismo, generosidad de sobra y un orgullo que hay que saber llevar. Le encanta el reconocimiento, pero lo devuelve con creces: protege a los suyos, anima al grupo y se juega por sus amigos. Detrás del rugido hay un corazón leal que necesita sentirse querido y admirado.",
    amor:
      "En el amor, Leo es puro romance y gestos grandes. Quiere admiración y fidelidad, y da lealtad a cambio. Su ego puede pasar factura, pero pocos signos aman con tanta entrega y calor como el león.",
    trabajo:
      "Líder natural, brilla en puestos visibles y creativos donde pueda dejar su sello. Motiva e inspira, aunque le cuesta delegar y aceptar críticas. Rinde cuando siente que su trabajo importa y se valora.",
    salud:
      "Energía y vitalidad altas, con tendencia a forzar la máquina. Cuida el corazón y la espalda. Le va bien el ejercicio que también sea diversión y un poco de escenario.",
  },
  {
    slug: "virgo",
    name: "Virgo",
    symbol: "♍",
    emoji: "🌾",
    dates: "23 ago – 22 sep",
    element: "Tierra",
    planet: "Mercurio",
    quality: "Mutable",
    traits: ["Analítico", "Meticuloso", "Servicial", "Exigente", "Discreto"],
    compatible: ["tauro", "capricornio", "cancer", "escorpio"],
    intro:
      "Signo de tierra regido por Mercurio, Virgo lo observa todo y mejora lo que toca.",
    personality:
      "Virgo tiene ojo para el detalle que se le escapa a todos. Es práctico, ordenado y útil; ayuda sin que se lo pidan y disfruta cuando las cosas funcionan bien. Su perfeccionismo es un arma de doble filo: exige mucho a los demás, pero todavía más a sí mismo. Aparenta frialdad, aunque cuida con hechos más que con palabras.",
    amor:
      "Reservado al principio, Virgo demuestra el amor en lo concreto: resolviendo, acordándose, estando. Busca alguien sensato y limpio de dramas. Le cuesta soltarse, pero quien gana su confianza gana a un compañero fiel.",
    trabajo:
      "Es la pieza que hace que el engranaje no falle: organizado, analítico y exigente con la calidad. Detecta errores que nadie ve. Su reto es no perderse en los detalles ni quemarse por querer controlarlo todo.",
    salud:
      "Muy consciente de su cuerpo, a veces en exceso. Tiende a la preocupación y a los problemas digestivos cuando se agobia. Le sienta de maravilla una rutina sana y dejar de darle vueltas a todo.",
  },
  {
    slug: "libra",
    name: "Libra",
    symbol: "♎",
    emoji: "⚖️",
    dates: "23 sep – 22 oct",
    element: "Aire",
    planet: "Venus",
    quality: "Cardinal",
    traits: ["Diplomático", "Sociable", "Estético", "Indeciso", "Justo"],
    compatible: ["geminis", "acuario", "leo", "sagitario"],
    intro:
      "Regido por Venus, Libra busca el equilibrio, la belleza y la armonía en todo lo que le rodea.",
    personality:
      "Libra no soporta el conflicto y hará lo posible por mantener la paz. Encantador y sociable, tiene un don para mediar y ver todos los puntos de vista, lo que también lo vuelve famosamente indeciso. Le atrae la belleza, el buen gusto y las relaciones; rara vez está solo del todo. Justo y considerado, busca siempre el punto medio.",
    amor:
      "Libra está hecho para la pareja: disfruta compartiendo y detesta la soledad. Es romántico, detallista y conciliador. Su indecisión y sus ganas de agradar pueden enredarlo; brilla con quien le dé seguridad sin asfixiarlo.",
    trabajo:
      "Excelente para negociar, trabajar en equipo y todo lo que tenga que ver con diseño, derecho o trato con gente. Le cuesta decidir solo y bajo presión. Rinde en ambientes amables y bien repartidos.",
    salud:
      "El estrés y los conflictos le pasan factura directa. Cuida riñones y zona lumbar. Le equilibra la vida social sana, el arte y un descanso de verdad cuando lo necesita.",
  },
  {
    slug: "escorpio",
    name: "Escorpio",
    symbol: "♏",
    emoji: "🦂",
    dates: "23 oct – 21 nov",
    element: "Agua",
    planet: "Plutón",
    quality: "Fijo",
    traits: ["Intenso", "Magnético", "Reservado", "Apasionado", "Estratega"],
    compatible: ["cancer", "piscis", "virgo", "capricornio"],
    intro:
      "Profundo e intenso, Escorpio vive las cosas hasta el fondo y nunca se queda en la superficie.",
    personality:
      "Escorpio es todo intensidad y misterio. Siente con una profundidad que asusta y guarda sus cartas hasta saber con quién juega. Es leal hasta el final con los suyos e implacable cuando lo traicionan. Tiene una capacidad enorme para reinventarse: cae y renace de sus cenizas las veces que haga falta. Pocos signos tienen su fuerza de voluntad.",
    amor:
      "En el amor lo da todo o nada. Busca conexión total, pasión y verdad, y no perdona las medias tintas. Sus celos y su intensidad pueden agobiar, pero su entrega es absoluta con quien se gana su confianza.",
    trabajo:
      "Estratega nato, paciente y obsesivo con sus objetivos. Brilla en todo lo que requiera investigar, ir al fondo o manejar situaciones de crisis. Su reto: soltar el control y confiar en el equipo.",
    salud:
      "Carga mucha tensión interna que conviene drenar con ejercicio fuerte. Cuida la zona pélvica y aprende a soltar rencores: lo que reprime, le pesa. La transformación es su medicina.",
  },
  {
    slug: "sagitario",
    name: "Sagitario",
    symbol: "♐",
    emoji: "🏹",
    dates: "22 nov – 21 dic",
    element: "Fuego",
    planet: "Júpiter",
    quality: "Mutable",
    traits: ["Aventurero", "Optimista", "Filosófico", "Franco", "Libre"],
    compatible: ["aries", "leo", "libra", "acuario"],
    intro:
      "Regido por Júpiter, Sagitario mira siempre al horizonte buscando la próxima aventura.",
    personality:
      "Sagitario necesita espacio, viajes e ideas grandes. Optimista incurable, encuentra el lado bueno hasta en el desastre y contagia sus ganas de vivir. Es sincero a veces hasta la imprudencia: dice lo que piensa sin medir el golpe. Ama la libertad por encima de casi todo y huye de quien intente atarlo. Filósofo de bar y explorador de vocación.",
    amor:
      "En pareja quiere a un cómplice de aventuras, no a un carcelero. Es divertido, generoso y honesto, pero le cuesta el compromiso que huela a jaula. Funciona con quien comparta su sed de mundo y le dé aire.",
    trabajo:
      "Brilla en todo lo que implique viajar, enseñar, explorar o vender una visión. Se aburre con la rutina y el control estricto. Aporta entusiasmo y perspectiva; su reto es la constancia en el día a día.",
    salud:
      "Vitalidad alta y tendencia a los excesos por puro optimismo. Cuida caderas, muslos e hígado. El movimiento al aire libre y los planes nuevos son su mejor terapia.",
  },
  {
    slug: "capricornio",
    name: "Capricornio",
    symbol: "♑",
    emoji: "🐐",
    dates: "22 dic – 19 ene",
    element: "Tierra",
    planet: "Saturno",
    quality: "Cardinal",
    traits: ["Ambicioso", "Disciplinado", "Responsable", "Paciente", "Reservado"],
    compatible: ["tauro", "virgo", "escorpio", "piscis"],
    intro:
      "Regido por Saturno, Capricornio sube la montaña paso a paso hasta llegar siempre a la cima.",
    personality:
      "Capricornio juega a largo plazo. Disciplinado y paciente, se fija una meta y trabaja por ella sin atajos ni dramas. Tiene los pies en el suelo, un sentido de la responsabilidad enorme y un humor seco que sorprende. Le cuesta mostrar lo que siente; prefiere demostrar con hechos. Madura pronto y, curiosamente, se relaja y disfruta más con los años.",
    amor:
      "Cauto y serio al principio, busca una relación estable y de verdad, no una aventura. Es fiel, comprometido y protector con quien quiere. Necesita tiempo para abrirse, pero cuando lo hace, va para quedarse.",
    trabajo:
      "Aquí es donde más brilla: ambicioso, organizado y constante, escala posiciones con paciencia de roca. Asume responsabilidad sin quejarse. Su reto es no convertir el trabajo en su única vida.",
    salud:
      "Tiende a cargar tensión en huesos, articulaciones y rodillas, y a aguantar más de la cuenta. Le conviene soltar el control, descansar de verdad y no medirlo todo por la productividad.",
  },
  {
    slug: "acuario",
    name: "Acuario",
    symbol: "♒",
    emoji: "🏺",
    dates: "20 ene – 18 feb",
    element: "Aire",
    planet: "Urano",
    quality: "Fijo",
    traits: ["Original", "Independiente", "Idealista", "Rebelde", "Humanitario"],
    compatible: ["geminis", "libra", "aries", "sagitario"],
    intro:
      "Regido por Urano, Acuario piensa distinto y se adelanta a su tiempo en casi todo.",
    personality:
      "Acuario va por libre y no le importa. Original, independiente y un punto rebelde, defiende sus ideas aunque vayan a contracorriente. Le mueven las causas, el futuro y la justicia más que lo personal: ama a la humanidad en abstracto y a veces se le olvida lo cercano. Es amistoso pero distante, brillante y, sobre todo, imprevisible.",
    amor:
      "Necesita libertad y un vínculo que sea también amistad. Le atrae lo diferente y huye de la posesividad. Es leal a su manera, aunque le cuesta el terreno emocional profundo; brilla con quien respete su independencia.",
    trabajo:
      "Innovador y visionario, aporta ideas que nadie había pensado. Brilla en tecnología, ciencia y proyectos colectivos. Detesta las jerarquías rígidas y la rutina. Trabaja mejor con autonomía y un buen porqué.",
    salud:
      "Su mente eléctrica necesita desconexión real para no quemarse. Cuida tobillos y circulación. Le sienta bien el movimiento, las causas que le ilusionan y rodearse de gente afín.",
  },
  {
    slug: "piscis",
    name: "Piscis",
    symbol: "♓",
    emoji: "🐟",
    dates: "19 feb – 20 mar",
    element: "Agua",
    planet: "Neptuno",
    quality: "Mutable",
    traits: ["Soñador", "Empático", "Sensible", "Creativo", "Compasivo"],
    compatible: ["cancer", "escorpio", "tauro", "capricornio"],
    intro:
      "Último signo del zodiaco, Piscis siente por todos y vive con un pie en la realidad y otro en el sueño.",
    personality:
      "Piscis es pura sensibilidad. Empático hasta absorber las emociones ajenas, intuitivo y creativo, vive entre la realidad y su mundo interior. Tiene un corazón enorme y una imaginación sin fronteras, aunque a veces escapa de los problemas en lugar de afrontarlos. Es el signo de la compasión: perdona, comprende y se entrega como nadie.",
    amor:
      "Romántico de los de película, Piscis ama sin reservas y se ilusiona fácil. Busca alma gemela y conexión espiritual. Su ternura es infinita, pero le conviene poner límites para no perderse en el otro.",
    trabajo:
      "Brilla en lo artístico, lo creativo y lo que ayuda a la gente. Su intuición e imaginación son su gran activo. Le cuestan las estructuras rígidas y los plazos; rinde con flexibilidad y un propósito que le emocione.",
    salud:
      "Muy permeable al ambiente y al estrés ajeno. Cuida los pies y el descanso, y aprende a desconectar de lo que no le corresponde. El arte, el agua y la meditación lo recargan.",
  },
];

export function getSigns(): Sign[] {
  return SIGNS;
}

export function getSign(slug: string): Sign | undefined {
  return SIGNS.find((s) => s.slug === slug.toLowerCase());
}
