import type { Place } from "./types";

/**
 * Salas por término de búsqueda genérico, no por lugar ni por afición.
 *
 * `omegle` suma 132.712 impresiones y 15.828 clics en el corpus de la red
 * —«omegle chat» solo ya son 59.481, en posición 6,6— y `webchat` otras 63.719.
 * En ambas la red está presente y tuchat.org no.
 *
 * La de Omegle se escribe con una condición que no es negociable: **decir en la
 * primera línea que Omegle cerró**, en noviembre de 2023, y por qué. Quien busca
 * «omegle» hoy casi siempre no lo sabe, así que contárselo es lo único útil que
 * se le puede ofrecer; y montar el «nuevo Omegle sin normas» sobre un sitio que
 * cerró por abusos sería, además de indecente, mal negocio. Un test lo exige.
 */
export const TOPICS_TERMINOS: Place[] = [
  {
    slug: "omegle",
    name: "Omegle",
    kind: "tematica",
    icon: "🎲",
    users: 231,
    votes: 296,
    activity: "Alta",
    parentSlug: "amistad",
    parentName: "Amistad",
    channels: ["chat", "conocer-gente", "amistad", "chatzona"],
    related: ["desconocidos", "amistad", "sin-registro", "latinos", "webchat"],
    intro:
      "Omegle cerró el 8 de noviembre de 2023, después de catorce años. Esto es lo que queda para hablar con desconocidos en español.",
    aboutTitle: "Omegle cerró en 2023: qué hay ahora en español",
    about:
      "Conviene empezar por el dato, porque mucha gente llega buscando Omegle sin saberlo: cerró el 8 de noviembre de 2023, tras catorce años funcionando. Lo anunció su fundador, Leif K-Brooks, en una carta donde escribió que mantenerlo ya no era sostenible «ni financiera ni psicológicamente», en medio de denuncias por abusos y por el uso de la plataforma contra menores. No fue una retirada elegante, y merece la pena decirlo entero. Lo que la gente buscaba allí —ponerse a hablar con alguien al azar, sin cuenta ni perfil— sigue existiendo, y es lo que hay aquí: se entra escribiendo un apodo y se cae en una sala con gente que ya está conversando. La diferencia principal es que esto no es una ruleta de vídeo con desconocidos anónimos, sino salas de texto con moderación y con normas, que es precisamente lo que a Omegle le faltó. Si buscas conversación en español a cualquier hora, la sala de desconocidos y la de amistad son el punto de partida.",
  },
  {
    slug: "webchat",
    name: "Webchat",
    kind: "tematica",
    icon: "💬",
    users: 248,
    votes: 314,
    activity: "Alta",
    parentSlug: "amistad",
    parentName: "Amistad",
    channels: ["chat", "amistad", "chatzona"],
    related: ["amistad", "desconocidos", "sin-registro", "latinos", "omegle"],
    intro:
      "Un webchat es un chat que funciona en el navegador, sin instalar nada. Este conecta con los canales de IRC de siempre, donde está la gente.",
    aboutTitle: "Chat en el navegador, sin instalar el cliente",
    about:
      "Webchat es, literalmente, un chat que corre dentro del navegador: no hay programa que instalar ni cuenta que crear, se escribe un apodo y se entra. La palabra viene de los años en que para chatear hacía falta un cliente de IRC instalado en el ordenador —mIRC y compañía—, y los primeros webchats fueron justamente puentes para entrar a esas mismas redes desde una página web. Eso es lo que sigue siendo este: las salas de aquí no son un invento aislado, sino canales de IRC con años de gente dentro, y por eso a cualquier hora hay conversación en marcha y no un chat vacío esperando a que llegue alguien. Funciona igual en el móvil que en el ordenador, sin aplicación de por medio, y si cierras la pestaña y vuelves, la conversación sigue donde estaba, porque no depende de que tú estés conectado. Quien venía de mIRC reconocerá los nombres de los canales; quien no ha usado IRC en su vida no necesita saber nada de esto para entrar.",
  },
  {
    slug: "irc",
    name: "IRC",
    kind: "tematica",
    icon: "🖥️",
    users: 197,
    votes: 268,
    activity: "Media",
    parentSlug: "amistad",
    parentName: "Amistad",
    channels: ["chat", "amistad", "chatzona"],
    related: ["webchat", "amistad", "desconocidos", "sin-registro", "latinos"],
    intro:
      "El protocolo cumple casi cuarenta años y sigue en pie. Las salas de aquí son canales de IRC de verdad, no una imitación con otro nombre.",
    aboutTitle: "Agosto de 1988, Finlandia, y la almohadilla del canal",
    about:
      "IRC lo escribió Jarkko Oikarinen en agosto de 1988, en la Universidad de Oulu, para sustituir un programa de charla del BBS de la casa. Empezó en un solo servidor finlandés; en noviembre ya se había extendido por Internet y a mediados de 1989 andaban por los cuarenta servidores repartidos por el mundo. De ahí viene la almohadilla que llevan los canales delante del nombre, que casi nadie relaciona ya con nada y que sigue significando exactamente lo mismo. Lo que lo distingue de la mensajería a la que estamos acostumbrados es que no hay que agregar a nadie: se entra en un canal y ahí está la gente, hablando entre sí sin haberse pedido permiso previo. Estas salas son canales reales de una red que lleva décadas funcionando, y por eso a las cuatro de la tarde de un martes hay conversación. Quien viene de mIRC puede seguir usándolo si quiere; quien no ha oído hablar de esto en su vida entra por el navegador, escribe un apodo y no necesita saber nada más.",
  },
];
