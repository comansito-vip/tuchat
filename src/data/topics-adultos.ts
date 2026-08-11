import type { Place } from "./types";

// Sub-salas reales de adultos, antes aplastadas como simples canales dentro
// del array `channels` de "erotico" (topics.ts) — invisibles para SEO y sin
// página propia pese a tener tráfico IRC real y searches directas ("chat
// sumisas", "chat bdsm"...). Se desagregan en sus propias salas con SEO
// propio, igual que se hizo antes con trivia/radio. Los canales con guion
// bajo (mazmorra_hispano, sexo_casadas) van SEPARADOS de su par sin guion
// por pedido explícito del cliente: son canales reales distintos.
//
// `channels`: cada sala une SOLO su propio canal real + los realmente
// emparentados (bdsm/sumisas/mazmorra sí forman un clúster real; sexo con
// cibersexo/canalsexo/relatos-eroticos también) — confirmado contra el
// listado de canales IRC en vivo de chatzonacom (proyecto hermano con
// acceso al servidor real). Antes TODAS entraban también a "erotico" sin
// que esa relación existiera en la red real, mezclando de golpe el tráfico
// de sumisas/travestis/nudismo/cornudos... en un canal que ni siquiera es
// el más poblado del grupo (sexo, por ejemplo, tiene el triple de usuarios
// reales que erotico). Quitado en 2026-07-13.
export const TOPICS_ADULTOS: Place[] = [
  {
    slug: "sexo", name: "Sexo", kind: "tematica", icon: "💦",
    users: 165, votes: 268, tag: "Popular", activity: "Alta",
    parentSlug: "erotico", parentName: "Erótico",
    channels: ["sexo", "cibersexo", "canalsexo", "relatos-eroticos", "chatzona"],
    related: ["erotico", "hot", "cibersexo", "adultos", "ligar"],
    intro: "Charla directa de sexo entre adultos: sin rodeos, sin fotos de perfil que fingir, solo conversación caliente y consentida. Solo +18.",
    about: "La sala se llama por lo que es: aquí se habla de sexo sin disfrazarlo de otra cosa. Fantasías que cuesta soltar en otro sitio, preguntas sin vergüenza, gente que busca charla caliente esta noche y gente que solo quiere curiosear un rato. Nadie pide foto de perfil ni justifica lo que busca. La única norma real es el consentimiento: se coquetea, se negocia, se para cuando alguien lo pide. El resto va sobre la marcha, con quien conecte y como conecte.",
  },
  {
    slug: "porno", name: "Porno", kind: "tematica", icon: "🎬",
    users: 142, votes: 231, activity: "Alta",
    parentSlug: "erotico", parentName: "Erótico",
    channels: ["porno", "chatzona"],
    related: ["erotico", "sexo", "hot", "cibersexo", "adultos"],
    intro: "Sala para comentar, recomendar y hablar de porno sin tapujos entre mayores de edad. Gustos, escenas, productoras: aquí cabe todo.",
    about: "Hablar de porno aquí es tan normal como hablar de cualquier otra afición, sin la vergüenza que impone en otros lados. Se recomiendan escenas, se debate qué productoras cuidan mejor la producción, se comparan gustos que van de lo clásico a lo más de nicho, y hay quien simplemente entra a comentar lo que acaba de ver. Ambiente relajado entre gente que no necesita justificar lo que le gusta. Solo mayores de edad, y el resto fluye entre quien coincide en horario y en tema.",
  },
  {
    slug: "canalsexo", name: "CanalSexo", kind: "tematica", icon: "📺",
    users: 98, votes: 156, activity: "Media",
    parentSlug: "erotico", parentName: "Erótico",
    channels: ["canalsexo", "chatzona"],
    related: ["erotico", "sexo", "hot", "adultos", "ligar"],
    intro: "Uno de los canales de sexo más veteranos del IRC hispano, ahora con sala propia: charla directa entre adultos a cualquier hora.",
    about: "CanalSexo lleva años siendo uno de los nombres fijos del IRC en español para quien busca charla adulta directa, y esta sala recoge esa comunidad de siempre. Se entra sin presentaciones largas: un nick, una intención clara y a ver quién anda por ahí en ese momento. Conviven veteranos que llevan el canal en la memoria desde hace mucho y gente nueva que llegó buscando exactamente esto. Nada de vueltas: se dice lo que se busca y se respeta lo que responde el resto.",
  },
  {
    slug: "relatos-eroticos", name: "Relatos Eróticos", kind: "tematica", icon: "✍️",
    users: 118, votes: 195, tag: "Tendencia", activity: "Alta",
    parentSlug: "erotico", parentName: "Erótico",
    channels: ["relatos-eroticos", "chatzona"],
    related: ["erotico", "sexo", "hot", "adultos", "amor"],
    intro: "Sala de relatos eróticos: se escribe en vivo, se completa entre varios, se lee lo que otros van dejando. Ficción adulta compartida.",
    about: "Aquí la conversación se convierte en texto: relatos que arrancan con una idea y se van construyendo entre quien está conectado, frases que uno deja y otro continúa, historias completas que alguien trae ya escritas para compartir. Hay quien entra solo a leer, sin escribir una línea, y quien vive para el reto de meter la escena perfecta en el momento justo. La calidad varía —esto no es un taller literario— pero la imaginación colectiva es lo que sostiene la sala noche tras noche.",
  },
  {
    slug: "sumisas", name: "Sumisas", kind: "tematica", icon: "⛓️",
    users: 87, votes: 149, activity: "Media",
    parentSlug: "erotico", parentName: "Erótico",
    channels: ["sumisas", "bdsm", "chatzona"],
    related: ["bdsm", "mazmorra", "erotico", "adultos", "sexo"],
    intro: "Chat de sumisión consentida entre adultos: roles, límites claros y charla sin juzgar lo que cada uno busca dentro del BDSM.",
    about: "Sala pensada para quien vive o quiere explorar el rol sumiso dentro del BDSM, siempre desde el consentimiento como base y no como detalle menor. Se habla de límites antes de jugar, de la diferencia entre fantasía y lo que uno realmente quiere probar, de la parte emocional que casi nunca se explica fuera de estos círculos. Entran sumisas con experiencia que orientan a quien recién empieza, y dominantes que respetan las reglas del juego tanto como quien las pone. Nada aquí se da por sentado sin hablarlo antes.",
  },
  {
    slug: "bdsm", name: "BDSM", kind: "tematica", icon: "🖤",
    users: 134, votes: 219, tag: "Tendencia", activity: "Alta",
    parentSlug: "erotico", parentName: "Erótico",
    channels: ["bdsm", "sumisas", "mazmorra", "chatzona"],
    related: ["sumisas", "mazmorra", "mazmorra_hispano", "erotico", "adultos"],
    intro: "Comunidad BDSM en español: dominación, sumisión, límites y negociación, siempre bajo consentimiento. Sin juicios, con reglas claras.",
    about: "El BDSM tiene su propio vocabulario y sus propias reglas, y esta sala existe para hablarlo con quien ya lo conoce sin tener que explicarlo desde cero. Dominación, sumisión, rol, disciplina consentida: cada quien trae su experiencia y sus límites, y la negociación previa no es opcional, es la base de todo lo demás. Hay veteranos de la escena que llevan años en esto y curiosos que solo quieren entender de qué va antes de decidir si les interesa. El respeto por el «no» de cualquiera se cumple siempre, sin excepciones.",
  },
  {
    slug: "trio", name: "Trío", kind: "tematica", icon: "3️⃣",
    users: 76, votes: 128, activity: "Media",
    parentSlug: "erotico", parentName: "Erótico",
    channels: ["trio", "chatzona"],
    related: ["erotico", "sexo", "parejas-liberales", "adultos", "ligar"],
    intro: "Sala para quien busca, ha vivido o le intriga un trío: parejas que buscan un tercero, curiosos y charla sin tabúes al respecto.",
    about: "El trío genera más curiosidad de la que la gente admite en voz alta, y esta sala es donde esa curiosidad se puede hablar sin rodeos. Entran parejas que buscan sumar a alguien, personas solas abiertas a unirse a una pareja, y quien simplemente quiere preguntar cómo funciona esto de verdad antes de decidir si le interesa. Se habla de cómo se negocian los límites entre tres, de las inseguridades que aparecen y de experiencias reales contadas sin exagerar. Comunicación antes que nada: es lo que separa un buen trío de un desastre.",
  },
  {
    slug: "travestis", name: "Travestis", kind: "tematica", icon: "💃",
    users: 103, votes: 172, activity: "Alta",
    parentSlug: "erotico", parentName: "Erótico",
    channels: ["travestis", "chatzona"],
    related: ["erotico", "lgtbi", "gay", "adultos", "sexo"],
    intro: "Chat travesti: encuentros, charla y comunidad para travestis y quienes las buscan. Ambiente directo, sin prejuicios ni etiquetas rígidas.",
    about: "Sala dedicada a la comunidad travesti y a quienes buscan conocerlas, hablar o quedar. Se cruzan travestis que llevan tiempo activas en el ambiente con quienes recién empiezan a explorar esa identidad, y admiradores que buscan charla directa sin la incomodidad que encuentran en salas generales. Se comenta de todo: desde experiencias personales hasta consejos de quien lleva más recorrido. El trato es de igual a igual, sin fetichizar por defecto ni juzgar lo que cada quien busca.",
  },
  {
    slug: "cibersexo", name: "Cibersexo", kind: "tematica", icon: "💻",
    users: 156, votes: 251, tag: "Popular", activity: "Alta",
    parentSlug: "erotico", parentName: "Erótico",
    channels: ["cibersexo", "chatzona"],
    related: ["erotico", "sexo", "hot", "adultos", "ligar"],
    intro: "Cibersexo en texto, sin cámara si no quieres: charla caliente en tiempo real entre adultos que saben lo que buscan esta noche.",
    about: "El cibersexo de toda la vida del IRC sigue vivo aquí: charla erótica escrita en tiempo real, sin necesidad de cámara ni de dar la cara si no apetece. Se negocia el escenario, se construye la escena entre los dos —o los que se sumen— y cada quien marca hasta dónde llega. Hay noches tranquilas y noches donde la sala no para, según quién esté conectado. El anonimato del texto es parte del atractivo: puedes ser exactamente quien quieras ser durante un rato.",
  },
  {
    slug: "cuarto-oscuro", name: "Cuarto Oscuro", kind: "tematica", icon: "🕶️",
    users: 71, votes: 118, activity: "Media",
    parentSlug: "erotico", parentName: "Erótico",
    channels: ["sexo", "chatzona", "cuarto-oscuro"],
    related: ["erotico", "gay", "sexo", "adultos", "bdsm"],
    intro: "Sala inspirada en el cuarto oscuro de los locales de ambiente: anonimato, roleo sin cámara y encuentros directos entre adultos.",
    about: "El cuarto oscuro de los locales de ambiente tiene su versión en texto: una sala donde el anonimato es la norma y nadie necesita presentarse con nombre ni foto. Se roleplea el encuentro casual, directo, sin preámbulos largos, tal y como funciona el espacio físico que le da nombre. Quien entra ya sabe a qué viene, así que la conversación va rápido al grano. Los límites se marcan igual que en cualquier otra sala: lo que no se negocia antes, no pasa.",
  },
  {
    slug: "hot", name: "Hot", kind: "tematica", icon: "🌡️",
    users: 189, votes: 302, tag: "Popular", activity: "Alta",
    parentSlug: "erotico", parentName: "Erótico",
    channels: ["sexo", "chatzona", "hot"],
    related: ["erotico", "sexo", "cibersexo", "adultos", "ligar"],
    intro: "La sala genérica para subir la temperatura: coqueteo directo, insinuaciones y charla picante sin necesidad de etiquetarte en nada.",
    about: "No hace falta encajar en ninguna categoría concreta para entrar aquí: Hot es la sala comodín para quien quiere coquetear, insinuarse o simplemente subir un poco el tono de la charla sin más pretensiones. Sirve de puerta de entrada para quien luego prefiere moverse a una sala más específica —sexo, cibersexo, BDSM— y también para quien solo busca esa chispa de esta noche sin más planes. El ambiente es directo pero sin agresividad: se coquetea, se tantea, y cada uno decide hasta dónde sigue.",
  },
  {
    slug: "intimos", name: "Íntimos", kind: "tematica", icon: "🔑",
    users: 64, votes: 108, activity: "Media",
    parentSlug: "erotico", parentName: "Erótico",
    channels: ["sexo", "chatzona", "intimos"],
    related: ["erotico", "sexo", "hot", "adultos", "amor"],
    intro: "Charla íntima entre adultos con más calma que en las salas más ruidosas: confesiones, deseos y conversación privada de verdad.",
    about: "No todo es urgencia: esta sala está para quien busca algo más pausado que el ritmo de otras salas de adultos. Se comparten confesiones que cuesta soltar en cualquier otro sitio, deseos que uno guarda para muy pocos, y conversaciones privadas que se estiran porque hay conexión real, no solo calentura de un momento. Menos gente conectada de media que en las salas grandes, pero eso mismo permite charlas más largas y menos interrumpidas. Va bien para quien quiere calidad antes que cantidad.",
  },
  {
    slug: "mazmorra", name: "Mazmorra", kind: "tematica", icon: "🏰",
    users: 68, votes: 114, activity: "Media",
    parentSlug: "erotico", parentName: "Erótico",
    channels: ["mazmorra", "bdsm", "sumisas", "chatzona"],
    related: ["bdsm", "sumisas", "mazmorra_hispano", "erotico", "adultos"],
    intro: "Roleo de mazmorra dentro del BDSM: escenarios de dominación más elaborados, siempre negociados antes de entrar en juego.",
    about: "Para quien quiere llevar el rol de dominación y sumisión un paso más allá del chat directo, esta sala propone escenarios de mazmorra: ambientación más elaborada, roles definidos con calma y una escena que se construye entre varios turnos de mensajes en vez de resolverse en dos líneas. Como en cualquier práctica BDSM seria, todo se negocia antes: qué se juega, qué queda fuera y cómo se para si hace falta. Hay quien lleva años puliendo su personaje y quien solo quiere probar cómo se siente por primera vez.",
  },
  {
    slug: "mazmorra_hispano", name: "Mazmorra Hispano", kind: "tematica", icon: "🗝️",
    users: 55, votes: 92, activity: "Media",
    parentSlug: "erotico", parentName: "Erótico",
    channels: ["mazmorra", "bdsm", "chatzona", "mazmorra_hispano"],
    related: ["mazmorra", "bdsm", "sumisas", "erotico", "adultos"],
    intro: "Rama hispana de Mazmorra, con su propia comunidad y estilo de roleo. Canal real distinto del genérico, con gente fija de siempre.",
    about: "Mazmorra Hispano nació como canal propio dentro del ecosistema BDSM en español y mantiene su comunidad diferenciada del resto: estilos de roleo asentados con los años, personajes que se reconocen entre sí y un ritmo de conversación distinto al de la mazmorra genérica. No es una copia ni un alias, es su propio espacio con su propia gente fija que vuelve noche tras noche. Quien llega nuevo puede tardar un poco en pillar el tono, pero el recibimiento suele ser bueno si se entra con respeto y ganas reales de participar.",
  },
  {
    slug: "nudismo", name: "Nudismo", kind: "tematica", icon: "☀️",
    users: 82, votes: 137, activity: "Media",
    parentSlug: "erotico", parentName: "Erótico",
    channels: ["nudismo", "chatzona"],
    related: ["erotico", "adultos", "viajes", "naturaleza", "hot"],
    intro: "Chat de nudismo y naturismo: playas nudistas, camping naturista y charla sobre vivir sin ropa sin que todo gire en torno al sexo.",
    about: "El nudismo no es lo mismo que el resto de salas de este bloque y aquí se respeta esa diferencia: se habla de playas nudistas de toda la vida, campings naturistas, la primera vez que uno se anima a probarlo y ese punto de libertad que describe quien ya lo vive con normalidad. También hay quien entra con curiosidad puramente sexual, y se le explica sin dramas que esto va de otra cosa. Conviven naturistas convencidos con curiosos que solo quieren perder la vergüenza inicial, en un ambiente que se toma en serio la parte no sexual del asunto.",
  },
  {
    slug: "sexo_casadas", name: "Sexo Casadas", kind: "tematica", icon: "💍",
    users: 121, votes: 201, tag: "Tendencia", activity: "Alta",
    parentSlug: "erotico", parentName: "Erótico",
    channels: ["sexo_casadas", "cornudos", "chatzona", "infieles"],
    related: ["infieles", "erotico", "adultos", "sexo", "ligar"],
    intro: "Canal real y propio para casadas que buscan algo fuera del matrimonio: discreción total y cero preguntas sobre por qué están aquí.",
    about: "Distinto del canal general de infieles, Sexo Casadas es su propio espacio con su propia gente: mujeres casadas que buscan algo fuera de la relación y prefieren un canal específico donde no hace falta explicar la situación cada vez. La discreción es la norma no escrita más importante: nadie pregunta por qué estás aquí, y nadie espera que des más datos de los que quieras dar. Se coquetea, se negocia el encuentro o la charla, y cada una marca su ritmo. Cero juicios sobre la decisión de buscar esto.",
  },
  {
    slug: "sexomadrid", name: "SexoMadrid", kind: "tematica", icon: "🌆",
    users: 94, votes: 156, activity: "Alta",
    parentSlug: "erotico", parentName: "Erótico",
    channels: ["sexomadrid", "chatzona"],
    related: ["erotico", "sexo", "madrid", "hot", "adultos"],
    intro: "Sexo con acento madrileño: encuentros reales en Madrid capital y alrededores, más allá de la charla puramente online.",
    about: "Mientras que las salas generales de sexo mezclan gente de cualquier ciudad, SexoMadrid apunta directamente a quien busca algo dentro de la capital: encuentros reales en Madrid y su área metropolitana, quedadas que no se quedan solo en la pantalla y planes que se pueden cerrar el mismo fin de semana. Conocer la zona ayuda: se comentan sitios, se coordina logística sin dar demasiados datos personales de golpe, y se prioriza siempre la seguridad al quedar con alguien nuevo. Local de verdad, no solo de nombre.",
  },
  {
    slug: "cornudos", name: "Cornudos", kind: "tematica", icon: "🦌",
    users: 88, votes: 146, activity: "Media",
    parentSlug: "erotico", parentName: "Erótico",
    // #parejas va junto a #cornudos porque es donde está de verdad la gente del
    // fetiche: la sala propia se llena a ratos y la de parejas sostiene la
    // conversación el resto del tiempo. (#infieles no existe en la red y lo
    // quitaba ya el saneado de canales-saneado.ts.)
    channels: ["cornudos", "parejas", "sexo_casadas", "chatzona"],
    related: ["infieles", "sexo_casadas", "erotico", "adultos", "sexo"],
    intro: "Chat cuckold en español: fantasía de compartir pareja, humillación consentida y charla sobre un fetiche que mueve más gente de la que parece.",
    about: "El fetiche cuckold —el cornudo consentido, el que disfruta viendo o sabiendo que su pareja está con otro— tiene más seguidores de los que se admiten en voz alta, y esta sala es su espacio propio. Se habla de fantasías, de parejas que ya lo practican y de curiosos que quieren entender de dónde viene esa atracción antes de decidir si es lo suyo. Hay matices dentro del propio fetiche —desde la simple fantasía hablada hasta arreglos reales entre parejas— y aquí se distinguen sin juzgar ninguno. Consentimiento y comunicación entre todos los implicados, siempre por delante.",
  },
];
